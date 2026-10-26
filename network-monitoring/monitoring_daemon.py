#!/usr/bin/env python3
"""
=============================================================================
T-AIMS - REAL-TIME ICMP MONITORING DAEMON (CONCURRENT ENGINE)
Penanggung Jawab : Wafian Zaidan (DevOps & Server Network Security Engineer)
PT Teknolab Caraka Internasional
=============================================================================
Daemon ini melakukan ICMP Ping nyata secara simultan/paralel (ThreadPool)
ke seluruh perangkat:
  - Jika perangkat merespons ping fisik di jaringan -> Status: ONLINE (dengan latensi riil)
  - Jika perangkat tidak merespons (unreachable)     -> Status: OFFLINE
Perangkat dimuat secara dinamis dari database MySQL taims_db sehingga aset
yang baru ditambahkan otomatis langsung termonitor tanpa restart daemon.
=============================================================================
"""

import subprocess
import urllib.request
import json
import time
import re
import sys
import os
from concurrent.futures import ThreadPoolExecutor

BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:3000/api/monitoring/ping")
API_KEY = os.environ.get("DEVICE_API_KEY", "taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1")
INTERVAL_SECONDS = int(os.environ.get("MONITORING_INTERVAL", "10"))

DB_HOST = os.environ.get("DB_HOST", "mysql")
DB_PORT = int(os.environ.get("DB_PORT", "3306"))
DB_USER = os.environ.get("DB_USER", "root")
DB_PASS = os.environ.get("DB_PASS", "root_taims_2026")
DB_NAME = os.environ.get("DB_NAME", "taims_db")

FALLBACK_DEVICES = [
    {"asset_id": 1,  "asset_code": "CCTV-01", "name": "CCTV Head Office",     "ip": "192.168.1.39"},
    {"asset_id": 2,  "asset_code": "CCTV-02", "name": "CCTV Marketing",        "ip": "192.168.1.8"},
    {"asset_id": 3,  "asset_code": "RTR-01",  "name": "Router Head Office",     "ip": "192.168.1.1"},
    {"asset_id": 4,  "asset_code": "RTR-02",  "name": "Router 2 Marketing",    "ip": "192.168.0.1"},
    {"asset_id": 5,  "asset_code": "RTR-03",  "name": "Router 1 Marketing",    "ip": "192.168.1.1"},
    {"asset_id": 6,  "asset_code": "SMTV-01", "name": "Smart TV Head Office",  "ip": "192.168.1.10"},
    {"asset_id": 7,  "asset_code": "PC-01",   "name": "PC Head Office 01",     "ip": "192.168.1.2"},
    {"asset_id": 8,  "asset_code": "PC-02",   "name": "PC Head Office 02",     "ip": "192.168.1.7"},
    {"asset_id": 11, "asset_code": "ESP-01",  "name": "ESP32 Head Office Node","ip": "192.168.0.105"},
    {"asset_id": 12, "asset_code": "RPI-01",  "name": "Raspberry Pi Head Office","ip": "192.168.1.12"},
    {"asset_id": 13, "asset_code": "MKRT-01", "name": "Mikrotik Marketing",    "ip": "192.168.1.2"},
    {"asset_id": 14, "asset_code": "MKRT-02", "name": "Mikrotik Server",       "ip": "192.168.3.14"},
    {"asset_id": 15, "asset_code": "SRV-01",  "name": "Server Utama",           "ip": "192.168.3.15"},
    {"asset_id": 16, "asset_code": "RPI-02",  "name": "Raspberry Pi Server",   "ip": "192.168.3.16"},
    {"asset_id": 17, "asset_code": "SWM-01",  "name": "Switch Manageable",     "ip": "192.168.3.1"}
]

def get_current_devices():
    """Mengambil daftar seluruh perangkat secara dinamis dari database MySQL"""
    # 1. Coba koneksi langsung via pymysql (di dalam container Docker)
    try:
        import pymysql
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            connect_timeout=3
        )
        with conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT asset_id, asset_code, asset_name, ip_address FROM assets WHERE ip_address IS NOT NULL AND ip_address != '';")
                rows = cursor.fetchall()
                if rows:
                    return [
                        {
                            "asset_id": r["asset_id"],
                            "asset_code": r["asset_code"],
                            "name": r["asset_name"],
                            "ip": r["ip_address"]
                        }
                        for r in rows
                    ]
    except Exception:
        pass

    # 2. Coba via docker exec jika dijalankan langsung di host machine
    try:
        cmd = [
            "docker", "exec", "taims-mysql", "mysql",
            f"-u{DB_USER}", f"-p{DB_PASS}", "-N",
            "-e", f"USE {DB_NAME}; SELECT asset_id, asset_code, asset_name, ip_address FROM assets WHERE ip_address IS NOT NULL AND ip_address != '';"
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=4)
        if res.returncode == 0 and res.stdout.strip():
            devices = []
            for line in res.stdout.strip().split("\n"):
                parts = line.split("\t")
                if len(parts) >= 4:
                    devices.append({
                        "asset_id": int(parts[0]),
                        "asset_code": parts[1].strip(),
                        "name": parts[2].strip(),
                        "ip": parts[3].strip()
                    })
            if devices:
                return devices
    except Exception:
        pass

    # 3. Fallback default
    return FALLBACK_DEVICES

def ping_ip(ip):
    """Lakukan ICMP Ping nyata (timeout 1 detik)"""
    try:
        cmd = ["ping", "-c", "1", "-W", "1", ip]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=2)
        out = res.stdout or ""
        if res.returncode == 0:
            match = re.search(r"time=([\d\.]+)\s*ms", out)
            lat = float(match.group(1)) if match else 2.0
            return True, round(lat, 2)
        return False, 0.0
    except Exception:
        return False, 0.0

def send_ping_to_backend(dev, is_online, latency):
    status = "online" if is_online else "offline"
    payload = {
        "asset_id": dev["asset_id"],
        "status": status,
        "response_time_ms": latency if is_online else 0,
        "details": {
            "ip": dev["ip"],
            "packet_loss": 0 if is_online else 100,
            "source": "Real-Time ICMP Engine",
            "device_code": dev["asset_code"]
        }
    }
    
    req = urllib.request.Request(
        BACKEND_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            "Content-Type": "application/json",
            "X-API-Key": API_KEY
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=4) as response:
            return response.status in (200, 201)
    except Exception:
        return False

def check_and_report_device(dev):
    is_live, lat = ping_ip(dev["ip"])
    send_ping_to_backend(dev, is_live, lat)
    return is_live

def run_loop():
    print(f"[*] T-AIMS Real-Time Concurrent ICMP Engine AKTIF (Interval: {INTERVAL_SECONDS}s)")
    sys.stdout.flush()
    while True:
        devices = get_current_devices()
        with ThreadPoolExecutor(max_workers=10) as executor:
            results = list(executor.map(check_and_report_device, devices))
        
        online_count = sum(1 for r in results if r)
        offline_count = len(devices) - online_count
        now_str = time.strftime('%H:%M:%S')
        print(f"[CYCLE {now_str}] Hasil Ping: {online_count} Online, {offline_count} Offline (Total {len(devices)} Perangkat)")
        sys.stdout.flush()
        time.sleep(INTERVAL_SECONDS)

if __name__ == "__main__":
    run_loop()
