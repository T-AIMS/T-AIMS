# T-AIMS Backup and Restore Procedure

## 1. Tujuan

Dokumen ini menjelaskan prosedur pencadangan (backup) dan pemulihan (restore) database T-AIMS untuk mengurangi risiko kehilangan data.

## 2. Informasi Database

- Nama database: `taims_db`
- DBMS: MariaDB
- Tool: phpMyAdmin
- Format file backup: SQL (`.sql`)

## 3. Prosedur Backup

1. Buka phpMyAdmin.
2. Pilih database `taims_db`.
3. Klik menu **Export**.
4. Pilih metode **Quick** dan format **SQL**, jika tersedia.
5. Klik **Export** atau **Go**.
6. Simpan file hasil ekspor di lokasi yang aman.
7. Beri nama file dengan tanggal backup, misalnya `backup_taims_2026-10-14.sql`.
8. Pastikan file hasil ekspor tersedia sebelum melakukan perubahan database.

## 4. Prosedur Restore

1. Pastikan file backup yang akan digunakan benar dan dapat diakses.
2. Jika memungkinkan, uji pemulihan pada database pengujian terlebih dahulu.
3. Buka phpMyAdmin.
4. Pilih database tujuan yang sesuai.
5. Buka menu **Import**.
6. Pilih file SQL yang akan dipulihkan.
7. Jalankan impor.
8. Periksa tabel, struktur, dan jumlah data setelah proses selesai.

## 5. Tindakan Pencegahan

- Backup database sebelum melakukan impor atau perubahan besar.
- Jangan melakukan restore langsung pada database utama tanpa persetujuan tim.
- Pastikan file backup berasal dari sumber yang benar.
- Simpan salinan backup di lokasi yang aman.
- Catat tanggal, nama file, dan hasil pengujian backup atau restore.

## 6. Catatan

Prosedur ini merupakan panduan dokumentasi. Keberhasilan restore harus dibuktikan melalui pengujian dan pemeriksaan data setelah impor.

## 7. Catatan Hasil Pengujian

Setiap kegiatan backup dan restore perlu dicatat untuk memastikan proses dapat ditelusuri.

Informasi yang dicatat meliputi:

- Tanggal dan waktu pelaksanaan.
- Nama file backup.
- Database sumber dan database tujuan.
- Status proses, berhasil atau gagal.
- Hasil pemeriksaan tabel dan jumlah data.
- Kendala yang ditemukan dan tindakan yang dilakukan.

**Status saat ini:** Prosedur backup dan restore telah didokumentasikan. Pengujian pemulihan dari file backup perlu dilakukan dan dicatat secara terpisah sebelum dinyatakan berhasil.
