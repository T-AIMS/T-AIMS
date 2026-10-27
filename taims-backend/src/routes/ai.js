const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

// ============================================================
// GET /api/ai/recommendation
// Proxy ke n8n webhook (Arik) + agregasi data riil dari DB
// ============================================================
router.get('/recommendation', authenticate, async (req, res) => {
    let stats = [{ total_devices: 15, online: 0, offline: 15, unknown: 0, maintenance: 0 }];
    let offlineAssets = [];
    let topIssues = [];
    let incidents = [];

    try {
        // 1. Ambil data agregasi riil dari DB MySQL
        const [statsRows] = await db.query(`
            SELECT 
                COUNT(*) AS total_devices,
                SUM(CASE WHEN current_status = 'online' THEN 1 ELSE 0 END) AS online,
                SUM(CASE WHEN current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
                SUM(CASE WHEN current_status = 'unknown' THEN 1 ELSE 0 END) AS unknown,
                SUM(CASE WHEN current_status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance
            FROM assets
        `);
        if (statsRows && statsRows.length > 0) stats = statsRows;

        const [incidentsRows] = await db.query(`
            SELECT 
                i.incident_id,
                i.asset_id,
                a.asset_code,
                a.asset_name,
                i.incident_type,
                i.severity,
                i.detected_at,
                i.incident_status
            FROM incidents i
            LEFT JOIN assets a ON i.asset_id = a.asset_id
            WHERE i.detected_at >= NOW() - INTERVAL 30 DAY
            ORDER BY i.detected_at DESC
            LIMIT 20
        `);
        incidents = incidentsRows;

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
        topIssues = topIssuesRows;

        const [offlineRows] = await db.query(`
            SELECT 
                asset_code, asset_name, category, last_seen
            FROM assets
            WHERE current_status = 'offline'
            ORDER BY last_seen ASC
        `);
        offlineAssets = offlineRows;

        const totalCount = Number(stats[0].total_devices) || 15;
        const onlineCount = Number(stats[0].online) || 0;
        const offlineCount = Number(stats[0].offline) || 0;
        const warningCount = Number(stats[0].warning) || 0;
        const availPct = totalCount > 0 ? Number(((onlineCount / totalCount) * 100).toFixed(1)) : 0;

        // 2. Susun payload untuk n8n
        const payload = {
            generated_at: new Date().toISOString(),
            period_days: 30,
            summary: {
                total_devices: totalCount,
                online: onlineCount,
                offline: offlineCount,
                warning: warningCount,
                availability_percent: availPct
            },
            incidents: incidents,
            top_issues: topIssues,
            offline_assets: offlineAssets
        };

        // 3. Forward ke n8n webhook (Arik) jika service aktif
        const n8nUrl = process.env.N8N_AI_WEBHOOK;
        if (n8nUrl) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                const response = await fetch(n8nUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (response.ok) {
                    let aiResult = await response.json();
                    if (Array.isArray(aiResult)) aiResult = aiResult[0] || {};
                    const recText = aiResult.ai_response || aiResult.recommendation || aiResult.message || 'Tidak ada rekomendasi.';
                    const finalData = {
                        status: aiResult.status || (offlineCount > 0 ? 'warning' : 'healthy'),
                        device: aiResult.device || (offlineAssets.length > 0 ? offlineAssets.map(a => a.asset_name).join(', ') : 'Semua device'),
                        troubled_devices: aiResult.device || (offlineAssets.length > 0 ? offlineAssets.map(a => a.asset_name).join(', ') : 'Tidak ada'),
                        status_network: offlineCount > 0 ? 'STABIL DENGAN PERINGATAN (WARNING)' : 'NORMAL & OPTIMAL (STABIL)',
                        recommendation: recText,
                        updated_at: new Date().toISOString(),
                        source: 'n8n_ai',
                        total_devices: totalCount,
                        online_devices: onlineCount,
                        offline_devices: offlineCount,
                        warning_devices: warningCount,
                        availability_percent: availPct,
                        top_issues: topIssues,
                        offline_assets: offlineAssets.slice(0, 5)
                    };
                    await saveAiRecommendationToDb(finalData, (req.user && req.user.full_name) || 'Dzakwan Miftahussobirin');
                    return res.status(200).json({ success: true, data: finalData });
                }
            } catch (n8nErr) {
                // n8n offline / timeout -> fallback ke internal AI preskriptif
            }
        }

        // 4. Engine AI Preskriptif Cerdas Berbasis Data Telemetri MySQL
        const smartRec = generatePrescriptiveRecommendation(stats[0], offlineAssets, topIssues);
        const troubledStr = offlineAssets.length > 0
            ? offlineAssets.slice(0, 3).map(a => a.asset_code || a.asset_name).join(', ')
            : 'Tidak ada anomali kritis';

        const finalData = {
            status: offlineCount > 0 ? 'warning' : 'healthy',
            status_network: offlineCount > 0 ? 'STABIL DENGAN PERINGATAN (WARNING)' : 'NORMAL & OPTIMAL (STABIL)',
            device: troubledStr,
            troubled_devices: troubledStr,
            recommendation: smartRec,
            updated_at: new Date().toISOString(),
            source: 'taims_intelligent_ai',
            total_devices: totalCount,
            online_devices: onlineCount,
            offline_devices: offlineCount,
            warning_devices: warningCount,
            availability_percent: availPct,
            top_issues: topIssues,
            offline_assets: offlineAssets.slice(0, 5)
        };
        await saveAiRecommendationToDb(finalData, (req.user && req.user.full_name) || 'Dzakwan Miftahussobirin');
        return res.status(200).json({ success: true, data: finalData });

    } catch (err) {
        console.error('GET /api/ai/recommendation error:', err);
        return res.status(200).json({
            success: true,
            data: {
                status: 'warning',
                status_network: 'STATUS SIAGA',
                device: 'Infrastruktur T-AIMS',
                troubled_devices: 'Infrastruktur T-AIMS',
                recommendation: 'Sistem sedang menghimpun telemetri perangkat fisik. Pastikan koneksi engine monitoring aktif.',
                updated_at: new Date().toISOString(),
                source: 'system_standby',
                total_devices: 15,
                online_devices: 0,
                offline_devices: 15,
                warning_devices: 0,
                availability_percent: 0.0,
                top_issues: [],
                offline_assets: []
            }
        });
    }
});

