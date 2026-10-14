#!/usr/bin/env python3
"""
=====================================================================
T-AIMS MASTER HEALTH CHECKER
=====================================================================
Nama File   : verify_integration.py
Dibuat Oleh : Dzakwan (Shift Lead & System Integration)
Untuk       : Tim Shift 2 - T-AIMS PKL Teknolab
Tanggal     : 14 Oktober 2026
Versi       : v1.2 (revisi: login JWT + fix endpoint)
Deskripsi   : Script untuk memverifikasi seluruh titik integrasi T-AIMS
              di localhost. Cek port, HTTP endpoint, MQTT, Database.
=====================================================================
"""

import socket
import requests
import sys
from datetime import datetime

# =====================================================================
# KONFIGURASI - SESUAIKAN DENGAN ENVIRONMENT LOKAL
# IP Windows dari WSL: cek dengan `ip route | grep default`
# =====================================================================
WINDOWS_HOST = "172.19.112.1"
LOGIN_EMAIL = "reza.fahmi@taims_db.local"
LOGIN_PASSWORD = "password123"

CONFIG = {
    "BACKEND_HOST": WINDOWS_HOST,
    "BACKEND_PORT": 3000,
    "FRONTEND_HOST": WINDOWS_HOST,
    "FRONTEND_PORT": 3001,
    "MQTT_HOST": "localhost",
    "MQTT_PORT": 1883,
    "DB_HOST": WINDOWS_HOST,
    "DB_PORT": 3306,
    "N8N_HOST": "localhost",
    "N8N_PORT": 5678,
    "BACKEND_API_BASE": f"http://{WINDOWS_HOST}:3000/api",
    "HTTP_TIMEOUT": 5,
    "TCP_TIMEOUT": 3,
}

# Warna untuk output terminal
class Color:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

# =====================================================================
# FUNGSI UTILITAS
# =====================================================================
def print_header(title: str):
    print(f"\n{Color.BOLD}{Color.CYAN}{'='*70}{Color.END}")
    print(f"{Color.BOLD}{Color.CYAN}  {title}{Color.END}")
    print(f"{Color.BOLD}{Color.CYAN}{'='*70}{Color.END}")

def print_result(name: str, status: str, detail: str = ""):
    if status == "OK":
        icon = f"{Color.GREEN}[OK]{Color.END}"
        status_text = f"{Color.GREEN}OK{Color.END}"
    elif status == "FAIL":
        icon = f"{Color.RED}[FAIL]{Color.END}"
        status_text = f"{Color.RED}FAIL{Color.END}"
    elif status == "WARN":
        icon = f"{Color.YELLOW}[WARN]{Color.END}"
        status_text = f"{Color.YELLOW}WARN{Color.END}"
    else:
        icon = f"{Color.BLUE}[INFO]{Color.END}"
        status_text = f"{Color.BLUE}{status}{Color.END}"

    line = f"  {icon} {name:<45} [{status_text}]"
    if detail:
        line += f"  {Color.CYAN}{detail}{Color.END}"
    print(line)

# =====================================================================
# FUNGSI PENGECEKAN
# =====================================================================
def check_tcp_port(host: str, port: int, service_name: str) -> bool:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(CONFIG["TCP_TIMEOUT"])
        result = sock.connect_ex((host, port))
        sock.close()
        if result == 0:
            print_result(f"{service_name} ({host}:{port})", "OK", "Port terbuka")
            return True
        else:
            print_result(f"{service_name} ({host}:{port})", "FAIL", "Port tertutup")
            return False
    except Exception as e:
        print_result(f"{service_name} ({host}:{port})", "FAIL", str(e)[:50])
        return False

