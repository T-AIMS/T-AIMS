# BUG LIST MVP AWAL — T-AIMS (FINAL)
## Teknolab Asset & Infrastructure Monitoring System

**Nomor Dokumen** : T-AIMS/QA/BUG-MVP/2026/001  
**Versi**         : 1.0 (Final Milestone Hari ke-10)  
**Tanggal Rilis** : 21 Oktober 2026  
**PIC QA**        : Reza Tri Wardana (Lead QA & Documentation Engineer)  
**Shift Lead**    : Dzakwan Miftahussobirin (Shift Lead & System Integration)  
**Koordinator**   : Damar Munajad (Project Coordinator & System Analyst)  
**Status Rilis**  : ✅ **MILESTONE HARI 10 TERCAPAI (MVP BUG LIST RESMI DISAHKAN)**

---

## 1. RINGKASAN STATUS BUG MVP

Sesuai target **Roadmap PKL 30 Hari (Halaman 16)**:
> *"Hari 10: Bug list MVP awal siap"*

Seluruh bug kritis fungsional dan wireframe awal (BUG-001 s/d BUG-010) telah **100% DIVERIFIKASI & DITUTUP (CLOSED)** dengan bukti screenshot valid pada repositori QA. Sistem web dashboard dan backend API telah mencapai stabilitas minimum untuk operasional MVP. 

Audit menyeluruh pada tampilan final web dashboard (`dashboard.html` / `index.html`) menemukan **8 catatan perbaikan lanjutan (BUG-011 s/d BUG-018)** yang dialokasikan ke Backlog Sprint 2 (Hari 11–20) tanpa menghambat rilis MVP.

| Kategori Bug | Closed (MVP Awal) | Open / Backlog (Sprint 2) | Total |
|:---|:---:|:---:|:---:|
| **Kritis (Blocker / High)** | 4 | 2 | 6 |
| **Fungsional & Data (Medium)** | 3 | 3 | 6 |
| **Visual, Typography & UX (Low)** | 3 | 3 | 6 |
| **TOTAL** | **10 (100% Closed)** | **8 (Tercatat di Sprint 2)** | **18** |

---

## 2. REKAPITULASI 10 BUG AWAL MVP (STATUS: CLOSED & VERIFIED)

| ID Bug | Modul | Deskripsi Bug Awal | Severity | PIC Fix | Status | Bukti Screenshot |
|:---:|---|---|:---:|:---:|:---:|---|
| **BUG-001** | Header UI | Profil pengguna menumpuk (*overflow*) di layar tablet 768px | High | Dika | ✅ **CLOSED** | `evidence/screenshots/Hari-8/2026-10-20_Hari-8_wireframe_tablet-view-768p.png` |
| **BUG-002** | Endpoint User | Respon `/api/users/1` sempat mengembalikan status 500 | High | Reza Fahmi | ✅ **CLOSED** | `evidence/screenshots/Hari-6/2026-10-18_BUG-002_user-endpoint.png` |
| **BUG-003** | Auth Session | Sesi kedaluwarsa tidak melakukan auto-redirect ke portal login | Medium | Reza Fahmi | ✅ **CLOSED** | `evidence/screenshots/Hari-7/2026-10-19_Hari-7_modul_portal-login.png` |
| **BUG-004** | Table Filter | Filter kategori perangkat tidak me-reset pagination ke halaman 1 | Medium | Dika | ✅ **CLOSED** | `evidence/screenshots/Hari-8/2026-10-20_Hari-8_wireframe_donut-chart-clean.png` |
| **BUG-005** | Export Module | Export file corrupt saat tabel kosong | High | Dika | ✅ **CLOSED** | `evidence/screenshots/Hari-6/2026-10-18_BUG-005_zip-corrupt.png` |
| **BUG-006** | Dashboard Card | Indikator kartu status warning dan offline tertukar warna | Medium | Aziz | ✅ **CLOSED** | `evidence/screenshots/Hari-8/2026-10-20_Hari-8_wireframe_desktop-dashboard-1080p.png` |
| **BUG-007** | Map Location | Leaflet map blank saat pergantian tab SPA | High | Dika | ✅ **CLOSED** | `evidence/screenshots/Hari-9/2026-10-20_Hari-9_dashboard_location-gis.png` |
| **BUG-008** | Monitoring Log | Log timestamp server tersimpan dalam UTC tanpa konversi ke WIB | Medium | Faida | ✅ **CLOSED** | `evidence/screenshots/Hari-9/2026-10-20_Hari-9_dashboard_monitoring-live.png` |
| **BUG-009** | User Management| Dropdown hak akses tidak menonaktifkan tombol simpan bagi tamu | Medium | Dika | ✅ **CLOSED** | `evidence/screenshots/Hari-9/2026-10-20_Hari-9_dashboard_users-management.png` |
| **BUG-010** | Settings Tab | Input form ambang batas menerima angka minus atau nol | Low | Dika | ✅ **CLOSED** | `evidence/screenshots/Hari-8/2026-10-20_Hari-8_wireframe_settings-permanen.png` |

