#!/usr/bin/env bash
# =============================================================================
# T-AIMS - DEPLOYMENT & SINKRONISASI n8n AUTOMATION ENGINE (CLOUDPANEL VPS)
# Penanggung Jawab : Dzakwan Miftahussobirin & Wafian Zaidan
# PT Teknolab Caraka Internasional
# =============================================================================

set -e

echo "================================================================="
echo " [*] MEMULAI DEPLOYMENT N8N AI WORKFLOW ENGINE - T-AIMS TEKNOLAB"
echo "================================================================="

# 1. Update & Pastikan n8n Versi Terbaru Terpasang
echo "[1/5] Memeriksa instalasi n8n versi terbaru..."
if ! command -v n8n &> /dev/null; then
    echo "      n8n belum ditemukan, memasang via npm..."
    npm install -g n8n@latest
else
    echo "      Memperbarui n8n ke versi terbaru (Security Patch)..."
    npm update -g n8n
fi

N8N_VER=$(n8n --version)
echo "      -> n8n versi $N8N_VER berhasil diverifikasi!"

# 2. Siapkan Direktori Workflow & Import File Arik
WORKFLOW_DIR="/home/taims-teknolab/n8n_workflows"
mkdir -p "$WORKFLOW_DIR"

echo "[2/5] Mengimpor 3 Workflow n8n Resmi Arik..."
# Salin file jika berada di repo
if [ -d "/home/taims-teknolab/htdocs/t-aims.teknolab.biz.id/n8n_workflows" ]; then
    cp /home/taims-teknolab/htdocs/t-aims.teknolab.biz.id/n8n_workflows/*.json "$WORKFLOW_DIR/"
fi

# 3. Jalankan n8n via PM2 di Port 5678
echo "[3/5] Menjalankan n8n Automation Engine di background via PM2..."
pm2 delete taims-n8n 2>/dev/null || true
pm2 start n8n --name "taims-n8n" -- --port 5678
pm2 save

# 4. Sinkronisasi Environment Backend T-AIMS
echo "[4/5] Memperbarui Webhook n8n di Backend .env..."
ENV_FILE="/home/taims-teknolab/htdocs/t-aims.teknolab.biz.id/taims-backend/.env"
if [ -f "$ENV_FILE" ]; then
    sed -i '/N8N_AI_WEBHOOK/d' "$ENV_FILE"
    sed -i '/N8N_ALERT_WEBHOOK/d' "$ENV_FILE"
    sed -i '/N8N_RECOVERY_WEBHOOK/d' "$ENV_FILE"
    sed -i '/N8N_ACTIVE/d' "$ENV_FILE"

    echo "N8N_ACTIVE=true" >> "$ENV_FILE"
    echo "N8N_AI_WEBHOOK=http://127.0.0.1:5678/webhook/ai-recommendation" >> "$ENV_FILE"
    echo "N8N_ALERT_WEBHOOK=http://127.0.0.1:5678/webhook/taims-alert" >> "$ENV_FILE"
    echo "N8N_RECOVERY_WEBHOOK=http://127.0.0.1:5678/webhook/taims-recovery" >> "$ENV_FILE"
    echo "      -> Backend .env berhasil disinkronkan!"
fi

# 5. Reload Backend agar Membaca Webhook Baru
echo "[5/5] Memuat ulang backend PM2..."
pm2 reload taims-backend 2>/dev/null || pm2 restart all

echo "================================================================="
echo " [SUCCESS] n8n AI Engine Aktif 24/7 di Port 5678!"
echo " Webhook: /webhook/ai-recommendation, /webhook/taims-alert, /webhook/taims-recovery"
echo "================================================================="
