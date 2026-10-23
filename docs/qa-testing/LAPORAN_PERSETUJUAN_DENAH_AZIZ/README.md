# 🏢 T-AIMS: Laporan Resmi Persetujuan Modul Denah Arsitektural 3 Lokasi

[![Status: Approved](https://img.shields.io/badge/Status-APPROVED%20%E2%9C%94-10B981?style=for-the-badge)](README.md)
[![Design: Ahmad Aziz](https://img.shields.io/badge/Designer-Ahmad%20Aziz%20(Shift%202)-38BDF8?style=for-the-badge)](README.md)
[![Lead: Dzakwan](https://img.shields.io/badge/Architecture-Dzakwan%20M.-8B5CF6?style=for-the-badge)](README.md)
[![System: T--AIMS](https://img.shields.io/badge/System-T--AIMS%20v2.4-06B6D4?style=for-the-badge)](README.md)

---

## 📄 Ringkasan Dokumen Persetujuan (Approval Summary)

Dokumen ini merupakan **Laporan Resmi Persetujuan Desain Denah 3 Tempat** yang dirancang dan dikonfigurasi secara orisinal oleh **Ahmad Aziz** (*UI/UX & Data Visualization Designer, Shift 2*) untuk sistem pemantauan telemetri infrastruktur **T-AIMS (Teknolab Asset & Infrastructure Monitoring System)**.

Berdasarkan hasil peninjauan akhir arsitektur sistem, seluruh rancangan denah visual 2D beserta matriks 15 titik koordinat perangkat yang diajukan oleh Ahmad Aziz dinyatakan **RESMI DISETUJUI (APPROVED)** untuk diintegrasikan ke dalam repositori utama dan basis kode frontend `index.html`.

---

## 👥 Tim Pengembang & Penanggung Jawab

* **UI/UX & Data Visualization Designer :** Ahmad Aziz (Shift 2) — *Perancang Denah & Alokasi Titik*
* **System Integration & Architecture Lead :** Dzakwan Miftahussobirin (Shift 2 Lead) — *Integrasi Telemetri & Backend*
* **Frontend Developer :** Dika Yoga Pratama (Shift 2) — *Implementasi Modul UI & SPA*

---

## 🗺️ Ruang Lingkup 3 Denah Lokasi Orisinal Buatan Aziz

### 1. Site 1: Head Office (HO) — Kantor Pusat & Data Center
* **Lokasi Fisik :** Jl. Cibodas No. 03, Blitar
* **Aset Gambar :** `DENAH/HO.jpeg`
* **Total Perangkat :** 7 Titik Pemantauan
* **Karakteristik Denah :** Tata letak koridor sentral dengan sayap workstation staf, ruang telemetri IoT, area resepsionis/foyer, dan gerbang luar carport.

### 2. Site 2: Marketing Office (MO) — Kantor Cabang & Lab
* **Lokasi Fisik :** Jl. Ciliwung No. 12, Blitar (Lab Kiki)
* **Aset Gambar :** `DENAH/MO.jpeg`
* **Total Perangkat :** 4 Titik Pemantauan
* **Karakteristik Denah :** Ruang kerja modern dengan konsol routing multi-hop, gerbang MikroTik cabang, dan kamera pengawas pintu masuk.

### 3. Site 3: House of Server (HoS) — Fasilitas Dedicated Peladen
* **Lokasi Fisik :** Sentral Server Peladen T-AIMS, Blitar
* **Aset Gambar :** `DENAH/HoS.jpeg`
* **Total Perangkat :** 4 Titik Pemantauan
* **Karakteristik Denah :** Fasilitas ruang server inti dengan rak kabinet sentral bertingkat (Slot A - D) untuk hosting database MySQL, peladen analitik, dan switch backbone.

---

## 📊 Matriks Resmi 15 Koordinat Denah Buatan Ahmad Aziz

Berikut adalah daftar **15 titik koordinat paten orisinal** buatan Ahmad Aziz yang telah disahkan:

| No | Lokasi | Kode Aset | Nama Perangkat | Nilai Koordinat CSS (Aziz) | Alokasi Penempatan Ruangan |
|:--:|:------:|:---------:|:---------------|:---------------------------|:---------------------------|
| 1 | **HO** | `PC-01` | Workstation Staf | `style="left: 71.0%; top: 54.0%;"` | Ruang Staf 3.1 |
| 2 | **HO** | `PC-02` | Workstation Staf | `style="left: 54.0%; top: 50.0%;"` | Ruang Staf 3.4 |
| 3 | **HO** | `ESP-01` | Sensor IoT Suhu | `style="left: 42.0%; top: 38.7%;"` | Sensor Dinding Kiri Ruang 4 |
| 4 | **HO** | `RPI-01` | Resepsionis Foyer | `style="left: 63.0%; top: 65.0%;"` | Area Foyer / Resepsionis |
| 5 | **HO** | `RTR-01` | Gateway Koridor | `style="left: 66.0%; top: 40.7%;"` | Gateway Lorong Tengah |
| 6 | **HO** | `SMTV-01` | Display Smart TV | `style="left: 55.5%; top: 56.0%;"` | Display TV Sayap Kanan |
| 7 | **HO** | `CCTV-01` | Kamera Pengawas | `style="left: 49.5%; top: 69.5%;"` | Pilar Gerbang Carport |
| 8 | **MO** | `MKRT-01` | MikroTik RB750 | `style="left: 82.0%; top: 20.0%;"` | Pojok Kanan Atas Ruangan |
| 9 | **MO** | `RTR-03` | Subnet Router | `style="left: 82.0%; top: 29.0%;"` | Sejajar di Bawah MKRT-01 |
| 10 | **MO** | `RTR-02` | Gateway Utama | `style="left: 82.0%; top: 38.0%;"` | Sejajar di Bawah RTR-03 |
| 11 | **MO** | `CCTV-02` | Kamera Pengawas | `style="left: 45.0%; top: 73.0%;"` | Pintu Masuk Kiri Bawah |
| 12 | **HoS** | `SWM-01` | Switch Backbone | `style="left: 66.0%; top: 45.0%;"` | Switch Backbone (Rak B) |
| 13 | **HoS** | `RPI-02` | Server Auxiliary | `style="left: 67.0%; top: 53.0%;"` | Server Auxiliary (Rak D) |
| 14 | **HoS** | `MKRT-02` | MikroTik Core | `style="left: 71.0%; top: 60.5%;"` | MikroTik Server (Rak C) |
| 15 | **HoS** | `SRV-01` | Server Utama | `style="left: 77.0%; top: 68.0%;"` | Server Utama (Rak A) |

---

## 🎯 Poin-Poin Persetujuan Desain (Design Approval Rationale)

1. **Integritas Konseptual UI/UX :**  
   Tata letak 15 titik yang dirumuskan oleh Ahmad Aziz sepenuhnya mencerminkan alur kerja operasional tim Teknolab, membedakan secara visual antara zona staf, zona sirkulasi jaringan, dan zona pengamanan perimeter.
2. **Kesesuaian dengan Modul 3D Digital Twin :**  
   Penempatan titik pada denah 2D ini konsisten dengan arsitektur data binding telemetri MQTT dan visualisasi 3D pada modul peladen `floorplan3d.js`.
3. **Standarisasi Aset :**  
   Penggunaan berkas denah `HO.jpeg`, `MO.jpeg`, dan `HoS.jpeg` disahkan sebagai blueprint tata letak standar sistem monitoring T-AIMS.

---

## 🚀 Panduan Commit & Upload ke GitHub

Folder ini sudah siap untuk di-commit dan di-push ke repositori GitHub:

```bash
# 1. Masuk ke direktori repositori
cd /path/to/repository

# 2. Tambahkan berkas laporan
git add LAPORAN_GITHUB_PERSETUJUAN_DENAH_AZIZ/

# 3. Buat commit resmi
git commit -m "docs: tambahkan laporan resmi persetujuan denah 3 lokasi buatan aziz"

# 4. Push ke remote repository
git push origin main
```

---

*Disahkan pada tanggal 24 Oktober 2026 oleh Tim Arsitektur & Pengembang Sistem T-AIMS.*
