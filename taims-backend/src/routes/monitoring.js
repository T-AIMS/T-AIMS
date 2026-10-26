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

            const status = isOnline ? 'online' : 'offline';

            if (asset_id) {
                try {
                    await saveMonitoringLog(
                        asset_id,
                        status,
                        'Ping',
                        latencyMs,
                        {
                            packet_loss: isOnline ? 0 : 100,
                            source: 'Manual Real ICMP Ping',
                            tested_ip: ipClean
                        }
                    );
                } catch (dbErr) {
                    console.warn('DB Log real-ping error:', dbErr.message);
                }
            }

            return res.json({
                success: true,
                status: status,
                is_online: isOnline,
                latency_ms: latencyMs,
                ip: ipClean,
                message: isOnline
                    ? `Perangkat ${ipClean} merespons dalam ${latencyMs} ms (Online).`
                    : `Request timed out. Perangkat ${ipClean} tidak terhubung ke jaringan (Offline).`
            });
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
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
// Resource monitoring host server (CPU, RAM, Disks, Uptime)
router.get('/server-metrics', authenticate, async (req, res) => {
    try {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memPercent = +((usedMem / totalMem) * 100).toFixed(1);

        const cpus = os.cpus();
        const cpuModel = cpus && cpus.length ? cpus[0].model.trim() : 'Generic CPU';
        const cpuCores = cpus ? cpus.length : 1;
        const cpuSpeed = cpus && cpus.length ? cpus[0].speed : 0;

        const drives = process.platform === 'win32' ? ['C:\\', 'D:\\'] : ['/'];
        const disks = [];
        for (const d of drives) {
            try {
                const stats = fs.statfsSync(d);
                const total = stats.bsize * stats.blocks;
                const free = stats.bsize * stats.bfree;
                const used = total - free;
                disks.push({
                    drive: d.replace('\\', ''),
                    total_gb: +(total / (1024 ** 3)).toFixed(1),
                    used_gb: +(used / (1024 ** 3)).toFixed(1),
                    free_gb: +(free / (1024 ** 3)).toFixed(1),
                    usage_percent: +((used / total) * 100).toFixed(1)
                });
            } catch (e) {}
        }

        const uptimeSec = Math.floor(os.uptime());

        res.status(200).json({
            success: true,
            data: {
                cpu: {
                    usage_percent: currentCpuPercent,
                    model: cpuModel,
                    cores: cpuCores,
                    speed_mhz: cpuSpeed
                },
                memory: {
                    total_gb: +(totalMem / (1024 ** 3)).toFixed(2),
                    used_gb: +(usedMem / (1024 ** 3)).toFixed(2),
                    free_gb: +(freeMem / (1024 ** 3)).toFixed(2),
                    usage_percent: memPercent
                },
                disks: disks,
                system: {
                    platform: process.platform === 'win32' ? `Windows (${os.release()})` : `${os.type()} ${os.release()}`,
                    hostname: os.hostname(),
                    arch: os.arch(),
                    uptime_seconds: uptimeSec,
                    uptime_formatted: formatUptime(uptimeSec),
                    node_version: process.version,
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