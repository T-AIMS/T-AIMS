# T-AIMS Infrastructure Security Checklist & Hardening Guide
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer*)  
**Pembaruan Terakhir:** 17 Oktober 2026 (Shift 2)  
**Status Audit:** Hardened & Compliant dengan Panduan Operasional PKL (Lihat: `evaluasi-keamanan-data.md`)

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
- [x] **Reverse Proxy & SSL Termination:** Konfigurasi Nginx siap pakai di `devops/nginx/nginx.conf` dengan HTTPS (Port 443), HSTS, X-Frame-Options, dan X-Content-Type-Options. Panduan implementasi terdokumentasi di `devops/docs/ssl-setup-guide.md`.
- [ ] **Firewall UFW Hardening (VPS Production):**
  - Hanya port 80, 443, dan port SSH kustom yang terbuka ke publik. Port 3306 dan 5678 dibatasi via internal network / VPN.

---

## 2. Kredensial, Autentikasi & Git Hygiene
- [x] **Zero Hardcoded Secrets in Git:**
  - File `.env` dikecualikan dari Git tracking via `.gitignore`.
  - File `.env.example` disediakan sebagai template tanpa nilai kredensial riil.
- [x] **Frontend Authentication Bypass Remediasi:**
  - Celah keamanan `handleLoginAdmin()` di `frontend/index.html` telah diperbaiki.
  - Nilai email dan password hardcoded dihapus dari form input.
  - Akses ditolak jika API login gagal atau backend offline (tidak lagi membypass ke admin).
- [x] **MQTT Broker Dual-Mode Configuration:**
  - `devops/mosquitto/mosquitto.conf`: Mode Development (`allow_anonymous true`) untuk kemudahan pengujian hardware/simulator.
  - `devops/mosquitto/mosquitto.prod.conf`: Mode Production Hardened (`allow_anonymous false`, autentikasi file passwd aktif).
  - *Catatan Transisi:* Aktivasi `mosquitto.prod.conf` menunggu sinkronisasi kredensial serentak dari IoT (Ilvina), Backend (Reza), dan n8n (Arik).

---

## 3. Database Backup & Disaster Recovery
- [x] **Portable Automated Backup Script:** `devops/scripts/backup_db.sh` dibuat dinamis menggunakan relative path proyek, mendukung eksekusi di Linux/WSL/Docker, dan otomatis merotasi pencadangan yang berusia lebih dari 7 hari.
- [x] **Disaster Recovery Plan:** Prosedur pemulihan database dan failover terdokumentasi di `devops/docs/recovery.md`.

---

## 4. Full-Stack Containerization
- [x] **Docker Compose Full Orchestration:** File `docker-compose.yml` di root mengorkestrasi 5 container utama (`taims-mysql`, `taims-mosquitto`, `taims-backend`, `taims-frontend`, `taims-n8n`) dalam bridge network `taims-net` dengan healthcheck otomatis.
