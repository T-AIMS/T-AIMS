# T-AIMS Frontend Dashboard

Modul antarmuka web interaktif untuk pemantauan aset dan infrastruktur IT PT Teknolab Caraka Internasional secara waktu-nyata (*real-time*).

---

## 💻 Spesifikasi Teknis
* **Teknologi Utama:** HTML5, TailwindCSS, JavaScript ES6 (Modular), Chart.js
* **Port Layanan:** Port 3001 (Nginx / Web Server)
* **Konektivitas API:** Terhubung langsung ke Backend API port 3000 melalui modul terpusat `apiService.js` dengan menyertakan header otentikasi JWT Bearer Token.
* **Protokol:** HTTP/HTTPS, REST API, WebSocket / Live Polling interval 5 detik.

---

## 📊 Halaman & Fitur Utama
1. **`dashboard.html` / `index.html`:** Dashboard eksekutif dengan 6 KPI Cards (Total Devices, Online, Offline, Warning, Average Latency, Availability Rate).
2. **`devices.html`:** Tabel inventaris 16 perangkat kantor Teknolab dengan fitur filter multi-kategori (Router, Switch, Server, IoT, CCTV, AP, PC) dan lokasi.
3. **`network.html` & `topology.html`:** Peta topologi jaringan kantor dan visualisasi status koneksi subnet `192.168.1.x`.
4. **`history.html` & `reports.html`:** Riwayat log pemantauan telemetri dan grafik tren uptime/downtime.
5. **Detail Modal & Keamanan:** Popup detail spesifikasi teknis perangkat (IP, MAC, Firmware, Last Seen) serta proteksi celah otentikasi (*client-side token verification*).

---

## 👥 Tim Pengembang
* **Frontend Developer:** Dika Yoga (Shift 2)
* **UI/UX & Data Visualization Designer:** Ahmad Aziz (Shift 2)
