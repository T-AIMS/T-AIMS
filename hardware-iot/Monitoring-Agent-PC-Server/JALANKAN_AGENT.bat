@echo off
title T-AIMS Monitoring Agent - PC Server
color 0B
echo.
echo  =============================================================
echo    T-AIMS Hardware Monitoring Agent - PT Teknolab
echo    Memantau CPU, RAM, Disk, dan Uptime PC Server ini
echo  =============================================================
echo.

:: Pindah ke folder script secara dinamis
cd /d "%~dp0"

:: Cek apakah Node.js sudah terpasang
where node >nul 2>&1
if errorlevel 1 (
    echo  [!] Node.js belum terinstall di komputer ini!
    echo  [!] Silakan install Node.js dari https://nodejs.org terlebih dahulu.
    echo.
    pause
    exit
)

echo  [*] Node.js terdeteksi. Menjalankan Agent...
echo  [*] Tekan CTRL+C jika ingin mematikan agent.
echo.

node agent.js
pause
