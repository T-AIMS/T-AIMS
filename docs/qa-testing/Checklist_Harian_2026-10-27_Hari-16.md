# 📋 CHECKLIST PENGUJIAN HARIAN — REZA TRI (HARI KE-16)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Selasa, 27 Oktober 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Verifikasi Pra-Deploy Tingkat Lanjut, Penyelesaian Responsivitas Mobile, Uji Jaringan 3G, Sanitasi Keamanan Error 404, dan Integritas Filter Mesin Pencari Aset  
**Status**  : 100% LULUS (ZERO DEFECT & SIAP DEPLOY)  

---

### [x] BAGIAN 1: VERIFIKASI TAMPILAN FINAL & RESPONSIVITAS SMARTPHONE (MOBILE VIEW)
- [x] **1.1 Topbar Header & Tombol Profil Kanan Atas**
  - Mengunci posisi tombol avatar profil bulat warna cyan di pojok kanan atas layar smartphone (<640px).
  - Menyembunyikan jam digital yang memakan tempat di baris atas (karena HP sudah memiliki jam di status bar bawaan).
  - Menguji tombol profil saat diklik: memunculkan dropdown menu melayang (*floating card*) yang memuat nama pengguna (Reza Tri wardana), peran (Admin), opsi ganti foto profil, kelola tim, dan tombol merah *Kembali ke Halaman Masuk / Ganti Akun*.
  - Terverifikasi 100% tidak terpotong tepi layar (*clipping issue resolved*).
  - *Bukti Bukti*: `2026-10-27_Hari-16_TC-H16-003_mobile-user-profile-account-switcher-dropdown.png`
- [x] **1.2 Dashboard KPI Cards Proporsional**
  - Grid 6 kartu KPI otomatis menyesuaikan menjadi 2 kolom rapi di smartphone (Total Devices 15, Connected 0, Disconnected 15, Warning 0, Locations 3, System Uptime 0.0%).
  - Grafik tren status perangkat dan distribusi kategori donut ter-render proporsional.
  - *Bukti Bukti*: `2026-10-27_Hari-16_TC-H16-002_mobile-viewport-dashboard-kpi-layout.png`
- [x] **1.3 Tabel Inventarisasi Perangkat (Horizontal Swipe)**
  - Mengisolasi tabel inventarisasi di dalam wrapper `overflow-x: auto` dengan dukungan *touch-swipe* yang mulus.
  - Memastikan seluruh kolom data (No, Kode Aset, Nama Perangkat, Kategori, IP Address, Lokasi, Status, Latency, Aksi) dapat digeser ke samping tanpa membuat layout halaman web melar keluar batas layar.
  - Memverifikasi kelengkapan seluruh 15 perangkat MariaDB dari baris ke-1 hingga baris ke-15 (SWM-01 Switch Manageable).
  - *Bukti Bukti*: `2026-10-27_Hari-16_TC-H16-004_mobile-devices-table-horizontal-swipe-scroll.png` & `2026-10-27_Hari-16_TC-H16-005_mobile-devices-table-full-inventory-rendering.png`

---

### [x] BAGIAN 2: UJI KETAHANAN KONEKSI JARINGAN LEMOT (NETWORK THROTTLING 3G)
- [x] **2.1 Pemuatan Halaman & Waterfall Request**
  - Mengaktifkan simulasi Slow/Fast 3G via DevTools Chrome.
  - Pemuatan skrip, CSS, dan telemetri berjalan teratur tanpa terjadi tabrakan antrian (*waterfall request ~2.03s per call*).
  - Komponen dashboard ter-render dengan anggun (*graceful degradation*) tanpa fatal crash atau blank screen permanen.
  - *Bukti Bukti*: `2026-10-27_Hari-16_TC-H16-001_network-throttling-3g-dashboard-kpi.png`
- [x] **2.2 Penanganan Peta Leaflet GIS (Tile Cancellation)**
  - Menguji zoom in/out peta saat koneksi lambat: request gambar peta lama yang belum sempat dimuat otomatis dibatalkan (*cancelled request HTTP merah*) oleh Leaflet AbortController untuk menghemat kuota dan memprioritaskan tile tampilan terbaru.

---

### [x] BAGIAN 3: UJI KEAMANAN SANITASI KODE ERROR (ZERO DATA LEAKAGE)
- [x] **3.1 Pengujian Request Endpoint Ilegal (HTTP 404)**
  - Menembak request ke endpoint palsu: `GET http://localhost:3000/api/endpoint-palsu-testing`.
  - Server mengembalikan respon: `{"success":false,"error":"Endpoint tidak ditemukan"}` dengan status HTTP 404.
  - Terverifikasi 100% aman: tidak ada kebocoran stack trace error, query database SQL, atau struktur folder direktori server fisik.
  - *Bukti Bukti*: `2026-10-27_Hari-16_TC-H16-006_backend-api-error-sanitization-404-zero-leakage.png`

---

### [x] BAGIAN 4: UJI INTEGRITAS MESIN PENCARIAN & FILTER ASET
- [x] **4.1 Pencarian Kata Kunci Cepat (Search Engine)**
  - Memasukkan kata kunci `cctv` pada kolom pencarian perangkat di layar HP.
  - Tabel secara instan dan akurat menyaring tepat 2 perangkat: CCTV Head Office (192.168.1.39) dan CCTV Marketing (192.168.1.8).
  - *Bukti Bukti*: `2026-10-27_Hari-16_TC-H16-007_device-keyword-search-cctv-filter-integrity.png`
- [x] **4.2 Filter Kategori Dropdown**
  - Menguji filter kategori `Router` via backend API: berhasil menyaring tepat 5 unit router (Router Head Office, Router 2 Marketing, Router 1 Marketing, Mikrotik Marketing, Mikrotik Server).
  - Tombol Reset berfungsi mengembalikan tampilan 15 aset secara konsisten.

---

### 🏁 KESIMPULAN AKHIR
Semua pengujian pada Hari ke-16 telah selesai dilaksanakan dengan hasil **100% LULUS (PASS)**. Seluruh bug antarmuka smartphone telah diperbaiki secara permanen, dan sistem T-AIMS berada dalam kondisi prima untuk segera dipublikasikan ke server CloudPanel/VPS.
