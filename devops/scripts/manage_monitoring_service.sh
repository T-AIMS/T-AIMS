#!/usr/bin/env bash
# =============================================================================
# T-AIMS MONITORING ENGINE SERVICE AUTOMATION & MANAGER (CLI CONTROLLER)
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Shift             : 2 (16.00 - 01.00 WIB)
# Milestone         : Roadmap Hari 11–12 (Service Automation untuk Monitoring Engine)
# Referensi         : Dokumen Kerja PKL T-AIMS Teknolab 30 Hari (Hal. 12, 13, 14, 15, 18)
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENGINE_SCRIPT="$REPO_ROOT/network-monitoring/monitoring_engine.py"
LOG_DIR="$REPO_ROOT/logs"
LOG_FILE="$LOG_DIR/monitoring.log"
PID_FILE="$LOG_DIR/monitoring_engine.pid"
WATCHDOG_LOG="$LOG_DIR/watchdog.log"
BACKEND_HEALTH_URL="${BACKEND_URL:-http://127.0.0.1:3000/api}/monitoring/health"

mkdir -p "$LOG_DIR"

ACTION="${1:-status}"

get_pid() {
    if [ -f "$PID_FILE" ]; then
        local pid
        pid=$(cat "$PID_FILE" 2>/dev/null | tr -d '[:space:]')
        if [ -n "$pid" ] && ps -p "$pid" > /dev/null 2>&1; then
            echo "$pid"
            return 0
        fi
    fi

    # Fallback pencarian PID melalui pgrep jika PID file usang atau terhapus
    local pgrep_pid
    pgrep_pid=$(pgrep -f "network-monitoring/monitoring_engine.py" | head -n 1 || true)
    if [ -n "$pgrep_pid" ] && ps -p "$pgrep_pid" > /dev/null 2>&1; then
        echo "$pgrep_pid" > "$PID_FILE"
        echo "$pgrep_pid"
        return 0
    fi

    return 1
}

start_daemon() {
    echo "[*] Memulai T-AIMS Monitoring Engine Daemon..."
    if pid=$(get_pid); then
        echo "[i] Daemon sudah aktif berjalan dengan PID $pid."
        return 0
    fi

    # Menjalankan daemon secara detached dan imun terhadap penutupan subshell (setsid)
    setsid python3 -u "$ENGINE_SCRIPT" < /dev/null >> "$LOG_FILE" 2>&1 &
    local new_pid=$!
    echo "$new_pid" > "$PID_FILE"
    sleep 2

    if ps -p "$new_pid" > /dev/null 2>&1; then
        echo "[✓] Daemon berhasil dijalankan! (PID: $new_pid)"
        echo "    Log terpusat : $LOG_FILE"
        echo "    File PID     : $PID_FILE"
    else
        echo "[✗] Gagal menjalankan daemon. Periksa log: $LOG_FILE"
        return 1
    fi
}

stop_daemon() {
    echo "[*] Menghentikan T-AIMS Monitoring Engine Daemon..."
    if pid=$(get_pid); then
        echo "    Mengirim sinyal SIGTERM ke PID $pid..."
        kill -TERM "$pid" 2>/dev/null || true
        
        # Menunggu proses berhenti secara graceful hingga 5 detik
        local count=0
        while ps -p "$pid" > /dev/null 2>&1 && [ $count -lt 5 ]; do
            sleep 1
            count=$((count + 1))
        done

        if ps -p "$pid" > /dev/null 2>&1; then
            echo "    Proses belum berhenti, mengirim sinyal SIGKILL..."
            kill -9 "$pid" 2>/dev/null || true
        fi

        rm -f "$PID_FILE"
        echo "[✓] Daemon (PID $pid) telah dihentikan secara aman."
    else
        # Bersihkan PID file sisa jika proses sudah mati
        rm -f "$PID_FILE"
        echo "[-] Tidak ada daemon monitoring yang sedang berjalan."
    fi
}

