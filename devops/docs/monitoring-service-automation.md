# PANDUAN TEKNIS & DOKUMENTASI SERVICE AUTOMATION: MONITORING ENGINE DAEMON
**Proyek:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Wafian (*DevOps, Server & Network Security Engineer - Shift 2*)  
**Milestone:** Roadmap Hari 11–12 (*Service Automation untuk Monitoring Engine*)  
**Dokumen Acuan:** Dokumen Kerja PKL Teknolab 30 Hari (Hal. 12, 13, 14, 15, 18, 19, 20)  
**Status Implementasi:** **DONE (Code + Configuration + Testing + Documentation)**

---

## 1. Ringkasan Eksekutif & Tujuan Teknis

Service Automation untuk Monitoring Engine dirancang untuk menjamin ketersediaan tinggi (*high availability*), keandalan pemantauan 24/7, dan ketahanan sistem (*fault tolerance*) tanpa intervensi manual. Sesuai dengan **Baseline Teknis Halaman 13** dan **Aturan Status Halaman 14** Dokumen PKL Teknolab:
1. Status perangkat tidak boleh ditentukan hanya berdasarkan representasi visual, melainkan berdasarkan aturan teknis baku, batasan threshold, mekanisme retry minimal 3x, dan verifikasi timestamp *Last Seen*.
2. Service monitoring harus berjalan secara otonom saat sistem menyala (*boot startup*), tahan terhadap gangguan crash mendadak (*self-healing watchdog*), dan terintegrasi dengan basis data terpusat serta backend API resmi.

```mermaid
flowchart TD
    subgraph Watchdog_Automation["Sistem Otomasi & Self-Healing Watchdog"]
        CRON["Crontab (Setiap 2 Menit)"] -->|Trigger| WD["Watchdog Controller"]
        SYSTEMD["Systemd Unit (Restart=always)"] -->|Supervisi PID| DAEMON["Monitoring Engine Daemon"]
        WD -->|Cek PID & Status| DAEMON
        WD -.->|Jika Crash/Mati| RES["Auto-Recovery (Start Ulang)"]
        RES -.-> DAEMON
    end

    subgraph Inspection_Engine["Multi-Protocol Inspection (Hal. 13)"]
        DAEMON -->|1. ICMP Ping (Retry 3x)| NET_DEV["Router, Switch, CCTV, PC"]
        DAEMON -->|2. Ping + TCP Port 3000/3307| SRV_DEV["Server Utama (SRV-01)"]
        DAEMON -->|3. Heartbeat & Ping| IOT_DEV["ESP32 & Raspberry Pi"]
    end

    subgraph Centralized_Data["Sinkronisasi & Logging Terpusat"]
        DAEMON -->|CSV Local Append| CSV_FILE["network-monitoring/monitoring_logs.csv"]
        DAEMON -->|Text Log Stream| SYS_LOG["logs/monitoring.log"]
        DAEMON -->|POST /api/monitoring/ping (X-API-Key)| BACKEND["T-AIMS Backend API (Port 3000)"]
        BACKEND -->|Insert Query| DB[("MySQL Table: monitoring_logs")]
    end
```

---

## 2. Pemenuhan Standar Baseline Teknis (Hal. 13 & 14)

### A. Matriks Metode Monitoring per Perangkat (Hal. 13)
Sesuai arahan teknis dokumen kerja PKL, engine monitoring mengawasi 15 aset multi-site resmi dengan protokol terspesifikasi:

| Kode Aset | Nama Aset Terdaftar | Lokasi Fisik | IP Address | Metode Inspeksi | Aturan Teknis |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **SRV-01** | Server Utama | House Server | `192.168.3.15` | **Ping + TCP Port** | ICMP 3x + TCP Port 3000 (API) & 3307 (DB) |
| **RTR-01** | Router Head Office | Head Office | `192.168.1.1` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **RTR-02** | Router 2 Marketing | Marketing Office | `192.168.0.1` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **RTR-03** | Router 1 Marketing | Marketing Office | `192.168.1.1` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **MKRT-01** | Mikrotik Marketing | Marketing Office | `192.168.1.2` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **MKRT-02** | Mikrotik Server | House Server | `192.168.3.14` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **SWM-01** | Switch Manageable | House Server | `192.168.3.17` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **CCTV-01** | CCTV Head Office | Head Office | `192.168.1.39` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **CCTV-02** | CCTV Marketing | Marketing Office | `192.168.1.3` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **PC-01** | PC Head Office 01 | Head Office | `192.168.1.2` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **PC-02** | PC Head Office 02 | Head Office | `192.168.1.7` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **SMTV-01** | Smart TV Head Office | Head Office | `192.168.1.10` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |
| **ESP-01** | ESP32 Head Office | Head Office | `192.168.1.11` | **Heartbeat** | Heartbeat telemetri + ICMP fallback |
| **RPI-01** | Raspberry Pi HO | Head Office | `192.168.1.12` | **Heartbeat** | Heartbeat telemetri + ICMP fallback |
| **RPI-02** | Raspberry Pi Server | House Server | `192.168.3.16` | **Ping** | ICMP adaptif 3x retry (Threshold 1.5s) |

