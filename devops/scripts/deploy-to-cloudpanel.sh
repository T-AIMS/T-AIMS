#!/usr/bin/env bash
# =====================================================================
# T-AIMS CLOUDPANEL DEPLOYMENT AUTOMATION SCRIPT
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Referensi        : devops/docs/cloudpanel-deployment-runbook.md
# Deskripsi        : Skrip otomasi deployment end-to-end T-AIMS
#                    ke server CloudPanel (DB, Backend, Frontend,
#                    Mosquitto MQTT, Nginx Reverse Proxy, SSL).
# =====================================================================

set -e

# --- VARIABEL KONFIGURASI (DAPAT DISESUAIKAN VIA ENV ATAU EDIT LANGSUNG) ---
DOMAIN="${DOMAIN:-taims.teknolab.id}"
DB_NAME="${DB_NAME:-taims_db}"
DB_USER="${DB_USER:-taims_user}"
DB_PASS="${DB_PASS:-Taims_Teknolab_2026_Secure!}"
DB_ROOT_PASS="${DB_ROOT_PASS:-}"
APP_DIR="${APP_DIR:-/home/taims-prod/htdocs}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/taims}"
LOG_DIR="${LOG_DIR:-/var/log/taims}"
REPO_URL="${REPO_URL:-https://github.com/T-AIMS/T-AIMS.git}"
TARGET_USER="${TARGET_USER:-$USER}"

echo "========================================================"
echo " 🚀 T-AIMS CLOUDPANEL DEPLOYMENT AUTOMATION"
echo " Penanggung Jawab : Wafian (DevOps Engineer)"
echo " Domain Target    : $DOMAIN"
echo " App Directory    : $APP_DIR"
echo " Log Directory    : $LOG_DIR"
echo " Backup Directory : $BACKUP_DIR"
echo "========================================================"

# Helper untuk eksekusi perintah MySQL root
run_mysql_root() {
    local sql_query="$1"
    if [ -n "$DB_ROOT_PASS" ]; then
        mysql -u root -p"$DB_ROOT_PASS" -e "$sql_query"
    else
        mysql -u root -e "$sql_query" 2>/dev/null || mysql -u root -p -e "$sql_query"
    fi
}

import_mysql_file() {
    local file_path="$1"
    if [ -n "$DB_ROOT_PASS" ]; then
        mysql -u root -p"$DB_ROOT_PASS" "$DB_NAME" < "$file_path"
    else
        mysql -u root "$DB_NAME" < "$file_path" 2>/dev/null || mysql -u root -p "$DB_NAME" < "$file_path"
    fi
}

# --- 1. PERSIAPAN DIREKTORI PRODUKSI ---
echo "[1/8] Membuat direktori produksi dan hak akses..."
sudo mkdir -p "$APP_DIR" "$BACKUP_DIR" "$LOG_DIR"
sudo chown -R "$TARGET_USER:$TARGET_USER" "$APP_DIR" "$BACKUP_DIR" "$LOG_DIR"
sudo chmod -R 755 "$APP_DIR" "$LOG_DIR"
sudo chmod 700 "$BACKUP_DIR"
echo "  ✓ Direktori berhasil disiapkan."

# --- 2. CLONE / UPDATE REPOSITORI GITHUB ---
echo "[2/8] Mengambil kode sumber dari repositori GitHub..."
if [ -d "$APP_DIR/.git" ]; then
    echo "  → Repositori sudah ada di $APP_DIR, melakukan git fetch & pull..."
    cd "$APP_DIR"
    git fetch origin main
    git reset --hard origin/main
else
    echo "  → Melakukan git clone dari $REPO_URL..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi
echo "  ✓ Repositori sinkron di cabang main."

# --- 3. SETUP BASIS DATA MYSQL ---
echo "[3/8] Setup basis data MySQL (Schema, Seed, & Privileges)..."
run_mysql_root "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
run_mysql_root "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
run_mysql_root "ALTER USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';"
run_mysql_root "GRANT ALL PRIVILEGES ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';"
run_mysql_root "FLUSH PRIVILEGES;"

if [ -f "$APP_DIR/Database Final/taims_db_final.sql" ]; then
    echo "  → Mengimpor Database Final/taims_db_final.sql (Master Hybrid 10 Tabel)..."
    import_mysql_file "$APP_DIR/Database Final/taims_db_final.sql"
elif [ -f "$APP_DIR/database/taims_db.sql" ]; then
    echo "  → Mengimpor database/taims_db.sql (Master Hybrid 10 Tabel)..."
    import_mysql_file "$APP_DIR/database/taims_db.sql"
