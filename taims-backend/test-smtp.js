/**
 * T-AIMS - Script Pengujian Mandiri SMTP Email Alert Gateway
 * Sesuai Dokumen PKL Hal. 11 & Target Checklist 5.5
 * 
 * Penggunaan:
 *   cd taims-backend
 *   node test-smtp.js
 * 
 * Opsi:
 *   node test-smtp.js custom@email.com
 */

require('dotenv').config();
const { sendIncidentAlertEmail } = require('./src/services/email-service');

async function runSmtpTest() {
    console.log('='.repeat(65));
    console.log('  T-AIMS NOC ALERT GATEWAY — PENGUJIAN EMAIL ALERT VIA SMTP');
    console.log('='.repeat(65));

    const targetEmail = process.argv[2] || process.env.ALERT_EMAIL || 'noc-alerts@teknolab.id';
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = process.env.SMTP_PORT || '465';
    const user = process.env.SMTP_USER || '(belum diset)';
    const hasPass = !!(process.env.SMTP_PASS && process.env.SMTP_PASS.trim());

    console.log(`[i] SMTP Host   : ${host}:${port}`);
    console.log(`[i] SMTP User   : ${user}`);
    console.log(`[i] SMTP Pass   : ${hasPass ? '******** (Tersedia)' : 'KOSONG (Mode Simulasi)'}`);
    console.log(`[i] Target Email: ${targetEmail}`);
    console.log('-'.repeat(65));

    console.log('[*] Mengirim paket simulasi insiden CRITICAL (MKRT-02 Offline)...');

    const result = await sendIncidentAlertEmail({
        asset_code: 'MKRT-02',
        asset_name: 'MikroTik Core Router Head Office',
        category: 'Router',
        location: 'Ruang Server Lantai 1',
        ip_address: '192.168.1.1',
        severity: 'critical',
        recipient_email: targetEmail,
        type: 'offline',
        message: 'Perangkat tidak merespons denyut sinyal heartbeat selama 90 detik. Seluruh traffic VLAN 10 dan VLAN 20 terancam putus.'
    });

    console.log('-'.repeat(65));
    if (result && result.success) {
        if (result.simulated) {
            console.log('✅ STATUS: SIMULASI BERHASIL (DRY-RUN)');
            console.log(`   Pesan email berhasil diformat dalam kartu HTML NOC.`);
            console.log(`   Untuk pengiriman riil ke inbox, isi variabel SMTP_PASS di .env.`);
        } else {
            console.log('🎉 STATUS: PENGIRIMAN EMAIL RIIL SUKSES 100%!');
            console.log(`   Message ID : ${result.messageId}`);
            console.log(`   Terkirim ke: ${result.target}`);
            console.log(`   Silakan cek Inbox / Spam di ${result.target}`);
        }
    } else {
        console.log('❌ STATUS: GAGAL MENGIRIM EMAIL');
        console.log(`   Error: ${result ? result.error : 'Unknown error'}`);
    }
    console.log('='.repeat(65));
}

runSmtpTest();
