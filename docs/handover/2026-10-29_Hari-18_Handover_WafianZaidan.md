# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab*

---

# DAILY HANDOVER

**Nama:** Wafian Zaidan  
**Tanggal:** 29 Oktober 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB)  

**Task:**  
Deploy Live Server Produksi CloudPanel (`https://t-aims.teknolab.biz.id`), Konfigurasi SSL HTTPS Let's Encrypt, Telemetri Real-Time 18 Perangkat, dan Resolusi Defect CSS SLA Bar

**Status:**  
Selesai 100% (DONE - Zero Defect & Zero Blocker)

---

### Yang sudah selesai:
1. **Deployment Penuh Server Produksi Live CloudPanel:**
   - Berhasil mempublikasikan sistem T-AIMS secara live ke domain resmi **`https://t-aims.teknolab.biz.id`** pada VPS CloudPanel IP `45.198.155.203` (Port SSH: 2222).
   - Memasang sertifikat enkripsi SSL resmi Let's Encrypt (*Status: Certificate is valid & Connection is secure*) dengan HTTP Strict Transport Security (HSTS).
   - Menjalankan backend Express.js di background via PM2 daemon (`taims-backend`) port 3000 dan mengonfigurasi reverse proxy Nginx CloudPanel.

2. **Sinkronisasi Topologi Telemetri 18 Perangkat Produksi:**
   - Mengimpor skema database produksi dengan total 18 perangkat aktif melintasi 3 lokasi (Head Office, Marketing Office, House of Server).
   - Memastikan telemetri live update 5 detik, donut chart kategori, tabel status, dan peta GIS 3 wilayah Blitar beroperasi mulus mengembalikan HTTP 200 OK.

3. **Integrasi Gateway Notifikasi Telegram & Otomasi n8n:**
   - Menghubungkan variabel environment produksi (`.env`) untuk Bot Telegram `@taims_alert_arik_bot` (Chat ID: `-5383419523`) dan webhook automasi n8n port 5678.
   - Mengonfigurasi modul pelaporan agar otomatis memicu fungsi analisis AI (`runAiAnalysis()`) saat teknisi membuka tab laporan.

4. **Audit SLA Ketersediaan Sistem 30 Hari & Resolusi Defect Visual CSS:**
   - Menuntaskan anomali visual pada modul *System Availability & SLA Summary 30 Days* di mana diagram progress bar per site sebelumnya tidak muncul akibat hilangnya properti `height` pada class `.sbi-prog` di stylesheet `style.css`.
   - Menginjeksi perbaikan CSS `.sbi-prog { height: 100%; border-radius: 3px; }` sehingga batang diagram warna ketersediaan SLA (Marketing Office 91.7%, Head Office 26.6%) kini ter-render presisi.

---

### Yang belum selesai:
1. Tidak ada (Semua target live deployment produksi dan konfigurasi SSL telah tuntas 100%).

---

### Kendala:
1. Port SSH default 22 di server VPS CloudPanel ditutup/diblokir oleh provider hosting demi keamanan, sehingga koneksi sempat mengalami *Connection Timed Out*. Kendala diselesaikan dengan mengarahkan seluruh sesi transfer file SCP dan remote SSH ke port custom **2222**.

---

### Next Action:
1. Menyelaraskan sisa audit 10 poin produksi (auto-suggest Bab 6 PKL, smart hybrid ping, dan standby protection 10 unknown perangkat rak server).
2. Mempersiapkan integrasi automasi n8n workflow resmi dari Arik untuk pengujian web online.

---

### File / Commit / Evidence:
- **Repositori:** `https://github.com/T-AIMS/T-AIMS` (Branch: `main`)
- **Git Commit:**
  * `91cc552`: *fix(reports): trigger auto runAiAnalysis on page-reports navigation and configure production telegram n8n env*
  * `e098e42`: *feat(qa): complete day 18 handover, test report, bug fix sbi-prog height, and tracker*
  * `f754daf`: *fix(prod): penyelarasan arsitektur telemetri server HS, smart hybrid ping, dan auto-suggest metode PKL Bab 6*
- **File Konfigurasi & CSS:**
  * `frontend/assets/css/style.css` (Resolusi `.sbi-prog` height)
  * `taims-backend/.env` (Produksi CloudPanel)
  * `frontend/assets/js/app.js`
- **Bukti Screenshot Otentik DevOps (Folder `docs/evidence-wafian/hari-18/`):**
  * `01-cloudpanel-ssh-pm2-status.png`: *Terminal SSH VPS CloudPanel (port 2222) — Status daemon taims-backend online di PM2 dan lolos healthcheck curl 200 OK.*
  * `02-ssl-certificate-letsencrypt-valid.png`: *Sertifikat SSL Let's Encrypt resmi aktif (Status: Connection is secure & Certificate valid) di https://t-aims.teknolab.biz.id/.*
  * `03-live-dashboard-cloudpanel-production.png`: *Dashboard live produksi beroperasi mulus menampilkan telemetri 18 perangkat aktif melintasi 3 lokasi.*
  * `04-sla-availability-30days-resolved.png`: *Verifikasi visual penyelesaian bug height SLA Bar 30 hari .sbi-prog ter-render penuh di web live.*
- **Domain Live Produksi Terverifikasi:** `https://t-aims.teknolab.biz.id`
