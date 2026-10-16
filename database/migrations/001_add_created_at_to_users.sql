-- ==========================================
-- Migration 001: Add created_at to users
-- Tanggal: 2026-10-16
-- Deskripsi: Menambahkan kolom created_at 
--            untuk memperbaiki BUG-009
-- ==========================================

-- UP (jalankan untuk migrasi)
ALTER TABLE `users`
ADD COLUMN `created_at` timestamp NOT NULL 
DEFAULT current_timestamp() 
AFTER `role`;

-- DOWN (jalankan untuk rollback)
-- ALTER TABLE `users` DROP COLUMN `created_at`;