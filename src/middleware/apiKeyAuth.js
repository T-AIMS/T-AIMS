require('dotenv').config();

function apiKeyAuth(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.DEVICE_API_KEY;

    // Cek header ada
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            error: 'API Key tidak ditemukan. Kirim header X-API-Key.'
        });
    }

    // Cek API Key valid
    if (!validKey || apiKey !== validKey) {
        return res.status(403).json({
            success: false,
            error: 'API Key tidak valid'
        });
    }

    next();
}

module.exports = { apiKeyAuth };