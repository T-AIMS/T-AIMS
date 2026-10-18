# STANDARD OPERATING PROCEDURE (SOP) & RUNBOOK
## PRODUCTION DEPLOYMENT SERVER CLOUDPANEL T-AIMS

```
========================================================================================
SISTEM              : T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
DOKUMEN KEPATUHAN   : Dokumen Kerja PKL T-AIMS Teknolab 30 Hari (Hal. 4, 12, 13, 14, 15, 20)
PENANGGUNG JAWAB    : Wafian Zaidan El Y. (DevOps, Server & Security Engineer - Shift 2)
TARGET PLATFORM     : CloudPanel v2 (OS: Ubuntu 22.04 LTS / Debian 11/12)
TANGGAL PENYUSUNAN  : 18 Oktober 2026 (Shift 2)
KLASIFIKASI DOKUMEN : Internal Engineering Runbook / SOP Operasional
STATUS KESIAPAN     : 100% Siap Eksekusi (Production Ready & Plug-and-Play)
========================================================================================
```

---

## 1. Ikhtisar & Tujuan Dokumen

### 1.1 Latar Belakang
Berdasarkan arahan mentor dan koordinasi tim pengembang, server produksi utama sistem **T-AIMS** akan dikelola menggunakan **CloudPanel** (Control Panel berbasis Nginx, Node.js, PHP, dan MySQL berkinerja tinggi). Sembari menunggu akun kredensial akses panel diserahkan secara resmi oleh pihak mentor setelah tahapan review antarmuka web, tim DevOps menyusun **SOP & Runbook Deployment Server CloudPanel** ini sebagai panduan baku operasional (*Standard Operating Procedure*).

### 1.2 Tujuan Utama
1. **Zero-Downtime & Plug-and-Play:** Menjamin proses deployment seluruh modul T-AIMS (Frontend, Backend REST API, Database MySQL, dan MQTT Broker) dapat diselesaikan dalam waktu kurang dari **15 menit** segera setelah kredensial akses diberikan.
2. **Kepatuhan Matriks Dokumen Teknolab:** Memenuhi seluruh indikator kesiapan produksi sesuai **Dokumen Kerja PKL 30 Hari**:
   - *Security Checklist & OWASP Hardening* (Hal. 12).
   - *Backup Otomatis & Log Retention* (Hal. 13 & 14).
   - *Service Reliability & Health Monitoring* (Hal. 4 & 15).
   - *Manajemen Kredensial Rahasia (.env)* (Hal. 20).
3. **Dokumentasi Baku & Pertanggungjawaban Ujian:** Menjadi bukti konkret kesiapan teknis peran Wafian sebagai *DevOps & Security Engineer* dalam menjawab penguji dan mentor.

---

## 2. Arsitektur Deployment Berbasis CloudPanel

Sistem T-AIMS di lingkungan CloudPanel dirancang menggunakan topologi terpadu di mana Nginx (bawaan CloudPanel) bertindak sebagai *Front-facing Reverse Proxy & SSL Terminator*, mendistribusikan lalu lintas secara terisolasi ke aplikasi Node.js, aset Frontend statis, basis data MySQL, dan Broker MQTT:

