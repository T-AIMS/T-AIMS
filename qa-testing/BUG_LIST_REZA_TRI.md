# BUG LIST & TRACKER — REZA TRI WARDANA
**Projek**    : T-AIMS (Teknolab Asset & Infrastructure Monitoring System)  
**QA Tester** : Reza Tri Wardana (Shift 2)  
**Lead**      : Dzakwan (Shift Lead & System Integration)  
**Update**    : 20 Oktober 2026 (Hari ke-8)  
**Status**    : 9 Bug Terdata | 9 Fixed & Verified (100% Resolved)

---

## DAFTAR BUG LENGKAP (API & FRONTEND UI)

| Bug ID | Modul / Layanan | Judul Ringkas Bug | Severity | Priority | PIC Developer | Status Akhir | Tanggal Verifikasi |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :---: |
| **BUG-001** | Auth API | Endpoint `POST /auth/change-password` return 404 Not Found | Medium | P2 | Ahmad Reza Fahmi | **VERIFIED PASS** | 14/10/2026 |
| **BUG-002** | Users API | Endpoint `GET /users/1` crash 500 Internal Server Error | High | P1 | Ahmad Reza Fahmi | **VERIFIED PASS** | 16/10/2026 |
| **BUG-003** | Auth API | Endpoint `GET /auth/me` return 500 saat validasi bearer token | High | P1 | Ahmad Reza Fahmi | **VERIFIED PASS** | 16/10/2026 |
| **BUG-004** | Security / Auth | Token JWT tidak di-blacklist / tetap valid setelah `POST /auth/logout` | High | P1 | Ahmad Reza Fahmi | **VERIFIED PASS** | 16/10/2026 |
| **BUG-005** | Frontend API Service | Domain auto-login salah `reza.fahmi@taims.local` (seharusnya `@taims_db.local`), menyebabkan 401 dan fallback 0 online | High | P1 | Dika Yoga Pratama / Reza Tri | **VERIFIED PASS** | 19/10/2026 |
| **BUG-006** | Frontend Dashboard UI | Angka jumlah dan persentase Donut Chart bertabrakan tanpa spasi ("212.5%", "318.8%") | Medium | P2 | Ahmad Aziz / Reza Tri | **VERIFIED PASS** | 19/10/2026 |
| **BUG-007** | Frontend Dashboard UI | Sub-label Uptime statis selalu "Operasional Stabil" (hijau) walau ketersediaan sistem rendah | Medium | P2 | Dika Yoga / Reza Tri | **VERIFIED PASS** | 19/10/2026 |
| **BUG-008** | Frontend Devices UI | Modal detail perangkat memaksa kelas CSS offline (badge merah) untuk perangkat status unknown | Low | P3 | Dika Yoga / Reza Tri | **VERIFIED PASS** | 19/10/2026 |
| **BUG-009** | Frontend Typography | Kontras teks rendah (`--text-dim: #64748B`) dan font terlalu kecil (8.5px - 9.5px) melanggar WCAG AA | Low | P3 | Ahmad Aziz / Reza Tri | **VERIFIED PASS** | 19/10/2026 |

---

## DETAIL INVESTIGASI BUG FRONTEND (HARI-7 & HARI-8)

### BUG-005: Salah Domain Kredensial Auto-Login Backend
- **File** : `apiService.js` (Baris 30)
- **Gejala** : Dashboard hanya menampilkan 16 aset fallback statis, ketersediaan 0%, perangkat online 0.
- **Penyebab** : Variabel `DEFAULT_AUTH.email` menggunakan domain `@taims.local`, sedangkan di tabel MySQL `users` pada `taims_db` domainnya adalah `@taims_db.local`.
- **Solusi** : Mengganti domain ke `reza.fahmi@taims_db.local`. Backend Express port 3000 merespons `200 OK` dan token tersimpan di `localStorage`.
- **Hasil Uji** : PASS (Data live 17 aset, 6 online, 11 unknown berhasil ditarik).

### BUG-006: Tabrakan Teks Angka dan Persentase Donut Chart
- **File** : `style.css` (Baris 1025) & `app.js` (Baris 555)
- **Gejala** : Teks legenda Chart Donut menyatu menjadi `212.5%` dan `318.8%`.
- **Penyebab** : Elemen `.cat-numbers` tidak memiliki aturan flexbox dan pemisah visual antara count (`strong`) dan percentage (`small`).
- **Solusi** : Menambahkan CSS `display: inline-flex; gap: 8px;`, styling badge cyan transparan untuk `small`, serta auto-scroll max-height 200px.
- **Hasil Uji** : PASS (Angka terpisah rapi dengan badge persentase berlatar cyan).

### BUG-007: Sub-Label Uptime Tidak Dinamis
- **File** : `app.js` (Baris 426)
- **Gejala** : Tulisan `"Operasional Stabil"` berwarna hijau tetap muncul saat uptime berada di angka 35.29%.
- **Penyebab** : Elemen `#kpi-sub-uptime` tidak memiliki logika pengkondisian berbasis nilai `availability_percent`.
- **Solusi** : Dibuatkan thresholding bertingkat: $\ge 90\%$ (Optimal/Hijau), $\ge 50\%$ (Sebagian Beroperasi/Kuning), $< 50\%$ (Perlu Perhatian/Merah).
- **Hasil Uji** : PASS (Uptime 35.29% menampilkan teks merah "Perlu Perhatian (35.29%)").

### BUG-008: Salah Badge Status pada Modal Detail Perangkat
- **File** : `app.js` (Baris 686)
- **Gejala** : Perangkat berstatus `unknown` diberi class `.tag-status-pill.offline` (badge merah) dengan tulisan `● UNKNOWN`.
- **Penyebab** : Operator ternary hanya mengecek `rawStat === 'online'` lalu langsung default ke `'offline'`.
- **Solusi** : Menambahkan pengecekan `rawStat === 'unknown' || rawStat === 'warning'` yang mengarahkan ke class `.warning` (amber badge).
- **Hasil Uji** : PASS (Modal NET-SWD-01 dan NET-SWA-01 menampilkan badge status yang tepat).

### BUG-009: Aksesibilitas Font & Kontras Warna Rendah
- **File** : `style.css` (Baris 19, 860, 1320, 2000)
- **Gejala** : Teks sub-label sulit dibaca di monitor standar dan gagal rasio kontras WCAG AA (< 4.5:1).
- **Penyebab** : `--text-dim: #64748B` terlalu gelap di atas latar belakang `#0D1527`, dan ukuran font berkisar 8.5px - 9.5px.
- **Solusi** : Menaikkan variabel `--text-dim` ke `#94A3B8` dan menaikkan font size ke 11px - 12px.
- **Hasil Uji** : PASS (Teks tajam, kontras tinggi, dan nyaman dibaca).

---

## LOG RE-TEST & VERIFIKASI AKHIR
- Seluruh 9 bug telah diuji ulang pada build final frontend (`c:\xampp\htdocs\taims-frontend-revised`) dan backend Express.js port 3000.
- Tidak ada blocker atau bug kritis terbuka (Open Bugs = 0).
- Deliverables pengujian telah disinkronkan ke direktori `docs/qa-testing/`.
