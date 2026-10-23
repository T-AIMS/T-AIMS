# T-AIMS Infrastructure Security Checklist & Secret Governance Guide
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer - Shift 2*)  
**Pembaruan Terakhir:** 23 Oktober 2026 (Fase Hari 11–12 - Standarisasi Multi-Site & Secret Governance)  
**Referensi:** Dokumen Kerja PKL T-AIMS Teknolab 30 Hari (Hal. 12 & 20)  
**Status Audit:** 100% HARDENED & COMPLIANT DENGAN DOKUMEN TEKNOLAB & OWASP STANDARDS

---

## 1. Tata Kelola Kredensial & Lingkungan (Secret Governance - Hal. 20)
- [x] **Zero Hardcoded Secrets in Git Tracking:**
  * Seluruh file `.env` dan `.env.local` dikecualikan dari repositori melalui `.gitignore`.
  * File `.env.example` bersih dari kredensial produksi dan berfungsi murni sebagai template.
- [x] **Device API Key Isolation:**
  * Pengamanan telemetri perangkat monitoring menggunakan `x-api-key` header (`DEVICE_API_KEY`) yang diisolasi di lingkungan container Docker dan daemon monitoring (`taims_dev_5bee...`).
  * Percobaan akses endpoint `/api/monitoring/ping` tanpa kunci yang valid langsung diblokir dengan kode **HTTP 401 / 403**.
- [x] **File Permissions Hardening:**
  * Izin hak akses file kredensial dibatasi ketat (`chmod 600 .env` dan `chmod 700 /var/backups/taims`).

---

## 2. Autentikasi JWT & Mitigasi Replay Attack (Anti-Replay Protection)
- [x] **Token Blacklisting Mechanism:**
  * Mekanisme pencabutan sesi aktif pada saat logout (`POST /api/auth/logout`) otomatis mendaftarkan JWT token ke tabel database `token_blacklist`.
  * **Uji Replay Attack:** Penggunaan kembali token yang telah logout langsung digagalkan dengan respons **HTTP 401 Unauthorized** (*"Token sudah di-logout. Silakan login ulang"*).
- [x] **Automated Database Maintenance (Purge Scheduler):**
  * Event scheduler MySQL `purge_expired_token_blacklist` aktif berjalan otomatis setiap 1 hari untuk membersihkan token kedaluwarsa (`expires_at < NOW()`), mencegah pembengkakan tabel database.

---

## 3. Otorisasi Akses Berbasis Peran (RBAC - Least Privilege)
- [x] **Matrix Hak Akses Multi-Role:**
  * `super_admin`: Create, Read, Update, Delete (Full Access).
  * `admin`: Create, Read, Update (**Delete Ditolak - 403 Forbidden**).
  * `user`: Read Only.
- [x] **Verifikasi Pembatasan Aksi Sensitif:**
  * Uji coba eksekusi `DELETE /api/assets/:id` oleh role admin berhasil diblokir dengan respons resmi:
    `HTTP 403 Forbidden: {"success": false, "error": "Role 'admin' tidak bisa delete"}`.

---

## 4. Server, Port & Network Hardening
- [x] **Port Matrix Isolated & Sanitized:**
  * `3307 -> 3306`: MySQL Database (Terisolasi di Docker internal network `taims-net`).
  * `1883`: MQTT Broker TCP Listener (Otentikasi kredensial `taims-broker`).
  * `9001`: MQTT WebSocket Listener (Terhubung ke Nginx / Dashboard).
  * `3000`: Backend REST API Express (Healthcheck HTTP 200).
  * `3001`: Frontend Static Web Nginx.
  * `5678`: n8n AI Automation Workflow Engine.
- [x] **Eliminasi Zombie Container:** Container dangling/dead (`dreamy_euler`) telah dibersihkan secara permanen.
- [x] **Daemon Otomatisasi Monitoring:** Service background daemon `network-monitoring/monitoring_engine.py` aktif menginspeksi 15 aset multi-site secara berkala setiap 15 detik dengan pencatatan log terpusat di `logs/monitoring.log`.

---

## 5. Web Application Firewall & Security Headers (OWASP Hardening)
- [x] **Nginx Security Headers Injection:**
  * `X-Frame-Options: SAMEORIGIN` (Mitigasi Clickjacking).
  * `X-Content-Type-Options: nosniff` (Mitigasi MIME-type Sniffing).
  * `X-XSS-Protection: 1; mode=block` (Mitigasi Cross-Site Scripting).
  * `Referrer-Policy: strict-origin-when-cross-origin` (Proteksi kebocoran URL referrer).
  * `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS Enforcement).

---

## 6. Disaster Recovery & Backup Retention
- [x] **Automated Crontab Backup:** Berjalan terjadwal setiap pukul 02.00 WIB via `backup_db.sh`.
- [x] **Rotasi Retensi 7 Hari:** Skrip otomatis menghapus backup dump yang berusia lebih dari 7 hari untuk menjaga kapasitas penyimpanan server.
