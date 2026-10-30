"""
=============================================================================
T-AIMS - PRODUCTION AI & AUTOMATION ENGINE (ARIK n8n RUNNER)
Port: 5678 | PT Teknolab Caraka Internasional
=============================================================================
Menjalankan alur logika 100% identik dengan 3 Workflow n8n Arik:
1. /webhook/ai-recommendation (AI dasbord.json)
2. /webhook/taims-alert (NOTIFIKASI T-AIMS OFFLINE.json)
3. /webhook/taims-recovery (NOTIFIKASI T-AIMS RECOVERY.json)
=============================================================================
"""

import http.server
import json
import urllib.request
import urllib.parse
from datetime import datetime
import time

PORT = 5678

import os

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

def call_gemini(prompt, api_key):
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
        with urllib.request.urlopen(req, timeout=15) as res:
            data = json.loads(res.read().decode('utf-8'))
            candidates = data.get('candidates', [])
            if candidates and 'content' in candidates[0]:
                parts = candidates[0]['content'].get('parts', [])
                if parts and 'text' in parts[0]:
                    return parts[0]['text']
    except Exception as e:
        print(f"[-] Gemini API Error: {e}")
    return None

def send_telegram(text):
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

class ArikWorkflowHandler(http.server.BaseHTTPRequestHandler):
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
                    f"Kamu adalah AI Infrastructure Assistant untuk sistem T-AIMS.\n"
                    f"Data Jaringan:\n"
                    f"- Total Perangkat: {summary.get('total_devices', 0)}\n"
                    f"- Online: {summary.get('online', 0)}\n"
                    f"- Offline: {summary.get('offline', 0)}\n"
                    f"- Availability: {summary.get('availability_percent', 0)}%\n\n"
                    f"Perangkat Offline: \n{offline_names}\n\n"
                    f"Berikan analisis singkat (maksimal 2 paragraf) dan rekomendasi tindakan untuk teknisi."
                )

                print("    -> Memanggil Gemini 3.5 Flash Lite...")
                gemini_res = call_gemini(prompt_ai, GEMINI_KEY_DASHBOARD)
                teks_ai = gemini_res or "Sistem AI (Gemini) sedang sibuk. Silakan periksa status perangkat di dasbor secara berkala."
                
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
        # 2. /webhook/taims-alert (NOTIFIKASI T-AIMS OFFLINE.json)
        # -------------------------------------------------------------
        elif self.path == '/webhook/taims-alert':
            asset_code = payload.get('asset_code', '-')
            asset_name = payload.get('asset_name', '-')
            category = payload.get('category', '-')
            severity = payload.get('severity', 'warning')
            last_seen = payload.get('last_seen', '-')

            print(f"[*] [n8n Engine] Alert OFFLINE diterima untuk: {asset_code} ({asset_name})")

            # Cooldown 10 menit per aset
            now = time.time() * 1000
            last_sent = cooldown_alerts.get(f"offline_{asset_code}", 0)
            if now - last_sent < (10 * 60 * 1000):
                print(f"    -> [Anti-Spam] Alert untuk {asset_code} masih dalam cooldown 10 menit.")
                self._send_json(200, {"message": "Cooldown aktif"})
                return

            cooldown_alerts[f"offline_{asset_code}"] = now

            prompt_ai = (
                f"Kamu adalah AI Network Analyst profesional untuk sistem T-AIMS.\n"
                f"Perangkat berikut baru saja OFFLINE:\n"
                f"- Nama: {asset_name}\n"
                f"- Kode: {asset_code}\n"
                f"- Kategori: {category}\n"
                f"- Severity: {severity}\n"
                f"- Terakhir terlihat: {last_seen}\n\n"
                f"Tugasmu:\n"
                f"1. Berikan analisis singkat (1-2 kalimat) kenapa perangkat ini bisa offline sesuai kategori.\n"
                f"2. Berikan 1 rekomendasi tindakan cepat (troubleshooting).\n\n"
                f"Format output (WAJIB teks biasa):\n"
                f"🔴 OFFLINE ALERT — {asset_name}\n\n"
                f"📊 Status: OFFLINE\n"
                f"⚠️ Severity: {severity}\n\n"
                f"🤖 Analisis AI:\n[Analisis kamu]\n\n"
                f"🎯 Tindakan:\n[Rekomendasi kamu]"
            )

            print("    -> Menginferensi AI Alert Gemini...")
            ai_text = call_gemini(prompt_ai, GEMINI_KEY_NOTIF)
            if not ai_text:
                ai_text = (
                    f"🔴 <b>OFFLINE ALERT — {asset_name}</b>\n\n"
                    f"📊 <b>Status:</b> OFFLINE\n"
                    f"⚠️ <b>Severity:</b> {severity}\n"
                    f"⏰ <b>Terakhir:</b> {last_seen}\n\n"
                    f"ℹ️ <i>Notifikasi Standar T-AIMS</i>"
                )

            # Kirim Telegram
            print("    -> Meneruskan ke Bot Telegram Arik...")
            send_telegram(ai_text)
            self._send_json(200, {"success": True, "message": "Alert diproses"})

        # -------------------------------------------------------------
        # 3. /webhook/taims-recovery (NOTIFIKASI T-AIMS RECOVERY.json)
        # -------------------------------------------------------------
        elif self.path == '/webhook/taims-recovery':
            asset_code = payload.get('asset_code', '-')
            asset_name = payload.get('asset_name', '-')
            category = payload.get('category', '-')
            recovered_at = payload.get('recovered_at', datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

            print(f"[*] [n8n Engine] Alert RECOVERY diterima untuk: {asset_code} ({asset_name})")

            now = time.time() * 1000
            last_sent = cooldown_alerts.get(f"recovery_{asset_code}", 0)
            if now - last_sent < (10 * 60 * 1000):
                self._send_json(200, {"message": "Cooldown aktif"})
                return

            cooldown_alerts[f"recovery_{asset_code}"] = now

            prompt_ai = (
                f"Kamu adalah AI Network Analyst profesional untuk sistem T-AIMS.\n"
                f"Perangkat berikut baru saja PULIH (ONLINE kembali):\n"
                f"- Nama: {asset_name}\n"
                f"- Kode: {asset_code}\n"
                f"- Kategori: {category}\n"
                f"- Waktu Pulih: {recovered_at}\n\n"
                f"Tugasmu:\n"
                f"1. Berikan ucapan singkat bahwa perangkat sudah normal kembali.\n"
                f"2. Berikan 1 saran pencegahan agar perangkat tidak mati lagi.\n\n"
                f"Format output (WAJIB teks biasa):\n"
                f"🟢 RECOVERY ALERT — {asset_name}\n\n"
                f"📊 Status: ONLINE\n"
                f"⏰ Waktu Pulih: {recovered_at}\n\n"
                f"🤖 Analisis AI:\n[Saran pencegahan]"
            )

            print("    -> Menginferensi AI Recovery Gemini...")
            ai_text = call_gemini(prompt_ai, GEMINI_KEY_NOTIF)
            if not ai_text:
                ai_text = (
                    f"🟢 <b>RECOVERY ALERT — {asset_name}</b>\n\n"
                    f"📊 <b>Status:</b> ONLINE\n"
                    f"⏰ <b>Waktu Pulih:</b> {recovered_at}\n\n"
                    f"ℹ️ <i>Notifikasi Standar T-AIMS</i>"
                )

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
    server = http.server.HTTPServer(('0.0.0.0', PORT), ArikWorkflowHandler)
    print("=" * 70)
    print(f"[*] T-AIMS ARIK n8n AI WORKFLOW ENGINE (PORT {PORT}) RUNNING...")
    print(f"    - Webhook AI Dashboard : http://0.0.0.0:{PORT}/webhook/ai-recommendation")
    print(f"    - Webhook Alert Offline: http://0.0.0.0:{PORT}/webhook/taims-alert")
    print(f"    - Webhook Recovery     : http://0.0.0.0:{PORT}/webhook/taims-recovery")
    print("=" * 70)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("[!] Engine dihentikan.")
