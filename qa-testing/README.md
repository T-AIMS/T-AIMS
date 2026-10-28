# 🏢 Teknolab Asset & Infrastructure Monitoring System (T-AIMS)
## 🎯 Quality Assurance & System Verification Repository

![QA Status](https://img.shields.io/badge/QA%20Status-PASS%20100%25-brightgreen)
![Lead QA](https://img.shields.io/badge/Lead%20QA-Reza%20Tri%20Wardana-blue)
![Shift](https://img.shields.io/badge/Shift-Shift%202-orange)
![Milestone](https://img.shields.io/badge/Milestone-Day--13%20Asset%20Verification%20%26%20Pre--Deploy%20Audit-purple)
![Coverage](https://img.shields.io/badge/Coverage-18%2F18%20Test%20Cases%20PASS-success)

---

### 👨‍💻 Profil Penanggung Jawab QA & Testing
* **Lead QA & Documentation Engineer:** **Reza Tri Wardana**
* **Role & Responsibility:** End-to-End Asset Verification, IoT Heartbeat & Telemetry Fallback Audit, Category/Location Filtering Validation, Pre-Deployment Readiness Check, Shift Handover Governance.
* **Operasional:** Shift 2 (16:00 – 01:00 WIB)
* **Milestone Berjalan:** 24 Oktober 2026 (Hari-13)

---

### 📁 Struktur Direktori Repositori `qa-testing/`

Repositori ini disusun secara modular sesuai standar pengujian industri perangkat lunak (*ISO/IEC/IEEE 29119*):

```text
📁 qa-testing/
│
├── 📄 README.md                               <-- Dokumen portal utama & ringkasan eksekutif QA
├── 📄 01_Master_Test_Cases.xlsx              <-- Master Test Cases (Total 65 TCs, 100% PASS)
├── 📄 Checklist_Harian_2026-10-24_Hari-13.md <-- Checklist verifikasi operasional harian Hari-13
├── 📄 Checklist_Harian_2026-10-23_Hari-12.md <-- Checklist verifikasi operasional harian Hari-12
├── 📄 Checklist_Harian_2026-10-22_Hari-11.md <-- Checklist verifikasi operasional harian Hari-11
├── 📄 Tracker_Harian_Reza.csv                <-- Log matriks eksekusi QA harian
├── 📄 BUG_LIST_MVP_AWAL_FINAL.md             <-- Rekapitulasi pelacakan bug & resolusi cacat
├── 📄 Integration_Checklist_T-AIMS.md        <-- Matriks integrasi lintas-layanan IoT & backend
│
├── 📁 test-reports/                          <-- Laporan pengujian teknis harian
│    ├── 📄 2026-10-21_Hari-10.md              <-- Laporan Pengujian Hari-10
│    ├── 📄 2026-10-22_Hari-11.md              <-- Laporan Pengujian Hari-11
│    ├── 📄 2026-10-23_Hari-12.md              <-- Laporan Pengujian Hari-12
│    └── 📄 2026-10-24_Hari-13.md              <-- Laporan Pengujian Hari-13 (Asset & Heartbeat Audit)
│
├── 📁 handover/                              <-- Berita acara serah terima tugas (Shift Handover)
│    ├── 📄 2026-10-21_Handover_RezaTri.md     <-- Handover Hari-10
│    ├── 📄 2026-10-22_Handover_RezaTri.md     <-- Handover Hari-11
│    ├── 📄 2026-10-23_Handover_RezaTri.md     <-- Handover Hari-12
│    └── 📄 2026-10-24_Handover_RezaTri.md     <-- Handover Hari-13 (Pre-Deploy Readiness)
│
├── 📁 evidence/                              <-- Bukti otentik pengujian sistem
│    └── 📁 screenshots/
│         ├── 📁 Hari-10/                      <-- Bukti Validasi RBAC, Notifikasi & Settings
│         ├── 📁 Hari-11/                      <-- Bukti Live Telemetry 17 Devices & Postman Real
│         ├── 📁 Hari-12/                      <-- Bukti Otentik Postman 200 OK (Tepat 6 Foto)
│         └── 📁 Hari-13/                      <-- Bukti Otentik Dashboard & Asset Verification (18 Foto)
│
└── 📁 postman/                               <-- Koleksi pengujian API otomatis
     └── 📁 collections/                      <-- Koleksi Postman T-AIMS (58 Endpoints Positif & Negatif)
```

---

### 📊 Rekapitulasi Hasil Pengujian Hari-13 (Sabtu, 24 Oktober 2026)

| Test Suite ID | Kategori Pengujian | Fokus Pengujian | Hasil Observasi | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TC-ASSET-001** | Asset Verification | MikroTik Core Router CCR1009 | Status Online, IP 192.168.10.1, Port 8728 terverifikasi | **PASS** |
| **TC-ASSET-002** | Asset Verification | Cisco Catalyst Switch 2960 | Status Online, IP 192.168.10.2, Switch Distribution OK | **PASS** |
| **TC-ASSET-003** | Asset Verification | UniFi Protect G4 Pro CCTV | Status Online, RTSP stream active, IP 192.168.20.10 | **PASS** |
| **TC-ASSET-004** | Asset Verification | Ubuntu Production Server SRV-01 | Status Online, Server Host OK, IP 192.168.10.10 | **PASS** |
| **TC-ASSET-005** | Asset Verification | Raspberry Pi Gateway Node | Status Online, Gateway Telemetry OK, IP 192.168.10.15 | **PASS** |
| **TC-ASSET-006** | Service Verification | Web Service T-AIMS Production | HTTP 200 OK, Nginx Reverse Proxy active, Port 80/443 | **PASS** |
| **TC-ASSET-007** | Modal & Detail | ESP32 Sensor Node (IoT-01) | Modal info menampilkan MAC, Firmware, Telemetry lengkap | **PASS** |
| **TC-ASSET-008** | IoT Telemetry | Mosquitto MQTT Broker Service | MQTT port 1883 active, Topic `taims/telemetry` receiving | **PASS** |
| **TC-ASSET-009** | Asset Verification | PC Workstation Head Office | Status Online, IP 192.168.10.50, Subnet HO verified | **PASS** |
| **TC-ASSET-010** | Filter Testing | Filter Aset Kategori "Router" | Tabel hanya menampilkan perangkat Router (CCR1009) | **PASS** |
| **TC-ASSET-011** | Filter Testing | Filter Aset Kategori "IoT Node" | Tabel hanya menampilkan ESP32 & Node sensor | **PASS** |
| **TC-ASSET-012** | Filter Testing | Filter Lokasi "Head Office" | Grid/Tabel hanya menampilkan aset Head Office | **PASS** |
| **TC-ASSET-013** | Network Integrity | Verifikasi IP MikroTik & Ping | IP Binding 192.168.10.1 valid, latency < 2ms | **PASS** |
| **TC-ASSET-014** | IoT Telemetry | ESP32 Telemetry Temp/Hum/Volt | Metrik 28.5°C, 65% RH, 3.3V terkirim & tersimpan DB | **PASS** |
| **TC-ASSET-015** | Critical Assets | Filter Priority 1 (P1) Assets | Seluruh 5 critical infra P1 terfilter dengan akurat | **PASS** |
| **TC-HB-001** | Heartbeat Fallback | Telemetry Standby Keep-Alive | Heartbeat packet 60s fallback berfungsi normal | **PASS** |
| **TC-HB-002** | Security & Auth | Penolakan Perangkat Tak Terdaftar | Device payload liar otomatis di-reject (HTTP 401/MQTT reject) | **PASS** |
| **TC-HB-003** | Interactive Floorplan | Sinkronisasi Heartbeat Denah 2D | Pin denah Head Office terupdate realtime tanpa reload | **PASS** |

* **Total Test Cases:** 18 Planned / 18 Executed / 18 Passed (0 Failed, 0 Blocked).
* **Defect / Critical Bugs:** 0 Open Bug.
* **Tingkat Kelulusan:** **100% PASS (Production Ready)**.

---
*Dokumentasi ini dikelola secara berkala oleh Divisi Quality Assurance Project T-AIMS.*