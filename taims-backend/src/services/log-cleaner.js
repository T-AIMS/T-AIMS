const db = require('../config/db');
const cron = require('node-cron');

// ============================================================
// 1. Fungsi untuk meringkas data sebelum dihapus
// ============================================================
async function archiveOldLogs() {
    console.log('📦 Memulai pengarsipan (ringkasan) log lama...');
    try {
        // Ambil semua tanggal unik yang datanya mau dihapus (lebih dari 30 hari)
        const [dates] = await db.query(`
            SELECT DISTINCT DATE(check_time) as log_date 
            FROM monitoring_logs 
            WHERE check_time < NOW() - INTERVAL 30 DAY
        `);

        if (dates.length === 0) {
            console.log('✅ Tidak ada data lama yang perlu diarsipkan.');
            return;
        }

        for (const row of dates) {
            // Format tanggal jadi YYYY-MM-DD
            const dateStr = new Date(row.log_date).toISOString().split('T')[0];
            
            // Hitung ringkasan per device untuk tanggal tersebut
            const [stats] = await db.query(`
                SELECT 
                    asset_id,
                    SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) AS online,
                    SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) AS offline,
                    SUM(CASE WHEN status = 'warning' THEN 1 ELSE 0 END) AS warning
                FROM monitoring_logs
                WHERE DATE(check_time) = ?
                GROUP BY asset_id
            `, [dateStr]);

            // Simpan ke tabel arsip
            for (const stat of stats) {
                await db.query(`
                    INSERT INTO monitoring_daily_stats (stat_date, asset_id, total_online, total_offline, total_warning)
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        total_online = VALUES(total_online),
                        total_offline = VALUES(total_offline),
                        total_warning = VALUES(total_warning)
                `, [dateStr, stat.asset_id, stat.online, stat.offline, stat.warning]);
            }
            console.log(`📦 Tanggal ${dateStr} berhasil diringkas.`);
        }
    } catch (err) {
        console.error('❌ Gagal mengarsipkan log:', err.message);
        throw err; // Stop proses, jangan sampai hapus data kalau gagal ngeringkas
    }
}

// ============================================================
// 2. Fungsi untuk menghapus log yang sudah diarsipkan
// ============================================================
async function deleteOldLogs() {
    try {
        console.log('🧹 Menghapus log mentah yang sudah diarsipkan...');
        const [result] = await db.query(
            'DELETE FROM monitoring_logs WHERE check_time < NOW() - INTERVAL 30 DAY'
        );
        console.log(`✅ Berhasil menghapus ${result.affectedRows} baris log lama.`);
    } catch (err) {
        console.error('❌ Gagal menghapus log:', err.message);
    }
}

// ============================================================
// 3. Start Cron Job (Jalan tiap hari jam 00:00)
// ============================================================
function startLogCleaner() {
    console.log('⏰ Log cleaner & archiver started (tiap tengah malam)');

    cron.schedule('0 0 * * *', async () => {
        console.log('--- MEMULAI PROSES CLEANUP HARIAN ---');
        // 1. Arsipkan dulu
        await archiveOldLogs();
        // 2. Baru hapus
        await deleteOldLogs();
        console.log('--- PROSES CLEANUP SELESAI ---');
    });
}

module.exports = { startLogCleaner, archiveOldLogs, deleteOldLogs };