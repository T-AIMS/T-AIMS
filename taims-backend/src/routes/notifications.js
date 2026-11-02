const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, can } = require('../middleware/auth');
const { sendIncidentAlertEmail } = require('../services/email-service');

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
    // Otomatis memilih webhook sesuai tipe: Offline (taims-alert) vs Recovery (taims-recovery)
    let n8nWebhook = process.env.N8N_ALERT_WEBHOOK || 'http://127.0.0.1:5678/webhook/taims-alert';
    if (type === 'recovery' || type === 'online' || metadata.status === 'online') {
        n8nWebhook = process.env.N8N_RECOVERY_WEBHOOK || process.env.N8N_ALERT_WEBHOOK || 'http://127.0.0.1:5678/webhook/taims-recovery';
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const payloadData = {
            event_type: type === 'recovery' ? 'DEVICE_RECOVERY' : (type === 'warning' ? 'PREDICTIVE_WARNING' : 'DEVICE_OFFLINE'),
            severity: metadata.severity || (type === 'warning' ? 'warning' : (type === 'recovery' ? 'info' : 'critical')),
            asset_code: metadata.asset_code || 'RPI-01',
            asset_name: metadata.asset_name || 'Raspberry Pi Head Office',
            category: metadata.category || 'Infrastruktur',
            ip_address: metadata.ip_address || '192.168.1.45',
            location: metadata.location || 'Head Office',
            message: text,
            type: type,
            bot: '@taims_alert_arik_bot',
            symptoms: metadata.symptoms || {
                ping_latency: type === 'warning' ? '185 ms' : (type === 'recovery' ? '12 ms' : 'Timeout'),
                packet_loss: type === 'warning' ? '25%' : (type === 'recovery' ? '0%' : '100%')
            },
            trigger_source: metadata.trigger_source || (metadata.test ? 'Manual Chaos Test Drill' : 'Autonomous Background Daemon'),
            timestamp: new Date().toISOString(),
            ...metadata
        };

        const res = await fetch(n8nWebhook, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-TAIMS-WEBHOOK-SECRET': process.env.N8N_WEBHOOK_SECRET || 'taims_sec_n8n_8f92c10a4b3e6d5e7a1b'
            },
            body: JSON.stringify(payloadData),
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (res.ok) results.n8n = true;
    } catch (e) {
        // n8n standby / off
    }

    // 2. Direct Telegram Bot API (DINONAKTIFKAN SESUAI INSTRUKSI WAFIAN & ARIK)
    // Seluruh pengiriman notifikasi sekarang 1 PINTU murni lewat n8n AI Engine Runner (Port 5678)
    // untuk mencegah spam pesan dobel (duplicate alerts) di grup Telegram.

    // 3. Dispatch Email Alert (SMTP Integration - Dokumen PKL Hal. 11 & Checklist 5.5)
    // Otomatis terkirim ke multi-recipient (rekan tim di .env + PIC aset + custom email)
    sendIncidentAlertEmail({
        asset_code: metadata.asset_code || 'RPI-01',
        asset_name: metadata.asset_name || 'Raspberry Pi Head Office',
        category: metadata.category || 'Infrastruktur',
        location: metadata.location || 'Head Office',
        ip_address: metadata.ip_address || '192.168.1.45',
        pic_name: metadata.pic_name || null,
        pic_email: metadata.pic_email || null,
        recipient_email: metadata.recipient_email || null,
        severity: metadata.severity || (type === 'warning' ? 'warning' : (type === 'recovery' ? 'info' : 'critical')),
        message: text,
        type: type
    }).catch(err => console.warn('[SMTP] Email dispatch error:', err.message));

    return results;
}

