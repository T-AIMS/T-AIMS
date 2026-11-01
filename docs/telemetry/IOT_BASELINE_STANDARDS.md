# T-AIMS | Standardisasi Baseline Telemetri IoT & Solar Array
**PT Teknolab Caraka Internasional • Dokumen Kerja PKL 30 Hari (Hal. 10)**

---

## 1. Ambang Batas Operasional Normal (*Operational Baselines*)

| Parameter Metrik | Satuan | Batas Normal | Batas Peringatan (Warning 🟡) | Batas Kritis (Critical 🔴) | Tindakan Mitigasi AI |
|---|:---:|:---:|:---:|:---:|---|
| **Tegangan PLTS (Solar Array)** | Volt (V) | 12.6V – 14.4V | 11.5V – 12.5V (Baterai Lemah) | < 11.0V (Under-voltage) | Alihkan beban ke grid PLN via relai ESP-02 |
| **Arus Beban (Load Current)** | Ampere (A) | 1.0A – 3.5A | 3.5A – 4.5A (Beban Tinggi) | > 5.0A (Over-current) | Putus jalur sirkuit sekunder untuk proteksi MCB |
| **Suhu Sensor IoT (ESP32)** | Celcius (°C) | 25°C – 45°C | 46°C – 60°C (Overheat) | > 65°C (Risiko Thermal Runaway) | Nyalakan kipas exhaust Rack Server |
| **Jeda Heartbeat** | Detik (s) | 30 Detik | 45 – 60 Detik | > 90 Detik (Lost Signal) | Picu status OFFLINE & Alert Telegram |

---

## 2. Arsitektur Hybrid Telemetry (Fisik vs Simulasi Cerdas)

* **Physical Devices (Fisik Nyata):**
  - Core Server, Mikrotik Router, Workstation PC, dan IP Camera diuji menggunakan ICMP Ping & HTTP Heartbeat nyata pada jaringan lokal PT Teknolab.
* **Hybrid IoT Node (ESP32 Solar Telemetry):**
  - Mengirimkan data telemetri tegangan, arus, dan daya melalui endpoint `/api/heartbeat` dengan format payload JSON tervalidasi.
  - Jika koneksi fisik terputus sementara, backend mengaktifkan *telemetry baseline generator* agar visualisasi analitik SLA dashboard tetap stabil tanpa nilai `NaN` atau `undefined`.
