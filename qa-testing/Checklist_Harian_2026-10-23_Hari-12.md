# CHECKLIST HARIAN — REZA TRI (QA/DOCS) — T-AIMS
## Shift 2 (16.00–01.00 WIB)

**Tanggal:** 23/10/2026  
**Hari ke-:** 12  
**Commit Target:** `feat(qa): release authentic postman verification day-12`  
**Lead QA & Documentation Engineer:** Reza Tri Wardana (`rezatriwardana7@gmail.com`)  

---

### A. AWAL SHIFT (16.00 WIB)
- [x] Terima handover Shift 1 dari Damar Munajad (Project Coordinator)
- [x] Baca task board & target Integrasi & Otentikasi Pemantauan Hari-12
- [x] Verifikasi status MySQL `taims_db` dan service backend Express port 3000
- [x] Verifikasi endpoint API Gateway dan konfigurasi Bearer Token 24 jam
- [x] Siapkan folder kerja `evidence/screenshots/Hari-12/` dan dokumen pengujian

---

### B. SAAT BEKERJA (EKSEKUSI PENGUJIAN)
- [x] **TC-AUTH-001:** Eksekusi otentikasi login admin via Postman (`POST /api/auth/login`) $\rightarrow$ 200 OK
- [x] **TC-AUTH-004:** Validasi profil admin dan verifikasi payload Bearer Token (`GET /api/auth/me`) $\rightarrow$ 200 OK
- [x] **TC-ASSET-001:** Verifikasi integritas inventaris 18 aset infrastruktur terdaftar (`GET /api/assets`) $\rightarrow$ 200 OK
- [x] **TC-MON-005:** Validasi ringkasan statistik kesehatan dan status perangkat dashboard (`GET /api/dashboard/stats`) $\rightarrow$ 200 OK
- [x] **TC-INC-001:** Validasi pencatatan tiket insiden gangguan otomatis di tabel insiden (`GET /api/incidents`) $\rightarrow$ 200 OK
- [x] **TC-NOTIF-001:** Verifikasi daftar 79 alert notifikasi kritis terkirim ke operator (`GET /api/notifications`) $\rightarrow$ 200 OK
- [x] Rekam respon waktu aktual (seluruh endpoint $< 35\text{ ms}$, status 200 OK terverifikasi)
- [x] Simpan tepat 6 bukti tangkapan layar pengujian otentik ke folder `evidence/screenshots/Hari-12/`

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
- [x] 📊 Seluruh respon waktu dan status code (200 OK) diverifikasi konsisten terhadap database `taims_db`
- [x] 🛡️ Seluruh aset, insiden, dan notifikasi teruji siklus hidupnya (*Open* $\rightarrow$ *Resolved*)
