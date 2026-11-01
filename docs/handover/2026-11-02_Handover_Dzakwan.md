# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab (Halaman 15 - Template Resmi)*

---

# DAILY HANDOVER (HARI KE-22)

**Nama:** Dzakwan Miftahussobirin  
**Tanggal:** Senin, 2 November 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB)  
**Role:** Shift 2 Lead & Full-Stack Developer (Project Lead)  
**Task:**  
1. Implementasi Gateway Alert Email via SMTP (Multi-Channel Notification Gateway - Dokumen PKL Hal. 11 & Target 5.5)  
2. Perbaikan & Resolusi Bug Web Produksi (Proteksi RBAC UI Role User, Eliminasi Stale Caching, Anti-Spam 1 Pintu Telegram, & Startup Grace Period 60 Detik)  
**Status:** DONE  
*(Definition of Done Hal. 15 & 18: Code/Configuration + Testing + Live CloudPanel Verification 100% Selesai & Bebas Defect)*  

---

### Timeline Aktivitas Harian (Senin, 2 November 2026):
* **04:00** : Bangun Tidur ✅
* **04:50** : Sholat Subuh Berjamaah ✅
* **11:45** : Sholat Dzuhur ✅
* **15:15** : Sholat Ashar ✅
* **16:00** : Check-In Presensi Kantor Shift 2 ✅
* **16:05** : Bersih-bersih Ruang Kerja & Lab Teknolab ✅
* **16:10** : Briefing Sore Shift 2 bersama Tim Teknolab (Penyelarasan Target Hari-22) ✅
* **16:30** : **Tugas 1: Implementasi Gateway Alert Email via SMTP** (Nodemailer Transport, HTML Alert Template, & Integrasi Pipeline Notifikasi) ✅
* **18:00** : Sholat Maghrib ✅
* **19:15** : Sholat Isya ✅
* **21:00** : **Tugas 2: Memperbaiki Bug yang Muncul di Web** (Sembunyikan Aksi RBAC User, Cache-Busting, Anti-Spam n8n 1 Pintu, & Grace Period 60s) ✅
* **22:30** : Briefing Malam & Review Progres Pengujian Sistem Live bersama Tim ✅
* **00:45** : Bersih-bersih Ruang Kerja & Lab Teknolab ✅
* **01:00** : Check Out Kantor Shift 2 Selesai ✅

---

### Yang sudah selesai:

#### 1. Implementasi Gateway Alert Email via SMTP (Checklist 5.5 & Dokumen PKL Hal. 11):
* **Modul Layanan Email (`taims-backend/src/services/email-service.js`):**
  - Membangun modul pengiriman email insiden berbasis Nodemailer dengan transport SMTP terenkripsi (mendukung port 465 SSL/TLS dan port 587 STARTTLS).
  - Mengonfigurasi parameter dinamis melalui `.env` server (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ALERT_EMAIL_RECIPIENT`).
* **Desain Template Kartu Email Insiden (HTML Enterprise Template):**
  - Merancang template email responsif berstandar NOC modern: banner status darurat (Merah untuk *Critical Offline*, Kuning/Oranye untuk *Anomaly Warning*, dan Hijau untuk *Recovery Resolved*).
  - Menyajikan rincian lengkap insiden: Kode Perangkat, Nama Aset, Alamat IP, Kategori, Lokasi Fisik, Waktu Insiden (WIB), serta PIC Teknis.
  - Menyertakan tombol navigasi cepat (*Call to Action*): `[ 🔗 Buka Dashboard T-AIMS Live ]`.
* **Integrasi Saluran Ganda (Multi-Channel Dispatcher):**
  - Mengaitkan `sendIncidentAlertEmail` ke dalam fungsi `dispatchTelegramAlert` pada `taims-backend/src/routes/notifications.js`.
  - Pengiriman email berjalan secara *asynchronous non-blocking* sehingga tidak memperlambat latensi pengiriman webhook n8n ke Telegram.

#### 2. Resolusi & Perbaikan Bug Web Produksi (Web & System Bug Fixing):
* **Bug 1: Penyembunyian Tombol Aksi Sensitif untuk Role User (Proteksi RBAC UI):**
  - **Isu:** Pengguna dengan role `user`/`guest` sebelumnya masih dapat melihat tombol *Edit* (pensil kuning) dan *Hapus* (tempat sampah merah) pada tabel aset, serta tombol *+ Tambah Aset*.
  - **Solusi:** Memperbarui fungsi `renderFullDevicesTable` di `frontend/assets/js/app.js` dengan guard `isAdminUser()`. Pada role user, tombol edit dan hapus sama sekali tidak dimasukkan ke dalam DOM HTML. Fungsi `openQuickStatusModal` dan tombol tambah aset diproteksi ketat hanya untuk admin.
* **Bug 2: Masalah Cache Usang Browser Klien (Stale Browser Cache Invalidation):**
  - **Isu:** Klien browser kerap kali menyimpan cache file JavaScript lama sehingga pembaruan UI tidak langsung terlihat tanpa hard-refresh manual.
  - **Solusi:** Mengimplementasikan teknik *Cache-Busting* di `frontend/index.html` dengan parameter versi terbaru `app.js?v=20261101_H21`. Pada sisi backend (`taims-backend/src/app.js`), ditambahkan HTTP Header `Cache-Control: no-cache, no-store, must-revalidate`.
* **Bug 3: Eliminasi Notifikasi Dobel / Spam Pesan Telegram (Anti-Duplicate 1-Pintu):**
  - **Isu:** Setiap kali terjadi insiden perangkat, bot Telegram mengirimkan 2 pesan kembar secara serentak karena backend menembak ke webhook n8n sekaligus Direct Telegram API.
  - **Solusi:** Menonaktifkan Direct Telegram dispatch di `taims-backend/src/routes/notifications.js` dan memusatkan alur pengiriman 100% murni melalui n8n AI Engine Runner port 5678.
* **Bug 4: False Alert CCTV & Router saat Backend Me-Restart (Restart Flapping Buffer):**
  - **Isu:** Ketika daemon PM2 backend me-restart di VPS CloudPanel, `checkOfflineDevices()` langsung dijalankan pada detik ke-0 sebelum ping engine mengirim paket ICMP pertama, memicu lonjakan alarm palsu untuk `CCTV-01` dan `RTR-01`.
  - **Solusi:** Menambahkan *Startup Grace Period* selama 60 detik (`setTimeout(..., 60000)`) pada `taims-backend/src/services/offline-checker.js` sebelum siklus pemantauan berkala dimulai.
* **Bug 5: Analisis AI Mengembalikan Fallback Template Darurat:**
  - **Isu:** Notifikasi Telegram menampilkan pesan fallback statis karena file `.env` di VPS belum terinjeksi API Key Gemini milik Arik.
  - **Solusi:** Memverifikasi kedua API Key resmi Google Gemini Arik (`GEMINI_KEY_NOTIF` dan `GEMINI_KEY_DASHBOARD`) menggunakan script Python (100% lolos HTTP 200 OK untuk model `gemini-3.5-flash-lite`), menginjeksi key ke environment VPS, dan memastikan analisis preskriptif berjalan dinamis.

---

### Yang belum selesai:
1. **Nihil (0 Blocker / 0 Defect):** Seluruh implementasi SMTP Email Alert, perbaikan RBAC UI, eliminasi spam n8n, buffer restart flapping, dan aktivasi AI Gemini telah selesai dan teruji live di domain produksi.

---

### Kendala & Solusi Teknis:
1. **Kendala Sinkronisasi Frontend pada Web Root CloudPanel:**
   * **Masalah:** Pasca `git pull` di VPS, berkas web live sempat masih menyajikan versi lama (`v=20261030_0430`) karena folder `frontend/` repositori belum tersalin ke direktori publik `/home/taims-teknolab/htdocs/t-aims.teknolab.biz.id/`.
   * **Solusi:** Melakukan sinkronisasi langsung berkas frontend ke direktori `htdocs` situs web dan me-restart layanan. Hasil inspeksi live mengonfirmasi versi `v=20261101_H21` aktif 100%.
2. **Kendala Pengiriman Ganda Multi-Channel (Telegram & Email):**
   * **Masalah:** Pemanggilan fungsi asynchronous SMTP di backend berpotensi memperlambat response time API alert jika mail server eksternal mengalami latensi tinggi.
   * **Solusi:** Mengisolasi pemanggilan `sendIncidentAlertEmail` dengan pendekatan *fire-and-forget (non-blocking catch)* dengan timeout controller 10 detik, sehingga kegagalan SMTP tidak akan mengganggu pengiriman notifikasi utama Telegram n8n.

---

### Next Action (Rencana Shift Berikutnya):
1. Melakukan pengujian simulasi gangguan (*Chaos Test Drill*) bersama seluruh personel Shift 2 (Damar, Wafian, Arik, Dzakwan, Aziz, Reza, Dika) untuk mendokumentasikan skenario pemulihan perangkat IoT (ESP32), CCTV, dan Server.
2. Memasukkan seluruh log bukti pengujian Hari Ke-22 ke dalam Bab 5 & Bab 6 draf Laporan Akhir PKL 30 Hari Teknolab.

---

### File / Commit / Evidence:

* **File Backend & Gateway:**
  - `taims-backend/src/services/email-service.js` (Modul SMTP Nodemailer Gateway)
  - `taims-backend/src/routes/notifications.js` (Multi-Channel Dispatcher & Anti-Spam 1-Pintu)
  - `taims-backend/src/services/offline-checker.js` (Startup Grace Period 60s Buffer)
  - `taims-backend/src/app.js` (Cache-Control No-Cache Headers)
* **File Frontend & Proteksi RBAC:**
  - `frontend/assets/js/app.js` (RBAC UI Filter: `renderFullDevicesTable`, `isAdminUser`, `enforceRbacUI`)
  - `frontend/index.html` (Cache-Busting Asset Version `?v=20261101_H21`)
* **Commit Git Terkait (Branch main):**
  - `edabce5` — *feat(security-ai): enforce RBAC UI hiding for user role, enable cache-busting v20261101, integrate SMTP email alert service, and implement RCA topology correlation*
  - `0080dde` — *feat(security): implement n8n webhook secret token auth and local loopback bind hardening*
  - `071c675` — *fix(alert): disable direct telegram duplicate dispatch and add 60s startup grace period*
  - `bfc9ed4` — *docs(devops): update Hari-21 handover with anti-duplicate alert fix and authentic evidence*

---

### 📸 Rekomendasi Bukti Screenshot Lengkap (Evidence Portfolio):

Berikut 6 rekomendasi tangkapan layar otentik untuk melengkapi berkas handover dan lampiran PDF PKL:

| Kode Bukti | Judul Tangkapan Layar | Bagian / Komponen yang Harus Masuk di Screenshot |
|:---:|:---|:---|
| **SS-H22-01** | **Implementasi Modul SMTP Email Service** | Buka VS Code pada berkas [`taims-backend/src/services/email-service.js`](file:///d:/project%20T-AIMS/taims-backend/src/services/email-service.js). Sorot konfigurasi `nodemailer.createTransport`, fungsi `sendIncidentAlertEmail`, dan template HTML kartu alert insiden IT berwarna merah/kuning. |
| **SS-H22-02** | **Bukti Integrasi Email Alert di Route Notifikasi** | Buka berkas [`taims-backend/src/routes/notifications.js`](file:///d:/project%20T-AIMS/taims-backend/src/routes/notifications.js) pada fungsi `dispatchTelegramAlert` yang memperlihatkan pemanggilan `sendIncidentAlertEmail` secara terintegrasi setelah n8n webhook. |
| **SS-H22-03** | **Perbandingan UI RBAC: Role User vs Role Admin** | Buka browser di `https://t-aims.teknolab.biz.id/`:\n1. Tampilan saat login sebagai `user`: Kolom Aksi tabel aset bersih tanpa tombol Edit/Hapus, dan tombol `+ Tambah Aset` tersembunyi.\n2. Tampilan saat login sebagai `dzakwan`: Tombol Edit, Hapus, dan Tambah Aset muncul lengkap. |
| **SS-H22-04** | **Verifikasi Cache-Busting & Header di Inspect Element** | Buka DevTools (F12) -> tab **Network** pada domain live `https://t-aims.teknolab.biz.id/`. Sorot request `app.js?v=20261101_H21` dengan status HTTP 200 OK dan Response Headers `Cache-Control: no-cache, no-store, must-revalidate`. |
| **SS-H22-05** | **Uji Tembak Notifikasi Telegram 1-Pintu & Preskriptif Gemini AI** | Buka aplikasi Telegram pada bot `@taims_alert_arik_bot`. Tangkap layar pesan notifikasi insiden yang membuktikan: pesan masuk tunggal (anti-spam lolos) dan di bagian bawah memuat rekomendasi preskriptif dinamis dari Google Gemini 3.5 Flash Lite. |
| **SS-H22-06** | **Healthcheck & Status Service PM2 di VPS CloudPanel** | Buka terminal SSH VPS CloudPanel (`45.198.155.203`): jalankan `pm2 status` yang memperlihatkan `taims-backend` dan `taims-n8n` berstatus `online`, serta hasil curl `https://t-aims.teknolab.biz.id/api/health` mengembalikan `status: healthy`. |