def check_http_endpoint(url: str, endpoint_name: str, expected_status: int = 200, headers: dict = None) -> bool:
    try:
        response = requests.get(url, timeout=CONFIG["HTTP_TIMEOUT"], headers=headers or {}, allow_redirects=True)
        if response.status_code == expected_status:
            print_result(f"{endpoint_name}", "OK", f"HTTP {response.status_code}")
            return True
        else:
            print_result(f"{endpoint_name}", "WARN", f"HTTP {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print_result(f"{endpoint_name}", "FAIL", "Connection refused")
        return False
    except requests.exceptions.Timeout:
        print_result(f"{endpoint_name}", "FAIL", "Timeout")
        return False
    except Exception as e:
        print_result(f"{endpoint_name}", "FAIL", str(e)[:50])
        return False

def login_and_get_token() -> str:
    """Login untuk dapat JWT token."""
    try:
        response = requests.post(
            f"{CONFIG['BACKEND_API_BASE']}/auth/login",
            json={"email": LOGIN_EMAIL, "password": LOGIN_PASSWORD},
            timeout=CONFIG["HTTP_TIMEOUT"]
        )
        if response.status_code == 200:
            data = response.json()
            token = data.get("data", {}).get("token", "")
            if token:
                print_result("Login JWT", "OK", f"Token didapat ({token[:20]}...)")
                return token
        print_result("Login JWT", "FAIL", f"HTTP {response.status_code}")
        return None
    except Exception as e:
        print_result("Login JWT", "FAIL", str(e)[:50])
        return None

def check_database_via_backend(headers: dict) -> bool:
    try:
        response = requests.get(
            f"{CONFIG['BACKEND_API_BASE']}/assets",
            timeout=CONFIG["HTTP_TIMEOUT"],
            headers=headers
        )
        if response.status_code == 200:
            data = response.json()
            total = data.get("total", len(data.get("data", []))) if isinstance(data, dict) else len(data)
            print_result("Database via API /assets", "OK", f"{total} aset ditemukan")
            return True
        else:
            print_result("Database via API /assets", "WARN", f"HTTP {response.status_code}")
            return False
    except Exception as e:
        print_result("Database via API /assets", "FAIL", str(e)[:50])
        return False

# =====================================================================
# MAIN FUNCTION
# =====================================================================
def main():
    print_header("T-AIMS MASTER HEALTH CHECKER v1.2")
    print(f"  {Color.CYAN}Waktu Pengecekan : {datetime.now().strftime('%Y-%m-%d %H:%M:%S WIB')}{Color.END}")
    print(f"  {Color.CYAN}Dijalankan Oleh  : Dzakwan (Shift Lead & System Integration){Color.END}")
    print(f"  {Color.CYAN}WINDOWS_HOST     : {WINDOWS_HOST}{Color.END}")

    results = {"total": 0, "ok": 0, "fail": 0, "warn": 0}

    # BLOK 1: CEK PORT TCP
    print_header("BLOK 1 - CEK PORT TCP (SOCKET)")
    ports_to_check = [
        (CONFIG["DB_HOST"], CONFIG["DB_PORT"], "MySQL Database"),
        (CONFIG["MQTT_HOST"], CONFIG["MQTT_PORT"], "MQTT Broker Mosquitto"),
        (CONFIG["BACKEND_HOST"], CONFIG["BACKEND_PORT"], "Backend API Express"),
        (CONFIG["FRONTEND_HOST"], CONFIG["FRONTEND_PORT"], "Frontend Dashboard"),
        (CONFIG["N8N_HOST"], CONFIG["N8N_PORT"], "n8n Automation"),
    ]
    for host, port, name in ports_to_check:
        results["total"] += 1
        if check_tcp_port(host, port, name):
            results["ok"] += 1
        else:
            results["fail"] += 1

    # BLOK 2: LOGIN & CEK HTTP ENDPOINT BACKEND
    print_header("BLOK 2 - LOGIN JWT & CEK HTTP ENDPOINT BACKEND")
    results["total"] += 1
    token = login_and_get_token()
    if token:
        results["ok"] += 1
        headers = {"Authorization": f"Bearer {token}"}
    else:
        results["fail"] += 1
        headers = {}

    endpoints_to_check = [
        (f"{CONFIG['BACKEND_API_BASE']}/assets", "GET /api/assets"),
        (f"{CONFIG['BACKEND_API_BASE']}/dashboard/stats", "GET /api/dashboard/stats"),
        (f"{CONFIG['BACKEND_API_BASE']}/locations", "GET /api/locations"),
        (f"{CONFIG['BACKEND_API_BASE']}/incidents", "GET /api/incidents"),
    ]
    for url, name in endpoints_to_check:
        results["total"] += 1
        if check_http_endpoint(url, name, headers=headers):
            results["ok"] += 1
        else:
            results["fail"] += 1

    # BLOK 3: CEK DATABASE VIA BACKEND
    print_header("BLOK 3 - CEK DATABASE VIA BACKEND")
    results["total"] += 1
    if check_database_via_backend(headers):
        results["ok"] += 1
    else:
        results["fail"] += 1

    # BLOK 4: CEK FRONTEND
    print_header("BLOK 4 - CEK FRONTEND DASHBOARD")
    results["total"] += 1
    frontend_url = f"http://{CONFIG['FRONTEND_HOST']}:{CONFIG['FRONTEND_PORT']}"
    if check_http_endpoint(frontend_url, "Frontend Dashboard"):
        results["ok"] += 1
    else:
        results["fail"] += 1

    # RINGKASAN
    print_header("RINGKASAN HASIL PENGECEKAN")
    print(f"  {Color.BOLD}Total Pengecekan : {results['total']}{Color.END}")
    print(f"  {Color.GREEN}OK               : {results['ok']}{Color.END}")
    print(f"  {Color.YELLOW}WARN             : {results['warn']}{Color.END}")
    print(f"  {Color.RED}FAIL             : {results['fail']}{Color.END}")

    if results["total"] > 0:
        percentage = (results["ok"] / results["total"]) * 100
        print(f"\n  {Color.BOLD}Persentase Sukses : {percentage:.1f}%{Color.END}")

    print()
    if results["fail"] == 0:
        print(f"  {Color.GREEN}{Color.BOLD}SEMUA SISTEM HIJAU! Siap untuk Merge Phase.{Color.END}")
        return 0
    elif results["fail"] <= 2:
        print(f"  {Color.YELLOW}{Color.BOLD}ADA {results['fail']} SERVICE YANG GAGAL. Cek troubleshooting.{Color.END}")
        return 1
    else:
        print(f"  {Color.RED}{Color.BOLD}BANYAK SERVICE GAGAL ({results['fail']}). Jangan lanjut ke Merge Phase!{Color.END}")
        return 2

# =====================================================================
# ENTRY POINT
# =====================================================================
if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print(f"\n\n{Color.YELLOW}Pengecekan dibatalkan oleh user.{Color.END}")
        sys.exit(130)
    except Exception as e:
        print(f"\n\n{Color.RED}Error tidak terduga: {e}{Color.END}")
        sys.exit(1)
