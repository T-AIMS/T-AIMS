#!/bin/bash
# =====================================================================
# T-AIMS SSL / TLS AUTOMATION SCRIPT
# Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
# Deskripsi        : Skrip otomatisasi pembuatan sertifikat SSL (Self-Signed / Certbot)
# =====================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SSL_DIR="$PROJECT_ROOT/devops/nginx/ssl"

mkdir -p "$SSL_DIR"

echo "====================================================================="
echo "                    T-AIMS SSL AUTOMATION SETUP"
echo "====================================================================="
echo "Target SSL Dir: $SSL_DIR"
echo "1. Buat Self-Signed Certificate (Lokal / Staging Development)"
echo "2. Pasang Let's Encrypt Certbot (Domain Publik Production)"
echo "3. Keluar"
echo "====================================================================="

read -p "Pilihan Anda (1-3) [Default 1]: " CHOICE
CHOICE=${CHOICE:-1}

if [ "$CHOICE" == "1" ]; then
    echo ">> Membuat Self-Signed Certificate untuk localhost..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout "$SSL_DIR/taims.key" \
      -out "$SSL_DIR/taims.crt" \
      -subj "/C=ID/ST=Jawa Tengah/L=Semarang/O=Teknolab Caraka Internasional/OU=DevOps/CN=localhost"
    
    chmod 600 "$SSL_DIR/taims.key"
    chmod 644 "$SSL_DIR/taims.crt"
    echo "✅ Sertifikat SSL Self-Signed berhasil dibuat:"
    echo "   - Key: $SSL_DIR/taims.key"
    echo "   - Crt: $SSL_DIR/taims.crt"

elif [ "$CHOICE" == "2" ]; then
    read -p "Masukkan nama domain publik Anda (misal: taims.teknolab.id): " DOMAIN
    if [ -z "$DOMAIN" ]; then
        echo "❌ Nama domain tidak boleh kosong!"
        exit 1
    fi
    echo ">> Menjalankan Certbot untuk domain: $DOMAIN..."
    if command -v certbot &> /dev/null; then
        sudo certbot --nginx -d "$DOMAIN"
        echo "✅ Certbot selesai dieksekusi."
    else
        echo "❌ Certbot belum terinstall! Silakan jalankan: sudo apt install -y certbot python3-certbot-nginx"
        exit 1
    fi
else
    echo "Keluar."
    exit 0
fi
