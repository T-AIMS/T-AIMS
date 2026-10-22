const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const DEFAULT_DEVICE_API_KEY = 'taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1';

function apiKeyAuth(req, res, next) {
    const rawApiKey = req.headers['x-api-key'] || req.headers['x-device-api-key'] || (req.query && req.query.api_key) || (req.body && req.body.api_key);
    const apiKey = rawApiKey ? String(rawApiKey).trim() : '';
    const validKey = String(process.env.DEVICE_API_KEY || DEFAULT_DEVICE_API_KEY).trim();

    // Cek header ada
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API Key tidak ditemukan. Kirim header X-API-Key.'
        });
    }

    // Cek API Key valid (aman dari spasi, newline, atau string escape)
    if (apiKey !== validKey) {
        return res.status(403).json({
            success: false,
            error: 'API Key tidak valid'
        });
    }

    next();
}

module.exports = { apiKeyAuth };
