# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab*

---

# DAILY HANDOVER

**Nama:** Wafian Zaidan  
**Tanggal:** 2 November 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB)  

**Task:**  
Deploy Multi-Recipient SMTP Alerting 12 Anggota Tim, Sinkronisasi Frontend Dasbor CloudPanel, Audit Celah Keamanan OWASP Top 10, Patch 5 Kerentanan Kritis, dan Verifikasi Uji Penetrasi Server Produksi

**Status:**  
DONE (100% Terverifikasi di Server Live VPS CloudPanel & GitHub Commit 2ccf970)

---

### Yang sudah selesai:
1. **Konfigurasi & Deployment Multi-Recipient SMTP Incident Alert (12 Surel Tim):**
   - Mendaftarkan dan mengonfigurasi variabel `ALERT_EMAIL` pada file lingkungan `.env` VPS CloudPanel `/home/taims-teknolab/taims-backend/.env` mencakup 12 alamat email resmi anggota tim teknis Shift 1 & Shift 2 (Dzakwan, Wafian, Arick, Damar, Reza Fahmi, Faida, Ilvina, Ananda, Dika, Aziz, Reza Tri, serta central NOC inbox `noc-alerts@teknolab.id`).
   - Menerapkan arsitektur pengiriman notifikasi insiden simultan sehingga seluruh teknisi dan PIC aset menerima peringatan perangkat offline secara serentak.

2. **Sinkronisasi Frontend Dasbor CloudPanel (`htdocs/t-aims.teknolab.biz.id/`):**
   - Menyinkronkan berkas antarmuka `frontend/*` rilis terbaru ke direktori webroot CloudPanel, merefresh tampilan kartu *SMTP Email Dispatcher* menjadi `Target: 11 Anggota Tim Teknolab`, dan memvalidasi status gateway menjadi **Active**.
   - Telah diaudit langsung oleh Ketua Tim (Dzakwan Miftahussobirin) dengan hasil **100% CLEAR & CLEAN**.

3. **Audit Celah Keamanan OWASP Top 10 & Remediasi Kode Backend:**
   - **Patch Information Disclosure (`routes/notifications.js`):** Mengunci endpoint `GET /api/notifications/telegram/status` dengan middleware `authenticate` sehingga data 12 surel pribadi tim dan alamat webhook internal n8n loopback tertutup rapat dari akses publik tanpa login (**HTTP 401 Unauthorized**).
   - **Patch Unauthenticated Telemetry Injection / DoS (`routes/monitoring.js`):** Memasang middleware `apiKeyAuth` pada endpoint `POST /api/monitoring/server-telemetry` untuk mencegah penyuntikan metrik CPU/RAM palsu dan flooding database MySQL (**HTTP 401 Unauthorized**).
   - **Patch Broken Access Control & Privilege Escalation (`routes/settings.js`):** Membatasi akses mutasi pengaturan sistem `POST /api/settings` khusus untuk role berwenang (`super_admin` dan `admin`), serta memblokir token non-admin/tamu (**HTTP 403 Forbidden**). Menghapus fallback hardcode token Telegram.
   - **Patch Unauthorized Maintenance Gating (`routes/monitoring.js`):** Mengunci endpoint housekeeping pembersihan log `POST /api/monitoring/clean-logs` khusus bagi akun Superadmin (**HTTP 403 Forbidden**).
   - **Patch Anti-Spam Broadcast Alerting (`routes/notifications.js`):** Membatasi pemicu pengujian insiden dan pengiriman telegram kustom (`/send`, `/test-alert`, `/report`) khusus untuk admin/superadmin (**HTTP 403 Forbidden**).
   - **Aktivasi Login Rate Limiter (`app.js`):** Memasang middleware `loginLimiter` pada rute otentikasi `/api/auth` untuk mitigasi serangan brute-force.

4. **Verifikasi Uji Penetrasi Langsung ke Server Produksi (Live Pentest):**
   - Menjalankan serangkaian pengujian langsung via `curl` ke domain produksi `https://t-aims.teknolab.biz.id/`.
   - Seluruh celah keamanan terkonfirmasi sukses memblokir eksploitasi dengan kode status proteksi yang presisi (HTTP 401 / 403), sementara akses pengguna sah di dasbor web tetap beroperasi lancar (HTTP 200 OK).

---

### Yang belum selesai:
1. Tidak ada (Seluruh target konfigurasi alert multi-recipient, sinkronisasi frontend, audit celah keamanan, patch kerentanan, dan verifikasi live pentest telah tuntas 100%).

---

### Kendala:
1. Terjadi anomali encoding karakter terminal saat penulisan baris `ALERT_EMAIL` di file `.env` VPS CloudPanel. Kendala diselesaikan secara tuntas menggunakan perintah regex `sed` dan diverifikasi dengan `tail -n 2` serta audit Lead Tim.
2. Endpoint monitoring `/server-telemetry` dan status notifikasi sebelumnya belum diproteksi middleware autentikasi. Telah diremediasi secara menyeluruh dengan token bearer & device API key.

---

### Next Action:
1. Menjaga stabilitas infrastruktur peladen selama pengujian alur notifikasi riil berlangsung.
2. Menginput Google App Password 16-digit pada `SMTP_PASS` di file `.env` server begitu akun Gmail pengirim utama disepakati bersama oleh tim.

---

### File / Commit / Evidence:
- **Repositori & Commit Git:** `https://github.com/T-AIMS/T-AIMS` (Branch: `main`)
  * `4add8f1`: *feat(alert): register all 11 Teknolab project team emails for simultaneous multi-recipient SMTP incident alerts*
  * `ada5548`: *feat(alert): set SMTP gateway status to Active when 11 team emails are armed and ready*
  * `2ccf970`: *fix(security): resolve OWASP vulnerabilities (information disclosure, unauthenticated telemetry, broken access control, and rate limiting)*
- **Berkas Teknis yang Diperbarui:**
  * `taims-backend/src/routes/notifications.js` (Information Disclosure Fix & Authorization Checks)
  * `taims-backend/src/routes/settings.js` (Privilege Escalation Gating & Dynamic Secrets)
  * `taims-backend/src/routes/monitoring.js` (Telemetry apiKeyAuth & Maintenance Gating)
  * `taims-backend/src/app.js` (Active Login Rate Limiter Middleware)
  * `frontend/index.html` & `frontend/assets/js/app.js` (Active SMTP Gateway Visuals)
- **Bukti Screenshot Otentik DevOps (Folder `docs/evidence-wafian/hari-22/`):**
  * `01-multi-recipient-smtp-vps-deployment.png`: *Terminal SSH VPS CloudPanel — Deploy frontend dan konfirmasi kartu target 11 Anggota Tim Teknolab.*
  * `02-lead-audit-confirmation-clear-clean.png`: *Audit Resmi Ketua Tim (Dzakwan) — Verifikasi 100% CLEAR & CLEAN pada pipeline backend dan live web.*
  * `03-lead-task-instruction-frontend-smtp.png`: *Instruksi Kerja Lead Tim terkait pembaruan frontend dasbor dan modul SMTP Standby.*
  * `04-owasp-vulnerability-penetration-testing-proof.png`: *Bukti Pengujian Penetrasi Langsung Server Produksi — Verifikasi blokir HTTP 401 & HTTP 403 pada 5 celah OWASP.*
  * `README.md`: *Matriks ringkasan audit DevOps Hari ke-22.*
- **Domain Live Server Produksi Terverifikasi:** `https://t-aims.teknolab.biz.id`
