const nodemailer = require('nodemailer');

/**
 * Daftar Resmi 11 Email Anggota Tim Pra-PKL Teknolab (Menu Informasi Proyek)
 * Sesuai Struktur Tim Shift 1 (Pagi) & Shift 2 (Malam)
 */
const DEFAULT_TEAM_ALERT_EMAILS = [
    // Shift 2 • Malam (16.00 - 01.00 WIB)
    'awangtgprofesional@gmail.com',     // Dzakwan Miftahussobirin (Ketua Tim & Integrasi Sistem)
    'wafianzaidan@gmail.com',           // Wafian (Infrastruktur Peladen, Jaringan & DevOps)
    'arickferdiansyah@gmail.com',       // Arick Ferdiansyah (Perekayasa Otomasi & Notifikasi)
    'dikayogapratama18@gmail.com',      // Dika Yoga Pratama (Pengembang Antarmuka Dasbor)
    'ahzizsaputra@gmail.com',           // Ahmad Aziz (Perancang Antarmuka & Visualisasi Data)
    'rezatriwardana7@gmail.com',        // Reza Tri Wardana (Penguji Mutu, Pengujian & Dokumentasi)

    // Shift 1 • Pagi (07.00 - 16.00 WIB)
    'damarmunajad7@gmail.com',          // Damar Munajad (Koordinator Proyek & Analis Sistem)
    'rzafahmi351@gmail.com',            // Ahmad Reza Fahmi (Pengembang Sistem Backend & API)
    'faidatrismaamelia@gmail.com',      // Faida Trisma Amelia (Perekayasa Basis Data & Manajemen Aset)
    'ilfnamufarika4@gmail.com',         // Ilvina Muvarika (Perekayasa Integrasi IoT & Perangkat)
    'c11anandadwisusanti@gmail.com',    // Ananda Dwi Susanti (Perekayasa Pemantauan Jaringan & Perangkat)
    
    // Central NOC Inbox
    'noc-alerts@teknolab.id'
];

/**
 * Service Pengirim Notifikasi Email Resmi T-AIMS
 * Sesuai Dokumen PKL Hal. 11 & Integration Checklist 5.5
 */
function createTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
    });
}

/**
 * Kirim Email Notifikasi Insiden / Warning / Recovery Resmi T-AIMS
 * Mendukung Multi-Recipient (Seluruh 11 Anggota Tim Teknolab & PIC Sekaligus)
 */
