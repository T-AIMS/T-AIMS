# T-AIMS API Contract

Project: Teknolab Asset & Infrastructure Monitoring System
Author: Ahmad Reza Fahmi (Backend Developer)
Versi: v1.0 (Final)
Tanggal: 22 Oktober 2026
Base URL: http://localhost:3000/api
Auth: JWT Bearer Token & API Key (Device)
Content-Type: application/json

---
## Status Implementasi
| Modul | Endpoint | Status |
|---|---|---|
| Authentication | 4 | Selesai |
| Users | 6 | Selesai |
| Assets | 8 | Selesai |
| Locations | 5 | Selesai |
| Monitoring | 9 | Selesai |
| Dashboard | 8 | Selesai |
| Incidents | 5 | Selesai |
| Maintenance | 5 | Selesai |
| Notifications | 7 | Selesai |
| Heartbeat | 2 | Selesai |
| Search | 1 | Selesai |
| AI Recommendation | 1 | Selesai |
| TOTAL | 61 | All Done |

---
## 1. Konvensi Umum

Auth Header:
Authorization: Bearer <token>
# ATAU untuk device:
X-API-Key: <DEVICE_API_KEY>

Role:
- super_admin (CRUD penuh)
- admin (Create, Read, Update)
- user (Read only)

---
## 2. Monitoring & Status Logic

Kategori Device: Router, Switch Manageable, Access Point, Server, Firewall, Storage, IoT Node, CCTV, TV, PC.

Status ENUM:
- online: Hidup & sehat.
- warning: Hidup tapi response time > 1000ms atau packet loss > 10%.
- offline: Tidak merespons > 45 detik.
- unknown: Belum pernah dimonitor.
- maintenance: Sedang diperbaiki manual.

---
## 3. Authentication

POST /api/auth/login (Public)
POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response 200: Token dimasukkan ke tabel token_blacklist.

---
## 4. Assets

GET /api/assets (semua role)
POST /api/assets (admin, super_admin)
DELETE /api/assets/:id (super_admin only)
Aturan: Hapus asset secara Cascade (menghapus juga log, incident, maintenance, notifikasi terkait).

---
## 5. Monitoring (Device/Engine)

Semua endpoint POST di bawah ini menggunakan header X-API-Key: <DEVICE_API_KEY>.
- POST /api/monitoring/ping
- POST /api/monitoring/http
- POST /api/monitoring/tcp
- POST /api/monitoring/ping-http
- POST /api/monitoring/snmp
- POST /api/monitoring/mqtt-health

(Backend otomatis mengonversi asset_id & response_time_ms ke Integer, menerima string dari MikroTik).

---
## 6. Heartbeat (IoT)

POST /api/heartbeat
Headers: X-API-Key: <DEVICE_API_KEY>

---
## 7. Dashboard

GET /api/dashboard/stats
GET /api/dashboard/trend?period=live|24h|30d

Response 200 (24h/30d):
{
  "success": true,
  "period": "24h",
  "data": {
    "labels": ["10:00", "11:00"],
    "datasets": {
      "online": [10, 12],
      "offline": [5, 3],
      "warning": [0, 1]
    }
  }
}

---
## 8. AI Recommendation

GET /api/ai/recommendation (semua role)

---
## 9. Background Services & Data Retention

- Offline Checker: Cek tiap 30 detik. Jika last_seen > 45 detik -> offline. Kirim MQTT taims/alert/offline/{asset_code}.
- Warning Checker: Jika response time > 1000ms -> status warning.
- Log Cleaner (Cron): Tiap tengah malam, ringkas data > 30 hari ke monitoring_daily_stats, lalu hapus log mentahnya.
- MQTT Topics:
  Subscribe: taims/heartbeat/#
  Publish: taims/alert/offline/#, taims/alert/recovery/#

---
## 10. Changelog
v0.7 (13 Okt 2026): Tambah SNMP, MQTT health, heartbeat, search.
v0.8 (14 Okt 2026): Catatan: Unknown alert skip.
v1.0 (22 Okt 2026): Final: Tambah Warning, AI Endpoint, Cascade Delete, Data Retention (Log Cleaner), parseInt support untuk MikroTik, Endpoint Trend.

---
Kontak: Ahmad Reza Fahmi (Backend Developer)