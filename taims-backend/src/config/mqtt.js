const mqtt = require('mqtt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const MQTT_HOST = process.env.MQTT_HOST || 'localhost';
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const MQTT_USER = process.env.MQTT_USER || '';
const MQTT_PASS = process.env.MQTT_PASS || '';

const brokerUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;

const options = {
    clientId: 'taims-backend-' + Math.random().toString(16).slice(2, 8),
    clean: true,
    reconnectPeriod: 10000,
    connectTimeout: 5000,
};

if (MQTT_USER) {
    options.username = MQTT_USER;
    options.password = MQTT_PASS;
}

const client = mqtt.connect(brokerUrl, options);

let mqttWarningShown = false;

client.on('connect', () => {
    console.log('✅ MQTT connected to', brokerUrl);
    mqttWarningShown = false;
});

client.on('error', (err) => {
    if (!mqttWarningShown) {
        console.warn('⚠️  MQTT broker port 1883 belum aktif di laptop ini. (Aman: HTTP REST API & Ping tetap jalan 100%).');
        mqttWarningShown = true;
    }
});

client.on('offline', () => {
    if (!mqttWarningShown) {
        console.warn('⚠️  MQTT offline');
        mqttWarningShown = true;
    }
});

module.exports = client;
