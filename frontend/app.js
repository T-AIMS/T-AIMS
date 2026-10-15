/**
 * =====================================================================
 * T-AIMS GLOBAL SESSION, MONITORING & INTERACTION SCRIPT
 * =====================================================================
 * Terintegrasi ke Backend Express.js (Port 3000) & Database MySQL (16 Aset)
 * =====================================================================
 */

// 16 MASTER ASET DATABASE MYSQL TAIMS_DB (Fallback & State Global)
let MASTER_DEVICES = (typeof FALLBACK_ASSETS !== 'undefined') ? FALLBACK_ASSETS : [
  { asset_code: "NET-RTR-01", asset_name: "Router Utama MikroTik RB4011", category: "Router", ip_address: "192.168.10.1", mac_address: "D4:CA:6D:11:22:01", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "offline", last_seen: "15 Okt 2026 13:20" },
  { asset_code: "NET-RTR-02", asset_name: "Router Marketing Office", category: "Router", ip_address: "192.168.10.2", mac_address: "00:0C:29:4F:88:02", location_name: "Marketing Office", pic_name: "Ahmad Reza Fahmi", monitoring_method: "Ping", current_status: "offline", last_seen: "15 Okt 2026 13:20" },
  { asset_code: "NET-SWD-01", asset_name: "Distribution Switch D-Link DGS-1210", category: "Switch Manageable", ip_address: "192.168.10.3", mac_address: "14:D6:4D:55:66:03", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "unknown", last_seen: "-" },
  { asset_code: "NET-SWA-01", asset_name: "Access Switch TP-Link TL-SG1024DE", category: "Switch Manageable", ip_address: "192.168.10.4", mac_address: "50:D4:F7:77:88:04", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "unknown", last_seen: "-" },
  { asset_code: "NET-AP-01", asset_name: "Access Point Lab Utama UniFi U6-Lite", category: "Access Point", ip_address: "192.168.10.11", mac_address: "70:A7:41:99:AA:05", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "offline", last_seen: "15 Okt 2026 13:19" },
  { asset_code: "NET-SRV-01", asset_name: "Server Monitoring T-AIMS Ubuntu", category: "Server", ip_address: "192.168.10.20", mac_address: "00:0C:29:DD:EE:07", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "HTTP", current_status: "offline", last_seen: "15 Okt 2026 13:19" },
  { asset_code: "NET-GW-01", asset_name: "Firewall & Gateway pfSense", category: "Firewall", ip_address: "192.168.10.254", mac_address: "00:0C:29:11:33:08", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "offline", last_seen: "15 Okt 2026 13:20" },
  { asset_code: "NET-DNS-01", asset_name: "DNS & DHCP Server Pi-hole", category: "Server", ip_address: "192.168.10.5", mac_address: "B8:27:EB:44:66:09", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "TCP", current_status: "unknown", last_seen: "-" },
  { asset_code: "NET-NAS-01", asset_name: "NAS Backup Synology DS220+", category: "Storage", ip_address: "192.168.10.30", mac_address: "00:11:32:88:99:0A", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "offline", last_seen: "15 Okt 2026 13:19" },
  { asset_code: "IOT-ESP-01", asset_name: "ESP32 Monitoring Panel Surya", category: "IoT Node", ip_address: "192.168.10.101", mac_address: "24:6F:28:AA:01:0B", location_name: "Head Office", pic_name: "Ilvina Muvarika", monitoring_method: "Heartbeat", current_status: "offline", last_seen: "13 Okt 2026 23:29" },
  { asset_code: "SEC-CCTV-01", asset_name: "CCTV Head Office", category: "CCTV", ip_address: "192.168.10.31", mac_address: "A4:C1:38:2B:4C:01", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping + HTTP", current_status: "offline", last_seen: "15 Okt 2026 13:20" },
  { asset_code: "SEC-CCTV-02", asset_name: "CCTV Marketing Office", category: "CCTV", ip_address: "192.168.10.32", mac_address: "A4:C1:38:2B:4C:02", location_name: "Marketing Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping + HTTP", current_status: "unknown", last_seen: "-" },
  { asset_code: "DISP-TV-01", asset_name: "Smart TV Xiaomi Head Office", category: "TV", ip_address: "192.168.10.40", mac_address: "F8:8F:80:4D:6E:01", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "offline", last_seen: "15 Okt 2026 13:20" },
  { asset_code: "PC-WS-01", asset_name: "PC Head Office 01", category: "PC", ip_address: "192.168.10.41", mac_address: "00:E0:4C:3C:5D:01", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "offline", last_seen: "15 Okt 2026 13:20" },
  { asset_code: "PC-WS-02", asset_name: "PC Head Office 02", category: "PC", ip_address: "192.168.10.42", mac_address: "00:E0:4C:3C:5D:02", location_name: "Head Office", pic_name: "Ananda Dwi Susanti", monitoring_method: "Ping", current_status: "unknown", last_seen: "-" },
  { asset_code: "IOT-RPI-01", asset_name: "Raspberry Pi Smart Home", category: "IoT Node", ip_address: "192.168.10.102", mac_address: "B8:27:EB:6F:80:02", location_name: "Head Office", pic_name: "Ilvina Muvarika", monitoring_method: "Heartbeat", current_status: "offline", last_seen: "13 Okt 2026 23:52" }
];

// Inisialisasi saat Dokumen Selesai Dimuat
document.addEventListener("DOMContentLoaded", async () => {
  initGlobalSession();
  initLiveClock();

  // 1. Jika di Dashboard: Muat statistik dan chart realtime
  if (document.getElementById('kpi-total-devices') || document.getElementById('categoryDonutChart')) {
    await initDashboard();
    // Auto-polling live data setiap 5 detik agar responsif terhadap perubahan status
    setInterval(initDashboard, 5000);
  }

  // 2. Jika di Halaman Devices: Muat tabel 16 aset realtime
  if (document.getElementById('devicesTableBody')) {
    await initDevicesTable();
    // Auto-polling data tabel setiap 5 detik
    setInterval(initDevicesTable, 5000);
  }
});

// =====================================================================
// 1. GLOBAL SESSION & PROFILE SYNC
// =====================================================================
function initGlobalSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  if (roleParam) {
    localStorage.setItem('taims_user_role', roleParam);
  }

  const activeRole = localStorage.getItem('taims_user_role') || 'admin';

  const nameEls = document.querySelectorAll('#topbarRoleName, .profile-meta-text strong');
  const subEls = document.querySelectorAll('#topbarRoleSub, .profile-meta-text small');
  const avatarEls = document.querySelectorAll('#topbarAvatar, .profile-avatar-circle');

  nameEls.forEach(el => {
    if (activeRole === 'admin') el.innerText = "Ahmad Reza Fahmi";
    else el.innerText = "Tamu / Viewer";
  });

  subEls.forEach(el => {
    if (activeRole === 'admin') el.innerText = "Administrator";
    else el.innerText = "Viewer (Hanya Lihat)";
  });

  avatarEls.forEach(el => {
    if (activeRole === 'admin') {
      el.innerHTML = '<i class="fa-solid fa-shield-halved"></i>';
      el.style.background = 'linear-gradient(135deg, #10B981, #047857)';
    } else {
      el.innerHTML = '<i class="fa-regular fa-user"></i>';
      el.style.background = 'linear-gradient(135deg, #EF4444, #991B1B)';
    }
  });
}

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

    const elD = document.getElementById("dt-live-date");
    const elT = document.getElementById("dt-live-time");
    const elMT = document.getElementById("m-live-time");
    if (elD) elD.innerText = dStr;
    if (elT) elT.innerText = tStr;
    if (elMT) elMT.innerText = tStr;
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
  // Panggil apiService untuk ambil stats
  let stats = null;
  if (typeof getDashboardStats === 'function') {
    stats = await getDashboardStats();
  }

  // Jika gagal, buat fallback stats dari MASTER_DEVICES
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

  // Bind ke KPI Cards
  const total = Number(stats.total_devices) || 16;
  const online = Number(stats.online) || 0;
  const offline = Number(stats.offline) || 0;
  const unknown = Number(stats.unknown) || 0;
  const maintenance = Number(stats.maintenance) || 0;
  const warning = unknown + maintenance;
  const uptime = Number(stats.availability_percent) || 0;

  const pctOnline = total > 0 ? ((online / total) * 100).toFixed(1) : "0";
  const pctOffline = total > 0 ? ((offline / total) * 100).toFixed(1) : "0";
  const pctWarning = total > 0 ? ((warning / total) * 100).toFixed(1) : "0";

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

  // Update progress bars & sub-label
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
  if (subWarn) subWarn.innerHTML = `<strong>${pctWarning}%</strong> belum termonitor`;

  const barUp = document.getElementById('kpi-bar-uptime');
  if (barUp) barUp.style.width = `${uptime}%`;

  // Render Charts
  initDashboardCharts(stats);

  // Ambil list aset & update recent table
  if (typeof getAssets === 'function') {
    const assetsRes = await getAssets({ limit: 50 });
    if (assetsRes && assetsRes.data) {
      MASTER_DEVICES = assetsRes.data;
      renderRecentDevicesTable(assetsRes.data.slice(0, 5));
    }
  } else {
    renderRecentDevicesTable(MASTER_DEVICES.slice(0, 5));
  }
}

