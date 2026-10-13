# Kesepakatan Port Localhost T-AIMS
Dibuat: 12 Oktober 2026
Direvisi: 13 Oktober 2026 (sesuai API Contract Reza Fahmi v0.6)
Penanggung jawab: Wafian (DevOps)

## Port yang Disepakati

| Aplikasi | Port | URL |
|---|---|---|
| Backend API | 3000 | http://localhost:3000/api |
| Frontend Dashboard | 3001 | http://localhost:3001 |
| MySQL | 3306 | localhost:3306 |
| MQTT Broker | 1883 | localhost:1883 |
| phpMyAdmin | 80 | http://localhost/phpmyadmin |
| n8n | 5678 | http://localhost:5678 |

## Catatan Revisi
- Sebelumnya backend 5000, frontend 3000.
- Direvisi sesuai API Contract Reza Fahmi: backend 3000.
- Frontend pindah ke 3001 agar tidak bentrok.

## Aturan
- Frontend & Backend tidak boleh pakai port yang sama.
- Kalau ada perubahan, update dokumen ini.
- Semua tim Shift 2 wajib ikut port ini.
