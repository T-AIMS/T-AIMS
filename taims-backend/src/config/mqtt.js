const mqtt = require('mqtt');
require('dotenv').config();

const MQTT_HOST = process.env.MQTT_HOST || 'localhost';
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const MQTT_USER = process.env.MQTT_USER || '';
const MQTT_PASS = process.env.MQTT_PASS || '';

const brokerUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;

const options = {
    clientId: 'taims-backend-' + Math.random().toString(16).slice(2, 8),
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 30000,
};

if (MQTT_USER) {
    options.username = MQTT_USER;
    options.password = MQTT_PASS;
}

const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
    console.log('✅ MQTT connected to', brokerUrl);
});

client.on('error', (err) => {
    console.error('❌ MQTT error:', err.message);
});

client.on('reconnect', () => {
    console.log('🔄 MQTT reconnecting...');
});

client.on('offline', () => {
    console.warn('⚠️  MQTT offline');
});

module.exports = client;