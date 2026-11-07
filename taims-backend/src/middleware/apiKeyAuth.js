const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

function apiKeyAuth(req, res, next) {
    const rawApiKey = req.headers['x-api-key'] || req.headers['x-device-api-key'] || (req.query && req.query.api_key) || (req.body && req.body.api_key);
    const apiKey = rawApiKey ? String(rawApiKey).trim() : '';

    // 1. Jika dipanggil dari Web Dashboard menggunakan JWT Bearer Token (tanpa expose API Key di frontend)
    const authHeader = req.headers.authorization;
    if (!apiKey && authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                error: 'Token sesi tidak valid atau kedaluwarsa'
            });
        }
    }

    const validKey = (process.env.TAIMS_API_KEY || process.env.DEVICE_API_KEY) ? String(process.env.TAIMS_API_KEY || process.env.DEVICE_API_KEY).trim() : '';

    if (!validKey) {
        console.error("❌ CRITICAL: DEVICE_API_KEY belum di-set di file .env!");
        return res.status(500).json({ 
            success: false, 
            error: 'Konfigurasi server error (API Key tidak di-set)' 
        });
    }

    // 2. Cek header X-API-Key untuk IoT / Daemon Monitoring
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API Key atau Bearer Token tidak ditemukan.'
        });
    }

    // Cek API Key valid dengan timingSafeEqual (aman dari timing attack)
    const bufValid = Buffer.from(validKey);
    const bufIncoming = Buffer.from(apiKey);

    if (bufValid.length !== bufIncoming.length || !crypto.timingSafeEqual(bufValid, bufIncoming)) {
        return res.status(403).json({
            success: false,
            error: 'API Key tidak valid'
        });
    }

    next();
}

module.exports = { apiKeyAuth };
