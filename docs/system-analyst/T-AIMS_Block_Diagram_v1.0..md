**LAPORAN PERANCANGAN BLOCK DIAGRAM SISTEM\**
\
**Sistem Pemantauan Aset dan Infrastruktur (T-AIMS)\
Disusun Oleh: Damar Munajad** (Project Coordinator & System Analyst )\
\
BAB 1: DOKUMENTASI BLOCK DIAGRAM SISTEM T-AIMS

## 1.1 Gambaran Umum

Sistem T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
dirancang menggunakan arsitektur modular yang memisahkan antara akuisisi
data perangkat fisik (Asset Inputs), pengumpulan dan pemrosesan ambang
batas (Integrated Monitoring Engine), pemrosesan logika backend dan
basis data (Backend Core), antarmuka pengguna (User Interface), serta
alur kerja alert otomatis (Alert & Automation Flow).\
Rancangan Block Diagram ini berfungsi memetakan aliran data
antar-komponen secara mendatar (horizontal flow) serta menegaskan
protokol komunikasi yang digunakan pada setiap titik integrasi.

## 1.2 Visualisasi Block Diagram Sistem

*Gambar 1.1 Diagram Blok Sistem T-AIMS (Final v1.0 Sync)\*
![](./gambar/media/image1.png){width="6.7in"
height="4.464583333333334in"}

## 1.3 Penjelasan Rinci Komponen Blok Sistem

### 1. Blok 1 --- ASSET INPUTS (via Wi-Fi/LAN)

Merupakan kumpulan seluruh objek fisik dan layanan infrastruktur kantor
yang dipantau tingkat ketersediaan (availability) dan kesehatannya.

Komponen fisik meliputi:

- ESP32 (IoT Node): Mikrokontroler berbasis IoT untuk pemantauan
  lingkungan/panel.

- Raspberry Pi: Node komputer lokal pengumpul data sensor.

- Server T-AIMS: Server utama aplikasi yang dipantau ketersediaan
  layanannya.

- Core Router & Network Switches: Perangkat jaringan utama
  (MikroTik/Cisco) pemandu lalu lintas data.

- CCTV: Kamera IP pengawas area operasional.

- PC (Workstation): Komputer kerja staf/operasional.

- TV (Smart TV): Layar informasi operasional yang terhubung ke jaringan.

### 2. Blok 2 --- INTEGRATED MONITORING & COLLECTOR ENGINE

Merupakan lapisan pengumpul dan pemroses awal status perangkat:

- MQTT Broker & Heartbeat Receiver: Menerima payload heartbeat secara
  asynchronous dari node IoT (ESP32 & Raspberry Pi).

- Multi-Protocol Polling: Layanan pemeriksaan rutin (polling) berbasis
  protokol ICMP Ping, HTTP, TCP, dan SNMP.

- Threshold & Status Processor: Menganalisis parameter Latency, Retry
  Threshold, dan Last Seen untuk mengklasifikasikan kondisi perangkat
  menjadi empat status utama:

<!-- -->

- ONLINE: Perangkat merespons normal tanpa kendala.

- WARNING: Latensi tinggi (\> 500 ms) atau terjadi packet loss parsial
  (1--49%).

- OFFLINE: Retry 3 kali gagal berturut-turut atau timeout last_seen \>
  120 detik.

- UNKNOWN: Status perangkat tidak teridentifikasi.

### 3. Blok 3 --- BACKEND & STORAGE CORE

Merupakan pusat pemrosesan logika bisnis, autentikasi, dan penyimpanan
data terstruktur:

- API Engine (v0.7 FINAL): Layanan REST API berbasis Node.js/Express
  yang menangani autentikasi JWT serta menerapkan Soft Delete Pattern
  (deleted_at, is_active) pada entitas aset.

- Database Server: Basis data relasional yang mengelola delapan tabel
  utama:

1.  assets (data aset dan status soft delete)

2.  monitoring_logs (log riwayat polling & heartbeat)

3.  incidents (riwayat gangguan/downtime)

4.  locations (peta denah & lokasi fisik aset)

5.  users (manajemen pengguna & role access)

6.  notifications (log notifikasi terkirim)

7.  maintenance (jadwal pemeliharaan aset)

8.  audit_trail (jejak aktivitas pengguna)

### 4. Blok 4 --- USER INTERFACE (WEB DASHBOARD)

Antarmuka web yang diakses langsung oleh USER / ADMIN melalui komunikasi
data REST API (JSON Data):

- Executive Dashboard: Ringkasan metrik performa sistem dan uptime aset.

- Real-Time Monitoring UI: Papan pantau status kesehatan perangkat
  secara live.

- Location & Floorplan Map: Pemetaan lokasi fisik aset pada denah area.

- Export CSV/PDF Reporting: Modul pengunduhan rekapitulasi data dan
  laporan eksekutif.

### 5. Blok 5 --- ALUR ALERT & OTOMATISASI (ALERT & AUTOMATION FLOW)

Mekanisme penanganan alersi otomatis saat terdeteksi status OFFLINE atau
WARNING:

- Incident Handler & Cooldown: Pencatatan insiden dan penerapan jeda
  waktu (cooldown) untuk mencegah spam notifikasi.

- Trigger Notification Workflow: Pemicuan alur pengiriman pesan
  peringatan.

- AI-Report Engine: Pengolahan data insiden berbasis n8n dan LLM
  Workflow untuk melakukan analisis akar masalah (Root Cause Analysis).

- Telegram/Email Notification Gateway: Media pengiriman notifikasi
  darurat secara real-time ke Telegram Bot dan Email tim teknis.

## 1.4 Matriks Protokol Komunikasi Antar-Komponen

  ----------------------------------------------------------------------------
  **Dari         **Menuju         **Protokol /         **Deskripsi Fungsi**
  Komponen**     Komponen**       Method**             
  -------------- ---------------- -------------------- -----------------------
  ESP32 &        MQTT Broker      MQTT Heartbeat       Pengiriman sinyal
  Raspberry Pi                                         keep-alive IoT

  Server T-AIMS  Multi-Protocol   HTTP Health Check    Verifikasi ketersediaan
                 Polling                               service web

  Core Router &  Multi-Protocol   SNMP Polling         Pengambilan metrik
  Switches       Polling                               perangkat jaringan

  CCTV           Multi-Protocol   Ping + HTTP          Verifikasi jaringan
                 Polling                               fisik & port 80

  PC & Smart TV  Multi-Protocol   Ping ICMP            Uji latensi &
                 Polling                               ketersediaan IP

  MQTT Broker    API Engine       POST /api/heartbeat  Meneruskan heartbeat ke
                                                       backend

  Threshold      Database Server  POST                 Menyimpan log & status
  Processor                       /api/monitoring/\*   terkini

  API Engine     Web Dashboard    REST API / JSON Data Penyajian data ke
                                                       antarmuka pengguna

  API Engine     Alur Alersi &    REST API / JSON Data Pemicuan alur kerja
                 Otomatisasi                           insiden/notifikasi
  ----------------------------------------------------------------------------
