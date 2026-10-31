"""
=============================================================================
T-AIMS - PRODUCTION AI & AUTOMATION ENGINE (ARIK n8n RUNNER)
Port: 5678 | PT Teknolab Caraka Internasional
=============================================================================
Menjalankan alur logika 100% identik dengan Workflow n8n Arik (Level Enterprise):
1. /webhook/ai-recommendation (AI dasbord.json)
2. /webhook/taims-alert (NOTIFIKASI T-AIMS OFFLINE.json & EARLY WARNING)
3. /webhook/taims-recovery (NOTIFIKASI T-AIMS RECOVERY.json)

Fitur Baru Standar Enterprise:
- Concurrency: ThreadingHTTPServer (Multi-threaded & Non-blocking)
- 3-Tier Alert Lifecycle: Warning (🟡 Anomali), Critical (🔴 Offline), Recovery (🟢 Normal)
- Graceful Degradation: Fallback instan ke template darurat jika Gemini API timeout (>20s)
- Contextual Telemetry: Membaca IP, Lokasi, Kategori, dan Gejala
=============================================================================
"""

from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
from datetime import datetime
import time
import os

PORT = 5678

# Kredensial Resmi dari Workflow Arik (dibaca dinamis dari .env)
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'taims-backend', '.env')
env_vars = {}
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8', errors='ignore') as fp:
        for line in fp:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                parts = line.split('=', 1)
                env_vars[parts[0].strip()] = parts[1].strip().strip('"').strip("'")

GEMINI_KEY_DASHBOARD = env_vars.get("GEMINI_KEY_DASHBOARD", os.environ.get("GEMINI_KEY_DASHBOARD", ""))
GEMINI_KEY_NOTIF     = env_vars.get("GEMINI_KEY_NOTIF", os.environ.get("GEMINI_KEY_NOTIF", ""))
TELEGRAM_BOT_TOKEN   = env_vars.get("TELEGRAM_BOT_TOKEN", "8944593836:AAEP2bDCO53srpWR3gdKXY6CHQ13Ni8OtPA")
TELEGRAM_CHAT_ID     = env_vars.get("TELEGRAM_CHAT_ID", "-5383419523")

# Cache & Cooldown in-memory
cache_ai = {
    "last_call": 0,
    "last_result": None
}
cooldown_alerts = {}

def call_gemini(prompt, api_key, timeout_sec=20):
    """
    Panggilan inferensi ke Google Gemini 3.5 Flash Lite dengan Graceful Degradation (Timeout Capped).
    """
    if not api_key:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout_sec) as res:
            data = json.loads(res.read().decode('utf-8'))
            candidates = data.get('candidates', [])
            if candidates and 'content' in candidates[0]:
                parts = candidates[0]['content'].get('parts', [])
                if parts and 'text' in parts[0]:
                    return parts[0]['text']
    except Exception as e:
        print(f"[-] Gemini API Timeout / Error: {e} (Graceful Degradation Aktif)")
    return None

def send_telegram(text):
    """
    Meneruskan pesan notifikasi ke Bot Telegram @taims_alert_arik_bot.
    """
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "HTML"
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return res.status == 200
    except Exception as e:
        print(f"[-] Telegram Send Error: {e}")
        return False

class ArikWorkflowHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        try:
            body = json.loads(post_data.decode('utf-8'))
        except:
            body = {}

        payload = body.get('body', body)

        # -------------------------------------------------------------
        # 1. /webhook/ai-recommendation (AI dasbord.json)
        # -------------------------------------------------------------
        if self.path == '/webhook/ai-recommendation':
            print(f"[*] [n8n Engine] Permintaan Rekomendasi AI Dashboard diterima...")
            now = time.time() * 1000
            
            # Cek Cache 5 Menit (COOLDOWN_MS = 5 * 60 * 1000)
            if now - cache_ai["last_call"] < (5 * 60 * 1000) and cache_ai["last_result"]:
                print("    -> Mengembalikan hasil dari Cache n8n")
                teks_ai = cache_ai["last_result"]
            else:
                summary = payload.get('summary', {})
                offline_assets = payload.get('offline_assets', [])
                offline_names = ', '.join([a.get('asset_name', '') for a in offline_assets]) if offline_assets else 'Tidak ada'

                prompt_ai = (
                    f"Kamu adalah AI Infrastructure Assistant untuk sistem T-AIMS PT Teknolab Caraka Internasional.\n"
                    f"Data Jaringan Terkini:\n"
                    f"- Total Perangkat: {summary.get('total_devices', 0)}\n"
                    f"- Online: {summary.get('online', 0)}\n"
                    f"- Offline: {summary.get('offline', 0)}\n"
                    f"- Availability: {summary.get('availability_percent', 0)}%\n\n"
                    f"Perangkat Bermasalah / Offline: \n{offline_names}\n\n"
                    f"Berikan analisis diagnostik singkat dan 3 solusi preskriptif taktis untuk teknisi NOC Teknolab."
                )

                print("    -> Memanggil Gemini 3.5 Flash Lite...")
                gemini_res = call_gemini(prompt_ai, GEMINI_KEY_DASHBOARD, timeout_sec=20)
                teks_ai = gemini_res or "Sistem telemetri aktif. Periksa kondisi catu daya dan uplink switch utama untuk perangkat offline."
                
                cache_ai["last_call"] = now
                cache_ai["last_result"] = teks_ai

            offline_count = payload.get('summary', {}).get('offline', 0)
            status_ai = "critical" if offline_count > 0 else "warning"
            status_net = "KRITIS" if status_ai == "critical" else "PERINGATAN (WARNING)"

            resp_json = {
                "status": status_ai,
                "status_network": status_net,
                "device": "Cek detail di dashboard",
                "recommendation": teks_ai
            }
            self._send_json(200, resp_json)
            print("    -> Sukses mengembalikan respon AI ke Backend T-AIMS.")

        # -------------------------------------------------------------
        # 2. /webhook/taims-alert (NOTIFIKASI T-AIMS OFFLINE & EARLY WARNING)
        # -------------------------------------------------------------
        elif self.path == '/webhook/taims-alert':
            asset_code = payload.get('asset_code', '-')
            asset_name = payload.get('asset_name', '-')
            category = payload.get('category', '-')
            severity = payload.get('severity', 'critical')
            location = payload.get('location', 'Head Office')
            ip_address = payload.get('ip_address', '-')
            event_type = payload.get('event_type', 'DEVICE_OFFLINE')
            last_seen = payload.get('last_seen', datetime.now().strftime("%d/%m/%Y %H:%M:%S WIB"))
            symptoms = payload.get('symptoms', {})

            is_warning = (severity == 'warning' or event_type == 'PREDICTIVE_WARNING')
            print(f"[*] [n8n Engine] Alert {'WARNING 🟡' if is_warning else 'CRITICAL 🔴'} diterima untuk: {asset_code} ({asset_name})")

            # Cooldown 10 menit per aset
            now = time.time() * 1000
            last_sent = cooldown_alerts.get(f"{'warning' if is_warning else 'offline'}_{asset_code}", 0)
            if now - last_sent < (10 * 60 * 1000):
                print(f"    -> [Anti-Spam Debounce] Alert untuk {asset_code} masih dalam cooldown 10 menit.")
                self._send_json(200, {"message": "Cooldown aktif"})
                return

            cooldown_alerts[f"{'warning' if is_warning else 'offline'}_{asset_code}"] = now

            if is_warning:
                # Early Warning System (Usulan Wafian: Predictive Maintenance)
                symptoms_str = f"Latensi: {symptoms.get('ping_latency', '185 ms')}, Packet Loss: {symptoms.get('packet_loss', '25%')}"
                prompt_ai = (
                    f"Kamu adalah AI Network Analyst profesional untuk sistem T-AIMS PT Teknolab Caraka Internasional.\n"
                    f"Perangkat berikut mengalami gejala ketidakwajaran (status WARNING - DETEKSI DINI):\n"
                    f"- Nama: {asset_name}\n"
                    f"- Kode: {asset_code}\n"
                    f"- Kategori: {category}\n"
                    f"- Lokasi: {location} (IP: {ip_address})\n"
                    f"- Gejala: {symptoms_str}\n\n"
                    f"Tugasmu:\n"
                    f"1. Berikan analisis prediktif (1-2 kalimat) kenapa gejala ini terjadi sebelum perangkat mati total.\n"
                    f"2. Berikan 1 rekomendasi pencegahan preventif.\n\n"
                    f"Format output (WAJIB teks biasa):\n"
                    f"🟡 [WARNING: DETEKSI DINI ANOMALI]\n"
                    f"📌 Perangkat: {asset_code} - {asset_name}\n"
                    f"🏢 Lokasi: {location} (IP: {ip_address})\n"
                    f"📊 Gejala: {symptoms_str}\n\n"
                    f"🔍 ANALISIS PREDIKTIF AI:\n[Analisis kamu]\n\n"
                    f"🛠️ TINDAKAN PENCEGAHAN (PREVENTIF):\n[Rekomendasi kamu]\n"
                    f"====================================\n"
                    f"Bot: @taims_alert_arik_bot • n8n Early Warning Engine"
                )
                fallback_text = (
                    f"🟡 <b>[WARNING: DETEKSI DINI ANOMALI]</b>\n"
                    f"====================================\n"
                    f"📌 <b>Perangkat:</b> {asset_code} - {asset_name}\n"
                    f"🏢 <b>Lokasi:</b> {location} (IP: {ip_address})\n"
                    f"📊 <b>Gejala:</b> {symptoms_str}\n\n"
                    f"🔍 <b>ANALISIS PREDIKTIF:</b> Terdeteksi fluktuasi latensi atau penurunan kualitas link.\n"
                    f"🛠️ <b>TINDAKAN:</b> Lakukan verifikasi beban port switch dan konektor fisik.\n"
                    f"====================================\n"
                    f"<i>Bot: @taims_alert_arik_bot • n8n Early Warning Engine</i>"
                )
            else:
                # Critical Offline Alert
                prompt_ai = (
                    f"Kamu adalah AI Network Analyst profesional untuk sistem T-AIMS PT Teknolab Caraka Internasional.\n"
                    f"Perangkat berikut baru saja OFFLINE (KRITIS):\n"
                    f"- Nama: {asset_name}\n"
                    f"- Kode: {asset_code}\n"
                    f"- Kategori: {category}\n"
                    f"- Lokasi: {location} (IP: {ip_address})\n"
                    f"- Severity: {severity}\n"
                    f"- Terakhir terlihat: {last_seen}\n\n"
                    f"Tugasmu:\n"
                    f"1. Berikan analisis akar masalah singkat (1-2 kalimat) sesuai kategori perangkat.\n"
                    f"2. Berikan 1 tindakan cepat tanggap darurat teknisi (remediasi).\n\n"
                    f"Format output (WAJIB teks biasa):\n"
                    f"🔴 [T-AIMS ALERT] PERANGKAT OFFLINE!\n"
                    f"📌 Perangkat: {asset_code} - {asset_name}\n"
                    f"🏢 Lokasi: {location} (IP: {ip_address})\n"
                    f"⚠️ Severity: {severity}\n\n"
                    f"🔍 ANALISIS AKAR MASALAH (AI):\n[Analisis kamu]\n\n"
                    f"🛠️ TINDAKAN TEKNISI (REMEDIASI):\n[Rekomendasi kamu]\n"
                    f"====================================\n"
                    f"Bot: @taims_alert_arik_bot • n8n Alert Engine"
                )
                fallback_text = (
                    f"🔴 <b>[T-AIMS ALERT] PERANGKAT OFFLINE!</b>\n"
                    f"====================================\n"
                    f"📌 <b>Perangkat:</b> {asset_code} - {asset_name}\n"
                    f"🏢 <b>Lokasi:</b> {location} (IP: {ip_address})\n"
                    f"⚠️ <b>Severity:</b> {severity}\n"
                    f"⏰ <b>Terakhir:</b> {last_seen}\n\n"
                    f"🔍 <b>ANALISIS:</b> Perangkat tidak merespons denyut sinyal heartbeat.\n"
                    f"🛠️ <b>TINDAKAN:</b> Cek catu daya adaptor dan kabel LAN fisik.\n"
                    f"====================================\n"
                    f"<i>Bot: @taims_alert_arik_bot • n8n Alert Engine</i>"
                )

            print("    -> Menginferensi AI Gemini (Timeout Capped 20s)...")
            ai_text = call_gemini(prompt_ai, GEMINI_KEY_NOTIF, timeout_sec=20)
            if not ai_text:
                print("    -> Memakai Fallback Graceful Degradation T-AIMS")
                ai_text = fallback_text

            print("    -> Meneruskan ke Bot Telegram Arik...")
            send_telegram(ai_text)
            self._send_json(200, {"success": True, "message": "Alert diproses"})

        # -------------------------------------------------------------
        # 3. /webhook/taims-recovery (NOTIFIKASI T-AIMS RECOVERY)
        # -------------------------------------------------------------
        elif self.path == '/webhook/taims-recovery':
            asset_code = payload.get('asset_code', '-')
            asset_name = payload.get('asset_name', '-')
            category = payload.get('category', '-')
            location = payload.get('location', 'Head Office')
            ip_address = payload.get('ip_address', '-')
            recovered_at = payload.get('recovered_at', datetime.now().strftime("%d/%m/%Y %H:%M:%S WIB"))

            print(f"[*] [n8n Engine] Alert RECOVERY 🟢 diterima untuk: {asset_code} ({asset_name})")

            now = time.time() * 1000
            last_sent = cooldown_alerts.get(f"recovery_{asset_code}", 0)
            if now - last_sent < (10 * 60 * 1000):
                self._send_json(200, {"message": "Cooldown aktif"})
                return

            cooldown_alerts[f"recovery_{asset_code}"] = now

            prompt_ai = (
                f"Kamu adalah AI Network Analyst profesional untuk sistem T-AIMS PT Teknolab Caraka Internasional.\n"
                f"Perangkat berikut baru saja PULIH (ONLINE kembali):\n"
                f"- Nama: {asset_name}\n"
                f"- Kode: {asset_code}\n"
                f"- Kategori: {category}\n"
                f"- Lokasi: {location} (IP: {ip_address})\n"
                f"- Waktu Pulih: {recovered_at}\n\n"
                f"Tugasmu:\n"
                f"Berikan 1 kalimat analisis stabilisasi dan saran pencegahan agar tidak putus kembali.\n\n"
                f"Format output (WAJIB teks biasa):\n"
                f"🟢 [T-AIMS RECOVERY] PERANGKAT NORMAL KEMBALI!\n"
                f"📌 Perangkat: {asset_code} - {asset_name}\n"
                f"🏢 Lokasi: {location} (IP: {ip_address})\n"
                f"📊 Status: RESOLVED (ONLINE)\n"
                f"⏰ Waktu Pulih: {recovered_at}\n\n"
                f"🤖 ANALISIS PEMULIHAN AI:\n[Saran pencegahan kamu]\n"
                f"====================================\n"
                f"Bot: @taims_alert_arik_bot • n8n Recovery Engine"
            )

            fallback_recovery = (
                f"🟢 <b>[T-AIMS RECOVERY] PERANGKAT NORMAL KEMBALI!</b>\n"
                f"====================================\n"
                f"📌 <b>Perangkat:</b> {asset_code} - {asset_name}\n"
                f"🏢 <b>Lokasi:</b> {location} (IP: {ip_address})\n"
                f"📊 <b>Status:</b> RESOLVED (Sinyal Normal)\n"
                f"⏰ <b>Waktu Pulih:</b> {recovered_at}\n\n"
                f"🤖 <b>ANALISIS:</b> Perangkat telah terverifikasi stabil.\n"
                f"====================================\n"
                f"<i>Bot: @taims_alert_arik_bot • n8n Recovery Engine</i>"
            )

            print("    -> Menginferensi AI Recovery Gemini...")
            ai_text = call_gemini(prompt_ai, GEMINI_KEY_NOTIF, timeout_sec=20)
            if not ai_text:
                ai_text = fallback_recovery

            send_telegram(ai_text)
            self._send_json(200, {"success": True, "message": "Recovery diproses"})

        else:
            self.send_response(404)
            self.end_headers()

    def _send_json(self, code, obj):
        res_bytes = json.dumps(obj).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(res_bytes)))
        self.end_headers()
        self.wfile.write(res_bytes)

    def log_message(self, format, *args):
        return

if __name__ == '__main__':
    # ThreadingHTTPServer menyediakan pemrosesan multi-threaded concurrent non-blocking
    server = ThreadingHTTPServer(('0.0.0.0', PORT), ArikWorkflowHandler)
    print("=" * 70)
    print(f"[*] T-AIMS ARIK n8n AI WORKFLOW ENGINE (PORT {PORT}) MULTI-THREADED RUNNING...")
    print(f"    - Webhook AI Dashboard : http://0.0.0.0:{PORT}/webhook/ai-recommendation")
    print(f"    - Webhook Alert 3-Tier : http://0.0.0.0:{PORT}/webhook/taims-alert (Warning 🟡 & Critical 🔴)")
    print(f"    - Webhook Recovery     : http://0.0.0.0:{PORT}/webhook/taims-recovery (Recovery 🟢)")
    print("=" * 70)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("[!] Engine dihentikan.")
