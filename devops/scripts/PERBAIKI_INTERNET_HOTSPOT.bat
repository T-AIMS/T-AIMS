@echo off
:: =====================================================================
:: SKRIP OTOMATIS PERBAIKAN INTERNET HOTSPOT WINDOWS (THINKPAD T14)
:: Mengaktifkan ICS, DNS Proxy, DHCP dan Firewall
:: Penanggung Jawab: Wafian Zaidan - PT Teknolab Caraka Internasional
:: =====================================================================

:: Pastikan hak Administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] PERINGATAN: File ini WAJIB dijalankan dengan cara:
    echo     Klik Kanan -^> "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo ===================================================================
echo   MEMPERBAIKI KONEKSI INTERNET DAN SINYAL HOTSPOT WINDOWS (ICS)
echo ===================================================================
echo.

echo [1/5] Mengatur Service Internet Connection Sharing (SharedAccess)...
sc config SharedAccess start= auto >nul 2>&1
net stop SharedAccess >nul 2>&1
net start SharedAccess >nul 2>&1
echo       -^> Service ICS (SharedAccess) Berhasil Dijalankan!

echo.
echo [2/5] Mengaktifkan IP Routing / Forwarding...
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v "IPEnableRouter" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters" /v "PeerlessTimeout" /t REG_DWORD /d 1440 /f >nul 2>&1
reg add "HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters" /v "PublicConnectionTimeout" /t REG_DWORD /d 1440 /f >nul 2>&1

powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetIPInterface | Set-NetIPInterface -Forwarding Enabled -ErrorAction SilentlyContinue" >nul 2>&1
echo       -^> IP Forwarding Aktif dan Timeout Hotspot Diperpanjang 24 Jam!

echo.
echo [3/5] Membuka Port DNS dan DHCP di Windows Defender Firewall...
netsh advfirewall firewall delete rule name="T-AIMS Hotspot DNS UDP" >nul 2>&1
netsh advfirewall firewall delete rule name="T-AIMS Hotspot DNS TCP" >nul 2>&1
netsh advfirewall firewall delete rule name="T-AIMS Hotspot DHCP UDP" >nul 2>&1

netsh advfirewall firewall add rule name="T-AIMS Hotspot DNS UDP" dir=in action=allow protocol=UDP localport=53 profile=any >nul 2>&1
netsh advfirewall firewall add rule name="T-AIMS Hotspot DNS TCP" dir=in action=allow protocol=TCP localport=53 profile=any >nul 2>&1
netsh advfirewall firewall add rule name="T-AIMS Hotspot DHCP UDP" dir=in action=allow protocol=UDP localport=67-68 profile=any >nul 2>&1
echo       -^> Port DNS dan DHCP Berhasil Dibuka! HP bisa resolve internet!

echo.
echo [4/5] Memperbarui Port Forwarding T-AIMS ke WSL2 Docker...
for /f "tokens=1" %%a in ('wsl hostname -I 2^>nul') do set WSL_IP=%%a
if "%WSL_IP%"=="" set WSL_IP=172.19.115.245
netsh interface portproxy delete v4tov4 listenport=3001 listenaddress=0.0.0.0 >nul 2>&1
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=0.0.0.0 >nul 2>&1
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=%WSL_IP% >nul 2>&1
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=%WSL_IP% >nul 2>&1
echo       -^> Port T-AIMS 3001 dan 3000 Terhubung ke Docker (%WSL_IP%).

echo.
echo [5/5] Membersihkan Cache Jaringan dan DNS Windows...
arp -d * >nul 2>&1
ipconfig /flushdns >nul 2>&1
echo       -^> DNS dan Cache ARP Berhasil Dibersihkan!

echo.
echo ===================================================================
echo   SUKSES! Konfigurasi Jaringan dan Sharing Internet Telah Bersih!
echo ===================================================================
echo.
echo LANGKAH TERAKHIR DI WINDOWS DAN HP:
echo 1. Di HP: Buka Wi-Fi, pilih "Lupakan Jaringan" (Forget Network) pada Hotspot.
echo 2. Di Laptop: Matikan lalu Nyalakan kembali "Mobile Hotspot" di Settings.
echo 3. Sambungkan kembali Wi-Fi di HP dan ketik password-nya.
echo 4. Buka browser HP: http://192.168.137.1:3001
echo.
pause
