# Daftar Pelacakan Bug & Defek Sistem T-AIMS (*Bug List*)
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Dzakwan (*Shift Lead & System Integration*)  
**Pembaruan Terakhir:** 16 Oktober 2026 (Shift 2)  
**Status Keseluruhan:** 🟢 **16 / 16 CLOSED (ZERO DEFECT)**  

---

## Tabel Status 16 Defek Sistem (100% Terselesaikan)

| ID Bug | Tanggal | Deskripsi Masalah | Modul | Severity | PIC | Status | Tanggal Closed | Catatan Validasi / Remediasi |
|:---|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **BUG-001** | 12/10/2026 | Field `asset_code` bisa dikosongkan saat POST Assets | Backend | High | Ahmad Reza | **Closed** | 14 Oktober 2026 | Ditambahkan validasi wajib (*required*) di rute `assets.js`. |
| **BUG-002** | 12/10/2026 | Token JWT tidak kedaluwarsa setelah logout (masih valid 24 jam) | Auth | Critical | Ahmad Reza | **Closed** | 16 Oktober 2026 | Tabel `token_blacklist` dibuat di DB; middleware & route logout membatalkan token. |
| **BUG-003** | 12/10/2026 | Response time tidak tercatat saat pengujian ping timeout | Monitoring | Medium | Ananda | **Closed** | 14 Oktober 2026 | Monitoring engine otomatis menetapkan `response_time_ms = 0`. |
| **BUG-004** | 12/10/2026 | Filter `category` tidak bersifat case-insensitive | Backend | Medium | Ahmad Reza | **Closed** | 14 Oktober 2026 | Query SQL diperbarui menggunakan `LOWER(category) = LOWER(?)`. |
| **BUG-005** | 12/10/2026 | Pesan galat validasi formulir aset tidak informatif | Backend | Low | Ahmad Reza | **Closed** | 14 Oktober 2026 | Respons API distandarisasi mengembalikan detail array error JSON. |
| **BUG-006** | 14/10/2026 | Endpoint POST `/auth/change-password` mengembalikan 404 Not Found | Auth | Medium | Ahmad Reza | **Closed** | 16 Oktober 2026 | Handler rute dipasang di backend `auth.js` dan dialias pada rute `/auth` & `/api/auth`. |
| **BUG-007** | 14/10/2026 | Request GET `/users/1` menyebabkan backend crash (Error 500) | Users | High | Ahmad Reza | **Closed** | 16 Oktober 2026 | Verified oleh Reza Tri di Postman (200 OK - 7ms) pasca perbaikan parameter ID. |
| **BUG-008** | 14/10/2026 | Status di-hardcode 'online' di backend, status offline diabaikan | Backend | Medium | Ahmad Reza | **Closed** | 16 Oktober 2026 | Nilai status diubah dinamis membaca `payload.status`. |
| **BUG-009** | 15/10/2026 | Request GET `/auth/me` 500 karena kolom `created_at` hilang di tabel users | Database | High | Faida | **Closed** | 16 Oktober 2026 | Verified Postman (200 OK) untuk GET `/auth/me` dan GET `/users` (Commit `ad10c59`). |
| **BUG-010** | 16/10/2026 | Celah otentikasi (Auth bypass) pada file `frontend/index.html` | Frontend | Critical | Dika Yoga | **Closed** | 16 Oktober 2026 | Menambahkan pengecekan token JWT client-side: redirect jika belum login. |
| **BUG-011** | 16/10/2026 | Kata sandi WiFi ditulis langsung (*hardcoded*) di ESP32 ("icayangku") | Hardware | Critical | Ilvina | **Closed** | 16 Oktober 2026 | Kredensial WiFi dipindahkan ke `config.h` dan templat `config.h.example` (.gitignore). |
| **BUG-012** | 16/10/2026 | Kredensial database ditulis langsung di `monitoring_engine.py` | Network | Critical | Ananda | **Closed** | 16 Oktober 2026 | Diubah menggunakan variabel lingkungan `os.getenv()` terpusat. |
| **BUG-013** | 16/10/2026 | Mosquitto mengizinkan koneksi anonim (`allow_anonymous true`) | DevOps | High | Wafian | **Closed** | 16 Oktober 2026 | Wafian mengaktifkan mode dual-auth dan password file di Docker Mosquitto. |
| **BUG-014** | 16/10/2026 | Nilai `password_hash` bernilai NULL pada seed data user (Login Blocker) | Database | Critical | Faida | **Closed** | 16 Oktober 2026 | Faida & Wafian memperbarui seed SQL dengan hash password Bcrypt valid. |
| **BUG-015** | 16/10/2026 | Mekanisme pencabutan token (Token Revocation) pasca logout belum aktif | Auth | High | Ahmad Reza | **Closed** | 16 Oktober 2026 | Terhubung langsung dengan penutupan final BUG-002 via `token_blacklist`. |
| **BUG-016** | 16/10/2026 | Kolom `offline_since` belum otomatis diperbarui saat perangkat mati | Backend | High | Ahmad Reza | **Closed** | 16 Oktober 2026 | Query UPDATE assets di MQTT handler diperbarui menetapkan `offline_since = NOW()`. |

---

## Kesimpulan Kesiapan Kualitas (*Quality Gate*)
Dengan terselesaikannya seluruh 16 defek di atas, sistem T-AIMS telah memenuhi standar **Definition of Done** dan berstatus **Zero Defect** menjelang evaluasi Merge Phase.
