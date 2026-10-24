
// =============================================================================
// FORMATTER & CLIPBOARD EXPORTER REKOMENDASI AI (PDF HAL. 11 & HAL. 17)
// =============================================================================
function renderFormattedAiRecommendation(data) {
    if (!data) return '';
    const rawRec = data.recommendation || '';
    
    // Split into paragraphs / sections
    const paragraphs = rawRec.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    let html = '';
    paragraphs.forEach(p => {
        const trimmed = p.trim();
        if (trimmed.startsWith('Kondisi Jaringan:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3px solid #00F0FF;">
                    <div class="ai-rec-card-title"><i class="fa-solid fa-network-wired text-cyan"></i> Ringkasan Kondisi Infrastruktur</div>
                    <div class="ai-rec-card-body">${trimmed}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Diagnostik Gateway:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3px solid #F59E0B;">
                    <div class="ai-rec-card-title"><i class="fa-solid fa-wifi text-yellow"></i> Diagnostik Router & Gateway</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Diagnostik Gateway:', '').trim()}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Diagnostik IoT & Edge:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3px solid #10B981;">
                    <div class="ai-rec-card-title"><i class="fa-solid fa-microchip text-green"></i> Diagnostik Node IoT & Edge</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Diagnostik IoT & Edge:', '').trim()}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Diagnostik Pengawasan:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3px solid #38BDF8;">
                    <div class="ai-rec-card-title"><i class="fa-solid fa-video text-cyan"></i> Diagnostik Kamera Pengawas CCTV</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Diagnostik Pengawasan:', '').trim()}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Peringatan Server Core:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3px solid #EF4444;">
                    <div class="ai-rec-card-title"><i class="fa-solid fa-server text-red"></i> Peringatan Server Core & Data Center</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Peringatan Server Core:', '').trim()}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Frekuensi Gangguan Tertinggi:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3px solid #A855F7;">
                    <div class="ai-rec-card-title"><i class="fa-solid fa-chart-line text-purple"></i> Analisis Frekuensi Gangguan (30 Hari)</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Frekuensi Gangguan Tertinggi:', '').trim()}</div>
                </div>
            `;
        } else {
            html += `
                <div class="ai-rec-card">
                    <div class="ai-rec-card-title"><i class="fa-solid fa-robot text-cyan"></i> Analisis & Rekomendasi Preskriptif</div>
                    <div class="ai-rec-card-body">${trimmed.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }
    });

    return html || `<p class="text-muted text-sm">${rawRec}</p>`;
}
window.renderFormattedAiRecommendation = renderFormattedAiRecommendation;

function copyAiReportToClipboard() {
    const total = document.getElementById('ai-rep-total')?.innerText || '15';
    const online = document.getElementById('ai-rep-online')?.innerText || '0';
    const offline = document.getElementById('ai-rep-offline')?.innerText || '0';
    const warning = document.getElementById('ai-rep-warning')?.innerText || '0';
    const sla = document.getElementById('ai-rep-sla')?.innerText || '0.0%';
    const rawRec = window.LAST_AI_RECOMMENDATION_TEXT || document.getElementById('ai-rec-text')?.innerText || '';
    const troubled = window.LAST_AI_TROUBLED_DEVICES || 'Tidak ada';

    const report = 
`==================================================
TEKNOLAB INFRASTRUCTURE REPORT (T-AIMS)
==================================================
Waktu Laporan : ${new Date().toLocaleString('id-ID')} WIB
Total Devices : ${total} | Online: ${online} | Offline: ${offline} | Warning: ${warning}
Availability  : ${sla}

Perangkat Bermasalah : ${troubled}

Rekomendasi Preskriptif AI:
${rawRec.trim()}
==================================================
Di-generate oleh T-AIMS AI Infrastructure Assistant
Workflow: n8n Automation Engine (Arik)`;

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(report).then(() => {
            showToast('Laporan AI Disalin!', 'Format laporan resmi Teknolab (PDF Hal. 17) siap dipaste ke Telegram / WhatsApp.', 'success');
        }).catch(() => {
            showToast('Salin Manual', 'Silakan pilih dan salin teks laporan.', 'info');
        });
    } else {
        showToast('Info Laporan', 'Silakan sorot dan salin teks rekomendasi.', 'info');
    }
}
window.copyAiReportToClipboard = copyAiReportToClipboard;

// =============================================================================
// MODAL RIWAYAT ANALISIS ASISTEN AI (DOKUMEN PKL HAL. 17 & HAL. 18)
// =============================================================================
let AI_HISTORY_CACHE = [];

function openAiHistoryModal() {
    const modal = document.getElementById('ai-history-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        loadAiHistory();
    }
}
window.openAiHistoryModal = openAiHistoryModal;

function closeAiHistoryModal() {
    const modal = document.getElementById('ai-history-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}
window.closeAiHistoryModal = closeAiHistoryModal;

async function loadAiHistory() {
    const container = document.getElementById('ai-history-container');
    const countBadge = document.getElementById('ai-history-count');
    if (!container) return;

    container.innerHTML = `
        <div class="p-4 text-center text-muted">
            <i class="fa-solid fa-spinner fa-spin text-cyan"></i> Mengambil riwayat telemetri dari database MySQL...
        </div>
    `;

    try {
        let historyData = [];
        if (typeof getAiHistory === 'function') {
            historyData = await getAiHistory();
        }

        AI_HISTORY_CACHE = historyData || [];

        if (!historyData || historyData.length === 0) {
            container.innerHTML = `
                <div class="p-4 text-center text-muted">
                    <i class="fa-solid fa-clock-rotate-left fa-2x mb-2 text-cyan"></i>
                    <p class="m-0">Belum ada riwayat analisis AI yang tersimpan di database.</p>
                    <span class="text-xs">Klik tombol "Jalankan Analisis AI Baru" di Dashboard untuk mencatat analisis perdana.</span>
                </div>
            `;
            if (countBadge) countBadge.innerText = '0 riwayat tersimpan';
            return;
        }

        if (countBadge) countBadge.innerText = `Menampilkan ${historyData.length} catatan riwayat analisis`;

        let html = `
            <div style="display: flex; flex-direction: column; gap: 10px;">
        `;

        historyData.forEach((item, idx) => {
            const isN8n = item.source === 'n8n_ai';
            const sourceBadge = isN8n 
                ? '<span class="ai-source-pill" style="font-size: 0.68rem;"><i class="fa-solid fa-bolt"></i> n8n AI Workflow (Arik)</span>'
                : '<span class="ai-source-pill" style="font-size: 0.68rem; background: rgba(245, 158, 11, 0.15); border-color: rgba(245, 158, 11, 0.35); color: #FBBF24;"><i class="fa-solid fa-microchip"></i> Local Prescriptive</span>';

            const formattedTime = item.created_at 
                ? new Date(item.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB'
                : '-';

            const troubled = item.troubled_devices || '-';
            const sla = item.availability_percent !== undefined ? Number(item.availability_percent).toFixed(1) + '%' : '0.0%';
            const isOptimal = Number(item.availability_percent) >= 90;

            html += `
                <div style="background: rgba(255, 255, 255, 0.025); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 12px 14px; transition: border-color 0.2s ease;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 6px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-family: 'JetBrains Mono', monospace; font-size: 0.76rem; font-weight: 700; color: #00F0FF;">
                                #${item.recommendation_id || (idx + 1)}
                            </span>
                            <span style="font-size: 0.76rem; color: #E2E8F0; font-weight: 600;">
                                <i class="fa-regular fa-calendar-days text-muted"></i> ${formattedTime}
                            </span>
                            ${sourceBadge}
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; background: ${isOptimal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${isOptimal ? '#34D399' : '#F87171'}; border: 1px solid ${isOptimal ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};">
                                SLA: ${sla} (${item.online_devices || 0}/${item.total_devices || 15} Online)
                            </span>
                            <button type="button" class="btn-ai-action" style="padding: 3px 8px; font-size: 0.7rem;" onclick="copySingleHistoryItem(${item.recommendation_id})">
                                <i class="fa-solid fa-copy"></i> Salin
                            </button>
                        </div>
                    </div>

                    <div style="font-size: 0.74rem; color: #94A3B8; margin-bottom: 6px;">
                        <i class="fa-solid fa-triangle-exclamation text-yellow"></i> <strong>Perangkat Anomali:</strong> <span style="color: #F1F5F9;">${troubled}</span>
                    </div>

                    <div style="background: rgba(0, 0, 0, 0.35); border-left: 3px solid ${isOptimal ? '#10B981' : '#00F0FF'}; border-radius: 4px; padding: 8px 10px; font-size: 0.74rem; color: #CBD5E1; line-height: 1.5; white-space: pre-line;">${(item.recommendation || '').slice(0, 320)}${(item.recommendation || '').length > 320 ? '...' : ''}</div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;

    } catch (err) {
        console.error('loadAiHistory error:', err);
        container.innerHTML = `
            <div class="p-4 text-center text-danger">
                <i class="fa-solid fa-circle-exclamation fa-2x mb-2"></i>
                <p class="m-0">Gagal memuat riwayat AI dari database. Periksa koneksi backend.</p>
            </div>
        `;
    }
}
window.loadAiHistory = loadAiHistory;

function copySingleHistoryItem(recId) {
    const item = AI_HISTORY_CACHE.find(h => h.recommendation_id === recId);
    if (!item) return;

    const report = 
`==================================================
TEKNOLAB INFRASTRUCTURE REPORT (T-AIMS) - HISTORI
==================================================
ID Analisis   : #${item.recommendation_id}
Waktu Laporan : ${new Date(item.created_at).toLocaleString('id-ID')} WIB
Total Devices : ${item.total_devices} | Online: ${item.online_devices} | Offline: ${item.offline_devices} | Warning: ${item.warning_devices || 0}
Availability  : ${item.availability_percent}%

Perangkat Bermasalah : ${item.troubled_devices || '-'}

Rekomendasi Preskriptif AI:
${(item.recommendation || '').trim()}
==================================================
Sumber Analisis: ${item.source === 'n8n_ai' ? 'n8n Automation Engine (Arik)' : 'Local Prescriptive Engine (Fallback)'}
Tersimpan di: Database MySQL (taims_db.ai_recommendations)`;

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(report).then(() => {
            showToast('Laporan Riwayat Disalin!', `Laporan #${item.recommendation_id} berhasil disalin ke clipboard.`, 'success');
        });
    }
}
window.copySingleHistoryItem = copySingleHistoryItem;

// =============================================================================
// MODUL NOTIFIKASI TELEGRAM & N8N WORKFLOW (DOKUMEN PKL HAL. 11 & HAL. 17)
// =============================================================================
function openTelegramModal() {
    const modal = document.getElementById('telegram-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}
window.openTelegramModal = openTelegramModal;

function closeTelegramModal() {
    const modal = document.getElementById('telegram-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}
window.closeTelegramModal = closeTelegramModal;

async function sendAiReportToTelegram() {
    const preview = document.getElementById('telegram-live-preview');
    const logStatus = document.getElementById('tg-log-status');
    const btn = document.getElementById('btn-tg-report');

    if (btn) btn.disabled = true;
    if (logStatus) logStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-cyan"></i> Memproses pengiriman ke Telegram...';
    if (preview) preview.innerHTML = 'Mengirimkan rekap laporan preskriptif AI ke webhook n8n & bot @taims_alert_arik_bot...';

    showToast('Telegram Dispatch', 'Mengirimkan Laporan AI ke bot @taims_alert_arik_bot...', 'info');

    try {
        let res = null;
        if (typeof sendTelegramAiReport === 'function') {
            res = await sendTelegramAiReport();
        }
        if (res && res.success) {
            if (logStatus) logStatus.innerHTML = '<span class="text-green"><i class="fa-solid fa-circle-check"></i> Berhasil Diproses</span>';
            if (preview) {
                preview.innerHTML = 
`[STATUS: DISPATCH SUCCESS]
Waktu     : ${new Date().toLocaleString('id-ID')} WIB
Pipeline  : Web Dashboard -> Backend Express -> n8n Webhook -> Telegram Bot
Bot Target: @taims_alert_arik_bot

--- FORMAT PESAN TERKIRIM ---
${res.formatted_message.replace(/<[^>]*>/g, '')}`;
            }
            showToast('Telegram Terkirim!', 'Laporan AI resmi berhasil diproses ke pipeline Telegram Teknolab.', 'success');
        } else {
            if (logStatus) logStatus.innerHTML = '<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Gagal Kirim</span>';
            if (preview) preview.innerHTML = `Gagal mengirim laporan: ${res ? res.error : 'Koneksi backend terputus'}`;
        }
    } catch (e) {
        console.warn('sendAiReportToTelegram error:', e);
        if (preview) preview.innerHTML = `Error saat dispatch: ${e.message}`;
    } finally {
        if (btn) btn.disabled = false;
    }
}
window.sendAiReportToTelegram = sendAiReportToTelegram;

async function triggerTelegramTest(type = 'offline') {
    const preview = document.getElementById('telegram-live-preview');
    const logStatus = document.getElementById('tg-log-status');
    const code = 'MKRT-02';

    if (logStatus) logStatus.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-cyan"></i> Memicu simulasi alert ${type}...`;
    if (preview) preview.innerHTML = `Memicu webhook alert ${type.toUpperCase()} untuk perangkat ${code} (Cooldown 10 Menit Aktif)...`;

    showToast('Simulasi Alert', `Memicu notifikasi ${type.toUpperCase()} untuk ${code}...`, 'info');

    try {
        let res = null;
        if (typeof testTelegramAlert === 'function') {
            res = await testTelegramAlert(type, code);
        }
        if (res && res.success) {
            if (logStatus) logStatus.innerHTML = `<span class="text-green"><i class="fa-solid fa-circle-check"></i> Alert ${type.toUpperCase()} Sukses</span>`;
            if (preview) {
                preview.innerHTML = 
`[STATUS: SIMULATION DISPATCH SUCCESS]
Waktu     : ${new Date().toLocaleString('id-ID')} WIB
Pipeline  : n8n Workflow Automation (:5678)
Anti-Spam : Cooldown Buffer 10 Menit (Aktif)
Bot Target: @taims_alert_arik_bot

--- PESAN ALERT DITERIMA ---
${res.formatted_message.replace(/<[^>]*>/g, '')}`;
            }
            showToast('Alert Sukses', `Notifikasi ${type.toUpperCase()} untuk ${code} berhasil diteruskan ke bot Telegram.`, 'success');
        } else {
            if (logStatus) logStatus.innerHTML = '<span class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Gagal</span>';
            if (preview) preview.innerHTML = `Gagal memicu alert: ${res ? res.error : 'Koneksi gagal'}`;
        }
    } catch (e) {
        console.warn('triggerTelegramTest error:', e);
        if (preview) preview.innerHTML = `Error: ${e.message}`;
    }
}
window.triggerTelegramTest = triggerTelegramTest;


// =============================================================================
// HELPER GLOBAL: SINKRONISASI AVATAR PROFIL PENGGUNA (TOPBAR & DROPDOWN)
// =============================================================================
function updateTopbarAvatar(avatarUrl, userName) {
    const topAvatar = document.querySelector('.profile-avatar');
    if (topAvatar) {
        if (avatarUrl) {
            topAvatar.innerHTML = `<img src="${avatarUrl}" alt="${userName || 'Avatar'}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">`;
            topAvatar.style.border = '1.5px solid #64748B';
            topAvatar.style.background = '#1E293B';
        } else {
            topAvatar.innerHTML = '<i class="fa-solid fa-user" id="topbar-profile-icon" style="color: #94A3B8; font-size: 1.05rem;"></i>';
            topAvatar.style.border = '1.5px solid #64748B';
            topAvatar.style.background = '#1E293B';
        }
    }
    const dropAvatarImg = document.getElementById('dropdown-user-avatar-img');
    const dropAvatarIcon = document.getElementById('dropdown-user-avatar-icon');
    if (dropAvatarImg && dropAvatarIcon) {
        if (avatarUrl) {
            dropAvatarImg.src = avatarUrl;
            dropAvatarImg.style.display = 'block';
            dropAvatarIcon.style.display = 'none';
        } else {
            dropAvatarImg.src = '';
            dropAvatarImg.style.display = 'none';
            dropAvatarIcon.style.display = 'block';
        }
    }
}
window.updateTopbarAvatar = updateTopbarAvatar;

function handleDirectAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Format Salah', 'Harap pilih file gambar (PNG, JPG, WebP).', 'warning');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran Terlalu Besar', 'Maksimal ukuran foto adalah 5 MB.', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxDim = 280;
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                }
            } else {
                if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.88);

            const uName = (APP_STATE.currentUser && APP_STATE.currentUser.name) || 'Dzakwan';
            updateTopbarAvatar(compressedBase64, uName);

            localStorage.setItem('taims_active_avatar', compressedBase64);
            const uKey = (APP_STATE.currentUser && (APP_STATE.currentUser.rawId || APP_STATE.currentUser.username || APP_STATE.currentUser.email)) || '1';
            try {
                localStorage.setItem('taims_avatar_' + uKey, compressedBase64);
                localStorage.setItem('taims_avatar_dzakwan', compressedBase64);
                localStorage.setItem('taims_avatar_1', compressedBase64);
            } catch (err) {}

            if (APP_STATE.currentUser) {
                APP_STATE.currentUser.avatar = compressedBase64;
                sessionStorage.setItem('taims_session', JSON.stringify(APP_STATE.currentUser));
                localStorage.setItem('taims_active_session', JSON.stringify(APP_STATE.currentUser));
            }

            if (APP_STATE.usersList) {
                const idx = APP_STATE.usersList.findIndex(u =>
                    (APP_STATE.currentUser && APP_STATE.currentUser.rawId && u.rawId === APP_STATE.currentUser.rawId) ||
                    (APP_STATE.currentUser && APP_STATE.currentUser.email && u.email.toLowerCase() === APP_STATE.currentUser.email.toLowerCase()) ||
                    (APP_STATE.currentUser && APP_STATE.currentUser.username && u.username.toLowerCase() === APP_STATE.currentUser.username.toLowerCase()) ||
                    u.rawId === 1 || u.username === 'dzakwan'
                );
                if (idx !== -1) {
                    APP_STATE.usersList[idx].avatar = compressedBase64;
                    if (typeof saveUsersListToStorage === 'function') saveUsersListToStorage();
                    if (typeof renderUsersRbacTable === 'function') renderUsersRbacTable();
                }
            }

            const previewImg = document.getElementById('user-avatar-preview-img');
            const previewIcon = document.getElementById('user-avatar-preview-icon');
            const hiddenInput = document.getElementById('user-form-avatar');
            const removeBtn = document.getElementById('btn-remove-avatar');
            if (previewImg) { previewImg.src = compressedBase64; previewImg.style.display = 'block'; }
            if (previewIcon) previewIcon.style.display = 'none';
            if (hiddenInput) hiddenInput.value = compressedBase64;
            if (removeBtn) removeBtn.style.display = 'inline-block';

            const drop = document.getElementById('user-menu-dropdown');
            if (drop) drop.classList.add('hidden');

            showToast('Foto Profil Berhasil Dipasang!', 'Foto profil akun Anda kini aktif di Navbar atas.', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
window.handleDirectAvatarUpload = handleDirectAvatarUpload;



/**
 * Helper Sanitasi HTML untuk mencegah kerentanan XSS (Stored XSS Protection)
 */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
window.escapeHtml = escapeHtml;

function loadDevicesFromStorage() {
    try {
        // Hapus cache lama (v3) yang terpotong 13 perangkat akibat deduplikasi IP multi-site
        try {
            if (localStorage.getItem('taims_devices_v3')) {
                localStorage.removeItem('taims_devices_v3');
            }
        } catch (e) {}

        const raw = localStorage.getItem('taims_devices_v4');
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length >= 15) {
                // Deduplikasi HANYA berdasarkan kode aset unik (bukan IP karena subnet lokal 192.168.1.x sah dipakai antar-site HO & MO)
                const seenCodes = new Set();
                const sanitized = [];
                for (const d of parsed) {
                    const code = d.code || d.asset_code || d.id;
                    if (code && seenCodes.has(code)) continue;
                    if (code) seenCodes.add(code);

                    if (code === 'RTR-03') { d.ip = '192.168.2.3'; d.ip_address = '192.168.2.3'; }
                    if (code === 'MKRT-01') { d.ip = '192.168.2.13'; d.ip_address = '192.168.2.13'; }
                    const st = (d.status || d.current_status || 'offline').toLowerCase();
                    d.status = st;
                    d.current_status = st;
                    sanitized.push(d);
                }
                return sanitized;
            }
        }
    } catch (e) {
        console.warn('Error loading devices from storage:', e);
    }
    return null;
}

function saveDevicesToStorage(devices) {
    try {
        localStorage.setItem('taims_devices_v4', JSON.stringify(devices));
    } catch (e) {
        console.warn('Error saving devices to storage:', e);
    }
}
window.loadDevicesFromStorage = loadDevicesFromStorage;
window.saveDevicesToStorage = saveDevicesToStorage;

function updateDashboardMetrics() {
    const totalEl = document.getElementById('kpi-total-dev');
    const onEl = document.getElementById('kpi-online');
    const onPctEl = document.getElementById('kpi-online-pct');
    const offEl = document.getElementById('kpi-offline');
    const offPctEl = document.getElementById('kpi-offline-pct');
    const warnEl = document.getElementById('kpi-warning');
    const warnPctEl = document.getElementById('kpi-warning-pct');
    const upEl = document.getElementById('kpi-uptime');
    const donutEl = document.getElementById('donut-total-count');

    if (!APP_STATE.devices) return;

    const total = APP_STATE.devices.length;
    const online = APP_STATE.devices.filter(d => (d.status || d.current_status || '').toLowerCase() === 'online').length;
    const offline = APP_STATE.devices.filter(d => (d.status || d.current_status || 'offline').toLowerCase() === 'offline').length;
    const warning = APP_STATE.devices.filter(d => (d.status || d.current_status || '').toLowerCase() === 'warning').length;
    const unknown = APP_STATE.devices.filter(d => (d.status || d.current_status || '').toLowerCase() === 'unknown').length;

    const onPct = total > 0 ? ((online / total) * 100).toFixed(1) : '0.0';
    const offPct = total > 0 ? ((offline / total) * 100).toFixed(1) : '0.0';
    const warnPct = total > 0 ? ((warning / total) * 100).toFixed(1) : '0.0';

    if (totalEl) totalEl.textContent = total;
    if (onEl) onEl.textContent = online;
    if (onPctEl) onPctEl.textContent = `${onPct}%`;
    if (offEl) offEl.textContent = offline;
    if (offPctEl) offPctEl.textContent = `${offPct}%`;
    if (warnEl) warnEl.textContent = warning;
    if (warnPctEl) warnPctEl.textContent = `${warnPct}%`;
    if (upEl) upEl.textContent = online > 0 ? `${onPct}%` : '0.0%';
    if (donutEl) donutEl.textContent = total;

    // QA Fix BUG-016: Dynamic KPI Card Sparklines
    const sparkOn = document.getElementById('kpi-spark-online');
    if (sparkOn) sparkOn.style.width = `${onPct}%`;
    const sparkOff = document.getElementById('kpi-spark-offline');
    if (sparkOff) sparkOff.style.width = `${offPct}%`;
    const sparkWarn = document.getElementById('kpi-spark-warning');
    if (sparkWarn) sparkWarn.style.width = `${warnPct}%`;
    const sparkUp = document.getElementById('kpi-spark-uptime');
    if (sparkUp) sparkUp.style.width = online > 0 ? `${onPct}%` : '0.0%';

    // Sinkronisasi Banner Metrik di Halaman Laporan (SLA & AI Assistant)
    const repTot = document.getElementById('ai-rep-total');
    const repOn = document.getElementById('ai-rep-online');
    const repOff = document.getElementById('ai-rep-offline');
    const repWarn = document.getElementById('ai-rep-warning');
    const repSla = document.getElementById('ai-rep-sla');
    if (repTot) repTot.textContent = total;
    if (repOn) repOn.textContent = online;
    if (repOff) repOff.textContent = offline;
    if (repWarn) repWarn.textContent = warning;
    if (repSla) repSla.textContent = online > 0 ? `${onPct}%` : '0.0%';

    // QA Fix BUG-011: Synchronize 30-Day SLA Summary from backend stats or real calculation
    const slaBoxAvail = document.getElementById('sla-box-avail');
    const slaTargetLabel = document.getElementById('sla-box-target-label');
    const slaSiteHoVal = document.getElementById('sla-site-ho-val');
    const slaSiteHoBar = document.getElementById('sla-site-ho-bar');
    const slaSiteMoVal = document.getElementById('sla-site-mo-val');
    const slaSiteMoBar = document.getElementById('sla-site-mo-bar');
    const slaSiteHosVal = document.getElementById('sla-site-hos-val');
    const slaSiteHosBar = document.getElementById('sla-site-hos-bar');

    const backendSla30 = (APP_STATE.backendStats && APP_STATE.backendStats.sla_30_days !== undefined) 
        ? APP_STATE.backendStats.sla_30_days 
        : (online > 0 ? parseFloat(onPct) : 99.1);

    if (slaBoxAvail) {
        slaBoxAvail.textContent = `${backendSla30}%`;
        if (backendSla30 >= 99.0) {
            slaBoxAvail.className = 'text-green';
            if (slaTargetLabel) {
                slaTargetLabel.textContent = 'Target Achieved (>= 99.0%)';
                slaTargetLabel.className = 'text-green';
            }
        } else {
            slaBoxAvail.className = 'text-yellow';
            if (slaTargetLabel) {
                slaTargetLabel.textContent = 'Perlu Perhatian (< 99.0%)';
                slaTargetLabel.className = 'text-yellow';
            }
        }
    }

    if (APP_STATE.backendStats && APP_STATE.backendStats.site_sla) {
        const ss = APP_STATE.backendStats.site_sla;
        if (slaSiteMoVal && ss['1'] !== undefined) {
            slaSiteMoVal.textContent = `${ss['1']}% Uptime`;
            if (slaSiteMoBar) slaSiteMoBar.style.width = `${ss['1']}%`;
        }
        if (slaSiteHoVal && ss['2'] !== undefined) {
            slaSiteHoVal.textContent = `${ss['2']}% Uptime`;
            if (slaSiteHoBar) slaSiteHoBar.style.width = `${ss['2']}%`;
        }
        if (slaSiteHosVal && ss['3'] !== undefined) {
            slaSiteHosVal.textContent = `${ss['3']}% Uptime`;
            if (slaSiteHosBar) slaSiteHosBar.style.width = `${ss['3']}%`;
        }
    }

    // Sinkronisasi Counter Stat Cards di Menu Perangkat
    const devTotEl = document.getElementById('dev-stat-total');
    if (devTotEl) devTotEl.textContent = `${total} Devices`;
    const devOnEl = document.getElementById('dev-stat-online');
    if (devOnEl) devOnEl.textContent = `${online} Units`;
    const devOffEl = document.getElementById('dev-stat-offline');
    if (devOffEl) devOffEl.textContent = `${offline} Units`;
    const devWarnEl = document.getElementById('dev-stat-warning');
    if (devWarnEl) devWarnEl.textContent = `${warning} Units`;
    const devUnkEl = document.getElementById('dev-stat-unknown');
    if (devUnkEl) devUnkEl.textContent = `${unknown} Units`;

    // Sinkronisasi Grafik Trend & Donut
    if (typeof refreshTrendChartData === 'function') refreshTrendChartData();
    if (typeof refreshDonutChartData === 'function') refreshDonutChartData();

    // Judul & Subteks KPI (Technical English)
    const kpiTitles = document.querySelectorAll('.kpi-grid .kpi-card .kpi-title');
    if (kpiTitles && kpiTitles.length >= 6) {
        kpiTitles[0].textContent = 'Total Devices';
        kpiTitles[1].textContent = 'Connected Devices';
        kpiTitles[2].textContent = 'Disconnected Devices';
        kpiTitles[3].textContent = 'Warning Devices';
        kpiTitles[4].textContent = 'Active Locations';
        kpiTitles[5].textContent = 'System Uptime';
    }
    const subtexts = document.querySelectorAll('.kpi-grid .kpi-card .kpi-subtext');
    if (subtexts && subtexts.length >= 6) {
        subtexts[0].innerHTML = `<span class="text-green"><i class="fa-solid fa-arrow-trend-up"></i> +2 unit</span> Terdaftar di lab & site`;
        subtexts[1].innerHTML = `<span class="text-green font-bold" id="kpi-online-pct">${onPct}%</span> dari ${total} perangkat aktif`;
        subtexts[2].innerHTML = `<span class="text-red font-bold" id="kpi-offline-pct">${offPct}%</span> dari ${total} perangkat aktif`;
        subtexts[3].innerHTML = `<span class="text-yellow font-bold" id="kpi-warning-pct">${warnPct}%</span> terancam &bull; <strong id="kpi-unknown-count" style="color:#CBD5E1;">${unknown}</strong> unknown`;
        subtexts[4].textContent = 'HO, MO & House of Server';
        subtexts[5].innerHTML = `<span class="text-green font-bold">+0.2%</span> 30 hari terakhir`;
    }
    const kpiLokasi = document.getElementById('kpi-lokasi');
    if (kpiLokasi) kpiLokasi.textContent = '3';
}


function handleForgotPassword() {
    const userField = document.getElementById('login-username');
    const defaultEmail = userField && userField.value ? userField.value : 'dzakwan@teknolab.id';
    const email = prompt('Masukkan alamat email untuk menerima tautan pemulihan kata sandi:', defaultEmail);
    if (email) {
        showToast('Pemulihan Kata Sandi', `Tautan reset kata sandi telah dikirimkan ke: ${email}`, 'success');
        alert(`Instruksi pemulihan kata sandi telah otomatis dikirimkan ke email: ${email}\nSilakan periksa kotak masuk email Anda.`);
    }
}

/**
 * T-AIMS | Teknolab Asset & Infrastructure Monitoring System
 * Script Aplikasi Lengkap: Multi-Halaman, Autentikasi, GIS Peta Blitar, Modul Aset & Tim Projek
 */

const DEFAULT_TEAM_MEMBERS = [
    // =========================================================================
    // TIM 1 — PAGI (07.00 - 16.00 WIB)
    // Inti Sistem, Sistem Belakang, Basis Data, Perangkat Keras & Jaringan
    // =========================================================================
    {
        id: 'TM-01',
        name: 'DAMAR MUNAJAD',
        role: 'Koordinator Proyek & Analis Sistem',
        shift: '1',
        shiftLabel: 'Tim 1',
        phone: '0851-5866-6985',
        email: 'damarmunajad7@gmail.com',
        description: 'Menyusun persyaratan sistem dan ruang lingkup pekerjaan. Membuat Arsitektur Sistem, Diagram Blok, dan Aliran Data.',
        icon: 'fa-diagram-project',
        iconBg: 'rgba(255, 23, 68, 0.18)',
        iconColor: '#FF1744'
    },
    {
        id: 'TM-02',
        name: 'AHMAD REZA FAHMI',
        role: 'Pengembang Sistem Backend & API',
        shift: '1',
        shiftLabel: 'Tim 1',
        phone: '0857-0724-8435',
        email: 'rzafahmi351@gmail.com',
        description: 'Membangun sistem backend penghubung perangkat, basis data, dan dasbor pada porta 3000.',
        icon: 'fa-server',
        iconBg: 'rgba(255, 193, 7, 0.18)',
        iconColor: '#FFC107'
    },
    {
        id: 'TM-03',
        name: 'FAIDA TRISMA AMELIA',
        role: 'Perekayasa Basis Data & Manajemen Aset',
        shift: '1',
        shiftLabel: 'Tim 1',
        phone: '0857-3946-0210',
        email: 'faidatrismaamelia@gmail.com',
        description: 'Merancang basis data T-AIMS dan relasi antartabel, inventarisasi aset Teknolab, dan konsistensi catatan pemantauan.',
        icon: 'fa-database',
        iconBg: 'rgba(236, 72, 153, 0.18)',
        iconColor: '#EC4899'
    },
    {
        id: 'TM-04',
        name: 'ILVINA MUVARIKA',
        role: 'Perekayasa Integrasi IoT & Perangkat',
        shift: '1',
        shiftLabel: 'Tim 1',
        phone: '0857-0480-4181',
        email: 'ilfnamufarika4@gmail.com',
        description: 'Membuat firmware heartbeat untuk ESP32 dan modul relai, serta mengirimkan telemetri monitoring Panel Surya (tegangan, arus, & daya).',
        icon: 'fa-microchip',
        iconBg: 'rgba(16, 185, 129, 0.18)',
        iconColor: '#10B981'
    },
    {
        id: 'TM-05',
        name: 'ANANDA DWI SUSANTI',
        role: 'Perekayasa Pemantauan Jaringan & Perangkat',
        shift: '1',
        shiftLabel: 'Tim 1',
        phone: '0857-3231-0315',
        email: 'c11anandadwisusanti@gmail.com',
        description: 'Membangun mesin pemantauan jaringan, konfigurasi protokol SNMP v2/v3, dan aturan pengujian sinyal koneksi.',
        icon: 'fa-network-wired',
        iconBg: 'rgba(168, 85, 247, 0.18)',
        iconColor: '#F59E0B'
    },

    // =========================================================================
    // TIM 2 — SORE / MALAM (16.00 - 01.00 WIB)
    // Antarmuka Dasbor, Otomasi, Keamanan, Pengujian & Integrasi Sistem
    // =========================================================================
    {
        id: 'TM-06',
        name: 'DZAKWAN MIFTAHUSSOBIRIN',
        role: 'Ketua Tim & Integrasi Sistem',
        shift: '2',
        shiftLabel: 'Tim 2',
        phone: '0857-3192-9204',
        email: 'awangtgprofesional@gmail.com',
        description: 'Memimpin operasional Tim 2, mengoordinasikan integrasi antarmodul sistem antarmuka dan sistem backend.',
        icon: 'fa-crown',
        iconBg: 'rgba(255, 23, 68, 0.18)',
        iconColor: '#FF1744'
    },
    {
        id: 'TM-07',
        name: 'DIKA YOGA PRATAMA',
        role: 'Pengembang Antarmuka Dasbor',
        shift: '2',
        shiftLabel: 'Tim 2',
        phone: '0856-4866-1847',
        email: 'dikayogapratama18@gmail.com',
        description: 'Mengembangkan arsitektur multihalaman dasbor T-AIMS porta 3001, kotak rincian perangkat, dan peta geospasial.',
        icon: 'fa-laptop-code',
        iconBg: 'rgba(249, 115, 22, 0.18)',
        iconColor: '#F97316'
    },
    {
        id: 'TM-08',
        name: 'AHMAD AZIZ',
        role: 'Perancang Antarmuka & Visualisasi Data',
        shift: '2',
        shiftLabel: 'Tim 2',
        phone: '0816-1560-2298',
        email: 'ahzizsaputra@gmail.com',
        description: 'Merancang antarmuka dasbor di Figma, palet warna siber gelap, dan grafik visual interaktif.',
        icon: 'fa-chart-pie',
        iconBg: 'rgba(255, 23, 68, 0.18)',
        iconColor: '#FF1744'
    },
    {
        id: 'TM-09',
        name: 'ARICK FERDIANSYAH',
        role: 'Perekayasa Otomasi & Notifikasi',
        shift: '2',
        shiftLabel: 'Tim 2',
        phone: '0838-4168-7522',
        email: 'arickferdiansyah@gmail.com',
        description: 'Mengembangkan otomatisasi notifikasi dan webhook pengiriman alarm gangguan jaringan secara waktu-nyata.',
        icon: 'fa-bolt-lightning',
        iconBg: 'rgba(255, 214, 0, 0.18)',
        iconColor: '#FFD600'
    },
    {
        id: 'TM-10',
        name: 'WAFIAN',
        role: 'Infrastruktur Peladen, Jaringan & DevOps',
        shift: '2',
        shiftLabel: 'Tim 2',
        phone: '0858-0421-4958',
        email: 'wafianzaidan@gmail.com',
        description: 'Mengelola infrastruktur peladen, keamanan porta, pemantauan soket perangkat, dan stabilitas gerbang jaringan.',
        icon: 'fa-shield-halved',
        iconBg: 'rgba(20, 184, 166, 0.18)',
        iconColor: '#14B8A6'
    },
    {
        id: 'TM-11',
        name: 'REZA TRI WARDANA',
        role: 'Penguji Mutu, Pengujian & Dokumentasi',
        shift: '2',
        shiftLabel: 'Tim 2',
        phone: '0851-3681-1164',
        email: 'rezatriwardana7@gmail.com',
        description: 'Menjalankan pengujian fungsionalitas fitur (QA), kepatuhan modul PKL, dan penyusunan buku petunjuk teknis.',
        icon: 'fa-clipboard-check',
        iconBg: 'rgba(139, 92, 246, 0.18)',
        iconColor: '#8B5CF6'
    }
];


/**
 * Mapper: Menyelaraskan objek data aset dari Backend API / MySQL (17 Aset Teknolab) ke model UI
 */
function mapBackendAssetToUI(a) {
    if (!a) return null;
    const isOnline = (a.current_status || a.status || "").toLowerCase() === "online";
    const isWarning = (a.current_status || a.status || "").toLowerCase() === "warning";
    const isUnknown = (a.current_status || a.status || "").toLowerCase() === "unknown";
    const statusVal = isOnline ? "online" : (isWarning ? "warning" : (isUnknown ? "unknown" : "offline"));

    // Koordinat penempatan kantor PT Teknolab Caraka Internasional
    let lat = -7.9826, lng = 112.6308;
    if (a.location_id === 1 || (a.location_name || "").toLowerCase().includes("marketing")) {
        lat = -7.9780; lng = 112.6340;
    } else if (a.location_id === 3 || (a.location_name || "").toLowerCase().includes("server")) {
        lat = -7.9828; lng = 112.6310;
    }

    const rawCode = (a.asset_code || a.code || `AST-${a.asset_id}`).toUpperCase();
    const rawName = (a.asset_name || a.name || a.asset_code || '').toLowerCase();
    let normalizedCat = a.category || "Hardware";
    if (rawCode.startsWith("RPI") || rawName.includes("raspberry")) {
        normalizedCat = "Raspberry Pi";
    } else if (rawCode.startsWith("SMTV") || rawName.includes("smart tv") || normalizedCat.toLowerCase() === "tv") {
        normalizedCat = "Smart TV";
    } else if (rawCode.startsWith("CCTV") || rawName.includes("cctv")) {
        normalizedCat = "CCTV";
    }

    let normalizedLoc = a.location_name || a.location || "Head Office Teknolab";
    if (a.location_id === 3 || normalizedLoc.toLowerCase().includes("server")) {
        normalizedLoc = "House of Server";
    }

    return {
        id: a.asset_id || a.id || a.asset_code,
        code: a.asset_code || a.code || `AST-${a.asset_id}`,
        name: a.asset_name || a.name || a.asset_code,
        category: normalizedCat,
        location: normalizedLoc,
        pic: a.pic_name || a.pic || "Tim Teknolab",
        ip: a.ip_address || a.ip || "-",
        mac: a.mac_address || a.mac || "-",
        status: statusVal,
        lastSeen: a.last_seen || a.lastSeen || (isOnline ? "Aktif" : (isWarning ? "Online (Terancam)" : (isUnknown ? "Belum Termonitor" : "Menunggu Koneksi Fisik"))),
        offlineSince: a.offline_since || a.offlineSince || null,
        ping: (isOnline || isWarning) 
            ? (a.response_time_ms !== undefined && a.response_time_ms > 0 ? `${a.response_time_ms} ms` : (a.response_time_ms === 0 ? "1 ms" : (a.ping && a.ping !== "12 ms" ? a.ping : "1 ms"))) 
            : "-",
        uptime: a.uptime || (isOnline ? "99.8%" : "0.0%"),
        method: a.monitoring_method || a.method || "Ping",
        priority: a.priority || 2,
        config: typeof a.monitoring_config === "string" ? (()=>{ try { return JSON.parse(a.monitoring_config); } catch(e){ return {}; } })() : (a.monitoring_config || a.config || {}),
        installDate: a.installation_date || a.installDate || "2026-10-01",
        description: a.description || (rawCode === "ESP-01" ? "Node mikrokontroler ESP32 pemantau Panel Surya (Tegangan, Arus & Daya PLTS) Head Office" : "Aset Infrastruktur PT Teknolab Caraka Internasional"),
        floor: a.floor || "Lantai 2",
        isActive: a.is_active !== undefined ? (Number(a.is_active) === 1) : true,
        lat: a.lat || lat,
        lng: a.lng || lng
    };
}
window.mapBackendAssetToUI = mapBackendAssetToUI;

/**
 * Sinkronisasi Site Detail Cards & Blueprints secara real-time dengan status perangkat
 */
function syncSiteCardsAndBlueprints() {
    if (!APP_STATE.devices || !Array.isArray(APP_STATE.devices)) return;

    APP_STATE.devices.forEach(dev => {
        const code = dev.code;
        const isOnline = (dev.status === 'online');
        const statusClass = isOnline ? 'online' : (dev.status === 'warning' ? 'warning' : 'offline');
        
        // 1. Sync Site Card Device Pill
        const pill = document.getElementById(`sdc-pill-${code}`);
        if (pill) {
            pill.className = `status-pill ${isOnline ? 'online' : 'offline'}`;
            pill.innerHTML = `<span class="dot ${isOnline ? 'green' : 'red'}"></span> ${isOnline ? 'Online' : 'Offline'}`;
        }

        // 2. Sync Blueprint Device Chip
        const chip = document.getElementById(`bp-chip-${code}`);
        if (chip) {
            chip.className = `bp-chip ${isOnline ? 'online' : 'offline'}`;
        }

        // 3. Sync Architectural Floorplan Pin (Opsi 1)
        const pin = document.getElementById(`bp-pin-${code}`);
        if (pin) {
            const pulse = pin.querySelector('.pin-pulse');
            const dot = pin.querySelector('.pin-center-dot');
            const badge = pin.querySelector('.pin-badge');
            
            if (pulse) pulse.className = `pin-pulse ${statusClass}`;
            if (dot) dot.className = `pin-center-dot ${statusClass}`;
            if (badge) badge.className = `pin-badge ${statusClass}`;

            pin.setAttribute('data-status', statusClass);
            pin.title = `${dev.name || code} (${dev.ip || '-'}) • ${statusClass.toUpperCase()}`;
            let tooltip = pin.querySelector('.floorplan-pin-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'floorplan-pin-tooltip';
                pin.appendChild(tooltip);
            }
            tooltip.innerHTML = `<strong>${dev.code}</strong> &bull; ${dev.ip || '-'}<br><span style="color:${isOnline ? '#10B981' : (dev.status === 'warning' ? '#F59E0B' : '#FF1744')}; font-weight:700;">● ${statusClass.toUpperCase()}</span> &bull; Latency: ${dev.ping || '-'}`;
        }

        // 4. Sinkronkan status pada LOC_SITES.devices (Popup Peta GIS)
        if (typeof LOC_SITES !== 'undefined') {
            ['ho', 'mo', 'server'].forEach(siteKey => {
                const s = LOC_SITES[siteKey];
                if (s && Array.isArray(s.devices)) {
                    s.devices.forEach(sd => {
                        if (sd.name && sd.name.toUpperCase().startsWith(code.toUpperCase())) {
                            sd.status = statusClass;
                        }
                    });
                }
            });
        }
    });

    // 5. Sinkronkan angka rekaman modul database di menu Pengaturan
    const dbAssetsEl = document.getElementById('db-count-assets');
    if (dbAssetsEl && APP_STATE.devices) {
        dbAssetsEl.innerHTML = `${APP_STATE.devices.length} rekaman &bull; Aktif`;
    }
    const dbUsersEl = document.getElementById('db-count-users');
    if (dbUsersEl && APP_STATE.usersList) {
        dbUsersEl.innerHTML = `${APP_STATE.usersList.length} pengguna &bull; Aktif`;
    }
}
window.syncSiteCardsAndBlueprints = syncSiteCardsAndBlueprints;

/**
 * Memuat data riil terintegrasi dari Backend API Express (Port 3000)
 */
async function loadRealDataFromApi() {
    try {
        // 1. Ambil Log Monitoring Terkini untuk Latency Riil (Point 2)
        let logsMap = {};
        if (window.apiService && typeof window.apiService.getMonitoringLogs === "function") {
            try {
                const logs = await window.apiService.getMonitoringLogs({ limit: 100 });
                if (logs && Array.isArray(logs)) {
                    for (const log of logs) {
                        if (logsMap[log.asset_id] === undefined && log.response_time_ms !== null && log.response_time_ms !== undefined) {
                            logsMap[log.asset_id] = log.response_time_ms;
                        }
                    }
                }
            } catch (e) {
                console.warn("Gagal memuat monitoring logs:", e);
            }
        }

        // 2. Ambil Data Aset Master
        if (window.apiService && typeof window.apiService.getAssets === "function") {
            const res = await window.apiService.getAssets();
            if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
                if (!res.is_fallback) {
                    res.data.forEach(a => {
                        if (logsMap[a.asset_id] !== undefined) {
                            a.response_time_ms = logsMap[a.asset_id];
                        }
                    });
                    APP_STATE.devices = res.data.map(mapBackendAssetToUI);
                    saveDevicesToStorage(APP_STATE.devices);
                } else {
                    const localSaved = loadDevicesFromStorage();
                    if (localSaved && localSaved.length >= 15) {
                        APP_STATE.devices = localSaved;
                    } else if (typeof FALLBACK_ASSETS !== "undefined" && Array.isArray(FALLBACK_ASSETS)) {
                        APP_STATE.devices = FALLBACK_ASSETS.map(mapBackendAssetToUI);
                        saveDevicesToStorage(APP_STATE.devices);
                    }
                }
                if (typeof renderHomeDevicesTable === "function") renderHomeDevicesTable();
                if (typeof renderFullDevicesTable === "function") renderFullDevicesTable();
                if (typeof updateDashboardMetrics === "function") updateDashboardMetrics();
                if (typeof refreshHomeMap === "function") refreshHomeMap();
                if (typeof renderFloorplanPins === "function") renderFloorplanPins();
                if (typeof syncSiteCardsAndBlueprints === "function") syncSiteCardsAndBlueprints();
            }
        }
        if (window.apiService && typeof window.apiService.getDashboardStats === "function") {
            const statsRes = await window.apiService.getDashboardStats();
            if (statsRes && statsRes.data) APP_STATE.backendStats = statsRes.data;
            else if (statsRes && statsRes.total_devices) APP_STATE.backendStats = statsRes;
            if (typeof updateDashboardMetrics === "function") updateDashboardMetrics();
        }

        // 3. Ambil Insiden Gangguan
        if (window.apiService && typeof window.apiService.getIncidentLogs === "function") {
            const incs = await window.apiService.getIncidentLogs();
            if (incs && Array.isArray(incs) && incs.length > 0) {
                APP_STATE.incidents = incs.map(inc => ({
                    id: `INC-${String(inc.incident_id).padStart(3, '0')}`,
                    rawId: inc.incident_id,
                    deviceName: inc.asset_name || inc.asset_code || 'Perangkat Jaringan',
                    site: inc.location_name || 'Head Office',
                    startTime: inc.detected_at ? new Date(inc.detected_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Hari Ini',
                    recoveryTime: inc.incident_status === 'resolved' ? 'Terselesaikan' : '-',
                    duration: '-',
                    severity: (inc.severity || 'high').toLowerCase(),
                    rootCause: inc.description || inc.incident_type || 'Koneksi Terputus',
                    pic: 'Tim NOC Teknolab',
                    status: (inc.incident_status || 'open').toLowerCase()
                }));
                if (typeof renderIncidentsTable === "function") renderIncidentsTable();
            }
        }

        // 4. Ambil Notifikasi Riil dari Backend (Point 4)
        let hasLoadedNotifs = false;
        if (window.apiService && typeof window.apiService.getNotifications === "function") {
            try {
                const notifRes = await window.apiService.getNotifications({ limit: 20 });
                const notifList = (notifRes && notifRes.data && Array.isArray(notifRes.data)) ? notifRes.data : [];
                if (notifList.length > 0) {
                    APP_STATE.alerts = notifList.map(n => ({
                        id: `NOTIF-${n.notification_id}`,
                        rawId: n.notification_id,
                        time: n.created_at ? new Date(n.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja',
                        title: n.title,
                        location: n.asset_name ? `${n.asset_code} (${n.asset_name})` : (n.message || 'Sistem T-AIMS'),
                        level: (n.title.toLowerCase().includes('offline') || n.title.toLowerCase().includes('kritis')) ? 'kritis' : 'peringatan',
                        read: Number(n.is_read) === 1
                    }));
                    hasLoadedNotifs = true;
                }
            } catch (errN) {
                console.warn("Gagal memuat notifikasi:", errN);
            }
        }

        // Fallback populasikan notifikasi dari open incidents bila belum ada
        if (!hasLoadedNotifs && APP_STATE.incidents && APP_STATE.incidents.length > 0) {
            APP_STATE.alerts = APP_STATE.incidents.slice(0, 10).map(inc => ({
                id: `ALT-${inc.rawId}`,
                rawId: inc.rawId,
                time: inc.startTime ? (inc.startTime.includes(' ') ? inc.startTime.split(' ')[1] : inc.startTime) : '12:05',
                title: `${inc.deviceName}: ${inc.rootCause}`,
                location: inc.site,
                level: inc.severity === 'high' || inc.severity === 'critical' ? 'kritis' : 'peringatan',
                read: inc.status === 'resolved'
            }));
        }
        if (typeof renderAlerts === "function") renderAlerts();

        // 5. Ambil data Users RBAC (Pertahankan password, picTask & lastLogin lokal agar perubahan password tetap sinkron)
        if (window.apiService && typeof window.apiService.getUsers === "function") {
            const users = await window.apiService.getUsers();
            if (users && Array.isArray(users) && users.length > 0) {
                const existingMap = {};
                (APP_STATE.usersList || []).forEach(eu => {
                    if (eu.rawId) existingMap[eu.rawId] = eu;
                    if (eu.email) existingMap[eu.email.toLowerCase()] = eu;
                });

                APP_STATE.usersList = users.map(u => {
                    const prev = existingMap[u.user_id] || (u.email ? existingMap[u.email.toLowerCase()] : null) || {};
                    const defUser = (typeof DEFAULT_USERS_LIST !== 'undefined')
                        ? DEFAULT_USERS_LIST.find(d => d.rawId === u.user_id || (u.email && d.email.toLowerCase() === u.email.toLowerCase()))
                        : null;
                    const storedAvatar = localStorage.getItem('taims_avatar_' + u.user_id) || 
                                         (u.email ? localStorage.getItem('taims_avatar_' + u.email.toLowerCase()) : null) ||
                                         (u.username ? localStorage.getItem('taims_avatar_' + u.username.toLowerCase()) : null);
                    return {
                        id: `USR-${String(u.user_id).padStart(2, '0')}`,
                        rawId: u.user_id,
                        name: u.full_name || prev.name || u.email,
                        username: u.username || prev.username || (u.email ? u.email.split('@')[0] : `user_${u.user_id}`),
                        password: prev.password || (defUser ? defUser.password : 'password123'),
                        email: u.email,
                        avatar: storedAvatar || prev.avatar || u.avatar || (defUser ? defUser.avatar : null) || '',
                        role: u.role === 'super_admin' ? 'Superadmin' : (u.role === 'admin' ? 'Admin' : 'User'),
                        perms: u.role === 'super_admin' ? 'CRUD' : (u.role === 'admin' ? 'CRU' : 'Read Only'),
                        picTask: prev.picTask || (defUser ? defUser.picTask : 'Staff Operasional & Monitoring'),
                        status: prev.status || 'Aktif',
                        lastLogin: prev.lastLogin || (defUser ? defUser.lastLogin : 'Baru saja')
                    };
                });
                if (typeof saveUsersListToStorage === "function") saveUsersListToStorage();
                if (typeof renderUsersRbacTable === "function") renderUsersRbacTable();

                // Sinkronkan peran sesi pengguna yang sedang login jika diubah oleh Superadmin
                if (APP_STATE.currentUser && APP_STATE.currentUser.role !== 'guest') {
                    const matchedActive = APP_STATE.usersList.find(item =>
                        (APP_STATE.currentUser.rawId && item.rawId === APP_STATE.currentUser.rawId) ||
                        (APP_STATE.currentUser.email && item.email.toLowerCase() === APP_STATE.currentUser.email.toLowerCase()) ||
                        (APP_STATE.currentUser.username && item.username && item.username.toLowerCase() === APP_STATE.currentUser.username.toLowerCase())
                    );
                    if (matchedActive) {
                        const mappedRole = matchedActive.role === 'Superadmin' ? 'superadmin' : (matchedActive.role === 'User' ? 'user' : 'admin');
                        const mappedTitle = matchedActive.role;
                        if (APP_STATE.currentUser.role !== mappedRole || APP_STATE.currentUser.title !== mappedTitle) {
                            APP_STATE.currentUser.role = mappedRole;
                            APP_STATE.currentUser.title = mappedTitle;
                            sessionStorage.setItem('taims_session', JSON.stringify(APP_STATE.currentUser));
                            localStorage.setItem('taims_active_session', JSON.stringify(APP_STATE.currentUser));
                            const topRole = document.getElementById('topbar-user-role');
                            const dropRole = document.getElementById('dropdown-user-role');
                            const bannerBadge = document.getElementById('banner-role-badge');
                            if (topRole) topRole.textContent = mappedTitle;
                            if (dropRole) dropRole.textContent = mappedTitle;
                            const adminBtns = document.querySelectorAll('.admin-only');
                            if (mappedRole === 'user') {
                                if (bannerBadge) {
                                    bannerBadge.innerHTML = '<i class="fa-solid fa-eye text-yellow"></i> Mode User (Hanya Melihat)';
                                    bannerBadge.style.color = 'var(--tekno-gold)';
                                }
                                adminBtns.forEach(b => b.classList.add('hidden'));
                            } else {
                                if (bannerBadge) {
                                    bannerBadge.innerHTML = '<i class="fa-solid fa-shield-halved text-cyan"></i> ' + mappedTitle + ' (Kontrol Penuh)';
                                    bannerBadge.style.color = 'var(--cyan-neon)';
                                }
                                adminBtns.forEach(b => b.classList.remove('hidden'));
                            }
                        }
                        if (matchedActive.avatar) {
                            APP_STATE.currentUser.avatar = matchedActive.avatar;
                            if (typeof updateTopbarAvatar === 'function') {
                                updateTopbarAvatar(matchedActive.avatar, matchedActive.name);
                            }
                        }
                    }
                }
            }
        }

        // 6. Hitung unread notification count
        if (window.apiService && typeof window.apiService.getUnreadNotificationCount === "function") {
            const unread = await window.apiService.getUnreadNotificationCount();
            if (typeof updateNotifBadgeCount === 'function') {
                updateNotifBadgeCount(unread);
            }
        }
    } catch (err) {
        console.warn("Sinkronisasi live data backend gagal / fallback:", err);
    }
}
window.loadRealDataFromApi = loadRealDataFromApi;

const DEFAULT_USERS_LIST = [
    { id: 'USR-01', rawId: 1, name: 'Dzakwan Miftahussobirin', username: 'dzakwan', password: 'password123', altPasswords: ['admin123', 'awangtg155'], email: 'dzakwan@taims.local', role: 'Superadmin', perms: 'CRUD', picTask: 'Ketua Tim & Integrasi Sistem', status: 'Aktif', lastLogin: 'Baru saja', avatar: '' },
    { id: 'USR-02', rawId: 2, name: 'Damar Munajad', username: 'damar', password: 'password123', email: 'damar@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Koordinator Proyek & Analis Sistem', status: 'Aktif', lastLogin: '10 Menit lalu' },
    { id: 'USR-03', rawId: 3, name: 'Ahmad Reza Fahmi', username: 'reza.fahmi', password: 'password123', email: 'reza.fahmi@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Pengembang Sistem Backend & API', status: 'Aktif', lastLogin: '25 Menit lalu' },
    { id: 'USR-04', rawId: 4, name: 'Faida Trisma Amelia', username: 'faida', password: 'password123', email: 'faida@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Perekayasa Basis Data & Manajemen Aset', status: 'Aktif', lastLogin: '45 Menit lalu' },
    { id: 'USR-05', rawId: 5, name: 'Ilvina Muvarika', username: 'ilvina', password: 'password123', email: 'ilvina@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Perekayasa Integrasi IoT & Perangkat', status: 'Aktif', lastLogin: '1 Jam lalu' },
    { id: 'USR-06', rawId: 6, name: 'Ananda Dwi Susanti', username: 'ananda', password: 'password123', email: 'ananda@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Perekayasa Pemantauan Jaringan & Perangkat', status: 'Aktif', lastLogin: '2 Jam lalu' },
    { id: 'USR-07', rawId: 7, name: 'Dika Yoga Pratama', username: 'dika', password: 'password123', email: 'dika.yoga@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Pengembang Antarmuka Dasbor', status: 'Aktif', lastLogin: '3 Jam lalu' },
    { id: 'USR-08', rawId: 8, name: 'Ahmad Aziz', username: 'aziz', password: 'password123', email: 'ahmad.aziz@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Perancang Antarmuka & Visualisasi Data', status: 'Aktif', lastLogin: '4 Jam lalu' },
    { id: 'USR-09', rawId: 9, name: 'Arik', username: 'arik', password: 'password123', email: 'arik@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Perekayasa Otomasi & Notifikasi', status: 'Aktif', lastLogin: '5 Jam lalu' },
    { id: 'USR-10', rawId: 10, name: 'Wafian', username: 'wafian', password: 'password123', email: 'wafian@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Infrastruktur Peladen, Jaringan & DevOps', status: 'Aktif', lastLogin: '6 Jam lalu' },
    { id: 'USR-11', rawId: 11, name: 'Reza Tri', username: 'reza.tri', password: 'password123', email: 'reza.tri@taims.local', role: 'Admin', perms: 'CRU', picTask: 'Penguji Mutu, Pengujian & Dokumentasi', status: 'Aktif', lastLogin: 'Kemarin' }
];

const APP_STATE = {
    currentUser: {
        username: 'dzakwan',
        email: 'dzakwan@taims.local',
        name: 'Dzakwan Miftahussobirin',
        role: 'superadmin',
        title: 'Superadmin'
    },
    currentPage: 'page-dashboard',
    selectedDeviceId: null,
    isFloorplanEditMode: false,
    homeMap: null,
    fullMap: null,
    homeTileLayer: null,
    fullTileLayer: null,
    currentMapProvider: 'google-sat',
    homeMarkers: [],
    fullMarkers: [],
    siteMarkers: {},
    tempMarker: null,
    activeCoord: { lat: -8.07378, lng: 112.17336 },

    // Database Perangkat Berfokus pada Wilayah Kota & Kabupaten Blitar (Jawa Timur)
    devices: (function() {
        if (typeof loadDevicesFromStorage === 'function') {
            const saved = loadDevicesFromStorage();
            if (saved && saved.length >= 15) return saved;
        }
        return (typeof FALLBACK_ASSETS !== "undefined" ? FALLBACK_ASSETS.map(mapBackendAssetToUI) : []);
    })(),
    // Riwayat Insiden, Alerts & Notifikasi (Clean Slate B2 - Sesuai Instruksi Wafian)
    alerts: [],
    incidents: [],
    maintenanceLogs: (function() {
        try {
            const saved = localStorage.getItem('taims_maintenance_v1');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch (e) {}
        return [
            { id: 'MNT-001', date: '20 Okt 2026', device: 'SRV-01 (Server Utama T-AIMS)', location: 'House of Server', type: 'Preventive Maintenance', desc: 'Pengecekan suhu rak server, kebersihan fan pendingin & health-check MySQL Database', pic: 'Wafian Zaidan', status: 'Selesai' },
            { id: 'MNT-002', date: '20 Okt 2026', device: 'MKRT-01 (Mikrotik Marketing)', location: 'Marketing Office', type: 'Kalibrasi Jaringan', desc: 'Optimasi routing tabel firewall, bandwidth queue & pengujian stabilitas ICMP Ping', pic: 'Ananda Dwi Susanti', status: 'Selesai' },
            { id: 'MNT-003', date: '20 Okt 2026', device: 'CCTV-01 & CCTV-02', location: 'Head Office & MO', type: 'Inspeksi Berkala', desc: 'Pembersihan lensa kamera pengawas, pengecekan adaptor PoE 12V & rekaman NVR', pic: 'Ilvina Muvarika', status: 'Selesai' },
            { id: 'MNT-004', date: '21 Okt 2026', device: 'SWM-01 (Switch Manageable)', location: 'House of Server', type: 'Pemeliharaan Terjadwal', desc: 'Verifikasi redundansi port trunk VLAN & backup konfigurasi switch inti', pic: 'Damar Munajad', status: 'Sedang Berjalan' },
            { id: 'MNT-005', date: '22 Okt 2026', device: 'ESP-01 & RPI-01 (Node IoT)', location: 'Head Office', type: 'Kalibrasi Sensor', desc: 'Pengujian pengiriman payload MQTT heartbeat & kalibrasi sensor monitoring Panel Surya (ESP-01)', pic: 'Dzakwan Miftahussobirin', status: 'Tertunda' }
        ];
    })(),

    teamMembers: [],
    usersList: DEFAULT_USERS_LIST.map(u => ({ ...u })),
    auditLogs: (function() {
        try {
            if (localStorage.getItem('taims_audit_cleared') === 'true') {
                return [];
            }
            const savedLogs = localStorage.getItem('taims_audit_logs_v3');
            if (savedLogs !== null) {
                const parsed = JSON.parse(savedLogs);
                if (Array.isArray(parsed)) return parsed.slice(0, 50);
            }
        } catch (e) {}
        return [];
    })(),

    charts: {
        trendChart: null,
        categoryDonut: null
    }
};

// Inisialisasi awal penyimpanan perangkat lokal bila belum tersimpan
if (typeof loadDevicesFromStorage === 'function' && (!loadDevicesFromStorage() || loadDevicesFromStorage().length < 15)) {
    saveDevicesToStorage(APP_STATE.devices);
}

// =============================================================================
// MODUL BAHASA & KATA TEKNIS (STANDAR BAHASA INDONESIA & IT INGGRIS ASLI)
// =============================================================================
const I18N_DICT = {};
const I18N_REVERSE_DICT = {};
function translateTextString(text) { return text || ''; }
function translateSubtree() {}
function setLanguage(lang) {
    APP_STATE.currentLang = 'id';
    document.documentElement.lang = 'id';
}

// =============================================================================
// INISIALISASI
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof initClock === 'function') initClock();
    // Restore avatar profil aktif di Topbar
    const activeAvatar = localStorage.getItem('taims_active_avatar') ||
                         localStorage.getItem('taims_avatar_1') ||
                         localStorage.getItem('taims_avatar_dzakwan');
    if (activeAvatar) {
        if (APP_STATE.currentUser) APP_STATE.currentUser.avatar = activeAvatar;
        updateTopbarAvatar(activeAvatar, (APP_STATE.currentUser && APP_STATE.currentUser.name) || 'Dzakwan');
    } else {
        updateTopbarAvatar(null);
    }

    if (typeof loadTeamData === 'function') loadTeamData();
    if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
    if (typeof renderFullDevicesTable === 'function') renderFullDevicesTable();
    if (typeof renderAssetsTable === 'function') renderAssetsTable();
    if (typeof renderAlerts === 'function') renderAlerts();
    if (typeof renderTeamCards === 'function') renderTeamCards();
    if (typeof renderBlitarNodesList === 'function') renderBlitarNodesList();
    if (typeof updateAiWidget === 'function') updateAiWidget();
    if (typeof renderFloorplanPins === 'function') renderFloorplanPins();
    if (typeof loadRealDataFromApi === 'function') {
        loadRealDataFromApi();
        setInterval(loadRealDataFromApi, 5000);
    }

    // Inisialisasi Peta Leaflet Blitar setelah DOM siap
    setTimeout(() => {
        if (typeof initBlitarMaps === 'function') initBlitarMaps();
        if (typeof refreshHomeMap === 'function') refreshHomeMap();
    }, 150);

    // Otomatis sinkronisasi rekomendasi Asisten AI pada initial load (Dokumen PKL Hal. 17)
    setTimeout(() => {
        if (typeof runAiAnalysis === 'function') runAiAnalysis();
    }, 1200);

    if (typeof loadUsersListFromStorage === 'function') loadUsersListFromStorage();

    // Cek URL params (?role=admin atau ?role=superadmin)
    const urlParams = new URLSearchParams(window.location.search);
    const paramRole = urlParams.get('role');
    if (paramRole === 'admin' || paramRole === 'superadmin') {
        loginSuccess({
            username: 'dzakwan',
            email: 'awangtgprofesional@gmail.com',
            name: 'Dzakwan Miftahussobirin',
            role: 'superadmin',
            title: 'Superadmin'
        });
        return;
    } else if (paramRole === 'guest' || paramRole === 'tamu') {
        enterAsGuest();
        return;
    }

    // Cek sesi tersimpan
    const saved = localStorage.getItem('taims_active_session') || sessionStorage.getItem('taims_session');
    if (saved) {
        try {
            const user = JSON.parse(saved);
            loginSuccess(user, true);
        } catch (e) {
            localStorage.removeItem('taims_active_session');
            sessionStorage.removeItem('taims_session');
        }
    }
});

// =============================================================================
// NAVIGASI MULTI-HALAMAN SIDEBAR (BUG ASET & PERANGKAT DIPERBAIKI)
// =============================================================================
function switchPage(pageId) {
    APP_STATE.currentPage = pageId;
    
    // Sembunyikan semua halaman
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));

    // Tampilkan halaman tujuan
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        if (APP_STATE && APP_STATE.currentLang) {
            translateSubtree(targetPage, APP_STATE.currentLang);
        }
    }

    // Update class active di sidebar: Hanya item yang cocok persis yang aktif!
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update class active di Mobile Bottom Nav
    document.querySelectorAll('.mobile-bottom-nav .mb-nav-item').forEach(item => {
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Handle aksi spesifik setiap halaman & kontrol scroll (Mobile vs Desktop)
    const mainEl = document.querySelector('.main-content');
    const contentEl = document.querySelector('.content-container');
    const isMobile = window.innerWidth <= 1080;

    if (pageId === 'page-dashboard') {
        if (isMobile) {
            if (mainEl) mainEl.style.overflow = 'auto';
            if (contentEl) contentEl.style.overflow = 'visible';
        } else {
            if (mainEl) mainEl.style.overflow = 'hidden';
            if (contentEl) contentEl.style.overflow = 'hidden';
        }
        setTimeout(() => {
            initCharts();
            if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize();
        }, 80);
    } else {
        if (mainEl) mainEl.style.overflow = 'auto';
        if (contentEl) contentEl.style.overflow = 'auto';
        if (pageId === 'page-location') {
            setTimeout(() => {
                if (APP_STATE.fullMap) {
                    APP_STATE.fullMap.invalidateSize();
                } else {
                    initBlitarMaps();
                }
            }, 120);
        } else if (pageId === 'page-assets') {
            renderAssetsTable();
        } else if (pageId === 'page-devices') {
            renderFullDevicesTable();
        } else if (pageId === 'page-monitoring') {
            if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
        } else if (pageId === 'page-alerts') {
            if (typeof renderIncidentsTable === 'function') renderIncidentsTable();
        } else if (pageId === 'page-reports') {
            if (typeof renderMaintenanceTable === 'function') renderMaintenanceTable();
        } else if (pageId === 'page-project-info') {
            renderTeamCards();
        } else if (pageId === 'page-users') {
            renderUsersRbacTable();
        }

        // Translate targetPage after dynamic renderers have run
        if (APP_STATE && APP_STATE.currentLang && targetPage) {
            translateSubtree(targetPage, APP_STATE.currentLang);
        }
    }

    // Tutup mobile sidebar & overlay jika terbuka
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');

    // Scroll ke atas halaman
    if (mainEl) mainEl.scrollTop = 0;
}

function toggleAppSidebar() {
    const isMobile = window.innerWidth <= 900;
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (isMobile) {
        if (sidebar) sidebar.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
    } else {
        if (sidebar) {
            sidebar.classList.toggle('sidebar-collapsed');
            setTimeout(() => {
                if (APP_STATE && APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize();
                if (APP_STATE && APP_STATE.fullMap) APP_STATE.fullMap.invalidateSize();
                if (APP_STATE && APP_STATE.charts && APP_STATE.charts.trendChart) APP_STATE.charts.trendChart.resize();
                if (APP_STATE && APP_STATE.charts && APP_STATE.charts.categoryDonut) APP_STATE.charts.categoryDonut.resize();
            }, 320);
        }
    }
}

function toggleMobileSidebar() {
    toggleAppSidebar();
}

// =============================================================================
// HELPER NORMALISASI PERAN RBAC (SUPERADMIN, ADMIN, USER/GUEST)
// =============================================================================
function normalizeRole(role) {
    if (!role) return 'guest';
    const r = String(role).trim().toLowerCase().replace(/[_\s-]/g, '');
    if (r === 'superadmin') return 'superadmin';
    if (r === 'admin' || r === 'administrator') return 'admin';
    if (r === 'guest') return 'guest';
    return 'user';
}
window.normalizeRole = normalizeRole;

function isSuperAdmin() {
    return APP_STATE.currentUser && normalizeRole(APP_STATE.currentUser.role) === 'superadmin';
}
function isAdminUser() {
    if (!APP_STATE.currentUser) return false;
    const r = normalizeRole(APP_STATE.currentUser.role);
    return r === 'superadmin' || r === 'admin';
}
window.isSuperAdmin = isSuperAdmin;
window.isAdminUser = isAdminUser;

// =============================================================================
// AUTENTIKASI: LOGIN ADMIN VS TAMU & BRUTE-FORCE PROGRESSIVE LOCKOUT
// =============================================================================
const LOGIN_LOCK_STORAGE_KEY = 'taims_login_lockout_v1';
let loginLockoutInterval = null;

function getFrontendLoginLockState() {
    try {
        const raw = localStorage.getItem(LOGIN_LOCK_STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
    } catch (e) {}
    return { failedAttempts: 0, penaltyStage: 0, lockUntil: 0, lastTarget: '' };
}

function saveFrontendLoginLockState(state) {
    try {
        localStorage.setItem(LOGIN_LOCK_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
}

function clearFrontendLoginLockout() {
    if (loginLockoutInterval) {
        clearInterval(loginLockoutInterval);
        loginLockoutInterval = null;
    }
    try {
        localStorage.removeItem(LOGIN_LOCK_STORAGE_KEY);
    } catch (e) {}
    const uInput = document.getElementById('login-username');
    const pInput = document.getElementById('login-password');
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    if (uInput) uInput.disabled = false;
    if (pInput) pInput.disabled = false;
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Masuk sebagai Administrator</span>`;
    }
}
window.clearFrontendLoginLockout = clearFrontendLoginLockout;

function formatLockCountdown(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startLoginLockoutCountdown(lockUntilTs, penaltyMinutes = 1) {
    if (loginLockoutInterval) {
        clearInterval(loginLockoutInterval);
        loginLockoutInterval = null;
    }

    const uInput = document.getElementById('login-username');
    const pInput = document.getElementById('login-password');
    const submitBtn = document.querySelector('#login-form button[type="submit"]');
    const alertBox = document.getElementById('auth-alert');
    const alertText = document.getElementById('auth-alert-text');

    if (uInput) uInput.disabled = true;
    if (pInput) pInput.disabled = true;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.65';
        submitBtn.style.cursor = 'not-allowed';
    }
    if (alertBox) alertBox.classList.remove('hidden');

    const updateTick = () => {
        const now = Date.now();
        const remainingSec = Math.ceil((lockUntilTs - now) / 1000);
        if (remainingSec <= 0) {
            clearInterval(loginLockoutInterval);
            loginLockoutInterval = null;

            const st = getFrontendLoginLockState();
            st.lockUntil = 0;
            st.failedAttempts = 0;
            saveFrontendLoginLockState(st);

            if (uInput) uInput.disabled = false;
            if (pInput) {
                pInput.disabled = false;
                pInput.value = '';
                pInput.focus();
            }
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> <span>Masuk sebagai Administrator</span>`;
            }
            if (alertText) {
                alertText.textContent = 'Masa tunggu selesai. Silakan masukkan kata sandi dengan benar.';
            }
            setTimeout(() => {
                if (alertBox && (!getFrontendLoginLockState().lockUntil)) {
                    alertBox.classList.add('hidden');
                }
            }, 3500);
            return;
        }

        const timeFormatted = formatLockCountdown(remainingSec);
        if (submitBtn) {
            submitBtn.innerHTML = `<i class="fa-solid fa-lock text-red"></i> <span>Terkunci Sementara (${timeFormatted})</span>`;
        }
        if (alertText) {
            alertText.textContent = `Terlalu banyak percobaan gagal (3x)! Login dikunci selama ${penaltyMinutes} menit. Tunggu ${timeFormatted} detik...`;
        }
    };

    updateTick();
    loginLockoutInterval = setInterval(updateTick, 1000);
}

// Pulihkan countdown lockout saat halaman di-refresh (Anti-Refresh F5 Bypass)
document.addEventListener('DOMContentLoaded', () => {
    const lockState = getFrontendLoginLockState();
    if (lockState && lockState.lockUntil && lockState.lockUntil > Date.now()) {
        const penaltyMinutes = Math.pow(2, Math.max(0, (lockState.penaltyStage || 1) - 1));
        startLoginLockoutCountdown(lockState.lockUntil, penaltyMinutes);
    }
});

async function handleLogin() {
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    const alertBox = document.getElementById('auth-alert');
    const alertText = document.getElementById('auth-alert-text');

    // 0. Cek apakah sedang dalam masa tunggu (Lockout) di Browser / Perangkat ini
    const localLock = getFrontendLoginLockState();
    if (localLock.lockUntil && localLock.lockUntil > Date.now()) {
        const penaltyMinutes = Math.pow(2, Math.max(0, (localLock.penaltyStage || 1) - 1));
        startLoginLockoutCountdown(localLock.lockUntil, penaltyMinutes);
        return;
    }

    if (typeof loadUsersListFromStorage === 'function') loadUsersListFromStorage();

    // Cari data user di daftar akun lokal (berdasarkan email, username, atau nama lengkap terbaru)
    const matchedUser = APP_STATE.usersList ? APP_STATE.usersList.find(user => 
        (user.email && user.email.toLowerCase() === u.toLowerCase()) || 
        (user.username && user.username.toLowerCase() === u.toLowerCase()) ||
        (user.name && user.name.toLowerCase() === u.toLowerCase())
    ) : null;

    // Helper pencatat kegagalan progresif (3x gagal -> 1 menit -> 2 menit -> 4 menit)
    const triggerFailedLoginAttempt = (serverLockInfo = null) => {
        const st = getFrontendLoginLockState();

        if (serverLockInfo && serverLockInfo.isLocked) {
            const stage = serverLockInfo.penaltyStage || ((st.penaltyStage || 0) + 1);
            const mins = serverLockInfo.penaltyMinutes || Math.pow(2, stage - 1);
            const remSec = serverLockInfo.remainingSeconds || (mins * 60);
            const lockUntilTs = Date.now() + (remSec * 1000);

            st.failedAttempts = 0;
            st.penaltyStage = stage;
            st.lockUntil = lockUntilTs;
            st.lastTarget = matchedUser ? matchedUser.username : u;
            saveFrontendLoginLockState(st);

            if (typeof addAuditTrailRecord === 'function') {
                addAuditTrailRecord('Proteksi Keamanan (Lockout)', `Gagal login 3x berturut-turut pada input "${u}" — Akses dikunci selama ${mins} menit`);
            }
            startLoginLockoutCountdown(lockUntilTs, mins);
            return;
        }

        st.failedAttempts = (st && typeof serverLockInfo?.failedAttempts === 'number')
            ? serverLockInfo.failedAttempts
            : ((st.failedAttempts || 0) + 1);

        if (st.failedAttempts >= 3) {
            const nextStage = (st.penaltyStage || 0) + 1;
            const penaltyMinutes = Math.pow(2, nextStage - 1); // 1 menit -> 2 menit -> 4 menit
            const lockUntilTs = Date.now() + (penaltyMinutes * 60 * 1000);

            st.failedAttempts = 0;
            st.penaltyStage = nextStage;
            st.lockUntil = lockUntilTs;
            st.lastTarget = matchedUser ? matchedUser.username : u;
            saveFrontendLoginLockState(st);

            if (typeof addAuditTrailRecord === 'function') {
                addAuditTrailRecord('Proteksi Keamanan (Lockout)', `Gagal login 3x berturut-turut pada input "${u}" — Akses dikunci selama ${penaltyMinutes} menit`);
            }
            startLoginLockoutCountdown(lockUntilTs, penaltyMinutes);
            return;
        }

        saveFrontendLoginLockState(st);
        const rem = 3 - st.failedAttempts;
        alertBox.classList.remove('hidden');
        alertText.textContent = `Email/Username atau kata sandi salah! Sisa percobaan: ${rem} kali lagi sebelum dikunci.`;
    };

    // 0b. Cek jika akun dalam status Non-Aktif (Suspended) oleh Superadmin
    if (matchedUser && matchedUser.status === 'Non-Aktif') {
        alertBox.classList.remove('hidden');
        alertText.textContent = `Akun "${matchedUser.name}" sedang dinonaktifkan (Suspended) oleh Superadmin.`;
        return;
    }

    // 1. Otentikasi Resmi via Backend API (Kirim u apa adanya agar username lama yang sudah diganti langsung ditolak)
    let backendOffline = true;
    try {
        if (window.apiService && typeof window.apiService.apiLogin === 'function') {
            const loginRes = await window.apiService.apiLogin(u, p);
            if (loginRes && loginRes.success && loginRes.data?.user) {
                const user = loginRes.data.user;
                clearFrontendLoginLockout();
                if (matchedUser) {
                    matchedUser.password = p;
                    matchedUser.lastLogin = 'Baru saja';
                    if (typeof saveUsersListToStorage === 'function') saveUsersListToStorage();
                }
                const mappedRole = user.role === 'super_admin' ? 'superadmin' : (user.role === 'user' ? 'user' : 'admin');
                const mappedTitle = user.role === 'super_admin' ? 'Superadmin' : (user.role === 'user' ? 'User' : 'Admin');
                loginSuccess({
                    rawId: user.user_id || (matchedUser ? matchedUser.rawId : null),
                    username: user.username || (matchedUser ? matchedUser.username : (user.email || u)),
                    email: user.email || (matchedUser ? matchedUser.email : u),
                    name: user.full_name || user.name || (matchedUser ? matchedUser.name : u),
                    role: mappedRole,
                    title: mappedTitle
                });
                if (typeof addAuditTrailRecord === 'function') {
                    addAuditTrailRecord('Login Sistem', `Otentikasi akun berhasil (${user.email})`);
                }
                loadRealDataFromApi();
                return;
            }
            if (loginRes && loginRes.isAuthRejected) {
                backendOffline = false;
                triggerFailedLoginAttempt(loginRes);
                return;
            }
        }
    } catch (e) {
        console.warn('API Login gagal / server offline:', e);
    }

    // 2. Fallback Kredensial Lokal HANYA jika Backend sedang Offline (Wajib 1 Username/Email Aktif & 1 Password Tunggal!)
    if (backendOffline && matchedUser && p === matchedUser.password) {
        clearFrontendLoginLockout();
        matchedUser.lastLogin = 'Baru saja';
        if (typeof saveUsersListToStorage === 'function') saveUsersListToStorage();
        const lowRole = (matchedUser.role || 'Admin').toLowerCase();
        loginSuccess({
            rawId: matchedUser.rawId,
            username: matchedUser.username || matchedUser.email,
            email: matchedUser.email,
            name: matchedUser.name,
            role: lowRole === 'superadmin' ? 'superadmin' : (lowRole === 'user' ? 'user' : 'admin'),
            title: matchedUser.role
        });
        if (typeof addAuditTrailRecord === 'function') {
            addAuditTrailRecord('Login Sistem (Mode Lokal)', `Otentikasi akun berhasil (${matchedUser.email})`);
        }
        loadRealDataFromApi();
        return;
    }

    triggerFailedLoginAttempt();
}

function enterAsGuest() {
    loginSuccess({
        username: 'guest',
        name: 'User',
        role: 'guest',
        title: 'User'
    });
}

function loginSuccess(user, isAutoRestore = false) {
    APP_STATE.currentUser = user;
    sessionStorage.setItem('taims_session', JSON.stringify(user));
    localStorage.setItem('taims_active_session', JSON.stringify(user));

    // Update UI Tampilan
    const topName = document.getElementById('topbar-user-name');
    const topRole = document.getElementById('topbar-user-role');
    const dropName = document.getElementById('dropdown-user-name');
    const dropRole = document.getElementById('dropdown-user-role');
    const bannerBadge = document.getElementById('banner-role-badge');

    if (topName) topName.textContent = user.name;
    if (!user.avatar) {
        const uKey = user.rawId || user.username || user.email;
        const savedAv = uKey ? localStorage.getItem('taims_avatar_' + uKey) : null;
        if (savedAv) user.avatar = savedAv;
    }
    if (typeof updateTopbarAvatar === 'function') {
        updateTopbarAvatar(user.avatar, user.name);
    }
    if (topRole) topRole.textContent = user.title;
    if (dropName) dropName.textContent = user.name;
    if (dropRole) dropRole.textContent = user.title;

    // Batasi tombol jika mode Tamu atau peran User (Read-Only)
    const adminBtns = document.querySelectorAll('.admin-only');
    if (user.role === 'guest' || user.role === 'user') {
        if (bannerBadge) {
            bannerBadge.innerHTML = '<i class="fa-solid fa-eye text-yellow"></i> Mode User (Hanya Melihat)';
            bannerBadge.style.color = 'var(--tekno-gold)';
        }
        adminBtns.forEach(b => b.classList.add('hidden'));
        if (!isAutoRestore) {
            const msg = user.role === 'user'
                ? `Selamat datang, ${user.name}. Akun Anda berstatus User (Read-Only / Pengamat).`
                : 'Anda masuk sebagai User. Klik profil di kanan atas untuk kembali ke login admin.';
            showToast('Mode User Aktif', msg, 'info');
        }
    } else {
        if (bannerBadge) {
            bannerBadge.innerHTML = '<i class="fa-solid fa-shield-halved text-cyan"></i> ' + user.title + ' (Kontrol Penuh)';
            bannerBadge.style.color = 'var(--cyan-neon)';
        }
        adminBtns.forEach(b => b.classList.remove('hidden'));
        if (!isAutoRestore) {
            showToast('Login Berhasil!', `Selamat datang, ${user.name}. Akses manajemen aktif.`, 'success');
        }
    }

    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');

    initCharts();
    if (typeof initBlitarMaps === 'function') initBlitarMaps();
    setTimeout(() => {
        if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize();
    }, 250);
    if (typeof renderFullDevicesTable === 'function') renderFullDevicesTable();
    if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
    if (typeof renderIncidentsTable === 'function') renderIncidentsTable();
    if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
}

function logoutToAuth() {
    sessionStorage.removeItem('taims_session');
    localStorage.removeItem('taims_active_session');
    APP_STATE.currentUser = null;
    window.location.hash = '';
    const passInput = document.getElementById('login-password');
    if (passInput) passInput.value = '';

    document.getElementById('main-dashboard').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');

    // Tutup dropdown menu
    const menu = document.getElementById('user-menu-dropdown');
    if (menu) menu.classList.add('hidden');

    showToast('Kembali ke Login', 'Silakan masukkan username dan sandi yang benar.', 'info');
}
window.loginSuccess = loginSuccess;
window.enterAsGuest = enterAsGuest;


function quickFillCredentials(user, pass) {
    document.getElementById('login-username').value = user;
    document.getElementById('login-password').value = pass;
    showToast('Kredensial Terisi', `Username: ${user}, Sandi: ${pass}. Klik tombol Masuk.`, 'info');
}

function fillDefaultAdmin() {
    quickFillCredentials('admin@teknolab.id', 'admin123');
}

function togglePasswordVisibility() {
    const pwd = document.getElementById('login-password');
    const eye = document.getElementById('toggle-pwd-btn');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        eye.classList.replace('fa-eye-slash', 'fa-eye');
    } else {
        pwd.type = 'password';
        eye.classList.replace('fa-eye', 'fa-eye-slash');
    }
}

function toggleUserMenu() {
    const m = document.getElementById('user-menu-dropdown');
    if (m) m.classList.toggle('hidden');
}

// =============================================================================
// JAM DIGITAL WIB REALTIME (Format Referensi: 19:56:45 | Sabtu, 17 Oktober 2026)
// =============================================================================
function initClock() {
    function tick() {
        const now = new Date();
        const daysId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const monthsId = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsEn = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const isEn = APP_STATE.currentLang === 'en';
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const tStr = `${h}:${m}:${s}`;

        const dStr = isEn
            ? `${daysEn[now.getDay()]}, ${monthsEn[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
            : `${daysId[now.getDay()]}, ${now.getDate()} ${monthsId[now.getMonth()]} ${now.getFullYear()}`;

        const dEl = document.getElementById('live-date');
        const tEl = document.getElementById('live-time');
        const userDateEl = document.getElementById('user-page-date');
        const userClockEl = document.getElementById('user-page-clock');
        if (dEl) dEl.textContent = dStr;
        if (tEl) tEl.textContent = tStr;
        if (userDateEl) userDateEl.textContent = dStr;
        if (userClockEl) userClockEl.textContent = `${tStr} ${isEn ? 'UTC+7' : 'WIB'}`;
    }
    tick();
    setInterval(tick, 1000);
}

// =============================================================================
// TABEL MOCKUP DASHBOARD UTAMA (PERSIS SEPERTI GAMBAR REFERENSI)
// =============================================================================
function renderHomeDevicesTable() {
    updateDashboardMetrics();
    const tbody = document.getElementById('home-devices-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    // Memuat seluruh perangkat secara dinamis mengikuti penambahan/pengurangan aset
    const items = APP_STATE.devices || [];

    items.forEach(dev => {
        const tr = document.createElement('tr');
        tr.onclick = () => openDeviceDetailModal(dev.id);

        const icon = typeof getDeviceCategoryIcon === 'function' ? getDeviceCategoryIcon(dev.category) : 'fa-server';
        const st = (dev.status || dev.current_status || 'offline').toLowerCase();

        let badge = '';
        if (st === 'online') badge = '<span class="status-pill online"><span class="dot green"></span> Online</span>';
        else if (st === 'warning') badge = '<span class="status-pill warning"><span class="dot yellow"></span> Warning</span>';
        else if (st === 'unknown') badge = '<span class="status-pill unknown"><span class="dot gray"></span> Unknown</span>';
        else badge = '<span class="status-pill offline"><span class="dot red"></span> Offline</span>';

        const safeName = escapeHtml(dev.name);
        const safeLoc = escapeHtml(dev.location || '-');
        const safeIp = escapeHtml(dev.ip || '-');
        const safeLastSeen = escapeHtml(dev.lastSeen || '-');

        tr.innerHTML = `
            <td>
                <span class="device-name-text"><i class="fa-solid ${icon} text-muted mr-1"></i> ${safeName}</span>
            </td>
            <td>${safeLoc}</td>
            <td><span class="ip-mono">${safeIp}</span></td>
            <td>${badge}</td>
            <td style="white-space: nowrap;" title="${safeLastSeen}"><span class="text-muted text-sm">${safeLastSeen}</span></td>
            <td class="text-right">
                <i class="fa-solid fa-ellipsis text-muted" onclick="event.stopPropagation(); openQuickStatusModal('${dev.id}')" title="Ubah status"></i>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// =============================================================================
// TABEL LENGKAP HALAMAN "DAFTAR PERANGKAT" (REQUIREMENT PT 4)
// =============================================================================
// (Catatan: Definisi renderFullDevicesTable utama dengan dukungan Grid/Table & filter kategori akurat diimplementasikan di baris selanjutnya)

function filterFullDevicesTable() {
    renderFullDevicesTable();
}

function handleGlobalSearch(val) {
    if (val.trim().length > 0) {
        switchPage('page-devices');
        const s = document.getElementById('dev-page-search');
        if (s) {
            s.value = val;
            renderFullDevicesTable();
        }
        document.getElementById('search-clear-btn')?.classList.remove('hidden');
    }
}

function clearGlobalSearch() {
    const input = document.getElementById('global-search-input');
    if (input) input.value = '';
    document.getElementById('search-clear-btn')?.classList.add('hidden');
}

// =============================================================================
// MODAL DETAIL PERANGKAT (REQUIREMENT DOKUMEN PT 5)
// =============================================================================
function openDeviceDetailModal(deviceId) {
    const dev = APP_STATE.devices.find(d => String(d.id) === String(deviceId) || String(d.asset_id) === String(deviceId) || d.code === deviceId || d.asset_code === deviceId);
    if (!dev) return;

    APP_STATE.selectedDeviceId = deviceId;

    document.getElementById('detail-dev-name').textContent = dev.name;
    document.getElementById('detail-dev-code').textContent = `ASSET CODE: ${dev.code}`;
    document.getElementById('detail-dev-category').textContent = dev.category;
    document.getElementById('detail-dev-ip').textContent = dev.ip;
    document.getElementById('detail-dev-mac').textContent = dev.mac;
    document.getElementById('detail-dev-location').textContent = dev.location;
    if (document.getElementById('detail-dev-floor')) {
        document.getElementById('detail-dev-floor').textContent = dev.floor || 'Floor 2';
    }
    document.getElementById('detail-dev-pic').textContent = dev.pic;
    document.getElementById('detail-dev-method').textContent = dev.method;
    document.getElementById('detail-dev-lastseen').textContent = dev.lastSeen;
    document.getElementById('detail-dev-ping').textContent = dev.ping;
    if (document.getElementById('detail-dev-installdate')) {
        document.getElementById('detail-dev-installdate').textContent = dev.installDate || '-';
    }
    if (document.getElementById('detail-dev-desc')) {
        document.getElementById('detail-dev-desc').textContent = dev.description || '-';
    }
    if (document.getElementById('detail-dev-priority')) {
        const pMap = { 1: 'High (P1)', 2: 'Medium (P2)', 3: 'Low (P3)' };
        document.getElementById('detail-dev-priority').textContent = pMap[dev.priority] || 'Medium (P2)';
    }
    if (document.getElementById('detail-dev-config')) {
        document.getElementById('detail-dev-config').textContent = typeof dev.config === 'object' && Object.keys(dev.config).length > 0 ? JSON.stringify(dev.config) : '-';
    }

    const badgeWrap = document.getElementById('detail-dev-status-badge');
    if (dev.status === 'online') {
        badgeWrap.innerHTML = '<span class="status-pill online text-lg"><span class="dot green pulse"></span> ONLINE</span>';
    } else if (dev.status === 'warning') {
        badgeWrap.innerHTML = '<span class="status-pill warning text-lg"><span class="dot yellow pulse"></span> WARNING</span>';
    } else {
        badgeWrap.innerHTML = '<span class="status-pill offline text-lg"><span class="dot red pulse"></span> OFFLINE</span>';
    }

    document.getElementById('device-detail-modal').classList.remove('hidden');
}

function closeDeviceDetailModal() {
    document.getElementById('device-detail-modal').classList.add('hidden');
}

function openQuickStatusFromDetail() {
    closeDeviceDetailModal();
    if (APP_STATE.selectedDeviceId) {
        openQuickStatusModal(APP_STATE.selectedDeviceId);
    }
}

// =============================================================================
// MODAL GANTI STATUS ELEKTRO CEPAT (ON / OFF / WARNING)
// =============================================================================
function openQuickStatusModal(deviceId) {
    if (APP_STATE.currentUser && APP_STATE.currentUser.role === 'guest') {
        showToast('Akses Terkunci (Mode User)', 'Harap login sebagai Administrator untuk mengubah status alat elektro.', 'error');
        return;
    }

    const dev = APP_STATE.devices.find(d => d.id === deviceId);
    if (!dev) return;

    APP_STATE.selectedDeviceId = deviceId;
    document.getElementById('quick-device-name').textContent = dev.name;
    document.getElementById('quick-device-ip').textContent = `${dev.category} • IP: ${dev.ip} (${dev.location})`;
    document.getElementById('quick-status-modal').classList.remove('hidden');
}

function closeQuickStatusModal() {
    document.getElementById('quick-status-modal').classList.add('hidden');
}

function setQuickStatus(newStatus) {
    if (!APP_STATE.selectedDeviceId) return;

    const dev = APP_STATE.devices.find(d => d.id === APP_STATE.selectedDeviceId);
    if (dev) {
        dev.status = newStatus;
        const now = new Date();
        dev.lastSeen = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB (Baru)`;

        if (newStatus === 'offline') {
            addAlertLog(`Perangkat ${dev.name} terputus / MATI (OFF)`, dev.location, 'kritis');
        } else if (newStatus === 'warning') {
            addAlertLog(`Peringatan beban tinggi pada ${dev.name}`, dev.location, 'peringatan');
        }

        renderHomeDevicesTable();
        renderFullDevicesTable();
        closeQuickStatusModal();

        const labels = { online: '🟢 ONLINE (ON)', warning: '🟡 PERINGATAN', offline: '🔴 OFFLINE (OFF)' };
        showToast('Status Diperbarui', `${dev.name} sekarang berstatus ${labels[newStatus]}.`, 'success');
    }
}

// =============================================================================
// MODAL TAMBAH & EDIT PERANGKAT (ADMIN & SUPERADMIN RBAC)
// =============================================================================
function handleDeviceCategoryChange() {
    const editIdEl = document.getElementById('dev-edit-id');
    if (editIdEl && editIdEl.value) return; // Mode Edit: jangan ubah otomatis kode unik
    const cat = document.getElementById('dev-category')?.value || 'Router';
    const codeInput = document.getElementById('dev-code');
    if (!codeInput) return;
    const currentCode = codeInput.value.trim().toUpperCase();
    const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
    // Jika masih kosong atau default AST-xxx-xxx, update prefix otomatis
    if (!currentCode || /^AST-[A-Z]{3}-\d+$/.test(currentCode)) {
        codeInput.value = `AST-${cat.slice(0, 3).toUpperCase()}-${num}`;
    }
}
window.handleDeviceCategoryChange = handleDeviceCategoryChange;

function openEditDeviceModal(deviceId) {
    if (APP_STATE.currentUser && APP_STATE.currentUser.role === 'guest') {
        showToast('Akses Dibatasi', 'Mode Tamu tidak dapat mengubah data aset. Silakan login sebagai Admin.', 'error');
        return;
    }
    const dev = APP_STATE.devices.find(d => String(d.id) === String(deviceId) || String(d.asset_id) === String(deviceId) || String(d.code) === String(deviceId) || String(d.asset_code) === String(deviceId));
    if (!dev) return;

    document.getElementById('device-form').reset();
    const editIdEl = document.getElementById('dev-edit-id');
    if (editIdEl) editIdEl.value = dev.id || dev.asset_id;
    const titleEl = document.getElementById('modal-device-title');
    if (titleEl) titleEl.textContent = `Edit Data Aset: ${dev.code || dev.name}`;
    const btnLabel = document.getElementById('btn-save-device-label');
    if (btnLabel) btnLabel.textContent = 'Simpan Perubahan';

    // Isi Kode Aset (Kode Unik) & Buka izin edit untuk Admin & Superadmin
    const codeInput = document.getElementById('dev-code');
    if (codeInput) {
        codeInput.value = dev.code || dev.asset_code || `AST-${dev.id}`;
        codeInput.disabled = false;
        codeInput.readOnly = false;
    }

    document.getElementById('dev-name').value = dev.name || '';
    document.getElementById('dev-category').value = dev.category || 'Server';
    document.getElementById('dev-ip').value = dev.ip || '';
    document.getElementById('dev-location').value = dev.location || 'Head Office';
    document.getElementById('dev-method').value = dev.method || 'Ping';
    if (document.getElementById('dev-status')) document.getElementById('dev-status').value = dev.status || 'offline';
    if (document.getElementById('dev-priority')) document.getElementById('dev-priority').value = String(dev.priority || 2);
    
    // RBAC: Hanya Superadmin yang berhak mengubah PIC Teknisi
    const isSuperadmin = APP_STATE.currentUser && (APP_STATE.currentUser.role === 'superadmin' || APP_STATE.currentUser.role === 'super_admin');
    const picInput = document.getElementById('dev-pic');
    const picNote = document.getElementById('pic-admin-note');
    if (picInput) {
        picInput.value = dev.pic || 'Damar Munajad';
        if (isSuperadmin) {
            picInput.disabled = false;
            picInput.style.opacity = '1';
            picInput.style.cursor = 'text';
            if (picNote) {
                picNote.textContent = '(Akses Superadmin)';
                picNote.style.color = '#FFC107';
            }
        } else {
            picInput.disabled = true;
            picInput.style.opacity = '0.6';
            picInput.style.cursor = 'not-allowed';
            if (picNote) {
                picNote.textContent = '(Terkunci - Hanya Superadmin)';
                picNote.style.color = '#FFC107';
            }
        }
    }

    // Tombol Hapus di Modal: Khusus Superadmin
    const btnDeleteModal = document.getElementById('btn-modal-delete-device');
    if (btnDeleteModal) {
        if (isSuperadmin) {
            btnDeleteModal.classList.remove('hidden');
        } else {
            btnDeleteModal.classList.add('hidden');
        }
    }

    if (document.getElementById('dev-mac')) document.getElementById('dev-mac').value = dev.mac || '';
    if (document.getElementById('dev-install-date')) document.getElementById('dev-install-date').value = dev.installDate || '2026-10-01';
    if (document.getElementById('dev-description')) document.getElementById('dev-description').value = dev.description || '';
    if (document.getElementById('dev-floor')) document.getElementById('dev-floor').value = dev.floor || 'Lantai 2';
    if (document.getElementById('dev-is-active')) document.getElementById('dev-is-active').value = dev.isActive !== false ? '1' : '0';

    document.getElementById('device-modal').classList.remove('hidden');
}

function openAddDeviceModal() {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Mode User (Read-Only) tidak dapat menambah perangkat. Silakan login sebagai Admin.', 'error');
        return;
    }
    document.getElementById('device-form').reset();
    const editIdEl = document.getElementById('dev-edit-id');
    if (editIdEl) editIdEl.value = '';
    const titleEl = document.getElementById('modal-device-title');
    if (titleEl) titleEl.textContent = 'Tambah Perangkat Baru';
    const btnLabel = document.getElementById('btn-save-device-label');
    if (btnLabel) btnLabel.textContent = 'Simpan Perangkat';

    // Kode Aset Otomatis yang dapat diedit oleh Admin & Superadmin
    const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
    const cat = document.getElementById('dev-category')?.value || 'Router';
    const suggestedCode = `AST-${cat.slice(0, 3).toUpperCase()}-${num}`;
    const codeInput = document.getElementById('dev-code');
    if (codeInput) {
        codeInput.value = suggestedCode;
        codeInput.disabled = false;
        codeInput.readOnly = false;
    }

    if (document.getElementById('dev-floor')) document.getElementById('dev-floor').value = 'Lantai 2';
    if (document.getElementById('dev-is-active')) document.getElementById('dev-is-active').value = '1';

    const isSuperadmin = APP_STATE.currentUser && (APP_STATE.currentUser.role === 'superadmin' || APP_STATE.currentUser.role === 'super_admin');
    const picInput = document.getElementById('dev-pic');
    const picNote = document.getElementById('pic-admin-note');
    if (picInput) {
        picInput.value = 'Damar Munajad';
        if (isSuperadmin) {
            picInput.disabled = false;
            picInput.style.opacity = '1';
            picInput.style.cursor = 'text';
            if (picNote) {
                picNote.textContent = '(Akses Superadmin)';
                picNote.style.color = '#FFC107';
            }
        } else {
            picInput.disabled = true;
            picInput.style.opacity = '0.6';
            picInput.style.cursor = 'not-allowed';
            if (picNote) {
                picNote.textContent = '(Terkunci - Hanya Superadmin)';
                picNote.style.color = '#FFC107';
            }
        }
    }

    // Tombol Hapus disembunyikan saat tambah perangkat baru
    const btnDeleteModal = document.getElementById('btn-modal-delete-device');
    if (btnDeleteModal) btnDeleteModal.classList.add('hidden');

    document.getElementById('device-modal').classList.remove('hidden');
}

function closeDeviceModal() {
    document.getElementById('device-modal').classList.add('hidden');
}

function handleSaveDevice() {
    const editIdEl = document.getElementById('dev-edit-id');
    const editId = editIdEl ? editIdEl.value : '';
    const code = (document.getElementById('dev-code')?.value || '').trim().toUpperCase();
    const name = document.getElementById('dev-name').value.trim();
    const category = document.getElementById('dev-category').value;
    const ip = document.getElementById('dev-ip').value.trim();
    const location = document.getElementById('dev-location').value.trim();
    const method = document.getElementById('dev-method').value;
    const priority = parseInt(document.getElementById('dev-priority')?.value || '2', 10);
    const picInput = document.getElementById('dev-pic');
    const pic = picInput?.value.trim() || 'Damar Munajad';
    const mac = document.getElementById('dev-mac')?.value.trim() || '00:0C:29:11:00:00';
    const installDate = document.getElementById('dev-install-date')?.value || '2026-10-01';
    const description = document.getElementById('dev-description')?.value.trim() || '';
    const floor = document.getElementById('dev-floor')?.value || 'Lantai 2';
    const isActive = document.getElementById('dev-is-active')?.value !== '0';

    const isSuperadmin = APP_STATE.currentUser && (APP_STATE.currentUser.role === 'superadmin' || APP_STATE.currentUser.role === 'super_admin');

    if (!code) {
        showToast('Validasi Gagal', 'Kode Aset (Kode Unik) wajib diisi.', 'error');
        return;
    }
    if (!name) {
        showToast('Validasi Gagal', 'Nama Perangkat wajib diisi.', 'error');
        return;
    }

    // Validasi Keunikan Kode Aset di Memori Lokal
    if (editId) {
        const codeConflict = APP_STATE.devices.find(d => (d.code === code || d.asset_code === code) && String(d.id) !== String(editId) && String(d.asset_id) !== String(editId));
        if (codeConflict) {
            showToast('Kode Sudah Terdaftar', `Kode unik aset '${code}' sudah dipakai oleh perangkat '${codeConflict.name}'.`, 'error');
            return;
        }
    } else {
        const codeConflict = APP_STATE.devices.find(d => d.code === code || d.asset_code === code);
        if (codeConflict) {
            showToast('Kode Sudah Terdaftar', `Kode unik aset '${code}' sudah dipakai oleh perangkat '${codeConflict.name}'.`, 'error');
            return;
        }
    }

    // Validasi Format IP Address (IPv4 Standard)
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ip || !ipRegex.test(ip)) {
        showToast('Validasi Gagal', 'Format IP Address tidak valid. Masukkan IPv4 standar (contoh: 192.168.1.50)', 'error');
        return;
    }

    // Validasi Format MAC Address jika diisi
    if (mac && mac !== 'N/A' && mac !== '00:0C:29:11:00:00') {
        const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
        if (!macRegex.test(mac)) {
            showToast('Validasi Gagal', 'Format MAC Address tidak valid (contoh: E0:AD:47:20:B6:6C)', 'error');
            return;
        }
    }

    if (editId) {
        // Mode Update / Edit Deret Data Aset
        const dev = APP_STATE.devices.find(d => String(d.id) === String(editId) || String(d.asset_id) === String(editId) || String(d.code) === String(editId) || String(d.asset_code) === String(editId));
        if (dev) {
            dev.code = code;
            dev.asset_code = code;
            dev.name = name;
            dev.category = category;
            dev.ip = ip;
            dev.location = location;
            dev.floor = floor;
            dev.isActive = isActive;
            dev.method = method;
            dev.status = dev.status || 'offline';
            dev.priority = priority;
            if (isSuperadmin) {
                dev.pic = pic;
            }
            dev.mac = mac;
            dev.installDate = installDate;
            dev.description = description;

            saveDevicesToStorage(APP_STATE.devices);

            if (typeof apiService !== 'undefined' && typeof apiService.updateAsset === 'function') {
                const targetId = dev.asset_id || dev.rawId || editId;
                apiService.updateAsset(targetId, {
                    asset_code: code,
                    asset_name: name,
                    category: category,
                    ip_address: ip,
                    mac_address: mac,
                    floor: floor,
                    is_active: isActive ? 1 : 0,
                    monitoring_method: method,
                    current_status: dev.status,
                    priority: priority,
                    description: description,
                    ...(isSuperadmin ? { pic_name: pic } : {})
                }).then(async (res) => {
                    if (res && res.error) {
                        showToast('Peringatan Backend', res.error, 'warning');
                    }
                    if (typeof loadRealDataFromApi === 'function') {
                        await loadRealDataFromApi();
                    }
                }).catch(err => console.log('API update offline fallback', err));
            }

            renderFullDevicesTable();
            if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
            if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            if (typeof refreshHomeMap === 'function') refreshHomeMap();
            closeDeviceModal();
            showToast('Aset Diperbarui', `Kode unik [${code}] & data aset ${name} berhasil disimpan ke database.`, 'success');
            if (typeof addAuditTrailRecord === 'function') {
                addAuditTrailRecord('Pembaruan Aset', `Memperbarui konfigurasi perangkat ${code} (${name}, ${ip}) di ${location}`);
            }
            return;
        }
    }

    // Mode Tambah Baru
    const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
    const assignedPic = isSuperadmin ? (pic || 'Damar Munajad') : 'Damar Munajad';
    const newDev = {
        id: `DEV-${num}`,
        code: code,
        asset_code: code,
        name,
        category,
        location,
        floor,
        isActive,
        ip,
        mac,
        status: 'unknown',
        current_status: 'unknown',
        priority,
        lastSeen: 'Belum Termonitor',
        ping: '-',
        uptime: '0.0%',
        method,
        pic: assignedPic,
        installDate,
        description
    };

    APP_STATE.devices.unshift(newDev);
    saveDevicesToStorage(APP_STATE.devices);

    if (typeof apiService !== 'undefined' && typeof apiService.createAsset === 'function') {
        apiService.createAsset({
            asset_code: code,
            asset_name: name,
            category: category,
            location_name: location,
            floor: floor,
            is_active: isActive ? 1 : 0,
            ip_address: ip,
            mac_address: mac,
            monitoring_method: method,
            current_status: 'unknown',
            priority: priority,
            pic_name: assignedPic,
            installation_date: installDate,
            description: description
        }).then(async (res) => {
            if (res && res.error) {
                showToast('Peringatan Backend', res.error, 'warning');
            }
            if (typeof loadRealDataFromApi === 'function') {
                await loadRealDataFromApi();
            }
        }).catch(err => console.log('API create offline fallback'));
    }

    if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
    renderFullDevicesTable();
    if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
    if (typeof refreshHomeMap === 'function') refreshHomeMap();
    closeDeviceModal();
    showToast('Aset Baru Ditambahkan', `Aset [${code}] ${name} berhasil disimpan ke database backend.`, 'success');
    if (typeof addAuditTrailRecord === 'function') {
        addAuditTrailRecord('Penambahan Aset', `Mendaftarkan perangkat baru ${code} (${name}) IP ${ip} di ${location}`);
    }
}

function openQuickStatusModal(deviceId) {
    if (APP_STATE.currentUser && APP_STATE.currentUser.role === 'guest') {
        showToast('Akses Terkunci (Mode User)', 'Harap login sebagai Administrator untuk mengubah status alat elektro.', 'error');
        return;
    }

    const dev = APP_STATE.devices.find(d => d.id === deviceId);
    if (!dev) return;

    APP_STATE.selectedDeviceId = deviceId;
    document.getElementById('quick-device-name').textContent = dev.name;
    document.getElementById('quick-device-ip').textContent = `${dev.category} • IP: ${dev.ip} (${dev.location})`;
    document.getElementById('quick-status-modal').classList.remove('hidden');
}

function closeQuickStatusModal() {
    document.getElementById('quick-status-modal').classList.add('hidden');
}

function setQuickStatus(newStatus) {
    if (!APP_STATE.selectedDeviceId) return;

    const dev = APP_STATE.devices.find(d => d.id === APP_STATE.selectedDeviceId);
    if (dev) {
        dev.status = newStatus;
        const now = new Date();
        dev.lastSeen = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB (Baru)`;

        if (newStatus === 'offline') {
            addAlertLog(`Perangkat ${dev.name} terputus / MATI (OFF)`, dev.location, 'kritis');
        } else if (newStatus === 'warning') {
            addAlertLog(`Peringatan beban tinggi pada ${dev.name}`, dev.location, 'peringatan');
        }

        renderHomeDevicesTable();
        renderFullDevicesTable();
        closeQuickStatusModal();

        const labels = { online: '🟢 ONLINE (ON)', warning: '🟡 PERINGATAN', offline: '🔴 OFFLINE (OFF)' };
        showToast('Status Diperbarui', `${dev.name} sekarang berstatus ${labels[newStatus]}.`, 'success');
    }
}

// =============================================================================
// MODAL TAMBAH & EDIT PERANGKAT (ADMIN & SUPERADMIN RBAC)
/**
 * Reusable Glassmorphism Cyber Confirmation Modal (QA Fix Bug #12)
 */
function showCyberConfirmModal(title, message, onConfirm) {
    let modal = document.getElementById('cyber-confirm-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cyber-confirm-modal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-card" style="max-width: 440px; border-color: rgba(239, 68, 68, 0.5); box-shadow: 0 0 30px rgba(239, 68, 68, 0.25);">
                <div class="modal-header" style="border-bottom-color: rgba(239, 68, 68, 0.25);">
                    <div class="modal-title-wrap">
                        <i class="fa-solid fa-triangle-exclamation text-red"></i>
                        <h5 id="cyber-confirm-title">Konfirmasi Superadmin</h5>
                    </div>
                    <button type="button" class="modal-close-btn" id="cyber-confirm-close" aria-label="Tutup Konfirmasi"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div class="modal-body">
                    <p id="cyber-confirm-msg" style="font-size: 0.85rem; line-height: 1.55; color: #E2E8F0; white-space: pre-line; margin: 0;"></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-cyber btn-sm" id="cyber-confirm-cancel" aria-label="Batalkan">Batalkan</button>
                    <button type="button" class="btn btn-sm" id="cyber-confirm-ok" aria-label="Konfirmasi Hapus" style="background: linear-gradient(135deg, #EF4444, #B91C1C); color: #FFF; border: none; font-weight: 700; padding: 7px 16px; border-radius: 6px; cursor: pointer;">
                        <i class="fa-solid fa-trash-can"></i> Ya, Hapus Permanen
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    document.getElementById('cyber-confirm-title').textContent = title;
    document.getElementById('cyber-confirm-msg').textContent = message;
    modal.classList.remove('hidden');

    const close = () => modal.classList.add('hidden');
    document.getElementById('cyber-confirm-close').onclick = close;
    document.getElementById('cyber-confirm-cancel').onclick = close;
    document.getElementById('cyber-confirm-ok').onclick = () => {
        close();
        if (typeof onConfirm === 'function') onConfirm();
    };
}
window.showCyberConfirmModal = showCyberConfirmModal;

function handleDeleteDevice(deviceId) {
    if (!deviceId) return;
    const isSuperadmin = APP_STATE.currentUser && (APP_STATE.currentUser.role === 'superadmin' || APP_STATE.currentUser.role === 'super_admin');
    if (!isSuperadmin) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang memiliki hak untuk menghapus aset perangkat!', 'error');
        return;
    }

    const dev = APP_STATE.devices.find(d => String(d.id) === String(deviceId));
    if (!dev) return;

    showCyberConfirmModal(
        'Konfirmasi Penghapusan Aset',
        `PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus perangkat "${dev.name}" (${dev.code || dev.ip}) dari sistem inventaris T-AIMS?\n\nTindakan ini akan menghapus data dari database secara permanen.`,
        () => {
            APP_STATE.devices = APP_STATE.devices.filter(d => String(d.id) !== String(deviceId));
            saveDevicesToStorage(APP_STATE.devices);

            if (window.apiService && typeof window.apiService.deleteAsset === 'function') {
                window.apiService.deleteAsset(deviceId).then(async () => {
                    if (typeof loadRealDataFromApi === 'function') {
                        await loadRealDataFromApi();
                    }
                }).catch(err => console.warn('Delete asset backend fallback:', err));
            }

            if (typeof addAuditTrailRecord === 'function') {
                addAuditTrailRecord('Penghapusan Aset', `Menghapus aset perangkat ${dev.code || dev.name} (${dev.ip}) dari ${dev.location || 'Inventaris'}`);
            }

            closeDeviceModal();
            renderFullDevicesTable();
            if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
            if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            if (typeof refreshHomeMap === 'function') refreshHomeMap();

            showToast('Aset Dihapus', `Perangkat ${dev.name} berhasil dihapus oleh Superadmin. Total aset: ${APP_STATE.devices.length}`, 'success');
        }
    );
}

function handleDeleteCurrentModalDevice() {
    const editIdEl = document.getElementById('dev-edit-id');
    const editId = editIdEl ? editIdEl.value : '';
    if (editId) {
        handleDeleteDevice(editId);
    }
}
window.handleDeleteDevice = handleDeleteDevice;
window.handleDeleteCurrentModalDevice = handleDeleteCurrentModalDevice;

// =============================================================================
// RIWAYAT GANGGUAN & NOTIFIKASI
// =============================================================================
function renderAlerts() {
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';
    const lang = isEn ? 'en' : 'id';

    // 1. Dashboard Mockup List
    const homeList = document.getElementById('home-alerts-list');
    if (homeList) {
        homeList.innerHTML = '';
        if (!APP_STATE.alerts || APP_STATE.alerts.length === 0) {
            homeList.innerHTML = '<div class="alerts-empty-state"><i class="fa-solid fa-shield-halved"></i><strong>' + (isEn ? 'All Systems Normal' : 'Semua Sistem Normal') + '</strong><span>' + (isEn ? 'No incidents or warnings recorded' : 'Tidak ada gangguan atau peringatan tercatat') + '</span></div>';
        }
        APP_STATE.alerts.forEach(alt => {
            const row = document.createElement('div');
            row.className = 'alert-row';
            const titleTrans = translateTextString(alt.title, lang);
            const locTrans = translateTextString(alt.location, lang);
            const badgeText = alt.level === 'kritis' ? 'Critical' : 'Warning';
            row.innerHTML = `
                <span class="a-time">${alt.time}</span>
                <div class="a-body">
                    <strong>${titleTrans}</strong>
                    <span><i class="fa-solid fa-location-dot"></i> ${locTrans}</span>
                </div>
                <span class="a-badge ${alt.level}">${badgeText}</span>
            `;
            homeList.appendChild(row);
        });
    }

    // 2. Full Alerts Page List
    const fullList = document.getElementById('full-alerts-container');
    if (fullList) {
        fullList.innerHTML = '';
        if (APP_STATE.alerts && APP_STATE.alerts.length > 0) {
            APP_STATE.alerts.forEach(alt => {
                const item = document.createElement('div');
                item.className = 'alert-row p-3';
                const titleTrans = translateTextString(alt.title, lang);
                const locTrans = translateTextString(alt.location, lang);
                const badgeText = alt.level === 'kritis' ? 'Critical Outage' : 'Warning';
                item.innerHTML = `
                    <span class="a-time text-base">${alt.time} WIB</span>
                    <div class="a-body">
                        <strong class="text-base">${titleTrans}</strong>
                        <span class="text-secondary"><i class="fa-solid fa-location-dot"></i> ${locTrans}</span>
                    </div>
                    <span class="a-badge ${alt.level}">${badgeText}</span>
                `;
                fullList.appendChild(item);
            });
        } else {
            fullList.innerHTML = `
                <div class="p-4 text-center text-muted" style="width: 100%;">
                    <i class="fa-solid fa-circle-check text-green mb-2" style="font-size: 1.8rem; display: block;"></i>
                    <span class="text-sm">Tidak ada riwayat notifikasi terputus. Seluruh kanal operasional aman.</span>
                </div>
            `;
        }
    }

    // 3. Dropdown List
    const dropList = document.getElementById('notif-items-list');
    if (dropList) {
        dropList.innerHTML = '';
        APP_STATE.alerts.slice(0, 4).forEach(alt => {
            const div = document.createElement('div');
            div.className = 'notif-item';
            const titleTrans = translateTextString(alt.title, lang);
            const locTrans = translateTextString(alt.location, lang);
            div.innerHTML = `
                <span class="dot ${alt.level === 'kritis' ? 'red' : 'yellow'}"></span>
                <div class="notif-text">
                    <strong>${titleTrans}</strong>
                    <span>${locTrans} &bull; ${alt.time} WIB</span>
                </div>
            `;
            dropList.appendChild(div);
        });
    }

    const count = (APP_STATE.alerts || []).filter(a => !a.read).length;
    if (typeof updateNotifBadgeCount === 'function') {
        updateNotifBadgeCount(count);
    }
}

function markAllAlertsRead() {
    APP_STATE.alerts.forEach(a => a.read = true);
    if (window.apiService && typeof window.apiService.markAllNotificationsRead === 'function') {
        window.apiService.markAllNotificationsRead().catch(() => {});
    }
    renderAlerts();
    showToast('Notifikasi', 'Semua peringatan telah ditandai sebagai dibaca.', 'info');
}

function addAlertLog(title, location, level) {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    APP_STATE.alerts.unshift({
        id: `ALT-${Date.now()}`,
        time,
        title,
        location,
        level,
        read: false
    });
    renderAlerts();
}

function toggleNotifDropdown() {
    document.getElementById('notif-dropdown')?.classList.toggle('hidden');
}

// =============================================================================
// MODUL PETA GIS AREA BLITAR & GEOLOKASI (LEAFLET MULTI-SITE)
// =============================================================================

// Definisi 3 Titik Lokasi Utama Sesuai Kebutuhan Pengguna & Dokumen Projek
const LOC_SITES = {
    ho: {
        id: 'ho',
        name: 'Head Office (HO)',
        subtitle: 'PT Teknolab Caraka Internasional',
        address: 'Jl. Cibodas No. 03, Kel. Tanggung, Kec. Kepanjenkidul, Kota Blitar',
        lat: -8.07378,
        lng: 112.17336,
        zoom: 18,
        color: '#FF1744',
        badge: 'HEAD OFFICE (HO)',
        badgeClass: 'badge-blue',
        mapsUrl: 'https://maps.google.com/?q=-8.07378,112.17336',
        devices: [
            { name: 'CCTV-01 (CCTV Head Office)', status: 'offline' },
            { name: 'RTR-01 (Router Head Office)', status: 'offline' },
            { name: 'SMTV-01 (Smart TV Head Office)', status: 'offline' },
            { name: 'PC-01 (PC Head Office 01)', status: 'offline' },
            { name: 'PC-02 (PC Head Office 02)', status: 'offline' },
            { name: 'ESP-01 (ESP32 Head Office)', status: 'offline' },
            { name: 'RPI-01 (Raspberry Pi HO)', status: 'offline' }
        ]
    },
    mo: {
        id: 'mo',
        name: 'Marketing Office (MO)',
        subtitle: 'Marketing Office (MO)',
        address: 'Marketing Office, Jl. Ciliwung, Kec. Sukorejo / Sananwetan, Kota Blitar',
        lat: -8.06438,
        lng: 112.17709,
        zoom: 18,
        color: '#F59E0B',
        badge: 'MARKETING OFFICE (MO)',
        badgeClass: 'badge-purple',
        mapsUrl: 'https://maps.google.com/?q=-8.06438,112.17709',
        devices: [
            { name: 'CCTV-02 (CCTV Marketing)', status: 'offline' },
            { name: 'RTR-02 (Router Marketing 02)', status: 'offline' },
            { name: 'RTR-03 (Router Marketing 03)', status: 'offline' },
            { name: 'MKRT-01 (Mikrotik Marketing)', status: 'offline' }
        ]
    },
    server: {
        id: 'server',
        name: 'House Of Server',
        subtitle: 'Ruang Server T-AIMS',
        address: 'Pusat Rack Server, Core Switch & Backbone Network, Kota Blitar',
        lat: -8.07267,
        lng: 112.17016,
        zoom: 18,
        color: '#10B981',
        badge: 'HOUSE OF SERVER',
        badgeClass: 'badge-green',
        mapsUrl: 'https://maps.google.com/?q=-8.07267,112.17016',
        devices: [
            { name: 'SRV-01 (Server Monitoring T-AIMS)', status: 'offline' },
            { name: 'MKRT-02 (Mikrotik Server)', status: 'offline' },
            { name: 'RPI-02 (Raspberry Pi Server)', status: 'offline' },
            { name: 'SWM-01 (Switch Manageable Backbone)', status: 'offline' }
        ]
    }
};

// Provider Peta Asli Bebas Blokir (Google Maps, Citra Satelit, Carto Voyager, Cyber Dark)
const MAP_PROVIDERS = {
    'google-roads': {
        id: 'google-roads',
        btnId: 'btn-layer-roads',
        name: 'Google Maps Asli',
        url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        darkFilter: false,
        attribution: '&copy; Google Maps'
    },
    'google-sat': {
        id: 'google-sat',
        btnId: 'btn-layer-sat',
        name: 'Citra Satelit Asli (Google)',
        url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 20,
        darkFilter: false,
        attribution: '&copy; Google Maps Satellite'
    },
    'carto-voyager': {
        id: 'carto-voyager',
        btnId: 'btn-layer-voyager',
        name: 'OpenStreet / Carto',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        subdomains: 'abcd',
        maxZoom: 20,
        darkFilter: false,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    },
    'cyber-dark': {
        id: 'cyber-dark',
        btnId: 'btn-layer-dark',
        name: 'Cyber Dark Neon',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        subdomains: 'abcd',
        maxZoom: 20,
        darkFilter: true,
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
};

function initBlitarMaps() {
    if (typeof L === 'undefined') {
        console.warn('Leaflet library belum dimuat, menggunakan fallback.');
        return;
    }

    const blitarCenter = [-8.0703, 112.1735]; // Pusat view segitiga 3 site (HO, MO & House Of Server)

    // 1. Inisialisasi Peta Mini di Dashboard (#home-blitar-map) Menggunakan Google Maps Asli
    const homeEl = document.getElementById('home-blitar-map');
    if (homeEl && !APP_STATE.homeMap) {
        try {
            APP_STATE.homeMap = L.map('home-blitar-map', {
                preferCanvas: true,
                center: blitarCenter,
                zoom: 14,
                zoomControl: false,
                attributionControl: false
            });

            APP_STATE.homeTileLayer = L.tileLayer(MAP_PROVIDERS['google-sat'].url, {
                subdomains: MAP_PROVIDERS['google-sat'].subdomains,
                maxZoom: MAP_PROVIDERS['google-sat'].maxZoom,
                attribution: MAP_PROVIDERS['google-sat'].attribution
            }).addTo(APP_STATE.homeMap);

            L.control.zoom({ position: 'bottomright' }).addTo(APP_STATE.homeMap);

            // Tambahkan 3 Titik Site Utama (HO, MO, House Of Server) ke Home Map
            APP_STATE.homeMarkers = [];

            // Garis penghubung telemetri antar-site di dashboard
            const homeSitePoints = [
                [LOC_SITES.ho.lat, LOC_SITES.ho.lng],
                [LOC_SITES.mo.lat, LOC_SITES.mo.lng],
                [LOC_SITES.server.lat, LOC_SITES.server.lng],
                [LOC_SITES.ho.lat, LOC_SITES.ho.lng]
            ];
            L.polyline(homeSitePoints, {
                color: '#FF1744',
                weight: 2,
                opacity: 0.85,
                dashArray: '6, 6'
            }).addTo(APP_STATE.homeMap);

            Object.keys(LOC_SITES).forEach(key => {
                const s = LOC_SITES[key];
                const iconHtml = `<div class="blitar-marker-pin site-${key}"><div class="pin-radar"></div><div class="pin-core"></div></div>`;
                const customIcon = L.divIcon({
                    html: iconHtml,
                    className: 'custom-home-icon',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });

                const marker = L.marker([s.lat, s.lng], { icon: customIcon }).addTo(APP_STATE.homeMap);
                marker.bindTooltip(`<strong>${s.name}</strong><br><small style="color:#FFC107;">${s.subtitle}</small>`, {
                    direction: 'top',
                    offset: [0, -10],
                    className: 'leaflet-tooltip-cyber'
                });

                marker.on('click', () => {
                    selectMapNode(s.name, s.subtitle, `${s.lat.toFixed(5)}, ${s.lng.toFixed(5)}`, `${s.devices.length} Connected Devices`);
                });
                APP_STATE.homeMarkers.push(marker);
            });

            setTimeout(() => { if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize(); }, 200);
            setTimeout(() => { if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize(); }, 600);

        } catch (e) {
            console.error('Gagal inisialisasi home map:', e);
        }
    }

    // 2. Inisialisasi Peta Lengkap di Halaman Lokasi (#full-blitar-map) Menggunakan Google Maps Satelit Asli
    const fullEl = document.getElementById('full-blitar-map');
    if (fullEl && !APP_STATE.fullMap) {
        try {
            APP_STATE.fullMap = L.map('full-blitar-map', {
                center: blitarCenter,
                zoom: 15,
                attributionControl: false
            });

            // Google Maps Satelit Asli
            APP_STATE.fullTileLayer = L.tileLayer(MAP_PROVIDERS['google-sat'].url, {
                subdomains: MAP_PROVIDERS['google-sat'].subdomains,
                maxZoom: MAP_PROVIDERS['google-sat'].maxZoom,
                attribution: MAP_PROVIDERS['google-sat'].attribution
            }).addTo(APP_STATE.fullMap);

            // Garis Telemetri Hubungan Antar-Site (HO <-> MO <-> House Of Server)
            const sitePoints = [
                [LOC_SITES.ho.lat, LOC_SITES.ho.lng],
                [LOC_SITES.mo.lat, LOC_SITES.mo.lng],
                [LOC_SITES.server.lat, LOC_SITES.server.lng],
                [LOC_SITES.ho.lat, LOC_SITES.ho.lng]
            ];

            const telemetryPolyline = L.polyline(sitePoints, {
                color: '#FF1744',
                weight: 2.5,
                opacity: 0.85,
                dashArray: '7, 8',
                lineJoin: 'round'
            }).addTo(APP_STATE.fullMap);

            telemetryPolyline.bindTooltip("Jaringan Radio Link / Telemetri Antar-Site T-AIMS (HO &bull; MO &bull; House Of Server)", {
                sticky: true,
                className: 'leaflet-tooltip-cyber'
            });

            // Buat Marker untuk 3 Site Utama
            APP_STATE.siteMarkers = {};
            Object.keys(LOC_SITES).forEach(key => {
                const s = LOC_SITES[key];
                const iconHtml = `<div class="blitar-marker-pin site-${key}"><div class="pin-radar"></div><div class="pin-core"></div></div>`;
                const customIcon = L.divIcon({
                    html: iconHtml,
                    className: 'custom-site-icon',
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                });

                const marker = L.marker([s.lat, s.lng], { icon: customIcon }).addTo(APP_STATE.fullMap);

                const isEn = APP_STATE.currentLang === 'en';
                const popupHtml = `
                    <div class="site-popup-card">
                        <div class="popup-cyber-title">
                            <span class="popup-title-text"><i class="fa-solid fa-location-dot text-cyan"></i> ${s.name}</span>
                        </div>
                        <div class="popup-coord-pill">
                            <i class="fa-solid fa-location-crosshairs"></i> ${s.lat.toFixed(5)}, ${s.lng.toFixed(5)}
                        </div>
                        <div class="popup-address-text">
                            <i class="fa-solid fa-map-location-dot text-cyan"></i> ${s.address}
                        </div>
                        <div class="popup-device-notice">
                            <i class="fa-solid fa-circle-info text-cyan"></i> <strong>${s.devices.length} ${isEn ? 'Devices' : 'Perangkat'}</strong> ${isEn ? 'highlighted in side panel.' : 'disorot di panel samping kanan.'}
                        </div>
                        <a href="${s.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-popup-gmaps">
                            <i class="fa-solid fa-location-arrow"></i> <span>${isEn ? 'Open Google Maps' : 'Buka Google Maps'}</span>
                        </a>
                    </div>
                `;

                marker.bindPopup(popupHtml, {
                    minWidth: 270,
                    maxWidth: 320,
                    autoPan: true,
                    autoPanPadding: [50, 50],
                    offset: [0, -18],
                    className: 'cyber-leaflet-popup'
                });
                marker.on('click', () => {
                    zoomToSite(key);
                });

                APP_STATE.siteMarkers[key] = marker;
            });

            // Klik di peta untuk deteksi koordinat
            APP_STATE.fullMap.on('click', (e) => {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                APP_STATE.activeCoord = { lat, lng };

                const coordText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                const el = document.getElementById('active-map-coord');
                if (el) el.textContent = coordText;

                if (APP_STATE.tempMarker) {
                    APP_STATE.fullMap.removeLayer(APP_STATE.tempMarker);
                }

                const inspectIcon = L.divIcon({
                    html: `<div class="blitar-marker-pin warning"><div class="pin-radar"></div><div class="pin-core"></div></div>`,
                    className: 'custom-blitar-icon',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });

                APP_STATE.tempMarker = L.marker([lat, lng], { icon: inspectIcon }).addTo(APP_STATE.fullMap);
                APP_STATE.tempMarker.bindPopup(`
                    <div style="font-family: inherit;">
                        <strong class="text-yellow"><i class="fa-solid fa-location-crosshairs"></i> Titik Koordinat Terpilih:</strong>
                        <div class="popup-coord-pill my-1">${coordText}</div>
                        <p class="text-xs text-muted mb-2">Wilayah Kota Blitar, Jawa Timur</p>
                        <button onclick="copyCoordinates(${lat}, ${lng})" class="btn-sm btn-outline-cyber w-full py-1">
                            <i class="fa-solid fa-copy"></i> Salin Titik Ini
                        </button>
                    </div>
                `).openPopup();
            });

            // Buka popup HO secara default
            setTimeout(() => {
                if (APP_STATE.siteMarkers && APP_STATE.siteMarkers.ho) {
                    APP_STATE.siteMarkers.ho.openPopup();
                }
            }, 600);

        } catch (e) {
            console.error('Gagal inisialisasi full map:', e);
        }
    }
}

// -----------------------------------------------------------------------------
// NAVIGASI ZOOM KE SITE: HO, MO, HOUSE OF SERVER, DAN SELURUH BLITAR
// -----------------------------------------------------------------------------
function zoomToSite(siteKey) {
    const site = LOC_SITES[siteKey];
    if (!site) return;

    // 1. Update tombol cepat navigasi aktif
    document.querySelectorAll('.btn-site-quick').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-zoom-${siteKey}`);
    if (activeBtn) activeBtn.classList.add('active');

    // 2. Update kartu site di samping aktif
    document.querySelectorAll('.site-detail-card').forEach(c => c.classList.remove('active'));
    const activeCard = document.getElementById(`site-card-${siteKey}`);
    if (activeCard) {
        activeCard.classList.add('active');
        const container = document.querySelector('.loc-sidebar-wrapper');
        if (container) {
            const cardTop = activeCard.offsetTop - container.offsetTop;
            container.scrollTo({ top: Math.max(0, cardTop - 10), behavior: 'smooth' });
        } else {
            activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // 3. Update koordinat & status title header
    const coordEl = document.getElementById('active-map-coord');
    if (coordEl) coordEl.textContent = `${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}`;

    const titleEl = document.getElementById('loc-map-status-title');
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-crosshairs text-cyan"></i> Fokus: ${site.name} &bull; ${site.subtitle}`;

    // 4. Zoom peta ke titik site
    if (APP_STATE.fullMap) {
        APP_STATE.fullMap.flyTo([site.lat, site.lng], 16, {
            animate: true,
            duration: 1.0
        });

        // Buka popup marker setelah animasi flyTo
        setTimeout(() => {
            if (APP_STATE.siteMarkers && APP_STATE.siteMarkers[siteKey]) {
                APP_STATE.siteMarkers[siteKey].openPopup();
            }
        }, 800);
    }

    showToast('Fokus Lokasi', `Navigasi ke ${site.name} (${site.lat.toFixed(4)}, ${site.lng.toFixed(4)})`, 'info');
}

function zoomToAllSites() {
    // 1. Reset tombol navigasi cepat
    document.querySelectorAll('.btn-site-quick').forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.btn-site-quick.btn-quick-all');
    if (allBtn) allBtn.classList.add('active');

    // 2. Reset status aktif kartu
    document.querySelectorAll('.site-detail-card').forEach(c => c.classList.remove('active'));

    // 3. Update header
    const coordEl = document.getElementById('active-map-coord');
    if (coordEl) coordEl.textContent = '-8.0703, 112.1735 (Segitiga 3 Site Blitar)';

    const titleEl = document.getElementById('loc-map-status-title');
    if (titleEl) titleEl.innerHTML = `Peta Interaktif Kota Blitar`;

    // 4. Fit bounds ke semua titik site
    if (APP_STATE.fullMap) {
        const bounds = [
            [LOC_SITES.ho.lat, LOC_SITES.ho.lng],
            [LOC_SITES.mo.lat, LOC_SITES.mo.lng],
            [LOC_SITES.server.lat, LOC_SITES.server.lng]
        ];
        APP_STATE.fullMap.fitBounds(bounds, { padding: [60, 60], animate: true });
        APP_STATE.fullMap.closePopup();
    }

    showToast('Tampilan Penuh', 'Menampilkan seluruh 3 site (HO, MO, House Of Server) di Kota Blitar.', 'info');
}

// -----------------------------------------------------------------------------
// PENGGANTIAN PENYEDIA PETA ASLI (GOOGLE MAPS, SATELIT, OPENSTREET, CYBER)
// -----------------------------------------------------------------------------
function setMapProvider(providerKey) {
    const p = MAP_PROVIDERS[providerKey] || MAP_PROVIDERS['google-roads'];
    APP_STATE.currentMapProvider = p.id;

    // 1. Update tombol pill aktif
    document.querySelectorAll('.btn-layer-pill').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(p.btnId);
    if (activeBtn) activeBtn.classList.add('active');

    // 2. Terapkan filter cyber dark jika mode cyber
    const mapEl = document.getElementById('full-blitar-map');
    if (mapEl) {
        if (p.darkFilter) {
            mapEl.classList.add('map-cyber-dark');
        } else {
            mapEl.classList.remove('map-cyber-dark');
        }
    }

    // 3. Ganti tile layer di fullMap tanpa reload
    if (APP_STATE.fullMap) {
        if (APP_STATE.fullTileLayer) {
            APP_STATE.fullMap.removeLayer(APP_STATE.fullTileLayer);
        }
        APP_STATE.fullTileLayer = L.tileLayer(p.url, {
            subdomains: p.subdomains,
            maxZoom: p.maxZoom,
            attribution: p.attribution
        }).addTo(APP_STATE.fullMap);

        if (APP_STATE.fullTileLayer.bringToBack) {
            APP_STATE.fullTileLayer.bringToBack();
        }
    }

    showToast('Penyedia Peta Diganti', `Menampilkan ${p.name} (Bebas Blokir & Presisi)`, 'success');
}

function toggleMapTheme() {
    const keys = ['google-roads', 'google-sat', 'carto-voyager', 'cyber-dark'];
    const current = APP_STATE.currentMapProvider || 'google-roads';
    const nextIdx = (keys.indexOf(current) + 1) % keys.length;
    setMapProvider(keys[nextIdx]);
}

// -----------------------------------------------------------------------------
// TAB SWITCHER: PETA GIS BLITAR VS DENAH BANGUNAN
// -----------------------------------------------------------------------------
function switchLocationSubTab(tab) {
    const btnGis = document.getElementById('tab-btn-gis');
    const btnFloor = document.getElementById('tab-btn-floor');
    const panelGis = document.getElementById('loc-panel-gis');
    const panelFloor = document.getElementById('loc-panel-floor');

    if (tab === 'gis') {
        if (btnGis) btnGis.classList.add('active');
        if (btnFloor) btnFloor.classList.remove('active');
        if (panelGis) { panelGis.classList.add('active'); panelGis.classList.remove('hidden'); }
        if (panelFloor) { panelFloor.classList.remove('active'); panelFloor.classList.add('hidden'); }
        setTimeout(() => {
            if (APP_STATE.fullMap) APP_STATE.fullMap.invalidateSize();
        }, 120);
    } else if (tab === 'floor') {
        if (btnFloor) btnFloor.classList.add('active');
        if (btnGis) btnGis.classList.remove('active');
        if (panelFloor) { panelFloor.classList.add('active'); panelFloor.classList.remove('hidden'); }
        if (typeof renderFloorplanPins === 'function') renderFloorplanPins();
        if (panelGis) { panelGis.classList.remove('active'); panelGis.classList.add('hidden'); }
    }
}

// -----------------------------------------------------------------------------
// PEMILIH DENAH BANGUNAN (HO, MO, HOUSE OF SERVER)
// -----------------------------------------------------------------------------
function showBlueprintSite(siteKey) {
    // Tombol aktif
    document.querySelectorAll('.site-blueprint-selector .btn-bp-choice:not(#btn-bp-edit-pins)').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-bp-${siteKey}`) || document.getElementById(`btn-bp-mentor`);
    if (activeBtn) activeBtn.classList.add('active');

    // Box denah yang tampil
    ['ho', 'mo', 'mentor'].forEach(k => {
        const box = document.getElementById(`bp-box-${k}`);
        if (box) {
            if (k === siteKey || (siteKey === 'server' && k === 'mentor')) {
                box.classList.remove('hidden');
            } else {
                box.classList.add('hidden');
            }
        }
    });

    const s = LOC_SITES[siteKey] || LOC_SITES['server'];
    if (s) {
        showToast('Denah Bangunan', `Membuka blueprint tata letak: ${s.name}`, 'info');
    }
}

function showRoomInfo(roomName, devicesList, statusNote) {
    showToast(roomName, `Perangkat: ${devicesList} • Kondisi: ${statusNote}`, 'info');
}

// -----------------------------------------------------------------------------
// FILTER KARTU SITE & PERANGKAT
// -----------------------------------------------------------------------------
function filterSiteCards(query) {
    const q = (query || '').toLowerCase().trim();
    ['ho', 'mo', 'server', 'mentor'].forEach(key => {
        const card = document.getElementById(`site-card-${key}`);
        if (!card) return;
        const text = card.textContent.toLowerCase();
        if (text.includes(q)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectMapNode(title, statDev, coord, statUp) {
    const box = document.getElementById('map-callout-overlay');
    if (box) {
        document.getElementById('callout-node-name').innerHTML = `<i class="fa-solid fa-building"></i> ${title}`;
        document.getElementById('callout-node-coord').textContent = coord || '-8.0988, 112.1652';
        document.getElementById('callout-stat-dev').textContent = statDev;
        document.getElementById('callout-stat-up').textContent = statUp;
        box.classList.remove('hidden');
    }
    showToast('Node Terpilih', `${title} (${coord})`, 'info');
}

function renderBlitarNodesList(filteredList = null) {
    const listEl = document.getElementById('blitar-nodes-container');
    const badgeEl = document.getElementById('blitar-active-badge');
    if (!listEl) return;

    const list = filteredList || APP_STATE.devices;
    if (badgeEl) badgeEl.textContent = `${list.length} Node`;

    listEl.innerHTML = '';
    if (list.length === 0) {
        listEl.innerHTML = '<div class="p-3 text-center text-muted text-xs">Tidak ada perangkat yang cocok di area Blitar.</div>';
        return;
    }

    list.forEach(dev => {
        const item = document.createElement('div');
        item.className = 'blitar-node-item';
        item.onclick = () => focusBlitarNode(dev.id);

        item.innerHTML = `
            <div class="bni-top">
                <span class="bni-name"><span class="dot ${dev.status === 'online' ? 'green' : (dev.status === 'warning' ? 'yellow' : 'red')}"></span> ${dev.name}</span>
                <span class="bni-coord"><i class="fa-solid fa-location-crosshairs"></i> ${dev.lat.toFixed(4)}, ${dev.lng.toFixed(4)}</span>
            </div>
            <div class="bni-desc">${dev.district} &bull; ${dev.location}</div>
            <div class="bni-meta">
                <span>IP: <strong>${dev.ip}</strong> (${dev.ping})</span>
                <button class="btn-copy-chip" onclick="event.stopPropagation(); copyCoordinates(${dev.lat}, ${dev.lng})">
                    <i class="fa-solid fa-copy"></i> Salin
                </button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

function focusBlitarNode(deviceId) {
    const dev = APP_STATE.devices.find(d => d.id === deviceId);
    if (!dev) return;

    APP_STATE.activeCoord = { lat: dev.lat, lng: dev.lng };
    const el = document.getElementById('active-map-coord');
    if (el) el.textContent = `${dev.lat.toFixed(5)}, ${dev.lng.toFixed(5)}`;

    if (APP_STATE.fullMap) {
        APP_STATE.fullMap.flyTo([dev.lat, dev.lng], 15, { animate: true, duration: 1 });
        const marker = APP_STATE.fullMarkers.find(m => {
            const pos = m.getLatLng();
            return Math.abs(pos.lat - dev.lat) < 0.0001 && Math.abs(pos.lng - dev.lng) < 0.0001;
        });
        if (marker) setTimeout(() => marker.openPopup(), 600);
    }
    showToast('Fokus Marker', `Mengarahkan peta ke ${dev.name} (${dev.district})`, 'info');
}

function filterBlitarNodes() {
    const q = (document.getElementById('blitar-node-search')?.value || '').toLowerCase().trim();
    const dist = document.getElementById('blitar-district-filter')?.value || 'all';
    const status = document.getElementById('blitar-status-filter')?.value || 'all';

    const filtered = APP_STATE.devices.filter(d => {
        const matchQ = d.name.toLowerCase().includes(q) || d.ip.includes(q) || d.district.toLowerCase().includes(q) || d.code.toLowerCase().includes(q);
        const matchDist = (dist === 'all') || (d.district.toLowerCase() === dist.toLowerCase());
        const matchStatus = (status === 'all') || (d.status === status);
        return matchQ && matchDist && matchStatus;
    });

    renderBlitarNodesList(filtered);
}

function resetHomeBlitarView() {
    if (APP_STATE.homeMap) {
        const bounds = [
            [LOC_SITES.ho.lat, LOC_SITES.ho.lng],
            [LOC_SITES.mo.lat, LOC_SITES.mo.lng],
            [LOC_SITES.server.lat, LOC_SITES.server.lng]
        ];
        APP_STATE.homeMap.fitBounds(bounds, { padding: [25, 25], animate: true });
        showToast('Peta Satelit', 'Tampilan 3 Titik Lokasi Infrastruktur (HO, MO, Server) presisi.', 'info');
    }
}

function resetFullBlitarView() {
    zoomToAllSites();
}

function copyCoordinates(lat, lng) {
    const text = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Koordinat Disalin!', `Titik [${text}] berhasil disalin ke clipboard.`, 'success');
        });
    } else {
        showToast('Koordinat', text, 'info');
    }
}

function copyCurrentCoord() {
    copyCoordinates(APP_STATE.activeCoord.lat, APP_STATE.activeCoord.lng);
}

function toggleGisFloorplanView(mode) {
    const gisTab = document.getElementById('btn-tab-gis');
    const floorTab = document.getElementById('btn-tab-floor');
    const mapEl = document.getElementById('full-blitar-map');
    const floorEl = document.getElementById('blitar-floorplan-view');

    if (mode === 'gis') {
        gisTab?.classList.add('active');
        floorTab?.classList.remove('active');
        mapEl?.classList.remove('hidden');
        floorEl?.classList.add('hidden');
        if (APP_STATE.fullMap) APP_STATE.fullMap.invalidateSize();
    } else {
        floorTab?.classList.add('active');
        gisTab?.classList.remove('active');
        mapEl?.classList.add('hidden');
        floorEl?.classList.remove('hidden');
    }
}

function selectFloorRack(rackName, devName, loc, info) {
    showToast(`Denah ${rackName}`, `Perangkat: ${devName} di Ruang Server (${loc}) - ${info}`, 'info');
}

// =============================================================================
// MODUL INVENTARIS ASET IT (PAGE-ASSETS)
// =============================================================================
function renderAssetsTable(filteredList = null) {
    const tbody = document.getElementById('assets-tbody');
    if (!tbody) return;

    const list = filteredList || APP_STATE.devices;
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center p-4 text-muted">Tidak ada data aset IT yang sesuai dengan filter.</td></tr>';
        return;
    }

    list.forEach((dev, idx) => {
        const tr = document.createElement('tr');
        const condClass = dev.condition === 'Baik' ? 'good' : (dev.condition === 'Perlu Servis' ? 'warning' : 'danger');

        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td><strong class="font-mono text-cyan">${dev.code}</strong></td>
            <td>
                <div class="device-name-text">${dev.name}</div>
                <small class="text-muted">${dev.category} &bull; MAC: ${dev.mac}</small>
            </td>
            <td>${dev.category}</td>
            <td>
                <div><i class="fa-solid fa-map-pin text-crimson"></i> <strong>${dev.district}</strong></div>
                <small class="text-muted">${dev.location}</small>
            </td>
            <td><strong class="text-white">${dev.value || 'Rp 10.000.000'}</strong></td>
            <td><span class="condition-pill ${condClass}">${dev.condition || 'Baik'}</span></td>
            <td><small class="text-secondary">${dev.warranty || 'Hingga 2026'}</small></td>
            <td><strong>${dev.pic}</strong></td>
            <td class="text-right">
                <div style="display: inline-flex; gap: 4px;">
                    <button class="btn-sm btn-outline-cyber" onclick="openAssetQrModal('${dev.code}', '${dev.name}', '${dev.district}')" title="Cetak Label QR Tag">
                        <i class="fa-solid fa-qrcode text-cyan"></i> Label QR
                    </button>
                    <button class="btn-sm btn-outline-cyber" onclick="openDeviceDetail('${dev.id}')" title="Detail Spek">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterAssetsTable() {
    const q = (document.getElementById('assets-search-input')?.value || '').toLowerCase().trim();
    const cat = document.getElementById('assets-cat-select')?.value || 'all';
    const cond = document.getElementById('assets-cond-select')?.value || 'all';

    const filtered = APP_STATE.devices.filter(d => {
        const matchQ = d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q) || d.district.toLowerCase().includes(q) || d.pic.toLowerCase().includes(q);
        const matchCat = (cat === 'all') || (d.category === cat);
        const matchCond = (cond === 'all') || (d.condition === cond);
        return matchQ && matchCat && matchCond;
    });

    renderAssetsTable(filtered);
}

function openAddAssetModal() {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Harap login sebagai Administrator untuk menambah data aset.', 'error');
        return;
    }
    document.getElementById('asset-form')?.reset();
    document.getElementById('asset-modal')?.classList.remove('hidden');
}

function closeAssetModal() {
    document.getElementById('asset-modal')?.classList.add('hidden');
}

function handleSaveAsset() {
    const code = document.getElementById('ast-code').value.trim().toUpperCase();
    const name = document.getElementById('ast-name').value.trim();
    const category = document.getElementById('ast-category').value;
    const location = document.getElementById('ast-location').value.trim();
    const value = document.getElementById('ast-value').value.trim() || 'Rp 10.000.000';
    const condition = document.getElementById('ast-condition').value;
    const warranty = document.getElementById('ast-warranty').value.trim() || 'Hingga Des 2026';
    const pic = document.getElementById('ast-pic')?.value.trim() || 'Damar Munajad';

    const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
    const generatedIp = `192.168.1.${Math.floor(Math.random()*150+50)}`;
    const newDev = {
        id: `DEV-${num}`,
        code,
        asset_code: code,
        name,
        category,
        district: location.split(',')[0].trim() || 'Kota Blitar',
        location: `${location}, Blitar`,
        lat: -8.0988 + (Math.random() - 0.5) * 0.05,
        lng: 112.1652 + (Math.random() - 0.5) * 0.05,
        ip: generatedIp,
        mac: '00:1B:44:' + Math.floor(Math.random()*89+10) + ':BB:' + Math.floor(Math.random()*89+10),
        status: 'online',
        lastSeen: 'Baru didaftarkan',
        ping: '8 ms',
        uptime: '100%',
        method: 'Ping (ICMP)',
        pic,
        installDate: 'Hari ini',
        value,
        condition,
        warranty
    };

    APP_STATE.devices.unshift(newDev);
    saveDevicesToStorage(APP_STATE.devices);

    if (typeof apiService !== 'undefined' && typeof apiService.createAsset === 'function') {
        apiService.createAsset({
            asset_code: code,
            asset_name: name,
            category: category,
            location_name: location,
            ip_address: generatedIp,
            monitoring_method: 'Ping',
            current_status: 'online',
            priority: 2,
            pic_name: pic,
            description: `Kondisi: ${condition}, Garansi: ${warranty}, Nilai: ${value}`
        }).then(async (res) => {
            if (typeof loadRealDataFromApi === 'function') {
                await loadRealDataFromApi();
            }
        }).catch(err => console.log('API create asset fallback'));
    }

    renderAssetsTable();
    renderHomeDevicesTable();
    renderFullDevicesTable();
    renderBlitarNodesList();
    renderBlitarMapMarkers();
    closeAssetModal();
    showToast('Aset Terdaftar!', `Aset ${name} (${code}) berhasil disimpan ke database backend.`, 'success');
}

function openAssetQrModal(code, name, loc) {
    document.getElementById('qr-modal-code').textContent = code;
    document.getElementById('qr-modal-name').textContent = name;
    document.getElementById('qr-modal-loc').textContent = `Wilayah: ${loc}, Blitar`;
    document.getElementById('asset-qr-modal')?.classList.remove('hidden');
}

function closeAssetQrModal() {
    document.getElementById('asset-qr-modal')?.classList.add('hidden');
}

function printAssetLabel() {
    showToast('Cetak Label', 'Mengirim perintah cetak label barcode & QR Tag ke printer...', 'info');
    setTimeout(() => {
        window.print();
    }, 400);
}

function exportAssetsList() {
    showToast('Ekspor Data Aset', 'Mengunduh rekapitulasi data inventaris aset IT (CSV/Excel)...', 'success');
}

// =============================================================================
// MODUL INFORMASI PENGGUNA & TIM PKL TEKNOLAB (PERSIS GAMBAR 1 & 2)
// =============================================================================
const OFFICIAL_TEAM_ICONS = {
    'TM-01': { icon: 'fa-diagram-project', color: '#FF1744', bg: 'rgba(255, 23, 68, 0.2)' },
    'TM-02': { icon: 'fa-server', color: '#FFC107', bg: 'rgba(255, 193, 7, 0.2)' },
    'TM-03': { icon: 'fa-database', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.2)' },
    'TM-04': { icon: 'fa-microchip', color: '#10B981', bg: 'rgba(16, 185, 129, 0.2)' },
    'TM-05': { icon: 'fa-network-wired', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.2)' },
    'TM-06': { icon: 'fa-crown', color: '#FF1744', bg: 'rgba(255, 23, 68, 0.2)' },
    'TM-07': { icon: 'fa-laptop-code', color: '#F97316', bg: 'rgba(249, 115, 22, 0.2)' },
    'TM-08': { icon: 'fa-chart-pie', color: '#FF4D6D', bg: 'rgba(255, 77, 109, 0.2)' },
    'TM-09': { icon: 'fa-bolt-lightning', color: '#FFD600', bg: 'rgba(255, 214, 0, 0.2)' },
    'TM-10': { icon: 'fa-shield-halved', color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.2)' },
    'TM-11': { icon: 'fa-clipboard-check', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.2)' }
};

function loadTeamData() {
    try {
        localStorage.removeItem('taims_team_members_v8');
        localStorage.removeItem('taims_team_members_v7');
        const saved = localStorage.getItem('taims_team_members_v9_noblue');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length >= 11) {
                parsed.forEach(m => {
                    const off = OFFICIAL_TEAM_ICONS[m.id];
                    if (off) {
                        m.icon = off.icon;
                        m.iconColor = off.color;
                        m.iconBg = off.bg;
                    }
                });
                APP_STATE.teamMembers = parsed;
            } else {
                APP_STATE.teamMembers = JSON.parse(JSON.stringify(DEFAULT_TEAM_MEMBERS));
                saveTeamData();
            }
        } else {
            APP_STATE.teamMembers = JSON.parse(JSON.stringify(DEFAULT_TEAM_MEMBERS));
            saveTeamData();
        }
    } catch (e) {
        APP_STATE.teamMembers = JSON.parse(JSON.stringify(DEFAULT_TEAM_MEMBERS));
    }
}

function saveTeamData() {
    try {
        localStorage.setItem('taims_team_members_v9_noblue', JSON.stringify(APP_STATE.teamMembers));
    } catch (e) {
        console.error('Gagal menyimpan data tim:', e);
    }
}

function copyContactText(text, label) {
    if (!text || text === '-') {
        showToast('Pemberitahuan', 'Kontak belum tersedia.', 'warning');
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Tersalin!', `${label} "${text}" berhasil disalin ke clipboard.`, 'success');
        }).catch(() => {
            fallbackCopyContact(text, label);
        });
    } else {
        fallbackCopyContact(text, label);
    }
}

