# DAILY HANDOVER — REZA TRI
**Nama**    : Reza Tri Wardana  
**Tanggal** : Rabu, 28 Oktober 2026  
**Shift**   : 2 (16.00 - 01.00 WIB)  
**Hari ke** : 17 (Verifikasi Detail Spesifikasi Perangkat, Tata Letak Donut Vertikal, Katalog Hardware 181+ Model, Perbaikan Skema Database Tambah Perangkat & Kesiapan Live Deployment CloudPanel)  
**Role**    : Lead QA & Documentation Engineer  
**Task**    : Pengujian Fungsional Modal Detail Perangkat (TC-H17-004), Verifikasi Tata Letak Diagram Donut Kategori dan Angka Sejajar Vertikal (TC-H17-001), Uji Form Tambah Perangkat & Dropdown Kategori Berjenjang (TC-H17-002), Uji Katalog Hardware 181+ Model dan Dialog Konfirmasi Cyberpunk (TC-H17-003), Investigasi & Resolusi Defect Database Kolom `sub_category` (TC-H17-005), serta Audit Kesiapan Domain Live CloudPanel `t-aims.teknolab.biz.id`  
**Status**  : Selesai 100% (PASS - Zero Defect & Zero Blocker)  

---

## 1. YANG SUDAH SELESAI HARI INI (HARI-17)

1. **Verifikasi Diagram Donut & Legenda Sejajar Vertikal (`TC-H17-001`)**:
   - Berhasil memvalidasi tampilan diagram donat distribusi kategori perangkat: lingkaran donut 115px terpusat di sisi kiri kartu dengan angka tengah tebal putih "15 Perangkat".
   - Kolom legenda kategori di sisi kanan memiliki nama kategori, angka unit (putih), dan persentase oranye yang tegak lurus sejajar vertikal tanpa tumpang tindih (*zero overlapping*).
2. **Uji Form Tambah Perangkat & Kategori Dinamis (`TC-H17-002`)**:
   - Memvalidasi form penambahan aset baru dengan kolom Kode Aset kosong bawaan (*clean placeholder*) yang siap diketik.
   - Dropdown memuat 10 kategori perangkat lengkap dengan opsi dinamis `+ Tambah Kategori Baru (Ketik Manual)...` untuk fleksibilitas inventaris.
3. **Uji Preset Katalog Hardware Industri 181+ Model (`TC-H17-003`)**:
   - Memvalidasi integrasi katalog tipe hardware industri (Router, Switch, IoT Node ESP32/Arduino/Sensor) yang otomatis beradaptasi dengan kategori terpilih.
   - Fitur proteksi tombol *Hapus Kategori* & *Reset Bawaan* berjalan sempurna dengan dialog konfirmasi keamanan bertema *Cyberpunk*.
4. **Uji Fungsional Modal Detail Perangkat CCTV-01 (`TC-H17-004`)**:
   - Memvalidasi modal detail spesifikasi aset dengan 12 parameter utuh (IP 192.168.1.39, MAC B8:AB:CA:FC:30:AC, Lokasi Lantai 2 Head Office, PIC Tim Teknolab, Uptime 99.8%, JSON konfigurasi parameter).
   - Penanganan status offline yang elegan (*graceful offline handling*) dengan label *Last Seen* menampilkan *"Menunggu Koneksi Fisik"*.
   - Seluruh 5 tombol aksi di footer (**Uji Ping Sekarang, Tutup, Cetak QR Tag, Edit Aset, Ubah Status Alat**) tampil utuh tanpa terpotong batas bawah viewport.
5. **Resolusi Defect Skema Database Tambah Perangkat (`TC-H17-005`)**:
   - Menginvestigasi kendala error 500 saat tambah perangkat (`Unknown column 'sub_category' in 'field list'`).
   - Melakukan DDL patch pada database MySQL/MariaDB `taims_db`: `ALTER TABLE assets ADD COLUMN sub_category VARCHAR(150) NULL AFTER category;`.
   - Melakukan verifikasi ulang via API `POST /api/assets` -> Berhasil merespons `201 Created` (ID: 16).
   - Memperbarui file dump resmi database master pada `database/taims_db.sql`.
