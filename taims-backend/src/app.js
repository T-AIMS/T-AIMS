const express = require('express');
const cors = require('cors');
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

// 1. Trust Proxy (Biar IP asli device kelihatan di Nginx/CloudPanel)
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// 2. Security Headers (Standar OWASP Top 10)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
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

// 3. Endpoint Healthcheck (Bebas API Key / JWT, buat Docker & Nginx)
app.get('/api/monitoring/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'T-AIMS Backend',
        uptime: process.uptime(),
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
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
    console.log(`🌐 Bisa diakses dari jaringan lokal via IP laptop ini`);
    
    startLogCleaner(); // <-- INI WAJIB ADA
    
    // Start MQTT handler
    startMqttHandler();
    
    // Start offline checker
    startOfflineChecker();
});

// 4. Graceful Shutdown (Biar nggak error 502 saat container/PM2 restart)
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ HTTP server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ HTTP server closed.');
        process.exit(0);
    });
});
