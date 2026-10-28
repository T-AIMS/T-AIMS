# DAILY HANDOVER — REZA TRI
**Nama**    : Reza Tri Wardana  
**Tanggal** : 22 Oktober 2026  
**Shift**   : 2 (16.00 - 01.00 WIB)  
**Hari ke** : 11 (Pengujian Monitoring Jaringan & Telemetri 17 Perangkat)  

**Task**   : Pengujian Monitoring Langsung (ICMP Ping, HTTP, TCP, Heartbeat) 17 Aset, Validasi Siklus Transisi Status Perangkat, Perbaikan Skema Database MySQL & Penyelarasan Dokumen QA  
**Status** : Selesai 100% (PASS)

---

## 1. YANG SUDAH SELESAI HARI INI (HARI-11)
1. **Pengujian Telemetri Langsung & Monitoring Mesin Protokol (17 Perangkat Aktif)**:
   - Menguji 3 protokol pemantauan infrastruktur: **ICMP Ping** (Layer-3 network), **HTTP Health Check** (REST API port 3000), **TCP Port Scan** (Port 80, 443, 3000, 3306), dan **IoT Heartbeat** (ESP32 & Raspberry Pi).
   - Seluruh 17 aset terdaftar di MySQL `taims_db` pada 3 lokasi fisik (*Head Office*, *Marketing Office*, *House of Server*) berhasil dipantau dan menerima pembaruan telemetri secara berkala.
2. **Validasi Siklus Transisi Status Perangkat (Device State Transitions)**:
   - Menguji transisi otomatis: $\text{ONLINE} \rightarrow \text{WARNING} \rightarrow \text{OFFLINE} \rightarrow \text{RECOVERY}$.
   - Verifikasi auto-warning saat response time $> 1000\text{ ms}$ atau packet loss $> 10\%$.
   - Verifikasi pembukaan tiket insiden kritis saat timeout $\ge 45\text{ detik}$, serta **auto-recovery & auto-resolved** saat paket ping/heartbeat baru kembali diterima.
3. **Penyelesaian 3 Temuan Skema Database MySQL (`taims_db`)**:
   - Menambahkan kolom `username` pada tabel `users` untuk mendukung login administrator (`admin`, `reza.fahmi`).
   - Memperluas nilai ENUM pada kolom `assets.current_status` dan `monitoring_logs.status` agar mendukung status `'warning'`.
   - Membuat tabel relasional `token_blacklist` untuk mendukung siklus manajemen sesi JWT login/logout secara aman.
4. **Eksekusi 6 Master Test Cases (100% PASS)**:
   - `TC-MON-001` (ICMP Ping simulation): **PASS** (12 ms latency, 0% loss).
   - `TC-MON-002` (HTTP Health Check): **PASS** (45 ms, HTTP 200 OK).
   - `TC-MON-003` (TCP Port Scan): **PASS** (8 ms, Port 80 OPEN).
   - `TC-MON-004` (Latency & Telemetry Logs retrieval): **PASS** (89 log terekam).
   - `TC-MON-005` (Monitoring Summary & Categorization): **PASS** (17 Online, 10 kategori tervalidasi).
   - `TC-HB-001` (IoT Heartbeat Telemetry): **PASS** (RSSI -58 dBm, Uptime 86420s).
5. **Perekaman Bukti Tangkapan Layar Resolusi Tinggi (Hari-11)**:
   - 10 berkas screenshot Full HD 1080p berhasil diambil dan disimpan rapi di `evidence/screenshots/Hari-11/`.
6. **Pembaruan Master Test Cases Excel (`01_Master_Test_Cases.xlsx`)**:
   - Sheet `MASTER_TC`: Baris 54 s/d 59 (TC-MON-001 s/d 005 dan TC-HB-001) ditandai PASS dengan actual result rinci dan hyperlink bukti tangkapan layar aktif.
   - Sheet `EXECUTION_LOG`: Baris 12 (Hari 11, 22/10/2026) dicatat Total 6, PASS 6, FAIL 0.
   - Sheet `DASHBOARD`: Kolom kategori pemantauan diselaraskan, persentase kelulusan sistem naik menjadi **93.2%** (44 TC teruji, 41 PASS).
7. **Pembaruan Tracker Harian Reza (`Tracker_Harian_Reza.csv`)**:
   - Baris 11 diperbarui dengan data tanggal 22/10/2026, 6 TC, 6 PASS, 0 FAIL, status handover "Sudah".

---

## 2. YANG BELUM SELESAI
- Pengujian toleransi pemutusan koneksi massal bertingkat (*gradual disconnects*) dan uji pemulihan jaringan pfSense (dialokasikan untuk jadwal pengujian Hari ke-12).

---

## 3. KENDALA / BLOCKER
- **Nihil (Resolved)**: Kendala perbedaan skema kolom MySQL pada backend telah diselesaikan secara permanen dengan penyesuaian DDL langsung di database lokal `taims_db`.

---

## 4. NEXT ACTION (HARI KE-12)
1. **Regression Test Timeout & Threshold**:
   - Uji batas toleransi timeout saat perangkat tidak mengirim heartbeat selama $3\times$ check interval berturut-turut.
2. **Pengujian Notifikasi Otomatis Gateway**:
   - Memastikan alarm notifikasi Telegram dan n8n terpicu secara akurat tanpa spamming.
3. **Koordinasi Pemeliharaan Rutin**:
   - Menyelaraskan modul jadwal maintenance dengan PIC teknisi Dzakwan & Ananda.

---

## 5. FILE / COMMIT / EVIDENCE
- **Test Report** : `docs/qa-testing/test-reports/2026-10-22_Hari-11.md`
- **Checklist**   : `docs/qa-testing/Checklist_Harian_2026-10-22_Hari-11.md`
- **Folder Bukti** : `docs/qa-testing/evidence/screenshots/Hari-11/` (10 Berkas PNG)
- **Workbook QA** : `docs/qa-testing/01_Master_Test_Cases.xlsx`
- **Tracker**     : `docs/qa-testing/Tracker_Harian_Reza.csv`
- **Commit Git**  : `feat(qa): live telemetry monitoring test 17 devices and state transitions day-11`
