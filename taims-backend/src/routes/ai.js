const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();

// ============================================================
// GET /api/ai/recommendation
// Proxy ke n8n webhook (Arik) + agregasi data dari DB
// ============================================================
router.get('/recommendation', authenticate, async (req, res) => {
    try {
        // 1. Ambil data dari DB (agregasi)
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) AS total_devices,
                SUM(CASE WHEN current_status = 'online' THEN 1 ELSE 0 END) AS online,
                SUM(CASE WHEN current_status = 'offline' THEN 1 ELSE 0 END) AS offline,
                SUM(CASE WHEN current_status = 'unknown' THEN 1 ELSE 0 END) AS unknown,
                SUM(CASE WHEN current_status = 'maintenance' THEN 1 ELSE 0 END) AS maintenance
            FROM assets
        `);

        const [incidents] = await db.query(`
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

        const [topIssues] = await db.query(`
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

        const [offlineAssets] = await db.query(`
            SELECT 
                asset_code, asset_name, category, last_seen
            FROM assets
            WHERE current_status = 'offline'
            ORDER BY last_seen ASC
        `);

        // 2. Susun payload untuk n8n
        const payload = {
            generated_at: new Date().toISOString(),
            period_days: 30,
            summary: stats[0],
            incidents: incidents,
            top_issues: topIssues,
            offline_assets: offlineAssets
        };

        // 3. Forward ke n8n webhook (Arik)
        const n8nUrl = process.env.N8N_AI_WEBHOOK;

        if (!n8nUrl) {
            // Fallback kalau n8n belum siap
            return res.status(200).json({
                success: true,
                data: {
                    status: stats[0].offline > 0 ? 'warning' : 'healthy',
                    device: offlineAssets.length > 0 
                        ? offlineAssets.map(a => a.asset_name).join(', ')
                        : 'Semua device online',
                    recommendation: generateFallbackRecommendation(stats[0], offlineAssets, topIssues),
                    updated_at: new Date().toISOString(),
                    source: 'backend_fallback'
                }
            });
        }

        // Fetch ke n8n
        const response = await fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`n8n webhook error: ${response.status}`);
        }

        const aiResult = await response.json();

        // 4. Return ke frontend
        res.status(200).json({
            success: true,
            data: {
                status: aiResult.status || (stats[0].offline > 0 ? 'warning' : 'healthy'),
                device: aiResult.device || 'Semua device',
                recommendation: aiResult.recommendation || 'Tidak ada rekomendasi.',
                updated_at: new Date().toISOString(),
                source: 'n8n_ai'
            }
        });

    } catch (err) {
        console.error('GET /api/ai/recommendation error:', err);

        // Fallback kalau n8n error
        try {
            const [stats] = await db.query(`
                SELECT 
                    COUNT(*) AS total_devices,
                    SUM(CASE WHEN current_status = 'online' THEN 1 ELSE 0 END) AS online,
                    SUM(CASE WHEN current_status = 'offline' THEN 1 ELSE 0 END) AS offline
                FROM assets
            `);

            res.status(200).json({
                success: true,
                data: {
                    status: stats[0].offline > 0 ? 'warning' : 'healthy',
                    device: stats[0].offline > 0 ? `${stats[0].offline} device offline` : 'Semua online',
                    recommendation: 'AI engine tidak bisa diakses. Silakan cek n8n service.',
                    updated_at: new Date().toISOString(),
                    source: 'error_fallback'
                }
            });
        } catch (fallbackErr) {
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
});

// ============================================================
// Helper: Generate fallback recommendation (kalau n8n belum siap)
// ============================================================
function generateFallbackRecommendation(stats, offlineAssets, topIssues) {
    const parts = [];

    if (stats.offline > 0) {
        parts.push(`Terdapat ${stats.offline} device offline yang perlu diperiksa.`);
    }

    if (offlineAssets.length > 0) {
        const names = offlineAssets.slice(0, 3).map(a => a.asset_name).join(', ');
        parts.push(`Device offline: ${names}${offlineAssets.length > 3 ? ' dll' : ''}.`);
    }

    if (topIssues.length > 0) {
        const worst = topIssues[0];
        parts.push(`Device dengan insiden tertinggi: ${worst.asset_name} (${worst.incident_count} insiden dalam 30 hari).`);
    }

    if (stats.unknown > 0) {
        parts.push(`${stats.unknown} device belum pernah dicek — pastikan monitoring engine aktif.`);
    }

    if (parts.length === 0) {
        parts.push('Sistem berjalan normal. Tidak ada device offline atau insiden dalam 30 hari terakhir.');
    }

    return parts.join(' ');
}

module.exports = router;