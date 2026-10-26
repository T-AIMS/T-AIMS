/**
 * T-AIMS Hardware Monitoring Agent
 * PT Teknolab Angkasa Perkasa
 * 
 * Script ringan untuk dipasang di PC Server Fisik (Opsi B).
 * Mengambil CPU, RAM, Disk, dan Uptime PC Server setiap 3 detik,
 * lalu mengirimkannya secara real-time ke Backend T-AIMS.
 */

const http = require('http');
const https = require('https');
const os = require('os');
const fs = require('fs');

// KONFIGURASI TARGET (Ubah IP ini sesuai IP Server / Hosting Backend T-AIMS)
const CONFIG = {
    BACKEND_URL: process.env.TAIMS_BACKEND_URL || 'http://localhost:3000/api/monitoring/server-telemetry',
    ASSET_ID: process.env.TAIMS_ASSET_ID || 1, // ID Asset PC Server di database T-AIMS
    INTERVAL_MS: 3000 // Interval kirim data (3 detik)
};

console.log('====================================================');
console.log('   T-AIMS Hardware Monitoring Agent - PT Teknolab   ');
console.log('====================================================');
console.log(`[Target URL] : ${CONFIG.BACKEND_URL}`);
console.log(`[Asset ID]   : ${CONFIG.ASSET_ID}`);
console.log(`[Interval]   : ${CONFIG.INTERVAL_MS / 1000} detik`);
console.log(`[Host PC]    : ${os.hostname()} (${os.platform()} ${os.arch()})`);
console.log('----------------------------------------------------');

function getCpuTimes() {
    const cpus = os.cpus();
    let idleMs = 0;
    let totalMs = 0;
    for (const cpu of cpus) {
        for (const type in cpu.times) {
            totalMs += cpu.times[type];
        }
        idleMs += cpu.times.idle;
    }
    return { idle: idleMs / (cpus.length || 1), total: totalMs / (cpus.length || 1) };
}

let lastCpu = getCpuTimes();
let currentCpuPercent = 0;

setInterval(() => {
    try {
        const cur = getCpuTimes();
        const idleDiff = cur.idle - lastCpu.idle;
        const totalDiff = cur.total - lastCpu.total;
        if (totalDiff > 0) {
            currentCpuPercent = Math.max(0, Math.min(100, +(100 - (100 * idleDiff / totalDiff)).toFixed(1)));
        }
        lastCpu = cur;
    } catch (e) {}
}, 1000).unref();

function collectMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramPercent = +((usedMem / totalMem) * 100).toFixed(1);

    let diskUsage = 0;
    try {
        const stats = fs.statfsSync(process.platform === 'win32' ? 'C:\\' : '/');
        const total = stats.bsize * stats.blocks;
        const free = stats.bsize * stats.bfree;
        diskUsage = +(((total - free) / total) * 100).toFixed(1);
    } catch (e) {
        diskUsage = 45.0;
    }

    return {
        asset_id: CONFIG.ASSET_ID,
        cpu_usage: currentCpuPercent,
        ram_usage: ramPercent,
        disk_usage: diskUsage,
        temperature: Math.round(42 + (currentCpuPercent * 0.25)), // Estimasi suhu thermal (°C)
        uptime_seconds: Math.floor(os.uptime())
    };
}

function sendTelemetry() {
    const payload = JSON.stringify(collectMetrics());
    const target = new URL(CONFIG.BACKEND_URL);
    const client = target.protocol === 'https:' ? https : http;

    const req = client.request({
        hostname: target.hostname,
        port: target.port || (target.protocol === 'https:' ? 443 : 80),
        path: target.pathname + target.search,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 2500
    }, (res) => {
        if (res.statusCode === 200) {
            const m = JSON.parse(payload);
            const ts = new Date().toLocaleTimeString('id-ID');
            process.stdout.write(`\r[${ts}] [OK] CPU: ${m.cpu_usage}% | RAM: ${m.ram_usage}% | Disk: ${m.disk_usage}% | Uptime: ${Math.floor(m.uptime_seconds / 3600)} Jam `);
        } else {
            console.log(`\n[!] Gagal kirim telemetri (HTTP ${res.statusCode})`);
        }
    });

    req.on('error', (err) => {
        process.stdout.write(`\r[${new Date().toLocaleTimeString('id-ID')}] [!] Backend offline / koneksi putus (${err.code || err.message}) `);
    });

    req.write(payload);
    req.end();
}

console.log('[*] Monitoring Agent berjalan. Tekan CTRL+C untuk berhenti.\n');
setInterval(sendTelemetry, CONFIG.INTERVAL_MS);
sendTelemetry();
