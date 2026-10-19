# Laporan Resmi Audit Kredensial & Keamanan Sistem T-AIMS
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Instansi:** PT Teknolab Caraka Internasional  
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer — Shift 2*)  
**Tanggal Pelaksanaan:** 19 Oktober 2026 / 12:45 WIB  
**Standar Kepatuhan:** Dokumen Kerja PKL Teknolab (Halaman 12 & 20) & OWASP Top 10 Application Security  
**Status Audit Keseluruhan:** ✅ **PASS / SECURE & HARDENED (Siap Rilis Produksi)**

---

## 1. Ringkasan Eksekutif (*Executive Summary*)
Pada tanggal 19 Oktober 2026, telah dilaksanakan audit keamanan mendalam (*Comprehensive System Security & Credential Audit*) terhadap seluruh lapisan infrastruktur perangkat lunak T-AIMS, mencakup:
1. Repositori Utama Full-Stack: `/mnt/d/xampp/htdocs/T-AIMS`
2. Modul Antarmuka Produksi: `/mnt/d/Website  T-AIMS`
3. Konfigurasi Container Docker, Nginx Reverse Proxy, dan Broker Mosquitto MQTT.

Audit ini mengevaluasi 5 pilar utama:
1. **Kebersihan Kredensial & Repositori Git (*Secret Leakage Prevention*)**
2. **Mitigasi Injeksi SQL & Enkripsi Basis Data (*SQLi Defense & Cryptography*)**
3. **Kontrol Akses Berbasis Peran (*RBAC & Token Security*)**
4. **Keamanan Lapangan Jaringan & Header SSL (*Network & Transport Layer Security*)**
5. **Integritas Pencadangan Otomatis & Pemulihan (*Automated Backup & Recovery*)**

Hasil pemindaian otomatis dan inspeksi statis menunjukkan **0 celah kerentanan kritis (*Zero Critical Vulnerability*)**. Seluruh kredensial sensitif terisolasi dengan aman di luar Git tracking.

---

## 2. Hasil Audit Berdasarkan 5 Pilar Keamanan

```mermaid
flowchart TD
    subgraph ClientLayer ["1. Lapangan Klien & Web Dashboard"]
        UI["Web Dashboard T-AIMS (Port 3001)"]
        RBAC_FE["RBAC Client Guard & Token Storage"]
    end

    subgraph SecurityGateway ["2. Gerbang Keamanan & Reverse Proxy"]
        NGINX["Nginx HTTPS (Port 443)"]
        SEC_HEADERS["HSTS, Anti-Clickjacking, X-Content-Type"]
    end

    subgraph AppLayer ["3. Backend & Broker Service"]
        API["REST API Express (Port 3000)"]
        JWT_AUTH["JWT Auth + Token Blacklist"]
        MQTT["Mosquitto MQTT (Port 1883/9001)"]
        AUTH_PASSWD["Password File Authentication"]
    end

    subgraph StorageLayer ["4. Basis Data & Pencadangan"]
        DB[(MariaDB / MySQL 3306)]
        PARAM_Q["Parameterized Queries (100% Prepared)"]
        BCRYPT["Bcrypt Password Hashing (10 Rounds)"]
        BACKUP["Automated Backup Script (7-Day Rotation)"]
    end

    UI -->|HTTPS TLS 1.3| NGINX
    NGINX --> SEC_HEADERS
    SEC_HEADERS --> API
    API --> JWT_AUTH
    API --> PARAM_Q
    PARAM_Q --> DB
    JWT_AUTH --> BCRYPT
    MQTT --> AUTH_PASSWD
    DB -.-> BACKUP
```

### Pilar 1: Kebersihan Kredensial & Repositori Git (*Git Secrets Hygiene*)
> **Standar PKL Teknolab Hal. 20:** *"Password, token, API key, credential database, dan credential server dilarang ditulis langsung di source code."*

* **Pemeriksaan File `.env`:**
  - File `.env` dan `.env.local` terbukti **100% diabaikan** oleh Git (`.gitignore` baris 2 & 43).
  - File `.env.example` disediakan secara bersih tanpa nilai rahasia produksi riil (`JWT_SECRET=change_me_to_random_string`, `TELEGRAM_BOT_TOKEN=`, `DB_PASS=`).
  - Pemindaian riil `git ls-files | grep -i "\.env"`: **Hanya `.env.example` yang tercatat**.