elif [ -f "$APP_DIR/database/schema.sql" ]; then
    echo "  → Mengimpor database/schema.sql..."
    import_mysql_file "$APP_DIR/database/schema.sql"
    if [ -f "$APP_DIR/database/seed.sql" ]; then
        echo "  → Mengimpor database/seed.sql..."
        import_mysql_file "$APP_DIR/database/seed.sql"
    fi
fi
echo "  ✓ Basis data MySQL siap digunakan."

# --- 4. SETUP BACKEND REST API (NODE.JS + PM2) ---
echo "[4/8] Setup backend Node.js dan manajemen proses PM2..."
if [ -d "$APP_DIR/Backend Final" ]; then
    BACKEND_DIR="$APP_DIR/Backend Final"
elif [ -d "$APP_DIR/backend" ]; then
    BACKEND_DIR="$APP_DIR/backend"
elif [ -d "$APP_DIR/taims-backend" ]; then
    BACKEND_DIR="$APP_DIR/taims-backend"
else
    BACKEND_DIR="$APP_DIR"
fi
cd "$BACKEND_DIR"

# Install dependensi produksi
npm install --production

# Injeksi berkas .env produksi
if [ ! -f .env ]; then
    echo "  → Mengonfigurasi berkas .env produksi..."
    cat << EOF > .env
PORT=3000
NODE_ENV=production

# Database MySQL Produksi
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASS=$DB_PASS

# Keamanan JWT
JWT_SECRET=taims_super_secret_jwt_key_teknolab_blitar_2026_devops_wafian
JWT_EXPIRES_IN=86400

# Integrasi MQTT Broker
MQTT_HOST=127.0.0.1
MQTT_PORT=1883
MQTT_USER=taims-broker
MQTT_PASS=taims-mqtt-2026

# Notifikasi & Alerting
TELEGRAM_BOT_TOKEN=8944593836:AAEP2bDCO53srpWR3gdKXY6CHQ13Ni8OtPA
TELEGRAM_CHAT_ID=-5383419523
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=education8420@gmail.com
SMTP_PASS=sydnaxxyqkdzypge

# Kunci API Ingesti Telemetri & Ping Perangkat
DEVICE_API_KEY=taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1
EOF
    chmod 600 .env
fi

# Pastikan PM2 terpasang
if ! command -v pm2 &> /dev/null; then
    echo "  → Menginstal PM2 secara global..."
    sudo npm install -g pm2
fi

# Jalankan backend daemon
if pm2 list | grep -q "taims-backend"; then
    echo "  → Me-restart aplikasi PM2 taims-backend..."
    pm2 restart taims-backend --update-env
else
    echo "  → Mendaftarkan aplikasi ke PM2..."
    pm2 start src/app.js --name "taims-backend"
fi

pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u "$TARGET_USER" --hp "/home/$TARGET_USER" 2>/dev/null || true
echo "  ✓ Backend Node.js aktif di port 3000 via PM2."

# --- 5. SETUP FRONTEND STATIC WEB ---
echo "[5/8] Memverifikasi aset frontend web statis..."
if [ -d "$APP_DIR/frontend" ]; then
    FRONTEND_DIR="$APP_DIR/frontend"
elif [ -f "$APP_DIR/index.html" ]; then
    FRONTEND_DIR="$APP_DIR"
else
    FRONTEND_DIR="$APP_DIR/frontend"
fi

if [ -f "$FRONTEND_DIR/index.html" ]; then
    echo "  ✓ File $FRONTEND_DIR/index.html terverifikasi."
    sudo chmod -R 755 "$FRONTEND_DIR"
else
    echo "  ⚠️ Peringatan: File $FRONTEND_DIR/index.html tidak ditemukan!"
fi

# --- 6. SETUP MOSQUITTO MQTT BROKER ---
echo "[6/8] Setup Mosquitto MQTT Broker (TCP 1883 & WebSocket 9001)..."
if ! command -v mosquitto &> /dev/null; then
    echo "  → Menginstal paket Mosquitto..."
    sudo apt-get update -y && sudo apt-get install -y mosquitto mosquitto-clients
fi

# Konfigurasi Listener & WebSocket
sudo mkdir -p /etc/mosquitto/conf.d
sudo tee /etc/mosquitto/conf.d/taims.conf > /dev/null << 'EOF'
# Port standar TCP untuk Node ESP32 & Backend Service
listener 1883
protocol mqtt
allow_anonymous false
password_file /etc/mosquitto/passwd

