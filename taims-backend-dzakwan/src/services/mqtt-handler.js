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
            'SELECT asset_id FROM assets WHERE asset_code = ? OR asset_code = ? LIMIT 1',
            [assetCode, assetCode.replace(/^IOT-/, '')]
        );

        if (assets.length === 0) {
            console.warn(`⚠️  Asset ${assetCode} tidak terdaftar`);
            return;
        }

        const assetId = assets[0].asset_id;
        const checkTime = new Date();

        const normStatus = (payload.status || '').toLowerCase().trim();
        const validStatuses = ['online', 'offline', 'unknown', 'maintenance'];
        const deviceStatus = validStatuses.includes(normStatus)
            ? normStatus
            : 'online';

        await db.query(
            `INSERT INTO monitoring_logs 
                (asset_id, check_time, status, method, source, response_time_ms, details)
             VALUES (?, NOW(), ?, 'Heartbeat', 'device', 0, ?)`,
            [assetId, deviceStatus, JSON.stringify(payload)]
        );

        if (deviceStatus === 'online') {
            await db.query(
                `UPDATE assets 
                 SET current_status = 'online', last_seen = NOW(), offline_since = NULL, updated_at = NOW()
                 WHERE asset_id = ?`,
                [assetId]
            );

            await db.query(
                `UPDATE incidents 
                 SET incident_status = 'resolved'
                 WHERE asset_id = ? 
                   AND incident_type = 'Device Offline' 
                   AND incident_status IN ('open', 'investigating')`,
                [assetId]
            );
        } else if (deviceStatus === 'offline') {
            await db.query(
                `UPDATE assets 
                 SET current_status = 'offline', offline_since = COALESCE(offline_since, NOW()), updated_at = NOW()
                 WHERE asset_id = ?`,
                [assetId]
            );
        } else {
            await db.query(
                `UPDATE assets 
                 SET current_status = ?, last_seen = NOW(), updated_at = NOW()
                 WHERE asset_id = ?`,
                [deviceStatus, assetId]
            );
        }

        console.log(`✅ Heartbeat ${assetCode} (${deviceStatus}) disimpan`);

    } catch (err) {
        console.error('❌ MQTT message handler error:', err.message);
    }
});

module.exports = { startMqttHandler };