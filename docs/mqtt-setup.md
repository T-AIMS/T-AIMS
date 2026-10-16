# Setup MQTT Broker T-AIMS
Dibuat: 12 Oktober 2026
Penanggung jawab: Wafian & Reza

## Apa Itu MQTT?
MQTT (Message Queuing Telemetry Transport) adalah protokol ringan
untuk komunikasi IoT. ESP32/RPi kirim heartbeat via MQTT.

## Arsitektur
[ESP32/RPi] --publish--> [Mosquitto Broker] --subscribe--> [Backend]

## Instalasi
sudo apt update
sudo apt install mosquitto mosquitto-clients -y

## Jalankan Mosquitto
sudo systemctl start mosquitto
sudo systemctl enable mosquitto
sudo systemctl status mosquitto

## Port & Otentikasi
- Port MQTT: 1883 (TCP)
- Port MQTT WebSocket: 9001 (WS)
- Port MQTT SSL: 8883 (Production)
- **Otentikasi Broker (`allow_anonymous false`)**:
  - Username: `taims-broker`
  - Password: `taims-mqtt-2026`
  - Password File: `/mosquitto/config/passwd`

## Topik yang Dipakai
- taims/heartbeat/<asset_code>  -> heartbeat IoT
- taims/status/<asset_code>     -> status update
- taims/alert/#                  -> notifikasi

## Test
Terminal 1 (subscribe):
mosquitto_sub -h localhost -t "taims/#" -v

Terminal 2 (publish):
mosquitto_pub -h localhost -t "taims/test" -m "Hello T-AIMS"

## Integrasi ke Backend
Backend subscribe ke topik taims/heartbeat/#,
proses data, simpan ke database taims_db.

## Status
- Mosquitto terinstall: ✅
- Port 1883 listen: ✅
- Service auto-start: ✅

## Topik MQTT (Sesuai API Contract v0.6)

### Device → Backend (Backend subscribe)
- taims/heartbeat/IOT-ESP-01
- taims/heartbeat/IOT-RPI-01

### Backend → Automation (Backend publish)
- taims/alert/offline/{asset_code}
- taims/alert/recovery/{asset_code}

### QoS
- QoS: 1
- Retain: false
- LWT: {"status":"offline","reason":"connection_lost"}
