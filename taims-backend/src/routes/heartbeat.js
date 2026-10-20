const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');

// ============================================================
// POST /api/heartbeat
// Device kirim heartbeat via HTTP (fallback MQTT)
// Auth: API Key (bukan JWT)
// ============================================================
router.post('/', apiKeyAuth, async (req, res) => {
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

        // Validasi status (case-insensitive & trim)
        const s = (status || '').toLowerCase().trim();
        const validStatuses = ['online', 'offline', 'unknown', 'maintenance'];
        const deviceStatus = validStatuses.includes(s) ? s : 'online';

        // Cari asset (toleran terhadap strip atau spasi, misal: SEC CCTV 01 -> SEC-CCTV-01)
        const targetCode = (device_id || '').trim();
        const normalizedCode = targetCode.replace(/\s+/g, '-');
        const [assets] = await db.query(
            'SELECT asset_id, asset_code FROM assets WHERE asset_code = ? OR asset_code = ? OR REPLACE(asset_code, "-", " ") = ?',
            [targetCode, normalizedCode, targetCode]
        );

        if (assets.length === 0) {
            return res.status(404).json({
                success: false,
                error: `device_id '${device_id}' tidak terdaftar di database (contoh: SEC-CCTV-01)`
            });
        }

        const asset = assets[0];

        // Simpan log
        await db.query(
            `INSERT INTO monitoring_logs 
                (asset_id, check_time, status, method, source, response_time_ms, details)
             VALUES (?, NOW(), ?, 'Heartbeat', 'device', 0, ?)`,
            [
                asset.asset_id,
                deviceStatus,
                JSON.stringify({
                    ip_address: ip_address || null,
                    rssi: rssi || null,
                    uptime_seconds: uptime_seconds || null,
                    firmware_version: firmware_version || null
                })
            ]
        );

        // Update asset: jika online maka bersihkan offline_since
        if (deviceStatus === 'online') {
            await db.query(
                `UPDATE assets 
                 SET current_status = 'online', last_seen = NOW(), offline_since = NULL, updated_at = NOW()
                 WHERE asset_id = ?`,
                [asset.asset_id]
            );

            // Selesaikan insiden terbuka jika sebelumnya ada insiden offline
            await db.query(
                `UPDATE incidents 
                 SET incident_status = 'resolved'
                 WHERE asset_id = ? 
                   AND incident_type = 'Device Offline' 
                   AND incident_status IN ('open', 'investigating')`,
                [asset.asset_id]
            );
        } else if (deviceStatus === 'offline') {
            await db.query(
                `UPDATE assets 
                 SET current_status = 'offline', last_seen = NOW(), offline_since = COALESCE(offline_since, NOW()), updated_at = NOW()
                 WHERE asset_id = ?`,
                [asset.asset_id]
            );
        } else {
            await db.query(
                `UPDATE assets 
                 SET current_status = ?, last_seen = NOW(), updated_at = NOW()
                 WHERE asset_id = ?`,
                [deviceStatus, asset.asset_id]
            );
        }

        res.status(200).json({
            success: true,
            message: 'Heartbeat received',
            status: deviceStatus,
            next_heartbeat_in: 30
        });
    } catch (err) {
        console.error('POST /api/heartbeat error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/heartbeat/:assetCode/latest
// Auth: JWT (user login via web)
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