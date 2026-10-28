# INTEGRATION CHECKLIST & INTEGRITAS TEKNIS — T-AIMS
## Teknolab Asset & Infrastructure Monitoring System

**Nomor Dokumen** : T-AIMS/QA/CHK-INT/2026/001  
**Versi**         : 1.0  
**Tanggal Evaluasi**: 20 Oktober 2026 (Hari ke-9 — Menjelang Milestone Hari 10)  
**Evaluator (QA)**: Reza Tri Wardana (QA, Testing & Documentation Engineer)  
**Koordinator / Reviewer**: Damar Munajad (Project Coordinator & System Analyst - Shift 1)  
**Lead Integrasi**: Dzakwan Miftahussobirin (Shift Lead & System Integration - Shift 2)  
**Status Evaluasi**: ✅ **VERIFIED & READY FOR MILESTONE 10 REVIEW**

---

## 1. PENDAHULUAN & TUJUAN

Dokumen **Integration Checklist & Integritas Teknis** ini disusun berdasarkan arahan **Damar Munajad** (Project Coordinator Shift 1) dan standar kerja pada *Dokumen Kerja Praktik Kerja Lapangan T-AIMS PT Teknolab Caraka Internasional* (Halaman 7 & 10). 

Tujuan checklist ini adalah:
1. Memvalidasi bahwa seluruh komponen sistem yang dibangun oleh Shift 1 dan Shift 2 benar-benar **terintegrasi menjadi SATU SISTEM UTUH** (Satu Repository, Satu Database, Satu Backend, Satu Dashboard).
2. Memeriksa kepatuhan **Integritas Teknis** (kontrak API 58 endpoint, skema database, penentuan status berbasis rule teknis, dan keamanan RBAC).
3. Memastikan proyek memenuhi kriteria **Definition of Done (DoD)** menjelang rilis *Bug List MVP Awal* pada Milestone Hari ke-10.

---

## 2. CHECKLIST INTEGRASI 6 LAYER SISTEM (INTER-MODULE INTEGRATION)

| Layer | Komponen Sistem | PIC | Antarmuka / Protokol | Kriteria Integrasi | Status | Bukti / Catatan |
|:---:|---|---|---|---|:---:|---|
| **L1 ➔ L2** | Device/Asset ➔ Monitoring Engine | Ilvina, Ananda | ICMP Ping, TCP, MQTT Heartbeat (Port 1883) | Status deteksi realtime 19 perangkat kantor Teknolab (ESP32, RPi, Switch, Router, AP, PC) terkirim tiap 30–60 detik. | ✅ **PASS** | Telemetri aktif di engine pemantau |
| **L2 ➔ L3** | Monitoring Engine ➔ Database & Backend API | Ananda, Faida, Ahmad Reza | HTTP POST `/api/monitoring`, MySQL Ingest | Hasil probe latensi, response time, dan timestamp `last_seen` otomatis tercatat ke tabel `monitoring_logs`. | ✅ **PASS** | Data log tersimpan di MySQL database |
| **L3 ➔ L4** | Backend API ➔ Web Dashboard (Frontend SPA) | Ahmad Reza, Dika, Ahmad Aziz | REST API Port 3000 ➔ Port 3001 (JWT Bearer) | Dashboard 9 modul SPA berhasil menampilkan 6 KPI cards, tabel 19 aset, filter kategori, status pill, dan Leaflet GIS. | ✅ **PASS** | UI terhubung live ke backend |
| **L3 ➔ L5** | Backend API ➔ Alert & Reporting Engine | Ahmad Reza, Arik | Event Trigger, Webhook, MQTT Publish | Pemicu insiden otomatis saat status berubah menjadi Offline/Warning; log tersimpan di tabel `incidents`. | ✅ **PASS** | Log insiden tersimpan di database |
| **L5 ➔ L6** | Alert Engine ➔ AI Automation | Arik | n8n Workflow, REST API LLM Engine | Pemicu analisis anomali otomatis dan ringkasan insight kesehatan infrastruktur harian. | 🔄 **READY** | Siap uji integrasi penuh di Sprint AI |
| **L4 ➔ L3** | Aksi Pengguna (CRUD) ➔ Backend API | Dika, Ahmad Reza | HTTP POST/PUT/DELETE `/api/assets`, `/api/users` | Operasi create, update status, dan assign lokasi berhasil tersinkronisasi dua arah tanpa refresh halaman (*SPA state*). | ✅ **PASS** | Form validation & sanitasi XSS aman |

---

## 3. CHECKLIST INTEGRITAS TEKNIS (TECHNICAL INTEGRITY)

### 3.1 Integritas Kontrak API (API Contract Compliance v0.5)
*Acuan: API Contract v0.5 oleh Ahmad Reza Fahmi (58 Endpoints)*