6. **Audit Kesiapan Server CloudPanel & Kredensial (`t-aims.teknolab.biz.id`)**:
   - Mengonfirmasi akun CloudPanel Dzakwan Miftahussobirin (`dzakwanmifta`) telah aktif.
   - Mengonfirmasi virtual host Generic untuk domain `t-aims.teknolab.biz.id` telah dibuat dengan SSH user `taims-teknolab`.
   - Mengklarifikasi penggunaan kredensial server dan database lokal sesuai arahan instruktur/guru pembimbing.
7. **Konsolidasi Struktur Berkas QA & Repositori GitHub**:
   - Menghapus folder usang yang tidak diperlukan (`docs/qa`).
   - Menyatukan seluruh berkas QA (Handover 1-17, Test Reports 1-17, Checklists 9-17, Postman Collection, Master Test Cases, dan Evidence Screenshots) ke dalam folder master `qa-testing/` dan salinan `docs/qa-testing/`.
   - Melakukan sinkronisasi commit dan push bersih ke repositori GitHub `origin/main`.

---

## 2. STATUS SISTEM & METRIK KINERJA

- **Total Test Cases Dieksekusi:** 5 TC (100% PASS, 0 FAIL, 0 BLOCKED).
- **Defect Ditemukan & Dituntaskan:** 1 Bug Skema Database (`sub_category` column missing) -> **RESOLVED & VERIFIED**.
- **Status Database:** Master DB MariaDB/MySQL `taims_db` aktif di port 3306, sinkron dengan 16 aset dan 11 akun pengguna. File dump terbaru tersimpan di `database/taims_db.sql`.
- **Status Backend:** Port 3000 aktif stabil terhubung ke database.
- **Status Frontend:** Port 5500 aktif melayani antarmuka web responsif.
- **Status Kesiapan Live Deployment:** 100% Siap Upload ke CloudPanel VPS (`t-aims.teknolab.biz.id`).

---

## 3. YANG PERLU DILANJUTKAN SHIFT BERIKUTNYA (HARI-18)

1. Melakukan transfer/upload paket rilis `project T-AIMS` ke server VPS CloudPanel melalui SFTP (`taims-teknolab`).
2. Konfigurasi service manager (PM2 / Systemd) untuk menjalankan backend Express.js di server produksi.
3. Konfigurasi dan aktivasi sertifikat SSL Let's Encrypt pada domain `https://t-aims.teknolab.biz.id`.
4. Eksekusi Smoke Test Live pertama pasca deployment di internet publik.

---

## 4. LOG DOKUMENTASI & ARTIFAK

- **Checklist Harian**: [`qa-testing/Checklist_Harian_2026-10-28_Hari-17.md`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/Checklist_Harian_2026-10-28_Hari-17.md)
- **Laporan Pengujian Resmi**: [`qa-testing/test-reports/2026-10-28_Hari-17.md`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/test-reports/2026-10-28_Hari-17.md)
- **Master Tracker**: [`qa-testing/Tracker_Harian_Reza.csv`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/Tracker_Harian_Reza.csv) (Baris 18: 5 TC PASS, Status: Sudah)
- **Koleksi API Postman**: [`qa-testing/postman/T-AIMS API - 58 Endpoints.postman_collection.json`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/postman/T-AIMS%20API%20-%2058%20Endpoints.postman_collection.json)
- **Bukti Screenshot Otentik**: [`qa-testing/evidence/screenshots/Hari-17/`](file:///C:/Users/ThinkPad/Documents/project%20T-AIMS/qa-testing/evidence/screenshots/Hari-17/) (4 tangkapan layar otentik Reza Tri Wardana):
  1. `2026-10-28_Hari-17_TC-H17-001_donut-chart-legend-alignment.png`
  2. `2026-10-28_Hari-17_TC-H17-002_add-device-category-selection.png`
  3. `2026-10-28_Hari-17_TC-H17-003_add-device-hardware-presets.png`
  4. `2026-10-28_Hari-17_TC-H17-004_device-detail-modal-telemetry.png`