// ============================================================
// GET /api/notifications/telegram/status
// Cek status kesiapan integrasi Telegram & n8n
// ============================================================
router.get('/telegram/status', async (req, res) => {
    const hasTelegramToken = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID && process.env.TELEGRAM_BOT_TOKEN.length > 10);
    const hasN8n = !!(process.env.N8N_ACTIVE === 'true' || process.env.N8N_ALERT_WEBHOOK);
    const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER);

    return res.status(200).json({
        success: true,
        data: {
            bot_username: process.env.TELEGRAM_BOT_USERNAME || '@taims_alert_arik_bot',
            platform: 'n8n Workflow Automation',
            n8n_alert_webhook: process.env.N8N_ALERT_WEBHOOK || 'http://127.0.0.1:5678/webhook/taims-alert',
            n8n_recovery_webhook: process.env.N8N_RECOVERY_WEBHOOK || 'http://127.0.0.1:5678/webhook/taims-recovery',
            n8n_ai_webhook: process.env.N8N_AI_WEBHOOK || 'http://127.0.0.1:5678/webhook/ai-recommendation',
            cooldown_minutes: 10,
            direct_bot_configured: hasTelegramToken,
            telegram: {
                connected: hasTelegramToken,
                bot_username: process.env.TELEGRAM_BOT_USERNAME || '@taims_alert_arik_bot',
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
        const { type = 'offline', asset_code = 'MKRT-02', severity } = req.body;
        const nowStr = new Date().toLocaleString('id-ID') + ' WIB';

        // Query dinamis aset dari basis data MySQL (menghindari hardcode RPI-01)
        let dev = null;
        try {
            const [rows] = await db.query(`
                SELECT a.asset_code, a.asset_name, a.category, a.ip_address, a.current_status,
                       COALESCE(l.location_name, 'Head Office') AS location_name,
                       COALESCE(u.full_name, 'Ananda Dwi Susanti') AS pic_name,
                       u.email AS pic_email
                FROM assets a
                LEFT JOIN locations l ON a.location_id = l.location_id
                LEFT JOIN users u ON a.pic_user_id = u.user_id
                WHERE a.asset_code = ? LIMIT 1
            `, [asset_code]);
            if (rows && rows.length > 0) dev = rows[0];
        } catch (e) {
            console.warn('Query dynamic asset failed, using fallback:', e.message);
        }

        if (!dev) {
            dev = {
                asset_code: asset_code,
                asset_name: `${asset_code} Device`,
                category: asset_code.startsWith('CAM') ? 'CCTV' : (asset_code.startsWith('SRV') ? 'Server' : (asset_code.startsWith('ESP') ? 'IoT Node' : (asset_code.startsWith('SWM') ? 'Switch' : 'Infrastruktur'))),
                ip_address: '192.168.1.50',
                location_name: 'Head Office',
                pic_name: 'Ananda Dwi Susanti'
            };
        }

        const effectiveSeverity = severity || (type === 'warning' ? 'warning' : (type === 'recovery' ? 'info' : 'critical'));

        let text = '';
        if (type === 'recovery') {
            text = 
`<b>✅ [T-AIMS RECOVERY] PERANGKAT NORMAL KEMBALI!</b>
====================================
<b>Perangkat :</b> ${dev.asset_code} (${dev.asset_name})
<b>Kategori  :</b> ${dev.category}
<b>IP Address:</b> ${dev.ip_address}
<b>Lokasi    :</b> ${dev.location_name}
<b>Waktu Pulih:</b> ${nowStr}
<b>Status    :</b> <b>RESOLVED</b> (Sinyal heartbeat normal)
====================================
<b>PIC       :</b> ${dev.pic_name}
<b>Bot Engine:</b> @taims_alert_arik_bot (Teknolab T-AIMS)`;
        } else if (type === 'warning') {
            text = 
`<b>🟡 [T-AIMS WARNING] POTENSI GANGGUAN / ANOMALI JARINGAN!</b>
====================================
<b>Perangkat :</b> ${dev.asset_code} (${dev.asset_name})
<b>Kategori  :</b> ${dev.category}
<b>IP Address:</b> ${dev.ip_address}
<b>Lokasi    :</b> ${dev.location_name}
<b>Waktu     :</b> ${nowStr}
<b>Status    :</b> <b>WARNING</b> (Latensi spike / Packet loss terdeteksi)
====================================
<b>PIC       :</b> ${dev.pic_name}
<b>Bot Engine:</b> @taims_alert_arik_bot • Early Warning System`;
        } else {
            text = 
`<b>🚨 [T-AIMS ALERT] PERANGKAT OFFLINE!</b>
====================================
<b>Perangkat :</b> ${dev.asset_code} (${dev.asset_name})
<b>Kategori  :</b> ${dev.category}
<b>IP Address:</b> ${dev.ip_address}
<b>Lokasi    :</b> ${dev.location_name}
<b>Waktu Mati :</b> ${nowStr}
<b>Status    :</b> <b>CRITICAL</b> (Tidak merespons ping / heartbeat)
====================================
<b>PIC       :</b> ${dev.pic_name}
<b>Bot Engine:</b> @taims_alert_arik_bot (Teknolab T-AIMS)`;
        }

        const dispatchResult = await dispatchTelegramAlert(text, type, {
            asset_code: dev.asset_code,
            asset_name: dev.asset_name,
            category: dev.category,
            ip_address: dev.ip_address,
            location: dev.location_name,
            pic_name: dev.pic_name,
            pic_email: dev.pic_email || null,
            recipient_email: req.body.recipient_email || req.body.target_email || null,
            severity: effectiveSeverity,
            test: true,
            trigger_source: 'Manual Chaos Test Drill'
        });

        return res.status(200).json({
            success: true,
            type: type,
            asset_code: dev.asset_code,
            asset_name: dev.asset_name,
            severity: effectiveSeverity,
            formatted_message: text,
            delivery: dispatchResult,
            message: `Simulasi alert ${type.toUpperCase()} untuk ${dev.asset_code} (${dev.asset_name}) berhasil digenerate dan dikirim.`
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
module.exports.dispatchTelegramAlert = dispatchTelegramAlert;
