# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab*

---

# DAILY HANDOVER

**Nama:** Wafian Zaidan  
**Tanggal:** 28 Oktober 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB)  

**Task:**  
Resolusi Skema Database Master `sub_category`, Konfigurasi CORS & Reverse Proxy Domain Produksi CloudPanel (`t-aims.teknolab.biz.id`)

**Status:**  
Selesai 100% (DONE - Zero Defect & Zero Blocker)

---

### Yang sudah selesai:
1. **Resolusi Skema Database & Master Dump (`sub_category` & `password_resets`):**
   - Mengatasi kendala fatal *Error 500* saat penginputan perangkat baru akibat ketiadaan kolom `sub_category` pada tabel `assets`.
   - Menjalankan DDL migrasi SQL: `ALTER TABLE assets ADD COLUMN sub_category VARCHAR(150) NULL AFTER category;`.
   - Merestorasi skema tabel `password_resets` dan menyinkronkan seluruh topologi aset fisik ke dalam master database `database/taims_db.sql`.
   - Menguji endpoint backend `POST /api/assets` hingga sukses mengembalikan respon HTTP 201 Created (Asset ID 16).

2. **Pengamanan Whitelist CORS Backend CloudPanel:**
   - Menghapus wildcard origin yang tidak aman pada middleware CORS Express.js di `taims-backend/src/app.js`.
   - Mendaftarkan domain resmi produksi `https://t-aims.teknolab.biz.id` ke dalam whitelist `allowedOrigins` untuk mencegah serangan CSRF/Cross-Origin abuse.

3. **Auto-Detection Protokol HTTPS / Reverse Proxy Frontend:**
   - Menyempurnakan modul `apiService.js` pada frontend agar mendeteksi protokol HTTPS dan header reverse proxy Nginx CloudPanel secara otomatis (`window.location.origin`).
   - Mencegah terjadinya *Mixed Content Warning* saat browser memanggil API backend melalui domain HTTPS resmi.

4. **Audit Pra-Deployment Server Produksi CloudPanel:**
   - Memverifikasi kredensial akses SSH user `taims-teknolab` pada VPS CloudPanel IP `45.198.155.203` (Port 2222).
   - Memastikan struktur direktori `/home/taims-teknolab/htdocs/t-aims.teknolab.biz.id/` siap menampung paket rilis master frontend dan backend.

---

### Yang belum selesai:
1. Tidak ada (Semua target penguatan database, CORS, dan konfigurasi proxy selesai 100%).

---

### Kendala:
1. Endpoint `POST /api/assets` sempat menghasilkan *Internal Server Error (500)* saat form tambah perangkat disubmit karena kolom `sub_category` belum terdaftar di DDL tabel. Kendala berhasil diatasi tuntas melalui eksekusi migrasi DDL pada MySQL lokal dan sinkronisasi file dump master.

---

### Next Action:
1. Melakukan rilis live penuh aplikasi T-AIMS ke server VPS CloudPanel bersama tim Shift 2.
2. Memverifikasi sertifikat SSL Let's Encrypt dan pengujian telemetri real-time 18 perangkat pada domain live `https://t-aims.teknolab.biz.id`.

---

### File / Commit / Evidence:
- **Repositori:** `https://github.com/T-AIMS/T-AIMS` (Branch: `main`)
- **Git Commit:**
  * `1c4fed1`: *fix(db): restore verified schema (password_resets, sub_category) and live Marketing Office topology*
  * `9e3d708`: *feat(assets): include sub_category in asset query list, creation, and update*
  * `248563f`: *fix(cors): whitelist https://t-aims.teknolab.biz.id in backend CORS allowedOrigins*
  * `45fecac`: *fix(frontend): support HTTPS/reverse-proxy BASE_URL auto-detection for CloudPanel production*
- **File Konfigurasi & Database:**
  * `database/taims_db.sql`
  * `taims-backend/src/app.js`
  * `taims-backend/src/routes/assets.js`
  * `frontend/assets/js/apiService.js`
- **Bukti Screenshot Otentik (Folder `docs/qa-testing/evidence/screenshots/Hari-17/`):**
  * `2026-10-28_Hari-17_TC-H17-001_donut-chart-legend-alignment.png`
  * `2026-10-28_Hari-17_TC-H17-002_add-device-category-selection.png`
  * `2026-10-28_Hari-17_TC-H17-003_add-device-hardware-presets.png`
  * `2026-10-28_Hari-17_TC-H17-004_device-detail-modal-telemetry.png`
