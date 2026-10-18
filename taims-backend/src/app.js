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

const app = express();

app.use(cors());
app.use(express.json());

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

// Healthcheck Endpoint for Container & Reverse Proxy
app.get(['/health', '/api/monitoring/health'], (req, res) => {
    res.json({
        status: 'healthy',
        service: 'taims-backend',
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
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    
    // Start MQTT handler
    startMqttHandler();
    
  // Start offline checker ← TAMBAHKAN
    startOfflineChecker();
});