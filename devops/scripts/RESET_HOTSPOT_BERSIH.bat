@echo off
:: =====================================================================
:: RESET BERSIH JARINGAN HOTSPOT DAN WLAN WINDOWS (THINKPAD T14)
:: Menghilangkan Glitch "Gagal Terhubung ke Jaringan" pada HP
:: Penanggung Jawab: Wafian Zaidan - PT Teknolab Caraka Internasional
:: =====================================================================

net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] PERINGATAN: WAJIB Klik Kanan -^> "Run as administrator"
    pause
    exit /b 1
)

echo ===================================================================
echo   MERESET ADAPTOR VIRTUAL HOTSPOT DAN SERVICE WLAN WINDOWS
echo ===================================================================
echo.

echo [1/4] Merestart Service WLAN dan Network Connection Broker...
net stop WlanSvc >nul 2>&1
net start WlanSvc >nul 2>&1
net stop ncasvc >nul 2>&1
net start ncasvc >nul 2>&1
echo       -^> Service Wi-Fi dan Koneksi Berhasil Direset!

echo.
echo [2/4] Merestart Service Internet Sharing (SharedAccess)...
net stop SharedAccess >nul 2>&1
net start SharedAccess >nul 2>&1
echo       -^> Service DHCP dan DNS Hotspot Berhasil Direset!

echo.
echo [3/4] Mengaktifkan Kembali Port Forwarding T-AIMS ke Docker WSL2...
for /f "tokens=1" %%a in ('wsl hostname -I 2^>nul') do set WSL_IP=%%a
if "%WSL_IP%"=="" set WSL_IP=172.19.115.245

netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0 >nul 2>&1
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0 >nul 2>&1
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=%WSL_IP% >nul 2>&1
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=%WSL_IP% >nul 2>&1
echo       -^> Port 3001 dan 3000 Berhasil Diarahkan ke %WSL_IP%!

echo.
echo [4/4] Membersihkan Cache ARP dan Routing...
arp -d * >nul 2>&1
ipconfig /flushdns >nul 2>&1
echo       -^> Cache Jaringan Bersih!

echo.
echo ===================================================================
echo   SELESAI! Adaptor Hotspot telah bersih dari tabrakan IP/MAC.
echo ===================================================================
echo.
echo LANGKAH PENTING DI HP WAFIAN:
echo 1. Di Wi-Fi HP: Pilih "LUPAKAN JARINGAN" (Forget Network) pada Hotspot ThinkPad.
echo 2. Nyalakan Mobile Hotspot di laptop (Settings -^> Mobile hotspot -^> ON).
echo 3. Hubungkan kembali HP dan masukkan password-nya.
echo.
pause
