import subprocess
import time
import csv
import os
import platform
import requests
from datetime import datetime

# ==========================================
# KONFIGURASI MONITORING ENGINE
# ==========================================

# Daftar 9 perangkat menggunakan IP dummy (menunggu hasil survei fisik Ananda)
DEVICES = {
    "Router 1 (DUMMY)": "192.168.1.1",
    "Router 2 (DUMMY)": "192.168.1.2",
    "Router 3 (DUMMY)": "192.168.1.3",
    "PC Kantor (DUMMY)": "192.168.1.10",
    "TV (DUMMY)": "192.168.1.20",
    "CCTV (DUMMY)": "192.168.1.30",
    "Server (DUMMY)": "192.168.1.40",
    "Access Point (DUMMY)": "192.168.1.50",
    "Printer Jaringan (DUMMY)": "192.168.1.60",
}

# Pemetaan Nama Device Dummy ke asset_id di database taims_db
ASSET_MAP = {
    "Router 1 (DUMMY)": 23,        # Router Utama MikroTik RB4011
    "Router 2 (DUMMY)": 16,        # Router Marketing Office
    "Router 3 (DUMMY)": 8,         # Firewall & Gateway pfSense
    "PC Kantor (DUMMY)": 20,       # PC Head Office 01
    "TV (DUMMY)": 19,              # Smart TV Xiaomi Head Office
    "CCTV (DUMMY)": 17,            # CCTV Head Office
    "Server (DUMMY)": 7,           # Server Monitoring T-AIMS Ubuntu
    "Access Point (DUMMY)": 5,     # Access Point Lab Utama UniFi U6-Lite
    "Printer Jaringan (DUMMY)": 10 # NAS Backup Synology DS220+
}

# Jeda sebelum pemeriksaan berikutnya (detik)
INTERVAL = 10

# Nama file CSV untuk menyimpan hasil monitoring lokal
LOG_FILE = "monitoring_logs.csv"

# Konfigurasi Backend API & Device API Key (Wafian & Ananda)
BACKEND_URL = os.getenv("BACKEND_URL", "http://127.0.0.1:3000/api")
DEVICE_API_KEY = os.getenv("DEVICE_API_KEY", "taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1")

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', '')
DB_NAME = os.getenv('DB_NAME', 'taims_db')


# ==========================================
# FUNGSI PENGIRIMAN TELEMETRI KE BACKEND (WAFIAN)
# ==========================================

def send_to_backend(device_name, status, response_time_ms):
    """Kirim hasil monitoring per device ke Backend API T-AIMS via X-API-Key."""
    asset_id = ASSET_MAP.get(device_name)
    if not asset_id:
        return False

    payload = {
        "asset_id": asset_id,
        "status": status.lower(),
        "response_time_ms": response_time_ms or 0,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    }

    headers = {
        "Content-Type": "application/json",
        "X-API-Key": DEVICE_API_KEY
    }

    try:
        resp = requests.post(f"{BACKEND_URL}/monitoring/ping", json=payload, headers=headers, timeout=5)
        return resp.status_code in [200, 201]
    except Exception as e:
        print(f"[!] Error kirim backend ({device_name}): {e}")
        return False


# ==========================================
# FUNGSI PING (CROSS-PLATFORM LINUX & WINDOWS)
# ==========================================

def check_device(ip, retries=3, delay=1):
    is_windows = platform.system().lower() == "windows"

    # Perintah ping adaptif sesuai OS
    if is_windows:
        cmd = ["ping", "-n", "1", "-w", "1500", ip]
    else:
        cmd = ["ping", "-c", "1", "-W", "1", ip]

    for attempt in range(1, retries + 1):
        start_time = time.perf_counter()
        print(f"  [+] Percobaan {attempt}/{retries} memeriksa {ip}...")

        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=2.5
            )

            elapsed_ms = round(
                (time.perf_counter() - start_time) * 1000,
                2
            )

            # Deteksi balasan ping sukses
            stdout_upper = result.stdout.upper()
            if result.returncode == 0 and ("TTL=" in stdout_upper or "BYTES FROM" in stdout_upper):
                print(f"  [✓] Percobaan {attempt} berhasil: ONLINE ({elapsed_ms} ms)")
                return "ONLINE", elapsed_ms

        except subprocess.TimeoutExpired:
            print(f"  [-] Percobaan {attempt} batas waktu (timeout)")
        except Exception as error:
            print(f"  [!] Percobaan {attempt} error: {error}")

        if attempt < retries:
            time.sleep(delay)

    print(f"  [x] Seluruh {retries} percobaan gagal -> OFFLINE")
    return "OFFLINE", None


# ==========================================
# FUNGSI MENYIMPAN LOG KE CSV
# ==========================================

def save_log(timestamp, device_name, ip, status, response_time_ms):
    file_exists = os.path.exists(LOG_FILE)

    with open(LOG_FILE, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)

        if not file_exists or os.path.getsize(LOG_FILE) == 0:
            writer.writerow([
                "timestamp",
                "device_name",
                "ip_address",
                "status",
                "response_time_ms"
            ])

        writer.writerow([
            timestamp,
            device_name,
            ip,
            status,
            response_time_ms if response_time_ms is not None else ""
        ])


# ==========================================
# PROGRAM UTAMA
# ==========================================

def main():
    print("=" * 65)
    print("       NETWORK & DEVICE MONITORING ENGINE (T-AIMS)")
    print("=" * 65)
    print(f"Backend Target  : {BACKEND_URL}")
    print("Tekan CTRL + C untuk menghentikan monitoring.\n")

    try:
        while True:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            print(f"\nWaktu pemeriksaan: {timestamp}")
            print("-" * 65)
            print(f"{'NAMA PERANGKAT':25} {'IP ADDRESS':18} {'STATUS':10} {'RESPONSE'}")
            print("-" * 65)

            for device_name, ip in DEVICES.items():
                status, response_time_ms = check_device(ip)

                if response_time_ms is not None:
                    response = f"{response_time_ms} ms"
                else:
                    response = "-"

                print(
                    f"{device_name:25} "
                    f"{ip:18} "
                    f"{status:10} "
                    f"{response}"
                )

                # 1. Simpan ke CSV lokal
                save_log(
                    timestamp,
                    device_name,
                    ip,
                    status,
                    response_time_ms
                )

                # 2. Kirim ke Database via Backend API
                send_to_backend(
                    device_name,
                    status,
                    response_time_ms
                )

            print("-" * 65)
            print(f"Log lokal : {os.path.abspath(LOG_FILE)}")
            print(f"Database  : Sinkron ke Backend ({BACKEND_URL})")
            print(f"Pemeriksaan berikutnya dalam {INTERVAL} detik.")

            time.sleep(INTERVAL)

    except KeyboardInterrupt:
        print("\nMonitoring dihentikan oleh pengguna.")
        print("Data hasil pemeriksaan tetap tersimpan di file log dan database.")


if __name__ == "__main__":
    main()
