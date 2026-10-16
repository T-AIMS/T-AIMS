-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 16 Okt 2026 pada 05.28
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

--
-- Dumping data untuk tabel `assets`
--

INSERT INTO `assets` (`asset_id`, `asset_code`, `asset_name`, `category`, `ip_address`, `mac_address`, `location_id`, `pic_user_id`, `monitoring_method`, `monitoring_config`, `current_status`, `priority`, `last_seen`, `installation_date`, `description`, `check_interval_seconds`, `timeout_seconds`, `retry_count`, `created_at`, `updated_at`, `offline_since`) VALUES
(3, 'NET-SWD-01', 'Distribution Switch D-Link DGS-1210', 'Switch Manageable', '192.168.10.3', '14:D6:4D:55:66:03', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-02', 'Switch distribusi lantai 1 dan workstation lab', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50', NULL),
(4, 'NET-SWA-01', 'Access Switch TP-Link TL-SG1024DE', 'Switch Manageable', '192.168.10.4', '50:D4:F7:77:88:04', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-02', 'Switch koneksi kabel PC peserta lab', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50', NULL),
(5, 'NET-AP-01', 'Access Point Lab Utama UniFi U6-Lite', 'Access Point', '192.168.10.11', '70:A7:41:99:AA:05', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-03', 'Wi-Fi access point area laboratorium utama', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50', NULL),
(7, 'NET-SRV-01', 'Server Monitoring T-AIMS Ubuntu', 'Server', '192.168.10.20', '00:0C:29:DD:EE:07', 2, 2, 'HTTP', '{\"http_path\": \"/health\", \"http_port\": 3000, \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 30}', 'unknown', 1, NULL, '2026-10-04', 'Server host aplikasi web monitoring T-AIMS', 30, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50', NULL),
(8, 'NET-GW-01', 'Firewall & Gateway pfSense', 'Firewall', '192.168.10.254', '00:0C:29:11:33:08', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"http_path\": \"/\", \"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 30}', 'unknown', 1, NULL, '2026-10-04', 'Edge firewall dan traffic monitoring lab', 30, 3, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50', NULL),
(9, 'NET-DNS-01', 'DNS & DHCP Server Pi-hole', 'Server', '192.168.10.5', 'B8:27:EB:44:66:09', 2, 2, 'TCP', '{\"http_path\": \"/health\", \"http_port\": 3000, \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 30}', 'unknown', 1, NULL, '2026-10-05', 'Layanan resolusi domain dan DHCP internal lab', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50', NULL),
(10, 'NET-NAS-01', 'NAS Backup Synology DS220+', 'Storage', '192.168.10.30', '00:11:32:88:99:0A', 2, 2, 'Ping', '{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-05', 'Penyimpanan cadangan file dan backup database', 120, 10, 3, '2026-10-11 22:34:53', '2026-10-12 08:19:50', NULL),
(11, 'IOT-ESP-01', 'ESP32 Monitoring Panel Surya', 'IoT Node', '192.168.10.101', '24:6F:28:AA:01:0B', 2, 3, 'Heartbeat', '{\"mqtt_topic\": \"taims_db/heartbeat/IOT-ESP-01\", \"timeout_seconds\": 90, \"check_interval_seconds\": 30}', 'online', 2, '2026-10-13 23:29:48', '2026-10-06', 'Sensor DHT22 pemantau suhu ruangan lab utama', 60, 5, 3, '2026-10-11 22:34:53', '2026-10-13 16:29:48', NULL),
(16, 'NET-RTR-02', 'Router Marketing Office', 'Router', '192.168.10.2', NULL, 1, NULL, 'Ping', '{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 30}', 'online', 1, '2026-10-14 00:20:52', '2026-10-12', 'Router Marketing Office — detail menyusul via web', 30, 3, 3, '2026-10-12 08:19:50', '2026-10-14 04:16:09', NULL),
(17, 'SEC-CCTV-01', 'CCTV Head Office', 'CCTV', '192.168.10.31', NULL, 2, NULL, 'Ping + HTTP', '{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'online', 1, '2026-10-14 00:58:02', '2026-10-12', 'CCTV Head Office — detail menyusul via web', 60, 5, 3, '2026-10-12 08:19:50', '2026-10-14 04:16:09', NULL),
(18, 'SEC-CCTV-02', 'CCTV Marketing Office', 'CCTV', '192.168.10.32', NULL, 1, NULL, 'Ping + HTTP', '{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'unknown', 1, NULL, '2026-10-12', 'CCTV Marketing Office — detail menyusul via web', 60, 5, 3, '2026-10-12 08:19:50', '2026-10-14 04:16:09', NULL),
(19, 'DISP-TV-01', 'Smart TV Xiaomi Head Office', 'TV', '192.168.10.40', NULL, 2, NULL, 'Ping', '{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'online', 2, '2026-10-14 00:20:53', '2026-10-12', 'Smart TV Xiaomi Head Office — detail menyusul via web', 60, 5, 3, '2026-10-12 08:19:50', '2026-10-14 04:16:09', NULL),
(20, 'PC-WS-01', 'PC Head Office 01', 'PC', '192.168.10.41', NULL, 2, NULL, 'Ping', '{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'online', 2, '2026-10-14 00:20:53', '2026-10-12', 'PC Head Office 01 — detail menyusul via web', 60, 3, 3, '2026-10-12 08:19:50', '2026-10-14 04:16:09', NULL),
(21, 'PC-WS-02', 'PC Head Office 02', 'PC', '192.168.10.42', NULL, 2, NULL, 'Ping', '{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 60}', 'unknown', 2, NULL, '2026-10-12', 'PC Head Office 02 — detail menyusul via web', 60, 3, 3, '2026-10-12 08:19:50', '2026-10-14 04:16:09', NULL),
(22, 'IOT-RPI-01', 'Raspberry Pi Smart Home', 'IoT Node', '192.168.10.102', NULL, 2, NULL, 'Heartbeat', '{\"mqtt_topic\": \"taims_db/heartbeat/IOT-RPI-01\", \"timeout_seconds\": 90, \"check_interval_seconds\": 30}', 'online', 2, '2026-10-13 23:52:15', '2026-10-12', 'Raspberry Pi Smart Home — detail menyusul via web', 30, 90, 3, '2026-10-12 08:19:50', '2026-10-14 04:16:09', NULL),
(23, 'NET-RTR-01', 'Router Utama MikroTik RB4011', 'Router', '192.168.10.1', 'D4:CA:6D:11:22:01', 2, 2, 'Ping', '{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 30}', 'unknown', 1, NULL, '2026-10-01', 'Router gateway utama lab Teknolab', 30, 3, 3, '2026-10-13 05:17:29', '2026-10-13 05:17:29', NULL);

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

--
-- Dumping data untuk tabel `incidents`
--

INSERT INTO `incidents` (`incident_id`, `asset_id`, `detected_at`, `incident_type`, `description`, `severity`, `incident_status`) VALUES
(2, 3, '2026-10-12 12:52:43', '[SIMULASI] Connection Loss', '[DATA UJI / SIMULASI KEGAGALAN] Kabel LAN uplink lab dicabut untuk pengujian failure simulation. Monitoring engine mendeteksi ping timeout setelah 3x percobaan retry berturut-turut. Insiden telah diselesaikan saat kabel dipasang kembali.', 'high', 'resolved'),
(3, 7, '2026-10-12 13:22:43', '[SIMULASI] Service Health Failure', '[DATA UJI / SIMULASI KEGAGALAN] Service web monitoring dan daemon REST API dihentikan sementara untuk menguji HTTP health check. Endpoint mengembalikan HTTP status 503 Service Unavailable. Layanan telah direstart dan tiket insiden ditutup.', 'critical', 'closed'),
(5, 11, '2026-10-12 14:32:43', '[SIMULASI] Power Cut / Heartbeat Timeout', '[DATA UJI / SIMULASI KEGAGALAN] Catu daya mikrokontroler ESP32 dilepas untuk menguji deteksi offline sensor lab. Tidak ada paket heartbeat telemetry yang diterima sistem selama lebih dari 180 detik. Status insiden masih terbuka (open).', 'medium', 'open');

--
-- Dumping data untuk tabel `locations`
--

INSERT INTO `locations` (`location_id`, `location_name`, `description`) VALUES
(1, 'Marketing Office', 'Lokasi perangkat untuk pengujian T-AIMS dan workstation'),
(2, 'Head Office', 'Pusat rack server, switch backbone, firewall, dan storage');

--
-- Dumping data untuk tabel `locations_backup_20261012`
--

INSERT INTO `locations_backup_20261012` (`location_id`, `location_name`, `description`) VALUES
(1, 'marketing office', 'Lokasi perangkat untuk pengujian T-AIMS dan workstation'),
(2, 'head office', 'Pusat rack server, switch backbone, firewall, dan storage');

--
-- Dumping data untuk tabel `maintenance`
--

INSERT INTO `maintenance` (`maintenance_id`, `asset_id`, `maintenance_type`, `scheduled_date`, `performed_at`, `description`, `maintenance_status`, `created_at`) VALUES
(3, 7, 'Firmware / OS Security Update', '2026-10-17 14:45:55', NULL, '[DATA CONTOH] Pemeliharaan terjadwal: Pembaruan paket keamanan OS Ubuntu Server, rotasi dan pengarsipan log monitoring berkala, serta pengecekan performa daemon MariaDB.', 'scheduled', '2026-10-12 07:45:55'),
(4, 10, 'Storage & Backup Integrity Audit', '2026-10-19 14:45:55', NULL, '[DATA CONTOH] Pemeliharaan terjadwal: Audit kapasitas hard drive RAID 1, pengujian verifikasi pemulihan file backup snapshot basis data taims_db, dan pembersihan filter casing NAS.', 'scheduled', '2026-10-12 07:45:55'),
(5, 11, 'Kalibrasi & Pemeriksaan Sensor', '2026-10-13 14:45:55', NULL, '[DATA CONTOH] Pemeliharaan sedang berjalan: Uji komparasi presisi pembacaan probe sensor DHT22 terhadap higrometer standar lab dan pemeriksaan stabilitas catu daya micro-USB.', 'in_progress', '2026-10-12 07:45:55');

--
-- Dumping data untuk tabel `monitoring_logs`
--

INSERT INTO `monitoring_logs` (`log_id`, `asset_id`, `check_time`, `status`, `method`, `source`, `response_time_ms`, `details`, `created_at`) VALUES
(4, 7, '2026-10-12 09:53:19', 'online', NULL, 'monitoring_engine', 4, '[DATA UJI / SIMULASI] Simulasi HTTP check endpoint monitoring 4 ms untuk verifikasi relasi aset NET-SRV-01', '2026-10-12 03:02:19'),
(5, 8, '2026-10-12 09:56:19', 'online', NULL, 'monitoring_engine', 3, '[DATA UJI / SIMULASI] Simulasi gateway packet filter ping 3 ms untuk verifikasi relasi aset NET-GW-01', '2026-10-12 03:02:19'),
(8, 11, '2026-10-13 23:21:21', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-56,\"uptime_seconds\":5,\"temperature\":27.5,\"humidity\":64.2,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:21:21'),
(9, 11, '2026-10-13 23:21:43', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"offline\",\"reason\":\"power_lost\"}', '2026-10-13 16:21:43'),
(10, 11, '2026-10-13 23:21:43', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-50,\"uptime_seconds\":1,\"temperature\":29.2,\"humidity\":63,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:21:43'),
(11, 11, '2026-10-13 23:21:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"offline\",\"reason\":\"power_lost\"}', '2026-10-13 16:21:55'),
(12, 11, '2026-10-13 23:21:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-49,\"uptime_seconds\":1,\"temperature\":27.6,\"humidity\":66.5,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:21:55'),
(13, 11, '2026-10-13 23:22:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-48,\"uptime_seconds\":31,\"temperature\":28.2,\"humidity\":66.7,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:22:25'),
(14, 11, '2026-10-13 23:22:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-50,\"uptime_seconds\":61,\"temperature\":29.3,\"humidity\":66.5,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:22:55'),
(15, 11, '2026-10-13 23:23:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-52,\"uptime_seconds\":91,\"temperature\":29,\"humidity\":64.7,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:23:25'),
(16, 11, '2026-10-13 23:23:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-53,\"uptime_seconds\":121,\"temperature\":27.7,\"humidity\":63.9,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:23:55'),
(17, 11, '2026-10-13 23:24:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-52,\"uptime_seconds\":151,\"temperature\":28.3,\"humidity\":66.5,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:24:25'),
(18, 11, '2026-10-13 23:24:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-55,\"uptime_seconds\":181,\"temperature\":28.1,\"humidity\":63.2,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:24:55'),
(19, 11, '2026-10-13 23:25:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-59,\"uptime_seconds\":211,\"temperature\":27.7,\"humidity\":65.5,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:25:25'),
(20, 11, '2026-10-13 23:25:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-59,\"uptime_seconds\":241,\"temperature\":28.8,\"humidity\":64.3,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:25:55'),
(21, 11, '2026-10-13 23:26:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-59,\"uptime_seconds\":271,\"temperature\":28.2,\"humidity\":64.4,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:26:25'),
(22, 11, '2026-10-13 23:26:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-47,\"uptime_seconds\":301,\"temperature\":29,\"humidity\":65,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:26:55'),
(23, 11, '2026-10-13 23:27:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-50,\"uptime_seconds\":331,\"temperature\":29.2,\"humidity\":64.8,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:27:25'),
(24, 11, '2026-10-13 23:27:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-55,\"uptime_seconds\":361,\"temperature\":28.1,\"humidity\":63.1,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:27:55'),
(25, 11, '2026-10-13 23:28:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-48,\"uptime_seconds\":391,\"temperature\":29.2,\"humidity\":63.9,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:28:25'),
(26, 11, '2026-10-13 23:28:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-48,\"uptime_seconds\":421,\"temperature\":28.5,\"humidity\":66,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:28:55'),
(27, 11, '2026-10-13 23:29:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-59,\"uptime_seconds\":451,\"temperature\":27.6,\"humidity\":65.5,\"firmware_version\":\"1.0.0-hw\"}', '2026-10-13 16:29:25'),
(28, 11, '2026-10-13 23:29:48', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-ESP-01\",\"status\":\"offline\",\"reason\":\"power_lost\"}', '2026-10-13 16:29:48'),
(29, 22, '2026-10-13 23:35:50', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:35:50.169845+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":0,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:35:50'),
(30, 22, '2026-10-13 23:36:08', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"offline\",\"reason\":\"connection_lost\"}', '2026-10-13 16:36:08'),
(31, 22, '2026-10-13 23:36:08', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:36:08.671518+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":0,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:36:08'),
(32, 22, '2026-10-13 23:36:25', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"offline\",\"reason\":\"connection_lost\"}', '2026-10-13 16:36:25'),
(33, 22, '2026-10-13 23:36:42', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:36:42.021707+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":2,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:36:42'),
(34, 22, '2026-10-13 23:37:14', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:37:14.029107+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":34,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:37:14'),
(35, 22, '2026-10-13 23:37:46', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:37:46.038126+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":66,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:37:46'),
(36, 22, '2026-10-13 23:47:08', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:47:08.926622+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":2,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:47:09'),
(37, 22, '2026-10-13 23:47:40', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:47:40.946517+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":34,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:47:41'),
(38, 22, '2026-10-13 23:48:12', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:48:12.962914+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":66,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:48:13'),
(39, 22, '2026-10-13 23:51:11', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:51:11.805723+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":2,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:51:12'),
(40, 22, '2026-10-13 23:51:43', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:51:43.950981+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":34,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:51:44'),
(41, 22, '2026-10-13 23:52:15', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:52:15.962698+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":66,\"firmware_version\":\"1.0.0-rpi\"}', '2026-10-13 16:52:16'),
(42, 16, '2026-10-14 00:20:52', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"NET-RTR-02\",\"status\":\"online\",\"timestamp\":\"2026-10-14T00:20:52.089334+07:00\",\"ip_address\":\"192.168.1.1\",\"uptime_seconds\":120,\"firmware_version\":\"1.0.0-ping\",\"response_time_ms\":3}', '2026-10-13 17:20:52'),
(43, 17, '2026-10-14 00:20:52', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"SEC-CCTV-01\",\"status\":\"offline\",\"timestamp\":\"2026-10-14T00:20:52.611256+07:00\",\"ip_address\":\"192.168.1.30\",\"uptime_seconds\":120,\"firmware_version\":\"1.0.0-ping\",\"response_time_ms\":0}', '2026-10-13 17:20:52'),
(44, 19, '2026-10-14 00:20:53', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"DISP-TV-01\",\"status\":\"offline\",\"timestamp\":\"2026-10-14T00:20:53.119551+07:00\",\"ip_address\":\"192.168.1.20\",\"uptime_seconds\":120,\"firmware_version\":\"1.0.0-ping\",\"response_time_ms\":0}', '2026-10-13 17:20:53'),
(45, 20, '2026-10-14 00:20:53', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"PC-WS-01\",\"status\":\"offline\",\"timestamp\":\"2026-10-14T00:20:53.626020+07:00\",\"ip_address\":\"192.168.1.10\",\"uptime_seconds\":120,\"firmware_version\":\"1.0.0-ping\",\"response_time_ms\":0}', '2026-10-13 17:20:53'),
(46, 17, '2026-10-14 00:53:55', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"SEC-CCTV-01\",\"status\":\"online\",\"timestamp\":\"2026-10-14T00:53:55.872939+07:00\",\"ip_address\":\"192.168.137.177\",\"mac_address\":\"94:F8:27:B4:A8:9E\",\"device_name\":\"CCTV Head Office (Physical IP Cam)\",\"response_time_ms\":12,\"uptime_seconds\":360,\"firmware_version\":\"1.0.0-ipc\"}', '2026-10-13 17:53:56'),
(47, 17, '2026-10-14 00:58:02', 'online', 'Heartbeat', 'device', 0, '{\"device_id\":\"SEC-CCTV-01\",\"status\":\"online\",\"timestamp\":\"2026-10-14T00:58:02.560572+07:00\",\"ip_address\":\"192.168.137.177\",\"mac_address\":\"94:F8:27:B4:A8:9E\",\"device_name\":\"CCTV Head Office (Physical IP Cam)\",\"response_time_ms\":12,\"uptime_seconds\":360,\"firmware_version\":\"1.0.0-ipc\"}', '2026-10-13 17:58:03');

--
-- Dumping data untuk tabel `monitoring_logs_backup_20261012`
--

INSERT INTO `monitoring_logs_backup_20261012` (`log_id`, `asset_id`, `check_time`, `status`, `response_time_ms`, `details`, `created_at`) VALUES
(4, 7, '2026-10-12 09:53:19', 'online', 4, '[DATA UJI / SIMULASI] Simulasi HTTP check endpoint monitoring 4 ms untuk verifikasi relasi aset NET-SRV-01', '2026-10-12 03:02:19'),
(5, 8, '2026-10-12 09:56:19', 'online', 3, '[DATA UJI / SIMULASI] Simulasi gateway packet filter ping 3 ms untuk verifikasi relasi aset NET-GW-01', '2026-10-12 03:02:19'),
(6, 11, '2026-10-12 09:59:19', 'online', 45, '[DATA UJI / SIMULASI] Simulasi telemetri MQTT sensor suhu & kelembaban 45 ms untuk verifikasi relasi aset IOT-ESP-01', '2026-10-12 03:02:19');

--
-- Dumping data untuk tabel `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `asset_id`, `title`, `message`, `is_read`, `created_at`) VALUES
(2, 2, 3, '[ALERT OFFLINE] NET-SWD-01 Terputus', '[DATA UJI / SIMULASI] Peringatan: Switch D-Link DGS-1210 (192.168.10.3) di Laboratorium tidak merespons ping selama 3x percobaan retry berturut-turut. Status perangkat diubah menjadi OFFLINE.', 1, '2026-10-12 05:25:51'),
(3, 2, 3, '[RECOVERY ALERT] NET-SWD-01 Kembali Normal', '[DATA UJI / SIMULASI] Pemulihan: Switch D-Link DGS-1210 (192.168.10.3) di Laboratorium telah merespons kembali dengan latensi 2 ms. Status perangkat dipulihkan menjadi ONLINE.', 1, '2026-10-12 05:40:51'),
(4, 5, 7, '[ALERT CRITICAL] NET-SRV-01 Service HTTP Gagal', '[DATA UJI / SIMULASI] Peringatan: Endpoint REST API pada Server Monitoring Ubuntu (192.168.10.20) mengembalikan respons error 503 Service Unavailable. Harap periksa service daemon backend.', 1, '2026-10-12 05:55:51'),
(5, 5, 7, '[RECOVERY ALERT] NET-SRV-01 Layanan Pulih', '[DATA UJI / SIMULASI] Pemulihan: Layanan REST API Server Monitoring Ubuntu (192.168.10.20) telah kembali aktif dan merespons permintaan HTTP normal (latensi 4 ms).', 1, '2026-10-12 06:10:51'),
(7, 3, 11, '[ALERT WARNING] IOT-ESP-01 Heartbeat Hilang', '[DATA UJI / SIMULASI] Peringatan: Sensor DHT22 ESP32 (192.168.10.101) di Laboratorium tidak mengirimkan paket telemetri selama 180 detik. Status perangkat dialihkan menjadi OFFLINE.', 0, '2026-10-12 07:05:51');

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
