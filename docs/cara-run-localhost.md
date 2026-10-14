# Cara Run T-AIMS di Localhost
Dibuat: 14 Oktober 2026
Penanggung jawab: Wafian

## Port Final (Sesuai API Contract v0.7)

| Aplikasi | Port |
|---|---|
| Backend API | 3000 |
| Frontend | 3001 |
| MySQL | 3306 |
| MQTT | 1883 |
| phpMyAdmin | 80 |
| n8n | 5678 |

## Cara Run

### 1. Start XAMPP
- Buka XAMPP Control Panel
- Start Apache & MySQL

### 2. Start MQTT (WSL)
sudo systemctl start mosquitto

### 3. Start Backend (Windows)
cd /d D:\xampp\htdocs\T-AIMS\backend
start-backend.bat

### 4. Buka Frontend
http://localhost/T-AIMS/frontend/

### 5. Buka phpMyAdmin
http://localhost/phpmyadmin

## Status Integrasi (14 Oktober 2026)
- Frontend: Jalan di http://localhost/T-AIMS/frontend/
- Backend: Jalan di http://localhost:3000/api
- Database: SIAP (taims_db, 16 aset, 42 monitoring logs)
- MQTT: Jalan di localhost:1883
- Integrasi frontend-backend: Dalam proses

## Catatan
- Port frontend berubah dari 3000 → 3001
- Port backend berubah dari 5000 → 3000
- Sesuai API Contract Reza Fahmi v0.7
