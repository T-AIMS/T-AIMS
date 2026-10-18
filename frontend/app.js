/**
 * =====================================================================
 * T-AIMS GLOBAL SESSION, RBAC PERMISSION, DYNAMIC INTERVAL & CHARTS
 * =====================================================================
 * Terintegrasi ke Backend Express.js (Port 3000) & Database MySQL (16 Aset)
 * =====================================================================
 */

let MASTER_DEVICES = (typeof FALLBACK_ASSETS !== 'undefined') ? FALLBACK_ASSETS : [];
let dashboardTimerId = null;
let devicesTimerId = null;

// Ambil nilai interval dari Pengaturan (Default: 10 detik)
function getActiveRefreshIntervalMs() {
  const savedSec = parseInt(localStorage.getItem('taims_refresh_interval') || '10', 10);
  const validSec = (isNaN(savedSec) || savedSec < 1) ? 10 : savedSec;
  return validSec * 1000;
}

window.getActiveRefreshIntervalMs = getActiveRefreshIntervalMs;

function parseThemeKey(str) {
  const s = (str || '').toLowerCase();
  if (s.includes('amoled') || s === 'amoled') return 'amoled';
  if (s.includes('midnight') || s === 'midnight') return 'midnight';
  return 'cyber';
}

// Inisialisasi Tema Global (Cyber-Electric Dark, Minimalist Midnight, & AMOLED Pure Black)
function initGlobalTheme() {
  const savedTheme = localStorage.getItem('taims_theme_mode') || 'Opsi 2 - Cyber-Electric Dark (Aktif)';
  const themeKey = parseThemeKey(savedTheme);
  document.documentElement.setAttribute('data-theme', themeKey);
  if (document.body) document.body.setAttribute('data-theme', themeKey);
}

function applyThemeMode(themeName) {
  const themeKey = parseThemeKey(themeName);
  document.documentElement.setAttribute('data-theme', themeKey);
  if (document.body) document.body.setAttribute('data-theme', themeKey);
  localStorage.setItem('taims_theme_mode', themeName);
}

window.applyThemeMode = applyThemeMode;
initGlobalTheme();

document.addEventListener("DOMContentLoaded", async () => {
  initGlobalTheme();
  initGlobalSession();
  initLiveClock();
  initMobileResponsive();

  const intervalMs = getActiveRefreshIntervalMs();

  // 1. Jika di Dashboard: Muat statistik, chart realtime, dan AI Smart Insight
  if (document.getElementById('kpi-total-devices') || document.getElementById('categoryDonutChart')) {
    await initDashboard();
    if (dashboardTimerId) clearInterval(dashboardTimerId);
    dashboardTimerId = setInterval(initDashboard, intervalMs);
    initAiRecommendationEngine();
  }

  // 2. Jika di Halaman Laporan: Inisialisasi AI Recommendation Engine
  if (document.getElementById('aiRepStatusBadge') || document.getElementById('reportsTableBody')) {
    initAiRecommendationEngine();
  }

  // 3. Jika di Halaman Devices: Muat tabel 16 aset realtime sesuai interval pengaturan
  if (document.getElementById('devicesTableBody')) {
    await initDevicesTable();
    if (devicesTimerId) clearInterval(devicesTimerId);
    devicesTimerId = setInterval(initDevicesTable, intervalMs);
  }
});

