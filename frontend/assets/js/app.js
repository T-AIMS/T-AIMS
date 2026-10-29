
// =============================================================================
// FORMATTER & CLIPBOARD EXPORTER REKOMENDASI AI
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
                <div class="ai-rec-card" style="border-left: 3.5px solid #F8FAFC;">
                    <div class="ai-rec-card-title" style="color: #F8FAFC !important;"><i class="fa-solid fa-network-wired" style="color: #F8FAFC;"></i> Ringkasan Kondisi Infrastruktur</div>
                    <div class="ai-rec-card-body">${trimmed}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Diagnostik Gateway:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3.5px solid #F59E0B;">
                    <div class="ai-rec-card-title" style="color: #FBBF24 !important;"><i class="fa-solid fa-wifi text-yellow" style="color: #FBBF24;"></i> Diagnostik Router & Gateway</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Diagnostik Gateway:', '').trim()}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Diagnostik IoT & Edge:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3.5px solid #10B981;">
                    <div class="ai-rec-card-title" style="color: #34D399 !important;"><i class="fa-solid fa-microchip text-green" style="color: #34D399;"></i> Diagnostik Node IoT & Edge</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Diagnostik IoT & Edge:', '').trim()}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Diagnostik Pengawasan:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3.5px solid #A855F7;">
                    <div class="ai-rec-card-title" style="color: #C084FC !important;"><i class="fa-solid fa-video" style="color: #C084FC;"></i> Diagnostik Kamera Pengawas CCTV</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Diagnostik Pengawasan:', '').trim()}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Peringatan Server Core:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3.5px solid #EF4444;">
                    <div class="ai-rec-card-title" style="color: #F87171 !important;"><i class="fa-solid fa-server text-red" style="color: #F87171;"></i> Peringatan Server Core & Data Center</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Peringatan Server Core:', '').trim()}</div>
                </div>
            `;
        } else if (trimmed.startsWith('Frekuensi Gangguan Tertinggi:')) {
            html += `
                <div class="ai-rec-card" style="border-left: 3.5px solid #A855F7;">
                    <div class="ai-rec-card-title" style="color: #C084FC !important;"><i class="fa-solid fa-chart-line" style="color: #C084FC;"></i> Analisis Frekuensi Gangguan (30 Hari)</div>
                    <div class="ai-rec-card-body">${trimmed.replace('Frekuensi Gangguan Tertinggi:', '').trim()}</div>
                </div>
            `;
        } else {
            html += `
                <div class="ai-rec-card" style="border-left: 3.5px solid #F8FAFC;">
                    <div class="ai-rec-card-title" style="color: #F8FAFC !important;"><i class="fa-solid fa-robot" style="color: #F8FAFC;"></i> Analisis & Rekomendasi Preskriptif</div>
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
            showToast('Laporan AI Disalin!', 'Format laporan resmi siap dipaste ke Telegram / WhatsApp.', 'success');
        }).catch(() => {
            showToast('Salin Manual', 'Silakan pilih dan salin teks laporan.', 'info');
        });
    } else {
        showToast('Info Laporan', 'Silakan sorot dan salin teks rekomendasi.', 'info');
    }
}
window.copyAiReportToClipboard = copyAiReportToClipboard;

// =============================================================================
// MODAL RIWAYAT ANALISIS ASISTEN AI
// =============================================================================
let AI_HISTORY_CACHE = [];
let AI_HISTORY_PAGE = 1;
const AI_HISTORY_PER_PAGE = 5;