// ============================================================
// Engine Rekomendasi Preskriptif Otomatis (Sesuai PDF PKL Hal. 4, 11, 17)
// ============================================================
function generatePrescriptiveRecommendation(stats, offlineAssets, topIssues) {
    const parts = [];
    const total = stats.total_devices || 15;
    const online = stats.online || 0;
    const offline = stats.offline || 0;
    const availPct = total > 0 ? ((online / total) * 100).toFixed(1) : "0.0";

    // 1. Diagnosa Kondisi Umum & SLA
    if (online === total) {
        return `Seluruh ${total} perangkat infrastruktur beroperasi optimal (SLA 100%). Koneksi VPN antar cabang Marketing Office dan Head Office stabil tanpa packet loss. Lanjutkan rutinitas pemantauan otomatis dan backup terjadwal.`;
    }

    parts.push(`Kondisi Jaringan: ${online} dari ${total} perangkat aktif (${availPct}% SLA Real-time).`);

    // 2. Analisis Perangkat Bermasalah Spesifik Berdasarkan Kategori
    const offlineCategories = {};
    offlineAssets.forEach(a => {
        const cat = a.category || 'Lainnya';
        if (!offlineCategories[cat]) offlineCategories[cat] = [];
        offlineCategories[cat].push(a);
    });

    if (offlineCategories['Router']) {
        const rtrs = offlineCategories['Router'].map(r => r.asset_code).join(', ');
        parts.push(`Diagnostik Gateway: Perangkat ${rtrs} offline. Rekomendasi: Verifikasi catu daya adaptor 12V, periksa redaman kabel optik/LAN ke switch uplink, dan pastikan routing table antar cabang aktif.`);
    }

    if (offlineCategories['IoT Node'] || offlineCategories['Raspberry Pi']) {
        const iots = (offlineCategories['IoT Node'] || []).concat(offlineCategories['Raspberry Pi'] || []).map(r => r.asset_code).join(', ');
        parts.push(`Diagnostik IoT & Edge: Node ${iots} tidak mengirim sinyal heartbeat. Rekomendasi: Periksa konektor daya 5V, cek intensitas sinyal Wi-Fi 2.4GHz, dan pastikan broker Mosquitto menerima publish topik 'taims/heartbeat'.`);
    }

    if (offlineCategories['CCTV']) {
        const cctvs = offlineCategories['CCTV'].map(c => c.asset_code).join(', ');
        parts.push(`Diagnostik Pengawasan: Kamera ${cctvs} tidak merespons ping. Rekomendasi: Cek injektor PoE switch dan periksa kualitas konektor RJ-45.`);
    }

    if (offlineCategories['Server']) {
        parts.push(`Peringatan Server Core: Verifikasi konsol fisik IPMI/iLO dan pastikan pasokan daya redundant UPS dalam batas voltase aman.`);
    }

    // 3. Analisis Riwayat Insiden Tertinggi (30 Hari)
    if (topIssues && topIssues.length > 0 && topIssues[0].incident_count > 0) {
        const worst = topIssues[0];
        parts.push(`Frekuensi Gangguan Tertinggi: ${worst.asset_name} tercatat ${worst.incident_count} kali insiden dalam 30 hari terakhir. Disarankan penjadwalan servis pemeliharaan preventif (Preventive Maintenance).`);
    }

    return parts.join('\n\n');
}


