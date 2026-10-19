# DAILY HANDOVER — REZA TRI

Nama    : Reza Tri Wardana
Tanggal : 13 Oktober 2026
Shift   : 2 (16.00 - 01.00 WIB)
Hari ke : 2

Task   : Setup backend & test 58 endpoint menggunakan Postman
Status : Selesai

---

## YANG SUDAH SELESAI

1. Setup environment backend
   - Install Node.js v24.21.0
   - Download repository backend dari GitHub
   - npm install (159 packages)
   - Buat file .env
   - Jalankan npm start di port 3000

2. Import database taims_db via phpMyAdmin
   - File SQL dari Wafian
   - 7 tabel terbuat: assets, incidents, locations, maintenance,
     monitoring_logs, notifications, users
   - 16 aset tersimpan

3. Import Postman collection 58 endpoints

4. Test 58 endpoint:
   - Auth: Login, Me, Logout
   - Users: List, Detail, Create, Update, Update Role
   - Assets: List, Detail, History, By Category, Create, Update
   - Locations: List, Detail, Create, Update
   - Monitoring: Ping, HTTP, TCP, Ping+HTTP, SNMP, MQTT Health, Logs, Status, Summary
   - Dashboard: Stats, Uptime, Top Issues, Charts, AI Report, Activity, Map
   - Incidents: List, Detail, Create, Update
   - Maintenance: List, Detail, Create, Update
   - Notifications: List, Detail, Create, Mark Read, Mark All Read
   - Heartbeat: Send, Latest
   - Search: Global Search

5. Update Excel MASTER_TC dengan hasil test
6. Update sheet BUG_LIST_DZAKWAN (2 bug nyata)
7. Update sheet BUG_REPORTS
8. Upload screenshot bukti ke GitHub

---

## HASIL TEST

- Total endpoint di-test : 58
- PASS                    : 56
- FAIL                    : 2
- DELETE (403 RBAC)       : 6 endpoint (sesuai aturan, bukan bug)

---

## BUG DITEMUKAN

### BUG-001
- Endpoint : POST /auth/change-password
- Error    : 404 Endpoint tidak ditemukan
- Penyebab : Endpoint belum diimplementasi di backend
- Severity : Medium
- PIC      : Ahmad Reza Fahmi
- Status   : Open

### BUG-002
- Endpoint : GET /users/1
- Error    : 500 Internal Server Error
- Penyebab : Backend crash saat akses detail user ID 1
- Severity : High
- PIC      : Ahmad Reza Fahmi
- Status   : Open

---

## KENDALA

1. Environment Postman "T-AIMS Local" rusak — variable base_url
   tidak ter-resolve, test dilakukan manual pakai URL lengkap.
2. Collection Runner error saat Start run.
3. MQTT Broker belum jalan — backend spam error MQTT reconnect.
4. Kredensial super_admin belum tersedia — 6 endpoint DELETE
   mengembalikan 403 karena login sebagai admin.

---

## NEXT ACTION

1. Fix BUG-001 & BUG-002 oleh Ahmad Reza Fahmi
2. Fix environment Postman
3. Cek MQTT Broker dengan Wafian
4. Minta kredensial super_admin ke Ahmad Reza
5. Test endpoint DELETE dengan role super_admin

---

## PIC LANJUTAN

- Shift 1 besok: Ahmad Reza Fahmi — fix BUG-001 & BUG-002
- Shift 2 besok: Reza Tri — fix environment Postman, test DELETE
  dengan super_admin

---

## EVIDENCE

- Repository  : github.com/T-AIMS/T-AIMS/tree/main/docs/qa
- Master TC   : 01_Master_Test_Cases.xlsx
- Bug List    : Sheet BUG_LIST_DZAKWAN
- Bug Reports : Sheet BUG_REPORTS
- Test Report : test-reports/2026-10-13_Hari-2.md
- Screenshot  : evidence/screenshots/Hari-2/
- Backend     : http://localhost:3000
- Database    : taims_db (16 aset)

---

Diserahkan oleh : Reza Tri Wardana (QA Engineer)
Diterima oleh   : Dzakwan (Shift Lead & System Integration)