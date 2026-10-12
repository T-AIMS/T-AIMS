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

## Port
- MQTT: 1883 (non-SSL)
- MQTT SSL: 8883 (nanti di server)

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
