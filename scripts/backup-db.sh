#!/bin/bash
# Script Backup Database T-AIMS
# Dibuat: 14 Oktober 2026
# Penanggung jawab: Wafian

BACKUP_DIR="/mnt/d/xampp/htdocs/T-AIMS/backup"
DATE=$(date +%Y-%m-%d)
FILENAME="taims_db_$DATE.sql"

echo "=== Backup Database T-AIMS ==="
echo "Tanggal: $DATE"

# Bikin folder backup kalau belum ada
mkdir -p "$BACKUP_DIR"

# Backup database
echo "1. Backup database..."
/mnt/d/xampp/mysql/bin/mysqldump.exe -u root taims_db > "$BACKUP_DIR/$FILENAME"

# Cek hasil
if [ -f "$BACKUP_DIR/$FILENAME" ]; then
    echo "2. Backup berhasil: $BACKUP_DIR/$FILENAME"
    SIZE=$(du -h "$BACKUP_DIR/$FILENAME" | cut -f1)
    echo "   Ukuran: $SIZE"
else
    echo "2. Backup GAGAL!"
    exit 1
fi

# Hapus backup lama (lebih dari 7 hari)
echo "3. Hapus backup lama..."
find "$BACKUP_DIR" -name "taims_db_*.sql" -mtime +7 -delete

echo "=== Selesai ==="
