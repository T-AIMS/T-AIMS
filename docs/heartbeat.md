# Spesifikasi & Implementasi IoT Heartbeat — T-AIMS

**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Ilvina Muvarika (*IoT & Device Integration Engineer — Shift 1*)  
**Integrasi Backend & Broker:** Ahmad Reza Fahmi (Backend) & Wafian (DevOps)  
**Dokumen Acuan:** Dokumen Kerja PKL PT Teknolab Caraka Internasional (Hal 8 & 13)

---

## 1. Konsep Dasar Heartbeat

Heartbeat adalah sinyal detak berkala yang dikirimkan oleh perangkat edge/IoT (ESP32, Raspberry Pi, dan simulator) ke server monitoring T-AIMS untuk membuktikan bahwa perangkat berada dalam status beroperasi (*alive / online*).

* **Interval Normal:** 30–60 detik per detak.
* **Protokol Utama:** MQTT (Message Queuing Telemetry Transport) via port `1883` (TCP).
* **Protokol Fallback:** HTTP REST API via endpoint `POST /api/heartbeat` (port `3000`).
* **Broker MQTT:** Eclipse Mosquitto dengan otentikasi akun `taims-broker`.

---

## 2. Struktur Payload Heartbeat

### Topik MQTT
```text
taims/heartbeat/{asset_code}
```
*Contoh:* `taims/heartbeat/ESP32-LAB-01`

### Skema Data JSON
```json
{
  "device_id": "ESP32-LAB-01",
  "status": "online",
  "uptime_seconds": 3600,
  "wifi_rssi": -65,
  "free_heap": 184320,
  "firmware_version": "v1.2.0",
  "timestamp": "2026-10-16T10:00:00Z"
}
```

---

## 3. Komponen Implementasi Perangkat

### A. Firmware ESP32 (`hardware-iot/esp32/src/main.cpp`)
* Berbasis C++ / PlatformIO framework Arduino.
* Menggunakan library `PubSubClient` untuk komunikasi MQTT dan `WiFi.h` untuk koneksi nirkabel.
* Menyimpan konfigurasi kredensial WiFi dan broker MQTT pada `config.h` (mengacu pada templat `config.h.example`).
* Mengaktifkan logika **Auto-Reconnect**: jika koneksi WiFi atau broker terputus, loop mikro akan mencoba rekoneksi setiap 5 detik tanpa merestart sistem secara paksa (*non-blocking delay*).

### B. Daemon Agent Raspberry Pi (`hardware-iot/raspi/heartbeat.py`)
* Berbasis Python 3 dengan library `paho-mqtt` dan `psutil`.
* Berjalan di background sistem operasi Raspberry Pi OS.
* Memantau metrik internal host (CPU Usage, Memory, Disk, Temperature SoC) dan mempublikasikannya secara berkala ke broker T-AIMS.

### C. Simulator Python Multi-Perangkat (`hardware-iot/simulator/simulate_esp32.py`)
* Menyimulasikan pengiriman telemetri detak jantung untuk 17 aset T-AIMS secara simultan.
* Digunakan untuk stress test dan pengujian pipeline backend tanpa ketergantungan perangkat keras fisik.

---

## 4. Aliran Pemrosesan Data di Server

1. Perangkat edge mengirim pesan ke topik `taims/heartbeat/{asset_code}`.
2. Service backend [`taims-backend/src/services/mqtt-handler.js`](file:///mnt/d/xampp/htdocs/T-AIMS/taims-backend/src/services/mqtt-handler.js) mendengarkan topik tersebut via wildcard `taims/heartbeat/#`.
3. Backend memvalidasi integritas payload dan memperbarui kolom `last_seen = NOW()`, `current_status = 'online'`, serta mengosongkan `offline_since = NULL` pada tabel `assets`.
4. Jika sebelumnya perangkat berstatus `offline`, sistem mencatat peristiwa pemulihan (*recovery event*) ke tabel `incidents` dan memicu notifikasi pemulihan n8n.
