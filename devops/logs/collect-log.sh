#!/bin/bash
# Script Log Harian T-AIMS
# Dibuat: 14 Oktober 2026
# Penanggung jawab: Wafian

LOG_DIR="/mnt/d/xampp/htdocs/T-AIMS/logs"
DATE=$(date +%Y-%m-%d)

echo "=== Collect Log: $DATE ==="

# Backup log MySQL
echo "1. Backup log MySQL..."
cp /mnt/d/xampp/mysql/data/mysql_error.log "$LOG_DIR/database/mysql_$DATE.log" 2>/dev/null

# Backup log MQTT
echo "2. Backup log MQTT..."
sudo cp /var/log/mosquitto/mosquitto.log "$LOG_DIR/mqtt/mosquitto_$DATE.log" 2>/dev/null

# Hapus log lama (lebih dari 7 hari)
echo "3. Hapus log lama..."
find "$LOG_DIR" -name "*.log" -mtime +7 -delete

echo "=== Selesai ==="
