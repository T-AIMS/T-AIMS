#!/bin/bash
# ==============================================================================
# T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
# Script Otomasi Backup Harian Basis Data MySQL
# Fitur: Hot-Backup (No Downtime), Kompresi Gzip, Retensi 7 Hari & Logging
# ==============================================================================

set -eo pipefail

# Warna terminal untuk output interaktif
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Direktori Script & Root Project
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Cari file .env (taims-backend/.env atau home)
ENV_FILE=""
if [ -f "${BACKEND_DIR}/.env" ]; then
    ENV_FILE="${BACKEND_DIR}/.env"
elif [ -f "/home/taims-teknolab/taims-backend/.env" ]; then
    ENV_FILE="/home/taims-teknolab/taims-backend/.env"
fi

if [ -n "$ENV_FILE" ]; then
    # Load konfigurasi database dari .env
    DB_HOST=$(grep -E '^DB_HOST=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '\r"' || echo "localhost")
    DB_PORT=$(grep -E '^DB_PORT=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '\r"' || echo "3306")
    DB_USER=$(grep -E '^DB_USER=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '\r"' || echo "root")
    DB_PASS=$(grep -E '^DB_PASS=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '\r"' || echo "")
    DB_NAME=$(grep -E '^DB_NAME=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '\r"' || echo "taims_db")
else
    DB_HOST="${DB_HOST:-localhost}"
    DB_PORT="${DB_PORT:-3306}"
    DB_USER="${DB_USER:-root}"
    DB_PASS="${DB_PASS:-}"
    DB_NAME="${DB_NAME:-taims_db}"
fi

# Konfigurasi Direktori Penyimpanan Backup & Log
BACKUP_BASE_DIR="/home/taims-teknolab/backups"
if [ ! -d "/home/taims-teknolab" ]; then
    BACKUP_BASE_DIR="${BACKEND_DIR}/backups"
fi

BACKUP_DIR="${BACKUP_BASE_DIR}/mysql"
LOG_FILE="${BACKUP_BASE_DIR}/backup.log"
RETENTION_DAYS=7

TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
BACKUP_FILENAME="${DB_NAME}_backup_${TIMESTAMP}.sql.gz"
BACKUP_FILEPATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

mkdir -p "$BACKUP_DIR"

log_msg() {
    local level="$1"
    local msg="$2"
    local now=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$now] [$level] $msg" >> "$LOG_FILE"
    
    if [ "$level" == "INFO" ]; then
        echo -e "${BLUE}[INFO]${NC} $msg"
    elif [ "$level" == "SUCCESS" ]; then
        echo -e "${GREEN}[SUCCESS]${NC} $msg"
    elif [ "$level" == "WARN" ]; then
        echo -e "${YELLOW}[WARN]${NC} $msg"
    elif [ "$level" == "ERROR" ]; then
        echo -e "${RED}[ERROR]${NC} $msg"
    fi
}

echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}  T-AIMS MYSQL AUTOMATED BACKUP & RETENTION ENGINE              ${NC}"
echo -e "${BLUE}================================================================${NC}"

log_msg "INFO" "Memulai pencadangan basis data T-AIMS..."
log_msg "INFO" "Target Database : ${DB_NAME} (${DB_HOST}:${DB_PORT})"
log_msg "INFO" "User Database   : ${DB_USER}"
log_msg "INFO" "Output File     : ${BACKUP_FILENAME}"

# Eksekusi mysqldump dengan mode non-blocking (single-transaction) & kompresi gzip maksimal (-9)
export MYSQL_PWD="$DB_PASS"

if mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" \
    --single-transaction \
    --quick \
    --skip-lock-tables \
    --routines \
    --triggers \
    "$DB_NAME" | gzip -9 > "$BACKUP_FILEPATH"; then
    
    unset MYSQL_PWD
    FILE_SIZE=$(ls -lh "$BACKUP_FILEPATH" | awk '{print $5}')
    log_msg "SUCCESS" "Backup berhasil dibuat: ${BACKUP_FILENAME} (Ukuran: ${FILE_SIZE})"
else
    unset MYSQL_PWD
    log_msg "ERROR" "Proses mysqldump mengalami kegagalan!"
    exit 1
fi

# Rotasi Retensi 7 Hari: Membersihkan arsip backup yang berusia lebih dari 7 hari
log_msg "INFO" "Memeriksa retensi arsip cadangan (> ${RETENTION_DAYS} hari)..."
OLD_BACKUPS=$(find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +${RETENTION_DAYS} 2>/dev/null || true)

if [ -n "$OLD_BACKUPS" ]; then
    DELETED_COUNT=$(echo "$OLD_BACKUPS" | wc -l)
    find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    log_msg "WARN" "Ditemukan dan dihapus ${DELETED_COUNT} file backup usang demi efisiensi storage."
else
    log_msg "INFO" "Kondisi storage optimal: Tidak ada file backup > ${RETENTION_DAYS} hari."
fi

# Hitung ringkasan arsip yang tersedia
TOTAL_BACKUPS=$(find "$BACKUP_DIR" -type f -name "*.sql.gz" | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
log_msg "SUCCESS" "Ringkasan: ${TOTAL_BACKUPS} arsip aktif tersimpan di ${BACKUP_DIR} (Total: ${TOTAL_SIZE})."
log_msg "INFO" "Siklus otomasi backup selesai dengan sukses."
echo -e "${GREEN}================================================================${NC}"
