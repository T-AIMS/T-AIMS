# Daftar Dependensi Sistem T-AIMS (Versi Final)
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Dzakwan (*Shift Lead & System Integration*)  
**Tanggal Evaluasi:** 16 Oktober 2026 (Shift 2)  
**Status Dependensi:** 🟢 **17 / 17 DEPENDENSI TERPENUHI (100% READY)**  

---

## 1. Matriks 17 Item Dependensi Terpenuhi (100% Ready)

| NO | Task yang Dibutuhkan | Dibutuhkan Oleh | Disediakan Oleh | Deadline | Status | Catatan Validasi |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | Skema DDL `taims_db.sql` | Wafian (DevOps) | Faida (Shift 1) | 12/10/2026 | ✅ | 16 aset dan 8 tabel (termasuk `token_blacklist`) ter-import. |
| **2** | Repositori GitHub & Branching | Seluruh Tim Shift 2 | Wafian (DevOps) | 12/10/2026 | ✅ | Repositori aktif di `T-AIMS/T-AIMS`. |
| **3** | Container Broker Mosquitto | Arik & IoT | Wafian (DevOps) | 15/10/2026 | ✅ | Docker container port 1883 aktif & terotentikasi. |
| **4** | Kredensial Default Login User | QA & Frontend | Faida & Reza F. | 12/10/2026 | ✅ | Password hash bcrypt aktif di `seed.sql`. |
| **5** | Kontrak Rute API 58 Endpoint | Dzakwan & Dika | Reza Fahmi | 12/10/2026 | ✅ | Dokumen API Contract v0.7 diimplementasikan penuh. |
| **6** | Verifikasi Inventaris 16 Aset | Dzakwan | Faida | 16/10/2026 | ✅ | Tervalidasi sinkron antara DB dan Frontend. |
| **7** | Penerapan Kolom `offline_since` | Dzakwan | Faida & Reza F. | 16/10/2026 | ✅ | Kolom siap di DB dan terikat otomatis di MQTT handler (Commit `a06324b`). |
| **8** | Perbaikan Crash GET `/users/1` | QA (Reza Tri) | Reza Fahmi | 16/10/2026 | ✅ | BUG-007 closed (200 OK). |
| **9** | Perbaikan Kolom `created_at` | Auth System | Faida | 16/10/2026 | ✅ | BUG-009 closed (200 OK via Commit `ad10c59`). |
| **10** | Endpoint Change Password | Frontend | Reza Fahmi | 16/10/2026 | ✅ | BUG-006 closed (200 OK via Commit `a06324b`, diverifikasi Reza Tri). |
| **11** | Migrasi Mosquitto ke Docker | Arik | Wafian | 15/10/2026 | ✅ | Berjalan di bridge network `taims-net`. |
| **12** | Systemd Monitoring Service | Ananda | Wafian | 15/10/2026 | ✅ | Daemon background aktif & auto-start. |
| **13** | Dokumen Checklist di Repo | Seluruh Tim | Dzakwan | 15/10/2026 | ✅ | Terintegrasi di `integration-management/`. |
| **14** | Pengujian Engine Ping ke API | Backend | Ananda | 15/10/2026 | ✅ | 1.196 riwayat log berhasil disimpan. |
| **15** | Pengujian E2E Data 16 Aset | Dzakwan | Dika & Wafian | 15/10/2026 | ✅ | Tampil akurat di UI dashboard port 3001. |
| **16** | Finalisasi Video Demonstrasi | Mentor | Reza Tri | 16/10/2026 | ✅ | Skenario pengujian lengkap, sistem bebas bug & siap rekam demo. |
| **17** | Health Checker Otomatis v1.3 | Dzakwan | Wafian | 16/10/2026 | ✅ | Skrip `verify_integration.py` 15/15 OK (100% HIJAU). |

*Keterangan Status:* ✅ Selesai | ⏳ Menunggu | ❌ Belum Ada

---

## 2. Tabel Spesifikasi Port, Lingkungan & Pustaka Utama

| Aplikasi / Service | Port | Host / IP | Teknologi & Versi | Pustaka Utama |
| :--- | :---: | :--- | :--- | :--- |
| **Backend REST API** | 3000 | localhost / 172.19.112.1 | Node.js v20.x Express | `mysql2`, `jsonwebtoken`, `mqtt`, `cors`, `dotenv` |
| **Frontend Web Dashboard** | 3001 | localhost | HTML5, TailwindCSS, JS ES6 | `Chart.js`, `apiService.js` |
| **Database Relasional** | 3306 | localhost / Docker | MariaDB 10.4 / MySQL 8.0 | Driver pool koneksi `mysql2` |
| **MQTT Broker (Mosquitto)** | 1883 | localhost / Docker | Eclipse Mosquitto v2.0.22 | Konfigurasi `passwd` & `mosquitto.conf` |
| **Automation Engine (n8n)** | 5678 | localhost / Docker | n8n Workflow Automation | Node Webhook & Node Telegram Bot |
| **Database GUI (phpMyAdmin)**| 80 / 8080 | localhost | PHP 8.2 | Web interface database |
| **Python Environment** | - | Local Machine | Python 3.13.x | `paho-mqtt` (v2.x), `requests`, `pymysql` |
