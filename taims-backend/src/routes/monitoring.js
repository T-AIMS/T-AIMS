const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');

// ============================================================
// Helper: Simpan hasil monitoring
// ============================================================
async function saveMonitoringLog(assetId, status, method, responseTimeMs, details, checkTime) {
    let finalStatus = (status || '').toLowerCase().trim();
    const rt = parseInt(responseTimeMs) || 0;
    const packetLoss = details && details.packet_loss ? parseFloat(details.packet_loss) : 0;
    const cpuLoad = details && details.cpu_load ? parseFloat(details.cpu_load) : 0;
    const memLoad = details && details.memory_used_percent ? parseFloat(details.memory_used_percent) : 0;

    // LOGIKA WARNING OTOMATIS (Reza Fahmi)
    if (finalStatus === 'online') {
        if (rt > 1000) finalStatus = 'warning';
        if (packetLoss > 10) finalStatus = 'warning';
        if (cpuLoad > 90 || memLoad > 90) finalStatus = 'warning';
    }

    const [result] = await db.query(
        `INSERT INTO monitoring_logs 
            (asset_id, check_time, status, method, source, response_time_ms, details)
         VALUES (?, COALESCE(?, NOW()), ?, ?, 'monitoring_engine', ?, ?)`,
        [
            assetId,
            checkTime || null,
            finalStatus,
            method,
            responseTimeMs,
            JSON.stringify(details || {})
        ]
    );

    if (finalStatus === 'online') {
        await db.query(
            `UPDATE assets 
             SET current_status = 'online', last_seen = NOW(), offline_since = NULL, updated_at = NOW()
             WHERE asset_id = ?`,
            [assetId]
        );

        await db.query(
            `UPDATE incidents 
             SET incident_status = 'resolved'
             WHERE asset_id = ? 
               AND incident_type = 'Device Offline' 
               AND incident_status IN ('open', 'investigating')`,
            [assetId]
        );
    } else if (finalStatus === 'offline') {
        await db.query(
            `UPDATE assets 
             SET current_status = 'offline', offline_since = COALESCE(offline_since, NOW()), updated_at = NOW()
             WHERE asset_id = ?`,
            [assetId]
        );
    } else {
        await db.query(
            `UPDATE assets 
             SET current_status = ?, last_seen = NOW(), updated_at = NOW()
             WHERE asset_id = ?`,
            [finalStatus, assetId]
        );
    }

    return result.insertId;
}