check_status() {
    echo "=========================================================="
    echo "  STATUS T-AIMS MONITORING ENGINE SERVICE"
    echo "=========================================================="
    
    if pid=$(get_pid); then
        local proc_info
        proc_info=$(ps -p "$pid" -o %cpu,%mem,etime,args --no-headers 2>/dev/null || true)
        local cpu=$(echo "$proc_info" | awk '{print $1}')
        local mem=$(echo "$proc_info" | awk '{print $2}')
        local uptime=$(echo "$proc_info" | awk '{print $3}')

        echo "  Status Layanan  : [ AKTIF / RUNNING ]"
        echo "  Process ID (PID): $pid"
        echo "  CPU Usage       : ${cpu}%"
        echo "  Memory Usage    : ${mem}%"
        echo "  Elapsed Time    : $uptime"
        echo "  Log Terpusat    : $LOG_FILE"
        echo "  File PID        : $PID_FILE"
    else
        echo "  Status Layanan  : [ MATI / STOPPED ]"
        echo "  Panduan Start   : $0 start"
    fi

    echo "----------------------------------------------------------"
    echo "  KONEKTIVITAS BACKEND API:"
    if curl -s -m 3 "$BACKEND_HEALTH_URL" > /dev/null 2>&1; then
        local health_data
        health_data=$(curl -s -m 3 "$BACKEND_HEALTH_URL" | tr -d '\n')
        echo "  Endpoint Health : [ ONLINE ] $BACKEND_HEALTH_URL"
        echo "  Respon Backend  : $health_data"
    else
        echo "  Endpoint Health : [ TERPUTUS / OFFLINE ] $BACKEND_HEALTH_URL"
    fi

    echo "----------------------------------------------------------"
    echo "  LOG TERKINI (5 baris terakhir):"
    if [ -f "$LOG_FILE" ]; then
        tail -n 5 "$LOG_FILE"
    else
        echo "  (Belum ada rekaman pada $LOG_FILE)"
    fi
    echo "=========================================================="
}

run_watchdog() {
    local now
    now=$(date "+%Y-%m-%d %H:%M:%S")

    if pid=$(get_pid); then
        # Daemon sehat
        echo "[$now] [WATCHDOG-OK] Daemon Monitoring aktif (PID: $pid). Layanan normal." >> "$WATCHDOG_LOG"
        if [ "$2" == "--verbose" ]; then
            echo "[✓] Watchdog: Daemon aktif berjalan (PID: $pid)."
        fi
        return 0
    else
        # Daemon mati -> Lakukan Auto-Recovery secara mandiri (SOP Hal. 18 Auto-Recovery)
        echo "[$now] [WATCHDOG-ALERT] Daemon Monitoring terdeteksi MATI/CRASH! Menginisiasi auto-recovery..." >> "$WATCHDOG_LOG"
        echo "[!] [WATCHDOG] Daemon terdeteksi tidak aktif. Memulihkan layanan secara otomatis..."
        
        start_daemon >> "$WATCHDOG_LOG" 2>&1

        local new_pid
        if new_pid=$(get_pid); then
            echo "[$now] [WATCHDOG-RECOVERED] Berhasil dihidupkan kembali (PID Baru: $new_pid)." >> "$WATCHDOG_LOG"
            echo "[✓] [WATCHDOG] Layanan pulih dan berjalan kembali dengan PID: $new_pid."
            return 0
        else
            echo "[$now] [WATCHDOG-FAILED] Gagal menghidupkan kembali daemon monitoring!" >> "$WATCHDOG_LOG"
            echo "[✗] [WATCHDOG] Pemulihan gagal. Periksa log detail di $LOG_FILE."
            return 1
        fi
    fi
}

install_systemd_service() {
    echo "[*] Mengonfigurasi Systemd Service untuk Monitoring Engine..."
    local user_unit_dir="$HOME/.config/systemd/user"
    mkdir -p "$user_unit_dir"

    local service_file="$user_unit_dir/taims-monitoring.service"
    cat <<EOF > "$service_file"
[Unit]
Description=T-AIMS Multi-Site Network Monitoring Engine Daemon
After=network.target

[Service]
Type=simple
WorkingDirectory=$REPO_ROOT/network-monitoring
Environment="BACKEND_URL=http://127.0.0.1:3000/api"
Environment="DEVICE_API_KEY=taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1"
Environment="MONITORING_INTERVAL=15"
Environment="RETRY_COUNT=3"
ExecStart=/usr/bin/python3 -u $REPO_ROOT/network-monitoring/monitoring_engine.py
Restart=always
RestartSec=5
StandardOutput=append:$LOG_FILE
StandardError=append:$LOG_DIR/monitoring_error.log

[Install]
WantedBy=default.target
EOF

    echo "    Berkas unit tersimpan di: $service_file"

    if command -v systemctl > /dev/null 2>&1; then
        systemctl --user daemon-reload || true
        systemctl --user enable taims-monitoring.service || true
        echo "[✓] Systemd User Unit 'taims-monitoring.service' aktif dan terdaftar."
        echo "    Gunakan: systemctl --user start taims-monitoring"
    else
        echo "[!] Systemctl tidak ditemukan, menggunakan manajemen controller CLI."
    fi
}

