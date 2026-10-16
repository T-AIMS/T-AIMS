# Panduan Implementasi SSL / HTTPS T-AIMS
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer*)  
**Tanggal:** 16 Oktober 2026  
**Status:** Siap Implementasi (Staging & Production)

---

## 1. Ikhtisar Arsitektur SSL / Reverse Proxy
Untuk memenuhi standar keamanan operasional PKL T-AIMS dan OWASP Secure Transport, semua lalu lintas HTTP publik (Port 80) dialihkan secara otomatis ke HTTPS (Port 443) melalui Nginx Reverse Proxy.

```
[ Klien / Browser ] 
        │ (HTTPS :443)
        ▼
[ Nginx Reverse Proxy & SSL Termination ]
   ├── /       ──► Frontend Dashboard (:3001)
   ├── /api/   ──► Node.js Express Backend (:3000)
   └── /mqtt   ──► Mosquitto WebSocket (:9001)
```

---

## 2. Opsi A: Generate Self-Signed Certificate (Pengujian Lokal & Staging)
Gunakan opsi ini jika pengujian dilakukan di lingkungan internal/WSL/LAN tanpa domain publik.

Jalankan perintah berikut di terminal server/WSL:
```bash
# 1. Buat direktori sertifikat
mkdir -p devops/nginx/ssl

# 2. Generate private key dan self-signed certificate (berlaku 365 hari)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout devops/nginx/ssl/taims.key \
  -out devops/nginx/ssl/taims.crt \
  -subj "/C=ID/ST=Jawa Tengah/L=Semarang/O=Teknolab Caraka Internasional/OU=DevOps/CN=localhost"

# 3. Kunci permission private key
chmod 600 devops/nginx/ssl/taims.key
chmod 644 devops/nginx/ssl/taims.crt
```

---

## 3. Opsi B: Let's Encrypt Certbot (Domain Publik Production)
Gunakan opsi ini jika sistem di-deploy ke VPS berdomain publik (misal: `taims.teknolab.id`).

```bash
# 1. Install Certbot dan plugin Nginx
sudo apt update && sudo apt install -y certbot python3-certbot-nginx

# 2. Dapatkan sertifikat otomatis
sudo certbot --nginx -d taims.teknolab.id

# 3. Verifikasi perpanjangan otomatis (Renewal Dry-run)
sudo certbot renew --dry-run
```

---

## 4. Konfigurasi Firewall & Security Headers
Pastikan port HTTPS diizinkan pada firewall server (UFW):
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

### Security Headers yang Diterapkan:
1. **HSTS (HTTP Strict Transport Security):** Memaksa browser hanya menggunakan HTTPS selama 1 tahun.
2. **X-Frame-Options: SAMEORIGIN:** Melindungi dashboard dari serangan Clickjacking.
3. **X-Content-Type-Options: nosniff:** Mencegah MIME-type sniffing.
4. **TLS 1.2 & TLS 1.3 Only:** Menonaktifkan protokol usang dan rentan (SSLv3, TLS 1.0, TLS 1.1).

---

## 5. Pengujian & Verifikasi
Uji respons HTTPS menggunakan curl:
```bash
# Verifikasi redirect HTTP ke HTTPS
curl -I http://localhost

# Verifikasi handshake HTTPS dan response header
curl -Iv https://localhost --insecure
```
