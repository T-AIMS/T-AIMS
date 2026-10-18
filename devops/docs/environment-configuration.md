# Panduan Konfigurasi Lingkungan (*Environment Configuration Guide*)
**Sistem:** T-AIMS (*Teknolab Asset & Infrastructure Monitoring System*)  
**Penanggung Jawab:** Wafian (*DevOps, Server & Security Engineer*)  
**Pembaruan Terakhir:** 16 Oktober 2026 (Shift 2)  
**Kepatuhan:** OWASP Security & Panduan Operasional PKL Teknolab (Halaman 12 & 20)  

---

## 1. Prinsip Manajemen Kredensial & Rahasia (*Secret Management*)
Sesuai Aturan Teknis Halaman 20 Dokumen PKL Teknolab:
* *Password, token, API key, credential database, dan credential server dilarang ditulis langsung di source code.*
* Seluruh rahasia dikelola secara terpusat melalui berkas `.env`.
* Berkas `.env` telah dikecualikan dari pelacakan Git melalui `.gitignore` demi menjaga kerahasiaan (*zero hardcoded secrets*).
* Berkas `.env.example` disediakan di root repositori dan subdirektori layanan sebagai templat baku.

---

## 2. Kamus Variabel Lingkungan (*Environment Variables Dictionary*)

### A. Basis Data Relasional (MySQL)
| Nama Variabel | Default / Contoh | Deskripsi |
|:---|:---|:---|
| `DB_HOST` | `127.0.0.1` / `mysql` | Alamat host server MySQL (Host IP atau nama container) |
| `DB_PORT` | `3306` | Port listener MySQL |
| `DB_USER` | `root` | Nama pengguna database |
| `DB_PASS` | `root_taims_2026` | Kata sandi pengguna database |
| `DB_NAME` | `taims_db` | Nama database relasional T-AIMS |

### B. Message Broker (Eclipse Mosquitto)
| Nama Variabel | Default / Contoh | Deskripsi |
|:---|:---|:---|
| `MQTT_HOST` | `127.0.0.1` / `mosquitto` | Alamat broker MQTT |
| `MQTT_PORT` | `1883` | Port listener TCP broker MQTT |
| `MQTT_WS_PORT` | `9001` | Port WebSocket listener MQTT |
| `MQTT_USER` | `taims-broker` | Akun otentikasi broker MQTT |
| `MQTT_PASS` | `taims-mqtt-2026` | Kata sandi broker MQTT |

### C. Backend REST API (Node.js Express)
| Nama Variabel | Default / Contoh | Deskripsi |
|:---|:---|:---|
| `PORT` | `3000` | Port listening HTTP REST API |
| `NODE_ENV` | `production` | Mode runtime Node.js (`development` / `production`) |
| `JWT_SECRET` | *(Random 64-char string)* | Kunci enkripsi token otentikasi JWT |
| `JWT_EXPIRES_IN` | `86400` (24 jam) | Masa berlaku sesi token pengguna |

### D. Frontend Web & Reverse Proxy
| Nama Variabel | Default / Contoh | Deskripsi |
|:---|:---|:---|
| `FRONTEND_PORT` | `3001` | Port container Nginx Alpine frontend |
| `VIRTUAL_HOST` | `taims.teknolab.id` | Domain publik server |
| `SSL_ENABLED` | `true` | Status aktivasi protokol HTTPS |

### E. Otomasi Workflow & Alerting (n8n & Alert Engine)
| Nama Variabel | Default / Contoh | Deskripsi |
|:---|:---|:---|
| `N8N_PORT` | `5678` | Port engine otomasi n8n |
| `TELEGRAM_BOT_TOKEN`| `your_telegram_bot_token` | Token bot Telegram resmi T-AIMS (dikelola via .env) |
| `TELEGRAM_CHAT_ID` | `-4780517830` | ID grup alert insiden infrastruktur |
| `SMTP_HOST` | `smtp.gmail.com` | Host server SMTP Gmail |
| `SMTP_PORT` | `587` | Port TLS SMTP Gmail |
| `SMTP_USER` | `education8420@gmail.com` | Akun resmi pengirim email darurat |
| `SMTP_PASS` | `(Google App Password 16 Karakter via .env)` | Google App Password tervalidasi via .env |

---

## 3. Prosedur Inisialisasi Environment Baru
Bagi anggota tim atau server baru yang melakukan deployment:
```bash
# 1. Salin template konfigurasi
cp .env.example .env

# 2. Atur perizinan file agar hanya dapat dibaca oleh pemilik (chmod 600)
chmod 600 .env

# 3. Validasi keselarasan konfigurasi
bash devops/scripts/test_failure_simulation.sh
```
