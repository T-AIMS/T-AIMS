#!/bin/bash
# =====================================================================
# T-AIMS SERVICE LOG COLLECTION WRAPPER
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Deskripsi        : Forwarder menuju devops/scripts/collect_log.sh
# =====================================================================

EXEC_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$EXEC_DIR/../scripts/collect_log.sh" "$@"
