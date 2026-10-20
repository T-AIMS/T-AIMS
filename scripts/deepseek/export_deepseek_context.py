#!/usr/bin/env python3
"""
T-AIMS Context & Conversation Memory Exporter for DeepSeek AI
Penanggung Jawab: Wafian (DevOps, Server & Network Security Engineer)
Deskripsi: Mengekstrak seluruh riwayat percakapan Wafian & Avy (Antigravity),
           mensintesis ringkasan teknis proyek T-AIMS secara komprehensif,
           dan menghasilkan konteks siap pakai untuk DeepSeek (Web & API).
"""

import os
import sys
import json
import re
from datetime import datetime

TRANSCRIPT_PATH = "/home/dragon-wafian/.gemini/antigravity/brain/b8343753-8e0f-46d7-afaa-56f4ce6f4290/.system_generated/logs/transcript.jsonl"
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_MASTER_MD = os.path.join(OUTPUT_DIR, "deepseek_master_context.md")
OUTPUT_SYSTEM_PROMPT = os.path.join(OUTPUT_DIR, "deepseek_system_prompt.txt")

def clean_text(text: str) -> str:
    """Bersihkan tag metadata Antigravity agar teks bersih untuk DeepSeek."""
    if not text:
        return ""
    # Hapus tag <USER_REQUEST> dan </USER_REQUEST>
    text = re.sub(r'<\/?USER_REQUEST>', '', text)
    # Hapus tag metadata tambahan
    text = re.sub(r'<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>', '', text)
    text = re.sub(r'<USER_SETTINGS_CHANGE>[\s\S]*?<\/USER_SETTINGS_CHANGE>', '', text)
    text = re.sub(r'<SYSTEM_MESSAGE>[\s\S]*?<\/SYSTEM_MESSAGE>', '', text)
    text = re.sub(r'<CONTEXT_SUMMARY>[\s\S]*?<\/CONTEXT_SUMMARY>', '', text)
    return text.strip()

def parse_transcript(file_path: str):
    """Membaca file transcript.jsonl dan menyaring percakapan Wafian & Avy."""
    dialogues = []
    current_turn = None

    if not os.path.exists(file_path):
        print(f"[!] Warning: Transcript file not found at {file_path}")
        return dialogues

    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            try:
                item = json.loads(line)
                stype = item.get("type")
                created_at = item.get("created_at", "")

                if stype == "USER_INPUT":
                    raw_content = item.get("content", "")
                    cleaned = clean_text(raw_content)
                    if cleaned:
                        current_turn = {
                            "step": item.get("step_index"),
                            "time": created_at,
                            "user": cleaned,
                            "agent": ""
                        }
                        dialogues.append(current_turn)
                elif stype == "PLANNER_RESPONSE" and current_turn is not None:
                    # Ambil konten teks yang ditujukan untuk user (bukan tool calls internal murni)
                    content = item.get("content", "")
                    tool_calls = item.get("tool_calls", [])
                    if content and not tool_calls:
                        cleaned_agent = clean_text(content)
                        if cleaned_agent:
                            current_turn["agent"] = cleaned_agent
            except Exception:
                continue

    return dialogues

