# 📋 CHECKLIST PENGUJIAN HARIAN – REZA TRI (HARI KE-22)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Senin, 2 November 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Audit Komprehensif Menu Laporan & SLA Multi-Site (16:15 WIB), Pengujian AI Assistant & Diagnostik Mitigasi (19:50 WIB), Ekspor Laporan Resmi PDF & Unduh CSV (20:40 WIB), Verifikasi Pasca-Resolusi DEF-H21-001 via DevTools (20:46 WIB), Dokumentasi Laporan Harian, Update Master Test Cases & Handover (21:00 WIB)  
**Status**  : 100% LULUS (5 TEST CASES EXECUTED, ALL PASSED, 0 OPEN DEFECTS, 1 DEFECT VERIFIED CLOSED)  

---

### [x] BAGIAN 1: REVIEW HANDOVER TIM & CHECK-IN AWAL SHIFT
- [x] **1.1 Review Handover Shift & Check-In Kantor 16:00 WIB**
  - Menerima update status server CloudPanel VPS `https://t-aims.teknolab.biz.id` pasca maintenance pagi.
- [x] **1.2 Briefing Sore & Verifikasi Lingkungan Pengujian Live (16:10 WIB)**
  - Server produksi aktif normal (HTTP 200 OK & SSL Certificate Valid).
  - Modul Laporan dan mesin AI Assistant siap diuji.

---

### [x] BAGIAN 2: AUDIT MENU LAPORAN & METRIK KETERSEDIAAN SLA 30 HARI (TC-H22-001)
- [x] **2.1 Audit Widget 4 Kartu Metrik SLA Agregat**
  - Membuka halaman `#page-reports` pada browser live.
  - Mengonfirmasi 4 kartu metrik: Availability SLA 30 Hari (42.2%), Total Incidents (14 Kasus), Total Downtime (0 m), dan Average Latency (4.4 ms).
- [x] **2.2 Verifikasi Status 3 Batang Kepatuhan Site**
  - Marketing Office berstatus hijau stabil dengan ketersediaan tertinggi **97.9% Uptime**.
  - Head Office tercatat **20.7% Uptime**.
  - House of Server tercatat **1.3% Uptime**.
- *Bukti Otentik*: [`2026-11-02_Hari-22_TC-H22-001_sla-uptime-executive-metrics-dashboard.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-22/2026-11-02_Hari-22_TC-H22-001_sla-uptime-executive-metrics-dashboard.png)

---

### [x] BAGIAN 3: DIAGNOSTIK OTOMATIS & REKOMENDASI MITIGASI AI ASSISTANT (TC-H22-002)
- [x] **3.1 Evaluasi Kartu Asisten Infrastruktur AI Teknolab**
  - Memeriksa banner agregasi metrik AI: Total Device (19 Unit), Online (7 Unit), Offline (2 Unit), Warning (0 Unit), dan Availability SLA (36.8%).
- [x] **3.2 Validasi Rekomendasi Preskriptif AI**
  - Sistem AI berhasil menyajikan rekomendasi mitigasi kerusakan preskriptif: *"Sistem telemetri aktif. Periksa kondisi catu daya dan uplink switch utama untuk perangkat offline."*
  - Menampilkan status kesehatan 3 lokasi fisik: Marketing Office (4/4 100%), Head Office (3/7 43%), dan House of Server (0/8).
- *Bukti Otentik*: [`2026-11-02_Hari-22_TC-H22-002_ai-infrastructure-assistant-mitigation-recommendation.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-22/2026-11-02_Hari-22_TC-H22-002_ai-infrastructure-assistant-mitigation-recommendation.png)

---

### [x] BAGIAN 4: AUDIT BUKU CATATAN PEMELIHARAAN PERANGKAT (TC-H22-003)
- [x] **4.1 Audit Struktur Header Tabel Pemeliharaan**
  - Memverifikasi 9 kolom data: ID Servis, Tanggal, Perangkat Aset, Lokasi, Jenis Pemeliharaan, Deskripsi Pekerjaan, Teknisi PIC, Status, dan Aksi.