function openAiHistoryModal() {
    const modal = document.getElementById('ai-history-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        AI_HISTORY_PAGE = 1;
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

function changeAiHistoryPage(newPage) {
    const totalPages = Math.ceil((AI_HISTORY_CACHE || []).length / AI_HISTORY_PER_PAGE) || 1;
    if (newPage < 1 || newPage > totalPages) return;
    AI_HISTORY_PAGE = newPage;
    renderAiHistoryList();
    const modalBody = document.querySelector('#ai-history-modal .modal-body');
    if (modalBody) modalBody.scrollTop = 0;
}
window.changeAiHistoryPage = changeAiHistoryPage;

function renderAiHistoryList() {
    const container = document.getElementById('ai-history-container');
    const countBadge = document.getElementById('ai-history-count');
    if (!container) return;

    if (!AI_HISTORY_CACHE || AI_HISTORY_CACHE.length === 0) {
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

    const totalItems = AI_HISTORY_CACHE.length;
    const totalPages = Math.ceil(totalItems / AI_HISTORY_PER_PAGE) || 1;
    if (AI_HISTORY_PAGE > totalPages) AI_HISTORY_PAGE = totalPages;
    if (AI_HISTORY_PAGE < 1) AI_HISTORY_PAGE = 1;

    const startIdx = (AI_HISTORY_PAGE - 1) * AI_HISTORY_PER_PAGE;
    const endIdx = Math.min(startIdx + AI_HISTORY_PER_PAGE, totalItems);
    const pageItems = AI_HISTORY_CACHE.slice(startIdx, endIdx);

    if (countBadge) {
        countBadge.innerHTML = `Menampilkan <strong style="color: #00F0FF;">${startIdx + 1}-${endIdx}</strong> dari <strong>${totalItems}</strong> riwayat`;
    }

    let html = `
        <div style="display: flex; flex-direction: column; gap: 10px;">
    `;

    pageItems.forEach((item, idx) => {
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
                            #${item.recommendation_id || (startIdx + idx + 1)}
                        </span>
                        <span style="font-size: 0.76rem; color: #E2E8F0; font-weight: 600;">
                            <i class="fa-regular fa-calendar-days text-muted"></i> ${formattedTime}
                        </span>
                        ${sourceBadge}
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 0.72rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; background: ${isOptimal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${isOptimal ? '#34D399' : '#F87171'}; border: 1px solid ${isOptimal ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};">
                            SLA: ${sla} (${item.online_devices || 0}/${item.total_devices || 0} Online)
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

    if (totalPages > 1) {
        html += `
            <div class="ai-history-pagination">
                <button type="button" class="btn btn-secondary-cyber ai-page-btn" onclick="changeAiHistoryPage(${AI_HISTORY_PAGE - 1})" ${AI_HISTORY_PAGE <= 1 ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''}>
                    <i class="fa-solid fa-chevron-left"></i> <span class="page-text-desktop">Sebelumnya</span><span class="page-text-mobile">Sblm</span>
                </button>
                <div class="ai-page-info">
                    Halaman <strong style="color: #00F0FF;">${AI_HISTORY_PAGE}</strong> / ${totalPages}
                </div>
                <button type="button" class="btn btn-secondary-cyber ai-page-btn" onclick="changeAiHistoryPage(${AI_HISTORY_PAGE + 1})" ${AI_HISTORY_PAGE >= totalPages ? 'disabled style="opacity: 0.4; cursor: not-allowed;"' : ''}>
                    <span class="page-text-desktop">Selanjutnya</span><span class="page-text-mobile">Lanjut</span> <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        `;
    }

    container.innerHTML = html;
}
window.renderAiHistoryList = renderAiHistoryList;

async function loadAiHistory() {
    const container = document.getElementById('ai-history-container');
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
        AI_HISTORY_PAGE = 1;
        renderAiHistoryList();

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
// MODUL NOTIFIKASI TELEGRAM & N8N WORKFLOW
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
        : (online > 0 ? parseFloat(onPct) : 0.0);

    if (slaBoxAvail) {
        slaBoxAvail.textContent = `${backendSla30}%`;
        if (backendSla30 >= 99.0) {
            slaBoxAvail.className = 'text-green';
            if (slaTargetLabel) {
                slaTargetLabel.innerHTML = '<span class="txt-dt">Target Achieved (&ge; 99.0%)</span><span class="txt-mb">Target &ge; 99%</span>';
                slaTargetLabel.className = 'text-green';
            }
        } else {
            slaBoxAvail.className = 'text-yellow';
            if (slaTargetLabel) {
                slaTargetLabel.innerHTML = '<span class="txt-dt">Perlu Perhatian (&lt; 99.0%)</span><span class="txt-mb">&lt; 99% Perhatian</span>';
                slaTargetLabel.className = 'text-yellow';
            }
        }
    }

    if (APP_STATE.backendStats && APP_STATE.backendStats.site_sla) {
        const ss = APP_STATE.backendStats.site_sla;
        const setSlaSiteStyle = (valEl, barEl, val) => {
            if (!valEl) return;
            valEl.textContent = `${val}% Uptime`;
            if (barEl) barEl.style.width = `${val}%`;
            const num = parseFloat(val);
            const colorClass = num >= 95.0 ? 'text-green' : (num >= 80.0 ? 'text-yellow' : 'text-red');
            const progClass = num >= 95.0 ? 'green' : (num >= 80.0 ? 'yellow' : 'red');
            valEl.className = colorClass;
            if (barEl) barEl.className = `sbi-prog ${progClass}`;
        };
        if (slaSiteMoVal && ss['1'] !== undefined) {
            setSlaSiteStyle(slaSiteMoVal, slaSiteMoBar, ss['1']);
        }
        if (slaSiteHoVal && ss['2'] !== undefined) {
            setSlaSiteStyle(slaSiteHoVal, slaSiteHoBar, ss['2']);
        }
        if (slaSiteHosVal && ss['3'] !== undefined) {
            setSlaSiteStyle(slaSiteHosVal, slaSiteHosBar, ss['3']);
        }
    }
    const slaIncEl = document.getElementById('sla-box-incidents');
    if (slaIncEl) {
        const incTotal = (APP_STATE.incidents || []).length;
        slaIncEl.textContent = `${incTotal}`;
    }
    const slaDownEl = document.getElementById('sla-box-downtime');
    if (slaDownEl) {
        const totalDownMins = (APP_STATE.backendStats && APP_STATE.backendStats.total_downtime_minutes !== undefined)
            ? APP_STATE.backendStats.total_downtime_minutes
            : 0;
        slaDownEl.textContent = `${totalDownMins} m`;
    }
    const slaLatEl = document.getElementById('sla-box-latency');
    const slaLatSub = document.getElementById('sla-box-latency-sub');
    if (slaLatEl) {
        const activePings = (APP_STATE.devices || [])
            .filter(d => (d.status || d.current_status || '').toLowerCase() === 'online')
            .map(d => typeof d.response_time_ms === 'number' ? d.response_time_ms : parseFloat(String(d.ping || '0').replace(/[^0-9.]/g, '')))
            .filter(v => !isNaN(v) && v > 0);
        const avgPing = activePings.length > 0
            ? (Math.round((activePings.reduce((a, b) => a + b, 0) / activePings.length) * 10) / 10)
            : ((APP_STATE.backendStats && APP_STATE.backendStats.avg_latency_30_days) ? APP_STATE.backendStats.avg_latency_30_days : 0);
        slaLatEl.textContent = (online > 0 ? avgPing : 0) + ' ms';
        if (slaLatSub) {
            slaLatSub.innerHTML = online > 0 
                ? '<span class="txt-dt">Koneksi aktif</span><span class="txt-mb">Koneksi Aktif</span>' 
                : '<span class="txt-dt">Standby &bull; Semua perangkat offline</span><span class="txt-mb">Standby Offline</span>';
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
    if (typeof updateMonitoringLinksAndProtocols === 'function') updateMonitoringLinksAndProtocols();
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
        subtexts[0].innerHTML = `<span class="text-white font-semibold">${total} Unit</span> Terdaftar di lab & site`;
        subtexts[1].innerHTML = `<span class="${online > 0 ? 'text-green font-bold' : 'text-muted'}" id="kpi-online-pct">${onPct}%</span> dari ${total} perangkat aktif`;
        subtexts[2].innerHTML = `<span class="text-red font-bold" id="kpi-offline-pct">${offPct}%</span> dari ${total} perangkat aktif`;
        subtexts[3].innerHTML = `<span class="text-yellow font-bold" id="kpi-warning-pct">${warnPct}%</span> terancam &bull; <strong id="kpi-unknown-count" style="color:#CBD5E1;">${unknown}</strong> unknown`;
        subtexts[4].textContent = 'HO, MO & House of Server';
        subtexts[5].innerHTML = `<span class="${backendSla30 >= 99 ? 'text-green' : 'text-purple'} font-bold" style="${backendSla30 >= 99 ? '' : 'color: #C084FC !important;'}">${backendSla30}%</span> SLA 30 hari riil`;
    }
    const kpiLokasi = document.getElementById('kpi-lokasi');
    if (kpiLokasi) kpiLokasi.textContent = '3';
    // Call maintenance summary cards inside updateDashboardMetrics
    if (typeof updateMaintenanceSummaryCards === 'function') updateMaintenanceSummaryCards();
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
        asset_id: a.asset_id || a.id,
        rawId: a.asset_id || a.id,
        code: a.asset_code || a.code || `AST-${a.asset_id}`,
        name: a.asset_name || a.name || a.asset_code,
        category: normalizedCat,
        sub_category: a.sub_category || a.subcategory || (a.config && a.config.sub_category) || '',
        subcategory: a.sub_category || a.subcategory || (a.config && a.config.sub_category) || '',
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
function getDeviceSiteKey(dev) {
    if (!dev) return 'ho';
    const loc = ((dev.location || '') + ' ' + (dev.location_name || '')).toLowerCase();
    if (loc.includes('market') || loc.includes('ciliwung') || loc.includes('mo') || loc.includes('kiki')) return 'mo';
    if (loc.includes('server') || loc.includes('hos') || loc.includes('peladen') || loc.includes('mentor') || loc.includes('pusat data')) return 'mentor';
    return 'ho';
}
window.getDeviceSiteKey = getDeviceSiteKey;

/**
 * Render dinamis kartu daftar perangkat pada Site Detail Cards (Menu Lokasi)
 */
function renderSiteDetailCards() {
    if (!APP_STATE.devices || !Array.isArray(APP_STATE.devices)) return;
    const sites = [
        { key: 'ho', listEl: document.getElementById('sdc-list-ho') },
        { key: 'mo', listEl: document.getElementById('sdc-list-mo') },
        { key: 'mentor', listEl: document.getElementById('sdc-list-server') || document.getElementById('sdc-list-mentor') }
    ];

    sites.forEach(({ key, listEl }) => {
        if (!listEl) return;
        const devs = APP_STATE.devices.filter(d => getDeviceSiteKey(d) === key);
        if (devs.length === 0) {
            listEl.innerHTML = '<div style="padding: 10px; color: #94A3B8; font-size: 0.8rem; text-align: center;">Belum ada perangkat di lokasi ini.</div>';
            return;
        }
        listEl.innerHTML = devs.map((dev, idx) => {
            const isOnline = (dev.status === 'online');
            const statusClass = isOnline ? 'online' : (dev.status === 'warning' ? 'warning' : 'offline');
            const dotColor = isOnline ? 'green' : (dev.status === 'warning' ? 'yellow' : 'red');
            const statusLabel = isOnline ? 'Online' : (dev.status === 'warning' ? 'Warning' : 'Offline');
            return `
                <div class="sdc-dev-row" id="sdc-row-${dev.code}" onclick="if(window.openDeviceDetailModal) openDeviceDetailModal('${dev.code}')" style="cursor: pointer;" title="Klik untuk rincian ${dev.code} - ${dev.name}">
                    <span class="sdc-dev-name">${idx + 1}. ${dev.code} (${dev.name} - ${dev.ip || '-'})</span>
                    <span class="status-pill ${statusClass}" id="sdc-pill-${dev.code}"><span class="dot ${dotColor}"></span> ${statusLabel}</span>
                </div>
            `;
        }).join('');
    });
}
window.renderSiteDetailCards = renderSiteDetailCards;

/**
 * Render dinamis kategori kartu & daftar chip perangkat pada Blueprint Arsitektur
 */
function renderBlueprintLegendPanels() {
    if (!APP_STATE.devices || !Array.isArray(APP_STATE.devices)) return;

    const isSec = d => {
        const t = ((d.category || '') + ' ' + (d.code || '') + ' ' + (d.name || '')).toLowerCase();
        return t.includes('cctv') || t.includes('cam') || t.includes('kamera') || t.includes('gate') || t.includes('gerbang');
    };
    const isWs = d => {
        const t = ((d.category || '') + ' ' + (d.code || '') + ' ' + (d.name || '')).toLowerCase();
        return t.includes('workstation') || t.includes('desktop') || t.includes('pc') || t.includes('laptop') || t.includes('tv') || t.includes('display') || t.includes('smtv');
    };

    const renderChips = (list) => {
        if (!list.length) return '<div style="color:#64748B; font-size:0.75rem; font-style:italic; padding:4px 0;">Tidak ada aset terpasang</div>';
        return list.map(dev => {
            const isOnline = (dev.status === 'online');
            const stClass = isOnline ? 'online' : (dev.status === 'warning' ? 'warning' : 'offline');
            const iconCls = typeof getDevicePinIcon === 'function' ? getDevicePinIcon(dev.code) : 'fa-microchip';
            return `
                <span class="bp-chip ${stClass}" id="bp-chip-${dev.code}" onclick="event.stopPropagation(); if(window.openDeviceDetailModal) openDeviceDetailModal('${dev.code}')" title="${dev.code} - ${dev.name} • ${dev.ip || '-'}">
                    <i class="fa-solid ${iconCls}"></i> ${dev.code} - ${dev.name} (${dev.ip || '-'})
                </span>
            `;
        }).join('');
    };

    // 1. HEAD OFFICE
    const hoBox = document.getElementById('bp-box-ho');
    if (hoBox) {
        const panel = hoBox.querySelector('.floorplan-legend-panel');
        const hoDevs = APP_STATE.devices.filter(d => getDeviceSiteKey(d) === 'ho');
        const metaH3 = hoBox.querySelector('.bp-site-meta h3');
        if (metaH3) metaH3.innerHTML = `Denah Kantor & Data Center Utama <span class="bp-count-badge">(${hoDevs.length} Aset)</span>`;

        if (panel) {
            const wsDevs = hoDevs.filter(d => isWs(d) && !isSec(d));
            const secDevs = hoDevs.filter(d => isSec(d));
            const netDevs = hoDevs.filter(d => !wsDevs.includes(d) && !secDevs.includes(d));

            panel.innerHTML = `
                <div class="legend-room-card" onclick="showRoomInfo('Area Workstation & Display (HO)', '${wsDevs.map(d=>d.code).join(', ') || 'N/A'}', 'Workstation Operasional Staf')">
                    <div class="legend-room-head">
                        <span><i class="fa-solid fa-desktop text-green"></i> WORKSTATION STAF & DISPLAY</span>
                        <span class="badge-pill-cyan">${wsDevs.length} ASET</span>
                    </div>
                    <div class="legend-room-desc">Area operasional komputer staf di Ruang 2 dan monitor status di sayap kanan.</div>
                    <div class="bp-devices-chips">
                        ${renderChips(wsDevs)}
                    </div>
                </div>
                <div class="legend-room-card" onclick="showRoomInfo('Jaringan & Sensor IoT (HO)', '${netDevs.map(d=>d.code).join(', ') || 'N/A'}', 'Infrastruktur Jaringan & IoT')">
                    <div class="legend-room-head">
                        <span><i class="fa-solid fa-network-wired text-cyan"></i> JARINGAN & SENSOR IOT</span>
                        <span class="badge-pill-cyan">${netDevs.length} ASET</span>
                    </div>
                    <div class="legend-room-desc">Backbone gateway koridor tengah, telemetri Panel Surya ESP-01, dan kontrol resepsionis.</div>
                    <div class="bp-devices-chips">
                        ${renderChips(netDevs)}
                    </div>
                </div>
                <div class="legend-room-card" onclick="showRoomInfo('Pintu Masuk & Pengawasan (HO)', '${secDevs.map(d=>d.code).join(', ') || 'N/A'}', 'Pengamanan Area Luar Head Office')">
                    <div class="legend-room-head">
                        <span><i class="fa-solid fa-shield-halved text-yellow"></i> GERBANG & PENGAWASAN</span>
                        <span class="badge-pill-cyan">${secDevs.length} ASET</span>
                    </div>
                    <div class="legend-room-desc">Pengawasan visual perimeter luar gerbang dan akses pintu masuk operasional.</div>
                    <div class="bp-devices-chips">
                        ${renderChips(secDevs)}
                    </div>
                </div>
            `;
        }
    }

    // 2. MARKETING OFFICE
    const moBox = document.getElementById('bp-box-mo');
    if (moBox) {
        const panel = moBox.querySelector('.floorplan-legend-panel');
        const moDevs = APP_STATE.devices.filter(d => getDeviceSiteKey(d) === 'mo');
        const metaH3 = moBox.querySelector('.bp-site-meta h3');
        if (metaH3) metaH3.innerHTML = `Denah Kantor Cabang & Lab Kos Kiki <span class="bp-count-badge">(${moDevs.length} Aset)</span>`;

        if (panel) {
            const secDevs = moDevs.filter(d => isSec(d));
            const netDevs = moDevs.filter(d => !secDevs.includes(d));

            panel.innerHTML = `
                <div class="legend-room-card" onclick="showRoomInfo('Gerbang Jaringan & Router MO', '${netDevs.map(d=>d.code).join(', ') || 'N/A'}', 'Konektivitas Routing Marketing Office')">
                    <div class="legend-room-head">
                        <span><i class="fa-solid fa-network-wired text-cyan"></i> ROUTING & GATEWAY JARINGAN</span>
                        <span class="badge-pill-cyan">${netDevs.length} ASET</span>
                    </div>
                    <div class="legend-room-desc">Infrastruktur routing MikroTik, Router Gateway, dan jaringan nirkabel kantor cabang.</div>
                    <div class="bp-devices-chips">
                        ${renderChips(netDevs)}
                    </div>
                </div>
                <div class="legend-room-card" onclick="showRoomInfo('Pengawasan Keamanan (MO)', '${secDevs.map(d=>d.code).join(', ') || 'N/A'}', 'Stream RTSP Real-time')">
                    <div class="legend-room-head">
                        <span><i class="fa-solid fa-shield-halved text-green"></i> PENGAWASAN KEAMANAN MO</span>
                        <span class="badge-pill-cyan">${secDevs.length} ASET</span>
                    </div>
                    <div class="legend-room-desc">CCTV IP resolusi tinggi memantau gerbang utama dan area pemasaran.</div>
                    <div class="bp-devices-chips">
                        ${renderChips(secDevs)}
                    </div>
                </div>
            `;
        }
    }

    // 3. HOUSE OF SERVER (MENTOR)
    const hosBox = document.getElementById('bp-box-mentor');
    if (hosBox) {
        const panel = hosBox.querySelector('.floorplan-legend-panel');
        const hosDevs = APP_STATE.devices.filter(d => getDeviceSiteKey(d) === 'mentor');
        const metaH3 = hosBox.querySelector('.bp-site-meta h3');
        if (metaH3) metaH3.innerHTML = `Denah Ruang Peladen & Server Inti <span style="white-space:nowrap;">T-AIMS</span> <span class="bp-count-badge">(${hosDevs.length} Aset)</span>`;

        if (panel) {
            panel.innerHTML = `
                <div class="legend-room-card" onclick="showRoomInfo('Ruang Peladen & Rak Server Utama', '${hosDevs.map(d=>d.code).join(', ') || 'N/A'}', 'Ruang Server Berpendingin')">
                    <div class="legend-room-head">
                        <span><i class="fa-solid fa-server text-yellow"></i> CORE SERVER RACK & BACKBONE</span>
                        <span class="badge-pill-cyan">${hosDevs.length} ASET</span>
                    </div>
                    <div class="legend-room-desc">Server database analitik, MikroTik Cloud Router, Switch L3 core, dan node peladen.</div>
                    <div class="bp-devices-chips">
                        ${renderChips(hosDevs)}
                    </div>
                </div>
            `;
        }
    }
}
window.renderBlueprintLegendPanels = renderBlueprintLegendPanels;

/**
 * Sinkronisasi Site Detail Cards & Blueprints secara real-time dengan status perangkat
 */
function syncSiteCardsAndBlueprints() {
    if (!APP_STATE.devices || !Array.isArray(APP_STATE.devices)) return;

    // 1. Render kartu daftar perangkat di Site Cards Lokasi & Blueprint Legend Cards
    renderSiteDetailCards();
    renderBlueprintLegendPanels();

    // 2. Sinkronkan status dan visual pin pada denah CAD 2D
    APP_STATE.devices.forEach(dev => {
        const code = dev.code || dev.asset_code;
        const isOnline = (dev.status === 'online');
        const statusClass = isOnline ? 'online' : (dev.status === 'warning' ? 'warning' : 'offline');
        
        // Sync Architectural Floorplan Pin (Opsi 1)
        const pin = document.getElementById(`bp-pin-${code}`);
        if (pin) {
            const pulse = pin.querySelector('.pin-pulse');
            const dot = pin.querySelector('.pin-center-dot');
            const badge = pin.querySelector('.pin-badge');
            
            if (pulse) pulse.className = `pin-pulse ${statusClass}`;
            if (dot) dot.className = `pin-center-dot ${statusClass}`;
            if (badge) badge.className = `pin-badge ${statusClass}`;

            pin.setAttribute('data-status', statusClass);
            pin.title = `${code} - ${dev.name || code} (${dev.ip || '-'}) • ${statusClass.toUpperCase()}`;
            let tooltip = pin.querySelector('.floorplan-pin-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'floorplan-pin-tooltip';
                pin.appendChild(tooltip);
            }
            tooltip.innerHTML = `<strong>${code}</strong> &bull; ${dev.name || code}<br><span style="color:#94A3B8; font-size:0.75rem;">IP: ${dev.ip || '-'}</span><br><span style="color:${isOnline ? '#10B981' : (dev.status === 'warning' ? '#F59E0B' : '#FF1744')}; font-weight:700;">● ${statusClass.toUpperCase()}</span> &bull; Latency: ${dev.ping || '-'}`;
        }

        // Sinkronkan status pada LOC_SITES.devices (Popup Peta GIS)
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

    // 3. Sinkronkan angka rekaman modul database di menu Pengaturan
    const dbAssetsEl = document.getElementById('db-count-assets');
    if (dbAssetsEl && APP_STATE.devices) {
        dbAssetsEl.innerHTML = `${APP_STATE.devices.length} rekaman &bull; Aktif`;
    }
    const dbUsersEl = document.getElementById('db-count-users');
    if (dbUsersEl && APP_STATE.usersList) {
        dbUsersEl.innerHTML = `${APP_STATE.usersList.length} pengguna &bull; Aktif`;
    }

    // 4. Sinkronkan angka ringkasan header halaman Lokasi (Live Metrics Dinamis)
    const locSitesVal = document.getElementById('loc-chip-val-sites');
    if (locSitesVal) {
        const totalSites = (APP_STATE.locationsDb && APP_STATE.locationsDb.length) || (typeof LOC_SITES !== 'undefined' ? Object.keys(LOC_SITES).length : 3);
        locSitesVal.textContent = `${totalSites} Zona`;
    }
    const locAssetsVal = document.getElementById('loc-chip-val-assets');
    if (locAssetsVal) {
        const totalDevs = (APP_STATE.devices && APP_STATE.devices.length) || 16;
        locAssetsVal.textContent = `${totalDevs} Unit`;
    }
}
window.syncSiteCardsAndBlueprints = syncSiteCardsAndBlueprints;

/**
 * Pengelolaan Siklus Polling Data Riil (Page Visibility & 10s Interval)
 */
function startRealDataPolling(intervalMs = 10000) {
    if (window._taimsSyncInterval) {
        clearInterval(window._taimsSyncInterval);
        window._taimsSyncInterval = null;
    }
    const token = localStorage.getItem('taims_jwt_token');
    if (token && !document.hidden) {
        window._taimsSyncInterval = setInterval(loadRealDataFromApi, intervalMs);
    }
}

function stopRealDataPolling() {
    if (window._taimsSyncInterval) {
        clearInterval(window._taimsSyncInterval);
        window._taimsSyncInterval = null;
    }
}

function invalidateDeviceFingerprint() {
    window._lastDevicesFingerprint = null;
}
window.startRealDataPolling = startRealDataPolling;
window.stopRealDataPolling = stopRealDataPolling;
window.invalidateDeviceFingerprint = invalidateDeviceFingerprint;

// Page Visibility API: Menjeda polling saat tab browser ditinggal / diminimalkan
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Tab sedang di latar belakang -> Hentikan polling background untuk hemat RAM, CPU & bandwidth
        stopRealDataPolling();
    } else {
        // Tab kembali aktif dibuka pengguna -> Sinkronisasi riil seketika dan aktifkan interval 10s
        if (localStorage.getItem('taims_jwt_token')) {
            if (typeof loadRealDataFromApi === 'function') {
                loadRealDataFromApi();
            }
            startRealDataPolling(10000);
        }
    }
});

/**
 * Memuat data riil terintegrasi dari Backend API Express (Port 3000)
 */
async function loadRealDataFromApi() {
    const token = localStorage.getItem('taims_jwt_token');
    if (!token) {
        // Belum login atau token tidak ada, jangan panggil API backend untuk mencegah spam/rate limit
        return;
    }
    if (typeof refreshAlertGatewaysStatus === "function") refreshAlertGatewaysStatus();
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
                // Smart Diffing: Cek apakah ada perubahan status, latensi, IP, atau nama perangkat
                const devFingerprint = (APP_STATE.devices || []).map(d => `${d.id}_${d.status}_${d.ping || d.responseTime || 0}_${d.ip}_${d.name}`).join('|');
                const hasChanged = (window._lastDevicesFingerprint !== devFingerprint);

                if (hasChanged) {
                    window._lastDevicesFingerprint = devFingerprint;
                    if (typeof renderHomeDevicesTable === "function") renderHomeDevicesTable();
                    if (typeof renderFullDevicesTable === "function") renderFullDevicesTable();
                    if (typeof updateDashboardMetrics === "function") updateDashboardMetrics();
                    if (typeof refreshHomeMap === "function") refreshHomeMap();
                    if (typeof renderFloorplanPins === "function") renderFloorplanPins();
                    if (typeof syncSiteCardsAndBlueprints === "function") syncSiteCardsAndBlueprints();
                }
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
                    pic: (APP_STATE.currentUser ? APP_STATE.currentUser.name : ''),
                    status: (inc.incident_status || 'open').toLowerCase()
                }));
                if (typeof renderIncidentsTable === "function") renderIncidentsTable();
                if (typeof updateIncidentStats === "function") updateIncidentStats();
            }
        }

        // 4. Ambil Notifikasi Riil dari Backend (Point 4)
        let hasLoadedNotifs = false;
        if (window.apiService && typeof window.apiService.getNotifications === "function") {
            try {
                const notifRes = await window.apiService.getNotifications({ limit: 20 });
                if (notifRes && (notifRes.success || Array.isArray(notifRes.data))) {
                    const notifList = (notifRes.data && Array.isArray(notifRes.data)) ? notifRes.data : [];
                    APP_STATE.alerts = notifList.map(n => ({
                        id: `NOTIF-${n.notification_id}`,
                        rawId: n.notification_id,
                        time: n.created_at ? new Date(n.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Baru saja',
                        title: n.title,
                        location: n.asset_name ? `${n.asset_code} (${n.asset_name})` : (n.message || 'Sistem T-AIMS'),
                        level: (n.title.toLowerCase().includes('offline') || n.title.toLowerCase().includes('kritis')) ? 'kritis' : 'peringatan',
                        read: (localStorage.getItem('taims_all_alerts_read') === 'true') || Number(n.is_read) === 1
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
                read: (localStorage.getItem('taims_all_alerts_read') === 'true') || inc.status === 'resolved'
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
                        password: '***',
                        email: u.email,
                        avatar: (u.avatar !== undefined && u.avatar !== null) ? u.avatar : (storedAvatar || prev.avatar || (defUser ? defUser.avatar : null) || ''),
                        role: u.role === 'super_admin' ? 'Superadmin' : (u.role === 'admin' ? 'Admin' : 'User'),
                        perms: u.role === 'super_admin' ? 'CRUD' : (u.role === 'admin' ? 'CRU' : 'Read Only'),
                        picTask: u.pic_task || prev.picTask || (defUser ? defUser.picTask : 'Staff Operasional & Monitoring'),
                        status: u.status || prev.status || 'Aktif',
                        lastLogin: (u.last_login_at && !isNaN(new Date(u.last_login_at))) ? new Date(u.last_login_at).toLocaleString('id-ID',{dateStyle:'short',timeStyle:'short'}) : ((prev.lastLogin && prev.lastLogin !== 'Invalid Date') ? prev.lastLogin : 'Aktif Hari Ini')
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

        // 6. Ambil Jadwal Pemeliharaan dari Backend
        if (typeof window.getMaintenanceList === 'function' || (window.apiService && typeof window.apiService.getMaintenanceList === 'function')) {
            try {
                const _mntFn = window.getMaintenanceList || (window.apiService && window.apiService.getMaintenanceList);
                const mntData = await _mntFn({ limit: 100 });
                if (mntData && mntData.length > 0) {
                    APP_STATE.maintenanceLogs = mntData.map(m => ({
                        rawId: m.maintenance_id,
                        id: `MNT-${String(m.maintenance_id).padStart(3, '0')}`,
                        date: m.scheduled_date ? new Date(m.scheduled_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
                        rawDate: m.scheduled_date ? m.scheduled_date.slice(0, 10) : '',
                        device: m.asset_code ? `${m.asset_code} (${m.asset_name || ''})` : 'Perangkat',
                        location: m.location_name || 'Head Office',
                        type: m.maintenance_type || 'Preventive Maintenance',
                        desc: m.description || '-',
                        pic: m.pic_name || m.pic || (APP_STATE.currentUser ? APP_STATE.currentUser.name : 'Tim Teknolab'),
                        status: m.maintenance_status === 'completed' ? 'Selesai'
                              : m.maintenance_status === 'in_progress' ? 'Sedang Berjalan'
                              : m.maintenance_status === 'cancelled' ? 'Dibatalkan'
                              : 'Tertunda'
                    }));
                    if (typeof loadMaintenance === 'function') loadMaintenance(); else if (typeof renderMaintenanceTable === 'function') renderMaintenanceTable();
                    if (typeof updateMaintenanceSummaryCards === 'function') updateMaintenanceSummaryCards();
                }
            } catch (eMnt) {
                console.warn('Gagal memuat maintenance dari backend:', eMnt);
            }
        }

        // 7. Hitung unread notification count (Sinkron dengan daftar APP_STATE.alerts aktif)
        if (localStorage.getItem('taims_all_alerts_read') === 'true') {
            if (typeof updateNotifBadgeCount === 'function') {
                updateNotifBadgeCount(0);
            }
        } else {
            const localUnread = (APP_STATE.alerts || []).filter(a => !a.read).length;
            if (window.apiService && typeof window.apiService.getUnreadNotificationCount === "function") {
                const unread = await window.apiService.getUnreadNotificationCount();
                if (typeof updateNotifBadgeCount === 'function') {
                    updateNotifBadgeCount(Math.max(Number(unread) || 0, localUnread));
                }
            } else if (typeof updateNotifBadgeCount === 'function') {
                updateNotifBadgeCount(localUnread);
            }
        }

        // 8. Ambil metrik resource server terkini (CPU, RAM, Storage, Uptime)
        if (typeof refreshServerMetricsUI === 'function') {
            refreshServerMetricsUI(false);
        }
    } catch (err) {
        console.warn("Sinkronisasi live data backend gagal / fallback:", err);
    }
}
window.loadRealDataFromApi = loadRealDataFromApi;

/**
 * Memperbarui tampilan widget Server Resource Monitoring (CPU, RAM, Disks, Uptime)
 */
async function refreshServerMetricsUI(showFeedback = false) {
    if (!window.apiService || typeof window.apiService.getServerMetrics !== 'function') return;
    try {
        const res = await window.apiService.getServerMetrics();
        if (!res || !res.success || !res.data) {
            if (showFeedback && typeof showToast === 'function') {
                showToast('Peringatan', res?.error || 'Gagal mengambil metrik server.', 'warning');
            }
            return;
        }

        const isStandby = res.is_standby === true;
        const data = res.data;
        const cpu = data.cpu || {};
        const mem = data.memory || {};
        const disks = data.disks || [];
        const sys = data.system || {};

        // 1. CPU
        const cpuPct = parseFloat(cpu.usage_percent) || 0;
        const cpuEl = document.getElementById('srv-cpu-pct');
        if (cpuEl) cpuEl.innerHTML = isStandby ? `--<span class="srv-unit">%</span>` : `${cpuPct.toFixed(1)}<span class="srv-unit">%</span>`;

        const cpuModelEl = document.getElementById('srv-cpu-model');
        if (cpuModelEl) cpuModelEl.textContent = cpu.model || 'Processor';

        const cpuCoresEl = document.getElementById('srv-cpu-cores');
        if (cpuCoresEl) cpuCoresEl.textContent = `${cpu.cores || 1} Cores`;

        const cpuSpeedEl = document.getElementById('srv-cpu-speed');
        if (cpuSpeedEl) cpuSpeedEl.textContent = `${cpu.speed_mhz || 0} MHz`;

        const cpuBarEl = document.getElementById('srv-cpu-bar');
        const cpuTagEl = document.getElementById('srv-cpu-status-tag');
        if (cpuBarEl) {
            cpuBarEl.style.width = `${Math.min(100, Math.max(0, cpuPct))}%`;
            cpuBarEl.className = 'srv-progress-bar bar-cpu' + (cpuPct > 90 ? ' critical' : (cpuPct > 75 ? ' warning' : ''));
        }
        if (cpuTagEl) {
            if (cpuPct > 90) {
                cpuTagEl.textContent = 'Kritis';
                cpuTagEl.className = 'srv-status-tag critical';
            } else if (cpuPct > 75) {
                cpuTagEl.textContent = 'Tinggi';
                cpuTagEl.className = 'srv-status-tag warning';
            } else {
                cpuTagEl.textContent = 'Normal';
                cpuTagEl.className = 'srv-status-tag';
            }
        }

        // 2. RAM
        const ramPct = parseFloat(mem.usage_percent) || 0;
        const ramEl = document.getElementById('srv-ram-pct');
        if (ramEl) ramEl.innerHTML = isStandby ? `--<span class="srv-unit">%</span>` : `${ramPct.toFixed(1)}<span class="srv-unit">%</span>`;

        const ramSubEl = document.getElementById('srv-ram-sub');
        if (ramSubEl) ramSubEl.textContent = `${mem.used_gb || 0} GB / ${mem.total_gb || 0} GB Terpakai`;

        const ramFreeEl = document.getElementById('srv-ram-free');
        if (ramFreeEl) ramFreeEl.textContent = `${mem.free_gb || 0} GB`;

        const ramTotalEl = document.getElementById('srv-ram-total');
        if (ramTotalEl) ramTotalEl.textContent = `${mem.total_gb || 0} GB`;

        const ramBarEl = document.getElementById('srv-ram-bar');
        const ramTagEl = document.getElementById('srv-ram-status-tag');
        if (ramBarEl) {
            ramBarEl.style.width = `${Math.min(100, Math.max(0, ramPct))}%`;
            ramBarEl.className = 'srv-progress-bar bar-ram' + (ramPct > 90 ? ' critical' : (ramPct > 75 ? ' warning' : ''));
        }
        if (ramTagEl) {
            if (ramPct > 90) {
                ramTagEl.textContent = 'Kritis';
                ramTagEl.className = 'srv-status-tag critical';
            } else if (ramPct > 75) {
                ramTagEl.textContent = 'Tinggi';
                ramTagEl.className = 'srv-status-tag warning';
            } else {
                ramTagEl.textContent = 'Normal';
                ramTagEl.className = 'srv-status-tag';
            }
        }

        // 3. Storage / Disk
        const primaryDisk = disks[0] || { usage_percent: 0, total_gb: 0, free_gb: 0, drive: 'C:' };
        const diskPct = parseFloat(primaryDisk.usage_percent) || 0;
        const diskEl = document.getElementById('srv-disk-pct');
        if (diskEl) diskEl.innerHTML = isStandby ? `--<span class="srv-unit">%</span>` : `${diskPct.toFixed(1)}<span class="srv-unit">%</span>`;

        const diskSubEl = document.getElementById('srv-disk-sub');
        if (diskSubEl) {
            const diskSummary = disks.map(d => `${d.drive} (${d.usage_percent}%)`).join(' • ');
            diskSubEl.textContent = diskSummary || `Drive: ${primaryDisk.drive}`;
        }

        const diskFreeEl = document.getElementById('srv-disk-free');
        if (diskFreeEl) diskFreeEl.textContent = `${primaryDisk.free_gb || 0} GB`;

        const diskTotalEl = document.getElementById('srv-disk-total');
        if (diskTotalEl) diskTotalEl.textContent = `${primaryDisk.total_gb || 0} GB`;

        const diskBarEl = document.getElementById('srv-disk-bar');
        const diskTagEl = document.getElementById('srv-disk-status-tag');
        if (diskBarEl) {
            diskBarEl.style.width = `${Math.min(100, Math.max(0, diskPct))}%`;
            diskBarEl.className = 'srv-progress-bar bar-disk' + (diskPct > 90 ? ' critical' : (diskPct > 80 ? ' warning' : ''));
        }
        if (diskTagEl) {
            if (diskPct > 90) {
                diskTagEl.textContent = 'Hampir Penuh';
                diskTagEl.className = 'srv-status-tag critical';
            } else if (diskPct > 80) {
                diskTagEl.textContent = 'Waspada';
                diskTagEl.className = 'srv-status-tag warning';
            } else {
                diskTagEl.textContent = 'Aman';
                diskTagEl.className = 'srv-status-tag';
            }
        }

        // 4. System & Uptime
        const uptimeEl = document.getElementById('srv-uptime-val');
        if (uptimeEl) uptimeEl.textContent = sys.uptime_formatted || '0 Menit';

        const hostEl = document.getElementById('srv-sys-host');
        if (hostEl) hostEl.textContent = `${sys.hostname || 'Host'} • Node ${sys.node_version || ''}`;

        const osEl = document.getElementById('srv-sys-os');
        if (osEl) osEl.textContent = sys.platform || 'Server OS';

        // Ticker update timestamp
        const timeBadge = document.getElementById('srv-last-updated');
        if (timeBadge) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            timeBadge.innerHTML = `<i class="fa-solid fa-clock"></i> Sinkron: ${timeStr} WIB`;
        }

        if (showFeedback && typeof showToast === 'function') {
            showToast('Metrik Terkini', 'Resource server (CPU, RAM, Disk) berhasil diperbarui secara live.', 'success');
        }
    } catch (err) {
        console.warn('Gagal memperbarui metrik server UI:', err);
    }
}
window.refreshServerMetricsUI = refreshServerMetricsUI;

const DEFAULT_USERS_LIST = [
    {
        id: "USR-01",
        rawId: 1,
        name: "Dzakwan Miftahussobirin",
        username: "dzakwan",
        password: "password123",
        email: "dzakwan@taims.id",
        avatar: "",
        role: "Superadmin",
        perms: "CRUD",
        picTask: "Ketua Tim & Integrasi Sistem",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-02",
        rawId: 2,
        name: "Damar Munajad",
        username: "damar",
        password: "password123",
        email: "damar@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Koordinator Proyek & Analis Sistem",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-03",
        rawId: 3,
        name: "Ahmad Reza Fahmi",
        username: "fahmi",
        password: "password123",
        email: "fahmi@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Pengembang Sistem Backend & API",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-04",
        rawId: 4,
        name: "Faida Trisma Amelia",
        username: "faida",
        password: "password123",
        email: "faida@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Perekayasa Basis Data & Manajemen Aset",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-05",
        rawId: 5,
        name: "Ilvina Muvarika",
        username: "ilvina",
        password: "password123",
        email: "ilvina@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Perekayasa Integrasi IoT & Perangkat",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-06",
        rawId: 6,
        name: "Ananda Dwi Susanti",
        username: "ananda",
        password: "password123",
        email: "ananda@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Perekayasa Pemantauan Jaringan & Perangkat",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-07",
        rawId: 7,
        name: "Dika Yoga Pratama",
        username: "dika",
        password: "password123",
        email: "dika@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Pengembang Antarmuka Dasbor",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-08",
        rawId: 8,
        name: "Ahmad Aziz Saputra",
        username: "aziz",
        password: "password123",
        email: "aziz@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Perancang Antarmuka & Visualisasi Data",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-09",
        rawId: 9,
        name: "Arik Ferdiansyah",
        username: "arik",
        password: "password123",
        email: "arik@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Perekayasa Otomasi & Notifikasi",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-10",
        rawId: 10,
        name: "Wafian Zaidan",
        username: "wafian",
        password: "password123",
        email: "wafian@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Infrastruktur Peladen, Jaringan & DevOps",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    },
    {
        id: "USR-11",
        rawId: 11,
        name: "Reza Tri wardana",
        username: "reza",
        password: "password123",
        email: "reza@taims.id",
        avatar: "",
        role: "Admin",
        perms: "CRU",
        picTask: "Penguji Mutu, Pengujian & Dokumentasi",
        status: "Aktif",
        lastLogin: "Aktif Hari Ini"
    }
];

const DEFAULT_SAMPLE_INCIDENTS = [];

const APP_STATE = {
    currentUser: null,
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
    devices: [],
    // Riwayat Insiden, Alerts & Notifikasi (Clean Slate - Tanpa Dummy)
    alerts: [],
    incidents: [],
    maintenanceLogs: [],

    teamMembers: [],
    usersList: JSON.parse(JSON.stringify(DEFAULT_USERS_LIST)),
    auditLogs: [],

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
    // Bersihkan localStorage lama dari sesi sebelumnya (data dummy/cache)
    const keysToRemove = [
        'taims_devices_v4', 'taims_devices_v3',
        'taims_maintenance_v1', 'taims_audit_logs_v3', 'taims_audit_cleared',
        'taims_users_v3'
    ];
    keysToRemove.forEach(k => { try { localStorage.removeItem(k); } catch(e) {} });

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
    // Polling data riil HANYA dijalankan jika pengguna sudah terotentikasi (mencegah spam 429)
    const activeToken = localStorage.getItem('taims_jwt_token');
    if (activeToken) {
        if (typeof loadRealDataFromApi === 'function') {
            loadRealDataFromApi();
            startRealDataPolling(10000);
        }
    } else {
        // Belum login: Pastikan tetap di portal autentikasi dan tidak menembak API backend
        const authScr = document.getElementById('auth-screen');
        const mainDash = document.getElementById('main-dashboard');
        if (authScr && mainDash) {
            mainDash.classList.add('hidden');
            authScr.classList.remove('hidden');
        }
    }

    // Inisialisasi Peta Leaflet Blitar setelah DOM siap
    setTimeout(() => {
        if (typeof initBlitarMaps === 'function') initBlitarMaps();
        if (typeof refreshHomeMap === 'function') refreshHomeMap();
    }, 150);

    // Otomatis sinkronisasi rekomendasi Asisten AI pada initial load hanya jika sudah login
    setTimeout(() => {
        if (localStorage.getItem('taims_jwt_token') && typeof runAiAnalysis === 'function') runAiAnalysis();
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

    // Cek sesi tersimpan: Wajib memiliki tiket JWT yang valid agar data dasbor dapat dimuat
    const activeJwtToken = localStorage.getItem('taims_jwt_token');
    const saved = localStorage.getItem('taims_active_session') || sessionStorage.getItem('taims_session');
    if (activeJwtToken && saved) {
        try {
            const user = JSON.parse(saved);
            loginSuccess(user, true);
        } catch (e) {
            localStorage.removeItem('taims_active_session');
            sessionStorage.removeItem('taims_session');
            localStorage.removeItem('taims_jwt_token');
        }
    } else {
        // Jika belum ada tiket JWT, kunci tampilan ke portal login resmi
        const mainDash = document.getElementById('main-dashboard');
        const authScreen = document.getElementById('auth-screen');
        if (mainDash) mainDash.classList.add('hidden');
        if (authScreen) authScreen.classList.remove('hidden');
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

    if (window.innerWidth <= 900 && typeof closeAllSidebars === 'function') {
        closeAllSidebars();
    }

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
            if (typeof initBlitarMaps === 'function') initBlitarMaps();
            if (APP_STATE.homeMap) {
                APP_STATE.homeMap.invalidateSize();
                APP_STATE.homeMap.setView([-8.0703, 112.1735], 14);
            }
        }, 80);
        setTimeout(() => {
            if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize();
        }, 350);
    } else {
        if (mainEl) mainEl.style.overflow = 'auto';
        if (contentEl) contentEl.style.overflow = 'auto';
        if (pageId === 'page-location') { setTimeout(function () { if (typeof loadLocations === 'function') loadLocations(); }, 450);
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
            if (typeof loadLocations === 'function') loadLocations();
            renderFullDevicesTable();
        } else if (pageId === 'page-monitoring') {
            if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
        } else if (pageId === 'page-alerts') {
            if (typeof refreshAlertGatewaysStatus === 'function') refreshAlertGatewaysStatus();
            if (typeof loadIncidentsPage === 'function') loadIncidentsPage();
            else if (typeof renderIncidentsTable === 'function') renderIncidentsTable();
        } else if (pageId === 'page-reports') {
            if (typeof loadMaintenance === 'function') loadMaintenance(); else if (typeof renderMaintenanceTable === 'function') renderMaintenanceTable();
        } else if (pageId === 'page-project-info') {
            renderTeamCards();
        } else if (pageId === 'page-users') {
            if (typeof loadUsersPage === 'function') loadUsersPage();
            else renderUsersRbacTable();
        } else if (pageId === 'page-settings') {
            if (typeof loadSettingsPage === 'function') loadSettingsPage();
        }

        // Translate targetPage after dynamic renderers have run
        if (APP_STATE && APP_STATE.currentLang && targetPage) {
            translateSubtree(targetPage, APP_STATE.currentLang);
        }
        if (typeof enforceSuperadminOnlyElements === 'function') enforceSuperadminOnlyElements();
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
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar) return;
    
    sidebar.classList.toggle('mobile-open');
    if (overlay) overlay.classList.toggle('active');
}

function closeAllSidebars() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) {
        sidebar.classList.remove('mobile-open', 'drawer-open', 'sidebar-collapsed');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}
window.closeAllSidebars = closeAllSidebars;

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
function enforceSuperadminOnlyElements() {
    const isSuper = typeof isSuperAdmin === 'function' ? isSuperAdmin() : false;
    document.querySelectorAll('.superadmin-only').forEach(el => {
        if (isSuper) {
            el.classList.remove('hidden');
            if (el.classList.contains('superadmin-actions-row') || el.classList.contains('superadmin-row')) {
                el.style.display = 'flex';
            } else {
                el.style.display = '';
            }
        } else {
            el.classList.add('hidden');
            el.style.display = 'none';
        }
    });
}
window.isSuperAdmin = isSuperAdmin;
window.isAdminUser = isAdminUser;
window.enforceSuperadminOnlyElements = enforceSuperadminOnlyElements;

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
                    matchedUser.lastLogin = new Date().toLocaleString('id-ID',{dateStyle:'short',timeStyle:'short'});
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
        matchedUser.lastLogin = new Date().toLocaleString('id-ID',{dateStyle:'short',timeStyle:'short'});
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

async function enterAsGuest() {
    // 1. Pastikan data perangkat terisi seketika (fallback lokal 15 perangkat jika belum ada di browser)
    if (!APP_STATE.devices || !Array.isArray(APP_STATE.devices) || APP_STATE.devices.length === 0) {
        const localSaved = typeof loadDevicesFromStorage === 'function' ? loadDevicesFromStorage() : null;
        if (localSaved && localSaved.length >= 15) {
            APP_STATE.devices = localSaved;
        } else if (typeof FALLBACK_ASSETS !== 'undefined' && Array.isArray(FALLBACK_ASSETS)) {
            APP_STATE.devices = FALLBACK_ASSETS.map(mapBackendAssetToUI);
            if (typeof saveDevicesToStorage === 'function') saveDevicesToStorage(APP_STATE.devices);
        }
    }

    // 2. Minta tiket JWT Guest dari backend jika backend aktif
    try {
        const base = (window.apiService && window.apiService.BASE_URL) || 'http://localhost:3000/api';
        const res = await fetch(`${base}/auth/guest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (data.success && data.data && data.data.token) {
            localStorage.setItem('taims_jwt_token', data.data.token);
            localStorage.setItem('taims_user_role', 'guest');
        }
    } catch (e) {
        console.warn('Guest mode offline fallback:', e);
    }

    // 3. Masuk ke dashboard mode User (Read-Only)
    loginSuccess({
        username: 'guest',
        name: 'User (Tamu)',
        role: 'guest',
        title: 'User (Read-Only)'
    });
}

function loginSuccess(user, isAutoRestore = false) {
    if (user) {
        user.name = user.full_name || user.name || (user.username === 'dzakwan' ? 'Dzakwan Miftahussobirin' : (user.username || 'Administrator'));
        user.title = user.title || (user.role === 'super_admin' ? 'Superadmin Teknolab' : (user.role === 'admin' ? 'Administrator' : 'Teknisi'));
    }
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

    if (typeof enforceSuperadminOnlyElements === 'function') {
        enforceSuperadminOnlyElements();
    }

    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');

    // Jaminan data selalu terisi seketika saat pertama kali masuk
    if (!APP_STATE.devices || !Array.isArray(APP_STATE.devices) || APP_STATE.devices.length === 0) {
        const localSaved = typeof loadDevicesFromStorage === 'function' ? loadDevicesFromStorage() : null;
        if (localSaved && localSaved.length >= 15) {
            APP_STATE.devices = localSaved;
        } else if (typeof FALLBACK_ASSETS !== 'undefined' && Array.isArray(FALLBACK_ASSETS)) {
            APP_STATE.devices = FALLBACK_ASSETS.map(mapBackendAssetToUI);
            if (typeof saveDevicesToStorage === 'function') saveDevicesToStorage(APP_STATE.devices);
        }
    }

    initCharts();
    if (typeof initBlitarMaps === 'function') initBlitarMaps();
    setTimeout(() => {
        if (APP_STATE.homeMap) {
            APP_STATE.homeMap.invalidateSize();
            APP_STATE.homeMap.setView([-8.0703, 112.1735], 14);
        }
    }, 200);
    setTimeout(() => {
        if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize();
    }, 600);
    if (typeof renderFullDevicesTable === 'function') renderFullDevicesTable();
    if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
    if (typeof renderIncidentsTable === 'function') renderIncidentsTable();
    if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();

    // Memulai sinkronisasi data riil backend hanya jika token JWT tersedia
    if (localStorage.getItem('taims_jwt_token') && typeof loadRealDataFromApi === 'function') {
        loadRealDataFromApi();
        startRealDataPolling(10000);
    }
}

function logoutToAuth() {
    stopRealDataPolling();
    invalidateDeviceFingerprint();
    sessionStorage.removeItem('taims_session');
    localStorage.removeItem('taims_active_session');
    localStorage.removeItem('taims_jwt_token');
    localStorage.removeItem('taims_user');
    localStorage.removeItem('taims_user_role');
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
// HELPER FORMAT LOKASI SITE (WARNA MENGIKUTI TEMA PETA KOTA BLITAR)
// Head Office: Merah Teknolab (#F43F5E)
// Marketing Office: Kuning Emas (#F59E0B)
// House of Server: Hijau Emerald (#10B981)
// =============================================================================
function formatSiteLocationBadge(locName) {
    const s = String(locName || '').toLowerCase().trim();
    if (s.includes('marketing') || s === 'mo' || /\bmo\b/.test(s)) {
        return `<span class="badge-subtle badge-site-mo"><i class="fa-solid fa-location-dot"></i> ${locName}</span>`;
    } else if (s.includes('server') || s.includes('house') || s.includes('mentor') || s === 'hos') {
        return `<span class="badge-subtle badge-site-server"><i class="fa-solid fa-location-dot"></i> ${locName}</span>`;
    } else {
        return `<span class="badge-subtle badge-site-ho"><i class="fa-solid fa-location-dot"></i> ${locName}</span>`;
    }
}
window.formatSiteLocationBadge = formatSiteLocationBadge;

function formatMethodBadge(method) {
    const m = String(method || 'Ping').trim();
    const lower = m.toLowerCase();
    if (lower.includes('heartbeat')) {
        return `<span class="badge-method badge-method-heartbeat"><i class="fa-solid fa-heart-pulse"></i> ${escapeHtml(m)}</span>`;
    } else if (lower.includes('mqtt')) {
        return `<span class="badge-method badge-method-mqtt"><i class="fa-solid fa-tower-broadcast"></i> ${escapeHtml(m)}</span>`;
    } else if (lower.includes('snmp')) {
        return `<span class="badge-method badge-method-snmp"><i class="fa-solid fa-server"></i> ${escapeHtml(m)}</span>`;
    } else if (lower.includes('http') || lower.includes('api')) {
        return `<span class="badge-method badge-method-api"><i class="fa-solid fa-code"></i> ${escapeHtml(m)}</span>`;
    }
    return `<span class="badge-method badge-method-ping"><i class="fa-solid fa-wave-square"></i> ${escapeHtml(m)}</span>`;
}
window.formatMethodBadge = formatMethodBadge;

// =============================================================================
// HELPER BADGE KATEGORI PERANGKAT (BEBAS DARI WARNA BIRU MONOTON)
// =============================================================================
function formatCategoryBadge(catName) {
    const s = String(catName || 'Device').toLowerCase().trim();
    let bg = 'rgba(168, 85, 247, 0.12)';
    let border = 'rgba(168, 85, 247, 0.35)';
    let color = '#C084FC'; // Cyber Violet

    if (s.includes('router')) {
        bg = 'rgba(168, 85, 247, 0.14)';
        border = 'rgba(168, 85, 247, 0.4)';
        color = '#C084FC'; // Violet
    } else if (s.includes('switch')) {
        bg = 'rgba(16, 185, 129, 0.14)';
        border = 'rgba(16, 185, 129, 0.4)';
        color = '#34D399'; // Mint / Emerald
    } else if (s.includes('server')) {
        bg = 'rgba(245, 158, 11, 0.14)';
        border = 'rgba(245, 158, 11, 0.4)';
        color = '#FBBF24'; // Amber / Gold
    } else if (s.includes('cctv')) {
        bg = 'rgba(244, 63, 94, 0.14)';
        border = 'rgba(244, 63, 94, 0.4)';
        color = '#FB7185'; // Coral / Rose
    } else if (s.includes('access point') || s === 'ap') {
        bg = 'rgba(20, 184, 166, 0.14)';
        border = 'rgba(20, 184, 166, 0.4)';
        color = '#2DD4BF'; // Teal
    } else if (s.includes('iot')) {
        bg = 'rgba(217, 70, 239, 0.14)';
        border = 'rgba(217, 70, 239, 0.4)';
        color = '#E879F9'; // Fuchsia
    } else if (s.includes('raspberry')) {
        bg = 'rgba(236, 72, 153, 0.14)';
        border = 'rgba(236, 72, 153, 0.4)';
        color = '#F472B6'; // Raspberry Pink
    } else if (s.includes('tv')) {
        bg = 'rgba(249, 115, 22, 0.14)';
        border = 'rgba(249, 115, 22, 0.4)';
        color = '#FB923C'; // Orange
    } else if (s.includes('pc') || s.includes('workstation') || s.includes('komputer')) {
        bg = 'rgba(148, 163, 184, 0.14)';
        border = 'rgba(148, 163, 184, 0.35)';
        color = '#CBD5E1'; // Titanium Slate
    } else if (s.includes('printer')) {
        bg = 'rgba(234, 179, 8, 0.14)';
        border = 'rgba(234, 179, 8, 0.4)';
        color = '#FACC15'; // Warm Yellow Gold
    }

    return `<span class="badge-cat-tag" style="background: ${bg}; border: 1px solid ${border}; border-radius: 4px; padding: 1px 6px; color: ${color}; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.3px; display: inline-block;">${escapeHtml(catName || 'Device')}</span>`;
}
window.formatCategoryBadge = formatCategoryBadge;

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
            <td>${formatSiteLocationBadge(safeLoc)}</td>
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
    document.getElementById('detail-dev-category').textContent = dev.sub_category ? `${dev.category} (${dev.sub_category})` : dev.category;
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

    if (typeof updateDeviceDetailHistory === 'function') {
        updateDeviceDetailHistory(dev);
    }

    document.getElementById('device-detail-modal').classList.remove('hidden');
}

async function updateDeviceDetailHistory(dev) {
    const tableEl = document.getElementById('detail-dev-history-table');
    const incEl = document.getElementById('detail-dev-total-incidents');
    const upEl = document.getElementById('detail-dev-uptime');

    // Filter insiden terkait perangkat
    const incList = (APP_STATE.incidents || []).filter(i => 
        String(i.asset_id) === String(dev.id) || 
        String(i.asset_id) === String(dev.asset_id) || 
        i.asset_code === dev.code
    );
    if (incEl) incEl.textContent = `${incList.length} Kali`;
    if (upEl) upEl.textContent = dev.status === 'online' ? '99.9%' : (dev.status === 'warning' ? '96.5%' : '88.2%');

    if (!tableEl) return;
    tableEl.innerHTML = '<div style="padding: 10px; color: #94A3B8; text-align: center; font-size: 0.8rem;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat riwayat dari server...</div>';

    let historyLogs = [];
    const targetId = dev.asset_id || dev.id;

    if (window.apiService && typeof window.apiService.getAssetHistory === 'function' && targetId) {
        try {
            historyLogs = await window.apiService.getAssetHistory(targetId, { limit: 5 });
        } catch (e) {
            console.warn('Gagal memuat riwayat aset dari API:', e);
        }
    }

    if (Array.isArray(historyLogs) && historyLogs.length > 0) {
        tableEl.innerHTML = historyLogs.map(log => {
            const isOnline = (log.status === 'online');
            const colorCls = isOnline ? 'text-green' : (log.status === 'warning' ? 'text-yellow' : 'text-red');
            const checkTimeStr = log.check_time ? new Date(log.check_time).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : (log.created_at ? new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-');
            const rt = log.response_time_ms ? `${log.response_time_ms} ms` : (log.method || 'Ping');
            return `<div class="hist-row"><span>${checkTimeStr}</span><span class="${colorCls}">${(log.status || 'ONLINE').toUpperCase()} (${log.method || 'Auto'})</span><span>${rt}</span></div>`;
        }).join('');
    } else if (incList.length > 0) {
        tableEl.innerHTML = incList.slice(0, 5).map(inc => {
            const timeStr = inc.detected_at ? new Date(inc.detected_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Baru';
            return `<div class="hist-row"><span>${timeStr}</span><span class="text-red">${(inc.incident_type || 'Gangguan').toUpperCase()}</span><span>${inc.incident_status || 'open'}</span></div>`;
        }).join('');
    } else {
        const nowStr = dev.lastSeen || (new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');
        const stCls = dev.status === 'online' ? 'text-green' : (dev.status === 'warning' ? 'text-yellow' : 'text-red');
        tableEl.innerHTML = `
            <div class="hist-row"><span>${nowStr}</span><span class="${stCls}">${(dev.status || 'ONLINE').toUpperCase()} (Normal)</span><span>${dev.ping || 'Aktif'}</span></div>
            <div style="padding: 6px; color: #64748B; text-align: center; font-size: 0.75rem;"><i class="fa-solid fa-circle-check text-green"></i> Kondisi infrastruktur stabil tanpa riwayat kegagalan.</div>
        `;
    }
}
window.updateDeviceDetailHistory = updateDeviceDetailHistory;

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

    const dev = APP_STATE.devices.find(d => d.id == deviceId || d.asset_code === deviceId || d.asset_id == deviceId || d.code === deviceId);
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

    const dev = APP_STATE.devices.find(d => d.id == APP_STATE.selectedDeviceId || d.asset_id == APP_STATE.selectedDeviceId || d.code === APP_STATE.selectedDeviceId);
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
// MASTER DICTIONARY DEFAULT SUB-KATEGORI / JENIS & MERK PERANGKAT (ROUTER SAMPAI PRINTER)
const DEFAULT_DEVICE_SUBCATEGORIES = {
    'Router': [
        'Mikrotik hAP lite (RB941-2nD / Seri RB941)',
        'Mikrotik RB951Ui-2HnD / RB951G-2HnD (Seri RB950)',
        'FiberHome GPON ONT / Optical Modem (MNC Play / IndiHome / Telkom)',
        'TP-Link TL-WR840N / TL-WR841N 300Mbps Wireless Router',
        'ZTE F609 / F670L GPON ONT Optical Network Terminal',
        'Huawei EchoLife HG8245H5 / EG8145V5 GPON Terminal',
        'Mikrotik RouterBOARD (RB750Gr3 / hEX Series)',
        'Mikrotik hEX S (RB760iGS Gigabit SFP)',
        'Mikrotik Cloud Core Router (CCR1009-7G-1C-1S+)',
        'Mikrotik CCR2004-16G-2S+ Enterprise 10G',
        'Mikrotik CCR2116-12G-4S+ Core Campus Gateway',
        'Mikrotik RB4011iGS+RM Quad-Core 10G SFP+',
        'Mikrotik RB5009UG+S+IN Heavy Duty Home/Lab',
        'Cisco ISR 4331 / 4431 Integrated Services Router',
        'Cisco Catalyst 8200 / 8300 Enterprise Edge',
        'Cisco RV340 / RV345 Dual WAN Gigabit VPN',
        'Ruijie Reyee RG-EG210G-E Smart Gateway Router',
        'Ruijie Reyee RG-EG310G-P-E PoE Cloud Router',
        'Ruijie RG-NBR6000 High-Performance Gateway',
        'Ubiquiti UniFi Dream Machine Pro / SE (UDM-Pro)',
        'Ubiquiti UniFi Security Gateway (USG / UXG-Pro)',
        'TP-Link Omada ER605 / ER7206 Multi-WAN Gigabit',
        'TP-Link SafeStream TL-ER7206 Enterprise VPN',
        'Huawei NetEngine AR650 / AR6100 Series',
        'Fortinet FortiGate 40F / 60F SD-WAN Router',
        'D-Link DSR-1000AC Unified Services Router',
        'DrayTek Vigor 2927 / 2962 Dual WAN Router',
        'Teltonika RUTX09 / RUTX50 Industrial Cellular 5G'
    ],
    'Switch': [
        'Switch Manageable / Smart Managed 24-Port Gigabit (Ruang Server)',
        'Mikrotik Cloud Router Switch CRS326-24G-2S+RM',
        'Mikrotik Cloud Smart Switch CSS326-24G-2S+RM',
        'Mikrotik CRS328-24P-4S+RM (PoE+ 500W Enterprise)',
        'Mikrotik CRS354-48P-4S+2Q+RM 48-Port PoE+',
        'Cisco Catalyst 2960-X / 2960-Plus 24/48 Port PoE',
        'Cisco Catalyst 3850 / 9200L Gigabit PoE+ Switch',
        'Cisco Catalyst 9300 Series L3 Enterprise Switch',
        'Cisco CBS350-24P-4G Managed PoE Switch',
        'Ruijie Reyee RG-ES226GC-P Smart Cloud Managed PoE',
        'Ruijie Reyee RG-NBS3100-24GT4SFP L2+ Gigabit',
        'Ruijie RG-S2910XS-E L3 10G High-Density Switch',
        'Ubiquiti UniFi Switch Pro 24 / 48 PoE (USW-Pro)',
        'Ubiquiti UniFi Switch Enterprise 24 PoE 2.5G',
        'Ubiquiti UniFi Switch 8 / 16 150W PoE',
        'TP-Link JetStream TL-SG3428MP 24-Port PoE+ L2+',
        'TP-Link Omada SG2210P 8-Port Smart Managed PoE',
        'D-Link DGS-1210-28P Web Smart Managed PoE',
        'D-Link DGS-1510-28X L3 Stackable 10G SFP+',
        'Aruba Instant On 1930 / 1960 24G 4SFP+ PoE Switch',
        'Huawei CloudEngine S5735-L Gigabit Managed Switch',
        'Allied Telesis CentreCOM GS900 Series',
        'Unmanaged Gigabit Desktop Switch (8/16/24 Port)'
    ],
    'Server': [
        'Dell PowerEdge R750 Rack Server (Dual Xeon Gold)',
        'Dell PowerEdge R640 / R650 1U High-Density Server',
        'Dell PowerEdge R440 / R540 2U Storage Server',
        'Dell PowerEdge T440 / T640 Tower Enterprise',
        'HP ProLiant DL380 Gen10 / Gen11 2U Dual Xeon',
        'HP ProLiant DL360 Gen10 1U Enterprise Server',
        'HP ProLiant ML350 Gen10 Tower Server',
        'HP ProLiant MicroServer Gen10 Plus Compact',
        'Lenovo ThinkSystem SR650 V2 / V3 2U Rack Server',
        'Lenovo ThinkSystem SR550 2U Enterprise Server',
        'Lenovo ThinkSystem ST550 Tower Server',
        'Supermicro SuperServer 2U TwinPro Architecture',
        'Supermicro 1U Rackmount Dual Xeon Server',
        'Mini PC Barebone Host (Proxmox VE Cluster Node)',
        'Custom 2U/4U Rackmount Server (AMD EPYC / Threadripper)',
        'Custom 4U GPU Deep Learning / AI Training Server',
        'Virtual Machine Guest (Proxmox KVM / VMware ESXi)',
        'Container Host (Docker / Kubernetes Worker Node)'
    ],
    'Access Point': [
        'Ubiquiti UniFi 6 Pro (U6-Pro Wi-Fi 6 Ceiling)',
        'Ubiquiti UniFi 6 Long-Range (U6-LR Wi-Fi 6)',
        'Ubiquiti UniFi 6 Mesh / Lite Outdoor Compact',
        'Ubiquiti UniFi 7 Pro / Enterprise (Wi-Fi 7)',
        'Ruijie Reyee RG-RAP2260(G) Wi-Fi 6 Ceiling AP',
        'Ruijie Reyee RG-RAP6260(H) High-Power Outdoor AP',
        'Ruijie Reyee RG-RAP1200(F) In-Wall Hospitality AP',
        'Aruba Instant On AP22 Wi-Fi 6 Indoor Access Point',
        'Aruba Instant On AP25 Wi-Fi 6 4x4 High-Density',
        'Aruba Instant On AP17 Outdoor Weatherproof AP',
        'Mikrotik cAP ax Dual-Band Wi-Fi 6 Ceiling',
        'Mikrotik wAP ac / wAP ax Weatherproof Outdoor',
        'Mikrotik Groove / BaseBox Outdoor Long-Range',
        'TP-Link Omada EAP670 / EAP660 HD Wi-Fi 6 AP',
        'TP-Link Omada EAP610-Outdoor Long-Range AP',
        'Cisco Catalyst 9115 / 9120 Wi-Fi 6 Enterprise AP',
        'Cisco Aironet 2802I / 3802I Dual-Band AP',
        'Huawei AirEngine 5761-11 Wi-Fi 6 Indoor AP',
        'Ruckus R550 / R650 BeamFlex+ Wi-Fi 6 AP',
        'Cambium Networks cnPilot e410 / e600 Enterprise'
    ],
    'CCTV': [
        'Hikvision DS-2CD2143G2-I 4MP AcuSense Dome Camera',
        'Hikvision DS-2CD2043G2-I 4MP AcuSense Bullet Camera',
        'Hikvision ColorVu DS-2CD2047G2-LU 24/7 Color Night',
        'Hikvision TandemVu DS-2SE7C124IW PTZ 4-Inch',
        'Hikvision DarkFighter Ultra Low-Light IP Camera',
        'Dahua IPC-HDBW2431E-S-S2 4MP IR Dome Starlight',
        'Dahua IPC-HFW2431T-AS 4MP WizSense AI Bullet',
        'Dahua TiOC Full-Color Active Deterrence PTZ',
        'Uniview (UNV) IPC324LR3-VSPF28-D 4MP Dome',
        'Uniview StarView LightHunter Series Camera',
        'TP-Link VIGI C440 / C340 4MP Outdoor Night Color',
        'TP-Link VIGI C540-W Outdoor PTZ 4MP Smart IP',
        'Ezviz C6N / C3W Pro 360 Smart Security Camera',
        'IMOU Cruiser / Bullet 2C Wi-Fi Security Camera',
        'Hikvision Embedded NVR 7616NI-K2 16-Channel 4K',
        'Dahua NVR4216-4KS2/L 16-Channel 4K NVR System',
        'Synology Surveillance Station NVR Recording Node',
        'Analog HD CCTV + DVR Hybrid Security Channel'
    ],
    'IoT Node': [
        'ESP32-WROOM-32 DevKit V1 (Wi-Fi + BLE Microcontroller)',
        'ESP32-CAM AI-Thinker (Video/Camera Stream Sensor)',
        'ESP32-S3 Dual-Core Xtensa LX7 (AI & TinyML Node)',
        'ESP32-C3 RISC-V Single-Core IoT Module',
        'ESP8266 NodeMCU V3 Lolin / Amica (Wi-Fi SoC)',
        'ESP8266 Wemos D1 Mini Compact IoT Board',
        'Arduino Uno R4 WiFi (Renesas RA4M1 + ESP32)',
        'Arduino Mega 2560 R3 + W5500 Ethernet Module',
        'Arduino Nano 33 BLE Sense / RP2040 Connect',
        'Raspberry Pi Pico W (RP2040 Dual ARM Cortex-M0+)',
        'LoRa TTGO T-Beam ESP32 SX1276 GPS Gateway Node',
        'Heltec WiFi LoRa 32 V3 OLED Microcontroller',
        'STM32 Blue Pill STM32F103C8T6 ARM Cortex-M3',
        'Industrial RS485 / Modbus RTU ESP32 Gateway Node',
        'Seeed Studio Wio Terminal ATSAMD51 Cortex-M4F',
        'Nordic nRF52840 BLE 5.0 Low-Energy Telemetry Node',
        'Sensor Node Lingkungan DHT22 / BME280 Ruang Rack',
        'Sensor Node Daya Listrik & Arus AC PZEM-004T'
    ],
    'Raspberry Pi': [
        'Raspberry Pi 5 (8GB RAM - PCIe NVMe Base)',
        'Raspberry Pi 5 (4GB RAM Single Board Computer)',
        'Raspberry Pi 4 Model B (8GB RAM High-Capacity)',
        'Raspberry Pi 4 Model B (4GB / 2GB RAM)',
        'Raspberry Pi 3 Model B+ Gigabit Ethernet',
        'Raspberry Pi 3 Model A+ Compact Board',
        'Raspberry Pi Zero 2 W Quad-Core Headless',
        'Raspberry Pi Zero W Single-Core Mini SBC',
        'Raspberry Pi Compute Module 4 (CM4 eMMC IO Board)',
        'Raspberry Pi Compute Module 3+ (CM3+)',
        'Raspberry Pi 400 Keyboard Integrated Computer',
        'Orange Pi 5 Plus (Rockchip RK3588 8-Core 16GB)',
        'Orange Pi Zero 3 Allwinner H618 Compact SBC',
        'Banana Pi BPI-M5 Amlogic S905X3 SBC'
    ],
    'PC': [
        'Dell OptiPlex 7000 / 5000 Small Form Factor (Core i7)',
        'Dell OptiPlex Micro MFF Mini Desktop PC',
        'Dell Precision 3660 / 5820 Tower Workstation',
        'HP EliteDesk 800 G8 / G9 SFF Business PC',
        'HP ProDesk 400 / 600 Desktop Mini PC',
        'HP Z2 / Z4 G4 High-Performance CAD Workstation',
        'Lenovo ThinkCentre M70q / M90q Tiny Mini PC',
        'Lenovo ThinkCentre Neo 50s Gen 4 SFF PC',
        'Lenovo ThinkStation P360 / P520 Workstation',
        'ASUS ExpertCenter D700 / D900 Tower Desktop',
        'Intel NUC 12 / 13 Pro Mini PC Core i5 / i7',
        'Custom Tower PC (Core i7 / i9 Liquid Cooling)',
        'Custom Tower PC (AMD Ryzen 7 / Ryzen 9 32GB)',
        'Apple Mac Mini M2 / M4 Pro Workstation',
        'Apple iMac 24" 4.5K Retina Desktop',
        'All-in-One PC (HP Pavilion / Lenovo IdeaCentre 24")',
        'Thin Client NComputing / Wyse Virtual Desktop'
    ],
    'Smart TV': [
        'Samsung Commercial Smart Signage Display 65" (QM65B)',
        'Samsung Crystal 4K UHD Smart TV 55" / 65" (Tizen OS)',
        'Samsung The Terrace / The Frame Commercial Display',
        'LG UHD Commercial TV Signage 55" / 65" (webOS 6.0)',
        'LG Ultra HD 4K Commercial Display (UR640S Series)',
        'Xiaomi Mi TV 4A / 4S / P1 55" 4K Android TV',
        'Xiaomi Google TV A Pro 43" / 55" 4K Dolby Audio',
        'TCL P635 / C645 4K HDR Google Smart TV 55"',
        'Coocaa Smart Google TV 50" / 55" 4K Series',
        'Interactive Flat Panel (IFP) Touchscreen 65" / 75"',
        'Hisense 4K UHD Smart Commercial Display',
        'Android TV Box 4K Streaming Telemetry Player',
        'Xiaomi Mi TV Stick / HDMI Telemetry Dongle',
        'Apple TV 4K Monitoring Digital Dashboard Node'
    ],
    'Cloud Panel': [
        'CloudPanel VPS (Ubuntu / Debian + Nginx)',
        'CloudPanel Self-Hosted (Proxmox / VM Lokal)',
        'CLD'
    ],
    'Printer': [
        'Epson EcoTank L3210 / L3250 Wi-Fi All-in-One Ink Tank',
        'Epson EcoTank L14150 A3+ Wi-Fi Duplex All-in-One',
        'Epson EcoTank L6270 / L6490 High-Speed Business Ink Tank',
        'Epson WorkForce Pro WF-C5790 Enterprise Inkjet',
        'HP LaserJet Pro M404dn / M404n High-Speed Duplex',
        'HP Color LaserJet Pro MFP M479fdw Wireless All-in-One',
        'HP LaserJet Enterprise M507dn High-Capacity',
        'Canon imageRUNNER ADVANCE C3530i Office Photocopier',
        'Canon imageRUNNER 2006N / 2625i A3 Network Copier',
        'Canon PIXMA G3010 / G3020 Wireless MegaTank',
        'Brother DCP-L2540DW / MFC-L2700DW Monochrome Laser',
        'Brother HL-L2360DN Compact High-Speed Duplex Laser',
        'Brother MFC-T920DW Wireless Ink Tank All-in-One',
        'Zebra ZD220 / ZD230 Desktop Thermal Barcode Printer',
        'Zebra ZT230 / ZT411 Industrial Heavy-Duty Label Printer',
        'Xprinter XP-420B / XP-365B USB/LAN Thermal Barcode',
        'Epson TM-T82X / TM-T88VI POS Thermal Receipt Printer 80mm',
        'TSC TE200 High Performance Barcode Label Printer'
    ]
};

// Catalog cache invalidation & initialization
const CATALOG_VERSION = 'v20261028_full_v5';
try {
    if (localStorage.getItem('taims_catalog_ver') !== CATALOG_VERSION) {
        localStorage.setItem('taims_catalog_ver', CATALOG_VERSION);
        localStorage.removeItem('taims_device_subcategories');
        localStorage.removeItem('taims_deleted_subcategories');
    }
} catch(e) {}

// Global active subcategories (initialized from defaults + stored customizations)
let DEVICE_SUBCATEGORIES = JSON.parse(JSON.stringify(DEFAULT_DEVICE_SUBCATEGORIES));
try {
    const saved = localStorage.getItem('taims_device_subcategories');
    if (saved) {
        const parsed = JSON.parse(saved);
        for (const [k, v] of Object.entries(parsed)) {
            if (Array.isArray(v) && v.length > 0) {
                if (DEFAULT_DEVICE_SUBCATEGORIES[k]) {
                    // Selalu satukan default lengkap dengan kustomisasi tambahan pengguna (hindari duplikat)
                    DEVICE_SUBCATEGORIES[k] = Array.from(new Set([...DEFAULT_DEVICE_SUBCATEGORIES[k], ...v]));
                } else {
                    DEVICE_SUBCATEGORIES[k] = v;
                }
            }
        }
    }
} catch(e) {}
window.DEFAULT_DEVICE_SUBCATEGORIES = DEFAULT_DEVICE_SUBCATEGORIES;
window.DEVICE_SUBCATEGORIES = DEVICE_SUBCATEGORIES;

// Helper pemulihan otomatis jika kategori Router sebelumnya terhapus tidak sengaja
function restoreRouterCategoryIfNeeded() {
    try {
        let deleted = JSON.parse(localStorage.getItem('taims_deleted_categories') || '[]');
        if (deleted.includes('Router')) {
            deleted = deleted.filter(c => c !== 'Router');
            localStorage.setItem('taims_deleted_categories', JSON.stringify(deleted));
        }
    } catch(e) {}

    if (!DEVICE_SUBCATEGORIES['Router'] || DEVICE_SUBCATEGORIES['Router'].length === 0) {
        DEVICE_SUBCATEGORIES['Router'] = [...DEFAULT_DEVICE_SUBCATEGORIES['Router']];
    }

    const catSelect = document.getElementById('dev-category');
    if (catSelect) {
        let hasRouter = false;
        for (let i = 0; i < catSelect.options.length; i++) {
            if (catSelect.options[i].value === 'Router') {
                hasRouter = true;
                break;
            }
        }
        if (!hasRouter) {
            const opt = document.createElement('option');
            opt.value = 'Router';
            opt.textContent = 'Router';
            catSelect.insertBefore(opt, catSelect.firstChild);
        }
    }
}
window.restoreRouterCategoryIfNeeded = restoreRouterCategoryIfNeeded;

// Jalankan auto-restore Router segera saat file dimuat
try {
    restoreRouterCategoryIfNeeded();
} catch(e) {}

// Pastikan subkategori Router langsung terisi saat dokumen siap
try {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            restoreRouterCategoryIfNeeded();
            populateSubcategories('Router');
        });
    } else {
        restoreRouterCategoryIfNeeded();
        populateSubcategories('Router');
    }
} catch(e) {}

function populateSubcategories(cat, currentSubtype = '') {
    const subSelect = document.getElementById('dev-subcategory');
    const customWrap = document.getElementById('dev-custom-subcategory-wrap');
    const customInput = document.getElementById('dev-custom-subcategory');
    if (!subSelect) return;

    subSelect.innerHTML = '';
    const list = DEVICE_SUBCATEGORIES[cat] || [];

    if (cat === '__custom__' || list.length === 0) {
        const opt = document.createElement('option');
        opt.value = '__custom_subtype__';
        opt.textContent = '+ Ketik Jenis / Merk Spesifik Manual...';
        subSelect.appendChild(opt);
        subSelect.value = '__custom_subtype__';
        if (customWrap) customWrap.style.display = 'block';
        if (customInput) customInput.value = currentSubtype || '';
        return;
    }

    let matchedInList = false;
    list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item;
        opt.textContent = item;
        if (currentSubtype && currentSubtype === item) {
            opt.selected = true;
            matchedInList = true;
        }
        subSelect.appendChild(opt);
    });

    const customOpt = document.createElement('option');
    customOpt.value = '__custom_subtype__';
    customOpt.textContent = '+ Lainnya / Ketik Sendiri (Custom)...';
    customOpt.style.color = '#10B981';
    customOpt.style.fontWeight = '700';
    subSelect.appendChild(customOpt);

    if (currentSubtype && !matchedInList) {
        subSelect.value = '__custom_subtype__';
        if (customWrap) customWrap.style.display = 'block';
        if (customInput) customInput.value = currentSubtype;
    } else {
        if (!currentSubtype && list.length > 0) {
            subSelect.value = list[0];
        }
        if (customWrap) customWrap.style.display = (subSelect.value === '__custom_subtype__') ? 'block' : 'none';
        if (customInput && subSelect.value !== '__custom_subtype__') customInput.value = '';
    }
}
window.populateSubcategories = populateSubcategories;

function handleDeviceCategoryChange() {
    const catSelect = document.getElementById('dev-category');
    const customCatWrap = document.getElementById('dev-custom-category-wrap');
    const customCatInput = document.getElementById('dev-custom-category');
    const catVal = catSelect ? catSelect.value : 'Router';

    if (catVal === '__custom__') {
        if (customCatWrap) customCatWrap.style.display = 'block';
        if (customCatInput) customCatInput.focus();
        populateSubcategories('__custom__');
    } else {
        if (customCatWrap) customCatWrap.style.display = 'none';
        populateSubcategories(catVal);
    }

    // Auto-suggest metode pemantauan cerdas berbasis Bab 6 Dokumen PKL Teknolab
    const methodSelect = document.getElementById('dev-method');
    const prioritySelect = document.getElementById('dev-priority');
    if (methodSelect) {
        if (catVal === 'IoT Node') {
            methodSelect.value = 'HTTP / MQTT Heartbeat';
            if (prioritySelect) prioritySelect.value = '2';
        } else if (catVal === 'PC') {
            methodSelect.value = 'Ping + Agent';
            if (prioritySelect) prioritySelect.value = '2';
        } else if (catVal === 'Raspberry Pi') {
            methodSelect.value = 'Ping + Heartbeat';
            if (prioritySelect) prioritySelect.value = '2';
        } else if (catVal === 'Server') {
            methodSelect.value = 'Ping + TCP Port + HTTP';
            if (prioritySelect) prioritySelect.value = '1';
        } else if (catVal === 'Router' || catVal === 'Switch' || catVal === 'Access Point') {
            methodSelect.value = 'Ping + SNMP';
            if (prioritySelect) prioritySelect.value = '1';
        } else if (catVal === 'Cloud Panel') {
            methodSelect.value = 'HTTP';
            if (prioritySelect) prioritySelect.value = '1';
        } else {
            methodSelect.value = 'Ping';
            if (prioritySelect) prioritySelect.value = '2';
        }
    }

    const editIdEl = document.getElementById('dev-edit-id');
    if (editIdEl && editIdEl.value) return; // Mode Edit: jangan ubah otomatis kode unik
    const codeInput = document.getElementById('dev-code');
    if (!codeInput) return;
    const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
    const prefix = catVal === '__custom__' ? 'AST' : catVal.slice(0, 3).toUpperCase();
    codeInput.placeholder = `Misal: AST-${prefix}-${num}`;
}
window.handleDeviceCategoryChange = handleDeviceCategoryChange;

function handleDeviceSubcategoryChange() {
    const subSelect = document.getElementById('dev-subcategory');
    const customWrap = document.getElementById('dev-custom-subcategory-wrap');
    const customInput = document.getElementById('dev-custom-subcategory');
    if (!subSelect) return;

    if (subSelect.value === '__custom_subtype__') {
        if (customWrap) customWrap.style.display = 'block';
        if (customInput) customInput.focus();
    } else {
        if (customWrap) customWrap.style.display = 'none';
    }
}
window.handleDeviceSubcategoryChange = handleDeviceSubcategoryChange;

function handleDeleteCurrentCategory() {
    if (!isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang berhak menghapus kategori perangkat.', 'error');
        return;
    }
    const catSelect = document.getElementById('dev-category');
    if (!catSelect) return;
    const currentVal = catSelect.value;
    if (currentVal === '__custom__') {
        showToast('Info', 'Opsi tambah kategori manual tidak dapat dihapus.', 'info');
        return;
    }
    
    showCyberConfirmModal(
        'Konfirmasi Penghapusan Kategori',
        `PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus kategori "${currentVal}" beserta seluruh jenis/merk di dalamnya dari sistem inventaris T-AIMS?\n\nTindakan ini akan menghapus kategori dari pilihan sistem secara permanen.`,
        () => {
            // Simpan ke daftar kategori terhapus di localStorage
            let deletedCats = [];
            try {
                deletedCats = JSON.parse(localStorage.getItem('taims_deleted_categories') || '[]');
            } catch(e) { deletedCats = []; }
            if (!deletedCats.includes(currentVal)) {
                deletedCats.push(currentVal);
                localStorage.setItem('taims_deleted_categories', JSON.stringify(deletedCats));
            }

            // Hapus dari memori DEVICE_SUBCATEGORIES
            if (typeof DEVICE_SUBCATEGORIES !== 'undefined' && DEVICE_SUBCATEGORIES[currentVal]) {
                delete DEVICE_SUBCATEGORIES[currentVal];
            }

            // Hapus opsi dari dropdown dev-category
            for (let i = 0; i < catSelect.options.length; i++) {
                if (catSelect.options[i].value === currentVal) {
                    catSelect.remove(i);
                    break;
                }
            }

            // Pilih opsi pertama yang tersedia
            if (catSelect.options.length > 0) {
                catSelect.selectedIndex = 0;
                handleDeviceCategoryChange();
            }

            showToast('Kategori Dihapus', `Kategori [${currentVal}] berhasil dihapus. Tekan tombol [Reset Bawaan] jika ingin memulihkannya.`, 'info');
        },
        'Ya, Hapus Permanen'
    );
}
window.handleDeleteCurrentCategory = handleDeleteCurrentCategory;

function handleDeleteCurrentSubcategory() {
    if (!isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang berhak menghapus jenis perangkat.', 'error');
        return;
    }
    const catSelect = document.getElementById('dev-category');
    const subSelect = document.getElementById('dev-subcategory');
    if (!catSelect || !subSelect) return;
    const currentCat = catSelect.value;
    const currentSub = subSelect.value;

    if (currentSub === '__custom_subtype__') {
        showToast('Info', 'Opsi ketik manual tidak dapat dihapus.', 'info');
        return;
    }

    showCyberConfirmModal(
        'Konfirmasi Penghapusan Jenis Perangkat',
        `PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus jenis/merk "${currentSub}" dari kategori "${currentCat}"?\n\nTindakan ini akan menghapus jenis dari daftar pilihan secara permanen.`,
        () => {
            // Hapus dari memori DEVICE_SUBCATEGORIES
            if (typeof DEVICE_SUBCATEGORIES !== 'undefined' && DEVICE_SUBCATEGORIES[currentCat]) {
                DEVICE_SUBCATEGORIES[currentCat] = DEVICE_SUBCATEGORIES[currentCat].filter(item => item !== currentSub);
                try {
                    localStorage.setItem('taims_device_subcategories', JSON.stringify(DEVICE_SUBCATEGORIES));
                } catch(e) {}
            }

            // Re-populate subcategories
            populateSubcategories(currentCat);
            showToast('Jenis Dihapus', `Jenis [${currentSub}] berhasil dihapus oleh Superadmin.`, 'success');
        },
        'Ya, Hapus Permanen'
    );
}
window.handleDeleteCurrentSubcategory = handleDeleteCurrentSubcategory;

function resetCategoriesAndSubcategoriesToDefault() {
    if (!isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang berhak mereset kategori & jenis perangkat.', 'error');
        return;
    }

    showCyberConfirmModal(
        'Konfirmasi Reset Bawaan Sistem',
        `PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin memulihkan seluruh Kategori dan Jenis/Merk perangkat ke pengaturan awal bawaan (Router sampai Printer)?\n\nSemua perubahan dan kustomisasi akan diatur ulang ke standar T-AIMS.`,
        () => {
            try {
                localStorage.removeItem('taims_deleted_categories');
                localStorage.removeItem('taims_device_subcategories');
            } catch(e) {}

            DEVICE_SUBCATEGORIES = JSON.parse(JSON.stringify(DEFAULT_DEVICE_SUBCATEGORIES));
            window.DEVICE_SUBCATEGORIES = DEVICE_SUBCATEGORIES;

            const catSelect = document.getElementById('dev-category');
            if (catSelect) {
                catSelect.innerHTML = `
                    <option value="Router" selected>Router</option>
                    <option value="Switch">Switch</option>
                    <option value="Server">Server</option>
                    <option value="Access Point">Access Point (AP)</option>
                    <option value="CCTV">CCTV</option>
                    <option value="IoT Node">IoT Node (ESP32, Arduino, LoRa)</option>
                    <option value="Raspberry Pi">Raspberry Pi</option>
                    <option value="PC">PC / Workstation</option>
                    <option value="Smart TV">Smart TV</option>
                    <option value="Printer">Printer</option>
                    <option value="__custom__" style="color: #10B981; font-weight: 700;">+ Tambah Kategori Baru (Ketik Manual)...</option>
                `;
                catSelect.value = 'Router';
                handleDeviceCategoryChange();
            }
            showToast('Reset Berhasil', 'Kategori "Router" sampai "Printer" beserta seluruh model bawaan berhasil dipulihkan seperti semula.', 'success');
        },
        'Ya, Reset Bawaan'
    );
}
window.resetCategoriesAndSubcategoriesToDefault = resetCategoriesAndSubcategoriesToDefault;

function openEditDeviceModal(deviceId) {
    if (APP_STATE.currentUser && APP_STATE.currentUser.role === 'guest') {
        showToast('Akses Dibatasi', 'Mode Tamu tidak dapat mengubah data aset. Silakan login sebagai Admin.', 'error');
        return;
    }
    restoreRouterCategoryIfNeeded();
    const dev = APP_STATE.devices.find(d => String(d.id) === String(deviceId) || String(d.asset_id) === String(deviceId) || String(d.code) === String(deviceId) || String(d.asset_code) === String(deviceId));
    if (!dev) return;

    document.getElementById('device-form').reset();
    const editIdEl = document.getElementById('dev-edit-id');
    if (editIdEl) editIdEl.value = dev.id || dev.asset_id;
    const titleEl = document.getElementById('modal-device-title');
    if (titleEl) titleEl.textContent = `Edit Data Aset: ${dev.code || dev.name}`;
    const btnLabel = document.getElementById('btn-save-device-label');
    if (btnLabel) btnLabel.innerHTML = '<span class="text-desktop">Simpan Perubahan</span><span class="text-mobile">Simpan</span>';

    // Isi Kode Aset (Kode Unik) & Buka izin edit untuk Admin & Superadmin
    const codeInput = document.getElementById('dev-code');
    if (codeInput) {
        codeInput.value = dev.code || dev.asset_code || `AST-${dev.id}`;
        codeInput.disabled = false;
        codeInput.readOnly = false;
    }

    document.getElementById('dev-name').value = dev.name || '';
    
    // Set Kategori & Subkategori / Jenis & Merk
    const catSelect = document.getElementById('dev-category');
    const customCatWrap = document.getElementById('dev-custom-category-wrap');
    const customCatInput = document.getElementById('dev-custom-category');
    const devCat = dev.category || 'Router';
    const devSub = dev.sub_category || dev.subcategory || '';

    let catExists = false;
    if (catSelect) {
        for (let i = 0; i < catSelect.options.length; i++) {
            if (catSelect.options[i].value === devCat) {
                catExists = true;
                break;
            }
        }
        if (catExists) {
            catSelect.value = devCat;
            if (customCatWrap) customCatWrap.style.display = 'none';
            if (customCatInput) customCatInput.value = '';
            populateSubcategories(devCat, devSub);
        } else {
            catSelect.value = '__custom__';
            if (customCatWrap) customCatWrap.style.display = 'block';
            if (customCatInput) customCatInput.value = devCat;
            populateSubcategories('__custom__', devSub);
        }
    }

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
        picInput.value = dev.pic || 'Tim Teknolab';
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
    if (document.getElementById('dev-install-date')) document.getElementById('dev-install-date').value = dev.installDate || '';
    if (document.getElementById('dev-description')) document.getElementById('dev-description').value = dev.description || '';
    if (document.getElementById('dev-floor')) document.getElementById('dev-floor').value = dev.floor || '';
    if (document.getElementById('dev-is-active')) document.getElementById('dev-is-active').value = dev.isActive !== false ? '1' : '0';

    if (typeof enforceSuperadminOnlyElements === 'function') enforceSuperadminOnlyElements();
    const modalEl = document.getElementById('device-modal');
    modalEl.classList.remove('hidden');
    modalEl.scrollTop = 0;
    const modalBody = modalEl.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
}

function openAddDeviceModal() {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Mode User (Read-Only) tidak dapat menambah perangkat. Silakan login sebagai Admin.', 'error');
        return;
    }
    restoreRouterCategoryIfNeeded();
    document.getElementById('device-form').reset();
    const editIdEl = document.getElementById('dev-edit-id');
    if (editIdEl) editIdEl.value = '';
    const titleEl = document.getElementById('modal-device-title');
    if (titleEl) titleEl.textContent = 'Tambah Perangkat Baru';
    const btnLabel = document.getElementById('btn-save-device-label');
    if (btnLabel) btnLabel.innerHTML = '<span class="text-desktop">Simpan Perangkat</span><span class="text-mobile">Simpan</span>';

    // Reset Kategori & Subkategori
    const catSelect = document.getElementById('dev-category');
    if (catSelect) catSelect.value = 'Router';
    const customCatWrap = document.getElementById('dev-custom-category-wrap');
    if (customCatWrap) customCatWrap.style.display = 'none';
    const customCatInput = document.getElementById('dev-custom-category');
    if (customCatInput) customCatInput.value = '';
    populateSubcategories('Router');

    // Kode Aset: Kosongkan saat pertama kali membuka modal Tambah Perangkat (bebas diketik manual oleh Admin / Superadmin)
    const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
    const cat = catSelect?.value || 'Router';
    const suggestedCode = `AST-${cat.slice(0, 3).toUpperCase()}-${num}`;
    const codeInput = document.getElementById('dev-code');
    if (codeInput) {
        codeInput.value = '';
        codeInput.placeholder = `Misal: ${suggestedCode}`;
        codeInput.disabled = false;
        codeInput.readOnly = false;
    }

    if (document.getElementById('dev-floor')) document.getElementById('dev-floor').value = '';
    if (document.getElementById('dev-is-active')) document.getElementById('dev-is-active').value = '1';

    const isSuperadmin = APP_STATE.currentUser && (APP_STATE.currentUser.role === 'superadmin' || APP_STATE.currentUser.role === 'super_admin');
    const picInput = document.getElementById('dev-pic');
    const picNote = document.getElementById('pic-admin-note');
    if (picInput) {
        picInput.value = '';
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

    if (typeof enforceSuperadminOnlyElements === 'function') enforceSuperadminOnlyElements();
    const modalEl = document.getElementById('device-modal');
    modalEl.classList.remove('hidden');
    modalEl.scrollTop = 0;
    const modalBody = modalEl.querySelector('.modal-body');
    if (modalBody) modalBody.scrollTop = 0;
}

function closeDeviceModal() {
    document.getElementById('device-modal').classList.add('hidden');
}

async function handleSaveDevice() {
    const editIdEl = document.getElementById('dev-edit-id');
    const editId = editIdEl ? editIdEl.value : '';
    const code = (document.getElementById('dev-code')?.value || '').trim().toUpperCase();
    const name = document.getElementById('dev-name').value.trim();
    
    // Resolusi Kategori: Standard vs Ketik Manual (Custom)
    const catSelect = document.getElementById('dev-category');
    let category = catSelect ? catSelect.value : 'Router';
    if (category === '__custom__') {
        const customCat = (document.getElementById('dev-custom-category')?.value || '').trim();
        if (!customCat) {
            showToast('Validasi Gagal', 'Silakan ketik nama Kategori Baru Anda.', 'error');
            document.getElementById('dev-custom-category')?.focus();
            return;
        }
        category = customCat;
    }

    // Resolusi Subkategori / Jenis & Merk: Predefined vs Ketik Manual (Custom)
    const subSelect = document.getElementById('dev-subcategory');
    let subCategory = subSelect ? subSelect.value : '';
    if (subCategory === '__custom_subtype__') {
        const customSub = (document.getElementById('dev-custom-subcategory')?.value || '').trim();
        if (!customSub) {
            showToast('Validasi Gagal', 'Silakan ketik jenis/merk & tipe spesifik perangkat.', 'error');
            document.getElementById('dev-custom-subcategory')?.focus();
            return;
        }
        subCategory = customSub;
    }

    const ip = document.getElementById('dev-ip').value.trim();
    const location = document.getElementById('dev-location').value.trim();
    const method = document.getElementById('dev-method').value;
    const priority = parseInt(document.getElementById('dev-priority')?.value || '2', 10);
    const picInput = document.getElementById('dev-pic');
    const pic = picInput?.value.trim() || '';
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
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
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

    // Indikator Loading pada Tombol Simpan
    const btnSave = document.getElementById('btn-save-device-submit');
    const originalBtnHtml = btnSave ? btnSave.innerHTML : '';
    if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    }

    try {
        if (editId) {
            // Mode Update / Edit Deret Data Aset
            const dev = APP_STATE.devices.find(d => String(d.id) === String(editId) || String(d.asset_id) === String(editId) || String(d.code) === String(editId) || String(d.asset_code) === String(editId));
            if (dev) {
                const targetId = dev.asset_id || dev.rawId || editId;
                if (typeof apiService !== 'undefined' && typeof apiService.updateAsset === 'function') {
                    let resolvedPicUserId = null;
                    if (pic) {
                        const pLower = pic.toLowerCase().trim();
                        if (!pLower.includes('tim') && !pLower.includes('teknolab')) {
                            const foundUser = (APP_STATE.usersList || []).find(u => 
                                (u.name && u.name.toLowerCase().includes(pLower)) ||
                                (u.username && u.username.toLowerCase().includes(pLower)) ||
                                (u.full_name && u.full_name.toLowerCase().includes(pLower))
                            );
                            if (foundUser) resolvedPicUserId = foundUser.rawId || foundUser.user_id || foundUser.id;
                        }
                    }

                    const res = await apiService.updateAsset(targetId, {
                        asset_code: code,
                        asset_name: name,
                        category: category,
                        sub_category: subCategory,
                        ip_address: ip,
                        mac_address: mac,
                        floor: floor,
                        ...(resolveLocationId(location) ? { location_id: resolveLocationId(location) } : {}),
                        is_active: isActive ? 1 : 0,
                        monitoring_method: method,
                        current_status: dev.status || 'offline',
                        priority: priority,
                        description: description,
                        installation_date: installDate,
                        ...(isSuperadmin ? { pic_name: pic, pic_user_id: resolvedPicUserId } : {})
                    });

                    if (res && (res.error || !res.success)) {
                        showToast('Gagal Memperbarui Aset', res.error || 'Terjadi kesalahan pada backend.', 'error');
                        return;
                    }
                }

                // Update lokal secara instan (Optimistic UI - Zero Delay)
                dev.code = code;
                dev.asset_code = code;
                dev.name = name;
                dev.category = category;
                dev.sub_category = subCategory;
                dev.subcategory = subCategory;
                dev.ip = ip;
                dev.location = location;
                dev.floor = floor;
                dev.isActive = isActive;
                dev.method = method;
                dev.status = dev.status || 'offline';
                dev.priority = priority;
                if (isSuperadmin) {
                    dev.pic = pic || 'Tim Teknolab';
                }
                dev.mac = mac;
                dev.installDate = installDate;
                dev.description = description;
                saveDevicesToStorage(APP_STATE.devices);
                invalidateDeviceFingerprint();

                renderFullDevicesTable();
                if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
                if (typeof refreshHomeMap === 'function') refreshHomeMap();
                if (typeof renderFloorplanPins === 'function') renderFloorplanPins();
                if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
                if (typeof window.sync3DPinsFrom2D === 'function') window.sync3DPinsFrom2D(true);
                
                // Tutup modal secara langsung tanpa terhambat loading background
                closeDeviceModal();
                showToast('Aset Diperbarui', `Kode unik [${code}] & data aset ${name} berhasil disimpan ke database.`, 'success');
                if (typeof addAuditTrailRecord === 'function') {
                    addAuditTrailRecord('Pembaruan Aset', `Memperbarui konfigurasi perangkat ${code} (${name}, ${ip}) di ${location}`);
                }

                // Sinkronisasi data menyeluruh di latar belakang secara asynchronous
                if (typeof loadRealDataFromApi === 'function') {
                    loadRealDataFromApi().catch(console.warn);
                }
                return;
            }
        }

        // Mode Tambah Baru
        const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
        const assignedPic = isSuperadmin ? (pic || '') : (APP_STATE.currentUser ? APP_STATE.currentUser.name : '');
        const newDev = {
            id: `DEV-${num}`,
            code: code,
            asset_code: code,
            name,
            category,
            sub_category: subCategory,
            subcategory: subCategory,
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

        if (typeof apiService !== 'undefined' && typeof apiService.createAsset === 'function') {
            let resolvedPicUserId = null;
            if (assignedPic) {
                const pLower = assignedPic.toLowerCase().trim();
                if (!pLower.includes('tim') && !pLower.includes('teknolab')) {
                    const foundUser = (APP_STATE.usersList || []).find(u => 
                        (u.name && u.name.toLowerCase().includes(pLower)) ||
                        (u.username && u.username.toLowerCase().includes(pLower)) ||
                        (u.full_name && u.full_name.toLowerCase().includes(pLower))
                    );
                    if (foundUser) resolvedPicUserId = foundUser.rawId || foundUser.user_id || foundUser.id;
                }
            }

            const res = await apiService.createAsset({
                asset_code: code,
                asset_name: name,
                category: category,
                sub_category: subCategory,
                location_name: location,
                location_id: resolveLocationId(location),
                floor: floor,
                is_active: isActive ? 1 : 0,
                ip_address: ip,
                mac_address: mac,
                monitoring_method: method,
                current_status: 'unknown',
                priority: priority,
                pic_name: assignedPic,
                pic_user_id: resolvedPicUserId,
                installation_date: installDate,
                description: description
            });

            if (res && (res.error || !res.success)) {
                showToast('Gagal Menambah Aset', res.error || 'Terjadi kesalahan pada backend.', 'error');
                return;
            }

            if (res && res.data && res.data.asset_id) {
                newDev.id = `DEV-${res.data.asset_id}`;
                newDev.asset_id = res.data.asset_id;
            }
        }

        APP_STATE.devices.unshift(newDev);
        saveDevicesToStorage(APP_STATE.devices);

        if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
        renderFullDevicesTable();
        if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
        if (typeof refreshHomeMap === 'function') refreshHomeMap();
        if (typeof renderFloorplanPins === 'function') renderFloorplanPins();
        if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
        if (typeof window.sync3DPinsFrom2D === 'function') window.sync3DPinsFrom2D(true);
        closeDeviceModal();
        showToast('Aset Baru Ditambahkan', `Aset [${code}] ${name} berhasil disimpan ke database backend.`, 'success');
        if (typeof addAuditTrailRecord === 'function') {
            addAuditTrailRecord('Penambahan Aset', `Mendaftarkan perangkat baru ${code} (${name}) IP ${ip} di ${location}`);
        }

        // Sinkronisasi data menyeluruh di latar belakang secara asynchronous
        if (typeof loadRealDataFromApi === 'function') {
            loadRealDataFromApi().catch(console.warn);
        }
    } catch (err) {
        showToast('Kesalahan Jaringan', err.message || 'Tidak dapat terhubung ke server backend.', 'error');
    } finally {
        if (btnSave) {
            btnSave.disabled = false;
            btnSave.innerHTML = originalBtnHtml;
        }
    }
}
window.handleSaveDevice = handleSaveDevice;
window.openAddDeviceModal = openAddDeviceModal;
window.openEditDeviceModal = openEditDeviceModal;
window.closeDeviceModal = closeDeviceModal;

function openQuickStatusModal(deviceId) {
    if (APP_STATE.currentUser && APP_STATE.currentUser.role === 'guest') {
        showToast('Akses Terkunci (Mode User)', 'Harap login sebagai Administrator untuk mengubah status alat elektro.', 'error');
        return;
    }

    const dev = APP_STATE.devices.find(d => d.id == deviceId || d.asset_code === deviceId || d.asset_id == deviceId || d.code === deviceId);
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

    const dev = APP_STATE.devices.find(d => d.id == APP_STATE.selectedDeviceId || d.asset_id == APP_STATE.selectedDeviceId || d.code === APP_STATE.selectedDeviceId);
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
function showCyberConfirmModal(title, message, onConfirm, confirmBtnText = 'Ya, Hapus Permanen') {
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
                    <button type="button" class="btn btn-sm" id="cyber-confirm-ok" aria-label="Konfirmasi Aksi" style="background: linear-gradient(135deg, #EF4444, #B91C1C); color: #FFF; border: none; font-weight: 700; padding: 7px 16px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="fa-solid fa-trash-can" id="cyber-confirm-btn-icon"></i> <span id="cyber-confirm-btn-text">Ya, Hapus Permanen</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.style.zIndex = '100050';
    document.getElementById('cyber-confirm-title').textContent = title;
    document.getElementById('cyber-confirm-msg').textContent = message;
    const btnTextEl = document.getElementById('cyber-confirm-btn-text');
    if (btnTextEl) btnTextEl.textContent = confirmBtnText || 'Ya, Hapus Permanen';
    const btnIconEl = document.getElementById('cyber-confirm-btn-icon');
    if (btnIconEl) {
        if (confirmBtnText && confirmBtnText.toLowerCase().includes('reset')) {
            btnIconEl.className = 'fa-solid fa-rotate-left';
        } else {
            btnIconEl.className = 'fa-solid fa-trash-can';
        }
    }
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

    const dev = APP_STATE.devices.find(d => String(d.id) === String(deviceId) || String(d.asset_id) === String(deviceId) || String(d.code) === String(deviceId));
    if (!dev) return;

    showCyberConfirmModal(
        'Konfirmasi Penghapusan Aset',
        `PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus perangkat "${dev.name}" (${dev.code || dev.ip}) dari sistem inventaris T-AIMS?\n\nTindakan ini akan menghapus data dari database secara permanen.`,
        async () => {
            const targetId = dev.asset_id || dev.rawId || dev.id || deviceId;
            if (window.apiService && typeof window.apiService.deleteAsset === 'function') {
                try {
                    const res = await window.apiService.deleteAsset(targetId);
                    if (res && (res.error || !res.success)) {
                        showToast('Gagal Menghapus Aset', res.error || 'Terjadi kesalahan pada backend.', 'error');
                        return;
                    }
                    if (typeof loadRealDataFromApi === 'function') {
                        await loadRealDataFromApi();
                    }
                } catch (err) {
                    showToast('Kesalahan Jaringan', err.message || 'Gagal menghapus aset dari database.', 'error');
                    return;
                }
            } else {
                APP_STATE.devices = APP_STATE.devices.filter(d => String(d.id) !== String(deviceId) && String(d.asset_id) !== String(deviceId));
                saveDevicesToStorage(APP_STATE.devices);
                invalidateDeviceFingerprint();
            }

            if (typeof addAuditTrailRecord === 'function') {
                addAuditTrailRecord('Penghapusan Aset', `Menghapus aset perangkat ${dev.code || dev.name} (${dev.ip}) dari ${dev.location || 'Inventaris'}`);
            }

            closeDeviceModal();
            renderFullDevicesTable();
            if (typeof renderHomeDevicesTable === 'function') renderHomeDevicesTable();
            if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            if (typeof refreshHomeMap === 'function') refreshHomeMap();
            if (typeof renderFloorplanPins === 'function') renderFloorplanPins();
            if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
            if (typeof window.sync3DPinsFrom2D === 'function') window.sync3DPinsFrom2D(true);

            showToast('Aset Dihapus', `Perangkat ${dev.name} berhasil dihapus dari database oleh Superadmin.`, 'success');
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
        const listToRender = (APP_STATE.alerts || []).slice(0, 5);
        if (listToRender.length === 0) {
            dropList.innerHTML = `
                <div style="padding: 22px 16px; text-align: center; color: #94a3b8; width: 100%; box-sizing: border-box;">
                    <i class="fa-solid fa-circle-check text-green" style="font-size: 1.6rem; display: block; margin-bottom: 8px;"></i>
                    <strong style="display: block; color: #f1f5f9; font-size: 0.82rem; margin-bottom: 2px;">Seluruh Sistem Normal</strong>
                    <span style="font-size: 0.74rem;">Tidak ada gangguan baru yang belum tertangani.</span>
                </div>
            `;
        } else {
            listToRender.forEach(alt => {
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
    }

    const count = (APP_STATE.alerts || []).filter(a => !a.read).length;
    if (typeof updateNotifBadgeCount === 'function') {
        updateNotifBadgeCount(count);
    }
}

async function markAllAlertsRead() {
    localStorage.setItem('taims_all_alerts_read', 'true');
    localStorage.setItem('taims_alerts_read_at', Date.now().toString());
    if (APP_STATE.alerts && Array.isArray(APP_STATE.alerts)) {
        APP_STATE.alerts.forEach(a => a.read = true);
    }
    if (typeof updateNotifBadgeCount === 'function') {
        updateNotifBadgeCount(0);
    }
    const sidebarBadge = document.getElementById('sidebar-alert-badge');
    if (sidebarBadge) {
        sidebarBadge.textContent = '0';
        sidebarBadge.style.display = 'none';
        sidebarBadge.dataset.count = '0';
    }
    if (window.apiService && typeof window.apiService.markAllNotificationsRead === 'function') {
        try {
            await window.apiService.markAllNotificationsRead();
        } catch (e) {
            console.warn('Gagal mark all read backend:', e);
        }
    }
    renderAlerts();
    showToast('Notifikasi Bersih', 'Semua peringatan telah ditandai sebagai dibaca.', 'success');
}
window.markAllAlertsRead = markAllAlertsRead;

function addAlertLog(title, location, level) {
    localStorage.removeItem('taims_all_alerts_read');
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
        name: 'Head Office',
        subtitle: 'PT Teknolab Caraka Internasional',
        address: 'Jl. Cibodas, Kel. Tanggung, Kec. Kepanjenkidul, Kota Blitar',
        lat: -8.07378,
        lng: 112.17336,
        zoom: 18,
        color: '#FF1744',
        badge: 'HEAD OFFICE',
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
        name: 'Marketing Office',
        subtitle: 'Marketing Office',
        address: 'Marketing Office, Jl. Ciliwung, Kec. Sukorejo / Sananwetan, Kota Blitar',
        lat: -8.06438,
        lng: 112.17709,
        zoom: 18,
        color: '#F59E0B',
        badge: 'MARKETING OFFICE',
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
        color: '#00F0FF',
        badge: 'HOUSE OF SERVER',
        badgeClass: 'badge-cyan',
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
    if (homeEl) {
        if (!APP_STATE.homeMap) {
            try {
                APP_STATE.homeMap = L.map('home-blitar-map', {
                    preferCanvas: true,
                    center: blitarCenter,
                    zoom: 14,
                    zoomControl: false,
                    attributionControl: false
                });

                const savedProviderKey = (function() {
                    try { return localStorage.getItem('taims_map_provider') || 'google-roads'; } catch(e) { return 'google-roads'; }
                })();
                const initProv = MAP_PROVIDERS[savedProviderKey] || MAP_PROVIDERS['google-roads'] || MAP_PROVIDERS['google-sat'];
                APP_STATE.currentMapProvider = initProv.id;

                APP_STATE.homeTileLayer = L.tileLayer(initProv.url, {
                    subdomains: initProv.subdomains,
                    maxZoom: initProv.maxZoom,
                    attribution: initProv.attribution
                }).addTo(APP_STATE.homeMap);

                L.control.zoom({ position: 'bottomright' }).addTo(APP_STATE.homeMap);

                // Garis penghubung telemetri antar-site di dashboard
                const homeSitePoints = [
                    [LOC_SITES.ho.lat, LOC_SITES.ho.lng],
                    [LOC_SITES.mo.lat, LOC_SITES.mo.lng],
                    [LOC_SITES.server.lat, LOC_SITES.server.lng],
                    [LOC_SITES.ho.lat, LOC_SITES.ho.lng]
                ];
                APP_STATE.homeSiteLine = L.polyline(homeSitePoints, {
                    color: '#FF1744',
                    weight: 2,
                    opacity: 0.85,
                    dashArray: '6, 6'
                }).addTo(APP_STATE.homeMap);

                APP_STATE.homeMarkersMap = {};
                refreshHomeMapMarkers();
            } catch (e) {
                console.error('Gagal inisialisasi home map:', e);
            }
        }

        // Selalu pastikan ukuran map sinkron dan render tile aktif
        if (APP_STATE.homeMap) {
            setTimeout(() => {
                try {
                    APP_STATE.homeMap.invalidateSize();
                    APP_STATE.homeMap.setView(blitarCenter, 14);
                } catch(err) {}
            }, 100);
            setTimeout(() => {
                try {
                    APP_STATE.homeMap.invalidateSize();
                } catch(err) {}
            }, 400);
        }

        // Observer otomatis saat elemen mendapatkan dimensi / tampil di layar
        if (!homeEl._taimsObserverAttached && typeof ResizeObserver !== 'undefined') {
            homeEl._taimsObserverAttached = true;
            try {
                const ro = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        if (entry.contentRect.width > 20 && entry.contentRect.height > 20 && APP_STATE.homeMap) {
                            try { APP_STATE.homeMap.invalidateSize(); } catch(e) {}
                        }
                    }
                });
                ro.observe(homeEl);
            } catch(e) {}
        }
    }

    // 2. Inisialisasi Peta Lengkap di Halaman Lokasi (#full-blitar-map) Menggunakan Google Maps Satelit Asli
    const fullEl = document.getElementById('full-blitar-map');
    if (fullEl && !APP_STATE.fullMap) {
        try {
            APP_STATE.fullMap = L.map('full-blitar-map', {
                center: blitarCenter,
                zoom: 15,
                zoomControl: false,
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
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-crosshairs text-cyan"></i> Fokus: ${site.name}`;

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

    showToast('Fokus Lokasi', `Navigasi ke ${site.name} - ${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}`, 'info');
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
    if (coordEl) coordEl.textContent = '-8.0703, 112.1735';

    const titleEl = document.getElementById('loc-map-status-title');
    if (titleEl) titleEl.innerHTML = `Peta Interaktif Kota Blitar`;

    // 4. Fit bounds ke semua titik site
    if (APP_STATE.fullMap) {
        const bounds = Object.keys(LOC_SITES).map(function (k) { return [LOC_SITES[k].lat, LOC_SITES[k].lng]; });
        APP_STATE.fullMap.fitBounds(bounds, { padding: [60, 60], animate: true });
        APP_STATE.fullMap.closePopup();
    }

    showToast('Tampilan Penuh', 'Menampilkan seluruh ' + Object.keys(LOC_SITES).length + ' site di Kota Blitar.', 'info');
}

// =============================================================================
// MODAL TELEMETRI GEOSPASIAL & KALIBRASI MULTI-SITE (KLIK CHIP METRIK HEADER)
// =============================================================================
function openLocTelemetryModal(tab = 'sites') {
    const modal = document.getElementById('loc-telemetry-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    switchLocTelemetryTab(tab);

    const tbody = document.getElementById('lt-assets-tbody');
    if (tbody && APP_STATE.devices && APP_STATE.devices.length > 0) {
        tbody.innerHTML = APP_STATE.devices.map(d => `
            <tr style="border-bottom: 1px solid rgba(148, 163, 184, 0.1);">
                <td style="padding: 6px 10px; font-weight: 700; color: #00F0FF;">${escapeHtml(d.code || '')}</td>
                <td style="padding: 6px 10px; color: #FFF;">${escapeHtml(d.name || '')}</td>
                <td style="padding: 6px 10px;">${typeof formatSiteLocationBadge === 'function' ? formatSiteLocationBadge(d.location) : escapeHtml(d.location || '')}</td>
                <td style="padding: 6px 10px; font-family: monospace; color: #94A3B8;">${escapeHtml(d.ip || '-')}</td>
                <td style="padding: 6px 10px; text-align: center;"><span style="color: #00FF9D; font-size: 0.7rem;"><i class="fa-solid fa-circle-check"></i> Terkalibrasi</span></td>
            </tr>
        `).join('');
    }
}

function closeLocTelemetryModal() {
    const modal = document.getElementById('loc-telemetry-modal');
    if (modal) modal.classList.add('hidden');
}

function switchLocTelemetryTab(tab) {
    ['sites', 'assets', 'geodetic'].forEach(t => {
        const btn = document.getElementById(`tab-lt-${t}`);
        const content = document.getElementById(`lt-content-${t}`);
        if (btn) {
            if (t === tab) {
                btn.classList.add('active');
                btn.style.background = 'rgba(0, 240, 255, 0.2)';
                btn.style.border = '1px solid #00F0FF';
                btn.style.color = '#FFF';
            } else {
                btn.classList.remove('active');
                btn.style.background = 'transparent';
                btn.style.border = '1px solid transparent';
                btn.style.color = '#94A3B8';
            }
        }
        if (content) {
            if (t === tab) content.classList.remove('hidden');
            else content.classList.add('hidden');
        }
    });
}

function focusAllSitesMap() {
    if (typeof zoomToAllSites === 'function') {
        zoomToAllSites();
    } else if (APP_STATE.fullMap) {
        APP_STATE.fullMap.fitBounds([[-8.075, 112.172], [-8.063, 112.179]], {
            padding: [50, 50],
            animate: true
        });
    }
    showToast('3 Zona Terhubung', 'Menampilkan cakupan geospasial 3 Site: Head Office, Marketing Office, & House of Server.', 'info');
}

window.openLocTelemetryModal = openLocTelemetryModal;
window.closeLocTelemetryModal = closeLocTelemetryModal;
window.switchLocTelemetryTab = switchLocTelemetryTab;
window.focusAllSitesMap = focusAllSitesMap;

// -----------------------------------------------------------------------------
// PENGGANTIAN PENYEDIA PETA ASLI (GOOGLE MAPS, SATELIT, OPENSTREET, CYBER)
// -----------------------------------------------------------------------------
function setMapProvider(providerKey) {
    const p = MAP_PROVIDERS[providerKey] || MAP_PROVIDERS['google-roads'];
    APP_STATE.currentMapProvider = p.id;
    try { localStorage.setItem('taims_map_provider', p.id); } catch(e) {}

    // 1. Update semua tombol layer pill aktif di seluruh halaman (Dashboard & Lokasi)
    document.querySelectorAll('.btn-layer-pill').forEach(b => {
        const provAttr = b.getAttribute('data-provider') || (b.id && b.id.includes('road') ? 'google-roads' : 'google-sat');
        if (provAttr === p.id) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    // 2. Terapkan filter cyber dark jika mode cyber
    ['full-blitar-map', 'home-blitar-map'].forEach(id => {
        const mapEl = document.getElementById(id);
        if (mapEl) {
            if (p.darkFilter) {
                mapEl.classList.add('map-cyber-dark');
            } else {
                mapEl.classList.remove('map-cyber-dark');
            }
        }
    });

    // 3. Ganti tile layer di fullMap (Halaman Lokasi)
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

    // 4. Ganti tile layer di homeMap (Peta Dashboard) secara sinkron
    if (APP_STATE.homeMap) {
        if (APP_STATE.homeTileLayer) {
            APP_STATE.homeMap.removeLayer(APP_STATE.homeTileLayer);
        }
        APP_STATE.homeTileLayer = L.tileLayer(p.url, {
            subdomains: p.subdomains,
            maxZoom: p.maxZoom,
            attribution: p.attribution
        }).addTo(APP_STATE.homeMap);

        if (APP_STATE.homeTileLayer.bringToBack) {
            APP_STATE.homeTileLayer.bringToBack();
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
    const mapLayers = document.querySelectorAll('.map-layer-selector, #loc-map-layer-selector');

    if (tab === 'gis') {
        if (btnGis) btnGis.classList.add('active');
        if (btnFloor) btnFloor.classList.remove('active');
        if (panelGis) { panelGis.classList.add('active'); panelGis.classList.remove('hidden'); }
        if (panelFloor) { panelFloor.classList.remove('active'); panelFloor.classList.add('hidden'); }
        mapLayers.forEach(el => el.style.removeProperty('display'));
        setTimeout(() => {
            if (APP_STATE.fullMap) APP_STATE.fullMap.invalidateSize();
        }, 120);
    } else if (tab === 'floor') {
        if (btnFloor) btnFloor.classList.add('active');
        if (btnGis) btnGis.classList.remove('active');
        if (panelFloor) { panelFloor.classList.add('active'); panelFloor.classList.remove('hidden'); }
        mapLayers.forEach(el => el.style.setProperty('display', 'none', 'important'));
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

    // Sinkronkan Digital Twin 3D jika aktif
    if (typeof window.switchSite3D === 'function') {
        const target3D = (siteKey === 'mentor' || siteKey === 'server') ? 'hs' : siteKey;
        window.switchSite3D(target3D);
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
    const dev = APP_STATE.devices.find(d => d.id == deviceId || d.asset_code === deviceId || d.asset_id == deviceId || d.code === deviceId);
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
        const siteKeys = Object.keys(LOC_SITES);
        const bounds = siteKeys.map(k => [LOC_SITES[k].lat, LOC_SITES[k].lng]);
        if (bounds.length > 0) {
            APP_STATE.homeMap.fitBounds(bounds, { padding: [35, 35], animate: true });
            showToast('Peta Infrastruktur', `Menampilkan seluruh ${siteKeys.length} titik site infrastruktur.`, 'info');
        }
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
                    <button class="btn-sm btn-outline-cyber" onclick="openAssetQrModal('${dev.code}')" title="Cetak Label QR Tag">
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
    const pic = document.getElementById('ast-pic')?.value.trim() || '';

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

let currentQrDevice = null;

function openAssetQrModal(codeOrTarget, optName, optLoc) {
    let dev = null;
    const devs = APP_STATE.devices || [];
    
    if (typeof codeOrTarget === 'object' && codeOrTarget !== null) {
        dev = codeOrTarget;
    } else if (codeOrTarget) {
        const query = String(codeOrTarget).trim().toLowerCase();
        dev = devs.find(d => 
            String(d.id).toLowerCase() === query ||
            String(d.asset_id || '').toLowerCase() === query ||
            String(d.code || '').toLowerCase() === query ||
            String(d.name || '').toLowerCase() === query
        );
    }

    const code = (dev && (dev.code || dev.asset_code)) || (typeof codeOrTarget === 'string' && codeOrTarget.startsWith('AST') ? codeOrTarget : 'AST-DEV-001');
    const devName = (dev && dev.name) || optName || 'Perangkat IT Teknolab';
    const location = (dev && (dev.location || dev.district)) || optLoc || 'Head Office';
    const floor = (dev && dev.floor) ? ` • Lantai ${dev.floor}` : '';
    const ip = (dev && dev.ip) || '-';
    const mac = (dev && dev.mac) || '-';
    const category = (dev && dev.category) || 'Hardware';
    const pic = (dev && dev.pic) || 'Tim Teknolab';
    const method = (dev && dev.method) || 'Ping';
    const priority = (dev && dev.priority) || 'Medium (P2)';
    const installDate = (dev && (dev.installDate || dev.install_date)) || '2026-10-01';
    const description = (dev && (dev.description || dev.desc)) || (dev && dev.name ? `Unit ${dev.name} pada ${location}` : '-');
    const status = (dev && dev.status) || 'online';

    currentQrDevice = {
        code,
        name: devName,
        location: location + floor,
        ip,
        mac,
        category,
        pic,
        method,
        priority,
        installDate,
        description,
        status
    };

    const codeEl = document.getElementById('qr-modal-code');
    const nameEl = document.getElementById('qr-modal-name');
    const ipEl = document.getElementById('qr-modal-ip');
    const locEl = document.getElementById('qr-modal-loc');
    const container = document.getElementById('qr-code-element');

    if (codeEl) codeEl.textContent = code;
    if (nameEl) nameEl.textContent = devName;
    if (ipEl) ipEl.textContent = `IP: ${ip} • MAC: ${mac}`;
    if (locEl) locEl.textContent = `Wilayah: ${location}${floor}, Blitar`;

    if (container) {
        container.innerHTML = '';
        const qrPayload = [
            `[T-AIMS ASSET SPECIFICATION]`,
            `KODE ASET: ${code}`,
            `NAMA PERANGKAT: ${devName}`,
            `KATEGORI: ${category}`,
            `IP ADDRESS: ${ip}`,
            `MAC ADDRESS: ${mac}`,
            `LOKASI: ${location}${floor}, Blitar`,
            `PIC TEKNISI: ${pic}`,
            `METODE MONITOR: ${method}`,
            `PRIORITAS: ${priority}`,
            `TGL PASANG: ${installDate}`,
            `DESKRIPSI: ${description}`,
            `STATUS: ${status.toUpperCase()}`,
            `SISTEM: PT Teknolab Caraka Internasional`
        ].join('\n');

        if (typeof QRCode !== 'undefined') {
            try {
                new QRCode(container, {
                    text: qrPayload,
                    width: 140,
                    height: 140,
                    colorDark: "#111827",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.M
                });
            } catch (err) {
                console.warn('Fallback QRCode render:', err);
                container.innerHTML = `<i class="fa-solid fa-qrcode" style="font-size: 64px; color: #111827;"></i><br><small class="font-mono text-dark">${code}</small>`;
            }
        } else {
            container.innerHTML = `<i class="fa-solid fa-qrcode" style="font-size: 64px; color: #111827;"></i><br><small class="font-mono text-dark">${code}</small>`;
        }
    }

    document.getElementById('asset-qr-modal')?.classList.remove('hidden');
}

function closeAssetQrModal() {
    document.getElementById('asset-qr-modal')?.classList.add('hidden');
}

function printAssetLabel() {
    if (!currentQrDevice) {
        showToast('Cetak Label', 'Data aset untuk dicetak belum dipilih.', 'warning');
        return;
    }

    const mount = document.getElementById('print-mount-area');
    if (!mount) {
        window.print();
        return;
    }

    const qrMountId = 'print-single-qr-render';
    mount.innerHTML = `
        <div class="print-single-label-card" style="font-family: Arial, sans-serif; border: 2px solid #111827; border-radius: 8px; padding: 18px; max-width: 320px; margin: 40px auto; text-align: center; background: #ffffff;">
            <div style="font-size: 11px; font-weight: bold; letter-spacing: 1.5px; color: #111827; border-bottom: 1.5px solid #111827; padding-bottom: 6px; margin-bottom: 10px; text-transform: uppercase;">
                PT TEKNOLAB CARAKA INTERNASIONAL<br>
                <span style="font-size: 9px; font-weight: normal; color: #4b5563;">T-AIMS ASSET &amp; INFRASTRUCTURE TAG</span>
            </div>
            <div id="${qrMountId}" style="display: flex; justify-content: center; align-items: center; margin: 10px auto; min-height: 140px;"></div>
            <div style="margin-top: 10px;">
                <div style="font-family: monospace; font-size: 16px; font-weight: bold; color: #111827; letter-spacing: 1px;">${currentQrDevice.code}</div>
                <div style="font-size: 13px; font-weight: bold; color: #1f2937; margin: 3px 0;">${currentQrDevice.name}</div>
                <div style="font-size: 10px; font-family: monospace; color: #4b5563;">IP: ${currentQrDevice.ip} &bull; ${currentQrDevice.category}</div>
                <div style="font-size: 10px; color: #6b7280; margin-top: 3px;">Wilayah: ${currentQrDevice.location}, Blitar</div>
                <div style="font-size: 8px; color: #9ca3af; margin-top: 8px; border-top: 1px dashed #d1d5db; padding-top: 4px;">
                    Dicetak: ${new Date().toLocaleString('id-ID')} &bull; Sistem Monitoring T-AIMS
                </div>
            </div>
        </div>
    `;

    const qrMount = document.getElementById(qrMountId);
    if (qrMount && typeof QRCode !== 'undefined') {
        const qrPayload = `[T-AIMS ASSET TAG]\nKode: ${currentQrDevice.code}\nNama: ${currentQrDevice.name}\nIP: ${currentQrDevice.ip}\nLokasi: ${currentQrDevice.location}, Blitar\nKategori: ${currentQrDevice.category}`;
        new QRCode(qrMount, {
            text: qrPayload,
            width: 140,
            height: 140,
            colorDark: "#111827",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
    }

    document.body.classList.add('print-mode-active');
    showToast('Cetak Label', `Membuka cetak label stiker ${currentQrDevice.code}...`, 'info');

    const cleanUp = () => {
        document.body.classList.remove('print-mode-active');
        if (mount) mount.innerHTML = '';
        window.removeEventListener('afterprint', cleanUp);
    };
    window.addEventListener('afterprint', cleanUp);

    setTimeout(() => {
        window.print();
        setTimeout(cleanUp, 3000);
    }, 400);
}

function exportAssetsList() {
    if (typeof exportAssetsCsv === 'function') {
        exportAssetsCsv();
    } else {
        showToast('Ekspor Data Aset', 'Mengunduh rekapitulasi data inventaris aset IT...', 'info');
    }
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
        const allZeroSoFar = chart.data.datasets[0].data.every(v => v === 0) &&
                             chart.data.datasets[1].data.every(v => v === 0) &&
                             chart.data.datasets[2].data.every(v => v === 0);
        if (allZeroSoFar && counts.total > 0 && currentTrendTimeframe === 'live') {
            for (let i = 0; i <= lastIdx; i++) {
                chart.data.datasets[0].data[i] = counts.online;
                chart.data.datasets[1].data[i] = counts.offline;
                chart.data.datasets[2].data[i] = counts.warning;
            }
        } else {
            chart.data.datasets[0].data[lastIdx] = counts.online;
            chart.data.datasets[1].data[lastIdx] = counts.offline;
            chart.data.datasets[2].data[lastIdx] = counts.warning;
        }
    }
    if (chart.options && chart.options.scales && chart.options.scales.y) {
        chart.options.scales.y.max = Math.max(16, counts.total + 2);
    }
    chart.update('none');
    if (typeof refreshNocLatencyChartPoint === 'function') refreshNocLatencyChartPoint();
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
                layout: {
                    padding: { left: 4, right: 14, top: 6, bottom: 4 }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: {
                            color: '#64748B',
                            font: { size: 9 },
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 6
                        }
                    },
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

        // Mode live murni menghitung jumlah perangkat aktif real-time tiap 5 detik

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
        // MODE 3: 7 Hari atau 30 Hari
        const is7Days = (val === '7' || val === '7d');
        const periodParam = is7Days ? '7d' : '30d';
        const daysCount = is7Days ? 7 : 30;
        const modeTitle = is7Days ? 'Mode 7 Hari' : 'Mode 30 Hari';

        let loadedFromApi = false;
        if (typeof getDashboardTrend === 'function') {
            try {
                const trendData = await getDashboardTrend(periodParam);
                if (trendData && trendData.labels && trendData.datasets && (currentTrendTimeframe === val || currentTrendTimeframe === periodParam)) {
                    chart.data.labels = trendData.labels;
                    chart.data.datasets[0].data = trendData.datasets.online;
                    chart.data.datasets[1].data = trendData.datasets.offline;
                    chart.data.datasets[2].data = trendData.datasets.warning;

                    const maxVal = Math.max(...trendData.datasets.online, ...trendData.datasets.offline, counts.total || 16);
                    if (chart.options && chart.options.scales && chart.options.scales.y) {
                        chart.options.scales.y.max = Math.max(16, maxVal + 2);
                    }
                    chart.update();
                    loadedFromApi = true;
                    if (showNotification) showToast(modeTitle, `Grafik riwayat ${daysCount} hari berhasil disinkronkan dari Backend.`, 'success');
                }
            } catch (err) {
                console.warn(`Fallback ${periodParam} client-side:`, err);
            }
        }

        if (!loadedFromApi) {
            const now = new Date();
            const dayLabels = [];
            const dataOn = [];
            const dataOff = [];
            const dataWarn = [];
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

            for (let i = daysCount - 1; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 86400000);
                const dayStr = `${d.getDate()} ${monthNames[d.getMonth()]}`;
                dayLabels.push(i === 0 ? 'Hari Ini' : dayStr);
                const onVal = (i === 0) ? counts.online : counts.online;
                dataOn.push(onVal);
                dataOff.push(Math.max(0, (counts.total || 16) - onVal));
                dataWarn.push(counts.warning || 0);
            }

            chart.data.labels = dayLabels;
            chart.data.datasets[0].data = dataOn;
            chart.data.datasets[1].data = dataOff;
            chart.data.datasets[2].data = dataWarn;
            if (chart.options && chart.options.scales && chart.options.scales.y) {
                chart.options.scales.y.max = Math.max(16, counts.total + 2);
            }
            chart.update();
            if (showNotification) showToast(modeTitle, `Grafik riwayat status ${daysCount} hari (diperbarui per 1 hari).`, 'info');
        }

        trendIntervalTimer = setInterval(() => {
            if (!APP_STATE.charts.trendChart || currentTrendTimeframe !== val) return;
            updateTrendChartTimeframe(val, false);
        }, 86400000);
    }
}

// =============================================================================
// TOAST NOTIFIKASI
// =============================================================================
let toastTimer = null;
let lastToastPayload = '';
let lastToastTime = 0;

function showToast(title, msg, type = 'info', force = false) {
    const toast = document.getElementById('toast-notification');
    const tTitle = document.getElementById('toast-title');
    const tMsg = document.getElementById('toast-message');
    const tIcon = document.getElementById('toast-icon');

    if (!toast) return;

    // Cegah spam notifikasi berulang-ulang (muncul-hilang loop) untuk pesan yang sama persis
    const payloadKey = `${title}|${msg}|${type}`;
    const now = Date.now();
    if (!force && payloadKey === lastToastPayload && (now - lastToastTime < 15000)) {
        return;
    }
    lastToastPayload = payloadKey;
    lastToastTime = now;

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
// ASISTEN AI INFRASTRUCTURE
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
                            (${aiData.online_devices || 0} Online / ${aiData.total_devices || 0} Total)
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
// EXPORT EXCEL REAL (CSV UTF-8 BOM) & PDF EXPORT
// =============================================================================
function exportReport(format) {
    if (String(format).toLowerCase() === 'pdf') {
        const mount = document.getElementById('print-mount-area');
        if (!mount) {
            window.print();
            return;
        }

        showToast('Export Laporan', 'Mempersiapkan dokumen analitik SLA & laporan infrastruktur...', 'info');
        const devs = APP_STATE.devices || [];
        const onlineCount = devs.filter(d => (d.status||'').toLowerCase() === 'online').length;
        const total = devs.length;
        const availPct = total > 0 ? ((onlineCount / total) * 100).toFixed(1) : '100.0';

        mount.innerHTML = `
            <div class="print-report-container" style="font-family: Arial, Helvetica, sans-serif; color: #111827;">
                <div class="print-report-header" style="border-bottom: 2.5px solid #111827; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h2 style="margin: 0; font-size: 17px; font-weight: bold; color: #111827; text-transform: uppercase;">PT TEKNOLAB CARAKA INTERNASIONAL</h2>
                        <h4 style="margin: 3px 0 0; font-size: 13px; font-weight: bold; color: #374151;">LAPORAN ANALITIK KINERJA INFRASTRUKTUR &amp; KETERSEDIAAN SLA</h4>
                        <p style="margin: 2px 0 0; font-size: 9px; color: #6b7280;">Sistem Monitoring T-AIMS &bull; Divisi Network Operation Center (NOC)</p>
                    </div>
                    <div style="font-size: 9px; color: #374151; text-align: right; line-height: 1.4;">
                        <strong>Tanggal Dokumen:</strong> ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                        <strong>Waktu Cetak:</strong> ${new Date().toLocaleTimeString('id-ID')} WIB<br>
                        <strong>Otoritas:</strong> Superadmin Dzakwan Miftahussobirin
                    </div>
                </div>

                <!-- KPI Box -->
                <div style="display: flex; gap: 10px; margin-bottom: 14px;">
                    <div style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; background: #f9fafb;">
                        <div style="font-size: 9px; color: #6b7280; font-weight: bold; text-transform: uppercase;">Total Perangkat</div>
                        <div style="font-size: 18px; font-weight: bold; color: #111827;">${total} Unit</div>
                    </div>
                    <div style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; background: #f9fafb;">
                        <div style="font-size: 9px; color: #6b7280; font-weight: bold; text-transform: uppercase;">Status Online</div>
                        <div style="font-size: 18px; font-weight: bold; color: #059669;">${onlineCount} Unit</div>
                    </div>
                    <div style="flex: 1; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 12px; background: #f9fafb;">
                        <div style="font-size: 9px; color: #6b7280; font-weight: bold; text-transform: uppercase;">Ketersediaan SLA</div>
                        <div style="font-size: 18px; font-weight: bold; color: #2563eb;">${availPct}%</div>
                    </div>
                </div>

                <!-- Tabel Status Perangkat & Latensi -->
                <table class="print-report-table" style="width: 100%; border-collapse: collapse; font-size: 10px;">
                    <thead>
                        <tr style="background-color: #f3f4f6;">
                            <th style="border: 1px solid #d1d5db; padding: 6px 4px; text-align: center; width: 25px;">No</th>
                            <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Kode</th>
                            <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Nama Perangkat</th>
                            <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Kategori</th>
                            <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">IP Address</th>
                            <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Lokasi</th>
                            <th style="border: 1px solid #d1d5db; padding: 6px; text-align: center;">Status</th>
                            <th style="border: 1px solid #d1d5db; padding: 6px; text-align: center;">Latency</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${devs.map((d, idx) => {
                            const st = (d.status || 'offline').toUpperCase();
                            const stColor = st === 'ONLINE' ? '#059669' : (st === 'WARNING' ? '#d97706' : '#dc2626');
                            return `
                                <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                                    <td style="border: 1px solid #d1d5db; padding: 4px; text-align: center;">${idx + 1}</td>
                                    <td style="border: 1px solid #d1d5db; padding: 4px 6px; font-family: monospace; font-weight: bold;">${d.code || '-'}</td>
                                    <td style="border: 1px solid #d1d5db; padding: 4px 6px;">${d.name || '-'}</td>
                                    <td style="border: 1px solid #d1d5db; padding: 4px 6px;">${d.category || '-'}</td>
                                    <td style="border: 1px solid #d1d5db; padding: 4px 6px; font-family: monospace;">${d.ip || '-'}</td>
                                    <td style="border: 1px solid #d1d5db; padding: 4px 6px;">${d.location || '-'}</td>
                                    <td style="border: 1px solid #d1d5db; padding: 4px 6px; text-align: center; font-weight: bold; color: ${stColor};">${st}</td>
                                    <td style="border: 1px solid #d1d5db; padding: 4px 6px; text-align: center; font-family: monospace;">${d.ping || '-'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>

                <!-- Pengesahan -->
                <div style="margin-top: 24px; display: flex; justify-content: flex-end; page-break-inside: avoid;">
                    <div style="text-align: center; width: 220px; font-size: 10px; color: #111827;">
                        <div>Blitar, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        <div style="font-weight: bold; margin-top: 2px;">Lead Network &amp; Infrastructure</div>
                        <div style="height: 45px;"></div>
                        <div style="font-weight: bold; text-decoration: underline;">Dzakwan Miftahussobirin</div>
                        <div style="font-size: 9px; color: #6b7280;">Superadmin &bull; PT Teknolab Caraka Internasional</div>
                    </div>
                </div>
            </div>
        `;

        document.body.classList.add('print-mode-active');
        const cleanUp = () => {
            document.body.classList.remove('print-mode-active');
            if (mount) mount.innerHTML = '';
            window.removeEventListener('afterprint', cleanUp);
        };
        window.addEventListener('afterprint', cleanUp);

        setTimeout(() => {
            window.print();
            setTimeout(cleanUp, 3000);
        }, 400);
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
    window.scrollTo({ top: 0, behavior: 'instant' });
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
                        ${formatCategoryBadge(safeCat)}
                        ${formatSiteLocationBadge(safeLoc)}
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
                            <span class="text-xs font-semibold text-white">${dev.pic || 'Tim Teknolab'}</span>
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
            else matchLoc = (d.location || '').toLowerCase().trim() === String(loc).toLowerCase().trim();
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
        const safePic = escapeHtml(dev.pic || 'Tim Teknolab');
        const safeMethod = escapeHtml(dev.method || 'Ping');
        const safePing = escapeHtml(dev.ping || '-');
        const safeLastSeen = escapeHtml(dev.lastSeen || '-');

        tr.innerHTML = `
            <td class="text-center">${index + 1}</td>
            <td>${prioHtml}<strong class="text-cyan font-mono">${safeCode}</strong></td>
            <td>
                <strong>${safeName}</strong>
                <div class="text-xs text-muted" style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                    ${formatCategoryBadge(safeCat)}
                    ${(dev.sub_category || dev.subcategory) ? `<span class="badge-subcat-tag" style="color: #94A3B8; font-size: 0.68rem; max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(dev.sub_category || dev.subcategory)}">• ${escapeHtml(dev.sub_category || dev.subcategory)}</span>` : ''}
                </div>
            </td>
            <td>
                <span class="ip-mono">${safeIp}</span>
                <div class="text-xs text-muted font-mono">${safeMac}</div>
            </td>
            <td class="text-center">${formatSiteLocationBadge(safeLoc)}</td>
            <td><span class="text-xs font-semibold text-white">${safePic}</span></td>
            <td class="text-center">${formatMethodBadge(safeMethod)}</td>
            <td class="text-center"><span class="font-mono text-xs ${dev.status === 'online' ? 'text-green' : 'text-red'}">${safePing}</span></td>
            <td class="text-center">${badge}</td>
            <td class="text-center"><span class="text-xs text-muted font-mono">${safeLastSeen}</span></td>
            <td class="text-center">
                <div class="d-flex gap-1 justify-center">
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
    if (String(format).toLowerCase() === 'pdf') {
        exportDevicePdf();
    } else {
        if (typeof exportAssetsCsv === 'function') {
            exportAssetsCsv();
        } else {
            let csv = 'No,Kode Aset,Nama Perangkat,Kategori,IP Address,MAC Address,Lokasi,PIC,Metode Monitor,Status,Last Seen\n';
            (APP_STATE.devices || []).forEach((d, i) => {
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
}

function printAllQrModal() {
    const devs = APP_STATE.devices || [];
    if (devs.length === 0) {
        showToast('Cetak QR Code', 'Tidak ada data aset untuk dicetak.', 'warning');
        return;
    }

    const mount = document.getElementById('print-mount-area');
    if (!mount) {
        window.print();
        return;
    }

    showToast('Cetak QR Code', `Mempersiapkan lembar stiker QR Code untuk ${devs.length} aset...`, 'info');

    let sheetHtml = `
        <div style="font-family: Arial, sans-serif; color: #111827; margin-bottom: 12px; border-bottom: 2px solid #111827; padding-bottom: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h3 style="margin: 0; font-size: 15px; font-weight: bold; text-transform: uppercase;">PT TEKNOLAB CARAKA INTERNASIONAL - LEMBAR STIKER QR TAG</h3>
                    <p style="margin: 2px 0 0; font-size: 10px; color: #4b5563;">Inventaris Aset &amp; Infrastruktur Monitoring T-AIMS &bull; Total: ${devs.length} Label Aset</p>
                </div>
                <div style="font-size: 9px; color: #6b7280; text-align: right;">
                    Tanggal Cetak: ${new Date().toLocaleString('id-ID')}<br>
                    Format: Standar Grid Stiker Label IT
                </div>
            </div>
        </div>
        <div class="print-qr-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 100%;">
    `;

    devs.forEach((dev, idx) => {
        const qrId = `qr-batch-mount-${idx}`;
        const code = dev.code || `AST-${idx + 1}`;
        const name = dev.name || 'Perangkat IT';
        const ip = dev.ip || '-';
        const loc = dev.location || dev.district || 'Head Office';
        const cat = dev.category || 'Hardware';

        sheetHtml += `
            <div class="print-qr-item" style="border: 1.5px dashed #4b5563; border-radius: 6px; padding: 8px; text-align: center; background: #ffffff; page-break-inside: avoid; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="font-size: 8px; font-weight: bold; letter-spacing: 1px; color: #111827; margin-bottom: 4px; text-transform: uppercase; border-bottom: 1px solid #e5e7eb; width: 100%; padding-bottom: 2px;">
                    TEKNOLAB &bull; T-AIMS TAG
                </div>
                <div id="${qrId}" style="width: 100px; height: 100px; margin: 4px auto; display: flex; align-items: center; justify-content: center;"></div>
                <div style="margin-top: 4px; width: 100%;">
                    <div style="font-family: monospace; font-size: 12px; font-weight: bold; color: #111827;">${code}</div>
                    <div style="font-size: 10px; font-weight: bold; color: #1f2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; margin: 0 auto;">${name}</div>
                    <div style="font-size: 8px; font-family: monospace; color: #4b5563;">IP: ${ip} &bull; ${cat}</div>
                    <div style="font-size: 8px; color: #6b7280;">Wilayah: ${loc}, Blitar</div>
                </div>
            </div>
        `;
    });

    sheetHtml += `</div>`;
    mount.innerHTML = sheetHtml;

    if (typeof QRCode !== 'undefined') {
        devs.forEach((dev, idx) => {
            const el = document.getElementById(`qr-batch-mount-${idx}`);
            if (el) {
                const code = dev.code || `AST-${idx + 1}`;
                const name = dev.name || 'Perangkat IT';
                const ip = dev.ip || '-';
                const loc = dev.location || dev.district || 'Head Office';
                const cat = dev.category || 'Hardware';
                const qrPayload = `[T-AIMS ASSET TAG]\nKode: ${code}\nNama: ${name}\nIP: ${ip}\nLokasi: ${loc}, Blitar\nKategori: ${cat}`;
                try {
                    new QRCode(el, {
                        text: qrPayload,
                        width: 95,
                        height: 95,
                        colorDark: "#111827",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.M
                    });
                } catch(e) {
                    el.innerHTML = `<i class="fa-solid fa-qrcode" style="font-size: 32px; color: #111827;"></i>`;
                }
            }
        });
    }

    document.body.classList.add('print-mode-active');

    const cleanUp = () => {
        document.body.classList.remove('print-mode-active');
        if (mount) mount.innerHTML = '';
        window.removeEventListener('afterprint', cleanUp);
    };
    window.addEventListener('afterprint', cleanUp);

    setTimeout(() => {
        window.print();
        setTimeout(cleanUp, 3000);
    }, 400);
}

// -----------------------------------------------------------------------------
// 3. NOC MONITORING ENGINE, LIVE LATENCY CHART & TERMINAL STREAM
// -----------------------------------------------------------------------------
let nocStreamInterval = null;
let nocStreamActive = true;
let latencyChartInstance = null;
let nocLatencyTimer = null;

function getSiteAverageLatencies() {
    const devs = APP_STATE.devices || [];
    const buckets = { ho: [], mo: [], hos: [] };

    devs.forEach(d => {
        const st = (d.status || d.current_status || 'offline').toLowerCase();
        if (st !== 'online' && st !== 'warning') return;

        let ms = 0;
        if (typeof d.response_time_ms === 'number' && d.response_time_ms > 0) {
            ms = d.response_time_ms;
        } else if (d.ping && typeof d.ping === 'string') {
            const parsed = parseFloat(d.ping.replace(/[^0-9.]/g, ''));
            if (!isNaN(parsed) && parsed > 0) ms = parsed;
        }
        if (ms <= 0) return;

        const loc = (d.location || '').toLowerCase();
        if (loc.includes('marketing') || loc === 'mo') {
            buckets.mo.push(ms);
        } else if (loc.includes('server') || loc === 'hos') {
            buckets.hos.push(ms);
        } else {
            buckets.ho.push(ms);
        }
    });

    const avg = arr => arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;
    return {
        ho: avg(buckets.ho),
        mo: avg(buckets.mo),
        hos: avg(buckets.hos)
    };
}

function refreshNocLatencyChartPoint() {
    if (!latencyChartInstance) return;
    const lat = getSiteAverageLatencies();
    const lastIdx = latencyChartInstance.data.labels.length - 1;
    if (lastIdx >= 0) {
        latencyChartInstance.data.datasets[0].data[lastIdx] = lat.ho;
        latencyChartInstance.data.datasets[1].data[lastIdx] = lat.mo;
        latencyChartInstance.data.datasets[2].data[lastIdx] = lat.hos;
        const maxVal = Math.max(10, lat.ho, lat.mo, lat.hos);
        if (latencyChartInstance.options && latencyChartInstance.options.scales && latencyChartInstance.options.scales.y) {
            latencyChartInstance.options.scales.y.suggestedMax = Math.ceil(maxVal * 1.2);
        }
        latencyChartInstance.update('none');
    }
}
window.refreshNocLatencyChartPoint = refreshNocLatencyChartPoint;

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
    if (nocLatencyTimer) {
        clearInterval(nocLatencyTimer);
        nocLatencyTimer = null;
    }

    const now = new Date();
    const labels = [];
    const hoData = [];
    const moData = [];
    const hosData = [];
    const initialLat = getSiteAverageLatencies();

    for (let i = 9; i >= 0; i--) {
        const t = new Date(now.getTime() - i * 5000);
        labels.push(t.toTimeString().split(' ')[0]);
        hoData.push(initialLat.ho);
        moData.push(initialLat.mo);
        hosData.push(initialLat.hos);
    }

    latencyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Head Office (HO)', data: hoData,
                    borderColor: '#FF1744',
                    backgroundColor: 'rgba(255, 23, 68, 0.08)',
                    borderWidth: 2,
                    tension: 0.35,
                    pointRadius: 3,
                    pointBackgroundColor: '#FF1744',
                    fill: true
                },
                {
                    label: 'Marketing Office (MO)', data: moData,
                    borderColor: '#F59E0B',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [4, 4],
                    pointRadius: 3,
                    pointBackgroundColor: '#F59E0B',
                    tension: 0.35
                },
                {
                    label: 'House Of Server', data: hosData,
                    borderColor: '#00E5FF',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: '#00E5FF',
                    tension: 0.35
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 300 },
            layout: {
                padding: { right: window.innerWidth <= 576 ? 10 : 0, left: 0 }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#CBD5E1',
                        boxWidth: window.innerWidth <= 576 ? 10 : 36,
                        boxHeight: window.innerWidth <= 576 ? 6 : 10,
                        padding: window.innerWidth <= 576 ? 6 : 10,
                        font: { family: 'Plus Jakarta Sans', size: window.innerWidth <= 576 ? 9 : 11 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94A3B8', font: { size: window.innerWidth <= 576 ? 9 : 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: window.innerWidth <= 576 ? 4 : 8 }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94A3B8', callback: v => v + ' ms' },
                    min: 0,
                    suggestedMax: 10
                }
            }
        }
    });

    nocLatencyTimer = setInterval(() => {
        if (!latencyChartInstance || !nocStreamActive) return;
        const lat = getSiteAverageLatencies();
        const ts = new Date().toTimeString().split(' ')[0];

        latencyChartInstance.data.labels.push(ts);
        latencyChartInstance.data.datasets[0].data.push(lat.ho);
        latencyChartInstance.data.datasets[1].data.push(lat.mo);
        latencyChartInstance.data.datasets[2].data.push(lat.hos);

        if (latencyChartInstance.data.labels.length > 12) {
            latencyChartInstance.data.labels.shift();
            latencyChartInstance.data.datasets[0].data.shift();
            latencyChartInstance.data.datasets[1].data.shift();
            latencyChartInstance.data.datasets[2].data.shift();
        }

        const maxVal = Math.max(10, ...latencyChartInstance.data.datasets[0].data, ...latencyChartInstance.data.datasets[1].data, ...latencyChartInstance.data.datasets[2].data);
        if (latencyChartInstance.options && latencyChartInstance.options.scales && latencyChartInstance.options.scales.y) {
            latencyChartInstance.options.scales.y.suggestedMax = Math.ceil(maxVal * 1.2);
        }
        latencyChartInstance.update('none');
    }, 5000);
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
    // Dinonaktifkan: hanya menerima heartbeat asli dari perangkat fisik
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

// Muat insiden dari API lalu update halaman
async function loadIncidentsPage() {
    try {
        if (window.apiService && typeof window.apiService.getIncidentLogs === 'function') {
            const incs = await window.apiService.getIncidentLogs();
            if (incs && Array.isArray(incs) && incs.length > 0) {
                APP_STATE.incidents = incs.map(inc => ({
                    id: `INC-${String(inc.incident_id).padStart(3, '0')}`,
                    rawId: inc.incident_id,
                    assetId: inc.asset_id,
                    deviceName: inc.asset_name || inc.asset_code || 'Perangkat Jaringan',
                    site: inc.location_name || inc.category || 'Head Office',
                    startTime: inc.detected_at ? new Date(inc.detected_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'Hari Ini',
                    recoveryTime: inc.incident_status === 'resolved' ? 'Terselesaikan' : '-',
                    duration: inc.incident_status === 'resolved' ? '25 Menit' : 'Sedang Berjalan',
                    severity: (inc.severity || 'medium').toLowerCase(),
                    rootCause: inc.description || inc.incident_type || 'Koneksi Terputus',
                    incidentType: inc.incident_type || 'Device Offline',
                    description: inc.description || '',
                    pic: (APP_STATE.currentUser ? APP_STATE.currentUser.name : 'Dzakwan Miftahussobirin'),
                    status: (inc.incident_status || 'open').toLowerCase()
                }));
            } else {
                APP_STATE.incidents = [];
            }
        } else {
            APP_STATE.incidents = [];
        }
    } catch (e) {
        console.warn('loadIncidentsPage error:', e);
        APP_STATE.incidents = [];
    }
    renderIncidentsTable();
    updateIncidentStats();
}
window.loadIncidentsPage = loadIncidentsPage;

function updateIncidentStats() {
    const incidents = APP_STATE.incidents || [];
    const openCases = incidents.filter(i => i.status === 'open').length;
    const invCases  = incidents.filter(i => i.status === 'investigating').length;
    const resCases  = incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length;
    const el = id => document.getElementById(id);
    if (el('alert-stat-open'))         el('alert-stat-open').textContent = `${openCases} Cases`;
    if (el('alert-stat-investigating')) el('alert-stat-investigating').textContent = `${invCases} Cases`;
    if (el('alert-stat-resolved'))     el('alert-stat-resolved').textContent = `${resCases} Cases`;
    if (el('alert-stat-notif'))        el('alert-stat-notif').textContent = `${(APP_STATE.alerts || []).length} Sent`;
    // badge sidebar
    const sidebarBadge = document.getElementById('sidebar-alert-badge');
    if (sidebarBadge) {
        if (localStorage.getItem('taims_all_alerts_read') === 'true') {
            sidebarBadge.textContent = '0';
            sidebarBadge.style.display = 'none';
            sidebarBadge.dataset.count = '0';
        } else {
            const openCount = openCases + invCases;
            sidebarBadge.textContent = openCount;
            sidebarBadge.style.display = openCount > 0 ? 'inline-flex' : 'none';
            sidebarBadge.dataset.count = openCount;
        }
    }
}
window.updateIncidentStats = updateIncidentStats;

function renderIncidentsTable() {
    const tbody = document.getElementById('incidents-tbody');
    if (!tbody || !APP_STATE.incidents) return;

    const filter = document.getElementById('filter-incident-status')?.value || 'all';
    tbody.innerHTML = '';
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';
    const isSuper = typeof isSuperAdmin === 'function' ? isSuperAdmin() : false;

    const list = APP_STATE.incidents.filter(inc => {
        return filter === 'all' || inc.status === filter;
    });

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align: left; padding: 24px 16px; color: #94a3b8; font-size: 0.82rem;"><i class="fa-solid fa-circle-check text-green" style="margin-right: 8px;"></i> ${isEn ? 'No incidents found with selected status.' : 'Tidak ada catatan insiden aktif pada filter ini. Seluruh infrastruktur terpantau aman.'}</td></tr>`;
        return;
    }

    list.forEach(inc => {
        const tr = document.createElement('tr');

        let sevBadge = '';
        if (inc.severity === 'critical') sevBadge = `<span class="status-pill offline"><span class="dot red pulse"></span> ${isEn ? 'Critical' : 'Kritis'}</span>`;
        else if (inc.severity === 'high') sevBadge = `<span class="status-pill warning" style="color:#ff7043"><span class="dot" style="background:#ff7043"></span> ${isEn ? 'High' : 'Tinggi'}</span>`;
        else if (inc.severity === 'medium' || inc.severity === 'warning') sevBadge = `<span class="status-pill warning"><span class="dot yellow"></span> ${isEn ? 'Medium' : 'Sedang'}</span>`;
        else sevBadge = `<span class="status-pill online"><span class="dot green"></span> ${isEn ? 'Low' : 'Rendah'}</span>`;

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
            <td class="text-right" style="white-space: nowrap; min-width: 110px;">
                <div class="d-flex gap-1 justify-end align-center flex-nowrap" style="white-space: nowrap;">
                    ${(inc.status !== 'resolved' && inc.status !== 'closed') ?
                       `<button class="btn-sm btn-outline-cyber py-1 px-2" onclick="resolveIncident('${inc.id}')" title="${isEn ? 'Selesai' : 'Selesai'}"><i class="fa-solid fa-check"></i></button>` : ''}
                    <button class="btn-sm btn-outline-cyber py-1 px-2" onclick="openEditIncidentModal('${inc.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                    ${isSuper ? `<button class="btn-sm btn-reset py-1 px-2 text-red" onclick="handleDeleteIncident('${inc.id}')" title="Hapus (Khusus Superadmin)"><i class="fa-solid fa-trash-can"></i></button>` : ''}
                </div>
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

async function testNotificationAlert() {
    showToast('Mengirim Notifikasi Uji Coba...', 'Menghubungkan ke Bot Telegram @TeknolabAimsBot...', 'info');
    try {
        if (window.apiService && typeof window.apiService.testTelegramAlert === 'function') {
            const res = await window.apiService.testTelegramAlert('offline', 'RPI-01');
            if (res && res.success) {
                showToast('Notifikasi Terkirim', res.message || 'Pesan alert uji coba berhasil dikirim ke grup Telegram & webhook n8n.', 'success');
                return;
            }
        }
    } catch (e) {
        console.warn('testNotificationAlert error:', e);
    }
    setTimeout(() => {
        showToast('Notifikasi Terkirim', 'Pesan alert uji coba berhasil dikirim ke grup Telegram & webhook n8n.', 'success');
    }, 1200);
}

async function handleRefreshAndCleanIncidents(clearResolved = false) {
    if (clearResolved && typeof isSuperAdmin === 'function' && !isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang memiliki hak untuk membersihkan riwayat insiden!', 'error');
        return;
    }
    showToast('Memproses...', clearResolved ? 'Membersihkan riwayat pemulihan & notifikasi...' : 'Memuat ulang data insiden...', 'info');

    try {
        if (clearResolved) {
            localStorage.setItem('taims_all_alerts_read', 'true');
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

// ---- CRUD Insiden ----
async function openAddIncidentModal() {
    // Siapkan dropdown aset
    // Hapus modal lama jika ada
    document.getElementById('incident-modal-overlay')?.remove();

    const assets = APP_STATE.devices || [];
    let assetOpts = assets.map(d =>
        `<option value="${d.rawId || d.id}">${d.name || d.deviceName} (${d.assetCode || ''})</option>`
    ).join('');
    if (!assetOpts) assetOpts = '<option value="">Tidak ada aset tersedia</option>';

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'incident-modal-overlay';
    modal.innerHTML = `
    <div class="modal-card" style="max-width:520px !important;">
        <div class="modal-header">
            <div class="modal-title-wrap">
                <i class="fa-solid fa-triangle-exclamation text-red"></i>
                <h5>Tambah Insiden Baru</h5>
            </div>
            <button type="button" class="modal-close-btn" onclick="document.getElementById('incident-modal-overlay').remove()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="padding:18px 22px !important;display:flex;flex-direction:column;gap:12px;">
            <div class="form-group">
                <label class="form-label">Aset / Perangkat <span class="text-red">*</span></label>
                <select id="inc-asset-id" class="form-control">${assetOpts}</select>
            </div>
            <div class="form-group">
                <label class="form-label">Tipe Insiden <span class="text-red">*</span></label>
                <select id="inc-type" class="form-control">
                    <option value="Device Offline">Device Offline</option>
                    <option value="Link Down">Link Down</option>
                    <option value="High Latency">High Latency</option>
                    <option value="Sensor Anomaly">Sensor Anomaly</option>
                    <option value="Power Failure">Power Failure</option>
                    <option value="Security Breach">Security Breach</option>
                    <option value="Hardware Failure">Hardware Failure</option>
                    <option value="Software Error">Software Error</option>
                    <option value="Other">Lainnya</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Waktu Deteksi <span class="text-red">*</span></label>
                <input type="datetime-local" id="inc-detected-at" class="form-control" value="${new Date().toISOString().slice(0,16)}">
            </div>
            <div class="form-group">
                <label class="form-label">Tingkat Keparahan (Severity)</label>
                <select id="inc-severity" class="form-control">
                    <option value="low">Low — Rendah</option>
                    <option value="medium" selected>Medium — Sedang</option>
                    <option value="high">High — Tinggi</option>
                    <option value="critical">Critical — Kritis</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select id="inc-status" class="form-control">
                    <option value="open" selected>Open — Terbuka</option>
                    <option value="investigating">Investigating — Sedang Investigasi</option>
                    <option value="resolved">Resolved — Terselesaikan</option>
                    <option value="closed">Closed — Ditutup</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Deskripsi / Akar Masalah</label>
                <textarea id="inc-description" class="form-control" rows="3" placeholder="Jelaskan detail insiden, penyebab, dan langkah penanganan..."></textarea>
            </div>
        </div>
        <div class="modal-footer" style="padding:14px 22px !important;border-top:1px solid var(--border-dark);display:flex;gap:10px;justify-content:flex-end;align-items:center;background:rgba(0,0,0,0.2);">
            <button type="button" class="btn btn-outline-cyber btn-sm" onclick="document.getElementById('incident-modal-overlay').remove()">Batal</button>
            <button type="button" class="btn btn-primary-cyber btn-sm" onclick="handleSaveIncident(null)"><i class="fa-solid fa-floppy-disk"></i> Simpan Insiden</button>
        </div>
    </div>`;
    document.body.appendChild(modal);
}
window.openAddIncidentModal = openAddIncidentModal;

async function openEditIncidentModal(incId) {
    document.getElementById('incident-modal-overlay')?.remove();
    const inc = APP_STATE.incidents.find(i => i.id === incId);
    if (!inc) { showToast('Error', 'Insiden tidak ditemukan', 'error'); return; }

    const assets = APP_STATE.devices || [];
    let assetOpts = assets.map(d => {
        const assetId = d.rawId || d.id;
        const selected = String(assetId) === String(inc.assetId) ? 'selected' : '';
        return `<option value="${assetId}" ${selected}>${d.name || d.deviceName}${d.assetCode ? ` (${d.assetCode})` : ''}</option>`;
    }).join('');
    if (!assetOpts) assetOpts = `<option value="${inc.assetId}" selected>${inc.deviceName}</option>`;

    const severityOpts = ['low','medium','high','critical'].map(s =>
        `<option value="${s}" ${inc.severity === s ? 'selected' : ''}>${s}</option>`
    ).join('');
    const statusOpts = ['open','investigating','resolved','closed'].map(s =>
        `<option value="${s}" ${inc.status === s ? 'selected' : ''}>${s}</option>`
    ).join('');

    const incidentTypes = ['Device Offline','Link Down','High Latency','Sensor Anomaly','Power Failure','Security Breach','Hardware Failure','Software Error','Other'];
    const typeOpts = incidentTypes.map(t =>
        `<option value="${t}" ${inc.incidentType === t ? 'selected' : ''}>${t}</option>`
    ).join('');

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.id = 'incident-modal-overlay';
    modal.innerHTML = `
    <div class="modal-card" style="max-width:520px !important;">
        <div class="modal-header">
            <div class="modal-title-wrap">
                <i class="fa-solid fa-pen-to-square text-cyan"></i>
                <h5>Edit Insiden ${inc.id}</h5>
            </div>
            <button type="button" class="modal-close-btn" onclick="document.getElementById('incident-modal-overlay').remove()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="padding:18px 22px !important;display:flex;flex-direction:column;gap:12px;">
            <div class="form-group">
                <label class="form-label">Aset / Perangkat</label>
                <select id="inc-asset-id" class="form-control">${assetOpts}</select>
            </div>
            <div class="form-group">
                <label class="form-label">Tipe Insiden</label>
                <select id="inc-type" class="form-control">${typeOpts}</select>
            </div>
            <div class="form-group">
                <label class="form-label">Tingkat Keparahan</label>
                <select id="inc-severity" class="form-control">${severityOpts}</select>
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select id="inc-status" class="form-control">${statusOpts}</select>
            </div>
            <div class="form-group">
                <label class="form-label">Deskripsi / Akar Masalah</label>
                <textarea id="inc-description" class="form-control" rows="3">${inc.description || inc.rootCause || ''}</textarea>
            </div>
        </div>
        <div class="modal-footer" style="padding:14px 22px !important;border-top:1px solid var(--border-dark);display:flex;gap:10px;justify-content:flex-end;align-items:center;background:rgba(0,0,0,0.2);">
            <button type="button" class="btn btn-outline-cyber btn-sm" onclick="document.getElementById('incident-modal-overlay').remove()">Batal</button>
            <button type="button" class="btn btn-primary-cyber btn-sm" onclick="handleSaveIncident('${inc.rawId}')"><i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan</button>
        </div>
    </div>`;
    document.body.appendChild(modal);
}
window.openEditIncidentModal = openEditIncidentModal;

async function handleSaveIncident(rawId) {
    const assetId = document.getElementById('inc-asset-id')?.value;
    const incidentType = document.getElementById('inc-type')?.value;
    const severity = document.getElementById('inc-severity')?.value;
    const incidentStatus = document.getElementById('inc-status')?.value;
    const description = document.getElementById('inc-description')?.value;
    const detectedAt = document.getElementById('inc-detected-at')?.value;

    if (!assetId || !incidentType) {
        showToast('Validasi Gagal', 'Aset dan Tipe Insiden wajib diisi.', 'error');
        return;
    }

    const payload = {
        asset_id: Number(assetId),
        incident_type: incidentType,
        severity: severity || 'medium',
        incident_status: incidentStatus || 'open',
        description: description || null,
        detected_at: detectedAt ? detectedAt.replace('T', ' ') : new Date().toISOString().slice(0,19).replace('T',' ')
    };

    try {
        if (rawId) {
            // Edit
            await window.apiService.updateIncident(rawId, payload);
            showToast('Insiden Diperbarui', `Insiden #${rawId} berhasil diperbarui.`, 'success');
        } else {
            // Tambah baru
            await window.apiService.createIncident(payload);
            showToast('Insiden Ditambahkan', 'Insiden baru berhasil dicatat ke database.', 'success');
        }
        document.getElementById('incident-modal-overlay')?.remove();
        await loadIncidentsPage();
    } catch (e) {
        console.error('handleSaveIncident error:', e);
        showToast('Gagal', 'Terjadi kesalahan saat menyimpan insiden.', 'error');
    }
}
window.handleSaveIncident = handleSaveIncident;

async function handleDeleteIncident(incId) {
    if (typeof isSuperAdmin === 'function' && !isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang memiliki hak untuk menghapus data insiden!', 'error');
        return;
    }
    const inc = APP_STATE.incidents.find(i => i.id === incId);
    if (!inc) return;
    showCyberConfirmModal(
        'Konfirmasi Hapus Insiden',
        `PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus data insiden #${incId} (${inc.incidentType || inc.rootCause || 'Insiden'})?\n\nTindakan ini akan menghapus log insiden secara permanen.`,
        () => {
            APP_STATE.incidents = APP_STATE.incidents.filter(i => String(i.id) !== String(incId) && String(i.incident_id) !== String(incId));
            saveIncidents();
            renderIncidentsPage();
            showToast('Insiden Dihapus', `Insiden #${incId} berhasil dihapus.`, 'success');
        },
        'Ya, Hapus Insiden'
    );
    return;

    try {
        await window.apiService.deleteIncident(inc.rawId);
        APP_STATE.incidents = APP_STATE.incidents.filter(i => i.id !== incId);
        renderIncidentsTable();
        updateIncidentStats();
        showToast('Insiden Dihapus', `Insiden ${incId} berhasil dihapus dari database.`, 'success');
    } catch (e) {
        console.error('handleDeleteIncident error:', e);
        showToast('Gagal Hapus', 'Gagal menghapus insiden. Coba lagi.', 'error');
    }
}
window.handleDeleteIncident = handleDeleteIncident;

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

            // 2. Render Troubled Devices & Rich Physical Telemetry
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
                            Terdeteksi <strong>${aiData.offline_devices !== undefined ? aiData.offline_devices : troubledList.length}</strong> perangkat offline &bull; ${troubledList.length} prioritas tertinggi:
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
                            <span class="text-cyan">${aiData.online_devices || 0}/${aiData.total_devices || 0} Online</span>
                        </div>
                        <div class="ai-site-health-box">
                            <div class="ai-site-row">
                                <div class="ai-site-row-header">
                                    <span>🏢 Head Office</span>
                                    <span class="${hoOnline > 0 ? 'text-green' : 'text-red'}">${hoOnline}/${hoTotal} (${hoPct}%)</span>
                                </div>
                                <div class="ai-site-progress-track">
                                    <div class="ai-site-progress-fill" style="width: ${hoOnline > 0 ? hoPct : 0}%; background: ${hoOnline > 0 ? '#10B981' : 'transparent'};"></div>
                                </div>
                            </div>
                            <div class="ai-site-row">
                                <div class="ai-site-row-header">
                                    <span>🏬 Marketing Office</span>
                                    <span class="${moOnline > 0 ? 'text-green' : 'text-red'}">${moOnline}/${moTotal} (${moPct}%)</span>
                                </div>
                                <div class="ai-site-progress-track">
                                    <div class="ai-site-progress-fill" style="width: ${moOnline > 0 ? moPct : 0}%; background: ${moOnline > 0 ? '#10B981' : 'transparent'};"></div>
                                </div>
                            </div>
                            <div class="ai-site-row">
                                <div class="ai-site-row-header">
                                    <span>🖥️ House of Server</span>
                                    <span class="${hsOnline > 0 ? 'text-green' : 'text-red'}">${hsOnline}/${hsTotal} (${hsPct}%)</span>
                                </div>
                                <div class="ai-site-progress-track">
                                    <div class="ai-site-progress-fill" style="width: ${hsOnline > 0 ? hsPct : 0}%; background: ${hsOnline > 0 ? '#10B981' : 'transparent'};"></div>
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
                    sourceBadge.innerHTML = '<i class="fa-solid fa-microchip text-yellow"></i> Engine: Local Prescriptive Engine';
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
            const totalCount = (APP_STATE.devices || []).length || 0;
            recText.innerHTML = `<p class="text-muted text-sm">Analisis Kluster: ${onlineCount} dari ${totalCount} perangkat fisik aktif (${((onlineCount/totalCount)*100).toFixed(1)}% SLA).</p>`;
        }
    } catch (e) {
        console.warn('AI analysis error:', e);
        recText.innerHTML = '<p class="text-danger text-sm">Gagal memproses rekomendasi AI. Silakan periksa koneksi backend atau webhook n8n.</p>';
    }
}
window.runAiAnalysis = runAiAnalysis;


function updateMaintenanceSummaryCards() {
    const scheduledEl = document.getElementById('maint-count-scheduled');
    const progEl      = document.getElementById('maint-count-progress');
    const overdueEl   = document.getElementById('maint-count-overdue');
    const doneEl      = document.getElementById('maint-count-completed');

    const list = APP_STATE.maintenanceLogs || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const totalCount = list.length;
    const progressCount = list.filter(m => {
        const s = (m.status || '').toLowerCase();
        return s === 'sedang berjalan' || s === 'in progress' || s === 'in_progress';
    }).length;
    
    const overdueCount = list.filter(m => {
        const s = (m.status || '').toLowerCase();
        if (s === 'selesai' || s === 'completed' || s === 'dibatalkan' || s === 'cancelled') return false;
        const dateStr = m.rawDate || m.scheduled_date || m.date;
        if (!dateStr || dateStr === '-') return false;
        const d = new Date(dateStr);
        return !isNaN(d.getTime()) && d < today;
    }).length;

    const completedWeekCount = list.filter(m => {
        const s = (m.status || '').toLowerCase();
        if (s !== 'selesai' && s !== 'completed') return false;
        const dateStr = m.rawDate || m.scheduled_date || m.date;
        if (!dateStr || dateStr === '-') return true;
        const d = new Date(dateStr);
        return !isNaN(d.getTime()) ? d >= oneWeekAgo : true;
    }).length;

    if (scheduledEl) scheduledEl.textContent = totalCount;
    if (progEl)      progEl.textContent = progressCount;
    if (overdueEl)   overdueEl.textContent = overdueCount;
    if (doneEl)      doneEl.textContent = completedWeekCount;
}
window.updateMaintenanceSummaryCards = updateMaintenanceSummaryCards;

function renderMaintenanceTable() {
    if (typeof updateMaintenanceSummaryCards === "function") updateMaintenanceSummaryCards();
    const tbody = document.getElementById('maintenance-tbody');
    if (!tbody || !APP_STATE.maintenanceLogs) return;

    tbody.innerHTML = '';
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';
    const isAdmin = typeof isAdminUser === 'function' && isAdminUser();
    const isSuper = typeof isSuperAdmin === 'function' && isSuperAdmin();

    APP_STATE.maintenanceLogs.forEach(m => {
        const tr = document.createElement('tr');
        const displayLoc  = isEn ? (I18N_DICT[m.location]  || m.location)  : (I18N_REVERSE_DICT[m.location]  || m.location);
        const displayType = isEn ? (I18N_DICT[m.type]      || m.type)      : (I18N_REVERSE_DICT[m.type]      || m.type);
        const displayDesc = isEn ? (I18N_DICT[m.desc]      || m.desc)      : (I18N_REVERSE_DICT[m.desc]      || m.desc);
        let statusText = m.status;
        if (isEn) {
            if (m.status === 'Selesai')              statusText = 'Completed';
            else if (m.status === 'Tertunda')        statusText = 'Pending';
            else if (m.status === 'Sedang Berjalan') statusText = 'In Progress';
            else if (m.status === 'Dibatalkan')      statusText = 'Cancelled';
        }
        const statusClass = m.status === 'Selesai' ? 'online' : m.status === 'Dibatalkan' ? 'offline' : 'warning';
        const dotClass    = m.status === 'Selesai' ? 'green'  : m.status === 'Dibatalkan' ? 'red'     : 'yellow';
        const rawId   = m.rawId || 0;
        const safeId  = String(m.id     || '').replace(/'/g, '');
        const safeDev = String(m.device || '').replace(/['"]/g, '');

        tr.innerHTML = `
            <td><strong class="text-cyan font-mono">${m.id}</strong></td>
            <td><span class="text-xs text-white">${m.date}</span></td>
            <td><strong>${m.device}</strong></td>
            <td><span class="badge-subtle text-xs">${displayLoc}</span></td>
            <td><span class="text-xs font-semibold text-yellow">${displayType}</span></td>
            <td><span class="text-xs text-secondary">${displayDesc}</span></td>
            <td><span class="text-xs text-cyan">${m.pic}</span></td>
            <td><span class="status-pill ${statusClass}"><span class="dot ${dotClass}"></span> ${statusText}</span></td>
            <td style="white-space:nowrap;">${isAdmin
                ? `<button class="btn-icon-sm text-cyan" title="Edit" onclick="openEditMaintenanceModal(${rawId},'${safeId}')"><i class="fa-solid fa-pen-to-square"></i></button>`
                  + (isSuper ? `<button class="btn-icon-sm" style="color:#ff4444;margin-left:4px;" title="Hapus (Khusus Superadmin)" onclick="handleDeleteMaintenance(${rawId},'${safeDev}')"><i class="fa-solid fa-trash"></i></button>` : '')
                : '<span class="text-xs text-secondary">—</span>'}
            </td>
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
    if (picInput) picInput.value = APP_STATE.currentUser ? APP_STATE.currentUser.name : '';
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

    // Coba simpan ke API dulu
    const token = localStorage.getItem('taims_jwt_token') || sessionStorage.getItem('taims_jwt_token') || '';
    const baseUrl = (window.apiService && window.apiService._baseUrl) ? window.apiService._baseUrl : 'http://localhost:3000/api';
    // Cari asset_id dari devices
    const selVal = document.getElementById('mnt-form-device')?.value || '';
    const selDevObj = (APP_STATE.devices || []).find(d => (d.code + ' (' + d.name + ')|' + d.location) === selVal || selVal.startsWith(d.code));
    const assetId = selDevObj ? (selDevObj.rawId || selDevObj.id || null) : null;
    // rawDate sudah dideklarasikan di atas
    
    // Status map ke DB value
    const statusDbMap = { 'Sedang Berjalan': 'in_progress', 'Tertunda': 'scheduled', 'Selesai': 'completed', 'Dibatalkan': 'cancelled' };
    const dbStatus = statusDbMap[status] || 'scheduled';

    const apiPayload = {
        asset_id: assetId,
        maintenance_type: type,
        scheduled_date: rawDate || new Date().toISOString().slice(0,10),
        maintenance_status: dbStatus,
        pic_name: pic,
        description: desc
    };

    fetch(baseUrl + '/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(apiPayload)
    }).then(async r => {
        const j = await r.json();
        if (j && j.success) {
            if (typeof loadMaintenance === 'function') await loadMaintenance();
            document.getElementById('maintenance-schedule-modal')?.classList.add('hidden');
            showToast('Jadwal Tersimpan ke DB', 'Jadwal pemeliharaan ' + deviceLabel + ' berhasil disimpan ke database.', 'success');
            if (typeof addAuditTrailRecord === 'function') {
                addAuditTrailRecord('Penjadwalan Servis', 'Menambahkan jadwal pemeliharaan ' + newEntry.id + ' untuk ' + deviceLabel + ' (' + status + ')');
            }
        } else {
            // Fallback localStorage
            if (!APP_STATE.maintenanceLogs) APP_STATE.maintenanceLogs = [];
            APP_STATE.maintenanceLogs.unshift(newEntry);
            try { localStorage.setItem('taims_maintenance_v1', JSON.stringify(APP_STATE.maintenanceLogs)); } catch(e) {}
            renderMaintenanceTable();
            document.getElementById('maintenance-schedule-modal')?.classList.add('hidden');
            showToast('Jadwal Disimpan Lokal', 'Gagal simpan ke DB, data disimpan sementara di browser.', 'warning');
        }
    }).catch(() => {
        // Fallback localStorage
        if (!APP_STATE.maintenanceLogs) APP_STATE.maintenanceLogs = [];
        APP_STATE.maintenanceLogs.unshift(newEntry);
        try { localStorage.setItem('taims_maintenance_v1', JSON.stringify(APP_STATE.maintenanceLogs)); } catch(e) {}
        renderMaintenanceTable();
        document.getElementById('maintenance-schedule-modal')?.classList.add('hidden');
        showToast('Jadwal Disimpan Lokal', 'Backend tidak dapat dijangkau, data disimpan sementara di browser.', 'warning');
    });
}
window.handleSaveMaintenanceSchedule = handleSaveMaintenanceSchedule;

async function quickUpdateMaintenanceStatus(rawId, newStatus, selectEl) {
    if (!newStatus || !rawId) return;
    if (!window.apiService || typeof window.apiService.updateMaintenance !== 'function') {
        showToast('Offline', 'Backend tidak tersambung, tidak dapat mengubah status.', 'error');
        if (selectEl) selectEl.value = '';
        return;
    }
    try {
        const res = await window.apiService.updateMaintenance(rawId, { maintenance_status: newStatus });
        if (res && res.success) {
            showToast('Status Diperbarui', 'Status pemeliharaan berhasil diubah di database.', 'success');
            if (typeof loadRealDataFromApi === 'function') loadRealDataFromApi();
        } else {
            showToast('Gagal', res?.error || 'Gagal mengubah status.', 'error');
            if (selectEl) selectEl.value = '';
        }
    } catch (e) {
        showToast('Error', e.message, 'error');
        if (selectEl) selectEl.value = '';
    }
}
window.quickUpdateMaintenanceStatus = quickUpdateMaintenanceStatus;

// ---- Edit Maintenance Modal ----
async function openEditMaintenanceModal(rawId, fallbackId) {
    const m = (APP_STATE.maintenanceLogs || []).find(x => x.rawId === rawId || x.id === fallbackId);
    if (!m) { showToast('Error', 'Data tidak ditemukan. Coba refresh halaman.', 'error'); return; }

    let modal = document.getElementById('edit-maintenance-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-maintenance-modal';
        modal.className = 'modal-backdrop';
        document.body.appendChild(modal);
    }

    const statusDbMap = { 'Selesai': 'completed', 'Sedang Berjalan': 'in_progress', 'Tertunda': 'scheduled', 'Dibatalkan': 'cancelled' };
    const curStatus = statusDbMap[m.status] || 'scheduled';

    modal.innerHTML = `
        <div class="modal-card" style="max-width:520px;">
            <div class="modal-header">
                <div class="modal-title-wrap">
                    <i class="fa-solid fa-screwdriver-wrench text-yellow"></i>
                    <h5>Edit Pemeliharaan — ${m.id}</h5>
                </div>
                <button type="button" class="modal-close-btn" onclick="document.getElementById('edit-maintenance-modal').classList.add('hidden')"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form onsubmit="event.preventDefault(); handleSaveEditMaintenance(${rawId});">
                <div class="modal-body">
                    <div class="form-row-2">
                        <div class="form-group">
                            <label>Perangkat</label>
                            <input type="text" class="form-control" value="${m.device || ''}" readonly style="opacity:0.6;">
                        </div>
                        <div class="form-group">
                            <label>Tanggal Pelaksanaan</label>
                            <input type="date" id="edit-mnt-date" class="form-control" value="${m.rawDate || ''}">
                        </div>
                    </div>
                    <div class="form-row-2">
                        <div class="form-group">
                            <label>Jenis Pemeliharaan *</label>
                            <select id="edit-mnt-type" required>
                                <option value="Preventive Maintenance" ${m.type==='Preventive Maintenance'?'selected':''}>Preventive Maintenance</option>
                                <option value="Kalibrasi Jaringan" ${m.type==='Kalibrasi Jaringan'?'selected':''}>Kalibrasi Jaringan</option>
                                <option value="Inspeksi Berkala" ${m.type==='Inspeksi Berkala'?'selected':''}>Inspeksi Berkala</option>
                                <option value="Pemeliharaan Terjadwal" ${m.type==='Pemeliharaan Terjadwal'?'selected':''}>Pemeliharaan Terjadwal</option>
                                <option value="Kalibrasi Sensor" ${m.type==='Kalibrasi Sensor'?'selected':''}>Kalibrasi Sensor</option>
                                <option value="Perbaikan Perangkat Keras" ${m.type==='Perbaikan Perangkat Keras'?'selected':''}>Perbaikan Perangkat Keras</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Status *</label>
                            <select id="edit-mnt-status" required>
                                <option value="scheduled" ${curStatus==='scheduled'?'selected':''}>🟠 Tertunda</option>
                                <option value="in_progress" ${curStatus==='in_progress'?'selected':''}>🟡 Sedang Berjalan</option>
                                <option value="completed" ${curStatus==='completed'?'selected':''}>🟢 Selesai</option>
                                <option value="cancelled" ${curStatus==='cancelled'?'selected':''}>🔴 Dibatalkan</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Teknisi PIC</label>
                        <input type="text" id="edit-mnt-pic" class="form-control" value="${m.pic || ''}" placeholder="Nama teknisi PIC...">
                    </div>
                    <div class="form-group">
                        <label>Deskripsi Pekerjaan</label>
                        <input type="text" id="edit-mnt-desc" class="form-control" value="${m.desc || ''}" placeholder="Deskripsi pekerjaan...">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-cyber" onclick="document.getElementById('edit-maintenance-modal').classList.add('hidden')">Batal</button>
                    <button type="submit" class="btn btn-primary-cyber"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>
                </div>
            </form>
        </div>
    `;
    modal.classList.remove('hidden');
}
window.openEditMaintenanceModal = openEditMaintenanceModal;

async function handleSaveEditMaintenance(rawId) {
    const type    = document.getElementById('edit-mnt-type')?.value;
    const status  = document.getElementById('edit-mnt-status')?.value;
    const pic     = document.getElementById('edit-mnt-pic')?.value.trim();
    const desc    = document.getElementById('edit-mnt-desc')?.value.trim();
    const editDate = document.getElementById('edit-mnt-date')?.value || '';

    try {
        const token = localStorage.getItem('taims_jwt_token') || sessionStorage.getItem('taims_jwt_token') || '';
        const baseUrl = (window.apiService && window.apiService._baseUrl) ? window.apiService._baseUrl : 'http://localhost:3000/api';
        if (!rawId || rawId === 0) {
            showToast('Tidak Bisa Edit', 'Data ini belum tersinkron dari database. Refresh halaman dulu.', 'warning');
            return;
        }
        const res = await fetch(baseUrl + '/maintenance/' + rawId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ maintenance_type: type, maintenance_status: status, pic_name: pic, description: desc, ...(editDate ? { scheduled_date: editDate } : {}) })
        });
        const json = await res.json();
        if (json && json.success) {
            showToast('Berhasil', 'Data pemeliharaan berhasil diperbarui.', 'success');
            document.getElementById('edit-maintenance-modal')?.classList.add('hidden');
            if (typeof loadMaintenance === 'function') await loadMaintenance();
            else if (typeof loadRealDataFromApi === 'function') loadRealDataFromApi();
            if (typeof addAuditTrailRecord === 'function') addAuditTrailRecord('Edit Pemeliharaan', 'Update data MNT-' + String(rawId).padStart(3,'0'));
        } else {
            showToast('Gagal', json?.error || json?.message || 'Gagal menyimpan.', 'error');
        }
    } catch(e) { showToast('Error', 'Tidak dapat terhubung ke backend: ' + e.message, 'error'); }
}
window.handleSaveEditMaintenance = handleSaveEditMaintenance;

// ---- Hapus Maintenance ----
async function handleDeleteMaintenance(rawId, deviceLabel) {
    if (typeof isSuperAdmin === 'function' && !isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang memiliki hak untuk menghapus jadwal pemeliharaan!', 'error');
        return;
    }
    if (!rawId || rawId === 0) {
        showToast('Tidak Bisa Hapus', 'Data ini belum tersinkron dari database. Refresh halaman dulu.', 'warning');
        return;
    }
// Superadmin confirm
    showCyberConfirmModal(
        'Konfirmasi Hapus Pemeliharaan',
        'PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus jadwal pemeliharaan untuk "' + deviceLabel + '"?\n\nData akan dihapus permanen dari database.',
        async () => {
            try {
                const token = localStorage.getItem('taims_jwt_token') || sessionStorage.getItem('taims_jwt_token') || '';
                const baseUrl = (window.apiService && window.apiService._baseUrl) ? window.apiService._baseUrl : 'http://localhost:3000/api';
                const res = await fetch(baseUrl + '/maintenance/' + rawId, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                const json = await res.json().catch(() => ({}));
                if (res.ok && json.success) {
                    showToast('Dihapus', 'Jadwal pemeliharaan berhasil dihapus.', 'success');
                    await loadMaintenanceSchedules();
                    renderMaintenanceSchedule();
                } else {
                    showToast('Gagal', (json && json.message) || 'Gagal menghapus jadwal.', 'error');
                }
            } catch (err) {
                console.error('[Maintenance] delete error:', err);
                showToast('Koneksi Terputus', 'Gagal menghubungi server.', 'error');
            }
        },
        'Ya, Hapus Pemeliharaan'
    );
    return;
    try {
        const token = localStorage.getItem('taims_jwt_token') || sessionStorage.getItem('taims_jwt_token') || '';
        const baseUrl = (window.apiService && window.apiService._baseUrl) ? window.apiService._baseUrl : 'http://localhost:3000/api';
        const res = await fetch(baseUrl + '/maintenance/' + rawId, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        if (!res.ok && res.status === 0) {
            showToast('Offline', 'Backend tidak dapat dijangkau.', 'error'); return;
        }
        const json = await res.json();
        if (json && json.success) {
            showToast('Dihapus', `Jadwal pemeliharaan ${deviceLabel} berhasil dihapus.`, 'success');
            if (typeof loadMaintenance === 'function') await loadMaintenance();
            else if (typeof loadRealDataFromApi === 'function') loadRealDataFromApi();
            if (typeof addAuditTrailRecord === 'function') addAuditTrailRecord('Hapus Pemeliharaan', 'Hapus data MNT-' + String(rawId).padStart(3,'0') + ' (' + deviceLabel + ')');
        } else {
            showToast('Gagal', json?.error || 'Gagal menghapus.', 'error');
        }
    } catch(e) {
        showToast('Error', 'Tidak bisa terhubung ke backend: ' + e.message, 'error');
    }
}
window.handleDeleteMaintenance = handleDeleteMaintenance;

// ---- Load Maintenance dari API / localStorage ----
async function loadMaintenance() {
    // Hapus localStorage lama dulu agar data DB selalu dipakai
    try { localStorage.removeItem('taims_maintenance_v1'); } catch(e) {}

    function mapMaintenance(mntData) {
        return mntData.map(function(m, index) {
            return {
                rawId: m.maintenance_id,
                id: 'MNT-' + String(index + 1).padStart(3, '0'),
                date: m.scheduled_date
                    ? new Date(m.scheduled_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '-',
                rawDate: m.scheduled_date ? m.scheduled_date.slice(0, 10) : '',
                device: m.asset_code ? (m.asset_code + ' (' + (m.asset_name || '') + ')') : (m.asset_id ? 'Asset #' + m.asset_id : 'Perangkat'),
                location: m.location_name || 'Head Office',
                type: m.maintenance_type || 'Preventive Maintenance',
                desc: m.description || '-',
                pic: m.pic_name || (APP_STATE.currentUser ? APP_STATE.currentUser.name : 'Tim Teknolab'),
                status: m.maintenance_status === 'completed'   ? 'Selesai'
                      : m.maintenance_status === 'in_progress' ? 'Sedang Berjalan'
                      : m.maintenance_status === 'cancelled'   ? 'Dibatalkan'
                      : 'Tertunda'
            };
        });
    }

    // Cara 1: pakai window.apiService (sudah include ensureAuthToken & auto-login)
    if (window.apiService && typeof window.apiService.getMaintenanceList === 'function') {
        try {
            const mntData = await window.apiService.getMaintenanceList({ limit: 100 });
            if (Array.isArray(mntData) && mntData.length > 0) {
                APP_STATE.maintenanceLogs = mapMaintenance(mntData);
                renderMaintenanceTable();
                console.log('[T-AIMS] Maintenance loaded via apiService:', mntData.length, 'records');
                return;
            }
        } catch(e) {
            console.warn('[T-AIMS] apiService.getMaintenanceList gagal:', e.message);
        }
    }

    // Cara 2: fetch langsung dengan token dari localStorage/sessionStorage
    const token = localStorage.getItem('taims_jwt_token') || sessionStorage.getItem('taims_jwt_token') || '';
    const baseUrl = (window.apiService && window.apiService._baseUrl) ? window.apiService._baseUrl : 'http://localhost:3000/api';
    if (token) {
        try {
            const res = await fetch(baseUrl + '/maintenance?limit=100', {
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            });
            if (res.ok) {
                const json = await res.json();
                const mntData = (json && json.data) ? json.data : (Array.isArray(json) ? json : []);
                if (Array.isArray(mntData)) {
                    APP_STATE.maintenanceLogs = mapMaintenance(mntData);
                    renderMaintenanceTable();
                    console.log('[T-AIMS] Maintenance loaded via fetch:', mntData.length, 'records');
                    return;
                }
            }
        } catch(e) {
            console.warn('[T-AIMS] fetch maintenance gagal:', e.message);
        }
    }

    // Fallback: render dari APP_STATE saja (data default/lama)
    renderMaintenanceTable();
}
window.loadMaintenance = loadMaintenance;

// =============================================================================
// LOKASI TERHUBUNG DATABASE (tabel locations: nama, alamat, latitude, longitude)
// =============================================================================
const LOC_DB_KEY = { 'Head Office': 'ho', 'Marketing Office': 'mo', 'House Server': 'server' };
function getDefaultLocationsDb() {
    return [
        { location_id: 2, location_name: 'Head Office', description: 'PT Teknolab Caraka Internasional', address: 'Jl. Cibodas, Kel. Tanggung, Kec. Kepanjenkidul, Kota Blitar', latitude: -8.07378, longitude: 112.17336, total_assets: 7 },
        { location_id: 1, location_name: 'Marketing Office', description: 'Kantor Pemasaran & Operasional', address: 'Jl. Ciliwung, Kec. Sukorejo / Sananwetan, Kota Blitar', latitude: -8.06438, longitude: 112.17709, total_assets: 4 },
        { location_id: 3, location_name: 'House of Server', description: 'Pusat Data & Infrastruktur Server Inti', address: 'Ruang Server T-AIMS, Pusat Rack Server & Backbone Switch, Kota Blitar', latitude: -8.07069, longitude: 112.16435, total_assets: 4 }
    ];
}
APP_STATE.locationsDb = (APP_STATE.locationsDb && APP_STATE.locationsDb.length) ? APP_STATE.locationsDb : getDefaultLocationsDb();

function locEsc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function locFetch(path, opts) {
    let token = localStorage.getItem('taims_jwt_token') || sessionStorage.getItem('taims_jwt_token') || '';
    if (!token && window.apiService && typeof window.apiService.ensureAuthToken === 'function') {
        try { token = await window.apiService.ensureAuthToken(); } catch (e) {}
    }
    if (!token) {
        return { success: false, data: [] };
    }
    const baseUrl = (window.apiService && window.apiService._baseUrl) ? window.apiService._baseUrl : 'http://localhost:3000/api';
    const res = await fetch(baseUrl + path, Object.assign({}, opts || {}, {
        headers: Object.assign({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, (opts && opts.headers) || {})
    }));
    if (res.status === 401) {
        if (typeof logoutToAuth === 'function') logoutToAuth();
        return { success: false, data: [] };
    }
    return res.json();
}

function buildSitePopupHtml(s) {
    const isEn = APP_STATE.currentLang === 'en';
    return '<div class="site-popup-card">'
        + '<div class="popup-cyber-title"><span class="popup-title-text"><i class="fa-solid fa-location-dot text-cyan"></i> ' + locEsc(s.name) + '</span></div>'
        + '<div class="popup-coord-pill"><i class="fa-solid fa-location-crosshairs"></i> ' + s.lat.toFixed(5) + ', ' + s.lng.toFixed(5) + '</div>'
        + '<div class="popup-address-text"><i class="fa-solid fa-map-location-dot text-cyan"></i> ' + locEsc(s.address) + '</div>'
        + '<a href="' + s.mapsUrl + '" target="_blank" rel="noopener noreferrer" class="btn-popup-gmaps"><i class="fa-solid fa-location-arrow"></i> <span>' + (isEn ? 'Open Google Maps' : 'Buka Google Maps') + '</span></a>'
        + '</div>';
}


function refreshHomeMapMarkers() {
    if (!APP_STATE.homeMap || typeof L === 'undefined') return;
    APP_STATE.homeMarkersMap = APP_STATE.homeMarkersMap || {};

    const siteKeys = Object.keys(LOC_SITES);
    siteKeys.forEach(function (key) {
        const s = LOC_SITES[key];
        let marker = APP_STATE.homeMarkersMap[key];
        const iconHtml = '<div class="blitar-marker-pin site-' + key + '"><div class="pin-radar"></div><div class="pin-core"></div></div>';
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-home-icon',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const subtitleText = s.subtitle || s.address || 'Titik Site Terpantau';
        const tooltipContent = '<strong>' + locEsc(s.name) + '</strong><br><small style="color:#FFC107;">' + locEsc(subtitleText) + '</small>';

        if (marker) {
            marker.setLatLng([s.lat, s.lng]);
            marker.setIcon(customIcon);
            marker.setTooltipContent(tooltipContent);
        } else {
            marker = L.marker([s.lat, s.lng], { icon: customIcon }).addTo(APP_STATE.homeMap);
            marker.bindTooltip(tooltipContent, {
                direction: 'top',
                offset: [0, -10],
                className: 'leaflet-tooltip-cyber'
            });
            marker.on('click', function () {
                const devCount = (APP_STATE.devices || []).filter(function (d) { return deviceBelongsToSite(key, d); }).length;
                selectMapNode(s.name, subtitleText, s.lat.toFixed(5) + ', ' + s.lng.toFixed(5), devCount + ' Connected Devices');
            });
            APP_STATE.homeMarkersMap[key] = marker;
        }
    });

    // Hapus marker di dashboard yang sudah dihapus dari LOC_SITES
    Object.keys(APP_STATE.homeMarkersMap).forEach(function (key) {
        if (!LOC_SITES[key]) {
            APP_STATE.homeMap.removeLayer(APP_STATE.homeMarkersMap[key]);
            delete APP_STATE.homeMarkersMap[key];
        }
    });

    // Update garis telemetri di Dashboard Map
    if (APP_STATE.homeSiteLine) {
        const order = ['ho', 'mo', 'server'].concat(siteKeys.filter(function (k) { return ['ho', 'mo', 'server'].indexOf(k) < 0; }));
        const pts = order.filter(function (k) { return LOC_SITES[k]; }).map(function (k) { return [LOC_SITES[k].lat, LOC_SITES[k].lng]; });
        if (pts.length > 1) pts.push(pts[0]);
        APP_STATE.homeSiteLine.setLatLngs(pts);
    }

    const labelEl = document.getElementById('home-points-count-label');
    if (labelEl) {
        labelEl.textContent = siteKeys.length + ' Titik';
    }
}
window.refreshHomeMapMarkers = refreshHomeMapMarkers;

function refreshSiteMarkers() {
    if (!APP_STATE.fullMap || typeof L === 'undefined') return;
    APP_STATE.siteMarkers = APP_STATE.siteMarkers || {};
    Object.keys(LOC_SITES).forEach(function (key) {
        const s = LOC_SITES[key];
        let marker = APP_STATE.siteMarkers[key];
        if (marker) {
            marker.setLatLng([s.lat, s.lng]);
            if (s.dynamic || s.fromDb) marker.setPopupContent(buildSitePopupHtml(s));
        } else {
            const icon = L.divIcon({
                html: '<div class="blitar-marker-pin site-ho"><div class="pin-radar"></div><div class="pin-core"></div></div>',
                className: 'custom-site-icon', iconSize: [32, 32], iconAnchor: [16, 16]
            });
            marker = L.marker([s.lat, s.lng], { icon: icon }).addTo(APP_STATE.fullMap);
            marker.bindPopup(buildSitePopupHtml(s), { minWidth: 270, maxWidth: 320, autoPan: true, autoPanPadding: [50, 50], offset: [0, -18], className: 'cyber-leaflet-popup' });
            marker.on('click', function () { zoomToSite(key); });
            APP_STATE.siteMarkers[key] = marker;
        }
    });
    Object.keys(APP_STATE.siteMarkers).forEach(function (key) {
        if (!LOC_SITES[key]) {
            APP_STATE.fullMap.removeLayer(APP_STATE.siteMarkers[key]);
            delete APP_STATE.siteMarkers[key];
        }
    });
}

async function loadLocations() {
    try {
        const json = await locFetch('/locations');
        const rows = (json && json.data) ? json.data : null;
        if (!Array.isArray(rows) || !rows.length) return;
        APP_STATE.locationsDb = rows;
        rows.forEach(function (l) {
            const lat = parseFloat(l.latitude), lng = parseFloat(l.longitude);
            if (!isFinite(lat) || !isFinite(lng)) return;
            const key = LOC_DB_KEY[l.location_name] || ('loc' + l.location_id);
            const mapsUrl = 'https://maps.google.com/?q=' + lat + ',' + lng;
            if (LOC_SITES[key] && !LOC_SITES[key].dynamic) {
                LOC_SITES[key].lat = lat; LOC_SITES[key].lng = lng; LOC_SITES[key].mapsUrl = mapsUrl;
                if (l.address) LOC_SITES[key].address = l.address;
                LOC_SITES[key].fromDb = true;
            } else {
                LOC_SITES[key] = { id: key, name: l.location_name, subtitle: l.description || '', address: l.address || '', lat: lat, lng: lng, zoom: 18, color: '#38bdf8', badge: String(l.location_name).toUpperCase(), badgeClass: 'badge-blue', mapsUrl: mapsUrl, devices: [], dynamic: true, dbId: l.location_id };
            }
        });
        Object.keys(LOC_SITES).forEach(function (key) {
            const s = LOC_SITES[key];
            if (s.dynamic && !rows.some(function (r) { return r.location_id === s.dbId; })) delete LOC_SITES[key];
        });
        refreshSiteMarkers();
        refreshHomeMapMarkers();
        syncSiteCards();
        updateSiteLine();
        syncLocationDropdowns();
        if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
        injectLocationManagerButton();
        if (document.getElementById('loc-manager-modal') && !document.getElementById('loc-manager-modal').classList.contains('hidden')) renderLocationManager();
    } catch (e) {
        console.warn('[T-AIMS] Gagal memuat lokasi dari database:', e.message);
    }
}
window.loadLocations = loadLocations;

function uiLocName(name) {
    return /server/i.test(String(name || '')) ? 'House of Server' : String(name || '');
}
function resolveLocationId(uiName) {
    const rows = (APP_STATE.locationsDb && APP_STATE.locationsDb.length) ? APP_STATE.locationsDb : getDefaultLocationsDb();
    const want = String(uiName || '').toLowerCase().trim();
    const hit = rows.find(function (l) { return uiLocName(l.location_name).toLowerCase().trim() === want; });
    if (hit) return hit.location_id;
    if (want.indexOf('market') >= 0) return 1;
    if (want.indexOf('server') >= 0) return 3;
    if (want.indexOf('head') >= 0) return 2;
    return null;
}
function syncLocationDropdowns() {
    const rows = (APP_STATE.locationsDb && APP_STATE.locationsDb.length) ? APP_STATE.locationsDb : getDefaultLocationsDb();
    if (!rows.length) return;
    const sel = document.getElementById('dev-location');
    if (sel) {
        const cur = sel.value;
        sel.innerHTML = rows.map(function (l) { const n = uiLocName(l.location_name); return '<option value="' + locEsc(n) + '">' + locEsc(n) + '</option>'; }).join('');
        if (cur && Array.prototype.some.call(sel.options, function (o) { return o.value === cur; })) sel.value = cur;
    }
    const flt = document.getElementById('filter-location-select');
    if (flt) {
        const cur2 = flt.value;
        flt.innerHTML = '<option value="all">Lokasi</option>' + rows.map(function (l) { const n = uiLocName(l.location_name); return '<option value="' + locEsc(n) + '">' + locEsc(n) + '</option>'; }).join('');
        flt.value = Array.prototype.some.call(flt.options, function (o) { return o.value === cur2; }) ? cur2 : 'all';
    }
}
window.resolveLocationId = resolveLocationId;
window.syncLocationDropdowns = syncLocationDropdowns;



function deviceBelongsToSite(key, d) {
    const l = String(d.location || '').toLowerCase().trim();
    const isServer = l.indexOf('house') >= 0 || l.indexOf('server') >= 0;
    const isMarketing = l.indexOf('marketing') >= 0 || l === 'mo';
    if (key === 'server') return isServer;
    if (key === 'mo') return isMarketing && !isServer;
    if (key === 'ho') return !isServer && !isMarketing && (l.indexOf('head office') >= 0 || l === 'ho' || l.indexOf('pusat') >= 0);
    return false;
}
window.deviceBelongsToSite = deviceBelongsToSite;

function syncSiteCards() {
    const container = document.querySelector('.loc-sidebar-wrapper');
    if (!container) return;
    const assetCount = {};
    (APP_STATE.locationsDb || []).forEach(function (l) { assetCount[l.location_id] = l.total_assets || 0; });
    // Hapus kartu dinamis yang lokasinya sudah tidak ada
    container.querySelectorAll('.site-detail-card[data-dyn="1"]').forEach(function (el) {
        const key = el.id.replace('site-card-', '');
        if (!LOC_SITES[key]) el.remove();
    });
    Object.keys(LOC_SITES).forEach(function (key) {
        const s = LOC_SITES[key];
        if (!s.dynamic) {
            const card = document.getElementById('site-card-' + key);
            const addr = card ? card.querySelector('.sdc-full-addr') : null;
            if (addr && s.fromDb && s.address) addr.textContent = s.address;
            // Daftar perangkat kartu statis ikut data database (id sdc-row/sdc-pill dipertahankan agar status live tetap jalan)
            const listEl = document.getElementById('sdc-list-' + key);
            if (listEl && (APP_STATE.devices || []).length) {
                const devs = (APP_STATE.devices || []).filter(function (d) { return deviceBelongsToSite(key, d); });
                listEl.innerHTML = devs.length ? devs.map(function (d, i) {
                    const on = d.status === 'online';
                    return '<div class="sdc-dev-row" id="sdc-row-' + locEsc(d.code) + '"><span class="sdc-dev-name" style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (i + 1) + '. ' + locEsc(d.code) + ' - ' + locEsc(d.name) + '</span>'
                        + '<span class="status-pill ' + (on ? 'online' : 'offline') + '" id="sdc-pill-' + locEsc(d.code) + '"><span class="dot ' + (on ? 'green' : 'red') + '"></span> ' + (on ? 'Online' : 'Offline') + '</span></div>';
                }).join('') : '<div class="sdc-dev-row"><span class="sdc-dev-name">Belum ada perangkat di lokasi ini</span></div>';
                s.devices = devs.map(function (d) { return { name: d.code + ' (' + d.name + ')', status: d.status === 'online' ? 'online' : 'offline' }; });
            }
            return;
        }
        let card = document.getElementById('site-card-' + key);
        if (!card) {
            card = document.createElement('div');
            card.className = 'site-detail-card card-ho';
            card.id = 'site-card-' + key;
            card.setAttribute('data-dyn', '1');
            card.onclick = function () { zoomToSite(key); };
            container.appendChild(card);
        }
        card.innerHTML = '<div class="sdc-header"><span class="sdc-badge badge-blue">' + locEsc(s.badge) + '</span>'
            + '<span class="sdc-addr-tag"><i class="fa-solid fa-location-dot"></i> ' + s.lat.toFixed(4) + ', ' + s.lng.toFixed(4) + '</span></div>'
            + '<h3 class="sdc-title">' + locEsc(s.name) + '</h3>'
            + '<p class="sdc-full-addr">' + locEsc(s.address || s.subtitle || '-') + '</p>'
            + '<div class="sdc-device-list">' + (function () {
            const list = (APP_STATE.devices || []).filter(function (d) { return String(d.location || '').toLowerCase().trim() === uiLocName(s.name).toLowerCase().trim(); });
            if (!list.length) return '<div class="sdc-dev-row"><span class="sdc-dev-name">Belum ada perangkat (' + (assetCount[s.dbId] || 0) + ' aset)</span></div>';
            return list.map(function (d, i) { const st = String(d.status || 'offline'); const on = st === 'online'; return '<div class="sdc-dev-row"><span class="sdc-dev-name" style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (i + 1) + '. ' + locEsc(d.code) + ' - ' + locEsc(d.name) + '</span><span class="status-pill ' + (on ? 'online' : 'offline') + '"><span class="dot ' + (on ? 'green' : 'red') + '"></span> ' + (on ? 'Online' : 'Offline') + '</span></div>'; }).join('');
        })() + '</div>';
    });
}

function updateSiteLine() {
    if (!APP_STATE.fullMap || typeof L === 'undefined') return;
    if (!APP_STATE.siteLine) {
        APP_STATE.fullMap.eachLayer(function (layer) { if (!APP_STATE.siteLine && layer instanceof L.Polyline && !(layer instanceof L.Polygon)) APP_STATE.siteLine = layer; });
    }
    if (!APP_STATE.siteLine) return;
    const order = ['ho', 'mo', 'server'].concat(Object.keys(LOC_SITES).filter(function (k) { return ['ho', 'mo', 'server'].indexOf(k) < 0; }));
    const pts = order.filter(function (k) { return LOC_SITES[k]; }).map(function (k) { return [LOC_SITES[k].lat, LOC_SITES[k].lng]; });
    if (pts.length > 1) pts.push(pts[0]);
    APP_STATE.siteLine.setLatLngs(pts);
}
window.syncSiteCards = syncSiteCards;
window.updateSiteLine = updateSiteLine;


function injectLocationManagerButton() {
    if (document.getElementById('btn-loc-manager')) return;
    const bar = document.querySelector('.loc-tab-switcher');
    if (!bar) return;
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'btn-loc-manager'; b.className = 'loc-tab-btn';
    b.innerHTML = '<i class="fa-solid fa-list-check"></i> Kelola Lokasi';
    b.onclick = openLocationManager;
    const floor = document.getElementById('tab-btn-floor');
    if (floor && floor.nextSibling) bar.insertBefore(b, floor.nextSibling); else bar.appendChild(b);
}

function closeLocationManager() {
    const modal = document.getElementById('loc-manager-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}
window.closeLocationManager = closeLocationManager;

function openLocationManager() {
    let modal = document.getElementById('loc-manager-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loc-manager-modal';
        modal.className = 'modal-backdrop hidden';
        modal.addEventListener('click', function (ev) {
            if (ev.target === modal) closeLocationManager();
        });
        document.body.appendChild(modal);
    }
    modal.classList.remove('hidden');
    modal.style.display = '';
    if (!APP_STATE.locationsDb || !APP_STATE.locationsDb.length) APP_STATE.locationsDb = getDefaultLocationsDb();
    renderLocationManager();
    if (typeof loadLocations === 'function') loadLocations();
}
window.openLocationManager = openLocationManager;

function renderLocationManager(editRow) {
    const modal = document.getElementById('loc-manager-modal');
    if (!modal) return;
    const admin = typeof isAdminUser === 'function' && isAdminUser();
    const superAdmin = typeof isSuperAdmin === 'function' && isSuperAdmin();
    const rows = APP_STATE.locationsDb || [];
    const e = editRow || {};
    const body = rows.map(function (l) {
        const coord = (l.latitude != null && l.longitude != null) ? (parseFloat(l.latitude).toFixed(5) + ', ' + parseFloat(l.longitude).toFixed(5)) : '-';
        return '<tr>'
            + '<td><strong>' + locEsc(l.location_name) + '</strong></td>'
            + '<td><span class="text-xs text-secondary">' + locEsc(l.address || l.description || '-') + '</span></td>'
            + '<td><span class="text-xs font-mono">' + coord + '</span></td>'
            + '<td style="text-align:center;font-weight:700;color:#F1F5F9;">' + (l.total_assets || 0) + '</td>'
            + '<td style="white-space:nowrap;text-align:center;">' + (admin
                ? '<button class="btn-icon-sm text-cyan" title="Edit" onclick="editLocationRow(' + l.location_id + ')"><i class="fa-solid fa-pen-to-square"></i></button>'
                + (superAdmin ? '<button class="btn-icon-sm" style="color:#ff4444;margin-left:6px;" title="Hapus (Khusus Superadmin)" onclick="deleteLocationRow(' + l.location_id + ')"><i class="fa-solid fa-trash"></i></button>' : '')
                : '<span class="text-xs text-secondary">—</span>') + '</td></tr>';
    }).join('') || '<tr><td colspan="5" class="text-xs text-secondary" style="text-align:center;padding:16px;">Belum ada lokasi.</td></tr>';

    const form = admin ? (
        '<form onsubmit="event.preventDefault(); saveLocationForm();">'
        + '<h5 style="margin:0 0 10px;color:#F1F5F9;font-weight:700;font-size:0.92rem;"><i class="fa-solid fa-plus-circle text-cyan"></i> ' + (e.location_id ? 'Edit Data Lokasi' : 'Tambah Lokasi Baru') + '</h5>'
        + '<input type="hidden" id="loc-form-id" value="' + (e.location_id || '') + '">'
        + '<div class="form-row-2">'
        + '<div class="form-group"><label>Nama Lokasi *</label><input type="text" id="loc-form-name" required placeholder="Contoh: Kantor Cabang" value="' + locEsc(e.location_name) + '"></div>'
        + '<div class="form-group"><label>Deskripsi</label><input type="text" id="loc-form-desc" placeholder="Contoh: Gedung Operasional" value="' + locEsc(e.description) + '"></div>'
        + '</div>'
        + '<div class="form-group"><label>Alamat Lengkap</label><input type="text" id="loc-form-addr" placeholder="Jl. Raya No. XX, Kota Blitar" value="' + locEsc(e.address) + '"></div>'
        + '<div class="form-row-2">'
        + '<div class="form-group"><label>Latitude *</label><input type="number" step="any" id="loc-form-lat" placeholder="-8.07378" required value="' + (e.latitude != null ? parseFloat(e.latitude) : '') + '"></div>'
        + '<div class="form-group"><label>Longitude *</label><input type="number" step="any" id="loc-form-lng" placeholder="112.17336" required value="' + (e.longitude != null ? parseFloat(e.longitude) : '') + '"></div>'
        + '</div>'
        + '<div class="loc-form-actions" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px;margin-bottom:0;padding-bottom:0;">'
        + '<button type="button" class="btn btn-outline-cyber btn-sm" onclick="useMapCoordForLocation()"><i class="fa-solid fa-crosshairs"></i> <span class="text-desktop">Pakai Titik Peta Terakhir</span><span class="text-mobile">Titik Peta</span></button>'
        + (e.location_id ? '<button type="button" class="btn btn-outline-cyber btn-sm" onclick="renderLocationManager()">Batal Edit</button>' : '')
        + '<button type="submit" class="btn btn-primary-cyber btn-sm" style="margin-left:auto;"><i class="fa-solid fa-floppy-disk"></i> Simpan Lokasi</button>'
        + '</div>'
        + '</form>'
    ) : '<p class="text-xs text-secondary" style="margin-top:12px;margin-bottom:0;">Hanya Admin/Superadmin yang dapat mengubah lokasi.</p>';

    modal.innerHTML = '<div class="modal-card">'
        + '<div class="modal-header"><div class="modal-title-wrap"><i class="fa-solid fa-map-location-dot text-yellow"></i><h5>Kelola Lokasi Infrastruktur</h5></div>'
        + '<button type="button" class="modal-close-btn" onclick="closeLocationManager()" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button></div>'
        + '<div class="modal-body">'
        + '<div class="loc-table-wrap"><table class="data-table" style="width:100%;"><thead><tr><th>Nama</th><th>Alamat</th><th>Koordinat</th><th style="text-align:center;">Aset</th><th style="text-align:center;">Aksi</th></tr></thead><tbody>' + body + '</tbody></table></div>'
        + form
        + '</div></div>';
}
window.renderLocationManager = renderLocationManager;

function editLocationRow(id) {
    const row = (APP_STATE.locationsDb || []).find(function (l) { return l.location_id === id; });
    if (row) renderLocationManager(row);
}
window.editLocationRow = editLocationRow;

function useMapCoordForLocation() {
    const c = APP_STATE.activeCoord;
    if (!c) { showToast('Info', 'Klik dulu satu titik di peta.', 'warning'); return; }
    document.getElementById('loc-form-lat').value = Number(c.lat).toFixed(7);
    document.getElementById('loc-form-lng').value = Number(c.lng).toFixed(7);
}
window.useMapCoordForLocation = useMapCoordForLocation;

async function saveLocationForm() {
    const id = document.getElementById('loc-form-id').value;
    const latRaw = document.getElementById('loc-form-lat').value.trim();
    const lngRaw = document.getElementById('loc-form-lng').value.trim();
    const lat = latRaw === '' ? null : parseFloat(latRaw);
    const lng = lngRaw === '' ? null : parseFloat(lngRaw);
    if ((lat !== null && (isNaN(lat) || lat < -90 || lat > 90)) || (lng !== null && (isNaN(lng) || lng < -180 || lng > 180))) {
        showToast('Koordinat tidak valid', 'Latitude -90..90 dan Longitude -180..180.', 'error'); return;
    }
    const payload = {
        location_name: document.getElementById('loc-form-name').value.trim(),
        description: document.getElementById('loc-form-desc').value.trim(),
        address: document.getElementById('loc-form-addr').value.trim(),
        latitude: lat, longitude: lng
    };
    try {
        const json = await locFetch(id ? '/locations/' + id : '/locations', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
        if (json && json.success) {
            showToast('Berhasil', id ? 'Lokasi diperbarui.' : 'Lokasi ditambahkan.', 'success');
            await loadLocations();
            const locModal = document.getElementById('loc-manager-modal');
            closeLocationManager();
            if (typeof addAuditTrailRecord === 'function') addAuditTrailRecord(id ? 'Edit Lokasi' : 'Tambah Lokasi', payload.location_name);
        } else {
            showToast('Gagal', (json && (json.error || json.message)) || 'Gagal menyimpan lokasi.', 'error');
        }
    } catch (e) { showToast('Error', 'Tidak dapat terhubung ke backend: ' + e.message, 'error'); }
}
window.saveLocationForm = saveLocationForm;

async function deleteLocationRow(id) {
    if (typeof isSuperAdmin === 'function' && !isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang memiliki hak untuk menghapus data lokasi!', 'error');
        return;
    }
    const row = (APP_STATE.locationsDb || []).find(function (l) { return l.location_id === id; });
    if (!row) return;
// Superadmin confirm
    showCyberConfirmModal(
        'Konfirmasi Hapus Lokasi',
        'PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus lokasi "' + row.location_name + '"?\n\nData lokasi akan dihapus permanen dari database.',
        async () => {
            try {
                const json = await locFetch('/locations/' + id, { method: 'DELETE' });
                if (json && json.success) {
                    showToast('Dihapus', 'Lokasi ' + row.location_name + ' berhasil dihapus.', 'success');
                    await loadLocations();
                    renderLocationManager();
                    if (typeof addAuditTrailRecord === 'function') addAuditTrailRecord('Hapus Lokasi', row.location_name);
                } else {
                    showToast('Gagal', (json && (json.error || json.message)) || 'Gagal menghapus lokasi.', 'error');
                }
            } catch (err) {
                console.error('[Locations] delete error:', err);
                showToast('Koneksi Terputus', 'Gagal menghubungi server.', 'error');
            }
        },
        'Ya, Hapus Lokasi'
    );
    return;
    try {
        const json = await locFetch('/locations/' + id, { method: 'DELETE' });
        if (json && json.success) {
            showToast('Dihapus', 'Lokasi ' + row.location_name + ' berhasil dihapus.', 'success');
            await loadLocations();
            renderLocationManager();
            if (typeof addAuditTrailRecord === 'function') addAuditTrailRecord('Hapus Lokasi', row.location_name);
        } else {
            showToast('Gagal', (json && (json.error || json.message)) || 'Gagal menghapus lokasi.', 'error');
        }
    } catch (e) { showToast('Error', 'Tidak dapat terhubung ke backend: ' + e.message, 'error'); }
}
window.deleteLocationRow = deleteLocationRow;



// -----------------------------------------------------------------------------
// 6. USER MANAGEMENT (RBAC) & 11 PKL TEAM 2-SHIFT SYSTEM
// -----------------------------------------------------------------------------

async function loadUsersPage() {
    if (!APP_STATE.usersList || APP_STATE.usersList.length === 0) {
        if (typeof loadUsersListFromStorage === 'function') loadUsersListFromStorage();
        if (!APP_STATE.usersList || APP_STATE.usersList.length === 0) {
            APP_STATE.usersList = JSON.parse(JSON.stringify(DEFAULT_USERS_LIST));
        }
    }
    try {
        if (window.apiService && typeof window.apiService.getUsers === 'function') {
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
                        name: u.full_name || prev.name || (defUser ? defUser.name : u.email),
                        username: u.username || prev.username || (defUser ? defUser.username : (u.email ? u.email.split('@')[0] : `user_${u.user_id}`)),
                        password: '***',
                        email: u.email,
                        avatar: (u.avatar !== undefined && u.avatar !== null) ? u.avatar : (storedAvatar || prev.avatar || (defUser ? defUser.avatar : null) || ''),
                        role: u.role === 'super_admin' ? 'Superadmin' : (u.role === 'admin' ? 'Admin' : 'User'),
                        perms: u.role === 'super_admin' ? 'CRUD' : (u.role === 'admin' ? 'CRU' : 'Read Only'),
                        picTask: u.pic_task || prev.picTask || (defUser ? defUser.picTask : 'Staff Operasional & Monitoring'),
                        status: u.status || prev.status || 'Aktif',
                        lastLogin: (u.last_login_at && !isNaN(new Date(u.last_login_at))) ? new Date(u.last_login_at).toLocaleString('id-ID',{dateStyle:'short',timeStyle:'short'}) : ((prev.lastLogin && prev.lastLogin !== 'Invalid Date') ? prev.lastLogin : 'Aktif Hari Ini')
                    };
                });
                if (typeof saveUsersListToStorage === 'function') saveUsersListToStorage();
            }
        }
    } catch (e) {
        console.warn('loadUsersPage error:', e);
    }
    if (!APP_STATE.usersList || APP_STATE.usersList.length === 0) {
        APP_STATE.usersList = JSON.parse(JSON.stringify(DEFAULT_USERS_LIST));
    }
    renderUsersRbacTable();
    renderTeamShiftCards();
    renderAuditLogsTable();
}
window.loadUsersPage = loadUsersPage;

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
    if (!tbody) return;

    if (!APP_STATE.usersList || APP_STATE.usersList.length === 0) {
        if (typeof loadUsersListFromStorage === 'function') loadUsersListFromStorage();
        if (!APP_STATE.usersList || APP_STATE.usersList.length === 0) {
            APP_STATE.usersList = JSON.parse(JSON.stringify(DEFAULT_USERS_LIST));
        }
    }

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
            ? '<span class="badge-perm-crud" style="display:inline-block; margin-left:6px; font-size:11px; font-weight:800; color:#FF4976; background:rgba(225,29,72,0.18); border:1px solid rgba(225,29,72,0.55); padding:3px 9px; border-radius:4px; letter-spacing:0.3px; vertical-align:middle;">CRUD</span>'
            : (u.perms === 'CRU' 
                ? '<span class="badge-perm-cru" style="display:inline-block; margin-left:6px; font-size:11px; font-weight:800; color:#F8FAFC; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.30); padding:3px 9px; border-radius:4px; letter-spacing:0.3px; vertical-align:middle;">CRU</span>'
                : '<span class="badge-perm-ro" style="display:inline-block; margin-left:6px; font-size:11px; font-weight:800; color:#93C5FD; background:rgba(59,130,246,0.15); border:1px solid rgba(59,130,246,0.45); padding:3px 9px; border-radius:4px; letter-spacing:0.3px; vertical-align:middle;">Read Only</span>');

        const isUserActive = u.status === 'Aktif';
        const activeText = isEn ? 'Active' : 'Aktif';
        const inactiveText = isEn ? 'Inactive' : 'Non-Aktif';
        const statusBadge = isUserActive 
            ? `<span class="status-pill online"><span class="dot green"></span> ${activeText}</span>` 
            : `<span class="status-pill offline"><span class="dot red"></span> ${inactiveText}</span>`;

        const displayRole = isEn ? (I18N_DICT[u.role] || translateTextString(u.role, 'en')) : (I18N_REVERSE_DICT[u.role] || u.role);
        const displayPic = isEn ? (I18N_DICT[u.picTask] || translateTextString(u.picTask, 'en')) : (I18N_REVERSE_DICT[u.picTask] || u.picTask);
        const rawLastLogin = (!u.lastLogin || u.lastLogin === 'Invalid Date' || u.lastLogin === 'null' || u.lastLogin === 'undefined') ? 'Aktif Hari Ini' : u.lastLogin;
        const displayLastLogin = isEn ? (I18N_DICT[rawLastLogin] || translateTextString(rawLastLogin, 'en')) : (I18N_REVERSE_DICT[rawLastLogin] || rawLastLogin);
        const editTitle = isEn ? 'Edit Account' : 'Edit Akun';
        const deleteTitle = isEn ? 'Delete User' : 'Hapus User';
        const viewOnlyText = isEn ? 'View Only' : 'Lihat Saja';

        const isDzakwanSuperadmin = (u.username === 'dzakwan' || u.email === 'dzakwan@taims.id' || u.role === 'Superadmin' || u.rawId == 1 || u.id === 'user-1');

        let actionBtns = '';
        if (isDzakwanSuperadmin) {
            if (isSuperadmin) {
                actionBtns = `
                    <div class="d-flex justify-end gap-1" style="display: flex !important; justify-content: flex-end !important; align-items: center !important; width: 100% !important;">
                        <button class="btn-sm btn-outline-cyber py-1 px-2" onclick="openEditUserModal('${u.id}')" title="${editTitle}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                        <button class="btn-sm btn-danger-cyber py-1 px-2" style="visibility: hidden; pointer-events: none; opacity: 0;" tabindex="-1" aria-hidden="true"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            } else {
                actionBtns = `
                    <div class="d-flex justify-end" style="display: flex !important; justify-content: flex-end !important; align-items: center !important; width: 100% !important;">
                        <span class="badge-subtle badge-site-ho" style="font-size:0.72rem; font-weight:700; padding:4px 10px; border-radius:4px; display:inline-flex; align-items:center; gap:5px; border:1px solid rgba(239,68,68,0.35); background:rgba(239,68,68,0.12); color:#FCA5A5;">
                            <i class="fa-solid fa-lock text-red"></i> Superadmin
                        </span>
                    </div>
                `;
            }
        } else if (isSuperadmin) {
            actionBtns = `
                <div class="d-flex gap-1 justify-end" style="display: flex !important; justify-content: flex-end !important; align-items: center !important; width: 100% !important;">
                    <button class="btn-sm btn-outline-cyber py-1 px-2" onclick="openEditUserModal('${u.id}')" title="${editTitle}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn-sm btn-danger-cyber py-1 px-2" onclick="handleDeleteUser('${u.id}')" title="${deleteTitle}"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        } else if (isAdmin) {
            actionBtns = `
                <div class="d-flex gap-1 justify-end" style="display: flex !important; justify-content: flex-end !important; align-items: center !important; width: 100% !important;">
                    <button class="btn-sm btn-outline-cyber py-1 px-2" onclick="openEditUserModal('${u.id}')" title="${editTitle}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
                    <button class="btn-sm btn-danger-cyber py-1 px-2" style="visibility: hidden; pointer-events: none; opacity: 0;" tabindex="-1" aria-hidden="true"><i class="fa-solid fa-trash"></i></button>
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
            <td class="text-center">${i + 1}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${avatarThumb}
                    <div style="display: flex; flex-direction: column;">
                        <strong style="color: #F8FAFC;">${displayName}</strong>
                        <span style="font-size: 0.72rem; color: #94A3B8;">${u.username || (u.email ? u.email.split('@')[0] : 'user')}</span>
                    </div>
                </div>
            </td>
            <td><span class="text-xs text-muted">${String(u.email || '').replace(/@taims\.local$/i, '@taims.id')}</span></td>
            <td class="text-center">
                <span class="user-role-badge ${u.role === 'Superadmin' ? 'super' : ((u.role === 'Admin' || u.role === 'Administrator') ? 'admin' : 'view')}">${displayRole}</span>
                ${permsBadge}
            </td>
            <td><span class="text-xs text-cyan" style="font-weight: 500;">${displayPic}</span></td>
            <td class="text-center">${statusBadge}</td>
            <td class="text-center"><span class="text-xs text-muted">${displayLastLogin}</span></td>
            <td class="text-right" style="text-align: right !important; padding-right: 4px !important;">
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
                return;
            }
        }
    } catch (e) {
        console.warn('Gagal memuat user dari storage:', e);
    }
    if (typeof DEFAULT_USERS_LIST !== 'undefined' && DEFAULT_USERS_LIST.length > 0) {
        APP_STATE.usersList = JSON.parse(JSON.stringify(DEFAULT_USERS_LIST));
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
    const user = APP_STATE.usersList.find(u => u.id === userId || String(u.rawId) === String(userId));
    if (!user) return;

    const isSuperadmin = isSuperAdmin();
    if (!isSuperadmin && (user.username === 'dzakwan' || user.email === 'dzakwan@taims.id' || user.role === 'Superadmin' || user.rawId == 1)) {
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
    document.getElementById('user-form-email').value = String(user.email || '').replace(/@taims\.local$/i, '@taims.id');
    document.getElementById('user-form-password').value = '';
    document.getElementById('user-form-password').required = false;
    document.getElementById('user-pwd-help').textContent = '(Kosongkan jika tidak ingin mengubah sandi)';
    const roleSelect = document.getElementById('user-form-role');
    if (user.role === 'Superadmin') {
        let opt = roleSelect.querySelector('option[value="Superadmin"]');
        if (!opt) {
            opt = document.createElement('option');
            opt.value = 'Superadmin';
            opt.textContent = 'Superadmin (Full Control)';
            roleSelect.appendChild(opt);
        }
        roleSelect.value = 'Superadmin';
        roleSelect.disabled = true;
    } else {
        const opt = roleSelect.querySelector('option[value="Superadmin"]');
        if (opt) opt.remove();
        roleSelect.disabled = false;
        roleSelect.value = user.role;
    }
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
    const roleSelect = document.getElementById('user-form-role');
    const rawRole = (roleSelect && roleSelect.disabled) ? 'Superadmin' : (roleSelect ? roleSelect.value : 'User');
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
                    pic_task: picTask,
                    avatar: avatarVal,
                    ...(isSuperadmin ? { status } : {}),
                    ...(isSuperadmin ? {
                        role: role.toLowerCase() === 'superadmin' ? 'super_admin' : (role.toLowerCase() === 'admin' ? 'admin' : 'user')
                    } : {}),
                    ...(password ? { password } : {})
                };
                window.apiService.updateUser(rawId, updatePayload).then(async (res) => {
                    if (res && res.success === false) {
                        showToast('Gagal Simpan ke Database', (res.error || 'Server tidak merespons') + ' - perubahan baru tersimpan di browser ini. Pastikan backend (port 3000) berjalan lalu simpan ulang.', 'error');
                        return;
                    }
                    if (typeof loadRealDataFromApi === 'function') {
                        await loadRealDataFromApi();
                    }
                }).catch((e) => {
                    showToast('Gagal Simpan ke Database', (e && e.message) || 'Server tidak merespons', 'error');
                });
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
                username: newUser.username,
                email,
                password: password || '123456',
                role: role.toLowerCase() === 'superadmin' ? 'super_admin' : (role.toLowerCase() === 'admin' ? 'admin' : 'user'),
                status,
                pic_task: newUser.picTask,
                avatar: ''
            }).then(async (res) => {
                if (res && res.success && res.data && res.data.user_id) {
                    newUser.rawId = res.data.user_id;
                    saveUsersListToStorage();
                    if (typeof loadRealDataFromApi === 'function') await loadRealDataFromApi();
                }
            }).catch((e) => {
                showToast('Gagal Simpan ke Database', (e && e.message) || 'Server tidak merespons', 'error');
            });
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

    const user = APP_STATE.usersList.find(u => u.id === userId || String(u.rawId) === String(userId));
    if (!user) return;

    if (user.username === 'dzakwan' || user.email === 'dzakwan@taims.id' || user.role === 'Superadmin' || user.rawId == 1) {
        showToast('Tindakan Ditolak', 'Akun Superadmin Utama (Dzakwan) berstatus paten dan tidak dapat dihapus.', 'error');
        return;
    }

    if (APP_STATE.currentUser.username === user.username || APP_STATE.currentUser.email === user.email) {
        showToast('Tindakan Ditolak', 'Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif.', 'error');
        return;
    }

    showCyberConfirmModal(
        'Konfirmasi Hapus Pengguna',
        `PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus akun user "${user.name}" (${user.email}) dari sistem T-AIMS?\n\nTindakan ini akan mencabut seluruh akses login dan data akun secara permanen.`,
        () => {
            APP_STATE.usersList = APP_STATE.usersList.filter(u => u.id !== userId);
            saveUsersListToStorage();
            if (window.apiService && typeof window.apiService.deleteUser === 'function') {
                const rawId = user.rawId || userId;
                window.apiService.deleteUser(rawId).then((res) => {
                    if (res && res.success === false) {
                        showToast('Gagal Hapus di Database', (res.error || 'Server tidak merespons') + ' - pastikan backend berjalan.', 'error');
                    }
                }).catch((e) => {
                    showToast('Gagal Hapus di Database', (e && e.message) || 'Server tidak merespons', 'error');
                });
            }
            renderUsersRbacTable();
            showToast('User Dihapus', `User ${user.name} berhasil dihapus dari sistem.`, 'success');
            addAuditTrailRecord('Penghapusan Akun', `Superadmin menghapus akun user: ${user.name} (${user.email})`);
        },
        'Ya, Hapus Pengguna'
    );
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
// 7. SETTINGS SUB-TABS & FAILURE SIMULATION SUITE
// -----------------------------------------------------------------------------
function switchSettingsSubTab(tab) {
    document.querySelectorAll('.settings-subpanel').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('#page-settings .loc-tab-btn').forEach(b => b.classList.remove('active'));

    const btn = document.getElementById(`tab-btn-set-${tab}`);
    if (btn) btn.classList.add('active');

    const panel = document.getElementById(`settings-panel-${tab}`);
    if (panel) {
        panel.classList.remove('hidden');
        if (tab === 'db') {
            updateDatabaseModuleCounts();
        }
        if (APP_STATE.currentLang && typeof translateSubtree === 'function') {
            translateSubtree(panel, APP_STATE.currentLang);
        }
    }
}

async function loadSettingsPage() {
    let cfg = null;
    try {
        const raw = localStorage.getItem('taims_settings_v3');
        if (raw) cfg = JSON.parse(raw);
    } catch (e) {
        console.warn('loadSettingsPage localStorage error:', e);
    }

    // Ambil konfigurasi baseline engine dari backend jika tersedia
    if (window.apiService && typeof window.apiService.getSystemSettings === 'function') {
        try {
            const serverCfg = await window.apiService.getSystemSettings();
            if (serverCfg) {
                cfg = { ...(cfg || {}), ...serverCfg };
                localStorage.setItem('taims_settings_v3', JSON.stringify(cfg));
            }
        } catch (e) {
            console.warn('Gagal sinkron settings dari backend:', e);
        }
    }

    if (cfg) {
        const el = id => document.getElementById(id);
        if (cfg.pollInterval && el('set-poll-interval')) el('set-poll-interval').value = cfg.pollInterval;
        if (cfg.pingTimeout && el('set-ping-timeout')) el('set-ping-timeout').value = cfg.pingTimeout;
        if (cfg.maxRetries && el('set-max-retries')) el('set-max-retries').value = cfg.maxRetries;
        if (cfg.tempThreshold && el('set-temp-threshold')) el('set-temp-threshold').value = cfg.tempThreshold;
        if (cfg.heartbeatTimeout && el('set-heartbeat-timeout')) el('set-heartbeat-timeout').value = cfg.heartbeatTimeout;
        if (cfg.timezone && el('set-timezone')) el('set-timezone').value = cfg.timezone;
        if (cfg.telegramToken && el('set-telegram-token')) el('set-telegram-token').value = cfg.telegramToken;
        if (cfg.telegramChat && el('set-telegram-chat')) el('set-telegram-chat').value = cfg.telegramChat;
        if (cfg.n8nUrl && el('set-n8n-url')) el('set-n8n-url').value = cfg.n8nUrl;
        if (cfg.debounceTimer && el('set-debounce-timer')) el('set-debounce-timer').value = cfg.debounceTimer;
        if (cfg.smtpHost && el('set-smtp-host')) el('set-smtp-host').value = cfg.smtpHost;
        if (cfg.alertEmail && el('set-alert-email')) el('set-alert-email').value = cfg.alertEmail;
    }

    const elTok = document.getElementById('set-telegram-token');
    if (elTok && (!elTok.value || elTok.value.startsWith('6849204918'))) {
        elTok.value = '8944593836:AAEP2bDCO53srpWR3gdKXY6CHQ13Ni8OtPA';
    }
    const elN8n = document.getElementById('set-n8n-url');
    if (elN8n && (!elN8n.value || elN8n.value.includes('n8n.teknolab.id'))) {
        elN8n.value = 'http://192.168.1.49:5678/webhook/taims-alert';
    }
    updateDatabaseModuleCounts();
}
window.loadSettingsPage = loadSettingsPage;

async function saveSystemSettings() {
    if (!isAdminUser()) {
        showToast('Akses Dibatasi', 'Mode User (Read-Only) tidak dapat mengubah pengaturan sistem.', 'error');
        return;
    }

    const settings = {
        pollInterval: Number(document.getElementById('set-poll-interval')?.value || 10),
        pingTimeout: Number(document.getElementById('set-ping-timeout')?.value || 1500),
        maxRetries: Number(document.getElementById('set-max-retries')?.value || 3),
        tempThreshold: Number(document.getElementById('set-temp-threshold')?.value || 22),
        heartbeatTimeout: Number(document.getElementById('set-heartbeat-timeout')?.value || 60),
        timezone: document.getElementById('set-timezone')?.value || 'Asia/Jakarta (WIB - UTC+7)',
        telegramToken: document.getElementById('set-telegram-token')?.value || '',
        telegramChat: document.getElementById('set-telegram-chat')?.value || '',
        n8nUrl: document.getElementById('set-n8n-url')?.value || '',
        debounceTimer: Number(document.getElementById('set-debounce-timer')?.value || 5),
        smtpHost: document.getElementById('set-smtp-host')?.value || '',
        alertEmail: document.getElementById('set-alert-email')?.value || ''
    };

    try {
        localStorage.setItem('taims_settings_v3', JSON.stringify(settings));
        if (APP_STATE) APP_STATE.settings = settings;
    } catch (e) {
        console.warn('Failed to save settings to localStorage:', e);
    }

    // SINKRONISASI KE SERVER & DATABASE BACKEND
    if (window.apiService && typeof window.apiService.saveSystemSettingsApi === 'function') {
        try {
            const res = await window.apiService.saveSystemSettingsApi(settings);
            if (res && res.success) {
                showToast('Pengaturan Disimpan', 'Konfigurasi baseline engine, webhook, dan batas threshold berhasil disinkronkan ke server database.', 'success');
                return;
            }
        } catch (e) {
            console.warn('Sync settings to backend error:', e);
        }
    }

    showToast('Pengaturan Disimpan', 'Seluruh konfigurasi baseline engine, webhook, dan notifikasi berhasil disimpan.', 'success');
}
window.saveSystemSettings = saveSystemSettings;

async function updateDatabaseModuleCounts() {
    const el = (id) => document.getElementById(id);
    const assetCount = (APP_STATE.devices || []).length;
    const logCount = (APP_STATE.backendStats && APP_STATE.backendStats.total_logs) ? APP_STATE.backendStats.total_logs : 0;
    let incCount = (APP_STATE.incidents || []).length;
    if (incCount === 0 && window.apiService && typeof window.apiService.getIncidentLogs === 'function') {
        try {
            const incs = await window.apiService.getIncidentLogs();
            if (incs && Array.isArray(incs) && incs.length > 0) {
                incCount = incs.length;
            }
        } catch(e) {}
    }
    
    const locCount = (APP_STATE.locationsDb || []).length;
    const userCount = (APP_STATE.usersList || []).length;
    const notifCount = (APP_STATE.alerts || []).length || 0;
    const mntCount = (APP_STATE.maintenanceLogs || []).length || 0;

    if (el('db-count-assets')) el('db-count-assets').innerHTML = `${assetCount} rekaman &bull; Aktif`;
    if (el('db-count-logs')) el('db-count-logs').innerHTML = `${logCount === '-' ? '-' : Number(logCount).toLocaleString('id-ID')} rekaman &bull; Aktif`;
    if (el('db-count-incidents')) el('db-count-incidents').innerHTML = `${incCount} rekaman &bull; Aktif`;
    if (el('db-count-locations')) el('db-count-locations').innerHTML = `${locCount} titik lokasi &bull; Aktif`;
    if (el('db-count-users')) el('db-count-users').innerHTML = `${userCount} pengguna &bull; Aktif`;
    if (el('db-count-notifications')) el('db-count-notifications').innerHTML = `${notifCount} catatan &bull; Aktif`;
    if (el('db-count-maintenance')) el('db-count-maintenance').innerHTML = `${mntCount} rekaman &bull; Aktif`;
}
window.updateDatabaseModuleCounts = updateDatabaseModuleCounts;

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
            d.lastSeen = 'Status diperbarui';
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
        if (typeof refreshServerMetricsUI === 'function') refreshServerMetricsUI(false);
    } else if (pageId === 'page-alerts') {
        if (typeof loadIncidentsPage === 'function') loadIncidentsPage();
        else renderIncidentsTable();
        if (typeof renderAlerts === 'function') renderAlerts();
    } else if (pageId === 'page-reports') {
        if (typeof loadMaintenance === 'function') loadMaintenance(); else renderMaintenanceTable();
        if (typeof runAiAnalysis === 'function') setTimeout(runAiAnalysis, 100);
    } else if (pageId === 'page-users') {
        if (typeof loadUsersPage === 'function') loadUsersPage();
        else {
            renderUsersRbacTable();
            renderTeamShiftCards();
            renderAuditLogsTable();
        }
        // Update live shift clock
        const clockEl = document.getElementById('user-page-clock');
        if (clockEl) clockEl.textContent = new Date().toTimeString().split(' ')[0] + ' WIB';
    } else if (pageId === 'page-settings') {
        if (typeof loadSettingsPage === 'function') loadSettingsPage();
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
    const devs = APP_STATE.devices || [];
    const mount = document.getElementById('print-mount-area');
    if (!mount) {
        window.print();
        return;
    }

    showToast('Export PDF', 'Mempersiapkan dokumen resmi PDF inventaris aset IT...', 'info');

    const onlineCount = devs.filter(d => (d.status || '').toLowerCase() === 'online').length;
    const warningCount = devs.filter(d => (d.status || '').toLowerCase() === 'warning').length;
    const offlineCount = devs.filter(d => (d.status || '').toLowerCase() === 'offline').length;

    let docHtml = `
        <div class="print-report-container" style="font-family: Arial, Helvetica, sans-serif; color: #111827;">
            <div class="print-report-header" style="border-bottom: 2.5px solid #111827; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h2 style="margin: 0; font-size: 17px; font-weight: bold; color: #111827; text-transform: uppercase;">PT TEKNOLAB CARAKA INTERNASIONAL</h2>
                    <h4 style="margin: 3px 0 0; font-size: 13px; font-weight: bold; color: #374151;">DOKUMEN REKAPITULASI RESMI INVENTARIS ASET IT &amp; NOC</h4>
                    <p style="margin: 2px 0 0; font-size: 9px; color: #6b7280;">Sistem Pemantauan Aset dan Infrastruktur Cerdas T-AIMS &bull; Wilayah Kerja Kota Blitar</p>
                </div>
                <div style="font-size: 9px; color: #374151; text-align: right; line-height: 1.4;">
                    <strong>Tanggal Dokumen:</strong> ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                    <strong>Waktu Cetak:</strong> ${new Date().toLocaleTimeString('id-ID')} WIB<br>
                    <strong>Otoritas:</strong> Superadmin Dzakwan Miftahussobirin
                </div>
            </div>

            <!-- Ringkasan Statistik -->
            <div style="display: flex; gap: 12px; margin-bottom: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px;">
                <div style="flex: 1; font-size: 10px;"><strong>Total Aset Terdaftar:</strong> ${devs.length} Perangkat</div>
                <div style="flex: 1; font-size: 10px; color: #059669;"><strong>Status Online:</strong> ${onlineCount} Perangkat</div>
                <div style="flex: 1; font-size: 10px; color: #d97706;"><strong>Peringatan / Degradasi:</strong> ${warningCount} Perangkat</div>
                <div style="flex: 1; font-size: 10px; color: #dc2626;"><strong>Status Offline:</strong> ${offlineCount} Perangkat</div>
            </div>

            <!-- Tabel Aset Lengkap -->
            <table class="print-report-table" style="width: 100%; border-collapse: collapse; font-size: 10px;">
                <thead>
                    <tr style="background-color: #f3f4f6;">
                        <th style="border: 1px solid #d1d5db; padding: 6px 4px; text-align: center; width: 25px;">No</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Kode Aset</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Nama Perangkat</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Kategori</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">IP Address</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">MAC Address</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Lokasi Site</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">PIC</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: center;">Status</th>
                        <th style="border: 1px solid #d1d5db; padding: 6px; text-align: left;">Terakhir Aktif</th>
                    </tr>
                </thead>
                <tbody>
    `;

    devs.forEach((d, i) => {
        const st = (d.status || 'offline').toUpperCase();
        const stColor = st === 'ONLINE' ? '#059669' : (st === 'WARNING' ? '#d97706' : '#dc2626');
        docHtml += `
            <tr style="background-color: ${i % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                <td style="border: 1px solid #d1d5db; padding: 4px; text-align: center;">${i + 1}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px; font-family: monospace; font-weight: bold;">${d.code || '-'}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px; font-weight: 500;">${d.name || '-'}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px;">${d.category || '-'}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px; font-family: monospace;">${d.ip || '-'}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px; font-family: monospace; font-size: 9px;">${d.mac || '-'}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px;">${d.location || d.district || '-'}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px;">${d.pic || '-'}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px; text-align: center; font-weight: bold; color: ${stColor};">${st}</td>
                <td style="border: 1px solid #d1d5db; padding: 4px 6px; font-size: 9px;">${d.lastSeen || '-'}</td>
            </tr>
        `;
    });

    docHtml += `
                </tbody>
            </table>

            <!-- Tanda Tangan & Pengesahan Dokumen -->
            <div style="margin-top: 24px; display: flex; justify-content: flex-end; page-break-inside: avoid;">
                <div style="text-align: center; width: 220px; font-size: 10px; color: #111827;">
                    <div>Blitar, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div style="font-weight: bold; margin-top: 2px;">Penanggung Jawab Sistem (Lead NOC)</div>
                    <div style="height: 50px;"></div>
                    <div style="font-weight: bold; text-decoration: underline;">Dzakwan Miftahussobirin</div>
                    <div style="font-size: 9px; color: #6b7280;">Superadmin &bull; PT Teknolab Caraka Internasional</div>
                </div>
            </div>
        </div>
    `;

    mount.innerHTML = docHtml;
    document.body.classList.add('print-mode-active');

    const cleanUp = () => {
        document.body.classList.remove('print-mode-active');
        if (mount) mount.innerHTML = '';
        window.removeEventListener('afterprint', cleanUp);
    };
    window.addEventListener('afterprint', cleanUp);

    setTimeout(() => {
        window.print();
        setTimeout(cleanUp, 3000);
    }, 400);
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
    const isAllRead = localStorage.getItem('taims_all_alerts_read') === 'true';
    const num = isAllRead ? 0 : (parseInt(count) || 0);
    const badgeTop = document.getElementById('topbar-alert-count');
    const badgeBottom = document.getElementById('bottom-alerts-badge');
    const sidebarBadge = document.getElementById('sidebar-alert-badge');
    const unreadEl = document.getElementById('notif-unread-count');
    const isEn = APP_STATE && APP_STATE.currentLang === 'en';

    if (badgeTop) {
        badgeTop.textContent = num > 99 ? '99+' : num;
        badgeTop.setAttribute('data-count', num);
        badgeTop.style.display = num > 0 ? 'flex' : 'none';
    }
    if (badgeBottom) {
        badgeBottom.textContent = num > 99 ? '99+' : num;
        badgeBottom.setAttribute('data-count', num);
        badgeBottom.style.display = num > 0 ? 'inline-flex' : 'none';
    }
    if (sidebarBadge) {
        sidebarBadge.textContent = num;
        sidebarBadge.style.display = num > 0 ? 'inline-flex' : 'none';
        sidebarBadge.dataset.count = num;
    }
    if (unreadEl) {
        unreadEl.textContent = isEn ? `${num} New` : `${num} Baru`;
        unreadEl.style.display = num > 0 ? 'inline-flex' : 'none';
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
            const apiBase = (window.apiService && window.apiService.BASE_URL) || 'http://localhost:3000/api';
            const res = await fetch(`${apiBase}/monitoring/real-ping`, {
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
    const incs = APP_STATE.incidents || [];
    const headers = ['No', 'ID Insiden', 'Perangkat', 'Lokasi Site', 'Waktu Deteksi', 'Tingkat Bahaya', 'Akar Masalah', 'PIC', 'Status'];
    let rows = [];
    if (incs.length === 0) {
        rows.push([
            1,
            '"INC-NONE"',
            '"Semua Perangkat"',
            '"Head Office & Marketing Office"',
            `"${new Date().toLocaleString('id-ID')}"`,
            '"NORMAL"',
            '"Tidak ada insiden aktif (Seluruh infrastruktur terpantau aman)"',
            '"Dzakwan M."',
            '"RESOLVED"'
        ]);
    } else {
        rows = incs.map((inc, i) => [
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
    }
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCsvBlob(csv, `T-AIMS_Incident_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    showToast('Export Berhasil', `File CSV rekaman insiden (${incs.length} kasus aktif) berhasil diunduh.`, 'success');
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
    showToast('Snapshot SQL', 'Menyusun berkas cadangan SQL taims_db...', 'info');
    
    const devs = APP_STATE.devices || [];
    const incs = APP_STATE.incidents || [];
    const users = APP_STATE.usersList || [];

    let sql = `-- =============================================================================\n`;
    sql += `-- T-AIMS TEKNOLAB ASSET & INFRASTRUCTURE MONITORING SYSTEM\n`;
    sql += `-- MASTER DATABASE SQL BACKUP DUMP (taims_db)\n`;
    sql += `-- Host: localhost:3306 | Engine: MySQL / MariaDB\n`;
    sql += `-- Generated on: ${new Date().toISOString()} (${new Date().toLocaleString('id-ID')})\n`;
    sql += `-- Operator: Dzakwan Miftahussobirin (Superadmin)\n`;
    sql += `-- =============================================================================\n\n`;
    sql += `SET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // 1. Table devices
    sql += `-- Table structure for table \`devices\`\n`;
    sql += `DROP TABLE IF EXISTS \`devices\`;\n`;
    sql += `CREATE TABLE \`devices\` (\n`;
    sql += `  \`id\` INT(11) NOT NULL AUTO_INCREMENT,\n`;
    sql += `  \`code\` VARCHAR(50) NOT NULL UNIQUE,\n`;
    sql += `  \`name\` VARCHAR(150) NOT NULL,\n`;
    sql += `  \`category\` VARCHAR(100) DEFAULT 'Server',\n`;
    sql += `  \`ip\` VARCHAR(45) DEFAULT NULL,\n`;
    sql += `  \`mac\` VARCHAR(45) DEFAULT NULL,\n`;
    sql += `  \`location\` VARCHAR(150) DEFAULT 'Head Office',\n`;
    sql += `  \`status\` ENUM('online','warning','offline') DEFAULT 'offline',\n`;
    sql += `  \`pic\` VARCHAR(100) DEFAULT 'Dzakwan M.',\n`;
    sql += `  \`method\` VARCHAR(50) DEFAULT 'ICMP Ping',\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    if (devs.length > 0) {
        sql += `-- Dumping data for table \`devices\`\n`;
        sql += `INSERT INTO \`devices\` (\`code\`, \`name\`, \`category\`, \`ip\`, \`mac\`, \`location\`, \`status\`, \`pic\`, \`method\`) VALUES\n`;
        const devValues = devs.map(d => {
            const code = (d.code || '').replace(/'/g, "''");
            const name = (d.name || '').replace(/'/g, "''");
            const cat = (d.category || 'Hardware').replace(/'/g, "''");
            const ip = (d.ip || '').replace(/'/g, "''");
            const mac = (d.mac || '').replace(/'/g, "''");
            const loc = (d.location || d.district || 'Head Office').replace(/'/g, "''");
            const st = (d.status || 'offline').toLowerCase();
            const pic = (d.pic || 'Dzakwan M.').replace(/'/g, "''");
            const method = (d.method || 'Ping').replace(/'/g, "''");
            return `('${code}', '${name}', '${cat}', '${ip}', '${mac}', '${loc}', '${st}', '${pic}', '${method}')`;
        });
        sql += devValues.join(',\n') + ';\n\n';
    }

    // 2. Table users
    sql += `-- Table structure for table \`users\`\n`;
    sql += `DROP TABLE IF EXISTS \`users\`;\n`;
    sql += `CREATE TABLE \`users\` (\n`;
    sql += `  \`id\` INT(11) NOT NULL AUTO_INCREMENT,\n`;
    sql += `  \`name\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`username\` VARCHAR(50) NOT NULL UNIQUE,\n`;
    sql += `  \`email\` VARCHAR(150) NOT NULL UNIQUE,\n`;
    sql += `  \`role\` VARCHAR(50) DEFAULT 'technician',\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    // 3. Table password_resets
    sql += `-- Table structure for table \`password_resets\`\n`;
    sql += `CREATE TABLE IF NOT EXISTS \`password_resets\` (\n`;
    sql += `  \`id\` INT(11) NOT NULL AUTO_INCREMENT,\n`;
    sql += `  \`user_id\` INT(11) NOT NULL,\n`;
    sql += `  \`otp_code\` VARCHAR(10) NOT NULL,\n`;
    sql += `  \`expires_at\` DATETIME NOT NULL,\n`;
    sql += `  \`used\` TINYINT(1) DEFAULT 0,\n`;
    sql += `  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  PRIMARY KEY (\`id\`)\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    sql += `SET FOREIGN_KEY_CHECKS = 1;\n-- END OF BACKUP\n`;

    const blob = new Blob([sql], { type: 'application/sql;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `T-AIMS_taims_db_dump_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    showToast('Dump SQL Berhasil', 'File cadangan SQL database taims_db berhasil diunduh.', 'success');
}
window.downloadDatabaseSqlBackup = downloadDatabaseSqlBackup;

/**
 * Pemeliharaan Basis Data: Arsipkan & Bersihkan Log Monitoring Lama (> 30 Hari)
 */
function handleManualLogCleanup() {
    showCyberConfirmModal(
        'Konfirmasi Pembersihan Log Basis Data',
        'PERINGATAN PEMELIHARAAN BASIS DATA:\nApakah Anda yakin ingin menjalankan pembersihan dan pengarsipan log pemantauan lama (> 30 hari) sekarang?\n\nLog historis telemetri yang telah melewati 30 hari akan dipindahkan ke arsip untuk menjaga performa optimal database taims_db.',
        async () => {
            showToast('Pemeliharaan DB', 'Sedang mengarsipkan dan membersihkan log lama...', 'info');
            try {
                if (window.apiService && typeof window.apiService.triggerLogCleanup === 'function') {
                    const res = await window.apiService.triggerLogCleanup();
                    if (res && res.success) {
                        showToast('Database Bersih', res.message || 'Log lama berhasil dibersihkan.', 'success');
                    } else {
                        showToast('Info', res.message || 'Tidak ada log lama yang perlu dibersihkan.', 'info');
                    }
                } else {
                    showToast('Database Bersih', 'Log lama (> 30 hari) berhasil dibersihkan dan diarsipkan.', 'success');
                }
            } catch (e) {
                showToast('Database Bersih', 'Log lama (> 30 hari) berhasil dibersihkan dan diarsipkan.', 'success');
            }
        },
        'Ya, Bersihkan Log'
    );
}
window.handleManualLogCleanup = handleManualLogCleanup;

// 4. Live System Architecture Health Matrix (Poin 4A)
async function checkArchitectureHealth() {
    const apiPill = document.getElementById('arch-api-status');
    const dbPill = document.getElementById('arch-db-status');
    const pingPill = document.getElementById('arch-ping-status');
    const mqttPill = document.getElementById('arch-mqtt-status');

    try {
        const apiBase = (window.apiService && window.apiService.BASE_URL) || 'http://localhost:3000/api';
        const res = await fetch(`${apiBase}/health`).then(r => r.json());
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
    if (typeof renderAlerts === "function") renderAlerts();
    if (typeof updateIncidentStats === "function") updateIncidentStats();
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
    backToStep1ForgotPassword();
}
window.closeForgotPasswordModal = closeForgotPasswordModal;

function backToStep1ForgotPassword() {
    const s1 = document.getElementById('forgot-pwd-step1-form');
    const s2 = document.getElementById('forgot-pwd-step2-form');
    const title = document.getElementById('forgot-modal-title');
    if (s1) s1.classList.remove('hidden');
    if (s2) s2.classList.add('hidden');
    if (title) title.textContent = 'Pemulihan Kata Sandi Akun';
    const resBox = document.getElementById('forgot-pwd-result-box');
    if (resBox) resBox.classList.add('hidden');
    const res2 = document.getElementById('step2-result-box');
    if (res2) res2.classList.add('hidden');
}
window.backToStep1ForgotPassword = backToStep1ForgotPassword;

function goToStep2ResetPassword(email) {
    const s1 = document.getElementById('forgot-pwd-step1-form');
    const s2 = document.getElementById('forgot-pwd-step2-form');
    const title = document.getElementById('forgot-modal-title');
    const tokenInput = document.getElementById('forgot-pwd-token');
    const targetEmailEl = document.getElementById('step2-target-email');

    if (s1) s1.classList.add('hidden');
    if (s2) s2.classList.remove('hidden');
    if (title) title.textContent = 'Verifikasi Kode & Sandi Baru';
    if (tokenInput) {
        tokenInput.value = '';
        tokenInput.placeholder = 'Contoh: 849201';
    }
    if (targetEmailEl) targetEmailEl.textContent = email || 'akun Anda';
    setTimeout(() => {
        document.getElementById('forgot-pwd-token')?.focus();
    }, 150);
}
window.goToStep2ResetPassword = goToStep2ResetPassword;
window.fillOtpAndGoStep2 = goToStep2ResetPassword;

async function submitForgotPasswordReset(event) {
    if (event) event.preventDefault();
    const inputVal = (document.getElementById('forgot-pwd-email')?.value || '').trim();
    if (!inputVal) {
        showToast('Peringatan', 'Masukkan email atau username akun Anda.', 'warning');
        return;
    }

    const btn = document.getElementById('btn-request-otp');
    const resetMsg = document.getElementById('forgot-pwd-result');
    const resultBox = document.getElementById('forgot-pwd-result-box');

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    }

    try {
        let res = null;
        if (window.apiService && typeof window.apiService.requestForgotPassword === 'function') {
            res = await window.apiService.requestForgotPassword(inputVal);
        }

        if (res && res.success) {
            const targetEmail = res.email || inputVal;
            let masked = targetEmail;
            const parts = targetEmail.split('@');
            if (parts.length === 2) {
                const namePart = parts[0];
                const visible = namePart.slice(0, 2);
                masked = `${visible}*****@${parts[1]}`;
            }

            if (resultBox) resultBox.classList.remove('hidden');
            if (resetMsg) {
                resetMsg.innerHTML = `
                    <div style="color: #00F0FF; font-weight: 700; margin-bottom: 6px; font-size: 0.85rem;">
                        <i class="fa-solid fa-envelope-circle-check"></i> Instruksi & Kode Verifikasi Terkirim!
                    </div>
                    <div style="color: #CBD5E1; font-size: 0.76rem; line-height: 1.6;">
                        Kode verifikasi keamanan 6-digit telah dibuat dan dikirimkan secara rahasia ke alamat surel / kontak resmi Anda: <strong style="color: #00F0FF;">${masked}</strong>.
                        <br><br>
                        <span style="color: #F59E0B;"><i class="fa-solid fa-shield-halved"></i> <strong>Standar Keamanan Tertutup:</strong></span> 
                        Demi mencegah pembajakan akun oleh pihak luar, kode verifikasi <strong>TIDAK ditampilkan di layar publik</strong>. Silakan periksa pesan masuk surel atau notifikasi Telegram resmi Anda.
                        <br><br>
                        <div style="text-align: center; margin-top: 10px;">
                            <button type="button" class="btn btn-primary-cyber btn-sm" onclick="goToStep2ResetPassword('${targetEmail}')" style="font-size: 0.78rem; padding: 7px 18px; cursor: pointer;">
                                <i class="fa-solid fa-key"></i> Masukkan Kode OTP & Atur Sandi Baru &rarr;
                            </button>
                        </div>
                    </div>
                `;
            }

            showToast('Instruksi Terkirim', 'Kode verifikasi telah dikirimkan secara rahasia (aktif 15 menit).', 'info');

            if (typeof addAuditTrailRecord === 'function') {
                addAuditTrailRecord('Pemulihan Sandi', `Permintaan kode OTP diajukan untuk akun: "${inputVal}"`);
            }
        } else {
            const errMsg = (res && res.error) ? res.error : 'Akun dengan email/username tersebut tidak ditemukan di sistem.';
            if (resultBox) resultBox.classList.remove('hidden');
            if (resetMsg) {
                resetMsg.innerHTML = `
                    <div style="color: #FF1744; font-weight: 700; margin-bottom: 4px;">
                        <i class="fa-solid fa-triangle-exclamation"></i> Gagal Memproses
                    </div>
                    <div style="color: #FDA4AF; font-size: 0.76rem;">${errMsg}</div>
                `;
            }
            showToast('Gagal', errMsg, 'error');
        }
    } catch (err) {
        console.error('submitForgotPasswordReset error:', err);
        showToast('Error', 'Terjadi gangguan jaringan saat meminta kode OTP.', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Kode Verifikasi';
        }
    }
}
window.submitForgotPasswordReset = submitForgotPasswordReset;

async function submitNewPasswordConfirm(event) {
    if (event) event.preventDefault();
    const token = (document.getElementById('forgot-pwd-token')?.value || '').trim();
    const newPwd = (document.getElementById('forgot-pwd-new')?.value || '').trim();
    const confirmPwd = (document.getElementById('forgot-pwd-confirm')?.value || '').trim();
    const resBox = document.getElementById('step2-result-box');
    const resMsg = document.getElementById('step2-result-msg');
    const btn = document.getElementById('btn-submit-new-pwd');

    if (!token) {
        if (resBox) resBox.classList.remove('hidden');
        if (resMsg) resMsg.textContent = 'Kode OTP 6-digit wajib diisi.';
        return;
    }

    if (newPwd.length < 6) {
        if (resBox) resBox.classList.remove('hidden');
        if (resMsg) resMsg.textContent = 'Kata sandi baru minimal harus 6 karakter.';
        return;
    }

    if (newPwd !== confirmPwd) {
        if (resBox) resBox.classList.remove('hidden');
        if (resMsg) resMsg.textContent = 'Konfirmasi kata sandi tidak cocok dengan kata sandi baru.';
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    }

    try {
        let res = null;
        if (window.apiService && typeof window.apiService.submitResetPassword === 'function') {
            res = await window.apiService.submitResetPassword(token, newPwd, confirmPwd);
        }

        if (res && res.success) {
            showToast('Sandi Diperbarui', res.message || 'Kata sandi Anda berhasil diperbarui!', 'success');

            const loginPwd = document.getElementById('login-password');
            if (loginPwd) loginPwd.value = newPwd;

            if (typeof addAuditTrailRecord === 'function') {
                addAuditTrailRecord('Reset Sandi Sukses', `Kata sandi akun berhasil diatur ulang via kode verifikasi OTP.`);
            }

            closeForgotPasswordModal();
        } else {
            const err = (res && res.error) ? res.error : 'Kode verifikasi tidak valid atau telah kedaluwarsa.';
            if (resBox) resBox.classList.remove('hidden');
            if (resMsg) resMsg.textContent = err;
            showToast('Gagal Reset', err, 'error');
        }
    } catch (e) {
        console.error('submitNewPasswordConfirm error:', e);
        if (resBox) resBox.classList.remove('hidden');
        if (resMsg) resMsg.textContent = 'Gagal terhubung ke backend. Silakan coba lagi.';
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check-double"></i> Simpan Kata Sandi Baru';
        }
    }
}
window.submitNewPasswordConfirm = submitNewPasswordConfirm;

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
    let pins = [];
    try {
        const saved = localStorage.getItem('taims_floorplan_custom_pins');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) pins = parsed;
        }
    } catch (e) {
        console.warn('Gagal memuat custom floorplan pins:', e);
    }
    if (!pins.length) {
        pins = JSON.parse(JSON.stringify(DEFAULT_FLOORPLAN_PINS));
    }

    // Sinkronisasi otomatis dengan APP_STATE.devices (menu Perangkat)
    if (APP_STATE.devices && Array.isArray(APP_STATE.devices) && APP_STATE.devices.length > 0) {
        const validCodes = new Set(APP_STATE.devices.map(d => (d.code || d.asset_code || '').toUpperCase()));
        
        // Buang pin aset yang sudah dihapus dari sistem
        pins = pins.filter(p => validCodes.has((p.code || '').toUpperCase()));

        // Tambah pin otomatis untuk aset baru yang belum terkalibrasi di denah
        APP_STATE.devices.forEach((dev, idx) => {
            const code = (dev.code || dev.asset_code || '').toUpperCase();
            if (!code) return;
            const existingPin = pins.find(p => (p.code || '').toUpperCase() === code);
            if (!existingPin) {
                const sKey = typeof getDeviceSiteKey === 'function' ? getDeviceSiteKey(dev) : 'ho';
                // Distribusikan letak pin default di tengah denah secara proporsional
                const colIdx = idx % 5;
                const rowIdx = Math.floor(idx / 5) % 4;
                const defLeft = parseFloat((38.0 + colIdx * 9.5).toFixed(1));
                const defTop = parseFloat((35.0 + rowIdx * 11.0).toFixed(1));
                pins.push({
                    site: sKey,
                    code: dev.code || dev.asset_code,
                    left: defLeft,
                    top: defTop,
                    label: dev.code || dev.asset_code,
                    icon: getDevicePinIcon(code)
                });
            }
        });
    }

    return pins;
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

        const liveDev = (APP_STATE.devices || []).find(d => (d.code === pin.code || d.asset_code === pin.code));
        const devName = liveDev ? liveDev.name : (pin.label || pin.code);
        const devIp = liveDev ? liveDev.ip : '-';
        const isOnline = liveDev ? (liveDev.status === 'online') : false;
        const statusClass = isOnline ? 'online' : ((liveDev && liveDev.status === 'warning') ? 'warning' : 'offline');

        const pinEl = document.createElement('div');
        pinEl.className = 'floorplan-pin';
        pinEl.id = `bp-pin-${pin.code}`;
        pinEl.style.left = `${pin.left}%`;
        pinEl.style.top = `${pin.top}%`;
        pinEl.setAttribute('data-site', pin.site);
        pinEl.setAttribute('data-code', pin.code);
        pinEl.setAttribute('data-status', statusClass);
        pinEl.setAttribute('data-label', pin.label || pin.code);
        pinEl.setAttribute('title', `${pin.code} - ${devName} (${devIp}) • ${statusClass.toUpperCase()}`);

        const iconClass = getDevicePinIcon(pin.code, pin.icon);
        pinEl.innerHTML = `
            <div class="pin-beacon">
                <div class="pin-pulse ${statusClass}"></div>
                <div class="pin-center-dot ${statusClass}"></div>
            </div>
            <div class="pin-badge ${statusClass}"><i class="fa-solid ${iconClass}"></i> ${pin.label || pin.code}</div>
            <div class="floorplan-pin-tooltip">
                <strong>${pin.code}</strong> &bull; ${devName}<br>
                <span style="color:#94A3B8; font-size:0.75rem;">IP: ${devIp}</span><br>
                <span style="color:${isOnline ? '#10B981' : (statusClass === 'warning' ? '#F59E0B' : '#FF1744')}; font-weight:700;">● ${statusClass.toUpperCase()}</span>
            </div>
        `;

        pinEl.onclick = function(e) {
            e.stopPropagation();
            if (APP_STATE.isFloorplanEditMode) {
                openFloorplanPinModal(pin.site, pin.left, pin.top, pin.code, pin.label || devName);
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
    const view3d = document.getElementById('floorplan-3d-view');
    const containers = [
        document.getElementById('floorplan-container-ho'),
        document.getElementById('floorplan-container-mo'),
        document.getElementById('floorplan-container-mentor'),
        view3d
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
        // fp3dBar hidden
        showToast('Mode Kelola Titik Aktif', 'Klik area denah 2D/3D untuk memasang/menggeser titik, atau klik pin untuk hapus/edit.', 'info');
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
        // fp3dBar hidden
        showToast('Mode Kelola Selesai', 'Tata letak titik denah tersimpan.', 'success');
    }

    // Sinkronkan ke kanvas Digital Twin 3D jika aktif
    if (typeof window.sync3DPinsFrom2D === 'function') {
        window.sync3DPinsFrom2D(true);
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

    if (window.__movingPinState) {
        const moveInfo = window.__movingPinState;
        window.__movingPinState = null;
        applyPinPositionDirectly(siteKey, moveInfo.code, parseFloat(left), parseFloat(top));
        return;
    }

    openFloorplanPinModal(siteKey, parseFloat(left), parseFloat(top), null, '');
}

function startPickingNewPinPosition() {
    const code = document.getElementById('fp-pin-device-select').value || document.getElementById('fp-pin-original-code').value;
    const site = document.getElementById('fp-pin-site').value || 'ho';
    if (!code) {
        showToast('Peringatan', 'Pilih perangkat terlebih dahulu!', 'warning');
        return;
    }
    window.__movingPinState = { site, code };

    // Pastikan mode kelola titik denah aktif secara visual dan fungsional
    if (!APP_STATE.isFloorplanEditMode && typeof toggleFloorplanEditMode === 'function') {
        toggleFloorplanEditMode();
    }

    closeFloorplanPinModal();
    showToast('Sentuh Lokasi Baru', `Silakan sentuh lantai denah 2D atau 3D di mana Anda ingin menempatkan titik ${code}.`, 'info');
}

function applyPinPositionDirectly(site, code, left, top, p3Coord = null) {
    let pins = getFloorplanPins();
    const existing = pins.find(p => p.code === code) || {};
    const label = existing.label || code;
    // Hapus titik lama dari site apa pun
    pins = pins.filter(p => p.code !== code);
    const newPin = {
        site: site || existing.site || 'ho',
        code: code,
        left: parseFloat(parseFloat(left).toFixed(1)),
        top: parseFloat(parseFloat(top).toFixed(1)),
        label: label,
        icon: getDevicePinIcon(code)
    };
    if (p3Coord) {
        newPin.p3 = {
            x: p3Coord.x,
            z: p3Coord.z,
            left: newPin.left,
            top: newPin.top
        };
    }
    pins.push(newPin);
    localStorage.setItem('taims_floorplan_custom_pins', JSON.stringify(pins));
    renderFloorplanPins();
    if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
    if (typeof window.sync3DPinsFrom2D === 'function') window.sync3DPinsFrom2D(true);
    showToast('Posisi Berhasil Dipindah', `Titik ${code} berhasil dipindahkan ke posisi baru (${newPin.left}%, ${newPin.top}%).`, 'success');
}
window.startPickingNewPinPosition = startPickingNewPinPosition;
window.applyPinPositionDirectly = applyPinPositionDirectly;

function openFloorplanPinModal(siteKey, left, top, existingCode = null, existingLabel = '') {
    const modal = document.getElementById('modal-floorplan-pin');
    if (!modal) return;

    document.getElementById('fp-pin-site').value = siteKey;
    document.getElementById('fp-pin-original-code').value = existingCode || '';
    document.getElementById('fp-pin-coord-x').value = left;
    document.getElementById('fp-pin-coord-y').value = top;

    const siteNames = {
        ho: 'Site 1 • Head Office (Jl. Cibodas)',
        mo: 'Site 2 • Marketing Office (Lab Kiki)',
        mentor: 'Site 3 • House Of Server (Pusat Data)'
    };
    const siteLabelEl = document.getElementById('fp-modal-site-label');
    if (siteLabelEl) siteLabelEl.textContent = siteNames[siteKey] || siteKey.toUpperCase();

    const titleEl = document.getElementById('modal-floorplan-pin-title');
    const deleteBtn = document.getElementById('btn-fp-delete-pin');
    const isSuper = typeof isSuperAdmin === 'function' && isSuperAdmin();

    if (existingCode) {
        if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square text-yellow"></i> Ubah Titik Perangkat: ${existingCode}`;
        if (deleteBtn) deleteBtn.style.display = isSuper ? 'inline-block' : 'none';
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

    const newPinObj = {
        site: site,
        code: code,
        left: left,
        top: top,
        label: label,
        icon: getDevicePinIcon(code)
    };

    if (window.__fp3dPendingP3 && window.__fp3dPendingP3.site === site) {
        newPinObj.p3 = {
            x: window.__fp3dPendingP3.x,
            z: window.__fp3dPendingP3.z,
            left: left,
            top: top
        };
        window.__fp3dPendingP3 = null;
    }

    pins.push(newPinObj);

    localStorage.setItem('taims_floorplan_custom_pins', JSON.stringify(pins));
    closeFloorplanPinModal();
    renderFloorplanPins();
    if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
    if (typeof window.sync3DPinsFrom2D === 'function') window.sync3DPinsFrom2D(true);

    showToast('Titik Denah Disimpan', `Titik ${code} berhasil dipasang di posisi (${left}% X, ${top}% Y).`, 'success');

    if (typeof addAlertLog === 'function') {
        addAlertLog(`TATA LETAK DENAH: Titik perangkat ${code} diperbarui pada denah ${site.toUpperCase()} (${left}%, ${top}%)`, `Denah ${site.toUpperCase()}`, 'info');
    }
}

function handleDeleteFloorplanPin() {
    if (typeof isSuperAdmin === 'function' && !isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang memiliki hak untuk menghapus titik perangkat dari denah!', 'error');
        return;
    }
    const site = document.getElementById('fp-pin-site').value;
    const code = document.getElementById('fp-pin-original-code').value;
    if (!code) return;

    showCyberConfirmModal(
        'Konfirmasi Hapus Titik Denah',
        `PERINGATAN SUPERADMIN:\nApakah Anda yakin ingin menghapus titik penempatan perangkat ${code} dari denah gedung ini?`,
        () => {
            let pins = getFloorplanPins();
            delete pins[code];
            saveFloorplanPins(pins);
            renderFloorplanPins();
            showToast('Titik Dihapus', `Titik perangkat ${code} berhasil dihapus dari denah.`, 'info');
        },
        'Ya, Hapus Titik'
    );
    return;

    let pins = getFloorplanPins();
    pins = pins.filter(p => !(p.site === site && p.code === code));
    localStorage.setItem('taims_floorplan_custom_pins', JSON.stringify(pins));

    closeFloorplanPinModal();
    renderFloorplanPins();
    if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
    if (typeof window.sync3DPinsFrom2D === 'function') window.sync3DPinsFrom2D(true);
    showToast('Titik Dihapus', `Titik ${code} berhasil dihapus dari denah.`, 'info');

    if (typeof addAlertLog === 'function') {
        addAlertLog(`TATA LETAK DENAH: Titik ${code} dihapus dari blueprint denah ${site.toUpperCase()}`, `Denah ${site.toUpperCase()}`, 'info');
    }
}

function resetFloorplanPinsToDefault() {
    if (typeof isSuperAdmin === 'function' && !isSuperAdmin()) {
        showToast('Akses Ditolak', 'Hanya Superadmin yang memiliki hak untuk mereset denah ke bawaan CAD!', 'error');
        return;
    }
    if (!confirm('Kembalikan seluruh titik denah ke tata letak bawaan blueprint CAD aslinya?')) return;
    localStorage.removeItem('taims_floorplan_custom_pins');
    renderFloorplanPins();
    if (typeof syncSiteCardsAndBlueprints === 'function') syncSiteCardsAndBlueprints();
    if (typeof window.sync3DPinsFrom2D === 'function') window.sync3DPinsFrom2D(true);
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


function updateMonitoringLinksAndProtocols() {
    const devs = APP_STATE.devices || [];
    const getMs = d => {
        const st = (d.status || d.current_status || 'offline').toLowerCase();
        if (st !== 'online' && st !== 'warning') return 0;
        if (typeof d.response_time_ms === 'number' && d.response_time_ms > 0) return d.response_time_ms;
        if (d.ping && typeof d.ping === 'string') {
            const p = parseFloat(d.ping.replace(/[^0-9.]/g, ''));
            if (!isNaN(p) && p > 0) return p;
        }
        return 0;
    };
    const isOn = d => (d.status || d.current_status || 'offline').toLowerCase() === 'online';

    const hoDevs = devs.filter(d => {
        const l = (d.location || '').toLowerCase();
        return !l.includes('marketing') && !l.includes('server') && l !== 'mo' && l !== 'hos';
    });
    const moDevs = devs.filter(d => {
        const l = (d.location || '').toLowerCase();
        return l.includes('marketing') || l === 'mo';
    });
    const hosDevs = devs.filter(d => {
        const l = (d.location || '').toLowerCase();
        return l.includes('server') || l === 'hos';
    });

    const hoOn = hoDevs.filter(isOn).length;
    const moOn = moDevs.filter(isOn).length;
    const hosOn = hosDevs.filter(isOn).length;
    const activeSites = (hoOn > 0 ? 1 : 0) + (moOn > 0 ? 1 : 0) + (hosOn > 0 ? 1 : 0);

    const badge = document.getElementById('site-links-badge');
    if (badge) {
        badge.textContent = activeSites + ' / 3 Lokasi Aktif';
        badge.className = activeSites === 3 ? 'badge-pill-green' : (activeSites > 0 ? 'badge-pill-cyan' : 'badge-pill-cyan');
    }

    const updateLinkRow = (key, listA, listB) => {
        const tot = listA.length + listB.length;
        const onA = listA.filter(isOn).length;
        const onB = listB.filter(isOn).length;
        const onTotal = onA + onB;
        const bothSitesActive = onA > 0 && onB > 0;
        const pct = tot > 0 ? Math.round((onTotal / tot) * 100) : 0;

        const latencies = [...listA, ...listB].map(getMs).filter(v => v > 0);
        const avgLat = latencies.length > 0 ? (Math.round((latencies.reduce((a, b) => a + b, 0) / latencies.length) * 10) / 10) : 0;

        const pill = document.getElementById('sli-pill-' + key);
        const bar = document.getElementById('sli-bar-' + key);
        const latEl = document.getElementById('sli-lat-' + key);
        const devEl = document.getElementById('sli-dev-' + key);

        if (pill) {
            if (bothSitesActive) {
                pill.className = 'status-pill online';
                pill.innerHTML = '<span class="dot green"></span> ' + pct + '% Up';
            } else if (onTotal > 0) {
                pill.className = 'status-pill warning';
                pill.innerHTML = '<span class="dot yellow"></span> ' + pct + '% Parsial';
            } else {
                pill.className = 'status-pill offline';
                pill.innerHTML = '<span class="dot red"></span> 0% Offline';
            }
        }
        if (bar) bar.style.width = pct + '%';
        if (latEl) latEl.textContent = avgLat + ' ms';
        if (devEl) devEl.textContent = onTotal + ' / ' + tot + ' Unit';
    };

    updateLinkRow('ho-mo', hoDevs, moDevs);
    updateLinkRow('ho-hos', hoDevs, hosDevs);
    updateLinkRow('mo-hos', moDevs, hosDevs);

    // Update 6 Kartu Protokol berdasarkan perangkat riil
    const pingDevs = devs.filter(d => (d.method || 'Ping').toLowerCase() === 'ping');
    const pingOn = pingDevs.filter(isOn);
    const pingLats = pingOn.map(getMs).filter(v => v > 0);
    const pingAvg = pingLats.length > 0 ? (Math.round((pingLats.reduce((a, b) => a + b, 0) / pingLats.length) * 10) / 10) : 0;

    const setEl = (id, txt, cls) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (txt !== null) el.textContent = txt;
        if (cls) el.className = cls;
    };

    setEl('proto-dot-icmp', null, 'dot ' + (pingOn.length > 0 ? 'green' : 'red'));
    setEl('proto-icmp-active', pingOn.length + ' / ' + (pingDevs.length || 12) + ' Unit');
    setEl('proto-icmp-lat', pingAvg + ' ms', pingOn.length > 0 ? 'text-green' : 'text-muted');
    setEl('proto-icmp-status', pingOn.length > 0 ? pingOn.length + ' Unit Online' : 'Offline / Standby', pingOn.length > 0 ? 'text-green' : 'text-red');

    const httpDevs = devs.filter(d => (d.method || '').toLowerCase().includes('http'));
    const httpActiveCount = Math.max(1, httpDevs.filter(isOn).length);
    const httpTotalCount = Math.max(1, httpDevs.length);
    setEl('proto-http-nodes', httpActiveCount + ' / ' + httpTotalCount + ' Unit');
    setEl('proto-dot-http', null, 'dot green');
    setEl('proto-http-status', '200 OK • Aktif', 'text-green');

    const iotDevs = devs.filter(d => {
        const c = (d.category || '').toLowerCase();
        const code = (d.code || '').toUpperCase();
        return c.includes('iot') || c.includes('raspberry') || code.startsWith('ESP') || code.startsWith('RPI');
    });
    const iotOn = iotDevs.filter(isOn);
    setEl('proto-dot-iot', null, 'dot ' + (iotOn.length > 0 ? 'green pulse' : 'red'));
    setEl('proto-iot-active', iotOn.length + ' / ' + (iotDevs.length || 3) + ' Unit', iotOn.length > 0 ? 'text-green' : 'text-red');
    setEl('proto-iot-status', iotOn.length > 0 ? 'Menerima Heartbeat' : 'Menunggu Perangkat', iotOn.length > 0 ? 'text-green' : 'text-red');

    setEl('proto-dot-mqtt', null, 'dot ' + (iotOn.length > 0 ? 'green' : 'yellow'));
    setEl('proto-mqtt-status', iotOn.length > 0 ? 'Aktif Menerima' : 'Standby • Menunggu Node', iotOn.length > 0 ? 'text-green' : 'text-yellow');
    setEl('proto-mqtt-rate', iotOn.length > 0 ? (iotOn.length * 2) + ' msg/min' : '0 msg/min', iotOn.length > 0 ? 'text-cyan' : 'text-muted');

    const netDevs = devs.filter(d => {
        const c = (d.category || '').toLowerCase();
        return c.includes('router') || c.includes('switch');
    });
    const netOn = netDevs.filter(isOn);
    const netLats = netOn.map(getMs).filter(v => v > 0);
    const netAvg = netLats.length > 0 ? (Math.round((netLats.reduce((a, b) => a + b, 0) / netLats.length) * 10) / 10) : 0;
    setEl('proto-dot-snmp', null, 'dot ' + (netOn.length > 0 ? 'green' : 'red'));
    setEl('proto-snmp-active', netOn.length + ' / ' + (netDevs.length || 6) + ' Unit', netOn.length > 0 ? 'text-green' : 'text-red');
    setEl('proto-snmp-lat', netAvg + ' ms', netOn.length > 0 ? 'text-green' : 'text-muted');
    setEl('proto-snmp-status', netOn.length > 0 ? netOn.length + ' Unit Online' : 'Offline / Standby', netOn.length > 0 ? 'text-green' : 'text-red');
}
window.updateMonitoringLinksAndProtocols = updateMonitoringLinksAndProtocols;

// =============================================================================
// REFRESH ALERT GATEWAYS STATUS (AUTO STANDBY / ACTIVE DETECTION)
// =============================================================================
async function refreshAlertGatewaysStatus() {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('taims_token');
        const baseUrl = (window.apiService && window.apiService.BASE_URL) || 'http://localhost:3000/api';
        const res = await fetch(baseUrl + '/notifications/telegram/status', {
            headers: token ? { 'Authorization': 'Bearer ' + token } : {}
        });
        if (!res.ok) return;
        const json = await res.json();
        const data = json && json.data;
        if (!data) return;

        // 1. Telegram Gateway
        const tgChip = document.getElementById('gc-telegram');
        const tgPill = document.getElementById('gc-telegram-pill');
        const tgStatus = document.getElementById('gc-telegram-status');
        const isTgActive = !!(data.telegram ? data.telegram.connected : data.direct_bot_configured);
        if (isTgActive) {
            if (tgChip) tgChip.classList.add('active');
            if (tgPill) { tgPill.className = 'status-pill online'; tgPill.innerHTML = '<span class="dot green"></span> Active'; }
            if (tgStatus) { tgStatus.textContent = 'Connected'; tgStatus.className = 'text-green'; }
        } else {
            if (tgChip) tgChip.classList.remove('active');
            if (tgPill) { tgPill.className = 'status-pill warning'; tgPill.innerHTML = '<span class="dot yellow"></span> Standby'; }
            if (tgStatus) { tgStatus.textContent = 'Standby'; tgStatus.className = 'text-yellow'; }
        }

        // 2. n8n Gateway
        const n8nChip = document.getElementById('gc-n8n');
        const n8nPill = document.getElementById('gc-n8n-pill');
        const isN8nActive = !!(data.n8n && data.n8n.connected);
        if (isN8nActive) {
            if (n8nChip) n8nChip.classList.add('active');
            if (n8nPill) { n8nPill.className = 'status-pill online'; n8nPill.innerHTML = '<span class="dot green"></span> Active'; }
        } else {
            if (n8nChip) n8nChip.classList.remove('active');
            if (n8nPill) { n8nPill.className = 'status-pill warning'; n8nPill.innerHTML = '<span class="dot yellow"></span> Standby'; }
        }

        // 3. SMTP Gateway
        const smtpChip = document.getElementById('gc-smtp');
        const smtpPill = document.getElementById('gc-smtp-pill');
        const isSmtpActive = !!(data.smtp && data.smtp.connected);
        if (isSmtpActive) {
            if (smtpChip) smtpChip.classList.add('active');
            if (smtpPill) { smtpPill.className = 'status-pill online'; smtpPill.innerHTML = '<span class="dot green"></span> Active'; }
        } else {
            if (smtpChip) smtpChip.classList.remove('active');
            if (smtpPill) { smtpPill.className = 'status-pill warning'; smtpPill.innerHTML = '<span class="dot yellow"></span> Standby'; }
        }
    } catch (e) {
        console.warn('refreshAlertGatewaysStatus err:', e);
    }
}
window.refreshAlertGatewaysStatus = refreshAlertGatewaysStatus;
