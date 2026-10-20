const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

// ============================================================
// GET /api/search?q=mikrotik
// Search global: assets, users, locations
// ============================================================
router.get('/', authenticate, async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'Query minimal 2 karakter'
            });
        }

        const searchTerm = `%${q}%`;

        // Search assets
        const [assets] = await db.query(`
            SELECT 
                'asset' AS type,
                asset_id AS id,
                asset_code AS code,
                asset_name AS name,
                category AS extra
            FROM assets
            WHERE asset_code LIKE ? OR asset_name LIKE ?
            LIMIT 10
        `, [searchTerm, searchTerm]);

        // Search users
        const [users] = await db.query(`
            SELECT 
                'user' AS type,
                user_id AS id,
                email AS code,
                full_name AS name,
                role AS extra
            FROM users
            WHERE email LIKE ? OR full_name LIKE ?
            LIMIT 10
        `, [searchTerm, searchTerm]);

        // Search locations
        const [locations] = await db.query(`
            SELECT 
                'location' AS type,
                location_id AS id,
                NULL AS code,
                location_name AS name,
                description AS extra
            FROM locations
            WHERE location_name LIKE ? OR description LIKE ?
            LIMIT 10
        `, [searchTerm, searchTerm]);

        const results = [...assets, ...users, ...locations];

        res.status(200).json({
            success: true,
            query: q,
            total: results.length,
            data: results
        });
    } catch (err) {
        console.error('GET /api/search error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;