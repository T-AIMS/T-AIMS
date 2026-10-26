const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

function apiKeyAuth(req, res, next) {
    const validKey = process.env.DEVICE_API_KEY ? String(process.env.DEVICE_API_KEY).trim() : '';

    if (!validKey) {
        console.error("❌ CRITICAL: DEVICE_API_KEY belum di-set di file .env!");
        return res.status(500).json({ 
            success: false, 
            error: 'Konfigurasi server error (API Key tidak di-set)' 
        });
    }

    const rawApiKey = req.headers['x-api-key'] || req.headers['x-device-api-key'] || (req.query && req.query.api_key) || (req.body && req.body.api_key);
    const apiKey = rawApiKey ? String(rawApiKey).trim() : '';

    // Cek header ada
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API Key tidak ditemukan. Kirim header X-API-Key.'
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
