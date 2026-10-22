const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, can } = require('../middleware/auth');

// ============================================================
// GET /api/assets
// List semua aset dengan filter, search, pagination
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const {
            category,
            location_id,
            status,
            monitoring_method,
            priority,
            search,
            page = 1,
            limit = 20
        } = req.query;

        let sql = `
            SELECT 
                a.asset_id, a.asset_code, a.asset_name, a.category,
                a.ip_address, a.mac_address,
                a.location_id, l.location_name,
                a.pic_user_id, u.full_name AS pic_name,
                a.monitoring_method, a.monitoring_config,
                a.current_status, a.priority, a.last_seen,
                a.installation_date, a.description,
                a.check_interval_seconds, a.timeout_seconds, a.retry_count,
                a.created_at, a.updated_at
            FROM assets a
            LEFT JOIN locations l ON a.location_id = l.location_id
            LEFT JOIN users u ON a.pic_user_id = u.user_id
            WHERE 1=1
        `;
        const params = [];

        if (category) { sql += ' AND a.category = ?'; params.push(category); }
        if (location_id) { sql += ' AND a.location_id = ?'; params.push(location_id); }
        if (status) { sql += ' AND a.current_status = ?'; params.push(status); }
        if (monitoring_method) { sql += ' AND a.monitoring_method = ?'; params.push(monitoring_method); }
        if (priority) { sql += ' AND a.priority = ?'; params.push(priority); }
        if (search) {
            sql += ' AND (a.asset_code LIKE ? OR a.asset_name LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        // Hitung total
        const countSql = sql.replace(
            /SELECT[\s\S]*?FROM assets a/,
            'SELECT COUNT(*) AS total FROM assets a'
        );
        const [countResult] = await db.query(countSql, params);
        const total = countResult[0].total;

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' ORDER BY a.asset_id ASC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await db.query(sql, params);

        const data = rows.map(row => ({
            ...row,
            monitoring_config: row.monitoring_config
                ? JSON.parse(row.monitoring_config)
                : null
        }));

        res.status(200).json({
            success: true,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            data
        });

    } catch (err) {
        console.error('GET /api/assets error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/assets/by-category
// Ringkasan per kategori
// ============================================================
router.get('/by-category', authenticate, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT category, COUNT(*) AS count
            FROM assets
            GROUP BY category
            ORDER BY category ASC
        `);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('GET /api/assets/by-category error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/assets/:id
// Detail satu aset
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                a.*,
                l.location_name,
                u.full_name AS pic_name
            FROM assets a
            LEFT JOIN locations l ON a.location_id = l.location_id
            LEFT JOIN users u ON a.pic_user_id = u.user_id
            WHERE a.asset_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        const asset = rows[0];
        if (asset.monitoring_config) {
            try { asset.monitoring_config = JSON.parse(asset.monitoring_config); }
            catch (e) { /* biarkan string */ }
        }

        res.status(200).json({ success: true, data: asset });
    } catch (err) {
        console.error('GET /api/assets/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/assets/:id/history
// History monitoring aset
// ============================================================
router.get('/:id/history', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { from, to, limit = 100 } = req.query;

        // Cek asset ada
        const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [id]);
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        let sql = `
            SELECT log_id, asset_id, check_time, status, method, source,
                   response_time_ms, details, created_at
            FROM monitoring_logs
            WHERE asset_id = ?
        `;
        const params = [id];

        if (from) { sql += ' AND check_time >= ?'; params.push(from); }
        if (to) { sql += ' AND check_time <= ?'; params.push(to); }

        sql += ' ORDER BY check_time DESC LIMIT ?';
        params.push(parseInt(limit));

        const [rows] = await db.query(sql, params);

        res.status(200).json({
            success: true,
            total: rows.length,
            data: rows
        });
    } catch (err) {
        console.error('GET /api/assets/:id/history error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/assets
// Tambah aset baru (admin, super_admin)
// ============================================================
router.post('/', authenticate, can('create'), async (req, res) => {
    try {
        const {
            asset_code, asset_name, category,
            ip_address, mac_address, location_id, pic_user_id,
            monitoring_method, monitoring_config,
            priority = 2, installation_date, description,
            check_interval_seconds = 60,
            timeout_seconds = 5,
            retry_count = 3
        } = req.body;

        // Validasi field wajib
        if (!asset_code || !asset_name || !category || !monitoring_method) {
            return res.status(400).json({
                success: false,
                error: 'asset_code, asset_name, category, monitoring_method wajib diisi'
            });
        }

        // Cek duplikat asset_code
        const [existing] = await db.query(
            'SELECT asset_id FROM assets WHERE asset_code = ?', [asset_code]
        );
        if (existing.length > 0) {
            return res.status(409).json({ success: false, error: 'Asset code sudah ada' });
        }

        // Cek duplikat ip_address (Kaidah Subnet Korporat & Anti-IP Conflict)
        if (ip_address) {
            const [existingIp] = await db.query(
                'SELECT asset_id, asset_code FROM assets WHERE ip_address = ?', [ip_address]
            );
            if (existingIp.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: `Alamat IP ${ip_address} sudah digunakan oleh perangkat ${existingIp[0].asset_code}. Alamat IP harus unik.`
                });
            }
        }

        // Insert
        const [result] = await db.query(
            `INSERT INTO assets 
                (asset_code, asset_name, category, ip_address, mac_address,
                 location_id, pic_user_id, monitoring_method, monitoring_config,
                 current_status, priority, installation_date, description,
                 check_interval_seconds, timeout_seconds, retry_count)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'unknown', ?, ?, ?, ?, ?, ?)`,
            [
                asset_code, asset_name, category,
                ip_address || null, mac_address || null,
                location_id || null, pic_user_id || null,
                monitoring_method,
                monitoring_config ? JSON.stringify(monitoring_config) : null,
                priority, installation_date || null, description || null,
                check_interval_seconds, timeout_seconds, retry_count
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Asset berhasil dibuat',
            data: { asset_id: result.insertId, asset_code }
        });

    } catch (err) {
        console.error('POST /api/assets error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/assets/:id
// Update aset (admin, super_admin)
// ============================================================
router.put('/:id', authenticate, can('update'), async (req, res) => {
    try {
        const { id } = req.params;

        // Cek asset ada (toleran pencarian berdasarkan asset_id numerik maupun asset_code unik)
        const [existing] = await db.query(
            'SELECT asset_id, asset_code FROM assets WHERE asset_id = ? OR asset_code = ? LIMIT 1', [id, id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }
        const targetAssetId = existing[0].asset_id;

        // Validasi duplikat ip_address pada update
        if (req.body.ip_address) {
            const [existingIp] = await db.query(
                'SELECT asset_id, asset_code FROM assets WHERE ip_address = ? AND asset_id != ?', [req.body.ip_address, targetAssetId]
            );
            if (existingIp.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: `Alamat IP ${req.body.ip_address} sudah digunakan oleh perangkat ${existingIp[0].asset_code}. Alamat IP harus unik.`
                });
            }
        }

        // Validasi duplikat asset_code (kode unik) pada update
        if (req.body.asset_code) {
            const [existingCode] = await db.query(
                'SELECT asset_id, asset_code FROM assets WHERE asset_code = ? AND asset_id != ?', [req.body.asset_code, targetAssetId]
            );
            if (existingCode.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: `Kode unik aset '${req.body.asset_code}' sudah terdaftar pada aset lain (${existingCode[0].asset_code}). Kode aset harus unik.`
                });
            }
        }

        // Field yang boleh diupdate
        const allowedFields = [
            'asset_code', 'asset_name', 'category', 'ip_address', 'mac_address',
            'location_id', 'pic_user_id', 'monitoring_method', 'monitoring_config',
            'current_status', 'priority', 'installation_date', 'description',
            'check_interval_seconds', 'timeout_seconds', 'retry_count'
        ];

        let statusChangedTo = null;
        const updates = [];
        const params = [];
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                let value = req.body[field];
                if (field === 'monitoring_config' && typeof value === 'object') {
                    value = JSON.stringify(value);
                }
                if (field === 'current_status' && typeof value === 'string') {
                    value = value.toLowerCase().trim();
                    statusChangedTo = value;
                }
                updates.push(`${field} = ?`);
                params.push(value);
            }
        }

        if (statusChangedTo === 'online') {
            updates.push('last_seen = NOW()', 'offline_since = NULL');
        } else if (statusChangedTo === 'offline') {
            updates.push('offline_since = COALESCE(offline_since, NOW())');
        } else if (statusChangedTo === 'unknown') {
            updates.push('offline_since = NULL');
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tidak ada field yang diupdate'
            });
        }

        params.push(targetAssetId);

        await db.query(
            `UPDATE assets SET ${updates.join(', ')}, updated_at = NOW() WHERE asset_id = ?`,
            params
        );

        if (statusChangedTo === 'online') {
            await db.query(
                `UPDATE incidents 
                 SET incident_status = 'resolved'
                 WHERE asset_id = ? 
                   AND incident_type = 'Device Offline' 
                   AND incident_status IN ('open', 'investigating')`,
                [targetAssetId]
            );
        }

        res.status(200).json({
            success: true,
            message: 'Asset berhasil diupdate',
            data: {
                asset_id: targetAssetId,
                asset_code: req.body.asset_code || existing[0].asset_code
            }
        });

    } catch (err) {
        console.error('PUT /api/assets/:id error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, error: 'Asset code atau IP sudah ada di database' });
        }
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// DELETE /api/assets/:id
// Hapus aset (super_admin only)
// ============================================================
router.delete('/:id', authenticate, can('delete'), async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT asset_id, asset_code FROM assets WHERE asset_id = ?', [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        // Bersihkan data terkait sebelum menghapus aset (cascade cleanup)
        await db.query('DELETE FROM monitoring_logs WHERE asset_id = ?', [id]);
        await db.query('DELETE FROM incidents WHERE asset_id = ?', [id]);
        await db.query('DELETE FROM notifications WHERE asset_id = ?', [id]);
        await db.query('DELETE FROM maintenance WHERE asset_id = ?', [id]);

        // Hapus aset utama
        await db.query('DELETE FROM assets WHERE asset_id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Asset berhasil dihapus'
        });

    } catch (err) {
        console.error('DELETE /api/assets/:id error:', err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                success: false,
                error: 'Asset tidak bisa dihapus karena masih dipakai di tabel lain'
            });
        }
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;