// ============================================================
// Helper: Simpan Riwayat Analisis AI ke Database MySQL (Dokumen PKL Hal. 17)
// ============================================================
async function saveAiRecommendationToDb(data, actor = 'Dzakwan Miftahussobirin') {
    try {
        // Debounce: jika ada record dalam 10 detik terakhir, lewati insert ganda
        const [recent] = await db.query(
            'SELECT recommendation_id FROM ai_recommendations WHERE created_at >= NOW() - INTERVAL 10 SECOND ORDER BY created_at DESC LIMIT 1'
        );
        if (recent && recent.length > 0) return recent[0].recommendation_id;

        const [result] = await db.query(
            `INSERT INTO ai_recommendations 
            (source, status_network, total_devices, online_devices, offline_devices, warning_devices, availability_percent, troubled_devices, recommendation, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.source || 'taims_intelligent_ai',
                data.status_network || 'STABIL',
                data.total_devices || 15,
                data.online_devices || 0,
                data.offline_devices || 15,
                data.warning_devices || 0,
                data.availability_percent || 0.0,
                data.troubled_devices || data.device || 'Infrastruktur T-AIMS',
                data.recommendation || '',
                actor
            ]
        );
        return result.insertId;
    } catch (e) {
        console.warn('Gagal menyimpan riwayat AI ke database:', e.message);
        return null;
    }
}

// ============================================================
// GET /api/ai/history
// Mengambil 25 riwayat analisis AI terakhir dari database (Dokumen PKL Hal. 17)
// ============================================================
router.get('/history', authenticate, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                recommendation_id,
                source,
                status_network,
                total_devices,
                online_devices,
                offline_devices,
                warning_devices,
                availability_percent,
                troubled_devices,
                recommendation,
                created_at,
                created_by
            FROM ai_recommendations
            ORDER BY created_at DESC
            LIMIT 25
        `);
        return res.status(200).json({
            success: true,
            data: rows
        });
    } catch (err) {
        console.error('GET /api/ai/history error:', err);
        return res.status(500).json({
            success: false,
            error: 'Gagal mengambil riwayat analisis AI dari database'
        });
    }
});

module.exports = router;
