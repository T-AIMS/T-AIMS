-- =====================================================================
-- MIGRATION: Add created_at column to users table
-- Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
-- Referensi Masalah: BUG-003 & BUG-004 (GET /api/users & GET /api/auth/me)
-- Tanggal          : 16 Oktober 2026
-- =====================================================================

ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
