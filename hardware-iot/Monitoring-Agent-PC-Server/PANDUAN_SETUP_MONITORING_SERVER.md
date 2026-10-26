# Panduan Monitoring Perangkat PC Server Fisik - T-AIMS

Dokumen ini menjelaskan cara menggunakan file yang telah disiapkan di codebase T-AIMS untuk memonitor hardware **PC Server Fisik** (CPU, RAM, Disks, Uptime).

Anda memiliki **2 Opsi Praktis**, kedua file dan konfigurasinya sudah 100% siap di folder proyek Anda:

---

## 📌 Opsi A: Menjalankan Backend T-AIMS Langsung di PC Server (Rekomendasi Utama)

> **Kapan memilih opsi ini?**  
> Ketika Anda ingin menjadikan PC Server tersebut sebagai server utama yang melayani database, backend, dan website T-AIMS untuk seluruh kantor/lab.

### Kelebihan:
- **100% Otomatis:** Tidak perlu script tambahan. Backend T-AIMS langsung membaca CPU, RAM, Suhu, dan Disk dari PC Server tempat ia berjalan.
- **Data Real-time:** Telemetri terbaca secara native melalui API sistem operasi (`os-utils`, `fs.statfs`).

### Langkah Praktis:
1. **Copy folder `Website  T-AIMS`** dari laptop Anda ke PC Server fisik (bisa via Flashdisk atau sharing folder jaringan lokal).
2. Di PC Server, buka folder `Website  T-AIMS/Backend Final`.
3. **Klik ganda file `JALANKAN_BACKEND.bat`**.
4. Selesai! Buka browser di laptop atau HP Anda dengan alamat IP PC Server (contoh: `http://192.168.1.100:3000`), dashboard T-AIMS akan langsung menampilkan spesifikasi dan metrik PC Server tersebut.

*(Tips: Jika ingin otomatis menyala setiap kali PC Server di-boot tanpa perlu klik `.bat`, gunakan PM2 dengan perintah `pm2 start src/app.js --name taims && pm2 startup && pm2 save`).*

---

## 📌 Opsi B: Menggunakan Monitoring Agent (Jika Backend & Web Ada di Tempat Lain)

> **Kapan memilih opsi ini?**  
> Ketika Backend T-AIMS Anda sudah di-deploy di Cloud/VPS/Hosting internet atau di laptop utama, dan Anda hanya ingin PC Server kantor mengirimkan data CPU & RAM ke dashboard tersebut.

### File yang Sudah Disiapkan:
Semua file sudah berada di folder:
📂 `Website  T-AIMS/Monitoring-Agent-PC-Server/`
- `agent.js` (Script pengumpul telemetri hardware)
- `JALANKAN_AGENT.bat` (Peluncur 1-klik untuk PC Server)

### Langkah Praktis:
1. Cukup copy **folder `Monitoring-Agent-PC-Server`** ke PC Server fisik Anda.
2. Buka file `agent.js` dengan Notepad, lalu ubah baris URL target ke IP laptop/server utama Anda:
   ```javascript
   BACKEND_URL: 'http://192.168.1.50:3000/api/monitoring/server-telemetry',
   ```
3. **Klik ganda file `JALANKAN_AGENT.bat`**.
4. Script agent akan berjalan di background dan otomatis mem-push data penggunaan CPU, RAM, dan Disk PC Server setiap 3 detik ke dashboard T-AIMS Anda!

---

## Ringkasan Perbandingan
| Fitur | Opsi A (Backend di PC Server) | Opsi B (Agent Terpisah) |
|---|---|---|
| **Lokasi Backend** | Di PC Server itu sendiri | Di Laptop Admin / Hosting / Cloud |
| **File yang Dijalankan** | `Backend Final/JALANKAN_BACKEND.bat` | `Monitoring-Agent-PC-Server/JALANKAN_AGENT.bat` |
| **Kebutuhan Database** | MySQL berjalan di PC Server | MySQL tidak perlu di PC Server |
| **Beban PC Server** | Melayani web dan database | Sangat ringan (< 15 MB RAM) |
