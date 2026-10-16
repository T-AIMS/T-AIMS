#!/bin/bash
# =====================================================================
# T-AIMS SERVICE LOG COLLECTION & ROTATION SCRIPT
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Deskripsi        : Pengumpulan log terpusat 5 layanan dan rotasi 7 hari
# =====================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$PROJECT_ROOT/logs"
DATE=$(date +%Y-%m-%d)

echo "=== T-AIMS Service Log Collection: $DATE ==="
mkdir -p "$LOG_DIR/database" "$LOG_DIR/mqtt" "$LOG_DIR/backend" "$LOG_DIR/systemd"

# 1. Collect Log Database (Host XAMPP / Docker)
echo "1. Mengumpulkan log database..."
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^taims-mysql$"; then
    docker logs --tail 200 taims-mysql > "$LOG_DIR/database/mysql_$DATE.log" 2>/dev/null
elif [ -f "/mnt/d/xampp/mysql/data/mysql_error.log" ]; then
    cp "/mnt/d/xampp/mysql/data/mysql_error.log" "$LOG_DIR/database/mysql_$DATE.log" 2>/dev/null
fi

# 2. Collect Log MQTT (Host Mosquitto / Docker)
echo "2. Mengumpulkan log MQTT broker..."
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^taims-mosquitto$"; then
    docker logs --tail 200 taims-mosquitto > "$LOG_DIR/mqtt/mosquitto_$DATE.log" 2>/dev/null
elif [ -f "/var/log/mosquitto/mosquitto.log" ]; then
    sudo cp "/var/log/mosquitto/mosquitto.log" "$LOG_DIR/mqtt/mosquitto_$DATE.log" 2>/dev/null
fi

# 3. Collect Log Backend & Systemd Service
echo "3. Mengumpulkan log backend & systemd service..."
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^taims-backend$"; then
    docker logs --tail 200 taims-backend > "$LOG_DIR/backend/backend_$DATE.log" 2>/dev/null
fi

if systemctl is-active --quiet taims-monitoring.service 2>/dev/null; then
    journalctl -u taims-monitoring.service --no-pager -n 100 > "$LOG_DIR/systemd/monitoring_$DATE.log" 2>/dev/null
fi

# 4. Hapus log usang (> 7 hari)
echo "4. Membersihkan berkas log berusia lebih dari 7 hari..."
find "$LOG_DIR" -name "*.log" -mtime +7 -delete 2>/dev/null

echo "=== Koleksi Log Selesai Tuntas ==="
