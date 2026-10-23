# LAPORAN DEFECT & DAFTAR REVISI FRONTEND DASHBOARD T-AIMS
**Ditujukan Kepada** : Dika Yoga Pratama (Frontend Dashboard Developer)  
**Penguji (QA)**     : Reza Tri Wardana (QA, Testing & Documentation Engineer)  
**Lead Shift 2**     : Dzakwan (Shift Lead & System Integration)  
**Tanggal Rilis**    : 20 Oktober 2026  
**Build Target**     : `taims-frontend-revised`  
**Status QA**        : Sudah dilakukan Hotfix & Verifikasi oleh QA (Catatan ini sebagai panduan refaktor permanen)

---

Halo Dika, berikut adalah rekapitulasi lengkap temuan bug, kesalahan logika, masalah visual, dan pelanggaran standar aksesibilitas yang ditemukan pada source code frontend dashboard hasil pengujian QA. 

Silakan jadikan dokumen ini sebagai checklist perbaikan di repositori utama agar kode frontend kita bersih, sinkron dengan database, dan memenuhi standar operasional SCADA Teknolab.

---

## 1. BUG KRITIS (FUNCTIONAL & INTEGRATION BLOCKER)

### [BUG-01] Salah Domain Kredensial Auto-Login Backend
* **Lokasi File**: `apiService.js` (Konstanta `DEFAULT_AUTH`)
* **Kode Bermasalah**:
  ```javascript
  const DEFAULT_AUTH = {
    email: 'reza.fahmi@taims.local', // ❌ DOMAIN SALAH
    password: 'password123'
  };
  ```
* **Penyebab & Dampak**:
  Database MySQL `taims_db` menggunakan domain `@taims_db.local` untuk seluruh akun (contoh: `reza.fahmi@taims_db.local`). Akibat typo domain ini, request login ke backend Express (port 3000) selalu mengembalikan status **`401 Unauthorized`**. Token JWT tidak pernah didapat, sehingga dashboard dipaksa masuk ke mode fallback tiruan (data offline 0, total hanya 16 aset, uptime 0%).
* **Solusi / Perbaikan**:
  Ubah domain menjadi `@taims_db.local`:
  ```javascript
  const DEFAULT_AUTH = {
    email: 'reza.fahmi@taims_db.local', // ✅ BENAR
    password: 'password123'
  };
  ```

---

### [BUG-02] Penanganan Fallback Riwayat Gangguan Menyebabkan Infinite Spinner
* **Lokasi File**: `apiService.js` (Fungsi `getIncidentLogs`)
* **Penyebab & Dampak**:
  Jika backend insiden belum melayani data atau mengalami timeout, fungsi `getIncidentLogs()` mengembalikan `null`. Pada halaman `history.html`, kondisi `null` tidak ditangani sehingga spinner loading `<i class="fa-solid fa-spinner fa-spin"></i>` berputar selamanya tanpa menampilkan pesan kesalahan atau fallback.
* **Solusi / Perbaikan**:
  Tambahkan array konstanta `FALLBACK_INCIDENTS` yang terstruktur di `apiService.js`, lalu return fallback tersebut jika request fetch ke backend gagal.

---

## 2. BUG VISUAL & LAYOUT (UI/UX DEFECTS)

### [BUG-03] Tabrakan Angka & Persentase pada Legenda Donut Chart Kategori
* **Lokasi File**: `app.js` (Fungsi `initDashboardCharts`) & `style.css`
* **Kode Bermasalah**:
  ```javascript
  <div class="cat-numbers">
    <strong>${cnt}</strong> <small>${pct}%</small>
  </div>
  ```
* **Penyebab & Dampak**:
  Elemen `.cat-numbers` tidak memiliki aturan CSS flexbox dan jarak pemisah (`gap`). Angka jumlah unit dan angka persentase bertabrakan rapat seperti **"212.5%"** (seharusnya 2 unit, 12.5%) atau **"318.8%"**. Pembaca dan klien Teknolab mengira perangkat mencapai ratusan persen.
* **Solusi / Perbaikan**:
  Tambahkan styling flexbox dan badge pill di `style.css`:
  ```css
  .cat-numbers {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .cat-numbers strong {
    color: var(--text-main);
    font-size: 12px;
    font-weight: 800;
  }
  .cat-numbers small {
    color: var(--accent-cyan);
    background: rgba(6, 182, 212, 0.12);
    border: 1px solid rgba(6, 182, 212, 0.25);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 10.5px;
    font-weight: 700;
  }
  ```

---

### [BUG-04] Ketinggian Kaku Panel Donut Menyebabkan Tabrakan dengan Tombol Header
* **Lokasi File**: `style.css` (Kelas `.donut-content-split`)
* **Kode Bermasalah**:
  ```css
  .donut-content-split {
    height: 190px; /* ❌ Ketinggian kaku */
  }
  ```
* **Penyebab & Dampak**:
  Database riil Teknolab memiliki 10 kategori aset (Router, Switch, CCTV, IoT, Server, PC, TV, Storage, AP, Firewall). Ketika 10 baris kategori ini di-render, tinggi daftar melebihi 190px sehingga teks kategori paling atas menabrak tombol header `"Lihat Detail →"`.
* **Solusi / Perbaikan**:
  Ganti `height: 190px` menjadi `min-height: 200px;` dan tambahkan `max-height: 200px; overflow-y: auto;` pada `.donut-category-stats-list`.

---

