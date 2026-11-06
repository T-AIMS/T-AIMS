-- ==========================================
-- Migration 003: Add 'warning' to ENUM status
-- Tanggal: 23 Oktober 2026
-- Deskripsi: Menambahkan status 'warning' pada tabel assets dan logs
-- ==========================================

-- UP
ALTER TABLE `assets`
MODIFY COLUMN `current_status` ENUM('unknown','online','offline','warning','maintenance') NOT NULL DEFAULT 'unknown';

ALTER TABLE `monitoring_logs`
MODIFY COLUMN `status` ENUM('unknown','online','offline','error','warning') NOT NULL DEFAULT 'unknown';

-- DOWN
-- ALTER TABLE `assets` MODIFY COLUMN `current_status` ENUM('unknown','online','offline','maintenance') NOT NULL DEFAULT 'unknown';
-- ALTER TABLE `monitoring_logs` MODIFY COLUMN `status` ENUM('unknown','online','offline','error') NOT NULL DEFAULT 'unknown';