# Recovery Documentation T-AIMS
Dibuat: 14 Oktober 2026
Penanggung jawab: Wafian

## 1. Restore Database

### Cara Backup
mysqldump -u root taims_db > backup_taims_YYYY-MM-DD.sql

### Cara Restore
mysql -u root taims_db < backup_taims_YYYY-MM-DD.sql

## 2. Restart Service

### Backend (Windows)
Buka CMD, jalankan:
cd /d D:\xampp\htdocs\T-AIMS\backend
start-backend.bat

### Database (XAMPP)
Buka XAMPP Control Panel
Klik Start di MySQL

### MQTT (WSL)
sudo systemctl restart mosquitto
sudo systemctl status mosquitto

## 3. Cek Service Jalan

### Backend
curl http://localhost:3000/api

### Database
mysql -u root -e "USE taims_db; SHOW TABLES;"

### MQTT
sudo netstat -tuln | grep 1883

## 4. Kalau Server Rusak

1. Restore database dari backup
2. Restart semua service
3. Cek satu per satu
4. Kalau masih gagal, lapor mentor
