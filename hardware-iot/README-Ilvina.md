# T-AIMS IoT Heartbeat - Ilvina

Mekanisme heartbeat ESP32 dan Raspberry Pi untuk T-AIMS.

## Struktur Folder

- `esp32/` - Firmware ESP32 menggunakan PlatformIO.
- `simulator/` - Simulator ESP32 menggunakan Python.
- `raspi/` - Agent heartbeat Raspberry Pi menggunakan Python.
- `docs/` - Dokumentasi dan hasil pengujian.

## Cara Menjalankan Simulator

1. Install Mosquitto sebagai broker MQTT lokal.
2. Install library Python:

   ```bash
   pip install paho-mqtt
   ```

3. Jalankan simulator:

   ```bash
   python simulator/simulate_esp32.py
   # atau
   python simulator/simulator_esp32.py
   ```

## Cara Upload ESP32

1. Buka folder `esp32/` di Visual Studio Code menggunakan PlatformIO.
2. Isi konfigurasi Wi-Fi dan MQTT pada `include/config.h` (dapat menyalin dari templat `config.h.example`).
3. Hubungkan ESP32 ke komputer via USB (port otomatis terdeteksi).
4. Klik **Upload** di PlatformIO.

## Dokumentasi Hardware

### 1. Heartbeat Raspberry Pi

- **PIC:** Ilvina Muvarika (IoT & Device Integration).
- **Lokasi kode sebenarnya:** `hardware-iot/raspi/heartbeat.py`.
- **Catatan:** Folder `hardware-iot/rpi_heartbeat/` kosong karena script heartbeat Raspberry Pi sudah tersedia di folder `raspi/`.
- **Solusi:** Folder `rpi_heartbeat/` telah dihapus agar struktur repositori bersih dan terpusat.

### 2. Simulator ESP32

- **PIC:** Ilvina Muvarika (IoT & Device Integration).
- **Lokasi kode sebenarnya:** `hardware-iot/simulator/simulate_esp32.py` & `simulator_esp32.py`.
- **Catatan:** Folder `hardware-iot/simulators/` kosong. Script simulasi menggunakan folder `simulator/`.
- **Solusi:** Folder `simulators/` telah dihapus agar struktur repositori bersih dan terpusat.

### 3. Firmware ESP32

- **PIC:** Ilvina Muvarika (IoT & Device Integration).
- **Lokasi kode sebenarnya:** `hardware-iot/esp32/src/main.cpp`.
- **Catatan:** Folder `hardware-iot/esp32_firmware/` kosong karena kode sumber firmware ESP32 sudah tersedia di folder `esp32/src/`.
- **Solusi:** Folder `esp32_firmware/` telah dihapus agar struktur repositori bersih dan terpusat.

## Dokumentasi Pengujian

Lihat file berikut untuk informasi lebih lanjut:

- `docs/heartbeat.md`
- `docs/test-result.md`
