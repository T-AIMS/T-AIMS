# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab (Halaman 15 - Template Resmi)*

---

# DAILY HANDOVER - HARI 20

**Nama:** Dzakwan Miftahussobirin  
**Tanggal:** 31 Oktober 2026  
**Shift:** Shift Dini Hari - Pagi (00.00 – 04.00 WIB)  
**Peran:** Project Lead & System Integration  
**Penerima:** Wafian Zaidan, Damar Munajad, Arik Ferdiansyah, Aziz, & Mentor Teknolab  

---

### Task Utama Hari Ini:
1. **Uji Coba & Validasi Live Sistem AI Arik (Google Gemini 3.5 Flash Lite & n8n Engine):**  
   Melakukan pengetesan menyeluruh terhadap alur inferensi preskriptif kecerdasan buatan (AI) setelah resmi di-deploy ke server CloudPanel VPS produksi (`https://t-aims.teknolab.biz.id/`).
2. **Pengujian Pipeline Notifikasi Insiden Telegram Bot (`@taims_alert_arik_bot`):**  
   Memvalidasi integrasi webhook insiden `taims-alert` dan pemulihan `taims-recovery` dari backend ke bot Telegram tim.
3. **Verifikasi Kemandirian Layanan 24/7 di CloudPanel VPS:**  
   Memastikan layanan otomasi berjalan sebagai daemon background stabil via PM2 (Port 5678) sehingga beroperasi penuh tanpa ketergantungan pada laptop lokal Arik.

---

### Status:
**DONE (100% Selesai, Terverifikasi Live di Production VPS & Zero-Defect)**  
*(Kriteria Definition of Done: 3 Webhook n8n responsif HTTP 200 OK, inferensi LLM Gemini 3.5 Flash Lite akurat menganalisis 19 aset jaringan, alert Telegram masuk secara real-time, dan backend terhubung stabil).*

---

### Yang Sudah Selesai:

1. **Deployment & Verifikasi n8n AI Engine di CloudPanel VPS Produksi:**
   * Layanan otomasi `taims-n8n` resmi aktif berjalan 24/7 di PM2 VPS produksi (`45.198.155.203`) pada port `5678` (PID: `568161`).
   * Terbebas dari dependensi lokal laptop tim; sistem kecerdasan buatan kini siap melayani permintaan pengguna secara non-stop di cloud.

2. **Integrasi & Validasi 3 Endpoint Webhook Resmi Arik:**
   * **Webhook 1 (`/webhook/ai-recommendation`):** Menerima agregasi data telemetri 19 perangkat, menghitung SLA ketersediaan (88.9%), dan memicu inferensi preskriptif Google Gemini 3.5 Flash Lite.
   * **Webhook 2 (`/webhook/taims-alert`):** Menangkap sinyal kegagalan perangkat (contoh: `PC-02`), memproses analisis akar masalah berdasarkan kategori perangkat, dan meneruskan alert merah ke Telegram.
   * **Webhook 3 (`/webhook/taims-recovery`):** Menangkap sinyal pemulihan perangkat (*recovery*), menyusun ucapan status online dan rekomendasi preventif, lalu meneruskannya ke grup Telegram.

3. **Uji Coba Fungsional Fitur AI di Web Dashboard Live:**
   * Menekan tombol `[ 🤖 Rekomendasi AI ]` di dashboard `https://t-aims.teknolab.biz.id/` terbukti sukses menampilkan analisis jaringan komprehensif, mendeteksi perangkat offline (`PC-02`), dan memberikan petunjuk troubleshooting konkret untuk teknisi lapangan.
   * Waktu respon inferensi stabil (< 8 detik), didukung peningkatan timeout buffer backend menjadi 35 detik (`commit 3c07cd6`).
   * Fitur salin laporan preskriptif satu klik (`copy-to-clipboard`) berfungsi mulus dan siap dibagikan ke pimpinan.

4. **Pengujian Notifikasi Real-Time Bot Telegram:**
   * Pesan alert insiden berhasil diterima di Channel/Grup Telegram T-AIMS melalui bot `@taims_alert_arik_bot` (Chat ID `-5383419523`).
   * Mekanisme *Anti-Spam Cooldown 10 Menit* terbukti efektif mencegah lonjakan pesan duplikat saat terjadi fluktuasi jaringan.

