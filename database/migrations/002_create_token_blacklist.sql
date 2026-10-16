-- =====================================================================
-- MIGRATION 002: Create token_blacklist table
-- Penanggung Jawab : Wafian (DevOps) & Faida (Database Administrator)
-- Referensi Masalah: BUG-002 & BUG-015 (Token Revocation / Logout Blacklist)
-- Tanggal          : 16 Oktober 2026
-- =====================================================================

-- UP
CREATE TABLE IF NOT EXISTS `token_blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` text NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`(255)),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- DOWN
-- DROP TABLE IF EXISTS `token_blacklist`;
