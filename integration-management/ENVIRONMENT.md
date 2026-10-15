# Environment T-AIMS
Dibuat: 14 Oktober 2026
Diupdate: 14 Oktober 2026 (revisi versi & IP)

## IP Windows (WSL Gateway)
| Item | Nilai |
|---|---|
| IP Windows | `172.19.112.1` |
| Cek dengan | `ip route \| grep default` |
| Catatan | IP bisa berubah setiap restart WSL |

## Port
| Aplikasi | Port |
|---|---|
| Backend | 3000 |
| Frontend | 3001 |
| MySQL | 3306 |
| MQTT | 1883 |
| phpMyAdmin | 80 |
| n8n | 5678 |

## Versi Software (Aktual)
| Software | Versi |
|---|---|
| Node.js | v24.21.0 |
| npm | 11.19.0 |
| Python | 3.14.4 |
| MySQL | 8.4.11-0ubuntu |
| Mosquitto | 2.0.22 |
| Docker | 29.x |
| n8n | n8nio/n8n (Docker) |
| Git | 2.53.0 |

## Catatan
- Backend & Frontend jalan di **Windows** (CMD)
- MySQL jalan di **XAMPP** (Windows)
- MQTT & n8n jalan di **WSL** (Linux)
- IP Windows dari WSL: `172.19.112.1`

## Docker (Mosquitto & n8n)
| Service | Container | Port | Image |
|---|---|---|---|
| Mosquitto | taims-mosquitto | 1883, 9001 | eclipse-mosquitto:2 |
| n8n | taims-n8n | 5678 | n8nio/n8n |

Network: `taims-net`
Compose file: `automation/docker-compose.yml`

## n8n Workflow
- Workflow OFFLINE → Telegram (cooldown 10 menit)
- Workflow RECOVERY → Telegram (cooldown 10 menit)

## Systemd Service
| Service | File | Status |
|---|---|---|
| taims-monitoring | /etc/systemd/system/taims-monitoring.service | ✅ enabled |

## Docker Container
| Container | Image | Port | Status |
|---|---|---|---|
| taims-mosquitto | eclipse-mosquitto:2 | 1883, 9001 | ✅ |
| taims-n8n | n8nio/n8n | 5678 | ✅ |

Network: `taims-net`

## Monitoring Engine
- File: `network-monitoring/monitoring_engine.py`
- Service: `taims-monitoring.service`
- Interval: 10 detik
