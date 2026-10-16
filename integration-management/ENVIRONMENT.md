# Environment T-AIMS
Dibuat: 14 Oktober 2026  
Diupdate: 16 Oktober 2026 (Finalisasi 16 Aset E2E, Docker, Systemd & Keamanan)

## IP Windows (WSL Gateway)
| Item | Nilai |
|---|---|
| IP Windows | `172.19.112.1` |
| Cek dengan | `ip route \| grep default` |
| Catatan | IP dinamis interface WSL2 virtual bridge |

## Matriks Port Layanan
| Aplikasi | Port | Protokol | Lingkungan | Status |
|---|---|---|---|---|
| Backend API | `3000` | HTTP / REST | Windows (Node.js Express) | ✅ OPEN |
| Frontend Dashboard | `3001` | HTTP | Windows (Static Web) | ✅ OPEN |
| MySQL Database | `3306` | TCP | Windows (XAMPP MariaDB/MySQL) | ✅ OPEN |
| Mosquitto MQTT | `1883`, `9001` | TCP / WS | WSL2 Docker (`taims-mosquitto`) | ✅ OPEN |
| n8n Automation | `5678` | HTTP | WSL2 Docker (`taims-n8n`) | ✅ OPEN |
| Nginx Reverse Proxy | `80`, `443` | HTTP / HTTPS | Docker / Host (Siap Deploy) | ✅ STANDBY |

## Versi Software (Aktual Sistem)
| Software | Versi |
|---|---|
| Node.js | v24.21.0 / v18.x |
| npm | 11.19.0 |
| Python | 3.14.4 (WSL) / 3.11+ |
| MySQL | 8.4.11-0ubuntu / MariaDB 10.4 |
| Mosquitto | 2.0.22 (Eclipse Mosquitto Docker) |
| Docker Engine | 29.x / Compose v2 |
| n8n | n8nio/n8n (Docker latest) |
| Git | 2.53.0 |

## Arsitektur Deployment & Runtime
- **Backend & Frontend**: Berjalan di lingkungan **Windows Host** (atau via container `docker-compose.yml`)
- **MySQL**: Berjalan via **XAMPP Control Panel** di Windows (Port 3306)
- **MQTT Broker & n8n**: Berjalan via **Docker WSL2** pada bridge network `taims-net`
- **Gateway Komunikasi**: WSL2 mengakses Windows Host via IP `172.19.112.1`
- **Data Aset**: 16 aset terdaftar di `taims_db` (sinkronisasi E2E live ke Frontend Dashboard)

## Systemd Service (Daemon Monitoring)
| Service | File Path | Status |
|---|---|---|
| `taims-monitoring` | `/etc/systemd/system/taims-monitoring.service` | ✅ Active (running) & enabled |

## Docker Container (Active Running)
| Container Name | Image | Port Mapping | Network | Status |
|---|---|---|---|---|
| `taims-mosquitto` | `eclipse-mosquitto:2` | `1883:1883`, `9001:9001` | `taims-net` | ✅ Up (Hardened Auth) |
| `taims-n8n` | `n8nio/n8n` | `5678:5678` | `taims-net` | ✅ Up |

## Otomasi n8n & Notifikasi Insiden
- Workflow Offline Alert → Notifikasi Telegram & SMTP Email
- Workflow Recovery Alert → Notifikasi Telegram & SMTP Email
- Cooldown: 10 menit (mencegah alert fatigue)
