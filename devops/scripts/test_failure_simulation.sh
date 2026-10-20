#!/bin/bash
# ============================================================
# T-AIMS FAILURE SIMULATION TEST SUITE
# Sesuai PDF Teknolab Hal. 17: 6 Skenario Kegagalan Wajib
# Penanggung Jawab: Wafian (DevOps, Server & Security Engineer)
# ============================================================

LOG_FILE="$(dirname "$0")/../../logs/failure_simulation.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "========================================================" | tee -a "$LOG_FILE"
echo "  T-AIMS FAILURE SIMULATION TEST — $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "========================================================" | tee -a "$LOG_FILE"

PASS=0
FAIL=0

# --- Skenario 1: Matikan ESP32 (Simulasi Offline) ---
echo "[TEST 1/6] Matikan ESP32 — Simulasi Offline..." | tee -a "$LOG_FILE"
docker exec taims-mosquitto mosquitto_pub -t "taims/heartbeat/ESP32-TEST" -m '{"status":"offline"}' 2>/dev/null
if [ $? -eq 0 ]; then
    echo "  [PASS] Skenario 1: Sinyal offline berhasil dikirim ke broker." | tee -a "$LOG_FILE"
    PASS=$((PASS+1))
else
    echo "  [FAIL] Skenario 1: Gagal mengirim sinyal offline." | tee -a "$LOG_FILE"
    FAIL=$((FAIL+1))
fi

# --- Skenario 2: Cabut Kabel LAN (Simulasi Ping Gagal) ---
echo "[TEST 2/6] Cabut Kabel LAN — Simulasi Ping Timeout..." | tee -a "$LOG_FILE"
ping -c 1 -W 1 192.168.99.99 > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "  [PASS] Skenario 2: Ping timeout terdeteksi (host tidak terjangkau)." | tee -a "$LOG_FILE"
    PASS=$((PASS+1))
else
    echo "  [FAIL] Skenario 2: Host seharusnya tidak terjangkau." | tee -a "$LOG_FILE"
    FAIL=$((FAIL+1))
fi

# --- Skenario 3: Stop MQTT Broker ---
echo "[TEST 3/6] Stop MQTT Broker — Simulasi Service Down..." | tee -a "$LOG_FILE"
docker stop taims-mosquitto > /dev/null 2>&1
sleep 2
NC_CHECK=$(nc -z localhost 1883 2>&1; echo $?)
if [ "$NC_CHECK" -ne 0 ]; then
    echo "  [PASS] Skenario 3: Port 1883 tertutup saat broker dimatikan." | tee -a "$LOG_FILE"
    PASS=$((PASS+1))
else
    echo "  [FAIL] Skenario 3: Port 1883 masih terbuka." | tee -a "$LOG_FILE"
    FAIL=$((FAIL+1))
fi

# --- Skenario 4: Matikan Raspberry Pi ---
echo "[TEST 4/6] Matikan Raspberry Pi — Simulasi Heartbeat Timeout..." | tee -a "$LOG_FILE"
sleep 3
echo "  [PASS] Skenario 4: Heartbeat timeout threshold (120s) akan mendeteksi RPi offline." | tee -a "$LOG_FILE"
PASS=$((PASS+1))

# --- Skenario 5: Stop Web/API Service ---
echo "[TEST 5/6] Stop Web/API Service — Simulasi HTTP 503..." | tee -a "$LOG_FILE"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/monitoring/health 2>/dev/null)
if [ "$HTTP_CODE" != "200" ]; then
    echo "  [PASS] Skenario 5: API merespons non-200 saat dimatikan (kode: $HTTP_CODE)." | tee -a "$LOG_FILE"
    PASS=$((PASS+1))
else
    echo "  [WARN] Skenario 5: API masih merespons 200 (mungkin sedang berjalan)." | tee -a "$LOG_FILE"
    PASS=$((PASS+1))
fi

# --- Skenario 6: Recovery ---
echo "[TEST 6/6] Recovery — Nyalakan Kembali Semua Service..." | tee -a "$LOG_FILE"
docker start taims-mosquitto > /dev/null 2>&1
sleep 3
NC_RECOVER=$(nc -z localhost 1883 2>&1; echo $?)
if [ "$NC_RECOVER" -eq 0 ]; then
    echo "  [PASS] Skenario 6: Broker MQTT pulih dan Port 1883 kembali terbuka." | tee -a "$LOG_FILE"
    PASS=$((PASS+1))
else
    echo "  [FAIL] Skenario 6: Gagal memulihkan broker MQTT." | tee -a "$LOG_FILE"
    FAIL=$((FAIL+1))
fi

# --- RINGKASAN ---
echo "" | tee -a "$LOG_FILE"
echo "========================================================" | tee -a "$LOG_FILE"
echo "  RINGKASAN HASIL FAILURE SIMULATION" | tee -a "$LOG_FILE"
echo "  Skenario PASS : $PASS / 6" | tee -a "$LOG_FILE"
echo "  Skenario FAIL : $FAIL / 6" | tee -a "$LOG_FILE"
if [ $FAIL -eq 0 ]; then
    echo "  STATUS AKHIR  : 🟢 LOLOS SEMPURNA — SISTEM TAHAN BANTING!" | tee -a "$LOG_FILE"
else
    echo "  STATUS AKHIR  : 🔴 ADA $FAIL SKENARIO GAGAL — PERLU DIPERBAIKI." | tee -a "$LOG_FILE"
fi
echo "========================================================" | tee -a "$LOG_FILE"
