# DOKUMENTASI LENGKAP REVISI FRONTEND T-AIMS (EDISI REVISI TAHAP 5 - INDUSTRIAL ULTRA)
**Teknolab Asset & Infrastructure Monitoring System (T-AIMS)**  
*Dokumen Serah Terima & Panduan Teknis Lengkap untuk Dika Yoga Pratama (Frontend Dashboard Developer - Shift 2)*

---

## 1. Ringkasan Eksekutif & Struktur Dua Distribusi Folder

Seluruh kode revisi dari 5 foto terbaru yang dikirimkan telah selesai diimplementasikan secara menyeluruh dan dipaketkan ke dalam **Dua Versi / Folder Distribusi Resmi**:

| Folder / Paket Distribusi | Deskripsi & Target Penggunaan | Lokasi Unduhan |
| :--- | :--- | :--- |
| **1. `taims-frontend-revised`** | **Folder Revisi Spesifik Dika Yoga (Semua 5 Foto Tuntas)**: Peta Google Maps Detail + Satelit Blitar/Jatim (tanpa OSM & tanpa getar), pemisahan denah HO (atas) & MO (bawah) Ahmad Aziz, edit nama ruangan interaktif (Simpan & Hapus), perbaikan profil tamu di riwayat, animasi portal login cyber industrial, CRUD penuh pengguna (Create, Read, Edit, Delete), perbaikan bug chart donut di mobile, dan dynamic theme engine Opsi 2 (Cyber-Electric Dark). | [`C:\Users\user\Downloads\taims-frontend-revised\`](file:///C:/Users/user/Downloads/taims-frontend-revised/) <br> *ZIP Siap Ekstrak*: [`taims-frontend-revised.zip`](file:///C:/Users/user/Downloads/taims-frontend-revised.zip) |
| **2. `taims-frontend-teknolab-pro`** | **Standar Resmi Pemilik PT Tekno Lab (Kiblat Arduino Indonesia & Edukasi Elektro)**: Seluruh fitur dari Folder 1 ditambah **Live Industrial Telemetry Streaming Ticker** (ESP32 DHT22, Tegangan Solar Array, & Latensi Router), **Skema Wiring Hardware & Pinout ESP32 30-Pin** interaktif, serta arsitektur SCADA modern siap uji coba lapangan dan presentasi industri. | [`C:\Users\user\Downloads\taims-frontend-teknolab-pro\`](file:///C:/Users/user/Downloads/taims-frontend-teknolab-pro/) <br> *ZIP Siap Ekstrak*: [`taims-frontend-teknolab-pro.zip`](file:///C:/Users/user/Downloads/taims-frontend-teknolab-pro.zip) |

---

## 2. Rincian Pengerjaan 5 Revisi Foto Terbaru

---

### FOTO 1: Peta GIS Google Maps Presisi Tinggi, Pemisahan Denah HO/MO Aziz & Editor Ruangan Interaktif
**Permintaan Pengguna**:
1. Jangan gunakan tile peta yang rusak/watermark API key. Buat peta sangat detail seperti Google Maps dengan nama gedung/jalan real-life dan citra satelit asli. Hapus opsi OSM.
2. Batasi area peta hanya untuk Kota Blitar dan Jawa Timur (jangan bisa di-zoom out ke seluruh dunia).
3. Saat mencari perangkat pada bilah pencarian, hilangkan efek getar-getar kamera.
4. Denah Ahmad Aziz dipisah menjadi dua:
   - **Denah HO (Head Office)**: Gedung bagian atas (Ruang Server, Lab IoT, Ruang Kerja, Ruang Admin, Koridor, Logistik, Pilar Kanopi).
   - **Denah MO (Marketing Office / Operasional)**: Gedung bagian bawah (Workshop Elektro & Lab Hardware, Selasar & Parkir Operasional).
5. Edit nama ruangan pada denah: setiap ruangan bisa diklik secara individual, membuka modal untuk **Simpan Nama Baru** atau **Hapus / Reset ke Default**.

**Solusi & Implementasi Teknis pada `topology.html` & `style.css`**:
1. **Dua Layer Resmi Google Maps (Zoom hingga 21)**:
   - **Google Maps Detail**: Menggunakan layer resmi Google Maps `https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}` dengan rendering jalan, nama gedung, perkantoran, dan fasilitas publik di Blitar secara tajam dalam bahasa Indonesia tanpa watermark.
   - **Google Satellite Hybrid**: Menggunakan citra satelit resolusi tinggi `https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}` lengkap dengan label jalan dan kontur wilayah.
   - Tombol OSM telah dihapus sepenuhnya sesuai permintaan.
2. **Pembatasan Wilayah (Boundaries) Kota Blitar & Jatim**:
   - Diterapkan `maxBounds: [[-8.45, 111.90], [-7.90, 112.45]]`, `minZoom: 12`, dan `maxBoundsViscosity: 1.0`.
   - Peta terkunci rapat di kawasan operasional Teknolab Blitar dan tidak dapat digeser atau diperkecil ke seluruh dunia.
3. **Pencarian Bebas Getar (Jitter-Free Search Glide)**:
   - Penyebab getaran sebelumnya adalah pemanggilan animasi `flyTo` secara terus menerus pada setiap penekanan keyboard (`input` event).
   - Solusi: Memasang debounce timer 180ms dan menggantinya dengan `map.setView([lat, lng], 19, { animate: true, duration: 0.45 })` yang menghasilkan pergerakan kamera yang halus, presisi, dan seketika tanpa osilasi.
4. **Pemisahan Denah HO & MO (Arsitektur Ahmad Aziz)**:
   - Tombol switch denah: `[🏢 Denah HO (Gedung Atas)]` dan `[🏪 Denah MO (Gedung Bawah / Workshop)]`.
   - **Denah HO (`#svgBlueprintHO`)**: Menampilkan tata ruang gedung atas dari sketsa Aziz (Server Room, Lab IoT, Ruang Kerja Shift, Ruang Admin, Koridor Utama, Gudang Logistik, dan Pilar Kanopi Depan).
   - **Denah MO (`#svgBlueprintMO`)**: Menampilkan tata ruang gedung bawah (Workshop Elektronika & Perakitan IoT, serta Selasar dan Parkir Operasional).
