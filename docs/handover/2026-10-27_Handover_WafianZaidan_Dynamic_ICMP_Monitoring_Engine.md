# T-AIMS | Dokumen Kerja PKL Teknolab
**PT Teknolab Caraka Internasional • T-AIMS Project • PKL 30 Hari**  
*Format Daily Handover Standar PDF Teknolab (Halaman 15)*

---

# DAILY HANDOVER

**Nama:** Wafian Zaidan  
**Tanggal:** 27 Oktober 2026  
**Shift:** Shift 2 (16.00 – 01.00 WIB)  
**Peran:** DevOps & Server Network Security Engineer  
**Penerima:** Dzakwan Miftahussobirin (Project Lead / Shift Lead) & Damar Munajad (Shift 1 Lead / Koordinator Proyek)  

---

### Task:
**Dynamic Auto-Sync ICMP Monitoring Engine & Edge Agent Hardening**

### Status:
**DONE**  
*(Kriteria Definition of Done: Code/Configuration + Testing + Documentation 100% Selesai & Terverifikasi)*

---

### Yang sudah selesai:

1. **Implementasi Endpoint Dynamic Targets Backend (`GET /api/monitoring/targets`):**
   * Menambahkan route API di [taims-backend/src/routes/monitoring.js](file:///mnt/d/T-AIMS/taims-backend/src/routes/monitoring.js#L146) untuk mengekstraksi seluruh perangkat terdaftar di database MySQL (`taims_db.assets`) yang menggunakan metode pemantauan `Ping`/ICMP.
   * Melindungi endpoint tersebut dengan middleware keamanan `apiKeyAuth` (`X-API-Key`).
   * Teruji menghasilkan respon JSON `HTTP 200 OK` berisi 15 perangkat aktif.

2. **Pengembangan Engine Dynamic Auto-Sync Tanpa Restart (*Zero Downtime Auto-Follow*):**
   * Mengintegrasikan fungsi rekonsiliasi dinamis pada kontainer Docker `taims-monitoring` ([network-monitoring/monitoring_service.js](file:///mnt/d/T-AIMS/network-monitoring/monitoring_service.js)).
   * Daemon secara otomatis mem-polling daftar IP target dari database setiap siklus interval (10 detik).
   * **Pengujian Nyata:** Saat Administrator mengubah IP Raspberry Pi Head Office ke `192.168.1.99` dan CCTV-02 ke `192.168.1.10` di database/web, daemon seketika mengalihkan sasaran ping ke IP baru tanpa perlu merestart kontainer ataupun memutus sesi web.
   * Dilengkapi mekanisme *graceful fallback* ke `FALLBACK_DEVICES` jika koneksi backend mengalami latensi tinggi.

3. **Refactoring & Hardening Agen Monitoring On-Premise ([network-monitoring/monitoring_engine.py](file:///mnt/d/T-AIMS/network-monitoring/monitoring_engine.py)):**
   * Mengeliminasi ketergantungan login email/password usang (`reza.fahmi@taims_db.local` via `/api/auth/login`) yang sebelumnya menjadi sumber masalah *false-positive lockout*.
   * Mengganti pengiriman telemetri dengan autentikasi langsung `X-API-Key` (`DEVICE_API_KEY`) ke endpoint `/api/monitoring/ping`.
   * Memastikan layanan `taims-monitoring.service` berjalan stabil di background via `systemd --user` (*uptime* stabil > 1,5 jam).

4. **Penyempurnaan Panduan Arsitektur CloudPanel ([devops/PANDUAN_DEPLOY_CLOUDPANEL.md](file:///mnt/d/T-AIMS/devops/PANDUAN_DEPLOY_CLOUDPANEL.md)):**
   * **Langkah 4 (Server Setup):** Panduan konfigurasi `DEVICE_API_KEY` pada file `.env` produksi di CloudPanel.
   * **Langkah 5 (Edge / On-Premise Agent):** Panduan arsitektur *Hybrid Monitoring* agar perangkat lokal kantor subnet `192.168.1.x` (CCTV, Mikrotik, Raspberry Pi) dapat dipantau oleh agen lokal dan mengirimkan telemetri berkala ke server CloudPanel publik via API Key.

5. **Verifikasi Kredensial Multi-User Utuh (Zero Defect):**
   * Seluruh akun tim (`wafian`, `dzakwan`, `damar`, `fahmi` dengan kata sandi `password123`) terverifikasi 100% sukses login dengan respon JWT token `HTTP 200 OK`.
   * Sistem terbebas dari sanksi IP lockout pada lingkungan localhost.

---

### Yang belum selesai:

1. **Injeksi Kredensial Modul AI & Telegram Bot:**
   * Menunggu penyerahan token final dari Arik Ferdiansyah (Modul AI & Notifikasi Bot Telegram) untuk diinjeksikan ke file `.env.production` sebelum migrasi final CloudPanel.
2. **Eksekusi Deployment ke VPS CloudPanel:**
   * Dijadwalkan dieksekusi bersama Project Lead (Dzakwan) pada shift berikutnya sesuai kesepakatan bersama.

---

### Kendala:

1. **Kendala yang Ditemukan:**
   * Skrip Python lama `monitoring_engine.py` pada background host sempat melakukan perulangan login gagal tiap 5 detik menggunakan email lama yang tidak terdaftar di database, sehingga memicu proteksi brute-force backend dan mengunci IP `127.0.0.1` selama 8 menit.
2. **Solusi yang Diterapkan:**
   * Skrip `monitoring_engine.py` telah direfaktorisasi penuh menggunakan autentikasi `X-API-Key` tanpa login akun user. Layanan `taims-monitoring.service` dan kontainer `taims-backend` telah di-restart bersih. Masalah lockout teratasi tuntas 100%.

---

### Next Action:

1. **Untuk Wafian (Shift 2 Berikutnya):**
   * Verifikasi berkas bundel produksi (`taims_frontend.zip`, `taims_backend.zip`, dan `taims_database.sql`) di root direktori proyek.
   * Bersama Dzakwan mengeksekusi instalasi 1-Click CloudPanel sesuai dokumen [devops/PANDUAN_DEPLOY_CLOUDPANEL.md](file:///mnt/d/T-AIMS/devops/PANDUAN_DEPLOY_CLOUDPANEL.md) Langkah 1 s.d. 5.
2. **Untuk Shift 1 (Damar / Tim Pagi):**
   * Memastikan perangkat keras fisik kantor (CCTV `192.168.1.39`, Router MikroTik `192.168.1.1`, dan Raspberry Pi `192.168.1.99`) tetap terhubung pada jaringan lokal untuk pengetesan telemetri langsung.

---

### File / Commit / Evidence:

* **Repositori Git:** `github.com/T-AIMS/T-AIMS.git` (Branch: `main`)
* **Commit Utama:**
  * `1123a2e` — *feat(monitoring): implement dynamic ICMP target auto-sync, offline fonts, and network automation*
* **File yang Diubah / Dihasilkan:**
  1. [`taims-backend/src/routes/monitoring.js`](file:///mnt/d/T-AIMS/taims-backend/src/routes/monitoring.js) — Implementasi route `GET /api/monitoring/targets`.
  2. [`network-monitoring/monitoring_service.js`](file:///mnt/d/T-AIMS/network-monitoring/monitoring_service.js) — Logika auto-follow dynamic ping daemon.
  3. [`network-monitoring/monitoring_engine.py`](file:///mnt/d/T-AIMS/network-monitoring/monitoring_engine.py) — Refactoring autentikasi agen via `X-API-Key`.
  4. [`devops/PANDUAN_DEPLOY_CLOUDPANEL.md`](file:///mnt/d/T-AIMS/devops/PANDUAN_DEPLOY_CLOUDPANEL.md) — Penambahan panduan langkah 4 & 5 (Edge Monitoring Agent).
  5. [`docs/handover/2026-10-27_Handover_WafianZaidan_Dynamic_ICMP_Monitoring_Engine.md`](file:///mnt/d/T-AIMS/docs/handover/2026-10-27_Handover_WafianZaidan_Dynamic_ICMP_Monitoring_Engine.md) — Dokumen Daily Handover resmi.
* **Evidence Operasional:**
  * **Uji Target Dinamis:** Output `GET /api/monitoring/targets` dengan header `X-API-Key` mengembalikan data 15 perangkat aktif.
  * **Log Daemon Docker (`taims-monitoring`):**
    ```text
    [CYCLE 14.02.41] Ping Dinamis: 7 Online, 8 Offline (Total 15 Perangkat Terdaftar)
    [CYCLE 14.02.51] Ping Dinamis: 7 Online, 8 Offline (Total 15 Perangkat Terdaftar)
    [CYCLE 14.03.01] Ping Dinamis: 7 Online, 8 Offline (Total 15 Perangkat Terdaftar)
    ```
  * **Status Systemd Daemon Host (`taims-monitoring.service`):**
    ```text
    ● taims-monitoring.service - T-AIMS Multi-Site Network Monitoring Engine Daemon
       Loaded: loaded; Active: active (running) since Tue 2026-10-27 19:32:08 WIB; 1h 35min ago
       Main PID: 49281 (python3)
    ```
  * **Uji Autentikasi Login (HTTP 200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "user_id": 10,
          "full_name": "Wafian Zaidan",
          "username": "wafian",
          "email": "wafian@taims.id",
          "role": "admin"
        }
      }
    }
    ```

---

*Laporan Daily Handover ini disusun mengikuti format resmi Halaman 15 Dokumen Kerja PKL PT Teknolab Caraka Internasional.*
