# T-AIMS Asset Registry

## 1. Informasi

- Nama proyek: T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)
- Sumber data: tabel `assets` pada database `taims_db`
- Jumlah aset berdasarkan database final: **15 aset** (Pembaruan resmi per 18 Oktober 2026 berdasarkan `ASSETS.docx`)
- Penanggung Jawab: Database & Asset Management Engineer (Faida) & DevOps (Wafian)

## 2. Tujuan

Asset Registry digunakan untuk mendokumentasikan daftar perangkat yang dikelola oleh sistem T-AIMS, termasuk identitas kode aset, alamat IP, MAC Address, lokasi, metode monitoring, dan informasi penanggung jawab operasional.

## 3. Sumber Data & Spesifikasi 15 Aset

Tabel berikut memuat 15 aset resmi T-AIMS lengkap dengan parameter jaringan, lokasi, dan metode pengawasan real-time:

| ID | Kode Aset | Nama Perangkat | Kategori | Alamat IP | MAC Address | Lokasi | Metode Monitoring |
|:---:|:---|:---|:---|:---|:---|:---|:---|
| 1 | `CCTV-01` | CCTV Head Office | CCTV | `192.168.1.1` | `00:0C:29:11:01:01` | Head Office | Ping |
| 2 | `CCTV-02` | CCTV Marketing | CCTV | `192.168.2.2` | `00:0C:29:11:01:02` | Marketing Office | Ping |
| 3 | `RTR-01` | Router Head Office | Router | `192.168.1.3` | `D4:CA:6D:11:22:01` | Head Office | Ping |
| 4 | `RTR-02` | Router Marketing 02 | Router | `192.168.2.4` | `D4:CA:6D:11:22:02` | Marketing Office | Ping |
| 5 | `RTR-03` | Router Marketing 03 | Router | `192.168.2.5` | `D4:CA:6D:11:22:03` | Marketing Office | Ping |
| 6 | `SMTV-01` | Smart TV Head Office | TV | `192.168.1.6` | `48:D7:05:AA:BB:01` | Head Office | Ping |
| 7 | `PC-01` | PC Head Office 01 | PC | `192.168.1.7` | `B4:2E:99:11:01:01` | Head Office | Ping |
| 8 | `PC-02` | PC Head Office 02 | PC | `192.168.1.8` | `B4:2E:99:11:01:02` | Head Office | Ping |
| 9 | `PC-03` | PC Head Office 03 | PC | `192.168.1.9` | `B4:2E:99:11:01:03` | Head Office | Ping |
| 10 | `PC-04` | PC Head Office 04 | PC | `192.168.1.10` | `B4:2E:99:11:01:04` | Head Office | Ping |
| 11 | `ESP-01` | ESP32 Head Office | IoT Node | `192.168.1.11` | `24:6F:28:AA:01:0B` | Head Office | Heartbeat (MQTT) |
| 12 | `RPI-01` | Raspberry Pi Head Office | IoT Node | `192.168.1.12` | `B8:27:EB:11:22:01` | Head Office | Ping |
| 13 | `MKRT-01` | Mikrotik Marketing | Router | `192.168.2.13` | `D4:CA:6D:33:44:01` | Marketing Office | Ping |
| 14 | `MKRT-02` | Mikrotik Server | Router | `192.168.3.14` | `D4:CA:6D:55:66:01` | House of Server | Ping |
| 15 | `SRV-01` | Server Utama | Server | `192.168.3.15` | `00:0C:29:DD:EE:01` | House of Server | Ping / HTTP |
| 16 | `RPI-02` | Raspberry Pi Server | IoT Node | `192.168.3.16` | `B8:27:EB:33:44:02` | House of Server | Ping |
| 17 | `SWM-01` | Switch Manageable | Switch Manageable | `192.168.3.17` | `14:D6:4D:55:66:01` | House of Server | Ping |

## 4. Cara Memeriksa Data

1. Buka phpMyAdmin / Terminal MariaDB.
2. Pastikan database `taims_db` aktif: `USE taims_db;`.
3. Jalankan query: `SELECT asset_id, asset_code, asset_name, category, ip_address, mac_address, current_status FROM assets;`.
4. Cocokkan data dengan file master `database/taims_db.sql`.

## 5. Catatan

- 15 aset di atas telah disinkronkan dengan skema database v1.1 dan file `database/seed.sql`.
- Kolom relasional `location_id` merujuk ke tabel `locations` (1 = Marketing Office, 2 = Head Office, 3 = House of Server).
- Kolom `offline_since` terintegrasi penuh untuk mendukung otomasi deteksi gangguan n8n dan notifikasi bot Telegram.