// =====================================================================
// 1. GLOBAL SESSION, POJOK KANAN ATAS & KUNCI AKSES TIGA ROLE (SUPER ADMIN, ADMIN, USER)
// =====================================================================
function initGlobalSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  if (roleParam) {
    localStorage.setItem('taims_user_role', roleParam);
  }

  const activeRole = localStorage.getItem('taims_user_role') || 'super_admin';
  const isSuperAdmin = (activeRole === 'super_admin');
  const isAdmin = (activeRole === 'admin');
  const isUser = (activeRole === 'user' || activeRole === 'guest');

  // Sinkronisasi teks dan ikon profil di pojok kanan atas pada SEMUA halaman
  const nameEls = document.querySelectorAll('#topbarRoleName, .profile-meta-text strong');
  const subEls = document.querySelectorAll('#topbarRoleSub, .profile-meta-text small');
  const avatarEls = document.querySelectorAll('#topbarAvatar, .profile-avatar-circle');

  nameEls.forEach(el => {
    if (isSuperAdmin) el.innerText = "Dika Yoga Pratama";
    else if (isAdmin) el.innerText = "Ahmad Reza Fahmi";
    else el.innerText = "Tamu / Pengunjung";
  });

  subEls.forEach(el => {
    if (isSuperAdmin) el.innerText = "Super Administrator";
    else if (isAdmin) el.innerText = "Administrator";
    else el.innerText = "Tamu (Hanya Lihat)";
  });

  avatarEls.forEach(el => {
    if (isSuperAdmin) {
      el.innerHTML = '<i class="fa-solid fa-crown"></i>';
      el.style.background = 'linear-gradient(135deg, #DC2626, #B91C1C)';
      el.style.boxShadow = '0 0 10px rgba(220, 38, 38, 0.5)';
    } else if (isAdmin) {
      el.innerHTML = '<i class="fa-solid fa-shield-halved"></i>';
      el.style.background = 'linear-gradient(135deg, #2563EB, #1D4ED8)';
      el.style.boxShadow = '0 0 10px rgba(37, 99, 235, 0.5)';
    } else {
      el.innerHTML = '<i class="fa-regular fa-user"></i>';
      el.style.background = 'linear-gradient(135deg, #64748B, #334155)';
      el.style.boxShadow = 'none';
    }
  });

  // Tampilkan Dropdown Profil untuk Logout / Ganti Akun
  const profileBoxes = document.querySelectorAll('.topbar-profile-dropdown');
  profileBoxes.forEach(box => {
    box.style.cursor = 'pointer';
    box.title = `Login sebagai: ${isSuperAdmin ? 'Super Admin' : (isAdmin ? 'Admin' : 'Tamu')}. Klik untuk Keluar / Ganti Akun.`;
    box.onclick = (e) => {
      e.preventDefault();
      let menu = document.getElementById('globalProfileDropdownMenu');
      if (!menu) {
        menu = document.createElement('div');
        menu.id = 'globalProfileDropdownMenu';
        menu.style.position = 'absolute';
        menu.style.top = '60px';
        menu.style.right = '20px';
        menu.style.background = '#0B1222';
        menu.style.border = '1px solid var(--border-card)';
        menu.style.borderRadius = '12px';
        menu.style.padding = '14px';
        menu.style.width = '240px';
        menu.style.boxShadow = '0 12px 35px rgba(0,0,0,0.6)';
        menu.style.zIndex = '99999';
        document.body.appendChild(menu);
      }

      menu.innerHTML = `
        <div style="border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:10px; margin-bottom:10px;">
          <small style="color:var(--text-dim); font-size:10px; text-transform:uppercase;">Akun Aktif</small>
          <strong style="display:block; color:#fff; font-size:12.5px;">${isSuperAdmin ? 'Dika Yoga Pratama' : (isAdmin ? 'Ahmad Reza Fahmi' : 'Tamu / Pengunjung')}</strong>
          <span style="font-size:10px; font-weight:800; color:${isSuperAdmin ? '#F87171' : (isAdmin ? '#60A5FA' : '#94A3B8')};">
            ${isSuperAdmin ? '👑 Super Admin (Full CRUD)' : (isAdmin ? '🛡️ Admin (Add & Delete)' : '👤 Tamu (Read-Only)')}
          </span>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <button onclick="localStorage.setItem('taims_user_role','super_admin'); location.reload();" style="background:#090E1A; border:1px solid var(--border-card); color:#fff; padding:7px 10px; border-radius:6px; font-size:11px; text-align:left; cursor:pointer; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-crown text-amber"></i> Masuk Super Admin
          </button>
          <button onclick="localStorage.setItem('taims_user_role','admin'); location.reload();" style="background:#090E1A; border:1px solid var(--border-card); color:#fff; padding:7px 10px; border-radius:6px; font-size:11px; text-align:left; cursor:pointer; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-shield-halved text-blue"></i> Masuk Admin
          </button>
          <button onclick="localStorage.setItem('taims_user_role','user'); location.reload();" style="background:#090E1A; border:1px solid var(--border-card); color:#fff; padding:7px 10px; border-radius:6px; font-size:11px; text-align:left; cursor:pointer; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-user text-muted"></i> Masuk Mode Tamu
          </button>
          <hr style="border:none; border-top:1px solid rgba(255,255,255,0.08); margin:4px 0;">
          <a href="index.html" style="background:var(--accent-red); color:#fff; padding:8px 10px; border-radius:6px; font-size:11px; font-weight:700; text-align:center; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px;">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> Keluar ke Login Portal
          </a>
        </div>
      `;

      menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    };
  });

  // Tutup dropdown jika klik di luar
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('globalProfileDropdownMenu');
    const profileBox = document.querySelector('.topbar-profile-dropdown');
    if (menu && menu.style.display === 'block' && !menu.contains(e.target) && !profileBox.contains(e.target)) {
      menu.style.display = 'none';
    }
  });

  // HAK AKSES PER ELEMEN UI SESUAI ROLE ASLI
  // 1. Tombol Tambah (Hanya Super Admin & Admin)
  const addButtons = document.querySelectorAll(
    '#btnOpenAddReport, #btnAddDevice, #btnOpenAddDevice, #btnAddUser, #btnAddDenahPin'
  );
  addButtons.forEach(btn => {
    btn.style.display = (isSuperAdmin || isAdmin) ? 'inline-flex' : 'none';
  });

  // 2. Tombol Edit (Hanya Super Admin)
  const editButtons = document.querySelectorAll('.btn-edit-only, .btn-action-edit-row');
  editButtons.forEach(btn => {
    btn.style.display = isSuperAdmin ? 'inline-flex' : 'none';
  });

  // 3. Tombol Hapus (Super Admin & Admin)
  const deleteButtons = document.querySelectorAll('.btn-delete-only, .btn-action-delete-row');
  deleteButtons.forEach(btn => {
    btn.style.display = (isSuperAdmin || isAdmin) ? 'inline-flex' : 'none';
  });

  // 4. Mode Edit Denah (Super Admin & Admin)
  const denahEditButtons = document.querySelectorAll('#btnDenahEditMode, #btnAdminMode');
  denahEditButtons.forEach(btn => {
    btn.style.display = (isSuperAdmin || isAdmin) ? 'inline-flex' : 'none';
  });

  // 5. Kunci form Pengaturan jika Tamu
  const settingInputs = document.querySelectorAll('.setting-input-text, .setting-select-box');
  settingInputs.forEach(input => {
    input.disabled = isUser;
    input.style.opacity = isUser ? '0.5' : '1';
    input.style.cursor = isUser ? 'not-allowed' : 'text';
  });

  // 6. Update lencana role di banner Dashboard
  const bannerRoleBadge = document.querySelector('.pill-admin');
  if (bannerRoleBadge) {
    if (isSuperAdmin) {
      bannerRoleBadge.innerHTML = '<i class="fa-solid fa-crown text-amber"></i> Super Administrator (Kontrol Penuh)';
      bannerRoleBadge.style.background = 'rgba(220, 38, 38, 0.25)';
      bannerRoleBadge.style.borderColor = '#DC2626';
      bannerRoleBadge.style.color = '#FCA5A5';
    } else if (isAdmin) {
      bannerRoleBadge.innerHTML = '<i class="fa-solid fa-shield-halved text-blue"></i> Administrator (Add & Delete)';
      bannerRoleBadge.style.background = 'rgba(37, 99, 235, 0.25)';
      bannerRoleBadge.style.borderColor = '#2563EB';
      bannerRoleBadge.style.color = '#93C5FD';
    } else {
      bannerRoleBadge.innerHTML = '<i class="fa-regular fa-eye"></i> Mode Tamu / User (Hanya Lihat)';
      bannerRoleBadge.style.background = 'rgba(100, 116, 139, 0.25)';
      bannerRoleBadge.style.borderColor = '#64748B';
      bannerRoleBadge.style.color = '#CBD5E1';
    }
  }

  // Sinkronisasi lencana notifikasi jika sudah ditandai dibaca
  if (localStorage.getItem('taims_alerts_read') === 'true') {
    document.querySelectorAll('.notif-bubble, .alert-pill-red').forEach(b => b.style.display = 'none');
  }
}

