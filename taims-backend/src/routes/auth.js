const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();

// ============================================================
// BRUTE-FORCE & PROGRESSIVE LOCKOUT TRACKER (Per-IP & Per-Akun)
// ============================================================
const loginLockTracker = new Map();

function getLockEntry(key) {
    if (!loginLockTracker.has(key)) {
        loginLockTracker.set(key, { failedAttempts: 0, penaltyStage: 0, lockUntil: 0 });
    }
    return loginLockTracker.get(key);
}

function clearLoginLockout(userId) {
    if (userId) {
        loginLockTracker.delete(`uid_${userId}`);
    }
    // Bersihkan semua kunci IP yang sedang aktif bila Superadmin mereset user
    for (const [k, v] of loginLockTracker.entries()) {
        if (k.startsWith('ip_') || k.startsWith('raw_')) {
            loginLockTracker.delete(k);
        }
    }
}
router.clearLoginLockout = clearLoginLockout;

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email/Username dan password wajib diisi'
            });
        }

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local';
        const ipKey = `ip_${clientIp}`;
        const rawInput = String(email).trim().toLowerCase();
        const legacyInput = rawInput.replace(/@taims\.id$/, '@taims.local'); // kompatibel dengan data lama

        // 1. Cari user berdasarkan email, username, atau full_name (Tanpa wildcard lama jika username sudah diubah)
        let [users] = await db.query(
            'SELECT user_id, full_name, username, email, role, password_hash FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? OR LOWER(full_name) = ? LIMIT 1',
            [rawInput, rawInput, rawInput]
        );

        if (users.length === 0 && (rawInput === 'admin@taims.id' || rawInput === 'admin')) {
            [users] = await db.query(
                "SELECT user_id, full_name, username, email, role, password_hash FROM users WHERE role = 'super_admin' LIMIT 1"
            );
        }

        const matchedUser = users.length > 0 ? users[0] : null;
        const accountKey = matchedUser ? `uid_${matchedUser.user_id}` : `raw_${rawInput}`;

        const ipState = getLockEntry(ipKey);
        const accState = getLockEntry(accountKey);
        const now = Date.now();

        // 2. Cek apakah perangkat/IP atau akun sedang dalam masa tunggu (Lockout)
        const activeLockUntil = Math.max(ipState.lockUntil || 0, accState.lockUntil || 0);
        if (activeLockUntil > now) {
            const remainingSeconds = Math.ceil((activeLockUntil - now) / 1000);
            const activeStage = Math.max(ipState.penaltyStage || 1, accState.penaltyStage || 1);
            const penaltyMinutes = Math.pow(2, activeStage - 1);
            return res.status(429).json({
                success: false,
                isLocked: true,
                remainingSeconds,
                penaltyMinutes,
                penaltyStage: activeStage,
                error: `Terlalu banyak percobaan gagal! Silakan tunggu ${remainingSeconds} detik (${penaltyMinutes} menit).`
            });
        }

        // Helper saat kredensial salah
        const handleFailedAttempt = () => {
            ipState.failedAttempts = (ipState.failedAttempts || 0) + 1;
            accState.failedAttempts = (accState.failedAttempts || 0) + 1;

            const currentFails = Math.max(ipState.failedAttempts, accState.failedAttempts);
            if (currentFails >= 3) {
                const nextStage = Math.max(ipState.penaltyStage || 0, accState.penaltyStage || 0) + 1;
                const penaltyMinutes = Math.pow(2, nextStage - 1); // 1 menit -> 2 menit -> 4 menit
                const durationSec = penaltyMinutes * 60;
                const lockUntilTs = Date.now() + (durationSec * 1000);

                ipState.failedAttempts = 0;
                ipState.penaltyStage = nextStage;
                ipState.lockUntil = lockUntilTs;

                accState.failedAttempts = 0;
                accState.penaltyStage = nextStage;
                accState.lockUntil = lockUntilTs;

                return res.status(429).json({
                    success: false,
                    isLocked: true,
                    remainingSeconds: durationSec,
                    penaltyMinutes,
                    penaltyStage: nextStage,
                    error: `Gagal login 3 kali! Akses dikunci selama ${penaltyMinutes} menit (${durationSec} detik).`
                });
            }

            const remainingAttempts = 3 - currentFails;
            return res.status(401).json({
                success: false,
                remainingAttempts,
                failedAttempts: currentFails,
                error: `Email/Username atau kata sandi salah! Sisa percobaan: ${remainingAttempts} kali lagi sebelum dikunci.`
            });
        };

        if (!matchedUser || !matchedUser.password_hash) {
            return handleFailedAttempt();
        }

        const isPasswordValid = await bcrypt.compare(password, matchedUser.password_hash);
        if (!isPasswordValid) {
            return handleFailedAttempt();
        }

        // 3. Login Berhasil -> Reset seluruh counter gagal & penalti
        loginLockTracker.delete(ipKey);
        loginLockTracker.delete(accountKey);

        const token = jwt.sign(
            { user_id: matchedUser.user_id, email: matchedUser.email, role: matchedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES || '24h' }
        );

        res.status(200).json({
            success: true,
            data: {
                token,
                expires_in: 86400,
                user: {
                    user_id: matchedUser.user_id,
                    full_name: matchedUser.full_name,
                    username: matchedUser.username || matchedUser.email.split('@')[0],
                    email: matchedUser.email,
                    role: matchedUser.role
                }
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/auth/guest
// Akses cepat pengunjung / user (Read-Only)
router.post('/guest', async (req, res) => {
    try {
        const token = jwt.sign(
            { user_id: 0, email: 'guest@taims.id', role: 'guest', full_name: 'User (Tamu)' },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );
        res.status(200).json({
            success: true,
            data: {
                token,
                expires_in: 43200,
                user: {
                    user_id: 0,
                    username: 'guest',
                    full_name: 'User',
                    role: 'guest',
                    title: 'User (Read-Only)'
                }
            }
        });
    } catch (err) {
        console.error('Guest login error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT user_id, full_name, email, role FROM users WHERE user_id = ?',
            [req.user.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
        }

        res.status(200).json({ success: true, data: users[0] });
    } catch (err) {
        console.error('Me error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// ==============================
// POST /api/auth/logout
// Blacklist token biar nggak bisa dipakai lagi
// ==============================
router.post('/logout', authenticate, async (req, res) => {
    try {
        const token = req.token;
        const decoded = jwt.decode(token);
        const expiresAt = new Date(decoded.exp * 1000); // exp JWT dalam detik

        // Simpan ke blacklist
        await db.query(
            `INSERT INTO token_blacklist (token, user_id, expires_at)
             VALUES (?, ?, ?)`,
            [token, req.user.user_id, expiresAt]
        );

        // Cleanup: hapus token yang sudah expired dari blacklist
        await db.query(
            'DELETE FROM token_blacklist WHERE expires_at < NOW()'
        );

        res.status(200).json({
            success: true,
            message: 'Logout berhasil. Token sudah di-revoke.'
        });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({
                success: false,
                error: 'Password lama dan baru wajib diisi'
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password baru minimal 6 karakter'
            });
        }

        const [users] = await db.query(
            'SELECT user_id, password_hash FROM users WHERE user_id = ?',
            [req.user.user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User tidak ditemukan'
            });
        }

        const isValid = await bcrypt.compare(old_password, users[0].password_hash);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                error: 'Password lama salah'
            });
        }

        const newHash = await bcrypt.hash(new_password, 10);

        await db.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [newHash, req.user.user_id]
        );

        res.status(200).json({
            success: true,
            message: 'Password berhasil diubah'
        });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


// ============================================================
// SISTEM LUPA PASSWORD & RESET KATA SANDI RESMI (SMTP / NODEMAILER & TELEGRAM)
// ============================================================
function getMailTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT, 10) || 465;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const user = process.env.SMTP_USER || '';
    const pass = process.env.SMTP_PASS || '';

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

async function sendTelegramOtp(fullName, email, otpCode, expiresMinutes = 15) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
        return false;
    }

    const expiresTime = new Date(Date.now() + expiresMinutes * 60 * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const messageHtml = '🔐 <b>[T-AIMS SECURITY ALERT]</b>\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        '📌 <b>Permintaan Reset Kata Sandi</b>\n' +
        '👤 <b>Pengguna:</b> ' + fullName + '\n' +
        '📧 <b>Email:</b> ' + email + '\n' +
        '🔑 <b>KODE OTP RAHASIA:</b> <code>' + otpCode + '</code>\n' +
        '⏳ <b>Masa Berlaku:</b> ' + expiresMinutes + ' Menit (Sampai ' + expiresTime + ' WIB)\n' +
        '━━━━━━━━━━━━━━━━━━━━\n' +
        '⚠️ <i>Demi keamanan akun T-AIMS Anda, jangan bagikan kode OTP ini kepada siapa pun.</i>';

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: messageHtml,
                parse_mode: 'HTML'
            }),
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (res.ok) {
            console.log(`[AUTH-FORGOT] Berhasil mengirim kode OTP via Telegram Bot ke chat: ${chatId}`);
            return true;
        }
    } catch (err) {
        console.warn(`[AUTH-FORGOT] Telegram Bot kirim OTP gagal/timeout:`, err.message);
    }
    return false;
}

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email atau username wajib diisi'
            });
        }

        const rawInput = String(email).trim().toLowerCase();

        // Cari user berdasarkan email, username, atau nama lengkap
        let [users] = await db.query(
            'SELECT user_id, full_name, username, email FROM users WHERE LOWER(email) = ? OR LOWER(username) = ? OR LOWER(full_name) = ? LIMIT 1',
            [rawInput, rawInput, rawInput]
        );

        if (users.length === 0 && (rawInput === 'admin@taims.id' || rawInput === 'admin')) {
            [users] = await db.query(
                "SELECT user_id, full_name, username, email FROM users WHERE role = 'super_admin' LIMIT 1"
            );
        }

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Akun dengan email/username tersebut tidak ditemukan di sistem T-AIMS'
            });
        }

        const user = users[0];

        // Buat 6-digit OTP code rahasia
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const tokenToStore = otpCode;

        // Waktu kedaluwarsa 15 menit
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Hapus request aktif lama yang belum dipakai untuk user ini
        await db.query(
            'DELETE FROM password_resets WHERE user_id = ? OR email = ?',
            [user.user_id, user.email]
        );

        // Simpan ke tabel password_resets
        await db.query(
            `INSERT INTO password_resets (user_id, email, token, expires_at, is_used)
             VALUES (?, ?, ?, ?, 0)`,
            [user.user_id, user.email, tokenToStore, expiresAt]
        );

        console.log(`[AUTH-FORGOT] Permintaan reset kata sandi: ${user.full_name} (${user.email}) | OTP: ${otpCode} | Berlaku 15 Menit`);

        // 1. Kirim notifikasi rahasia via Telegram Bot
        const telegramSent = await sendTelegramOtp(user.full_name, user.email, otpCode, 15);

        // 2. Kirim email resmi via nodemailer jika SMTP dikonfigurasi
        let emailSent = false;
        const transporter = getMailTransporter();

        if (transporter) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_FROM || '"T-AIMS Security" <noreply@t-aims.teknolab.biz.id>',
                    to: user.email,
                    subject: '[T-AIMS Security] Kode Verifikasi Reset Kata Sandi Anda',
                    html: `
                        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #0b1320; color: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid rgba(0, 240, 255, 0.3);">
                            <div style="text-align: center; margin-bottom: 24px;">
                                <h2 style="color: #00F0FF; margin: 0; font-size: 24px; letter-spacing: 1px;">T-AIMS SECURITY</h2>
                                <p style="color: #94A3B8; font-size: 13px; margin-top: 4px;">Asset & Infrastructure Monitoring System - PT Teknolab Caraka Internasional</p>
                            </div>
                            <div style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                                <p style="margin-top: 0; color: #E2E8F0; font-size: 15px;">Halo <strong>${user.full_name}</strong>,</p>
                                <p style="color: #94A3B8; font-size: 14px; line-height: 1.6;">Kami menerima permintaan untuk mengatur ulang kata sandi akun T-AIMS Anda. Gunakan kode verifikasi di bawah ini untuk melanjutkan:</p>
                                <div style="text-align: center; margin: 24px 0;">
                                    <span style="display: inline-block; background: rgba(0, 240, 255, 0.12); border: 2px dashed #00F0FF; color: #00F0FF; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 28px; border-radius: 8px;">
                                        ${otpCode}
                                    </span>
                                </div>
                                <p style="color: #F87171; font-size: 13px; text-align: center; margin-bottom: 0;">
                                    ⚠️ Kode verifikasi ini berlaku selama <strong>15 menit</strong>. Jangan berikan kode ini kepada siapa pun.
                                </p>
                            </div>
                            <p style="color: #64748B; font-size: 12px; line-height: 1.5; text-align: center; margin: 0;">
                                Jika Anda tidak meminta reset kata sandi, abaikan email ini. Akun Anda tetap aman.<br>
                                &copy; 2026 PT Teknolab Caraka Internasional &bull; T-AIMS Cloud
                            </p>
                        </div>
                    `
                };
                await transporter.sendMail(mailOptions);
                emailSent = true;
                console.log(`[AUTH-FORGOT] Email berhasil dikirim ke: ${user.email}`);
            } catch (mErr) {
                console.warn(`[AUTH-FORGOT] Gagal mengirim email via SMTP (${mErr.message}).`);
            }
        }

        // Response aman (TANPA mengekspos OTP ke publik)
        return res.status(200).json({
            success: true,
            message: 'Kode verifikasi keamanan 6-digit telah dibuat dan dikirimkan secara rahasia ke kontak & surel resmi akun Anda. Silakan periksa pesan masuk Anda.',
            email: user.email,
            email_sent: emailSent,
            telegram_sent: telegramSent,
            expires_in_minutes: 15
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({ success: false, error: 'Terjadi kesalahan server saat memproses lupa kata sandi' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, new_password, confirm_password } = req.body;

        if (!token || !new_password) {
            return res.status(400).json({
                success: false,
                error: 'Kode verifikasi / token dan kata sandi baru wajib diisi'
            });
        }

        if (confirm_password && new_password !== confirm_password) {
            return res.status(400).json({
                success: false,
                error: 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru'
            });
        }

        if (String(new_password).length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Kata sandi baru minimal harus 6 karakter'
            });
        }

        const cleanToken = String(token).trim();

        // Periksa apakah token ada, belum terpakai (is_used = 0), dan belum expired
        const [rows] = await db.query(
            `SELECT id, user_id, email, token, expires_at, is_used 
             FROM password_resets 
             WHERE token = ? AND is_used = 0 AND expires_at > NOW() 
             ORDER BY created_at DESC LIMIT 1`,
            [cleanToken]
        );

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Kode verifikasi tidak valid atau telah kedaluwarsa (lebih dari 15 menit). Silakan minta kode baru.'
            });
        }

        const resetEntry = rows[0];

        // Hash password baru dengan bcrypt (10 salt rounds)
        const newHash = await bcrypt.hash(new_password, 10);

        // Update password pengguna di tabel users
        if (resetEntry.user_id) {
            await db.query(
                'UPDATE users SET password_hash = ? WHERE user_id = ?',
                [newHash, resetEntry.user_id]
            );
        } else {
            await db.query(
                'UPDATE users SET password_hash = ? WHERE LOWER(email) = ?',
                [newHash, resetEntry.email.toLowerCase()]
            );
        }

        // Tandai token sudah dipakai (is_used = 1)
        await db.query(
            'UPDATE password_resets SET is_used = 1 WHERE id = ?',
            [resetEntry.id]
        );

        // Hapus lockout jika user sedang terkunci percobaan gagal login
        if (resetEntry.user_id && typeof clearLoginLockout === 'function') {
            clearLoginLockout(resetEntry.user_id);
        }

        console.log(`[AUTH-RESET] Sukses! Kata sandi akun ${resetEntry.email} berhasil diperbarui.`);

        return res.status(200).json({
            success: true,
            message: 'Kata sandi berhasil diperbarui! Silakan masuk ke T-AIMS dengan kata sandi baru Anda.'
        });
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ success: false, error: 'Terjadi kesalahan server saat memperbarui kata sandi' });
    }
});

module.exports = router;
