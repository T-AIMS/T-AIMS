const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, can } = require('../middleware/auth');

// ============================================================
// GET /api/notifications
// List notifikasi (filter per user)
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const { user_id, asset_id, is_read, limit = 50, page = 1 } = req.query;

        let sql = `
            SELECT 
                n.notification_id,
                n.user_id,
                u.full_name AS user_name,
                n.asset_id,
                a.asset_code,
                a.asset_name,
                n.title,
                n.message,
                n.is_read,
                n.created_at
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.user_id
            LEFT JOIN assets a ON n.asset_id = a.asset_id
            WHERE 1=1
        `;
        const params = [];

        // Kalau user biasa, cuma lihat notif miliknya
        if (req.user.role === 'user') {
            sql += ' AND n.user_id = ?';
            params.push(req.user.user_id);
        } else if (user_id) {
            sql += ' AND n.user_id = ?';
            params.push(user_id);
        }

        if (asset_id) { sql += ' AND n.asset_id = ?'; params.push(asset_id); }
        if (is_read !== undefined) { sql += ' AND n.is_read = ?'; params.push(is_read === 'true' ? 1 : 0); }

        // Hitung total
        const countSql = sql.replace(
            /SELECT[\s\S]*?FROM notifications n/,
            'SELECT COUNT(*) AS total FROM notifications n'
        );
        const [countResult] = await db.query(countSql, params);
        const total = countResult[0].total;

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await db.query(sql, params);

        // Hitung unread count
        const [unreadCount] = await db.query(
            'SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = 0',
            [req.user.user_id]
        );

        res.status(200).json({
            success: true,
            total,
            unread: unreadCount[0].unread,
            page: parseInt(page),
            limit: parseInt(limit),
            data: rows
        });
    } catch (err) {
        console.error('GET /api/notifications error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/notifications/:id
// Detail notifikasi
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                n.*,
                u.full_name AS user_name,
                a.asset_code,
                a.asset_name
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.user_id
            LEFT JOIN assets a ON n.asset_id = a.asset_id
            WHERE n.notification_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Notification tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('GET /api/notifications/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/notifications
// Buat notifikasi (admin, super_admin)
// ============================================================
router.post('/', authenticate, can('create'), async (req, res) => {
    try {
        const { user_id, asset_id, title, message } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'title wajib diisi'
            });
        }

        // Cek user (kalau ada)
        if (user_id) {
            const [user] = await db.query('SELECT user_id FROM users WHERE user_id = ?', [user_id]);
            if (user.length === 0) {
                return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
            }
        }

        // Cek asset (kalau ada)
        if (asset_id) {
            const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [asset_id]);
            if (asset.length === 0) {
                return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
            }
        }

        const [result] = await db.query(
            `INSERT INTO notifications (user_id, asset_id, title, message, is_read)
             VALUES (?, ?, ?, ?, 0)`,
            [user_id || null, asset_id || null, title, message || null]
        );

        res.status(201).json({
            success: true,
            message: 'Notification berhasil dibuat',
            data: { notification_id: result.insertId }
        });
    } catch (err) {
        console.error('POST /api/notifications error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/notifications/:id/read
// Mark as read
// ============================================================
router.put('/:id/read', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT notification_id, user_id FROM notifications WHERE notification_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Notification tidak ditemukan' });
        }

        await db.query('UPDATE notifications SET is_read = 1 WHERE notification_id = ?', [id]);

        res.status(200).json({ success: true, message: 'Notification ditandai sudah dibaca' });
    } catch (err) {
        console.error('PUT /api/notifications/:id/read error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/notifications/read-all
// Mark semua notifikasi sebagai read (untuk user yang login)
// ============================================================
router.put('/read-all/mark', authenticate, async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
            [req.user.user_id]
        );

        res.status(200).json({
            success: true,
            message: `${result.affectedRows} notifikasi ditandai sudah dibaca`
        });
    } catch (err) {
        console.error('PUT /api/notifications/read-all error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// DELETE /api/notifications/:id
// Hapus notifikasi (super_admin only)
// ============================================================
router.delete('/:id', authenticate, can('delete'), async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT notification_id FROM notifications WHERE notification_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Notification tidak ditemukan' });
        }

        await db.query('DELETE FROM notifications WHERE notification_id = ?', [id]);

        res.status(200).json({ success: true, message: 'Notification berhasil dihapus' });
    } catch (err) {
        console.error('DELETE /api/notifications/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;