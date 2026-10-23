# T-AIMS Backend API Documentation
**Teknolab Asset & Infrastructure Monitoring System**
**PT Teknolab Caraka Internasional**
*PIC: Ahmad Reza Fahmi (Backend & API Developer - Shift 1)*

---
## Gambaran Umum
Dokumen ini merupakan panduan spesifikasi REST API backend T-AIMS untuk integrasi Frontend Dashboard (Dika Yoga / Ahmad Aziz), IoT Ingestion (Ilvina Muvarika), Network Monitoring (Ananda Dwi Susanti), dan Automasi Notifikasi (Arik).
* Base URL: http://localhost:3000/api (Bisa diakses via IP Lokal: http://192.168.x.x:3000/api)
* Default Port: 3000
* Format Response: JSON (application/json)
* Timezone: Waktu server (WIB / Local)

---
## Autentikasi
Backend menggunakan 2 skema autentikasi:
1. JWT Authentication (Dashboard & Web App)
Digunakan untuk pengguna web (Admin, Viewer, PIC). Sertakan token pada request header:
Authorization: Bearer <jwt_token>
2. Device API Key (IoT ESP32 & Monitoring Agent)
Digunakan oleh perangkat keras dan service monitoring untuk mengirim data/heartbeat secara aman tanpa login user:
X-API-Key: <DEVICE_API_KEY>
*(Nilai default dev: dikonfigurasi di file .env)*

---
## Standar Response Format

### Sukses
{
  "success": true,
  "data": { ... }
}

### Error
{
  "success": false,
  "error": "Pesan deskripsi error"
}

---
## Daftar Endpoint

### 1. Autentikasi (/api/auth)

POST /api/auth/login
Login pengguna untuk mendapatkan token JWT. (Public)
Request Body:
{
  "email": "admin@taims_db.local",
  "password": "password123"
}
Response 200 OK:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "expires_in": 86400,
    "user": {
      "user_id": 1,
      "full_name": "Administrator",
      "email": "admin@taims_db.local",
      "role": "super_admin"
    }
  }
}

GET /api/auth/me
Mendapatkan profil pengguna yang sedang login. (Bearer Token)

POST /api/auth/change-password
Mengubah password pengguna. (Bearer Token)
Request Body: { "old_password": "...", "new_password": "..." }

POST /api/auth/logout
Logout pengguna. Token masuk blacklist. (Bearer Token)

---
### 2. Heartbeat Perangkat (/api/heartbeat)

POST /api/heartbeat
Endpoint utama untuk ESP32/RPi. Auth: X-API-Key.
Request Body:
{
  "device_id": "IOT-ESP-01",
  "status": "online",
  "ip_address": "192.168.1.150",
  "rssi": -65,
  "uptime_seconds": 12450,
  "firmware_version": "v1.0.2"
}
Response 200 OK:
{
  "success": true,
  "message": "Heartbeat received",
  "status": "online",
  "next_heartbeat_in": 30
}

GET /api/heartbeat/:assetCode/latest
Mendapatkan data heartbeat terakhir. (Bearer Token)

---
### 3. Aset & Registry (/api/assets)

GET /api/assets
Mengambil daftar aset. (Bearer Token)
Query Parameters: ?search=mikrotik&category=Router&status=online&location_id=2&page=1&limit=20
Response 200 OK:
{
  "success": true,
  "pagination": { "total": 42, "page": 1, "limit": 20, "total_pages": 3 },
  "data": [ { "asset_id": 1, "asset_code": "NET-RTR-01", "current_status": "online" } ]
}

GET /api/assets/:id
Mengambil detail satu aset. (Bearer Token)

POST /api/assets
Menambah aset baru. (Bearer Token - Admin)
Request Body:
{
  "asset_code": "NET-SW-02",
  "asset_name": "Switch Cisco",
  "category": "Switch",
  "ip_address": "192.168.1.10",
  "location_id": 1,
  "monitoring_method": "Ping",
  "priority": 2
}

PUT /api/assets/:id
Memperbarui data aset. (Bearer Token - Admin)

DELETE /api/assets/:id
Menghapus aset + relasinya (Cascade). (Bearer Token - Super Admin)

---
### 4. Dashboard & Analytics (/api/dashboard)

GET /api/dashboard/stats
Data agregasi kartu metrik (total, online, offline, warning, unknown). (Bearer Token)

GET /api/dashboard/trend
Data grafik tren status.
Query Params: ?period=live|24h|30d
Response 200 (24h):
{
  "success": true,
  "period": "24h",
  "data": { "labels": ["10:00", "11:00"], "datasets": { "online": [10, 12], "offline": [5, 3], "warning": [0, 1] } }
}

GET /api/dashboard/uptime
Statistik uptime per device.

GET /api/dashboard/activity
Log monitoring terbaru.

GET /api/dashboard/map
Data aset per lokasi (peta).

---
### 5. Network & Engine Monitoring (/api/monitoring)
*(Semua POST di bawah ini pakai Auth: X-API-Key)*

POST /api/monitoring/ping
POST /api/monitoring/http
POST /api/monitoring/tcp
POST /api/monitoring/ping-http
POST /api/monitoring/snmp
POST /api/monitoring/mqtt-health
Contoh Body (Ping):
{
  "asset_id": 1,
  "status": "online",
  "response_time_ms": 1.45,
  "details": { "packet_loss": 0 }
}

GET /api/monitoring/logs
Histori log monitoring. (Bearer Token)

GET /api/monitoring/status/:assetId
Status terkini perangkat. (Bearer Token)

---
### 6. AI Recommendation (/api/ai)

GET /api/ai/recommendation
Hasil analisis AI dari n8n webhook. (Bearer Token)

---
### 7. Insiden, Maintenance, & Notifikasi
- /api/incidents (CRUD)
- /api/maintenance (CRUD)
- /api/notifications (List, Read, Unread-Count)

---
### 8. Lokasi & Search
- /api/locations (CRUD)
- GET /api/search?q={keyword} (Pencarian global)

---
## Integrasi MQTT & Background Services
1. Ingestion Heartbeat via MQTT
Topic Subscribe: taims/heartbeat/{asset_code}

2. Auto Offline & Warning Checker (offline-checker.js)
- Cek tiap 30 detik, timeout 45 detik.
- Auto-warning jika response time > 1000ms.
- Auto-offline: kirim alert MQTT taims/alert/offline/{asset_code}, catat insiden, kirim notif.

3. Auto Recovery Checker
- Kirim alert taims/alert/recovery/{asset_code}, insiden jadi resolved.

4. Data Retention & Log Archiver (Cron Job)
- Tiap tengah malam, data log > 30 hari diringkas ke monitoring_daily_stats, lalu log mentah dihapus.

---
## Informasi Kontak Tim
- Backend Engineer: Ahmad Reza Fahmi (Shift 1)
- Frontend Lead: Dika Yoga (Shift 2)
- System Integration: Dzakwan (Shift 2 Lead)
- Project Coordinator: Damar Munajad (Shift 1 Lead)