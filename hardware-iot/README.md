# T-AIMS IoT Heartbeat & Hardware Telemetry

Mekanisme telemetri sensor lingkungan dan detak jantung perangkat (ESP32 & Raspberry Pi) untuk sistem pemantauan terpadu **T-AIMS PT Teknolab Caraka Internasional**.

---

## 📁 Struktur Direktori
* **`esp32/`** — Kode sumber firmware mikrokontroler ESP32 berbasis C++ / PlatformIO.
* **`simulator/`** — Simulator telemetri ESP32 berbasis script Python untuk pengujian beban tanpa hardware.
* **`raspi/`** — Daemon agent heartbeat Raspberry Pi workstation (`heartbeat.py`).
* **`esp32/include/config.h.example`** — Templat kredensial WiFi dan broker MQTT yang telah disanitasi.

---

## 🚀 Panduan Eksekusi

### 1. Menjalankan Simulator IoT (Python):
```bash
# Pastikan broker MQTT Mosquitto aktif di port 1883
pip install paho-mqtt
python simulator/simulate_esp32.py
```

### 2. Flashing Firmware ke Hardware ESP32 Fisik:
1. Buka folder `esp32/` menggunakan VS Code yang telah terpasang ekstensi **PlatformIO IDE**.
2. Salin `include/config.h.example` menjadi `include/config.h`.
3. Sesuaikan SSID WiFi, Password, dan IP Broker Mosquitto (`192.168.1.x`).
4. Hubungkan ESP32 melalui kabel USB, lalu klik **PlatformIO: Upload & Monitor**.

---

## 👥 Penanggung Jawab
* **IoT & Device Integration Specialist:** Ilvina Muvarika (Shift 1)
* **Lead System Integrator:** Dzakwan (Shift 2)
