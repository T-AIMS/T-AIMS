#!/bin/bash
# =====================================================================
# T-AIMS PORTABLE DATABASE BACKUP SCRIPT
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Deskripsi        : Pencadangan otomatis database MySQL taims_db
# =====================================================================

REAL_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(cd "$(dirname "$REAL_SCRIPT")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/database/backups}"
LOG_FILE="$PROJECT_ROOT/logs/backup.log"

DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="taims_db_backup_$DATE.sql"
TARGET_PATH="$BACKUP_DIR/$FILENAME"

mkdir -p "$BACKUP_DIR"
mkdir -p "$PROJECT_ROOT/logs"

log() {
    local MSG="[$(date '+%Y-%m-%d %H:%M:%S WIB')] $1"
    echo "$MSG"
    echo "$MSG" >> "$LOG_FILE"
}

log "=== T-AIMS Database Backup Started ==="
log "Target: $TARGET_PATH"

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-root_taims_2026}"
DB_NAME="${DB_NAME:-taims_db}"

BACKUP_SUCCESS=false

# 1. Coba dump via Docker Container taims-mysql jika aktif
if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "^taims-mysql$"; then
    log "Mendeteksi container 'taims-mysql' aktif, menjalankan docker exec mysqldump..."
    if docker exec taims-mysql mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$TARGET_PATH" 2>/dev/null; then
        if [ -s "$TARGET_PATH" ]; then
            BACKUP_SUCCESS=true
        fi
    fi
fi

# 2. Coba dump via binary host (Linux mysqldump atau XAMPP Windows)
if [ "$BACKUP_SUCCESS" = false ]; then
    DUMP_BIN=""
    if command -v mysqldump &> /dev/null; then
        DUMP_BIN="mysqldump"
    elif [ -f "/mnt/d/xampp/mysql/bin/mysqldump.exe" ]; then
        DUMP_BIN="/mnt/d/xampp/mysql/bin/mysqldump.exe"
    elif [ -f "/mnt/c/xampp/mysql/bin/mysqldump.exe" ]; then
        DUMP_BIN="/mnt/c/xampp/mysql/bin/mysqldump.exe"
    fi

    if [ -n "$DUMP_BIN" ]; then
        log "Menjalankan mysqldump via binary host: $DUMP_BIN ($DB_HOST:$DB_PORT)..."
        # Coba dengan password jika disetel
        if [ -n "$DB_PASS" ] && [ "$DB_PASS" != "root_taims_2026" ]; then
            $DUMP_BIN -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$TARGET_PATH" 2>/dev/null
        else
            $DUMP_BIN -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME" > "$TARGET_PATH" 2>/dev/null || \
            $DUMP_BIN -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$TARGET_PATH" 2>/dev/null || \
            $DUMP_BIN -u "$DB_USER" "$DB_NAME" > "$TARGET_PATH" 2>/dev/null
        fi

        if [ -s "$TARGET_PATH" ]; then
            BACKUP_SUCCESS=true
        fi
    fi
fi

# 3. Validasi Hasil Backup
if [ "$BACKUP_SUCCESS" = true ] && [ -s "$TARGET_PATH" ]; then
    SIZE=$(du -h "$TARGET_PATH" | cut -f1)
    log "✅ Backup Berhasil: $FILENAME ($SIZE)"
else
    log "⚠️ Warning: Database service offline saat backup dijalankan. Mencatat fallback status."
    rm -f "$TARGET_PATH"
fi

# 4. Rotasi Pembersihan Backup Usang (> 7 Hari)
log "Membersihkan arsip backup yang berusia lebih dari 7 hari..."
find "$BACKUP_DIR" -name "taims_db_*.sql" -mtime +7 -delete 2>/dev/null

log "=== T-AIMS Database Backup Finished ==="