- [x] **Format Respon Standar:** Seluruh endpoint sukses mengembalikan JSON terstruktur:
  ```json
  { "status": "success", "data": [...], "meta": { "total": 19, "page": 1 } }
  ```
- [x] **Format Respon Error Standar:** Seluruh kegagalan mengembalikan pesan ramah pengguna dan actionable:
  ```json
  { "status": "error", "message": "Deskripsi kesalahan spesifik", "code": 400 }
  ```
- [x] **Kepatuhan HTTP Status Code:**
  - `200 OK` untuk pembacaan data (GET) dan pembaruan sukses.
  - `201 Created` untuk pembuatan data baru (POST aset/user).
  - `400 Bad Request` jika validasi input form gagal.
  - `401 Unauthorized` jika token JWT absen atau kedaluwarsa.
  - `403 Forbidden` jika role tidak memiliki hak akses.
  - `404 Not Found` jika entitas tidak ditemukan.
  - `500 Internal Server Error` ditangani graceful (*tidak membocorkan stack trace*).
- [x] **Postman Collection Synchronized:** 58 endpoints telah distaging pada folder `postman/` dan siap diekspor/di-push ke GitHub repository.

---

### 3.2 Integritas Database & Skema Relasi Data
*Acuan: Skema Database T-AIMS oleh Faida Trisma Amelia*

- [x] **7 Tabel Inti Terverifikasi:**
  1. `users`: Manajemen akun & otorisasi RBAC.
  2. `assets`: Master inventaris 19 perangkat Teknolab.
  3. `locations`: Data titik spasial kantor & denah lantai (*floorplan*).
  4. `monitoring_logs`: Riwayat telemetri metrik ping dan response time.
  5. `incidents`: Tiket rekaman insiden dan downtime perangkat.
  6. `maintenance`: Jadwal pemeliharaan preventif.
  7. `notifications`: Riwayat notifikasi alert broadcast.
- [x] **Integritas Referensial (Foreign Key Integrity):**
  - Kolom `asset_id` pada `monitoring_logs`, `incidents`, dan `maintenance` terikat ke `assets.asset_id` dengan integritas cascade/restrict yang benar.
  - Kolom `location_id` terikat valid ke tabel `locations`.
  - Kolom `created_by` terikat valid ke `users.user_id`.
- [x] **Konsistensi Tipe Data & ENUM:** Nilai status dibatasi strictly pada ENUM: `'online'`, `'offline'`, `'warning'`, `'unknown'`, `'maintenance'`.
- [x] **Zero Orphaned Records:** Tidak ditemukan record anak (*child record*) yang terputus dari induk asetnya.

---

### 3.3 Integritas Aturan Status Perangkat (*State Logic Integrity*)
*Acuan: Aturan Bab 6 Spesifikasi Teknis*

- [x] **Status Objektif (Bukan Sekadar Warna Visual):**
  - **Online**: Heartbeat/ping terakhir $< \text{threshold}$.
  - **Warning**: Response time melonjak ($> 100\text{ ms}$) atau terjadi keterlambatan heartbeat.
  - **Offline**: Tidak ada sinyal melewati ambang batas $3\times$ interval heartbeat (default: $> 90\text{ detik}$).
  - **Unknown**: Aset baru yang belum pernah menerima respon pertama kali.
  - **Maintenance**: Ditandai manual oleh PIC teknis saat perbaikan fisik.
- [x] **Last Seen Timestamp Verification:** Kolom waktu pemantauan terakhir terupdate presisi dalam zona waktu lokal (WIB) tanpa lag sistem.

---

### 3.4 Integritas Keamanan & Akses (Security & RBAC Integrity)
*Acuan: Matriks Izin Akses Bab 8 Spesifikasi Teknis*

- [x] **Zero Plain Credential:** Tidak ada kata sandi, API key, atau token database yang di-hardcode di dalam source code repository.
- [x] **Environment Configuration:** Menggunakan file konfigurasi `.env` terlindungi.
- [x] **Enkripsi Sandi:** Hash password menggunakan algoritma aman `bcrypt`.
- [x] **Otorisasi JWT Bearer Token:** Header `Authorization: Bearer <token>` diverifikasi di setiap rute tertutup backend.
- [x] **Matriks Izin Akses (RBAC) 3 Level:**
  - `super_admin`: Hak penuh kelola sistem, user, aset, audit log, & konfigurasi threshold.
  - `admin`: Hak kelola operasional aset, tindak lanjut insiden, & penjadwalan maintenance.
  - `user` / `viewer`: Akses read-only dashboard & laporan publik.
- [x] **XSS & Injection Protection:** Input teks pada form aset telah disanitasi menggunakan mekanisme escaping HTML sebelum dirender ke DOM.

---

## 4. CHECKLIST DEFINITION OF DONE (DoD) & KERJA DUA SHIFT

Berdasarkan prinsip *“Satu Sistem, Bukan Dua Project”*:

- [x] **Satu Repository:** Seluruh artefak pengujian, laporan harian, handover, dan collection Postman tersusun terpusat di folder `docs/qa-testing/`.
- [x] **Satu Database:** Data uji sinkron antara pengujian Shift 1 (Faida/Damar) dan Shift 2 (Reza/Dzakwan).
- [x] **Satu Backend & Endpoint Contract:** Seluruh fungsi frontend mengonsumsi kontrak API v0.5 port 3000.
- [x] **Handover Antar Shift Disiplin:** 
  - Handover Shift 1 diterima pukul 16.00 WIB.
  - Handover Shift 2 diserahkan pukul 00.30–01.00 WIB disertai commit repository dan bukti visual.
- [x] **Zero Ghost Task:** Setiap status PASS pada test case didukung bukti screenshot nyata di `evidence/screenshots/`.

---

## 5. STATUS DEFECT & VERIFIKASI RETEST (BUG-001 s/d BUG-010)

Hasil verifikasi integritas frontend wireframe terhadap temuan bug Shift 2 Lead (Dzakwan):

| Bug ID | Modul / Komponen | Deskripsi Kerusakan Awal | Status Retest | Bukti Screenshot |
|:---:|---|---|:---:|---|
| **BUG-001** | UI Header | User profil menumpuk di viewport tablet 768px | ✅ **VERIFIED (CLOSED)** | `2026-10-18_BUG-001_header-overflow.png` |
| **BUG-002** | Endpoint User | Respon `/api/users/1` sempat mengembalikan 500 | ✅ **VERIFIED (CLOSED)** | `2026-10-18_BUG-002_user-endpoint.png` |
| **BUG-003** | Auth Session | Token expired tidak me-redirect ke login form | ✅ **VERIFIED (CLOSED)** | `2026-10-18_BUG-003_auth-me.png` |
| **BUG-004** | Table Filter | Filter kategori perangkat tidak reset pagination | ✅ **VERIFIED (CLOSED)** | `2026-10-18_BUG-004_filter-reset.png` |
| **BUG-005** | Export Module | Export file corrupt saat filter kosong | ✅ **VERIFIED (CLOSED)** | `2026-10-18_BUG-005_zip-corrupt.png` |
| **BUG-006** | Dashboard Card | Warna status warning dan offline tertukar | ✅ **VERIFIED (CLOSED)** | `2026-10-20_BUG-006_card-color.png` |
| **BUG-007** | Map Location | Leaflet map blank saat ganti tab modul | ✅ **VERIFIED (CLOSED)** | `2026-10-20_BUG-007_leaflet-resize.png` |
| **BUG-008** | Monitoring Log | Waktu timestamp server tidak sinkron ke WIB | ✅ **VERIFIED (CLOSED)** | `2026-10-20_BUG-008_timestamp-utc.png` |
| **BUG-009** | User Management | Validasi role dropdown tidak disable save button | ✅ **VERIFIED (CLOSED)** | `2026-10-20_BUG-009_role-dropdown.png` |
| **BUG-010** | Settings Tab | Form input threshold tidak menolak nilai minus | ✅ **VERIFIED (CLOSED)** | `2026-10-20_BUG-010_negative-threshold.png` |

---

## 6. KESIMPULAN & REKOMENDASI QA

1. **Kelayakan Integrasi Sistem:** Seluruh 6 layer arsitektur T-AIMS telah terhubung secara harmonis dan tidak ada *architectural blocker* yang menghambat rilis MVP.
2. **Kesiapan Menuju Milestone Hari 10:** Rekapitulasi bug list awal telah rampung 100% (*10 bug closed*), data pengujian tercatat rapi di workbook `01_Master_Test_Cases.xlsx`, dan koleksi pengujian API 58 endpoint telah siap diserahkan kepada Damar Munajad dan Dzakwan Miftahussobirin.
3. **Rekomendasi Tindak Lanjut Shift 1:** Tim backend dan IoT dapat melanjutkan pengujian beban monitoring engine pada Hari 11–12 sesuai roadmap resmi.

---

## 7. LEMBAR PENGESAHAN

| Peran | Nama Personel | Tanggal | Tanda Tangan / Status |
|:---:|:---:|:---:|:---:|
| **QA, Testing & Docs Engineer** | Reza Tri Wardana | 20 Oktober 2026 | `[TERVERIFIKASI & TERCATAT]` |
| **Project Coordinator (Shift 1)** | Damar Munajad | 20 Oktober 2026 | `[MENUNGGU REVIEW & APPROVAL]` |
| **Shift Lead & Integrator (Shift 2)** | Dzakwan Miftahussobirin | 20 Oktober 2026 | `[TERINTEGRASI & DISETUJUI]` |

---
*Dokumen ini merupakan bagian sah dari Deliverable QA & Sistem Kontrol Kualitas Proyek T-AIMS PT Teknolab Caraka Internasional.*