install_cron_watchdog() {
    echo "[*] Mendaftarkan Watchdog & Pembersihan Crontab Sesuai Standar SOP..."

    # Buat backup crontab sementara
    local current_cron
    current_cron=$(crontab -l 2>/dev/null || echo "")

    # Hapus path lama /mnt/d/xampp/htdocs/T-AIMS jika ada
    local cleaned_cron
    cleaned_cron=$(echo "$current_cron" | grep -v "xampp/htdocs/T-AIMS" | grep -v "manage_monitoring_service.sh watchdog" || true)

    # Tambahkan cron backup terpusat & watchdog monitoring berkala (setiap 2 menit)
    local new_cron=$(cat <<EOF
$cleaned_cron
# --- T-AIMS DevOps Automated Tasks (Wafian) ---
0 2 * * * /bin/bash $REPO_ROOT/devops/scripts/backup_db.sh >> $LOG_DIR/backup.log 2>&1
*/2 * * * * /bin/bash $REPO_ROOT/devops/scripts/manage_monitoring_service.sh watchdog >> $WATCHDOG_LOG 2>&1
EOF
)

    echo "$new_cron" | crontab -
    echo "[✓] Crontab berhasil diperbarui:"
    crontab -l | tail -n 4
}

run_self_test() {
    echo "=========================================================="
    echo "  PENGUJIAN VALIDASI SERVICE AUTOMATION (DoD Hal. 15 & 18)"
    echo "=========================================================="
    
    echo "--> [TEST 1/5] Memastikan layanan berjalan awal..."
    start_daemon

    echo "--> [TEST 2/5] Memeriksa status dan kesehatan API..."
    check_status

    echo "--> [TEST 3/5] Simulasi Kegagalan / Crash Mendadak (kill -9)..."
    local pid
    pid=$(get_pid)
    if [ -n "$pid" ]; then
        echo "    Mematikan proses secara paksa (PID $pid)..."
        kill -9 "$pid"
        rm -f "$PID_FILE"
        sleep 1
    fi

    echo "--> [TEST 4/5] Menguji Reaktivasi Mandiri via Auto-Healing Watchdog..."
    run_watchdog --verbose
    sleep 3

    local recovered_pid
    recovered_pid=$(get_pid)
    if [ -n "$recovered_pid" ] && [ "$recovered_pid" != "$pid" ]; then
        echo "[PASS] Watchdog BERHASIL memulihkan proses mati! (PID Baru: $recovered_pid)"
    else
        echo "[FAIL] Watchdog gagal memulihkan proses!"
        exit 1
    fi

    echo "--> [TEST 5/5] Verifikasi Ingesti Data Telemetri & Log..."
    sleep 4
    if grep -q "Sync: OK" "$LOG_FILE"; then
        echo "[PASS] Telemetri berhasil sinkronisasi ke MySQL & API Backend."
    else
        echo "[WARN] Belum ada rekaman 'Sync: OK', periksa koneksi backend."
    fi

    echo "=========================================================="
    echo "  SELURUH PENGUJIAN OTOMASI SERVICE SELESAI DENGAN SUKSES!"
    echo "=========================================================="
}

case "$ACTION" in
    start)
        start_daemon
        ;;
    stop)
        stop_daemon
        ;;
    restart)
        stop_daemon
        sleep 1
        start_daemon
        ;;
    status)
        check_status
        ;;
    watchdog)
        run_watchdog "$@"
        ;;
    install-service)
        install_systemd_service
        ;;
    install-cron)
        install_cron_watchdog
        ;;
    test)
        run_self_test
        ;;
    logs)
        echo "[*] Menampilkan live log dari $LOG_FILE (Ctrl+C untuk keluar)..."
        tail -f "$LOG_FILE"
        ;;
    *)
        echo "Penggunaan: $0 {start|stop|restart|status|watchdog|install-service|install-cron|test|logs}"
        exit 1
        ;;
esac
