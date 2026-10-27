/**
 * Script Uji Tembak Integrasi n8n & Bot Telegram (Dzakwan & Arik)
 * T-AIMS (Teknolab Asset & Infrastructure Monitoring System)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Baca .env dari taims-backend
const envPath = path.resolve(__dirname, '../taims-backend/.env');
let envConfig = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      envConfig[key] = val;
    }
  }
}

const n8nAlertUrl = envConfig.N8N_ALERT_WEBHOOK || 'http://192.168.1.49:5678/webhook/taims-alert';
const n8nRecoveryUrl = envConfig.N8N_RECOVERY_WEBHOOK || 'http://192.168.1.49:5678/webhook/taims-recovery';
const n8nAiUrl = envConfig.N8N_AI_WEBHOOK || 'http://192.168.1.49:5678/webhook/ai-recommendation';
const botToken = envConfig.TELEGRAM_BOT_TOKEN || '8944593836:AAEP2bDCO53srpWR3gdKXY6CHQ13Ni8OtPA';
let chatId = envConfig.TELEGRAM_CHAT_ID || '';

async function testOfflineWebhook() {
  console.log('\n======================================================');
  console.log('🚀 [1/3] UJI TEMBAK N8N: ALERT OFFLINE');
  console.log('Target URL :', n8nAlertUrl);
  console.log('======================================================');

  const payload = {
    type: 'offline',
    asset_code: 'AST-L1-002',
    asset_name: 'CCTV Lobby Utama',
    category: 'CCTV',
    ip_address: '192.168.1.101',
    location: 'Lantai 1 - Gedung Utama',
    status: 'offline',
    timestamp: new Date().toISOString(),
    message: '🔴 [ALERT OFFLINE] Perangkat CCTV Lobby Utama (192.168.1.101) terputus dari jaringan!'
  };

  try {
    const res = await fetch(n8nAlertUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log('HTTP Status :', res.status, res.statusText);
    console.log('Respons n8n :', text);
    if (res.ok) console.log('✅ SUKSES: Webhook Offline berhasil diterima n8n Arik!');
    else console.log('❌ GAGAL: Webhook Offline mengembalikan status error.');
  } catch (err) {
    console.error('❌ ERROR KONEKSI:', err.message);
  }
}

async function testRecoveryWebhook() {
  console.log('\n======================================================');
  console.log('🚀 [2/3] UJI TEMBAK N8N: ALERT RECOVERY (PULIH)');
  console.log('Target URL :', n8nRecoveryUrl);
  console.log('======================================================');

  const payload = {
    type: 'recovery',
    asset_code: 'AST-L1-002',
    asset_name: 'CCTV Lobby Utama',
    category: 'CCTV',
    ip_address: '192.168.1.101',
    location: 'Lantai 1 - Gedung Utama',
    status: 'online',
    downtime_duration: '3 menit 45 detik',
    timestamp: new Date().toISOString(),
    message: '🟢 [RECOVERY ONLINE] Perangkat CCTV Lobby Utama (192.168.1.101) telah kembali pulih dan normal!'
  };

  try {
    const res = await fetch(n8nRecoveryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log('HTTP Status :', res.status, res.statusText);
    console.log('Respons n8n :', text);
    if (res.ok) console.log('✅ SUKSES: Webhook Recovery berhasil diterima n8n Arik!');
    else console.log('❌ GAGAL: Webhook Recovery mengembalikan status error.');
  } catch (err) {
    console.error('❌ ERROR KONEKSI:', err.message);
  }
}

async function testAiWebhook() {
  console.log('\n======================================================');
  console.log('🚀 [3/3] UJI TEMBAK N8N: DASHBOARD AI RECOMMENDATION');
  console.log('Target URL :', n8nAiUrl);
  console.log('======================================================');

  const payload = {
    generated_at: new Date().toISOString(),
    period_days: 30,
    summary: {
      total_devices: 15,
      online: 14,
      offline: 1,
      warning: 0,
      availability_percent: 93.3
    },
    offline_assets: [
      {
        asset_code: 'AST-L1-002',
        asset_name: 'CCTV-01 (Lobby Utama)',
        category: 'CCTV',
        last_seen: new Date().toISOString()
      }
    ],
    top_issues: [
      {
        asset_code: 'AST-L1-002',
        asset_name: 'CCTV-01 (Lobby Utama)',
        incident_count: 3
      }
    ]
  };

  try {
    const res = await fetch(n8nAiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    console.log('HTTP Status :', res.status, res.statusText);
    const recText = json.ai_response || json.recommendation || JSON.stringify(json);
    console.log('Respons AI (Cuplikan) :\n', recText.slice(0, 300) + '...\n');
    if (res.ok) console.log('✅ SUKSES: Webhook AI Recommendation mengembalikan rekomendasi preskriptif!');
    else console.log('❌ GAGAL: Webhook AI mengembalikan status error.');
  } catch (err) {
    console.error('❌ ERROR KONEKSI:', err.message);
  }
}

async function detectTelegramChatId() {
  console.log('\n======================================================');
  console.log('🔍 DETEKSI CHAT ID TELEGRAM BOT (@taims_alert_arik_bot)');
  console.log('Bot Token  :', botToken);
  console.log('======================================================');
  console.log('Petunjuk: Pastikan kamu atau Arik sudah membuka Telegram,');
  console.log('cari @taims_alert_arik_bot, lalu klik "START" atau kirim pesan "halo".\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const data = await res.json();
    if (!data.ok) {
      console.log('❌ Gagal menghubungi Telegram API:', data.description);
      return null;
    }

    if (!data.result || data.result.length === 0) {
      console.log('⚠️ Belum ada pesan masuk ke bot.');
      console.log('Silakan buka Telegram -> Cari @taims_alert_arik_bot -> Klik tombol START.');
      return null;
    }

    console.log(`✅ Ditemukan ${data.result.length} interaksi dengan bot!`);
    const lastUpdate = data.result[data.result.length - 1];
    const msg = lastUpdate.message || lastUpdate.channel_post || lastUpdate.my_chat_member;
    const chat = msg?.chat;

    if (chat) {
      console.log('--------------------------------------------------');
      console.log('🎯 CHAT ID DITEMUKAN : ', chat.id);
      console.log('Nama Pengirim / Grup : ', chat.first_name || chat.title || 'Unknown');
      console.log('Username             : ', chat.username ? `@${chat.username}` : '(tidak ada username)');
      console.log('Tipe Chat            : ', chat.type);
      console.log('Pesan Terakhir       : ', msg.text || '(non-teks)');
      console.log('--------------------------------------------------');

      // Jika sudah ada Grup ID yang ditentukan, jangan ditimpa sembarangan
      if (!chatId || !chatId.startsWith('-')) {
        chatId = String(chat.id);
        saveChatIdToEnv(chatId);
      } else {
        console.log(`ℹ️ Tetap menggunakan ID Grup Telegram Resmi: ${chatId}`);
      }
      return chatId;
    }
  } catch (err) {
    console.error('❌ Error deteksi Telegram:', err.message);
  }
  return null;
}

function saveChatIdToEnv(newChatId) {
  try {
    let content = fs.readFileSync(envPath, 'utf8');
    content = content.replace(/TELEGRAM_CHAT_ID=.*/, `TELEGRAM_CHAT_ID=${newChatId}`);
    fs.writeFileSync(envPath, content, 'utf8');
    console.log(`💾 Berhasil menyimpan TELEGRAM_CHAT_ID=${newChatId} ke taims-backend/.env!`);

    const prodEnvPath = path.resolve(__dirname, '../taims-backend/.env.production');
    if (fs.existsSync(prodEnvPath)) {
      let prodContent = fs.readFileSync(prodEnvPath, 'utf8');
      prodContent = prodContent.replace(/TELEGRAM_CHAT_ID=.*/, `TELEGRAM_CHAT_ID=${newChatId}`);
      fs.writeFileSync(prodEnvPath, prodContent, 'utf8');
      console.log(`💾 Berhasil menyimpan TELEGRAM_CHAT_ID=${newChatId} ke taims-backend/.env.production!`);
    }
  } catch (e) {
    console.log('Catatan: Gagal menulis otomatis ke .env:', e.message);
  }
}

