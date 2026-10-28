@echo off
title T-AIMS - Frontend Web Dashboard (Port 5500)
color 0a
echo ======================================================================
echo           MENJALANKAN FRONTEND WEB T-AIMS (PORT 5500)
echo ======================================================================
cd /d "%~dp0frontend"
start "" "http://127.0.0.1:5500/index.html"
if exist "%~dp0server_5500.js" (
    node "%~dp0server_5500.js"
) else (
    echo Membuka index.html di browser...
    start "" "index.html"
)
pause
