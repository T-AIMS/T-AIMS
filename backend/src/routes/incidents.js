const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, can } = require('../middleware/auth');

// ============================================================
// GET /api/incidents
// List semua insiden dengan filter
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const { asset_id, status, severity, from, to, limit = 100, page = 1 } = req.query;

        let sql = `
            SELECT 
                i.incident_id,
                i.asset_id,
                a.asset_code,
                a.asset_name,
                a.category,
                i.detected_at,
                i.incident_type,
                i.description,
                i.severity,
                i.incident_status
            FROM incidents i
            LEFT JOIN assets a ON i.asset_id = a.asset_id
            WHERE 1=1
        `;
        const params = [];

        if (asset_id) { sql += ' AND i.asset_id = ?'; params.push(asset_id); }
        if (status) { sql += ' AND i.incident_status = ?'; params.push(status); }
        if (severity) { sql += ' AND i.severity = ?'; params.push(severity); }
        if (from) { sql += ' AND i.detected_at >= ?'; params.push(from); }
        if (to) { sql += ' AND i.detected_at <= ?'; params.push(to); }

        // Hitung total
        const countSql = sql.replace(
            /SELECT[\s\S]*?FROM incidents i/,
            'SELECT COUNT(*) AS total FROM incidents i'
        );
        const [countResult] = await db.query(countSql, params);
        const total = countResult[0].total;

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' ORDER BY i.detected_at DESC LIMIT ? OFFSET ?';
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
        console.error('GET /api/incidents error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/incidents/:id
// Detail insiden
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                i.*,
                a.asset_code,
                a.asset_name,
                a.category,
                l.location_name
            FROM incidents i
            LEFT JOIN assets a ON i.asset_id = a.asset_id
            LEFT JOIN locations l ON a.location_id = l.location_id
            WHERE i.incident_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Incident tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('GET /api/incidents/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/incidents
// Tambah insiden (admin, super_admin)
// ============================================================
router.post('/', authenticate, can('create'), async (req, res) => {
    try {
        const {
            asset_id,
            detected_at,
            incident_type,
            description,
            severity = 'medium',
            incident_status = 'open'
        } = req.body;

        // Validasi
        if (!asset_id || !incident_type) {
            return res.status(400).json({
                success: false,
                error: 'asset_id dan incident_type wajib diisi'
            });
        }

        if (!['low', 'medium', 'high', 'critical'].includes(severity)) {
            return res.status(400).json({
                success: false,
                error: 'Severity harus: low, medium, high, critical'
            });
        }

        if (!['open', 'investigating', 'resolved', 'closed'].includes(incident_status)) {
            return res.status(400).json({
                success: false,
                error: 'Status harus: open, investigating, resolved, closed'
            });
        }

        // Cek asset ada
        const [asset] = await db.query(
            'SELECT asset_id FROM assets WHERE asset_id = ?',
            [asset_id]
        );
        if (asset.length === 0) {
            return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
        }

        // Insert
        const [result] = await db.query(
            `INSERT INTO incidents 
                (asset_id, detected_at, incident_type, description, severity, incident_status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                asset_id,
                detected_at || new Date(),
                incident_type,
                description || null,
                severity,
                incident_status
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Incident berhasil dibuat',
            data: { incident_id: result.insertId }
        });
    } catch (err) {
        console.error('POST /api/incidents error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/incidents/:id
// Update insiden (admin, super_admin)
// ============================================================
router.put('/:id', authenticate, can('update'), async (req, res) => {
    try {
        const { id } = req.params;

        // Cek insiden ada
        const [existing] = await db.query(
            'SELECT incident_id FROM incidents WHERE incident_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Incident tidak ditemukan' });
        }

        // Field yang boleh diupdate
        const allowedFields = [
            'asset_id', 'detected_at', 'incident_type',
            'description', 'severity', 'incident_status'
        ];

        const updates = [];
        const params = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                // Validasi ENUM
                if (field === 'severity' && !['low', 'medium', 'high', 'critical'].includes(req.body[field])) {
                    return res.status(400).json({ success: false, error: 'Severity invalid' });
                }
                if (field === 'incident_status' && !['open', 'investigating', 'resolved', 'closed'].includes(req.body[field])) {
                    return res.status(400).json({ success: false, error: 'Status invalid' });
                }
                updates.push(`${field} = ?`);
                params.push(req.body[field]);
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, error: 'Tidak ada field yang diupdate' });
        }

        params.push(id);

        await db.query(
            `UPDATE incidents SET ${updates.join(', ')} WHERE incident_id = ?`,
            params
        );

        res.status(200).json({ success: true, message: 'Incident berhasil diupdate' });
    } catch (err) {
        console.error('PUT /api/incidents/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// DELETE /api/incidents/:id
// Hapus insiden (super_admin only)
// ============================================================
router.delete('/:id', authenticate, can('delete'), async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT incident_id FROM incidents WHERE incident_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Incident tidak ditemukan' });
        }

        await db.query('DELETE FROM incidents WHERE incident_id = ?', [id]);

        res.status(200).json({ success: true, message: 'Incident berhasil dihapus' });
    } catch (err) {
        console.error('DELETE /api/incidents/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;