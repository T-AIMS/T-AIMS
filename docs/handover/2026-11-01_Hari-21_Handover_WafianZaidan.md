# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab*

---

# DAILY HANDOVER

**Nama:** Wafian Zaidan  
**Tanggal:** 1 November 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB)  

**Task:**  
Security Hardening n8n Port 5678 (Pemasangan Autentikasi Secret Token & Local Loopback IP Whitelist Binding di VPS CloudPanel)

**Status:**  
DONE (100% Terverifikasi di Server Live VPS CloudPanel)

---

### Yang sudah selesai:
1. **Implementasi Autentikasi Secret Token Header (`X-TAIMS-WEBHOOK-SECRET`):**
   - Menambahkan mekanisme verifikasi otentikasi header rahasia pada engine webhook runner `network-monitoring/n8n_engine_runner.py`.
   - Menginjeksi pengiriman header otomatis pada client Express.js (`taims-backend/src/routes/notifications.js` dan `src/routes/ai.js`) sehingga seluruh permintaan telemetri antar-service terlindungi dari unauthorized payload injection. Request tanpa token valid langsung ditolak dengan status HTTP 401 Unauthorized.

2. **Network Level Hardening & Local Loopback Binding (Port 5678):**
   - Mengubah bind address server HTTP runner dari `0.0.0.0` (terbuka publik) menjadi `127.0.0.1` (`Protected Loopback`).
   - Menerapkan IP Whitelisting internal (`127.0.0.1`, `localhost`, `::1`) sehingga port 5678 tertutup rapat dari luar dan hanya melayani komunikasi internal backend di VPS CloudPanel.

3. **Sinkronisasi Kode & Deployment Layanan Produksi di CloudPanel:**
   - Menyinkronkan perubahan ke branch remote GitHub `main` (commit `0080dde`).
   - Melakukan deployment dan update berkas pada server live VPS CloudPanel (`45.198.155.203:2222`), melengkapi dependensi service modul backend, serta me-restart kedua daemon PM2 (`taims-backend` ID 0 & `taims-n8n` ID 1) yang berjalan stabil online dengan memory optimal (< 75 MB).

4. **Verifikasi Kelaikan Keamanan & Healthcheck Endpoint API:**
   - Memvalidasi endpoint `https://t-aims.teknolab.biz.id/api/health` mengembalikan status `healthy` (HTTP 200 OK) dengan rincian arsitektur: API online, MariaDB connected, MQTT broker ready, dan Ping Engine active.
   - Menguji koneksi publik luar ke port `45.198.155.203:5678` terbukti diblokir/timeout (Zero Public Attack Surface).

---

### Yang belum selesai:
1. Tidak ada (Seluruh target security hardening port 5678, proteksi secret header, dan verifikasi loopback bind telah tuntas 100%).

---

### Kendala:
1. Daemon backend sempat mengalami restart akibat dependensi berkas modul `email-service.js` belum tersinkron di folder services server. Kendala terselesaikan secara cepat dengan melakukan deployment lengkap direktori `src/services/` sehingga API kembali beroperasi normal 100%.

---

### Next Action:
1. Memantau efisiensi konsumsi memori PM2 (`taims-backend` & `taims-n8n`) pasca-penerapan hardening keamanan.
2. Melakukan evaluasi berkala terhadap log request n8n untuk memastikan tidak ada anomali atau percobaan akses tidak sah.

---

### File / Commit / Evidence:
- **Repositori:** `https://github.com/T-AIMS/T-AIMS` (Branch: `main`)
- **Git Commit:**
  * `0080dde`: *feat(security): implement n8n webhook secret token auth and local loopback bind hardening*
- **File Teknis yang Diperbarui:**
  * `network-monitoring/n8n_engine_runner.py` (Local Loopback Bind & Secret Header Verification)
  * `taims-backend/src/routes/notifications.js` (Secure Header Injection)
  * `taims-backend/src/routes/ai.js` (Secure Header Injection)
  * `taims-backend/.env` (Konfigurasi N8N_WEBHOOK_SECRET)
- **Bukti Screenshot Otentik DevOps (Folder `docs/evidence-wafian/hari-21/`):**
  * `01-cloudpanel-pm2-security-hardened-status.png`: *Terminal SSH VPS CloudPanel (port 2222) — Status daemon taims-backend & taims-n8n online pasca-hardening dan lolos healthcheck curl 200 OK.*
  * `02-security-hardening-secret-token-diff.png`: *Verifikasi Pengujian Keamanan Webhook: Git commit 0080dde, uji token rahasia HTTP 200 OK, serta blokir akses publik luar.*
  * `README.md`: *Matriks ringkasan audit DevOps Hari ke-21.*
- **Domain Live Produksi Terverifikasi:** `https://t-aims.teknolab.biz.id`
