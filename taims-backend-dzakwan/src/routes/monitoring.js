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
             SET current_status = 'online', last_seen = COALESCE(?, NOW()), offline_since = NULL, updated_at = NOW()
             WHERE asset_id = ?`,
            [checkTime || null, assetId]
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
             SET current_status = ?, last_seen = COALESCE(?, NOW()), updated_at = NOW()
             WHERE asset_id = ?`,
            [finalStatus, checkTime || null, assetId]
        );
    }

    return result.insertId;
}

// ============================================================
// ============================================================
// POST /api/monitoring/real-ping
// Real ICMP ping to physical device using child_process ping
// ============================================================
router.post('/real-ping', async (req, res) => {
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
        const pingArgs = process.platform === 'win32' ? ['-n', '1', '-w', '1000', ipClean] : ['-c', '1', '-W', '1', ipClean];
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

module.exports = router;