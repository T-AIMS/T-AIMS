-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 16 Okt 2026 pada 05.26
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

-- --------------------------------------------------------

--
-- Struktur dari tabel `locations_backup_20261012`
--

CREATE TABLE `locations_backup_20261012` (
  `location_id` int(11) NOT NULL DEFAULT 0,
  `location_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `asset_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `incidents`
--
ALTER TABLE `incidents`
  MODIFY `incident_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `locations`
--
ALTER TABLE `locations`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `maintenance`
--
ALTER TABLE `maintenance`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `monitoring_logs`
--
ALTER TABLE `monitoring_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `token_blacklist`
--
ALTER TABLE `token_blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

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