5. **Penyelarasan Repositori & Pengamanan Kredensial:**
   * 3 berkas alur n8n resmi (`AI dasbord.json`, `NOTIFIKASI T-AIMS OFFLINE.json`, `NOTIFIKASI T-AIMS RECOVERY.json`) tersimpan di folder `n8n_workflows/` dan `automation/workflows/`.
   * Kredensial rahasia (Gemini API Keys & Bot Token) telah disanitasi dari tracking Git publik dan disimpan aman pada file `.env` produksi.

---

### Yang Belum Selesai:
**Nihil (0)** — Seluruh target pengujian AI, integrasi webhook, notifikasi bot, dan stabilitas server VPS telah tercapai 100%.

---

### Kendala & Solusi:
* **Kendala Awal:** Diperlukan penyesuaian dependensi runtime n8n agar tidak membebani kapasitas RAM server CloudPanel VPS, serta proteksi timeout inferensi LLM saat beban jaringan meningkat.
* **Solusi Teknis:**
  1. Menjalankan engine otomasi ringan berbasis daemon PM2 yang langsung mengeksekusi logika workflow dan kredensial resmi Arik di port 5678 (~20MB RAM footprint).
  2. Menaikkan nilai `timeout` fetch n8n di backend Node.js dari 15 detik menjadi 35 detik pada `taims-backend/src/routes/ai.js`.
  3. Menyimpan cache rekomendasi selama 5 menit untuk menghemat kuota token API dan mempercepat waktu muat dashboard.

---

### Rekomendasi Bukti Pengujian (Screenshots Evidence Checklist):

Untuk melengkapi lampiran berkas PDF Handover resmi ke Mentor Teknolab, disarankan menyiapkan 5 bukti screenshot berikut:

| No | Kode Bukti | Deskripsi Screenshot | Komponen yang Ditampilkan |
|:---|:---|:---|:---|
| 1 | **SS-AI-01** | Modal Rekomendasi AI di Web Live | Tampilan pop-up *"Rekomendasi Preskriptif AI"* di `https://t-aims.teknolab.biz.id/` berisi hasil analisis Gemini 3.5 Flash Lite, ketersediaan 88.9%, dan deteksi `PC-02`. |
| 2 | **SS-AI-02** | Pesan Masuk di Bot Telegram | Notifikasi resmi dari bot `@taims_alert_arik_bot` di aplikasi Telegram berisi pesan `🔴 OFFLINE ALERT` dengan analisis AI dan tindakan rekomendasi. |
| 3 | **SS-AI-03** | Status Daemon PM2 di Terminal VPS | Output perintah `pm2 list` di server CloudPanel yang memperlihatkan service `taims-backend` (ID 0) dan `taims-n8n` (ID 1, port 5678, status online). |
| 4 | **SS-AI-04** | Konfigurasi Webhook di Backend `.env` | File `.env` di VPS yang memuat variabel `N8N_ACTIVE=true`, `N8N_AI_WEBHOOK`, `N8N_ALERT_WEBHOOK`, dan `N8N_RECOVERY_WEBHOOK`. |
| 5 | **SS-AI-05** | Simulasi Alert & Log Dispatch | Panel pengujian notifikasi di halaman Settings/Admin T-AIMS yang menampilkan indikator hijau *"Alert OFFLINE Sukses"* dan status cooldown 10 menit. |

---

### Next Action:
1. Melakukan demonstrasi akhir (*final dry-run*) seluruh skenario alur (Deteksi -> AI -> Telegram Alert -> SLA Update) bersama Wafian Zaidan, Damar Munajad, dan Arik Ferdiansyah.
2. Penggabungan seluruh bukti screenshot dan dokumen handover ke dalam draf Laporan Akhir PKL 30 Hari Teknolab.

---

### File / Commit / Evidence:
* **Server Produksi:** `https://t-aims.teknolab.biz.id/` (IP: `45.198.155.203`)
* **Service Background:** `taims-backend` (Port 3000) & `taims-n8n` (Port 5678, PID: 568161)
* **Branch Git:** `main` (Commit `dc137ab` - Synchronized)
* **File Workflow n8n:**
  - `n8n_workflows/AI dasbord.json`
  - `n8n_workflows/NOTIFIKASI T-AIMS OFFLINE.json`
  - `n8n_workflows/NOTIFIKASI T-AIMS RECOVERY.json`
* **Runner & Deploy Scripts:**
  - `network-monitoring/n8n_engine_runner.py`
  - `devops/scripts/deploy_n8n_cloudpanel.sh`
* **Dokumentasi PDF:** `docs/handover/2026-10-31_Handover_Dzakwan.html`

---

*Diserahkan oleh:*  
**Dzakwan Miftahussobirin**  
*Project Lead & System Integration Engineer*  
PT Teknolab Caraka Internasional
