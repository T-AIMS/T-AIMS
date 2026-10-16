# Repositori & Dokumentasi Basis Data Faida Trisma Amelia
**Peran:** Database & Asset Management Engineer (Shift 1)  
**Sumber Repositori Asli:** [faidatrism/T-aims-monitoring-faida](https://github.com/faidatrism/T-aims-monitoring-faida.git)  
**Status Integrasi:** 100% Terintegrasi & Tersinkronisasi dengan Repositori Utama T-AIMS  

---

## 1. Ikhtisar Output Wajib Faida (Sesuai Halaman 8 PDF Teknolab)
Seluruh keluaran teknis Faida Trisma Amelia telah dikonsolidasikan dan dipelihara secara terpadu di repositori utama T-AIMS:

| No | Output Wajib (PDF Hal 8) | Berkas Terintegrasi | Keterangan & Deskripsi |
|:--:|:---|:---|:---|
| 1 | **Database Schema** | [`database/schema.sql`](file:///mnt/d/xampp/htdocs/T-AIMS/database/schema.sql)<br/>[`database/docs/database-schema.md`](file:///mnt/d/xampp/htdocs/T-AIMS/database/docs/database-schema.md) | DDL struktur 7 tabel relasional baku |
| 2 | **Migration / SQL** | [`database/migrations/`](file:///mnt/d/xampp/htdocs/T-AIMS/database/migrations/) | Skrip migrasi terstruktur (`001_add_created_at_to_users.sql`) |
| 3 | **Asset Registry** | [`database/docs/asset-registry.md`](file:///mnt/d/xampp/htdocs/T-AIMS/database/docs/asset-registry.md) | Daftar registri 16 aset resmi dengan mapping IP & MAC |
| 4 | **Backup Procedure** | [`database/docs/backup-restore-procedure.md`](file:///mnt/d/xampp/htdocs/T-AIMS/database/docs/backup-restore-procedure.md)<br/>[`devops/scripts/backup_db.sh`](file:///mnt/d/xampp/htdocs/T-AIMS/devops/scripts/backup_db.sh) | SOP dan otomasi rotasi pencadangan database 7 hari |
| 5 | **Database Documentation** | [`database/docs/database-documentation.md`](file:///mnt/d/xampp/htdocs/T-AIMS/database/docs/database-documentation.md)<br/>[`database/audit_aset.sql`](file:///mnt/d/xampp/htdocs/T-AIMS/database/audit_aset.sql) | Dokumentasi teknis relasi ERD dan kueri audit aset |

---

## 2. Struktur Berkas SQL Terpadu di Folder `database/`
* `schema.sql`: Struktur tabel DDL baku.
* `seed.sql`: Data awal DML untuk pengujian modul.
* `taims_db.sql`: Master full dump (skema 7 tabel, 16 aset, 13 akun pengguna ber-hash Bcrypt, dan kolom `created_at`).
* `audit_aset.sql`: Kueri audit read-only untuk mendeteksi kelengkapan aset tanpa IP, MAC, atau PIC.
* `seed_data_update.sql`: Draf rencana pembaruan IP aset.
* `audit_aset_backup.sql`: Berkas cadangan kueri audit.
* `migrations/`: Berkas migrasi database versi sistem.
