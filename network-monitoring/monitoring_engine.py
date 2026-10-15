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

# Konfigurasi Backend API
BACKEND_URL = "http://172.19.112.1:3000/api"
AUTH_EMAIL = "reza.fahmi@taims_db.local"
AUTH_PASSWORD = "password123"

# Token awal hasil login
cached_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJlbWFpbCI6InJlemEuZmFobWlAdGFpbXNfZGIubG9jYWwiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3OTIwMzY3OTYsImV4cCI6MTc5MjEyMzE5Nn0.7xS2uenk9LKO33e2Wq5KYvZj4szsdbXm7n6pwiLYaw8"


# ==========================================
# FUNGSI AUTO-AUTH & BACKEND API (WAFIAN)
# ==========================================

def get_auth_token():
    """Fungsi auto-login untuk refresh token jika expired."""
    global cached_token
    try:
        res = requests.post(
            f"{BACKEND_URL}/auth/login",
            json={"email": AUTH_EMAIL, "password": AUTH_PASSWORD},
            timeout=5
        )
        if res.status_code == 200:
            cached_token = res.json().get("data", {}).get("token")
            return cached_token
    except Exception as e:
        print(f"[!] Gagal auto-login backend: {e}")
    return cached_token


def send_to_backend(device_name, status, response_time_ms):
    """Kirim hasil monitoring per device ke Backend API T-AIMS."""
    global cached_token
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
        "Authorization": f"Bearer {cached_token}"
    }

    try:
        resp = requests.post(f"{BACKEND_URL}/monitoring/ping", json=payload, headers=headers, timeout=5)
        # Jika token expired (401), ambil token baru dan coba lagi sekali
        if resp.status_code in [401, 403]:
            new_token = get_auth_token()
            if new_token:
                headers["Authorization"] = f"Bearer {new_token}"
                resp = requests.post(f"{BACKEND_URL}/monitoring/ping", json=payload, headers=headers, timeout=5)

        return resp.status_code in [200, 201]
    except Exception as e:
        print(f"[!] Error kirim backend ({device_name}): {e}")
        return False


# ==========================================
# FUNGSI PING (CROSS-PLATFORM LINUX & WINDOWS)
# ==========================================

def check_device(ip):
    start_time = time.perf_counter()
    is_windows = platform.system().lower() == "windows"

    # Perintah ping adaptif sesuai OS
    if is_windows:
        cmd = ["ping", "-n", "1", "-w", "2000", ip]
    else:
        cmd = ["ping", "-c", "1", "-W", "2", ip]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=4
        )

        elapsed_ms = round(
            (time.perf_counter() - start_time) * 1000,
            2
        )

        # Deteksi balasan ping sukses
        stdout_upper = result.stdout.upper()
        if result.returncode == 0 and ("TTL=" in stdout_upper or "BYTES FROM" in stdout_upper):
            status = "ONLINE"
            response_time_ms = elapsed_ms
        else:
            status = "OFFLINE"
            response_time_ms = None

    except subprocess.TimeoutExpired:
        status = "OFFLINE"
        response_time_ms = None

    except Exception as error:
        status = "ERROR"
        response_time_ms = None
        print(f"Kesalahan saat memeriksa {ip}: {error}")

    return status, response_time_ms


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
