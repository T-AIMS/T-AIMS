const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

// Permission matrix per role
const PERMISSIONS = {
    super_admin: { create: true, read: true, update: true, delete: true },
    admin:       { create: true, read: true, update: true, delete: false },
    user:        { create: false, read: true, update: false, delete: false }
};

// ============================================================
// 1. Cek token valid + cek blacklist
// ============================================================
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Token tidak ditemukan. Silakan login.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Cek apakah token di-blacklist
        const [blacklisted] = await db.query(
            'SELECT id FROM token_blacklist WHERE token = ? LIMIT 1',
            [token]
        );

        if (blacklisted.length > 0) {
            return res.status(401).json({
                success: false,
                error: 'Token sudah di-logout. Silakan login ulang.'
            });
        }

        req.user = decoded; // { user_id, email, role }
        req.token = token;  // simpan token buat logout
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Token tidak valid atau expired'
        });
    }
}

// ============================================================
// 2. Cek role spesifik
// ============================================================
function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Belum login' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Role '${req.user.role}' tidak punya akses`
            });
        }
        next();
    };
}

// ============================================================
// 3. Cek permission per action
// ============================================================
function can(action) {
    return (req, res, next) => {
        const perm = PERMISSIONS[req.user.role];
        if (!perm || !perm[action]) {
            return res.status(403).json({
                success: false,
                error: `Role '${req.user.role}' tidak bisa ${action}`
            });
        }
        next();
    };
}

module.exports = { authenticate, authorize, can, PERMISSIONS };