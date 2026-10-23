# MEMO TEKNIS QA & DAFTAR INSTRUKSI PERBAIKAN DASHBOARD T-AIMS
**Nomor Dokumen** : T-AIMS/QA/MEMO-DEV/2026/004  
**Ditujukan Kepada**: Dzakwan Miftahussobirin (Shift Lead & System Integration - Shift 2)  
**Tembusan**        : Dika Yoga Pratama (Frontend Dev), Ahmad Aziz (UI/UX Designer), Damar Munajad (Shift 1 Coordinator)  
**Dari**            : Reza Tri Wardana (Lead QA & Documentation Engineer)  
**Tanggal**         : 20 Oktober 2026 (Shift 2)  
**Target Build**    : `dashboard.html` / `index.html` (Website T-AIMS)  
**Status Evaluasi** : ⚠️ **ACTION REQUIRED — REVISI SEBELUM MILESTONE HARI 10**

---

## 1. PENGANTAR EVALUASI LEAD QA
Halo Mas Dzakwan,

Berdasarkan audit komprehensif yang telah saya lakukan terhadap web dashboard T-AIMS (`dashboard.html` / `index.html`) per shift malam ini, secara keseluruhan arsitektur antarmuka, tema *Cyber Dark SCADA*, dan integrasi peta spasial Leaflet GIS Blitar sudah berjalan sangat memuaskan.

Namun, untuk memastikan antarmuka siap dipresentasikan ke Mentor Teknolab dan tidak memicu defect saat pengujian Milestone Hari ke-10, berikut adalah **daftar instruksi perbaikan konkret** yang perlu segera dieksekusi bersama Dika Yoga dan Ahmad Aziz.

---

## 2. DAFTAR INSTRUKSI & PERBAIKAN SPESIFIK (7 ACTION ITEMS)

### 🔴 INSTRUKSI 1: Atasi Tumpukan Toast Notifikasi yang Menutupi Kartu Pemeliharaan
* **Lokasi File**: `assets/css/style.css` & `assets/js/app.js` (Fungsi `showToast`)
* **Masalah Temuan QA**: 
  Banner toast *"Mode Live Update (5s)"* muncul di pojok kanan bawah dan menimpa kartu ke-4 Ringkasan Pemeliharaan (*"Selesai Minggu Ini"*). Teks kartu menjadi bertumpuk dan tidak terbaca.
* **Tindakan Perbaikan**:
  1. Tambahkan jarak `margin-bottom: 32px` pada kontainer `.maintenance-section` agar ada ruang aman di bagian bawah halaman.
  2. Posisikan container toast (`#toast-container`) dengan `z-index: 9999` dan beri offset bawah `bottom: 24px; right: 24px;`.
  3. Pastikan toast otomatis menghilang (*auto-dismiss*) setelah 4 detik.
* **Referensi Solusi Kode (`style.css`)**:
  ```css
  /* Berikan padding bawah agar konten terbawah tidak tertimpa toast */
  .main-content {
      padding-bottom: 60px !important;
  }
  .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      pointer-events: none;
  }
  .toast {
      pointer-events: auto;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 229, 255, 0.2);
  }
  ```

---

### 🔴 INSTRUKSI 2: Dinamiskan Lebar Progress Bar Sparkline pada 6 Kartu KPI
* **Lokasi File**: `index.html` (Baris 331, 348, 365) & `assets/js/app.js` (Fungsi `updateKpiCards`)
* **Masalah Temuan QA**:
  Lebar garis mini-sparkline di bawah kartu KPI masih berupa nilai statis (*hardcoded* di template HTML, contoh: `style="width: 71.5%; background: #10B981;"` dan `width: 10.6%`). Akibatnya, saat data perangkat 100% disconnected (15 aset offline), barnya tidak bergerak mengikuti persentase riil.
* **Tindakan Perbaikan**:
  Beri atribut ID pada masing-masing `.bar-fill` dan perbarui nilainya secara dinamis di `app.js` mengikuti persentase real-time:
* **Referensi Solusi Kode (`assets/js/app.js`)**:
  ```javascript
  // Di dalam fungsi updateKpiCards(total, online, offline, warning):
  const barOnline = document.getElementById('bar-fill-online');
  const barOffline = document.getElementById('bar-fill-offline');
  const barWarning = document.getElementById('bar-fill-warning');

  if (barOnline) barOnline.style.width = `${onPct}%`;
  if (barOffline) barOffline.style.width = `${offPct}%`;
  if (barWarning) barWarning.style.width = `${warnPct}%`;
  ```

---

### 🟡 INSTRUKSI 3: Tambahkan Ilustrasi "Empty State" pada Kartu Riwayat Gangguan
* **Lokasi File**: `index.html` (ID `#home-alerts-list`) & `assets/js/app.js`
* **Masalah Temuan QA**:
  Ketika sistem beroperasi normal (tidak ada tiket gangguan aktif), kartu ketiga *"Riwayat Gangguan / Peringatan"* hanya menampilkan kotak kosong hitam pekat yang terlihat seperti komponen rusak / gagal memuat data (*broken state*).
* **Tindakan Perbaikan**:
  Tampilkan komponen *Empty State* yang ramah pengguna jika panjang array insiden bernilai 0.
* **Referensi Solusi Kode (`assets/js/app.js`)**:
  ```javascript
  if (!alerts || alerts.length === 0) {
      alertsContainer.innerHTML = `
          <div class="empty-state-cyber" style="text-align: center; padding: 2.5rem 1rem;">
              <i class="fa-solid fa-shield-check text-green" style="font-size: 2rem; margin-bottom: 0.75rem;"></i>
              <h5 style="color: #F8FAFC; margin-bottom: 0.25rem;">Tidak Ada Gangguan Aktif</h5>
              <p style="color: #64748B; font-size: 0.8rem;">Seluruh 15 perangkat Teknolab beroperasi dalam parameter normal.</p>
          </div>
      `;
      return;
  }
  ```

---

### 🟡 INSTRUKSI 4: Perbaiki Glitch Abu-abu Peta Leaflet Saat Pergantian Halaman SPA
* **Lokasi File**: `assets/js/app.js` (Fungsi `switchPage`)
* **Masalah Temuan QA**:
  Saat pengguna berpindah modul (misalnya dari Dashboard ke Lokasi atau sebaliknya), kanvas peta Leaflet GIS terkadang mengalami rendering abu-abu sebagian (*tile clipping*) karena ukuran container berubah saat elemen tersembunyi (`display: none`).
* **Tindakan Perbaikan**:
  Panggil fungsi `invalidateSize()` milik Leaflet setiap kali tab aktif ditampilkan:
* **Referensi Solusi Kode (`assets/js/app.js`)**:
  ```javascript
  function switchPage(pageId) {
      // ... logika ganti class active halaman ...

      // Pemicu reflow Leaflet map agar tidak ada bagian abu-abu
      setTimeout(() => {
          if (window.homeBlitarMap && typeof window.homeBlitarMap.invalidateSize === 'function') {
              window.homeBlitarMap.invalidateSize();
          }
          if (window.fullBlitarMap && typeof window.fullBlitarMap.invalidateSize === 'function') {
              window.fullBlitarMap.invalidateSize();
          }
      }, 150);
  }
  ```

---

### 🟡 INSTRUKSI 5: Reset Nomor Halaman (Pagination) ke Page 1 Saat Pengguna Memfilter Aset
* **Lokasi File**: `assets/js/app.js` (Modul Devices Table)
* **Masalah Temuan QA**:
  Jika pengguna sedang membuka Page 2 pada tabel perangkat, lalu memilih filter kategori *"Server"* (yang jumlah datanya hanya 4 unit / 1 halaman), tabel langsung kosong karena sistem tetap mencari data pada index offset Page 2.
