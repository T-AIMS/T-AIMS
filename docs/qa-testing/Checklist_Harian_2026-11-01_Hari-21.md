# 📋 CHECKLIST PENGUJIAN HARIAN — REZA TRI (HARI KE-21)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Minggu, 1 November 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Audit Komprehensif Menu Peringatan, Trigger Uji Telegram Bot & Verifikasi Anti-Spam (16:15 WIB), Validasi Ekspor CSV & Integrasi Spreadsheet (20:30 WIB), Dokumentasi Laporan Harian, Update Master Test Cases & Handover (21:30 WIB)  
**Status**  : 100% LULUS (5 TEST CASES EXECUTED, ALL PASSED, 1 DEFECT LOGGED)  

---

### [x] BAGIAN 1: REVIEW HANDOVER TIM & CHECK-IN AWAL SHIFT
- [x] **1.1 Review Handover Shift & Check-In Kantor 16:00 WIB**
  - Menerima update status server CloudPanel VPS `https://t-aims.teknolab.biz.id` pasca maintenance pagi.
- [x] **1.2 Briefing Sore & Verifikasi Lingkungan Pengujian Live (16:10 WIB)**
  - Server produksi aktif normal (HTTP 200 OK & SSL Certificate Valid).
  - Modul Peringatan dan gateway Telegram Bot siap diuji.

---

### [x] BAGIAN 2: AUDIT MENU PERINGATAN & METRIK INSIDEN (TC-H21-001)
- [x] **2.1 Audit Widget 4 Kartu Metrik Insiden**
  - Membuka halaman `#page-alerts` pada browser live.
  - Mengonfirmasi 4 kartu metrik: Open Incidents (0 Cases), Under Investigation (0 Cases), Resolved Incidents (14 Cases), dan Dispatched Alerts (10 Sent).
- [x] **2.2 Verifikasi Status 3 Saluran Gateway**
  - n8n Automation Webhook berstatus `Active`.
  - SMTP Email Dispatcher berstatus `Standby`.
  - Telegram Alert Gateway (`@TeknolabAimsBot • Status: Connected`) berstatus `Active`.
- *Bukti Otentik*: [`2026-11-01_Hari-21_TC-H21-001_alert-incident-overview-dashboard.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-21/2026-11-01_Hari-21_TC-H21-001_alert-incident-overview-dashboard.png)

---

### [x] BAGIAN 3: AUDIT SIKLUS HIDUP INSIDEN & AKAR MASALAH (TC-H21-002)
- [x] **3.1 Audit Baris Riwayat Insiden INC-030 s/d INC-015**
  - Memeriksa tabel *Daftar Insiden Infrastruktur & Waktu Pemulihan*.
  - Meneliti kolom Waktu Gangguan, Severity badge (Tinggi, Sedang), Akar Masalah deskriptif, dan PIC Teknisi (`Reza Tri wardana`).
- [x] **3.2 Validasi Status Siklus Pemulihan**
  - Seluruh 14 insiden tercatat dengan status *Terselesaikan* (Resolved).
- *Bukti Otentik*: [`2026-11-01_Hari-21_TC-H21-002_incident-audit-history-recovery-table.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-21/2026-11-01_Hari-21_TC-H21-002_incident-audit-history-recovery-table.png)

---

### [x] BAGIAN 4: UJI TRIGGER NOTIFIKASI TELEGRAM BOT (TC-H21-003)
- [x] **4.1 Eksekusi Tombol Uji Kirim Telegram**
  - Mengklik tombol biru `[ Uji Kirim Telegram ]` pada pojok kanan atas.
  - Memvalidasi transmisi request dispatch alert ke gateway Telegram.
- [x] **4.2 Konfirmasi Pop-up Toast Alert Hijau**
  - Memverifikasi munculnya notifikasi toast hijau: *"Notifikasi Terkirim — Simulasi alert OFFLINE untuk RPI-01 (Raspberry Pi Head Office) berhasil digenerate dan dikirim."*
- *Bukti Otentik*: [`2026-11-01_Hari-21_TC-H21-003_telegram-alert-dispatch-confirmation-toast.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-21/2026-11-01_Hari-21_TC-H21-003_telegram-alert-dispatch-confirmation-toast.png)

---

### [x] BAGIAN 5: VERIFIKASI ANTI-SPAM DEBOUNCE & POLLING STREAM DEVTOOLS (TC-H21-004)
- [x] **5.1 Validasi Lencana Anti-Spam Cooldown**
  - Mengonfirmasi lencana proteksi resmi: `Alert Debounce: 5–Min Cooldown Active` terpasang pada kartu gateway.
- [x] **5.2 Audit Continuous Polling Stream DevTools**
  - Merekam 1.085+ request berkala backend pada tab Network DevTools.
  - Seluruh respons berstatus HTTP **200 OK** stabil tanpa request loss / looping crash.
- [x] **5.3 Pencatatan Temuan Defect DEF-H21-001**
  - Mencatat evaluasi tombol trigger yang belum memiliki client-side click-lock.
- *Bukti Otentik*: [`2026-11-01_Hari-21_TC-H21-004_anti-spam-debounce-network-polling-stream.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-21/2026-11-01_Hari-21_TC-H21-004_anti-spam-debounce-network-polling-stream.png)

---

### [x] BAGIAN 6: EKSPOR CSV INSIDEN & AUDIT SPREADSHEET EXCEL (TC-H21-005)
- [x] **6.1 Eksekusi Unduh CSV Insiden**
  - Mengklik tombol `[ Unduh CSV Insiden ]`.
  - Berkas `T-AIMS_Incident_Report_2026-11-01.csv` terunduh otomatis.
- [x] **6.2 Verifikasi Integritas Data Spreadsheet Excel**
  - Membuka berkas CSV di Microsoft Excel.
  - Memverifikasi tepat 9 kolom dan 14 baris insiden tersusun rapi tanpa korupsi data.
- *Bukti Otentik*: [`2026-11-01_Hari-21_TC-H21-005_csv-incident-export-spreadsheet-verification.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-21/2026-11-01_Hari-21_TC-H21-005_csv-incident-export-spreadsheet-verification.png)

---

### [x] BAGIAN 7: SINKRONISASI AKHIR SHIFT & PUSAT DOKUMENTASI (21:30 WIB)
- [x] Memperbarui berkas pelaporan harian `2026-11-01_Hari-21.md`.
- [x] Memperbarui berkas handover shift `2026-11-01_Handover_RezaTri.md`.
- [x] Memperbarui berkas master spreadsheet `01_Master_Test_Cases.xlsx` (EXECUTION_LOG baris 22 & MASTER_TC baris 129–133).
- [x] Memperbarui berkas tracking harian `Tracker_Harian_Reza.csv` (Baris 21).
- [x] Melakukan komit dan push repositori Git ke cabang `main`.
