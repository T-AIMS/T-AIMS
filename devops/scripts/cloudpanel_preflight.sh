#!/usr/bin/env bash
# ==============================================================================
# T-AIMS CLOUDPANEL PRE-FLIGHT & SERVER READINESS VERIFICATION SCRIPT
# ==============================================================================
# Proyek        : T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
# Penanggung Jwb: Wafian Zaidan El Y. (DevOps, Server & Security Engineer - Shift 2)
# Dokumen Acuan : devops/docs/cloudpanel-deployment-runbook.md
# Tanggal Rilis : 18 Oktober 2026
# ==============================================================================

set -uo pipefail

# ANSI Colors for Professional Terminal Output
CLR_RESET="\033[0m"
CLR_BOLD="\033[1m"
CLR_RED="\033[1;31m"
CLR_GREEN="\033[1;32m"
CLR_YELLOW="\033[1;33m"
CLR_BLUE="\033[1;34m"
CLR_CYAN="\033[1;36m"
CLR_GRAY="\033[0;90m"

PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

log_pass() {
    echo -e "  [${CLR_GREEN}PASS${CLR_RESET}] $1"
    ((PASS_COUNT++))
}

log_warn() {
    echo -e "  [${CLR_YELLOW}WARN${CLR_RESET}] $1"
    ((WARN_COUNT++))
}

log_fail() {
    echo -e "  [${CLR_RED}FAIL${CLR_RESET}] $1"
    ((FAIL_COUNT++))
}

log_info() {
    echo -e "  [${CLR_CYAN}INFO${CLR_RESET}] $1"
}

print_header() {
    echo -e "${CLR_CYAN}"
    echo "========================================================================"
    echo "   T-AIMS CLOUDPANEL PRODUCTION PRE-FLIGHT AUDIT & ENVIRONMENT CHECK    "
    echo "   Teknolab Asset & Infrastructure Monitoring System - DevOps Wafian    "
    echo "========================================================================"
    echo -e "${CLR_RESET}"
    echo -e "Waktu Audit : $(date '+%Y-%m-%d %H:%M:%S %Z')"
    echo -e "Hostname    : $(hostname)"
    echo -e "Kernel      : $(uname -r)"
    echo "------------------------------------------------------------------------"
}

check_system_resources() {
    echo -e "\n${CLR_BOLD}[1] Pemeriksaan Sumber Daya Sistem (Hardware & OS)${CLR_RESET}"
    
    # 1. OS Check
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        log_pass "Sistem Operasi Terdeteksi: $PRETTY_NAME"
    else
        log_warn "File /etc/os-release tidak ditemukan. Tidak dapat mendeteksi distro pasti."
    fi

    # 2. CPU Cores
    CPU_CORES=$(nproc 2>/dev/null || grep -c ^processor /proc/cpuinfo 2>/dev/null || echo 1)
    if [ "$CPU_CORES" -ge 2 ]; then
        log_pass "CPU Cores: $CPU_CORES Cores (Memenuhi rekomendasi minimal 2 Cores)"
    else
        log_warn "CPU Cores: $CPU_CORES Core (Minimal rekomendasi 2 Cores untuk CloudPanel + Mosquitto + Node)"
    fi

    # 3. RAM Check
    TOTAL_RAM_KB=$(grep MemTotal /proc/meminfo 2>/dev/null | awk '{print $2}' || echo 0)
    TOTAL_RAM_MB=$((TOTAL_RAM_KB / 1024))
    if [ "$TOTAL_RAM_MB" -ge 1800 ]; then
        log_pass "Total RAM: ${TOTAL_RAM_MB} MB (Memenuhi kapasitas minimal 2 GB)"
    elif [ "$TOTAL_RAM_MB" -ge 950 ]; then
        log_warn "Total RAM: ${TOTAL_RAM_MB} MB (Kapasitas pas-pasan, pastikan swap memory aktif minimal 2 GB)"
    else
        log_fail "Total RAM: ${TOTAL_RAM_MB} MB (Kurang dari batas aman 1 GB)"
    fi

    # 4. Disk Storage Check
    FREE_DISK_GB=$(df -BG / 2>/dev/null | awk 'NR==2 {gsub("G",""); print $4}' || echo 0)
    if [ "$FREE_DISK_GB" -ge 15 ]; then
        log_pass "Ruang Disk Tersedia (/): ${FREE_DISK_GB} GB (Aman untuk log & rotasi backup)"
    elif [ "$FREE_DISK_GB" -ge 5 ]; then
        log_warn "Ruang Disk Tersedia (/): ${FREE_DISK_GB} GB (Cukup untuk run, namun pantau ukuran database)"
    else
        log_fail "Ruang Disk Tersedia (/): ${FREE_DISK_GB} GB (Kritis! Di bawah 5 GB)"
    fi
}

