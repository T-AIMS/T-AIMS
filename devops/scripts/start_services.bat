@echo off
setlocal enabledelayedexpansion
title T-AIMS Master Service Launcher
color 0A

:: =====================================================================
:: T-AIMS AUTOMATED SERVICE LAUNCHER (WINDOWS)
:: Penanggung Jawab : Wafian (DevOps, Server & Security Engineer)
:: Deskripsi        : Skrip launcher portabel pendeteksi backend & frontend
:: =====================================================================

:: 1. Tentukan Project Root secara Dinamis (Relative Path)
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%..\.."
set "PROJECT_ROOT=%CD%"

echo =====================================================================
echo              T-AIMS INFRASTRUCTURE SERVICE LAUNCHER
echo =====================================================================
echo Project Root : %PROJECT_ROOT%
echo Waktu Mulai  : %DATE% %TIME%
echo =====================================================================

:: 2. Deteksi Direktori Backend (taims-backend atau backend)
set "BACKEND_DIR="
if exist "%PROJECT_ROOT%\taims-backend\package.json" (
    set "BACKEND_DIR=%PROJECT_ROOT%\taims-backend"
) else if exist "%PROJECT_ROOT%\backend\package.json" (
    set "BACKEND_DIR=%PROJECT_ROOT%\backend"
)

if "%BACKEND_DIR%"=="" (
    color 0C
    echo [ERROR] Direktori Backend tidak ditemukan! 
    echo Pastikan folder 'taims-backend' atau 'backend' memiliki package.json.
    pause
    exit /b 1
)

set "FRONTEND_DIR=%PROJECT_ROOT%\frontend"

:MENU
echo.
echo Pilih Layanan yang ingin dijalankan:
echo  [1] Jalankan Backend Saja (Node.js Express - Port 3000)
echo  [2] Jalankan Frontend Saja (HTTP Server - Port 3001)
echo  [3] Jalankan KEDUANYA (Backend + Frontend - 2 Jendela Terpisah)
echo  [4] Audit & Cek Status Port Lokal (3000, 3001, 3306, 1883, 5678)
echo  [5] Keluar
echo.
set /p CHOICE="Pilihan Anda (1-5) [Default 3]: "
if "%CHOICE%"=="" set CHOICE=3

if "%CHOICE%"=="1" goto START_BACKEND
if "%CHOICE%"=="2" goto START_FRONTEND
if "%CHOICE%"=="3" goto START_BOTH
if "%CHOICE%"=="4" goto CHECK_STATUS
if "%CHOICE%"=="5" goto EXIT_SCRIPT

echo Pilihan tidak valid. Silakan coba lagi.
goto MENU

:START_BACKEND
echo.
echo [INFO] Menyiapkan Backend dari: %BACKEND_DIR%
if not exist "%BACKEND_DIR%\node_modules" (
    echo [WARNING] node_modules belum terpasang! Menjalankan 'npm install'...
    cd /d "%BACKEND_DIR%"
    call npm install
)
echo [OK] Memulai T-AIMS Backend pada Port 3000...
cd /d "%BACKEND_DIR%"
start "T-AIMS Backend (Port 3000)" cmd /k "title T-AIMS Backend Server && npm start"
goto FINISH

:START_FRONTEND
echo.
echo [INFO] Menyiapkan Frontend dari: %FRONTEND_DIR%
cd /d "%FRONTEND_DIR%"
echo [OK] Memulai T-AIMS Frontend pada Port 3001...
where python >nul 2>nul
if %errorlevel% equ 0 (
    start "T-AIMS Frontend (Port 3001)" cmd /k "title T-AIMS Frontend Server && python -m http.server 3001"
) else (
    where npx >nul 2>nul
    if !errorlevel! equ 0 (
        start "T-AIMS Frontend (Port 3001)" cmd /k "title T-AIMS Frontend Server && npx serve -l 3001"
    ) else (
        echo [WARNING] Python atau Node serve tidak ditemukan. Buka %FRONTEND_DIR%\index.html secara manual di browser.
    )
)
goto FINISH

:START_BOTH
echo.
echo [INFO] Menjalankan Backend & Frontend secara simultan...
call :START_BACKEND
timeout /t 2 >nul
call :START_FRONTEND
goto FINISH

:CHECK_STATUS
echo.
echo =====================================================================
echo                      STATUS AUDIT PORT T-AIMS
echo =====================================================================
echo Memeriksa status port pada localhost...
for %%P in (3000 3001 3306 1883 5678) do (
    netstat -ano | findstr ":%%P " >nul
    if !errorlevel! equ 0 (
        echo   [OPEN]     Port %%P aktif mendengarkan koneksi.
    ) else (
        echo   [INACTIVE] Port %%P TIDAK AKTIF / Belum berjalan.
    )
)
echo =====================================================================
pause
goto MENU

:FINISH
echo.
echo =====================================================================
echo [SUKSES] Perintah inisialisasi layanan telah dieksekusi.
echo - Backend API   : http://localhost:3000/api
echo - Frontend Web  : http://localhost:3001
echo - Monitoring DB : Port 3306
echo =====================================================================
pause
exit /b 0

:EXIT_SCRIPT
echo Keluar.
exit /b 0