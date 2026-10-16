# Panduan & Pengelolaan Log Layanan (*Service Log Guide*)
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer*)  
**Pembaruan Terakhir:** 16 Oktober 2026 (Shift 2)  
**Kepatuhan:** Output Wajib 5 Halaman 12 PDF Teknolab  

---

## 1. Struktur Direktori Log Terpusat
Untuk memudahkan pemantauan, analisis insiden (*root cause analysis*), dan audit, seluruh log sistem dikumpulkan secara terpusat pada struktur direktori berikut:

```text
/mnt/d/xampp/htdocs/T-AIMS/
├── logs/
│   ├── backup.log                     # Log riwayat eksekusi cron pencadangan database
│   ├── database/
│   │   └── mysql_YYYY-MM-DD.log       # Log aktivitas dan peringatan MySQL
│   ├── mqtt/
│   │   └── mosquitto_YYYY-MM-DD.log   # Log koneksi, publish, dan LWT broker Mosquitto
│   ├── backend/
│   │   └── backend_YYYY-MM-DD.log     # Log REST API Express, status HTTP, dan error
│   └── systemd/
│       └── monitoring_YYYY-MM-DD.log  # Log daemon latar belakang taims-monitoring.service
└── devops/
    └── logs/
        ├── collect-log.sh             # Skrip otomatisasi pengumpulan & rotasi log
        └── failure_simulation_*.log   # Bukti hasil uji ketahanan 6 skenario kegagalan
```

---

## 2. Mekanisme Pengumpulan Log Otomatis (*Log Collection & Pruning*)
Skrip otomatisasi pengumpulan log disediakan di [`devops/logs/collect-log.sh`](file:///mnt/d/xampp/htdocs/T-AIMS/devops/logs/collect-log.sh):
1. **Dukungan Ganda (Docker & Host):** Mengambil log langsung dari kontainer Docker aktif (`docker logs --tail 200`) atau berkas log host.
2. **Systemd Journal Logging:** Mengarsipkan riwayat service pengawas latar belakang melalui `journalctl`.
3. **Kebijakan Retensi 7 Hari:** Secara otomatis membersihkan berkas log yang berusia lebih dari 7 hari guna menjaga efisiensi ruang penyimpanan server.

### Cara Menjalankan Koleksi Log Manual:
```bash
bash devops/logs/collect-log.sh
```

---

## 3. Perintah Analisis Log Real-Time (Live Troubleshooting)
Saat melakukan pemecahan masalah gangguan di server:

* **Melihat Log Service Daemon Monitoring:**
  ```bash
  sudo journalctl -u taims-monitoring.service -f
  ```
* **Melihat Log Kontainer Backend:**
  ```bash
  docker logs -f taims-backend --tail 100
  ```
* **Melihat Log Broker Mosquitto (Koneksi Sensor IoT):**
  ```bash
  docker logs -f taims-mosquitto --tail 100
  ```
* **Melihat Log Pencadangan Basis Data:**
  ```bash
  tail -f logs/backup.log
  ```
