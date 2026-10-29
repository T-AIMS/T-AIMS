# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab (Halaman 15 - Template Resmi)*

---

# DAILY HANDOVER - HARI 19

**Nama:** Dzakwan Miftahussobirin  
**Tanggal:** 30 Oktober 2026  
**Shift:** Shift Dini Hari - Pagi (00.00 – 04.00 WIB)  
**Peran:** Project Lead & System Integration  
**Penerima:** Wafian Zaidan, Damar Munajad, Aziz, & Mentor Teknolab  

---

### Task Utama Hari Ini:
1. **Audit & Verifikasi Rilis Produksi CloudPanel VPS (`https://t-aims.teknolab.biz.id/`):**  
   Melakukan pengetesan mandiri poin demi poin pada seluruh modul (Autentikasi, Dashboard, Master Aset, Jaringan & NOC, Lokasi Radar Site, Peringatan Insiden, Laporan SLA, Profil Tim, dan Pengaturan).
2. **Sinkronisasi Matriks Pengujian & Spreadsheet QA:**  
   Mengecek keselarasan item pengujian master spreadsheet (`01_Master_Test_Cases.xlsx` / Google Spreadsheet) dengan implementasi live.
3. **Penyelarasan Arsitektur Monitoring Bab 6 Dokumen Kerja PKL Teknolab:**  
   Menyelaraskan 7 isu arsitektural dan fungsional yang ditemukan bersama Aziz dan Wafian ke server live production.

---

### Status:
**DONE (100% Selesai & Terverifikasi Live di Production CloudPanel VPS)**  
*(Kriteria Definition of Done: Seluruh 7 temuan audit tuntas diperbaiki, teruji di domain publik HTTPS, dan bebas regresi).*

---

### Yang Sudah Selesai:

1. **Pemisahan Telemetri Server Fisik Lab vs Server Hosting CloudPanel:**
   * 4 kotak telemetri pada Halaman Jaringan kini dialokasikan murni untuk memantau **Server Fisik Lab Teknolab (House of Server / SRV-01)**.
   * Tidak lagi menampilkan jeroan VPS CloudPanel (`cloudpanel`). Menampilkan status **Standby (Menunggu Agen PC Server)** secara elegan hingga script agen telemetri PC lab diaktifkan.

2. **Penambahan Kategori Aset Baru "Cloud Panel":**
   * Opsi kategori `Cloud Panel (Cloud VPS)` resmi ditambahkan pada dropdown modal Tambah Aset, Edit Aset, serta filter kategori perangkat.
   * Menampung pencatatan aset hosting/cloud instance seperti `CLOUD-01` (*Cloud Panel House Server*).

3. **Penerapan Logika Smart Hybrid Ping Fallback:**
   * Backend monitoring (`/api/monitoring/real-ping`) telah diperkuat dengan filter deteksi IP privat lokal (`192.168.x.x` / `10.x.x.x`).
   * Menekan tombol `[ ⚡ Uji Ping Sekarang ]` tidak lagi menyebabkan aset LAN lokal terlempar (*drop*) menjadi status Offline merah akibat ketiadaan jalur VPN publik.

4. **Perbaikan Fungsional Tombol `[ ⏻ Ubah Status Alat ]`:**
   * Bug silent-failure pada fungsi `openQuickStatusModal` akibat ketidakcocokan tipe data ID (string kode aset vs integer ID) telah diperbaiki tuntas.
   * Superadmin kini dapat melakukan *override* status alat secara instan dan responsif.

5. **Perbaikan Garis Visual Progress Bar SLA Uptime Site:**
   * Menambahkan properti CSS `height: 100%` pada selector `.sbi-prog` di stylesheet sistem.
   * Batang indikator ketersediaan SLA (*Head Office*, *Marketing Office*, *House of Server*) di halaman Laporan kini tampil proporsional dengan warna penuh (hijau/kuning/merah).

6. **Sinkronisasi Otomatis Matriks Protokol HTTP/API:**
   * Kotak protokol *Web & REST API Health Check* kini terkunci otomatis pada status `1 / 1 Unit (200 OK • Aktif)` saat web backend merespons normal.

7. **Auto-Suggest Metode Monitoring Berdasarkan Dokumen PKL Bab 6:**
   * Modal tambah/edit aset kini otomatis merekomendasikan metode monitoring resmi saat kategori dipilih:
     - Kategori **Raspberry Pi** -> Otomatis memilih `Ping + Heartbeat`.
     - Kategori **Server** -> Otomatis memilih `Ping + TCP Port + HTTP`.
     - Kategori **Router / Switch** -> Otomatis memilih `Ping / SNMP`.
     - Kategori **IoT Node / ESP32** -> Otomatis memilih `HTTP / MQTT Heartbeat`.

---

### Yang Belum Selesai:
**Nihil (0)** — Seluruh 7 poin temuan audit dan penyelarasan dokumen PKL telah terpasang dan lolos uji di server produksi live.

---

### Kendala:
* Awalnya terjadi kerancuan antara spesifikasi VPS CloudPanel dan target PC Server fisik yang seharusnya dipantau, serta tombol ping menjatuhkan status perangkat LAN lokal ke offline.
* **Solusi:** Seluruh kendala telah dianalisis secara komprehensif, diselaraskan dengan Dokumen Kerja PKL Bab 6, dan diselesaikan melalui pembaruan logika frontend & backend.

---

### Next Action:
1. Penyusunan berkas dokumentasi pengujian final (QA Test Sign-Off) untuk lampiran laporan akhir PKL.
2. Persiapan skenario demonstrasi fitur (*dry run*) bersama Wafian Zaidan, Aziz, dan Damar Munajad menjelang sidang evaluasi PKL.

---

### File / Commit / Evidence:
* **Server Live:** `https://t-aims.teknolab.biz.id/` (IP: `45.198.155.203`)
* **Branch Git:** `main` (Production Synchronized)
* **Core Files Updated:**
  - `frontend/index.html` (Dropdown Kategori Cloud Panel, Metode Monitoring Bab 6)
  - `frontend/assets/js/app.js` (Smart Hybrid Ping, Quick Status Handler, Telemetry Standby Logic)
  - `frontend/assets/css/style.css` (SLA Progress Bar Height 100%)
  - `backend/src/routes/monitoring.js` (Hybrid Ping Engine & Route Safety)
* **Bukti Uji:** Seluruh 7 poin audit terverifikasi live di production per 30 Oktober 2026.

---

*Diserahkan oleh:*  
**Dzakwan Miftahussobirin**  
*Project Lead T-AIMS*  
PT Teknolab Caraka Internasional
