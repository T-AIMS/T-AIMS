const db = require('../config/db');
const mqttClient = require('../config/mqtt');
const { dispatchTelegramAlert } = require('../routes/notifications');

// Threshold: device dianggap offline kalau tidak kirim heartbeat/ping melebihi batas waktu (default 45 detik)
const OFFLINE_THRESHOLD_SECONDS = process.env.OFFLINE_THRESHOLD_SECONDS ? parseInt(process.env.OFFLINE_THRESHOLD_SECONDS, 10) : 45;
const CHECK_INTERVAL_MS = 30000; // 30 detik

// Cooldown in-memory 10 menit agar tidak membanjiri Telegram bot, n8n webhook, dan MQTT broker (Saran Wafian: Anti-Alert Fatigue)
const alertCooldowns = new Map();
const COOLDOWN_ALERT_MS = 10 * 60 * 1000;

function shouldPublishAlert(type, assetCode) {
    const key = `${type}_${assetCode}`;
    const now = Date.now();
    const last = alertCooldowns.get(key) || 0;
    if (now - last < COOLDOWN_ALERT_MS) {
        return false;
    }
    alertCooldowns.set(key, now);
    return true;
}

/**
 * Pemicu Pengiriman Notifikasi Cerdas ke n8n & Telegram Bot (@taims_alert_arik_bot)
 * Menjalankan alur autonomous sesuai standar Enterprise AIOps Teknolab
 */
async function triggerTelegramAlert(type, device) {
    // 1. Debounce transisi status (Anti-Spam 10 Menit)
    if (!shouldPublishAlert(type, device.asset_code)) {
        console.log(`[Anti-Spam Debounce] Alert ${type.toUpperCase()} untuk ${device.asset_code} masih dalam cooldown buffer.`);
        return;
    }

    const nowStr = new Date().toLocaleString('id-ID') + ' WIB';
    const locationName = device.location_name || 'Head Office';
    const ipAddr = device.ip_address || '-';

    let text = '';
    if (type === 'recovery') {
        text = 
`<b>✅ [T-AIMS RECOVERY] PERANGKAT NORMAL KEMBALI!</b>
====================================
<b>Perangkat :</b> ${device.asset_code} (${device.asset_name})
<b>Kategori  :</b> ${device.category}
<b>IP Address:</b> ${ipAddr}
<b>Lokasi    :</b> ${locationName}
<b>Waktu Pulih:</b> ${nowStr}
<b>Status    :</b> <b>RESOLVED</b> (Heartbeat & Telemetri Pulih)
====================================
<b>Bot Engine:</b> @taims_alert_arik_bot • n8n Early Warning Engine`;
    } else if (type === 'warning') {
        text = 
`<b>🟡 [T-AIMS WARNING] POTENSI GANGGUAN / ANOMALI JARINGAN!</b>
====================================
<b>Perangkat :</b> ${device.asset_code} (${device.asset_name})
<b>Kategori  :</b> ${device.category}
<b>IP Address:</b> ${ipAddr}
<b>Lokasi    :</b> ${locationName}
<b>Waktu     :</b> ${nowStr}
<b>Gejala    :</b> Latensi tinggi / Fluktuasi sinyal terdeteksi
<b>Status    :</b> <b>WARNING</b> (Deteksi Dini - Predictive Maintenance)
====================================
<b>Bot Engine:</b> @taims_alert_arik_bot • n8n Early Warning Engine`;
    } else {
        text = 
`<b>🚨 [T-AIMS ALERT] PERANGKAT OFFLINE!</b>
====================================
<b>Perangkat :</b> ${device.asset_code} (${device.asset_name})
<b>Kategori  :</b> ${device.category}
<b>IP Address:</b> ${ipAddr}
<b>Lokasi    :</b> ${locationName}
<b>Waktu Mati :</b> ${nowStr}
<b>Status    :</b> <b>CRITICAL</b> (Tidak merespons heartbeat > ${OFFLINE_THRESHOLD_SECONDS} dtk)${device.is_cascade ? '\n<b>⚠️ ROOT CAUSE:</b> Dampak turunan (Cascade Downstream) dari Switch Utama.' : ''}
====================================
<b>Bot Engine:</b> @taims_alert_arik_bot • n8n Early Warning Engine`;
    }

    try {
        if (typeof dispatchTelegramAlert === 'function') {
            await dispatchTelegramAlert(text, type, {
                asset_code: device.asset_code,
                asset_name: device.asset_name,
                category: device.category,
                ip_address: ipAddr,
                location: locationName,
                pic_name: device.pic_name || null,
                pic_email: device.pic_email || null,
                severity: type === 'warning' ? 'warning' : (type === 'recovery' ? 'info' : 'critical'),
                trigger_source: 'Autonomous Background Daemon'
            });
        }
    } catch (e) {
        console.warn('triggerTelegramAlert error:', e.message);
    }
}