---

## 3. HASIL VERIFIKASI PERBAIKAN BUG AUDIT DASHBOARD FINAL (BUILD DIKA YOGA)

Perbaikan telah diintegrasikan langsung oleh Dika Yoga Pratama pada build final (`c:\Users\ThinkPad\Documents\Website  T-AIMS\dashboard.html`) dan diverifikasi ulang secara otomatis oleh Reza Tri Wardana (Lead QA) pada 21 Oktober 2026 pukul 20.35 WIB:

| ID Bug | Modul | Deskripsi Temuan Awal | PIC | Status Verifikasi | Catatan Resolusi QA |
|:---:|---|---|:---:|:---:|---|
| **BUG-011** | Laporan | Inkonsistensi nilai SLA kartu AI vs Ringkasan 30 Hari | Dika | ✅ **VERIFIED / CLOSED** | SLA 30 hari tersinkronisasi 99.1% (*Target Achieved*), kartu AI menampilkan Real-Time Health 0.0% (*Standby*). |
| **BUG-012** | Perangkat | Duplikasi IP (192.168.1.1 & 192.168.1.2) | Dika | ✅ **VERIFIED / CLOSED** | Seluruh 15 unit aset memiliki IP unik tanpa bentrok subnet (RTR-03: `192.168.2.3`, MKRT-01: `192.168.2.13`). |
| **BUG-013** | Dashboard | Selisih jumlah unit donut chart vs legenda (15 vs 12) | Dika | ✅ **VERIFIED / CLOSED** | Agregasi diperbaiki: tepat 15 unit terdistribusi ke seluruh 8 kategori aset dengan proporsi persentase presisi. |
| **BUG-014** | Dashboard | Text clipping pada kolom Last Seen ("Menunggu l") | Dika | ✅ **VERIFIED / CLOSED** | Diberi `min-width: 155px; white-space: nowrap;`, teks utuh `"Menunggu Koneksi Fisik"` terbaca sempurna. |
| **BUG-015** | Global UI | Toast menutupi kartu ke-4 pemeliharaan | Dika | ✅ **VERIFIED / CLOSED** | Ditambahkan `.main-content { padding-bottom: 75px !important; }`, kartu terbawah bebas dari tumpukan banner. |
| **BUG-016** | Dashboard | Lebar sparkline offline statis tidak mengikuti 100% | Dika | ✅ **VERIFIED / CLOSED** | Elemen diberi ID dan terhubung dinamis ke `offPct`: bar terisi 100% merah (*full dynamic width*). |
| **BUG-017** | Laporan | Penamaan lokasi informal ("Kost Kiki") | Dika | ✅ **VERIFIED / CLOSED** | Distandarisasi resmi menjadi `"Marketing Office (MO)"` pada seluruh ringkasan ketersediaan situs. |
| **BUG-018** | Pengguna | Kesalahan jam handover Shift 2 (`15.30 - 16.00`) | Dika | ✅ **VERIFIED / CLOSED** | Banner informasi tim diperbarui resmi menjadi `Handover: 00.30 - 01.00 WIB`. |

---

## 4. LEMBAR PENGESAHAN REKAPITULASI BUG MVP (100% RESOLVED)

| Peran | Nama Personel | Status Pengesahan |
|:---:|:---:|:---:|
| **Lead QA & Documentation** | Reza Tri Wardana | `[SELURUH 18 BUG TERVERIFIKASI TUNTAS 100%]` |
| **Shift Lead & Integrator** | Dzakwan Miftahussobirin | `[DISETUJUI SEBAGAI BASELINE RILIS FINAL MVP]` |
| **Frontend Engineer** | Dika Yoga Pratama | `[SELESAI DIPERBAIKI PADA BUILD FINAL]` |
| **Project Coordinator** | Damar Munajad | `[DITERIMA SEBAGAI MILESTONE HARI-10 COMPLETE]` |

---
*Dokumen ini merupakan Deliverable Resmi Milestone Hari ke-10 Proyek T-AIMS PT Teknolab Caraka Internasional.*
