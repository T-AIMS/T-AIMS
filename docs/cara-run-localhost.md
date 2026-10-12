# Cara Run T-AIMS di Localhost
Dibuat: 12 Oktober 2026
Penulis: Wafian (DevOps)

## Persiapan
1. XAMPP (Apache + MySQL)
2. Git
3. Node.js (kalau backend pakai Node.js)
4. Python (kalau backend pakai Python)

## Langkah Menjalankan

### 1. Start XAMPP
- Buka XAMPP Control Panel
- Start Apache & MySQL

### 2. Clone Repository
cd D:\xampp\htdocs
git clone git@github.com:T-AIMS/T-AIMS.git

### 3. Setup Database
- Buka http://localhost/phpmyadmin
- Buat database: taims_db
- Import file taims_db.sql

### 4. Setup Environment
cd D:\xampp\htdocs\T-AIMS
cp .env.example .env

### 5. Jalankan Backend
cd backend
npm install
npm start

### 6. Jalankan Frontend
cd frontend
npm install
npm start

## Akses Aplikasi
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- phpMyAdmin: http://localhost/phpmyadmin

## Port yang Dipakai
| Aplikasi | Port |
|---|---|
| Frontend | 3000 |
| Backend | 5000 |
| MySQL | 3306 |
| MQTT | 1883 |
| phpMyAdmin | 80 |
