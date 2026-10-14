# Setup Auto-Start T-AIMS
Dibuat: 14 Oktober 2026
Penanggung jawab: Wafian

## 1. MQTT (Mosquitto) - WSL
Status: enabled (auto-start)
Cek: sudo systemctl is-enabled mosquitto

## 2. Backend - Windows

Cara setup:
1. Bikin file start-backend.bat di folder backend
2. Buka folder Startup: Win + R, ketik shell:startup
3. Copy start-backend.bat ke folder Startup
4. Restart Windows, backend jalan otomatis

## 3. Database (MySQL XAMPP)
Manual start via XAMPP Control Panel

## 4. Cek Status
curl http://localhost:3000/api