### B. Aturan Threshold, Retry, dan Penentuan Status (Hal. 14)
* **Threshold Percobaan:** Minimal **3 kali percobaan** (`RETRY_COUNT=3`) dengan jeda inter-ping 0.5 detik untuk memitigasi alarm palsu (*false positive*) akibat fluktuasi paket jaringan sementara.
* **Status ONLINE:** Perangkat memberikan respons ICMP atau TCP yang valid dalam batas waktu $\le 1.5$ detik.
* **Status WARNING:** Perangkat merespons ICMP ping namun salah satu port layanan krusial tertutup (contoh: host server hidup namun service port mati).
* **Status OFFLINE:** Perangkat gagal merespons seluruh 3 kali percobaan berturut-turut.
* **Integritas Last Seen:** Setiap siklus mengirimkan timestamp ISO presisi tinggi yang secara langsung memperbarui kolom `last_seen` pada tabel `assets` di database `taims_db`.

---

## 3. Komponen Layanan & Berkas Konfigurasi

### A. Core Engine Daemon: [`network-monitoring/monitoring_engine.py`](file:///mnt/d/T-AIMS/network-monitoring/monitoring_engine.py)
* Dijalankan menggunakan Python 3 unbuffered mode (`python3 -u`).
* Menangani sinyal kernel `SIGTERM` dan `SIGINT` secara aman (*graceful termination*).
* Menulis dan menghapus file penanda PID secara dinamis di `logs/monitoring_engine.pid`.
* Melakukan logging ganda: stream konsol/file `logs/monitoring.log` dan audit CSV di `network-monitoring/monitoring_logs.csv`.
* Mengirim payload telemetri standar ke backend:
  ```json
  {
    "asset_id": 15,
    "status": "online",
    "response_time_ms": 18,
    "details": "ICMP Ping OK (18.13ms, coba 1/3); Port Aktif: 3000/TCP:0.8ms",
    "check_time": "2026-10-23 16:46:21"
  }
  ```

### B. Service CLI Controller: [`devops/scripts/manage_monitoring_service.sh`](file:///mnt/d/T-AIMS/devops/scripts/manage_monitoring_service.sh)
Skrip manajemen operasional lengkap dengan 9 perintah baku:
* `start` : Menjalankan daemon di latar belakang menggunakan `setsid` dan pencatatan PID.
* `stop` : Menghentikan proses secara bertahap (`SIGTERM` $\rightarrow$ jeda 5s $\rightarrow$ `SIGKILL` jika menggantung).
* `restart` : Melakukan siklus penghentian dan penyalaan ulang.
* `status` : Menampilkan informasi status PID, penggunaan CPU %, Memory %, uptime, konektivitas backend healthcheck, dan 5 log terkini.
* `watchdog` : Pengecekan otonom kesehatan proses. Jika proses mati, otomatis menghidupkan kembali dan mencatat insiden ke `logs/watchdog.log`.
* `install-service` : Mendaftarkan dan mengaktifkan unit systemd (`taims-monitoring.service`).
* `install-cron` : Mendaftarkan jadwal watchdog crontab (`*/2 * * * *`) dan merapikan path backup database.
* `test` : Menjalankan uji validasi otomatis siklus hidup, kegagalan crash mendadak, dan auto-recovery.
* `logs` : Melakukan live stream log terpusat (`tail -f`).

### C. Systemd Unit Specification: [`devops/scripts/taims-monitoring.service`](file:///mnt/d/T-AIMS/devops/scripts/taims-monitoring.service)
```ini
[Unit]
Description=T-AIMS Multi-Site Network Monitoring Engine Daemon
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
User=dragon-wafian
WorkingDirectory=/mnt/d/T-AIMS/network-monitoring
Environment="BACKEND_URL=http://127.0.0.1:3000/api"
Environment="DEVICE_API_KEY=taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1"
Environment="MONITORING_INTERVAL=15"
Environment="RETRY_COUNT=3"
ExecStart=/usr/bin/python3 -u /mnt/d/T-AIMS/network-monitoring/monitoring_engine.py
Restart=always
RestartSec=5
StandardOutput=append:/mnt/d/T-AIMS/logs/monitoring.log
StandardError=append:/mnt/d/T-AIMS/logs/monitoring_error.log

[Install]
WantedBy=multi-user.target
```

---

## 4. Hasil Pengujian & Bukti Validasi Sistem (DoD Hal. 15 & 18)

