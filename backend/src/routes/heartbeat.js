const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

// ============================================================
// POST /api/heartbeat
// Device kirim heartbeat via HTTP (fallback MQTT)
// ============================================================
router.post('/', async (req, res) => {
    try {
        const {
            device_id,
            status = 'online',
            timestamp,
            ip_address,
            rssi,
            uptime_seconds,
            firmware_version
        } = req.body;

        if (!device_id) {
            return res.status(400).json({
                success: false,
                error: 'device_id wajib diisi'
            });
        }

        // Cari asset
        const [assets] = await db.query(
            'SELECT asset_id, asset_code FROM assets WHERE asset_code = ?',
            [device_id]
        );

        if (assets.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'device_id tidak terdaftar'
            });
        }

        const asset = assets[0];
        const checkTime = timestamp || new Date();

        // Simpan log
        await db.query(
            `INSERT INTO monitoring_logs 
                (asset_id, check_time, status, method, source, response_time_ms, details)
             VALUES (?, ?, 'online', 'Heartbeat', 'device', 0, ?)`,
            [
                asset.asset_id,
                checkTime,
                JSON.stringify({
                    ip_address: ip_address || null,
                    rssi: rssi || null,
                    uptime_seconds: uptime_seconds || null,
                    firmware_version: firmware_version || null
                })
            ]
        );

        // Update asset
        await db.query(
            `UPDATE assets 
             SET current_status = 'online', last_seen = ?, updated_at = NOW()
             WHERE asset_id = ?`,
            [checkTime, asset.asset_id]
        );

        res.status(200).json({
            success: true,
            message: 'Heartbeat received',
            next_heartbeat_in: 30
        });
    } catch (err) {
        console.error('POST /api/heartbeat error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/heartbeat/:assetCode/latest
// Heartbeat terakhir
// ============================================================
router.get('/:assetCode/latest', authenticate, async (req, res) => {
    try {
        const { assetCode } = req.params;

        const [rows] = await db.query(`
            SELECT 
                a.asset_id, a.asset_code, a.asset_name, a.category,
                a.current_status, a.last_seen,
                ml.check_time, ml.details
            FROM assets a
            LEFT JOIN monitoring_logs ml ON ml.log_id = (
                SELECT log_id FROM monitoring_logs 
                WHERE asset_id = a.asset_id AND method = 'Heartbeat'
                ORDER BY check_time DESC LIMIT 1
            )
            WHERE a.asset_code = ?
        `, [assetCode]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        const data = rows[0];
        if (data.details) {
            try { data.details = JSON.parse(data.details); }
            catch (e) { /* biarkan string */ }
        }

        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('GET /api/heartbeat/:assetCode/latest error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;