// ============================================================
// Cek device yang offline
// ============================================================
async function checkOfflineDevices() {
    try {
        // DOUBLE GUARDRAIL (Saran Wafian):
        // Filter ketat: Hanya cek perangkat yang sebelumnya ONLINE atau WARNING.
        // DILARANG mengecek perangkat 'unknown' (10 aset rak server yang belum dicolok listrik)
        // atau 'maintenance' untuk mencegah lonjakan false-alert di Telegram!
        const [staleDevices] = await db.query(`
            SELECT 
                a.asset_id, a.asset_code, a.asset_name, a.category,
                a.last_seen, a.current_status, a.priority, a.pic_user_id,
                a.ip_address, COALESCE(l.location_name, 'Head Office') AS location_name,
                a.check_interval_seconds,
                u.email AS pic_email, u.full_name AS pic_name
            FROM assets a
            LEFT JOIN locations l ON a.location_id = l.location_id
            LEFT JOIN users u ON a.pic_user_id = u.user_id
            WHERE a.current_status IN ('online', 'warning')
              AND a.current_status NOT IN ('unknown', 'maintenance')
              AND a.last_seen IS NOT NULL
              AND a.last_seen < NOW() - INTERVAL GREATEST(COALESCE(a.check_interval_seconds * 3, ?), ?) SECOND
        `, [OFFLINE_THRESHOLD_SECONDS, OFFLINE_THRESHOLD_SECONDS]);

        if (staleDevices.length === 0) return;

        console.log(`⚠️  Found ${staleDevices.length} offline device(s)`);

        for (const device of staleDevices) {
            // Guardrail lapis kedua di memori JavaScript
            if (!device.last_seen || device.current_status === 'unknown' || device.current_status === 'maintenance') {
                continue;
            }

            console.log(`🔴 Device offline: ${device.asset_code} (${device.asset_name})`);

            // Update status + catat offline_since
            await db.query(
                `UPDATE assets 
                 SET current_status = 'offline', 
                     offline_since = NOW(),
                     updated_at = NOW()
                 WHERE asset_id = ?`,
                [device.asset_id]
            );

            // Insert incident
            await db.query(
                `INSERT INTO incidents 
                    (asset_id, detected_at, incident_type, description, severity, incident_status)
                 VALUES (?, NOW(), ?, ?, ?, 'open')`,
                [
                    device.asset_id,
                    'Device Offline',
                    `Device ${device.asset_code} (${device.asset_name}) tidak merespons sejak ${device.last_seen}`,
                    device.priority === 1 ? 'high' : 'medium'
                ]
            );

            // Insert notification
            if (device.pic_user_id) {
                await db.query(
                    `INSERT INTO notifications 
                        (user_id, asset_id, title, message, is_read)
                     VALUES (?, ?, ?, ?, 0)`,
                    [
                        device.pic_user_id,
                        device.asset_id,
                        `[ALERT OFFLINE] ${device.asset_code} Terputus`,
                        `Device ${device.asset_name} (${device.asset_code}) tidak merespons sejak ${device.last_seen}`
                    ]
                );
            }

            // Publish MQTT
            const alertPayload = {
                asset_code: device.asset_code,
                asset_name: device.asset_name,
                category: device.category,
                last_seen: device.last_seen,
                priority: device.priority,
                severity: device.priority === 1 ? 'high' : 'medium',
                timestamp: new Date().toISOString()
            };

            try {
                mqttClient.publish(
                    `taims/alert/offline/${device.asset_code}`,
                    JSON.stringify(alertPayload),
                    { qos: 1, retain: false }
                );
            } catch (mqErr) {}

            console.log(`📤 Alert published: taims/alert/offline/${device.asset_code}`);
            
            // Logika Korelasi Topologi Ringan (Root Cause Analysis - RCA):
            // Deteksi apakah Switch / Router induk juga sedang bermasalah di sesi ini
            const isParentSwitchDown = staleDevices.some(d => 
                (d.category === 'Switch' || d.category === 'Router' || d.asset_code === 'SWM-01' || d.asset_code === 'MKRT-02') && 
                d.asset_code !== device.asset_code
            );
            if (isParentSwitchDown && device.category !== 'Switch' && device.category !== 'Router') {
                device.is_cascade = true;
                device.parent_device = 'SWM-01 (Switch Backbone)';
                console.log(`[RCA Topologi] Perangkat ${device.asset_code} terindikasi sebagai cascade downstream dari Switch Utama.`);
            }

            // Pemicu otomatis ke pipeline n8n & Telegram Bot Arik
            await triggerTelegramAlert('offline', device);
        }
    } catch (err) {
        console.error('❌ Offline checker error:', err.message);
    }
}

