# Network & Device Monitoring Engine — T-AIMS

Folder ini berisi modul **Network & Device Monitoring Engine** untuk proyek T-AIMS (Teknolab Asset & Infrastructure Monitoring System).

- **Penanggung Jawab:** Ananda Dwi Susanti
- **Peran:** Network & Device Monitoring Engineer (Shift 1)
- **Integrasi Server & API:** Wafian Zaidan El Y. (Shift 2)

---

## 📁 Daftar Berkas & Deliverable

1. **`monitoring_engine.py`**
   - Engine pemantauan perangkat utama berbasis ICMP Ping adaptif (Windows & Linux).
   - Mengimplementasikan aturan *Retry Logic* (DCR-01) 3x percobaan untuk mencegah alarm palsu (*false alarm*).
   - Terintegrasi langsung dengan Backend API T-AIMS (`/api/monitoring/ping`) dan database `taims_db`.
   - Berjalan sebagai service background (`taims-monitoring.service`).

2. **`monitoring.py`**
   - Skrip pemantauan histori otomatis: mendeteksi perubahan status perangkat (`UP` <-> `DOWN`).
   - Mencatat setiap transisi kondisi ke dalam berkas log `history.csv`.

3. **`history.csv`**
   - Log pencatatan perubahan status perangkat yang dihasilkan oleh `monitoring.py`.

4. **`Device_check_rules_baru.md`** & **`Device_check_rules.md`**
   - Dokumen spesifikasi aturan pemeriksaan perangkat (DCR-01 Mekanisme Retry s/d DCR-06 Penyimpanan Hasil).

5. **`test_monitoring_baru.py`**
   - Skrip pengujian otomatis 5 skenario (Device Online, Device Offline, Retry Logic, Timeout Handling, Public DNS).

6. **`survey jaringan final .txt`** & **`survey jaringan.txt`**
   - Dokumen survei topologi perangkat dan gateway jaringan kantor PT Teknolab Caraka Internasional.

7. **`survey monitoring_logs.csv`** & **`monitoring_logs.csv`**
   - Berkas log pemantauan perangkat hasil survei lapangan dan pengoperasian engine.
