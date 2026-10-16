# Panduan Penanganan Gangguan & Pemulihan Sistem (Disaster Recovery SOP)
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer*)  
**Pembaruan Terakhir:** 16 Oktober 2026 (Shift 2)  
**Status:** Teruji & Siap Operasional

---

## 1. Pengoperasian Sistem & Perlindungan Data Terpadu

### A. Prosedur Pencadangan Rutin (Backup)
Pencadangan database dilakukan secara berkala dan otomatis menggunakan skrip portabel dinamis:
```bash
# Eksekusi pencadangan manual atau via cron job
bash devops/scripts/backup_db.sh
```
* **Lokasi Arsip:** `database/backups/taims_db_backup_YYYYMMDD_HHMMSS.sql`
* **Kebijakan Retensi:** Skrip secara otomatis mempertahankan cadangan 7 hari terakhir dan menghapus arsip usang untuk menghemat ruang penyimpanan.
* **Integritas Data:** Memastikan struktur 7 tabel (`assets`, `incidents`, `locations`, `maintenance`, `monitoring_logs`, `notifications`, `users`) dan data 16 aset utama terlindungi.

### B. Prosedur Pemulihan Basis Data (Restore)
Jika terjadi anomali data, korupsi data, atau insiden pada database:
```bash
# 1. Masuk ke direktori proyek
cd /mnt/d/xampp/htdocs/T-AIMS

# 2. Impor berkas cadangan terbaru ke database MySQL
mysql -u root taims_db < database/backups/taims_db_backup_[TIMESTAMP].sql

# 3. Verifikasi jumlah data aset
mysql -u root -e "USE taims_db; SELECT COUNT(*) AS total_assets FROM assets;"
```

---

## 2. Penanganan Gangguan Terpadu (Incident Response SOP)

Sistem T-AIMS mengintegrasikan deteksi kegagalan waktu-nyata melalui Last Will and Testament (LWT) MQTT, checker otomatis backend, dan engine otomasi notifikasi multi-kanal (Telegram & Email).

### Matriks Penanganan Insiden Operasional
| Jenis Gangguan | Gejala Sistem | Prosedur Pemulihan Langsung | Eskalasi Notifikasi |
| :--- | :--- | :--- | :--- |
| **Perangkat IoT / ESP32 Terputus** | Status aset berubah `offline`, heartbeat terhenti > 60 detik | 1. Cek pasokan daya & koneksi Wi-Fi fisik.<br/>2. Cek log simulator jika mode simulasi.<br/>3. Tunggu sinyal heartbeat pulih. | Alert otomatis terkirim via Telegram & Email. Saat pulih, notifikasi Recovery otomatis dikirim. |
| **MQTT Broker (Mosquitto) Macet** | Log `Connection refused`, port 1883 tidak merespons | 1. Cek status container: `docker ps`<br/>2. Jalankan: `docker restart taims-mosquitto`<br/>3. Pastikan tidak ada service native yang memblokir port 1883. | Notifikasi warning pada service log devops. |
| **Backend REST API Mati** | Frontend menampilkan status koneksi gagal (Port 3000 tertutup) | 1. Jalankan skrip launcher: `devops\scripts\start_services.bat`<br/>2. Pilih opsi [1] atau [3].<br/>3. Verifikasi: `curl http://localhost:3000/api/monitoring/health` | Insiden tercatat di log backend dan dashboard. |
| **Frontend Web Tidak Terakses** | Port 3001 tidak mendengarkan | Jalankan: `devops\scripts\start_services.bat` (Opsi [2] atau [3]), atau via Docker: `docker compose up -d frontend`. | Operator langsung memulihkan proses static server. |
| **n8n Automation Tidak Mengirim Notifikasi** | Alert tidak masuk ke Telegram / Email | 1. Restart container: `docker restart taims-n8n`<br/>2. Cek kredensial SMTP Gmail dan Telegram Bot token di `http://localhost:5678`. | Periksa n8n Execution History. |

---

## 3. Evaluasi Keamanan Akses & Pengerasan Infrastruktur (Security Hardening)

Untuk menjamin keamanan operasional sesuai standar PKL, langkah pengerasan berikut telah dievaluasi dan diimplementasikan:

1. **Eliminasi Form Login Bypass:**
   - Telah menghapus bypass autentikasi di `frontend/index.html`.
   - Mengosongkan isian hardcoded password dan menerapkan validasi ketat token JWT dari backend API.
2. **Isolasi Port & Jaringan:**
   - Port database (3306) dibatasi hanya untuk koneksi internal localhost dan bridge network Docker.
   - Broker MQTT mendukung autentikasi terenkripsi (`passwd` file) untuk mencegah akses tidak sah dari luar jaringan.
3. **Kesiapan Reverse Proxy & HTTPS:**
   - Tersedia arsitektur reverse proxy Nginx (`devops/nginx/nginx.conf`) untuk mengenkripsi seluruh jalur komunikasi via SSL/TLS (HTTPS Port 443).
   - Skrip otomasi sertifikat SSL siap pakai di `devops/scripts/setup_ssl.sh`.
4. **Daemon Pengawasan Mandiri:**
   - Service systemd `taims-monitoring.service` berjalan terus-menerus untuk mendeteksi matinya layanan secara proaktif.

---

## 4. Rangkuman Verifikasi Pemulihan Sistem
Setelah proses penanganan gangguan selesai, jalankan audit master:
```bash
python3 integration-management/verify_integration.py
```
**Kriteria Sukses Operasional:** 15/15 item pengujian berstatus `[OK]` (100% HIJAU).
