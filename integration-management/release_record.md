# T-AIMS Release Record & Version History

**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Dzakwan (*Shift Lead & System Integration — Shift 2*)  
**Sumber Data Resmi:** [Google Spreadsheet Dzakwan — Tab RELEASE RECORD](https://docs.google.com/spreadsheets/d/1N_zEENj0itTK7l1AjOSOCHS_Jyhuva1Z0zLbTX9k4r0/edit?usp=sharing) (gid: `946898094`)  
**Status Terakhir:** `v1.0.0-gold` (Rilis Final Baseline — Ready to Merge)

---

## 📋 Catatan Rilis & Riwayat Integrasi Sistem

Dokumen ini mencatat seluruh rekam jejak rilis (*release record*), tahapan integrasi lintas shift (Shift 1 & Shift 2), resolusi bug, dan status kesiapan rilis operasional proyek T-AIMS di PT Teknolab Caraka Internasional.

| Versi | Tanggal | Fitur Utama yang Dirilis | Status Bug Terkait | Catatan & Tahapan Integrasi |
| :--- | :---: | :--- | :---: | :--- |
| **`v0.1-alpha`** | 12/10/2026 | Setup environment lokal, import skema database 7 tabel, wireframe awal. | - | Fondasi dasar Shift 2 (Hari ke-1). |
| **`v0.2-alpha`** | 12/10/2026 | Implementasi Backend API v0.7, Mosquitto port 1883, pembuatan `apiService.js`. | Resolusi port | Integrasi full-stack awal (Hari ke-2). |
| **`v0.3-alpha`** | 13/10/2026 | Dashboard memuat 9 aset awal, integrasi CCTV fisik asli, engine ICMP ping. | BUG-008 dicatat | Uji coba hardware end-to-end (Hari ke-3). |
| **`v0.4-alpha`** | 14/10/2026 | Mosquitto & n8n dimigrasikan ke Docker, workflow notifikasi Telegram aktif. | BUG-001 s.d BUG-005, BUG-008 Closed | Pre-Merge tahap 1 (Hari ke-4). |
| **`v0.5-alpha`** | 15/10/2026 | Daemon Systemd service monitoring aktif, verifikasi sistem v1.2 lulus 12/12. | - | Pre-Merge tahap 2 (Hari ke-5). |
| **`v0.6-alpha`** | 15/10/2026 | Monitoring engine Ananda berhasil memproses 1.196 logs ke database MySQL. | BUG-009 diidentifikasi | Pengujian beban monitoring jaringan. |
| **`v0.7-alpha`** | 15/10/2026 | Sinkronisasi 16 aset penuh, perbaikan kalkulasi KPI string, live polling. | Bug KPI kalkulasi | Integrasi E2E Frontend-Backend-DB. |
| **`v0.8-alpha`** | 16/10/2026 | Backend final rilis (~2.900 baris kode, 11 modul rute endpoints lengkap). | BUG-007 & BUG-009 Closed | Perbaikan rute auth & users (Hari ke-6). |
| **`v0.9-alpha`** | 16/10/2026 | Docker full-stack (5 service), pengerasan keamanan MQTT, setup Nginx SSL. | BUG-010 & BUG-013 Closed | Audit remediasi DevOps Wafian (Hari ke-6). |
| **`v0.10-alpha`** | 16/10/2026 | Pemisahan `schema.sql` & `seed.sql`, perbaikan hash password user (Login Blocker). | BUG-014 Closed | Audit remediasi Database Faida (Hari ke-6). |
| **`v1.0.0-gold`** | 16/10/2026 | Implementasi token blacklist JWT, rute `/auth/change-password`, sanitasi WiFi ESP32 & DB `.env`, auto timestamp `offline_since`. | BUG-002, 006, 011, 012, 015, 016 Closed (16/16 Zero Defect) | **Rilis Final Baseline.** QA Postman 58/58 Pass (100% Hijau). Sistem Siap Merge ke Produksi. |

---

## 🎯 Ringkasan Milestone Kunci

1. **Baseline Kestabilan (Hari ke-5 / `v0.5-alpha`):**
   * Integrasi service monitoring background via daemon systemd Linux aktif secara kontinu.
   * Lulus verifikasi integrasi sistem 12/12 skenario otomatis.

2. **Pengerasan & Keamanan (Hari ke-6 / `v0.9-alpha` - `v0.10-alpha`):**
   * Orkestrasi Docker 5 service (`taims-mysql`, `taims-mosquitto`, `taims-backend`, `taims-frontend`, `taims-n8n`).
   * Pengerasan autentikasi MQTT broker Mosquitto (`passwd` auth).
   * Remediasi integritas database relasional oleh Faida & Wafian.

3. **Status Akhir (`v1.0.0-gold`):**
   * **16/16 Bug Terselesaikan (Zero Open Defect).**
   * **58/58 Endpoint Postman Lulus Uji QA (100% Pass Rate).**
   * Seluruh dependensi antarmodul terpenuhi tanpa konflik.
