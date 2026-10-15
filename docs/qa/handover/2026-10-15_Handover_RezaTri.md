# DAILY HANDOVER — REZA TRI

Nama    : Reza Tri Wardana
Tanggal : 15 Oktober 2026
Shift   : 2 (16.00 - 01.00 WIB)
Hari ke : 4

Task   : Verifikasi fix Reza Fahmi + Test 12 endpoint sisa
Status : Selesai

---

## YANG SUDAH SELESAI

1. Verifikasi klaim Reza Fahmi ("100% bebas bug")
   - 15/15 endpoint yang dia test = PASS ✅
   - Tapi 3 endpoint tidak masuk cover testing dia

2. Retest endpoint yang belum masuk cover:
   - GET /auth/me → 500 (BUG-003 baru)
   - GET /users/1 → masih 500 (BUG-002)
   - POST /auth/change-password → sudah FIXED

3. Test 12 endpoint sisa:
   - Monitoring: Ping (201), HTTP, TCP, Ping+HTTP, SNMP, MQTT Health
   - Heartbeat Send (201)
   - Notifications Mark All Read
   - Dashboard Activity, Map
   - Search Global
   - Incidents Update

4. Update Excel MASTER_TC (58 endpoint lengkap)
5. Update Bug List (BUG-001 Verified, BUG-002 & BUG-003 Open)
6. Screenshot bukti → upload ke GitHub + Drive
7. Upload Excel ke GitHub

---

## BUG STATUS

| ID BUG | Endpoint | Status | Catatan |
|--------|----------|--------|---------|
| BUG-001 | POST /auth/change-password | ✅ Verified | Fixed 14/10/2026 |
| BUG-002 | GET /users/1 | ❌ Open | 500 created_at |
| BUG-003 | GET /auth/me | ❌ Open | 500 created_at (baru) |

---

## BUG BARU DITEMUKAN

### BUG-003
- Endpoint : GET /auth/me
- Error    : 500 — Unknown column 'created_at' in field list
- Lokasi   : src/routes/auth.js baris 82
- Query    : SELECT user_id, full_name, email, role, created_at FROM users
- Severity : High
- PIC      : Ahmad Reza Fahmi
- Status   : Open

---

## KENDALA

1. BUG-002 & BUG-003 root cause sama:
   Query pakai kolom `created_at` yang TIDAK ADA di tabel users
   (tabel users cuma: user_id, full_name, email, password_hash, role)

2. Reza Fahmi klaim "100% bebas bug" belum akurat — endpoint 
   /auth/me dan /users/:id belum masuk cover testing dia.

3. Postman environment masih rusak — test manual pakai URL lengkap.

---

## NEXT ACTION

1. Tunggu fix BUG-002 & BUG-003 dari Reza Fahmi
2. Retest setelah fix di-push
3. Update Bug List setelah verifikasi

---

## PIC LANJUTAN

- Shift 1 besok: Ahmad Reza Fahmi — fix BUG-002 & BUG-003
- Shift 2 besok: Reza Tri — retest BUG-002 & BUG-003

---

## EVIDENCE

- Repository  : github.com/T-AIMS/T-AIMS/tree/main/docs/qa
- Master TC   : 01_Master_Test_Cases.xlsx
- Bug List    : Sheet BUG_LIST_DZAKWAN
- Test Report : test-reports/2026-10-15_Hari-4.md
- Screenshot  : evidence/screenshots/
  - 2026-10-15_BUG-003_me-500.png
  - 2026-10-15_monitoring_ping.png
  - 2026-10-15_monitoring_http.png
  - (dan 10 file lainnya)
- Google Drive: QA-RezaTri/Hari-4/

---

Diserahkan oleh : Reza Tri Wardana (QA Engineer)
Diterima oleh   : Dzakwan (Shift Lead & System Integration)