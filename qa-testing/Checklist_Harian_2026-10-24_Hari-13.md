# CHECKLIST HARIAN — REZA TRI (QA/DOCS) — T-AIMS
## Shift 2 (16.00–01.00 WIB)

**Tanggal:** 24/10/2026  
**Hari ke-:** 13  
**Commit Target:** `feat(qa): asset inventory verification, iot heartbeat fallback and pre-deploy dashboard audit day-13`  
**Lead QA & Documentation Engineer:** Reza Tri Wardana (`rezatriwardana7@gmail.com`)  

---

### A. AWAL SHIFT (16.00 WIB)
- [x] Terima arahan project & rekonsiliasi pengujian dari Damar Munajad (Project Coordinator) & Dzakwan
- [x] Baca task board & target Verifikasi Master Inventaris Aset, IoT Heartbeat & Pre-Deployment Audit Hari-13
- [x] Verifikasi status MySQL `taims_db` (port 3306) dan service backend Express (`taims-backend` port 3000)
- [x] Verifikasi frontend dashboard lokal `http://localhost:5500` aktif dan responsif
- [x] Siapkan folder kerja `evidence/screenshots/Hari-13/` dan dokumen pengujian resmi

---

### B. SAAT BEKERJA (EKSEKUSI PENGUJIAN)
- [x] **TC-ASSET-001 s/d TC-ASSET-009:** Verifikasi ketersediaan seluruh 9 kategori perangkat inti di database (Router MikroTik, Switch Manageable, AP/CCTV, Server Ubuntu, Gateway Raspberry Pi, Web Service, Node ESP32, MQTT Broker, Workstation PC)
- [x] **TC-ASSET-010 & TC-ASSET-011:** Pengujian filter dinamis perangkat berdasarkan kategori (`Router` = 8 unit, `IoT Node` = 1 unit)
- [x] **TC-ASSET-012:** Pengujian filter lokasi multi-site (`Head Office` & cabang) tervalidasi presisi
- [x] **TC-ASSET-013:** Validasi integritas IP Address jaringan Core MikroTik (`192.168.1.1` & `192.168.1.2`)
- [x] **TC-ASSET-014:** Verifikasi skema konfigurasi telemetri MQTT sensor ESP32 (`taims/heartbeat/ESP-01`, timeout 90s)
- [x] **TC-ASSET-015:** Verifikasi pemetaan prioritas perangkat kritis (*Priority 1 / High Severity*)
- [x] **TC-HB-001:** Uji penerimaan paket heartbeat normal pada monitoring engine
- [x] **TC-HB-002:** Uji penolakan aman request heartbeat dengan `device_id` tidak terdaftar (status ditolak sesuai standar keamanan)
- [x] **TC-HB-003:** Validasi endpoint penarikan data heartbeat telemetri terakhir (`GET /api/heartbeat/ESP-01/latest`) dengan autentikasi Bearer Token (200 OK)
- [x] **AUDIT PRE-DEPLOYMENT DASHBOARD:** Pengujian menyeluruh 33 parameter pada dashboard akhir (CRUD Tambah Perangkat, Tambah Lokasi, Sinkronisasi Dropdown, Peta Geospasial Leaflet, Denah CAD 2D 15 Pin, Laporan SLA & Ekspor PDF, RBAC Pengguna)
- [x] Rekam 18 bukti tangkapan layar pengujian otentik beresolusi tinggi (distinct screenshots) ke folder `evidence/screenshots/Hari-13/`

---

### C. AKHIR SHIFT (00.30 WIB)
- [x] Isi Actual Result di Master Test Cases (`01_Master_Test_Cases.xlsx` sheet `MASTER_TC` baris 13-27 dan baris 59-61)
- [x] Buat hyperlink aktif bukti tangkapan layar unik di Col 14 (`evidence/screenshots/Hari-13/...` - 18 distinct links)
- [x] Update sheet `EXECUTION_LOG` (Hari 13: Planned 18, Executed 18, PASS 18, FAIL 0, BLOCKED 0)
- [x] Update Tracker Harian Reza (`Tracker_Harian_Reza.csv`) baris 14 (Status: Sudah)
- [x] Tulis Test Report Resmi Hari-13 (`test-reports/2026-10-24_Hari-13.md`)
- [x] Tulis Daily Handover Hari-13 (`handover/2026-10-24_Handover_RezaTri.md`)
- [x] Buat draf teks laporan siap kirim ke WhatsApp tim/koordinator

---

### D. ATURAN WAJIB & QUALITY COMPLIANCE
- [x] 🔒 Tidak menyimpan credential rahasia di source code
- [x] 🚫 Tidak menandai status PASS tanpa bukti respon dan tangkapan layar nyata
- [x] 📊 Seluruh respon waktu dan status code (200 OK) diverifikasi konsisten terhadap database `taims_db`
- [x] 🛡️ Seluruh screenshot diverifikasi otentik dan unik menampilkan antarmuka aktual sistem (bukan tampilan login/auth)
