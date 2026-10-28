@echo off
title Push Pembaharuan Final T-AIMS ke GitHub
color 0b
echo ======================================================================
echo           SINKRONISASI PEMBAHARUAN PROYEK T-AIMS KE GITHUB
echo ======================================================================
echo Target Remote : https://github.com/T-AIMS/T-AIMS.git
echo Branch        : main
echo Status        : Siap Push Commit Terbaru (ec998f0)
echo.
echo Berkas yang disinkronkan:
echo  1. frontend/ (App.js 181 model, style.css lurus/responsive, index.html)
echo  2. taims-backend/ (Support sub_category, server clean)
echo  3. database/taims_db.sql (Database Master 5.2 MB siap import localhost)
echo  4. JALANKAN_BACKEND.bat & JALANKAN_FRONTEND.bat (One-click launch script)
echo ======================================================================
echo.
echo Memulai git push...
git push origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================================
    echo [SUKSES 100%%] Seluruh berkas telah berhasil ter-push ke GitHub!
    echo Repositori https://github.com/T-AIMS/T-AIMS sekarang sudah up-to-date.
    echo ======================================================================
) else (
    echo ======================================================================
    echo [INFO OTENTIKASI GITHUB]
    echo Jika muncul prompt jendela browser, silakan login/authorize akun GitHub.
    echo Pastikan akun GitHub Anda memiliki akses write ke repo T-AIMS/T-AIMS.
    echo ======================================================================
)
pause