window.getAppRole = function() {
  return localStorage.getItem('taims_user_role') || 'super_admin';
};

window.isCurrentUserAdmin = function() {
  const r = window.getAppRole();
  return (r === 'admin' || r === 'super_admin');
};

window.isCurrentUserSuperAdmin = function() {
  return window.getAppRole() === 'super_admin';
};

// =====================================================================
// MOBILE SIDEBAR RESPONSIVE & CLICKABLE INTERACTION
// =====================================================================
function initMobileResponsive() {
  // 1. Pastikan backdrop overlay sudah ada di DOM
  let backdrop = document.getElementById('sidebarBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sidebarBackdrop';
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }
  backdrop.onclick = closeMobileSidebar;

  // 2. Jika tombol hamburger belum ada di topbar, sisipkan secara otomatis
  const topbar = document.querySelector('.desktop-top-navbar');
  if (topbar && !document.getElementById('mobileMenuToggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'mobileMenuToggle';
    toggleBtn.className = 'mobile-menu-toggle';
    toggleBtn.setAttribute('aria-label', 'Buka Menu Navigasi');
    toggleBtn.setAttribute('type', 'button');
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    toggleBtn.onclick = toggleMobileSidebar;
    topbar.prepend(toggleBtn);
  }

  // 3. Jika tombol close X belum ada di sidebar logo zone, sisipkan secara otomatis
  const logoZone = document.querySelector('.sidebar-logo-zone');
  if (logoZone && !document.querySelector('.sidebar-close-btn')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sidebar-close-btn';
    closeBtn.setAttribute('aria-label', 'Tutup Menu');
    closeBtn.setAttribute('type', 'button');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.onclick = closeMobileSidebar;
    logoZone.appendChild(closeBtn);
  }

  // 4. Tutup drawer otomatis saat link sidebar diklik pada layar kecil
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeMobileSidebar();
      }
    });
  });

  // 5. Tutup dengan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileSidebar();
  });
}
window.initMobileResponsive = initMobileResponsive;

