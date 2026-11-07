# T-AIMS Database Documentation

**Penanggung Jawab:** Faida Trisma Amelia  
**Peran:** Database & Asset Management Engineer  
**DBMS:** MySQL / MariaDB  
**Port lokal:** 3306  
**Nama database lokal:** `taims_db`  
**Status dokumentasi:** TERVERIFIKASI  
**Terakhir diperbarui:** 15 Oktober 2026

---

## 1. Tujuan

Folder ini berisi dokumentasi dan berkas SQL untuk mendukung pengelolaan database T-AIMS, termasuk audit kelengkapan data aset, persiapan pembaruan data, serta prosedur backup dan pemulihan database.

Database lokal yang diperiksa melalui phpMyAdmin bernama `taims_db`.

---

## 2. Isi Folder

| File | Status | Keterangan |
|---|---|---|
| `README.md` | Final | Panduan database, audit, dan backup |
| `audit_aset.sql` | Teruji | Query pemeriksaan kelengkapan aset, IP duplikat, PIC, MAC, dan lokasi |
| `audit_aset_backup.sql` | Cadangan | Salinan berkas audit sebelum dirapikan |
| `seed_data_update.sql` | DRAFT | Catatan persiapan pembaruan IP dan akun testing; belum siap dieksekusi |
| `taims_db.sql` | Terverifikasi | Dump SQL utama (11 tabel, sesuai database aktif) |

---

## 3. Struktur Database

Database `taims_db` memiliki **11 tabel**:

**Tabel utama (7):**
1. `assets` - 16 baris
2. `incidents` - 3 baris
3. `locations` - 2 baris
4. `maintenance` - 3 baris
5. `monitoring_logs` - 45 baris
6. `notifications` - 5 baris
7. `users` - 6 baris

**Tabel backup (4):**
8. `assets_backup_20261012`
9. `assets_backup_final_20261012`
10. `locations_backup_20261012`
11. `monitoring_logs_backup_20261012`

Status: Sudah diverifikasi sesuai dengan file `taims_db.sql`.

---

## 4. Audit Data Aset

File `audit_aset.sql` digunakan untuk memeriksa:
- Jumlah keseluruhan aset
- Jumlah aset tanpa alamat IP
- Jumlah aset tanpa alamat MAC
- Jumlah aset tanpa PIC
- Alamat IP duplikat
- MAC duplikat
- Referensi PIC orphan
- Referensi lokasi orphan

**Hasil audit (15 Oktober 2026):**

| Metrik | Nilai |
|---|---|
| Total aset | 16 |
| Tanpa IP | 0 |
| Tanpa MAC | 7 |
| Tanpa PIC | 7 |
| IP duplikat | 0 |
| MAC duplikat | 0 |
| PIC orphan | 0 |
| Lokasi orphan | 0 |

**Status:** Semua query berhasil dijalankan tanpa error.

**Catatan:** 7 aset tanpa MAC dan PIC didokumentasikan di `exception_asset.md` (menunggu verifikasi lapangan).

---

## 5. Persiapan Pembaruan Data Aset

File `seed_data_update.sql` berstatus **DRAFT - BELUM SIAP DIEKSEKUSI**.

Catatan penting:
- Alamat IP yang tercantum masih data dummy untuk simulasi.
- IP asli harus dikonfirmasi melalui survei atau sumber data jaringan.
- Nama perangkat harus dicocokkan dengan `asset_code`.
- Data akun testing harus dikoordinasikan dengan tim backend.
- Password tidak boleh disimpan dalam bentuk plaintext.
- Akun administrator yang sudah ada tidak boleh ditimpa tanpa persetujuan.

Jangan menjalankan pembaruan data sebelum informasi diverifikasi dan query ditinjau oleh tim.

---

## 6. Prosedur Backup Database

### Tujuan
Membuat salinan database untuk pemulihan data apabila terjadi kesalahan atau kehilangan data.

### Langkah backup
1. Buka phpMyAdmin melalui browser.
2. Pilih database `taims_db`.
3. Buka menu **Ekspor**.
4. Pilih metode **Cepat** (atau **Custom** jika perlu kontrol lebih).
5. Pilih format **SQL**.
6. Mulai ekspor.
7. Pastikan file berhasil diunduh dan ukurannya tidak kosong.
8. Simpan file pada lokasi yang aman.

### Catatan backup
- Nama file backup: `backup_taims_20261015.sql`
- Ukuran: 43 KB
- Lokasi: `T-AIMS-main/backup/`
- Tanggal backup: 15 Oktober 2026
- Status: Sudah dibuat