5. **Editor Ruangan Interaktif (`#modalEditSingleRoom`)**:
   - Setiap polygon dan path ruangan pada SVG dapat diklik langsung dengan kursor tangan dan efek highlight biru menyala.
   - Mengklik ruangan membuka modal edit yang menampilkan ID zona ruangan, nama ruangan saat ini, dan input nama baru.
   - Tombol **Simpan Nama Ruangan**: Memperbarui teks SVG secara realtime dan menyimpannya ke `localStorage.getItem('taims_room_names')`.
   - Tombol **Hapus / Reset ke Default**: Mengembalikan penamaan ruangan ke standar arsitektur pabrik Teknolab.

---

### FOTO 2: Sinkronisasi Identitas Profil & Animasi Portal Login Cyber Industrial
**Permintaan Pengguna**:
1. Pada `history.html`, badge profil di pojok kanan atas sering kembali menjadi Tamu. Buat semuanya sinkron di seluruh halaman.
2. Pada halaman awal login (`index.html`), saat memilih peran (Super Admin, Admin, Tamu), tambahkan animasi industrial cyber yang elegan dan sesuai dengan standar web PT Tekno Lab.

**Solusi & Implementasi Teknis pada `history.html`, `index.html`, & `app.js`**:
1. **Sinkronisasi Profil Global Universal**:
   - Fungsi `syncUserAuthDisplay()` di `app.js` membaca `localStorage.getItem('taims_active_role')` seketika saat halaman dimuat.
   - Pada `history.html`, elemen avatar dan badge role kini langsung menampilkan peran aktif yang dipilih saat login (misal: `"Super Admin"`, `"Admin"`, atau `"Tamu"`) beserta warna aksen yang sinkron (Ungu untuk Super Admin, Cyan untuk Admin, Slate untuk Tamu).
