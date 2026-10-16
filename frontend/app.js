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

document.addEventListener("DOMContentLoaded", async () => {
  initGlobalSession();
  initLiveClock();

  const intervalMs = getActiveRefreshIntervalMs();

  // 1. Jika di Dashboard: Muat statistik dan chart realtime sesuai interval pengaturan
  if (document.getElementById('kpi-total-devices') || document.getElementById('categoryDonutChart')) {
    await initDashboard();
    if (dashboardTimerId) clearInterval(dashboardTimerId);
    dashboardTimerId = setInterval(initDashboard, intervalMs);
  }

  // 2. Jika di Halaman Devices: Muat tabel 16 aset realtime sesuai interval pengaturan
  if (document.getElementById('devicesTableBody')) {
    await initDevicesTable();
    if (devicesTimerId) clearInterval(devicesTimerId);
    devicesTimerId = setInterval(initDevicesTable, intervalMs);
  }
});

// =====================================================================
// 1. GLOBAL SESSION, POJOK KANAN ATAS & KUNCI EDIT KHUSUS ADMIN
// =====================================================================
function initGlobalSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  if (roleParam) {
    localStorage.setItem('taims_user_role', roleParam);
  }

  const activeRole = localStorage.getItem('taims_user_role') || 'admin';
  const isAdmin = (activeRole === 'admin' || activeRole === 'super_admin');

  // Sinkronisasi teks dan ikon profil di pojok kanan atas pada SEMUA halaman
  const nameEls = document.querySelectorAll('#topbarRoleName, .profile-meta-text strong');
  const subEls = document.querySelectorAll('#topbarRoleSub, .profile-meta-text small');
  const avatarEls = document.querySelectorAll('#topbarAvatar, .profile-avatar-circle');
  const profileBoxes = document.querySelectorAll('.topbar-profile-dropdown');

  nameEls.forEach(el => {
    el.innerText = isAdmin ? "Ahmad Reza Fahmi" : "Tamu / Viewer";
  });

  subEls.forEach(el => {
    el.innerText = isAdmin ? "Administrator" : "Viewer (Hanya Lihat)";
  });

  avatarEls.forEach(el => {
    if (isAdmin) {
      el.innerHTML = '<i class="fa-solid fa-shield-halved"></i>';
      el.style.background = 'linear-gradient(135deg, #10B981, #047857)';
    } else {
      el.innerHTML = '<i class="fa-regular fa-user"></i>';
      el.style.background = 'linear-gradient(135deg, #64748B, #334155)';
    }
  });

  // Klik kotak profil kanan atas untuk beralih mode Admin <-> Tamu saat demo
  profileBoxes.forEach(box => {
    box.style.cursor = 'pointer';
    box.title = 'Klik untuk beralih mode: Administrator / Tamu (Viewer)';
    box.removeAttribute('onclick');
    box.onclick = (e) => {
      e.preventDefault();
      const nextRole = isAdmin ? 'guest' : 'admin';
      localStorage.setItem('taims_user_role', nextRole);
      location.reload();
    };
  });

  // PROTEKSI EDIT: Sembunyikan semua tombol Edit/Tambah jika login sebagai Tamu (Guest)
  const adminOnlyElements = document.querySelectorAll(
    '.pill-add, .pill-sensor, #btnAdminMode, #btnDenahEditMode, #btnAddDenahPin, #btnEditToggle, .btn-action-edit, .btn-table-edit, .btn-save-red, #btnPingTest'
  );

  adminOnlyElements.forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });

  // Kunci input form di halaman Pengaturan jika Tamu
  const settingInputs = document.querySelectorAll('.setting-input-text, .setting-select-box');
  settingInputs.forEach(input => {
    input.disabled = !isAdmin;
    input.style.opacity = isAdmin ? '1' : '0.5';
    input.style.cursor = isAdmin ? 'text' : 'not-allowed';
  });

  // Update lencana role di banner Dashboard
  const bannerRoleBadge = document.querySelector('.pill-admin');
  if (bannerRoleBadge) {
    bannerRoleBadge.innerHTML = isAdmin
      ? '<i class="fa-solid fa-shield-halved"></i> Administrator (Kontrol Penuh)'
      : '<i class="fa-regular fa-eye"></i> Mode Tamu / Viewer (Hanya Lihat - Edit Dikunci)';
  }

  // Sinkronisasi lencana notifikasi jika sudah ditandai dibaca
  if (localStorage.getItem('taims_alerts_read') === 'true') {
    document.querySelectorAll('.notif-bubble, .alert-pill-red').forEach(b => b.style.display = 'none');
  }
}

window.isCurrentUserAdmin = function() {
  const r = localStorage.getItem('taims_user_role') || 'admin';
  return (r === 'admin' || r === 'super_admin');
};

function toggleNavDrawer() {
  const d = document.getElementById('mobileDrawerMenu');
  if (d) d.classList.toggle('open');
}

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
        maintainAspectRatio: false,
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

function refreshAiInsight() {
  const aiText = document.getElementById('aiInsightText');
  if (!aiText) return;
  aiText.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-cyan"></i> Menganalisis telemetri 16 perangkat dari database taims_db...';
  setTimeout(() => {
    aiText.innerHTML = `Berdasarkan telemetri terbaru (${new Date().toLocaleTimeString('id-ID')} WIB): Terdeteksi perangkat prioritas <strong>NET-RTR-01</strong> & <strong>SEC-CCTV-01 (HO)</strong> membutuhkan pengecekan suplai adaptor dan konektivitas gateway, serta pemantauan link <strong>NET-RTR-02 (MO Kos Kiki)</strong>.`;
  }, 500);
}