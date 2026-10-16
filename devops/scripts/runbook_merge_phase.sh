#!/bin/bash
# =====================================================================
# T-AIMS OPERATOR UTAMA RUNBOOK (MERGE PHASE - WSL)
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Deskripsi        : Alat kendali operasional terpadu Merge Phase di WSL
# =====================================================================

REAL_SCRIPT="$(readlink -f "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(cd "$(dirname "$REAL_SCRIPT")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

clear
echo -e "${BLUE}=====================================================================${NC}"
echo -e "${GREEN}        T-AIMS MASTER OPERATOR RUNBOOK — MERGE PHASE (WSL)${NC}"
echo -e "${BLUE}=====================================================================${NC}"
echo -e "Operator  : Wafian (DevOps, Server & Security Engineer)"
echo -e "Workspace : $PROJECT_ROOT"
echo -e "Waktu     : $(date '+%Y-%m-%d %H:%M:%S WIB')"
echo -e "${BLUE}=====================================================================${NC}"

menu() {
    echo ""
    echo -e "${YELLOW}PILIH TINDAKAN OPERASIONAL:${NC}"
    echo "  [1] Cek Kesehatan Semua Port & Layanan (Audit Cepat)"
    echo "  [2] Jalankan Master Health Check Resmi (verify_integration.py v1.3)"
    echo "  [3] Jalankan Uji Ketahanan & Simulasi 6 Kegagalan (Hal 17)"
    echo "  [4] Periksa Status Git & Sinkronisasi Remote Repository"
    echo "  [5] Restart Container Docker (Mosquitto & n8n)"
    echo "  [6] Eksekusi Pencadangan Database (backup_db.sh)"
    echo "  [7] Keluar"
    echo ""
    read -p "Pilihan Anda (1-7): " OPTION
    case $OPTION in
        1) check_ports ;;
        2) run_health_check ;;
        3) run_failure_test ;;
        4) check_git ;;
        5) restart_docker ;;
        6) run_backup ;;
        7) echo "Selesai. Sukses mengawal Merge Phase!"; exit 0 ;;
        *) echo -e "${RED}Pilihan tidak valid.${NC}"; menu ;;
    esac
}

check_ports() {
    echo -e "\n${BLUE}--- [1] AUDIT KONEKTIVITAS PORT & CONTAINER ---${NC}"
    GATEWAY="172.19.112.1"
    
    echo -n "• MySQL Database (3306)       : "
    nc -z -w 2 $GATEWAY 3306 2>/dev/null && echo -e "${GREEN}[OPEN]${NC}" || echo -e "${YELLOW}[TUTUP/PERLU XAMPP]${NC}"

    echo -n "• Mosquitto MQTT (1883)       : "
    nc -z -w 2 localhost 1883 2>/dev/null && echo -e "${GREEN}[OPEN]${NC}" || echo -e "${RED}[INAKTIF]${NC}"

    echo -n "• Backend API (3000)          : "
    nc -z -w 2 $GATEWAY 3000 2>/dev/null && echo -e "${GREEN}[OPEN]${NC}" || echo -e "${YELLOW}[TUTUP/PERLU START]${NC}"

    echo -n "• Frontend Dashboard (3001)   : "
    nc -z -w 2 $GATEWAY 3001 2>/dev/null && echo -e "${GREEN}[OPEN]${NC}" || echo -e "${YELLOW}[TUTUP/PERLU START]${NC}"

    echo -n "• n8n Automation (5678)       : "
    nc -z -w 2 localhost 5678 2>/dev/null && echo -e "${GREEN}[OPEN]${NC}" || echo -e "${RED}[INAKTIF]${NC}"

    echo -n "• Systemd Monitoring Daemon   : "
    systemctl is-active --quiet taims-monitoring.service && echo -e "${GREEN}[ACTIVE]${NC}" || echo -e "${RED}[INAKTIF]${NC}"

    echo ""
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    menu
}

run_health_check() {
    echo -e "\n${BLUE}--- [2] MENJALANKAN VERIFY_INTEGRATION.PY V1.3 ---${NC}"
    cd "$PROJECT_ROOT"
    python3 integration-management/verify_integration.py
    menu
}

run_failure_test() {
    echo -e "\n${BLUE}--- [3] MENJALANKAN SIMULASI 6 KEGAGALAN ---${NC}"
    bash "$PROJECT_ROOT/devops/scripts/test_failure_simulation.sh"
    menu
}

check_git() {
    echo -e "\n${BLUE}--- [4] STATUS GIT & REMOTE SYNC ---${NC}"
    cd "$PROJECT_ROOT"
    git status -s
    echo "Memeriksa remote origin/main..."
    git fetch origin
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    if [ "$LOCAL" = "$REMOTE" ]; then
        echo -e "${GREEN}✅ Branch 'main' up-to-date dengan remote GitHub!${NC}"
    else
        echo -e "${YELLOW}⚠️ Terdapat perbedaan commit antara lokal dan remote.${NC}"
        git log --oneline -n 3
    fi
    menu
}

restart_docker() {
    echo -e "\n${BLUE}--- [5] RESTART DOCKER CONTAINERS ---${NC}"
    docker restart taims-mosquitto taims-n8n
    echo -e "${GREEN}✅ Container Mosquitto & n8n telah direstart.${NC}"
    menu
}

run_backup() {
    echo -e "\n${BLUE}--- [6] EKSEKUSI PENCADANGAN DATABASE ---${NC}"
    bash "$PROJECT_ROOT/devops/scripts/backup_db.sh"
    menu
}

# Mulai menu interaktif
menu