2. **Animasi Portal Cyber Industrial di `index.html`**:
   - Tab pemilihan peran (`.login-role-selector-tabs`) kini memiliki animasi hover bercahaya, transisi neon glow, dan indikator aktif berdenyut (`anim-pulse`).
   - Setiap tab menampilkan badge hak akses yang menyala:
     - **Super Admin**: Badge bercahaya ungu `[CREATE] [READ] [ADD] [DELETE]`.
     - **Admin**: Badge biru cyan `[ADD] [READ] [DELETE]`.
     - **Tamu**: Badge netral slate `[READ ONLY]`.
   - Menambahkan efek cyber radar sweep dan background partikel industrial yang memantulkan identitas pengembang perangkat IoT dan automasi.

---

### FOTO 3: CRUD Lengkap Manajemen Pengguna (Create, Read, Edit, Delete)
**Permintaan Pengguna**:
Pada menu Pengguna (`users.html`), sediakan fitur manajemen pengguna yang dapat digunakan secara penuh (Create, Delete, Add, Edit) dan sesuai dengan fungsi aslinya.

**Solusi & Implementasi Teknis pada `users.html` & `style.css`**:
1. **Create / Add User**:
   - Tombol `+ Tambah Pengguna` membuka form penambahan dengan validasi lengkap (Nama, Email, Peran, Status).
   - Pengguna baru otomatis disimpan secara aman ke `localStorage.getItem('taims_local_users')` dan langsung disisipkan di baris teratas tabel pengguna.
2. **Read / Detail User Modal (`#detailUserModal`)**:
   - Tombol ikon mata (`.btn-action-view`) membuka modal detail pengguna lengkap dengan kartu ID, avatar inisial berwarna, status akun, alamat email, dan riwayat login terakhir.
3. **Edit / Update User Modal (`#editUserModal`)**:
   - Tombol edit (`.btn-action-edit-user`) membuka formulir perubahan data pengguna untuk memperbarui nama, email, hak akses (Super Admin / Admin / Tamu), dan status aktivasi.
   - Perubahan langsung disimpan dan tabel diperbarui tanpa memerlukan reload halaman.
4. **Delete User**:
   - Tombol hapus (`.btn-action-delete-user`) membuka konfirmasi modal hapus.
   - Data pengguna dihapus dari penyimpanan lokal dan baris tabel menghilang dengan animasi fade-out yang mulus.
5. **Pencarian Realtime (`#filterUsers`)**:
   - Bilah pencarian instan untuk memfilter pengguna berdasarkan nama, email, atau role secara langsung.

---

### FOTO 4: Perbaikan Bug Chart Donut Overflow pada Perangkat Mobile
**Permintaan Pengguna**:
Saat layar diperkecil ke ukuran smartphone / tablet, chart donut status perangkat di dashboard mengalami distorsi/terpotong dan ukurannya tidak sesuai.

**Solusi & Implementasi Teknis pada `style.css` & `dashboard.html`**:
1. **Flex-Direction Stacking & Alignment**:
   - Pada layar di bawah 768px dan 480px, layout `.donut-content-split` diubah dari horizontal row menjadi vertical column (`flex-direction: column; align-items: center; justify-content: center;`).
2. **Responsive Canvas Container**:
   - Kontainer canvas `.donut-circle-wrap` dibatasi dengan ukuran proporsional `max-width: 220px; width: 100%; aspect-ratio: 1 / 1;` dengan `margin: 0 auto;`.
   - Canvas Chart.js diset dengan `responsive: true, maintainAspectRatio: true` sehingga lingkaran chart donut tidak akan gepeng, lonjong, atau terpotong pada layar terkecil sekali pun.
3. **Statistik Kategori Rata Tengah**:
   - `.donut-category-stats-list` diubah menjadi lebar penuh (`width: 100%`) dengan grid rapi 2-kolom pada smartphone, membuat angka dan persentase perangkat terlihat sangat jelas.

---

### FOTO 5: Mesin Pengubah Tema Dinamis (Opsi 2: Cyber-Electric Dark)
**Permintaan Pengguna**:
Pada menu Pengaturan (`settings.html`), saat memilih **Opsi 2 - Cyber-Electric Dark**, tampilan web harus langsung berubah secara dinamis sesuai temanya, dengan efek animasi industrial yang lebih keren.

