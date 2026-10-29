# 📋 CHECKLIST PENGUJIAN HARIAN — REZA TRI (HARI KE-18)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Kamis, 29 Oktober 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Pengujian Fungsional Riwayat Monitoring (Monitoring History & State Transitions), Validasi QR Code Vector SVG Spek Lengkap, Sistem Isolasi Cetak QR Tag / PDF NOC, Dialog Proteksi Cyber Confirmation, dan Audit Kesiapan Live Deployment VPS CloudPanel (`t-aims.teknolab.biz.id`)  
**Status**  : 100% LULUS (ZERO DEFECT & SEMUA BUKTI TERKUMPUL)  

---

### [x] BAGIAN 1: REVIEW HANDOVER TIM & CHECK-IN AWAL SHIFT
- [x] **1.1 Review Handover Shift Dini Hari Dzakwan Miftahussobirin**
  - Menerima rilis fitur QR SVG Kazuhiko Arase V1-40, modul cetak isolasi `#print-mount-area`, Cyber modal in-app, dan update dump `taims_db.sql`.
- [x] **1.2 Verifikasi Lingkungan Pengujian Lokal**
  - Backend Express API port 3000 aktif normal.
  - MariaDB port 3306 aktif normal (16 aset, skema pulih).
  - Frontend web port 5500 aktif melayani tampilan responsif.

---

### [x] BAGIAN 2: VERIFIKASI RIWAYAT LOG MONITORING & TRANSISI STATUS (TC-H18-001)
- [x] **2.1 Tabel Riwayat Status Monitoring (Monitoring History)**
  - Menguji pencatatan histori perubahan status perangkat dari waktu ke waktu.
  - Memverifikasi kolom timestamp (29/10/26), status Terbuka, severity Tinggi, latensi, dan event trigger insiden (INC-015 & INC-016).
  - Riwayat notifikasi terputus & pemulihan terkirim (Switch Manageable & Mikrotik Server Critical Outage).
  - *Bukti Otentik*: [`2026-10-29_Hari-18_TC-H18-001_monitoring-history-status-transitions.png`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/evidence/screenshots/Hari-18/2026-10-29_Hari-18_TC-H18-001_monitoring-history-status-transitions.png)

---

### [x] BAGIAN 3: PENGUJIAN FUNGSIONAL QR CODE VECTOR SVG & SCANNING GOOGLE LENS (TC-H18-002)
- [x] **3.1 Validasi Payload & Keterbacaan QR Code SVG**
  - Membuka lembar stiker QR Tag dan memvalidasi muatan QR Code Vector SVG (Kazuhiko Arase V1-40) beresolusi tinggi tanpa blur/pecah saat diperbesar.
  - Memverifikasi muatan payload memuat spesifikasi teknis lengkap perangkat (Kode Aset, Nama, Kategori, IP, PIC, Wilayah).
  - Terverifikasi 100% scannable via Google Lens HP.
  - *Bukti Otentik*: [`2026-10-29_Hari-18_TC-H18-002_qr-code-vector-svg-scan-test.png`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/evidence/screenshots/Hari-18/2026-10-29_Hari-18_TC-H18-002_qr-code-vector-svg-scan-test.png)

---

### [x] BAGIAN 4: PENGUJIAN SISTEM ISOLASI CETAK (#PRINT-MOUNT-AREA) & EKSPOR PDF (TC-H18-003)
- [x] **4.1 Lembar Stiker QR Tag Terisolasi**
  - Menguji tombol cetak stiker QR Tag: memverifikasi hanya komponen stiker lembar resmi yang masuk ke print preview, seluruh elemen dashboard latar belakang bersih diisolasi.
- [x] **4.2 Ekspor Dokumen Resmi PDF NOC**
  - Memverifikasi layout ekspor stiker & PDF laporan status infrastruktur ber-header resmi Teknolab (`PT TEKNOLAB CARAKA INTERNASIONAL - LEMBAR STIKER QR TAG Total: 15 Label Aset`).
  - *Bukti Otentik*: [`2026-10-29_Hari-18_TC-H18-003_print-mount-isolated-qr-and-pdf-export.png`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/evidence/screenshots/Hari-18/2026-10-29_Hari-18_TC-H18-003_print-mount-isolated-qr-and-pdf-export.png)

---

### [x] BAGIAN 5: AUDIT KESIAPAN LIVE DEPLOYMENT CLOUDPANEL VPS (TC-H18-004)
- [x] **5.1 Smoke Test Server Produksi CloudPanel**
  - Membuka domain live publik `https://t-aims.teknolab.biz.id/#page-dashboard`.
  - Memverifikasi koneksi HTTPS aman dan sertifikat SSL valid (`Connection is secure`, `Certificate is valid`).
  - Memverifikasi dashboard live beroperasi mulus menampilkan 18 unit terdaftar, status live update 5 detik, grafik tren, donut chart, tabel status, dan peta GIS 3 titik lokasi.
  - *Bukti Otentik*:
    - [`2026-10-29_Hari-18_TC-H18-004_cloudpanel-production-live-verification.png`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/evidence/screenshots/Hari-18/2026-10-29_Hari-18_TC-H18-004_cloudpanel-production-live-verification.png)
    - [`2026-10-29_Hari-18_TC-H18-004b_ssl-certificate-valid-security.png`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/evidence/screenshots/Hari-18/2026-10-29_Hari-18_TC-H18-004b_ssl-certificate-valid-security.png)

---

### 🏁 KESIMPULAN AKHIR HARI-18
Seluruh 4 skenario pengujian fungsional, antarmuka, dan live deployment produksi pada Hari ke-18 telah diselesaikan oleh Reza Tri Wardana dengan hasil **100% LULUS (PASS - ZERO DEFECT)**. Sistem T-AIMS telah terbukti andal baik di lingkungan lokal maupun live server produksi publik `t-aims.teknolab.biz.id`.
