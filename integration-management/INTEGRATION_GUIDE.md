# Integration Guide T-AIMS
Dibuat: 14 Oktober 2026

## Cara Run dari Nol

### 1. Clone Repo
git clone git@github.com:T-AIMS/T-AIMS.git
cd T-AIMS

### 2. Setup Database
- Buka phpMyAdmin
- Import database/taims_db.sql

### 3. Setup Backend
cd backend
npm install
cp .env.example .env
npm start

### 4. Setup MQTT
sudo systemctl start mosquitto

### 5. Setup Frontend
Buka http://localhost/T-AIMS/frontend/

### 6. Setup n8n
docker start n8n

## Cek Integrasi
- Backend: http://localhost:3000/api
- Frontend: http://localhost/T-AIMS/frontend/
- phpMyAdmin: http://localhost/phpmyadmin
- n8n: http://localhost:5678