// ============================================================
// Cek device yang recovery
// Cek: last_seen > offline_since (heartbeat masuk SETELAH offline)
// ============================================================
async function checkRecoveredDevices() {
    try {
        const [recovered] = await db.query(`
            SELECT 
                a.asset_id, a.asset_code, a.asset_name, a.category,
                a.last_seen, a.offline_since, a.current_status, a.pic_user_id,
                a.ip_address, COALESCE(l.location_name, 'Head Office') AS location_name
            FROM assets a
            LEFT JOIN locations l ON a.location_id = l.location_id
            WHERE a.current_status = 'offline'
              AND a.current_status NOT IN ('unknown', 'maintenance')
              AND a.offline_since IS NOT NULL
              AND a.last_seen > a.offline_since
              AND a.last_seen >= NOW() - INTERVAL 90 SECOND
        `);

        if (recovered.length === 0) return;

        console.log(`✅ Found ${recovered.length} recovered device(s)`);

        for (const device of recovered) {
            console.log(`🟢 Device recovered: ${device.asset_code} (${device.asset_name})`);

            // Update status + clear offline_since
            await db.query(
                `UPDATE assets 
                 SET current_status = 'online', 
                     offline_since = NULL,
                     updated_at = NOW()
                 WHERE asset_id = ?`,
                [device.asset_id]
            );

            // Resolve incident
            await db.query(
                `UPDATE incidents 
                 SET incident_status = 'resolved'
                 WHERE asset_id = ? 
                   AND incident_type = 'Device Offline' 
                   AND incident_status IN ('open', 'investigating')`,
                [device.asset_id]
            );

            // Insert notification
            if (device.pic_user_id) {
                await db.query(
                    `INSERT INTO notifications 
                        (user_id, asset_id, title, message, is_read)
                     VALUES (?, ?, ?, ?, 0)`,
                    [
                        device.pic_user_id,
                        device.asset_id,
                        `[RECOVERY] ${device.asset_code} Kembali Normal`,
                        `Device ${device.asset_name} (${device.asset_code}) sudah kembali online`
                    ]
                );
            }

            // Publish MQTT
            const recoveryPayload = {
                asset_code: device.asset_code,
                asset_name: device.asset_name,
                category: device.category,
                recovered_at: new Date().toISOString(),
                timestamp: new Date().toISOString()
            };

            try {
                mqttClient.publish(
                    `taims/alert/recovery/${device.asset_code}`,
                    JSON.stringify(recoveryPayload),
                    { qos: 1, retain: false }
                );
            } catch (mqErr) {}

            console.log(`📤 Recovery published: taims/alert/recovery/${device.asset_code}`);
            
            // Pemicu otomatis pemulihan ke n8n & Telegram
            await triggerTelegramAlert('recovery', device);
        }
    } catch (err) {
        console.error('❌ Recovery checker error:', err.message);
    }
}

// ============================================================
// Start checker
// ============================================================
function startOfflineChecker() {
    console.log(`⏰ Offline checker started (interval: 30s, threshold: ${OFFLINE_THRESHOLD_SECONDS}s, anti-spam: 10m, startup grace: 60s)`);

    // STARTUP GRACE PERIOD (Usulan Wafian & Arik - Anti Restart Flapping):
    // Berikan jeda 60 detik saat backend baru startup sebelum pengecekan pertama dilakukan.
    // Hal ini memberi waktu bagi ICMP ping engine & MQTT broker untuk mengirim paket pertama,
    // sehingga tidak terjadi False Alert / lonjakan notifikasi palsu saat server me-restart!
    setTimeout(async () => {
        console.log(`🚀 [Grace Period Selesai] Memulai siklus aktif monitoring offline & recovery...`);
        await checkOfflineDevices();
        await checkRecoveredDevices();

        setInterval(async () => {
            await checkOfflineDevices();
            await checkRecoveredDevices();
        }, CHECK_INTERVAL_MS);
    }, 60000);
}

module.exports = { startOfflineChecker, checkOfflineDevices, checkRecoveredDevices, triggerTelegramAlert };
