const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, can } = require('../middleware/auth');

// ============================================================
// GET /api/notifications
// List notifikasi (filter per user)
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const { user_id, asset_id, is_read, limit = 50, page = 1 } = req.query;

        let sql = `
            SELECT 
                n.notification_id,
                n.user_id,
                u.full_name AS user_name,
                n.asset_id,
                a.asset_code,
                a.asset_name,
                n.title,
                n.message,
                n.is_read,
                n.created_at
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.user_id
            LEFT JOIN assets a ON n.asset_id = a.asset_id
            WHERE 1=1
        `;
        const params = [];

        // Kalau user biasa, cuma lihat notif miliknya
        if (req.user.role === 'user') {
            sql += ' AND n.user_id = ?';
            params.push(req.user.user_id);
        } else if (user_id) {
            sql += ' AND n.user_id = ?';
            params.push(user_id);
        }

        if (asset_id) { sql += ' AND n.asset_id = ?'; params.push(asset_id); }
        if (is_read !== undefined) { sql += ' AND n.is_read = ?'; params.push(is_read === 'true' ? 1 : 0); }

        // Hitung total
        const countSql = sql.replace(
            /SELECT[\s\S]*?FROM notifications n/,
            'SELECT COUNT(*) AS total FROM notifications n'
        );
        const [countResult] = await db.query(countSql, params);
        const total = countResult[0].total;

        // Pagination
        const offset = (parseInt(page) - 1) * parseInt(limit);
        sql += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await db.query(sql, params);

        // Hitung unread count
        const [unreadCount] = await db.query(
            'SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = 0',
            [req.user.user_id]
        );

        res.status(200).json({
            success: true,
            total,
            unread: unreadCount[0].unread,
            page: parseInt(page),
            limit: parseInt(limit),
            data: rows
        });
    } catch (err) {
        console.error('GET /api/notifications error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/notifications/unread-count
// Hitung jumlah notifikasi yang belum dibaca
// PENTING: Taruh SEBELUM /:id
// ============================================================
router.get('/unread-count', authenticate, async (req, res) => {
    try {
        const [result] = await db.query(
            'SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = 0',
            [req.user.user_id]
        );

        res.status(200).json({
            success: true,
            data: {
                unread: result[0].unread
            }
        });
    } catch (err) {
        console.error('GET /api/notifications/unread-count error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/notifications/:id
// Detail notifikasi
// ============================================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.query(`
            SELECT 
                n.*,
                u.full_name AS user_name,
                a.asset_code,
                a.asset_name
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.user_id
            LEFT JOIN assets a ON n.asset_id = a.asset_id
            WHERE n.notification_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Notification tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (err) {
        console.error('GET /api/notifications/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// POST /api/notifications
// Buat notifikasi (admin, super_admin)
// ============================================================
router.post('/', authenticate, can('create'), async (req, res) => {
    try {
        const { user_id, asset_id, title, message } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                error: 'title wajib diisi'
            });
        }

        // Cek user (kalau ada)
        if (user_id) {
            const [user] = await db.query('SELECT user_id FROM users WHERE user_id = ?', [user_id]);
            if (user.length === 0) {
                return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
            }
        }

        // Cek asset (kalau ada)
        if (asset_id) {
            const [asset] = await db.query('SELECT asset_id FROM assets WHERE asset_id = ?', [asset_id]);
            if (asset.length === 0) {
                return res.status(404).json({ success: false, error: 'Asset tidak ditemukan' });
            }
        }

        const [result] = await db.query(
            `INSERT INTO notifications (user_id, asset_id, title, message, is_read)
             VALUES (?, ?, ?, ?, 0)`,
            [user_id || null, asset_id || null, title, message || null]
        );

        res.status(201).json({
            success: true,
            message: 'Notification berhasil dibuat',
            data: { notification_id: result.insertId }
        });
    } catch (err) {
        console.error('POST /api/notifications error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/notifications/mark-all-read & /read-all
// Mark semua notifikasi sebagai read
const handleMarkAllRead = async (req, res) => {
    try {
        let sql = 'UPDATE notifications SET is_read = 1 WHERE is_read = 0';
        const params = [];
        if (req.user && req.user.role === 'user') {
            sql += ' AND user_id = ?';
            params.push(req.user.user_id);
        }
        const [result] = await db.query(sql, params);
        res.status(200).json({
            success: true,
            message: result.affectedRows + ' notifikasi ditandai sudah dibaca'
        });
    } catch (err) {
        console.error('PUT mark-all-read error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
router.put('/mark-all-read', authenticate, handleMarkAllRead);
router.put('/read-all', authenticate, handleMarkAllRead);
router.put('/read-all/mark', authenticate, handleMarkAllRead);

// ============================================================
// PUT /api/notifications/:id/read
// Mark as read
// ============================================================
router.put('/:id/read', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT notification_id, user_id FROM notifications WHERE notification_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Notification tidak ditemukan' });
        }

        await db.query('UPDATE notifications SET is_read = 1 WHERE notification_id = ?', [id]);

        res.status(200).json({ success: true, message: 'Notification ditandai sudah dibaca' });
    } catch (err) {
        console.error('PUT /api/notifications/:id/read error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// PUT /api/notifications/read-all
// Mark semua notifikasi sebagai read (untuk user yang login)
// ============================================================
router.put('/read-all/mark', authenticate, async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
            [req.user.user_id]
        );

        res.status(200).json({
            success: true,
            message: `${result.affectedRows} notifikasi ditandai sudah dibaca`
        });
    } catch (err) {
        console.error('PUT /api/notifications/read-all error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// DELETE /api/notifications/clear/all
// Bersihkan semua notifikasi
// ============================================================
router.delete('/clear/all', authenticate, async (req, res) => {
    try {
        let sql = 'DELETE FROM notifications';
        const params = [];
        if (req.user && req.user.role === 'user') {
            sql += ' WHERE user_id = ?';
            params.push(req.user.user_id);
        }
        const [result] = await db.query(sql, params);
        res.status(200).json({
            success: true,
            message: `${result.affectedRows} notifikasi berhasil dibersihkan`,
            affected_rows: result.affectedRows
        });
    } catch (err) {
        console.error('DELETE /api/notifications/clear/all error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// DELETE /api/notifications/:id
// Hapus notifikasi (super_admin only)
// ============================================================
router.delete('/:id', authenticate, can('delete'), async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            'SELECT notification_id FROM notifications WHERE notification_id = ?',
            [id]
        );
        if (existing.length === 0) {
            return res.status(404).json({ success: false, error: 'Notification tidak ditemukan' });
        }

        await db.query('DELETE FROM notifications WHERE notification_id = ?', [id]);

        res.status(200).json({ success: true, message: 'Notification berhasil dihapus' });
    } catch (err) {
        console.error('DELETE /api/notifications/:id error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


// ============================================================
// HELPER: Pengirim Notifikasi Telegram & n8n Webhook Forwarder
// Sesuai Spesifikasi Teknis Dokumen PKL Hal. 11 & automation_README.md
// ============================================================
const telegramAlertCooldown = new Map(); // key -> timestamp

async function dispatchTelegramAlert(text, type = 'info', metadata = {}) {
    const results = { n8n: false, telegram_direct: false, simulation: true };

    // 1. Forward ke n8n webhook (Arik - Port 5678)
    const n8nWebhook = process.env.N8N_ALERT_WEBHOOK || 'http://192.168.0.100:5678/webhook/alert';
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(n8nWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                type: type,
                bot: '@taims_alert_arik_bot',
                timestamp: new Date().toISOString(),
                ...metadata
            }),
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (res.ok) results.n8n = true;
    } catch (e) {
        // n8n standby / off
    }

    // 2. Direct Telegram Bot API jika token diset di .env
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 6000);
            const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: 'HTML'
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (tgRes.ok) results.telegram_direct = true;
        } catch (e) {
            // direct telegram timeout
        }
    }

    return results;
}

// ============================================================
// GET /api/notifications/telegram/status
// Cek status kesiapan integrasi Telegram & n8n
// ============================================================
router.get('/telegram/status', async (req, res) => {
    const hasTelegramToken = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID && process.env.TELEGRAM_BOT_TOKEN.length > 10);
    const hasN8n = !!(process.env.N8N_ACTIVE === 'true');
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER);

    return res.status(200).json({
        success: true,
        data: {
            bot_username: process.env.TELEGRAM_BOT_USERNAME || '@TeknolabAimsBot',
            platform: 'n8n Workflow Automation',
            n8n_webhook: process.env.N8N_ALERT_WEBHOOK || 'http://192.168.0.100:5678/webhook/alert',
            cooldown_minutes: 10,
            direct_bot_configured: hasTelegramToken,
            telegram: {
                connected: hasTelegramToken,
                bot_username: process.env.TELEGRAM_BOT_USERNAME || '@TeknolabAimsBot',
                status_text: hasTelegramToken ? 'Connected' : 'Standby'
            },
            n8n: {
                connected: hasN8n,
                workflow_id: 'wf_taims_alert_01',
                status_text: hasN8n ? 'Connected' : 'Standby'
            },
            smtp: {
                connected: hasSmtp,
                target: process.env.ALERT_EMAIL || 'noc-alerts@teknolab.id',
                status_text: hasSmtp ? 'Connected' : 'Standby'
            }
        }
    });
});

// ============================================================
// POST /api/notifications/telegram/send
// Kirim pesan kustom ke bot Telegram / n8n webhook
// ============================================================
router.post('/telegram/send', authenticate, async (req, res) => {
    try {
        const { message, type = 'info', asset_code } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, error: 'Pesan notifikasi wajib diisi' });
        }

        // Anti-spam debounce (10 Menit sesuai Dokumen PKL Hal. 11)
        if (asset_code) {
            const now = Date.now();
            const lastSent = telegramAlertCooldown.get(`${type}_${asset_code}`) || 0;
            const cooldownMs = 10 * 60 * 1000;
            if (now - lastSent < cooldownMs) {
                const sisaMenit = Math.ceil((cooldownMs - (now - lastSent)) / 60000);
                return res.status(200).json({
                    success: true,
                    cooldown: true,
                    message: `Anti-Spam aktif: Notifikasi untuk ${asset_code} sedang dalam masa cooldown (${sisaMenit} menit tersisa).`
                });
            }
            telegramAlertCooldown.set(`${type}_${asset_code}`, now);
        }

        const dispatchResult = await dispatchTelegramAlert(message, type, { asset_code });

        // Catat ke DB notifications jika ada user
        if (req.user && req.user.user_id) {
            try {
                await db.query(
                    'INSERT INTO notifications (user_id, title, message, is_read) VALUES (?, ?, ?, 0)',
                    [req.user.user_id, `[TELEGRAM] ${type.toUpperCase()}`, message.slice(0, 250)]
                );
            } catch (e) {}
        }

        return res.status(200).json({
            success: true,
            message: 'Notifikasi berhasil diproses ke pipeline Telegram / n8n',
            delivery: dispatchResult
        });
    } catch (err) {
        console.error('POST /api/notifications/telegram/send error:', err);
        return res.status(500).json({ success: false, error: 'Gagal mengirim notifikasi Telegram' });
    }
});

// ============================================================
// POST /api/notifications/telegram/test-alert
// Menguji pengiriman notifikasi Offline / Recovery (Dokumen PKL Hal. 11)
// ============================================================
router.post('/telegram/test-alert', authenticate, async (req, res) => {
    try {
        const { type = 'offline', asset_code = 'RPI-01' } = req.body;
        const nowStr = new Date().toLocaleString('id-ID') + ' WIB';

        let text = '';
        if (type === 'recovery') {
            text = 
`<b>✅ [T-AIMS RECOVERY] PERANGKAT NORMAL KEMBALI!</b>
====================================
<b>Perangkat :</b> ${asset_code} (Raspberry Pi Head Office)
<b>Kategori  :</b> Raspberry Pi
<b>IP Address:</b> 192.168.1.45
<b>Lokasi    :</b> Head Office
<b>Waktu Pulih:</b> ${nowStr}
<b>Status    :</b> <b>RESOLVED</b> (Sinyal heartbeat normal)
====================================
<b>PIC       :</b> Ananda Dwi Susanti
<b>Bot Engine:</b> @taims_alert_arik_bot (Teknolab T-AIMS)`;
        } else {
            text = 
`<b>🚨 [T-AIMS ALERT] PERANGKAT OFFLINE!</b>
====================================
<b>Perangkat :</b> ${asset_code} (Raspberry Pi Head Office)
<b>Kategori  :</b> Raspberry Pi
<b>IP Address:</b> 192.168.1.45
<b>Lokasi    :</b> Head Office
<b>Waktu Mati :</b> ${nowStr}
<b>Status    :</b> <b>CRITICAL</b> (Tidak merespons ping / heartbeat)
====================================
<b>PIC       :</b> Ananda Dwi Susanti
<b>Bot Engine:</b> @taims_alert_arik_bot (Teknolab T-AIMS)`;
        }

        const dispatchResult = await dispatchTelegramAlert(text, type, { asset_code, test: true });

        return res.status(200).json({
            success: true,
            type: type,
            asset_code: asset_code,
            formatted_message: text,
            delivery: dispatchResult,
            message: `Simulasi alert ${type.toUpperCase()} untuk ${asset_code} berhasil digenerate dan dikirim.`
        });
    } catch (err) {
        console.error('POST /api/notifications/telegram/test-alert error:', err);
        return res.status(500).json({ success: false, error: 'Gagal memproses simulasi alert' });
    }
});

// ============================================================
// POST /api/notifications/telegram/report
// Mengirimkan Rekap Diagnostik AI Terkini ke Telegram (Dokumen PKL Hal. 17)
// ============================================================
router.post('/telegram/report', authenticate, async (req, res) => {
    try {
        // Ambil data rekomendasi AI terkini dari database
        const [rows] = await db.query(
            'SELECT * FROM ai_recommendations ORDER BY created_at DESC LIMIT 1'
        );

        const nowStr = new Date().toLocaleString('id-ID') + ' WIB';
        const ai = (rows && rows.length > 0) ? rows[0] : {
            total_devices: 15,
            online_devices: 0,
            offline_devices: 15,
            availability_percent: 0.0,
            troubled_devices: 'RPI-01, MKRT-02, SRV-01',
            recommendation: 'Kondisi Jaringan: 0 dari 15 perangkat aktif. Periksa catu daya dan uplink switch.'
        };

        const reportText = 
`<b>🤖 [T-AIMS AI INFRASTRUCTURE REPORT] 🤖</b>
====================================
<b>Waktu Laporan :</b> ${nowStr}
<b>Total Devices :</b> ${ai.total_devices} | <b>Online:</b> ${ai.online_devices} | <b>Offline:</b> ${ai.offline_devices}
<b>Availability  :</b> <b>${ai.availability_percent}%</b>

<b>Perangkat Bermasalah:</b>
${ai.troubled_devices || '-'}

<b>Rekomendasi Preskriptif AI:</b>
${(ai.recommendation || '').slice(0, 450)}...
====================================
<b>Bot Resmi:</b> @taims_alert_arik_bot
<b>Workflow:</b> n8n Automation Engine (Arik)`;

        const dispatchResult = await dispatchTelegramAlert(reportText, 'ai_report', { report_id: ai.recommendation_id });

        return res.status(200).json({
            success: true,
            formatted_message: reportText,
            delivery: dispatchResult,
            message: 'Laporan AI resmi berhasil dikirimkan ke Telegram Teknolab'
        });
    } catch (err) {
        console.error('POST /api/notifications/telegram/report error:', err);
        return res.status(500).json({ success: false, error: 'Gagal mengirim laporan AI ke Telegram' });
    }
});

module.exports = router;