# Port WebSocket untuk Browser Web Dashboard & Nginx Proxy
listener 9001 127.0.0.1
protocol websockets
allow_anonymous false
password_file /etc/mosquitto/passwd
EOF

# Buat kredensial MQTT broker
sudo touch /etc/mosquitto/passwd
sudo mosquitto_passwd -b /etc/mosquitto/passwd taims-broker taims-mqtt-2026

sudo systemctl enable mosquitto
sudo systemctl restart mosquitto
echo "  ✓ Mosquitto MQTT aktif dan berjalan."

# --- 7. SETUP NGINX REVERSE PROXY & OWASP HARDENING ---
echo "[7/8] Setup Nginx Reverse Proxy (Frontend, API, & WebSocket)..."
sudo mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled

sudo tee /etc/nginx/sites-available/taims.conf > /dev/null << EOF
# =====================================================================
# T-AIMS REVERSE PROXY NGINX CONFIGURATION (PRODUCTION)
# Penanggung Jawab : Wafian (DevOps Engineer)
# =====================================================================

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    root $FRONTEND_DIR;
    index index.html dashboard.html;

    # OWASP Security Headers Hardening
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(self), camera=(), microphone=()" always;

    # 1. Frontend Web SPA Fallback Routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # 2. Proxy REST API ke Backend Node.js (Port 3000)
    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 90s;
    }

    # 3. Proxy WebSocket MQTT untuk Dashboard Live (Port 9001)
    location /mqtt {
        proxy_pass http://127.0.0.1:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/taims.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
echo "  ✓ Konfigurasi Nginx berhasil diterapkan."

# --- 8. SETUP SSL LET'S ENCRYPT ---
echo "[8/9] Menerbitkan SSL/TLS Let's Encrypt Certbot..."
if command -v certbot &> /dev/null; then
    echo "  → Certbot terdeteksi, memproses sertifikat SSL untuk $DOMAIN..."
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@teknolab.id --redirect 2>/dev/null || echo "  ℹ️ Lewati penerbitan SSL otomatis (DNS A-record belum mengarah ke IP publik server ini)."
else
    echo "  → Menginstal certbot python3-certbot-nginx..."
    sudo apt-get update -y && sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email admin@teknolab.id --redirect 2>/dev/null || echo "  ℹ️ Lewati penerbitan SSL otomatis (pastikan DNS di-pointing terlebih dahulu)."
fi

# --- 9. SERVICE AUTOMATION UNTUK MONITORING ENGINE (ROADMAP HARI 11-12) ---
echo "[9/9] Mengonfigurasi Service Automation untuk Monitoring Engine..."
sudo apt-get install -y python3-requests python3-pip 2>/dev/null || true

# Deploy systemd unit file
SERVICE_SRC="$APP_DIR/devops/scripts/taims-monitoring.service"
SERVICE_DEST="/etc/systemd/system/taims-monitoring.service"

if [ -f "$SERVICE_SRC" ]; then
    sudo cp "$SERVICE_SRC" "$SERVICE_DEST"
    # Sesuaikan path direktori & user sesuai server CloudPanel
    sudo sed -i "s|/mnt/d/T-AIMS|$APP_DIR|g" "$SERVICE_DEST"
    sudo sed -i "s|dragon-wafian|$TARGET_USER|g" "$SERVICE_DEST"
    sudo systemctl daemon-reload
    sudo systemctl enable taims-monitoring.service
    sudo systemctl restart taims-monitoring.service
    echo "  ✓ Systemd Service 'taims-monitoring.service' aktif dan auto-start saat boot."
else
    # Fallback ke controller CLI jika file unit belum disalin
    if [ -f "$APP_DIR/devops/scripts/manage_monitoring_service.sh" ]; then
        bash "$APP_DIR/devops/scripts/manage_monitoring_service.sh" start
    fi
fi

# Daftarkan auto-healing watchdog & backup berkala ke crontab
if [ -f "$APP_DIR/devops/scripts/manage_monitoring_service.sh" ]; then
    bash "$APP_DIR/devops/scripts/manage_monitoring_service.sh" install-cron
    echo "  ✓ Watchdog Auto-Healing cron aktif (inspeksi tiap 2 menit)."
fi

echo "========================================================"
echo " ✅ DEPLOYMENT T-AIMS SELESAI!"
echo " Akses Dashboard : http://$DOMAIN (atau https://$DOMAIN)"
echo " Backend REST API: http://127.0.0.1:3000/api/monitoring/health"
echo " Status PM2      : pm2 status"
echo " Status Mosquitto: systemctl status mosquitto"
echo " Monitoring Svc  : systemctl status taims-monitoring.service"
echo "========================================================"