### [BUG-05] Salah Kelas CSS Status Badge pada Modal Detail Perangkat
* **Lokasi File**: `app.js` (Fungsi `openDetailModal`)
* **Kode Bermasalah**:
  ```javascript
  // ❌ Hanya mengecek online, sisanya dipaksa offline (merah)
  elPill.className = `tag-status-pill ${rawStat === 'online' ? 'online' : 'offline'}`;
  elPill.innerText = `● ${rawStat.toUpperCase()}`;
  ```
* **Penyebab & Dampak**:
  Ketika perangkat berstatus `unknown` atau `warning` diklik detailnya, lencana menampilkan tulisan `● UNKNOWN`, tetapi background-nya berwarna merah menyala milik status offline. Hal ini melanggar logika warna SCADA industri.
* **Solusi / Perbaikan**:
  Perbaiki logika penentuan kelas:
  ```javascript
  let statClass = 'offline';
  if (rawStat === 'online') statClass = 'online';
  else if (rawStat === 'unknown' || rawStat === 'warning') statClass = 'warning';

  elPill.className = `tag-status-pill ${statClass}`;
  elPill.innerText = `● ${rawStat.toUpperCase()}`;
  ```

---

## 3. BUG LOGIKA SCADA & TELEMETRI

### [BUG-06] Sub-Label Uptime Sistem Bersifat Hardcoded Statis
* **Lokasi File**: `dashboard.html` (Baris 185) & `app.js` (Fungsi `initDashboard`)
* **Kode Bermasalah**:
  ```html
  <small id="kpi-sub-uptime" class="kpi-change-text text-green">
    <i class="fa-solid fa-arrow-trend-up"></i> Operasional Stabil
  </small>
  ```
* **Penyebab & Dampak**:
  Teks `"Operasional Stabil"` dengan ikon panah hijau selalu muncul secara permanen, bahkan saat ketersediaan sistem rendah (misalnya 35% atau 0%). Hal ini berbahaya untuk sistem monitoring karena menyamarkan kondisi kegagalan perangkat.
* **Solusi / Perbaikan**:
  Buat pembaruan dinamis di `app.js` berbasis nilai ketersediaan riil:
  - $\ge 90\%$: Hijau (*Operasional Optimal*)
  - $\ge 50\%$: Kuning (*Sebagian Beroperasi*)
  - $< 50\%$: Merah (*Perlu Perhatian / Kritis*)

---

### [BUG-07] Indikator Denyut (Pulse Dot) dan Teks Sidebar Tidak Terkoneksi ke Status Riil
* **Lokasi File**: `dashboard.html` (Baris 57-63) & `app.js`
* **Kode Bermasalah**:
  ```html
  <div class="sidebar-status-box">
    <span class="status-pulse-dot"></span>
    <div class="status-text">
      <small>Sistem</small>
      <strong>Berjalan Normal</strong>
    </div>
  </div>
  ```
* **Penyebab & Dampak**:
  Indikator denyut selalu berwarna hijau `"Berjalan Normal"`. Operator di sisi kiri layar tidak mendapatkan peringatan jika ada gangguan di lapangan.
* **Solusi / Perbaikan**:
  Sambungkan elemen `.status-pulse-dot` dan `.status-text strong` dengan data `stats.offline`. Jika terdapat unit offline, lampu otomatis berkedip merah/kuning dan teks menampilkan jumlah perangkat yang terputus.

---

## 4. STANDAR AKSESIBILITAS (WCAG AA) & TIPOGRAFI

### [BUG-08] Ukuran Font Terlalu Kecil (Microscopic Text)
* **Lokasi File**: `style.css` (Baris 863-864, 1323) & `dashboard.html` (Baris 353-356)
* **Masalah**:
  Terdapat banyak elemen penting yang menggunakan ukuran font di bawah batas keterbacaan manusia:
  - `.kpi-sub-label` & `.kpi-change-text`: `9.5px`
  - `.telem-item small`: `8.5px`
  - Badge Denah 3D: `9px` dan `8.5px`
* **Solusi / Perbaikan**:
  Naikkan ukuran seluruh teks keterangan sekunder menjadi minimal **`11px`** hingga **`12px`**.

---

### [BUG-09] Kontras Warna Teks Redup Gagal Standar WCAG AA
* **Lokasi File**: `style.css` (Baris 19 pada root theme)
* **Kode Bermasalah**:
  ```css
  --text-dim: #64748B; /* ❌ Kontras rasio hanya 3.7:1 di atas background #0D1527 */
  ```
* **Penyebab & Dampak**:
  Warna `#64748B` terlalu gelap di atas latar belakang card dark mode, sehingga teks terlihat buram dan melelahkan mata operator monitor saat shift malam.
* **Solusi / Perbaikan**:
  Tingkatkan tingkat kecerahan variabel warna redup:
  ```css
  --text-dim: #94A3B8; /* ✅ Kontras tajam > 4.5:1 (WCAG AA Compliant) */
  ```

---

## RINGKASAN ACTION ITEM UNTUK DIKA:
1. [x] Perbaiki domain default email di `apiService.js` ke `@taims_db.local`.
2. [x] Tambahkan class flexbox `.cat-numbers` pada legenda Chart Donut.
3. [x] Berikan `min-height` dan `overflow-y` pada container list kategori donut.
4. [x] Pasang logika dinamis Uptime dan status pulse dot sidebar di `app.js`.
5. [x] Perbaiki penentuan status badge amber pada modal detail di `app.js`.
6. [x] Perbarui variabel `--text-dim` ke `#94A3B8` dan hapus semua inline font berukuran $< 10\text{px}$.

*Catatan: Seluruh perbaikan di atas sudah diverifikasi dan diuji coba oleh QA Reza Tri pada berkas revisi lokal dan berjalan 100% PASS.*

<!-- QA Standardization: 2026-10-22 | Lead QA: Reza Tri Wardana -->