async function sendTestTelegramMessage(targetChatId) {
  const activeChatId = targetChatId || chatId;
  console.log('\n======================================================');
  console.log('📲 UJI TEMBAK PESAN LANGSUNG KE TELEGRAM BOT');
  console.log('Target Chat ID :', activeChatId || '(Belum diset)');
  console.log('======================================================');

  if (!activeChatId) {
    console.log('⚠️ Chat ID belum diketahui!');
    console.log('Silakan jalankan opsi 4 (Deteksi Chat ID) terlebih dahulu setelah mengklik START di Telegram.\n');
    return;
  }

  const messageText = `🚀 <b>[T-AIMS LIVE INTEGRATION TEST]</b>\n` +
    `Halo Dzakwan & Arik!\n\n` +
    `Uji tembak bot Telegram dari sistem <b>T-AIMS Monitoring Engine</b> berhasil 100%!\n\n` +
    `🕒 <b>Waktu:</b> ${new Date().toLocaleString('id-ID')}\n` +
    `📡 <b>Pipeline:</b> Express Backend ➡️ Telegram Bot API\n` +
    `🤖 <b>Bot:</b> @taims_alert_arik_bot\n` +
    `✅ <b>Status:</b> Siap integrasi CloudPanel VPS!`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: activeChatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });
    const result = await res.json();
    if (result.ok) {
      console.log('✅ SUKSES 100%! Pesan uji coba berhasil masuk ke Telegram Anda!');
    } else {
      console.log('❌ Gagal mengirim pesan:', result.description);
    }
  } catch (err) {
    console.error('❌ Error koneksi Telegram:', err.message);
  }
}