function toggleMobileSidebar() {
  const isOpen = document.body.classList.toggle('sidebar-open');
  const sidebar = document.querySelector('.desktop-sidebar');
  if (sidebar) sidebar.classList.toggle('open', isOpen);
}
window.toggleMobileSidebar = toggleMobileSidebar;

function closeMobileSidebar() {
  document.body.classList.remove('sidebar-open');
  const sidebar = document.querySelector('.desktop-sidebar');
  if (sidebar) sidebar.classList.remove('open');
}
window.closeMobileSidebar = closeMobileSidebar;

function toggleNavDrawer() {
  toggleMobileSidebar();
}
window.toggleNavDrawer = toggleNavDrawer;

// =====================================================================
// 2. JAM LIVE REAL-TIME
// =====================================================================
function initLiveClock() {
  function update() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const tStr = `${h}:${m}:${s} WIB`;

    document.querySelectorAll('.topbar-clock-chip span, #dt-live-date').forEach(el => el.innerText = dStr);
    document.querySelectorAll('.topbar-clock-chip strong, #dt-live-time, #m-live-time').forEach(el => el.innerText = tStr);
  }
  update();
  setInterval(update, 1000);
}

// =====================================================================
// 3. DASHBOARD LOGIC (KPI STATS, CHARTS, RECENT TABLE)
// =====================================================================
let categoryDonutChartInstance = null;
let trendChartInstance = null;

