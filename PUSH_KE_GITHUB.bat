@echo off
title Push Pembaharuan Final T-AIMS ke GitHub
color 0b
echo ======================================================================
echo           SINKRONISASI PEMBAHARUAN PROYEK T-AIMS KE GITHUB
echo ======================================================================
echo Target Remote: https://github.com/T-AIMS/T-AIMS.git
echo Branch       : main
echo Status       : Siap Push (12 Commits Terbaru - Integrasi n8n, Telegram, & Handover)
echo.
echo Berkas yang diperbarui hari ini:
echo  1. taims-backend/src/routes/ai.js (Parser ai_response live dari n8n Gemini)
echo  2. taims-backend/src/routes/notifications.js (Dual Dispatch n8n & Telegram Direct)
echo  3. taims-backend/.env & .env.production (Token Bot Baru & ID Grup -5383419523)
echo  4. frontend/assets/js/app.js (Perbaikan Aksi Tabel, Anti-Flicker Badge, & Default Settings)
echo  5. frontend/index.html (Lebar Kolom Aksi Tabel & Form Pengaturan Terkunci Real)
echo  6. scripts/test_tembak_arik.js & UJI_TEMBAK_INTEGRASI.bat (Test Suite Otomatis)
echo  7. docs/handover/2026-10-27_Handover_Dzakwan.md (Handover Resmi Hari 16)
echo ======================================================================
echo.
echo Memulai push...
"C:\Users\HALLO\AppData\Local\MinGit\cmd\git.exe" push origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================================
    echo [SUKSES 100%%] Seluruh berkas telah berhasil ter-push ke GitHub!
    echo Repositori https://github.com/T-AIMS/T-AIMS sekarang sudah sempurna.
    echo ======================================================================
) else (
    echo ======================================================================
    echo [INFO OTENTIKASI GITHUB]
    echo Jika muncul pesan error permission denied / authentication failed:
    echo 1. Pastikan akun GitHub Anda memiliki akses write ke T-AIMS/T-AIMS.
    echo 2. Gunakan Personal Access Token (PAT) atau GitHub Desktop untuk push.
    echo ======================================================================
)
pause
