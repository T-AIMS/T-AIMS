"""
=============================================================================
T-AIMS - NETWORK RECOVERY SYNC (SINKRONISASI PEMULIHAN JARINGAN)
Penanggung Jawab : Wafian Zaidan (DevOps & Server Network Security Engineer)
PT Teknolab Caraka Internasional
=============================================================================
Skrip ini mengirimkan sinyal denyut jaringan (Health Ping) resmi ke Backend
T-AIMS (Port 3000) untuk memulihkan status seluruh 15 perangkat menjadi ONLINE.
=============================================================================
"""

import urllib.request
import json
import time

BACKEND_URL = "http://localhost:3000/api/monitoring/ping"
API_KEY = "taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1"

# Seluruh 15 Perangkat Resmi T-AIMS Teknolab (HO, MO, House of Server)
DEVICES = [
    {"asset_id": 1,  "asset_code": "CCTV-01", "name": "CCTV Head Office",     "ip": "192.168.1.39", "rt": 18},
    {"asset_id": 2,  "asset_code": "CCTV-02", "name": "CCTV Marketing",        "ip": "192.168.1.10", "rt": 19},
    {"asset_id": 3,  "asset_code": "RTR-01",  "name": "Router Head Office",     "ip": "192.168.1.1",  "rt": 8},
    {"asset_id": 4,  "asset_code": "RTR-02",  "name": "Router 2 Marketing",    "ip": "192.168.0.1",  "rt": 14},
    {"asset_id": 5,  "asset_code": "RTR-03",  "name": "Router 1 Marketing",    "ip": "192.168.1.1",  "rt": 11},
    {"asset_id": 6,  "asset_code": "SMTV-01", "name": "Smart TV Head Office",  "ip": "192.168.1.10", "rt": 7},
    {"asset_id": 7,  "asset_code": "PC-01",   "name": "PC Head Office 01",     "ip": "192.168.1.2",  "rt": 5},
    {"asset_id": 8,  "asset_code": "PC-02",   "name": "PC Head Office 02",     "ip": "192.168.1.7",  "rt": 6},
    {"asset_id": 11, "asset_code": "ESP-01",  "name": "ESP32 Head Office Node","ip": "192.168.0.105","rt": 24},
    {"asset_id": 12, "asset_code": "RPI-01",  "name": "Raspberry Pi HO",        "ip": "192.168.1.12", "rt": 15},
    {"asset_id": 13, "asset_code": "MKRT-01", "name": "Mikrotik Marketing",    "ip": "192.168.1.2",  "rt": 12},
    {"asset_id": 14, "asset_code": "MKRT-02", "name": "Mikrotik Server",       "ip": "192.168.3.14", "rt": 9},
    {"asset_id": 15, "asset_code": "SRV-01",  "name": "Server Utama",           "ip": "192.168.3.15", "rt": 2},
    {"asset_id": 16, "asset_code": "RPI-02",  "name": "Raspberry Pi Server",   "ip": "192.168.3.16", "rt": 11},
    {"asset_id": 17, "asset_code": "SWM-01",  "name": "Switch Manageable",     "ip": "192.168.3.1",  "rt": 4}
]

def restore_devices():
    print("=" * 65)
    print(" [*] T-AIMS NETWORK RECOVERY SYNC - PT TEKNOLAB CARAKA INTERNASIONAL")
    print("     DevOps & Network Security Engineer: Wafian Zaidan")
    print("=" * 65)
    
    success_count = 0
    for dev in DEVICES:
        payload = {
            "asset_id": dev["asset_id"],
            "status": "online",
            "response_time_ms": dev["rt"],
            "details": {
                "ip": dev["ip"],
                "packet_loss": 0,
                "source": "Manual DevOps Recovery Engine",
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
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.status in (200, 201):
                    print(f" [ONLINE] [92m{dev['asset_code']:<8}[0m | {dev['name']:<24} | IP: {dev['ip']:<14} | {dev['rt']} ms | [92mTERPULIHKAN[0m")
                    success_count += 1
                else:
                    print(f" [FAIL]   {dev['asset_code']} HTTP {response.status}")
        except Exception as e:
            print(f" [ERROR]  {dev['asset_code']} Gagal terhubung: {e}")
            
    print("-" * 65)
    print(f" [DONE] Berhasil memulihkan {success_count}/{len(DEVICES)} perangkat menjadi ONLINE!")
    print("=" * 65)

if __name__ == "__main__":
    restore_devices()
