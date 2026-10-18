-- ==============================================================================
-- T-AIMS FULL DATABASE DUMP (DDL + DML)
-- Proyek        : T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
-- Penanggung Jwb: Database & Asset Management (Faida) & DevOps (Wafian)
-- Tanggal Rilis : 18 Oktober 2026 (v1.1 Production Master)
-- Status        : 100% Clean Master (Zero Backup Artifacts)
-- ==============================================================================

-- ==============================================================================
-- T-AIMS DATABASE SCHEMA (DDL)
-- Proyek        : T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
-- Penanggung Jwb: Database & Asset Management (Faida) & DevOps (Wafian)
-- Tanggal Rilis : 18 Oktober 2026 (v1.1 Production Master)
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `taims_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `taims_db`;

-- --------------------------------------------------------
-- 1. Tabel locations
-- --------------------------------------------------------
DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 2. Tabel users
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 3. Tabel assets
-- --------------------------------------------------------
DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
  `asset_id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_code` varchar(50) NOT NULL,
  `asset_name` varchar(150) NOT NULL,
  `category` varchar(80) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `mac_address` varchar(17) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `pic_user_id` int(11) DEFAULT NULL,
  `monitoring_method` varchar(100) NOT NULL,
  `monitoring_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`monitoring_config`)),
  `current_status` enum('unknown','online','offline','maintenance') NOT NULL DEFAULT 'unknown',
  `priority` int(11) DEFAULT 2,
  `last_seen` datetime DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `check_interval_seconds` int(11) NOT NULL DEFAULT 60,
  `timeout_seconds` int(11) NOT NULL DEFAULT 5,
  `retry_count` int(11) NOT NULL DEFAULT 3,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `offline_since` datetime DEFAULT NULL,
  PRIMARY KEY (`asset_id`),
  UNIQUE KEY `uq_asset_code` (`asset_code`),
  KEY `fk_assets_locations` (`location_id`),
  KEY `fk_assets_users` (`pic_user_id`),
  CONSTRAINT `fk_assets_locations` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_assets_users` FOREIGN KEY (`pic_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 4. Tabel incidents
