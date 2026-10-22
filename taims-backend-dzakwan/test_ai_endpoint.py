"""
=============================================================================
T-AIMS - SCRIPT PENGUJIAN REST API ENDPOINT ASISTEN AI
PT Teknolab Caraka Internasional
Lead Superadmin: Dzakwan Miftahussobirin
=============================================================================
Jalankan: python test_ai_endpoint.py
=============================================================================
"""

import urllib.request
import json

BASE_URL = "http://localhost:3000/api"

print("=" * 70)
print("   [+] T-AIMS REST API TEST: GET /api/ai/recommendation")
print("   Target Backend :", BASE_URL)
print("=" * 70)

try:
    # 1. Login Superadmin untuk dapatkan Token JWT
    login_url = f"{BASE_URL}/auth/login"
    login_data = json.dumps({"email": "dzakwan@taims.local", "password": "password123"}).encode()
    login_req = urllib.request.Request(login_url, data=login_data, headers={"Content-Type": "application/json"})
    
    with urllib.request.urlopen(login_req) as res:
        login_resp = json.loads(res.read())
        token = login_resp["data"]["token"]
        print("[1] Autentikasi Superadmin : BERHASIL (Token JWT diperoleh)")

    # 2. Panggil Endpoint AI Recommendation
    ai_url = f"{BASE_URL}/ai/recommendation"
    ai_req = urllib.request.Request(ai_url, headers={"Authorization": f"Bearer {token}"})
    
    with urllib.request.urlopen(ai_req) as res:
        status_code = res.status
        ai_resp = json.loads(res.read())

    print(f"[2] HTTP Status Code       : {status_code} OK")
    print("-" * 70)
    print("HASIL PAYLOAD JSON DARI ENDPOINT AI:")
    print("-" * 70)
    print(json.dumps(ai_resp, indent=2))
    print("=" * 70)
    print(">> PENGUJIAN SUKSES! Silakan ambil tangkapan layar (Win + Shift + S).")

except Exception as e:
    print(f"[GAGAL] Terjadi error: {e}")
