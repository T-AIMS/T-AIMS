#!/bin/bash
# =====================================================================
# T-AIMS CRON BACKUP WRAPPER
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Deskripsi        : Jembatan eksekusi cron menuju script devops/scripts/backup_db.sh
# =====================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_SCRIPT="$SCRIPT_DIR/../devops/scripts/backup_db.sh"

if [ -f "$TARGET_SCRIPT" ]; then
    exec bash "$TARGET_SCRIPT" "$@"
else
    echo "❌ Error: $TARGET_SCRIPT tidak ditemukan!"
    exit 1
fi