**Solusi & Implementasi Teknis pada `style.css`, `settings.html`, & `app.js`**:
1. **Arsitektur Dual-Theme CSS Variables**:
   - Dibuat variabel CSS global berbasis atribut `[data-theme="cyber"]` vs `[data-theme="midnight"]`:
     - **Opsi 1: Minimalist Midnight**: Tema gelap profesional dengan nuansa navy slate, kontras lembut, dan aksen biru industri.
     - **Opsi 2: Cyber-Electric Dark**: Tema SCADA futuristik dengan aksen Cyan elektrik (`#00F5FF`), neon glow box-shadow, garis border semi-transparan bercahaya, dan aksen gradient ungu-cyan yang sangat hidup.
2. **Instant Live Switching**:
   - Mengubah pilihan pada dropdown `#inputThemeMode` langsung mengeksekusi `window.applyThemeMode(val)` tanpa perlu me-refresh halaman.
   - Pilihan tema disimpan ke `localStorage.setItem('taims_theme_mode', val)` dan otomatis diaktifkan di seluruh 10 file halaman HTML saat dibuka.
3. **Animasi Industrial Cyber yang Lebih Menawan**:
   - Ditambahkan efek `cyberRadarPing` berdenyut pada lampu status telemetry.
   - Kartu metrik memiliki efek sweep highlight saat disentuh kursor mouse (*hover glow*).

---

## 3. Matriks Hak Akses (Role-Based Access Control / RBAC)

Sesuai permintaan hierarki izin kerja:

| Peran (Role) | Hak Akses Fitur | Deskripsi Operasional |
| :--- | :--- | :--- |
| **Super Admin** | `[CREATE]` `[READ]` `[ADD]` `[DELETE]` `[EDIT]` | Akses tanpa batas: Menambah, mengubah nama ruangan pada denah, mengedit perangkat & pengguna, menghapus data, dan mengonfigurasi interval sistem. |
| **Admin** | `[ADD]` `[READ]` `[DELETE]` | Akses operasional: Menambah & menghapus perangkat atau pengguna, memantau telemetri, mengekspor laporan. Tidak dapat mengedit nama ruangan denah arsitektur. |
| **Tamu** | `[READ ONLY]` | Akses pemantauan publik: Hanya dapat melihat metrik, status perangkat, peta lokasi, dan riwayat. Semua tombol manipulasi dinonaktifkan secara otomatis. |

---

## 4. Panduan Pengunduhan & Menjalankan Aplikasi

File hasil pengerjaan telah disiapkan di folder unduhan lokal komputer:

1. **Folder Ekstrak Langsung**:
   - Folder Revisi Dika: [`C:\Users\user\Downloads\taims-frontend-revised\`](file:///C:/Users/user/Downloads/taims-frontend-revised/)
   - Folder Teknolab Pro: [`C:\Users\user\Downloads\taims-frontend-teknolab-pro\`](file:///C:/Users/user/Downloads/taims-frontend-teknolab-pro/)

2. **File Arsip ZIP (Untuk Dikirimkan ke Reza Tri & Tim Teknolab)**:
   - File ZIP Revisi Dika: [`C:\Users\user\Downloads\taims-frontend-revised.zip`](file:///C:/Users/user/Downloads/taims-frontend-revised.zip)
   - File ZIP Teknolab Pro: [`C:\Users\user\Downloads\taims-frontend-teknolab-pro.zip`](file:///C:/Users/user/Downloads/taims-frontend-teknolab-pro.zip)

3. **Cara Menjalankan**:
   - Cukup buka salah satu folder di atas, lalu klik dua kali file **`index.html`** untuk mulai mencoba login sebagai **Super Admin**, **Admin**, atau **Tamu**.
   - Seluruh fitur berjalan murni pada sisi klien (Client-Side Standalone) dengan ketahanan data via browser `localStorage`, sehingga tidak memerlukan instalasi Node.js atau server database tambahan untuk pengujian.
