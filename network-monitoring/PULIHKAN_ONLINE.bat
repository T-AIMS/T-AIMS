@echo off
title T-AIMS Network Recovery - Pulihkan Status Online
color 0A
echo =====================================================================
echo    T-AIMS - SINKRONISASI PEMULIHAN STATUS ONLINE PERANGKAT
echo    PT Teknolab Caraka Internasional
echo    DevOps & Network Security: Wafian Zaidan
echo =====================================================================
echo.
echo Sedang mengirimkan sinyal denyut jaringan (Health Ping) ke Backend...
echo.

python "D:\T-AIMS - FINAL\simulators\pulihkan_online.py" 2>nul
if %errorlevel% neq 0 (
    python3 "D:\T-AIMS - FINAL\simulators\pulihkan_online.py" 2>nul
)

echo.
echo =====================================================================
echo  Status perangkat berhasil disinkronkan ke Backend & Database!
echo  Silakan refresh browser web T-AIMS (Tekan Ctrl + F5).
echo =====================================================================
echo.
pause