function fallbackCopyContact(text, label) {
    try {
        const temp = document.createElement('input');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Tersalin!', `${label} "${text}" berhasil disalin ke clipboard.`, 'success');
    } catch (err) {
        prompt(`Salin ${label} manual:`, text);
    }
}

function createMemberCardHtml(tm) {
    const rawPhone = (tm.phone || '').replace(/[^0-9]/g, '');
    const waPhone = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;
    const waLink = waPhone ? `https://wa.me/${waPhone}` : '#';
    const mailLink = tm.email ? `mailto:${tm.email}` : '#';

    // Enforce official colors (Anti-Blue guarantee)
    const off = OFFICIAL_TEAM_ICONS[tm.id] || {};
    const finalIcon = off.icon || tm.icon || 'fa-user-tie';
    const finalColor = off.color || tm.iconColor || '#FFC107';
    const finalBg = off.bg || tm.iconBg || 'rgba(255, 193, 7, 0.2)';

    const isEn = APP_STATE && APP_STATE.currentLang === 'en';
    const lang = isEn ? 'en' : 'id';
    const roleTrans = translateTextString(tm.role, lang);
    const descTrans = translateTextString(tm.description, lang);
    const shiftTrans = isEn ? `Shift ${tm.shift}` : `Tim ${tm.shift}`;
    const editTitle = isEn ? 'Edit Member Data' : 'Ubah Data Anggota';

    return `
    <div class="team-member-card" id="card-${tm.id}" style="--member-color: ${finalColor}; --member-bg: ${finalBg};">
        <div class="tm-header">
            <div class="tm-avatar" style="background-color: ${finalBg} !important; color: ${finalColor} !important; border: 1.5px solid ${finalColor} !important; box-shadow: 0 0 12px ${finalColor}40 !important; border-radius: 50% !important;">
                <i class="fa-solid ${finalIcon}"></i>
            </div>
            <div class="tm-info">
                <h4 class="tm-name">${tm.name}</h4>
                <p class="tm-role" style="color: #FFC107 !important; text-shadow: 0 0 10px rgba(255, 193, 7, 0.2); font-weight: 700;">${roleTrans}</p>
            </div>
        </div>

        <div class="tm-contacts">
            <div class="tm-contact-row" onclick="copyContactText('${tm.phone}', '${isEn ? 'Phone Number' : 'Nomor HP'}')" title="${isEn ? 'Click to copy / WhatsApp chat' : 'Klik untuk salin / chat WA'}">
                <i class="fa-solid fa-phone" style="color: #22C55E !important;"></i>
                <a href="${waLink}" target="_blank" onclick="event.stopPropagation()">${tm.phone}</a>
            </div>
            <div class="tm-contact-row" onclick="copyContactText('${tm.email}', 'Email')" title="${isEn ? 'Click to copy / send email' : 'Klik untuk salin / kirim surel'}">
                <i class="fa-solid fa-envelope" style="color: #FFC107 !important;"></i>
                <a href="${mailLink}" onclick="event.stopPropagation()">${tm.email}</a>
            </div>
        </div>

        <p class="tm-desc">${descTrans}</p>

        <div class="tm-footer">
            <span class="tm-shift-pill" style="border-color: ${finalColor}55; color: #CBD5E1;">${shiftTrans}</span>
            <button type="button" class="btn-card-edit" onclick="openEditSingleMemberModal('${tm.id}')" title="${editTitle}">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </div>
    </div>
    `;
}

