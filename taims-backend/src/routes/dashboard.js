const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

// ============================================================
// GET /api/dashboard/stats
// Statistik ringkasan
// ============================================================
router.get('/stats', authenticate, async (req, res) => {
    try {
        const [statusCount] = await db.query(`
            SELECT 
                COUNT(*) AS total_devices,
                SUM(CASE WHEN current_status = 'online' THEN 1 ELSE 0 END) AS online,
                SUM(CASE WHEN current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
                SUM(CASE WHEN current_status = 'warning' THEN 1 ELSE 0 END) AS warning,
                SUM(CASE WHEN current_status = 'unknown' THEN 1 ELSE 0 END) AS unknown,
                SUM(CASE WHEN current_status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance
            FROM assets
        `);

        const [byCategory] = await db.query(`
            SELECT category, COUNT(*) AS count
            FROM assets
            GROUP BY category
            ORDER BY category ASC
        `);

        const total = parseInt(statusCount[0].total_devices, 10) || 0;
        const online = parseInt(statusCount[0].online, 10) || 0;
        const availability = total > 0 ? parseFloat(((online / total) * 100).toFixed(2)) : 0;

        const [incidents] = await db.query(`
            SELECT COUNT(*) AS total 
            FROM incidents 
            WHERE DATE(detected_at) = CURDATE()
        `);

        const categoryMap = {};
        for (const row of byCategory) {
            categoryMap[row.category] = parseInt(row.count, 10) || 0;
        }

        const [lastUpdate] = await db.query(`
            SELECT MAX(updated_at) AS last_updated FROM assets
        `);

        res.status(200).json({
            success: true,
            data: {
                total_devices: total,
                online: online,
                offline: parseInt(statusCount[0].offline, 10) || 0,
                warning: parseInt(statusCount[0].warning, 10) || 0,
                unknown: parseInt(statusCount[0].unknown, 10) || 0,
                maintenance: parseInt(statusCount[0].maintenance, 10) || 0,
                availability_percent: availability,
                total_incidents_today: parseInt(incidents[0].total, 10) || 0,
                by_category: categoryMap,
                last_updated: lastUpdate[0].last_updated
            }
        });
    } catch (err) {
        console.error('GET /api/dashboard/stats error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/trend
// Data untuk Grafik "Tren Status Perangkat"
// Query: ?period=live | 24h | 30d
// ============================================================
router.get('/trend', authenticate, async (req, res) => {
    try {
        const { period = '24h' } = req.query;

        if (period === 'live') {
            const [rows] = await db.query(`
                SELECT ml.check_time, ml.status, a.asset_name 
                FROM monitoring_logs ml
                JOIN assets a ON ml.asset_id = a.asset_id
                ORDER BY ml.check_time DESC LIMIT 20
            `);
            
            const labels = rows.map(r => new Date(r.check_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })).reverse();
            const statuses = rows.map(r => r.status).reverse();

            return res.status(200).json({ success: true, period, data: { labels, values: statuses, raw: rows } });

        } else if (period === '24h') {
            const [rows] = await db.query(`
                SELECT 
                    DATE_FORMAT(check_time, '%H:00') AS jam,
                    COUNT(DISTINCT CASE WHEN status = 'online' THEN asset_id END) AS online,
                    COUNT(DISTINCT CASE WHEN status = 'offline' THEN asset_id END) AS offline,
                    COUNT(DISTINCT CASE WHEN status = 'warning' THEN asset_id END) AS warning
                FROM monitoring_logs
                WHERE check_time >= NOW() - INTERVAL 24 HOUR
                GROUP BY jam
                ORDER BY jam ASC
            `);

            const labels = rows.map(r => r.jam);
            const online = rows.map(r => r.online);
            const offline = rows.map(r => r.offline);
            const warning = rows.map(r => r.warning);

            return res.status(200).json({ success: true, period, data: { labels, datasets: { online, offline, warning } } });

        } else if (period === '30d') {
            // Grouping per hari dari tabel arsip (monitoring_daily_stats)
            const [rows] = await db.query(`
                SELECT 
                    DATE_FORMAT(stat_date, '%d %b') AS tanggal,
                    SUM(total_online) AS online,
                    SUM(total_offline) AS offline,
                    SUM(total_warning) AS warning
                FROM monitoring_daily_stats
                WHERE stat_date >= CURDATE() - INTERVAL 30 DAY
                GROUP BY stat_date
                ORDER BY stat_date ASC
            `);

            const labels = rows.map(r => r.tanggal);
            const online = rows.map(r => r.online);
            const offline = rows.map(r => r.offline);
            const warning = rows.map(r => r.warning);

            return res.status(200).json({ success: true, period, data: { labels, datasets: { online, offline, warning } } });
        }

        res.status(400).json({ success: false, error: 'Period tidak valid (pilih: live, 24h, 30d)' });
    } catch (err) {
        console.error('GET /api/dashboard/trend error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/uptime
// ============================================================
router.get('/uptime', authenticate, async (req, res) => {
    try {
        const { from, to, asset_id } = req.query;
        const fromDate = from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const toDate = to || new Date().toISOString().split('T')[0];

        let sql = `
            SELECT 
                a.asset_id, a.asset_code, a.asset_name, a.category,
                COUNT(ml.log_id) AS total_checks,
                SUM(CASE WHEN ml.status = 'online' THEN 1 ELSE 0 END) AS online_count,
                SUM(CASE WHEN ml.status = 'offline' THEN 1 ELSE 0 END) AS offline_count,
                ROUND(AVG(ml.response_time_ms), 2) AS avg_response_time
            FROM assets a
            LEFT JOIN monitoring_logs ml ON ml.asset_id = a.asset_id AND DATE(ml.check_time) BETWEEN ? AND ?
            WHERE 1=1
        `;
        const params = [fromDate, toDate];

        if (asset_id) { sql += ' AND a.asset_id = ?'; params.push(asset_id); }
        sql += ' GROUP BY a.asset_id ORDER BY a.asset_id ASC';

        const [rows] = await db.query(sql, params);

        const data = rows.map(row => {
            const total = row.total_checks || 0;
            const online = row.online_count || 0;
            const availability = total > 0 ? ((online / total) * 100).toFixed(2) : 0;

            return {
                asset_id: row.asset_id,
                asset_code: row.asset_code,
                asset_name: row.asset_name,
                category: row.category,
                total_checks: total,
                online_count: online,
                offline_count: row.offline_count || 0,
                avg_response_time_ms: row.avg_response_time,
                availability_percent: parseFloat(availability)
            };
        });

        res.status(200).json({ success: true, from: fromDate, to: toDate, data });
    } catch (err) {
        console.error('GET /api/dashboard/uptime error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/top-issues
// ============================================================
router.get('/top-issues', authenticate, async (req, res) => {
    try {
        const { limit = 10, period = '7d' } = req.query;
        let daysBack = 7;
        if (period === '1d') daysBack = 1;
        if (period === '30d') daysBack = 30;

        const fromDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const [rows] = await db.query(`
            SELECT 
                a.asset_id, a.asset_code, a.asset_name, a.category,
                COUNT(i.incident_id) AS incident_count,
                MAX(i.detected_at) AS last_incident,
                SUM(CASE WHEN i.severity = 'critical' THEN 1 ELSE 0 END) AS critical_count,
                SUM(CASE WHEN i.severity = 'high' THEN 1 ELSE 0 END) AS high_count
            FROM assets a
            LEFT JOIN incidents i ON i.asset_id = a.asset_id AND DATE(i.detected_at) >= ?
            WHERE i.incident_id IS NOT NULL
            GROUP BY a.asset_id
            ORDER BY incident_count DESC
            LIMIT ?
        `, [fromDate, parseInt(limit)]);

        res.status(200).json({ success: true, period, data: rows });
    } catch (err) {
        console.error('GET /api/dashboard/top-issues error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/charts
// ============================================================
router.get('/charts', authenticate, async (req, res) => {
    try {
        const [byCategory] = await db.query(`SELECT category, COUNT(*) AS count FROM assets GROUP BY category ORDER BY count DESC`);

        const [byStatus] = await db.query(`SELECT current_status AS status, COUNT(*) AS count FROM assets GROUP BY current_status`);

        const [byLocation] = await db.query(`
            SELECT l.location_name, COUNT(a.asset_id) AS count
            FROM locations l
            LEFT JOIN assets a ON a.location_id = l.location_id
            GROUP BY l.location_id
            ORDER BY count DESC
        `);

        const [byPriority] = await db.query(`SELECT priority, COUNT(*) AS count FROM assets GROUP BY priority ORDER BY priority ASC`);

        res.status(200).json({
            success: true,
            data: { by_category: byCategory, by_status: byStatus, by_location: byLocation, by_priority: byPriority }
        });
    } catch (err) {
        console.error('GET /api/dashboard/charts error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/ai-report
// ============================================================
router.get('/ai-report', authenticate, async (req, res) => {
    try {
        const [statusCount] = await db.query(`
            SELECT 
                COUNT(*) AS total_device,
                SUM(CASE WHEN current_status = 'online' THEN 1 ELSE 0 END) AS online,
                SUM(CASE WHEN current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
                SUM(CASE WHEN current_status = 'unknown' THEN 1 ELSE 0 END) AS unknown,
                SUM(CASE WHEN current_status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance
            FROM assets
        `);

        const stats = statusCount[0];
        const total = stats.total_device || 0;
        const online = stats.online || 0;
        const availability = total > 0 ? ((online / total) * 100).toFixed(2) : 0;

        const [topIssues] = await db.query(`
            SELECT a.asset_code, a.asset_name, COUNT(i.incident_id) AS incident_count
            FROM assets a
            LEFT JOIN incidents i ON i.asset_id = a.asset_id
            WHERE i.incident_id IS NOT NULL
            GROUP BY a.asset_id
            ORDER BY incident_count DESC
            LIMIT 5
        `);

        let recommendation = '';
        if (total === 0) recommendation = 'Belum ada device yang terdaftar di sistem.';
        else if (online === 0) recommendation = 'Monitoring engine belum berjalan. Semua device masih dalam status unknown.';
        else if (stats.offline > 0) recommendation = `Terdapat ${stats.offline} device offline. Lakukan pengecekan koneksi jaringan dan catu daya.`;
        else recommendation = `Sistem berjalan normal. ${online} dari ${total} device online (${availability}% availability).`;

        res.status(200).json({
            success: true,
            data: {
                generated_at: new Date().toISOString(),
                summary: {
                    total_device: total, online,
                    offline: stats.offline || 0,
                    unknown: stats.unknown || 0,
                    maintenance: stats.maintenance || 0,
                    availability: parseFloat(availability)
                },
                top_issues: topIssues.map(row => ({ asset_code: row.asset_code, asset_name: row.asset_name, incident_count: row.incident_count })),
                recommendation
            }
        });
    } catch (err) {
        console.error('GET /api/dashboard/ai-report error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/activity
// ============================================================
router.get('/activity', authenticate, async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const [rows] = await db.query(`
            SELECT ml.log_id, ml.asset_id, a.asset_code, a.asset_name, ml.status, ml.method, ml.response_time_ms, ml.check_time, ml.source
            FROM monitoring_logs ml
            LEFT JOIN assets a ON ml.asset_id = a.asset_id
            ORDER BY ml.check_time DESC
            LIMIT ?
        `, [parseInt(limit)]);

        res.status(200).json({ success: true, total: rows.length, data: rows });
    } catch (err) {
        console.error('GET /api/dashboard/activity error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/map
// ============================================================
router.get('/map', authenticate, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                l.location_id, l.location_name, l.description,
                COUNT(a.asset_id) AS total_assets,
                SUM(CASE WHEN a.current_status = 'online' THEN 1 ELSE 0 END) AS online,
                SUM(CASE WHEN a.current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
                SUM(CASE WHEN a.current_status = 'warning' THEN 1 ELSE 0 END) AS warning,
                SUM(CASE WHEN a.current_status = 'unknown' THEN 1 ELSE 0 END) AS unknown
            FROM locations l
            LEFT JOIN assets a ON a.location_id = l.location_id
            GROUP BY l.location_id
            ORDER BY l.location_id ASC
        `);

        res.status(200).json({ success: true, data: rows });
    } catch (err) {
        console.error('GET /api/dashboard/map error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;