```mermaid
flowchart TD
    subgraph CLIENTS ["Klien Eksternal & Edge Devices"]
        WEB_USER["Browser Web Pengguna<br/>(Desktop & Laptop 1366 / 1920)"]
        ESP_NODE["Node IoT ESP32 & Sensor<br/>(Ilvina - Telemetri Hardware)"]
        N8N_CLIENT["Workflow Automation n8n<br/>(Alerting Telegram & Email)"]
    end

    subgraph CLOUDPANEL_HOST ["Server Produksi Teknolab (CloudPanel Host)"]
        FW["CloudPanel Firewall & UFW Rules<br/>(Port 22, 80, 443, 1883, 8443)"]

        subgraph INGRESS ["Ingress & Web Server (Nginx CloudPanel)"]
            SSL["Let's Encrypt SSL/TLS 1.3 Engine<br/>(Auto-Renewal 60 Hari)"]
            NGINX_ROUTER["Nginx Reverse Proxy Router<br/>(taims.teknolab.id)"]
        end

        subgraph SITES ["CloudPanel Site Containers / Vhosts"]
            SITE_FRONTEND["Frontend Static Web<br/>/home/taims/htdocs/taims.teknolab.id<br/>(HTML5, Cyber-Dark CSS, GIS Leaflet)"]
            SITE_BACKEND["Node.js Application Site<br/>Port 3000 (Express.js REST API)<br/>PM2 / CloudPanel Supervisor Daemon"]
        end

        subgraph DATA_SERVICES ["Layanan Basis Data & Pesan"]
            MYSQL_SRV["MySQL 8.0 Engine (CloudPanel DB)<br/>Database: taims_db (Port 3306 Localhost)"]
            MQTT_BROKER["Eclipse Mosquitto MQTT Broker<br/>Port 1883 TCP & Port 9001 WebSocket"]
        end

        subgraph CRON_BACKUP ["Otomasi Pemeliharaan (CloudPanel Cron)"]
            BACKUP_JOB["Daily Database Backup Cron<br/>(02:00 WIB &bull; Retensi 7 Hari &bull; backup.log)"]
        end
    end

    WEB_USER -->|HTTPS / 443| FW
    ESP_NODE -->|TCP / 1883| FW
    N8N_CLIENT -->|HTTPS API / 443| FW

    FW --> NGINX_ROUTER
    FW -->|Port 1883| MQTT_BROKER

    NGINX_ROUTER -->|Route / (Static Aset)| SITE_FRONTEND
    NGINX_ROUTER -->|Proxy /api/ (Port 3000)| SITE_BACKEND
    NGINX_ROUTER -->|WSS Proxy /mqtt (Port 9001)| MQTT_BROKER

    SITE_BACKEND -->|Localhost TCP / 3306| MYSQL_SRV
    SITE_BACKEND -->|Publish/Subscribe| MQTT_BROKER
    BACKUP_JOB -.->|mysqldump| MYSQL_SRV
```

### 2.1 Matriks Port & Segmentasi Layanan

| Layanan / Komponen | Port Host | Tipe Akses | Protokol | Keterangan & Pengamanan |
|:---|:---:|:---:|:---:|:---|
| **CloudPanel Admin** | `8443` | Terbatas (IP Whitelist) | HTTPS | Antarmuka GUI Administrator CloudPanel |
| **HTTP Web Ingress** | `80` | Publik | HTTP | Otomatis di-redirect (301) ke HTTPS |
| **HTTPS Web Ingress**| `443` | Publik | HTTPS (TLS 1.3) | Akses utama Frontend, REST API, & WSS MQTT |
| **Backend API Core** | `3000` | Internal (Loopback) | HTTP (Node.js) | Terisolasi di `127.0.0.1:3000`, hanya lewat Nginx |
| **MQTT Broker (TCP)**| `1883` | Terbuka Terbatas | TCP (MQTT) | Khusus komunikasi sensor hardware ESP32 |
| **MQTT Broker (WS)** | `9001` | Internal (Loopback) | WebSocket | Terisolasi di `127.0.0.1:9001`, diproxy via `/mqtt` WSS |
| **Database MySQL**   | `3306` | Internal (Loopback) | MySQL Protocol | Terkunci di `127.0.0.1:3306`, dilarang ekspos publik |
| **SSH Management**   | `22` | Khusus DevOps | SSH (Key-based) | Autentikasi kunci Ed25519, Password Auth dinonaktifkan |

---

## 3. Prasyarat & Checklist Pra-Deployment (*Pre-Flight Check*)

Sebelum memulai deployment di CloudPanel, pastikan seluruh item berikut telah terverifikasi:

* [ ] **Akses CloudPanel:** URL Login (`https://<IP-Server>:8443`), Username Administrator, dan Password telah diterima dari mentor.
* [ ] **Domain & DNS:** Domain `taims.teknolab.id` (atau IP Publik Server) telah mengarah (*A-Record*) ke IP server VPS Teknolab.
* [ ] **Spesifikasi Server Minimum:**
  * RAM: Minimal 2 GB (Rekomendasi 4 GB).
  * Storage: Minimal 20 GB SSD/NVMe.
  * CPU: Minimal 2 vCPU.
  * OS: Ubuntu 22.04 LTS x86_64.
