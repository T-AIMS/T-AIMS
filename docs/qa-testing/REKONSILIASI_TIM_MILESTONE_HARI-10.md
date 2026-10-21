# BERITA ACARA REKONSILIASI TIM — MILESTONE HARI KE-10
## Teknolab Asset & Infrastructure Monitoring System (T-AIMS)

**Nomor Dokumen** : T-AIMS/QA/RECON-M10/2026/001  
**Tanggal Pelaksanaan**: Rabu, 21 Oktober 2026  
**Waktu Sesi**      : 17.00 - 18.00 WIB (Transisi Handover Shift 1 ke Shift 2)  
**Notulis (QA)**    : Reza Tri Wardana (Lead QA & Documentation Engineer)  
**Pimpinan Sidang** : Damar Munajad (Coordinator Shift 1) & Dzakwan Miftahussobirin (Lead Shift 2)  
**Status Evaluasi** : ✅ **REKONSILIASI SELESAI — SINKRON 100% (BASE MVP DISAHKAN)**

---

## 1. LATAR BELAKANG & TUJUAN REKONSILIASI

Berdasarkan *Dokumen Kerja Praktik Kerja Lapangan T-AIMS PT Teknolab Caraka Internasional* (Halaman 6 & 14):
> *"Prinsip Utama: Shift 1 dan Shift 2 tidak membuat project yang berbeda. Seluruh peserta mengerjakan SATU SISTEM T-AIMS dengan satu repository, satu database, satu backend, satu dashboard, dan satu project board."*

Rekonsiliasi Hari ke-10 bertujuan untuk:
1. Menyelaraskan hasil kerja 5 anggota Shift 1 dan 6 anggota Shift 2 menyambut **Milestone Hari ke-10 (Rilis Bug List MVP Awal)**.
2. Memverifikasi kelayakan integrasi teknis antara Backend API (58 endpoint port 3000), Database MySQL (`taims_db`), Frontend Dashboard SPA (port 3001), dan Engine Pemantau.
3. Mengesahkan penutupan (*closure*) 10 bug awal (BUG-001 s/d BUG-010) serta menetapkan alokasi penanganan temuan audit lanjutan (BUG-011 s/d BUG-018) pada Backlog Sprint 2.

---

## 2. MATRIKS REKONSILIASI 11 PESERTA PKL

| No | Nama Personel | Shift & Peran Utama | Deliverable yang Diverifikasi | Status Keselarasan QA | Catatan Tindak Lanjut |
|:---:|---|---|---|:---:|---|
| **1** | **Damar Munajad** | Shift 1 — Project Coordinator & System Analyst | Scope Requirement, System Architecture, & Integration Checklist | ✅ **SINKRON** | Dokumen checklist integrasi 6 layer disetujui bersama. |
| **2** | **Ahmad Reza Fahmi** | Shift 1 — Backend & API Developer | 58 REST API Endpoints, JWT Bearer Auth, Express Service | ✅ **SINKRON** | Response time rata-rata 15–25ms (< 2000ms), konsistensi 100%. |
| **3** | **Faida Trisma Amelia** | Shift 1 — Database & Asset Management | 7 Tabel Utama MySQL `taims_db`, 17 Aset Terdaftar | ✅ **SINKRON** | Skema relasi valid; perlu perbaikan duplikasi IP subnet. |
| **4** | **Ilvina Muvarika** | Shift 1 — IoT & Device Integration | Mekanisme Heartbeat ESP32/RPi, MQTT Port 1883 | ✅ **SINKRON** | Protokol heartbeat siap diuji beban pada Hari 13–14. |
| **5** | **Ananda Dwi Susanti** | Shift 1 — Network & Device Monitoring | Monitoring Engine Ping ICMP, TCP, HTTP Health Check | ✅ **SINKRON** | Log telemetri tersimpan presisi di tabel `monitoring_logs`. |
| **6** | **Dzakwan M.** | Shift 2 — Shift Lead & System Integration | Release Record, Integrasi Sistem, Bug Tracking Shift 2 | ✅ **SINKRON** | Menyetujui penutupan 10 bug awal MVP. |
| **7** | **Dika Yoga Pratama** | Shift 2 — Frontend Dashboard Developer | Dashboard SPA 9 Modul (`dashboard.html` / `index.html`) | ✅ **SINKRON** | Menerima daftar 7 action items perbaikan tampilan QA. |
| **8** | **Ahmad Aziz** | Shift 2 — UI/UX & Data Visualization | Cyber Dark Theme, Donut Chart, Layout SCADA Responsif | ✅ **SINKRON** | Standarisasi penamaan resmi lokasi "Marketing Office". |
| **9** | **Arik** | Shift 2 — Automation & Notification | Webhook n8n, Telegram Alert Bot, AI Assistant Diagnostic | ✅ **SINKRON** | Engine alert aktif; analitik AI siap masuk Sprint 3. |
| **10** | **Wafian** | Shift 2 — DevOps, Server & Security | XAMPP Web Server, Port Forwarding 3000/3001, Git Repo | ✅ **SINKRON** | Server lokal dan database berjalan stabil 0 downtime. |
| **11** | **Reza Tri Wardana** | Shift 2 — QA, Testing & Documentation | Master Test Cases (39 TC), Bug Reports, Bukti SS, Handover | ✅ **SINKRON** | Workbook Excel mencapai progress 92.3%, dokumen siap rilis. |

---

## 3. POIN KESEPAKATAN REKONSILIASI TEKNIS

1. **Pengesahan Status MVP Awal:**
   Sistem T-AIMS per Hari ke-10 resmi dinyatakan memenuhi kriteria **Minimum Viable Product (MVP)**. Seluruh fungsi autentikasi, registri aset, telemetri pemantauan, peta Leaflet GIS, dan manajemen pengguna telah terhubung secara end-to-end.
2. **Penutupan 10 Bug Pertama (BUG-001 s/d BUG-010):**
   Seluruh bug dinyatakan **CLOSED** dengan didukung 10 berkas screenshot valid di folder repositori QA.
3. **Penerimaan Temuan Audit Final Dashboard (BUG-011 s/d BUG-018):**
   Temuan inkonsistensi persentase SLA, duplikasi IP address, dan pemotongan teks tabel disepakati masuk ke dalam **Sprint 2 Backlog (Hari 11–20)** untuk diselesaikan oleh tim pengembang tanpa menunda serah terima dokumen Hari-10.
4. **Jadwal Kerja Lanjutan Hari ke-11:**
   Fokus dialihkan ke **Pengujian Dokumentasi Status Online/Offline dan Uji Beban Engine Monitoring** sesuai roadmap resmi.

---

## 4. LEMBAR TANDA TANGAN PENGESAHAN

| Pimpinan Shift 1 (Coordinator) | Pimpinan Shift 2 (Shift Lead) | Notulis & Verifikator (Lead QA) |
|:---:|:---:|:---:|
| **Damar Munajad** | **Dzakwan Miftahussobirin** | **Reza Tri Wardana** |
| `[DISETUJUI RESMI]` | `[DISETUJUI RESMI]` | `[DIVERIFIKASI & DIARSIPKAN]` |

---
*Dokumen ini merupakan Berita Acara Sah Pelaksanaan Milestone Hari ke-10 Pra-PKL T-AIMS PT Teknolab Caraka Internasional.*
