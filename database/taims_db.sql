-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: taims_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  CONSTRAINT `fk_assets_locations` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  CONSTRAINT `fk_assets_users` FOREIGN KEY (`pic_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
INSERT INTO `assets` VALUES (3,'NET-SWD-01','Distribution Switch D-Link DGS-1210','Switch Manageable','192.168.10.3','14:D6:4D:55:66:03',2,2,'Ping','{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}','unknown',2,NULL,'2026-10-02','Switch distribusi lantai 1 dan workstation lab',60,5,3,'2026-10-11 22:34:53','2026-10-12 08:19:50',NULL),(4,'NET-SWA-01','Access Switch TP-Link TL-SG1024DE','Switch Manageable','192.168.10.4','50:D4:F7:77:88:04',2,2,'Ping','{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}','unknown',2,NULL,'2026-10-02','Switch koneksi kabel PC peserta lab',60,5,3,'2026-10-11 22:34:53','2026-10-12 08:19:50',NULL),(5,'NET-AP-01','Access Point Lab Utama UniFi U6-Lite','Access Point','192.168.10.11','70:A7:41:99:AA:05',2,2,'Ping','{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}','unknown',2,NULL,'2026-10-03','Wi-Fi access point area laboratorium utama',60,5,3,'2026-10-11 22:34:53','2026-10-12 08:19:50',NULL),(7,'NET-SRV-01','Server Monitoring T-AIMS Ubuntu','Server','192.168.10.20','00:0C:29:DD:EE:07',2,2,'HTTP','{\"http_path\": \"/health\", \"http_port\": 3000, \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 30}','unknown',1,NULL,'2026-10-04','Server host aplikasi web monitoring T-AIMS',30,5,3,'2026-10-11 22:34:53','2026-10-12 08:19:50',NULL),(8,'NET-GW-01','Firewall & Gateway pfSense','Firewall','192.168.10.254','00:0C:29:11:33:08',2,2,'Ping','{\"snmp_community\": \"public\", \"http_path\": \"/\", \"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 30}','unknown',1,NULL,'2026-10-04','Edge firewall dan traffic monitoring lab',30,3,3,'2026-10-11 22:34:53','2026-10-12 08:19:50',NULL),(9,'NET-DNS-01','DNS & DHCP Server Pi-hole','Server','192.168.10.5','B8:27:EB:44:66:09',2,2,'TCP','{\"http_path\": \"/health\", \"http_port\": 3000, \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 30}','unknown',1,NULL,'2026-10-05','Layanan resolusi domain dan DHCP internal lab',60,5,3,'2026-10-11 22:34:53','2026-10-12 08:19:50',NULL),(10,'NET-NAS-01','NAS Backup Synology DS220+','Storage','192.168.10.30','00:11:32:88:99:0A',2,2,'Ping','{\"snmp_community\": \"public\", \"timeout_seconds\": 5, \"retry_count\": 5, \"check_interval_seconds\": 60}','unknown',2,NULL,'2026-10-05','Penyimpanan cadangan file dan backup database',120,10,3,'2026-10-11 22:34:53','2026-10-12 08:19:50',NULL),(11,'IOT-ESP-01','ESP32 Monitoring Panel Surya','IoT Node','192.168.10.101','24:6F:28:AA:01:0B',2,3,'Heartbeat','{\"mqtt_topic\": \"taims_db/heartbeat/IOT-ESP-01\", \"timeout_seconds\": 90, \"check_interval_seconds\": 30}','offline',2,'2026-10-13 23:29:48','2026-10-06','Sensor DHT22 pemantau suhu ruangan lab utama',60,5,3,'2026-10-11 22:34:53','2026-10-14 11:53:34','2026-10-14 18:53:34'),(16,'NET-RTR-02','Router Marketing Office','Router','192.168.10.2',NULL,1,NULL,'Ping','{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 30}','offline',1,'2026-10-14 00:20:52','2026-10-12','Router Marketing Office — detail menyusul via web',30,3,3,'2026-10-12 08:19:50','2026-10-14 11:53:34','2026-10-14 18:53:34'),(17,'SEC-CCTV-01','CCTV Head Office','CCTV','192.168.10.31',NULL,2,NULL,'Ping + HTTP','{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}','offline',1,'2026-10-14 00:58:02','2026-10-12','CCTV Head Office — detail menyusul via web',60,5,3,'2026-10-12 08:19:50','2026-10-14 11:53:34','2026-10-14 18:53:34'),(18,'SEC-CCTV-02','CCTV Marketing Office','CCTV','192.168.10.32',NULL,1,NULL,'Ping + HTTP','{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}','unknown',1,NULL,'2026-10-12','CCTV Marketing Office — detail menyusul via web',60,5,3,'2026-10-12 08:19:50','2026-10-14 04:16:09',NULL),(19,'DISP-TV-01','Smart TV Xiaomi Head Office','TV','192.168.10.40',NULL,2,NULL,'Ping','{\"http_path\": \"/\", \"timeout_seconds\": 5, \"retry_count\": 3, \"check_interval_seconds\": 60}','offline',2,'2026-10-14 00:20:53','2026-10-12','Smart TV Xiaomi Head Office — detail menyusul via web',60,5,3,'2026-10-12 08:19:50','2026-10-14 11:53:34','2026-10-14 18:53:34'),(20,'PC-WS-01','PC Head Office 01','PC','192.168.10.41',NULL,2,NULL,'Ping','{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 60}','offline',2,'2026-10-14 00:20:53','2026-10-12','PC Head Office 01 — detail menyusul via web',60,3,3,'2026-10-12 08:19:50','2026-10-14 11:53:34','2026-10-14 18:53:34'),(21,'PC-WS-02','PC Head Office 02','PC','192.168.10.42',NULL,2,NULL,'Ping','{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 60}','unknown',2,NULL,'2026-10-12','PC Head Office 02 — detail menyusul via web',60,3,3,'2026-10-12 08:19:50','2026-10-14 04:16:09',NULL),(22,'IOT-RPI-01','Raspberry Pi Smart Home','IoT Node','192.168.10.102',NULL,2,NULL,'Heartbeat','{\"mqtt_topic\": \"taims_db/heartbeat/IOT-RPI-01\", \"timeout_seconds\": 90, \"check_interval_seconds\": 30}','offline',2,'2026-10-13 23:52:15','2026-10-12','Raspberry Pi Smart Home — detail menyusul via web',30,90,3,'2026-10-12 08:19:50','2026-10-14 11:53:34','2026-10-14 18:53:34'),(23,'NET-RTR-01','Router Utama MikroTik RB4011','Router','192.168.10.1','D4:CA:6D:11:22:01',2,2,'Ping','{\"timeout_seconds\": 3, \"retry_count\": 3, \"check_interval_seconds\": 30}','unknown',1,NULL,'2026-10-01','Router gateway utama lab Teknolab',30,3,3,'2026-10-13 05:17:29','2026-10-13 05:17:29',NULL);
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `incidents`
--

DROP TABLE IF EXISTS `incidents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `incidents` (
  `incident_id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(11) NOT NULL,
  `detected_at` datetime NOT NULL,
  `incident_type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  `incident_status` enum('open','investigating','resolved','closed') NOT NULL DEFAULT 'open',
  PRIMARY KEY (`incident_id`),
  KEY `asset_id` (`asset_id`),
  CONSTRAINT `fk_incidents_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incidents`
--

LOCK TABLES `incidents` WRITE;
/*!40000 ALTER TABLE `incidents` DISABLE KEYS */;
INSERT INTO `incidents` VALUES (2,3,'2026-10-12 12:52:43','[SIMULASI] Connection Loss','[DATA UJI / SIMULASI KEGAGALAN] Kabel LAN uplink lab dicabut untuk pengujian failure simulation. Monitoring engine mendeteksi ping timeout setelah 3x percobaan retry berturut-turut. Insiden telah diselesaikan saat kabel dipasang kembali.','high','resolved'),(3,7,'2026-10-12 13:22:43','[SIMULASI] Service Health Failure','[DATA UJI / SIMULASI KEGAGALAN] Service web monitoring dan daemon REST API dihentikan sementara untuk menguji HTTP health check. Endpoint mengembalikan HTTP status 503 Service Unavailable. Layanan telah direstart dan tiket insiden ditutup.','critical','closed'),(5,11,'2026-10-12 14:32:43','[SIMULASI] Power Cut / Heartbeat Timeout','[DATA UJI / SIMULASI KEGAGALAN] Catu daya mikrokontroler ESP32 dilepas untuk menguji deteksi offline sensor lab. Tidak ada paket heartbeat telemetry yang diterima sistem selama lebih dari 180 detik. Status insiden masih terbuka (open).','medium','open'),(6,11,'2026-10-14 18:53:34','Device Offline','Device IOT-ESP-01 (ESP32 Monitoring Panel Surya) tidak merespons sejak 2026-10-13 23:29:48','medium','open'),(7,16,'2026-10-14 18:53:34','Device Offline','Device NET-RTR-02 (Router Marketing Office) tidak merespons sejak 2026-10-14 00:20:52','high','open'),(8,17,'2026-10-14 18:53:34','Device Offline','Device SEC-CCTV-01 (CCTV Head Office) tidak merespons sejak 2026-10-14 00:58:02','high','open'),(9,19,'2026-10-14 18:53:34','Device Offline','Device DISP-TV-01 (Smart TV Xiaomi Head Office) tidak merespons sejak 2026-10-14 00:20:53','medium','open'),(10,20,'2026-10-14 18:53:34','Device Offline','Device PC-WS-01 (PC Head Office 01) tidak merespons sejak 2026-10-14 00:20:53','medium','open'),(11,22,'2026-10-14 18:53:34','Device Offline','Device IOT-RPI-01 (Raspberry Pi Smart Home) tidak merespons sejak 2026-10-13 23:52:15','medium','open');
/*!40000 ALTER TABLE `incidents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `location_id` int(11) NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Marketing Office','Lokasi perangkat untuk pengujian T-AIMS dan workstation'),(2,'Head Office','Pusat rack server, switch backbone, firewall, dan storage');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenance`
--

DROP TABLE IF EXISTS `maintenance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenance` (
  `maintenance_id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(11) NOT NULL,
  `maintenance_type` varchar(100) NOT NULL,
  `scheduled_date` datetime DEFAULT NULL,
  `performed_at` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `maintenance_status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`maintenance_id`),
  KEY `asset_id` (`asset_id`),
  CONSTRAINT `fk_maintenance_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenance`
--

LOCK TABLES `maintenance` WRITE;
/*!40000 ALTER TABLE `maintenance` DISABLE KEYS */;
INSERT INTO `maintenance` VALUES (3,7,'Firmware / OS Security Update','2026-10-17 14:45:55',NULL,'[DATA CONTOH] Pemeliharaan terjadwal: Pembaruan paket keamanan OS Ubuntu Server, rotasi dan pengarsipan log monitoring berkala, serta pengecekan performa daemon MariaDB.','scheduled','2026-10-12 07:45:55'),(4,10,'Storage & Backup Integrity Audit','2026-10-19 14:45:55',NULL,'[DATA CONTOH] Pemeliharaan terjadwal: Audit kapasitas hard drive RAID 1, pengujian verifikasi pemulihan file backup snapshot basis data taims_db, dan pembersihan filter casing NAS.','scheduled','2026-10-12 07:45:55'),(5,11,'Kalibrasi & Pemeriksaan Sensor','2026-10-13 14:45:55',NULL,'[DATA CONTOH] Pemeliharaan sedang berjalan: Uji komparasi presisi pembacaan probe sensor DHT22 terhadap higrometer standar lab dan pemeriksaan stabilitas catu daya micro-USB.','in_progress','2026-10-12 07:45:55');
/*!40000 ALTER TABLE `maintenance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitoring_logs`
--

DROP TABLE IF EXISTS `monitoring_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `monitoring_logs` (
  `log_id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(11) NOT NULL,
  `check_time` datetime NOT NULL,
  `status` enum('unknown','online','offline','error') NOT NULL DEFAULT 'unknown',
  `method` varchar(20) DEFAULT NULL,
  `source` varchar(20) DEFAULT 'monitoring_engine',
  `response_time_ms` int(11) NOT NULL,
  `details` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`log_id`),
  KEY `asset_id` (`asset_id`),
  CONSTRAINT `fk_monitoring_logs_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitoring_logs`
--

LOCK TABLES `monitoring_logs` WRITE;
/*!40000 ALTER TABLE `monitoring_logs` DISABLE KEYS */;
INSERT INTO `monitoring_logs` VALUES (4,7,'2026-10-12 09:53:19','online',NULL,'monitoring_engine',4,'[DATA UJI / SIMULASI] Simulasi HTTP check endpoint monitoring 4 ms untuk verifikasi relasi aset NET-SRV-01','2026-10-12 03:02:19'),(5,8,'2026-10-12 09:56:19','online',NULL,'monitoring_engine',3,'[DATA UJI / SIMULASI] Simulasi gateway packet filter ping 3 ms untuk verifikasi relasi aset NET-GW-01','2026-10-12 03:02:19'),(8,11,'2026-10-13 23:21:21','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-56,\"uptime_seconds\":5,\"temperature\":27.5,\"humidity\":64.2,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:21:21'),(9,11,'2026-10-13 23:21:43','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"offline\",\"reason\":\"power_lost\"}','2026-10-13 16:21:43'),(10,11,'2026-10-13 23:21:43','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-50,\"uptime_seconds\":1,\"temperature\":29.2,\"humidity\":63,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:21:43'),(11,11,'2026-10-13 23:21:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"offline\",\"reason\":\"power_lost\"}','2026-10-13 16:21:55'),(12,11,'2026-10-13 23:21:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-49,\"uptime_seconds\":1,\"temperature\":27.6,\"humidity\":66.5,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:21:55'),(13,11,'2026-10-13 23:22:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-48,\"uptime_seconds\":31,\"temperature\":28.2,\"humidity\":66.7,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:22:25'),(14,11,'2026-10-13 23:22:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-50,\"uptime_seconds\":61,\"temperature\":29.3,\"humidity\":66.5,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:22:55'),(15,11,'2026-10-13 23:23:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-52,\"uptime_seconds\":91,\"temperature\":29,\"humidity\":64.7,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:23:25'),(16,11,'2026-10-13 23:23:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-53,\"uptime_seconds\":121,\"temperature\":27.7,\"humidity\":63.9,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:23:55'),(17,11,'2026-10-13 23:24:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-52,\"uptime_seconds\":151,\"temperature\":28.3,\"humidity\":66.5,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:24:25'),(18,11,'2026-10-13 23:24:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-55,\"uptime_seconds\":181,\"temperature\":28.1,\"humidity\":63.2,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:24:55'),(19,11,'2026-10-13 23:25:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-59,\"uptime_seconds\":211,\"temperature\":27.7,\"humidity\":65.5,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:25:25'),(20,11,'2026-10-13 23:25:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-59,\"uptime_seconds\":241,\"temperature\":28.8,\"humidity\":64.3,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:25:55'),(21,11,'2026-10-13 23:26:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-59,\"uptime_seconds\":271,\"temperature\":28.2,\"humidity\":64.4,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:26:25'),(22,11,'2026-10-13 23:26:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-47,\"uptime_seconds\":301,\"temperature\":29,\"humidity\":65,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:26:55'),(23,11,'2026-10-13 23:27:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-50,\"uptime_seconds\":331,\"temperature\":29.2,\"humidity\":64.8,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:27:25'),(24,11,'2026-10-13 23:27:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-55,\"uptime_seconds\":361,\"temperature\":28.1,\"humidity\":63.1,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:27:55'),(25,11,'2026-10-13 23:28:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-48,\"uptime_seconds\":391,\"temperature\":29.2,\"humidity\":63.9,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:28:25'),(26,11,'2026-10-13 23:28:55','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-48,\"uptime_seconds\":421,\"temperature\":28.5,\"humidity\":66,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:28:55'),(27,11,'2026-10-13 23:29:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"online\",\"ip_address\":\"192.168.1.58\",\"rssi\":-59,\"uptime_seconds\":451,\"temperature\":27.6,\"humidity\":65.5,\"firmware_version\":\"1.0.0-hw\"}','2026-10-13 16:29:25'),(28,11,'2026-10-13 23:29:48','online','Heartbeat','device',0,'{\"device_id\":\"IOT-ESP-01\",\"status\":\"offline\",\"reason\":\"power_lost\"}','2026-10-13 16:29:48'),(29,22,'2026-10-13 23:35:50','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:35:50.169845+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":0,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:35:50'),(30,22,'2026-10-13 23:36:08','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"offline\",\"reason\":\"connection_lost\"}','2026-10-13 16:36:08'),(31,22,'2026-10-13 23:36:08','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:36:08.671518+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":0,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:36:08'),(32,22,'2026-10-13 23:36:25','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"offline\",\"reason\":\"connection_lost\"}','2026-10-13 16:36:25'),(33,22,'2026-10-13 23:36:42','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:36:42.021707+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":2,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:36:42'),(34,22,'2026-10-13 23:37:14','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:37:14.029107+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":34,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:37:14'),(35,22,'2026-10-13 23:37:46','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:37:46.038126+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":66,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:37:46'),(36,22,'2026-10-13 23:47:08','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:47:08.926622+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":2,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:47:09'),(37,22,'2026-10-13 23:47:40','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:47:40.946517+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":34,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:47:41'),(38,22,'2026-10-13 23:48:12','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:48:12.962914+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":66,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:48:13'),(39,22,'2026-10-13 23:51:11','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:51:11.805723+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":2,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:51:12'),(40,22,'2026-10-13 23:51:43','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:51:43.950981+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":34,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:51:44'),(41,22,'2026-10-13 23:52:15','online','Heartbeat','device',0,'{\"device_id\":\"IOT-RPI-01\",\"status\":\"online\",\"timestamp\":\"2026-10-13T23:52:15.962698+07:00\",\"ip_address\":\"192.168.1.55\",\"uptime_seconds\":66,\"firmware_version\":\"1.0.0-rpi\"}','2026-10-13 16:52:16'),(42,16,'2026-10-14 00:20:52','online','Heartbeat','device',0,'{\"device_id\":\"NET-RTR-02\",\"status\":\"online\",\"timestamp\":\"2026-10-14T00:20:52.089334+07:00\",\"ip_address\":\"192.168.1.1\",\"uptime_seconds\":120,\"firmware_version\":\"1.0.0-ping\",\"response_time_ms\":3}','2026-10-13 17:20:52'),(43,17,'2026-10-14 00:20:52','online','Heartbeat','device',0,'{\"device_id\":\"SEC-CCTV-01\",\"status\":\"offline\",\"timestamp\":\"2026-10-14T00:20:52.611256+07:00\",\"ip_address\":\"192.168.1.30\",\"uptime_seconds\":120,\"firmware_version\":\"1.0.0-ping\",\"response_time_ms\":0}','2026-10-13 17:20:52'),(44,19,'2026-10-14 00:20:53','online','Heartbeat','device',0,'{\"device_id\":\"DISP-TV-01\",\"status\":\"offline\",\"timestamp\":\"2026-10-14T00:20:53.119551+07:00\",\"ip_address\":\"192.168.1.20\",\"uptime_seconds\":120,\"firmware_version\":\"1.0.0-ping\",\"response_time_ms\":0}','2026-10-13 17:20:53'),(45,20,'2026-10-14 00:20:53','online','Heartbeat','device',0,'{\"device_id\":\"PC-WS-01\",\"status\":\"offline\",\"timestamp\":\"2026-10-14T00:20:53.626020+07:00\",\"ip_address\":\"192.168.1.10\",\"uptime_seconds\":120,\"firmware_version\":\"1.0.0-ping\",\"response_time_ms\":0}','2026-10-13 17:20:53'),(46,17,'2026-10-14 00:53:55','online','Heartbeat','device',0,'{\"device_id\":\"SEC-CCTV-01\",\"status\":\"online\",\"timestamp\":\"2026-10-14T00:53:55.872939+07:00\",\"ip_address\":\"192.168.137.177\",\"mac_address\":\"94:F8:27:B4:A8:9E\",\"device_name\":\"CCTV Head Office (Physical IP Cam)\",\"response_time_ms\":12,\"uptime_seconds\":360,\"firmware_version\":\"1.0.0-ipc\"}','2026-10-13 17:53:56'),(47,17,'2026-10-14 00:58:02','online','Heartbeat','device',0,'{\"device_id\":\"SEC-CCTV-01\",\"status\":\"online\",\"timestamp\":\"2026-10-14T00:58:02.560572+07:00\",\"ip_address\":\"192.168.137.177\",\"mac_address\":\"94:F8:27:B4:A8:9E\",\"device_name\":\"CCTV Head Office (Physical IP Cam)\",\"response_time_ms\":12,\"uptime_seconds\":360,\"firmware_version\":\"1.0.0-ipc\"}','2026-10-13 17:58:03');
/*!40000 ALTER TABLE `monitoring_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `asset_id` int(11) DEFAULT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `asset_id` (`asset_id`),
  CONSTRAINT `fk_notifications_assets` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`asset_id`),
  CONSTRAINT `fk_notifications_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (2,2,3,'[ALERT OFFLINE] NET-SWD-01 Terputus','[DATA UJI / SIMULASI] Peringatan: Switch D-Link DGS-1210 (192.168.10.3) di Laboratorium tidak merespons ping selama 3x percobaan retry berturut-turut. Status perangkat diubah menjadi OFFLINE.',1,'2026-10-12 05:25:51'),(3,2,3,'[RECOVERY ALERT] NET-SWD-01 Kembali Normal','[DATA UJI / SIMULASI] Pemulihan: Switch D-Link DGS-1210 (192.168.10.3) di Laboratorium telah merespons kembali dengan latensi 2 ms. Status perangkat dipulihkan menjadi ONLINE.',1,'2026-10-12 05:40:51'),(4,5,7,'[ALERT CRITICAL] NET-SRV-01 Service HTTP Gagal','[DATA UJI / SIMULASI] Peringatan: Endpoint REST API pada Server Monitoring Ubuntu (192.168.10.20) mengembalikan respons error 503 Service Unavailable. Harap periksa service daemon backend.',1,'2026-10-12 05:55:51'),(5,5,7,'[RECOVERY ALERT] NET-SRV-01 Layanan Pulih','[DATA UJI / SIMULASI] Pemulihan: Layanan REST API Server Monitoring Ubuntu (192.168.10.20) telah kembali aktif dan merespons permintaan HTTP normal (latensi 4 ms).',1,'2026-10-12 06:10:51'),(7,3,11,'[ALERT WARNING] IOT-ESP-01 Heartbeat Hilang','[DATA UJI / SIMULASI] Peringatan: Sensor DHT22 ESP32 (192.168.10.101) di Laboratorium tidak mengirimkan paket telemetri selama 180 detik. Status perangkat dialihkan menjadi OFFLINE.',0,'2026-10-12 07:05:51'),(8,3,11,'[ALERT OFFLINE] IOT-ESP-01 Terputus','Device ESP32 Monitoring Panel Surya (IOT-ESP-01) tidak merespons sejak 2026-10-13 23:29:48',0,'2026-10-14 11:53:34');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin T-AIMS','admin@taims_db.local',NULL,'super_admin'),(2,'Ananda Dwi Susanti','ananda@taims_db.local',NULL,'admin'),(3,'Ilvina Muvarika','ilvina@taims_db.local',NULL,'admin'),(4,'Faida Trisma Amelia','faida@taims_db.local',NULL,'admin'),(5,'Ahmad Reza Fahmi','reza.fahmi@taims_db.local','$2b$10$P468LoZyKFKA8Fo4AL4BZ.AViQIcdUnYeI9gBB8dxfhVR8C70YM9e','admin'),(6,'[DATA UJI] Operator Monitoring Lab','operator.uji@taims_db.local',NULL,'user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-14 20:21:03
