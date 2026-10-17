# T-AIMS Automation & Alerting Engine

Modul otomasi peringatan dini (*incident alerting*) dan asisten infrastruktur cerdas berbasis **n8n Workflow Engine** untuk PT Teknolab Caraka Internasional.

---

## ⚡ Spesifikasi Teknis
* **Platform:** n8n Workflow Automation (Docker Container port 5678)
* **Konektivitas:** Webhook HTTP Listener, Mosquitto MQTT Subscriber, Telegram Bot API
* **Bot Resmi Telegram:** `@taims_alert_arik_bot`
* **Logika Anti-Spam:** Algoritma Cooldown Buffer 10 Menit untuk mencegah banjir notifikasi pada insiden offline berulang.

---

## 🔄 Berkas Workflow Aktif (`workflows/`)
1. **`MQTT T-AIMS OFFLINE.json`:**
   * Alur pendeteksi perangkat mati ketika broker MQTT atau backend mendeteksi ketiadaan sinyal heartbeat.
   * Format pesan darurat: Tag perangkat, IP, waktu mati, dan status *CRITICAL*.
2. **`MQTT T-AIMS RECOVERY.json`:**
   * Alur pendeteksi pemulihan perangkat ketika perangkat berhasil terhubung kembali (*reconnected*).
   * Format pesan pemulihan: Konfirmasi online, durasi downtime, dan status *RESOLVED*.

---

## 👥 Penanggung Jawab
* **Automation & Notification Engineer:** Arik (Shift 2)
* **DevOps Infrastructure Support:** Wafian (Shift 2)
