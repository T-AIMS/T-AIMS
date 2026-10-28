@echo off
title T-AIMS - Backend API Service (Port 3000)
color 0b
echo ======================================================================
echo           MENJALANKAN BACKEND API T-AIMS (PORT 3000)
echo ======================================================================
cd /d "%~dp0taims-backend"
node src/app.js
pause
