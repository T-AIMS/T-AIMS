# Log Backend T-AIMS
Dibuat: 14 Oktober 2026
Penanggung jawab: Wafian

## Cara Simpan Log Backend
Backend jalan di Windows CMD.

### Cara 1: Redirect Output
npm start > logs\backend\backend_%date%.log 2>&1

### Cara 2: Pakai PM2
npm install -g pm2
pm2 start src/app.js --name taims-backend --log logs/backend/backend.log
