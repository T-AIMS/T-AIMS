#!/usr/bin/env python3
# Script Verify Integration T-AIMS
# Dibuat: 14 Oktober 2026
# Penanggung jawab: Dzakwan

import requests
import socket

# Port yang dicek
PORTS = {
    "Backend API": 3000,
    "Frontend": 3001,
    "MySQL": 3306,
    "MQTT": 1883,
    "phpMyAdmin": 80,
    "n8n": 5678,
}

def check_port(host, port):
    """Cek port terbuka atau tidak."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(2)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception:
        return False

def main():
    print("=== Verify Integration T-AIMS ===\n")
    for name, port in PORTS.items():
        status = check_port("localhost", port)
        emoji = "OK" if status else "TIDAK AKTIF"
        print(f"[{emoji}] {name} (port {port})")

    print("\n=== Cek Endpoint Backend ===")
    try:
        r = requests.get("http://localhost:3000/api", timeout=2)
        print(f"Backend API: HTTP {r.status_code}")
    except Exception as e:
        print(f"Backend API: {e}")

if __name__ == "__main__":
    main()
