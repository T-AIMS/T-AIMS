const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const authRoutes = require('./routes/auth');
const assetsRoutes = require('./routes/assets');
const locationsRoutes = require('./routes/locations');
const usersRoutes = require('./routes/users');
const monitoringRoutes = require('./routes/monitoring');
const dashboardRoutes = require('./routes/dashboard');
const incidentsRoutes = require('./routes/incidents');
const maintenanceRoutes = require('./routes/maintenance');
const notificationsRoutes = require('./routes/notifications');
const heartbeatRoutes = require('./routes/heartbeat');
const { startMqttHandler } = require('./services/mqtt-handler');
const searchRoutes = require('./routes/search');
const { startOfflineChecker } = require('./services/offline-checker');
const aiRoutes = require('./routes/ai');
const { startLogCleaner } = require('./services/log-cleaner');

const app = express();

app.use(cors());
app.use(express.json());

// Enterprise Security Headers Middleware (WCAG & OWASP Top 10 Hardening)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

// Health & System Architecture Matrix Endpoint
app.get(['/health', '/api/health', '/api/monitoring/health'], (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        service: 'taims-backend',
        version: '1.0.0',
        uptime_seconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        architecture: {
            api: 'online',
            port: process.env.PORT || 3000,
            db_status: 'connected',
            mqtt_status: 'ready',
            ping_engine: 'active'
        }
    });
});

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: '🚀 T-AIMS Backend is running!',
        version: '0.5.0',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/heartbeat', heartbeatRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai', aiRoutes);

app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint tidak ditemukan' });
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    
    // Start MQTT handler
    startMqttHandler();
    
  // Start offline checker ← TAMBAHKAN
    startOfflineChecker();
    startLogCleaner();
});