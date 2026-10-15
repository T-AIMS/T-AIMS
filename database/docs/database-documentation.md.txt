# T-AIMS Database Documentation

## 1. Gambaran Umum

T-AIMS menggunakan database `taims_db` untuk menyimpan informasi pengguna, aset perangkat, lokasi, insiden, pemeliharaan, pemantauan perangkat, dan notifikasi.

## 2. Teknologi yang Digunakan

- DBMS: MariaDB
- Antarmuka pengelolaan: phpMyAdmin
- Format file database: SQL
- File SQL referensi: `taims_db.sql`

## 3. Struktur Database

Database memiliki tujuh tabel utama:

| Nama Tabel | Fungsi |
|---|---|
| `users` | Menyimpan data pengguna |
| `locations` | Menyimpan data lokasi perangkat |
| `assets` | Menyimpan data aset |
| `incidents` | Mencatat insiden perangkat |
| `maintenance` | Mencatat pemeliharaan perangkat |
| `monitoring_logs` | Menyimpan riwayat pemantauan |
| `notifications` | Menyimpan notifikasi sistem |

## 4. Hasil Pemeriksaan Database Final

Berdasarkan pemeriksaan sebelumnya terhadap database final, jumlah data yang tercatat adalah:

| Tabel | Jumlah Data |
|---|---:|
| `users` | 6 |
| `locations` | 2 |
| `assets` | 16 |
| `incidents` | 3 |
| `maintenance` | 3 |
| `monitoring_logs` | 42 |
| `notifications` | 5 |

## 5. Hubungan Antar Tabel

- Aset terhubung dengan lokasi dan pengguna penanggung jawab.
- Insiden, pemeliharaan, dan monitoring logs terhubung dengan aset.
- Notifikasi terhubung dengan pengguna dan aset.

## 6. Pengelolaan dan Pemeliharaan

1. Lakukan backup sebelum perubahan besar.
2. Gunakan file SQL final yang telah disepakati tim.
3. Periksa struktur dan jumlah data setelah impor.
4. Koordinasikan perubahan database dengan anggota tim terkait.
5. Dokumentasikan perubahan penting agar mudah ditelusuri.

## 7. File Pendukung

- `database-schema.md`
- `database-migration.md`
- `asset-registry.md`
- `backup-restore-procedure.md`
- `ERD_TAIMS.png`
- `taims_db.sql`

## 8. Catatan

Dokumen ini menjadi panduan umum pengelolaan database T-AIMS. Informasi teknis lebih rinci dapat diperiksa melalui struktur tabel di phpMyAdmin dan file SQL referensi proyek.

Berdasarkan pemeriksaan database lokal, terdapat 7 tabel utama dengan jumlah data sebagai berikut: 6 pengguna, 2 lokasi, 16 aset, 3 insiden, 3 data pemeliharaan, 42 monitoring logs, dan 5 notifikasi.

Terdapat perbedaan schema yang perlu ditindaklanjuti: file `database/taims_db.sql` pada repository GitHub memiliki kolom `offline_since` di tabel `assets`, sedangkan kolom tersebut belum ditemukan pada struktur tabel database lokal saat diperiksa. Backend `backend/src/services/offline-checker.js` menggunakan kolom tersebut dalam query untuk memperbarui status perangkat.

Sinkronisasi schema perlu dikoordinasikan dengan tim backend sebelum perubahan diterapkan pada database lokal. Lakukan backup terlebih dahulu sebelum perubahan struktur atau impor ulang.