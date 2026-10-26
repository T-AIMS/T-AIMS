const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, can } = require('../middleware/auth');

// ============================================================
// GET /api/locations
// List semua lokasi
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                l.location_id,
                l.location_name,
                l.description,
                l.latitude,
                l.longitude,
                l.address,
                COUNT(a.asset_id) AS total_assets
            FROM locations l
            LEFT JOIN assets a ON a.location_id = l.location_id
            GROUP BY l.location_id
            ORDER BY l.location_id ASC
        `);

        res.status(200).json({
            success: true,
            total: rows.length,
            data: rows
        });
    } catch (err) {
        console.error('GET /api/locations error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/locations/:id
// Detail satu lokasi
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                l.location_id,
                l.location_name,
                l.description,
                l.latitude,
                l.longitude,
                l.address,
                COUNT(a.asset_id) AS total_assets
            FROM locations l
            LEFT JOIN assets a ON a.location_id = l.location_id
            WHERE l.location_id = ?
            GROUP BY l.location_id
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Location tidak ditemukan'
            });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('GET /api/locations/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/locations
// Tambah lokasi (admin, super_admin)
// ============================================================
router.post('/', authenticate, can('create'), async (req, res) => {
    try {
        const { location_name, description, latitude, longitude, address } = req.body;

        // Validasi
        if (!location_name) {
            return res.status(400).json({
                success: false,
                error: 'location_name wajib diisi'
            });
        }

        // Cek duplikat
        const [existing] = await db.query(
            'SELECT location_id FROM locations WHERE location_name = ?',
            [location_name]
        );
        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Location name sudah ada'
            });
        }

        // Insert
        const [result] = await db.query(
            'INSERT INTO locations (location_name, description, latitude, longitude, address) VALUES (?, ?, ?, ?, ?)',
            [location_name, description || null, (latitude === '' || latitude === undefined) ? null : latitude, (longitude === '' || longitude === undefined) ? null : longitude, address || null]
        );

        res.status(201).json({
            success: true,
            message: 'Location berhasil dibuat',
            data: {
                location_id: result.insertId,
                location_name
            }
        });
    } catch (err) {
        console.error('POST /api/locations error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/locations/:id
// Update lokasi (admin, super_admin)
// ============================================================
router.put('/:id', authenticate, can('update'), async (req, res) => {
    try {
        const { id } = req.params;
        const { location_name, description, latitude, longitude, address } = req.body;

        // Cek lokasi ada
        const [existing] = await db.query(
            'SELECT location_id FROM locations WHERE location_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Location tidak ditemukan'
            });
        }

        // Build update
        const updates = [];
        const params = [];

        if (location_name !== undefined) {
            updates.push('location_name = ?');
            params.push(location_name);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            params.push(description);
        }

        if (latitude !== undefined)  { updates.push('latitude = ?');  params.push(latitude === '' ? null : latitude); }
        if (longitude !== undefined) { updates.push('longitude = ?'); params.push(longitude === '' ? null : longitude); }
        if (address !== undefined)   { updates.push('address = ?');   params.push(address || null); }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tidak ada field yang diupdate'
            });
        }

        params.push(id);

        await db.query(
            `UPDATE locations SET ${updates.join(', ')} WHERE location_id = ?`,
            params
        );

        res.status(200).json({
            success: true,
            message: 'Location berhasil diupdate'
        });
    } catch (err) {
        console.error('PUT /api/locations/:id error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                error: 'Location name sudah ada'
            });
        }
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// DELETE /api/locations/:id
// Hapus lokasi (super_admin only)
// ============================================================
router.delete('/:id', authenticate, can('delete'), async (req, res) => {
    try {
        const { id } = req.params;

        // Cek lokasi ada
        const [existing] = await db.query(
            'SELECT location_id, location_name FROM locations WHERE location_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Location tidak ditemukan'
            });
        }

        // Cek apakah masih dipakai asset
        const [assets] = await db.query(
            'SELECT COUNT(*) AS total FROM assets WHERE location_id = ?',
            [id]
        );

        if (assets[0].total > 0) {
            return res.status(400).json({
                success: false,
                error: `Location tidak bisa dihapus. Masih dipakai oleh ${assets[0].total} asset.`
            });
        }

        // Hapus
        await db.query('DELETE FROM locations WHERE location_id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'Location berhasil dihapus'
        });
    } catch (err) {
        console.error('DELETE /api/locations/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;