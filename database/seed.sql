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
