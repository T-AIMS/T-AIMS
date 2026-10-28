# 📋 CHECKLIST PENGUJIAN HARIAN — REZA TRI (HARI KE-18)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Kamis, 29 Oktober 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Pengujian Fungsional Riwayat Monitoring (Monitoring History & State Transitions), Validasi QR Code Vector SVG Spek Lengkap, Sistem Isolasi Cetak QR Tag / PDF NOC, Dialog Proteksi Cyber Confirmation, dan Audit Kesiapan Live Deployment VPS CloudPanel (`t-aims.teknolab.biz.id`)  
**Status**  : IN PROGRESS / CHECKED IN  

---

### [ ] BAGIAN 1: REVIEW HANDOVER TIM & CHECK-IN AWAL SHIFT
- [x] **1.1 Review Handover Shift Dini Hari Dzakwan Miftahussobirin**
  - Menerima rilis fitur QR SVG Kazuhiko Arase V1-40, modul cetak isolasi `#print-mount-area`, Cyber modal in-app, dan update dump `taims_db.sql`.
- [x] **1.2 Verifikasi Lingkungan Pengujian Lokal**
  - Backend Express API port 3000 aktif normal.
  - MariaDB port 3306 aktif normal (16 aset, skema pulih).
  - Frontend web port 5500 aktif melayani tampilan responsif.

---

### [ ] BAGIAN 2: VERIFIKASI RIWAYAT LOG MONITORING & TRANSISI STATUS (TC-H18-001)
- [ ] **2.1 Tabel Riwayat Status Monitoring (Monitoring History)**
  - Menguji pencatatan histori perubahan status perangkat dari waktu ke waktu.
  - Memverifikasi kolom timestamp, status (Online, Warning, Offline), latency, dan event trigger.
  - Uji filter rentang waktu dan pagination tabel history.
  - *Bukti Otentik Target*: `2026-10-29_Hari-18_TC-H18-001_monitoring-history-status-transitions.png`

---

### [ ] BAGIAN 3: PENGUJIAN FUNGSIONAL QR CODE VECTOR SVG & SCANNING GOOGLE LENS (TC-H18-002)
- [ ] **3.1 Validasi Payload & Keterbacaan QR Code SVG**
  - Membuka modal detail perangkat dan menekan tombol *Cetak QR Tag*.
  - Memverifikasi QR Code yang di-generate adalah Vector SVG (Kazuhiko Arase V1-40) beresolusi tinggi tanpa blur/pecah saat diperbesar.
  - Memverifikasi muatan payload memuat spesifikasi teknis lengkap perangkat (Kode Aset, Nama, Kategori, IP, MAC, PIC, Lokasi).
  - Uji scan langsung menggunakan Google Lens HP untuk memastikan 100% scannable.
  - *Bukti Otentik Target*: `2026-10-29_Hari-18_TC-H18-002_qr-code-vector-svg-scan-test.png`

---

### [ ] BAGIAN 4: PENGUJIAN SISTEM ISOLASI CETAK (#PRINT-MOUNT-AREA) & EKSPOR PDF (TC-H18-003)
- [ ] **4.1 Lembar Stiker QR Tag Terisolasi**
  - Menguji tombol cetak stiker QR Tag: memverifikasi hanya komponen stiker yang masuk ke print preview, seluruh elemen dashboard latar belakang bersih diisolasi.
- [ ] **4.2 Ekspor Dokumen Resmi PDF NOC**
  - Memverifikasi layout ekspor PDF laporan status infrastruktur ber-header resmi Teknolab dan bertanda tangan digital Lead NOC.
  - Memverifikasi unduh riwayat log ke format CSV berjalan lancar tanpa error encoding.
  - *Bukti Otentik Target*: `2026-10-29_Hari-18_TC-H18-003_print-mount-isolated-qr-and-pdf-export.png`

---

### [ ] BAGIAN 5: PENGUJIAN DIALOG PROTEKSI CYBER CONFIRMATION MODAL (TC-H18-004)
- [ ] **5.1 Dialog Konfirmasi In-App Aksi Berbahaya**
  - Menguji aksi hapus kategori aset, reset preset pabrik, dan pembersihan log database.
  - Memverifikasi browser native alert (`window.confirm` / `alert`) telah digantikan 100% oleh Cyber Confirmation Modal bertema cyberpunk.
  - Memastikan tombol batal/tutup membatalkan aksi dengan aman tanpa eksekusi mutasi data.
  - *Bukti Otentik Target*: `2026-10-29_Hari-18_TC-H18-004_cyber-confirmation-modal-dialog.png`

---

### [ ] BAGIAN 6: AUDIT KESIAPAN LIVE DEPLOYMENT CLOUDPANEL VPS (TC-H18-005)
- [ ] **6.1 Smoke Test Server Produksi CloudPanel**
  - Koordinasi bersama DevOps (Wafian Zaidan) untuk deployment repositori GitHub ke server CloudPanel VPS domain `https://t-aims.teknolab.biz.id`.
  - Verifikasi aktivasi SSL HTTPS, Node.js PM2 reverse proxy `/api/`, dan konektivitas database produksi.
  - *Bukti Otentik Target*: `2026-10-29_Hari-18_TC-H18-005_cloudpanel-production-live-verification.png`

---

### 🏁 TARGET AKHIR SHIFT HARI-18
Menyelesaikan seluruh 5 skenario pengujian dengan status **100% LULUS (ZERO DEFECT)**, mengumpulkan seluruh bukti screenshot otentik Hari-18, menyusun Laporan Pengujian Harian & Handover Hari-18, serta melakukan commit dan push ke repositori GitHub.