async function runInteractive() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise(resolve => rl.question(query, resolve));

  while (true) {
    console.log('\n======================================================');
    console.log('    🎯 T-AIMS INTEGRATION TEST SUITE (DZAKWAN & ARIK)');
    console.log('======================================================');
    console.log('1. Uji Tembak Webhook n8n: Alert Offline');
    console.log('2. Uji Tembak Webhook n8n: Alert Recovery');
    console.log('3. Uji Tembak Webhook n8n: Dashboard AI Recommendation');
    console.log('4. Deteksi Chat ID Telegram (Setelah klik START di Bot)');
    console.log('5. Uji Tembak Pesan Langsung ke Bot Telegram');
    console.log('6. UJI SEMUA SEKALIGUS (1 s/d 5 Full Test)');
    console.log('0. Keluar');
    console.log('======================================================');

    const choice = await question('Pilih menu [0-6]: ');

    if (choice === '1') {
      await testOfflineWebhook();
    } else if (choice === '2') {
      await testRecoveryWebhook();
    } else if (choice === '3') {
      await testAiWebhook();
    } else if (choice === '4') {
      await detectTelegramChatId();
    } else if (choice === '5') {
      await sendTestTelegramMessage();
    } else if (choice === '6') {
      await testOfflineWebhook();
      await testRecoveryWebhook();
      await testAiWebhook();
      const detectedId = await detectTelegramChatId();
      if (detectedId) {
        await sendTestTelegramMessage(detectedId);
      }
    } else if (choice === '0') {
      console.log('Sampai jumpa!');
      rl.close();
      break;
    } else {
      console.log('Pilihan tidak valid.');
    }
  }
}

// Support command-line arguments: node test_tembak_arik.js [all|offline|recovery|ai|detect|telegram]
const arg = process.argv[2];
if (arg === 'all') {
  (async () => {
    await testOfflineWebhook();
    await testRecoveryWebhook();
    await testAiWebhook();
    const id = await detectTelegramChatId();
    if (id) await sendTestTelegramMessage(id);
  })();
} else if (arg === 'offline') {
  testOfflineWebhook();
} else if (arg === 'recovery') {
  testRecoveryWebhook();
} else if (arg === 'ai') {
  testAiWebhook();
} else if (arg === 'detect') {
  detectTelegramChatId();
} else if (arg === 'telegram') {
  sendTestTelegramMessage();
} else {
  runInteractive();
}