async function initDashboard() {
  let stats = null;
  if (typeof getDashboardStats === 'function') {
    stats = await getDashboardStats();
  }

  if (!stats) {
    stats = {
      total_devices: MASTER_DEVICES.length,
      online: MASTER_DEVICES.filter(d => (d.current_status || '').toLowerCase() === 'online').length,
      offline: MASTER_DEVICES.filter(d => (d.current_status || '').toLowerCase() === 'offline').length,
      unknown: MASTER_DEVICES.filter(d => (d.current_status || '').toLowerCase() === 'unknown').length,
      maintenance: 0,
      availability_percent: 0,
      by_category: {}
    };
    stats.availability_percent = stats.total_devices > 0 ? ((stats.online / stats.total_devices) * 100).toFixed(2) : 0;
    MASTER_DEVICES.forEach(d => {
      stats.by_category[d.category] = (stats.by_category[d.category] || 0) + 1;
    });
  }

  const online = Number(stats.online) || 0;
  const offline = Number(stats.offline) || 0;
  const unknown = Number(stats.unknown) || 0;
  const maintenance = Number(stats.maintenance) || 0;
  const warning = unknown + maintenance;
  const total = Number(stats.total_devices) || (online + offline + warning);
  const uptime = Number(stats.availability_percent) || 0;

  const pctOnline = total > 0 ? ((online / total) * 100).toFixed(1) : "0.0";
  const pctOffline = total > 0 ? ((offline / total) * 100).toFixed(1) : "0.0";
  const pctWarning = total > 0 ? ((warning / total) * 100).toFixed(1) : "0.0";

  const elTot = document.getElementById('kpi-total-devices');
  const elOn = document.getElementById('kpi-online-devices');
  const elOff = document.getElementById('kpi-offline-devices');
  const elWarn = document.getElementById('kpi-warning-devices');
  const elUptime = document.getElementById('kpi-uptime');

  if (elTot) elTot.innerText = total;
  if (elOn) elOn.innerText = online;
  if (elOff) elOff.innerText = offline;
  if (elWarn) elWarn.innerText = warning;
  if (elUptime) elUptime.innerText = `${uptime}%`;

  const barOn = document.getElementById('kpi-bar-online');
  const subOn = document.getElementById('kpi-sub-online');
  if (barOn) barOn.style.width = `${pctOnline}%`;
  if (subOn) subOn.innerHTML = `<strong>${pctOnline}%</strong> normal beroperasi`;

  const barOff = document.getElementById('kpi-bar-offline');
  const subOff = document.getElementById('kpi-sub-offline');
  if (barOff) barOff.style.width = `${pctOffline}%`;
  if (subOff) subOff.innerHTML = `<strong>${pctOffline}%</strong> offline fault`;

  const barWarn = document.getElementById('kpi-bar-warning');
  const subWarn = document.getElementById('kpi-sub-warning');
  if (barWarn) barWarn.style.width = `${pctWarning}%`;
  if (subWarn) subWarn.innerHTML = `<strong>${pctWarning}%</strong> belum termonitor (${unknown} unknown)`;

  const barUp = document.getElementById('kpi-bar-uptime');
  if (barUp) barUp.style.width = `${uptime}%`;

  initDashboardCharts({ total, online, offline, unknown, warning, maintenance, by_category: stats.by_category });

  if (typeof getAssets === 'function') {
    const assetsRes = await getAssets({ limit: 50 });
    if (assetsRes && assetsRes.data) {
      MASTER_DEVICES = assetsRes.data;
      renderRecentDevicesTable(assetsRes.data.slice(0, 4));
    }
  } else {
    renderRecentDevicesTable(MASTER_DEVICES.slice(0, 4));
  }
}

