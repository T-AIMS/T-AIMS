const db = require('../config/db');
const mqttClient = require('../config/mqtt');

// ============================================================
// Subscribe ke topic heartbeat
// ============================================================
function startMqttHandler() {
    mqttClient.subscribe('taims/heartbeat/#', { qos: 1 }, (err) => {
        if (err) {
            console.error('❌ MQTT subscribe error:', err.message);
        } else {
            console.log('📡 MQTT subscribed to taims/heartbeat/#');
        }
    });
}

// ============================================================
// Handle pesan masuk
// ============================================================
mqttClient.on('message', async (topic, message) => {
    try {
        // Topic format: taims/heartbeat/{asset_code}
        const parts = topic.split('/');
        if (parts.length !== 3 || parts[0] !== 'taims' || parts[1] !== 'heartbeat') {
            return;
        }

        const assetCode = parts[2];
        const payload = JSON.parse(message.toString());

        console.log(`💓 Heartbeat from ${assetCode}:`, payload);

        // Cari asset
        const [assets] = await db.query(
            'SELECT asset_id FROM assets WHERE asset_code = ?',
            [assetCode]
        );

        if (assets.length === 0) {
            console.warn(`⚠️  Asset ${assetCode} tidak terdaftar`);
            return;
        }

        const assetId = assets[0].asset_id;
        const checkTime = payload.timestamp || new Date();

        // Simpan ke monitoring_logs
        await db.query(
            `INSERT INTO monitoring_logs 
                (asset_id, check_time, status, method, source, response_time_ms, details)
             VALUES (?, ?, 'online', 'Heartbeat', 'device', 0, ?)`,
            [assetId, checkTime, JSON.stringify(payload)]
        );

        // Update asset
        await db.query(
            `UPDATE assets 
             SET current_status = 'online', last_seen = ?, updated_at = NOW()
             WHERE asset_id = ?`,
            [checkTime, assetId]
        );

        console.log(`✅ Heartbeat ${assetCode} disimpan`);

    } catch (err) {
        console.error('❌ MQTT message handler error:', err.message);
    }
});

module.exports = { startMqttHandler };