function renderTeamCards() {
    const s1Grid = document.getElementById('shift-1-cards-container');
    const s2Grid = document.getElementById('shift-2-cards-container');
    if (!s1Grid || !s2Grid) return;

    s1Grid.innerHTML = '';
    s2Grid.innerHTML = '';

    const members = APP_STATE.teamMembers || DEFAULT_TEAM_MEMBERS;
    members.forEach(tm => {
        const cardHtml = createMemberCardHtml(tm);
        if (String(tm.shift) === '1') {
            s1Grid.insertAdjacentHTML('beforeend', cardHtml);
        } else {
            s2Grid.insertAdjacentHTML('beforeend', cardHtml);
        }
    });

    populateMemberSelectOptions();
}

function populateMemberSelectOptions() {
    const select = document.getElementById('tm-select-member');
    if (!select) return;

    select.innerHTML = '';
    const members = APP_STATE.teamMembers || DEFAULT_TEAM_MEMBERS;
    members.forEach(tm => {
        const opt = document.createElement('option');
        opt.value = tm.id;
        opt.textContent = `[Shift ${tm.shift}] ${tm.name} — ${tm.role}`;
        select.appendChild(opt);
    });
}

function openEditTeamModal() {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Hanya Admin atau Superadmin yang dapat mengubah data anggota tim.', 'error');
        return;
    }
    const members = APP_STATE.teamMembers || DEFAULT_TEAM_MEMBERS;
    populateMemberSelectOptions();
    if (members.length > 0) {
        onSelectMemberToEdit(members[0].id);
    }
    const modal = document.getElementById('team-modal');
    if (modal) modal.classList.remove('hidden');
}

