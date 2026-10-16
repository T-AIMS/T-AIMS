# Buku Log Pencadangan Basis Data T-AIMS (*Database Backup Log*)
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer*)  
**Pembaruan Terakhir:** 16 Oktober 2026 (Shift 2)  
**Kebijakan Retensi:** Rotasi otomatis 7 hari (*Auto-pruning*)  
**Jadwal Otomasi Cron:** Pukul 02.00 WIB setiap hari (`0 2 * * * /mnt/d/xampp/htdocs/T-AIMS/scripts/backup-db.sh >> /mnt/d/xampp/htdocs/T-AIMS/logs/backup.log 2>&1`)

---

## 1. Kebijakan & Standar Pencadangan
* **Direktori Penyimpanan:** `database/backups/`
* **Format Penamaan File:** `taims_db_backup_YYYYMMDD_HHMMSS.sql`
* **Metode Pencadangan:**
  1. *Containerized*: Eksekusi otomatis `docker exec taims-mysql mysqldump` jika layanan database berada di dalam container.
  2. *Host Native*: Eksekusi otomatis via binary `mysqldump` (Linux / XAMPP Windows).
* **Mekanisme Failover & Logging:** Setiap proses pencadangan tercatat secara terpusat pada `logs/backup.log`.

---

## 2. Riwayat Pencadangan Terverifikasi

| Tanggal & Waktu | Nama Berkas Backup | Ukuran | Status | Keterangan & Metode |
|:---|:---|:---:|:---:|:---|
| 2026-10-15 12:17 WIB | `taims_db_PRE_MERGE_20261015_121717.sql` | 165 KB | ✅ Sukses | Snapshot pra-evaluasi Merge Phase (16 aset, skema 7 tabel) |
| 2026-10-14 23:59 WIB | `taims_db_2026-10-14.sql` | 164 KB | ✅ Sukses | Pencadangan harian Shift 2 (Faida & Wafian) |
| 2026-10-13 23:59 WIB | `backup_taims_2026-10-13.sql` | 160 KB | ✅ Sukses | Pencadangan berkala baseline integrasi awal |
| 2026-10-16 20:34 WIB | `taims_db_backup_20261016_203429.sql` | - | ✅ Teruji | Pengujian otomatis skrip `devops/scripts/backup_db.sh` & wrapper cron |

---

## 3. Prosedur Pemulihan Cepat (*Quick Restore*)
Untuk memulihkan data dari berkas cadangan:
```bash
# 1. Melalui Container Docker
docker exec -i taims-mysql mysql -u root -p"$DB_PASS" taims_db < database/backups/<NAMA_FILE>.sql

# 2. Melalui Host CLI
mysql -h 127.0.0.1 -u root taims_db < database/backups/<NAMA_FILE>.sql
```
