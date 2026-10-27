# DAILY HANDOVER — REZA TRI
**Nama**    : Reza Tri Wardana  
**Tanggal** : 27 Oktober 2026  
**Shift**   : 2 (16.00 - 01.00 WIB)  
**Hari ke** : 16 (Resolusi Responsivitas Layar HP, Simulasi Jaringan 3G, Sanitasi Keamanan Error 404 & Integritas Mesin Pencarian Perangkat)  

**Task**   : Investigasi dan Perbaikan Bug Responsivitas Tampilan Smartphone pada Website T-AIMS (3), Pengujian Simulasi Throttling Jaringan 3G pada DevTools, Verifikasi Menu Profil & Ganti Akun Kanan Atas di Layar HP, Uji Kontainer Scroll Horizontal Tabel 15 Perangkat, Uji Keamanan Sanitasi Error 404 Backend (Zero Data Leakage), dan Pengujian Filter Pencarian Kata Kunci CCTV  
**Status** : Selesai 100% (PASS - Zero Defect & Zero Blocker)  

---

## 1. YANG SUDAH SELESAI HARI INI (HARI-16)

1. **Resolusi Bug Tampilan Mobile & Menu Ganti Akun (`TC-H16-002`, `TC-H16-003`)**:
   - Memperbaiki bug terpotongnya menu ganti akun pada topbar layar HP (<640px) dengan mengunci tombol avatar cyan di sudut kanan atas dan mendesain dropdown menu melayang (*floating card*) yang memuat nama user Reza Tri wardana, role admin, dan tombol *Kembali ke Halaman Masuk / Ganti Akun*.
2. **Pengujian Simulasi Jaringan Lemot 3G (`TC-H16-001`)**:
   - Menjalankan Network Throttling Fast/Slow 3G pada DevTools Chrome, menguji rendering waterfall pemuatan aset, dan memvalidasi penanganan pembatalan tile peta Leaflet (*cancelled requests*) via AbortController tanpa kegagalan antarmuka.
3. **Uji Responsivitas & Horizontal Swipe Tabel Inventarisasi Perangkat (`TC-H16-004`, `TC-H16-005`)**:
   - Menerapkan kontainer scroll horizontal mulus ramah sentuhan pada tabel 15 perangkat MariaDB, memastikan seluruh kolom data (No, Kode Aset, Nama, IP, Lokasi, Status, Aksi) terbaca utuh hingga baris ke-15 (SWM-01 Switch Manageable) tanpa merusak lebar layar smartphone.
4. **Uji Keamanan Sanitasi Error 404 Backend (`TC-H16-006`)**:
   - Menembak endpoint palsu `/api/endpoint-palsu-testing` dan memverifikasi payload response `{"success":false,"error":"Endpoint tidak ditemukan"}` dengan status HTTP 404. Terbukti bebas dari kebocoran struktur folder, stack trace, maupun query database.
5. **Uji Integritas Filter Pencarian Perangkat (`TC-H16-007`)**:
   - Menguji mesin pencarian kata kunci `cctv` yang secara instan dan akurat menyaring tepat 2 unit perangkat CCTV tanpa kesalahan data.

---

## 2. STATUS SISTEM & METRIK KINERJA

- **Total Test Cases Dieksekusi:** 7 TC (100% PASS, 0 FAIL, 0 BLOCKED).
- **Status Responsivitas UI:** 100% Responsif di Desktop (1080p), Tablet (768p), dan Smartphone (375p - 434p).
- **Status Keamanan Server Backend:** Zero Data Leakage terverifikasi pada error 404.
- **Kondisi Backend & Database:** Port 3000 & Port 3306 aktif stabil dengan 15 data aset riil.
- **Status Kesiapan Pre-Deploy:** 100% Siap Rilis ke Server Produksi CloudPanel/VPS.

---

## 3. YANG PERLU DILANJUTKAN SHIFT BERIKUTNYA (HARI-17)

- Meminta akses kredensial login CloudPanel/VPS kepada guru pembimbing.
- Melakukan deployment kode backend dan static frontend ke CloudPanel.
- Konfigurasi reverse proxy Nginx dan SSL Let's Encrypt pada domain resmi `taims.teknolab.id`.
- Menjalankan Smoke Test dan Regression Test akhir pasca deployment live.

---

## 4. LOG DOKUMENTASI & ARTIFAK

- Checklist Harian: `docs/qa/Checklist_Harian_2026-10-27_Hari-16.md`
- Laporan Pengujian Resmi: `docs/qa/test-reports/2026-10-27_Hari-16.md`
- Master Tracker: `docs/qa/Tracker_Harian_Reza.csv` (Baris 16: 7 TC PASS, Status: Sudah)
- Master Test Cases: `docs/qa/01_Master_Test_Cases.xlsx` (Baris 112–118 terisi lengkap dengan hyperlink aktif)
- Bukti Screenshot: `docs/qa/evidence/screenshots/Hari-16/` (7 screenshot otentik hasil tangkapan Reza Tri Wardana)
