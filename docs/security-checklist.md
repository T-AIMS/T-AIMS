# Security Checklist T-AIMS
Dibuat: 12 Oktober 2026
Penulis: Wafian

## 1. Server & Network
- [ ] Firewall aktif (ufw)
- [ ] SSH pakai key, bukan password
- [ ] Root login dimatikan
- [ ] Fail2ban terinstall
- [x] Port 1883 (MQTT) terbuka
- [ ] Port 3000 (Backend) - nanti di server
- [ ] Port 3306 (MySQL) - nanti di server

## 2. Credential & Git
- [x] Credential di .env
- [x] .env tidak ke-commit ke GitHub
- [x] .env.example ada (tanpa credential asli)
- [x] Password JWT kuat & random

## 3. Backup & Log
- [x] Backup rutin & diuji restore
- [x] Log rapi & bisa diakses

## 4. Lainnya
- [x] Update rutin
- [ ] User database least privilege
- [ ] SSL aktif (HTTPS) - nanti di server
