# PANDUAN DEPLOYMENT PROYEK T-AIMS KE CLOUDPANEL VPS
**Proyek:** Teknolab Asset & Infrastructure Monitoring System (T-AIMS)  
**Lead:** Dzakwan Miftahussobirin (Superadmin)  
**Tanggal Rilis:** 26 Oktober 2026  

---

## 📦 STRUKTUR BUNDEL DEPLOYMENT
Bundel ini dirancang khusus untuk deployment instan (1-Click Upload) di control panel **CloudPanel**:

1. **`taims_frontend.zip` (2.98 MB):**
   * Berisi antarmuka web responsif (HTML5, Custom Tailwind/CSS, Three.js 3D Blueprint, Leaflet Map, Chart.js).
   * Siap diekstrak ke direktori `htdocs` situs frontend di CloudPanel.
2. **`taims_backend.zip` (69.9 KB):**
   * Berisi REST API Express.js, autentikasi JWT RBAC, ICMP real-ping, scheduler offline checker, dan file konfigurasi PM2 (`ecosystem.config.js`).
   * *Catatan:* `node_modules` sengaja diabaikan agar ukuran file sangat ringan; instalasi dilakukan langsung di server menggunakan `npm install --production`.
3. **`taims_database.sql` (5.59 MB):**
   * Dump lengkap database MySQL `taims_db` (17 aset resmi, riwayat insiden, pengguna RBAC Superadmin/Admin/User, pengaturan sistem, dan log jejak audit).

---

## 🚀 LANGKAH DEPLOYMENT DI CLOUDPANEL (STEP-BY-STEP)

### LANGKAH 1: Buat Database MySQL di CloudPanel
1. Masuk ke dashboard CloudPanel Anda (`https://your-server-ip:8443`).
2. Masuk ke menu **Databases** -> Klik **+ Add Database**.
   * **Database Name:** `taims_db`
   * **Database User Name:** `taims_user`
   * **Password:** *(Buat password aman, contoh: `TaimsSecure2026!`)*
3. Klik tombol **phpMyAdmin** di samping database baru.
4. Pilih database `taims_db` -> Masuk ke tab **Import**.
5. Upload file **`taims_database.sql`** -> Klik **Import**.
   * *Verifikasi:* Pastikan tabel `assets`, `users`, `incident_logs`, `maintenance_logs`, dan `server_metrics` berhasil terbuat.

---

### LANGKAH 2: Deploy Backend Node.js
1. Di CloudPanel, masuk ke menu **Sites** -> Klik **+ Add Site** -> Pilih **Node.js Site**.
   * **Domain Name:** `api.taims.id` *(atau subdomain yang Anda siapkan)*
   * **Node.js Version:** `20.x` LTS atau `18.x`
   * **App Port:** `3000`
2. Masuk ke tab **File Manager** pada situs tersebut:
   * Upload file **`taims_backend.zip`**.
   * Klik kanan / pilih file -> Klik **Extract**.
3. Di File Manager, salin `.env.production` menjadi `.env`, lalu sesuaikan kredensial database:
   ```env
   PORT=3000
   NODE_ENV=production
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=taims_user
   DB_PASS=TaimsSecure2026!
   DB_NAME=taims_db
   JWT_SECRET=taims_jwt_super_secret_production_key_2026!
   FRONTEND_URL=https://taims.id
   ```
4. Buka tab **SSH / Terminal** di CloudPanel, jalankan perintah instalasi:
   ```bash
   npm install --production
   ```
5. Restart aplikasi Node.js di CloudPanel:
   * Klik tombol **Restart** di pojok kanan atas situs Node.js.
   * Uji endpoint di browser: `https://api.taims.id/api/health` -> Harusnya muncul `{"status":"ok"}`.

---

### LANGKAH 3: Deploy Frontend Web
1. Di CloudPanel, masuk ke menu **Sites** -> Klik **+ Add Site** -> Pilih **Static HTML/CSS/JS Site**.
   * **Domain Name:** `taims.id` *(atau domain utama Anda)*
2. Masuk ke tab **File Manager** pada situs tersebut:
   * Hapus file default `index.html` bawaan CloudPanel.
   * Upload file **`taims_frontend.zip`**.
   * Ekstrak file tersebut ke dalam folder utama (`htdocs`).
3. Konfigurasi SSL Gratis (Let's Encrypt):
   * Masuk ke tab **SSL/TLS Certificates** pada situs `taims.id` dan `api.taims.id`.
   * Klik **+ New Certificate** -> Pilih **Let's Encrypt Certificate** -> Klik **Create and Install**.
4. Selesai! Web T-AIMS kini sudah aktif online secara aman dengan HTTPS di seluruh dunia.

---

### LANGKAH 4: Konfigurasi Device API Key di CloudPanel (.env)
Agar Backend di CloudPanel dapat menerima telemetri dari agen monitoring perangkat secara aman tanpa terbentur proteksi login pengguna:
1. Di File Manager situs backend (`api.taims.id`), pastikan baris `DEVICE_API_KEY` terisi di `.env`:
   ```env
   DEVICE_API_KEY=taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1
   ```
2. Restart backend Node.js di CloudPanel agar konfigurasi aktif.

---

### LANGKAH 5: Setup Agen Monitoring On-Premise (Edge Daemon)
Karena server CloudPanel berada di cloud publik, server tidak dapat melakukan ICMP ping langsung ke IP lokal kantor (`192.168.1.x`). Oleh karena itu, skrip agen dijalankan di jaringan lokal kantor (misal: di Raspberry Pi kantor atau PC server kantor):

1. **Salin Folder `network-monitoring` ke Perangkat Lokal (Raspberry Pi / PC Kantor).**
2. **Jalankan Agen dengan mengarahkan ke Domain CloudPanel:**
   * Di terminal Linux/Raspberry Pi:
     ```bash
     export BACKEND_URL="https://api.taims.id/api"
     export DEVICE_API_KEY="taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1"
     python3 network-monitoring/monitoring_engine.py
     ```
   * Atau jalankan otomatis di background via systemd service / PM2:
     ```bash
     pm2 start network-monitoring/monitoring_engine.py --name "taims-edge-monitor" --interpreter python3
     ```
3. **Verifikasi:**
   * Agen lokal akan mengeping CCTV (`192.168.1.39`), Smart TV, dan Router kantor.
   * Setiap status otomatis dikirim ke `https://api.taims.id/api/monitoring/ping` menggunakan `X-API-Key`.
   * Dashboard web `taims.id` seketika menampilkan seluruh perangkat menyala hijau (**Online**) secara real-time!
