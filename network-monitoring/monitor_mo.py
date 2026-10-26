"""
=============================================================================
T-AIMS - SCRIPT MONITORING PERANGKAT FISIK MARKETING OFFICE (MO)
PT Teknolab Caraka Internasional
=============================================================================
Script ini melakukan ICMP Ping nyata ke 4 perangkat fisik Marketing Office (MO)
sesuai spesifikasi resmi Dzakwan:
  1. Router 1 MO (RTR-03) : 192.168.1.1 | MAC: A0:E0:6D:35:F5:90
  2. Mikrotik MO (MKRT-01): 192.168.1.2 | MAC: 08:55:31:70:AB:4D
  3. CCTV MO     (CCTV-02): 192.168.1.3 | MAC: 98:A8:29:01:FA:D2
  4. Router 2 MO (RTR-02) : 192.168.0.1 | MAC: 74:DA:88:D9:0B:74

Cara Menjalankan:
    python monitor_mo.py
=============================================================================
"""

import subprocess
import requests
import time
import re
import sys
from datetime import datetime

# URL Backend T-AIMS & API Key
BACKEND_URL = "http://localhost:3000/api/monitoring/ping"
API_KEY = "taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1"
INTERVAL_SECONDS = 10

# 5 Perangkat Fisik Marketing Office (MO) Resmi Termasuk ESP32 Asli
DEVICES = [
    {
        "asset_id": 5,
        "asset_code": "RTR-03",
        "name": "Router 1 Marketing",
        "ip": "192.168.1.1",
        "mac": "A0:E0:6D:35:F5:90"
    },
    {
        "asset_id": 13,
        "asset_code": "MKRT-01",
        "name": "Mikrotik Marketing",
        "ip": "192.168.1.2",
        "mac": "08:55:31:70:AB:4D"
    },
    {
        "asset_id": 2,
        "asset_code": "CCTV-02",
        "name": "CCTV Marketing",
        "ip": "192.168.1.8",
        "mac": "98:A8:29:01:FA:D2"
    },
    {
        "asset_id": 4,
        "asset_code": "RTR-02",
        "name": "Router 2 Marketing",
        "ip": "192.168.0.1",
        "mac": "74:DA:88:D9:0B:74"
    },
    {
        "asset_id": 11,
        "asset_code": "ESP-01",
        "name": "ESP32 Marketing Node",
        "ip": "192.168.0.105",
        "mac": "ESP32-PHYSICAL"
    }
]

def ping_device(ip):
    """Kirim 1 paket ICMP Ping ke perangkat fisik nyata."""
    try:
        res = subprocess.run(
            ["ping", "-n", "1", "-w", "2000", ip],
            capture_output=True,
            text=True
        )
        output = res.stdout or ""
        is_online = "TTL=" in output.upper()

        latency_ms = 1
        if is_online:
            match = re.search(r"(?:time|waktu)[<=](\d+)ms", output, re.IGNORECASE)
            if match:
                latency_ms = int(match.group(1))
            else:
                latency_ms = 1

        return is_online, latency_ms
    except Exception as e:
        return False, 0

def send_to_backend(asset_id, asset_code, status, latency_ms, ip):
    """Kirim hasil monitoring ke Backend REST API T-AIMS."""
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    payload = {
        "asset_id": asset_id,
        "status": status,
        "response_time_ms": latency_ms,
        "details": {
            "ip": ip,
            "packet_loss": 0 if status == "online" else 100,
            "source": "Marketing Office Local Ping Engine",
            "device_code": asset_code
        }
    }

    try:
        res = requests.post(BACKEND_URL, json=payload, headers=headers, timeout=5)
        return res.status_code == 201 or res.status_code == 200
    except requests.exceptions.ConnectionError:
        return None  # Backend belum aktif
    except Exception as e:
        return False

def main():
    print("=" * 75)
    print("   [+] T-AIMS REAL MARKETING OFFICE (MO) HARDWARE MONITORING")
    print("   Lead Superadmin : Dzakwan Miftahussobirin")
    print("=" * 75)
    print(f">> Target Backend : {BACKEND_URL}")
    print(f">> Interval Cek   : Setiap {INTERVAL_SECONDS} Detik")
    print(f">> Total Perangkat: 4 Unit Fisik Marketing Office (MO)")
    print("-" * 75)

    loop_count = 1
    try:
        while True:
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"\n[Siklus #{loop_count}] Pemantauan 4 Perangkat MO pada {now_str}:")

            online_count = 0
            for dev in DEVICES:
                is_online, latency = ping_device(dev["ip"])
                status = "online" if is_online else "offline"
                if is_online:
                    online_count += 1

                # Kirim ke backend
                api_ok = send_to_backend(dev["asset_id"], dev["asset_code"], status, latency, dev["ip"])

                status_tag = "[ONLINE] " if is_online else "[OFFLINE]"
                if api_ok is True:
                    api_tag = "(Tersimpan di DB T-AIMS)"
                elif api_ok is None:
                    api_tag = "(Backend Port 3000 Siaga)"
                else:
                    api_tag = "(Gagal simpan ke DB)"

                print(f"  {status_tag} | {dev['asset_code']:<8} | {dev['name']:<22} | {dev['ip']:<15} | Latency: {latency:>3} ms | {api_tag}")

            print(f">> Ringkasan: {online_count}/{len(DEVICES)} Perangkat MO Aktif.")
            print(f">> Menunggu {INTERVAL_SECONDS} detik... (Tekan Ctrl+C untuk berhenti)")
            
            # Jika dijalankan sekali dalam testing:
            if "--once" in sys.argv:
                break

            loop_count += 1
            time.sleep(INTERVAL_SECONDS)

    except KeyboardInterrupt:
        print("\n\n[INFO] Monitoring dihentikan. Sampai jumpa!")
        sys.exit(0)

if __name__ == "__main__":
    main()
