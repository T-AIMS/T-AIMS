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
        // Total per status (pastikan semua perangkat dihitung dengan benar & case-insensitive)
        const [statusCount] = await db.query(`
            SELECT 
                COUNT(*) AS total_devices,
                SUM(CASE WHEN LOWER(TRIM(COALESCE(current_status, ''))) = 'online' THEN 1 ELSE 0 END) AS online,
                SUM(CASE WHEN LOWER(TRIM(COALESCE(current_status, ''))) = 'offline' THEN 1 ELSE 0 END) AS offline,
                SUM(CASE WHEN LOWER(TRIM(COALESCE(current_status, ''))) = 'maintenance' THEN 1 ELSE 0 END) AS maintenance,
                SUM(CASE WHEN LOWER(TRIM(COALESCE(current_status, ''))) NOT IN ('online', 'offline', 'maintenance') THEN 1 ELSE 0 END) AS unknown
            FROM assets
        `);

        // Total per kategori
        const [byCategory] = await db.query(`
            SELECT category, COUNT(*) AS count
            FROM assets
            GROUP BY category
            ORDER BY category ASC
        `);

        // Pastikan parsing tipe data integer murni
        const total = parseInt(statusCount[0].total_devices, 10) || 0;
        const online = parseInt(statusCount[0].online, 10) || 0;
        const offline = parseInt(statusCount[0].offline, 10) || 0;
        const unknown = parseInt(statusCount[0].unknown, 10) || 0;
        const maintenance = parseInt(statusCount[0].maintenance, 10) || 0;
        const availability = total > 0 ? parseFloat(((online / total) * 100).toFixed(2)) : 0;

        // Total incidents hari ini & Top Issues 30 hari (untuk integrasi AI n8n Arik)
        const [incidents] = await db.query(`
            SELECT COUNT(*) AS total 
            FROM incidents 
            WHERE DATE(detected_at) = CURDATE()
        `);

        const [topIssuesRows] = await db.query(`
            SELECT 
                a.asset_code,
                a.asset_name,
                a.category,
                COUNT(i.incident_id) AS incident_count
            FROM assets a
            LEFT JOIN incidents i ON i.asset_id = a.asset_id
                AND i.detected_at >= NOW() - INTERVAL 30 DAY
            WHERE i.incident_id IS NOT NULL
            GROUP BY a.asset_id
            ORDER BY incident_count DESC
            LIMIT 5
        `);

        // Susun by_category jadi object
        const categoryMap = {};
        for (const row of byCategory) {
            categoryMap[row.category] = parseInt(row.count, 10) || 0;
        }

        // Agregasi SLA 30 Hari & Lokasi dari tabel monitoring_logs (QA Fix BUG-011)
        const [sla30Rows] = await db.query(`
            SELECT 
                COUNT(*) as total_checks,
                SUM(CASE WHEN LOWER(status) = 'online' THEN 1 ELSE 0 END) as online_checks,
                ROUND(AVG(response_time_ms), 1) as avg_latency
            FROM monitoring_logs
            WHERE check_time >= NOW() - INTERVAL 30 DAY
        `);
        const totalChecks30 = parseInt(sla30Rows[0].total_checks, 10) || 0;
        const onlineChecks30 = parseInt(sla30Rows[0].online_checks, 10) || 0;
        const avgLatency30 = parseFloat(sla30Rows[0].avg_latency) || 0.0;
        const sla30Percent = totalChecks30 > 0 
            ? parseFloat(((onlineChecks30 / totalChecks30) * 100).toFixed(1)) 
            : availability;

        // SLA per lokasi (1: MO, 2: HO, 3: HoS)
        const [locSlaRows] = await db.query(`
            SELECT 
                l.location_id,
                l.location_name,
                COUNT(ml.log_id) as total_checks,
                SUM(CASE WHEN LOWER(ml.status) = 'online' THEN 1 ELSE 0 END) as online_checks
            FROM locations l
            JOIN assets a ON a.location_id = l.location_id
            LEFT JOIN monitoring_logs ml ON ml.asset_id = a.asset_id AND ml.check_time >= NOW() - INTERVAL 30 DAY
            GROUP BY l.location_id, l.location_name
        `);
        const locSlaMap = {};
        locSlaRows.forEach(r => {
            const tot = parseInt(r.total_checks, 10) || 0;
            const on = parseInt(r.online_checks, 10) || 0;
            locSlaMap[r.location_id] = tot > 0 
                ? parseFloat(((on / tot) * 100).toFixed(1)) 
                : availability;
        });

        // Last updated
        const [lastUpdate] = await db.query(`
            SELECT MAX(updated_at) AS last_updated FROM assets
        `);

        res.status(200).json({
            success: true,
            data: {
                total_devices: total,
                online: online,
                offline: offline,
                warning: unknown,
                unknown: unknown,
                maintenance: maintenance,
                availability_percent: availability,
                top_issues: topIssuesRows || [],
                total_incidents_today: parseInt(incidents[0].total, 10) || 0,
                by_category: categoryMap,
                sla_30_days: sla30Percent,
                total_checks_30_days: totalChecks30,
                avg_latency_30_days: avgLatency30,
                site_sla: locSlaMap,
                last_updated: lastUpdate[0].last_updated
            }
        });
    } catch (err) {
        console.error('GET /api/dashboard/stats error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================

// ============================================================
// ============================================================
// GET /api/dashboard/trend
// Data untuk Grafik "Tren Status Perangkat" (24 Jam & 30 Hari)
// Query: ?period=live | 24h | 30d
// ============================================================
router.get('/trend', authenticate, async (req, res) => {
    try {
        const { period = '24h' } = req.query;

        if (period === 'live') {
            const [rows] = await db.query(`
                SELECT ml.check_time, ml.status, a.asset_name, a.asset_code
                FROM monitoring_logs ml
                JOIN assets a ON ml.asset_id = a.asset_id
                ORDER BY ml.check_time DESC LIMIT 20
            `);
            
            const labels = rows.map(r => new Date(r.check_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })).reverse();
            const statuses = rows.map(r => r.status).reverse();

            const onlineCounts = [];
            const offlineCounts = [];
            const warningCounts = [];
            
            rows.slice().reverse().forEach(r => {
                onlineCounts.push(r.status === 'online' ? 1 : 0);
                offlineCounts.push(r.status === 'offline' ? 1 : 0);
                warningCounts.push(r.status === 'warning' ? 1 : 0);
            });

            return res.status(200).json({ 
                success: true, 
                period, 
                data: { 
                    labels, 
                    values: statuses, 
                    datasets: { 
                        online: onlineCounts, 
                        offline: offlineCounts, 
                        warning: warningCounts 
                    },
                    raw: rows 
                } 
            });

        } else if (period === '24h' || period === '24') {
            const [assetRows] = await db.query('SELECT COUNT(*) AS total FROM assets');
            const totalAssets = assetRows[0]?.total || 18;

            const [currentStatusRows] = await db.query(`
                SELECT 
                    SUM(CASE WHEN current_status = 'online' THEN 1 ELSE 0 END) AS online,
                    SUM(CASE WHEN current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
                    SUM(CASE WHEN current_status = 'warning' THEN 1 ELSE 0 END) AS warning
                FROM assets
            `);
            const curOnline = parseInt(currentStatusRows[0]?.online, 10) || 0;
            const curOffline = parseInt(currentStatusRows[0]?.offline, 10) || 0;
            const curWarning = parseInt(currentStatusRows[0]?.warning, 10) || 0;

            const [rows] = await db.query(`
                SELECT 
                    DATE_FORMAT(check_time, '%Y-%m-%d %H:00') AS hour_key,
                    COUNT(DISTINCT CASE WHEN status = 'online' THEN asset_id END) AS online_devs,
                    COUNT(DISTINCT CASE WHEN status = 'offline' THEN asset_id END) AS offline_devs,
                    COUNT(DISTINCT CASE WHEN status = 'warning' THEN asset_id END) AS warning_devs
                FROM monitoring_logs
                WHERE check_time >= NOW() - INTERVAL 24 HOUR
                GROUP BY hour_key
            `);

            const hourMap = {};
            rows.forEach(r => {
                hourMap[r.hour_key] = {
                    online: Number(r.online_devs) || 0,
                    offline: Number(r.offline_devs) || 0,
                    warning: Number(r.warning_devs) || 0
                };
            });

            const labels = [];
            const online = [];
            const offline = [];
            const warning = [];
            const now = new Date();

            const isStandbyOffline = (curOnline === 0);

            if (isStandbyOffline) {
                // Ketika sistem dalam mode standby offline (belum ada koneksi fisik aktif)
                for (let i = 23; i >= 0; i--) {
                    const h = new Date(now.getTime() - i * 3600000);
                    const hour = String(h.getHours()).padStart(2, '0');
                    labels.push(`${hour}:00`);
                    online.push(0);
                    offline.push(curOffline || totalAssets);
                    warning.push(0);
                }
            } else {
                for (let i = 23; i >= 0; i--) {
                    const h = new Date(now.getTime() - i * 3600000);
                    const year = h.getFullYear();
                    const month = String(h.getMonth() + 1).padStart(2, '0');
                    const date = String(h.getDate()).padStart(2, '0');
                    const hour = String(h.getHours()).padStart(2, '0');
                    const key = `${year}-${month}-${date} ${hour}:00`;
                    const label = `${hour}:00`;

                    labels.push(label);

                    if (i === 0) {
                        // Titik paling kanan: Jam sekarang (real-time snapshot)
                        online.push(curOnline);
                        offline.push(curOffline);
                        warning.push(curWarning);
                    } else if (hourMap[key]) {
                        // Titik riil dari monitoring_logs pada jam tersebut
                        online.push(hourMap[key].online);
                        offline.push(hourMap[key].offline);
                        warning.push(hourMap[key].warning);
                    } else {
                        // Tidak ada log pada jam lampau ini (tidak menduplikasi angka palsu hari ini)
                        online.push(0);
                        offline.push(0);
                        warning.push(0);
                    }
                }
            }

            return res.status(200).json({ 
                success: true, 
                period, 
                data: { 
                    labels, 
                    datasets: { online, offline, warning } 
                } 
            });

        } else if (period === '30d' || period === '30' || period === '7d' || period === '7') {
            const days = (period === '7d' || period === '7') ? 7 : 30;

            const [assetRows] = await db.query('SELECT COUNT(*) AS total FROM assets');
            const totalAssets = assetRows[0]?.total || 18;

            const [currentStatusRows] = await db.query(`
                SELECT 
                    SUM(CASE WHEN current_status = 'online' THEN 1 ELSE 0 END) AS online,
                    SUM(CASE WHEN current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
                    SUM(CASE WHEN current_status = 'warning' THEN 1 ELSE 0 END) AS warning
                FROM assets
            `);
            const curOnline = parseInt(currentStatusRows[0]?.online, 10) || 0;
            const curOffline = parseInt(currentStatusRows[0]?.offline, 10) || 0;
            const curWarning = parseInt(currentStatusRows[0]?.warning, 10) || 0;

            const [logRows] = await db.query(`
                SELECT 
                    DATE_FORMAT(check_time, '%Y-%m-%d') AS tgl_str,
                    COUNT(DISTINCT CASE WHEN status = 'online' THEN asset_id END) AS online_devs,
                    COUNT(DISTINCT CASE WHEN status = 'warning' THEN asset_id END) AS warning_devs,
                    COUNT(DISTINCT CASE WHEN status = 'offline' THEN asset_id END) AS offline_devs
                FROM monitoring_logs
                WHERE check_time >= NOW() - INTERVAL ? DAY
                GROUP BY tgl_str
            `, [days + 1]);

            const logMap = {};
            logRows.forEach(r => {
                logMap[r.tgl_str] = {
                    online: Number(r.online_devs) || 0,
                    offline: Number(r.offline_devs) || 0,
                    warning: Number(r.warning_devs) || 0
                };
            });

            const labels = [];
            const online = [];
            const offline = [];
            const warning = [];
            const now = new Date();
            const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

            const isStandbyOffline = (curOnline === 0);

            if (isStandbyOffline) {
                for (let i = days - 1; i >= 0; i--) {
                    const d = new Date(now.getTime() - i * 86400000);
                    const label = (i === 0) ? 'Hari Ini' : `${d.getDate()} ${months[d.getMonth()]}`;
                    labels.push(label);
                    online.push(0);
                    offline.push(curOffline || totalAssets);
                    warning.push(0);
                }
            } else {
                for (let i = days - 1; i >= 0; i--) {
                    const d = new Date(now.getTime() - i * 86400000);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const date = String(d.getDate()).padStart(2, '0');
                    const isoDate = `${year}-${month}-${date}`;
                    const label = (i === 0) ? 'Hari Ini' : `${d.getDate()} ${months[d.getMonth()]}`;
                    labels.push(label);

                    if (i === 0) {
                        // Titik paling kanan: Hari ini (status riil saat ini)
                        online.push(curOnline);
                        offline.push(curOffline);
                        warning.push(curWarning);
                    } else if (logMap[isoDate]) {
                        // Riwayat log asli hari tersebut (tanpa rumus asumsi totalAssets - estOnline)
                        online.push(logMap[isoDate].online);
                        offline.push(logMap[isoDate].offline);
                        warning.push(logMap[isoDate].warning);
                    } else {
                        // Hari lampau tanpa log (0)
                        online.push(0);
                        offline.push(0);
                        warning.push(0);
                    }
                }
            }

            return res.status(200).json({ 
                success: true, 
                period, 
                data: { 
                    labels, 
                    datasets: { online, offline, warning } 
                } 
            });
        }

        res.status(400).json({ success: false, error: 'Period tidak valid (pilih: live, 24h, 30d)' });
    } catch (err) {
        console.error('GET /api/dashboard/trend error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


// GET /api/dashboard/uptime
// Uptime/downtime per device
// ============================================================
router.get('/uptime', authenticate, async (req, res) => {
    try {
        const { from, to, asset_id } = req.query;

        // Default: 7 hari terakhir
        const fromDate = from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const toDate = to || new Date().toISOString().split('T')[0];

        let sql = `
            SELECT 
                a.asset_id,
                a.asset_code,
                a.asset_name,
                a.category,
                COUNT(ml.log_id) AS total_checks,
                SUM(CASE WHEN ml.status = 'online' THEN 1 ELSE 0 END) AS online_count,
                SUM(CASE WHEN ml.status = 'offline' THEN 1 ELSE 0 END) AS offline_count,
                ROUND(AVG(ml.response_time_ms), 2) AS avg_response_time
            FROM assets a
            LEFT JOIN monitoring_logs ml ON ml.asset_id = a.asset_id
                AND DATE(ml.check_time) BETWEEN ? AND ?
            WHERE 1=1
        `;
        const params = [fromDate, toDate];

        if (asset_id) {
            sql += ' AND a.asset_id = ?';
            params.push(asset_id);
        }

        sql += ' GROUP BY a.asset_id ORDER BY a.asset_id ASC';

        const [rows] = await db.query(sql, params);

        // Hitung availability percent
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

        res.status(200).json({
            success: true,
            from: fromDate,
            to: toDate,
            data
        });
    } catch (err) {
        console.error('GET /api/dashboard/uptime error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/top-issues
// Top device bermasalah
// ============================================================
router.get('/top-issues', authenticate, async (req, res) => {
    try {
        const { limit = 10, period = '7d' } = req.query;

        // Hitung tanggal berdasarkan period
        let daysBack = 7;
        if (period === '1d') daysBack = 1;
        if (period === '30d') daysBack = 30;

        const fromDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];

        // Total insiden per asset
        const [rows] = await db.query(`
            SELECT 
                a.asset_id,
                a.asset_code,
                a.asset_name,
                a.category,
                COUNT(i.incident_id) AS incident_count,
                MAX(i.detected_at) AS last_incident,
                SUM(CASE WHEN i.severity = 'critical' THEN 1 ELSE 0 END) AS critical_count,
                SUM(CASE WHEN i.severity = 'high' THEN 1 ELSE 0 END) AS high_count
            FROM assets a
            LEFT JOIN incidents i ON i.asset_id = a.asset_id
                AND DATE(i.detected_at) >= ?
            WHERE i.incident_id IS NOT NULL
            GROUP BY a.asset_id
            ORDER BY incident_count DESC
            LIMIT ?
        `, [fromDate, parseInt(limit)]);

        res.status(200).json({
            success: true,
            period,
            data: rows
        });
    } catch (err) {
        console.error('GET /api/dashboard/top-issues error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/charts
// Data grafik
// ============================================================
router.get('/charts', authenticate, async (req, res) => {
    try {
        // By category
        const [byCategory] = await db.query(`
            SELECT category, COUNT(*) AS count
            FROM assets
            GROUP BY category
            ORDER BY count DESC
        `);

        // By status
        const [byStatus] = await db.query(`
            SELECT current_status AS status, COUNT(*) AS count
            FROM assets
            GROUP BY current_status
        `);

        // By location
        const [byLocation] = await db.query(`
            SELECT 
                l.location_name,
                COUNT(a.asset_id) AS count
            FROM locations l
            LEFT JOIN assets a ON a.location_id = l.location_id
            GROUP BY l.location_id
            ORDER BY count DESC
        `);

        // By priority
        const [byPriority] = await db.query(`
            SELECT priority, COUNT(*) AS count
            FROM assets
            GROUP BY priority
            ORDER BY priority ASC
        `);

        res.status(200).json({
            success: true,
            data: {
                by_category: byCategory,
                by_status: byStatus,
                by_location: byLocation,
                by_priority: byPriority
            }
        });
    } catch (err) {
        console.error('GET /api/dashboard/charts error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/ai-report
// AI Infrastructure Report
// ============================================================
router.get('/ai-report', authenticate, async (req, res) => {
    try {
        // Statistik
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

        // Top issues
        const [topIssues] = await db.query(`
            SELECT 
                a.asset_code,
                a.asset_name,
                COUNT(i.incident_id) AS incident_count
            FROM assets a
            LEFT JOIN incidents i ON i.asset_id = a.asset_id
            WHERE i.incident_id IS NOT NULL
            GROUP BY a.asset_id
            ORDER BY incident_count DESC
            LIMIT 5
        `);

        // Generate rekomendasi
        let recommendation = '';
        if (total === 0) {
            recommendation = 'Belum ada device yang terdaftar di sistem.';
        } else if (online === 0) {
            recommendation = 'Monitoring engine belum berjalan. Semua device masih dalam status unknown. Pastikan monitoring engine aktif dan terhubung ke backend.';
        } else if (stats.offline > 0) {
            recommendation = `Terdapat ${stats.offline} device offline. Lakukan pengecekan koneksi jaringan dan catu daya pada device tersebut.`;
        } else {
            recommendation = `Sistem berjalan normal. ${online} dari ${total} device online (${availability}% availability).`;
        }

        res.status(200).json({
            success: true,
            data: {
                generated_at: new Date().toISOString(),
                summary: {
                    total_device: total,
                    online,
                    offline: stats.offline || 0,
                    unknown: stats.unknown || 0,
                    maintenance: stats.maintenance || 0,
                    availability: parseFloat(availability)
                },
                top_issues: topIssues.map(row => ({
                    asset_code: row.asset_code,
                    asset_name: row.asset_name,
                    incident_count: row.incident_count
                })),
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
// Recent activity (log monitoring terbaru)
// ============================================================
router.get('/activity', authenticate, async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const [rows] = await db.query(`
            SELECT 
                ml.log_id,
                ml.asset_id,
                a.asset_code,
                a.asset_name,
                ml.status,
                ml.method,
                ml.response_time_ms,
                ml.check_time,
                ml.source
            FROM monitoring_logs ml
            LEFT JOIN assets a ON ml.asset_id = a.asset_id
            ORDER BY ml.check_time DESC
            LIMIT ?
        `, [parseInt(limit)]);

        res.status(200).json({
            success: true,
            total: rows.length,
            data: rows
        });
    } catch (err) {
        console.error('GET /api/dashboard/activity error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ============================================================
// GET /api/dashboard/map
// Asset per lokasi (buat floorplan)
// ============================================================
router.get('/map', authenticate, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                l.location_id,
                l.location_name,
                l.description,
                COUNT(a.asset_id) AS total_assets,
                SUM(CASE WHEN a.current_status = 'online' THEN 1 ELSE 0 END) AS online,
                SUM(CASE WHEN a.current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
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