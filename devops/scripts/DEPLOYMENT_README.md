# Panduan Otomasi Deployment T-AIMS ke CloudPanel

**Penanggung Jawab:** Wafian (DevOps, Server & Security Engineer - Shift 2)  
**Referensi:** [`devops/docs/cloudpanel-deployment-runbook.md`](file:///mnt/d/T-AIMS/devops/docs/cloudpanel-deployment-runbook.md)  
**Skrip Eksekusi:** [`devops/scripts/deploy-to-cloudpanel.sh`](file:///mnt/d/T-AIMS/devops/scripts/deploy-to-cloudpanel.sh)

---

## 1. Ikhtisar Skrip

Skrip `deploy-to-cloudpanel.sh` adalah skrip otomasi *end-to-end* untuk mendistribusikan sistem **T-AIMS** (*Teknolab Asset & Infrastructure Management System*) ke lingkungan produksi berbasis **CloudPanel (Ubuntu 22.04 LTS / Debian 11/12)**. 

Skrip ini dirancang *plug-and-play* untuk menyelesaikan seluruh proses instalasi, konfigurasi, migrasi basis data, dan aktivasi layanan dalam waktu **kurang dari 10 menit**.

---

## 2. Prasyarat Sistem

Sebelum menjalankan skrip deployment, pastikan server memenuhi kriteria berikut:
1. **Akses SSH Server:** Hak akses `sudo` / root ke server CloudPanel.
2. **Domain & DNS:** Domain resmi (misal `taims.teknolab.id`) sudah di-pointing (**A-Record**) ke alamat IP publik server.
3. **Paket Dasar Terpasang:**
   * Node.js v18.x atau v20.x LTS & npm.
   * MySQL 8.0 Server (kredensial root tersedia).
   * Nginx Web Server.
4. **Port Jaringan Dibuka (Firewall/UFW):**
   * Port `80` (HTTP) & `443` (HTTPS).
   * Port `1883` (MQTT TCP telemetri perangkat IoT).
   * Port `22` (SSH).

---

## 3. Variabel Konfigurasi

Variabel konfigurasi dapat disesuaikan langsung di dalam file skrip atau dilewatkan sebagai variabel lingkungan (*environment variables*):

| Variabel | Nilai Default | Keterangan |
| :--- | :--- | :--- |
| `DOMAIN` | `taims.teknolab.id` | Domain utama aplikasi |
| `DB_NAME` | `taims_db` | Nama database MySQL |
| `DB_USER` | `taims_user` | Nama pengguna database |
| `DB_PASS` | `Taims_Teknolab_2026_Secure!` | Kata sandi pengguna database |
| `DB_ROOT_PASS` | `""` (Kosong / Prompt interaktif) | Kata sandi root MySQL server |
| `APP_DIR` | `/home/taims-prod/htdocs` | Lokasi direktori aplikasi di server |
| `BACKUP_DIR` | `/var/backups/taims` | Direktori penyimpanan berkas backup |
| `LOG_DIR` | `/var/log/taims` | Direktori log sistem terpusat |
| `REPO_URL` | `https://github.com/T-AIMS/T-AIMS.git` | URL repositori resmi T-AIMS |

---

## 4. Langkah-Langkah Menjalankan Deployment

### Langkah 1: Hubungkan ke Server via SSH
```bash
ssh user@ip-server-cloudpanel
```

### Langkah 2: Unduh / Buat Skrip di Server
Jika repositori belum di-clone:
```bash
git clone https://github.com/T-AIMS/T-AIMS.git /tmp/T-AIMS-DEPLOY
cd /tmp/T-AIMS-DEPLOY/devops/scripts
```

### Langkah 3: Berikan Izin Eksekusi
```bash
chmod +x deploy-to-cloudpanel.sh
```

### Langkah 4: Jalankan Skrip Otomasi
* **Mode Interaktif / Default:**
  ```bash
  ./deploy-to-cloudpanel.sh
  ```
* **Mode Custom Domain & Password:**
  ```bash
  DOMAIN="taims.teknolab.id" DB_PASS="RahasiaSuperKuat2026!" ./deploy-to-cloudpanel.sh
  ```

---

## 5. Rincian 8 Tahapan Otomasi

1. **[1/8] Persiapan Direktori Produksi:** Membuat struktur direktori `$APP_DIR`, `$BACKUP_DIR`, dan `$LOG_DIR` dengan izin hak akses aman (755 dan 700).
2. **[2/8] Sinkronisasi Repositori GitHub:** Melakukan git clone atau pull commit terbaru dari cabang `main`.
3. **[3/8] Setup Basis Data MySQL:** Membuat database, membuat user `taims_user`, mengatur hak akses, lalu mengimpor `database/schema.sql` dan `database/seed.sql`.
4. **[4/8] Setup Backend Node.js & PM2:** Memasang dependensi produksi (`npm install --production`), menginjeksi berkas `.env` dengan kredensial aman (JWT, DB, MQTT, Telegram, SMTP), dan mendaftarkan proses ke daemon **PM2** agar otomatis aktif saat reboot.
5. **[5/8] Verifikasi Frontend Statis:** Memvalidasi keberadaan `frontend/index.html` dan aset terkait.
6. **[6/8] Setup Mosquitto MQTT Broker:** Memasang Mosquitto, mengatur listener TCP port `1883` dan WebSocket port `9001`, membuat kredensial `taims-broker:taims-mqtt-2026`, lalu menjalankan service.
7. **[7/8] Setup Nginx Reverse Proxy:** Mengonfigurasi Nginx vhost dengan perutean:
   * `/` &rarr; Frontend Static SPA Fallback.
   * `/api/` &rarr; Backend Express.js (Port `3000`).
   * `/mqtt` &rarr; Mosquitto WebSocket (Port `9001`).
   * Injeksi OWASP Security Headers (`X-Frame-Options`, `X-Content-Type-Options`, dll).
8. **[8/8] Penerbitan SSL Let's Encrypt:** Mengamankan domain target menggunakan Certbot otomatis (*Auto HTTPS Redirect*).

---

## 6. Verifikasi Pasca-Deployment (*Smoke Testing*)

Setelah skrip selesai, lakukan pengujian untuk memastikan semua modul berjalan normal:

```bash
# 1. Cek status proses backend PM2
pm2 status

# 2. Cek endpoint kesehatan API Backend
curl -I http://127.0.0.1:3000/api/monitoring/health

# 3. Cek status service Mosquitto MQTT
sudo systemctl status mosquitto

# 4. Uji koneksi database MySQL
mysql -u taims_user -p'Taims_Teknolab_2026_Secure!' -e "USE taims_db; SELECT COUNT(*) FROM assets;"

# 5. Uji akses domain publik
curl -I https://taims.teknolab.id/
```

---

## 7. Pemecahan Masalah (*Troubleshooting*)

* **Backend Error / Crash:**
  ```bash
  pm2 logs taims-backend --lines 50
  ```
* **Nginx Konfigurasi Gagal:**
  ```bash
  sudo nginx -t
  sudo tail -n 50 /var/log/nginx/error.log
  ```
* **Mosquitto MQTT Tidak Bisa Terhubung:**
  ```bash
  sudo tail -n 50 /var/log/mosquitto/mosquitto.log
  ```
* **Restart Semua Layanan T-AIMS:**
  ```bash
  pm2 restart taims-backend
  sudo systemctl restart mosquitto nginx
  ```
