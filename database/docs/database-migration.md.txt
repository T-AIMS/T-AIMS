# T-AIMS Database Migration

## 1. Informasi File

- Nama database: `taims_db`
- DBMS: MariaDB
- File SQL referensi: `taims_db.sql`
- Pengelolaan database: phpMyAdmin

## 2. Tujuan

File SQL digunakan sebagai sumber untuk membuat struktur tabel dan mengisi data awal database T-AIMS.

## 3. Tabel Database

Database final terdiri dari tujuh tabel utama:

1. `users`
2. `locations`
3. `assets`
4. `incidents`
5. `maintenance`
6. `monitoring_logs`
7. `notifications`

## 4. Prosedur Penggunaan

1. Pastikan file SQL yang digunakan merupakan versi final dari repository proyek.
2. Lakukan backup database sebelum impor.
3. Impor file SQL melalui phpMyAdmin pada database yang sesuai.
4. Periksa struktur tabel dan jumlah data setelah impor.
5. Catat hasil pemeriksaan untuk dokumentasi.

## 5. Hasil Pengujian

Impor file SQL final sebelumnya berhasil dilakukan melalui phpMyAdmin. Pemeriksaan menunjukkan tujuh tabel utama dengan jumlah data sesuai referensi database final.

## 6. Catatan Keamanan

Impor ulang dapat mengganti data pada tabel yang disebutkan dalam file SQL. Selalu lakukan backup sebelum menjalankan impor ulang.

## 7. Sinkronisasi Schema

Hasil pemeriksaan menunjukkan bahwa file `database/taims_db.sql` pada repository GitHub sudah mendefinisikan kolom `offline_since` pada tabel `assets`. Kolom tersebut juga digunakan dalam query pada backend `offline-checker.js`.

Namun, kolom `offline_since` belum ditemukan pada struktur tabel `assets` di database lokal saat pemeriksaan dilakukan.

### Tindak Lanjut

1. Koordinasikan perbedaan schema dengan tim backend.
2. Pastikan versi SQL yang digunakan sesuai dengan versi proyek yang disepakati.
3. Lakukan backup database sebelum menerapkan perubahan schema.
4. Setelah perubahan disetujui, periksa kembali struktur tabel dan fungsi pemeriksaan status offline.

**Catatan:** Perubahan schema belum diterapkan pada database lokal saat dokumentasi ini dibuat.