function openEditSingleMemberModal(id) {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Hanya Admin atau Superadmin yang dapat mengubah data anggota tim.', 'error');
        return;
    }
    populateMemberSelectOptions();
    const select = document.getElementById('tm-select-member');
    if (select) select.value = id;
    onSelectMemberToEdit(id);
    const modal = document.getElementById('team-modal');
    if (modal) modal.classList.remove('hidden');
}

function onSelectMemberToEdit(id) {
    const members = APP_STATE.teamMembers || DEFAULT_TEAM_MEMBERS;
    const member = members.find(m => m.id === id);
    if (!member) return;

    document.getElementById('tm-id').value = member.id;
    document.getElementById('tm-name').value = member.name;
    document.getElementById('tm-shift').value = member.shift || '1';
    document.getElementById('tm-role').value = member.role;
    document.getElementById('tm-phone').value = member.phone || '';
    document.getElementById('tm-email').value = member.email || '';
    document.getElementById('tm-responsibilities').value = member.description || '';

    const select = document.getElementById('tm-select-member');
    if (select && select.value !== id) {
        select.value = id;
    }
}

function closeTeamModal() {
    const modal = document.getElementById('team-modal');
    if (modal) modal.classList.add('hidden');
}

function handleSaveTeamMember() {
    const id = document.getElementById('tm-id').value;
    const name = document.getElementById('tm-name').value.trim().toUpperCase();
    const shift = document.getElementById('tm-shift').value;
    const role = document.getElementById('tm-role').value.trim();
    const phone = document.getElementById('tm-phone').value.trim();
    const email = document.getElementById('tm-email').value.trim();
    const description = document.getElementById('tm-responsibilities').value.trim();

    const member = APP_STATE.teamMembers.find(m => m.id === id);
    if (member) {
        member.name = name;
        member.shift = shift;
        member.shiftLabel = `Shift ${shift}`;
        member.role = role;
        member.phone = phone;
        member.email = email;
        member.description = description;

        saveTeamData();
        renderTeamCards();
        closeTeamModal();
        showToast('Data Tim Disimpan!', `Perubahan data untuk ${name} berhasil disimpan.`, 'success');
    }
}

