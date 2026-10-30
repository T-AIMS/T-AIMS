# 📋 CHECKLIST PENGUJIAN HARIAN — REZA TRI (HARI KE-19)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Jumat, 30 Oktober 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Verifikasi Pembaruan Master Inventaris 19 Perangkat di Live Server CloudPanel, Validasi 4 Node Baru House of Server (`PC-03`, `CLOUD-01`, `RTR-04`, `CAS-01`), Uji Fungsional Kategori Baru "Cloud Panel", Audit Smart Hybrid Ping Fallback, Uji Tombol Cepat `[ ⏻ Ubah Status Alat ]`, dan Audit Perhitungan SLA 30 Hari serta Validasi Defect CSS Progress Bar  
**Status**  : 100% LULUS (ZERO DEFECT & SEMUA BUKTI TERKUMPUL)  

---

### [x] BAGIAN 1: REVIEW HANDOVER TIM & CHECK-IN AWAL SHIFT
- [x] **1.1 Review Handover Shift Dini Hari Dzakwan Miftahussobirin**
  - Menerima update rilis arsitektur server House of Server, penambahan kategori Cloud Panel, pemisahan telemetri server fisik vs VPS hosting, dan proteksi hybrid ping IP privat LAN.
- [x] **1.2 Verifikasi Lingkungan Pengujian Live**
  - Server produksi CloudPanel VPS `https://t-aims.teknolab.biz.id` aktif normal (HTTP 200 OK & SSL Valid).
  - API endpoint dan basis data MariaDB live sinkron melayani 19 perangkat.

---

### [x] BAGIAN 2: VERIFIKASI MASTER INVENTARIS 19 PERANGKAT (TC-H19-002)
- [x] **2.1 Audit Tabel Master Data Perangkat**
  - Membuka halaman `#page-devices` di server produksi live `t-aims.teknolab.biz.id`.
  - Mengonfirmasi total tabel memuat lengkap **19 perangkat** berurutan rapi.
- [x] **2.2 Validasi 4 Node Baru House of Server**
  - `PC-03` (*PC House Server* - IP `192.168.30.246`).
  - `CLOUD-01` (*Cloud Panel House Server* - IP `192.168.30.250`).
  - `RTR-04` (*Router House Server* - IP `192.168.30.252`).
  - `CAS-01` (*casaOS-nas* - IP `192.168.30.248`).
- [x] **2.3 Validasi Kategori Baru "Cloud Panel"**
  - Mengonfirmasi ketersediaan opsi `Cloud Panel (Cloud VPS)` pada dropdown tambah/edit aset dan filter kategori.
- *Bukti Otentik*: [`2026-10-30_Hari-19_TC-H19-002_master-inventory-19-devices-cloudpanel.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-19/2026-10-30_Hari-19_TC-H19-002_master-inventory-19-devices-cloudpanel.png)

---

### [x] BAGIAN 3: PENGUJIAN SMART HYBRID PING FALLBACK (TC-H19-003)
- [x] **3.1 Pengujian Proteksi Subnet Privat Lokal**
  - Menguji tombol `[ ⚡ Uji Ping Sekarang ]` pada server live.
  - Memvalidasi bahwa perangkat dengan IP privat (`192.168.x.x` / `10.x.x.x`) tidak drop ke status offline palsu.
- [x] **3.2 Responsifitas & Ketahanan API**
  - Respon API `/api/monitoring/real-ping` memberikan payload yang aman dan konsisten.

---

### [x] BAGIAN 4: VERIFIKASI TOMBOL UBAH STATUS ALAT (TC-H19-004)
- [x] **4.1 Modal Override Cepat `[ ⏻ Ubah Status Alat ]`**
  - Menguji pemanggilan fungsi `openQuickStatusModal` pada tabel perangkat.
  - Memastikan modal terbuka tanpa error konsol JavaScript dan dapat menyimpan perubahan status perangkat.
- [x] **4.2 Rekomendasi Auto-Suggest Monitoring Bab 6**
  - Kategori Raspberry Pi otomatis mengarahkan ke `Ping + Heartbeat`.
  - Kategori Server otomatis mengarahkan ke `Ping + TCP Port + HTTP`.
  - Kategori Router / Switch otomatis mengarahkan ke `Ping / SNMP`.
  - Kategori IoT Node / ESP32 otomatis mengarahkan ke `HTTP / MQTT Heartbeat`.

---

### [x] BAGIAN 5: PERHITUNGAN SLA 30 HARI & RESOLUSI CSS PROGRESS BAR (TC-H19-001)
- [x] **5.1 Verifikasi Nilai SLA 30 Hari**
  - Memvalidasi agregasi ketersediaan sistem pada Head Office, Marketing Office, dan House of Server.
- [x] **5.2 Verifikasi Resolusi BUG-H18-UI-001 (Visual Progress Bar)**
  - Memastikan batang indikator SLA pada selector `.sbi-prog` tampil solid berwarna penuh dan proporsional.
- *Bukti Otentik*: [`2026-10-30_Hari-19_TC-H19-001_system-availability-and-sla-summary-30-days.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-19/2026-10-30_Hari-19_TC-H19-001_system-availability-and-sla-summary-30-days.png)

---

### [x] BAGIAN 6: DOKUMENTASI, SYNC GITHUB & SELESAI SHIFT
- [x] Sinkronisasi laporan ke `docs/qa-testing/test-reports/2026-10-30_Hari-19.md`.
- [x] Sinkronisasi handover ke `docs/qa-testing/handover/2026-10-30_Handover_RezaTri.md`.
- [x] Update baris ke-19 `Tracker_Harian_Reza.csv` menjadi status *Sudah* (4 TC Lulus, 1 Defect Terverifikasi).
- [x] Commit dan push seluruh dokumen dan bukti pengujian ke remote GitHub `main`.
