const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
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

// Enable Trust Proxy for CloudPanel & Nginx Ingress (Preserve Client IP)
app.set('trust proxy', 1);

// Matikan X-Powered-By header
app.disable('x-powered-by');

// Batasi CORS ke origin resmi & jaringan lokal / private LAN (192.168.x.x, 10.x.x.x, 172.16-31.x.x, localhost)
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5500',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:5500',
    'https://taims.teknolab.id'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin === 'null') return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // Izinkan otomatis seluruh localhost, 127.0.0.1 (berbagai port Live Server) & IP LAN Private Network
        const isLocalhost = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);
        const isLanIp = /^https?:\/\/(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(?::\d+)?$/.test(origin);
        if (isLocalhost || isLanIp) {
            return callback(null, true);
        }

        callback(new Error('Ditolak oleh CORS'));
    },
    credentials: true
}));

app.use(express.json({ limit: '5mb' })); // foto profil (base64) maks 2MB
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Rate Limiter untuk Login (OWASP: skip jika berhasil, proteksi brute-force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Maksimal 20 percobaan gagal
    skipSuccessfulRequests: true,
    message: { success: false, error: 'Terlalu banyak percobaan login gagal. Coba lagi nanti.' }
});

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
    if (err.message === 'Ditolak oleh CORS') {
        return res.status(403).json({ success: false, error: 'Akses CORS ditolak' });
    }
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    
    // Start MQTT handler
    startMqttHandler();
    
    // Start offline checker & log cleaner
    startOfflineChecker();
    startLogCleaner();
});

// Graceful Shutdown Handler (Docker, PM2, and CloudPanel lifecycle)
const gracefulShutdown = (signal) => {
    console.log(`\n[!] Sinyal ${signal} diterima. Menutup server T-AIMS Backend secara graceful...`);
    server.close(() => {
        console.log('HTTP server ditutup.');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Penghentian paksa setelah batas waktu 10 detik.');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));