@echo off
:: Pastikan dijalankan sebagai Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] PERINGATAN: File ini WAJIB dijalankan dengan cara:
    echo     Klik Kanan -^> "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo ========================================================
echo  Membuka Port Windows Firewall & Port Forwarding T-AIMS
echo  (Frontend :3001, Backend :3000, MQTT :1883, MySQL :3307)
echo ========================================================
echo.

echo 1. Menambahkan Aturan Inbound di Windows Defender Firewall...
netsh advfirewall firewall delete rule name="T-AIMS Frontend (3001)" >nul 2>&1
netsh advfirewall firewall delete rule name="T-AIMS Frontend (5500)" >nul 2>&1
netsh advfirewall firewall delete rule name="T-AIMS Backend (3000)" >nul 2>&1
netsh advfirewall firewall delete rule name="T-AIMS MQTT (1883)" >nul 2>&1
netsh advfirewall firewall delete rule name="T-AIMS MQTT-WS (9001)" >nul 2>&1
netsh advfirewall firewall delete rule name="T-AIMS MySQL (3307)" >nul 2>&1

netsh advfirewall firewall add rule name="T-AIMS Frontend (3001)" dir=in action=allow protocol=TCP localport=3001 profile=any
netsh advfirewall firewall add rule name="T-AIMS Frontend (5500)" dir=in action=allow protocol=TCP localport=5500 profile=any
netsh advfirewall firewall add rule name="T-AIMS Backend (3000)" dir=in action=allow protocol=TCP localport=3000 profile=any
netsh advfirewall firewall add rule name="T-AIMS MQTT (1883)" dir=in action=allow protocol=TCP localport=1883 profile=any
netsh advfirewall firewall add rule name="T-AIMS MQTT-WS (9001)" dir=in action=allow protocol=TCP localport=9001 profile=any
netsh advfirewall firewall add rule name="T-AIMS MySQL (3307)" dir=in action=allow protocol=TCP localport=3307 profile=any

echo.
echo 2. Mendeteksi IP Virtual WSL2 (Tempat Docker Berjalan)...
for /f "tokens=1" %%a in ('wsl hostname -I 2^>nul') do set WSL_IP=%%a
if "%WSL_IP%"=="" set WSL_IP=172.19.115.245
echo    IP WSL2: %WSL_IP%

echo.
echo 3. Menghubungkan IP Wi-Fi Windows ke Docker WSL2 (Portproxy)...
netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0 >nul 2>&1
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0 >nul 2>&1
netsh interface portproxy delete v4tov4 listenport=1883 listenaddress=0.0.0.0 >nul 2>&1
netsh interface portproxy delete v4tov4 listenport=9001 listenaddress=0.0.0.0 >nul 2>&1
netsh interface portproxy delete v4tov4 listenport=3307 listenaddress=0.0.0.0 >nul 2>&1

netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=%WSL_IP%
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=%WSL_IP%
netsh interface portproxy add v4tov4 listenport=1883 listenaddress=0.0.0.0 connectport=1883 connectaddress=%WSL_IP%
netsh interface portproxy add v4tov4 listenport=9001 listenaddress=0.0.0.0 connectport=9001 connectaddress=%WSL_IP%
netsh interface portproxy add v4tov4 listenport=3307 listenaddress=0.0.0.0 connectport=3307 connectaddress=%WSL_IP%

echo.
echo ========================================================
echo  SUKSES! Port T-AIMS telah dibuka dan diarahkan ke %WSL_IP%.
echo  Sekarang HP di Wi-Fi bisa akses http://192.168.1.3:3001
echo ========================================================
echo.
pause
