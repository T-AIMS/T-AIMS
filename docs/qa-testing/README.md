# 🛡️ Teknolab Asset & Infrastructure Monitoring System (T-AIMS)
## 📋 Quality Assurance & System Verification Repository

![QA Status](https://img.shields.io/badge/QA%20Status-PASS%20100%25-brightgreen)
![Lead QA](https://img.shields.io/badge/Lead%20QA-Reza%20Tri%20Wardana-blue)
![Shift](https://img.shields.io/badge/Shift-Shift%202-orange)
![Milestone](https://img.shields.io/badge/Milestone-Day--12%20API%20Integration%20%26%20Postman%20Verification-purple)
![Coverage](https://img.shields.io/badge/Coverage-18%2F18%20Devices%20Tested-success)

---

### 👤 Profil Penanggung Jawab QA & Testing
* **Lead QA & Documentation Engineer:** **Reza Tri Wardana**
* **Role & Responsibility:** End-to-End API Integration Testing, Real-Time Telemetry Verification, Timeout & Failover Resilience, Device State Transition Validation, Shift Handover Governance.
* **Operasional:** Shift 2 (16:00 – 01:00 WIB)
* **Milestone Berjalan:** 23 Oktober 2026 (Hari-12)

---

### 📂 Struktur Direktori Repositori `qa-testing/`

Repositori ini disusun secara modular sesuai standar pengujian industri perangkat lunak (*ISO/IEC/IEEE 29119*):

```text
📁 qa-testing/
│
├── 📄 README.md                               <-- Dokumen portal utama & ringkasan eksekutif QA
├── 📄 01_Master_Test_Cases.xlsx              <-- Master Test Cases (Total 65 TCs, 100% PASS)
├── 📄 Checklist_Harian_2026-10-23_Hari-12.md <-- Checklist verifikasi operasional harian Hari-12
├── 📄 Checklist_Harian_2026-10-22_Hari-11.md <-- Checklist verifikasi operasional harian Hari-11
├── 📄 Tracker_Harian_Reza.csv                <-- Log matriks eksekusi QA harian
├── 📄 BUG_LIST_MVP_AWAL_FINAL.md             <-- Rekapitulasi pelacakan bug & resolusi cacat
├── 📄 Integration_Checklist_T-AIMS.md        <-- Matriks integrasi lintas-layanan IoT & backend
│
├── 📁 test-reports/                          <-- Laporan pengujian teknis harian
│    ├── 📄 2026-10-21_Hari-10.md              <-- Laporan Pengujian Hari-10
│    ├── 📄 2026-10-22_Hari-11.md              <-- Laporan Pengujian Hari-11
│    └── 📄 2026-10-23_Hari-12.md              <-- Laporan Pengujian Hari-12 (API Verification)
│
├── 📁 handover/                              <-- Berita acara serah terima tugas (Shift Handover)
│    ├── 📄 2026-10-21_Handover_RezaTri.md     <-- Handover Hari-10
│    ├── 📄 2026-10-22_Handover_RezaTri.md     <-- Handover Hari-11
│    └── 📄 2026-10-23_Handover_RezaTri.md     <-- Handover Hari-12 (Shift 2 ke Shift 3)
│
├── 📁 evidence/                              <-- Bukti otentik pengujian sistem
│    └── 📁 screenshots/
│         ├── 📁 Hari-10/                      <-- Bukti Validasi RBAC, Notifikasi & Settings
│         ├── 📁 Hari-11/                      <-- Bukti Live Telemetry 17 Devices & Postman Real
│         └── 📁 Hari-12/                      <-- Bukti Otentik Postman 200 OK (Tepat 6 Foto)
│
└── 📁 postman/                               <-- Koleksi pengujian API otomatis
     └── 📁 collections/                      <-- Koleksi Postman T-AIMS (58 Endpoints Positif & Negatif)
```

---

### 📊 Rekapitulasi Hasil Pengujian Hari-12 (Jumat, 23 Oktober 2026)

| Test Suite ID | Modul Pengujian | Endpoint Diuji | Hasil Respon | Latensi | Status |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **TC-AUTH-001** | Auth | `POST /api/auth/login` | 200 OK | 18 ms | **PASS** |
| **TC-AUTH-004** | Auth | `GET /api/auth/me` | 200 OK | 12 ms | **PASS** |
| **TC-ASSET-001**| Assets | `GET /api/assets` | 200 OK | 22 ms | **PASS** |
| **TC-MON-005** | Dashboard | `GET /api/dashboard/stats` | 200 OK | 15 ms | **PASS** |
| **TC-INC-001**  | Incidents | `GET /api/incidents` | 200 OK | 17 ms | **PASS** |
| **TC-NOTIF-001**| Notifications| `GET /api/notifications` | 200 OK | 14 ms | **PASS** |

* **Total Perangkat Diuji:** 18/18 Perangkat Aktif & Sehat.
* **Defect / Critical Bugs:** 0 Open Bug.
* **Tingkat Kelulusan:** **100% PASS**.

---
*Dokumentasi ini dikelola secara berkala oleh Divisi Quality Assurance Project T-AIMS.*
