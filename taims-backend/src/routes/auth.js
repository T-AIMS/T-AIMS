const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();

// Reset Lockout Endpoint (Kompatibilitas)
router.post('/reset-lockout', (req, res) => {
    return res.json({ success: true, message: 'Status login normal.' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const rawEmail = req.body.email || req.body.username || req.body.identifier;
        const password = req.body.password;

        if (!rawEmail || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email/Username dan password wajib diisi'
            });
        }

        const rawInput = String(rawEmail).trim().toLowerCase();

        // Cari user berdasarkan email, username, atau full_name
        let [users] = await db.query(
            'SELECT user_id, full_name, username, email, role, password_hash FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? OR LOWER(full_name) = ? LIMIT 1',
            [rawInput, rawInput, rawInput]
        );

        if (users.length === 0 && (rawInput === 'admin@taims.id' || rawInput === 'admin')) {
            [users] = await db.query(
                "SELECT user_id, full_name, username, email, role, password_hash FROM users WHERE role = 'super_admin' LIMIT 1"
            );
        }

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Email atau username tidak ditemukan'
            });
        }

        const matchedUser = users[0];
        if (!matchedUser.password_hash) {
            return res.status(401).json({
                success: false,
                error: 'Password belum di-set untuk user ini'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, matchedUser.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Kata sandi salah. Silakan coba lagi.'
            });
        }

        const token = jwt.sign(
            { user_id: matchedUser.user_id, email: matchedUser.email, role: matchedUser.role },
            process.env.JWT_SECRET || 'taims_jwt_production_secure_token_2026',
            { expiresIn: process.env.JWT_EXPIRES || '24h' }
        );

        return res.json({
            success: true,
            message: 'Login berhasil',
            data: {
                token,
                expires_in: 86400,
                user: {
                    user_id: matchedUser.user_id,
                    full_name: matchedUser.full_name,
                    username: matchedUser.username || matchedUser.email.split('@')[0],
                    email: matchedUser.email,
                    role: matchedUser.role
                }
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, full_name, email, role FROM users WHERE user_id = ?',
            [req.user.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
        }

        res.json({ success: true, data: users[0] });
    } catch (err) {
        console.error('Get me error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/auth/logout
router.post('/logout', authenticate, (req, res) => {
    res.status(200).json({ success: true, message: 'Logout berhasil' });
});

module.exports = router;
