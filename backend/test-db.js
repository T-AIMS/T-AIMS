const db = require('./src/config/db');

(async () => {
    try {
        const [rows] = await db.query('SELECT asset_id, asset_code, asset_name FROM assets LIMIT 5');
        console.log('✅ Query berhasil:');
        console.table(rows);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();