* [ ] **Integritas Repositori Lokal:**
  * File Frontend teruji valid di `frontend/`.
  * File Backend REST API teruji valid di `taims-backend/` atau `backend/`.
  * Skrip migrasi database siap di `database/taims_db.sql`.
  * Skrip backup berkala siap di `devops/scripts/backup_db.sh`.

---

## 4. SOP Tahap 1: Konfigurasi Basis Data MySQL di CloudPanel

### 4.1 Langkah Pembuatan Database
1. Buka antarmuka CloudPanel di peramban: `https://<IP-Server>:8443`.
2. Masuk ke menu navigasi kiri: **Databases** &rarr; klik tombol **Add Database**.
3. Isi parameter basis data sesuai standar kerahasiaan T-AIMS:
   * **Database Name:** `taims_db`
   * **Database User Name:** `taims_user`
   * **Database User Password:** *(Gunakan fitur "Generate" atau masukkan kata sandi kuat, misal: `Taims_Teknolab_2026_Secure!`)*
4. Simpan kredensial ini untuk disalin ke berkas `.env` backend.
5. Klik **Save**.

### 4.2 Impor Skema & Seed Data Aset
Impor dapat dilakukan melalui antarmuka **phpMyAdmin CloudPanel** atau melalui **Terminal SSH**:

**Opsi CLI (Rekomendasi Cepat):**
```bash
# Upload atau clone file database ke server, lalu eksekusi impor:
mysql -u taims_user -p'Taims_Teknolab_2026_Secure!' taims_db < /opt/taims/database/taims_db.sql

# Verifikasi keberadaan tabel utama (assets, users, network_logs, maintenance)
mysql -u taims_user -p'Taims_Teknolab_2026_Secure!' taims_db -e "SHOW TABLES;"
```

**Verifikasi Data Aset (Kepatuhan 12 Field PDF Hal. 5):**
```sql
SELECT asset_code, asset_name, category, ip_address, status, installation_date, pic 
FROM assets LIMIT 5;
```

---

## 5. SOP Tahap 2: Deployment Backend REST API (Node.js)

### 5.1 Membuat Node.js Site di CloudPanel
1. Masuk ke menu **Sites** &rarr; klik tombol **Add Site**.
2. Pilih tipe: **Create a Node.js Site**.
3. Lengkapi formulir pendaftaran situs:
   * **Domain Name:** `api.taims.teknolab.id` (atau satukan di sub-path `taims.teknolab.id`).
   * **Node.js Version:** Pilih **Node.js 20.x** (atau **18.x LTS**).
   * **Site User:** `taims` (otomatis dibuatkan user Linux terisolasi).
   * **App Port:** `3000` (Port internal Express.js).
4. Klik **Create**.

### 5.2 Upload & Konfigurasi Kode Backend
1. Masuk ke direktori situs backend via SSH:
   ```bash
   cd /home/taims/htdocs/api.taims.teknolab.id/
   ```
2. Salin seluruh isi direktori `taims-backend/` ke dalam direktori tersebut:
   ```bash
   # Pastikan struktur file berisi:
   # package.json, server.js (atau app.js), routes/, controllers/, models/, dsb.
   ```
3. Lakukan instalasi dependensi produksi:
   ```bash
   npm install --production
   ```

### 5.3 Konfigurasi Environment Secret (.env)
Buat berkas `.env` di dalam folder root aplikasi backend (memenuhi aturan Halaman 20 PDF Teknolab):
```bash
cat << 'EOF' > /home/taims/htdocs/api.taims.teknolab.id/.env
PORT=3000
NODE_ENV=production

# Database MySQL CloudPanel
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=taims_db
DB_USER=taims_user
DB_PASS=Taims_Teknolab_2026_Secure!

# JWT Authentication
JWT_SECRET=taims_super_secret_jwt_key_teknolab_blitar_2026_devops_wafian
JWT_EXPIRES_IN=86400

# MQTT Integration
MQTT_HOST=127.0.0.1
MQTT_PORT=1883
MQTT_USER=taims-broker
MQTT_PASS=taims-mqtt-2026

# Notifikasi Darurat Telegram & Email
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=-4780517830
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=education8420@gmail.com
SMTP_PASS=your_gmail_app_password_here
EOF

# Batasi hak akses file hanya untuk user taims
chmod 600 /home/taims/htdocs/api.taims.teknolab.id/.env
chown taims:taims /home/taims/htdocs/api.taims.teknolab.id/.env
```

