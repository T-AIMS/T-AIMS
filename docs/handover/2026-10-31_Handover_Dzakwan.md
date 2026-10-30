# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab (Halaman 15 - Template Resmi)*

---

# DAILY HANDOVER

**Nama:** Dzakwan Miftahussobirin  
**Tanggal:** 31 Oktober 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB / Overtime Deployment s.d. 02.45 WIB)  
**Task:** Uji Coba & Integrasi Sistem AI Arik (n8n Workflow Automation, Google Gemini 3.5 Flash Lite, & Telegram Alert) Pasca-Deploy di Server VPS CloudPanel Produksi  
**Status:** DONE  
*(Definition of Done Hal. 15 & 18: Code/Configuration + Testing + Documentation 100% Selesai & Terverifikasi di Server Live)*  

---

### Yang sudah selesai:

1. **Verifikasi & Deployment Mandiri n8n AI Engine di CloudPanel VPS (Hal. 11 & 17):**
   * Menjalankan daemon engine otomasi T-AIMS (`taims-n8n`) di server CloudPanel VPS produksi (`45.198.155.203`) via PM2 pada port `5678` (PID: `568161`).
   * Layanan beroperasi mandiri 24/7 di cloud publik dengan efisiensi memori tinggi (~20MB RAM), terbebas penuh dari ketergantungan pada laptop lokal Arik.

2. **Validasi 3 Berkas Workflow Resmi n8n Arik (Sesuai Target Output Hal. 11):**
   * **`AI dasbord.json` ➔ `/webhook/ai-recommendation` (Output: AI Analysis):** Menerima telemetri agregasi 19 perangkat, mengevaluasi availability (88.9%), dan memicu inferensi preskriptif model *Google Gemini 3.5 Flash Lite* secara instan.
   * **`NOTIFIKASI T-AIMS OFFLINE.json` ➔ `/webhook/taims-alert` (Output: Offline Alert):** Menganalisis penyebab kegagalan perangkat berdasarkan kategori (CCTV, Server, Router, IoT) dan memicu alert merah ke bot Telegram.
   * **`NOTIFIKASI T-AIMS RECOVERY.json` ➔ `/webhook/taims-recovery` (Output: Recovery Alert):** Memproses deteksi perangkat kembali online dan memberikan rekomendasi pencegahan preventif.

3. **Pengujian Pipeline AI Automation Flow (Sesuai Diagram Alur Hal. 17):**
   * Memvalidasi alur lengkap: `Monitoring Database ➔ n8n Webhook (:5678) ➔ AI/LLM (Gemini) ➔ Infrastructure Analysis ➔ Telegram / Web Dashboard`.
   * Diuji langsung melalui tombol `[ 🤖 Rekomendasi AI ]` di dashboard live `https://t-aims.teknolab.biz.id/`: modal AI sukses membedah status 19 perangkat (8 Online, 1 Offline `PC-02`, 10 Unknown) dengan status `PERINGATAN (WARNING)` dan petunjuk teknisi preskriptif.
   * Format laporan AI preskriptif memenuhi contoh standar Dokumen PKL Hal. 17 (*Teknolab Infrastructure Report*).

4. **Integrasi & Pengujian Bot Telegram Resmi (Output: Telegram Output Hal. 11):**
   * Bot `@taims_alert_arik_bot` (Chat ID `-5383419523`) terbukti sukses menerima pesan notifikasi berformat HTML dengan waktu respons cepat (< 6 detik).
   * Fitur proteksi anti-spam *Cooldown Buffer 10 Menit* aktif dan mencegah flooding pesan duplikat.

5. **Sinkronisasi Backend & Penyesuaian Timeout LLM (Hal. 10 & 20):**
   * Backend `taims-backend/.env` disinkronkan ke port `5678` (`N8N_ACTIVE=true`).
   * Menaikkan timeout fetch n8n di backend Express menjadi 35 detik (`commit 3c07cd6`) untuk menjamin stabilitas inferensi LLM saat trafik tinggi.
   * Mengamankan seluruh kredensial API key dan bot token sesuai aturan kerahasiaan Dokumen PKL Hal. 20 (sanitasi commit Git publik).

---

### Yang belum selesai:
1. **Nihil (0)** — Seluruh 5 target output Arik (Offline Alert, Recovery Alert, n8n Workflow, AI Analysis, Telegram Output) dan target integrasi Dzakwan telah selesai 100%.

---

### Kendala:
1. Kredensial rahasia (Gemini API Key & Telegram Token) berisiko terdeteksi oleh *GitHub Push Protection* jika di-commit mentah di repositori publik.
   * **Solusi:** Melakukan sanitasi menyeluruh pada berkas repositori dengan placeholder dinamis dan menginjeksi kredensial asli langsung ke environment runtime VPS (`.env`).
2. Adanya jeda waktu inferensi LLM eksternal (Google Gemini) yang terkadang memakan waktu 5–8 detik pada jaringan sibuk.
   * **Solusi:** Menaikkan batas toleransi timeout backend dari 15 detik ke 35 detik serta mengaktifkan caching lokal 5 menit untuk menghemat token dan mempercepat UX dashboard.

---

### Next Action:
1. Mengintegrasikan seluruh bukti pengujian screenshot (SS-AI-01 s/d SS-AI-05) ke dalam draf Laporan Akhir PKL 30 Hari Teknolab Bab 6.
2. Melaksanakan simulasi uji kegagalan (*Failure Simulation*) bersama seluruh anggota Shift 2 (Damar, Wafian, Arik, Aziz, Reza, Dika) menjelang presentasi final ke mentor.

---

### File / Commit / Evidence:

* **File Alur n8n:**
  - `n8n_workflows/AI dasbord.json`
  - `n8n_workflows/NOTIFIKASI T-AIMS OFFLINE.json`
  - `n8n_workflows/NOTIFIKASI T-AIMS RECOVERY.json`
  - `automation/workflows/01-offline-alert-arik.json`
  - `automation/workflows/02-recovery-alert-arik.json`
  - `automation/workflows/03-ai-dashboard-arik.json`
* **File Service & Deployment:**
  - `network-monitoring/n8n_engine_runner.py` (Daemon Runner Port 5678)
  - `devops/scripts/deploy_n8n_cloudpanel.sh` (Skrip Otomasi Deployment CloudPanel)
* **Commit Git Remote (Branch main):**
  - `dfd1676` — *feat(n8n): import Arik workflows with sanitized credential placeholders and cloudpanel deploy script*
  - `3c07cd6` — *fix(ai): increase n8n webhook timeout to 35s for Gemini inference stability*
  - `dc137ab` — *fix(n8n): load gemini keys safely from .env and environment*
  - `51fb419` — *docs(handover): add Day 20 handover report for AI n8n cloudpanel verification by Dzakwan*
* **Evidence (Bukti Screenshot Rekomendasi):**
  - `SS-AI-01` : Modal Diagnostik AI Gemini 3.5 Flash Lite di web live `https://t-aims.teknolab.biz.id/`
  - `SS-AI-02` : Pesan notifikasi insiden HTML real-time di Telegram Bot `@taims_alert_arik_bot`
  - `SS-AI-03` : Status daemon PM2 di terminal VPS (`taims-backend` & `taims-n8n` port 5678 online)
  - `SS-AI-04` : Konfigurasi variabel `N8N_ACTIVE=true` di file `/home/taims-teknolab/taims-backend/.env`
  - `SS-AI-05` : Panel uji simulasi notifikasi di web dashboard dengan anti-spam cooldown 10 menit