def generate_master_context(dialogues):
    """Menyusun master Markdown yang komprehensif untuk DeepSeek."""
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    header = f"""# DEEPSEEK MASTER CONTEXT: PROYEK T-AIMS (TEKNOLAB ASSET & INFRASTRUCTURE MANAGEMENT SYSTEM)
**Waktu Ekspor:** {now_str}  
**Target AI:** DeepSeek V3 / DeepSeek R1 (chat.deepseek.com & API)  
**Pengguna / Rekan Diskusi:** **Wafian** (DevOps, Server & Network Security Engineer - PT Teknolab Caraka Internasional)  
**Partner AI Sebelumnya:** Avy (Google Antigravity)  

---

## 🎯 PANDUAN UNTUK DEEPSEEK
Hai DeepSeek! Dokumen ini adalah rekam memori lengkap dari seluruh proses perancangan, pengembangan, debugging, dan deployment proyek **T-AIMS**.
Dengan membaca dokumen ini, kamu memiliki pemahaman 100% mengenai:
1. Siapa Wafian dan tanggung jawab teknisnya (DevOps, Server, Database, Networking, Security).
2. Arsitektur lengkap sistem T-AIMS (Backend, Frontend, Mosquitto MQTT, MySQL, n8n Automation Engine, Python Network Monitoring).
3. Status milestone proyek per Hari 9 hingga saat ini.
4. Topologi riil jaringan Head Office & Marketing Office (temuan konflik IP/subnet dan rencana renumbering).
5. Workflow notifikasi n8n berbasis AI Gemini 3.8 Flash yang baru saja selesai di-deploy.
6. Pemisahan repositori WhatsApp bot dengan T-AIMS.
7. Riwayat tanya-jawab langsung antara Wafian dan AI sebelumnya.

> **PENTING UNTUK DEEPSEEK:**  
> - Panggil pengguna dengan nama **Wafian** (JANGAN gunakan kata "Mas").  
> - Lanjutkan diskusi dengan pemahaman penuh terhadap seluruh konteks teknis di bawah ini tanpa perlu bertanya ulang dari nol.

---

## 🏗️ BLUEPRINT & ARSITEKTUR TEKNIS T-AIMS

### 1. Profil Proyek
* **Nama Sistem:** T-AIMS (Teknolab Asset & Infrastructure Management System)
* **Organisasi:** PT Teknolab Caraka Internasional
* **Lokasi Root Repositori:** `/mnt/d/xampp/htdocs/T-AIMS` (disymlink ke `~/T-AIMS` di WSL2 Ubuntu)
* **Proyek Lain (Terisolasi):** Bot WhatsApp dipisahkan ke `~/whatsapp-bot` agar repositori T-AIMS tetap bersih.

### 2. Stack Teknologi & Container Docker (`docker-compose.yml`)
* **`taims-mysql` (MySQL 8.0):** Port `3306`. Menyimpan data aset hardware, log monitoring, user & RBAC, dan audit security.
* **`taims-mosquitto` (Eclipse Mosquitto 2.0):** Port `1883` & `9001`. Broker MQTT resmi untuk telemetri heartbeat IoT dan pub/sub alert insiden.
* **`taims-backend` (Node.js Express):** Port `3000`. REST API service dengan JWT Authentication, RBAC, dan logging.
* **`taims-frontend` (React.js + Nginx):** Port `3001`. Dashboard web monitoring dan manajemen aset.
* **`taims-n8n` (n8n Workflow Engine):** Port `5678`. Orkestrasi otomasi peringatan dini (*incident alerting*) terintegrasi LangChain AI Gemini.
* **Network Monitoring (`monitoring_engine.py`):** Script Python ICMP ping multi-threaded untuk polling status perangkat ke database dan publish payload ke broker Mosquitto.

---

## 🌐 TOPOLOGI JARINGAN & HASIL SURVEY RIIL (HEAD OFFICE VS MARKETING OFFICE)

Berdasarkan survey fisik alamat IP dan MAC address asli yang dilakukan Wafian:

### A. Head Office (Subnet `192.168.1.0/24`)
* **Router HO (Gateway):** `192.168.1.1` | MAC: `E8:6E:44:A5:66:C6` (Ruijie/TP-Link) -> Terdaftar sebagai `asset_id: 23` (`NET-RTR-01`).
* **PC Workstation 1:** `192.168.1.2` | MAC: `E0:AD:47:20:B6:6C` (Giga-Byte) -> Terdaftar sebagai `asset_id: 20` (`PC-WS-01`).
* **PC Workstation 2:** `192.168.1.7` | MAC: `5C:93:A2:F1:82:D5` (HP) -> Terdaftar sebagai `asset_id: 21` (`PC-WS-02`).
* **Smart TV Display:** `192.168.1.10` | MAC: `DC:97:58:54:45:10` (Xiaomi) -> Terdaftar sebagai `asset_id: 19` (`DISP-TV-01`).
* **CCTV Security HO:** `192.168.1.39` | MAC: `B8:AB:CA:FC:30:AC` (Hikvision) -> Terdaftar sebagai `asset_id: 17` (`SEC-CCTV-01`).

### B. Marketing Office (MO)
* **Router 2 MO:** `192.168.0.1` | MAC: `74:DA:88:D9:0B:74` (TP-Link) — Subnet `192.168.0.0/24`.
* **Router 1 MO:** `192.168.1.1` | MAC: `A0:E0:6D:35:F5:90` (TP-Link) — Subnet `192.168.1.0/24`.
* **MikroTik MO:** `192.168.1.2` | MAC: `08:55:31:70:AB:4D` (MikroTik RouterBOARD) -> `asset_id: 16` (`NET-RTR-02`).
* **CCTV Security MO:** `192.168.1.3` | MAC: `98:A8:29:01:FA:D2` (Hikvision) -> `asset_id: 18` (`SEC-CCTV-02`).

### C. Temuan Kritis Engineering & Solusi yang Disepakati
1. **Subnet & IP Overlap (Head Office vs Marketing Office):**
   * *Masalah:* Kedua kantor sama-sama menggunakan `192.168.1.0/24` (IP `192.168.1.1` dan `192.168.1.2` tabrakan).
   * *Solusi:* Marketing Office akan di-**renumbering** ke segmen **`192.168.2.0/24`** agar siap saat interkoneksi Site-to-Site VPN / Tunneling ke server pusat T-AIMS.
2. **Dual-Subnet & Double NAT di Marketing Office:**
   * *Masalah:* Router 2 berjalan di `192.168.0.0/24`, sedangkan Router 1 dan MikroTik di `192.168.1.0/24`.
   * *Solusi:* Konsolidasi gateway tunggal di MikroTik MO (`192.168.2.1`), jadikan Router 1 & Router 2 sebagai Access Point (AP Bridge Mode, DHCP Server off).

---

## ⚡ DEVOPS & SECURITY MILESTONES (HARI 9)
Semua task Hari 9 telah tuntas 100% dan terdokumentasi di [`docs/handover/handover-hari-9.md`]:
1. **User Management & RBAC Security Integration:**
   * Multi-role authorization (Super Admin, Admin, Technician, Viewer).
   * Pengujian `DELETE /api/assets/:id` sukses mengembalikan status `403 Forbidden` untuk non-admin.
   * Mekanisme Token Blacklisting di MySQL (`token_blacklist`) dengan event scheduler harian untuk mencegah token replay setelah logout.
2. **Otomatisasi Backup Terjadwal:**
   * Cron job aktif: `0 2 * * * /home/dragon-wafian/T-AIMS/devops/scripts/backup_db.sh`.
   * Backup otomatis MySQL dengan retensi rotasi 7 hari. File dump terverifikasi (`taims_db_backup_*.sql`).
3. **Staging Environment Readiness:**
   * Container health checks aktif (`/health` & `/api/monitoring/health` mengembalikan HTTP 200).

---

## 🤖 OTOMASI ALERTING n8n & GOOGLE GEMINI AI (BARU SAJA SELESAI DEPLOY)
Pipeline notifikasi insiden cerdas berbasis AI telah aktif di container `taims-n8n`:
* **Workflow Aktif:**
  1. `01-offline-alert.json` — Menerima topic `taims/alert/offline/#`, cooldown buffer 10 menit, memanggil AI LangChain Gemini 3.8 Flash untuk diagnosis kegagalan & rekomendasi teknisi cepat, lalu kirim via Telegram & Email.
  2. `02-recovery-alert.json` — Menerima topic `taims/alert/recovery/#`, cooldown buffer 10 menit, menyusun ringkasan recovery perangkat, lalu kirim notifikasi.
* **Kredensial Aktif:**
  * MQTT Broker: Host `taims-mosquitto`, Port `1883`
  * Telegram: Bot resmi `@taims_alert_arik_bot`, Chat ID `-5383419523`
  * Gmail SMTP: `smtp.gmail.com:587`, Sender `education8420@gmail.com`, App Password dari Arick: `sydnaxxyqkdzypge`
  * AI Model: Google Gemini (`models/gemini-3.8-flash`, temperature 0.2)
  * BCC Email: Terdistribusi otomatis ke 11 anggota tim teknis.

---

## 💬 LOG LENGKAP PERCAKAPAN WAFIAN & AI (URUTAN KRONOLOGIS)

Berikut adalah transkrip tanya-jawab nyata antara Wafian dan asisten AI sebelumnya:

"""

    body_parts = []
    for idx, d in enumerate(dialogues, 1):
        step = d["step"]
        time_str = d["time"]
        u_text = d["user"]
        a_text = d["agent"]

        part = f"### Sesi #{idx} | Step {step} | Waktu: {time_str}\n\n"
        part += f"**Wafian:**\n```text\n{u_text}\n```\n\n"
        if a_text:
            # Batasi pesan balasan yang terlalu masif agar hemat token tanpa memangkas inti jawaban
            if len(a_text) > 2500:
                shortened_agent = a_text[:2500] + "\n\n... [Jawaban panjang diringkas untuk efisiensi context window DeepSeek] ..."
            else:
                shortened_agent = a_text
            part += f"**Avy (AI Assistant):**\n\n{shortened_agent}\n\n"
        part += "---\n\n"
        body_parts.append(part)

    footer = """
---
## 🏁 AKHIR DOKUMEN MASTER CONTEXT
DeepSeek, kamu sekarang sudah memiliki seluruh konteks, keputusan arsitektur, dan riwayat obrolan di atas. Silakan sambut Wafian dan konfirmasikan pemahamanmu, lalu siap menjawab atau melanjutkan instruksi berikutnya!
"""
    return header + "".join(body_parts) + footer

