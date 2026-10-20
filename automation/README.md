# T-AIMS Automation & Alerting Engine

Modul otomasi peringatan dini (*incident alerting*) dan analisis infrastruktur cerdas berbasis **n8n Workflow Engine & Google Gemini AI** untuk PT Teknolab Caraka Internasional.

---

## ⚡ Spesifikasi Teknis & Arsitektur
* **Workflow Engine:** n8n Automation Engine (Docker Container `taims-n8n`, port `5678`)
* **AI Analysis Engine:** LangChain (`@n8n/n8n-nodes-langchain`) via Google Gemini (`models/gemini-3.8-flash`, temperature `0.2`)
* **Message Broker:** Eclipse Mosquitto MQTT (`taims-mosquitto`, port `1883`)
  * Topic Offline: `taims/alert/offline/#`
  * Topic Recovery: `taims/alert/recovery/#`
* **Multi-Channel Alerting:**
  * **Telegram:** Official Bot (`@taims_alert_arik_bot`), Group Chat ID: `-5383419523`
  * **Email (SMTP):** `smtp.gmail.com:587` (TLS), Sender: `education8420@gmail.com`, dengan BCC ke 11 anggota tim teknis
* **Anti-Spam & Flapping Protection:** Algoritma Cooldown Buffer 10 Menit (`$getWorkflowStaticData('global')`) per `asset_code` untuk mencegah banjir notifikasi.

---

## 🔄 Berkas Workflow Aktif (`workflows/`)

| File Workflow | Topic MQTT | Model AI | Saluran Notifikasi | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| **`01-offline-alert.json`** | `taims/alert/offline/#` | Google Gemini 3.8 Flash | Telegram + Email (BCC) | Menerima payload offline perangkat, cooldown 10 menit, memanggil AI untuk diagnosis penyebab & rekomendasi teknisi cepat, lalu dispatch ke Telegram & Email. |
| **`02-recovery-alert.json`** | `taims/alert/recovery/#` | Google Gemini 3.8 Flash | Telegram + Email (BCC) | Menerima status pulih (online kembali), cooldown 10 menit, AI menyusun ringkasan pemulihan & tindakan pencegahan, lalu dispatch notifikasi. |

> [!NOTE]
> Workflow lama tanpa AI (v1) telah dinonaktifkan dan diarsipkan ke folder `workflows/_archive/` untuk mencegah duplikasi notifikasi.

---

## 🔑 Daftar Kebutuhan Credential di Server Production

Untuk mengoperasikan pipeline otomasi ini, 4 konfigurasi kredensial berikut wajib terdaftar pada n8n:

1. **MQTT T-AIMS (`mqtt`):**
   * Host: `taims-mosquitto` (Docker DNS) / `1883`
   * Type: MQTT Account
2. **Telegram T-AIMS (`telegramApi`):**
   * Access Token Bot: Bot token resmi `@taims_alert_arik_bot`
   * Target Chat ID: `-5383419523`
3. **SMTP T-AIMS (`smtp`):**
   * Host: `smtp.gmail.com` | Port: `587` (SSL/TLS: false / STARTTLS)
   * User: `education8420@gmail.com`
   * App Password: `sydnaxxyqkdzypge` *(Arick's App Password)*
4. **Google Gemini (`googlePalmApi` / `googleGeminiApi`):**
   * Host: `https://generativelanguage.googleapis.com`
   * API Key: *(Google AI Studio / Gemini API Key)*

---

## 📧 Daftar Distribusi Email BCC
Notifikasi insiden dan recovery diteruskan secara otomatis ke tim melalui BCC:
* `damarmunajad7@gmail.com`
* `rzafahmi351@gmail.com`
* `faidatrismaamelia@gmail.com`
* `ilfinamufarika4@gmail.com`
* `c11anandadwisusanti@gmail.com`
* `awangtgprofesional@gmail.com`
* `dikayogapratama18@gmail.com`
* `ahzizsaputra@gmail.com`
* `arickferdiansyah@gmail.com`
* `wafianzaidan@gmail.com`
* `rezatriwardana7@gmail.com`

---

## 👥 Penanggung Jawab
* **Automation & Notification Engineer:** Arik (Shift 2)
* **DevOps Infrastructure & Security:** Wafian (Shift 2)