function initDashboardCharts(stats) {
  const online = stats.online;
  const offline = stats.offline;
  const warning = stats.warning;

  const ctxTrend = document.getElementById('trendChart');
  if (ctxTrend && typeof Chart !== 'undefined') {
    if (!trendChartInstance) {
      trendChartInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
          labels: ['10 Okt', '11 Okt', '12 Okt', '13 Okt', '14 Okt', '15 Okt', 'Hari Ini'],
          datasets: [
            { label: 'Online', data: [5, 6, 6, 7, 7, 6, online], borderColor: '#10B981', borderWidth: 2, tension: 0.3, pointRadius: 3 },
            { label: 'Offline', data: [2, 3, 3, 4, 5, 5, offline], borderColor: '#EF4444', borderWidth: 1.5, borderDash: [3, 3], pointRadius: 2, tension: 0.3 },
            { label: 'Unknown', data: [9, 7, 7, 5, 4, 5, warning], borderColor: '#F59E0B', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 2, tension: 0.3 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#131B30' }, ticks: { color: '#64748B', font: { size: 9 } } },
            y: { grid: { color: '#131B30' }, ticks: { color: '#64748B', font: { size: 9 } }, min: 0, max: 18 }
          }
        }
      });
    } else {
      trendChartInstance.data.datasets[0].data[6] = online;
      trendChartInstance.data.datasets[1].data[6] = offline;
      trendChartInstance.data.datasets[2].data[6] = warning;
      trendChartInstance.update();
    }
  }

  const ctxDonut = document.getElementById('categoryDonutChart');
  if (ctxDonut && typeof Chart !== 'undefined') {
    const catMap = stats.by_category || {};
    const labels = Object.keys(catMap).length > 0 ? Object.keys(catMap) : ['Router', 'Switch Manageable', 'Access Point', 'Server', 'Storage', 'CCTV', 'IoT Node', 'Firewall', 'PC', 'TV'];
    const dataVals = labels.map(lbl => Number(catMap[lbl]) || 0);
    const colorPalette = ['#EF4444', '#F59E0B', '#06B6D4', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1', '#A855F7'];

    const totalCount = dataVals.reduce((a, b) => a + b, 0);
    const donutTotalEl = document.getElementById('donutTotalCount');
    if (donutTotalEl) donutTotalEl.innerText = totalCount || stats.total || 16;

    if (categoryDonutChartInstance) {
      categoryDonutChartInstance.destroy();
    }

    categoryDonutChartInstance = new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: dataVals,
          backgroundColor: colorPalette.slice(0, labels.length),
          borderColor: '#0D1424',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        cutout: '72%',
        plugins: { legend: { display: false } }
      }
    });

    const listEl = document.getElementById('donutCategoryStatsList');
    if (listEl) {
      listEl.innerHTML = labels.map((lbl, idx) => {
        const cnt = Number(catMap[lbl]) || 0;
        const pct = totalCount > 0 ? ((cnt / totalCount) * 100).toFixed(1) : 0;
        const color = colorPalette[idx % colorPalette.length];
        return `
          <div class="stat-category-item">
            <div class="cat-label-title">
              <span class="sq-dot" style="background:${color};"></span> ${lbl}
            </div>
            <div class="cat-numbers">
              <strong>${cnt}</strong> <small>${pct}%</small>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function renderRecentDevicesTable(devices) {
  const tbody = document.getElementById('dashboardRecentDevices');
  if (!tbody || !devices) return;

  tbody.innerHTML = devices.map(d => {
    const code = d.asset_code || d.assetCode;
    const name = d.asset_name || d.assetName;
    const loc = d.location_name || d.siteFull || 'Head Office';
    const ip = d.ip_address || d.fullIp || '-';
    const rawStat = (d.current_status || d.status || 'unknown').toLowerCase();
    const statBadge = rawStat === 'online'
      ? '<span class="badge-mini-stat online">● Online</span>'
      : (rawStat === 'offline' ? '<span class="badge-mini-stat offline">● Offline</span>' : '<span class="badge-mini-stat warning">● Unknown</span>');

    return `
      <tr onclick="location.href='devices.html'" style="cursor:pointer;">
        <td><strong>${code}</strong><br><small>${name}</small></td>
        <td>${loc}</td>
        <td class="font-mono text-blue">${ip}</td>
        <td>${statBadge}</td>
      </tr>
    `;
  }).join('');
}

// =====================================================================
// 4. DEVICES PAGE TABLE LOGIC (16 ASET TERDAFTAR)
// =====================================================================
let devicesTableInitialized = false;

async function initDevicesTable() {
  const tbody = document.getElementById('devicesTableBody');
  if (!tbody) return;

  if (!devicesTableInitialized) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align:center; padding:30px; color:var(--text-dim);">
          <i class="fa-solid fa-spinner fa-spin"></i> Memuat data 16 aset dari Backend T-AIMS...
        </td>
      </tr>
    `;
  }

  let assetList = MASTER_DEVICES;
  if (typeof getAssets === 'function') {
    const res = await getAssets({ limit: 50 });
    if (res && res.data && res.data.length > 0) {
      assetList = res.data;
      MASTER_DEVICES = assetList;
    }
  }

  tbody.innerHTML = assetList.map((d, idx) => {
    const code = d.asset_code || d.assetCode;
    const name = d.asset_name || d.assetName;
    const cat = d.category || 'General';
    const rawStat = (d.current_status || d.status || 'unknown').toLowerCase();
    const ip = d.ip_address || d.fullIp || '-';
    const loc = d.location_name || d.siteFull || 'Head Office';
    const method = d.monitoring_method || d.monitoringMethod || 'Ping';
    const pic = d.pic_name || d.pic || 'Ananda Dwi Susanti';

    let pillClass = 'status-pill warning';
    let pillText = '● Unknown';
    if (rawStat === 'online') { pillClass = 'status-pill online'; pillText = '● Online'; }
    else if (rawStat === 'offline') { pillClass = 'status-pill offline'; pillText = '● Offline'; }

    return `
      <tr class="row-dev" data-cat="${cat}" data-stat="${rawStat}">
        <td>${idx + 1}</td>
        <td class="font-mono text-cyan">${code}</td>
        <td><strong>${name}</strong></td>
        <td>${cat}</td>
        <td><span class="${pillClass}">${pillText}</span></td>
        <td class="font-mono text-blue">${ip}</td>
        <td>${loc}</td>
        <td>${method}</td>
        <td>${pic}</td>
        <td><button class="btn-detail-white" onclick="openDetailModal('${code}')">Detail</button></td>
      </tr>
    `;
  }).join('');

  devicesTableInitialized = true;
  if (typeof filterDeviceRows === 'function') {
    filterDeviceRows();
  }
}

// =====================================================================
// 5. DETAIL MODAL & AI INSIGHT REFRESH
// =====================================================================
function openDetailModal(code) {
  const d = MASTER_DEVICES.find(x => (x.asset_code === code || x.assetCode === code)) || MASTER_DEVICES[0];
  if (!d) return;

  const codeVal = d.asset_code || d.assetCode || 'N/A';
  const nameVal = d.asset_name || d.assetName || 'N/A';
  const catVal = d.category || 'N/A';
  const ipVal = d.ip_address || d.fullIp || '-';
  const macVal = d.mac_address || d.macAddress || '-';
  const locVal = d.location_name || d.siteFull || 'Head Office';
  const picVal = d.pic_name || d.pic || 'Ananda Dwi Susanti';
  const methodVal = d.monitoring_method || d.monitoringMethod || 'Ping';
  const seenVal = d.last_seen || d.lastSeen || 'Online Baru Saja';
  const rawStat = (d.current_status || d.status || 'unknown').toLowerCase();

  if (document.getElementById("m-code")) document.getElementById("m-code").innerText = codeVal;
  if (document.getElementById("m-name-sub")) document.getElementById("m-name-sub").innerText = `${nameVal} · ${catVal}`;
  if (document.getElementById("m-ip")) document.getElementById("m-ip").innerText = ipVal;
  if (document.getElementById("m-mac")) document.getElementById("m-mac").innerText = macVal;
  if (document.getElementById("m-cat")) document.getElementById("m-cat").innerText = catVal;
  if (document.getElementById("m-loc")) document.getElementById("m-loc").innerText = locVal;
  if (document.getElementById("m-pic")) document.getElementById("m-pic").innerText = picVal;
  if (document.getElementById("m-method")) document.getElementById("m-method").innerText = methodVal;
  if (document.getElementById("m-seen")) document.getElementById("m-seen").innerText = seenVal;

  const elPill = document.getElementById("m-status-pill");
  if (elPill) {
    elPill.className = `tag-status-pill ${rawStat === 'online' ? 'online' : 'offline'}`;
    elPill.innerText = `● ${rawStat.toUpperCase()}`;
  }

  const modalEl = document.getElementById("device-modal");
  if (modalEl) modalEl.style.display = "flex";
}

function closeDetailModal() {
  const modalEl = document.getElementById("device-modal");
  if (modalEl) modalEl.style.display = "none";
}

// =====================================================================
// INTEGRASI AI DASHBOARD & LAPORAN T-AIMS (SPESIFIKASI ARIK & REZA)
// =====================================================================
let aiTimerId = null;

async function initAiRecommendationEngine() {
  await fetchAiRecommendation(false);
  if (aiTimerId) clearInterval(aiTimerId);
  // Auto-refresh interval 5 Menit (300.000 ms) sesuai kesepakatan dengan Arik (n8n cooldown)
  aiTimerId = setInterval(() => {
    fetchAiRecommendation(false);
  }, 5 * 60 * 1000);
}

async function fetchAiRecommendation(force = false) {
  try {
    let data = null;
    if (window.apiService && typeof window.apiService.getAiRecommendation === 'function') {
      data = await window.apiService.getAiRecommendation(force);
    } else {
      data = {
        status: "warning",
        device: "CCTV 1 (offline 5x), WiFi 2 (latency 300ms)",
        recommendation: "CCTV 1 perlu pengecekan kabel LAN dan adaptor daya. WiFi 2 perlu pengecekan interferensi channel frekuensi 2.4 GHz dan pengaturan QoS.",
        updated_at: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      };
    }
    updateAiUi(data);
  } catch (e) {
    console.warn("Gagal fetch AI recommendation:", e);
  }
}

function updateAiUi(data) {
  if (!data) return;
  const status = (data.status || 'warning').toLowerCase();
  const badgeClass = status === 'normal' ? 'badge-normal' : (status === 'critical' ? 'badge-critical' : 'badge-warning');
  const badgeText = status.toUpperCase();

  // Parsing nama perangkat yang bermasalah (dipisah koma)
  const rawDevices = data.device || "";
  const devList = rawDevices ? rawDevices.split(',').map(s => s.trim()).filter(Boolean) : [];
  const issueCountText = devList.length > 0 ? `${devList.length} perangkat perlu perhatian` : "Semua perangkat berstatus normal";

  // 1. UPDATE KARTU DI DASHBOARD (dashboard.html)
  const dashBadge = document.getElementById('aiDashStatusBadge');
  const dashStatusText = document.getElementById('aiDashStatusText');
  const dashIssueText = document.getElementById('aiDashIssueText');
  const dashInsightText = document.getElementById('aiDashInsightText');
  const dashUpdatedAt = document.getElementById('aiDashUpdatedAt');

  if (dashBadge) {
    dashBadge.className = `ai-status-badge ${badgeClass}`;
  }
  if (dashStatusText) dashStatusText.innerText = badgeText;
  if (dashIssueText) dashIssueText.innerText = issueCountText;
  if (dashInsightText) {
    dashInsightText.innerText = data.recommendation ? (data.recommendation.split('.')[0] + '.') : "Sistem operasional T-AIMS dalam kondisi terpantau.";
  }
  if (dashUpdatedAt) dashUpdatedAt.innerText = data.updated_at || "18 Okt 2026 20:00 WIB";

  // 2. UPDATE KOTAK DI LAPORAN (reports.html)
  const repBadge = document.getElementById('aiRepStatusBadge');
  const repStatusText = document.getElementById('aiRepStatusText');
  const repDeviceChips = document.getElementById('aiRepDeviceChips');
  const repRecText = document.getElementById('aiRepRecommendationText');
  const repUpdatedAt = document.getElementById('aiRepUpdatedAt');

  if (repBadge) {
    repBadge.className = `ai-status-badge ${badgeClass}`;
  }
  if (repStatusText) repStatusText.innerText = badgeText;
  if (repRecText) repRecText.innerText = data.recommendation || "Belum ada rekomendasi.";
  if (repUpdatedAt) repUpdatedAt.innerText = data.updated_at || "-";

  if (repDeviceChips) {
    if (devList.length === 0) {
      repDeviceChips.innerHTML = '<span style="color:#10B981; font-size:11px; font-weight:700;"><i class="fa-solid fa-check-circle"></i> Tidak ada anomali</span>';
    } else {
      repDeviceChips.innerHTML = devList.slice(0, 3).map(dev => {
        const icon = dev.toLowerCase().includes('cctv') ? 'fa-video' : (dev.toLowerCase().includes('wifi') ? 'fa-wifi' : 'fa-server');
        return `<span class="ai-chip-device"><i class="fa-solid ${icon}"></i> ${dev}</span>`;
      }).join('');
    }
  }
}

window.fetchAiRecommendation = fetchAiRecommendation;
window.initAiRecommendationEngine = initAiRecommendationEngine;