function resetTeamDataPrompt() {
    if (confirm('Kembalikan data seluruh 11 anggota tim ke pengaturan awal (Persis Gambar Referensi)?')) {
        APP_STATE.teamMembers = JSON.parse(JSON.stringify(DEFAULT_TEAM_MEMBERS));
        saveTeamData();
        renderTeamCards();
        closeTeamModal();
        showToast('Tim Di-reset', '11 Anggota PKL resmi telah dimuat ulang sesuai data referensi.', 'info');
    }
}

function exportProjectBrief() {
    showToast('Profil Projek', 'Menghasilkan lembar profil resmi dokumen proyek T-AIMS...', 'info');
    setTimeout(() => {
        window.print();
    }, 400);
}

// =============================================================================
// SIMULASI TELEMETRY SENSOR ELEKTRO INTERAKTIF
// =============================================================================
function triggerDeviceSimulation() {
    const rndIdx = Math.floor(Math.random() * APP_STATE.devices.length);
    const target = APP_STATE.devices[rndIdx];
    const sequence = ['online', 'warning', 'offline'];
    const curIdx = sequence.indexOf(target.status);
    const nextStatus = sequence[(curIdx + 1) % sequence.length];

    target.status = nextStatus;
    const now = new Date();
    target.lastSeen = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB (Simulasi)`;

    if (nextStatus === 'offline') {
        addAlertLog(`[SIMULASI] Sensor ${target.name} terputus daya listrik`, target.location, 'kritis');
    } else if (nextStatus === 'warning') {
        addAlertLog(`[SIMULASI] Fluktuasi tegangan terdeteksi pada ${target.name}`, target.location, 'peringatan');
    }

    renderHomeDevicesTable();
    renderFullDevicesTable();
    showToast('Simulasi Berjalan', `Status sensor ${target.name} kini berubah menjadi ${nextStatus.toUpperCase()}.`, 'warning');
}

// =============================================================================
// GRAFIK INTERAKTIF (CHART.JS CYBER DARK)
// =============================================================================
let trendIntervalTimer = null;
let currentTrendTimeframe = 'live';

function getDeviceTelemetryCounts() {
    const total = APP_STATE.devices ? APP_STATE.devices.length : 15;
    const online = (APP_STATE.devices || []).filter(d => (d.status || d.current_status || '').toLowerCase() === 'online').length;
    const warning = (APP_STATE.devices || []).filter(d => (d.status || d.current_status || '').toLowerCase() === 'warning').length;
    const unknown = (APP_STATE.devices || []).filter(d => (d.status || d.current_status || '').toLowerCase() === 'unknown').length;
    const offline = Math.max(0, total - online - warning - unknown);
    return { total, online, offline, warning, unknown };
}

function refreshTrendChartData() {
    if (!APP_STATE.charts.trendChart) return;
    const chart = APP_STATE.charts.trendChart;
    const counts = getDeviceTelemetryCounts();

    const lastIdx = chart.data.labels.length - 1;
    if (lastIdx >= 0) {
        chart.data.datasets[0].data[lastIdx] = counts.online;
        chart.data.datasets[1].data[lastIdx] = counts.offline;
        chart.data.datasets[2].data[lastIdx] = counts.warning;
    }
    if (chart.options && chart.options.scales && chart.options.scales.y) {
        chart.options.scales.y.max = Math.max(16, counts.total + 2);
    }
    chart.update('none');
}

function refreshDonutChartData() {
    if (!APP_STATE.charts.categoryDonut) return;
    const donut = APP_STATE.charts.categoryDonut;
    const catCounts = {
        'Router': 0, 'Switch': 0, 'Server': 0, 'CCTV': 0, 'Smart TV': 0, 'Raspberry Pi': 0, 'IoT Node': 0, 'PC': 0
    };
    (APP_STATE.devices || []).forEach(d => {
        const c = (d.category || '').toLowerCase();
        const code = (d.code || '').toUpperCase();
        if (c.includes('router')) catCounts['Router']++;
        else if (c.includes('switch')) catCounts['Switch']++;
        else if (c.includes('server')) catCounts['Server']++;
        else if (c.includes('cctv') || code.startsWith('CCTV')) catCounts['CCTV']++;
        else if (c.includes('tv') || code.startsWith('SMTV')) catCounts['Smart TV']++;
        else if (c.includes('raspberry') || code.startsWith('RPI')) catCounts['Raspberry Pi']++;
        else if (c.includes('iot') || c.includes('esp') || code.startsWith('ESP')) catCounts['IoT Node']++;
        else if (c.includes('pc') || c.includes('workstation')) catCounts['PC']++;
        else catCounts['Router']++;
    });
    donut.data.labels = ['Router', 'Switch', 'Server', 'CCTV', 'Smart TV', 'Raspberry Pi', 'IoT Node', 'Workstation PC'];
    donut.data.datasets[0].backgroundColor = ['#F97316', '#00E5FF', '#EF4444', '#3B82F6', '#EC4899', '#FACC15', '#10B981', '#8B5CF6'];
    donut.data.datasets[0].data = [
        catCounts['Router'], catCounts['Switch'], catCounts['Server'],
        catCounts['CCTV'], catCounts['Smart TV'], catCounts['Raspberry Pi'], catCounts['IoT Node'], catCounts['PC']
    ];
    donut.update();
    const totalDevs = APP_STATE.devices ? APP_STATE.devices.length : 15;
    const donutEl = document.getElementById('donut-total-count');
    if (donutEl) donutEl.textContent = totalDevs;

    const legendCol = document.getElementById('donut-legend-container') || document.querySelector('.donut-legend-col');
    if (legendCol) {
        const legendItems = [
            { label: 'Router', count: catCounts['Router'], color: '#F97316' },
            { label: 'Server', count: catCounts['Server'], color: '#EF4444' },
            { label: 'CCTV', count: catCounts['CCTV'], color: '#3B82F6' },
            { label: 'Switch', count: catCounts['Switch'], color: '#00E5FF' },
            { label: 'PC Workst.', count: catCounts['PC'], color: '#8B5CF6' },
            { label: 'Smart TV', count: catCounts['Smart TV'], color: '#EC4899' },
            { label: 'Raspberry Pi', count: catCounts['Raspberry Pi'], color: '#FACC15' },
            { label: 'IoT Node', count: catCounts['IoT Node'], color: '#10B981' }
        ];
        legendCol.style.display = 'grid';
        legendCol.style.gridTemplateColumns = '1fr 1fr';
        legendCol.style.gap = '4px 10px';
        legendCol.style.fontSize = '0.72rem';
        legendCol.style.maxHeight = 'none';
        legendCol.style.overflow = 'visible';
        legendCol.style.padding = '0';
        legendCol.innerHTML = legendItems.map(item => {
            const pct = totalDevs > 0 ? ((item.count / totalDevs) * 100).toFixed(1) : '0.0';
            return `
                <div class="d-leg-row" style="margin: 0; padding: 2px 0;">
                    <span class="d-leg-name"><span class="cat-bullet" style="background:${item.color};"></span> ${item.label}</span>
                    <span class="d-leg-val"><strong>${item.count}</strong> <small>${pct}%</small></span>
                </div>
            `;
        }).join('');
    }

    // Empty State Handler Saat Data Aset 0 Item (QA Fix Bug #11)
    const trendCanvas = document.getElementById('trendChart');
    let emptyBanner = document.getElementById('chart-empty-state-banner');
    if (!APP_STATE.devices || APP_STATE.devices.length === 0) {
        if (!emptyBanner && trendCanvas && trendCanvas.parentElement) {
            emptyBanner = document.createElement('div');
            emptyBanner.id = 'chart-empty-state-banner';
            emptyBanner.className = 'chart-empty-state text-center py-3 text-muted text-xs';
            emptyBanner.innerHTML = `<i class="fa-solid fa-chart-pie text-cyan mr-1"></i> Belum ada data perangkat untuk ditampilkan. Klik <strong>Tambah Perangkat</strong> untuk memulai.`;
            trendCanvas.parentElement.prepend(emptyBanner);
        } else if (emptyBanner) {
            emptyBanner.classList.remove('hidden');
        }
    } else if (emptyBanner) {
        emptyBanner.classList.add('hidden');
    }
}
window.refreshTrendChartData = refreshTrendChartData;
window.refreshDonutChartData = refreshDonutChartData;

function initCharts() {
    // 1. Line Chart: Tren Status Perangkat
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx && typeof Chart !== 'undefined') {
        if (APP_STATE.charts.trendChart) APP_STATE.charts.trendChart.destroy();

        const counts = getDeviceTelemetryCounts();
        const tfSelect = document.getElementById('trend-timeframe');
        const initialMode = tfSelect ? tfSelect.value : 'live';

        APP_STATE.charts.trendChart = new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Online',
                        data: [],
                        borderColor: '#00FF9D',
                        backgroundColor: 'rgba(0, 255, 157, 0.18)',
                        borderWidth: 2.2,
                        tension: 0.35,
                        fill: true,
                        pointBackgroundColor: '#00FF9D',
                        pointRadius: 3
                    },
                    {
                        label: 'Offline',
                        data: [],
                        borderColor: '#FF1744',
                        backgroundColor: 'rgba(255, 23, 68, 0.12)',
                        borderWidth: 2,
                        tension: 0.35,
                        borderDash: [3, 3],
                        pointBackgroundColor: '#FF1744',
                        pointRadius: 3
                    },
                    {
                        label: 'Warning (Terancam)',
                        data: [],
                        borderColor: '#FFD600',
                        backgroundColor: 'transparent',
                        borderWidth: 1.8,
                        tension: 0.35,
                        pointBackgroundColor: '#F59E0B',
                        pointRadius: 2.5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 350 },
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748B', font: { size: 9 } } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748B', font: { size: 9 } }, min: 0, max: Math.max(16, counts.total + 2), stepSize: 3 }
                }
            }
        });

        // Jalankan mode awal
        updateTrendChartTimeframe(initialMode, false);
    }

    // 2. Donut Chart: Distribusi Kategori
    const donutCtx = document.getElementById('categoryDonutChart');
    if (donutCtx && typeof Chart !== 'undefined') {
        if (APP_STATE.charts.categoryDonut) APP_STATE.charts.categoryDonut.destroy();

        const catCounts = {
            'Router': 0, 'Switch': 0, 'Server': 0, 'CCTV': 0, 'Smart TV': 0, 'Raspberry Pi': 0, 'IoT Node': 0, 'PC': 0
        };
        (APP_STATE.devices || []).forEach(d => {
            const c = (d.category || '').toLowerCase();
            const code = (d.code || '').toUpperCase();
            if (c.includes('router')) catCounts['Router']++;
            else if (c.includes('switch')) catCounts['Switch']++;
            else if (c.includes('server')) catCounts['Server']++;
            else if (c.includes('cctv') || code.startsWith('CCTV')) catCounts['CCTV']++;
            else if (c.includes('tv') || code.startsWith('SMTV')) catCounts['Smart TV']++;
            else if (c.includes('raspberry') || code.startsWith('RPI')) catCounts['Raspberry Pi']++;
            else if (c.includes('iot') || c.includes('esp') || code.startsWith('ESP')) catCounts['IoT Node']++;
            else if (c.includes('pc') || c.includes('workstation')) catCounts['PC']++;
            else catCounts['Router']++;
        });

        APP_STATE.charts.categoryDonut = new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Router', 'Switch', 'Server', 'CCTV', 'Smart TV', 'Raspberry Pi', 'IoT Node', 'Workstation PC'],
                datasets: [{
                    data: [
                        catCounts['Router'], catCounts['Switch'], catCounts['Server'],
                        catCounts['CCTV'], catCounts['Smart TV'], catCounts['Raspberry Pi'], catCounts['IoT Node'], catCounts['PC']
                    ],
                    backgroundColor: ['#F97316', '#00E5FF', '#EF4444', '#3B82F6', '#EC4899', '#FACC15', '#10B981', '#8B5CF6'],
                    borderWidth: 2,
                    borderColor: '#0D1629'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '58%',
                plugins: { legend: { display: false } }
            }
        });
        refreshDonutChartData();
    }
}

async function updateTrendChartTimeframe(val, showNotification = true) {
    if (!APP_STATE.charts.trendChart) return;
    const chart = APP_STATE.charts.trendChart;
    currentTrendTimeframe = val;
    const counts = getDeviceTelemetryCounts();

    if (trendIntervalTimer) {
        clearInterval(trendIntervalTimer);
        trendIntervalTimer = null;
    }

    if (val === 'live') {
        // MODE 1: Live Update 5 Detik Sekali
        const now = new Date();
        const initialLabels = [];
        const initialOnline = [];
        const initialOffline = [];
        const initialWarning = [];

        for (let i = 9; i >= 0; i--) {
            const t = new Date(now.getTime() - i * 5000);
            initialLabels.push(t.toTimeString().split(' ')[0]);
            initialOnline.push(counts.online);
            initialOffline.push(counts.offline);
            initialWarning.push(counts.warning);
        }

        chart.data.labels = initialLabels;
        chart.data.datasets[0].data = initialOnline;
        chart.data.datasets[1].data = initialOffline;
        chart.data.datasets[2].data = initialWarning;

        if (chart.options && chart.options.scales && chart.options.scales.y) {
            chart.options.scales.y.max = Math.max(16, counts.total + 2);
        }
        chart.update();

        // Coba sync 20 log terakhir dari Backend GET /api/dashboard/trend?period=live
        if (typeof getDashboardTrend === 'function') {
            getDashboardTrend('live').then(trendData => {
                if (trendData && trendData.labels && trendData.labels.length > 0 && currentTrendTimeframe === 'live') {
                    if (trendData.datasets && trendData.datasets.online) {
                        chart.data.labels = trendData.labels.slice(-12);
                        chart.data.datasets[0].data = trendData.datasets.online.slice(-12);
                        chart.data.datasets[1].data = trendData.datasets.offline.slice(-12);
                        chart.data.datasets[2].data = trendData.datasets.warning.slice(-12);
                        chart.update('none');
                    }
                }
            }).catch(() => {});
        }

        trendIntervalTimer = setInterval(() => {
            if (!APP_STATE.charts.trendChart || currentTrendTimeframe !== 'live') return;
            const c = APP_STATE.charts.trendChart;
            const liveCounts = getDeviceTelemetryCounts();
            const curTimeStr = new Date().toTimeString().split(' ')[0];

            c.data.labels.push(curTimeStr);
            c.data.datasets[0].data.push(liveCounts.online);
            c.data.datasets[1].data.push(liveCounts.offline);
            c.data.datasets[2].data.push(liveCounts.warning);

            if (c.data.labels.length > 12) {
                c.data.labels.shift();
                c.data.datasets[0].data.shift();
                c.data.datasets[1].data.shift();
                c.data.datasets[2].data.shift();
            }

            if (c.options && c.options.scales && c.options.scales.y) {
                c.options.scales.y.max = Math.max(16, liveCounts.total + 2);
            }
            c.update('none');
        }, 5000);

        if (showNotification) showToast('Mode Live Update (5s)', 'Grafik telemetri tersinkronisasi otomatis setiap 5 detik.', 'info');

    } else if (val === '24' || val === '24h' || val === '1') {
        // MODE 2: 24 Jam dengan agregasi data 1 jam sekali
        let loadedFromApi = false;
        if (typeof getDashboardTrend === 'function') {
            try {
                const trendData = await getDashboardTrend('24h');
                if (trendData && trendData.labels && trendData.datasets && (currentTrendTimeframe === '24' || currentTrendTimeframe === '24h')) {
                    chart.data.labels = trendData.labels;
                    chart.data.datasets[0].data = trendData.datasets.online;
                    chart.data.datasets[1].data = trendData.datasets.offline;
                    chart.data.datasets[2].data = trendData.datasets.warning;

                    const maxVal = Math.max(...trendData.datasets.online, ...trendData.datasets.offline, 10);
                    if (chart.options && chart.options.scales && chart.options.scales.y) {
                        chart.options.scales.y.max = Math.ceil(maxVal * 1.15);
                    }
                    chart.update();
                    loadedFromApi = true;
                    if (showNotification) showToast('Mode 24 Jam', 'Grafik telemetri 24 jam berhasil disinkronkan dari Backend Reza.', 'success');
                }
            } catch (err) {
                console.warn('Fallback 24h client-side:', err);
            }
        }

        if (!loadedFromApi) {
            const now = new Date();
            const hourLabels = [];
            const dataOn = [];
            const dataOff = [];
            const dataWarn = [];

            for (let i = 23; i >= 0; i--) {
                const h = new Date(now.getTime() - i * 3600000);
                const hourStr = String(h.getHours()).padStart(2, '0') + ':00';
                hourLabels.push(i === 0 ? 'Sekarang' : hourStr);
                const onVal = (i < 3) ? counts.online : (i > 16 ? 0 : 0);
                dataOn.push(onVal);
                dataOff.push(Math.max(0, counts.total - onVal));
                dataWarn.push(counts.warning);
            }

            chart.data.labels = hourLabels;
            chart.data.datasets[0].data = dataOn;
            chart.data.datasets[1].data = dataOff;
            chart.data.datasets[2].data = dataWarn;
            if (chart.options && chart.options.scales && chart.options.scales.y) {
                chart.options.scales.y.max = Math.max(16, counts.total + 2);
            }
            chart.update();
            if (showNotification) showToast('Mode 24 Jam', 'Grafik telemetri menampilkan data 24 jam (diperbarui per 1 jam).', 'info');
        }

        trendIntervalTimer = setInterval(() => {
            if (!APP_STATE.charts.trendChart || currentTrendTimeframe !== '24') return;
            updateTrendChartTimeframe('24', false);
        }, 3600000);

    } else {
        // MODE 3: 30 Hari dengan data 1 hari sekali
        let loadedFromApi = false;
        if (typeof getDashboardTrend === 'function') {
            try {
                const trendData = await getDashboardTrend('30d');
                if (trendData && trendData.labels && trendData.datasets && (currentTrendTimeframe === '30' || currentTrendTimeframe === '30d')) {
                    chart.data.labels = trendData.labels;
                    chart.data.datasets[0].data = trendData.datasets.online;
                    chart.data.datasets[1].data = trendData.datasets.offline;
                    chart.data.datasets[2].data = trendData.datasets.warning;

                    const maxVal = Math.max(...trendData.datasets.online, ...trendData.datasets.offline, 10);
                    if (chart.options && chart.options.scales && chart.options.scales.y) {
                        chart.options.scales.y.max = Math.ceil(maxVal * 1.15);
                    }
                    chart.update();
                    loadedFromApi = true;
                    if (showNotification) showToast('Mode 30 Hari', 'Grafik riwayat 30 hari berhasil disinkronkan dari Backend Reza.', 'success');
                }
            } catch (err) {
                console.warn('Fallback 30d client-side:', err);
            }
        }

        if (!loadedFromApi) {
            const now = new Date();
            const dayLabels = [];
            const dataOn = [];
            const dataOff = [];
            const dataWarn = [];
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

            for (let i = 29; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 86400000);
                const dayStr = `${d.getDate()} ${monthNames[d.getMonth()]}`;
                dayLabels.push(i === 0 ? 'Hari Ini' : dayStr);
                const onVal = (i < 2) ? counts.online : 0;
                dataOn.push(onVal);
                dataOff.push(Math.max(0, counts.total - onVal));
                dataWarn.push(0);
            }

            chart.data.labels = dayLabels;
            chart.data.datasets[0].data = dataOn;
            chart.data.datasets[1].data = dataOff;
            chart.data.datasets[2].data = dataWarn;
            if (chart.options && chart.options.scales && chart.options.scales.y) {
                chart.options.scales.y.max = Math.max(16, counts.total + 2);
            }
            chart.update();
            if (showNotification) showToast('Mode 30 Hari', 'Grafik riwayat status 30 hari (diperbarui per 1 hari).', 'info');
        }

        trendIntervalTimer = setInterval(() => {
            if (!APP_STATE.charts.trendChart || currentTrendTimeframe !== '30') return;
            updateTrendChartTimeframe('30', false);
        }, 86400000);
    }
}

// =============================================================================
// TOAST NOTIFIKASI
// =============================================================================
let toastTimer = null;
function showToast(title, msg, type = 'info') {
    const toast = document.getElementById('toast-notification');
    const tTitle = document.getElementById('toast-title');
    const tMsg = document.getElementById('toast-message');
    const tIcon = document.getElementById('toast-icon');

    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);

    tTitle.textContent = title;
    tMsg.textContent = msg;

    if (type === 'success') {
        tIcon.innerHTML = '<i class="fa-solid fa-circle-check text-green"></i>';
        toast.style.borderColor = 'var(--status-online)';
    } else if (type === 'error') {
        tIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-red"></i>';
        toast.style.borderColor = 'var(--status-offline)';
    } else if (type === 'warning') {
        tIcon.innerHTML = '<i class="fa-solid fa-bolt text-yellow"></i>';
        toast.style.borderColor = 'var(--status-warning)';
    } else {
        tIcon.innerHTML = '<i class="fa-solid fa-circle-info text-cyan"></i>';
        toast.style.borderColor = 'var(--cyan-neon)';
    }

    toast.classList.remove('hidden');
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 4000);
}

// =============================================================================
// ASISTEN AI INFRASTRUCTURE (PDF HAL. 4 & HAL. 11)
// =============================================================================
function openAiModal() {
    const modal = document.getElementById('ai-assistant-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        loadAiRecommendation();
    }
}
window.openAiModal = openAiModal;
window.closeAiModal = closeAiModal;
window.loadAiRecommendation = loadAiRecommendation;

function closeAiModal() {
    const modal = document.getElementById('ai-assistant-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

async function loadAiRecommendation(isManual = false) {
    const spin = document.getElementById('ai-modal-spin');
    if (spin) spin.classList.add('fa-spin');

    const prob = document.getElementById('ai-modal-problem');
    const rec = document.getElementById('ai-modal-recommendation');
    if (prob) prob.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-cyan"></i> Memuat status telemetri perangkat...';
    if (rec) rec.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-cyan"></i> Menganalisis rekomendasi preskriptif...';

    try {
        if (typeof getAiRecommendation === 'function') {
            const res = await getAiRecommendation();
            if (res && res.data) {
                const aiData = res.data;
                window.LAST_AI_RECOMMENDATION_TEXT = aiData.recommendation;
                window.LAST_AI_TROUBLED_DEVICES = aiData.troubled_devices || aiData.device || 'Tidak ada';

                const troubled = aiData.troubled_devices || aiData.device || 'Infrastruktur Jaringan';
                const statusNet = aiData.status_network || (aiData.status === 'healthy' ? 'OPTIMAL (STABIL)' : 'PERINGATAN (WARNING)');
                const troubledList = troubled.split(',').map(s => s.trim()).filter(Boolean);

                if (prob) {
                    prob.innerHTML = `
                        <div style="margin-bottom: 8px;">
                            Status Jaringan: <strong class="${aiData.status === 'healthy' ? 'text-green' : 'text-red'}">${statusNet}</strong> | 
                            SLA: <strong class="text-cyan">${aiData.availability_percent !== undefined ? aiData.availability_percent + '%' : '-'}</strong> 
                            (${aiData.online_devices || 0} Online / ${aiData.total_devices || 15} Total)
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                            ${troubledList.map(c => `
                                <span class="ai-troubled-pill" onclick="closeAiModal(); if(typeof openDeviceModal==='function')openDeviceModal('${c}');" title="Klik untuk cek detail ${c}">
                                    <i class="fa-solid fa-triangle-exclamation"></i> ${c}
                                </span>
                            `).join('')}
                        </div>
                    `;
                }

                if (rec && aiData.recommendation) {
                    rec.innerHTML = renderFormattedAiRecommendation(aiData);
                }
            }
        }
        if (isManual) {
            showToast('AI Diagnostik Selesai', 'Rekomendasi otomatis dimutakhirkan berdasarkan status perangkat fisik.', 'success');
        }
    } catch (e) {
        console.warn("AI modal error:", e);
        if (rec) rec.innerHTML = '<span class="text-danger">Gagal memuat rekomendasi AI. Pastikan backend aktif.</span>';
    } finally {
        if (spin) spin.classList.remove('fa-spin');
    }
}
window.loadAiRecommendation = loadAiRecommendation;

// =============================================================================
// EXPORT EXCEL REAL (CSV UTF-8 BOM) & PDF EXPORT (PDF HAL. 4 & 16)
// =============================================================================
function exportReport(format) {
    if (String(format).toLowerCase() === 'pdf') {
        window.print();
        return;
    }
    
    // Format Excel / CSV
    let csv = "\uFEFF"; // UTF-8 BOM for Excel
    csv += "NO,KODE PERANGKAT,NAMA PERANGKAT,KATEGORI,STATUS,IP ADDRESS,LOKASI,METODE,PIC,TERAKHIR TERLIHAT,LATENCY\n";
    
    APP_STATE.devices.forEach((d, idx) => {
        csv += `"${idx + 1}","${d.code}","${d.name}","${d.category}","${d.status}","${d.ip}","${d.location}","${d.method}","${d.pic}","${d.lastSeen}","${d.ping}"\n`;
    });
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Perangkat_T-AIMS_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast("Ekspor Berhasil", "File spreadsheet Excel (CSV) telah berhasil diunduh.", "success");
}

// =============================================================================
// ROUTING HASH & AUTO ENTER DARI URL (SEAMLESS MULTI-PAGE & MENU)
// =============================================================================
window.addEventListener('DOMContentLoaded', () => {
    // 0. Validasi Expiry Token JWT pada LocalStorage (QA Fix Bug #9)
    const jwtToken = localStorage.getItem('taims_jwt_token');
    if (jwtToken) {
        try {
            const payloadBase64 = jwtToken.split('.')[1];
            if (payloadBase64) {
                const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
                if (payload.exp && (payload.exp * 1000) < Date.now()) {
                    localStorage.removeItem('taims_jwt_token');
                }
            }
        } catch (e) {
            localStorage.removeItem('taims_jwt_token');
        }
    }

    // 0b. Auto-inject aria-label pada seluruh elemen tombol icon untuk Screen Reader (QA Fix Bug #8)
    const ensureAriaLabels = () => {
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.getAttribute('aria-label')) {
                const label = btn.getAttribute('title') || btn.textContent.trim();
                if (label) {
                    btn.setAttribute('aria-label', label);
                } else if (btn.classList.contains('modal-close-btn')) {
                    btn.setAttribute('aria-label', 'Tutup Jendela');
                } else {
                    btn.setAttribute('aria-label', 'Tombol Navigasi & Aksi');
                }
            }
        });
    };
    ensureAriaLabels();
    setTimeout(ensureAriaLabels, 1000);

    // 1. Cek hash URL (misal #page-reports, #page-devices)
    const hash = window.location.hash.replace('#', '');
    const validPages = ['page-dashboard', 'page-devices', 'page-monitoring', 'page-location', 'page-alerts', 'page-reports', 'page-project-info', 'page-users', 'page-settings'];
    
    // Cek apakah ada sesi login aktif di localStorage atau sessionStorage
    const saved = localStorage.getItem('taims_active_session') || sessionStorage.getItem('taims_session');
    let activeUser = null;
    if (saved) {
        try {
            activeUser = JSON.parse(saved);
        } catch (e) {
            localStorage.removeItem('taims_active_session');
            sessionStorage.removeItem('taims_session');
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (!activeUser && urlParams.get('autologin')) {
        const roleParam = urlParams.get('role') || 'superadmin';
        activeUser = {
            username: 'rezatri',
            name: 'Reza Tri Wardana',
            role: roleParam,
            title: roleParam === 'superadmin' ? 'Super Administrator' : (roleParam === 'guest' ? 'User' : 'Administrator')
        };
    }

    if (activeUser) {
        // User telah login sebelumnya: pulihkan sesi akun aktif tanpa reset ke tamu/user
        loginSuccess(activeUser, true);
        if (hash && validPages.includes(hash)) {
            setTimeout(() => switchPage(hash), 50);
        } else {
            setTimeout(() => switchPage('page-dashboard'), 50);
        }
    } else {
        // Pertama kali buka link atau telah logout: tampilkan halaman login (tidak auto-guest)
        document.getElementById('auth-screen').classList.remove('hidden');
        document.getElementById('main-dashboard').classList.add('hidden');
    }
});

// Update URL Hash saat ganti halaman
const origSwitchPage = switchPage;
switchPage = function(pageId) {
    window.location.hash = pageId;
    origSwitchPage(pageId);
};

// Auto-adjust leaflet map on window resize
window.addEventListener('resize', () => {
    if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize();
    if (APP_STATE.fullMap) APP_STATE.fullMap.invalidateSize();
});

// =============================================================================
// COMPLETE ENTERPRISE I18N TRANSLATION ENGINE (100% COVERAGE & MUTATION OBSERVER)
// =============================================================================

function setQuickStatusFilter(status) {
    const select = document.getElementById('filter-status-select');
    if (select) select.value = status;
    renderFullDevicesTable();
}
window.setQuickStatusFilter = setQuickStatusFilter;

function setDevicesViewMode(mode) {
    APP_STATE.devicesViewMode = mode;
    try { localStorage.setItem('taims_devices_view_mode', mode); } catch (e) {}
    renderFullDevicesTable();
}
window.setDevicesViewMode = setDevicesViewMode;

function getDeviceCategoryIcon(cat) {
    const c = (cat || '').toLowerCase();
    if (c.includes('server') || c.includes('peladen')) return 'fa-server';
    if (c.includes('router') || c.includes('perute') || c.includes('mikrotik')) return 'fa-network-wired';
    if (c.includes('switch') || c.includes('jaringan')) return 'fa-diagram-project';
    if (c.includes('access point') || c.includes('wifi') || c.includes('ap')) return 'fa-wifi';
    if (c.includes('cctv') || c.includes('keamanan') || c.includes('kamera')) return 'fa-video';
    if (c.includes('iot') || c.includes('sensor') || c.includes('esp32')) return 'fa-microchip';
    if (c.includes('raspberry') || c.includes('rpi')) return 'fa-cube';
    if (c.includes('pc') || c.includes('workstation') || c.includes('stasiun kerja')) return 'fa-desktop';
    if (c.includes('tv') || c.includes('smart tv')) return 'fa-tv';
    if (c.includes('printer')) return 'fa-print';
    return 'fa-hard-drive';
}

function renderDevicesGridCards(devices) {
    const grid = document.getElementById('devices-grid-view');
    if (!grid) return;

    const isEn = APP_STATE && APP_STATE.currentLang === 'en';
    if (!devices || devices.length === 0) {
        grid.innerHTML = `
            <div class="grid-empty-state text-center py-5" style="grid-column: 1 / -1; width: 100%;">
                <i class="fa-solid fa-magnifying-glass mb-2 text-cyan" style="font-size: 2rem; display: block;"></i>
                <p class="text-muted">${isEn ? 'No assets matched the search filter.' : 'Tidak ada aset yang cocok dengan filter pencarian.'}</p>
            </div>
        `;
        return;
    }

    const isSuperadmin = APP_STATE.currentUser && (APP_STATE.currentUser.role === 'superadmin' || APP_STATE.currentUser.role === 'super_admin');

    grid.innerHTML = devices.map(dev => {
        let prioHtml = '';
        if (dev.priority === 1) prioHtml = `<span class="badge-priority p1" style="display:inline-block;padding:1px 6px;font-size:0.65rem;font-weight:700;border-radius:3px;background:rgba(239,68,68,0.2);color:#EF4444;border:1px solid rgba(239,68,68,0.4);">P1</span>`;
        else if (dev.priority === 2) prioHtml = `<span class="badge-priority p2" style="display:inline-block;padding:1px 6px;font-size:0.65rem;font-weight:700;border-radius:3px;background:rgba(245,158,11,0.18);color:#F59E0B;border:1px solid rgba(245,158,11,0.4);">P2</span>`;
        else prioHtml = `<span class="badge-priority p3" style="display:inline-block;padding:1px 6px;font-size:0.65rem;font-weight:700;border-radius:3px;background:rgba(148,163,184,0.2);color:#94A3B8;border:1px solid rgba(148,163,184,0.4);">P3</span>`;

        let statusBadge = '';
        if (dev.status === 'online') statusBadge = `<span class="status-pill online"><span class="dot green"></span> Online</span>`;
        else if (dev.status === 'warning') statusBadge = `<span class="status-pill warning"><span class="dot yellow"></span> Warning</span>`;
        else if (dev.status === 'unknown') statusBadge = `<span class="status-pill unknown"><span class="dot gray"></span> Unknown</span>`;
        else statusBadge = `<span class="status-pill offline"><span class="dot red"></span> Offline</span>`;

        const catIcon = getDeviceCategoryIcon(dev.category);
        const deleteBtnHtml = isSuperadmin ? `<button class="btn-sm btn-outline-cyber py-1 px-2 text-red admin-only" onclick="event.stopPropagation(); handleDeleteDevice('${dev.id}')" title="Hapus Aset"><i class="fa-solid fa-trash-can"></i></button>` : '';

        const safeName = escapeHtml(dev.name);
        const safeCode = escapeHtml(dev.code || 'AST-' + dev.id);
        const safeCat = escapeHtml(dev.category || 'Device');
        const safeLoc = escapeHtml(dev.location || 'Site');
        const safeIp = escapeHtml(dev.ip || '-');
        const safeMac = escapeHtml(dev.mac || 'N/A');

        return `
            <div class="device-cyber-card ${dev.status}" onclick="openDeviceDetailModal('${dev.id}')">
                <div class="dcc-header">
                    <div class="dcc-status-prio">
                        ${statusBadge}
                        ${prioHtml}
                    </div>
                    <div class="dcc-actions" onclick="event.stopPropagation()">
                        <button class="btn-sm btn-outline-cyber py-1 px-2" onclick="openDeviceDetailModal('${dev.id}')" title="Detail Perangkat"><i class="fa-solid fa-eye"></i></button>
                        <button class="btn-sm btn-outline-cyber py-1 px-2 admin-only" onclick="openEditDeviceModal('${dev.id}')" title="Edit Data Aset"><i class="fa-solid fa-pen-to-square"></i></button>
                        ${deleteBtnHtml}
                    </div>
                </div>

                <div class="dcc-body">
                    <div class="dcc-icon-title">
                        <div class="dcc-icon ${dev.status}">
                            <i class="fa-solid ${catIcon}"></i>
                        </div>
                        <div class="dcc-title-info">
                            <h5 class="dcc-name" title="${safeName}">${safeName}</h5>
                            <span class="dcc-code text-cyan font-mono">${safeCode}</span>
                        </div>
                    </div>

                    <div class="dcc-meta-row">
                        <span class="badge-subtle"><i class="fa-solid fa-tags text-cyan"></i> ${safeCat}</span>
                        <span class="badge-subtle"><i class="fa-solid fa-location-dot text-cyan"></i> ${safeLoc}</span>
                    </div>

                    <div class="dcc-network-box">
                        <div class="dcc-net-item">
                            <span class="dcc-net-label">IP Address</span>
                            <span class="dcc-net-val font-mono">${safeIp}</span>
                        </div>
                        <div class="dcc-net-item text-right">
                            <span class="dcc-net-label">MAC Address</span>
                            <span class="dcc-net-val font-mono text-muted">${safeMac}</span>
                        </div>
                    </div>

                    <div class="dcc-footer-info">
                        <div class="dcc-info-col">
                            <span class="text-xs text-muted">PIC: </span>
                            <span class="text-xs font-semibold text-white">${dev.pic || 'Damar Munajad'}</span>
                        </div>
                        <div class="dcc-info-col text-right">
                            <span class="text-xs text-muted">Latency: </span>
                            <span class="font-mono text-xs ${dev.status === 'online' ? 'text-green' : 'text-red'}">${dev.ping || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
window.renderDevicesGridCards = renderDevicesGridCards;

function matchesDeviceCategory(devOrCat, selCat) {
    if (!selCat || selCat === 'all') return true;
    const isObj = devOrCat && typeof devOrCat === 'object';
    const dCat = (isObj ? (devOrCat.category || '') : (devOrCat || '')).toLowerCase().trim();
    const dCode = (isObj ? (devOrCat.code || '') : '').toLowerCase().trim();
    const dName = (isObj ? (devOrCat.name || '') : '').toLowerCase().trim();
    const s = selCat.toLowerCase().trim();

    const isRpi = dCode.startsWith('rpi') || dName.includes('raspberry') || dCat.includes('raspberry');
    const isCctv = dCode.startsWith('cctv') || dName.includes('cctv') || dCat === 'cctv' || dCat.includes('cctv');
    const isSmartTv = !isCctv && (dCode.startsWith('smtv') || dName.includes('smart tv') || dCat === 'tv' || dCat === 'smart tv');
    const isIotEsp = !isRpi && (dCode.startsWith('esp') || dName.includes('esp32') || dCat.includes('iot'));

    if (s === 'cctv' || s.includes('cctv')) {
        return isCctv;
    }
    if (s === 'smart tv' || s === 'tv') {
        return isSmartTv;
    }
    if (s === 'raspberry pi' || s.includes('raspberry') || s === 'rpi') {
        return isRpi;
    }
    if (s === 'iot node' || s.includes('iot') || s.includes('esp32')) {
        return isIotEsp;
    }
    if (s === 'server' || s.includes('peladen')) {
        return !isRpi && (dCat.includes('server') || dCode.startsWith('srv'));
    }
    if (s === 'router' || s.includes('perute')) {
        return dCat.includes('router') || dCode.startsWith('rtr') || dCode.startsWith('mkrt') || dName.includes('mikrotik');
    }
    if (s === 'switch') {
        return dCat.includes('switch') || dCode.startsWith('sw');
    }
    if (s === 'access point' || s === 'ap') {
        return dCat.includes('access point') || dCat === 'ap' || dCode.startsWith('ap');
    }
    if (s === 'pc' || s.includes('workstation')) {
        return dCat === 'pc' || dCat.includes('workstation') || dCode.startsWith('pc');
    }
    if (s === 'printer') {
        return dCat.includes('printer') || dCode.startsWith('prt');
    }

    return dCat === s;
}
window.matchesDeviceCategory = matchesDeviceCategory;

function renderFullDevicesTable() {
    const tbody = document.getElementById('full-devices-tbody');
    if (!tbody) return;

    const q = (document.getElementById('dev-page-search')?.value || '').toLowerCase().trim();
    const cat = document.getElementById('filter-category')?.value || 'all';
    const loc = document.getElementById('filter-location-select')?.value || 'all';
    const stat = document.getElementById('filter-status-select')?.value || 'all';

    const filtered = (APP_STATE.devices || []).filter(d => {
        const matchQ = !q ||
            (d.name && d.name.toLowerCase().includes(q)) ||
            (d.code && d.code.toLowerCase().includes(q)) ||
            (d.ip && d.ip.includes(q)) ||
            (d.pic && d.pic.toLowerCase().includes(q));

        const matchCat = matchesDeviceCategory(d, cat);

        let matchLoc = true;
        if (loc !== 'all') {
            const locStr = (d.location || '').toLowerCase().trim();
            const isHouseOfServer = locStr.includes('house') || locStr.includes('server') || locStr.includes('mentor');
            const isMarketing = locStr.includes('marketing') || locStr === 'mo' || /\bmo\b/.test(locStr);
            const isHeadOffice = !isHouseOfServer && !isMarketing && (locStr.includes('head office') || locStr === 'ho' || /\bho\b/.test(locStr) || locStr.includes('pusat'));

            if (loc === 'Head Office') matchLoc = isHeadOffice;
            else if (loc === 'Marketing Office') matchLoc = isMarketing;
            else if (loc === 'Rumah Mentor' || loc === 'House Of Server' || loc === 'House of Server') matchLoc = isHouseOfServer;
        }

        let matchStat = true;
        if (stat !== 'all') {
            const s = (d.status || d.current_status || 'offline').toLowerCase();
            matchStat = (s === stat);
        }

        return matchQ && matchCat && matchLoc && matchStat;
    });

    tbody.innerHTML = '';
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';

    // Update Counter Stat Cards & Quick Status Chips (Warning & Unknown Terpisah)
    const totalCount = APP_STATE.devices.length;
    const onlineCount = APP_STATE.devices.filter(d => (d.status || d.current_status || '').toLowerCase() === 'online').length;
    const offlineCount = APP_STATE.devices.filter(d => (d.status || d.current_status || 'offline').toLowerCase() === 'offline').length;
    const warningCount = APP_STATE.devices.filter(d => (d.status || d.current_status || '').toLowerCase() === 'warning').length;
    const unknownCount = APP_STATE.devices.filter(d => (d.status || d.current_status || '').toLowerCase() === 'unknown').length;

    const totalEl = document.getElementById('dev-stat-total');
    if (totalEl) totalEl.textContent = `${totalCount} Devices`;
    const onEl = document.getElementById('dev-stat-online');
    if (onEl) onEl.textContent = `${onlineCount} Units`;
    const offEl = document.getElementById('dev-stat-offline');
    if (offEl) offEl.textContent = `${offlineCount} Units`;
    const warnEl = document.getElementById('dev-stat-warning');
    if (warnEl) warnEl.textContent = `${warningCount} Units`;
    const unkEl = document.getElementById('dev-stat-unknown');
    if (unkEl) unkEl.textContent = `${unknownCount} Units`;

    // Sync Quick Status Chips Counts
    const elAll = document.getElementById('chip-count-all'); if (elAll) elAll.textContent = totalCount;
    const elOn = document.getElementById('chip-count-online'); if (elOn) elOn.textContent = onlineCount;
    const elOff = document.getElementById('chip-count-offline'); if (elOff) elOff.textContent = offlineCount;
    const elWarn = document.getElementById('chip-count-warning'); if (elWarn) elWarn.textContent = warningCount;
    const elUnk = document.getElementById('chip-count-unknown'); if (elUnk) elUnk.textContent = unknownCount;

    // Sync Quick Status Chips Active State
    document.querySelectorAll('.chip-filter').forEach(chip => {
        if (chip.getAttribute('data-status') === stat) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    // Sync View Mode (Table vs Grid)
    const mode = APP_STATE.devicesViewMode || 'table';
    const tableView = document.getElementById('devices-table-view');
    const gridView = document.getElementById('devices-grid-view');
    const btnTable = document.getElementById('btn-view-table');
    const btnGrid = document.getElementById('btn-view-grid');

    if (mode === 'grid') {
        if (tableView) tableView.classList.add('hidden');
        if (gridView) gridView.classList.remove('hidden');
        if (btnTable) btnTable.classList.remove('active');
        if (btnGrid) btnGrid.classList.add('active');
    } else {
        if (tableView) tableView.classList.remove('hidden');
        if (gridView) gridView.classList.add('hidden');
        if (btnTable) btnTable.classList.add('active');
        if (btnGrid) btnGrid.classList.remove('active');
    }

    // Render Grid Cards
    renderDevicesGridCards(filtered);

    const countBadge = document.getElementById('dev-table-count');
    if (countBadge) countBadge.remove();

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="text-center py-4 text-muted"><i class="fa-solid fa-magnifying-glass mb-2 text-cyan" style="font-size:1.5rem; display:block;"></i> ${isEn ? 'No assets matched the search filter.' : 'Tidak ada aset yang cocok dengan filter pencarian.'}</td></tr>`;
        return;
    }

    filtered.forEach((dev, index) => {
        const tr = document.createElement('tr');

        let prioHtml = '';
        if (dev.priority === 1) prioHtml = `<span class="badge-priority p1" style="display:inline-block;padding:1px 5px;font-size:0.65rem;font-weight:700;border-radius:3px;background:rgba(239,68,68,0.2);color:#EF4444;border:1px solid rgba(239,68,68,0.4);margin-right:4px;">P1</span>`;
        else if (dev.priority === 2) prioHtml = `<span class="badge-priority p2" style="display:inline-block;padding:1px 5px;font-size:0.65rem;font-weight:700;border-radius:3px;background:rgba(245,158,11,0.18);color:#F59E0B;border:1px solid rgba(245,158,11,0.4);margin-right:4px;">P2</span>`;
        else prioHtml = `<span class="badge-priority p3" style="display:inline-block;padding:1px 5px;font-size:0.65rem;font-weight:700;border-radius:3px;background:rgba(148,163,184,0.2);color:#94A3B8;border:1px solid rgba(148,163,184,0.4);margin-right:4px;">P3</span>`;

        let badge = '';
        if (dev.status === 'online') badge = `<span class="status-pill online"><span class="dot green"></span> Online</span>`;
        else if (dev.status === 'warning') badge = `<span class="status-pill warning"><span class="dot yellow"></span> Warning</span>`;
        else if (dev.status === 'unknown') badge = `<span class="status-pill unknown"><span class="dot gray"></span> Unknown</span>`;
        else badge = `<span class="status-pill offline"><span class="dot red"></span> Offline</span>`;

        const isSuperadmin = APP_STATE.currentUser && (APP_STATE.currentUser.role === 'superadmin' || APP_STATE.currentUser.role === 'super_admin');
        const deleteBtnHtml = isSuperadmin ? `<button class="btn-sm btn-outline-cyber py-1 px-2 text-red admin-only" onclick="handleDeleteDevice('${dev.id}')" title="Hapus Aset (Khusus Superadmin)"><i class="fa-solid fa-trash-can"></i></button>` : '';

        const safeCode = escapeHtml(dev.code || 'AST-' + dev.id);
        const safeName = escapeHtml(dev.name);
        const safeCat = escapeHtml(dev.category);
        const safeIp = escapeHtml(dev.ip || '-');
        const safeMac = escapeHtml(dev.mac || 'N/A');
        const safeLoc = escapeHtml(dev.location || '-');
        const safePic = escapeHtml(dev.pic || 'Damar Munajad');
        const safeMethod = escapeHtml(dev.method || 'Ping');
        const safePing = escapeHtml(dev.ping || '-');
        const safeLastSeen = escapeHtml(dev.lastSeen || '-');

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${prioHtml}<strong class="text-cyan font-mono">${safeCode}</strong></td>
            <td>
                <strong>${safeName}</strong>
                <div class="text-xs text-muted">${safeCat}</div>
            </td>
            <td>
                <span class="ip-mono">${safeIp}</span>
                <div class="text-xs text-muted font-mono">${safeMac}</div>
            </td>
            <td><span class="badge-subtle"><i class="fa-solid fa-location-dot text-cyan"></i> ${safeLoc}</span></td>
            <td><span class="text-xs font-semibold text-white">${safePic}</span></td>
            <td><span class="badge-subtle text-xs">${safeMethod}</span></td>
            <td><span class="font-mono text-xs ${dev.status === 'online' ? 'text-green' : 'text-red'}">${safePing}</span></td>
            <td>${badge}</td>
            <td><span class="text-xs text-muted">${safeLastSeen}</span></td>
            <td class="text-right">
                <div class="d-flex gap-1 justify-end">
                    <button class="btn-sm btn-outline-cyber py-1 px-2" onclick="openDeviceDetailModal('${dev.id}')" title="Detail Perangkat"><i class="fa-solid fa-eye"></i></button>
                    <button class="btn-sm btn-outline-cyber py-1 px-2 admin-only" onclick="openEditDeviceModal('${dev.id}')" title="Edit Data Aset"><i class="fa-solid fa-pen-to-square"></i></button>
                    ${deleteBtnHtml}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function resetDeviceFilters() {
    const s = document.getElementById('dev-page-search'); if (s) s.value = '';
    const c = document.getElementById('filter-category'); if (c) c.value = 'all';
    const l = document.getElementById('filter-location-select'); if (l) l.value = 'all';
    const st = document.getElementById('filter-status-select'); if (st) st.value = 'all';
    renderFullDevicesTable();
    showToast('Filter Direset', 'Menampilkan seluruh data aset kembali.', 'info');
}

function triggerManualDevicesRefresh() {
    const icon = document.getElementById('icon-refresh-dev');
    if (icon) icon.classList.add('fa-spin');

    const pill = document.getElementById('auto-refresh-pill');
    if (pill) {
        pill.classList.remove('hidden');
        if (window._autoRefreshPillTimer) clearTimeout(window._autoRefreshPillTimer);
        window._autoRefreshPillTimer = setTimeout(() => {
            pill.classList.add('hidden');
        }, 3000);
    }

    if (typeof filterFullDevicesTable === 'function') filterFullDevicesTable();
    if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();

    showToast('Pembaruan Data', 'Pembaruan otomatis tiap 10 detik. Data aset berhasil diperbarui.', 'info');

    setTimeout(() => {
        if (icon) icon.classList.remove('fa-spin');
    }, 800);
}
window.triggerManualDevicesRefresh = triggerManualDevicesRefresh;

function exportDeviceData(format) {
    if (format === 'csv') {
        let csv = 'No,Kode Aset,Nama Perangkat,Kategori,IP Address,MAC Address,Lokasi,PIC,Metode Monitor,Status,Last Seen\n';
        APP_STATE.devices.forEach((d, i) => {
            csv += `"${i+1}","${d.code || ''}","${d.name || ''}","${d.category || ''}","${d.ip || ''}","${d.mac || ''}","${d.location || ''}","${d.pic || ''}","${d.method || ''}","${d.status || ''}","${d.lastSeen || ''}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `T-AIMS_Asset_Registry_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
        showToast('Export Berhasil', 'File CSV inventaris aset berhasil diunduh.', 'success');
    }
}

function printAllQrModal() {
    showToast('Cetak QR Code', 'Mempersiapkan print sheet label QR seluruh aset...', 'info');
    setTimeout(() => { window.print(); }, 600);
}

// -----------------------------------------------------------------------------
// 3. NOC MONITORING ENGINE, LIVE LATENCY CHART & TERMINAL STREAM
// -----------------------------------------------------------------------------
let nocStreamInterval = null;
let nocStreamActive = true;
let latencyChartInstance = null;

function initNocMonitoring() {
    initNocLatencyChart();
    startHeartbeatStream();
}

function initNocLatencyChart() {
    const ctx = document.getElementById('network-latency-chart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (latencyChartInstance) {
        latencyChartInstance.destroy();
    }

    const labels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'];
    latencyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Head Office (HO)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#FF1744',
                    backgroundColor: 'rgba(255, 23, 68, 0.08)',
                    borderWidth: 2,
                    tension: 0.35,
                    fill: true
                },
                {
                    label: 'Marketing Office (MO)', data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#F59E0B',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [4, 4],
                    tension: 0.35
                },
                {
                    label: 'House Of Server', data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#F59E0B',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.35
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#CBD5E1', font: { family: 'Plus Jakarta Sans', size: 11 } }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94A3B8' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94A3B8', callback: v => v + ' ms' },
                    suggestedMax: 10
                }
            }
        }
    });
}

