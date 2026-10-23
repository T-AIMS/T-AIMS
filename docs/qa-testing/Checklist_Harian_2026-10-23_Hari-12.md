# CHECKLIST HARIAN — REZA TRI (QA/DOCS) — T-AIMS
## Shift 2 (16.00–01.00 WIB)

**Tanggal:** 23/10/2026  
**Hari ke-:** 12  
**Commit Target:** `feat(qa): monitoring engine resilience, timeout threshold and auto-recovery day-12`  
**Lead QA & Documentation Engineer:** Reza Tri Wardana (`rezatriwardana7@gmail.com`)  

---

### A. AWAL SHIFT (16.00 WIB)
- [x] Terima handover Shift 1 dari Damar Munajad (Project Coordinator)
- [x] Baca task board & target Ketahanan Monitoring Engine & Timeout Threshold Hari-12
- [x] Verifikasi status MySQL `taims_db` dan service backend Express port 3000
- [x] Verifikasi background offline checker aktif (interval: 30s, threshold: 45s)
- [x] Siapkan folder kerja `evidence/screenshots/Hari-12/` dan dokumen pengujian

---

### B. SAAT BEKERJA (EKSEKUSI PENGUJIAN)
- [x] **TC-FAIL-001:** Eksekusi simulasi timeout koneksi & deteksi offline otomatis ($\ge 45\text{ detik}$)
- [x] **TC-INC-001:** Validasi pembukaan tiket insiden kritis otomatis (*Auto-Incident Generation*) saat status aset beralih ke `OFFLINE`
- [x] **TC-NOTIF-001:** Verifikasi pemicu alert notifikasi unread ke operator/admin (`[ALERT OFFLINE]`)
- [x] **TC-WARN-001:** Uji injeksi paket monitoring dengan response time tinggi ($> 1000\text{ ms}$) memicu status transisi `WARNING`
- [x] **TC-REC-001:** Uji pemulihan otomatis (*Auto-Recovery*) saat paket ping baru masuk $\rightarrow$ status aset pulih `ONLINE` dan insiden otomatis `RESOLVED`
- [x] **TC-HB-002:** Uji resiliensi telemetri IoT Heartbeat (ESP32/RPi) pasca rekoneksi jaringan
- [x] Rekam respon waktu aktual (seluruh endpoint $< 35\text{ ms}$, heartbeat $< 100\text{ ms}$)
- [x] Simpan 6 bukti tangkapan layar pengujian otentik ke folder `evidence/screenshots/Hari-12/`

---

### C. AKHIR SHIFT (00.30 WIB)
- [x] Isi Actual Result di Master Test Cases (`01_Master_Test_Cases.xlsx`)
- [x] Buat hyperlink aktif bukti tangkapan layar di Col 14
- [x] Update sheet `EXECUTION_LOG` (Hari 12: Total 6, PASS 6, FAIL 0)
- [x] Update Tracker Harian Reza (`Tracker_Harian_Reza.csv`) baris 12 (Status: Sudah)
- [x] Tulis Test Report Resmi Hari-12 (`test-reports/2026-10-23_Hari-12.md`)
- [x] Tulis Daily Handover Hari-12 (`handover/2026-10-23_Handover_RezaTri.md`)
- [x] Sinkronkan seluruh artefak ke folder staging GitHub dan Google Drive Hari-12

---

### D. ATURAN WAJIB & QUALITY COMPLIANCE
- [x] 🔒 Tidak menyimpan credential rahasia di source code
- [x] 🚫 Tidak menandai status PASS tanpa bukti respon dan tangkapan layar nyata
- [x] 📊 Seluruh respon waktu dan status code (200 OK / 201 Created) diverifikasi konsisten terhadap database `taims_db`
- [x] 🛡️ Seluruh tiket insiden dan notifikasi teruji siklus hidupnya (*Open* $\rightarrow$ *Resolved*)