- [x] **4.2 Validasi Tombol Aksi Penjadwalan Servis**
  - Memverifikasi kesiapan tombol aksi `[ + Jadwalkan Servis Baru ]` untuk entri pekerjaan servis preventif.
- *Bukti Otentik*: [`2026-11-02_Hari-22_TC-H22-003_infrastructure-maintenance-service-log-panel.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-22/2026-11-02_Hari-22_TC-H22-003_infrastructure-maintenance-service-log-panel.png)

---

### [x] BAGIAN 5: EKSPOR LAPORAN KINERJA SLA BERKOP RESMI & UNDUH CSV (TC-H22-004)
- [x] **5.1 Eksekusi Ekspor Dokumen Resmi PDF**
  - Menekan tombol `[ Unduh PDF ]` di pojok kanan atas.
  - Memvalidasi pembentukan dokumen formal berkop resmi **PT TEKNOLAB CARAKA INTERNASIONAL - LAPORAN ANALITIK KINERJA INFRASTRUKTUR & KETERSEDIAAN SLA** lengkap dengan tanggal cetak 2 November 2026, 19 baris aset inventaris, serta tanda tangan otoritas Superadmin Dzakwan Miftahussobirin.
- [x] **5.2 Unduh Berkas Spreadsheet CSV & Konfirmasi Toast**
  - Menekan tombol `[ Excel / CSV ]`.
  - Berkas `Laporan_Perangkat_T-AIMS_2026-11-02.csv` (2.656 Byte) terunduh presisi dengan toast konfirmasi hijau "Ekspor Berhasil".
- *Bukti Otentik*: [`2026-11-02_Hari-22_TC-H22-004_sla-performance-report-pdf-export-preview.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-22/2026-11-02_Hari-22_TC-H22-004_sla-performance-report-pdf-export-preview.png) (didukung [`2026-11-02_Hari-22_TC-H22-004b_csv-spreadsheet-download-toast-confirmation.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-22/2026-11-02_Hari-22_TC-H22-004b_csv-spreadsheet-download-toast-confirmation.png))

---

### [x] BAGIAN 6: VERIFIKASI PASCA-RESOLUSI DEF-H21-001 & STRESS TEST DEVTOOLS (TC-H22-005)
- [x] **6.1 Eksekusi Penekanan Uji Ping Berulang Kali (Stress Test)**
  - Menekan tombol `[ Uji Ping Sekarang ]` pada perangkat CCTV Marketing (`CCTV-02` - IP `192.168.1.2`).
- [x] **6.2 Audit Respons Traffic Tab Network DevTools F12**
  - Seluruh 5 request `real-ping` terekam sukses dengan status HTTP **200 OK** stabil (~61-129 ms).
- [x] **6.3 Verifikasi Ketahanan Status Perangkat (Anti False-Positive)**
  - Status perangkat terbukti tetap **ONLINE (Hijau)** dengan respons time **1 ms** dan uptime 99.9%.
  - Riwayat pengujian mencatat 5 log online berturut-turut (9ms, 4ms, 21ms, 16ms, 4ms) tanpa terjadi false-positive offline (RTO).
  - Toast konfirmasi hijau "Ping Berhasil (Online)" muncul akurat.
- *Bukti Otentik*: [`2026-11-02_Hari-22_TC-H22-005_anti-spam-network-manual-ping-devtools.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-22/2026-11-02_Hari-22_TC-H22-005_anti-spam-network-manual-ping-devtools.png)

---

### [x] BAGIAN 7: SINKRONISASI AKHIR SHIFT & PUSAT DOKUMENTASI (21:00 WIB)
- [x] Memperbarui berkas pelaporan harian `2026-11-02_Hari-22.md`.
- [x] Memperbarui berkas handover shift `2026-11-02_Handover_RezaTri.md`.
- [x] Memperbarui berkas master spreadsheet `01_Master_Test_Cases.xlsx` (EXECUTION_LOG baris 23 & MASTER_TC baris 134–138).
- [x] Memperbarui berkas tracking harian `Tracker_Harian_Reza.csv` (Baris 22).
- [x] Melakukan komit dan push repositori Git ke cabang `main`.
