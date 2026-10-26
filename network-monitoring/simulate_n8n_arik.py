"""
=============================================================================
T-AIMS - SIMULATOR N8N AI WORKFLOW ENGINE (ARIK)
Port: 5678 | Webhook: /webhook/ai-recommendation
=============================================================================
Script ini mensimulasikan n8n Workflow Automation milik Arik di Port 5678.
Menerima payload agregasi telemetri dari Backend T-AIMS dan mengembalikan
analisis diagnostik cerdas berbasis AI.

Cara Menjalankan:
    python simulate_n8n_arik.py
=============================================================================
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime

PORT = 5678

class N8nWebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/webhook/ai-recommendation':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
            except:
                payload = {}

            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"\n[n8n-Arik Webhook] Menerima Payload Telemetri T-AIMS ({now_str})")
            
            summary = payload.get('summary', {})
            total = summary.get('total_devices', 15)
            online = summary.get('online', 0)
            offline = summary.get('offline', 0)
            
            print(f"   >> Agregasi: {online}/{total} Online, {offline} Offline")
            print(f"   >> Memproses inferensi LLM & mitigasi prediktif...")

            response_data = {
                "status": "healthy" if offline == 0 else "warning",
                "device": "Kluster Marketing Office & Head Office",
                "recommendation": (
                    f"[n8n AI Engine - Model Gemini Pro] Hasil Analisis Telemetri:\n"
                    f"1. Status Operasional: {online} dari {total} perangkat fisik terdeteksi aktif. "
                    f"Jalur komunikasi data multi-site stabil.\n"
                    f"2. Rekomendasi Preskriptif: Pertahankan kestabilan catu daya 12V adaptor router dan pastikan redaman fiber optik < -20 dBm.\n"
                    f"3. Tindakan Mitigasi: Lakukan auto-ping berkala setiap 10 detik untuk memastikan ketiadaan jitter jaringan."
                ),
                "generated_by": "Arik Automation n8n Engine",
                "timestamp": now_str
            }

            response_bytes = json.dumps(response_data).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(response_bytes)))
            self.end_headers()
            self.wfile.write(response_bytes)
            print("   >> Respon AI berhasil dikirim kembali ke Backend T-AIMS! (200 OK)")
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        return

def main():
    server = HTTPServer(('0.0.0.0', PORT), N8nWebhookHandler)
    print("=" * 70)
    print("   [+] n8n AI WORKFLOW SIMULATOR (ARIK - SHIFT 2)")
    print(f"   Listening on: http://localhost:{PORT}/webhook/ai-recommendation")
    print("=" * 70)
    print(">> Siap menerima request dari Backend T-AIMS...")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[INFO] n8n Simulator dihentikan.")

if __name__ == "__main__":
    main()
