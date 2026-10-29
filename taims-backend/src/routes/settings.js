const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');

const SETTINGS_FILE = path.join(__dirname, '../config/system_settings.json');

const DEFAULT_SETTINGS = {
    pollInterval: 10,
    pingTimeout: 1500,
    maxRetries: 3,
    tempThreshold: 22,
    heartbeatTimeout: 60,
    timezone: 'Asia/Jakarta (WIB - UTC+7)',
    telegramToken: '8944593836:AAEP2bDCO53srpWR3gdKXY6CHQ13Ni8OtPA',
    telegramChat: '',
    n8nUrl: 'http://192.168.1.49:5678/webhook/taims-alert',
    debounceTimer: 5,
    smtpHost: '',
    alertEmail: ''
};

function readSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
            return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
        }
    } catch (e) {
        console.warn('Error reading system_settings.json:', e.message);
    }
    return DEFAULT_SETTINGS;
}

function writeSettings(cfg) {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(cfg, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('Error writing system_settings.json:', e.message);
        return false;
    }
}

// Flexible auth: accepts JWT Bearer or X-API-Key
function flexibleAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'] || req.headers['x-device-api-key'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authenticate(req, res, next);
    }
    if (apiKey) {
        return apiKeyAuth(req, res, next);
    }
    // If neither, call authenticate to return standard 401
    return authenticate(req, res, next);
}

// ============================================================
// GET /api/settings
// Membaca pengaturan sistem & threshold baseline engine
// ============================================================
router.get('/', flexibleAuth, async (req, res) => {
    try {
        const settings = readSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (err) {
        console.error('GET /api/settings error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/settings
// Menyimpan pengaturan & sinkronisasi threshold ke database assets
// ============================================================
router.post('/', flexibleAuth, async (req, res) => {
    try {
        const body = req.body || {};
        const current = readSettings();
        const updated = {
            ...current,
            ...body
        };

        // Simpan ke file konfigurasi server
        writeSettings(updated);

        // Sinkronisasi baseline parameters ke tabel assets database MySQL
        const pollInterval = parseInt(updated.pollInterval, 10) || 10;
        const pingTimeout = parseInt(updated.pingTimeout, 10) || 1500;
        const maxRetries = parseInt(updated.maxRetries, 10) || 3;
        const timeoutSeconds = Math.max(1, Math.ceil(pingTimeout / 1000));

        await db.query(`
            UPDATE assets 
            SET check_interval_seconds = ?,
                timeout_seconds = ?,
                retry_count = ?,
                updated_at = NOW()
        `, [pollInterval, timeoutSeconds, maxRetries]);

        res.json({
            success: true,
            message: 'Pengaturan sistem berhasil disimpan dan disinkronkan ke basis data aset server.',
            data: updated
        });
    } catch (err) {
        console.error('POST /api/settings error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
