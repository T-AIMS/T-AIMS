const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const PERMISSIONS = {
    super_admin: { create: true, read: true, update: true, delete: true },
    admin:       { create: true, read: true, update: true, delete: false },
    user:        { create: false, read: true, update: false, delete: false }
};

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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Periksa apakah token ada di blacklist (logout)
        const [blacklisted] = await db.query('SELECT id FROM token_blacklist WHERE token = ?', [token]);
        if (blacklisted.length > 0) {
            return res.status(401).json({ success: false, error: 'Token sudah logout / tidak valid' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Token tidak valid atau expired'
        });
    }
}

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