function initDashboardCharts(stats) {
  // 1. Trend Chart
  const ctxTrend = document.getElementById('trendChart');
  if (ctxTrend && typeof Chart !== 'undefined' && !trendChartInstance) {
    trendChartInstance = new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: ['10 Okt', '11 Okt', '12 Okt', '13 Okt', '14 Okt', '15 Okt', '16 Okt'],
        datasets: [
          { label: 'Online', data: [5, 6, 6, 7, 7, 6, stats.online || 5], borderColor: '#10B981', borderWidth: 2, tension: 0.3, pointRadius: 3 },
          { label: 'Offline', data: [2, 3, 3, 4, 5, 5, stats.offline || 6], borderColor: '#EF4444', borderWidth: 1.5, borderDash: [3, 3], pointRadius: 2, tension: 0.3 },
          { label: 'Unknown', data: [9, 7, 7, 5, 4, 5, (stats.unknown || 5)], borderColor: '#F59E0B', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 2, tension: 0.3 }
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
  }

  // 2. Category Donut Chart
  const ctxDonut = document.getElementById('categoryDonutChart');
  if (ctxDonut && typeof Chart !== 'undefined') {
    const catMap = stats.by_category || {};
    const labels = Object.keys(catMap).length > 0 ? Object.keys(catMap) : ['Router', 'Switch Manageable', 'Access Point', 'Server', 'Storage', 'CCTV', 'IoT Node', 'Firewall', 'PC', 'TV'];
    const dataVals = labels.map(lbl => catMap[lbl] || 1);
    const colorPalette = ['#EF4444', '#F59E0B', '#06B6D4', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1', '#A855F7'];

    const totalCount = dataVals.reduce((a, b) => a + b, 0);
    const donutTotalEl = document.getElementById('donutTotalCount');
    if (donutTotalEl) donutTotalEl.innerText = totalCount;

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

    // Render Legenda Kategori
    const listEl = document.getElementById('donutCategoryStatsList');
    if (listEl) {
      listEl.innerHTML = labels.map((lbl, idx) => {
        const cnt = catMap[lbl] || 1;
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

    let pillClass = 'status-pill unknown';
    let pillText = '● Unknown';
    if (rawStat === 'online') { pillClass = 'status-pill online'; pillText = '● Online'; }
    else if (rawStat === 'offline') { pillClass = 'status-pill offline'; pillText = '● Offline'; }
    else if (rawStat === 'warning') { pillClass = 'status-pill warning'; pillText = '● Warning'; }

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
// 5. DETAIL MODAL INTERACTION
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

  const elCode = document.getElementById("m-code");
  const elSub = document.getElementById("m-name-sub");
  const elPill = document.getElementById("m-status-pill");
  const elIp = document.getElementById("m-ip");
  const elMac = document.getElementById("m-mac");
  const elCat = document.getElementById("m-cat");
  const elLoc = document.getElementById("m-loc");
  const elPic = document.getElementById("m-pic");
  const elMethod = document.getElementById("m-method");
  const elSeen = document.getElementById("m-seen");

  if (elCode) elCode.innerText = codeVal;
  if (elSub) elSub.innerText = `${nameVal} · ${catVal}`;
  if (elIp) elIp.innerText = ipVal;
  if (elMac) elMac.innerText = macVal;
  if (elCat) elCat.innerText = catVal;
  if (elLoc) elLoc.innerText = locVal;
  if (elPic) elPic.innerText = picVal;
  if (elMethod) elMethod.innerText = methodVal;
  if (elSeen) elSeen.innerText = seenVal;

  if (elPill) {
    elPill.className = `tag-status-pill ${rawStat}`;
    elPill.innerText = `● ${rawStat.toUpperCase()}`;
  }

  const modalEl = document.getElementById("device-modal");
  if (modalEl) modalEl.style.display = "flex";
}

function closeDetailModal() {
  const modalEl = document.getElementById("device-modal");
  if (modalEl) modalEl.style.display = "none";
}

window.addEventListener("click", (e) => {
  const modalEl = document.getElementById("device-modal");
  if (modalEl && e.target === modalEl) closeDetailModal();
});
