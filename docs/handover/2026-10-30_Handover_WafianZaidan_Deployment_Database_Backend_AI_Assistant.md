# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab*

---

# DAILY HANDOVER

**Nama:** Wafian Zaidan  
**Tanggal:** 30 Oktober 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB)  

**Task:**  
Deployment Update Database Master 19 Aset, Backend Telemetry Hardening, dan n8n AI Assistant Engine di CloudPanel VPS Produksi

**Status:**  
Selesai 100% (DONE - Zero Defect & Zero Blocker)

---

### Yang sudah selesai:
1. **Deployment Update Database Master 19 Aset Produksi:**
   - Melakukan pembaruan dan sinkronisasi struktur inventaris pada database MySQL `taims-db` di CloudPanel VPS (`45.198.155.203`) hingga genap memuat 19 aset (menambahkan 4 node House of Server: `PC-03`, `CLOUD-01`, `RTR-04`, `CAS-01`).
   - Menerapkan fitur **Standby Protection** pada backend `monitoring.js`: 10 aset rak server fisik yang belum aktif dialiri listrik terkunci di status `unknown: 10`, dan otomatis melompat ke status `online` seketika saat menerima ping nyata pertama kali.

2. **Hardening Backend & Anti-Flapping Telemetry Engine:**
   - Menerapkan mekanisme **Anti-Flapping Debounce (Hysteresis)** pada `saveMonitoringLog()`: mencegah tabrakan paket sweep ICMP Docker yang mem-ping IP lama agar tidak membalikkan status perangkat online secara berulang (hasil stabil: 8 online, 1 offline terkonfirmasi, 10 unknown).
   - Memulihkan handler grafik tren telemetri 24 jam pada `dashboard.js` dengan menyertakan dataset lengkap (`online`, `offline`, `warning`) serta membersihkan duplikasi route `/uptime`.
   - Mengoptimalkan batas timeout pemanggilan AI pada `ai.js` menjadi 35 detik.

3. **Deployment Runner n8n AI Assistant & Integrasi Google Gemini 3.5 Flash Lite:**
   - Menyiapkan dan menjalankan runner engine automasi n8n resmi Arik (`taims-n8n`) via PM2 daemon (PID: `568161`) di port `5678`.
   - Mengaktifkan dan memvalidasi 3 endpoint webhook resmi:
     - `/webhook/ai-recommendation` (teruji sukses menghasilkan inferensi analitik Gemini 3.5 Flash Lite untuk 19 perangkat dengan sistem cache 5 menit).
     - `/webhook/taims-alert` (terintegrasi bot Telegram `@taims_alert_arik_bot`).
     - `/webhook/taims-recovery` (notifikasi pemulihan status perangkat).
   - Melakukan sinkronisasi berkas konfigurasi `/home/taims-teknolab/taims-backend/.env` dengan kredensial Gemini API, Telegram Bot Token, dan variabel `N8N_ACTIVE=true`.

4. **Verifikasi Web Live Produksi (`https://t-aims.teknolab.biz.id/`):**
   - Menguji tombol cepat Asisten AI pada topbar header (ikon kuning keemasan) dan halaman menu AI Assistant: sistem sukses menampilkan analisis jaringan dan rekomendasi teknisi NOC secara real-time.
   - Seluruh checksum berkas frontend (`index.html`, `app.js`, `style.css`, `apiService.js`) dan backend terverifikasi 100% identik dengan commit remote Git.

---

### Yang belum selesai:
1. Tidak ada (Seluruh target deployment database, backend, dan AI assistant shift ini telah selesai 100%).

---

### Kendala:
1. Adanya paket *sweep ping* dari mesin Docker lab dengan daftar IP lama yang sempat menyebabkan status perangkat online berkedip (*flapping*). Kendala berhasil diatasi tuntas dengan menambahkan toleransi waktu *Anti-Flapping Debounce* (`sec_since_seen < 45 detik`) di backend.
2. Waktu respons pemanggilan Google Gemini API dari server VPS membutuhkan durasi ~20 detik sehingga sempat terputus oleh batas timeout bawaan (15 detik). Kendala berhasil diselesaikan dengan menaikkan batas timeout runner engine menjadi 30 detik dan backend menjadi 35 detik.

---

### Next Action:
1. Memantau stabilitas layanan daemon PM2 (`taims-backend` & `taims-n8n`) serta konsistensi status 19 aset di dashboard produksi.
2. Melakukan koordinasi lanjutan bersama Arik dan Dzakwan untuk pengetesan terpadu (*end-to-end smoke test*) saat pengujian perangkat fisik di lab.

---

### File / Commit / Evidence:
- **Repositori:** `https://github.com/T-AIMS/T-AIMS` (Branch: `main`)
- **Git Commit:** 
  - `868a8b0`: *fix(monitoring): implement standby protection and anti-flapping debounce for telemetry stability*
  - `dfd1676`: *feat(n8n): import Arik workflows with sanitized credential placeholders and cloudpanel deploy script*
  - `3c07cd6`: *fix(ai): increase n8n webhook timeout to 35s for Gemini inference stability*
- **File Konfigurasi & Kode:**
  - `taims-backend/src/routes/monitoring.js`
  - `taims-backend/src/routes/dashboard.js`
  - `taims-backend/src/routes/ai.js`
  - `/home/taims-teknolab/taims-backend/.env`
  - `network-monitoring/n8n_engine_runner.py`
  - `n8n_workflows/` (`AI dasbord.json`, `NOTIFIKASI T-AIMS OFFLINE.json`, `NOTIFIKASI T-AIMS RECOVERY.json`)
- **Bukti Operasional Server:**
  - PM2 Daemon Status: `taims-backend` (PID: `567387`, status online) & `taims-n8n` (PID: `568161`, status online).
  - Respon Webhook AI: HTTP 200 OK via `POST http://127.0.0.1:5678/webhook/ai-recommendation` menghasilkan teks rekomendasi otentik Google Gemini 3.5 Flash Lite.
  - Domain Live Produksi: `https://t-aims.teknolab.biz.id/`
