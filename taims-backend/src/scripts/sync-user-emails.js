/**
 * Script untuk menyinkronkan email pengguna di tabel `users`
 * dengan email resmi Google (Gmail) 11 anggota tim Teknolab.
 * Berguna agar fitur Lupa Sandi (OTP) dan notifikasi email dapat terkirim ke Gmail asli.
 */
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const db = require('../config/db');

const teamEmailMappings = [
    { username: 'dzakwan', id: 1, email: 'awangtgprofesional@gmail.com', name: 'Dzakwan Miftahussobirin' },
    { username: 'damar', id: 2, email: 'damarmunajad7@gmail.com', name: 'Damar Munajad' },
    { username: 'fahmi', id: 3, email: 'rzafahmi351@gmail.com', name: 'Ahmad Reza Fahmi' },
    { username: 'faida', id: 4, email: 'faidatrismaamelia@gmail.com', name: 'Faida Trisma Amelia' },
    { username: 'ilvina', id: 5, email: 'ilfnamufarika4@gmail.com', name: 'Ilvina Muvarika' },
    { username: 'ananda', id: 6, email: 'c11anandadwisusanti@gmail.com', name: 'Ananda Dwi Susanti' },
    { username: 'dika', id: 7, email: 'dikayogapratama18@gmail.com', name: 'Dika Yoga Pratama' },
    { username: 'aziz', id: 8, email: 'ahzizsaputra@gmail.com', name: 'Ahmad Aziz Saputra' },
    { username: 'arik', id: 9, email: 'arickferdiansyah@gmail.com', name: 'Arik Ferdiansyah' },
    { username: 'wafian', id: 10, email: 'wafianzaidan@gmail.com', name: 'Wafian Zaidan' },
    { username: 'reza', id: 11, email: 'rezatriwardana7@gmail.com', name: 'Reza Tri Wardana' }
];

async function runEmailSync() {
    console.log('=== MEMULAI SINKRONISASI EMAIL RESMI PENGGUNA T-AIMS ===');
    let updatedCount = 0;

    for (const member of teamEmailMappings) {
        try {
            const [result] = await db.query(
                'UPDATE users SET email = ? WHERE username = ? OR user_id = ?',
                [member.email, member.username, member.id]
            );
            console.log(`[OK] ${member.name} (${member.username}) -> ${member.email} (Affected: ${result.affectedRows})`);
            updatedCount += result.affectedRows;
        } catch (err) {
            console.error(`[ERROR] Gagal mengupdate email untuk ${member.username}:`, err.message);
        }
    }

    console.log(`=== SELESAI: ${updatedCount} baris pengguna berhasil diperbarui! ===`);
    process.exit(0);
}

runEmailSync().catch(e => {
    console.error('Fatal sync error:', e);
    process.exit(1);
});
