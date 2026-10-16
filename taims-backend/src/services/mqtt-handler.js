const db = require('../config/db');
const mqttClient = require('../config/mqtt');

function startMqttHandler() {
    mqttClient.subscribe('taims/heartbeat/#', { qos: 1 }, (err) => {
        if (err) {
            console.error('❌ MQTT subscribe error:', err.message);
        } else {
            console.log('📡 MQTT subscribed to taims/heartbeat/#');
        }
    });
}

mqttClient.on('message', async (topic, message) => {
    try {
        const parts = topic.split('/');
        if (parts.length !== 3 || parts[0] !== 'taims' || parts[1] !== 'heartbeat') {
            return;
        }

        const assetCode = parts[2];
        const payload = JSON.parse(message.toString());

        console.log(`💓 Heartbeat from ${assetCode}:`, payload);

        const [assets] = await db.query(
            'SELECT asset_id FROM assets WHERE asset_code = ?',
            [assetCode]
        );

        if (assets.length === 0) {
            console.warn(`⚠️  Asset ${assetCode} tidak terdaftar`);
            return;
        }

        const assetId = assets[0].asset_id;
        const checkTime = new Date();

        // Validasi status ← 3 BARIS BARU
        const validStatuses = ['online', 'offline', 'unknown', 'maintenance'];
        const deviceStatus = validStatuses.includes(payload.status)
            ? payload.status
            : 'online';

        await db.query(
            `INSERT INTO monitoring_logs 
                (asset_id, check_time, status, method, source, response_time_ms, details)
             VALUES (?, ?, ?, 'Heartbeat', 'device', 0, ?)`,
            [assetId, checkTime, deviceStatus, JSON.stringify(payload)]
        );

        await db.query(
            `UPDATE assets 
             SET current_status = ?, last_seen = ?, updated_at = NOW()
             WHERE asset_id = ?`,
            [deviceStatus, checkTime, assetId]
        );

        console.log(`✅ Heartbeat ${assetCode} disimpan`);

    } catch (err) {
        console.error('❌ MQTT message handler error:', err.message);
    }
});

module.exports = { startMqttHandler };