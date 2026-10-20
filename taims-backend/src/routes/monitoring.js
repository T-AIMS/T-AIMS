const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');

// ============================================================
// Helper: Simpan hasil monitoring & Auto-Warning
// ============================================================
async function saveMonitoringLog(assetId, status, method, responseTimeMs, details, checkTime) {
    let finalStatus = status;

    // Cast ke number biar aman kalau dari Postman ngirimnya string
    const rt = parseInt(responseTimeMs) || 0;
    const packetLoss = details && details.packet_loss ? parseFloat(details.packet_loss) : 0;
    const cpuLoad = details && details.cpu_load ? parseFloat(details.cpu_load) : 0;
    const memLoad = details && details.memory_used_percent ? parseFloat(details.memory_used_percent) : 0;

    // LOGIKA WARNING OTOMATIS
    if (status === 'online') {
        // 1. Kalau response time > 1000ms
        if (rt > 1000) {
            finalStatus = 'warning';
        }
        // 2. Kalau packet loss > 10% (khusus ping)
        if (packetLoss > 10) {
            finalStatus = 'warning';
        }
        // 3. Kalau CPU atau Memory > 90% (khusus SNMP)
        if (cpuLoad > 90 || memLoad > 90) {
            finalStatus = 'warning';
        }
    }

    // Insert log
    const [result] = await db.query(
        `INSERT INTO monitoring_logs 
            (asset_id, check_time, status, method, source, response_time_ms, details)
         VALUES (?, ?, ?, ?, 'monitoring_engine', ?, ?)`,
        [
            assetId,
            checkTime || new Date(),
            finalStatus, // pakai status yang udah dimodifikasi
            method,
            rt,
            JSON.stringify(details || {})
        ]
    );

    // Update asset
    await db.query(
        `UPDATE assets 
         SET current_status = ?, last_seen = ?, updated_at = NOW()
         WHERE asset_id = ?`,
        [finalStatus, checkTime || new Date(), assetId]
    );

    return result.insertId;
}

// ============================================================
// POST /api/monitoring/ping
// Auth: API Key
// ============================================================
router.post('/ping', apiKeyAuth, async (req, res) => {
    try {
        const { asset_id, status, response_time_ms, check_time, details } = req.body;

        if (!asset_id || !status || response_time_ms === undefined) {
            return res.status(400).json({ success: false, error: 'asset_id, status, response_time_ms wajib diisi' });
        }

        const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [asset_id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        const logId = await saveMonitoringLog(asset_id, status, 'Ping', response_time_ms, details, check_time);

        res.status(201).json({
            success: true,
            message: 'Monitoring log berhasil disimpan',
            data: { log_id: logId, calculated_status: status }
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
        const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [asset_id]);
        if (asset.length === 0) return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });

        const logId = await saveMonitoringLog(asset_id, status, 'HTTP', response_time_ms, details, check_time);
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
        const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [asset_id]);
        if (asset.length === 0) return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });

        const logId = await saveMonitoringLog(asset_id, status, 'TCP', response_time_ms, details, check_time);
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
        if (asset.length === 0) return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });

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
        if (asset.length === 0) return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });

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
        if (asset.length === 0) return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });

        const logId = await saveMonitoringLog(asset_id, status, 'MQTT', 0, details, check_time);
        res.status(201).json({ success: true, data: { log_id: logId } });
    } catch (err) {
        console.error('POST /api/monitoring/mqtt-health error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/monitoring/logs
// Auth: JWT
// ============================================================
router.get('/logs', authenticate, async (req, res) => {
    try {
        const { asset_id, status, method, source, from, to, limit = 100, page = 1 } = req.query;
        let sql = `
            SELECT ml.log_id, ml.asset_id, a.asset_code, a.asset_name,
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
        res.status(200).json({ success: true, total, page: parseInt(page), limit: parseInt(limit), data: rows });
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
            SELECT a.asset_id, a.asset_code, a.asset_name, a.category,
                a.current_status, a.last_seen,
                ml.response_time_ms AS last_response_time_ms,
                ml.method AS last_method, ml.check_time AS last_check_time
            FROM assets a
            LEFT JOIN monitoring_logs ml ON ml.log_id = (
                SELECT log_id FROM monitoring_logs 
                WHERE asset_id = a.asset_id 
                ORDER BY check_time DESC LIMIT 1
            )
            WHERE a.asset_id = ?
        `, [assetId]);

        if (rows.length === 0) return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
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
            data: { ...statusCount[0], by_category: categoryMap }
        });
    } catch (err) {
        console.error('GET /api/monitoring/summary error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;