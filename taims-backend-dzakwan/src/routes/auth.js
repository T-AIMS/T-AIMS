const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();

// ============================================================
// BRUTE-FORCE & PROGRESSIVE LOCKOUT TRACKER (Per-IP & Per-Akun)
// ============================================================
const loginLockTracker = new Map();

function getLockEntry(key) {
    if (!loginLockTracker.has(key)) {
        loginLockTracker.set(key, { failedAttempts: 0, penaltyStage: 0, lockUntil: 0 });
    }
    return loginLockTracker.get(key);
}

function clearLoginLockout(userId) {
    if (userId) {
        loginLockTracker.delete(`uid_${userId}`);
    }
    // Bersihkan semua kunci IP yang sedang aktif bila Superadmin mereset user
    for (const [k, v] of loginLockTracker.entries()) {
        if (k.startsWith('ip_') || k.startsWith('raw_')) {
            loginLockTracker.delete(k);
        }
    }
}
router.clearLoginLockout = clearLoginLockout;

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email/Username dan password wajib diisi'
            });
        }

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local';
        const ipKey = `ip_${clientIp}`;
        const rawInput = String(email).trim().toLowerCase();

        // 1. Cari user berdasarkan email, username, atau full_name (Tanpa wildcard lama jika username sudah diubah)
        let [users] = await db.query(
            'SELECT user_id, full_name, username, email, role, password_hash FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? OR LOWER(full_name) = ? LIMIT 1',
            [rawInput, rawInput, rawInput]
        );

        if (users.length === 0 && (rawInput === 'admin@taims.local' || rawInput === 'admin')) {
            [users] = await db.query(
                "SELECT user_id, full_name, username, email, role, password_hash FROM users WHERE role = 'super_admin' LIMIT 1"
            );
        }

        const matchedUser = users.length > 0 ? users[0] : null;
        const accountKey = matchedUser ? `uid_${matchedUser.user_id}` : `raw_${rawInput}`;

        const ipState = getLockEntry(ipKey);
        const accState = getLockEntry(accountKey);
        const now = Date.now();

        // 2. Cek apakah perangkat/IP atau akun sedang dalam masa tunggu (Lockout)
        const activeLockUntil = Math.max(ipState.lockUntil || 0, accState.lockUntil || 0);
        if (activeLockUntil > now) {
            const remainingSeconds = Math.ceil((activeLockUntil - now) / 1000);
            const activeStage = Math.max(ipState.penaltyStage || 1, accState.penaltyStage || 1);
            const penaltyMinutes = Math.pow(2, activeStage - 1);
            return res.status(429).json({
                success: false,
                isLocked: true,
                remainingSeconds,
                penaltyMinutes,
                penaltyStage: activeStage,
                error: `Terlalu banyak percobaan gagal! Silakan tunggu ${remainingSeconds} detik (${penaltyMinutes} menit).`
            });
        }

        // Helper saat kredensial salah
        const handleFailedAttempt = () => {
            ipState.failedAttempts = (ipState.failedAttempts || 0) + 1;
            accState.failedAttempts = (accState.failedAttempts || 0) + 1;

            const currentFails = Math.max(ipState.failedAttempts, accState.failedAttempts);
            if (currentFails >= 3) {
                const nextStage = Math.max(ipState.penaltyStage || 0, accState.penaltyStage || 0) + 1;
                const penaltyMinutes = Math.pow(2, nextStage - 1); // 1 menit -> 2 menit -> 4 menit
                const durationSec = penaltyMinutes * 60;
                const lockUntilTs = Date.now() + (durationSec * 1000);

                ipState.failedAttempts = 0;
                ipState.penaltyStage = nextStage;
                ipState.lockUntil = lockUntilTs;

                accState.failedAttempts = 0;
                accState.penaltyStage = nextStage;
                accState.lockUntil = lockUntilTs;

                return res.status(429).json({
                    success: false,
                    isLocked: true,
                    remainingSeconds: durationSec,
                    penaltyMinutes,
                    penaltyStage: nextStage,
                    error: `Gagal login 3 kali! Akses dikunci selama ${penaltyMinutes} menit (${durationSec} detik).`
                });
            }

            const remainingAttempts = 3 - currentFails;
            return res.status(401).json({
                success: false,
                remainingAttempts,
                failedAttempts: currentFails,
                error: `Email/Username atau kata sandi salah! Sisa percobaan: ${remainingAttempts} kali lagi sebelum dikunci.`
            });
        };

        if (!matchedUser || !matchedUser.password_hash) {
            return handleFailedAttempt();
        }

        const isPasswordValid = await bcrypt.compare(password, matchedUser.password_hash);
        if (!isPasswordValid) {
            return handleFailedAttempt();
        }

        // 3. Login Berhasil -> Reset seluruh counter gagal & penalti
        loginLockTracker.delete(ipKey);
        loginLockTracker.delete(accountKey);

        const token = jwt.sign(
            { user_id: matchedUser.user_id, email: matchedUser.email, role: matchedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || '24h' }
        );

        res.status(200).json({
            success: true,
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
        res.status(500).json({ success: false, error: 'Internal server error' });
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

        res.status(200).json({ success: true, data: users[0] });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ==============================
// POST /api/auth/logout
// Blacklist token biar nggak bisa dipakai lagi
// ==============================
router.post('/logout', authenticate, async (req, res) => {
    try {
        const token = req.token;
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000); // exp JWT dalam detik

        // Simpan ke blacklist
        await db.query(
            `INSERT INTO token_blacklist (token, user_id, expires_at)
             VALUES (?, ?, ?)`,
            [token, req.user.user_id, expiresAt]
        );

        // Cleanup: hapus token yang sudah expired dari blacklist
        await db.query(
            'DELETE FROM token_blacklist WHERE expires_at < NOW()'
        );

        res.status(200).json({
            success: true,
            message: 'Logout berhasil. Token sudah di-revoke.'
        });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({
                success: false,
                error: 'Password lama dan baru wajib diisi'
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password baru minimal 6 karakter'
            });
        }

        const [users] = await db.query(
            'SELECT user_id, password_hash FROM users WHERE user_id = ?',
            [req.user.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User tidak ditemukan'
            });
        }

        const isValid = await bcrypt.compare(old_password, users[0].password_hash);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: 'Password lama salah'
            });
        }

        const newHash = await bcrypt.hash(new_password, 10);

        await db.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [newHash, req.user.user_id]
        );

        res.status(200).json({
            success: true,
            message: 'Password berhasil diubah'
        });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;