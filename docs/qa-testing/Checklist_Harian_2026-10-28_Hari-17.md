# 📋 CHECKLIST PENGUJIAN HARIAN — REZA TRI (HARI KE-17)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Rabu, 28 Oktober 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Pengujian Fungsional Modul Detail Perangkat (Data Lengkap vs Fallback Offline), Verifikasi Diagram Donut & Legenda Sejajar Vertikal, Validasi Katalog Hardware Enterprise 181+ Model & Dialog Cyberpunk, Perbaikan Skema Database Tambah Perangkat, dan Audit Kesiapan Live Deployment CloudPanel (`t-aims.teknolab.biz.id`)  
**Status**  : 100% LULUS (ZERO DEFECT & SIAP DEPLOY LIVE)  

---

### [x] BAGIAN 1: VERIFIKASI TATA LETAK DIAGRAM DONUT & LEGENDA KATEGORI (DASHBOARD)
- [x] **1.1 Donut Chart & Legenda Sejajar Rata (TC-H17-001)**
  - Lingkaran donut 115px terpusat di sisi kiri kartu dengan label tebal tengah: **"15 Perangkat"**.
  - Kolom legenda kategori di sisi kanan: nama kategori, angka unit (putih), dan persentase oranye tertata **tegak lurus sejajar vertikal**.
  - Tombol header "Lihat Detail ->" sejajar presisi dengan judul kartu.
  - Bebas tumpang tindih (*zero overlapping*) dan responsif pada seluruh viewport.
  - *Bukti Otentik*: `2026-10-28_Hari-17_TC-H17-001_donut-chart-legend-alignment.png`

---

### [x] BAGIAN 2: UJI FORM TAMBAH PERANGKAT & MANAJEMEN KATEGORI DINAMIS
- [x] **2.1 Form Tambah Perangkat & Dropdown Kategori (TC-H17-002)**
  - Menguji tombol "+ Tambah Perangkat": modal terbuka mulus dengan kolom Kode Aset kosong bawaan (*clean placeholder* siap input).
  - Dropdown *Kategori Perangkat* memuat 10 kategori bawaan lengkap (Router, Switch, Server, AP, CCTV, IoT Node, RPi, PC Workstation, Smart TV, Printer).
  - Opsi dinamis **"+ Tambah Kategori Baru (Ketik Manual)..."** terverifikasi aktif untuk kebutuhan ekspansi hardware masa depan.
  - *Bukti Otentik*: `2026-10-28_Hari-17_TC-H17-002_add-device-category-selection.png`

---

### [x] BAGIAN 3: VALIDASI KATALOG HARDWARE ENTERPRISE & DIALOG CYBERPUNK
- [x] **3.1 Dropdown Preset Hardware Industri 181+ Model (TC-H17-003)**
  - Dropdown *Jenis / Merk & Tipe* otomatis beradaptasi dengan kategori yang dipilih.
  - Pengujian kategori IoT Node: memuat seluruh model mikrokontroler standar industri (ESP32-WROOM-32, ESP32-CAM, ESP32-S3, Arduino Mega+W5500 Ethernet, LoRa TTGO T-Beam, sensor PZEM-004T).
  - Fitur proteksi: tombol *Hapus Kategori* dan *Reset Bawaan* berfungsi normal dengan dialog konfirmasi keamanan bertema *Cyberpunk*.
  - Opsi **"+ Lainnya / Ketik Sendiri (Custom)..."** menjamin fleksibilitas input bagi teknisi.
  - *Bukti Otentik*: `2026-10-28_Hari-17_TC-H17-003_add-device-hardware-presets.png`

---

### [x] BAGIAN 4: UJI DETAIL SPESIFIKASI PERANGKAT & TELEMETRI (DEVICE DETAIL MODAL)
- [x] **4.1 Modal Detail Spesifikasi Perangkat & Telemetri Fallback (TC-H17-004)**
  - Membuka modal detail pada baris perangkat CCTV-01 (Head Office).
  - Menampilkan 12 parameter lengkap: Kategori CCTV, IP 192.168.1.39, MAC B8:AB:CA:FC:30:AC, Lokasi Head Office Lt 2, PIC Tim Teknolab, Monitoring Ping, Prioritas Medium (P2), Tanggal Instalasi 2026-10-01, JSON konfigurasi parameter, dan Uptime 99.8%.
  - Penanganan status offline: label *Last Seen* menampilkan fallback anggun *"Menunggu Koneksi Fisik"* tanpa error script atau nilai `undefined`.
  - Riwayat histori status kronologis tersaji lengkap (Online Normal & Peringatan Restart).
  - Seluruh tombol aksi footer (**Uji Ping Sekarang, Tutup, Cetak QR Tag, Edit Aset, Ubah Status Alat**) ter-render utuh 100% tanpa terpotong batas bawah.
  - *Bukti Otentik*: `2026-10-28_Hari-17_TC-H17-004_device-detail-modal-telemetry.png`

---

### [x] BAGIAN 5: RESOLUSI DEFECT DATABASE & UJI TAMBAH PERANGKAT
- [x] **5.1 Resolusi Missing Column `sub_category` (TC-H17-005 / BUG-H17-DB-001)**
  - Investigasi error 500 saat submit tambah perangkat: `Unknown column 'sub_category' in 'field list'`.
  - Eksekusi DDL alter: `ALTER TABLE assets ADD COLUMN sub_category VARCHAR(150) NULL AFTER category;`.
  - Dump ulang database master ke `database/taims_db.sql`.
  - Uji retest endpoint `POST /api/assets` -> Berhasil merespons `201 Created` (Asset ID 16).
  - *Status*: LULUS & TUNTAS (Verified Fixed).

---

### [x] BAGIAN 6: AUDIT KESIAPAN SERVER PRODUKSI CLOUDPANEL (PRE-DEPLOYMENT)
- [x] **6.1 Verifikasi Akses Host & Domain Resmi**
  - Akun CloudPanel Dzakwan Miftahussobirin (`dzakwanmifta` / `awangtgprofesional@gmail.com`) telah aktif.
  - Virtual Host aplikasi Generic telah didaftarkan dengan domain resmi: **`t-aims.teknolab.biz.id`** (SSH user: `taims-teknolab`).
  - Kredensial server dan database lokal telah tervalidasi sesuai arahan guru pembimbing.
  - Paket rilis master diverifikasi lokal dan siap di-upload ke server VPS CloudPanel.

---

### 🏁 KESIMPULAN AKHIR HARI-17
Seluruh 5 skenario pengujian fungsional, antarmuka, dan integritas database pada Hari ke-17 telah diselesaikan oleh Reza Tri Wardana dengan hasil **100% LULUS (PASS - ZERO DEFECT)**. Sistem T-AIMS telah siap secara mutlak untuk dipublikasikan secara live ke domain `t-aims.teknolab.biz.id`.
