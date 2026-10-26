const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, can } = require('../middleware/auth');

// ============================================================
// GET /api/maintenance
// List semua maintenance
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const { asset_id, status, from, to, limit = 100, page = 1 } = req.query;

        let sql = `
            SELECT 
                m.maintenance_id,
                m.asset_id,
                a.asset_code,
                a.asset_name,
                a.category,
                m.maintenance_type,
                m.scheduled_date,
                m.performed_at,
                m.description,
                m.maintenance_status,
                m.pic_name,
                m.created_at
            FROM maintenance m
            LEFT JOIN assets a ON m.asset_id = a.asset_id
            WHERE 1=1
        `;
        const params = [];

        if (asset_id) { sql += ' AND m.asset_id = ?'; params.push(asset_id); }
        if (status) { sql += ' AND m.maintenance_status = ?'; params.push(status); }
        if (from) { sql += ' AND m.scheduled_date >= ?'; params.push(from); }
        if (to) { sql += ' AND m.scheduled_date <= ?'; params.push(to); }

        // Hitung total
        const countSql = sql.replace(
            /SELECT[\s\S]*?FROM maintenance m/,
            'SELECT COUNT(*) AS total FROM maintenance m'
        );
        const [countResult] = await db.query(countSql, params);
        const total = countResult[0].total;

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' ORDER BY m.scheduled_date DESC LIMIT ? OFFSET ?';
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
        console.error('GET /api/maintenance error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/maintenance/:id
// Detail maintenance
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                m.*,
                a.asset_code,
                a.asset_name,
                a.category,
                l.location_name
            FROM maintenance m
            LEFT JOIN assets a ON m.asset_id = a.asset_id
            LEFT JOIN locations l ON a.location_id = l.location_id
            WHERE m.maintenance_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Maintenance tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('GET /api/maintenance/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/maintenance
// Tambah maintenance (admin, super_admin)
// ============================================================
router.post('/', authenticate, can('create'), async (req, res) => {
    try {
        const {
            asset_id,
            maintenance_type,
            scheduled_date,
            performed_at,
            description,
            pic_name,
            maintenance_status = 'scheduled'
        } = req.body;

        // Validasi
        if (!asset_id || !maintenance_type || !scheduled_date) {
            return res.status(400).json({
                success: false,
                error: 'asset_id, maintenance_type, scheduled_date wajib diisi'
            });
        }

        if (!['scheduled', 'in_progress', 'completed', 'cancelled'].includes(maintenance_status)) {
            return res.status(400).json({
                success: false,
                error: 'Status harus: scheduled, in_progress, completed, cancelled'
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
            `INSERT INTO maintenance 
                (asset_id, maintenance_type, scheduled_date, performed_at, description, maintenance_status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                asset_id,
                maintenance_type,
                scheduled_date,
                performed_at || null,
                description || null,
                maintenance_status
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Maintenance berhasil dibuat',
            data: { maintenance_id: result.insertId }
        });
    } catch (err) {
        console.error('POST /api/maintenance error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/maintenance/:id
// Update maintenance (admin, super_admin)
// ============================================================
router.put('/:id', authenticate, can('update'), async (req, res) => {
    try {
        const { id } = req.params;

        // Cek maintenance ada
        const [existing] = await db.query(
            'SELECT maintenance_id FROM maintenance WHERE maintenance_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Maintenance tidak ditemukan' });
        }

        // Field yang boleh diupdate
        const allowedFields = [
            'asset_id', 'maintenance_type', 'scheduled_date',
            'performed_at', 'description', 'maintenance_status'
        ];

        const updates = [];
        const params = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (field === 'maintenance_status' && !['scheduled', 'in_progress', 'completed', 'cancelled'].includes(req.body[field])) {
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
            `UPDATE maintenance SET ${updates.join(', ')} WHERE maintenance_id = ?`,
            params
        );

        res.status(200).json({ success: true, message: 'Maintenance berhasil diupdate' });
    } catch (err) {
        console.error('PUT /api/maintenance/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// DELETE /api/maintenance/:id
// Hapus maintenance (super_admin only)
// ============================================================
router.delete('/:id', authenticate, can('delete'), async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT maintenance_id FROM maintenance WHERE maintenance_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Maintenance tidak ditemukan' });
        }

        await db.query('DELETE FROM maintenance WHERE maintenance_id = ?', [id]);

        res.status(200).json({ success: true, message: 'Maintenance berhasil dihapus' });
    } catch (err) {
        console.error('DELETE /api/maintenance/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;