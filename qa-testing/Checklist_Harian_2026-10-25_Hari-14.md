# CHECKLIST HARIAN — REZA TRI (QA/DOCS) — T-AIMS
## Shift 2 (16.00–01.00 WIB)

**Tanggal:** 25/10/2026  
**Hari ke-:** 14  
**Commit Target:** `feat(qa): comprehensive system crosscheck, 16 test cases and 6 floorplan 2d-3d verification day-14`  
**Lead QA & Documentation Engineer:** Reza Tri Wardana (`rezatriwardana7@gmail.com`)  
**Lead Backend & Infrastructure Engineer:** Dzakwan Miftahussobirin  
**Project Coordinator & System Analyst:** Damar Munajad  

---

### A. AWAL SHIFT (16.00 WIB)
- [x] Terima berkas rilis terintegrasi `Website T-AIMS (2).zip` dari Lead Backend / Tim Integrasi
- [x] Ekstrak arsip ke workspace kerja dan lakukan crosscheck integritas struktur berkas backend & frontend
- [x] Sinkronisasi basis data MariaDB/MySQL `taims_db` pada port 3306 (15 Aset riil, 11 Pengguna RBAC, 3 Lokasi)
- [x] Jalankan backend server Express.js pada `http://localhost:3000` (58 Endpoints aktif, offline-checker & JWT auth berjalan)
- [x] Jalankan frontend web server pada `http://127.0.0.1:5500/index.html` dan buka melalui Microsoft Edge
- [x] Siapkan direktori bukti tangkapan layar `evidence/screenshots/Hari-14/`

---

### B. SAAT BEKERJA (EKSEKUSI PENGUJIAN & CROSSCHECK SISTEM)
- [x] **CROSSCHECK KETENTUAN SISTEM (v1.2 & Integration Checklist):**
  - [x] Kesesuaian 12 Fitur Inti Wajib (Asset Management, Device Monitoring, Last Seen, Response Time, History, Uptime/Downtime, Dashboard, 2D/3D Location, Notification, RBAC, Reporting, AI Assistant)
  - [x] Kesesuaian 9 Halaman Web Dashboard: Dashboard, Devices, Network Monitoring, Location CAD, Alerts & Gateways, Reports, Project Info, Users, Settings
  - [x] Kesesuaian Skema Basis Data MariaDB (`taims_db`): 12 field wajib aset, status enum, soft delete, RBAC users (15 aset aktif)
  - [x] Kesesuaian Endpoint REST API (58 Endpoints lengkap: Auth, Assets, Locations, Monitoring, Incidents, Maintenance, Notifications, AI, Dashboard)
- [x] **VERIFIKASI PERBAIKAN TATA LETAK STANDAR INDUSTRI (QA FINAL REVISION):**
  - [x] `page-alerts`: 4 Stat Cards sejajar 1 baris (100% penuh tanpa celah kosong di samping kotak 0 Sent)
  - [x] `page-alerts`: Multi-Channel Alert Gateway 3 kartu sejajar (n8n, Telegram Bot, Email SMTP)
  - [x] `page-location`: Kontrol Denah compact, tombol 3D Digital Twin rapi & dilengkapi badge telemetri sensor NOC
  - [x] `page-devices`: 5 Stat Cards proporsional (Baris 1 = 3 kartu 33.33% & Baris 2 = 2 kartu 50% tanpa ruang kosong kanan bawah)
- [x] **EKSEKUSI 16 TEST CASES RESMI HARI-14 (`TC-H14-001` s/d `TC-H14-016`):**
  - [x] `TC-H14-001`: Dashboard Executive KPI & Realtime Status Sync
  - [x] `TC-H14-002`: Device Inventory Grid (5 Stat Cards Industrial Standard Layout)
  - [x] `TC-H14-003`: Modal Detail Spesifikasi Aset & Telemetri Realtime MKRT-01
  - [x] `TC-H14-004`: Modal Tambah Perangkat Baru (12 Field Wajib & Input Validation)
  - [x] `TC-H14-005`: Monitoring Jaringan & NOC Protocol Engines (Ping, API, DB Port, MQTT, Heartbeat)
  - [x] `TC-H14-006`: Blueprint Denah 2D CAD - Site 1 Head Office (7 Aset Terkalibrasi)
  - [x] `TC-H14-007`: Blueprint Denah 2D CAD - Site 2 Marketing Office (4 Aset Terkalibrasi)
  - [x] `TC-H14-008`: Blueprint Denah 2D CAD - Site 3 House of Server (4 Aset Terkalibrasi)
  - [x] `TC-H14-009`: 3D Digital Twin Three.js - Site 1 Head Office (7 Aset & Viewport Isometric)
  - [x] `TC-H14-010`: 3D Digital Twin Three.js - Site 2 Marketing Office (4 Aset & Viewport Isometric)
  - [x] `TC-H14-011`: 3D Digital Twin Three.js - Site 3 House of Server (4 Aset & Viewport Isometric)
  - [x] `TC-H14-012`: Modal Ubah Titik Perangkat ESP-01 & Kalibrasi Koordinat Pin Interaktif
  - [x] `TC-H14-013`: Multi-Channel Alert Gateway (n8n, SMTP, Telegram) & Cooldown Debounce
  - [x] `TC-H14-014`: Riwayat Notifikasi Real-time & Feed Log Pemulihan Insiden
  - [x] `TC-H14-015`: Laporan Eksekutif SLA Bulanan, Diagnostik AI & Ekspor Dokumen
  - [x] `TC-H14-016`: Manajemen Pengguna RBAC & Matriks Hak Akses Tim (11 Anggota Tim Shift 2)

---

### C. AKHIR SHIFT (00.30 WIB)
- [x] Rename 16 screenshot otentik sesuai standar penamaan (`2026-10-25_Hari-14_TC-H14-xxx_*.png`)
- [x] Update Master Test Cases Excel `01_Master_Test_Cases.xlsx` (Sheet `MASTER_TC` 16 baris dengan hyperlink aktif & `EXECUTION_LOG` row 15)
- [x] Update `Tracker_Harian_Reza.csv` baris Hari ke-14 menjadi Status: Sudah (16 Planned, 16 Executed, 16 PASS)
- [x] Susun Laporan Pengujian Resmi Hari-14 (`test-reports/2026-10-25_Hari-14.md`)
- [x] Susun Berita Acara Handover Hari-14 (`handover/2026-10-25_Handover_RezaTri.md`)
- [x] Siapkan draf teks pelaporan dan check-in tim Shift 2 untuk WhatsApp

---

### D. ATURAN WAJIB & QUALITY COMPLIANCE
- [x] 🔒 Kredensial rahasia aman di `.env` dan tidak terekspos di client
- [x] 🛡️ Seluruh 16 screenshot bukti pengujian diambil secara otentik langsung pada Microsoft Edge
- [x] 📐 Seluruh penataan antarmuka memenuhi Standar Industri NOC (Datadog/Zabbix) tanpa ruang kosong canggung