---

## 7. Prosedur Pemulihan (Restore)

Pengujian restore dilakukan pada database terpisah, bukan pada database aktif.

### Langkah restore
1. Pastikan file backup tersedia dan berasal dari database yang benar.
2. Siapkan database pengujian terpisah: `taims_restore_test`.
3. Periksa target database sebelum melakukan impor.
4. Impor file SQL ke database pengujian.
5. Periksa struktur tabel dan jumlah data hasil pemulihan.
6. Bandingkan dengan database asli.
7. Catat hasil pengujian.

### Hasil pengujian restore (15 Oktober 2026)

| Item | Database Asli (`taims_db`) | Database Uji (`taims_restore_test`) | Status |
|---|---|---|---|
| Jumlah tabel | 11 | 11 | Sama |
| Tabel `assets` (baris) | 16 | 16 | Sama |
| Struktur tabel | Sesuai | Sesuai | Sama |

**Status:** Restore berhasil 100%

---

## 8. Verifikasi Sebelum Finalisasi

Checklist pekerjaan:

- [x] Memastikan struktur `taims_db.sql` sesuai dengan database aktif.
- [x] Memastikan daftar file dokumentasi sesuai dengan folder proyek.
- [x] Menguji query dalam `audit_aset.sql`.
- [x] Mencatat hasil audit aset.
- [x] Mendokumentasikan aset yang belum lengkap (`exception_asset.md`).
- [x] Menguji backup database.
- [x] Menguji restore pada database pengujian terpisah.
- [ ] Memverifikasi IP dan pemetaan `asset_code` sebelum pembaruan (menunggu survei lapangan).
- [ ] Mengoordinasikan kebutuhan akun testing dengan tim backend (menunggu Reza).
- [ ] Memastikan dokumentasi dan berkas sudah diunggah ke repository tim.

---

## 9. Catatan Keamanan

- Jangan menjalankan query yang belum diverifikasi.
- Jangan mengimpor dump ke database aktif tanpa memastikan target dan dampaknya.
- Jangan membagikan password, token, atau kredensial database.
- Simpan backup di lokasi yang aman dan batasi aksesnya.
- Koordinasikan perubahan skema atau data dengan anggota tim yang bertanggung jawab.

---

## 10. Status Akhir

**Progress 5 Output Wajib T-AIMS: SELESAI**

| No | Komponen | Status |
|---|---|---|
| 1 | Database Schema | Selesai |
| 2 | Migration / SQL | Selesai |
| 3 | Asset Registry | Selesai (dengan exception) |
| 4 | Backup Procedure | Selesai |
| 5 | Database Documentation | Selesai |

**Pending (bukan blocker):**
- Verifikasi IP asli (menunggu Ananda)
- Hash password akun testing (menunggu Reza)
- Data MAC & PIC 7 aset (menunggu survei lapangan)

---

## 11. Changelog

### 2026-10-16 — BUG-009 Fixed
- **Masalah:** Endpoint GET /auth/me error 500
- **Penyebab:** Tabel `users` tidak punya kolom `created_at`
- **Solusi:** Tambah kolom `created_at` via ALTER TABLE
- **Query:** ALTER TABLE users ADD COLUMN created_at timestamp NOT NULL DEFAULT current_timestamp() AFTER role;
- **Status:** Fixed & verified (6 user terisi)
- **File di-update:** `taims_db.sql` (CREATE TABLE + INSERT INTO)
- **Backup:** `backup_users_20261015.sql`
- **Test import:** Berhasil di `taims_test_schema` (11 tabel, 6 user)

---

---

## 12. File SQL di Folder Ini

| File | Isi | Cara Pakai |
|---|---|---|
| `schema.sql` | Struktur tabel (DDL) | Setup database baru (buat tabel) |
| `seed.sql` | Data contoh (DML) | Isi data test |
| `taims_db.sql` | Full dump (DDL + DML) | Backup lengkap |
| `audit_aset.sql` | Query audit (read-only) | Cek kualitas data |
| `seed_data_update.sql` | Draft | Persiapan update |
| `migrations/` | File migrasi SQL terstruktur | Lihat folder `migrations/` |

### Urutan Setup Database Baru

1. Import `schema.sql` (bikin struktur tabel)
2. Import `seed.sql` (isi data awal)
3. Jalankan `audit_aset.sql` (verifikasi data)

### Catatan: Jumlah Tabel Database

Database `taims_db` saat ini memiliki **12 tabel**:
- 11 tabel awal
- 1 tabel baru: `token_blacklist` (untuk BUG-002 logout token revocation)
