-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 18 Okt 2026 pada 06.08
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taims_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `assets`
--

CREATE TABLE `assets` (
  `asset_id` int(11) NOT NULL,
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
  `offline_since` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `assets`
--

INSERT INTO `assets` (`asset_id`, `asset_code`, `asset_name`, `category`, `ip_address`, `mac_address`, `location_id`, `pic_user_id`, `monitoring_method`, `monitoring_config`, `current_status`, `priority`, `last_seen`, `installation_date`, `description`, `check_interval_seconds`, `timeout_seconds`, `retry_count`, `created_at`, `updated_at`, `offline_since`) VALUES
(1, 'CCTV-01', 'CCTV Head Office', 'CCTV', '192.168.1.1', NULL, 2, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(2, 'CCTV-02', 'CCTV Marketing', 'CCTV', '192.168.2.2', NULL, 1, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(3, 'RTR-01', 'Router Head Office', 'Router', '192.168.1.3', NULL, 2, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(4, 'RTR-02', 'Router Marketing 02', 'Router', '192.168.2.4', NULL, 1, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(5, 'RTR-03', 'Router Marketing 03', 'Router', '192.168.2.5', NULL, 1, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(6, 'SMTV-01', 'Smart TV Head Office', 'TV', '192.168.1.6', NULL, 2, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(7, 'PC-01', 'PC Head Office 01', 'PC', '192.168.1.7', NULL, 2, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(8, 'PC-02', 'PC Head Office 02', 'PC', '192.168.1.8', NULL, 2, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(9, 'PC-03', 'PC Head Office 03', 'PC', '192.168.1.9', NULL, 2, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(10, 'PC-04', 'PC Head Office 04', 'PC', '192.168.1.10', NULL, 2, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(11, 'ESP-01', 'ESP32 Head Office', 'IoT Node', '192.168.1.11', NULL, 2, NULL, 'Heartbeat', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(12, 'RPI-01', 'Raspberry Pi Head Office', 'IoT Node', '192.168.1.12', NULL, 2, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(13, 'MKRT-01', 'Mikrotik Marketing', 'Router', '192.168.2.13', NULL, 1, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(14, 'MKRT-02', 'Mikrotik Server', 'Router', '192.168.3.14', NULL, 3, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(15, 'SRV-01', 'Server Utama', 'Server', '192.168.3.15', NULL, 3, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(16, 'RPI-02', 'Raspberry Pi Server', 'IoT Node', '192.168.3.16', NULL, 3, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL),
(17, 'SWM-01', 'Switch Manageable', 'Switch Manageable', '192.168.3.17', NULL, 3, NULL, 'Ping', NULL, 'unknown', 2, NULL, NULL, NULL, 60, 5, 3, '2026-10-18 03:59:27', '2026-10-18 03:59:27', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `assets_backup_20261012`
--

CREATE TABLE `assets_backup_20261012` (
  `asset_id` int(11) NOT NULL DEFAULT 0,
  `asset_code` varchar(50) NOT NULL,
  `asset_name` varchar(150) NOT NULL,
  `category` varchar(80) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `mac_address` varchar(17) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `pic_user_id` int(11) DEFAULT NULL,
  `monitoring_method` varchar(100) NOT NULL,
  `current_status` enum('unknown','online','offline','maintenance') NOT NULL DEFAULT 'unknown',
  `last_seen` datetime DEFAULT NULL,
  `installation_date` date DEFAULT NULL,
  `description` text DEFAULT NULL,
  `check_interval_seconds` int(11) NOT NULL DEFAULT 60,
  `timeout_seconds` int(11) NOT NULL DEFAULT 5,
  `retry_count` int(11) NOT NULL DEFAULT 3,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `assets_backup_20261012`
--

INSERT INTO `assets_backup_20261012` (`asset_id`, `asset_code`, `asset_name`, `category`, `ip_address`, `mac_address`, `location_id`, `pic_user_id`, `monitoring_method`, `current_status`, `last_seen`, `installation_date`, `description`, `check_interval_seconds`, `timeout_seconds`, `retry_count`, `created_at`) VALUES
(3, 'NET-SWD-01', 'Distribution Switch D-Link DGS-1210', 'Switch Manageable', '192.168.10.3', '14:D6:4D:55:66:03', 1, 2, 'Ping', 'unknown', NULL, '2026-10-02', 'Switch distribusi lantai 1 dan workstation lab', 60, 5, 3, '2026-10-11 22:34:53'),
(4, 'NET-SWA-01', 'Access Switch TP-Link TL-SG1024DE', 'Switch Manageable', '192.168.10.4', '50:D4:F7:77:88:04', 1, 2, 'Ping', 'unknown', NULL, '2026-10-02', 'Switch koneksi kabel PC peserta lab', 60, 5, 3, '2026-10-11 22:34:53'),
(5, 'NET-AP-01', 'Access Point Lab Utama UniFi U6-Lite', 'Access Point', '192.168.10.11', '70:A7:41:99:AA:05', 1, 2, 'Ping', 'unknown', NULL, '2026-10-03', 'Wi-Fi access point area laboratorium utama', 60, 5, 3, '2026-10-11 22:34:53'),
(7, 'NET-SRV-01', 'Server Monitoring T-AIMS Ubuntu', 'Server', '192.168.10.20', '00:0C:29:DD:EE:07', 2, 2, 'HTTP', 'unknown', NULL, '2026-10-04', 'Server host aplikasi web monitoring T-AIMS', 30, 5, 3, '2026-10-11 22:34:53'),
(8, 'NET-GW-01', 'Firewall & Gateway pfSense', 'Firewall', '192.168.10.254', '00:0C:29:11:33:08', 2, 2, 'Ping', 'unknown', NULL, '2026-10-04', 'Edge firewall dan traffic monitoring lab', 30, 3, 3, '2026-10-11 22:34:53'),
(9, 'NET-DNS-01', 'DNS & DHCP Server Pi-hole', 'Server', '192.168.10.5', 'B8:27:EB:44:66:09', 2, 2, 'TCP', 'unknown', NULL, '2026-10-05', 'Layanan resolusi domain dan DHCP internal lab', 60, 5, 3, '2026-10-11 22:34:53'),
(10, 'NET-NAS-01', 'NAS Backup Synology DS220+', 'Storage', '192.168.10.30', '00:11:32:88:99:0A', 2, 2, 'Ping', 'unknown', NULL, '2026-10-05', 'Penyimpanan cadangan file dan backup database', 120, 10, 3, '2026-10-11 22:34:53'),
(11, 'IOT-ESP-01', 'ESP32 Sensor Suhu & Kelembaban Lab', 'IoT Node', '192.168.10.101', '24:6F:28:AA:01:0B', 1, 3, 'Heartbeat', 'unknown', NULL, '2026-10-06', 'Sensor DHT22 pemantau suhu ruangan lab utama', 60, 5, 3, '2026-10-11 22:34:53'),
(12, 'IOT-ESP-02', 'ESP32 Monitoring Daya & Listrik AC', 'IoT Node', '192.168.10.102', '24:6F:28:BB:02:0C', 2, 3, 'Heartbeat', 'unknown', NULL, '2026-10-06', 'Sensor PZEM-004T monitor konsumsi daya server', 60, 5, 3, '2026-10-11 22:34:53'),
(13, 'IOT-ESP-03', 'ESP32 Door Magnetic Sensor', 'IoT Node', '192.168.10.103', '24:6F:28:CC:03:0D', 2, 3, 'Heartbeat', 'unknown', NULL, '2026-10-07', 'Sensor keamanan kontak magnet pintu ruang server', 60, 5, 3, '2026-10-11 22:34:53');

-- --------------------------------------------------------

--
-- Struktur dari tabel `assets_backup_final_20261012`
--

CREATE TABLE `assets_backup_final_20261012` (
  `asset_id` int(11) NOT NULL DEFAULT 0,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `assets_backup_final_20261012`
--

INSERT INTO `assets_backup_final_20261012` (`asset_id`, `asset_code`, `asset_name`, `category`, `ip_address`, `mac_address`, `location_id`, `pic_user_id`, `monitoring_method`, `monitoring_config`, `current_status`, `priority`, `last_seen`, `installation_date`, `description`, `check_interval_seconds`, `timeout_seconds`, `retry_count`, `created_at`, `updated_at`) VALUES
(3, 'NET-SWD-01', 'Distribution Switch D-Link DGS-1210', 'Switch Manageable', '192.168.10.3', '14:D6:4D:55:66:03', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-02', 'Switch distribusi lantai 1 dan workstation lab', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50'),
(4, 'NET-SWA-01', 'Access Switch TP-Link TL-SG1024DE', 'Switch Manageable', '192.168.10.4', '50:D4:F7:77:88:04', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-02', 'Switch koneksi kabel PC peserta lab', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50'),
(5, 'NET-AP-01', 'Access Point Lab Utama UniFi U6-Lite', 'Access Point', '192.168.10.11', '70:A7:41:99:AA:05', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-03', 'Wi-Fi access point area laboratorium utama', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50'),
(7, 'NET-SRV-01', 'Server Monitoring T-AIMS Ubuntu', 'Server', '192.168.10.20', '00:0C:29:DD:EE:07', 2, 2, 'HTTP', '{\"http_path\": \"/health\", \"http_port\": 3000, \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 30}', 'unknown', 1, NULL, '2026-10-04', 'Server host aplikasi web monitoring T-AIMS', 30, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50'),
(8, 'NET-GW-01', 'Firewall & Gateway pfSense', 'Firewall', '192.168.10.254', '00:0C:29:11:33:08', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"http_path\": \"/\", \"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 30}', 'unknown', 1, NULL, '2026-10-04', 'Edge firewall dan traffic monitoring lab', 30, 3, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50'),
(9, 'NET-DNS-01', 'DNS & DHCP Server Pi-hole', 'Server', '192.168.10.5', 'B8:27:EB:44:66:09', 2, 2, 'TCP', '{\"http_path\": \"/health\", \"http_port\": 3000, \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 30}', 'unknown', 1, NULL, '2026-10-05', 'Layanan resolusi domain dan DHCP internal lab', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50'),
(10, 'NET-NAS-01', 'NAS Backup Synology DS220+', 'Storage', '192.168.10.30', '00:11:32:88:99:0A', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-05', 'Penyimpanan cadangan file dan backup database', 120, 10, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50'),
(11, 'IOT-ESP-01', 'ESP32 Sensor Suhu & Kelembaban Lab', 'IoT Node', '192.168.10.101', '24:6F:28:AA:01:0B', 2, 3, 'Heartbeat', '{\"mqtt_topic\": \"taims/heartbeat/IOT-ESP-01\", \"timeout_seconds\": 90, \"check_interval_seconds\": 30}', 'unknown', 2, NULL, '2026-10-06', 'Sensor DHT22 pemantau suhu ruangan lab utama', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50'),
(13, 'IOT-ESP-03', 'ESP32 Door Magnetic Sensor', 'IoT Node', '192.168.10.103', '24:6F:28:CC:03:0D', 2, 3, 'Heartbeat', NULL, 'unknown', 2, NULL, '2026-10-07', 'Sensor keamanan kontak magnet pintu ruang server', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:49'),
(16, 'NET-RTR-02', 'Router Marketing Office', 'Router', NULL, NULL, 1, NULL, 'Ping', '{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 30}', 'unknown', 1, NULL, '2026-10-12', 'Router Marketing Office — detail menyusul via web', 30, 3, 3, '2026-10-12 08:19:50', '2026-10-12 08:19:50'),
(17, 'SEC-CCTV-01', 'CCTV Head Office', 'CCTV', NULL, NULL, 2, NULL, 'Ping', '{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'unknown', 1, NULL, '2026-10-12', 'CCTV Head Office — detail menyusul via web', 60, 5, 3, '2026-10-12 08:19:50', '2026-10-12 08:19:50'),
(18, 'SEC-CCTV-02', 'CCTV Marketing Office', 'CCTV', NULL, NULL, 1, NULL, 'Ping', '{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'unknown', 1, NULL, '2026-10-12', 'CCTV Marketing Office — detail menyusul via web', 60, 5, 3, '2026-10-12 08:19:50', '2026-10-12 08:19:50'),
(19, 'DISP-TV-01', 'Smart TV Xiaomi Head Office', 'TV', NULL, NULL, 2, NULL, 'Ping', '{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-12', 'Smart TV Xiaomi Head Office — detail menyusul via web', 60, 5, 3, '2026-10-12 08:19:50', '2026-10-12 08:19:50'),
(20, 'PC-WS-01', 'PC Head Office 01', 'PC', NULL, NULL, 2, NULL, 'Ping', '{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-12', 'PC Head Office 01 — detail menyusul via web', 60, 3, 3, '2026-10-12 08:19:50', '2026-10-12 08:19:50'),
(21, 'PC-WS-02', 'PC Head Office 02', 'PC', NULL, NULL, 2, NULL, 'Ping', '{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-12', 'PC Head Office 02 — detail menyusul via web', 60, 3, 3, '2026-10-12 08:19:50', '2026-10-12 08:19:50'),
(22, 'IOT-RPI-01', 'Raspberry Pi Smart Home', 'IoT Node', NULL, NULL, 2, NULL, 'Heartbeat', '{\"mqtt_topic\": \"taims/heartbeat/IOT-RPI-01\", \"timeout_seconds\": 90, \"check_interval_seconds\": 30}', 'unknown', 2, NULL, '2026-10-12', 'Raspberry Pi Smart Home — detail menyusul via web', 30, 90, 3, '2026-10-12 08:19:50', '2026-10-12 08:19:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `incidents`
--

CREATE TABLE `incidents` (
  `incident_id` int(11) NOT NULL,
  `asset_id` int(11) NOT NULL,
  `detected_at` datetime NOT NULL,
  `incident_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  `incident_status` enum('open','investigating','resolved','closed') NOT NULL DEFAULT 'open'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `locations`
--

CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL,
  `location_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `locations`
--

INSERT INTO `locations` (`location_id`, `location_name`, `description`) VALUES
(1, 'Marketing Office', 'Lokasi perangkat untuk pengujian T-AIMS dan workstation'),
(2, 'Head Office', 'Pusat rack server, switch backbone, firewall, dan storage'),
(3, 'House of Server', 'Ruang server utama');

-- --------------------------------------------------------

--
-- Struktur dari tabel `locations_backup_20261012`
--

CREATE TABLE `locations_backup_20261012` (
  `location_id` int(11) NOT NULL DEFAULT 0,
  `location_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `locations_backup_20261012`
--

INSERT INTO `locations_backup_20261012` (`location_id`, `location_name`, `description`) VALUES
(1, 'marketing office', 'Lokasi perangkat untuk pengujian T-AIMS dan workstation'),
(2, 'head office', 'Pusat rack server, switch backbone, firewall, dan storage');

-- --------------------------------------------------------

--
-- Struktur dari tabel `maintenance`
--

CREATE TABLE `maintenance` (
  `maintenance_id` int(11) NOT NULL,
  `asset_id` int(11) NOT NULL,
  `maintenance_type` varchar(100) NOT NULL,
  `scheduled_date` datetime DEFAULT NULL,
  `performed_at` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `maintenance_status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `monitoring_logs`
--

CREATE TABLE `monitoring_logs` (
  `log_id` int(11) NOT NULL,
  `asset_id` int(11) NOT NULL,
  `check_time` datetime NOT NULL,
  `status` enum('unknown','online','offline','error') NOT NULL DEFAULT 'unknown',
  `method` varchar(20) DEFAULT NULL,
  `source` varchar(20) DEFAULT 'monitoring_engine',
  `response_time_ms` int(11) NOT NULL,
  `details` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `monitoring_logs_backup_20261012`
--

CREATE TABLE `monitoring_logs_backup_20261012` (
  `log_id` int(11) NOT NULL DEFAULT 0,
  `asset_id` int(11) NOT NULL,
  `check_time` datetime NOT NULL,
  `status` enum('unknown','online','offline','error') NOT NULL DEFAULT 'unknown',
  `response_time_ms` int(11) NOT NULL,
  `details` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `monitoring_logs_backup_20261012`
--

INSERT INTO `monitoring_logs_backup_20261012` (`log_id`, `asset_id`, `check_time`, `status`, `response_time_ms`, `details`, `created_at`) VALUES
(4, 7, '2026-10-12 09:53:19', 'online', 4, '[DATA UJI / SIMULASI] Simulasi HTTP check endpoint monitoring 4 ms untuk verifikasi relasi aset NET-SRV-01', '2026-10-12 03:02:19'),
(5, 8, '2026-10-12 09:56:19', 'online', 3, '[DATA UJI / SIMULASI] Simulasi gateway packet filter ping 3 ms untuk verifikasi relasi aset NET-GW-01', '2026-10-12 03:02:19'),
(6, 11, '2026-10-12 09:59:19', 'online', 45, '[DATA UJI / SIMULASI] Simulasi telemetri MQTT sensor suhu & kelembaban 45 ms untuk verifikasi relasi aset IOT-ESP-01', '2026-10-12 03:02:19');

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `asset_id` int(11) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `token_blacklist`
--

CREATE TABLE `token_blacklist` (
  `id` int(11) NOT NULL,
  `token` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Admin T-AIMS', 'admin@taims_db.local', '$2a$10$VMQ65IXcG5145jlEZNvJ1edxCGXKVyQIltDwXkr/6uf3U31fTLDfC', 'super_admin', '2026-10-15 23:59:00'),
(2, 'Ananda Dwi Susanti', 'ananda@taims_db.local', '$2a$10$VMQ65IXcG5145jlEZNvJ1edxCGXKVyQIltDwXkr/6uf3U31fTLDfC', 'admin', '2026-10-15 23:59:00'),
(3, 'Ilvina Muvarika', 'ilvina@taims_db.local', '$2a$10$VMQ65IXcG5145jlEZNvJ1edxCGXKVyQIltDwXkr/6uf3U31fTLDfC', 'admin', '2026-10-15 23:59:00'),
(4, 'Faida Trisma Amelia', 'faida@taims_db.local', '$2a$10$VMQ65IXcG5145jlEZNvJ1edxCGXKVyQIltDwXkr/6uf3U31fTLDfC', 'admin', '2026-10-15 23:59:00'),
(5, 'Ahmad Reza Fahmi', 'reza.fahmi@taims_db.local', '$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e', 'admin', '2026-10-15 23:59:00'),
(6, '[DATA UJI] Operator Monitoring Lab', 'operator.uji@taims_db.local', '$2a$10$VMQ65IXcG5145jlEZNvJ1edxCGXKVyQIltDwXkr/6uf3U31fTLDfC', 'user', '2026-10-15 23:59:00');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`asset_id`),
  ADD UNIQUE KEY `uq_asset_code` (`asset_code`),
  ADD KEY `fk_assets_locations` (`location_id`),
  ADD KEY `fk_assets_users` (`pic_user_id`);

--
-- Indeks untuk tabel `incidents`
--
ALTER TABLE `incidents`
  ADD PRIMARY KEY (`incident_id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indeks untuk tabel `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Indeks untuk tabel `maintenance`
--
ALTER TABLE `maintenance`
  ADD PRIMARY KEY (`maintenance_id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indeks untuk tabel `monitoring_logs`
--
ALTER TABLE `monitoring_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indeks untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `asset_id` (`asset_id`);

--
-- Indeks untuk tabel `token_blacklist`
--
ALTER TABLE `token_blacklist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_expires_at` (`expires_at`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `assets`
--
ALTER TABLE `assets`
  MODIFY `asset_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `incidents`
--
ALTER TABLE `incidents`
  MODIFY `incident_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `monitoring_logs`
--
ALTER TABLE `monitoring_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT untuk tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `token_blacklist`
--
ALTER TABLE `token_blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `assets`
--
ALTER TABLE `assets`
  ADD CONSTRAINT `fk_assets_locations` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  ADD CONSTRAINT `fk_assets_users` FOREIGN KEY (`pic_user_id`) REFERENCES `users` (`user_id`);

--
-- Ketidakleluasaan untuk tabel `incidents`
--
ALTER TABLE `incidents`
  ADD CONSTRAINT `fk_incidents_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`);

--
-- Ketidakleluasaan untuk tabel `maintenance`
--
ALTER TABLE `maintenance`
  ADD CONSTRAINT `fk_maintenance_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`);

--
-- Ketidakleluasaan untuk tabel `monitoring_logs`
--
ALTER TABLE `monitoring_logs`
  ADD CONSTRAINT `fk_monitoring_logs_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`);

--
-- Ketidakleluasaan untuk tabel `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notifications_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`),
  ADD CONSTRAINT `fk_notifications_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