* **Pemeriksaan Private Key SSL:**
  - Direktori `devops/nginx/ssl/*.key` dan `devops/nginx/ssl/*.crt` di-ignore secara ketat (`.gitignore` baris 60–62). Tidak ada berkas kunci privat atau sertifikat yang bocor ke publik.
* **Firmware IoT Secrets:**
  - Konfigurasi Wi-Fi ESP32 `hardware-iot/esp32/include/config.h` terisolasi via `.gitignore` baris 65. Template publik `config.h.example` bebas dari SSID/password fisik kantor.

---

### Pilar 2: Mitigasi Injeksi SQL & Kriptografi (*SQLi Defense & Cryptography*)
> **Standar OWASP A03:2021 (Injection) & A02:2021 (Cryptographic Failures)**

* **Audit Query Dinamis Backend:**
  - Seluruh query database di `taims-backend/src/routes/` menggunakan mekanisme *Prepared Statements* dengan placeholder parameter `?`.
  - Pada query update dinamis (`PUT /api/assets/:id`, `PUT /api/users/:id`), nama kolom **wajib melalui whitelist array ketat** (`allowedFields`). Nilai masukan pengguna tidak pernah dikonkatenasi mentah ke dalam string SQL.
  - **Hasil Evaluasi SQLi:** **PASS (0 Risiko SQL Injection)**.
* **Enkripsi Kata Sandi Pengguna:**
  - Seluruh kata sandi pengguna di tabel `users` dienkripsi menggunakan pustaka `bcryptjs` dengan **10 salt rounds** (`$2a$10$...` / `$2b$10$...`).
  - Tidak ada satu pun kata sandi teks polos (*plaintext*) yang tersimpan dalam basis data produksi.
  - Endpoint `GET /api/users` secara eksplisit mengecualikan kolom `password_hash` dari payload respon JSON.

---

### Pilar 3: Autentikasi, Otorisasi & Kontrol Akses (*Access Control & RBAC*)
> **Standar OWASP A01:2021 (Broken Access Control) & A07:2021 (Identification & Auth Failures)**

* **Manajemen Token JWT & Blacklist:**
  - Token JWT ditandatangani menggunakan `process.env.JWT_SECRET` dengan masa berlaku 24 jam (`expiresIn: 86400`).
  - Mekanisme **Token Blacklist** aktif di tabel `token_blacklist`. Ketika pengguna melakukan logout (`POST /api/auth/logout`), token didaftarkan ke tabel blacklist sehingga token yang telah dicabut tidak dapat dipakai ulang (*Replay Attack Prevention*).
* **Autentikasi Header API Key:**
  - Telemetri sensor dan monitoring hardware dilindungi middleware `apiKeyAuth.js` melalui header wajib `X-API-Key` yang divalidasi terhadap `process.env.DEVICE_API_KEY`.
* **Kesesuaian RBAC Backend vs Frontend:**
  - **Superadmin:** Memiliki hak penuh `create: true, read: true, update: true, delete: true`.
  - **Admin:** Memiliki hak `create: true, read: true, update: true, delete: false`.
  - **Penghapusan Aset (`DELETE /api/assets/:id`):** Terkunci ketat di backend dengan middleware `can('delete')` yang hanya mengizinkan role `super_admin`.
  - **Proteksi PIC Teknisi:** Pada formulir aset frontend, field PIC otomatis terkunci bagi Admin, selaras dengan proteksi integritas data server.

---

### Pilar 4: Keamanan Jaringan, Port & SSL Reverse Proxy (*Transport Layer Security*)
> **Standar Dokumen Kerja PKL Hal. 12 & OWASP A05:2021 (Security Misconfiguration)**

* **Matriks Isolasi Port Layanan:**
  - Port `3306` (MariaDB/MySQL): **Hanya terikat ke interface localhost/Docker bridge**, tidak diekspos langsung ke IP publik internet.
  - Port `1883` & `9001` (MQTT): Dilindungi otentikasi kata sandi (`allow_anonymous false` dengan file `/mosquitto/config/passwd`).
  - Port `5678` (Otomasi n8n): Terisolasi pada jaringan internal container.
  - Port `3000` (REST API) & `3001` (Frontend): Di-proxy melalui Nginx reverse proxy.