// ============================================================
// ============================================================
// POST /api/monitoring/real-ping
// Real ICMP ping to physical device using child_process ping
// ============================================================
router.post('/real-ping', authenticate, async (req, res) => {
    try {
        const { asset_id, ip } = req.body;
        const targetIp = (ip || '').trim();

        if (!targetIp) {
            return res.status(400).json({ success: false, error: 'Target IP wajib diisi' });
        }

        const ipClean = targetIp.replace(/[^0-9.]/g, '');
        if (!ipClean || ipClean.split('.').length !== 4) {
            return res.status(400).json({ success: false, error: 'Format IP address tidak valid' });
        }

        const { execFile } = require('child_process');
        const pingArgs = process.platform === 'win32'
            ? ['-n', '1', '-w', '1000', ipClean]
            : ['-c', '1', '-W', '1', ipClean];
        execFile('ping', pingArgs, async (err, stdout) => {
            const output = stdout || '';
            const isOnline = output.toUpperCase().includes('TTL=') || output.toUpperCase().includes('TTL');
            
            let latencyMs = 0;
            if (isOnline) {
                const match = output.match(/(?:time|waktu)[<=](\d+)ms/i);
                latencyMs = match ? parseInt(match[1]) : 1;
            }

            // Deteksi apakah IP adalah subnet privat lokal LAN (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
            const isPrivateLan = /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(ipClean);

            // Jika offline TAPI merupakan IP privat lokal, JANGAN jatuhkan status perangkat di DB menjadi offline!
            // Cek status terakhir dari agen pengirim (MikroTik / Sentinel Agent)
            let finalStatus = isOnline ? 'online' : 'offline';
            let displayMsg = isOnline 
                ? `Perangkat ${ipClean} merespons dalam ${latencyMs} ms (Online).`
                : `Request timed out dari CloudPanel VPS ke IP Privat ${ipClean}.`;

            if (asset_id) {
                try {
                    if (!isOnline && isPrivateLan) {
                        // Ambil status riil terakhir dari database yang dilaporkan oleh Network Agent lokal
                        const [lastLog] = await db.query(
                            `SELECT status, response_time_ms FROM monitoring_logs WHERE asset_id = ? ORDER BY log_id DESC LIMIT 1`,
                            [asset_id]
                        );
                        if (lastLog && lastLog.length > 0 && lastLog[0].status === 'online') {
                            finalStatus = 'online';
                            latencyMs = lastLog[0].response_time_ms || 1;
                            displayMsg = `Perangkat ${ipClean} berada di LAN Privat (Terverifikasi ONLINE via Network Agent ${latencyMs} ms).`;
                        } else {
                            // Catat log offline hanya jika memang di agent lokal belum pernah aktif
                            await saveMonitoringLog(asset_id, 'offline', 'Ping', 0, {
                                packet_loss: 100,
                                source: 'Manual Real ICMP Ping (Private LAN)',
                                tested_ip: ipClean
                            });
                        }
                    } else {
                        await saveMonitoringLog(
                            asset_id,
                            finalStatus,
                            'Ping',
                            latencyMs,
                            {
                                packet_loss: isOnline ? 0 : 100,
                                source: 'Manual Real ICMP Ping',
                                tested_ip: ipClean
                            }
                        );
                    }
                } catch (dbErr) {
                    console.warn('DB Log real-ping error:', dbErr.message);
                }
            }

            return res.json({
                success: true,
                status: finalStatus,
                is_online: (finalStatus === 'online'),
                latency_ms: latencyMs,
                ip: ipClean,
                message: displayMsg
            });
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
});

// ============================================================
// GET /api/monitoring/targets
// Auth: API Key (Digunakan oleh daemon monitoring untuk sync dinamis)
// ============================================================
router.get('/targets', apiKeyAuth, async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT asset_id, asset_code, asset_name, ip_address, monitoring_method 
             FROM assets 
             WHERE ip_address IS NOT NULL AND ip_address != '' AND TRIM(ip_address) != '-'`
        );
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error('GET /api/monitoring/targets error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ============================================================
// POST /api/monitoring/ping
// Auth: API Key
// ============================================================
router.post('/ping', apiKeyAuth, async (req, res) => {
    try {
        const { asset_id, status, response_time_ms, check_time, details } = req.body;

        if (!asset_id || !status || response_time_ms === undefined) {
            return res.status(400).json({
                success: false,
                error: 'asset_id, status, response_time_ms wajib diisi'
            });
        }

        const [asset] = await db.query('SELECT asset_id, asset_code FROM assets WHERE asset_id = ? OR asset_code = ?', [asset_id, asset_id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: `Asset '${asset_id}' tidak ditemukan di database` });
        }

        const realAssetId = asset[0].asset_id;
        const logId = await saveMonitoringLog(realAssetId, status, 'Ping', response_time_ms, details, check_time);

        res.status(201).json({
            success: true,
            message: 'Monitoring log berhasil disimpan',
            data: { log_id: logId }
        });
    } catch (err) {
        console.error('POST /api/monitoring/ping error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/monitoring/http
// ============================================================
router.post('/http', apiKeyAuth, async (req, res) => {
    try {
        const { asset_id, status, response_time_ms, check_time, details } = req.body;

        if (!asset_id || !status || response_time_ms === undefined) {
            return res.status(400).json({ success: false, error: 'asset_id, status, response_time_ms wajib diisi' });
        }

        const [asset] = await db.query('SELECT asset_id, asset_code FROM assets WHERE asset_id = ? OR asset_code = ?', [asset_id, asset_id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: `Asset '${asset_id}' tidak ditemukan di database` });
        }

        const realAssetId = asset[0].asset_id;
        const logId = await saveMonitoringLog(realAssetId, status, 'HTTP', response_time_ms, details, check_time);
        res.status(201).json({ success: true, data: { log_id: logId } });
    } catch (err) {
        console.error('POST /api/monitoring/http error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/monitoring/tcp
// ============================================================
router.post('/tcp', apiKeyAuth, async (req, res) => {
    try {
        const { asset_id, status, response_time_ms, check_time, details } = req.body;

        if (!asset_id || !status || response_time_ms === undefined) {
            return res.status(400).json({ success: false, error: 'asset_id, status, response_time_ms wajib diisi' });
        }

        const [asset] = await db.query('SELECT asset_id, asset_code FROM assets WHERE asset_id = ? OR asset_code = ?', [asset_id, asset_id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: `Asset '${asset_id}' tidak ditemukan di database` });
        }

        const realAssetId = asset[0].asset_id;
        const logId = await saveMonitoringLog(realAssetId, status, 'TCP', response_time_ms, details, check_time);
        res.status(201).json({ success: true, data: { log_id: logId } });
    } catch (err) {
        console.error('POST /api/monitoring/tcp error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/monitoring/ping-http
// ============================================================
router.post('/ping-http', apiKeyAuth, async (req, res) => {
    try {
        const { asset_id, status, response_time_ms, check_time, details } = req.body;

        if (!asset_id || !status || response_time_ms === undefined) {
            return res.status(400).json({ success: false, error: 'asset_id, status, response_time_ms wajib diisi' });
        }

        const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [asset_id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        const logId = await saveMonitoringLog(asset_id, status, 'Ping + HTTP', response_time_ms, details, check_time);
        res.status(201).json({ success: true, data: { log_id: logId } });
    } catch (err) {
        console.error('POST /api/monitoring/ping-http error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/monitoring/snmp
// ============================================================
router.post('/snmp', apiKeyAuth, async (req, res) => {
    try {
        const { asset_id, status, response_time_ms, check_time, details } = req.body;

        if (!asset_id || !status) {
            return res.status(400).json({ success: false, error: 'asset_id dan status wajib diisi' });
        }

        const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [asset_id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        const logId = await saveMonitoringLog(asset_id, status, 'SNMP', response_time_ms || 0, details, check_time);
        res.status(201).json({ success: true, data: { log_id: logId } });
    } catch (err) {
        console.error('POST /api/monitoring/snmp error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/monitoring/mqtt-health
// ============================================================
router.post('/mqtt-health', apiKeyAuth, async (req, res) => {
    try {
        const { asset_id, status, check_time, details } = req.body;

        if (!asset_id || !status) {
            return res.status(400).json({ success: false, error: 'asset_id dan status wajib diisi' });
        }

        const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [asset_id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        const logId = await saveMonitoringLog(asset_id, status, 'MQTT', 0, details, check_time);
        res.status(201).json({ success: true, data: { log_id: logId } });
    } catch (err) {
        console.error('POST /api/monitoring/mqtt-health error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/monitoring/logs
// Auth: JWT (user login via web)
// ============================================================
router.get('/logs', authenticate, async (req, res) => {
    try {
        const { asset_id, status, method, source, from, to, limit = 100, page = 1 } = req.query;

        let sql = `
            SELECT 
                ml.log_id, ml.asset_id,
                a.asset_code, a.asset_name,
                ml.check_time, ml.status, ml.method, ml.source,
                ml.response_time_ms, ml.details, ml.created_at
            FROM monitoring_logs ml
            LEFT JOIN assets a ON ml.asset_id = a.asset_id
            WHERE 1=1
        `;
        const params = [];

        if (asset_id) { sql += ' AND ml.asset_id = ?'; params.push(asset_id); }
        if (status) { sql += ' AND ml.status = ?'; params.push(status); }
        if (method) { sql += ' AND ml.method = ?'; params.push(method); }
        if (source) { sql += ' AND ml.source = ?'; params.push(source); }
        if (from) { sql += ' AND ml.check_time >= ?'; params.push(from); }
        if (to) { sql += ' AND ml.check_time <= ?'; params.push(to); }

        const countSql = sql.replace(
            /SELECT[\s\S]*?FROM monitoring_logs ml/,
            'SELECT COUNT(*) AS total FROM monitoring_logs ml'
        );
        const [countResult] = await db.query(countSql, params);
        const total = countResult[0].total;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' ORDER BY ml.check_time DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await db.query(sql, params);

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data: rows
        });
    } catch (err) {
        console.error('GET /api/monitoring/logs error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/monitoring/status/:assetId
// ============================================================
router.get('/status/:assetId', authenticate, async (req, res) => {
    try {
        const { assetId } = req.params;

        const [rows] = await db.query(`
            SELECT 
                a.asset_id, a.asset_code, a.asset_name, a.category,
                a.current_status, a.last_seen,
                ml.response_time_ms AS last_response_time_ms,
                ml.method AS last_method,
                ml.check_time AS last_check_time
            FROM assets a
            LEFT JOIN monitoring_logs ml ON ml.log_id = (
                SELECT log_id FROM monitoring_logs 
                WHERE asset_id = a.asset_id 
                ORDER BY check_time DESC LIMIT 1
            )
            WHERE a.asset_id = ?
        `, [assetId]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('GET /api/monitoring/status/:assetId error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/monitoring/summary
// ============================================================
router.get('/summary', authenticate, async (req, res) => {
    try {
        const [statusCount] = await db.query(`
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN current_status = 'online' THEN 1 ELSE 0 END) AS online,
                SUM(CASE WHEN current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
                SUM(CASE WHEN current_status = 'warning' THEN 1 ELSE 0 END) AS warning,
                SUM(CASE WHEN current_status = 'unknown' THEN 1 ELSE 0 END) AS unknown,
                SUM(CASE WHEN current_status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance
            FROM assets
        `);

        const [byCategory] = await db.query(`
            SELECT category, current_status, COUNT(*) AS count
            FROM assets
            GROUP BY category, current_status
            ORDER BY category ASC
        `);

        const categoryMap = {};
        for (const row of byCategory) {
            if (!categoryMap[row.category]) {
                categoryMap[row.category] = { online: 0, offline: 0, warning: 0, unknown: 0, maintenance: 0 };
            }
            categoryMap[row.category][row.current_status] = row.count;
        }

        res.status(200).json({
            success: true,
            data: {
                ...statusCount[0],
                by_category: categoryMap
            }
        });
    } catch (err) {
        console.error('GET /api/monitoring/summary error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/monitoring/clean-logs
// Housekeeping: Pengarsipan & pembersihan log pemantauan > 30 hari
// ============================================================
router.post('/clean-logs', authenticate, async (req, res) => {
    try {
        const { archiveOldLogs, deleteOldLogs } = require('../services/log-cleaner');
        await archiveOldLogs();
        await deleteOldLogs();

        res.status(200).json({
            success: true,
            message: 'Pemeliharaan basis data berhasil: Log lebih dari 30 hari telah diringkas dan dibersihkan.'
        });
    } catch (err) {
        console.error('POST /api/monitoring/clean-logs error:', err);
        res.status(500).json({ success: false, error: 'Gagal menjalankan pembersihan log: ' + err.message });
    }
});

// ============================================================
// SYSTEM RESOURCE SAMPLER & SERVER METRICS (CPU, RAM, DISKS, UPTIME)
// ============================================================
const os = require('os');
const fs = require('fs');

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

let lastCpuSample = getCpuTimes();
let currentCpuPercent = 0;

setInterval(() => {
    try {
        const current = getCpuTimes();
        const idleDiff = current.idle - lastCpuSample.idle;
        const totalDiff = current.total - lastCpuSample.total;
        if (totalDiff > 0) {
            currentCpuPercent = Math.max(0, Math.min(100, +(100 - (100 * idleDiff / totalDiff)).toFixed(1)));
        }
        lastCpuSample = current;
    } catch (e) {}
}, 2000).unref();

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [];
    if (days > 0) parts.push(`${days} Hari`);
    if (hours > 0 || days > 0) parts.push(`${hours} Jam`);
    parts.push(`${mins} Menit`);
    if (days === 0 && hours === 0) parts.push(`${secs} Detik`);
    return parts.join(' ');
}

// GET /api/monitoring/server-metrics
// GET /api/monitoring/server-metrics
// Resource monitoring Dedicated Server Utama House of Server (SRV-01 / Asset ID: 15)
router.get('/server-metrics', authenticate, async (req, res) => {
    try {
        // Cek log telemetri terbaru dari Server Utama HS (asset_id = 15)
        const [telemetryLogs] = await db.query(
            `SELECT details, created_at FROM monitoring_logs 
             WHERE asset_id = 15 AND method = 'Telemetry' 
             ORDER BY log_id DESC LIMIT 1`
        );

        let srvTelemetry = null;
        if (telemetryLogs && telemetryLogs.length > 0) {
            const raw = telemetryLogs[0].details;
            srvTelemetry = typeof raw === 'string' ? JSON.parse(raw) : raw;
        }

        if (srvTelemetry && srvTelemetry.cpu_usage !== undefined) {
            return res.status(200).json({
                success: true,
                source: 'hs_server_agent',
                is_standby: false,
                data: {
                    cpu: {
                        usage_percent: parseFloat(srvTelemetry.cpu_usage) || 0,
                        model: srvTelemetry.cpu_model || 'Dell PowerEdge Xeon',
                        cores: srvTelemetry.cpu_cores || 8,
                        speed_mhz: srvTelemetry.cpu_speed_mhz || 2400
                    },
                    memory: {
                        total_gb: parseFloat(srvTelemetry.ram_total_gb) || 16.0,
                        used_gb: parseFloat(srvTelemetry.ram_used_gb) || +(16 * (parseFloat(srvTelemetry.ram_usage) / 100)).toFixed(2),
                        free_gb: +(16 - (16 * (parseFloat(srvTelemetry.ram_usage) / 100))).toFixed(2),
                        usage_percent: parseFloat(srvTelemetry.ram_usage) || 0
                    },
                    disks: [{
                        drive: '/',
                        total_gb: parseFloat(srvTelemetry.disk_total_gb) || 500.0,
                        used_gb: +(500 * (parseFloat(srvTelemetry.disk_usage) / 100)).toFixed(1),
                        free_gb: +(500 - (500 * (parseFloat(srvTelemetry.disk_usage) / 100))).toFixed(1),
                        usage_percent: parseFloat(srvTelemetry.disk_usage) || 0
                    }],
                    system: {
                        platform: srvTelemetry.platform || 'Linux Ubuntu Server (House of Server)',
                        hostname: srvTelemetry.hostname || 'SRV-01-TEKNOLAB',
                        arch: 'x64',
                        uptime_seconds: parseInt(srvTelemetry.uptime_seconds) || 0,
                        uptime_formatted: formatUptime(parseInt(srvTelemetry.uptime_seconds) || 0),
                        node_version: 'v20.x',
                        db_status: 'connected',
                        timestamp: telemetryLogs[0].created_at
                    }
                }
            });
        }

        // Mode Standby: Menunggu Sinyal Agen Server Lab Fisik (Bukan VPS)
        return res.status(200).json({
            success: true,
            source: 'hs_server_standby',
            is_standby: true,
            message: 'Menunggu sinyal Telemetry Agent dari Server Utama HS (SRV-01)',
            data: {
                cpu: {
                    usage_percent: 0,
                    model: 'Dell PowerEdge (Standby)',
                    cores: 8,
                    speed_mhz: 2400
                },
                memory: {
                    total_gb: 16.0,
                    used_gb: 0,
                    free_gb: 16.0,
                    usage_percent: 0
                },
                disks: [{
                    drive: '/',
                    total_gb: 500.0,
                    used_gb: 0,
                    free_gb: 500.0,
                    usage_percent: 0
                }],
                system: {
                    platform: 'Ubuntu Server (House of Server)',
                    hostname: 'SRV-01 (192.168.30.4)',
                    arch: 'x64',
                    uptime_seconds: 0,
                    uptime_formatted: 'Standby',
                    node_version: 'v20.x',
                    db_status: 'connected',
                    timestamp: new Date().toISOString()
                }
            }
        });
    } catch (err) {
        console.error('GET /api/monitoring/server-metrics error:', err);
        res.status(500).json({ success: false, error: 'Gagal mengambil metrik server: ' + err.message });
    }
});
// POST /api/monitoring/server-telemetry
// Endpoint untuk server eksternal / agent mengirim metrik CPU, RAM, Disk
router.post('/server-telemetry', async (req, res) => {
    try {
        const { asset_id, cpu_usage, ram_usage, disk_usage, temperature, uptime_seconds } = req.body;
        if (!asset_id) {
            return res.status(400).json({ success: false, error: 'asset_id wajib diisi' });
        }
        const [asset] = await db.query('SELECT asset_id, asset_name FROM assets WHERE asset_id = ?', [asset_id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }
        const details = {
            cpu_usage: parseFloat(cpu_usage) || 0,
            ram_usage: parseFloat(ram_usage) || 0,
            disk_usage: parseFloat(disk_usage) || 0,
            temperature: parseFloat(temperature) || 0,
            uptime_seconds: parseInt(uptime_seconds) || 0,
            source: 'Telemetry Agent'
        };
        const logId = await saveMonitoringLog(asset_id, 'online', 'Telemetry', 1, details);
        res.status(201).json({ success: true, message: 'Telemetri server berhasil dicatat', log_id: logId });
    } catch (err) {
        console.error('POST /api/monitoring/server-telemetry error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;