-- --------------------------------------------------------
DROP TABLE IF EXISTS `incidents`;
CREATE TABLE `incidents` (
  `incident_id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(11) NOT NULL,
  `detected_at` datetime NOT NULL,
  `incident_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  `incident_status` enum('open','investigating','resolved','closed') NOT NULL DEFAULT 'open',
  `resolved_at` datetime DEFAULT NULL,
  `resolution_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`incident_id`),
  KEY `fk_incidents_assets` (`asset_id`),
  CONSTRAINT `fk_incidents_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 5. Tabel maintenance
-- --------------------------------------------------------
DROP TABLE IF EXISTS `maintenance`;
CREATE TABLE `maintenance` (
  `maintenance_id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(11) NOT NULL,
  `scheduled_date` datetime NOT NULL,
  `completion_date` datetime DEFAULT NULL,
  `maintenance_type` enum('preventive','corrective','upgrade') NOT NULL DEFAULT 'preventive',
  `status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`maintenance_id`),
  KEY `fk_maintenance_assets` (`asset_id`),
  CONSTRAINT `fk_maintenance_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 6. Tabel monitoring_logs
-- --------------------------------------------------------
DROP TABLE IF EXISTS `monitoring_logs`;
CREATE TABLE `monitoring_logs` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(11) NOT NULL,
  `check_time` datetime NOT NULL,
  `status` enum('online','offline','unknown','maintenance') NOT NULL,
  `response_time_ms` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`log_id`),
  KEY `fk_monitoring_logs_assets` (`asset_id`),
  CONSTRAINT `fk_monitoring_logs_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 7. Tabel notifications
-- --------------------------------------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `asset_id` int(11) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`notification_id`),
  KEY `fk_notifications_users` (`user_id`),
  KEY `fk_notifications_assets` (`asset_id`),
  CONSTRAINT `fk_notifications_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_notifications_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 8. Tabel token_blacklist
-- --------------------------------------------------------
DROP TABLE IF EXISTS `token_blacklist`;
CREATE TABLE `token_blacklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token_hash` varchar(64) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- ==============================================================================
-- T-AIMS DATABASE SEED DATA (DML)
-- Proyek        : T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
-- Penanggung Jwb: Database & Asset Management (Faida) & DevOps (Wafian)
-- Tanggal Rilis : 18 Oktober 2026 (v1.1 Production Master)
-- ==============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

USE `taims_db`;


--
-- Dumping data untuk tabel `locations`
--
INSERT INTO `locations` (`location_id`, `location_name`, `description`) VALUES
(1, 'Marketing Office', 'Lokasi perangkat untuk pengujian T-AIMS dan workstation'),
(2, 'Head Office', 'Pusat rack server, switch backbone, firewall, dan storage'),
(3, 'House of Server', 'Ruang server utama dan fasilitas infrastruktur inti');


--
-- Dumping data untuk tabel `users` (13 Akun Resmi Tim T-AIMS - Password terenkripsi Bcrypt)
--
INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Admin T-AIMS', 'admin@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'super_admin', '2026-10-11 22:34:53'),
(2, 'Ananda Dwi Susanti', 'ananda@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(3, 'Ilvina Muvarika', 'ilvina@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(4, 'Faida Trisma Amelia', 'faida@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(5, 'Ahmad Reza Fahmi', 'reza.fahmi@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(6, '[DATA UJI] Operator Monitoring Lab', 'operator.uji@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'user', '2026-10-11 22:34:53'),
(7, 'Damar Munajad', 'damar@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(8, 'Dzakwan', 'dzakwan@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(9, 'Dika Yoga', 'dika.yoga@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(10, 'Ahmad Aziz', 'ahmad.aziz@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(11, 'Arik', 'arik@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(12, 'Wafian', 'wafian@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-11 22:34:53'),
(13, 'Reza Tri', 'rezatri@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'user', '2026-10-11 22:34:53');


--
-- Dumping data untuk tabel `assets` (17 Aset Baru Lengkap dengan MAC, Deskripsi, Tanggal Instalasi & Monitoring Config)
--
INSERT INTO `assets` (`asset_id`, `asset_code`, `asset_name`, `category`, `ip_address`, `mac_address`, `location_id`, `pic_user_id`, `monitoring_method`, `monitoring_config`, `current_status`, `priority`, `last_seen`, `installation_date`, `description`, `check_interval_seconds`, `timeout_seconds`, `retry_count`, `created_at`, `updated_at`, `offline_since`) VALUES
(1, 'CCTV-01', 'CCTV Head Office', 'CCTV', '192.168.1.1', '00:0C:29:11:01:01', 2, 2, 'Ping', '{"http_path": "/", "timeout_seconds": 5, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-01', 'Kamera pengawas CCTV area gerbang utama Head Office', 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(2, 'CCTV-02', 'CCTV Marketing', 'CCTV', '192.168.2.2', '00:0C:29:11:01:02', 1, 2, 'Ping', '{"http_path": "/", "timeout_seconds": 5, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-01', 'Kamera pengawas CCTV area resepsionis Marketing Office', 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(3, 'RTR-01', 'Router Head Office', 'Router', '192.168.1.3', 'D4:CA:6D:11:22:01', 2, 2, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 30}', 'online', 1, '2026-10-18 10:30:00', '2026-10-01', 'Router gateway utama koneksi jaringan Head Office', 30, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(4, 'RTR-02', 'Router Marketing 02', 'Router', '192.168.2.4', 'D4:CA:6D:11:22:02', 1, 2, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 30}', 'online', 1, '2026-10-18 10:30:00', '2026-10-02', 'Router gateway distribusi Marketing Office', 30, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(5, 'RTR-03', 'Router Marketing 03', 'Router', '192.168.2.5', 'D4:CA:6D:11:22:03', 1, 2, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 30}', 'online', 2, '2026-10-18 10:30:00', '2026-10-02', 'Router cadangan failover Marketing Office', 30, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(6, 'SMTV-01', 'Smart TV Head Office', 'TV', '192.168.1.6', '48:D7:05:AA:BB:01', 2, 1, 'Ping', '{"timeout_seconds": 5, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-03', 'Smart TV monitoring display ruang Head Office', 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(7, 'PC-01', 'PC Head Office 01', 'PC', '192.168.1.7', 'B4:2E:99:11:01:01', 2, 1, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-04', 'PC workstation operasional Head Office 01', 60, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(8, 'PC-02', 'PC Head Office 02', 'PC', '192.168.1.8', 'B4:2E:99:11:01:02', 2, 1, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-04', 'PC workstation operasional Head Office 02', 60, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(9, 'PC-03', 'PC Head Office 03', 'PC', '192.168.1.9', 'B4:2E:99:11:01:03', 2, 1, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-04', 'PC workstation operasional Head Office 03', 60, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(10, 'PC-04', 'PC Head Office 04', 'PC', '192.168.1.10', 'B4:2E:99:11:01:04', 2, 1, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-04', 'PC workstation operasional Head Office 04', 60, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(11, 'ESP-01', 'ESP32 Head Office', 'IoT Node', '192.168.1.11', '24:6F:28:AA:01:0B', 2, 3, 'Heartbeat', '{"mqtt_topic": "taims/heartbeat/ESP-01", "timeout_seconds": 90, "check_interval_seconds": 30}', 'online', 2, '2026-10-18 10:30:00', '2026-10-05', 'ESP32 sensor suhu dan kelembaban IoT Head Office', 30, 90, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(12, 'RPI-01', 'Raspberry Pi Head Office', 'IoT Node', '192.168.1.12', 'B8:27:EB:11:22:01', 2, 3, 'Ping', '{"timeout_seconds": 5, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-05', 'Raspberry Pi node gateway IoT Head Office', 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(13, 'MKRT-01', 'Mikrotik Marketing', 'Router', '192.168.2.13', 'D4:CA:6D:33:44:01', 1, 2, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 30}', 'online', 1, '2026-10-18 10:30:00', '2026-10-06', 'MikroTik router access point area Marketing Office', 30, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(14, 'MKRT-02', 'Mikrotik Server', 'Router', '192.168.3.14', 'D4:CA:6D:55:66:01', 3, 2, 'Ping', '{"timeout_seconds": 3, "retry_count": 3, "check_interval_seconds": 30}', 'online', 1, '2026-10-18 10:30:00', '2026-10-06', 'MikroTik core router gateway ruang Server', 30, 3, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(15, 'SRV-01', 'Server Utama', 'Server', '192.168.3.15', '00:0C:29:DD:EE:01', 3, 2, 'Ping', '{"http_path": "/health", "http_port": 3000, "timeout_seconds": 5, "retry_count": 5, "check_interval_seconds": 30}', 'online', 1, '2026-10-18 10:30:00', '2026-10-06', 'Server host utama monitoring T-AIMS Ubuntu', 30, 5, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(16, 'RPI-02', 'Raspberry Pi Server', 'IoT Node', '192.168.3.16', 'B8:27:EB:33:44:02', 3, 3, 'Ping', '{"timeout_seconds": 5, "retry_count": 3, "check_interval_seconds": 60}', 'online', 2, '2026-10-18 10:30:00', '2026-10-07', 'Raspberry Pi logger & server telemetry probe', 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL),
(17, 'SWM-01', 'Switch Manageable', 'Switch Manageable', '192.168.3.17', '14:D6:4D:55:66:01', 3, 2, 'Ping', '{"snmp_community": "public", "timeout_seconds": 5, "retry_count": 5, "check_interval_seconds": 60}', 'online', 1, '2026-10-18 10:30:00', '2026-10-07', 'Switch manageable backbone rack ruang Server', 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 10:30:00', NULL);


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

