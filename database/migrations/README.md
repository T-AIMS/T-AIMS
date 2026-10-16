# Database Migrations
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Faida Trisma Amelia (*Database Administrator*) & Wafian (*DevOps Engineer*)  

Folder ini berisi file migrasi SQL terstruktur untuk pelacakan perubahan skema basis data T-AIMS.

## Konvensi Penamaan
`NOMOR_deskripsi.sql` atau `YYYYMMDD_deskripsi.sql`

## Cara Pakai
1. Jalankan berkas secara berurutan.
2. Setiap berkas menyediakan instruksi **UP** (migrasi) dan **DOWN** (rollback).
3. Catat berkas migrasi yang sudah dieksekusi ke dalam tabel rekam jejak.

## Daftar Migrasi

| No | File | Tanggal | Deskripsi | Status |
|:---|:---|:---:|:---|:---:|
| 001 | [`001_add_created_at_to_users.sql`](file:///mnt/d/xampp/htdocs/T-AIMS/database/migrations/001_add_created_at_to_users.sql) | 2026-10-16 | Menambahkan kolom `created_at` pada tabel `users` (Fix BUG-003, BUG-004, BUG-009) | ✅ Applied |
| 002 | [`002_create_token_blacklist.sql`](file:///mnt/d/xampp/htdocs/T-AIMS/database/migrations/002_create_token_blacklist.sql) | 2026-10-16 | Membuat tabel `token_blacklist` untuk membatalkan JWT pasca logout (Fix BUG-002, BUG-015) | ✅ Applied |
| 003 | [`20261016_add_created_at_to_users.sql`](file:///mnt/d/xampp/htdocs/T-AIMS/database/migrations/20261016_add_created_at_to_users.sql) | 2026-10-16 | Standar DevOps DDL untuk penambahan kolom `created_at` | ✅ Applied |
