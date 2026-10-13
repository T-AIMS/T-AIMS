const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { authenticate, can } = require('../middleware/auth');

// ============================================================
// GET /api/users
// List semua user (admin, super_admin)
// ============================================================
router.get('/', authenticate, can('read'), async (req, res) => {
    try {
        const { role, search } = req.query;

        let sql = `
            SELECT user_id, full_name, email, role, created_at
            FROM users
            WHERE 1=1
        `;
        const params = [];

        if (role) {
            sql += ' AND role = ?';
            params.push(role);
        }
        if (search) {
            sql += ' AND (full_name LIKE ? OR email LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        sql += ' ORDER BY user_id ASC';

        const [rows] = await db.query(sql, params);

        res.status(200).json({
            success: true,
            total: rows.length,
            data: rows
        });
    } catch (err) {
        console.error('GET /api/users error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/users/:id
// Detail user (admin, super_admin)
// ============================================================
router.get('/:id', authenticate, can('read'), async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(
            'SELECT user_id, full_name, email, role, created_at FROM users WHERE user_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('GET /api/users/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/users
// Tambah user (admin, super_admin)
// ============================================================
router.post('/', authenticate, can('create'), async (req, res) => {
    try {
        const { full_name, email, password, role = 'user' } = req.body;

        // Validasi
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'full_name, email, password wajib diisi'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password minimal 6 karakter'
            });
        }

        if (!['super_admin', 'admin', 'user'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Role harus salah satu dari: super_admin, admin, user'
            });
        }

        // Cek duplikat email
        const [existing] = await db.query(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(409).json({ success: false, error: 'Email sudah terdaftar' });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Insert
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
            [full_name, email, password_hash, role]
        );

        res.status(201).json({
            success: true,
            message: 'User berhasil dibuat',
            data: {
                user_id: result.insertId,
                full_name,
                email,
                role
            }
        });
    } catch (err) {
        console.error('POST /api/users error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/users/:id
// Update user (admin, super_admin)
// ============================================================
router.put('/:id', authenticate, can('update'), async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email } = req.body;

        // Cek user ada
        const [existing] = await db.query(
            'SELECT user_id FROM users WHERE user_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
        }

        // Build update
        const updates = [];
        const params = [];

        if (full_name !== undefined) {
            updates.push('full_name = ?');
            params.push(full_name);
        }
        if (email !== undefined) {
            updates.push('email = ?');
            params.push(email);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tidak ada field yang diupdate'
            });
        }

        params.push(id);

        await db.query(
            `UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`,
            params
        );

        res.status(200).json({
            success: true,
            message: 'User berhasil diupdate'
        });
    } catch (err) {
        console.error('PUT /api/users/:id error:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, error: 'Email sudah terdaftar' });
        }
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// DELETE /api/users/:id
// Hapus user (super_admin only)
// ============================================================
router.delete('/:id', authenticate, can('delete'), async (req, res) => {
    try {
        const { id } = req.params;

        // Cek user ada
        const [existing] = await db.query(
            'SELECT user_id, role FROM users WHERE user_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
        }

        // Tidak bisa hapus diri sendiri
        if (parseInt(id) === req.user.user_id) {
            return res.status(403).json({
                success: false,
                error: 'Tidak bisa menghapus diri sendiri'
            });
        }

        // Tidak bisa hapus super_admin terakhir
        if (existing[0].role === 'super_admin') {
            const [superAdmins] = await db.query(
                "SELECT COUNT(*) AS total FROM users WHERE role = 'super_admin'"
            );
            if (superAdmins[0].total <= 1) {
                return res.status(403).json({
                    success: false,
                    error: 'Tidak bisa menghapus super_admin terakhir'
                });
            }
        }

        // Cek apakah user masih jadi PIC asset
        const [assets] = await db.query(
            'SELECT COUNT(*) AS total FROM assets WHERE pic_user_id = ?',
            [id]
        );
        if (assets[0].total > 0) {
            return res.status(400).json({
                success: false,
                error: `User tidak bisa dihapus. Masih jadi PIC ${assets[0].total} asset.`
            });
        }

        // Hapus
        await db.query('DELETE FROM users WHERE user_id = ?', [id]);

        res.status(200).json({
            success: true,
            message: 'User berhasil dihapus'
        });
    } catch (err) {
        console.error('DELETE /api/users/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/users/:id/role
// Ubah role user (super_admin only)
// ============================================================
router.put('/:id/role', authenticate, can('update'), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validasi role
        if (!role || !['super_admin', 'admin', 'user'].includes(role)) {
            return res.status(400).json({
                success: false,
                error: 'Role harus salah satu dari: super_admin, admin, user'
            });
        }

        // Cek user ada
        const [existing] = await db.query(
            'SELECT user_id, role FROM users WHERE user_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
        }

        // Nggak bisa ubah role diri sendiri
        if (parseInt(id) === req.user.user_id) {
            return res.status(403).json({
                success: false,
                error: 'Tidak bisa mengubah role diri sendiri'
            });
        }

        // Update role
        await db.query('UPDATE users SET role = ? WHERE user_id = ?', [role, id]);

        res.status(200).json({
            success: true,
            message: `Role berhasil diubah menjadi '${role}'`
        });
    } catch (err) {
        console.error('PUT /api/users/:id/role error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;