Sesuai klausul **Definition of Done (DoD)** Teknolab:
> *"Task hanya boleh berstatus DONE jika Code/Configuration + Testing + Documentation telah selesai dan dapat dibuktikan."*

Pengujian menyeluruh telah dieksekusi melalui `manage_monitoring_service.sh test` dengan hasil **100% PASS**:

```text
==========================================================
  PENGUJIAN VALIDASI SERVICE AUTOMATION (DoD Hal. 15 & 18)
==========================================================
--> [TEST 1/5] Memastikan layanan berjalan awal...
[*] Memulai T-AIMS Monitoring Engine Daemon...
[✓] Daemon berhasil dijalankan! (PID: 80775)
    Log terpusat : /mnt/d/T-AIMS/logs/monitoring.log
    File PID     : /mnt/d/T-AIMS/logs/monitoring_engine.pid

--> [TEST 2/5] Memeriksa status dan kesehatan API...
  Status Layanan  : [ AKTIF / RUNNING ]
  Process ID (PID): 80775
  CPU Usage       : 16.8% | Memory Usage: 0.5%
  Endpoint Health : [ ONLINE ] http://127.0.0.1:3000/api/monitoring/health
  Respon Backend  : {"success":true,"status":"healthy","db_status":"connected"}

--> [TEST 3/5] Simulasi Kegagalan / Crash Mendadak (kill -9)...
    Mematikan proses secara paksa (PID 80775)...

--> [TEST 4/5] Menguji Reaktivasi Mandiri via Auto-Healing Watchdog...
[!] [WATCHDOG] Daemon terdeteksi tidak aktif. Memulihkan layanan secara otomatis...
[✓] [WATCHDOG] Layanan pulih dan berjalan kembali dengan PID: 80856.
[PASS] Watchdog BERHASIL memulihkan proses mati! (PID Baru: 80856)

--> [TEST 5/5] Verifikasi Ingesti Data Telemetri & Log...
[PASS] Telemetri berhasil sinkronisasi ke MySQL & API Backend.
==========================================================
  SELURUH PENGUJIAN OTOMASI SERVICE SELESAI DENGAN SUKSES!
==========================================================
```

### Bukti Ingesti Basis Data Terverifikasi (`monitoring_logs`):
```text
mysql> SELECT log_id, asset_id, check_time, status, method, response_time_ms, details FROM monitoring_logs ORDER BY log_id DESC LIMIT 5;
+--------+----------+---------------------+---------+--------+------------------+------------------------------------+
| log_id | asset_id | check_time          | status  | method | response_time_ms | details                            |
+--------+----------+---------------------+---------+--------+------------------+------------------------------------+
|  26334 |       14 | 2026-10-23 16:46:21 | offline | Ping   |                0 | "ICMP Ping RTO (gagal 3x)"         |
|  26333 |       13 | 2026-10-23 16:46:21 | online  | Ping   |               18 | "ICMP Ping OK (18.13ms, coba 1/3)" |
|  26332 |        5 | 2026-10-23 16:46:21 | online  | Ping   |               21 | "ICMP Ping OK (20.53ms, coba 1/3)" |
|  26331 |        4 | 2026-10-23 16:46:21 | online  | Ping   |               11 | "ICMP Ping OK (11.26ms, coba 1/3)" |
|  26330 |        2 | 2026-10-23 16:46:21 | offline | Ping   |                0 | "ICMP Ping RTO (gagal 3x)"         |
+--------+----------+---------------------+---------+--------+------------------+------------------------------------+
```

---

## 5. Prosedur Operasional & Pemeliharaan Rutin

### Memeriksa Status Layanan
```bash
bash devops/scripts/manage_monitoring_service.sh status
```

### Memantau Log Live Streaming
```bash
bash devops/scripts/manage_monitoring_service.sh logs
```

### Memulai Ulang Service Secara Manual
```bash
bash devops/scripts/manage_monitoring_service.sh restart
```

### Memeriksa Rekaman Audit Pemulihan Watchdog
```bash
tail -n 20 logs/watchdog.log
```

---

## 6. Integrasi dengan Skrip Deployment CloudPanel

Langkah Service Automation telah disematkan secara baku pada tahapan nomor 9 di [`devops/scripts/deploy-to-cloudpanel.sh`](file:///mnt/d/T-AIMS/devops/scripts/deploy-to-cloudpanel.sh):
1. Menginstal dependensi runtime `python3-requests` dan `python3-pip`.
2. Menyalin unit file `taims-monitoring.service` ke `/etc/systemd/system/`.
3. Mengganti path direktori dan user runtime secara otomatis sesuai environment CloudPanel.
4. Mengeksekusi `systemctl daemon-reload && systemctl enable --now taims-monitoring.service`.
5. Mendaftarkan auto-healing watchdog cron pada crontab server VPS CloudPanel.
