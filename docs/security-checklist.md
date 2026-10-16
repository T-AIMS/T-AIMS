# T-AIMS Infrastructure Security Checklist & Hardening Guide
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer*)  
**Pembaruan Terakhir:** 16 Oktober 2026 (Shift 2)  
**Status Audit:** Hardened & Compliant dengan Panduan Operasional PKL

---

## 1. Server, Network & Port Hardening
- [x] **Port Matrix Isolated:**
  - `3306`: MySQL Database (Hanya internal container / localhost)
  - `1883`: MQTT Broker TCP Listener (Active)
  - `9001`: MQTT WebSocket Listener (Active)
  - `3000`: Backend REST API (Node.js Express)
  - `3001`: Frontend Web Dashboard
  - `5678`: Automation Workflow Engine (n8n)
- [x] **Service Daemon Monitoring:** Service systemd `taims-monitoring.service` aktif mengawasi status port dan kesehatan layanan secara terus-menerus.
- [x] **Reverse Proxy & SSL Termination:** Konfigurasi Nginx siap pakai di `devops/nginx/nginx.conf` dengan HTTPS (Port 443), HSTS, X-Frame-Options, dan X-Content-Type-Options. Panduan implementasi terdokumentasi di `docs/ssl-setup-guide.md` dan `devops/docs/ssl-setup-guide.md`.
- [x] **SSL Automation & Certbot Ready:** Skrip otomasi `devops/scripts/setup_ssl.sh` tersedia untuk penerbitan self-signed certificate pengujian lokal dan otomasi Certbot Let's Encrypt untuk production.

---

## 2. Kredensial, Autentikasi & Git Hygiene
- [x] **Zero Hardcoded Secrets in Git:**
  - File `.env` dikecualikan dari Git tracking via `.gitignore`.
  - File `.env.example` disediakan sebagai template tanpa nilai kredensial riil.
- [x] **Frontend Authentication Bypass Remediasi:**
  - Celah keamanan `handleLoginAdmin()` di `frontend/index.html` telah diperbaiki.
  - Nilai email dan password hardcoded dihapus dari form input.
  - Akses ditolak jika API login gagal atau backend offline (tidak lagi membypass ke admin).
- [x] **MQTT Broker Authentication (Hardened):**
  - Konfigurasi `automation/mosquitto/config/mosquitto.conf` dan `devops/mosquitto/mosquitto.conf` mengaktifkan `allow_anonymous false`.
  - File otentikasi `passwd` tersedia dengan kredensial `taims-broker:taims-mqtt-2026`.
  - Simulator IoT, edge heartbeat, dan backend telah diselaraskan dengan kredensial tersebut.

---

## 3. Database Backup & Disaster Recovery
- [x] **Portable Automated Backup Script:** `devops/scripts/backup_db.sh` dibuat dinamis menggunakan relative path proyek, mendukung eksekusi di Linux/WSL/Docker, dan otomatis merotasi pencadangan yang berusia lebih dari 7 hari.
- [x] **Disaster Recovery Plan:** Prosedur pemulihan database dan failover terdokumentasi di `devops/docs/recovery.md` dan `docs/recovery.md`.

---

## 4. Full-Stack Containerization
- [x] **Docker Compose Full Orchestration:** File `docker-compose.yml` (Root) dan `automation/docker-compose.yml` mengorkestrasi 5 container utama (`taims-mysql`, `taims-mosquitto`, `taims-backend`, `taims-frontend`, `taims-n8n`) dalam bridge network `taims-net` dengan healthcheck otomatis.
