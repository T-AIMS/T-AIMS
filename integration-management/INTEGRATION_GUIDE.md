# Integration Guide T-AIMS (Master Guide)
Dibuat: 14 Oktober 2026  
Diupdate: 16 Oktober 2026 (Finalisasi Sinkronisasi Docker, Systemd & Monorepo)

## Arsitektur Lingkungan
- **Windows Host:** Backend Node.js Express (Port 3000), Frontend Dashboard (Port 3001), MySQL via XAMPP (Port 3306)
- **Linux WSL2:** Docker Mosquitto MQTT (Port 1883), Docker n8n (Port 5678), Monitoring Engine Daemon (`taims-monitoring.service`)
- **Gateway WSL2 ke Windows:** `172.19.112.1`

---

## Cara Menjalankan Sistem dari Nol

### 1. Clone & Akses Repository
```bash
git clone git@github.com:T-AIMS/T-AIMS.git
cd T-AIMS
```

### 2. Setup Database (MySQL XAMPP)
- Buka XAMPP Control Panel di Windows ➔ Start **MySQL** (Port 3306).
- Akses phpMyAdmin (`http://localhost/phpmyadmin`).
- Import database master: `database/taims_db.sql` (16 aset resmi tervalidasi).

### 3. Setup Docker (Mosquitto MQTT & n8n Automation)
Jalankan di terminal WSL:
```bash
cd /mnt/d/xampp/htdocs/T-AIMS/automation
docker compose up -d
```
Container yang aktif pada network `taims-net`:
- `taims-mosquitto` (Port 1883 TCP, 9001 WS)
- `taims-n8n` (Port 5678 Web UI)

### 4. Setup Backend API & Frontend Dashboard
Tersedia dua opsi untuk menjalankan Backend dan Frontend:

#### Opsi A: Jalankan Sekali Klik via Skrip Otomatis (Direkomendasikan)
Di Windows CMD atau PowerShell, jalankan launcher portabel:
```cmd
devops\scripts\start_services.bat
```
Pilih opsi `[3]` untuk menyalakan Backend (Port 3000) dan Frontend (Port 3001) secara simultan di dua jendela terpisah.

#### Opsi B: Jalankan Manual per Layanan
1. **Backend API (Node.js Express)**:
   ```cmd
   cd D:\xampp\htdocs\T-AIMS\taims-backend
   npm install
   npm start
   ```
   *Endpoint API:* `http://localhost:3000/api`

2. **Frontend Dashboard**:
   ```cmd
   cd D:\xampp\htdocs\T-AIMS\frontend
   python -m http.server 3001
   ```
   *URL Akses:* `http://localhost:3001/dashboard.html`

### 5. Setup Monitoring Engine Daemon (Systemd WSL2)
Jalankan di terminal WSL:
```bash
sudo systemctl enable --now taims-monitoring.service
sudo systemctl status taims-monitoring
```

---

## Verifikasi Kesehatan Sistem (Master Health Check)
Jalankan script verifikasi master v1.3 di WSL:
```bash
python3 integration-management/verify_integration.py
```
Target kelulusan: **15/15 OK (100% HIJAU)**

---

## Ringkasan Titik Akses Layanan (URLs & Ports)
- **Frontend Dashboard:** `http://localhost:3001/dashboard.html`
- **Backend REST API:** `http://localhost:3000/api`
- **n8n Automation:** `http://localhost:5678`
- **Mosquitto MQTT Broker:** `localhost:1883`
- **MySQL Database:** `localhost:3306` (atau `172.19.112.1:3306` dari WSL)