async function sendIncidentAlertEmail({ asset_code, asset_name, category, location, ip_address, severity, message, type, recipient_email, pic_email, pic_name }) {
    // 1. Ekstraksi seluruh target penerima (Multi-Email dipisah koma/titik koma dari .env)
    const envRaw = process.env.ALERT_EMAIL || '';
    const envTargets = envRaw.split(/[,;]+/).map(e => e.trim()).filter(e => e && e.includes('@'));

    // Jika .env berisi daftar khusus gunakan itu; jika tidak, gunakan default 11 anggota tim
    const baseList = envTargets.length > 0 ? envTargets : DEFAULT_TEAM_ALERT_EMAILS;
    const recipientsSet = new Set(baseList);

    // Tambahkan custom recipient jika ada yang di-input manual saat testing / dashboard
    if (recipient_email) {
        recipient_email.split(/[,;]+/).map(e => e.trim()).filter(e => e && e.includes('@')).forEach(e => recipientsSet.add(e));
    }

    // Tambahkan email PIC perangkat dari basis data MySQL (agar penanggung jawab langsung tahu)
    if (pic_email && pic_email.includes('@')) {
        recipientsSet.add(pic_email.trim());
    }

    if (recipientsSet.size === 0) {
        recipientsSet.add('noc-alerts@teknolab.id');
    }

    const alertTarget = Array.from(recipientsSet).join(', ');
    const sender = process.env.EMAIL_FROM || `T-AIMS Alert System <${process.env.SMTP_USER || 'no-reply@teknolab.id'}>`;

    const transporter = createTransporter();
    if (!transporter) {
        console.log(`[SMTP Alert] Kredensial SMTP belum diset di .env. Simulasi email alert tercatat untuk: ${alertTarget}`);
        return { success: true, simulated: true, target: alertTarget, count: recipientsSet.size };
    }

    const nowStr = new Date().toLocaleString('id-ID') + ' WIB';
    const isWarning = severity === 'warning' || type === 'warning';
    const isRecovery = severity === 'info' || type === 'recovery';

    let subject = '';
    let badgeColor = '#EF4444';
    let statusText = 'CRITICAL INCIDENT (OFFLINE)';

    if (isRecovery) {
        subject = `[RESOLVED] ${asset_code} - ${asset_name} Kembali Normal`;
        badgeColor = '#10B981';
        statusText = 'RECOVERY (NORMAL / ONLINE)';
    } else if (isWarning) {
        subject = `[WARNING] ${asset_code} - Deteksi Dini Anomali Jaringan`;
        badgeColor = '#F59E0B';
        statusText = 'EARLY WARNING (POTENSI ANOMALI)';
    } else {
        subject = `[CRITICAL ALERT] ${asset_code} - ${asset_name} Terputus`;
        badgeColor = '#EF4444';
        statusText = 'CRITICAL ALERT (OFFLINE)';
    }

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: auto; border: 1px solid #1E293B; border-radius: 8px; overflow: hidden; background: #0F172A; color: #F8FAFC;">
        <div style="background: ${badgeColor}; padding: 16px 20px; color: #FFFFFF;">
            <h2 style="margin: 0; font-size: 18px; font-weight: bold;">T-AIMS NOC ALERT GATEWAY</h2>
            <span style="font-size: 12px; opacity: 0.9;">PT Teknolab Caraka Internasional • Enterprise Monitoring</span>
        </div>
        <div style="padding: 20px;">
            <div style="display: inline-block; background: ${badgeColor}22; border: 1px solid ${badgeColor}; color: ${badgeColor}; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-bottom: 15px;">
                ${statusText}
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #CBD5E1; margin-bottom: 20px;">
                <tr><td style="padding: 6px 0; width: 130px; font-weight: bold; color: #94A3B8;">Kode Aset:</td><td style="color: #38BDF8; font-weight: bold;">${asset_code}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #94A3B8;">Nama Perangkat:</td><td>${asset_name}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #94A3B8;">Kategori:</td><td>${category}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #94A3B8;">IP Address:</td><td style="font-family: monospace;">${ip_address}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #94A3B8;">Lokasi:</td><td>${location}</td></tr>
                ${pic_name ? `<tr><td style="padding: 6px 0; font-weight: bold; color: #94A3B8;">PIC Terkait:</td><td>${pic_name} ${pic_email ? '(' + pic_email + ')' : ''}</td></tr>` : ''}
                <tr><td style="padding: 6px 0; font-weight: bold; color: #94A3B8;">Waktu Kejadian:</td><td>${nowStr}</td></tr>
                <tr><td style="padding: 6px 0; font-weight: bold; color: #94A3B8;">Daftar Penerima:</td><td style="font-size: 11px; color: #38BDF8; line-height: 1.4;">${alertTarget}</td></tr>
            </table>
            <div style="background: #1E293B; border-left: 4px solid #38BDF8; padding: 12px 14px; border-radius: 4px; font-size: 12.5px; line-height: 1.5; color: #E2E8F0; margin-bottom: 20px;">
                <strong>Ringkasan Insiden:</strong><br>
                ${(message || '').replace(/<[^>]*>/g, '')}
            </div>
            <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #334155; font-size: 11px; color: #64748B;">
                Email otomatis dari T-AIMS Alert Engine (Arik & Dzakwan) • Multi-Channel NOC Notification.<br>
                Tembusan disiarkan ke 11 Anggota Tim Pengembang Teknolab.<br>
                Akses Dashboard: <a href="https://t-aims.teknolab.biz.id" style="color: #38BDF8; text-decoration: none;">https://t-aims.teknolab.biz.id</a>
            </div>
        </div>
    </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: sender,
            to: alertTarget,
            subject: subject,
            html: htmlContent
        });
        console.log(`[SMTP Alert] Email terkirim ke [${alertTarget}] (MessageId: ${info.messageId})`);
        return { success: true, messageId: info.messageId, target: alertTarget, count: recipientsSet.size };
    } catch (err) {
        console.warn(`[SMTP Alert] Gagal kirim email via SMTP ke [${alertTarget}]:`, err.message);
        return { success: false, error: err.message, target: alertTarget, count: recipientsSet.size };
    }
}

module.exports = { sendIncidentAlertEmail, DEFAULT_TEAM_ALERT_EMAILS };