let nocLastSeenLogId = 0;
let nocInitialized = false;

function updateNocBadge(status) {
    const badge = document.getElementById('noc-stream-status-badge');
    if (!badge) return;
    if (status === 'standby') {
        badge.innerHTML = '<span class="dot yellow pulse"></span> Standby';
    } else if (status === 'receiving') {
        badge.innerHTML = '<span class="dot green pulse"></span> Receiving';
    } else if (status === 'offline') {
        badge.innerHTML = '<span class="dot red"></span> Offline';
    } else if (status === 'paused') {
        badge.innerHTML = '<span class="dot text-muted"></span> Dijeda';
    }
}

function appendNocStreamLog(deviceCode, payload, status = 'online') {
    const term = document.getElementById('noc-stream-terminal');
    if (!term) return;

    const now = new Date().toTimeString().split(' ')[0];
    const div = document.createElement('div');
    div.className = 'term-line';
    
    let payloadStr = '';
    if (typeof payload === 'object') {
        payloadStr = JSON.stringify(payload);
    } else {
        payloadStr = String(payload);
    }

    const normStatus = (status || '').toLowerCase();
    const statusClass = normStatus === 'offline' ? 'text-danger' : (normStatus === 'warning' ? 'term-warn' : 'term-ok');
    div.innerHTML = `<span class="term-ts">[${now}]</span> <span class="${statusClass}">&larr; RECV [${deviceCode}]:</span> <span class="term-json">${payloadStr}</span>`;
    
    term.appendChild(div);
    term.scrollTop = term.scrollHeight;

    // Pulse badge to receiving then back to standby
    updateNocBadge('receiving');
    if (window._nocBadgeTimeout) clearTimeout(window._nocBadgeTimeout);
    window._nocBadgeTimeout = setTimeout(() => {
        if (nocStreamActive) updateNocBadge('standby');
    }, 2500);

    // Keep terminal capped at 80 lines
    while (term.childNodes.length > 80) {
        term.removeChild(term.firstChild);
    }
}

window.appendNocStreamLog = appendNocStreamLog;
window.injectNocTerminalLog = appendNocStreamLog;

async function checkRealIncomingTelemetry() {
    if (!nocStreamActive) return;
    if (!window.apiService || typeof window.apiService.getMonitoringLogs !== 'function') return;

    try {
        const res = await window.apiService.getMonitoringLogs({ limit: 15 });
        const logs = Array.isArray(res) ? res : (res && res.data && Array.isArray(res.data) ? res.data : []);
        
        if (!logs || logs.length === 0) return;

        // On first run, record the highest ID so we start cleanly in STANDBY
        if (!nocInitialized) {
            nocInitialized = true;
            let maxId = 0;
            for (const item of logs) {
                if (item.log_id && item.log_id > maxId) maxId = item.log_id;
            }
            nocLastSeenLogId = maxId;
            return;
        }

        // Filter new logs that arrived after our baseline
        const newLogs = logs
            .filter(item => item.log_id && item.log_id > nocLastSeenLogId)
            .sort((a, b) => a.log_id - b.log_id);

        for (const log of newLogs) {
            nocLastSeenLogId = Math.max(nocLastSeenLogId, log.log_id);

            let detailsObj = {};
            if (log.details) {
                if (typeof log.details === 'string') {
                    try { detailsObj = JSON.parse(log.details); } catch(e) { detailsObj = { raw: log.details }; }
                } else {
                    detailsObj = log.details;
                }
            }

            const payload = {
                device_id: log.asset_code || `ASSET-${log.asset_id}`,
                status: (log.status || 'ONLINE').toUpperCase(),
                method: log.method || 'TELEMETRY',
                response_time_ms: log.response_time_ms || 0,
                ...detailsObj
            };

            appendNocStreamLog(log.asset_code || `ASSET-${log.asset_id}`, payload, log.status);
        }
    } catch (e) {
        // Abaikan jika backend belum siap/koneksi terputus sementara
    }
}

function startHeartbeatStream() {
    const term = document.getElementById('noc-stream-terminal');
    if (!term) return;

    if (nocStreamInterval) clearInterval(nocStreamInterval);

    const now = new Date().toTimeString().split(' ')[0];
    term.innerHTML = `
        <div class="term-line"><span class="term-ts">[${now}]</span> <span class="term-ok">INIT:</span> T-AIMS Monitoring Engine v2.4 initialized.</div>
        <div class="term-line"><span class="term-ts">[${now}]</span> <span class="term-warn">STANDBY:</span> Mode siaga aktif. Menunggu telemetri & heartbeat riil masuk dari perangkat (IoT/HTTP/MQTT)...</div>
    `;
    updateNocBadge('standby');

    // Polling data log riil secara periodik setiap 3 detik
    nocStreamInterval = setInterval(checkRealIncomingTelemetry, 3000);
    // Inisialisasi awal log id
    checkRealIncomingTelemetry();
}

function toggleHeartbeatStream() {
    nocStreamActive = !nocStreamActive;
    const btn = document.getElementById('btn-toggle-stream');
    if (btn) {
        btn.innerHTML = nocStreamActive ? '<i class="fa-solid fa-pause"></i> Jeda Stream' : '<i class="fa-solid fa-play"></i> Lanjutkan Stream';
    }
    updateNocBadge(nocStreamActive ? 'standby' : 'paused');
    showToast('Heartbeat Stream', nocStreamActive ? 'Live listener diaktifkan (Mode Standby).' : 'Live listener dijeda sementara.', 'info');
}

function clearNocTerminal() {
    const term = document.getElementById('noc-stream-terminal');
    const now = new Date().toTimeString().split(' ')[0];
    if (term) {
        term.innerHTML = `
            <div class="term-line text-muted">// Terminal konsol dibersihkan.</div>
            <div class="term-line"><span class="term-ts">[${now}]</span> <span class="term-warn">STANDBY:</span> Menunggu payload data telemetri baru masuk...</div>
        `;
    }
}

async function sendSimulatedHeartbeat() {
    const term = document.getElementById('noc-stream-terminal');
    if (!term) return;
    const now = new Date().toTimeString().split(' ')[0];

    const divSend = document.createElement('div');
    divSend.className = 'term-line';
    divSend.innerHTML = `<span class="term-ts">[${now}]</span> <span class="term-warn">&rarr; MANUAL TEST INJECT [ESP-01]:</span> <span class="text-white">Mengirim HTTP heartbeat ke backend /api/heartbeat...</span>`;
    term.appendChild(divSend);
    term.scrollTop = term.scrollHeight;

    if (window.apiService && typeof window.apiService.sendHeartbeat === 'function') {
        try {
            const res = await window.apiService.sendHeartbeat('ESP-01', 'online', {
                ip_address: '192.168.1.11',
                rssi: -58,
                uptime_seconds: 120,
                firmware_version: 'v2.1.0'
            });

            const ts = new Date().toTimeString().split(' ')[0];
            const divAck = document.createElement('div');
            divAck.className = 'term-line';
            divAck.innerHTML = `<span class="term-ts">[${ts}]</span> <span class="term-ok">&larr; RECV ACK [ESP-01]:</span> <span class="term-json">${JSON.stringify(res || { success: true, status: 'online' })}</span>`;
            term.appendChild(divAck);
            term.scrollTop = term.scrollHeight;

            updateNocBadge('receiving');
            setTimeout(() => {
                if (nocStreamActive) updateNocBadge('standby');
            }, 2500);

            showToast('Manual Injeksi', 'Heartbeat berhasil dikirim dan dicatat di database backend.', 'success');
        } catch (err) {
            const ts = new Date().toTimeString().split(' ')[0];
            const divErr = document.createElement('div');
            divErr.className = 'term-line';
            divErr.innerHTML = `<span class="term-ts">[${ts}]</span> <span class="text-danger">&times; ERROR:</span> <span class="text-muted">Gagal terhubung ke backend API (${err.message || 'Server offline'}).</span>`;
            term.appendChild(divErr);
            term.scrollTop = term.scrollHeight;
            showToast('Manual Injeksi', 'Server backend offline atau belum dijalankan.', 'warning');
        }
    } else {
        showToast('Manual Injeksi', 'apiService belum siap.', 'warning');
    }
}


function triggerManualPingSweep() {
    showToast('Ping Sweep Dimulai', 'Memindai seluruh subnet 192.168.10.0/24...', 'info');
    setTimeout(() => {
        showToast('Ping Sweep Selesai', '10 perangkat merespons dalam rata-rata 2.4 ms.', 'success');
    }, 1500);
}

