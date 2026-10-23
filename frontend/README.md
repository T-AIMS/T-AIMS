# T-AIMS Frontend Dashboard

Modul antarmuka web interaktif untuk pemantauan aset dan infrastruktur IT PT Teknolab Caraka Internasional secara waktu-nyata (*real-time*).

---

## 💻 Spesifikasi Teknis
* **Teknologi Utama:** HTML5, TailwindCSS, JavaScript ES6 (Modular), Chart.js
* **Port Layanan:** Port 3001 (Nginx / Web Server)
* **Konektivitas API:** Terhubung langsung ke Backend API port 3000 melalui modul terpusat `apiService.js` dengan menyertakan header otentikasi JWT Bearer Token.
* **Protokol:** HTTP/HTTPS, REST API, WebSocket / Live Polling interval 5 detik.

---

## 📊 Halaman & Fitur Utama (SPA Module)
1. **`index.html#page-dashboard`:** Dashboard eksekutif dengan 6 KPI Cards (Total Perangkat, Online, Offline, Peringatan, Latensi Rata-rata, Tingkat Ketersediaan SLA).
2. **`index.html#page-devices`:** Tabel inventaris 19 perangkat kantor Teknolab (termasuk Access Point & Printer) dengan filter multi-kategori dan lokasi.
3. **`index.html#page-monitoring`:** Papan pantau status kesehatan telemetri jaringan dan perangkat secara live.
4. **`index.html#page-location`:** Peta geospasial Leaflet GIS dan visualisasi denah lantai (floorplan) kantor Teknolab.
5. **`index.html#page-alerts`:** Manajemen tiket insiden gangguan dan notifikasi waktu-nyata.
6. **`index.html#page-reports`:** Riwayat log pemantauan telemetri, jadwal maintenance, dan ekspor data (CSV/JSON/Cetak).
7. **`index.html#page-users`:** Pengelolaan pengguna dengan kontrol hak akses 3 tingkat (Superadmin, Admin, Viewer/User).
8. **`index.html#page-settings`:** Pengaturan sistem, ambang batas latency, interval polling, dan integrasi webhook n8n AI.

---

## 👥 Tim Pengembang
* **Frontend Developer:** Dika Yoga (Shift 2)
* **UI/UX & Data Visualization Designer:** Ahmad Aziz (Shift 2)
* **System Integration & Architecture:** Dzakwan Miftahussobirin (Shift 2 Lead)

---

## 📂 Struktur Direktori Frontend
```text
Website  T-AIMS/
├── index.html            # Entry point utama Single Page Application (SPA) 9 Modul
├── dashboard.html        # Redirect otomatis -> index.html#page-dashboard
├── Dockerfile            # Nginx Alpine Containerization (Port 3001)
├── README.md             # Dokumentasi teknis frontend T-AIMS
└── assets/
    ├── css/
    │   ├── style.css     # Custom Cyber Dark Theme, Typography, Animasi, & Komponen UI
    │   └── leaflet.css   # Stylesheet bawaan pustaka Leaflet Map
    ├── js/
    │   ├── app.js        # Core App Controller, State Management, & Translation Engine
    │   ├── apiService.js # Modul API Connector terpusat ke backend port 3000
    │   ├── chart.umd.min.js # Vendor library Chart.js Engine
    │   └── leaflet.js    # Vendor library Leaflet Map Interactive Engine
    └── img/
        ├── banner_hero_bg.jpg     # Background banner dashboard
        ├── banner-bg.png
        ├── banner_art_right.png
        ├── banner_sample.png
        ├── logo-teknolab.png      # Logo Teknolab standar
        ├── teknolab_logo.png      # Logo Teknolab
        ├── teknolab_logo_dark.png # Logo Teknolab dark mode
        └── branding/              # Master identitas visual HD korporat Teknolab
            ├── logo-teknolab-caraka-internasional-hd-nobg.png
            ├── logo-teknolab-icon-square-512.png
            ├── logo-teknolab-landscape-dark-hd.png
            ├── logo-teknolab-landscape-light-hd.png
            └── logo-teknolab-vertical-hd.png
```

