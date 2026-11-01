# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab*

---

# DAILY HANDOVER

**Nama:** Wafian Zaidan  
**Tanggal:** 1 November 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB)  

**Task:**  
Security Hardening n8n Port 5678, Resolusi Spam Duplicate Alert, Penerapan Startup Grace Period 60 Detik, dan Integrasi Kunci API Google Gemini untuk Notifikasi Cerdas

**Status:**  
DONE (100% Terverifikasi di Server Live VPS CloudPanel)

---

### Yang sudah selesai:
1. **Security Hardening & Local Loopback Binding (Port 5678):**
   - Mengubah bind address server HTTP runner n8n dari `0.0.0.0` menjadi `127.0.0.1` (`Protected Loopback`) dan menerapkan IP Whitelisting internal (`127.0.0.1`, `localhost`, `::1`) sehingga port 5678 tertutup rapat dari luar dan hanya melayani komunikasi internal backend di VPS CloudPanel.
   - Menambahkan mekanisme verifikasi header rahasia (`X-TAIMS-WEBHOOK-SECRET`) pada engine runner dan menginjeksi header otomatis pada client Express.js (`src/routes/notifications.js` dan `src/routes/ai.js`). Permintaan tanpa token resmi langsung ditolak dengan status HTTP 401 Unauthorized.

2. **Resolusi Duplicate Alert (Eliminasi Pesan Dobel Telegram):**
   - Menghapus/menonaktifkan pemanggilan *Direct Telegram Bot API* pada `src/routes/notifications.js` sehingga seluruh notifikasi keluar **1 PINTU murni lewat n8n AI Engine Runner Port 5678**.
   - Menghilangkan bug pesan kembar di mana grup Telegram sebelumnya menerima 2 pesan identik pada detik yang sama.

3. **Penerapan Startup Grace Period 60 Detik (Anti-Restart Flapping):**
   - Menginjeksi jeda *Startup Grace Period* 60 detik pada `src/services/offline-checker.js` saat backend pertama kali startup.
   - Memberikan jeda waktu yang cukup bagi ICMP ping engine & broker untuk menyinkronkan denyut pertama perangkat, mencegah terjadinya *False Alert* (CCTV-01 & RTR-01) saat proses restart deployment server.

4. **Integrasi Kunci API Google Gemini 3.5 Flash Lite:**
   - Menginjeksi kredensial resmi dari Arik untuk variabel `GEMINI_KEY_NOTIF` dan `GEMINI_KEY_DASHBOARD` pada konfigurasi environment produksi VPS CloudPanel.
   - Mengaktifkan kemampuan inferensi cerdas Gemini untuk menganalisis akar masalah dan tindakan remediasi secara otomatis tanpa jatuh ke template darurat.

---

### Yang belum selesai:
1. Tidak ada (Seluruh target security hardening, eliminasi duplicate alert, grace period, dan aktivasi AI Gemini telah selesai 100%).

---

### Kendala:
1. Pengiriman notifikasi sebelumnya terjadi secara ganda karena backend menembak n8n webhook sekaligus direct fetch Telegram. Kendala terselesaikan secara permanen dengan memusatkan alur pengiriman 1 pintu melalui runner n8n.

---

### Next Action:
1. Melakukan uji tembak bersama Arik dan Dzakwan untuk mengonfirmasi bahwa output notifikasi di Telegram kini keluar tunggal dengan analisis AI Gemini lengkap.
2. Memantau efisiensi konsumsi memori PM2 (`taims-backend` & `taims-n8n`) pasca-penerapan hardening keamanan.

---

### File / Commit / Evidence:
- **Repositori:** `https://github.com/T-AIMS/T-AIMS` (Branch: `main`)
- **Git Commit:**
  * `0080dde`: *feat(security): implement n8n webhook secret token auth and local loopback bind hardening*
  * `071c675`: *fix(alert): disable direct telegram duplicate dispatch and add 60s startup grace period*
- **File Teknis yang Diperbarui:**
  * `network-monitoring/n8n_engine_runner.py` (Local Loopback Bind & Secret Header Verification)
  * `taims-backend/src/routes/notifications.js` (Eliminasi Direct Telegram API & Secure Header)
  * `taims-backend/src/services/offline-checker.js` (Startup Grace Period 60 Detik)
  * `taims-backend/.env` (Konfigurasi N8N_WEBHOOK_SECRET & Kunci API Google Gemini)
- **Bukti Screenshot Otentik DevOps (Folder `docs/evidence-wafian/hari-21/`):**
  * `01-cloudpanel-pm2-security-hardened-status.png`: *Terminal SSH VPS CloudPanel (port 2222) — Status daemon taims-backend & taims-n8n online pasca-hardening dan lolos healthcheck curl 200 OK.*
  * `02-security-hardening-secret-token-diff.png`: *Verifikasi Pengujian Keamanan Webhook: Git commit 0080dde, uji token rahasia HTTP 200 OK, serta blokir akses publik luar.*
  * `03-anti-duplicate-grace-period-deployment.png`: *Verifikasi eliminasi spam duplicate alert, startup grace period 60 detik, dan aktivasi Gemini API keys.*
  * `README.md`: *Matriks ringkasan audit DevOps Hari ke-21.*
- **Domain Live Produksi Terverifikasi:** `https://t-aims.teknolab.biz.id`