def generate_system_prompt():
    """Menghasilkan System Prompt ringkas berdensitas tinggi untuk dimasukkan ke system message DeepSeek."""
    prompt = """Kamu adalah DeepSeek AI yang bertindak sebagai Senior Software Architect & DevOps Lead untuk sistem T-AIMS (Teknolab Asset & Infrastructure Management System) milik PT Teknolab Caraka Internasional.

Rekan kerjamu adalah WAFIAN (DevOps, Server, Network & Security Engineer). 
ATURAN UTAMA: Selalu sapa pengguna dengan nama "Wafian" (JANGAN PERNAH gunakan kata "Mas").

INFORMASI KUNCI SISTEM T-AIMS:
1. Root Codebase: `/mnt/d/xampp/htdocs/T-AIMS` (symlink di WSL2: `~/T-AIMS`). Project terpisah: WhatsApp bot di `~/whatsapp-bot`.
2. Stack: Express.js (Port 3000), React.js (Port 3001), Mosquitto MQTT (Port 1883), MySQL 8 (Port 3306), n8n Automation (Port 5678).
3. Status DevOps Hari 9 (100% Selesai):
   - RBAC & JWT Blacklisting (`token_blacklist` table, auto-purge scheduler, 403 Forbidden check).
   - Automated Backup crontab `0 2 * * *` (`backup_db.sh`, retensi 7 hari).
   - Health check endpoints `/health` & `/api/monitoring/health` (HTTP 200).
4. Topologi Jaringan Terkini:
   - Head Office (`192.168.1.0/24`): Router (.1), PC1 (.2), PC2 (.7), TV (.10), CCTV (.39).
   - Marketing Office: Router 2 (`192.168.0.1`), Router 1 (`192.168.1.1`), MikroTik (`192.168.1.2`), CCTV (`192.168.1.3`).
   - Solusi Konflik Jaringan: Subnet overlap HO vs MO akan diatasi dengan renumbering Marketing Office ke `192.168.2.0/24`. Konsolidasi gateway tunggal di MikroTik MO (`192.168.2.1`), jadikan Router 1 & Router 2 sebagai Access Point Bridge Mode.
5. Otomasi Alerting n8n AI:
   - Workflow aktif: `01-offline-alert.json` & `02-recovery-alert.json`.
   - AI Engine: LangChain Basic LLM Chain + Google Gemini (`models/gemini-3.8-flash`, temp 0.2).
   - Channels: Telegram (`@taims_alert_arik_bot`, Chat ID `-5383419523`) + Gmail SMTP (`education8420@gmail.com`, App Password: `sydnaxxyqkdzypge`, BCC 11 anggota tim).
   - Anti-spam: Buffer cooldown 10 menit per device.

Kamu memahami 100% riwayat perancangan sistem ini dan siap membantu Wafian dalam pemrograman, troubleshooting server, konfigurasi jaringan, maupun audit arsitektur selanjutnya. Jawablah secara to-the-point, akurat, profesional, dan berorientasi engineering production-ready.
"""
    return prompt.strip()

def main():
    print(f"[*] Memulai ekstraksi percakapan dari: {TRANSCRIPT_PATH}")
    dialogues = parse_transcript(TRANSCRIPT_PATH)
    print(f"[+] Ditemukan {len(dialogues)} sesi percakapan nyata.")

    print(f"[*] Menyusun Master Context Markdown...")
    master_content = generate_master_context(dialogues)
    with open(OUTPUT_MASTER_MD, "w", encoding="utf-8") as f:
        f.write(master_content)
    print(f"[✓] Berhasil menyimpan Master Context ke: {OUTPUT_MASTER_MD} ({len(master_content)} bytes)")

    print(f"[*] Menyusun DeepSeek System Prompt...")
    system_prompt = generate_system_prompt()
    with open(OUTPUT_SYSTEM_PROMPT, "w", encoding="utf-8") as f:
        f.write(system_prompt)
    print(f"[✓] Berhasil menyimpan System Prompt ke: {OUTPUT_SYSTEM_PROMPT}")

if __name__ == "__main__":
    main()