* **Tindakan Perbaikan**:
  Di setiap fungsi event listener filter kategori, pencarian (search input), atau status, tambahkan baris:
  ```javascript
  APP_STATE.devicesCurrentPage = 1; // Wajib reset ke halaman pertama
  renderDevicesTable();
  ```

---

### 🔵 INSTRUKSI 6: Tambahkan Modal Konfirmasi Penghapusan (Aksi Destruktif)
* **Lokasi File**: `index.html` & `assets/js/app.js` (Tombol Hapus Aset / Hapus Pengguna)
* **Masalah Temuan QA**:
  Aksi penghapusan data aset saat ini tidak memiliki dialog konfirmasi ganda. Hal ini sangat berisiko tertekan secara tidak sengaja (*accidental click*), terutama pada pengujian layar sentuh mobile/tablet.
* **Tindakan Perbaikan**:
  Wajib memunculkan modal popup dialog konfirmasi:
  *"Apakah Anda yakin ingin menghapus perangkat [Nama Aset]? Tindakan ini tidak dapat dibatalkan."* dengan tombol Batal dan Konfirmasi Hapus berwarna merah.

---

### 🟢 INSTRUKSI 7: Tambahkan Atribut Aksesibilitas (`aria-label`) pada Seluruh Icon Button
* **Lokasi File**: `index.html` (Navbar, Topbar, Sidebar Toggle)
* **Masalah Temuan QA**:
  Audit aksesibilitas (WCAG AA 2.1) menemukan beberapa tombol icon-only (seperti tombol lonceng notifikasi, toggle sidebar hamburger, dan tombol modal AI) tidak memiliki teks label, sehingga tidak terbaca oleh *screen reader* penyandang disabilitas.
* **Tindakan Perbaikan**:
  Tambahkan atribut `aria-label` dan `title`:
  ```html
  <!-- Sebelum -->
  <button class="icon-btn" onclick="toggleSidebar()"><i class="fa-solid fa-bars"></i></button>

  <!-- Sesudah (Standar WCAG AA) -->
  <button class="icon-btn" onclick="toggleSidebar()" aria-label="Buka atau Tutup Menu Navigasi" title="Toggle Sidebar"><i class="fa-solid fa-bars"></i></button>
  ```

---

## 3. TABEL REKAPITULASI ACTION ITEMS UNTUK SPRINT REVISI

| No | Komponen | Prioritas | PIC | Target Selesai |
|:---:|---|:---:|:---:|:---:|
| **1** | Fix Overlap Toast & Padding Bawah | 🔴 **High** | Dika Yoga | Hari-10 (Awal Shift) |
| **2** | Dynamic Sparklines 6 KPI Cards | 🔴 **High** | Dika Yoga | Hari-10 (Awal Shift) |
| **3** | Empty State Riwayat Gangguan | 🟡 **Medium** | Ahmad Aziz | Hari-10 |
| **4** | Leaflet Resize Fix (`invalidateSize`) | 🟡 **Medium** | Dika Yoga | Hari-10 |
| **5** | Reset Pagination Filter Aset | 🟡 **Medium** | Dika Yoga | Hari-10 |
| **6** | Modal Konfirmasi Delete Data | 🔵 **Normal** | Dika Yoga | Hari-11 |
| **7** | Atribut Aksesibilitas `aria-label` | 🟢 **Low** | Ahmad Aziz | Hari-11 |

---

## 4. LEMBAR PENGESAHAN MEMO TEKNIS

| Pengirim (Lead QA) | Penerima (Shift Lead & Integrator) |
|:---:|:---:|
| **Reza Tri Wardana** | **Dzakwan Miftahussobirin** |
| `[DISERAHKAN RESMI — 20 OKTOBER 2026]` | `[MENUNGGU TINDAK LANJUT DEV]` |

---
*Dokumen ini merupakan bagian dari Prosedur Kontrol Kualitas QA T-AIMS PT Teknolab Caraka Internasional.*

<!-- QA Standardization: 2026-10-22 | Lead QA: Reza Tri Wardana -->

