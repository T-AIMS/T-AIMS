#!/usr/bin/env python3
"""
DeepSeek AI Terminal Client for T-AIMS
Penanggung Jawab: Wafian (DevOps, Server & Network Security Engineer)
Deskripsi: Client interaktif untuk berdialog langsung dengan DeepSeek V3 / R1
           dengan injeksi otomatis seluruh memori dan konteks sistem T-AIMS.
"""

import os
import sys
import json
import urllib.request
import urllib.error

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROMPT_FILE = os.path.join(SCRIPT_DIR, "deepseek_system_prompt.txt")
API_URL = "https://api.deepseek.com/chat/completions"

def load_system_prompt():
    if os.path.exists(PROMPT_FILE):
        with open(PROMPT_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    return "Kamu adalah asisten AI untuk Wafian, Senior DevOps & Network Security Engineer T-AIMS."

def get_api_key():
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        env_path = os.path.join(SCRIPT_DIR, ".env")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.startswith("DEEPSEEK_API_KEY="):
                        api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
    if not api_key:
        print("[!] DEEPSEEK_API_KEY belum disetel.")
        api_key = input("Masukkan DeepSeek API Key Anda: ").strip()
    return api_key

def chat_stream(messages, api_key, model="deepseek-chat"):
    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
        "temperature": 0.3
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(API_URL, data=data, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    })

    full_reply = []
    try:
        with urllib.request.urlopen(req) as response:
            for line in response:
                line_str = line.decode("utf-8").strip()
                if line_str.startswith("data: "):
                    content_str = line_str[6:].strip()
                    if content_str == "[DONE]":
                        break
                    try:
                        chunk = json.loads(content_str)
                        delta = chunk.get("choices", [{}])[0].get("delta", {})
                        # Handle reasoning content jika menggunakan deepseek-reasoner (R1)
                        reasoning = delta.get("reasoning_content")
                        if reasoning:
                            sys.stdout.write(f"\033[90m{reasoning}\033[0m")
                            sys.stdout.flush()
                        content = delta.get("content")
                        if content:
                            sys.stdout.write(content)
                            sys.stdout.flush()
                            full_reply.append(content)
                    except Exception:
                        continue
        print("\n")
        return "".join(full_reply)
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8", errors="ignore")
        print(f"\n[!] HTTP Error {e.code}: {err_msg}")
        return None
    except Exception as e:
        print(f"\n[!] Error: {str(e)}")
        return None

def main():
    print("=" * 60)
    print("🚀 T-AIMS DEEPSEEK AI ASSISTANT (V3 & R1 REASONER)")
    print("   Partner: Wafian (DevOps, Server & Network Security)")
    print("=" * 60)

    api_key = get_api_key()
    if not api_key:
        print("[!] Gagal memulai: API Key diperlukan.")
        sys.exit(1)

    system_prompt = load_system_prompt()
    print("[✓] Konteks & memori T-AIMS berhasil dimuat ke System Prompt.")

    # Pilih model
    print("\nPilih Model DeepSeek:")
    print("1. deepseek-chat     (DeepSeek-V3 - Cepat & sangat mahir coding)")
    print("2. deepseek-reasoner (DeepSeek-R1 - Penalaran arsitektur tingkat lanjut)")
    choice = input("Pilihan [1/2, default 1]: ").strip()
    model = "deepseek-reasoner" if choice == "2" else "deepseek-chat"
    print(f"[✓] Menggunakan model: {model}")

    messages = [
        {"role": "system", "content": system_prompt}
    ]

    # Cek apakah ada argumen perintah langsung via CLI
    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:])
        print(f"\n[Wafian]: {query}")
        print("\n[DeepSeek]: ", end="")
        messages.append({"role": "user", "content": query})
        chat_stream(messages, api_key, model)
        return

    print("\nKetik 'exit' atau 'quit' untuk keluar.")
    print("-" * 60)

    while True:
        try:
            user_input = input("\n[Wafian] > ").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit", "keluar"]:
                print("Sampai jumpa, Wafian!")
                break

            messages.append({"role": "user", "content": user_input})
            print("\n[DeepSeek] > ", end="")
            reply = chat_stream(messages, api_key, model)
            if reply:
                messages.append({"role": "assistant", "content": reply})
        except KeyboardInterrupt:
            print("\n[!] Dibatalkan oleh pengguna. Keluar.")
            break

if __name__ == "__main__":
    main()
