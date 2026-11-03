# 📋 CHECKLIST PENGUJIAN HARIAN – REZA TRI (HARI KE-23)
**Nama**    : Reza Tri Wardana  
**Tanggal** : Selasa, 3 November 2026  
**Shift**   : 2 (16:00 – 01:00 WIB)  
**Tugas**   : Audit Header Informasi Proyek & Arsitektur T-AIMS (16:15 WIB), Verifikasi Struktur Tim Shift 1 Pagi (17:40 WIB), Verifikasi Profil Tim Shift 2 Malam & Lead QA (18:40 WIB), Pengujian Modal Interaktif Ubah Anggota Tim (19:50 WIB), Audit Manajemen Pengguna & Live Shift Indicator RBAC (20:30 WIB), Dokumentasi Laporan Harian, Update Master Test Cases & Handover (21:00 WIB)  
**Status**  : 100% LULUS (5 TEST CASES EXECUTED, ALL PASSED, 0 OPEN DEFECTS, 0 UNRESOLVED ISSUES)  

---

### [x] BAGIAN 1: REVIEW HANDOVER TIM & CHECK-IN AWAL SHIFT
- [x] **1.1 Review Handover Shift & Check-In Kantor 16:00 WIB**
  - Menerima rangkuman operasional Shift 1 dari Mas Damar.
- [x] **1.2 Briefing Sore & Verifikasi Lingkungan Pengujian Live (16:10 WIB)**
  - Server produksi `https://t-aims.teknolab.biz.id` aktif normal (HTTP 200 OK & SSL Valid).
  - Modul Informasi Proyek dan Manajemen Pengguna siap diuji.

---

### [x] BAGIAN 2: AUDIT HEADER DOKUMENTASI RESMI, LOGO PT TEKNOLAB & ARSITEKTUR T-AIMS (TC-H23-001)
- [x] **2.1 Audit Header Dokumentasi Resmi**
  - Mengakses `#page-project-info` pada browser.
  - Memvalidasi banner judul *"DOKUMENTASI RESMI • TIM PENGEMBANG PRA PKL"*, logo resmi PT Teknolab Caraka Internasional, badge status operasional sistem live, dan ringkasan arsitektur platform T-AIMS.
- [x] **2.2 Verifikasi Tata Letak & Konsistensi UI**
  - Memverifikasi hierarki tipografi dan keselarasan tema dark-mode enterprise T-AIMS.
- *Bukti Otentik*: [`2026-11-03_Hari-23_TC-H23-001_project-info-header-overview.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-23/2026-11-03_Hari-23_TC-H23-001_project-info-header-overview.png)

---

### [x] BAGIAN 3: AUDIT STRUKTUR TIM PENGEMBANG SHIFT 1 PAGI (TC-H23-002)
- [x] **3.1 Evaluasi Header Section Shift 1 Pagi**
  - Memeriksa banner section *"SHIFT 1 • PAGI (07.00 - 16.00 WIB)"*.
- [x] **3.2 Audit Kartu Identitas Personil Shift 1**
  - Memeriksa kartu profil Dzakwan Miftahussobirin (Ketua Tim & Pengembang Fullstack).
  - Memeriksa profil Damar Satriatama (Pengembang Backend).
  - Memvalidasi foto/avatar, badge peran, spesialisasi stack, dan detail kontak internal.
- *Bukti Otentik*: [`2026-11-03_Hari-23_TC-H23-002_team-shift-1-structure-cards.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-23/2026-11-03_Hari-23_TC-H23-002_team-shift-1-structure-cards.png) (didukung [`2026-11-03_Hari-23_TC-H23-002_shift-1-pagi-banner.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-23/2026-11-03_Hari-23_TC-H23-002_shift-1-pagi-banner.png))

---

### [x] BAGIAN 4: AUDIT PROFIL TIM SHIFT 2 MALAM - LEAD QA REZA TRI WARDANA (TC-H23-003)
- [x] **4.1 Evaluasi Header Section Shift 2 Malam**
  - Memeriksa banner section *"SHIFT 2 • MALAM (16.00 - 01.00 WIB)"*.
- [x] **4.2 Audit Kartu Profil Lead QA Reza Tri Wardana**
  - Memvalidasi kartu profil Reza Tri Wardana sebagai Lead QA & Documentation Engineer.
  - Memverifikasi rincian spesialisasi teknis pengujian mutu, pembuatan test plan/cases, regression testing, bug reporting, dan handover operasional.
- *Bukti Otentik*: [`2026-11-03_Hari-23_TC-H23-003_team-shift-2-lead-qa-profile.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-23/2026-11-03_Hari-23_TC-H23-003_team-shift-2-lead-qa-profile.png) (didukung [`2026-11-03_Hari-23_TC-H23-003_shift-2-malam-banner.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-23/2026-11-03_Hari-23_TC-H23-003_shift-2-malam-banner.png))

---

### [x] BAGIAN 5: PENGUJIAN MODAL INTERAKTIF "UBAH DATA ANGGOTA TIM" (TC-H23-004)
- [x] **5.1 Trigger Modal Pop-up Interaktif**
  - Melakukan klik pada tombol `[ Ubah ]` di salah satu kartu anggota tim.
  - Modal dialog interaktif muncul mulus dengan efek backdrop overlay gelap.
- [x] **5.2 Validasi Prefilled Input & Komponen Form**
  - Form memuat data eksisting anggota: Nama Lengkap, Peran / Jabatan Teknis, Shift Kerja, dan Kontak / Email.
  - Tombol aksi `[ Simpan Perubahan ]` dan `[ Batal ]` responsif.
- *Bukti Otentik*: [`2026-11-03_Hari-23_TC-H23-004_edit-team-member-modal-form.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-23/2026-11-03_Hari-23_TC-H23-004_edit-team-member-modal-form.png)

---

### [x] BAGIAN 6: AUDIT TABEL MANAJEMEN PENGGUNA & RBAC (#PAGE-USERS) (TC-H23-005)
- [x] **6.1 Akses Menu Manajemen Pengguna & Live Shift Indicator**
  - Mengakses `#page-users` pada antarmuka aplikasi.
  - Indikator live shift aktif menampilkan status operasional shift berjalan.
- [x] **6.2 Audit Matriks Hak Akses Pengguna (RBAC)**
  - Memverifikasi tabel Role-Based Access Control (Admin, CRU).
  - Akun Reza Tri Wardana terkonfigurasi dengan status aktif dan hak akses Penguji Mutu & Dokumentasi.
- *Bukti Otentik*: [`2026-11-03_Hari-23_TC-H23-005_users-management-rbac-shift-table.png`](file:///C:/Users/ThinkPad/Desktop/docs/qa-testing/evidence/screenshots/Hari-23/2026-11-03_Hari-23_TC-H23-005_users-management-rbac-shift-table.png)

---

### [x] BAGIAN 7: SINKRONISASI AKHIR SHIFT & PUSAT DOKUMENTASI (21:00 WIB)
- [x] Memperbarui berkas pelaporan harian `2026-11-03_Hari-23.md`.
- [x] Memperbarui berkas handover shift `2026-11-03_Handover_RezaTri.md`.
- [x] Memperbarui berkas master spreadsheet `01_Master_Test_Cases.xlsx` (EXECUTION_LOG baris 24 & MASTER_TC baris 139–143).
- [x] Memperbarui berkas tracking harian `Tracker_Harian_Reza.csv` (Baris 23).
- [x] Sinkronisasi berkas antara Desktop dan repositori Git.
