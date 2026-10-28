# CHECKLIST HARIAN — REZA TRI (QA/DOCS) — T-AIMS
## Shift 2 (16.00–01.00 WIB)

**Tanggal:** 26/10/2026  
**Hari ke-:** 15  
**Commit Target:** `feat(qa): comprehensive dashboard verification, 15 assets telemetry, multi-channel gateways and sla analytics day-15`  
**Lead QA & Documentation Engineer:** Reza Tri Wardana (`rezatriwardana7@gmail.com`)  
**Lead Backend & Infrastructure Engineer:** Dzakwan Miftahussobirin  
**Project Coordinator & System Analyst:** Damar Munajad  
**DevOps, Server & Security Engineer:** Wafian Zaidan  

---

### A. AWAL SHIFT (16.00 WIB)
- [x] Terima serah terima tugas (Handover) Shift 1 dan review target milestone Hari ke-15
- [x] Cek status ketersediaan server produksi CloudPanel dari guru pembimbing (Status: Masih menunggu alokasi akun/server)
- [x] Lakukan *pivot* proaktif: Menjadikan Hari-15 fokus pada **Verifikasi Menyeluruh Dashboard Final, Inventarisasi Aset, NOC Telemetri, Alert Gateway, Audit Insiden & SLA Analytics** di localhost agar tim tidak terhambat (*unblocked*)
- [x] Verifikasi servis lokal aktif: MariaDB MySQL (Port 3306, 15 Aset), Backend Express (Port 3000), dan Frontend (Port 5500)
- [x] Siapkan folder bukti pengujian: `evidence/screenshots/Hari-15/`

---

### B. SAAT BEKERJA (EKSEKUSI PENGUJIAN & VERIFIKASI SISTEM AKHIR)
- [x] **EKSEKUSI 6 TEST CASES RESMI HARI-15 (`TC-H15-001` s/d `TC-H15-006`):**
  - [x] `TC-H15-001`: Dashboard Executive - Visualisasi KPI Executive, Donut Chart Kategori & Peta Sebaran 3 Lokasi
  - [x] `TC-H15-002`: Devices Management - Inventarisasi Aset & Pemantauan Tabel Telemetri Perangkat Lengkap
  - [x] `TC-H15-003`: Network Monitoring (NOC) - Pemantauan Resource Server & Mesin Protokol Multi-Engine (Ping, HTTP, TCP, Heartbeat)
  - [x] `TC-H15-004`: Alerting & Gateways - Multi-Channel Alert Gateway (n8n, SMTP, Telegram) & Indikator Debounce
  - [x] `TC-H15-005`: Incident Logging - Log Riwayat Insiden Infrastruktur & Audit Notifikasi Pemulihan Terkirim
  - [x] `TC-H15-006`: SLA Reports & AI - Laporan Infrastruktur, Analitik SLA Ketersediaan 30 Hari & Asisten AI Teknolab
- [x] **PENYUSUNAN SUITE SMOKE TEST PASCA-DEPLOY:**
  - [x] Menyusun daftar pengujian cepat (*Smoke Test Checklist*) yang siap dieksekusi begitu akses CloudPanel dibuka pembimbing

---

### C. AKHIR SHIFT (00.30 WIB)
- [x] Ambil dan arsipkan 6 screenshot otentik beresolusi 1080p hasil tangkapan layar ke folder `evidence/screenshots/Hari-15/`
- [x] Update Master Test Cases Excel `01_Master_Test_Cases.xlsx` (Sheet `MASTER_TC` baris 67–72 terisi lengkap dengan hyperlink aktif)
- [x] Update `Tracker_Harian_Reza.csv` baris Hari ke-15 (6 TC Planned, 6 Executed, 6 PASS, Status: Sudah)
- [x] Susun Laporan Pengujian Resmi Hari-15 (`test-reports/2026-10-26_Hari-15.md`)
- [x] Susun Berita Acara Handover Hari-15 (`handover/2026-10-26_Handover_RezaTri.md`)
- [x] Siapkan bundle pengumpulan tugas `PENGUMPULAN_DRIVE_HARI-15` di Desktop

---

### D. QUALITY & COMPLIANCE SUMMARY
- [x] 🔒 Kredensial database MariaDB aman dan terisolasi dengan 15 aset riil
- [x] 🛡️ Seluruh 6 skenario uji dashboard dan telemetri berstatus PASS 100% (Zero Defect)
- [x] 🚀 Frontend dan Backend 100% siap dideploy kapan pun server CloudPanel diserahkan
