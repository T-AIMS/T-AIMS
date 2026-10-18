# Laporan Hasil Pengujian IoT & Device Integration — T-AIMS

**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Ilvina Muvarika (*IoT & Device Integration Engineer — Shift 1*)  
**Lead Integrator:** Dzakwan (*Shift Lead & System Integration — Shift 2*)  
**Bukti Fisik/Screenshot:** Direktori [`hardware-iot/evidence/`](file:///mnt/d/xampp/htdocs/T-AIMS/hardware-iot/evidence/)

---

## 1. Ringkasan Pengujian

Pengujian integrasi perangkat keras (ESP32 dan Raspberry Pi) mencakup 5 skenario utama sesuai standar mutu PKL PT Teknolab Caraka Internasional:
1. Pengiriman pesan Heartbeat via MQTT Broker Mosquitto.
2. Integrasi Agent Heartbeat Raspberry Pi ke Broker.
3. Ketahanan Logika Reconnect (*Koneksi Ulang Otomatis*) saat WiFi/Broker Terputus.
4. Integrasi Heartbeat ke Backend API T-AIMS dan Database MySQL.
5. Simulasi Beban Multi-Perangkat menggunakan Simulator Python.

---

## 2. Matriks Hasil Pengujian

| No | Skenario Uji | Komponen Target | Hasil yang Diharapkan | Status | Bukti Berkas (*Evidence*) |
|:---|:---|:---|:---|:---:|:---|
| **TC-IOT-01** | Pengujian Publikasi Heartbeat MQTT | Mikrokontroler ESP32 | Payload JSON diterima oleh Mosquitto di topik `taims/heartbeat/ESP32-01` | ✅ **PASS** | `bukti_pengujian_MQTT_Heartbeat.png` |
| **TC-IOT-02** | Telemetri Raspberry Pi Node | Raspberry Pi 4 | Script `heartbeat.py` mengirim metrik CPU & RAM secara berkala | ✅ **PASS** | `bukti_pengujian_heartbeat_RPi.jpeg` |
| **TC-IOT-03** | Uji Mekanisme Auto-Reconnect | ESP32 Firmware | ESP32 mendeteksi MQTT disconnect dan otomatis terhubung kembali tanpa hang | ✅ **PASS** | `bukti_pengujian_koneksi_ulang_mqtt.png` |
| **TC-IOT-04** | Validasi Broker Mosquitto | Eclipse Mosquitto Port 1883 | Broker menerima koneksi klien terotentikasi dan meneruskan pesan | ✅ **PASS** | `bukti_pengujian_mosquitto_broker.jpeg` |
| **TC-IOT-05** | Sinkronisasi ke Backend & DB | Node.js Backend API | `last_seen` aset diperbarui di database `taims_db` dan status menjadi `online` | ✅ **PASS** | `pengujian koneksi esp32 ke backend T-AIMS.jpeg` |

---

## 3. Analisis Hasil & Observasi Lapangan

1. **Efisiensi Jaringan:**
   * Penggunaan payload JSON ringkas (< 200 bytes) meminimalisir penggunaan bandwidth jaringan lokal Teknolab.
   * Tingkat keberhasilan pengiriman paket mencapai 100% pada kondisi jaringan normal dengan QoS 1.

2. **Ketahanan Kegagalan (Resilience):**
   * Saat broker Mosquitto dimatikan sementara, loop firmware ESP32 tidak mengalami kernel panic/crash.
   * Ketika broker dihidupkan kembali, ESP32 berhasil re-establish session dalam waktu rata-rata 3,2 detik.

3. **Sinkronisasi Database:**
   * Listener MQTT backend berhasil mengeksekusi query `UPDATE assets SET last_seen = NOW(), current_status = 'online'` secara real-time setiap kali paket heartbeat masuk.
