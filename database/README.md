# Database T-AIMS (Dzakwan)

**Sumber Utama:** `taims_db_master.sql` (15 aset, 11 user)

## Struktur Folder

| Folder/File | Deskripsi | Sumber |
|:---|:---|:---|
| `taims_db.sql` | Skema + data lengkap | Dzakwan |
| `taims_db_master.sql` | Skema + data lengkap (master) | Dzakwan |
| `migrations/` | Skrip migrasi database | Repo T-AIMS (Faida) |
| `docs/` | Dokumentasi database | Repo T-AIMS (Faida) |
| `backups/` | Arsip backup database | Repo T-AIMS (Wafian) |

## Catatan

- **Database Utama:** Gunakan `taims_db_master.sql` untuk import ke container `taims-mysql`.
- **Migrasi:** Folder `migrations/` berisi perubahan skema (created_at, token_blacklist).
- **Dokumentasi:** Folder `docs/` berisi dokumentasi ERD, asset registry, dan prosedur backup.
- **Backup:** Folder `backups/` berisi arsip backup historis (retensi 7 hari).
