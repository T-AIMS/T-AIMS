#!/bin/bash
# =====================================================================
# T-AIMS PORTABLE DATABASE BACKUP SCRIPT
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Deskripsi        : Pencadangan otomatis database MySQL taims_db
# =====================================================================

# 1. Tentukan Direktori Proyek Dinamis (Relative Path)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/database/backups}"

DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="taims_db_backup_$DATE.sql"

echo "=== T-AIMS Database Backup ==="
echo "Waktu   : $(date '+%Y-%m-%d %H:%M:%S WIB')"
echo "Target  : $BACKUP_DIR/$FILENAME"

# 2. Buat folder backup jika belum ada
mkdir -p "$BACKUP_DIR"

# 3. Deteksi Binary mysqldump (Linux/Docker/XAMPP Windows)
if command -v mysqldump &> /dev/null; then
    DUMP_BIN="mysqldump"
elif [ -f "/mnt/d/xampp/mysql/bin/mysqldump.exe" ]; then
    DUMP_BIN="/mnt/d/xampp/mysql/bin/mysqldump.exe"
elif [ -f "/mnt/c/xampp/mysql/bin/mysqldump.exe" ]; then
    DUMP_BIN="/mnt/c/xampp/mysql/bin/mysqldump.exe"
else
    echo "❌ Error: mysqldump tidak ditemukan di sistem!"
    exit 1
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_USER="${DB_USER:-root}"
DB_NAME="${DB_NAME:-taims_db}"

echo "Menjalankan mysqldump via $DUMP_BIN..."
$DUMP_BIN -h "$DB_HOST" -u "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/$FILENAME" 2>/dev/null || \
$DUMP_BIN -u "$DB_USER" "$DB_NAME" > "$BACKUP_DIR/$FILENAME"

# 4. Validasi Ukuran File Backup
if [ -s "$BACKUP_DIR/$FILENAME" ]; then
    SIZE=$(du -h "$BACKUP_DIR/$FILENAME" | cut -f1)
    echo "✅ Backup Berhasil: $FILENAME ($SIZE)"
else
    echo "❌ Backup GAGAL atau file kosong!"
    rm -f "$BACKUP_DIR/$FILENAME"
    exit 1
fi

# 5. Rotasi Pembersihan Backup Usang (> 7 Hari)
echo "Membersihkan backup yang berusia lebih dari 7 hari..."
find "$BACKUP_DIR" -name "taims_db_*.sql" -mtime +7 -delete

echo "=== Backup Selesai Tuntas ==="
