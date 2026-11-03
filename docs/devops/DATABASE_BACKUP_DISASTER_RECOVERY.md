# SOP & Dokumentasi Otomasi Backup Harian Basis Data MySQL T-AIMS
**Sistem:** T-AIMS (Teknolab Asset & Infrastructure Monitoring System)  
**Divisi:** DevOps, Server & Network Security  
**Insinyur Pelaksana:** Wafian Zaidan  
**Tanggal Rilis:** 3 November 2026 (Hari ke-23)  

---

## 1. Latar Belakang & Tujuan
Basis data MySQL T-AIMS (`taims-db` / `taims_db`) menyimpan seluruh aset telemetri server, log insiden, riwayat downtime perangkat, akun RBAC tim, serta token notifikasi. Untuk menjamin kelangsungan bisnis (*Business Continuity*) dan kepatuhan standar *Disaster Recovery* (DR), sistem otomasi pencadangan harian (*daily automated hot-backup*) diimplementasikan langsung pada tingkat server VPS CloudPanel.

### Target Spesifikasi:
1. **Zero Downtime (Hot Backup):** Menggunakan mode `--single-transaction` dan `--skip-lock-tables` pada `mysqldump` sehingga database tetap dapat membaca dan menulis transaksi monitoring tanpa freeze/lag.
2. **Efisiensi Storage (Gzip Level 9):** Dump SQL dikompresi langsung secara on-the-fly dengan `gzip -9` menghemat hingga 85%+ ruang penyimpanan disk VPS.
3. **Siklus Retensi 7 Hari:** Otomasi membersihkan berkas backup yang berusia lebih dari 7 hari (`-mtime +7`) untuk menjaga ketersediaan free space disk CloudPanel.
4. **Audit Trail & Logging:** Seluruh aktivitas backup, ukuran file, timestamp, dan rotasi retensi dicatat pada berkas log terpusat `/home/taims-teknolab/backups/backup.log`.
5. **Prosedur Pemulihan Cepat (RTO < 5 Menit):** Dilengkapi skrip pemulihan cepat `restore-database.sh`.

---

## 2. Struktur Berkas & Direktori

```text
/home/taims-teknolab/
├── backups/
│   ├── backup.log                       # Log histori pencadangan harian & rotasi
│   └── mysql/                           # Direktori arsip berkas .sql.gz
│       ├── taims_db_backup_2026-11-03_020000.sql.gz
│       └── ...
└── taims-backend/
    └── src/
        └── scripts/
            ├── backup-database.sh       # Script eksekutor backup & rotasi retensi
            └── restore-database.sh      # Script pemulihan cepat (Disaster Recovery)
```

---

## 3. Detail Script Otomasi

### A. Skrip Pencadangan: `backup-database.sh`
- **Path:** `~/taims-backend/src/scripts/backup-database.sh`
- **Fitur Utama:**
  - Otomatis membaca kredensial database (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`) dari file `.env`.
  - Mengamankan password dari terminal CLI menggunakan environment injection `MYSQL_PWD`.
  - Menghasilkan berkas terkompresi berformat: `${DB_NAME}_backup_YYYY-MM-DD_HHMMSS.sql.gz`.
  - Menghapus arsip berusia di atas 7 hari:
    ```bash
    find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
    ```
  - Menghasilkan ringkasan storage dan arsip aktif di console & log.

### B. Skrip Pemulihan: `restore-database.sh`
- **Path:** `~/taims-backend/src/scripts/restore-database.sh`
- **Penggunaan:**
  ```bash
  /bin/bash ~/taims-backend/src/scripts/restore-database.sh /home/taims-teknolab/backups/mysql/taims_db_backup_2026-11-03_020000.sql.gz
  ```

---

## 4. Konfigurasi Jadwal Otomasi (Cron Job)

Pencadangan dijalankan otomatis setiap hari pada pukul **02:00 WIB dini hari** (saat trafik telemetri jaringan berada pada titik terendah).

### Pemasangan via CloudPanel UI:
1. Masuk ke dasbor CloudPanel: `Site > t-aims.teknolab.biz.id > Cron Jobs`
2. Klik tombol **Add Cron Job**
3. Masukkan parameter:
   - **Minute:** `0`
   - **Hour:** `2`
   - **Day:** `*`
   - **Month:** `*`
   - **Weekday:** `*` (Jadwal: `0 2 * * *`)
   - **Command:**
     ```bash
     /bin/bash /home/taims-teknolab/taims-backend/src/scripts/backup-database.sh > /dev/null 2>&1
     ```

### Pemasangan via Terminal SSH (Alternatif Crontab):
```bash
crontab -e
# Tambahkan baris berikut di baris paling bawah:
0 2 * * * /bin/bash /home/taims-teknolab/taims-backend/src/scripts/backup-database.sh > /dev/null 2>&1
```

---

## 5. Pengujian Manual & Verifikasi

Untuk memvalidasi skrip di server VPS CloudPanel:
```bash
cd ~/taims-backend
bash src/scripts/backup-database.sh
```

**Verifikasi Output:**
1. Cek berkas hasil pencadangan:
   ```bash
   ls -lh /home/taims-teknolab/backups/mysql/
   ```
2. Cek histori log:
   ```bash
   cat /home/taims-teknolab/backups/backup.log
   ```
