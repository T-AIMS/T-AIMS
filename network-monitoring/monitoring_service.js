/**
 * =============================================================================
 * T-AIMS - DOCKER REAL-TIME ICMP MONITORING DAEMON (DYNAMIC SYNC VERSION)
 * Penanggung Jawab : Wafian Zaidan (DevOps & Server Network Security Engineer)
 * PT Teknolab Caraka Internasional
 * =============================================================================
 * Fitur Unggulan:
 *   - Sinkronisasi Dinamis: Mengambil daftar IP target langsung dari database/API.
 *   - Auto-Follow: Begitu IP diubah di UI Web, daemon otomatis mengeping IP baru.
 *   - Zero Downtime & Anti-Crash: Dilengkapi graceful fallback dan safety error handler.
 * =============================================================================
 */

const { execFile } = require('child_process');
const http = require('http');

const BACKEND_HOST = process.env.BACKEND_HOST || 'backend';
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || '3000', 10);
const API_KEY = process.env.DEVICE_API_KEY || 'taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1';
const INTERVAL_MS = parseInt(process.env.MONITORING_INTERVAL || '10', 10) * 1000;

// Daftar cadangan jika backend belum siap saat cold-start
const FALLBACK_DEVICES = [
  { asset_id: 1,  asset_code: "CCTV-01", name: "CCTV Head Office",      ip: "192.168.1.39" },
  { asset_id: 2,  asset_code: "CCTV-02", name: "CCTV Marketing",        ip: "192.168.1.10" },
  { asset_id: 3,  asset_code: "RTR-01",  name: "Router Head Office",     ip: "192.168.1.1" },
  { asset_id: 4,  asset_code: "RTR-02",  name: "Router 2 Marketing",     ip: "192.168.0.1" },
  { asset_id: 5,  asset_code: "RTR-03",  name: "Router 1 Marketing",     ip: "192.168.1.1" },
  { asset_id: 6,  asset_code: "SMTV-01", name: "Smart TV Head Office",   ip: "192.168.1.10" },
  { asset_id: 7,  asset_code: "PC-01",   name: "PC Head Office 01",      ip: "192.168.1.2" },
  { asset_id: 8,  asset_code: "PC-02",   name: "PC Head Office 02",      ip: "192.168.1.7" },
  { asset_id: 11, asset_code: "ESP-01",  name: "ESP32 Head Office Node", ip: "192.168.0.105" },
  { asset_id: 12, asset_code: "RPI-01",  name: "Raspberry Pi Head Office", ip: "192.168.1.12" },
  { asset_id: 13, asset_code: "MKRT-01", name: "Mikrotik Marketing",     ip: "192.168.1.2" },
  { asset_id: 14, asset_code: "MKRT-02", name: "Mikrotik Server",        ip: "192.168.3.14" },
  { asset_id: 15, asset_code: "SRV-01",  name: "Server Utama",            ip: "192.168.3.15" },
  { asset_id: 16, asset_code: "RPI-02",  name: "Raspberry Pi Server",    ip: "192.168.3.16" },
  { asset_id: 17, asset_code: "SWM-01",  name: "Switch Manageable",      ip: "192.168.3.1" }
];

let activeDevices = [...FALLBACK_DEVICES];

/**
 * Mengambil daftar target perangkat secara dinamis dari API Backend (Database MySQL)
 */
function fetchDynamicTargets() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/monitoring/targets',
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'Accept': 'application/json'
      },
      timeout: 3000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            if (parsed.success && Array.isArray(parsed.data) && parsed.data.length > 0) {
              activeDevices = parsed.data.map(item => ({
                asset_id: item.asset_id,
                asset_code: item.asset_code,
                name: item.asset_name,
                ip: item.ip_address
              }));
            }
          }
        } catch (e) {
          // Graceful ignore: tetap gunakan activeDevices yang ada
        }
        resolve();
      });
    });

    req.on('error', () => resolve());
    req.on('timeout', () => { req.destroy(); resolve(); });
    req.end();
  });
}

function pingIp(ip) {
  return new Promise((resolve) => {
    if (!ip || typeof ip !== 'string' || ip.trim() === '' || ip.trim() === '-') {
      return resolve({ isLive: false, latency: 0 });
    }

    const cleanIp = ip.trim();
    execFile('ping', ['-c', '1', '-W', '1', cleanIp], (error, stdout) => {
      if (!error && stdout) {
        const match = stdout.match(/time=([\d.]+)\s*ms/);
        const lat = match ? parseFloat(match[1]) : 2.0;
        resolve({ isLive: true, latency: lat });
      } else {
        resolve({ isLive: false, latency: 0 });
      }
    });
  });
}

function sendPingToBackend(dev, isLive, latency) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      asset_id: dev.asset_id,
      status: isLive ? 'online' : 'offline',
      response_time_ms: latency,
      details: {
        ip: dev.ip,
        packet_loss: isLive ? 0 : 100,
        source: 'Docker Real-Time Dynamic ICMP Engine',
        device_code: dev.asset_code
      }
    });

    const req = http.request({
      hostname: BACKEND_HOST,
      port: BACKEND_PORT,
      path: '/api/monitoring/ping',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'X-API-Key': API_KEY
      },
      timeout: 3000
    }, (res) => {
      res.resume();
      resolve(res.statusCode === 200 || res.statusCode === 201);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.write(payload);
    req.end();
  });
}

async function runCycle() {
  // 1. Ambil target terkini dari database secara dinamis
  await fetchDynamicTargets();

  // 2. Lakukan ping serentak ke seluruh IP target dinamis
  const currentList = [...activeDevices];
  const promises = currentList.map(async (dev) => {
    const { isLive, latency } = await pingIp(dev.ip);
    await sendPingToBackend(dev, isLive, latency);
    return isLive;
  });

  const results = await Promise.all(promises);
  const onlineCount = results.filter(Boolean).length;
  const offlineCount = results.length - onlineCount;
  const now = new Date().toLocaleTimeString('id-ID');
  console.log(`[CYCLE ${now}] Ping Dinamis: ${onlineCount} Online, ${offlineCount} Offline (Total ${currentList.length} Perangkat Terdaftar)`);
}

// Pencegahan crash tak terduga (Zero-Crash Assurance)
process.on('uncaughtException', (err) => console.error('[DAEMON UNCAUGHT]', err.message));
process.on('unhandledRejection', (reason) => console.error('[DAEMON REJECTION]', reason));

console.log(`[*] T-AIMS Docker Dynamic Monitoring Engine AKTIF (Interval: ${INTERVAL_MS / 1000}s)`);
runCycle();
setInterval(runCycle, INTERVAL_MS);
