# T-AIMS Database Schema

## 1. Informasi Database

- Nama database: `taims_db`
- DBMS: MariaDB
- Tool pengelolaan: phpMyAdmin
- Sumber referensi: `taims_db.sql`
- Status: Database final telah diuji melalui impor dan pemeriksaan jumlah data.

## 2. Daftar Tabel Utama

| No. | Nama Tabel | Fungsi |
|---|---|---|
| 1 | `users` | Menyimpan data pengguna sistem |
| 2 | `locations` | Menyimpan data lokasi perangkat |
| 3 | `assets` | Menyimpan data aset atau perangkat |
| 4 | `incidents` | Mencatat insiden perangkat |
| 5 | `maintenance` | Mencatat pemeliharaan perangkat |
| 6 | `monitoring_logs` | Menyimpan riwayat pemeriksaan perangkat |
| 7 | `notifications` | Menyimpan notifikasi sistem |

## 3. Relasi Antar Tabel

- `assets.location_id` terhubung ke `locations.location_id`.
- `assets.pic_user_id` terhubung ke `users.user_id`.
- `incidents.asset_id` terhubung ke `assets.asset_id`.
- `maintenance.asset_id` terhubung ke `assets.asset_id`.
- `monitoring_logs.asset_id` terhubung ke `assets.asset_id`.
- `notifications.user_id` terhubung ke `users.user_id`.
- `notifications.asset_id` terhubung ke `assets.asset_id`.

Kolom yang terhubung tersebut menggunakan foreign key untuk menjaga hubungan antar data.

## 4. Kolom Penting Tabel Assets

| Nama Kolom | Tipe Data | Fungsi |
|---|---|---|
| `offline_since` | `DATETIME` | Mencatat waktu ketika aset terdeteksi offline. Nilai awal dapat berupa `NULL`. |

Kolom `offline_since` digunakan oleh backend pada proses pemeriksaan status perangkat offline. Kolom ini tersedia pada file SQL di repository GitHub, tetapi belum ditemukan pada struktur tabel `assets` di database lokal saat pemeriksaan dilakukan.

Perbedaan schema tersebut perlu dikoordinasikan dengan tim backend sebelum database lokal diperbarui.

## 5. Hasil Validasi Database

| Pemeriksaan | Hasil yang Diharapkan |
|---|---:|
| Total aset | 16 |
| Total insiden | 3 |
| Total lokasi | 2 |
| Total maintenance | 3 |
| Total monitoring logs | 42 |
| Total notifikasi | 5 |
| Total pengguna | 6 |
| Aset tanpa IP | 0 |

## 6. Catatan

Database final mengacu pada file `taims_db.sql` dari repository proyek. Sebelum melakukan perubahan atau impor ulang, lakukan backup database terlebih dahulu.

Dokumen ini menjelaskan tabel utama dan relasinya. Detail kolom dan tipe data dapat dilihat melalui struktur tabel di phpMyAdmin.