### 5.4 Jalankan Service & Manajemen Proses (PM2 / Supervisor)
CloudPanel menyediakan tombol **Restart** Node.js secara otomatis di tab situs. Untuk memantau daemon melalui terminal:
```bash
# Cek status proses Node.js
pm2 status || systemctl status nodejs-taims

# Uji endpoint live telemetri:
curl -I http://127.0.0.1:3000/api/health
curl http://127.0.0.1:3000/api/ai/recommendation
```

---

## 6. SOP Tahap 3: Deployment Frontend Web Dashboard

### 6.1 Membuat Static HTML / Nginx Site
1. Masuk ke menu **Sites** &rarr; klik tombol **Add Site**.
2. Pilih tipe: **Create a Static HTML Site** (atau Node.js Site jika menggunakan satu domain).
   * **Domain Name:** `taims.teknolab.id`
   * **Site User:** `taims`
3. Klik **Create**.

### 6.2 Upload Aset Antarmuka Web
1. Salin seluruh file hasil revisi teruji dari folder [Website  T-AIMS/frontend](file:///mnt/d/Website%20%20T-AIMS/frontend) ke direktori web root:
   ```bash
   cp -r /mnt/d/Website\ \ T-AIMS/frontend/* /home/taims/htdocs/taims.teknolab.id/
   ```
2. Pastikan file `index.html`, `dashboard.html`, serta folder `assets/css/` dan `assets/js/` berada di lokasi root dokumen.
3. Atur kepemilikan berkas:
   ```bash
   chown -R taims:taims /home/taims/htdocs/taims.teknolab.id/
   chmod -R 755 /home/taims/htdocs/taims.teknolab.id/
   ```

### 6.3 Konfigurasi Reverse Proxy Nginx untuk API & WebSocket
Di dashboard CloudPanel, buka **Sites** &rarr; `taims.teknolab.id` &rarr; tab **Nginx Configuration**.  
Tambahkan blok proxy berikut di dalam blok `server { ... }`:

```nginx
# -------------------------------------------------------------------------
# T-AIMS REVERSE PROXY RULES: REST API & WEBSOCKET MQTT
# Disusun oleh: Wafian (DevOps Engineer)
# -------------------------------------------------------------------------

# Proxying endpoint REST API ke Node.js Backend (Port 3000)
location /api/ {
    proxy_pass http://127.0.0.1:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 90;
}

# Proxying WebSocket MQTT untuk Antarmuka Dashboard Live
location /mqtt {
    proxy_pass http://127.0.0.1:9001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
}

# Single Page Application (SPA) Fallback Routing
location / {
    try_files $uri $uri/ /index.html;
}
```
Klik **Save**. Nginx CloudPanel akan melakukan *syntax test* dan memuat ulang konfigurasi secara otomatis (*graceful reload*).

---

## 7. SOP Tahap 4: Instalasi & Integrasi Broker MQTT (Mosquitto)

Karena CloudPanel tidak mengelola broker MQTT secara default, broker **Eclipse Mosquitto** diinstal secara mandiri pada level OS server host:

### 7.1 Instalasi Mosquitto
```bash
sudo apt update && sudo apt install -y mosquitto mosquitto-clients
```

### 7.2 Konfigurasi Listener & Dual-Authentication
Sunting file `/etc/mosquitto/conf.d/taims.conf`:
```ini
# Listener Port Standar TCP untuk Node Sensor ESP32 / Gateway
listener 1883
protocol mqtt
allow_anonymous false
password_file /etc/mosquitto/passwd

# Listener WebSocket untuk Web Dashboard & Reverse Proxy
listener 9001 127.0.0.1
protocol websockets
allow_anonymous false
password_file /etc/mosquitto/passwd
```

### 7.3 Pembuatan User & Password MQTT
```bash
# Buat kredensial broker terenkripsi
sudo mosquitto_passwd -c /etc/mosquitto/passwd taims-broker
# Masukkan kata sandi: taims-mqtt-2026

# Restart service Mosquitto
sudo systemctl restart mosquitto
sudo systemctl enable mosquitto

# Uji langganan topik telemetri
mosquitto_sub -h 127.0.0.1 -p 1883 -u taims-broker -P taims-mqtt-2026 -t "taims/sensor/#" -v
```

---

## 8. SOP Tahap 5: Keamanan Server, SSL/TLS & Hardening (OWASP Compliance)

Sesuai dengan ketentuan **Security Checklist (Halaman 12 PDF Teknolab)**:

### 8.1 Aktivasi Single-Click Let's Encrypt SSL
1. Masuk ke CloudPanel &rarr; **Sites** &rarr; klik `taims.teknolab.id`.
2. Buka tab **SSL/TLS**.
3. Pilih opsi **Let's Encrypt**.
4. Klik tombol **Issue Certificate**.
5. *CloudPanel akan otomatis menerbitkan sertifikat TLS 1.3 resmi dan memperbaruinya setiap 60 hari tanpa intervensi manual.*

### 8.2 Injeksi Nginx Security Headers (OWASP)
Di tab **Nginx Configuration** situs, tambahkan header proteksi berikut di awal blok `server`:
```nginx
# Header Keamanan Produksi OWASP
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(self), camera=(), microphone=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 8.3 Konfigurasi CloudPanel Firewall (UFW)
Masuk ke menu **Security** &rarr; **Firewall** di CloudPanel. Pastikan tabel port terkonfigurasi sebagai berikut:
* `22` (TCP) &rarr; **Allow** (SSH Remote Management).
* `80` (TCP) &rarr; **Allow** (HTTP Challenge & Redirect).
* `443` (TCP) &rarr; **Allow** (HTTPS Traffic).
* `1883` (TCP) &rarr; **Allow** (IoT ESP32 Sensor Gateway).
* `8443` (TCP) &rarr; **Allow from Whitelist IP** *(Masukkan IP Publik laptop Wafian & Kantor Teknolab agar panel admin tidak dapat dipindai peretas publik)*.
* *Semua port lainnya diblokir (Deny by default).*

---

## 9. SOP Tahap 6: Backup Otomatis & Pemeliharaan (Cron Jobs)

Sesuai ketentuan **Halaman 13 & 14 PDF Teknolab**, cadangan basis data wajib dijalankan berkala dengan kebijakan retensi 7 hari.

### 9.1 Menjadwalkan Cron Job Backup di CloudPanel
1. Masuk ke CloudPanel &rarr; **Sites** &rarr; pilih `taims.teknolab.id` &rarr; tab **Cron Jobs**.
2. Klik tombol **Add Cron Job**.
3. Atur jadwal eksekusi setiap hari pukul **02.00 WIB**:
   * **Schedule:** `0 2 * * *`
   * **Command:**
     ```bash
     bash /home/taims/htdocs/taims.teknolab.id/devops/scripts/backup_db.sh >> /home/taims/htdocs/taims.teknolab.id/logs/backup.log 2>&1
     ```
4. Simpan konfigurasi.

### 9.2 Verifikasi Mekanisme Retensi Backup (7 Hari)
Skrip `backup_db.sh` milik Wafian secara otomatis menghapus arsip yang berusia lebih dari 7 hari:
```bash
# Logika retensi pada devops/scripts/backup_db.sh:
find /home/taims/htdocs/taims.teknolab.id/database/backups/ -type f -name "*.sql" -mtime +7 -exec rm -f {} \;
```
Status backup dapat dipantau langsung melalui berkas log:
```bash
tail -n 20 /home/taims/htdocs/taims.teknolab.id/logs/backup.log
```

---

## 10. Runbook Penanganan Insiden & Recovery (*Troubleshooting*)

| Skenario Insiden | Gejala / Indikator | Akar Masalah Potensial | Tindakan Korektif Cepat (*Action Plan*) |
|:---|:---|:---|:---|
| **Kasus A:**<br>`502 Bad Gateway` | Browser menampilkan error 502 saat membuka web atau panggil API. | Proses Express.js mati / crash karena unhandled exception. | 1. Cek log error: `tail -n 50 /home/taims/htdocs/api.taims.teknolab.id/logs/error.log`<br>2. Restart service Node.js di CloudPanel atau jalankan `pm2 restart all`.<br>3. Pastikan port 3000 sedang didengarkan: `netstat -tlpn \| grep 3000`. |
| **Kasus B:**<br>`Database Connection Failed` | API mengembalikan respon `500 Internal Error` atau `ECONNREFUSED`. | Service MySQL mati atau kredensial `.env` salah. | 1. Tes ping database: `mysqladmin -u taims_user -p ping`<br>2. Jika offline, start MySQL: `sudo systemctl restart mysql`<br>3. Cocokkan kredensial di file `.env` dengan tab Database CloudPanel. |
| **Kasus C:**<br>`SSL Cert Expired / Invalid` | Muncul peringatan *"Not Secure"* / sertifikat SSL kadaluarsa. | Let's Encrypt auto-renewal gagal karena port 80 terblokir firewall. | 1. Pastikan port 80 terbuka di CloudPanel Firewall.<br>2. Klik tombol **Renew Certificate** di tab SSL/TLS CloudPanel.<br>3. Jalankan manual via CLI: `certbot renew --dry-run`. |
| **Kasus D:**<br>`Sensor ESP32 Offline` | Data telemetri sensor di dashboard berhenti diperbarui. | Port 1883 diblokir atau broker Mosquitto mati. | 1. Cek status daemon: `sudo systemctl status mosquitto`<br>2. Uji publikasi paket lokal: `mosquitto_pub -h 127.0.0.1 -p 1883 -u taims-broker -P taims-mqtt-2026 -t "test" -m "1"`<br>3. Pastikan port 1883 diizinkan pada UFW Firewall. |

### Prosedur Darurat (*Emergency Rollback SOP*)
Apabila rilis versi terbaru mengalami kendala fatal di server produksi:
1. Kembalikan kode ke tag rilis stabil sebelumnya:
   ```bash
   cd /home/taims/htdocs/taims.teknolab.id/
   git checkout tags/v1.0.0-stable
   ```
2. Pulihkan basis data dari cadangan terbaru:
   ```bash
   LATEST_BACKUP=$(ls -t /home/taims/htdocs/taims.teknolab.id/database/backups/*.sql | head -n 1)
   mysql -u taims_user -p'Taims_Teknolab_2026_Secure!' taims_db < "$LATEST_BACKUP"
   ```
3. Restart seluruh daemon aplikasi dan lakukan verifikasi kesehatan sistem.

---

## 11. Checklist Verifikasi Akhir & Serah Terima (*Sign-Off*)

Sebelum melaporkan status *Deployment Selesai* kepada Mentor Teknolab:

- [ ] **Aksesibilitas Web:** URL `https://taims.teknolab.id` dapat diakses cepat tanpa peringatan SSL.
- [ ] **Koneksi REST API:** Endpoint `GET /api/devices` mengembalikan kode HTTP `200 OK` dengan data valid.
- [ ] **AI Assistant Widget:** Fitur AI di sidebar dapat mendiagnosa perangkat offline dan memberikan solusi preskriptif.
- [ ] **Autentikasi Pengguna:** Login Superadmin (Wafian Zaidan), Admin, dan Guest berfungsi mulus.
- [ ] **Peta Satelit GIS:** 3 Node Site Blitar (Head Office, Marketing Office, Rumah Mentor) terpasang presisi.
- [ ] **MQTT Ingestion:** Data suhu/daya dari ESP32 berhasil diterima broker dan masuk ke database.
- [ ] **Keamanan & Firewall:** Port 8443 (CloudPanel) terkunci hanya untuk IP internal; port MySQL 3306 tidak terekspos ke publik.
- [ ] **Jadwal Backup:** Cron job harian 02.00 WIB aktif terdaftar di CloudPanel Crontab.

---
*Dokumen ini disusun dan divalidasi oleh **Wafian Zaidan El Y.** (DevOps, Server & Security Engineer) sebagai standar operasional resmi proyek T-AIMS Teknolab 2026.*
EOF