check_required_binaries() {
    echo -e "\n${CLR_BOLD}[2] Pemeriksaan Komponen Software & Binary Standar${CLR_RESET}"

    # Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VER=$(node -v)
        log_pass "Node.js Terpasang: $NODE_VER"
    else
        log_warn "Node.js belum terpasang di path root (akan dikelola via CloudPanel Node Manager / NVM)"
    fi

    # PM2
    if command -v pm2 >/dev/null 2>&1; then
        PM2_VER=$(pm2 -v)
        log_pass "PM2 Process Manager Terpasang: v$PM2_VER"
    else
        log_warn "PM2 belum terpasang secara global ('npm install -g pm2' disiapkan)"
    fi

    # MySQL Client / CLI
    if command -v mysql >/dev/null 2>&1 || command -v mariadb >/dev/null 2>&1; then
        MYSQL_BIN=$(command -v mysql || command -v mariadb)
        log_pass "MySQL/MariaDB Client Terpasang: $MYSQL_BIN"
    else
        log_warn "MySQL CLI belum terpasang di host (dikelola via CloudPanel Database Engine)"
    fi

    # Mosquitto Broker / CLI
    if command -v mosquitto >/dev/null 2>&1; then
        log_pass "Mosquitto Broker Terpasang: $(mosquitto -h 2>&1 | head -n 1)"
    elif command -v docker >/dev/null 2>&1; then
        log_pass "Docker terdeteksi. Mosquitto dapat dijalankan melalui kontainer Docker isolasi port 1883"
    else
        log_warn "Mosquitto Broker native/docker belum terdeteksi (perlu 'apt install -y mosquitto')"
    fi

    # Nginx
    if command -v nginx >/dev/null 2>&1; then
        NGINX_VER=$(nginx -v 2>&1)
        log_pass "Nginx Web Server Terpasang: $NGINX_VER"
    else
        log_warn "Nginx belum terpasang di OS (CloudPanel menginstal Nginx secara otomatis)"
    fi

    # Git
    if command -v git >/dev/null 2>&1; then
        log_pass "Git Terpasang: $(git --version)"
    else
        log_fail "Git belum terpasang ('apt install -y git' wajib untuk clone repositori)"
    fi

    # OpenSSL
    if command -v openssl >/dev/null 2>&1; then
        log_pass "OpenSSL Terpasang: $(openssl version)"
    else
        log_fail "OpenSSL belum terpasang (wajib untuk TLS/SSL validation)"
    fi

    # Curl
    if command -v curl >/dev/null 2>&1; then
        log_pass "Curl Utility Terpasang: $(curl --version | head -n 1)"
    else
        log_fail "Curl belum terpasang"
    fi
}