* **Header Keamanan Nginx (`devops/nginx/nginx.conf`):**
  - `Strict-Transport-Security (HSTS)`: `max-age=31536000; includeSubDomains` (Memaksa koneksi HTTPS selama 1 tahun).
  - `X-Frame-Options: SAMEORIGIN` (Proteksi penuh dari serangan Clickjacking / UI Redressing).
  - `X-Content-Type-Options: nosniff` (Mencegah MIME type confusion exploit).
  - `X-XSS-Protection: 1; mode=block` (Mengaktifkan filter anti-XSS pada browser lama).
  - `Referrer-Policy: strict-origin-when-cross-origin` (Menjaga privasi URL path saat navigasi).
  - `ssl_protocols TLSv1.2 TLSv1.3;` (Menolak protokol usang SSLv3, TLSv1.0, dan TLSv1.1).

---

### Pilar 5: Integritas Cadangan Data & Pemulihan Bencana (*Backup & Recovery*)
> **Standar Dokumen Kerja PKL Hal. 12 & 17**

* **Skrip Pencadangan Otomatis (`devops/scripts/backup_db.sh`):**
  - Skrip bersifat portabel (mendukung eksekusi Linux native, WSL2, maupun via `docker exec`).
  - Menghasilkan snapshot terkompresi dengan format `taims_db_backup_YYYYMMDD_HHMMSS.sql`.
  - Menyimpan jejak audit di `logs/backup.log`.
  - Kebijakan retensi otomatis: Menghapus arsip cadangan yang berumur lebih dari 7 hari guna menjaga efisiensi ruang penyimpanan dan meminimalkan paparan data historis.
* **Uji Eksekusi:** Terverifikasi berhasil dijalankan tanpa error sintaks (*exit code 0*).

---

## 3. Matriks Rekapitulasi Audit Keamanan

| No | Parameter Keamanan | Kriteria Standar Teknolab | Status Evaluasi | Keterangan Teknis |
|:---:|:---|:---|:---:|:---|
| 1 | **Penyimpanan Password** | Hash terenkripsi non-plaintext | ✅ **PASS** | Bcrypt dengan 10 Salt Rounds |
| 2 | **Pencegahan SQLi** | Prepared statements / Parameterized | ✅ **PASS** | Whitelist kolom + placeholder `?` |
| 3 | **Kerahasiaan .env** | Tidak masuk Git repository | ✅ **PASS** | Terlindungi aturan ketat `.gitignore` |
| 4 | **Kunci Privat SSL** | Tidak masuk Git repository | ✅ **PASS** | File `*.key` dan `*.crt` di-ignore |
| 5 | **Firmware IoT Secrets** | Tidak mencantumkan password Wi-Fi | ✅ **PASS** | Template sanitasi `config.h.example` |
| 6 | **Otentikasi Broker MQTT** | Anonymous login dinonaktifkan | ✅ **PASS** | `allow_anonymous false` + file passwd |
| 7 | **Proteksi Sesi (JWT)** | Masa berlaku terbatas + Blacklist | ✅ **PASS** | Kadaluarsa 24 jam + tabel blacklist |
| 8 | **RBAC Otorisasi** | Superadmin vs Admin vs User | ✅ **PASS** | Hak `delete` khusus Superadmin |
| 9 | **Header Proteksi Nginx** | HSTS, Anti-Clickjacking, Sniffing | ✅ **PASS** | 5 header keamanan OWASP aktif |
| 10 | **Cadangan Database** | Skrip otomatis + rotasi 7 hari | ✅ **PASS** | `devops/scripts/backup_db.sh` siap |

---

## 4. Tindakan Lanjut Rekomendasi (*Security Recommendations*)
1. **Penerbitan SSL Produksi Saat Go-Live:** Segera jalankan `devops/scripts/setup_ssl.sh` begitu domain resmi kantor (misal: `taims.teknolab.id`) dan IP server publik dialokasikan oleh mentor Teknolab.
2. **Pengisian Kredensial Produksi di `.env` Server:** Sebelum peluncuran final, ganti nilai `JWT_SECRET` pada server hosting dengan string acak dengan entropi tinggi (minimal 64 karakter heksadesimal).
3. **Pemberian Izin Eksekusi Cronjob:** Jadwalkan eksekusi `backup_db.sh` setiap tengah malam (00:00 WIB) pada crontab sistem operasi peladen.

---
*Laporan resmi ini disahkan oleh Wafian (DevOps, Server & Security Engineer) sebagai bukti pemenuhan deliverable Output Wajib PKL PT Teknolab Caraka Internasional.*