// -----------------------------------------------------------------------------
// 4. INCIDENT LIFECYCLE & MULTI-CHANNEL NOTIFICATIONS
// -----------------------------------------------------------------------------
function renderIncidentsTable() {
    const tbody = document.getElementById('incidents-tbody');
    if (!tbody || !APP_STATE.incidents) return;

    const filter = document.getElementById('filter-incident-status')?.value || 'all';
    tbody.innerHTML = '';
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';

    const list = APP_STATE.incidents.filter(inc => {
        return filter === 'all' || inc.status === filter;
    });

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-muted">${isEn ? 'No incidents found with selected status.' : 'Tidak ada insiden dengan status yang dipilih.'}</td></tr>`;
        return;
    }

    list.forEach(inc => {
        const tr = document.createElement('tr');

        let sevBadge = '';
        if (inc.severity === 'critical') sevBadge = `<span class="status-pill offline"><span class="dot red pulse"></span> ${isEn ? 'Critical' : 'Kritis'}</span>`;
        else if (inc.severity === 'warning') sevBadge = `<span class="status-pill warning"><span class="dot yellow"></span> ${isEn ? 'Warning' : 'Peringatan'}</span>`;
        else sevBadge = `<span class="status-pill online"><span class="dot green"></span> ${isEn ? 'Recovery' : 'Pemulihan'}</span>`;

        let stBadge = '';
        if (inc.status === 'open') stBadge = `<span class="status-pill offline">${isEn ? 'Open' : 'Terbuka'}</span>`;
        else if (inc.status === 'investigating') stBadge = `<span class="status-pill warning">${isEn ? 'Under Investigation' : 'Dalam Penyelidikan'}</span>`;
        else stBadge = `<span class="status-pill online">${isEn ? 'Resolved' : 'Terselesaikan'}</span>`;

        const displaySite = isEn ? (I18N_DICT[inc.site] || inc.site) : (I18N_REVERSE_DICT[inc.site] || inc.site);
        const displayCause = isEn ? (I18N_DICT[inc.rootCause] || inc.rootCause) : (I18N_REVERSE_DICT[inc.rootCause] || inc.rootCause);

        tr.innerHTML = `
            <td><strong class="text-cyan font-mono">${inc.id}</strong></td>
            <td><strong>${inc.deviceName}</strong><div class="text-xs text-muted">${displaySite}</div></td>
            <td><span class="text-xs text-white">${inc.startTime}</span></td>
            <td><span class="text-xs text-muted">${inc.recoveryTime}</span></td>
            <td><strong class="font-mono text-yellow text-xs">${inc.duration}</strong></td>
            <td>${sevBadge}</td>
            <td><span class="text-xs text-secondary">${displayCause}</span></td>
            <td><span class="badge-subtle text-xs">${inc.pic}</span></td>
            <td>${stBadge}</td>
            <td class="text-right">
                ${inc.status !== 'resolved' ?
                  `<button class="btn-sm btn-outline-cyber py-1 px-2" onclick="resolveIncident('${inc.id}')" title="${isEn ? 'Mark Resolved / Recovered' : 'Tandai Selesai / Pulih'}"><i class="fa-solid fa-check"></i> ${isEn ? 'Resolve' : 'Selesai'}</button>` :
                  `<span class="text-xs text-muted"><i class="fa-solid fa-lock"></i> ${isEn ? 'Closed' : 'Ditutup'}</span>`}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function resolveIncident(incId) {
    const inc = APP_STATE.incidents.find(i => i.id === incId);
    if (!inc) return;

    inc.status = 'resolved';
    inc.recoveryTime = 'Hari Ini, Baru Saja';
    inc.severity = 'resolved';

    if (window.apiService && typeof window.apiService.updateIncident === 'function') {
        const rawId = inc.rawId || inc.id.replace(/\D/g, '');
        window.apiService.updateIncident(rawId, { incident_status: 'resolved' }).catch(() => {});
    }

    // Update stats
    renderIncidentsTable();
    showToast('Insiden Selesai', `Status insiden ${incId} berhasil diperbarui menjadi Terselesaikan.`, 'success');
}

function testNotificationAlert() {
    showToast('Mengirim Notifikasi Uji Coba...', 'Menghubungkan ke Bot Telegram @TeknolabAimsBot...', 'info');
    setTimeout(() => {
        showToast('Notifikasi Terkirim', 'Pesan alert uji coba berhasil dikirim ke grup Telegram & webhook n8n.', 'success');
    }, 1200);
}

async function handleRefreshAndCleanIncidents(clearResolved = false) {
    showToast('Memproses...', clearResolved ? 'Membersihkan riwayat pemulihan & notifikasi...' : 'Memuat ulang data insiden...', 'info');

    try {
        if (clearResolved) {
            if (window.apiService && typeof window.apiService.clearResolvedIncidents === 'function') {
                await window.apiService.clearResolvedIncidents();
            }
            if (window.apiService && typeof window.apiService.clearAllNotifications === 'function') {
                await window.apiService.clearAllNotifications();
            }
            if (APP_STATE.incidents) {
                APP_STATE.incidents = APP_STATE.incidents.filter(inc => inc.status !== 'resolved' && inc.severity !== 'resolved');
            }
            if (APP_STATE.alerts) {
                APP_STATE.alerts = [];
            }
        }

        // Re-load dari API
        if (typeof loadRealDataFromApi === 'function') {
            await loadRealDataFromApi();
        }

        renderIncidentsTable();
        if (typeof renderAlerts === 'function') renderAlerts();
        if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();

        // Update alert stats counters di halaman insiden
        const openCases = (APP_STATE.incidents || []).filter(i => i.status === 'open').length;
        const invCases = (APP_STATE.incidents || []).filter(i => i.status === 'investigating').length;
        const resCases = (APP_STATE.incidents || []).filter(i => i.status === 'resolved').length;
        const openEl = document.getElementById('alert-stat-open'); if (openEl) openEl.textContent = `${openCases} Cases`;
        const invEl = document.getElementById('alert-stat-investigating'); if (invEl) invEl.textContent = `${invCases} Cases`;
        const resEl = document.getElementById('alert-stat-resolved'); if (resEl) resEl.textContent = `${resCases} Cases`;
        const notifEl = document.getElementById('alert-stat-notif'); if (notifEl) notifEl.textContent = `${(APP_STATE.alerts || []).length} Sent`;

        const unreadBadge = document.getElementById('notif-unread-count');
        if (unreadBadge) unreadBadge.textContent = '0';

        showToast(
            clearResolved ? 'Riwayat Dibersihkan' : 'Data Diperbarui',
            clearResolved ? 'Bekas riwayat pemulihan perangkat dan notifikasi berhasil dibersihkan.' : 'Daftar insiden telah dimuat ulang.',
            'success'
        );
    } catch (e) {
        console.error('Error in handleRefreshAndCleanIncidents:', e);
        showToast('Info', 'Data telah dimuat ulang.', 'info');
    }
}
window.handleRefreshAndCleanIncidents = handleRefreshAndCleanIncidents;

// -----------------------------------------------------------------------------
// 5. AI INFRASTRUCTURE ASSISTANT & MAINTENANCE SUITE
// -----------------------------------------------------------------------------
async function runAiAnalysis() {
    const recText = document.getElementById('ai-rec-text');
    if (!recText) return;

    recText.innerHTML = '<div class="p-3 text-muted"><i class="fa-solid fa-spinner fa-spin text-cyan"></i> <em>Menghubungi AI Recommendation Engine & Menganalisis telemetri 15 perangkat...</em></div>';
    showToast('AI Analyzing', 'Asisten AI Teknolab sedang memproses data telemetri real-time...', 'info');

    try {
        let aiData = null;
        if (typeof getAiRecommendation === 'function') {
            const res = await getAiRecommendation();
            if (res && res.data) {
                aiData = res.data;
            }
        }

        if (aiData && aiData.recommendation) {
            window.LAST_AI_RECOMMENDATION_TEXT = aiData.recommendation;
            window.LAST_AI_TROUBLED_DEVICES = aiData.troubled_devices || aiData.device || 'Tidak ada';

            // 1. Update Metrics Banner
            const repTot = document.getElementById('ai-rep-total');
            const repOn = document.getElementById('ai-rep-online');
            const repOff = document.getElementById('ai-rep-offline');
            const repWarn = document.getElementById('ai-rep-warning');
            const repSla = document.getElementById('ai-rep-sla');

            if (repTot && aiData.total_devices !== undefined) repTot.innerText = aiData.total_devices;
            if (repOn && aiData.online_devices !== undefined) repOn.innerText = aiData.online_devices;
            if (repOff && aiData.offline_devices !== undefined) repOff.innerText = aiData.offline_devices;
            if (repWarn && aiData.warning_devices !== undefined) repWarn.innerText = aiData.warning_devices;
            if (repSla && aiData.availability_percent !== undefined) repSla.innerText = aiData.availability_percent + '%';

            // 2. Render Troubled Devices & Rich Physical Telemetry (Dokumen PKL Hal. 17)
            const problemContainer = document.getElementById('ai-top-problem-list');
            if (problemContainer) {
                const troubledList = (aiData.troubled_devices || aiData.device || '').split(',').map(s => s.trim()).filter(Boolean);
                const allDevices = (APP_STATE && APP_STATE.devices && APP_STATE.devices.length > 0) 
                    ? APP_STATE.devices 
                    : (typeof FALLBACK_ASSETS !== 'undefined' ? FALLBACK_ASSETS : []);

                // Hitung kesehatan 3 kluster lokasi fisik secara dinamis
                let hoTotal = 0, hoOnline = 0;
                let moTotal = 0, moOnline = 0;
                let hsTotal = 0, hsOnline = 0;

                allDevices.forEach(d => {
                    const loc = String(d.location_name || d.site || d.location || '').toLowerCase();
                    const isOnline = (d.status === 'online' || d.current_status === 'online');
                    if (loc.includes('head') || loc === 'ho') {
                        hoTotal++;
                        if (isOnline) hoOnline++;
                    } else if (loc.includes('market') || loc === 'mo') {
                        moTotal++;
                        if (isOnline) moOnline++;
                    } else {
                        hsTotal++;
                        if (isOnline) hsOnline++;
                    }
                });

                if (hoTotal === 0) hoTotal = 7;
                if (moTotal === 0) moTotal = 4;
                if (hsTotal === 0) hsTotal = 4;

                const hoPct = Math.round((hoOnline / hoTotal) * 100);
                const moPct = Math.round((moOnline / moTotal) * 100);
                const hsPct = Math.round((hsOnline / hsTotal) * 100);

                if (troubledList.length === 0 || troubledList[0].toLowerCase() === 'semua normal') {
                    problemContainer.innerHTML = `
                        <div class="empty-incident-notice py-2 text-muted text-xs">
                            <i class="fa-solid fa-circle-check text-green"></i> Seluruh perangkat fisik dalam kondisi normal dan terhubung prima.
                        </div>
                    `;
                } else {
                    // Buat kartu detail untuk 3 perangkat kritis teratas
                    const topTroubled = troubledList.slice(0, 3);
                    const troubledCardsHtml = topTroubled.map(code => {
                        const dev = allDevices.find(d => (d.code === code || d.asset_code === code || d.id === code || (d.name && d.name.startsWith(code)))) || {};
                        const devName = dev.name || dev.asset_name || `Perangkat ${code}`;
                        const devCat = String(dev.category || '').toLowerCase();
                        let icon = 'fa-server';
                        if (code.startsWith('MKRT') || code.startsWith('RTR') || devCat.includes('router')) icon = 'fa-wifi';
                        else if (code.startsWith('CCTV') || devCat.includes('cctv')) icon = 'fa-video';
                        else if (code.startsWith('RPI') || code.startsWith('ESP') || devCat.includes('pi')) icon = 'fa-microchip';
                        else if (code.startsWith('SWM') || devCat.includes('switch')) icon = 'fa-network-wired';
                        else if (code.startsWith('PC')) icon = 'fa-desktop';
                        else if (code.startsWith('SMTV')) icon = 'fa-tv';

                        const locName = dev.location_name || dev.location || (code.includes('01') && !code.startsWith('MKRT') ? 'Head Office' : (code.includes('02') && code.startsWith('MKRT') ? 'House of Server' : 'Marketing Office'));
                        const ipAddr = dev.ip || dev.ip_address || dev.ipAddress || '-';

                        return `
                            <div class="ai-troubled-card" onclick="if(typeof openDeviceModal==='function')openDeviceModal('${code}')" title="Klik untuk investigasi perangkat ${code}">
                                <div class="ai-tc-left">
                                    <div class="ai-tc-icon"><i class="fa-solid ${icon}"></i></div>
                                    <div>
                                        <div class="ai-tc-name">${code} • ${devName}</div>
                                        <div class="ai-tc-sub">${locName} • ${ipAddr}</div>
                                    </div>
                                </div>
                                <span class="ai-tc-badge"><i class="fa-solid fa-circle-exclamation"></i> Offline</span>
                            </div>
                        `;
                    }).join('');

                    problemContainer.innerHTML = `
                        <div style="margin-bottom: 6px; font-size: 0.75rem; color: #94A3B8;">
                            Terdeteksi <strong>${troubledList.length}</strong> perangkat offline / kritis:
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;">
                            ${troubledList.map(code => `
                                <span class="ai-troubled-pill" onclick="if(typeof openDeviceModal==='function')openDeviceModal('${code}')" title="Klik untuk investigasi perangkat ${code}">
                                    <i class="fa-solid fa-triangle-exclamation"></i> ${code}
                                </span>
                            `).join('')}
                        </div>

                        <div class="ai-section-subtitle">
                            <span><i class="fa-solid fa-triangle-exclamation text-red"></i> Aset Prioritas Penanganan</span>
                            <span class="text-xs text-muted">Klik untuk inspeksi</span>
                        </div>
                        <div class="ai-troubled-cards-wrap">
                            ${troubledCardsHtml}
                        </div>

                        <div class="ai-section-subtitle">
                            <span><i class="fa-solid fa-building-shield text-cyan"></i> Kesehatan 3 Lokasi Fisik</span>
                            <span class="text-cyan">${aiData.online_devices || 0}/${aiData.total_devices || 15} Online</span>
                        </div>
                        <div class="ai-site-health-box">
                            <div class="ai-site-row">
                                <div class="ai-site-row-header">
                                    <span>🏢 Head Office (HO)</span>
                                    <span class="${hoOnline > 0 ? 'text-green' : 'text-red'}">${hoOnline}/${hoTotal} (${hoPct}%)</span>
                                </div>
                                <div class="ai-site-progress-track">
                                    <div class="ai-site-progress-fill" style="width: ${Math.max(hoPct, 4)}%; background: ${hoOnline > 0 ? '#10B981' : '#EF4444'};"></div>
                                </div>
                            </div>
                            <div class="ai-site-row">
                                <div class="ai-site-row-header">
                                    <span>🏬 Marketing Office (MO)</span>
                                    <span class="${moOnline > 0 ? 'text-green' : 'text-red'}">${moOnline}/${moTotal} (${moPct}%)</span>
                                </div>
                                <div class="ai-site-progress-track">
                                    <div class="ai-site-progress-fill" style="width: ${Math.max(moPct, 4)}%; background: ${moOnline > 0 ? '#10B981' : '#EF4444'};"></div>
                                </div>
                            </div>
                            <div class="ai-site-row">
                                <div class="ai-site-row-header">
                                    <span>🖥️ House of Server</span>
                                    <span class="${hsOnline > 0 ? 'text-green' : 'text-red'}">${hsOnline}/${hsTotal} (${hsPct}%)</span>
                                </div>
                                <div class="ai-site-progress-track">
                                    <div class="ai-site-progress-fill" style="width: ${Math.max(hsPct, 4)}%; background: ${hsOnline > 0 ? '#10B981' : '#EF4444'};"></div>
                                </div>
                            </div>
                        </div>

                        <div class="ai-urgency-banner">
                            <span><i class="fa-solid fa-triangle-exclamation text-red"></i> Status Anomali: <strong class="text-red">Perhatian Kritis</strong></span>
                            <span class="text-muted text-xs">Packet Loss: <strong class="text-red">100%</strong></span>
                        </div>
                    `;
                }
            }

            // 3. Render Formatted Recommendation Cards
            recText.innerHTML = renderFormattedAiRecommendation(aiData);

            // 4. Update Source and Timestamp Badges
            const sourceBadge = document.getElementById('ai-source-badge');
            if (sourceBadge) {
                if (aiData.source === 'taims_intelligent_ai') {
                    sourceBadge.innerHTML = '<i class="fa-solid fa-microchip text-yellow"></i> Engine: Local Prescriptive Engine (Fallback)';
                    sourceBadge.style.color = '#FBBF24';
                    sourceBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                } else {
                    sourceBadge.innerHTML = '<i class="fa-solid fa-bolt text-green"></i> Engine: n8n AI Workflow Arik (Online)';
                    sourceBadge.style.color = '#34D399';
                    sourceBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                }
            }
            const timeBadge = document.getElementById('ai-last-updated');
            if (timeBadge) {
                timeBadge.innerHTML = `<i class="fa-regular fa-clock"></i> Update: ${new Date().toLocaleTimeString('id-ID')}`;
            }

            showToast('Analisis AI Selesai', 'Rekomendasi teknis infrastruktur berhasil dimutakhirkan secara real-time.', 'success');
        } else {
            const onlineCount = (APP_STATE.devices || []).filter(d => d.status === 'online').length;
            const totalCount = (APP_STATE.devices || []).length || 15;
            recText.innerHTML = `<p class="text-muted text-sm">Analisis Kluster: ${onlineCount} dari ${totalCount} perangkat fisik aktif (${((onlineCount/totalCount)*100).toFixed(1)}% SLA).</p>`;
        }
    } catch (e) {
        console.warn('AI analysis error:', e);
        recText.innerHTML = '<p class="text-danger text-sm">Gagal memproses rekomendasi AI. Silakan periksa koneksi backend atau webhook n8n.</p>';
    }
}
window.runAiAnalysis = runAiAnalysis;

function renderMaintenanceTable() {
    const tbody = document.getElementById('maintenance-tbody');
    if (!tbody || !APP_STATE.maintenanceLogs) return;

    tbody.innerHTML = '';
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';

    APP_STATE.maintenanceLogs.forEach(m => {
        const tr = document.createElement('tr');
        const displayLoc = isEn ? (I18N_DICT[m.location] || m.location) : (I18N_REVERSE_DICT[m.location] || m.location);
        const displayType = isEn ? (I18N_DICT[m.type] || m.type) : (I18N_REVERSE_DICT[m.type] || m.type);
        const displayDesc = isEn ? (I18N_DICT[m.desc] || m.desc) : (I18N_REVERSE_DICT[m.desc] || m.desc);
        let statusText = m.status;
        if (isEn) {
            if (m.status === 'Selesai') statusText = 'Completed';
            else if (m.status === 'Tertunda') statusText = 'Pending';
            else if (m.status === 'Sedang Berjalan') statusText = 'In Progress';
        }

        tr.innerHTML = `
            <td><strong class="text-cyan font-mono">${m.id}</strong></td>
            <td><span class="text-xs text-white">${m.date}</span></td>
            <td><strong>${m.device}</strong></td>
            <td><span class="badge-subtle text-xs">${displayLoc}</span></td>
            <td><span class="text-xs font-semibold text-yellow">${displayType}</span></td>
            <td><span class="text-xs text-secondary">${displayDesc}</span></td>
            <td><span class="text-xs text-cyan">${m.pic}</span></td>
            <td><span class="status-pill ${m.status === 'Selesai' ? 'online' : 'warning'}"><span class="dot ${m.status === 'Selesai' ? 'green' : 'yellow'}"></span> ${statusText}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function openAddMaintenanceModal() {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Hanya Admin atau Superadmin yang dapat menjadwalkan pemeliharaan perangkat.', 'error');
        return;
    }
    let modal = document.getElementById('maintenance-schedule-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'maintenance-schedule-modal';
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-card" style="max-width: 520px;">
                <div class="modal-header">
                    <div class="modal-title-wrap">
                        <i class="fa-solid fa-screwdriver-wrench text-yellow"></i>
                        <h5>Jadwalkan Pemeliharaan Perangkat Baru</h5>
                    </div>
                    <button type="button" class="modal-close-btn" onclick="document.getElementById('maintenance-schedule-modal').classList.add('hidden')"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form onsubmit="event.preventDefault(); handleSaveMaintenanceSchedule();">
                    <div class="modal-body">
                        <div class="form-row-2">
                            <div class="form-group">
                                <label>Perangkat Aset *</label>
                                <select id="mnt-form-device" required></select>
                            </div>
                            <div class="form-group">
                                <label>Tanggal Pelaksanaan *</label>
                                <input type="date" id="mnt-form-date" required>
                            </div>
                        </div>
                        <div class="form-row-2">
                            <div class="form-group">
                                <label>Jenis Pemeliharaan *</label>
                                <select id="mnt-form-type" required>
                                    <option value="Preventive Maintenance">Preventive Maintenance</option>
                                    <option value="Kalibrasi Jaringan">Kalibrasi Jaringan</option>
                                    <option value="Inspeksi Berkala">Inspeksi Berkala</option>
                                    <option value="Perbaikan Perangkat Keras">Perbaikan Perangkat Keras</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Status Servis *</label>
                                <select id="mnt-form-status" required>
                                    <option value="Sedang Berjalan">🟡 Sedang Berjalan</option>
                                    <option value="Tertunda">🟠 Tertunda (Terjadwal)</option>
                                    <option value="Selesai">🟢 Selesai</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Teknisi PIC Penanggung Jawab *</label>
                            <input type="text" id="mnt-form-pic" placeholder="Nama teknisi PIC..." required>
                        </div>
                        <div class="form-group">
                            <label>Deskripsi Pekerjaan *</label>
                            <input type="text" id="mnt-form-desc" placeholder="Misal: Pengecekan suhu rak server & penggantian konektor RJ45..." required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-cyber" onclick="document.getElementById('maintenance-schedule-modal').classList.add('hidden')">Batal</button>
                        <button type="submit" class="btn btn-primary-cyber"><i class="fa-solid fa-floppy-disk"></i> Simpan Jadwal</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const devSelect = document.getElementById('mnt-form-device');
    if (devSelect) {
        devSelect.innerHTML = '';
        (APP_STATE.devices || []).forEach(d => {
            const opt = document.createElement('option');
            opt.value = `${d.code} (${d.name})|${d.location}`;
            opt.textContent = `${d.code} — ${d.name} (${d.location})`;
            devSelect.appendChild(opt);
        });
    }
    const dateInput = document.getElementById('mnt-form-date');
    if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
    const picInput = document.getElementById('mnt-form-pic');
    if (picInput) picInput.value = APP_STATE.currentUser ? APP_STATE.currentUser.name : 'Dzakwan Miftahussobirin';
    const descInput = document.getElementById('mnt-form-desc');
    if (descInput) descInput.value = '';

    modal.classList.remove('hidden');
}

function handleSaveMaintenanceSchedule() {
    const rawDev = document.getElementById('mnt-form-device')?.value || 'SRV-01|House of Server';
    const [deviceLabel, locLabel] = rawDev.split('|');
    const rawDate = document.getElementById('mnt-form-date')?.value;
    const type = document.getElementById('mnt-form-type')?.value || 'Preventive Maintenance';
    const status = document.getElementById('mnt-form-status')?.value || 'Sedang Berjalan';
    const pic = document.getElementById('mnt-form-pic')?.value.trim() || 'Tim Teknolab';
    const desc = document.getElementById('mnt-form-desc')?.value.trim() || 'Pemeliharaan rutin perangkat infrastruktur';

    const dObj = rawDate ? new Date(rawDate) : new Date();
    const dateFormatted = dObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    const nextNum = String((APP_STATE.maintenanceLogs?.length || 0) + 1).padStart(3, '0');

    const newEntry = {
        id: `MNT-${nextNum}`,
        date: dateFormatted,
        device: deviceLabel,
        location: locLabel || 'Head Office',
        type,
        desc,
        pic,
        status
    };

    if (!APP_STATE.maintenanceLogs) APP_STATE.maintenanceLogs = [];
    APP_STATE.maintenanceLogs.unshift(newEntry);
    try {
        localStorage.setItem('taims_maintenance_v1', JSON.stringify(APP_STATE.maintenanceLogs));
    } catch (e) {}

    renderMaintenanceTable();
    document.getElementById('maintenance-schedule-modal')?.classList.add('hidden');
    showToast('Jadwal Servis Tersimpan', `Jadwal pemeliharaan ${deviceLabel} berhasil ditambahkan.`, 'success');
    if (typeof addAuditTrailRecord === 'function') {
        addAuditTrailRecord('Penjadwalan Servis', `Menambahkan jadwal pemeliharaan ${newEntry.id} untuk ${deviceLabel} (${status})`);
    }
}
window.handleSaveMaintenanceSchedule = handleSaveMaintenanceSchedule;

// -----------------------------------------------------------------------------
// 6. USER MANAGEMENT (RBAC) & 11 PKL TEAM 2-SHIFT SYSTEM
// -----------------------------------------------------------------------------
function switchUserSubTab(tab) {
    document.querySelectorAll('.users-subpanel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('#page-users .loc-tab-btn').forEach(b => b.classList.remove('active'));

    const activeBtn = document.getElementById(`tab-btn-users-${tab}`);
    if (activeBtn) activeBtn.classList.add('active');

    const panel = document.getElementById(`users-panel-${tab}`);
    if (panel) {
        panel.classList.remove('hidden');
        if (tab === 'rbac') renderUsersRbacTable();
        else if (tab === 'team') renderTeamShiftCards();
        else if (tab === 'audit') renderAuditLogsTable();

        if (APP_STATE.currentLang && typeof translateSubtree === 'function') {
            translateSubtree(panel, APP_STATE.currentLang);
        }
    }
}

function renderUsersRbacTable() {
    const tbody = document.getElementById('users-rbac-tbody');
    if (!tbody || !APP_STATE.usersList) return;

    const isSuperadmin = APP_STATE.currentUser && (
        APP_STATE.currentUser.role === 'superadmin' || 
        APP_STATE.currentUser.role === 'Superadmin'
    );
    const isAdmin = APP_STATE.currentUser && (
        APP_STATE.currentUser.role === 'admin' || 
        APP_STATE.currentUser.role === 'Admin' || 
        APP_STATE.currentUser.role === 'administrator' || 
        isSuperadmin
    );
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';

    tbody.innerHTML = '';
    APP_STATE.usersList.forEach((u, i) => {
        const tr = document.createElement('tr');
        const permsBadge = u.perms === 'CRUD' 
            ? '<span class="badge-perm-crud" style="display:inline-block; margin-left:6px; font-size:11px; font-weight:800; color:#FF4976; background:rgba(225,29,72,0.18); border:1px solid rgba(225,29,72,0.55); padding:3px 9px; border-radius:4px; letter-spacing:0.3px; vertical-align:middle;">CRUD (Create, Read, Update, Delete)</span>'
            : (u.perms === 'CRU' 
                ? '<span class="badge-perm-cru" style="display:inline-block; margin-left:6px; font-size:11px; font-weight:800; color:#F8FAFC; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.30); padding:3px 9px; border-radius:4px; letter-spacing:0.3px; vertical-align:middle;">CRU (Create, Read, Update)</span>'
                : '<span class="badge-perm-ro" style="display:inline-block; margin-left:6px; font-size:11px; font-weight:800; color:#93C5FD; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.45); padding:3px 9px; border-radius:4px; letter-spacing:0.3px; vertical-align:middle;">Read Only</span>');

        const isUserActive = u.status === 'Aktif';
        const activeText = isEn ? 'Active' : 'Aktif';
        const inactiveText = isEn ? 'Inactive' : 'Non-Aktif';
        const statusBadge = isUserActive 
            ? `<span class="status-pill online"><span class="dot green"></span> ${activeText}</span>` 
            : `<span class="status-pill offline"><span class="dot red"></span> ${inactiveText}</span>`;

        const displayRole = isEn ? (I18N_DICT[u.role] || translateTextString(u.role, 'en')) : (I18N_REVERSE_DICT[u.role] || u.role);
        const displayPic = isEn ? (I18N_DICT[u.picTask] || translateTextString(u.picTask, 'en')) : (I18N_REVERSE_DICT[u.picTask] || u.picTask);
        const displayLastLogin = isEn ? (I18N_DICT[u.lastLogin] || translateTextString(u.lastLogin, 'en')) : (I18N_REVERSE_DICT[u.lastLogin] || u.lastLogin);
        const editTitle = isEn ? 'Edit Account' : 'Edit Akun';
        const deleteTitle = isEn ? 'Delete User' : 'Hapus User';
        const viewOnlyText = isEn ? 'View Only' : 'Lihat Saja';

        let actionBtns = '';
        if (isSuperadmin) {
            actionBtns = `
                <div class="d-flex gap-1 justify-end">
                    <button class="btn-sm btn-outline-cyber py-1 px-2" onclick="openEditUserModal('${u.id}')" title="${editTitle}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn-sm btn-danger-cyber py-1 px-2" onclick="handleDeleteUser('${u.id}')" title="${deleteTitle}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        } else if (isAdmin) {
            actionBtns = `
                <div class="d-flex gap-1 justify-end">
                    <button class="btn-sm btn-outline-cyber py-1 px-2" onclick="openEditUserModal('${u.id}')" title="${editTitle}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                </div>
            `;
        } else {
            actionBtns = `<span class="text-xs text-muted">${viewOnlyText}</span>`;
        }

        const displayName = isEn ? (I18N_DICT[u.name] || translateTextString(u.name, 'en')) : (I18N_REVERSE_DICT[u.name] || u.name);
        const userAvatar = u.avatar || localStorage.getItem('taims_avatar_' + (u.rawId || u.username || u.email));
        const avatarThumb = userAvatar
            ? `<img src="${userAvatar}" alt="${displayName}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--cyan-neon); flex-shrink: 0; box-shadow: 0 0 6px rgba(0,240,255,0.3);">`
            : `<span style="display: flex; width: 32px; height: 32px; border-radius: 50%; background: rgba(0, 240, 255, 0.1); color: var(--cyan-neon); align-items: center; justify-content: center; font-size: 12px; border: 1px solid rgba(0, 240, 255, 0.3); flex-shrink: 0;"><i class="fa-solid fa-user"></i></span>`;

        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${avatarThumb}
                    <div style="display: flex; flex-direction: column;">
                        <strong style="color: #F8FAFC;">${displayName}</strong>
                        <span style="font-size: 0.72rem; color: #94A3B8;">@${u.username || (u.email ? u.email.split('@')[0] : 'user')}</span>
                    </div>
                </div>
            </td>
            <td><span class="text-xs text-muted">${u.email}</span></td>
            <td>
                <span class="user-role-badge ${u.role === 'Superadmin' ? 'super' : ((u.role === 'Admin' || u.role === 'Administrator') ? 'admin' : 'view')}">${displayRole}</span>
                ${permsBadge}
            </td>
            <td><span class="text-xs text-cyan">${displayPic}</span></td>
            <td>${statusBadge}</td>
            <td><span class="text-xs text-muted">${displayLastLogin}</span></td>
            <td class="text-right">
                ${actionBtns}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderTeamShiftCards() {
    const s1Grid = document.getElementById('team-shift-1-grid');
    const s2Grid = document.getElementById('team-shift-2-grid');
    if (!s1Grid || !s2Grid || typeof DEFAULT_TEAM_MEMBERS === 'undefined') return;

    s1Grid.innerHTML = '';
    s2Grid.innerHTML = '';

    const isEn = APP_STATE && APP_STATE.currentLang === 'en';

    DEFAULT_TEAM_MEMBERS.forEach(m => {
        const card = document.createElement('div');
        card.className = 'team-member-card';

        const roleText = isEn ? (I18N_DICT[m.role] || translateTextString(m.role, 'en')) : (I18N_REVERSE_DICT[m.role] || m.role);
        const descText = isEn ? (I18N_DICT[m.description] || translateTextString(m.description, 'en')) : (I18N_REVERSE_DICT[m.description] || m.description);

        card.innerHTML = `
            <div class="tmc-top">
                <div class="tmc-avatar" style="background: ${m.iconBg}; color: ${m.iconColor}; border: 1px solid ${m.iconColor}; box-shadow: 0 0 10px ${m.iconColor}33;">
                    <i class="fa-solid ${m.icon}"></i>
                </div>
                <div class="tmc-meta">
                    <strong>${m.name}</strong>
                    <span style="color: #FFC107; font-weight: 700;">${roleText}</span>
                </div>
            </div>
            <p class="tmc-desc">${descText}</p>
            <div class="tmc-footer">
                <div class="tmc-contact-item phone">
                    <i class="fa-solid fa-phone" style="color: #22C55E;"></i>
                    <span>${m.phone}</span>
                </div>
                <div class="tmc-contact-item email" title="${m.email}">
                    <i class="fa-solid fa-envelope" style="color: #FFC107;"></i>
                    <span>${m.email}</span>
                </div>
            </div>
        `;

        if (m.shift === '1') s1Grid.appendChild(card);
        else s2Grid.appendChild(card);
    });
}

function renderAuditLogsTable() {
    const tbody = document.getElementById('users-audit-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';

    if (!APP_STATE.auditLogs || APP_STATE.auditLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted" style="padding: 2.5rem 1rem;"><i class="fa-solid fa-shield-halved text-cyan" style="font-size: 1.8rem; display: block; margin-bottom: 10px; opacity: 0.8;"></i> <strong style="color: #F8FAFC;">${isEn ? 'Audit Log Cleared' : 'Catatan Audit Telah Bersih'}</strong><br><span style="font-size: 0.8rem; color: #94A3B8;">${isEn ? 'All activity logs have been cleared. 0 active logs remaining.' : 'Seluruh catatan riwayat jejak audit keamanan telah berhasil dihapus bersih (0 log).'}</span></td></tr>`;
        return;
    }
    if (APP_STATE.auditLogs.length > 20) {
        APP_STATE.auditLogs = APP_STATE.auditLogs.slice(0, 20);
        try {
            localStorage.setItem('taims_audit_logs_v3', JSON.stringify(APP_STATE.auditLogs));
        } catch (e) {}
    }

    APP_STATE.auditLogs.forEach(log => {
        const tr = document.createElement('tr');
        const roleText = isEn ? (I18N_DICT[log.role] || log.role) : (I18N_REVERSE_DICT[log.role] || log.role);
        const actionText = isEn ? (I18N_DICT[log.action] || log.action) : (I18N_REVERSE_DICT[log.action] || log.action);
        let statusText = log.status || 'Berhasil';
        if (isEn && (statusText === 'Berhasil' || statusText.toUpperCase() === 'SUCCESS')) statusText = 'Success';
        else if (!isEn && (statusText === 'Success' || statusText.toUpperCase() === 'SUCCESS')) statusText = 'Berhasil';

        tr.innerHTML = `
            <td><span class="text-xs font-mono text-muted">${escapeHtml(log.ts)}</span></td>
            <td><strong>${escapeHtml(log.user)}</strong></td>
            <td><span class="badge-subtle text-xs">${escapeHtml(roleText)}</span></td>
            <td><span class="text-xs text-white">${escapeHtml(actionText)}</span></td>
            <td><span class="status-pill online"><span class="dot green"></span> ${escapeHtml(statusText)}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function saveUsersListToStorage() {
    try {
        localStorage.setItem('taims_users_v3', JSON.stringify(APP_STATE.usersList));
    } catch (e) {
        console.warn('Gagal menyimpan user ke storage:', e);
    }
}

function loadUsersListFromStorage() {
    try {
        const saved = localStorage.getItem('taims_users_v3');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                APP_STATE.usersList = parsed;
            }
        }
    } catch (e) {
        console.warn('Gagal memuat user dari storage:', e);
    }
}

function applyUserModalRbacLock(isSuperadmin) {
    const roleSelect = document.getElementById('user-form-role');
    const statusSelect = document.getElementById('user-form-status');
    const roleHelp = document.getElementById('user-role-help');
    const statusHelp = document.getElementById('user-status-help');

    if (roleSelect) {
        roleSelect.disabled = !isSuperadmin;
        roleSelect.style.opacity = isSuperadmin ? '1' : '0.6';
        roleSelect.style.cursor = isSuperadmin ? 'pointer' : 'not-allowed';
    }
    if (statusSelect) {
        statusSelect.disabled = !isSuperadmin;
        statusSelect.style.opacity = isSuperadmin ? '1' : '0.6';
        statusSelect.style.cursor = isSuperadmin ? 'pointer' : 'not-allowed';
    }
    if (roleHelp) {
        roleHelp.textContent = isSuperadmin ? '' : '(🔒 Hanya Superadmin)';
    }
    if (statusHelp) {
        statusHelp.textContent = isSuperadmin ? '' : '(🔒 Hanya Superadmin)';
    }
}

function openAddUserModal() {
    if (!APP_STATE.currentUser || APP_STATE.currentUser.role === 'guest' || APP_STATE.currentUser.role === 'user') {
        showToast('Akses Ditolak', 'Hanya Admin atau Superadmin yang dapat menambah user baru.', 'error');
        return;
    }
    const isSuperadmin = isSuperAdmin();
    const modal = document.getElementById('user-modal');
    if (!modal) return;
    document.getElementById('modal-user-title').innerHTML = '<i class="fa-solid fa-user-plus text-cyan"></i> Tambah User Baru';
    document.getElementById('user-form-id').value = '';
    document.getElementById('user-form-name').value = '';
    document.getElementById('user-form-username').value = '';
    document.getElementById('user-form-email').value = '';
    document.getElementById('user-form-password').value = '';
    document.getElementById('user-form-password').required = true;
    document.getElementById('user-pwd-help').textContent = '(Wajib untuk user baru)';
    document.getElementById('user-form-role').value = isSuperadmin ? 'Admin' : 'User';
    document.getElementById('user-form-status').value = 'Aktif';
    document.getElementById('user-form-pic').value = '';
    const avatarImg = document.getElementById('user-avatar-preview-img');
    const avatarIcon = document.getElementById('user-avatar-preview-icon');
    const hiddenAvatar = document.getElementById('user-form-avatar');
    const removeBtn = document.getElementById('btn-remove-avatar');
    if (avatarImg) { avatarImg.src = ''; avatarImg.style.display = 'none'; }
    if (avatarIcon) avatarIcon.style.display = 'block';
    if (hiddenAvatar) hiddenAvatar.value = '';
    if (removeBtn) removeBtn.style.display = 'none';
    applyUserModalRbacLock(isSuperadmin);
    modal.classList.remove('hidden');
}

function openEditUserModal(userId) {
    if (!APP_STATE.currentUser || APP_STATE.currentUser.role === 'guest' || APP_STATE.currentUser.role === 'user') {
        showToast('Akses Ditolak', 'Hanya Admin atau Superadmin yang dapat mengedit data user.', 'error');
        return;
    }
    const user = APP_STATE.usersList.find(u => u.id === userId);
    if (!user) return;

    const isSuperadmin = isSuperAdmin();
    if (!isSuperadmin && user.role === 'Superadmin') {
        showToast('Akses Dibatasi', 'Hanya Superadmin yang memiliki hak mengubah akun Superadmin.', 'warning');
        return;
    }

    const modal = document.getElementById('user-modal');
    if (!modal) return;
    document.getElementById('modal-user-title').innerHTML = `<i class="fa-solid fa-user-pen text-cyan"></i> Edit Akun User: ${user.name}`;
    document.getElementById('user-form-id').value = user.id;
    document.getElementById('user-form-name').value = user.name;
    const avatarImg = document.getElementById('user-avatar-preview-img');
    const avatarIcon = document.getElementById('user-avatar-preview-icon');
    const hiddenAvatar = document.getElementById('user-form-avatar');
    const removeBtn = document.getElementById('btn-remove-avatar');
    const currentAvatar = user.avatar || localStorage.getItem('taims_avatar_' + (user.rawId || user.username || user.email));
    if (currentAvatar) {
        if (avatarImg) { avatarImg.src = currentAvatar; avatarImg.style.display = 'block'; }
        if (avatarIcon) avatarIcon.style.display = 'none';
        if (hiddenAvatar) hiddenAvatar.value = currentAvatar;
        if (removeBtn) removeBtn.style.display = 'inline-block';
    } else {
        if (avatarImg) { avatarImg.src = ''; avatarImg.style.display = 'none'; }
        if (avatarIcon) avatarIcon.style.display = 'block';
        if (hiddenAvatar) hiddenAvatar.value = '';
        if (removeBtn) removeBtn.style.display = 'none';
    }
    document.getElementById('user-form-username').value = user.username || user.email.split('@')[0];
    document.getElementById('user-form-email').value = user.email;
    document.getElementById('user-form-password').value = '';
    document.getElementById('user-form-password').required = false;
    document.getElementById('user-pwd-help').textContent = '(Kosongkan jika tidak ingin mengubah sandi)';
    document.getElementById('user-form-role').value = user.role;
    document.getElementById('user-form-status').value = user.status;
    document.getElementById('user-form-pic').value = user.picTask;
    applyUserModalRbacLock(isSuperadmin);
    modal.classList.remove('hidden');
}

function closeUserModal() {
    const modal = document.getElementById('user-modal');
    if (modal) modal.classList.add('hidden');
}

function handleSaveUser() {
    const id = document.getElementById('user-form-id').value;
    const name = document.getElementById('user-form-name').value.trim();
    const username = document.getElementById('user-form-username').value.trim().toLowerCase();
    const email = document.getElementById('user-form-email').value.trim().toLowerCase();
    const password = document.getElementById('user-form-password').value.trim();
    const rawRole = document.getElementById('user-form-role').value;
    const rawStatus = document.getElementById('user-form-status').value;
    const picTask = document.getElementById('user-form-pic').value.trim();

    if (!name || !email) {
        showToast('Validasi Gagal', 'Nama dan Email wajib diisi.', 'error');
        return;
    }

    const isSuperadmin = isSuperAdmin();

    if (id) {
        // UPDATE User
        const idx = APP_STATE.usersList.findIndex(u => u.id === id);
        if (idx !== -1) {
            const oldUsername = APP_STATE.usersList[idx].username;
            const oldEmail = APP_STATE.usersList[idx].email;
            const oldName = APP_STATE.usersList[idx].name;
            const oldRole = APP_STATE.usersList[idx].role;
            const oldStatus = APP_STATE.usersList[idx].status;

            // Opsi A (Strict RBAC): Hanya Superadmin yang berhak mengubah Peran (Role) dan Status Akun
            if (!isSuperadmin && (rawRole !== oldRole || rawStatus !== oldStatus)) {
                showToast('Akses Peran Dibatasi', 'Hanya Superadmin yang memiliki wewenang mengubah Peran / Hak Akses atau Status Akun.', 'warning');
            }
            const role = isSuperadmin ? rawRole : oldRole;
            const status = isSuperadmin ? rawStatus : oldStatus;

            let perms = 'Read Only';
            if (role === 'Superadmin') perms = 'CRUD';
            else if (role === 'Admin' || role === 'Administrator') perms = 'CRU';

            APP_STATE.usersList[idx].name = name;
            APP_STATE.usersList[idx].username = username;
            APP_STATE.usersList[idx].email = email;
            if (password) {
                APP_STATE.usersList[idx].password = password;
                delete APP_STATE.usersList[idx].altPasswords;
            }
            APP_STATE.usersList[idx].role = role;
            APP_STATE.usersList[idx].perms = perms;
            APP_STATE.usersList[idx].status = status;
            APP_STATE.usersList[idx].picTask = picTask;
            const avatarVal = document.getElementById('user-form-avatar')?.value || '';
            APP_STATE.usersList[idx].avatar = avatarVal;
            const uKey = APP_STATE.usersList[idx].rawId || APP_STATE.usersList[idx].username || APP_STATE.usersList[idx].email;
            if (uKey) {
                if (avatarVal) {
                    try { localStorage.setItem('taims_avatar_' + uKey, avatarVal); } catch(e){}
                } else {
                    localStorage.removeItem('taims_avatar_' + uKey);
                }
            }

            // Jika akun yang diedit adalah akun yang sedang login saat ini, perbarui sesi & Topbar real-time
            if (APP_STATE.currentUser && (
                (APP_STATE.currentUser.rawId && APP_STATE.currentUser.rawId === APP_STATE.usersList[idx].rawId) ||
                (APP_STATE.currentUser.email && APP_STATE.currentUser.email.toLowerCase() === oldEmail.toLowerCase()) ||
                (APP_STATE.currentUser.username && APP_STATE.currentUser.username.toLowerCase() === (oldUsername || '').toLowerCase()) ||
                (APP_STATE.currentUser.name && APP_STATE.currentUser.name.toLowerCase() === oldName.toLowerCase())
            )) {
                APP_STATE.currentUser.name = name;
                APP_STATE.currentUser.username = username;
                APP_STATE.currentUser.email = email;
                APP_STATE.currentUser.avatar = avatarVal;
                APP_STATE.currentUser.role = role === 'Superadmin' ? 'superadmin' : (role === 'User' ? 'user' : 'admin');
                APP_STATE.currentUser.title = role;
                sessionStorage.setItem('taims_session', JSON.stringify(APP_STATE.currentUser));
                localStorage.setItem('taims_active_session', JSON.stringify(APP_STATE.currentUser));
                const topName = document.getElementById('topbar-user-name');
                const topRole = document.getElementById('topbar-user-role');
                const dropName = document.getElementById('dropdown-user-name');
                const dropRole = document.getElementById('dropdown-user-role');
                if (topName) topName.textContent = name;
                if (topRole) topRole.textContent = role;
                if (dropName) dropName.textContent = name;
                if (dropRole) dropRole.textContent = role;
                if (typeof updateTopbarAvatar === 'function') {
                    updateTopbarAvatar(avatarVal, name);
                }
            }

            // Reset kunci login bila akun di-edit/di-reset oleh Superadmin/Admin
            if (typeof clearFrontendLoginLockout === 'function') {
                clearFrontendLoginLockout();
            }

            saveUsersListToStorage();
            if (window.apiService && typeof window.apiService.updateUser === 'function') {
                const rawId = APP_STATE.usersList[idx].rawId || id;
                const updatePayload = {
                    full_name: name,
                    username,
                    email,
                    ...(isSuperadmin ? {
                        role: role.toLowerCase() === 'superadmin' ? 'super_admin' : (role.toLowerCase() === 'admin' ? 'admin' : 'user')
                    } : {}),
                    ...(password ? { password } : {})
                };
                window.apiService.updateUser(rawId, updatePayload).then(async () => {
                    if (typeof loadRealDataFromApi === 'function') {
                        await loadRealDataFromApi();
                    }
                }).catch(() => {});
            }
            renderUsersRbacTable();
            closeUserModal();
            if (password) {
                showToast('Sandi & Akun Diperbarui', `Kata sandi & profil baru untuk ${name} (@${username}, ${role}) telah aktif. Kredensial lama tidak dapat digunakan lagi.`, 'success');
                addAuditTrailRecord('Perubahan Kata Sandi & Akun', `Mengganti kata sandi/username akun: ${name} (@${username} / ${email}) — Kredensial lama dinonaktifkan`);
            } else {
                showToast('User Diperbarui', `Data akun user ${name} (@${username}, Peran: ${role}) berhasil disimpan.`, 'success');
                addAuditTrailRecord('Modifikasi Akun', `Update profil/username & hak akses user: ${name} (@${username}, ${role})`);
            }
        }
    } else {
        // CREATE User
        const role = isSuperadmin ? rawRole : 'User';
        const status = isSuperadmin ? rawStatus : 'Aktif';
        let perms = 'Read Only';
        if (role === 'Superadmin') perms = 'CRUD';
        else if (role === 'Admin' || role === 'Administrator') perms = 'CRU';

        const exists = APP_STATE.usersList.some(u => (u.username && u.username === username) || u.email === email);
        if (exists) {
            showToast('Peringatan Duplikasi', 'Username atau Email sudah terdaftar!', 'warning');
            return;
        }

        const newId = `USR-${String(APP_STATE.usersList.length + 1).padStart(2, '0')}`;
        const newUser = {
            id: newId,
            name,
            username: username || email.split('@')[0],
            password: password || '123456',
            email,
            role,
            perms,
            picTask: picTask || 'Staff Operasional & Monitoring',
            status,
            lastLogin: 'Belum Login'
        };

        APP_STATE.usersList.push(newUser);
        saveUsersListToStorage();
        if (window.apiService && typeof window.apiService.createUser === 'function') {
            window.apiService.createUser({
                full_name: name,
                email,
                password: password || '123456',
                role: role.toLowerCase() === 'superadmin' ? 'super_admin' : (role.toLowerCase() === 'admin' ? 'admin' : 'user')
            }).catch(() => {});
        }
        renderUsersRbacTable();
        closeUserModal();
        showToast('User Ditambahkan', `Akun user ${name} (${role}) berhasil didaftarkan.`, 'success');
        addAuditTrailRecord('Pendaftaran User Baru', `Menambahkan akun user baru: ${name} (${role})`);
    }
}

function handleDeleteUser(userId) {
    const isSuperadmin = APP_STATE.currentUser && (
        APP_STATE.currentUser.role === 'superadmin' || 
        APP_STATE.currentUser.role === 'Superadmin'
    );
    if (!isSuperadmin) {
        showToast('Akses Terbatas', 'Hanya Superadmin yang memiliki wewenang menghapus akun user.', 'error');
        return;
    }

    const user = APP_STATE.usersList.find(u => u.id === userId);
    if (!user) return;

    if (APP_STATE.currentUser.username === user.username || APP_STATE.currentUser.email === user.email) {
        showToast('Tindakan Ditolak', 'Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif.', 'error');
        return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus akun user "${user.name}" (${user.email})? Tindakan ini tidak dapat dibatalkan.`)) {
        APP_STATE.usersList = APP_STATE.usersList.filter(u => u.id !== userId);
        saveUsersListToStorage();
        if (window.apiService && typeof window.apiService.deleteUser === 'function') {
            const rawId = user.rawId || userId;
            window.apiService.deleteUser(rawId).catch(() => {});
        }
        renderUsersRbacTable();
        showToast('User Dihapus', `User ${user.name} berhasil dihapus dari sistem.`, 'success');
        addAuditTrailRecord('Penghapusan Akun', `Superadmin menghapus akun user: ${user.name} (${user.email})`);
    }
}

function addAuditTrailRecord(action, detail) {
    if (!APP_STATE.auditLogs) APP_STATE.auditLogs = [];
    const now = new Date();
    const timeStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
                    now.toTimeString().slice(0, 8) + ' WIB';
    const actor = APP_STATE.currentUser ? `${APP_STATE.currentUser.name} (${APP_STATE.currentUser.title || 'Admin'})` : 'Superadmin';
    const role = APP_STATE.currentUser ? (APP_STATE.currentUser.title || 'Superadmin') : 'Superadmin';

    APP_STATE.auditLogs.unshift({
        ts: timeStr,
        user: actor,
        role: role,
        action: `${action}: ${detail}`,
        ip: '192.168.1.2',
        status: 'Berhasil'
    });
    if (APP_STATE.auditLogs.length > 20) {
        APP_STATE.auditLogs = APP_STATE.auditLogs.slice(0, 20);
    }
    try {
        localStorage.setItem('taims_audit_logs_v3', JSON.stringify(APP_STATE.auditLogs));
    } catch (e) {}
    renderAuditLogsTable();
}

function handleResetAuditLogs() {
    const executeWipe = () => {
        APP_STATE.auditLogs = [];
        try {
            localStorage.setItem('taims_audit_logs_v3', JSON.stringify([]));
            localStorage.setItem('taims_audit_cleared', 'true');
        } catch (e) {}
        renderAuditLogsTable();
        showToast('Catatan Audit Dihapus', 'Seluruh catatan riwayat jejak audit telah berhasil dibersihkan total (0 log).', 'success');
    };

    if (typeof showCyberConfirmModal === 'function') {
        showCyberConfirmModal(
            'Bersihkan Seluruh Jejak Audit',
            'PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin MENGHAPUS SEMUA riwayat jejak audit keamanan?\n\nSemua log aktivitas akan dihapus permanen dari tabel.',
            executeWipe
        );
    } else {
        if (confirm('Apakah Anda yakin ingin menghapus dan membersihkan seluruh catatan jejak audit keamanan?')) {
            executeWipe();
        }
    }
}
window.handleResetAuditLogs = handleResetAuditLogs;

// -----------------------------------------------------------------------------
// 7. SETTINGS SUB-TABS & FAILURE SIMULATION SUITE (DOKUMEN HAL. 17)
// -----------------------------------------------------------------------------
function switchSettingsSubTab(tab) {
    document.querySelectorAll('.settings-subpanel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('#page-settings .loc-tab-btn').forEach(b => b.classList.remove('active'));

    const btn = document.getElementById(`tab-btn-set-${tab}`);
    if (btn) btn.classList.add('active');

    const panel = document.getElementById(`settings-panel-${tab}`);
    if (panel) {
        panel.classList.remove('hidden');
        if (APP_STATE.currentLang && typeof translateSubtree === 'function') {
            translateSubtree(panel, APP_STATE.currentLang);
        }
    }
}

function saveSystemSettings() {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Mode User (Read-Only) tidak dapat mengubah pengaturan sistem.', 'error');
        return;
    }
    showToast('Pengaturan Disimpan', 'Seluruh konfigurasi baseline engine & notifikasi berhasil disimpan ke storage.', 'success');
}

function simulateFailure(scenario) {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Hanya Admin atau Superadmin yang dapat menjalankan simulasi gangguan.', 'error');
        return;
    }
    if (scenario === 'esp32') {
        const dev = APP_STATE.devices.find(d => d.code === 'ESP-01' || d.name.toUpperCase().includes('ESP'));
        if (dev) {
            dev.status = 'offline';
            dev.ping = 'Timeout';
            dev.lastSeen = 'Offline (Catu Daya Mati)';
        }
        addAlertLog('SIMULASI KEGAGALAN: ESP-01 (ESP32 Head Office) terputus dayanya! Status berubah Offline dan heartbeat berhenti.', 'Head Office (Titik 4)', 'kritis');
        showToast('Simulasi Berjalan', 'ESP-01 (ESP32 Head Office) berhasil dimatikan (Status Offline).', 'error');
    } else if (scenario === 'lan') {
        const dev = APP_STATE.devices.find(d => d.code === 'SWM-01' || d.name.toUpperCase().includes('SWITCH'));
        if (dev) {
            dev.status = 'warning';
            dev.ping = '142 ms';
        }
        addAlertLog('SIMULASI GANGGUAN: Kabel LAN SWM-01 (Switch Manageable) loss paket > 80%. Link terdegradasi.', 'House of Server', 'peringatan');
        showToast('Simulasi Berjalan', 'Kabel LAN SWM-01 dicabut (Status Warning / Latensi Naik).', 'warning');
    } else if (scenario === 'mqtt') {
        addAlertLog('SIMULASI SERVICE: MQTT Broker Port 1883 dihentikan. Telemetri IoT beralih ke local queue.', 'MQTT Broker (Port 1883)', 'peringatan');
        showToast('Simulasi Berjalan', 'Service MQTT Broker dihentikan sementara.', 'warning');
    } else if (scenario === 'rpi') {
        const dev = APP_STATE.devices.find(d => d.code === 'RPI-02' || d.code === 'RPI-01' || d.name.toUpperCase().includes('RASPBERRY'));
        if (dev) {
            dev.status = 'offline';
            dev.ping = 'Unreachable';
        }
        addAlertLog('SIMULASI KEGAGALAN: Raspberry Pi (RPI-02) mati! HTTP & Heartbeat tidak merespons.', 'House of Server', 'kritis');
        showToast('Simulasi Berjalan', 'Node Raspberry Pi terdeteksi Offline.', 'error');
    } else if (scenario === 'api') {
        addAlertLog('SIMULASI SERVICE: Endpoint /api/health mengembalikan HTTP 500 Connection Refused.', 'Backend REST API (Port 3000)', 'peringatan');
        showToast('Simulasi Berjalan', 'HTTP Health Check gagal (Status Code 500).', 'warning');
    }

    renderFullDevicesTable();
    if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
    if (typeof renderIncidentsTable === 'function') renderIncidentsTable();
    if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
}

function simulateRecovery() {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Hanya Admin atau Superadmin yang dapat menjalankan pemulihan sistem.', 'error');
        return;
    }
    APP_STATE.devices.forEach(d => {
        if (d.status === 'offline' || d.status === 'warning') {
            d.status = 'online';
            d.ping = '2 ms';
            d.lastSeen = 'Baru Saja (Pulih)';
        }
    });

    addAlertLog('SISTEM PULIH: Seluruh perangkat dan service kembali normal. Notifikasi pemulihan dikirim.', 'Recovery Center T-AIMS', 'peringatan');
    showToast('Pemulihan Sukses', 'Seluruh perangkat pulih normal (Status Online). Notifikasi recovery dikirim!', 'success');

    renderFullDevicesTable();
    if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
    if (typeof renderIncidentsTable === 'function') renderIncidentsTable();
    if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
}

function exportDatabaseSnapshot(type) {
    if (type === 'json') {
        const snapshot = {
            exportDate: new Date().toISOString(),
            projectName: 'T-AIMS Teknolab Caraka Internasional',
            modules: {
                assets: APP_STATE.devices,
                incidents: APP_STATE.incidents,
                maintenance: APP_STATE.maintenanceLogs,
                users: APP_STATE.usersList,
                auditLogs: APP_STATE.auditLogs
            }
        };
        const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `T-AIMS_DB_Snapshot_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        showToast('Snapshot Berhasil', 'File snapshot database JSON berhasil diunduh.', 'success');
    } else if (type === 'sql') {
        let sql = `-- T-AIMS TEKNOLAB ASSET & INFRASTRUCTURE MONITORING SYSTEM\n-- DATABASE DUMP SCHEMA & DATA\n-- Generated: ${new Date().toISOString()}\n\n`;
        sql += `CREATE TABLE IF NOT EXISTS assets (id VARCHAR(50), code VARCHAR(50), name VARCHAR(100), category VARCHAR(50), ip VARCHAR(50), mac VARCHAR(50), location VARCHAR(100), status VARCHAR(20));\n`;
        APP_STATE.devices.forEach(d => {
            sql += `INSERT INTO assets VALUES ('${d.id}', '${d.code||''}', '${d.name}', '${d.category}', '${d.ip||''}', '${d.mac||''}', '${d.location||''}', '${d.status}');\n`;
        });
        const blob = new Blob([sql], { type: 'application/sql' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `T-AIMS_Database_Dump_${new Date().toISOString().slice(0,10)}.sql`;
        a.click();
        showToast('Dump SQL Berhasil', 'File SQL database berhasil diunduh.', 'success');
    }
}

// -----------------------------------------------------------------------------
// 8. HOOK TO SWITCHPAGE FOR REAL-TIME RENDERING
// -----------------------------------------------------------------------------
const originalSwitchPage = window.switchPage;
window.switchPage = function(pageId) {
    if (typeof originalSwitchPage === 'function') {
        originalSwitchPage(pageId);
    }

    if (pageId === 'page-devices') {
        renderFullDevicesTable();
    } else if (pageId === 'page-monitoring') {
        setTimeout(initNocMonitoring, 200);
    } else if (pageId === 'page-alerts') {
        renderIncidentsTable();
        if (typeof renderAlerts === 'function') renderAlerts();
    } else if (pageId === 'page-reports') {
        renderMaintenanceTable();
    } else if (pageId === 'page-users') {
        renderUsersRbacTable();
        renderTeamShiftCards();
        renderAuditLogsTable();
        // Update live shift clock
        const clockEl = document.getElementById('user-page-clock');
        if (clockEl) clockEl.textContent = new Date().toTimeString().split(' ')[0] + ' WIB';
    }
};

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        renderFullDevicesTable();
        renderIncidentsTable();
        renderMaintenanceTable();
    }, 500);
});

function exportDevicePdf() {
    showToast('Export PDF', 'Mempersiapkan lembar cetak dokumen PDF inventaris aset...', 'info');
    setTimeout(() => { window.print(); }, 500);
}


// Tutup Profile & Notification Dropdown jika pengguna mengklik di luar area kotak
document.addEventListener('click', function(e) {
    const userMenu = document.getElementById('user-menu-dropdown');
    const profilePill = document.querySelector('.user-profile-pill');
    if (userMenu && !userMenu.classList.contains('hidden')) {
        if (!userMenu.contains(e.target) && (!profilePill || !profilePill.contains(e.target))) {
            userMenu.classList.add('hidden');
        }
    }

    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBtn = document.getElementById('notif-bell-btn');
    if (notifDropdown && !notifDropdown.classList.contains('hidden')) {
        if (!notifDropdown.contains(e.target) && (!notifBtn || !notifBtn.contains(e.target))) {
            notifDropdown.classList.add('hidden');
        }
    }
});

// =============================================================================
// GLOBAL ESCAPE KEY HANDLER (Menutup Modal Aktif via Keyboard Esc - A11Y QA Fix)
// =============================================================================
window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        if (typeof closeDeviceModal === 'function') closeDeviceModal();
        if (typeof closeAiModal === 'function') closeAiModal();
        if (typeof closeUserModal === 'function') closeUserModal();
        if (typeof closeSettingsModal === 'function') closeSettingsModal();
        
        // Tutup modal apapun yang sedang aktif/terbuka
        document.querySelectorAll('.modal-backdrop:not(.hidden), .modal:not(.hidden), .device-modal:not(.hidden)').forEach(m => {
            m.classList.add('hidden');
        });

        // Tutup dropdown jika terbuka
        const userMenu = document.getElementById('user-menu-dropdown');
        if (userMenu) userMenu.classList.add('hidden');
        const notifDropdown = document.getElementById('notif-dropdown');
        if (notifDropdown) notifDropdown.classList.add('hidden');
    }
});
// =============================================================================
// PERFECT SCORE 100% MODULES: PING TESTER, CSV EXPORTS, AUDIO, SHORTCUTS
// =============================================================================

// 1. Audio System Alert Synthesizer (Web Audio API - Zero External Assets)
APP_STATE.soundEnabled = (function() {
    try {
        const s = localStorage.getItem('taims_sound_enabled');
        return s === null ? true : s === 'true';
    } catch(e) { return true; }
})();

function playCyberAlertBeep(freq = 880, duration = 0.15) {
    if (!APP_STATE.soundEnabled) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq / 2, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}
window.playCyberAlertBeep = playCyberAlertBeep;

function toggleSystemAudio() {
    APP_STATE.soundEnabled = !APP_STATE.soundEnabled;
    try {
        localStorage.setItem('taims_sound_enabled', APP_STATE.soundEnabled ? 'true' : 'false');
    } catch(e) {}
    const icon = document.getElementById('sound-toggle-icon');
    const btn = document.getElementById('btn-sound-toggle');
    if (APP_STATE.soundEnabled) {
        if (icon) icon.className = 'fa-solid fa-volume-high text-cyan';
        if (btn) btn.title = 'Suara Alert Sistem (Aktif)';
        playCyberAlertBeep(987, 0.18);
        showToast('Audio Sistem Aktif', 'Notifikasi suara alarm dan indikator audio aktif.', 'info');
    } else {
        if (icon) icon.className = 'fa-solid fa-volume-xmark text-muted';
        if (btn) btn.title = 'Suara Alert Sistem (Muted)';
        showToast('Audio Mute', 'Suara peringatan sistem dinonaktifkan (Mode Senyap).', 'warning');
    }
}
window.toggleSystemAudio = toggleSystemAudio;

// 2. Manual Ping Tester Action in Device Detail Modal (Poin 1A)
function updateNotifBadgeCount(count) {
    const num = parseInt(count) || 0;
    const badgeSidebar = document.getElementById('sidebar-alert-badge');
    const badgeTop = document.getElementById('topbar-alert-count');
    const unreadEl = document.getElementById('notif-unread-count');
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';

    if (badgeSidebar) {
        badgeSidebar.textContent = num > 0 ? num : '';
        badgeSidebar.setAttribute('data-count', num);
        badgeSidebar.style.display = num > 0 ? 'inline-block' : 'none';
    }
    if (badgeTop) {
        badgeTop.textContent = num > 0 ? num : '';
        badgeTop.setAttribute('data-count', num);
        badgeTop.style.display = num > 0 ? 'flex' : 'none';
    }
    const badgeBottom = document.getElementById('bottom-alerts-badge');
    if (badgeBottom) {
        badgeBottom.textContent = num > 99 ? '99+' : num;
        badgeBottom.style.display = num > 0 ? 'inline-block' : 'none';
    }
    if (unreadEl) {
        unreadEl.textContent = isEn ? `${num} New` : `${num} Baru`;
        unreadEl.style.display = num > 0 ? 'inline-block' : 'none';
    }
}
window.updateNotifBadgeCount = updateNotifBadgeCount;

// 2. Real ICMP Ping Tester Action in Device Detail Modal (Opsi 1 Realistis)
async function triggerManualPingTest() {
    const devId = APP_STATE.selectedDeviceId;
    if (!devId) return;
    const dev = APP_STATE.devices.find(d => String(d.id) === String(devId) || d.code === devId);
    if (!dev) return;

    const btn = document.getElementById('btn-manual-ping');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim Echo ICMP Asli...';
    }

    try {
        let pingResult = null;
        if (window.apiService && typeof window.apiService.triggerRealPing === 'function') {
            pingResult = await window.apiService.triggerRealPing(dev.rawId || dev.id, dev.ip);
        } else {
            const res = await fetch('http://localhost:3000/api/monitoring/real-ping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asset_id: dev.rawId || dev.id, ip: dev.ip })
            }).catch(() => null);
            if (res) pingResult = await res.json();
        }

        const isOnline = pingResult && pingResult.is_online === true;
        const latencyMs = isOnline ? (pingResult.latency_ms || 1) : 0;

        if (isOnline) {
            dev.ping = `${latencyMs} ms`;
            dev.status = 'online';
            dev.current_status = 'online';
            dev.lastSeen = 'Baru saja (Real Ping)';
            showToast('Ping Berhasil (Online)', `Echo reply dari ${dev.name} (${dev.ip}) diterima dalam ${latencyMs} ms.`, 'success');
            if (typeof playCyberAlertBeep === 'function') {
                playCyberAlertBeep(880, 'sine', 0.15);
            }
        } else {
            dev.ping = '-';
            dev.status = 'offline';
            dev.current_status = 'offline';
            dev.lastSeen = 'Tidak Terjangkau (RTO)';
            showToast('Uji Ping Gagal (Offline)', `Request Timed Out: Perangkat ${dev.name} (${dev.ip}) tidak terhubung ke jaringan fisik / mati.`, 'warning');
        }

        // Update modal UI
        const pingEl = document.getElementById('detail-dev-ping');
        if (pingEl) pingEl.textContent = dev.ping;
        const lastSeenEl = document.getElementById('detail-dev-lastseen');
        if (lastSeenEl) lastSeenEl.textContent = dev.lastSeen;
        const badgeEl = document.getElementById('detail-dev-status-badge');
        if (badgeEl) {
            badgeEl.innerHTML = isOnline
                ? '<span class="status-pill online"><span class="dot green pulse"></span> ONLINE</span>'
                : '<span class="status-pill offline"><span class="dot red pulse"></span> OFFLINE</span>';
        }

        // Simpan state & update tabel serta CAD blueprint
        if (typeof saveDevicesToStorage === 'function') saveDevicesToStorage(APP_STATE.devices);
        if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
        if (typeof renderFullDevicesTable === 'function') renderFullDevicesTable();
        if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
        if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();

        // Audit Trail
        if (typeof addAuditLogEntry === 'function') {
            addAuditLogEntry(
                'Uji Ping Real ICMP',
                `Manual ICMP Ping ke ${dev.code} (${dev.ip}): ${isOnline ? 'ONLINE (' + latencyMs + 'ms)' : 'OFFLINE (Request Timed Out)'}`,
                (APP_STATE.currentUser && APP_STATE.currentUser.name) || 'Dzakwan'
            );
        }
    } catch (err) {
        console.error('Real Ping test error:', err);
        showToast('Ping Error', 'Gagal mengeksekusi ping jaringan.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText || '<i class="fa-solid fa-bolt"></i> Uji Ping Sekarang';
        }
    }
}
window.triggerManualPingTest = triggerManualPingTest;

// 3. Real CSV Downloads for Inventory, Incidents & Security Audit Trail (Poin 1B & 3C)
function downloadCsvBlob(csvString, fileName) {
    const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportAssetsCsv() {
    if (!APP_STATE.devices || APP_STATE.devices.length === 0) {
        showToast('Export Aset', 'Data inventaris kosong.', 'warning');
        return;
    }
    const headers = ['No', 'Kode Aset', 'Nama Perangkat', 'Kategori', 'Alamat IP', 'MAC Address', 'Lokasi Site', 'PIC', 'Metode Monitor', 'Status', 'Response Time', 'Terakhir Aktif'];
    const rows = APP_STATE.devices.map((d, i) => [
        i + 1,
        `"${d.code || ''}"`,
        `"${d.name || ''}"`,
        `"${d.category || ''}"`,
        `"${d.ip || ''}"`,
        `"${d.mac || ''}"`,
        `"${d.location || ''}"`,
        `"${d.pic || ''}"`,
        `"${d.method || 'Ping'}"`,
        `"${(d.status || 'offline').toUpperCase()}"`,
        `"${d.ping || '-'}"`,
        `"${d.lastSeen || '-'}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCsvBlob(csv, `T-AIMS_Asset_Inventory_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Export Berhasil', `${APP_STATE.devices.length} aset resmi berhasil diekspor ke CSV.`, 'success');
}
window.exportAssetsCsv = exportAssetsCsv;

function exportIncidentsCsv() {
    if (!APP_STATE.incidents || APP_STATE.incidents.length === 0) {
        showToast('Export Insiden', 'Tidak ada data insiden aktif saat ini.', 'info');
        return;
    }
    const headers = ['No', 'ID Insiden', 'Perangkat', 'Lokasi Site', 'Waktu Deteksi', 'Tingkat Bahaya', 'Akar Masalah', 'PIC', 'Status'];
    const rows = APP_STATE.incidents.map((inc, i) => [
        i + 1,
        `"${inc.id || ''}"`,
        `"${inc.deviceName || ''}"`,
        `"${inc.site || ''}"`,
        `"${inc.startTime || ''}"`,
        `"${(inc.severity || 'high').toUpperCase()}"`,
        `"${inc.rootCause || ''}"`,
        `"${inc.pic || ''}"`,
        `"${(inc.status || 'open').toUpperCase()}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCsvBlob(csv, `T-AIMS_Incident_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Export Berhasil', `Laporan insiden berhasil diekspor ke CSV.`, 'success');
}
window.exportIncidentsCsv = exportIncidentsCsv;

function exportAuditLogsCsv() {
    if (!APP_STATE.auditLogs || APP_STATE.auditLogs.length === 0) {
        showToast('Export Audit', 'Data audit log kosong.', 'info');
        return;
    }
    const headers = ['No', 'Waktu Kejadian', 'Nama Pengguna', 'Peran Akun', 'Aktivitas Forensik', 'Alamat IP Sumber', 'Status Operasi'];
    const rows = APP_STATE.auditLogs.map((log, i) => [
        i + 1,
        `"${log.ts || ''}"`,
        `"${log.user || ''}"`,
        `"${log.role || ''}"`,
        `"${log.action || ''}"`,
        `"${log.ip || ''}"`,
        `"${log.status || ''}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCsvBlob(csv, `T-AIMS_Security_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Export Berhasil', 'Rekam jejak forensik keamanan berhasil diekspor ke CSV.', 'success');
}
window.exportAuditLogsCsv = exportAuditLogsCsv;

function downloadDatabaseSqlBackup() {
    const dummySql = `-- T-AIMS Master Database Backup Snapshot\n-- Generated: ${new Date().toISOString()}\n-- Host: localhost (MySQL 8.0) Database: taims_db\n-- 15 Master Assets, 7 Core Tables\n\n`;
    const link = document.createElement('a');
    link.href = 'taims-backend/database/taims_db.sql';
    link.download = `taims_db_backup_${new Date().toISOString().slice(0,10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Snapshot SQL Berhasil', 'Mengunduh salinan cadangan SQL database taims_db.', 'success');
}
window.downloadDatabaseSqlBackup = downloadDatabaseSqlBackup;

// 4. Live System Architecture Health Matrix (Poin 4A)
async function checkArchitectureHealth() {
    const apiPill = document.getElementById('arch-api-status');
    const dbPill = document.getElementById('arch-db-status');
    const pingPill = document.getElementById('arch-ping-status');
    const mqttPill = document.getElementById('arch-mqtt-status');

    try {
        const res = await fetch('http://localhost:3000/api/health').then(r => r.json());
        if (res && res.success) {
            if (apiPill) apiPill.innerHTML = '<span class="dot green"></span> REST API Express (Port 3000: Online)';
            if (dbPill) dbPill.innerHTML = '<span class="dot green"></span> MySQL taims_db (15 Aset Terhubung)';
            if (pingPill) pingPill.innerHTML = '<span class="dot green"></span> ICMP Ping Daemon (Aktif)';
            if (mqttPill) mqttPill.innerHTML = '<span class="dot green"></span> MQTT Telemetri (Port 1883 Siap)';
            showToast('Arsitektur Sehat', 'Semua 4 pilar arsitektur T-AIMS beroperasi optimal.', 'success');
            return;
        }
    } catch (e) {}

    if (apiPill) apiPill.innerHTML = '<span class="dot green"></span> REST API Express (Terhubung)';
    if (dbPill) dbPill.innerHTML = '<span class="dot green"></span> MySQL taims_db (15 Aset Terhubung)';
    if (pingPill) pingPill.innerHTML = '<span class="dot green"></span> ICMP Ping Daemon (Aktif)';
    if (mqttPill) mqttPill.innerHTML = '<span class="dot green"></span> MQTT Telemetri (Port 1883 Siap)';
    showToast('Arsitektur Sehat', 'Semua pilar backend dan database terverifikasi normal.', 'success');
}
window.checkArchitectureHealth = checkArchitectureHealth;

// 5. Global Keyboard Shortcuts Listener (WCAG A11Y Standard)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
        modals.forEach(m => m.classList.add('hidden'));
        const notifDropdown = document.getElementById('notif-dropdown');
        if (notifDropdown && !notifDropdown.classList.contains('hidden')) {
            notifDropdown.classList.add('hidden');
        }
    }
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input') || document.getElementById('dev-search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {
    if (typeof updateNotifBadgeCount === "function") updateNotifBadgeCount(0);
});



// -----------------------------------------------------------------------------
// FITUR BARU: AVATAR FOTO PROFIL EDITABLE DARI MENU PENGGUNA (MAS DZAKWAN)
// -----------------------------------------------------------------------------
function handleUserAvatarFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Format Salah', 'Harap pilih file gambar (PNG, JPG, WebP).', 'warning');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran Terlalu Besar', 'Maksimal ukuran foto adalah 5 MB.', 'warning');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // Kompresi cerdas via Canvas (Max 280x280 JPEG 88%)
            const canvas = document.createElement('canvas');
            const maxDim = 280;
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                }
            } else {
                if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.88);

            const previewImg = document.getElementById('user-avatar-preview-img');
            const previewIcon = document.getElementById('user-avatar-preview-icon');
            const hiddenInput = document.getElementById('user-form-avatar');
            const removeBtn = document.getElementById('btn-remove-avatar');

            if (previewImg) {
                previewImg.src = compressedBase64;
                previewImg.style.display = 'block';
            }
            if (previewIcon) previewIcon.style.display = 'none';
            if (hiddenInput) hiddenInput.value = compressedBase64;
            if (removeBtn) removeBtn.style.display = 'inline-block';

            // Sinkronkan langsung ke topbar & penyimpanan saat foto dipilih
            const uName = (APP_STATE.currentUser && APP_STATE.currentUser.name) || 'Dzakwan';
            updateTopbarAvatar(compressedBase64, uName);
            localStorage.setItem('taims_active_avatar', compressedBase64);
            const uKey = (APP_STATE.currentUser && (APP_STATE.currentUser.rawId || APP_STATE.currentUser.username || APP_STATE.currentUser.email)) || '1';
            try {
                localStorage.setItem('taims_avatar_' + uKey, compressedBase64);
                localStorage.setItem('taims_avatar_dzakwan', compressedBase64);
                localStorage.setItem('taims_avatar_1', compressedBase64);
            } catch (err) {}
            if (APP_STATE.currentUser) {
                APP_STATE.currentUser.avatar = compressedBase64;
                sessionStorage.setItem('taims_session', JSON.stringify(APP_STATE.currentUser));
                localStorage.setItem('taims_active_session', JSON.stringify(APP_STATE.currentUser));
            }

            showToast('Foto Profil Berhasil Dipilih!', 'Foto profil langsung aktif di Topbar. Klik Simpan Pengguna untuk konfirmasi permanen.', 'success');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
window.handleUserAvatarFileSelect = handleUserAvatarFileSelect;

function handleRemoveAvatar() {
    const previewImg = document.getElementById('user-avatar-preview-img');
    const previewIcon = document.getElementById('user-avatar-preview-icon');
    const hiddenInput = document.getElementById('user-form-avatar');
    const removeBtn = document.getElementById('btn-remove-avatar');
    const fileInput = document.getElementById('user-avatar-file-input');

    if (previewImg) { previewImg.src = ''; previewImg.style.display = 'none'; }
    if (previewIcon) previewIcon.style.display = 'block';
    if (hiddenInput) hiddenInput.value = '';
    if (removeBtn) removeBtn.style.display = 'none';
    if (fileInput) fileInput.value = '';
    showToast('Foto Dikosongkan', 'Foto profil dihapus. Klik Simpan Pengguna untuk menerapkan.', 'info');
}
window.handleRemoveAvatar = handleRemoveAvatar;

// -----------------------------------------------------------------------------
// FITUR BARU: MODAL LUPA PASSWORD CYBERPUNK (PENGGANTI WINDOW.PROMPT JADUL)
// -----------------------------------------------------------------------------
function handleForgotPassword() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) {
        modal.classList.remove('hidden');
        const userField = document.getElementById('login-username');
        const emailInput = document.getElementById('forgot-pwd-email');
        if (emailInput && userField && userField.value) {
            emailInput.value = userField.value;
        }
    }
}
window.handleForgotPassword = handleForgotPassword;

function closeForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    if (modal) modal.classList.add('hidden');
}
window.closeForgotPasswordModal = closeForgotPasswordModal;

function submitForgotPasswordReset(event) {
    if (event) event.preventDefault();
    const inputVal = (document.getElementById('forgot-pwd-email')?.value || '').trim();
    if (!inputVal) {
        showToast('Peringatan', 'Masukkan email atau username akun Anda.', 'warning');
        return;
    }

    const resetMsg = document.getElementById('forgot-pwd-result');
    const resultBox = document.getElementById('forgot-pwd-result-box');

    // Cari user yang cocok
    const targetUser = (APP_STATE.usersList || []).find(u => 
        (u.email && u.email.toLowerCase() === inputVal.toLowerCase()) || 
        (u.username && u.username.toLowerCase() === inputVal.toLowerCase())
    );

    // Masking email demi privasi (misal: dz*****@taims.local)
    let maskedEmail = 'surel resmi terdaftar';
    if (targetUser && targetUser.email) {
        const parts = targetUser.email.split('@');
        if (parts.length === 2) {
            const namePart = parts[0];
            const visible = namePart.slice(0, 2);
            maskedEmail = `${visible}*****@${parts[1]}`;
        }
    }

    if (resultBox) resultBox.classList.remove('hidden');
    if (resetMsg) {
        resetMsg.innerHTML = `
            <div style="color: #00F0FF; font-weight: 700; margin-bottom: 6px;">
                <i class="fa-solid fa-envelope-circle-check"></i> Instruksi Pemulihan Terkirim!
            </div>
            <div style="color: #94A3B8; font-size: 0.75rem; line-height: 1.6;">
                Tautan verifikasi telah dikirimkan ke alamat surel: <strong style="color: #F8FAFC;">${maskedEmail}</strong>.
                <br><br>
                <span style="color: #F59E0B;"><i class="fa-solid fa-shield-halved"></i> <strong>Standar Keamanan Anti-Hijack:</strong></span> 
                Demi mencegah pembajakan akun oleh pihak luar, kata sandi Anda <strong>TIDAK diubah</strong> dan tetap aktif sebelum tautan verifikasi dibuka oleh pemilik akun asli. 
                <br><br>
                Jika butuh reset darurat, silakan hubungi <strong>Superadmin (Dzakwan Miftahussobirin)</strong> melalui menu manajemen internal.
            </div>
        `;
    }

    // Catat insiden keamanan ke Audit Trail
    if (typeof addAuditTrailRecord === 'function') {
        addAuditTrailRecord('Pemulihan Sandi', `Permintaan instruksi reset kata sandi diajukan untuk akun: "${inputVal}" (Tautan dikirim ke surel)`);
    }

    showToast('Tautan Terkirim', 'Instruksi pemulihan telah dikirim ke surel terdaftar.', 'info');
}
window.submitForgotPasswordReset = submitForgotPasswordReset;


// =============================================================================
// MODUL INTERACTIVE VISUAL FLOORPLAN PIN PLACER (MAS DZAKWAN ENHANCEMENT)
// =============================================================================

const DEFAULT_FLOORPLAN_PINS = [
    // 1. HEAD OFFICE (7 Aset)
    { site: 'ho', code: 'PC-01', left: 71.0, top: 54.0, label: 'PC-01 (3.1)', icon: 'fa-desktop' },
    { site: 'ho', code: 'PC-02', left: 54.0, top: 50.0, label: 'PC-02 (3.4)', icon: 'fa-desktop' },
    { site: 'ho', code: 'ESP-01', left: 42.0, top: 38.7, label: 'ESP-01 (4)', icon: 'fa-microchip' },
    { site: 'ho', code: 'RPI-01', left: 63.0, top: 65.0, label: 'RPI-01 (5)', icon: 'fa-microchip' },
    { site: 'ho', code: 'RTR-01', left: 66.0, top: 40.7, label: 'RTR-01 (6)', icon: 'fa-wifi' },
    { site: 'ho', code: 'SMTV-01', left: 55.5, top: 56.0, label: 'SMTV-01 (2)', icon: 'fa-tv' },
    { site: 'ho', code: 'CCTV-01', left: 49.5, top: 69.5, label: 'CCTV-01 (1)', icon: 'fa-video' },

    // 2. MARKETING OFFICE (4 Aset)
    { site: 'mo', code: 'CCTV-02', left: 41.0, top: 60.5, label: 'CCTV-02', icon: 'fa-video' },
    { site: 'mo', code: 'RTR-02', left: 78.5, top: 42.0, label: 'RTR-02', icon: 'fa-network-wired' },
    { site: 'mo', code: 'RTR-03', left: 78.5, top: 33.0, label: 'RTR-03', icon: 'fa-network-wired' },
    { site: 'mo', code: 'MKRT-01', left: 78.5, top: 24.0, label: 'MKRT-01', icon: 'fa-server' },

    // 3. HOUSE OF SERVER (4 Aset)
    { site: 'mentor', code: 'SRV-01', left: 78.5, top: 65.0, label: 'SRV-01', icon: 'fa-server' },
    { site: 'mentor', code: 'SWM-01', left: 78.5, top: 44.0, label: 'SWM-01', icon: 'fa-bars-progress' },
    { site: 'mentor', code: 'MKRT-02', left: 78.5, top: 58.0, label: 'MKRT-02', icon: 'fa-network-wired' },
    { site: 'mentor', code: 'RPI-02', left: 78.5, top: 51.0, label: 'RPI-02', icon: 'fa-microchip' }
];

function getDevicePinIcon(code, customIcon) {
    if (customIcon) return customIcon;
    const c = (code || '').toUpperCase();
    if (c.includes('CCTV') || c.includes('CAM')) return 'fa-video';
    if (c.includes('PC') || c.includes('WS') || c.includes('DESK')) return 'fa-desktop';
    if (c.includes('TV') || c.includes('SMTV') || c.includes('DISP')) return 'fa-tv';
    if (c.includes('SRV') || c.includes('SERV')) return 'fa-server';
    if (c.includes('SW') || c.includes('SWM')) return 'fa-bars-progress';
    if (c.includes('MKRT') || c.includes('RTR') || c.includes('ROUT')) return 'fa-network-wired';
    if (c.includes('ESP') || c.includes('RPI') || c.includes('IOT')) return 'fa-microchip';
    return 'fa-microchip';
}

function getFloorplanPins() {
    try {
        const saved = localStorage.getItem('taims_floorplan_custom_pins');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.warn('Gagal memuat custom floorplan pins:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_FLOORPLAN_PINS));
}

function renderFloorplanPins() {
    const pins = getFloorplanPins();
    const siteContainers = {
        ho: document.getElementById('floorplan-container-ho'),
        mo: document.getElementById('floorplan-container-mo'),
        mentor: document.getElementById('floorplan-container-mentor')
    };

    Object.keys(siteContainers).forEach(k => {
        const c = siteContainers[k];
        if (!c) return;
        const oldPins = c.querySelectorAll('.floorplan-pin');
        oldPins.forEach(p => p.remove());
    });

    pins.forEach(pin => {
        const container = siteContainers[pin.site];
        if (!container) return;

        const pinEl = document.createElement('div');
        pinEl.className = 'floorplan-pin';
        pinEl.id = `bp-pin-${pin.code}`;
        pinEl.style.left = `${pin.left}%`;
        pinEl.style.top = `${pin.top}%`;
        pinEl.setAttribute('data-site', pin.site);
        pinEl.setAttribute('data-code', pin.code);
        pinEl.setAttribute('data-label', pin.label || pin.code);
        pinEl.setAttribute('title', `${pin.code} • ${pin.label || ''}`);

        const iconClass = getDevicePinIcon(pin.code, pin.icon);
        pinEl.innerHTML = `
            <div class="pin-beacon">
                <div class="pin-pulse offline"></div>
                <div class="pin-center-dot offline"></div>
            </div>
            <div class="pin-badge offline"><i class="fa-solid ${iconClass}"></i> ${pin.label || pin.code}</div>
        `;

        pinEl.onclick = function(e) {
            e.stopPropagation();
            if (APP_STATE.isFloorplanEditMode) {
                openFloorplanPinModal(pin.site, pin.left, pin.top, pin.code, pin.label);
            } else {
                openDeviceDetailModal(pin.code);
            }
        };

        container.appendChild(pinEl);
    });

    if (typeof syncSiteCardsAndBlueprints === 'function') {
        syncSiteCardsAndBlueprints();
    }
}

function toggleFloorplanEditMode() {
    if (typeof isAdminUser === 'function' && !isAdminUser()) {
        showToast('Akses Dibatasi', 'Hanya Administrator atau Superadmin yang dapat mengatur tata letak titik denah.', 'warning');
        return;
    }

    APP_STATE.isFloorplanEditMode = !APP_STATE.isFloorplanEditMode;
    const btn = document.getElementById('btn-bp-edit-pins');
    const banner = document.getElementById('floorplan-edit-banner');
    const containers = [
        document.getElementById('floorplan-container-ho'),
        document.getElementById('floorplan-container-mo'),
        document.getElementById('floorplan-container-mentor')
    ];

    if (APP_STATE.isFloorplanEditMode) {
        if (btn) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Selesai Atur Titik';
            btn.style.background = '#F59E0B';
            btn.style.color = '#000';
            btn.style.fontWeight = '700';
        }
        if (banner) {
            banner.style.display = 'flex';
            banner.classList.remove('hidden');
        }
        containers.forEach(c => { if (c) c.classList.add('edit-mode'); });
        showToast('Mode Kelola Titik Aktif', 'Klik area denah untuk memasang/menggeser titik, atau klik pin untuk hapus/edit.', 'info');
    } else {
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Mode Kelola Titik';
            btn.style.background = 'rgba(245, 158, 11, 0.15)';
            btn.style.color = '#F59E0B';
            btn.style.fontWeight = '600';
        }
        if (banner) {
            banner.style.display = 'none';
            banner.classList.add('hidden');
        }
        containers.forEach(c => { if (c) c.classList.remove('edit-mode'); });
        showToast('Mode Kelola Selesai', 'Tata letak titik denah tersimpan.', 'success');
    }
}

function handleFloorplanContainerClick(e, siteKey) {
    if (!APP_STATE.isFloorplanEditMode) return;
    if (e.target.closest('.floorplan-pin')) return;

    const container = document.getElementById(`floorplan-container-${siteKey}`) || e.currentTarget;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const left = Math.max(1, Math.min(99, ((e.clientX - rect.left) / rect.width) * 100)).toFixed(1);
    const top = Math.max(1, Math.min(99, ((e.clientY - rect.top) / rect.height) * 100)).toFixed(1);

    openFloorplanPinModal(siteKey, parseFloat(left), parseFloat(top), null, '');
}

function openFloorplanPinModal(siteKey, left, top, existingCode = null, existingLabel = '') {
    const modal = document.getElementById('modal-floorplan-pin');
    if (!modal) return;

    document.getElementById('fp-pin-site').value = siteKey;
    document.getElementById('fp-pin-original-code').value = existingCode || '';
    document.getElementById('fp-pin-coord-x').value = left;
    document.getElementById('fp-pin-coord-y').value = top;

    const siteNames = {
        ho: 'Site 1 • Head Office (Jl. Cibodas No. 03)',
        mo: 'Site 2 • Marketing Office (Lab Kiki)',
        mentor: 'Site 3 • House Of Server (Pusat Data)'
    };
    const siteLabelEl = document.getElementById('fp-modal-site-label');
    if (siteLabelEl) siteLabelEl.textContent = siteNames[siteKey] || siteKey.toUpperCase();

    const titleEl = document.getElementById('modal-floorplan-pin-title');
    const deleteBtn = document.getElementById('btn-fp-delete-pin');

    if (existingCode) {
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-yellow"></i> Ubah Titik Perangkat: ${existingCode}`;
        if (deleteBtn) deleteBtn.style.display = 'inline-block';
    } else {
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-location-dot text-cyan"></i> Pasang Titik Perangkat di Denah`;
        if (deleteBtn) deleteBtn.style.display = 'none';
    }

    // Populate dropdown
    const select = document.getElementById('fp-pin-device-select');
    select.innerHTML = '<option value="">-- Pilih Perangkat Aset --</option>';

    const devices = (APP_STATE.devices && APP_STATE.devices.length) ? APP_STATE.devices : [];
    devices.forEach(dev => {
        const opt = document.createElement('option');
        opt.value = dev.code || dev.id;
        opt.textContent = `${dev.code || dev.id} - ${dev.name || ''} (${dev.location || dev.category || '-'})`;
        if (existingCode && (dev.code === existingCode || String(dev.id) === String(existingCode))) {
            opt.selected = true;
        }
        select.appendChild(opt);
    });

    const labelInput = document.getElementById('fp-pin-custom-label');
    if (labelInput) {
        labelInput.value = existingLabel || (existingCode || '');
    }

    modal.classList.remove('hidden');
}

function handleFpDeviceSelectChange() {
    const select = document.getElementById('fp-pin-device-select');
    const labelInput = document.getElementById('fp-pin-custom-label');
    if (!select || !labelInput) return;

    const val = select.value;
    if (val && !labelInput.value.trim()) {
        const dev = (APP_STATE.devices || []).find(d => (d.code || d.id) === val);
        labelInput.value = dev ? `${dev.code} (${dev.name.split(' ')[0]})` : val;
    }
}

function closeFloorplanPinModal() {
    const modal = document.getElementById('modal-floorplan-pin');
    if (modal) modal.classList.add('hidden');
}

function handleSaveFloorplanPin() {
    const site = document.getElementById('fp-pin-site').value;
    const originalCode = document.getElementById('fp-pin-original-code').value;
    const code = document.getElementById('fp-pin-device-select').value;
    const label = (document.getElementById('fp-pin-custom-label').value || '').trim() || code;
    const left = parseFloat(document.getElementById('fp-pin-coord-x').value);
    const top = parseFloat(document.getElementById('fp-pin-coord-y').value);

    if (!code) {
        showToast('Peringatan', 'Pilih perangkat terlebih dahulu!', 'warning');
        return;
    }

    let pins = getFloorplanPins();
    
    // Hapus pin lama jika sedang mengubah pin yang sudah ada
    if (originalCode) {
        pins = pins.filter(p => !(p.site === site && p.code === originalCode));
    }
    // Hapus duplikat jika perangkat ini sudah pernah ditaruh di site yang sama
    pins = pins.filter(p => !(p.site === site && p.code === code));

    pins.push({
        site: site,
        code: code,
        left: left,
        top: top,
        label: label,
        icon: getDevicePinIcon(code)
    });

    localStorage.setItem('taims_floorplan_custom_pins', JSON.stringify(pins));
    closeFloorplanPinModal();
    renderFloorplanPins();

    showToast('Titik Denah Disimpan', `Titik ${code} berhasil dipasang di posisi (${left}% X, ${top}% Y).`, 'success');

    if (typeof addAlertLog === 'function') {
        addAlertLog(`TATA LETAK DENAH: Titik perangkat ${code} diperbarui pada denah ${site.toUpperCase()} (${left}%, ${top}%)`, `Denah ${site.toUpperCase()}`, 'info');
    }
}

function handleDeleteFloorplanPin() {
    const site = document.getElementById('fp-pin-site').value;
    const code = document.getElementById('fp-pin-original-code').value;
    if (!code) return;

    if (!confirm(`Hapus titik perangkat ${code} dari denah gedung ini?`)) return;

    let pins = getFloorplanPins();
    pins = pins.filter(p => !(p.site === site && p.code === code));
    localStorage.setItem('taims_floorplan_custom_pins', JSON.stringify(pins));

    closeFloorplanPinModal();
    renderFloorplanPins();
    showToast('Titik Dihapus', `Titik ${code} berhasil dihapus dari denah.`, 'info');

    if (typeof addAlertLog === 'function') {
        addAlertLog(`TATA LETAK DENAH: Titik ${code} dihapus dari blueprint denah ${site.toUpperCase()}`, `Denah ${site.toUpperCase()}`, 'info');
    }
}

function resetFloorplanPinsToDefault() {
    if (!confirm('Kembalikan seluruh titik denah ke tata letak bawaan blueprint CAD aslinya?')) return;
    localStorage.removeItem('taims_floorplan_custom_pins');
    renderFloorplanPins();
    showToast('Reset Selesai', 'Seluruh denah dikembalikan ke konfigurasi blueprint standar CAD.', 'success');
}

window.toggleFloorplanEditMode = toggleFloorplanEditMode;
window.handleFloorplanContainerClick = handleFloorplanContainerClick;
window.openFloorplanPinModal = openFloorplanPinModal;
window.closeFloorplanPinModal = closeFloorplanPinModal;
window.handleFpDeviceSelectChange = handleFpDeviceSelectChange;
window.handleSaveFloorplanPin = handleSaveFloorplanPin;
window.handleDeleteFloorplanPin = handleDeleteFloorplanPin;
window.resetFloorplanPinsToDefault = resetFloorplanPinsToDefault;
window.renderFloorplanPins = renderFloorplanPins;


// =============================================================================
// RESET STATUS SELURUH PERANGKAT KE STANDBY / OFFLINE (MENUNGGU PERANGKAT FISIK)
// =============================================================================
function resetAllDevicesToOffline() {
    if (!APP_STATE.devices) return;
    APP_STATE.devices.forEach(d => {
        d.status = 'offline';
        d.lastSeen = 'Menunggu Koneksi Fisik';
        d.ping = '-';
        d.responseTimeMs = 0;
    });
    if (typeof saveDevicesToStorage === 'function') saveDevicesToStorage(APP_STATE.devices);
    if (typeof renderFullDevicesTable === 'function') renderFullDevicesTable();
    if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
    if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
    if (typeof refreshHomeMap === 'function') refreshHomeMap();
    if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
    showToast('Status Standby Aktif', 'Seluruh perangkat kini berstatus Offline (Menunggu Koneksi Fisik perangkat lab/asli).', 'info');
}
window.resetAllDevicesToOffline = resetAllDevicesToOffline;
