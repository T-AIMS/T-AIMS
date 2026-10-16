# Panduan & Arsitektur Production Deployment T-AIMS
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer*)  
**Pembaruan Terakhir:** 16 Oktober 2026 (Shift 2)  
**Status Kesiapan:** 100% Siap Deploy (*Production Ready*)  

---

## 1. Ikhtisar Arsitektur Deployment Produksi
Sistem T-AIMS dirancang menggunakan arsitektur *microservices-containerized* yang terisolasi dalam satu private bridge network (`taims-net`), dengan satu pintu gerbang utama (*Reverse Proxy*) berbasis Nginx yang dilindungi sertifikat SSL/TLS:

```mermaid
graph TD
    CLIENT["Browser Client / Mobile Web<br/>(Desktop & Mobile)"]
    IOT["IoT Devices / ESP32 / Gateway<br/>(Ilvina - Port 1883)"]

    subgraph SERVER ["Server Produksi Teknolab (Ubuntu 22.04 LTS)"]
        NGINX["Nginx Reverse Proxy & SSL (Port 80/443)<br/>Wafian - OWASP Hardened"]

        subgraph DOCKER_NET ["Docker Network: taims-net"]
            UI["taims-frontend<br/>Nginx Alpine (Port 3001)"]
            API["taims-backend<br/>Node.js Express (Port 3000)"]
            MQTT["taims-mosquitto<br/>Broker MQTT (Port 1883 & 9001)"]
            DB["taims-mysql<br/>MySQL 8.0 (Port 3306)"]
            N8N["taims-n8n<br/>Automation (Port 5678)"]
        end

        DAEMON["Systemd Service Daemon<br/>(taims-monitoring.service)"]
        CRON["Automated Daily Backup<br/>(02.00 WIB - 7 Hari Retensi)"]
    end

    CLIENT -->|HTTPS / 443| NGINX
    IOT -->|TCP / 1883 (MQTT)| MQTT

    NGINX -->|Proxy /| UI
    NGINX -->|Proxy /api/| API
    NGINX -->|Proxy /ws/| MQTT
    NGINX -->|Internal /n8n/| N8N

    API --> DB
    API --> MQTT
    N8N --> MQTT
    DAEMON -.->|Health Monitoring| API
```

---

## 2. Port Matrix & Segmentasi Keamanan Jaringan
Untuk mematuhi *Security Checklist* (Hal 12 PDF) dan mencegah eksposur port yang tidak perlu:

| Layanan | Container Name | Port Internal | Port Publik / Host | Akses & Keamanan |
|:---|:---|:---:|:---:|:---|
| **Reverse Proxy** | `taims-nginx-proxy` | `80, 443` | `80, 443` | Terbuka publik (Redirect HTTP ke HTTPS, TLS 1.2/1.3) |
| **Frontend Web** | `taims-frontend` | `3001` | Terisolasi | Hanya dapat diakses melalui reverse proxy Nginx |
| **Backend REST API** | `taims-backend` | `3000` | Terisolasi | Hanya dapat diakses melalui reverse proxy Nginx |
| **MQTT Broker (TCP)**| `taims-mosquitto` | `1883` | `1883` | Terbuka untuk node sensor ESP32/RPi (*Dual-Auth*) |
| **MQTT WebSocket** | `taims-mosquitto` | `9001` | Terisolasi | Proxy ke `/mqtt` via Nginx HTTPS WSS |
| **Database MySQL** | `taims-mysql` | `3306` | Terisolasi / Local | Terkunci di dalam network internal `taims-net` |
| **Automation n8n** | `taims-n8n` | `5678` | Terisolasi | Hanya akses admin internal via VPN/Proxy |

---

## 3. Langkah-Langkah Deployment ke Server Teknolab (*Step-by-Step Runbook*)

### Tahap 1: Prasyarat Server & Dependensi
Pastikan server Teknolab (VPS atau Bare-Metal Ubuntu 22.04 LTS) telah terpasang:
```bash
# Update repository sistem
sudo apt update && sudo apt upgrade -y

# Instalasi Docker Engine & Docker Compose Plugin
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Tambahkan user devops ke grup docker
sudo usermod -aG docker $USER
```

### Tahap 2: Clone Repositori & Konfigurasi Secret (.env)
```bash
# Clone repositori utama
git clone git@github.com:T-AIMS/T-AIMS.git /opt/taims
cd /opt/taims

# Salin template environment dan sesuaikan kredensial produksi
cp .env.example .env
nano .env
```

### Tahap 3: Pembuatan Sertifikat SSL/TLS
Jalankan otomasi pembuatan SSL yang disediakan Wafian:
```bash
# Eksekusi skrip SSL
bash devops/scripts/setup_ssl.sh

# Pilih opsi 1 untuk Self-Signed (Uji Coba) atau opsi 2 untuk Let's Encrypt Certbot resmi:
# sudo certbot certonly --standalone -d taims.teknolab.id
```

### Tahap 4: Menjalankan Multi-Container Full-Stack
Eksekusi orkestrasi kontainer produksi:
```bash
# Menjalankan seluruh stack layanan di latar belakang
docker compose -f devops/docker-compose.prod.yml up -d --build

# Periksa status seluruh kontainer
docker compose -f devops/docker-compose.prod.yml ps
```

### Tahap 5: Pemasangan Service Daemon Pengawas (*Systemd*)
Agar sistem memantau dirinya sendiri secara otonom saat server reboot:
```bash
# Salin konfigurasi unit service systemd
sudo cp devops/systemd/taims-monitoring.service /etc/systemd/system/

# Reload systemd dan aktifkan daemon
sudo systemctl daemon-reload
sudo systemctl enable --now taims-monitoring.service

# Verifikasi status aktif
sudo systemctl status taims-monitoring.service
```

### Tahap 6: Konfigurasi Otomasi Pencadangan Basis Data (*Cron Backup*)
Pastikan pencadangan otomatis berjalan setiap dini hari pukul 02.00 WIB:
```bash
# Tambahkan entri crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/taims/devops/scripts/backup_db.sh >> /opt/taims/logs/backup.log 2>&1") | crontab -
```

---

## 4. Rencana Pemulihan Bencana (*Disaster Recovery & Rollback*)
Jika terjadi kegagalan sistem saat deployment:
1. **Rollback Kontainer Cepat:**
   ```bash
   docker compose -f devops/docker-compose.prod.yml down
   docker compose -f devops/docker-compose.prod.yml up -d
   ```
2. **Pemulihan Database Seketika:**
   ```bash
   docker exec -i taims-mysql mysql -u root -p"$DB_PASS" taims_db < /opt/taims/database/backups/<FILE_BACKUP_TERAKHIR>.sql
   ```
3. **Uji Ketahanan 6 Skenario Kegagalan:**
   ```bash
   bash devops/scripts/test_failure_simulation.sh
   ```

---

## 5. Kepatuhan Definisi Selesai (*Definition of Done - Hal 18 PDF*)
Sesuai standar operasional Teknolab (*PROJECT COMPLETED ≠ PROJECT READY*), sistem dinyatakan **Project Ready** karena memenuhi 4 kriteria baku:
- [x] **Berfungsi:** 5 Core Service saling bertukar data real-time.
- [x] **Terintegrasi:** Seluruh 11 anggota tim terhubung via API, DB, MQTT, dan Dashboard.
- [x] **Diuji:** 6 dari 6 skenario kegagalan lolos 100% (*Resilient*).
- [x] **Terdokumentasi & Dapat Dipulihkan:** Tersedia backup otomatis 7 hari, runbook operasional, dan panduan recovery lengkap.
