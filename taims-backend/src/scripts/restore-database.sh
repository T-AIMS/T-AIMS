#!/bin/bash
# ==============================================================================
# T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
# Script Pemulihan Basis Data MySQL (Disaster Recovery Restore)
# Penggunaan: ./restore-database.sh <path-to-backup-file.sql.gz>
# ==============================================================================

set -eo pipefail

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}[ERROR] File backup belum ditentukan!${NC}"
    echo "Penggunaan: $0 <path-to-backup-file.sql.gz>"
    echo "Contoh: $0 /home/taims-teknolab/backups/mysql/taims_db_backup_2026-11-03_020000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}[ERROR] File backup '$BACKUP_FILE' tidak ditemukan!${NC}"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

ENV_FILE=""
if [ -f "${BACKEND_DIR}/.env" ]; then
    ENV_FILE="${BACKEND_DIR}/.env"
elif [ -f "/home/taims-teknolab/taims-backend/.env" ]; then
    ENV_FILE="/home/taims-teknolab/taims-backend/.env"
fi

if [ -n "$ENV_FILE" ]; then
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

echo -e "${YELLOW}================================================================${NC}"
echo -e "${YELLOW}  T-AIMS MYSQL DATABASE RESTORATION ENGINE                      ${NC}"
echo -e "${YELLOW}================================================================${NC}"
echo -e "Target Database : ${DB_NAME} (${DB_HOST}:${DB_PORT})"
echo -e "User Database   : ${DB_USER}"
echo -e "File Backup     : ${BACKUP_FILE}"
echo -e "${RED}[PERINGATAN] Operasi ini akan menimpa/memperbarui data tabel yang ada!${NC}"

export MYSQL_PWD="$DB_PASS"

echo -e "${BLUE}[INFO] Memulai proses dekompresi dan pemulihan database...${NC}"
if gunzip -c "$BACKUP_FILE" | mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" "$DB_NAME"; then
    unset MYSQL_PWD
    echo -e "${GREEN}[SUCCESS] Basis data berhasil dipulihkan dari ${BACKUP_FILE}!${NC}"
    echo -e "${GREEN}================================================================${NC}"
else
    unset MYSQL_PWD
    echo -e "${RED}[ERROR] Proses pemulihan database gagal!${NC}"
    exit 1
fi
