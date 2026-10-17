# KONTRAK INTEGRASI & ADENDUM SISTEM: PENGECUALIAN FOLDER DEVOPS (SERVER TEKNOLAB)

**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Pihak Pertama (Penyaji / DevOps):** Wafian Zaidan El Y. (*DevOps, Server & Security Engineer - Shift 2*)  
**Pihak Kedua (Shift Lead / Integrator):** Dzakwan (*Shift Lead & System Integration Manager - Shift 1 / AI Dzakwan*)  
**Tanggal Penerbitan:** 17 Oktober 2026  
**Status Kontrak:** 🟡 **AKTIF & MENGIKAT (CONDITIONAL EXCEPTION & STANDBY DEPLOY)**  

---

## 📌 1. Latar Belakang & Pernyataan Pengecualian (*Exception Clause*)

Melalui dokumen kontrak integrasi ini, Pihak Pertama (Wafian) memberitahukan dan menyepakati bersama Pihak Kedua (Dzakwan / AI Dzakwan) mengenai status kelengkapan folder `devops/` pada repositori utama `T-AIMS/T-AIMS`:

1. **Status Folder `devops/` di Repositori:**  
   Komponen yang berkaitan langsung dengan **Server Produksi Resmi PT Teknolab Caraka Internasional** (termasuk sertifikat SSL resmi, alamat IP publik definitif, dan binding domain kantor) saat ini berstatus **Pengecualian Sementara (*Conditional On-Hold Exception*)**.
2. **Penyebab Utama:**  
   Pihak manajemen / tim IT PT Teknolab Caraka Internasional **belum menyerahkan alokasi hak akses server fisik/cloud, IP server publik definitif, kredensial akses (SSH/Cloud Panel), maupun nama domain resmi** kepada tim proyek T-AIMS.
3. **Kesiapan Sisi DevOps (Wafian):**  
   Seluruh arsitektur kontainerisasi Docker (`docker-compose.prod.yml`), konfigurasi *Reverse Proxy* Nginx, skrip penerbit SSL otomatis (`setup_ssl.sh`), skrip pencadangan berkala (`backup_db.sh`), skrip pengumpulan log (`collect-log.sh`), serta database `taims_db` telah **100% selesai dibangun, diuji stabil, dan berstatus Siaga Deploy (*Local Staging Ready*)**.

---

## 📋 2. Batasan Berkas & Folder yang Dikosongkan Sementara

Demi mematuhi aturan baku keamanan informasi (*OWASP & Zero Hardcoded Secrets*) dan mencegah timbulnya sertifikat palsu/kadaluwarsa sebelum server resmi diberikan, berkas berikut sengaja dikosongkan/distandarkan:

| Direktori / Berkas | Status Saat Ini | Alasan & Keterangan |
| :--- | :---: | :--- |
| `devops/nginx/ssl/` | **Kosong (`.gitkeep`)** | Sertifikat SSL resmi baru dapat diterbitkan (*issued*) setelah nama domain dan IP server definitif diserahkan oleh Teknolab. |
| `.env.production` | **Template (`.env.example`)** | IP address server dan password database produksi belum diisi nilai asli hingga server fisik/cloud resmi diterima. |
| `devops/nginx/nginx.conf` | **Template Domain** | Siap menerima binding nama domain publik Teknolab (saat ini fallback ke `localhost`). |

---

## ⚡ 3. Klausul Kewajiban Penagihan AI Dzakwan (*Callback & Action Trigger*)

Sesuai kesepakatan integrasi antar-giliran kerja (Shift Handover), **AI Dzakwan / Dzakwan diwajibkan secara otomatis menjalankan penagihan (*Action Trigger*) kepada Wafian** dengan ketentuan sebagai berikut:

### Syarat Pemicu (*Trigger Condition*):
> **"Begitu pihak PT Teknolab Caraka Internasional secara resmi menyerahkan hak akses server, alamat IP publik, kredensial SSH/Cloud Panel, dan nama domain resmi kepada tim T-AIMS."**

### Tindakan Wajib AI Dzakwan (*Mandatory Action*):
AI Dzakwan **harus segera menagih dan menginstruksikan Wafian (DevOps)** untuk melakukan pengisian dan deployment dengan urutan:

1. **Pengisian Variabel Lingkungan Produksi:**
   * Memasukkan IP publik dan domain definitif Teknolab ke berkas konfigurasi lingkungan.
2. **Eksekusi Penerbitan Sertifikat SSL:**
   * Menjalankan skrip otomatis `devops/scripts/setup_ssl.sh` untuk menghasilkan sertifikat SSL valid ke direktori `devops/nginx/ssl/`.
3. **Eksekusi Deployment Kontainer Produksi:**
   * Menjalankan perintah `docker compose -f devops/docker-compose.prod.yml up -d` di server Teknolab.
4. **Verifikasi Plug-and-Play:**
   * Memastikan seluruh 5 layanan (`taims-frontend`, `taims-backend`, `taims-mosquitto`, `taims-mysql`, `taims-n8n`) langsung aktif dan dapat diakses publik dalam hitungan menit tanpa penyesuaian kode ulang.

---

## ✍️ 4. Pengesahan & Validasi Kontrak

Kontrak integrasi ini berlaku sejak tanggal ditetapkan dan menjadi lampiran resmi dalam tata kelola dependensi tim proyek T-AIMS:

| Disusun & Diajukan Oleh: | Diterima & Disepakati Oleh: |
| :---: | :---: |
| **Wafian Zaidan El Y.** | **Dzakwan / AI Dzakwan** |
| *DevOps, Server & Security Engineer (Shift 2)* | *Shift Lead & System Integration (Shift 1)* |
| **Status:** *Local Staging 100% Ready* | **Status:** *Callback Trigger Armed & Active* |
