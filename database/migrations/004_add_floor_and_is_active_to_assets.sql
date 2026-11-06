-- ==========================================
-- Migration 002: Add floor and is_active to assets
-- Tanggal: 19 Oktober 2026
-- Deskripsi: Menambahkan kolom lantai (floor) dan status aktif (is_active)
-- ==========================================

-- UP
ALTER TABLE `assets`
ADD COLUMN `floor` varchar(50) DEFAULT NULL AFTER `location_id`,
ADD COLUMN `is_active` tinyint(1) NOT NULL DEFAULT 1 AFTER `current_status`;

-- DOWN
-- ALTER TABLE `assets` DROP COLUMN `floor`, DROP COLUMN `is_active`;