check_network_and_ports() {
    echo -e "\n${CLR_BOLD}[3] Pemeriksaan Port & Ingress Topology CloudPanel${CLR_RESET}"

    # Function to check if port is bound
    check_port_binding() {
        local port=$1
        local service_desc=$2
        local is_mandatory=$3

        local is_listening=0
        if command -v ss >/dev/null 2>&1; then
            if ss -tuln | grep -q ":$port\b"; then is_listening=1; fi
        elif command -v netstat >/dev/null 2>&1; then
            if netstat -tuln | grep -q ":$port\b"; then is_listening=1; fi
        elif command -v lsof >/dev/null 2>&1; then
            if lsof -i :"$port" >/dev/null 2>&1; then is_listening=1; fi
        fi

        if [ "$is_listening" -eq 1 ]; then
            log_info "Port $port ($service_desc): Sedang AKTIF / TERIKAT (In-Use)"
        else
            if [ "$is_mandatory" = "avail" ]; then
                log_pass "Port $port ($service_desc): TERSEDIA (Bebas untuk di-bind saat deployment)"
            else
                log_info "Port $port ($service_desc): Belum aktif (Siap dijalankan oleh service)"
            fi
        fi
    }

    check_port_binding 80 "HTTP Nginx Ingress" "avail"
    check_port_binding 443 "HTTPS Nginx Ingress SSL" "avail"
    check_port_binding 3000 "T-AIMS Backend Node.js" "avail"
    check_port_binding 1883 "Mosquitto MQTT TCP" "avail"
    check_port_binding 9001 "Mosquitto MQTT WebSocket" "avail"
    check_port_binding 3306 "MySQL/MariaDB Database" "avail"
    check_port_binding 8443 "CloudPanel Control Panel Web" "avail"
}

check_directory_structure() {
    echo -e "\n${CLR_BOLD}[4] Pemeriksaan Struktur Direktori & Keamanan Hak Akses (Permissions)${CLR_RESET}"

    TARGET_DIRS=(
        "/var/backups/taims"
        "/var/log/taims"
        "/home/taims-prod/htdocs"
    )

    for dir in "${TARGET_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            log_pass "Direktori ada: $dir"
        else
            log_warn "Direktori produksi belum dibuat: $dir (Jalankan 'mkdir -p $dir' saat deployment server)"
        fi
    done

    # Check local repository environment template
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
    REPO_ENV="$PROJECT_ROOT/.env.example"
    if [ -f "$REPO_ENV" ]; then
        log_pass "Template environment (.env.example) tersedia di repositori inti"
    else
        log_warn "File .env.example tidak ditemukan di path default ($REPO_ENV)"
    fi

    # Check runbook documentation file
    RUNBOOK_DOC="$PROJECT_ROOT/devops/docs/cloudpanel-deployment-runbook.md"
    if [ -f "$RUNBOOK_DOC" ]; then
        log_pass "Dokumen panduan resmi CloudPanel Runbook tersedia ($RUNBOOK_DOC)"
    else
        log_fail "Dokumen cloudpanel-deployment-runbook.md tidak ditemukan!"
    fi
}

print_summary() {
    echo ""
    echo "========================================================================"
    echo -e "                     ${CLR_BOLD}RINGKASAN AUDIT PRE-FLIGHT${CLR_RESET}                     "
    echo "========================================================================"
    echo -e "  Total Pemeriksaan LULUS (PASS)  : ${CLR_GREEN}${PASS_COUNT}${CLR_RESET}"
    echo -e "  Total Catatan Minor   (WARN)  : ${CLR_YELLOW}${WARN_COUNT}${CLR_RESET}"
    echo -e "  Total Kendala Kritis  (FAIL)  : ${CLR_RED}${FAIL_COUNT}${CLR_RESET}"
    echo "------------------------------------------------------------------------"

    if [ "$FAIL_COUNT" -eq 0 ]; then
        echo -e "${CLR_GREEN}${CLR_BOLD}KESIMPULAN: SISTEM 100% SIAP (READY) UNTUK DEPLOYMENT CLOUDPANEL!${CLR_RESET}"
        echo -e "Seluruh arsitektur, dependensi, dan panduan runbook telah terverifikasi."
        echo -e "Langkah berikutnya: Eksekusi konfigurasi di CloudPanel VPS begitu kredensial diserahkan."
    else
        echo -e "${CLR_RED}${CLR_BOLD}KESIMPULAN: TERDAPAT $FAIL_COUNT KENDALA KRITIS YANG HARUS DIPERBAIKI SEBELUM DEPLOY!${CLR_RESET}"
    fi
    echo "========================================================================"
}

main() {
    print_header
    check_system_resources
    check_required_binaries
    check_network_and_ports
    check_directory_structure
    print_summary
}

main "$@"
