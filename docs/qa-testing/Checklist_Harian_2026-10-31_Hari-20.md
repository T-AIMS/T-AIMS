# 📋 CHECKLIST PENGUJIAN HARIAN — REZA TRI (HARI KE-20)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Sabtu, 31 Oktober 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Eksekusi User Acceptance Testing (UAT) MVP, Uji Ketahanan Polling Jaringan 19 Perangkat & Verifikasi Aliran Data Telemetri (16:15 WIB), Sinkronisasi Bug List, Update Test Report & Handover (21:00 WIB)  
**Status**  : 100% LULUS (ZERO DEFECT & SEMUA BUKTI TERKUMPUL)  

---

### [x] BAGIAN 1: REVIEW HANDOVER TIM & CHECK-IN AWAL SHIFT
- [x] **1.1 Review Handover Shift & Check-In Kantor 16:00 WIB**
  - Menerima update status operasional 19 perangkat live di server CloudPanel VPS `https://t-aims.teknolab.biz.id`.
- [x] **1.2 Briefing Sore & Verifikasi Lingkungan Pengujian Live (16:10 WIB)**
  - Server produksi aktif normal (HTTP 200 OK & SSL Certificate Valid).
  - API endpoint dan database MariaDB sinkron melayani 19 perangkat.

---

### [x] BAGIAN 2: EKSEKUSI UAT MVP DASHBOARD (TC-H20-001)
- [x] **2.1 Audit Widget Ringkasan Eksekutif**
  - Membuka halaman `#page-dashboard` pada browser live.
  - Mengonfirmasi 6 metrik card: Total Devices (19 Unit), Connected (7), Disconnected (2), Warning (0), Active Locations (3), dan System Uptime 36.8%.
- [x] **2.2 Verifikasi Status Sistem Berjalan & Tren 5 Detik**
  - Mengonfirmasi lampu indikator hijau `● Sistem Berjalan` aktif berkedip (*pulse*).
  - Grafik tren status perangkat ter-render mulus setiap interval 5 detik.
- *Bukti Otentik*: [`2026-10-31_Hari-20_TC-H20-001_dashboard-mvp-telemetry-overview.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-20/2026-10-31_Hari-20_TC-H20-001_dashboard-mvp-telemetry-overview.png)

---

### [x] BAGIAN 3: UJI KETAHANAN POLLING JARINGAN & DEVTOOLS AUDIT (TC-H20-002 & TC-H20-003)
- [x] **3.1 Continuous Polling Stream Fetch/XHR (TC-H20-002)**
  - Membuka DevTools (F12) tab Network dan filter Fetch/XHR.
  - Merekam 31+ request berkala ke backend (`/api/status`, `/api/logs?limit=100`, `/api/assets?limit=50`, `/api/stats`, `/api/server-metrics`).
  - Seluruh respons berstatus HTTP **200 OK** dan **304 Not Modified** dengan waktu respon 8 ms – 365 ms tanpa timeout.
- *Bukti Otentik*: [`2026-10-31_Hari-20_TC-H20-002_network-polling-endurance-stream-fetch.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-20/2026-10-31_Hari-20_TC-H20-002_network-polling-endurance-stream-fetch.png)
- [x] **3.2 Audit Stabilitas Script & Zero Console Error (TC-H20-003)**
  - Memeriksa tab Console DevTools selama pengujian aktif.
  - Terbukti 100% bebas dari error JavaScript kritis merah (*zero runtime crash / zero unhandled rejection*).
- *Bukti Otentik*: [`2026-10-31_Hari-20_TC-H20-003_console-stability-zero-error-audit.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-20/2026-10-31_Hari-20_TC-H20-003_console-stability-zero-error-audit.png)

---

### [x] BAGIAN 4: VERIFIKASI MASTER 19 ASET & FILTER LOKASI (TC-H20-004 & TC-H20-005)
- [x] **4.1 Verifikasi Grid Tabel Master 19 Perangkat (TC-H20-004)**
  - Membuka halaman `#page-devices`.
  - Mengonfirmasi seluruh 19 baris perangkat terdaftar utuh dari CCTV-01 hingga CAS-01.
  - Kolom RESPON (ms) dan TERAKHIR TERLIHAT terupdate berkala.
- *Bukti Otentik*: [`2026-10-31_Hari-20_TC-H20-004_master-devices-latency-telemetry-19-units.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-20/2026-10-31_Hari-20_TC-H20-004_master-devices-latency-telemetry-19-units.png)
- [x] **4.2 Uji Filter Kluster House of Server & Quick Status Override (TC-H20-005)**
  - Memfilter dropdown lokasi ke *House of Server* (menampilkan tepat 8 aset server).
  - Menguji tombol Ubah Status Alat pada CCTV Head Office (modal terbuka responsif).
- *Bukti Otentik*: [`2026-10-31_Hari-20_TC-H20-005_filter-location-house-of-server-cluster.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-20/2026-10-31_Hari-20_TC-H20-005_filter-location-house-of-server-cluster.png)

---

### [x] BAGIAN 5: GENERASI LEMBAR STIKER CETAK 19 QR TAG (TC-H20-006)
- [x] **5.1 Eksekusi Tombol Cetak QR Tag**
  - Menekan tombol aksi kuning `[ QR Tag ]` di atas tabel perangkat.
  - Sistem meng-generate *Lembar Stiker QR Tag PT TEKNOLAB CARAKA INTERNASIONAL*.
- [x] **5.2 Audit Kelengkapan 19 Label Aset**
  - Halaman 1 mencakup 9 aset (CCTV-01 hingga ESP-01).
  - Halaman 2 mencakup 10 aset (RPI-01 hingga CAS-01).
  - Seluruh QR Code, IP, kategori, dan lokasi tercetak presisi dengan timestamp `31/10/2026, 20.21.50`.
- *Bukti Otentik*:
  1. [`2026-10-31_Hari-20_TC-H20-006_qr-tag-sheet-19-assets-standard-grid.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-20/2026-10-31_Hari-20_TC-H20-006_qr-tag-sheet-19-assets-standard-grid.png)
  2. [`2026-10-31_Hari-20_TC-H20-006_qr-tag-sheet-19-assets-standard-grid_page2.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-20/2026-10-31_Hari-20_TC-H20-006_qr-tag-sheet-19-assets-standard-grid_page2.png)

---

### [x] BAGIAN 6: DOKUMENTASI, SYNC GITHUB & SELESAI SHIFT
- [x] Sinkronisasi laporan pengujian ke `docs/qa-testing/test-reports/2026-10-31_Hari-20.md`.
- [x] Sinkronisasi serah terima ke `docs/qa-testing/handover/2026-10-31_Handover_RezaTri.md`.
- [x] Update baris ke-20 `Tracker_Harian_Reza.csv` menjadi status *Sudah* (6 TC Lulus, Zero Blocker).
- [x] Update `01_Master_Test_Cases.xlsx` (baris EXECUTION_LOG dan appending 6 TC pada MASTER_TC).
- [x] Sinkronisasi dan push ke repository remote GitHub `origin/main`.
