/**
 * ==============================================================================
 * T-AIMS | Teknolab Asset & Infrastructure Monitoring System
 * Script Aplikasi Frontend: Dashboard Cyber Dark HUD, Chart.js, Leaflet GIS,
 * Integrasi 16 Perangkat MySQL Database & Asisten AI Rekomendasi
 * ==============================================================================
 */

// 16 Data Resmi Perangkat Teknolab (Database MySQL & Lab Blitar)
const DEFAULT_16_DEVICES = [
  { id: 'DEV-001', code: 'NET-SRV-01', name: 'SRV-DC-01 (T-AIMS & Pi-hole)', category: 'Server', location: 'Ruang Server HO - Jl. Cibodas No. 03', lat: -8.07385, lng: 112.17350, ip: '192.168.10.20', mac: '00:1B:44:11:3A:B7', status: 'online', lastSeen: '24 Apr 2024 14:31', ping: '2 ms', uptime: '99.8%', method: 'Ping & SNMP', pic: 'Ahmad Reza Fahmi', installDate: '12 Jan 2024' },
  { id: 'DEV-002', code: 'NET-RTR-01', name: 'SW-Core-01 & MikroTik RB4011', category: 'Network Device', location: 'Area Lab Utama HO - Jl. Cibodas', lat: -8.07375, lng: 112.17345, ip: '192.168.10.1', mac: '00:1B:44:22:8C:F1', status: 'online', lastSeen: '24 Apr 2024 14:32', ping: '1 ms', uptime: '99.9%', method: 'Ping & SNMP', pic: 'Ananda Dwi Susanti', installDate: '15 Jan 2024' },
  { id: 'DEV-003', code: 'SEC-CCTV-01', name: 'CCTV-HO-01 Gerbang Depan', category: 'CCTV & Security', location: 'Gerbang Utama HO - Jl. Cibodas', lat: -8.07360, lng: 112.17320, ip: '192.168.10.31', mac: '00:1B:44:55:09:A1', status: 'offline', lastSeen: '24 Apr 2024 11:24', ping: 'Timeout', uptime: '89.2%', method: 'Ping (ICMP)', pic: 'Ananda Dwi Susanti', installDate: '20 Jan 2024' },
  { id: 'DEV-004', code: 'NET-AP-01', name: 'AP-LB-01 (UniFi 6-Lite)', category: 'Network Device', location: 'Koridor Lab HO - Jl. Cibodas', lat: -8.07380, lng: 112.17330, ip: '192.168.10.11', mac: '00:1B:44:66:33:DE', status: 'online', lastSeen: '24 Apr 2024 14:12', ping: '4 ms', uptime: '99.1%', method: 'Ping (ICMP)', pic: 'Ananda Dwi Susanti', installDate: '18 Jan 2024' },
  { id: 'DEV-005', code: 'SRV-APP-01', name: 'SRV-APP-02 (API Teknolab)', category: 'Server', location: 'Data Center Rack 02 HO', lat: -8.07385, lng: 112.17355, ip: '192.168.10.5', mac: '00:1B:44:77:88:99', status: 'online', lastSeen: '24 Apr 2024 14:30', ping: '3 ms', uptime: '99.7%', method: 'Ping & HTTP', pic: 'Ahmad Reza Fahmi', installDate: '22 Jan 2024' },
  { id: 'DEV-006', code: 'NET-RTR-02', name: 'Router-MO-02 (Marketing Office)', category: 'Network Device', location: 'Ruang Marketing - Jl. Ciliwung MO', lat: -8.08630, lng: 112.16450, ip: '192.168.10.2', mac: '00:1B:44:22:9D:02', status: 'warning', lastSeen: '24 Apr 2024 14:28', ping: '68 ms', uptime: '96.4%', method: 'Ping & SNMP', pic: 'Ahmad Reza Fahmi', installDate: '16 Jan 2024' },
  { id: 'DEV-007', code: 'IOT-ESP-01', name: 'ESP32 Panel Surya & Inverter', category: 'IoT Sensor', location: 'Ruang Server HO - Jl. Cibodas', lat: -8.07390, lng: 112.17340, ip: '192.168.10.101', mac: 'A4:CF:12:88:31:01', status: 'online', lastSeen: '24 Apr 2024 14:32', ping: '8 ms', uptime: '98.9%', method: 'HTTP / API', pic: 'Ilvina Muvarika', installDate: '01 Feb 2024' },
  { id: 'DEV-008', code: 'IOT-ENV-02', name: 'ESP32 Sensor Suhu & AC', category: 'IoT Sensor', location: 'Ruang Server Rack HO', lat: -8.07390, lng: 112.17345, ip: '192.168.10.102', mac: 'A4:CF:12:88:31:02', status: 'online', lastSeen: '24 Apr 2024 14:31', ping: '9 ms', uptime: '98.5%', method: 'HTTP / API', pic: 'Ilvina Muvarika', installDate: '01 Feb 2024' },
  { id: 'DEV-009', code: 'SEC-CCTV-02', name: 'CCTV-MO-02 (Lobi Depan)', category: 'CCTV & Security', location: 'Lobi Depan MO - Jl. Ciliwung', lat: -8.08620, lng: 112.16440, ip: '192.168.10.32', mac: '00:1B:44:55:09:A2', status: 'online', lastSeen: '24 Apr 2024 14:29', ping: '12 ms', uptime: '99.0%', method: 'Ping (ICMP)', pic: 'Ananda Dwi Susanti', installDate: '20 Jan 2024' },
  { id: 'DEV-010', code: 'PC-WS-01', name: 'PC-Lead-Dika (Workstation)', category: 'Workstation', location: 'Ruang Kerja 1 HO', lat: -8.07370, lng: 112.17330, ip: '192.168.10.41', mac: '00:1B:44:88:01:41', status: 'online', lastSeen: '24 Apr 2024 14:32', ping: '2 ms', uptime: '99.5%', method: 'Ping (ICMP)', pic: 'Dika Yoga Pratama', installDate: '10 Jan 2024' },
  { id: 'DEV-011', code: 'PC-WS-02', name: 'PC-Admin-Ananda (Workstation)', category: 'Workstation', location: 'Ruang Admin HO', lat: -8.07380, lng: 112.17335, ip: '192.168.10.42', mac: '00:1B:44:88:01:42', status: 'online', lastSeen: '24 Apr 2024 14:32', ping: '2 ms', uptime: '99.5%', method: 'Ping (ICMP)', pic: 'Ananda Dwi Susanti', installDate: '10 Jan 2024' },
  { id: 'DEV-012', code: 'PC-DEV-03', name: 'PC-Dev-Budi (Lab AI MO)', category: 'Workstation', location: 'Ruang Lab AI MO - Jl. Ciliwung', lat: -8.08640, lng: 112.16460, ip: '192.168.10.40', mac: '00:1B:44:88:01:40', status: 'online', lastSeen: '24 Apr 2024 14:25', ping: '14 ms', uptime: '98.0%', method: 'Ping (ICMP)', pic: 'Budi Santoso', installDate: '12 Jan 2024' },
  { id: 'DEV-013', code: 'SRV-DB-01', name: 'SRV-DB-01 (MySQL Master)', category: 'Server', location: 'Ruang Server HO - Jl. Cibodas', lat: -8.07385, lng: 112.17350, ip: '192.168.10.30', mac: '00:1B:44:33:44:55', status: 'online', lastSeen: '24 Apr 2024 14:32', ping: '1 ms', uptime: '99.9%', method: 'Ping & Port', pic: 'Ahmad Reza Fahmi', installDate: '14 Jan 2024' },
  { id: 'DEV-014', code: 'SRV-DC-02', name: 'SRV-NAS-02 (Storage Backup)', category: 'Server', location: 'Ruang Server HO - Jl. Cibodas', lat: -8.07385, lng: 112.17360, ip: '192.168.10.254', mac: '00:1B:44:FE:DC:BA', status: 'online', lastSeen: '24 Apr 2024 14:30', ping: '2 ms', uptime: '99.4%', method: 'Ping & SNMP', pic: 'Ahmad Reza Fahmi', installDate: '14 Jan 2024' },
  { id: 'DEV-015', code: 'SW-CORE-01', name: 'SW-Managed-Core 24P', category: 'Network Device', location: 'Rack Panel HO - Jl. Cibodas', lat: -8.07375, lng: 112.17345, ip: '192.168.10.4', mac: '00:1B:44:CC:DD:04', status: 'online', lastSeen: '24 Apr 2024 14:32', ping: '1 ms', uptime: '99.9%', method: 'Ping & SNMP', pic: 'Ananda Dwi Susanti', installDate: '15 Jan 2024' },
  { id: 'DEV-016', code: 'WIFI-MO-03', name: 'WIFI-MO-Gateway (Sub-Router)', category: 'Lainnya', location: 'Ruang Divisi MO - Jl. Ciliwung', lat: -8.08640, lng: 112.16460, ip: '192.168.10.3', mac: '00:1B:44:99:88:03', status: 'online', lastSeen: '24 Apr 2024 14:26', ping: '15 ms', uptime: '97.8%', method: 'Ping (ICMP)', pic: 'Budi Santoso', installDate: '16 Jan 2024' }
];

// Riwayat Gangguan / Peringatan (Mockup Feed)
const DEFAULT_ALERTS = [
  { id: 1, time: '14:22', title: 'Perangkat CCTV-HO-01 tidak merespons', location: 'Gerbang Utama HO - Jl. Cibodas', level: 'kritis' },
  { id: 2, time: '13:48', title: 'Latency Router-MO-02 meningkat (68 ms)', location: 'Marketing Office - Jl. Ciliwung', level: 'peringatan' },
  { id: 3, time: '11:24', title: 'Koneksi link backup fiber sempat terputus', location: 'Lab Jaringan HO', level: 'kritis' },
  { id: 4, time: '10:17', title: 'Suhu sensor DHT22 server mendekati 28°C', location: 'Ruang Server Rack HO', level: 'peringatan' },
  { id: 5, time: '09:03', title: 'Daya baterai UPS cadangan uji coba 88%', location: 'Panel Listrik HO', level: 'peringatan' }
];

const APP_STATE = {
  devices: [...DEFAULT_16_DEVICES],
  alerts: [...DEFAULT_ALERTS],
  charts: {
    trendChart: null,
    categoryDonut: null
  },
  homeMap: null
};

// ==============================================================================
// INISIALISASI DOM
// ==============================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initClock();
  initGlobalAuthProfile();
  initMobileDrawerEnhancement();

  // Jika berada di Dashboard
  if (document.getElementById('trendChart') || document.getElementById('categoryDonutChart')) {
    initCharts();
    initBlitarMaps();
    renderHomeDevicesTable();
    renderAlerts();
    await loadAiInsight();
  }

  // Jika berada di Halaman Devices (12 field table)
  if (document.getElementById('devicesTableBody')) {
    if (typeof initDevicesTable === 'function') {
      initDevicesTable();
    }
  }
});

// ==============================================================================
// CLOCK REALTIME WIB
// ==============================================================================
function initClock() {
  function tick() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    const dayName = days[now.getDay()];
    const dateNum = String(now.getDate()).padStart(2, '0');
    const monthName = months[now.getMonth()];
    const yearNum = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');

    const dateEl = document.getElementById('live-date');
    const timeEl = document.getElementById('live-time');

    if (dateEl) dateEl.innerText = `${dayName}, ${dateNum} ${monthName} ${yearNum}`;
    if (timeEl) timeEl.innerText = `${hours}:${mins} WIB`;
  }
  tick();
  setInterval(tick, 1000);
}

// ==============================================================================
// GLOBAL AUTH PROFILE & KEMBALI KE LOGIN
// ==============================================================================
function initGlobalAuthProfile() {
  const role = localStorage.getItem('taims_user_role') || 'admin';
  const name = localStorage.getItem('taims_user_name') || 'Ahmad Rizki';

  const nameEl = document.getElementById('topbar-user-name');
  const roleEl = document.getElementById('topbar-user-role');
  const dropNameEl = document.getElementById('dropdown-user-name');
  const dropRoleEl = document.getElementById('dropdown-user-role');
  const badgeEl = document.getElementById('banner-role-badge');

  const displayRole = (role === 'guest') ? 'Tamu / Pengamat' : ((role === 'operator') ? 'Teknisi Lab' : 'Administrator');

  if (nameEl) nameEl.innerText = name;
  if (roleEl) roleEl.innerText = displayRole;
  if (dropNameEl) dropNameEl.innerText = name;
  if (dropRoleEl) dropRoleEl.innerText = displayRole;

  if (badgeEl) {
    if (role === 'guest') {
      badgeEl.innerHTML = '<i class="fa-solid fa-eye text-cyan"></i> Mode Tamu (Hanya Lihat)';
    } else {
      badgeEl.innerHTML = '<i class="fa-solid fa-shield-halved text-yellow"></i> Administrator (Kontrol Penuh)';
    }
  }
}

function toggleUserMenu() {
  const menu = document.getElementById('user-menu-dropdown');
  if (menu) menu.classList.toggle('hidden');
}

function toggleNotifDropdown() {
  const notif = document.getElementById('notif-dropdown');
  if (notif) notif.classList.toggle('hidden');
}

// Tutup dropdown saat klik di luar
document.addEventListener('click', (e) => {
  const userPill = document.querySelector('.user-profile-pill');
  const userDropdown = document.getElementById('user-menu-dropdown');
  if (userDropdown && userPill && !userPill.contains(e.target) && !userDropdown.contains(e.target)) {
    userDropdown.classList.add('hidden');
  }

  const notifBell = document.getElementById('notif-bell-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifDropdown && notifBell && !notifBell.contains(e.target) && !notifDropdown.contains(e.target)) {
    notifDropdown.classList.add('hidden');
  }
});

// ==============================================================================
// MOBILE RESPONSIVE DRAWER TOGGLE (HAMBURGER BUTTON ☰)
// ==============================================================================
function toggleMobileSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  if (!sidebar) return;

  sidebar.classList.toggle('mobile-open');

  let backdrop = document.getElementById('sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sidebar-backdrop';
    backdrop.className = 'sidebar-backdrop';
    backdrop.onclick = toggleMobileSidebar;
    document.body.appendChild(backdrop);
  }

  if (sidebar.classList.contains('mobile-open')) {
    backdrop.classList.add('active');
  } else {
    backdrop.classList.remove('active');
  }
}

function initMobileDrawerEnhancement() {
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
    }
  });
}

// ==============================================================================
// CHARTS: TREN STATUS PERANGKAT & DISTRIBUSI KATEGORI (16 PERANGKAT)
// ==============================================================================
function initCharts() {
  // 1. Line Chart: Tren Status Perangkat (Canvas Height 215px)
  const trendCtx = document.getElementById('trendChart');
  if (trendCtx && typeof Chart !== 'undefined') {
    if (APP_STATE.charts.trendChart) APP_STATE.charts.trendChart.destroy();

    APP_STATE.charts.trendChart = new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: ['25 Mar', '28 Mar', '31 Mar', '03 Apr', '06 Apr', '09 Apr', '12 Apr', '15 Apr', '18 Apr', '21 Apr', '24 Apr'],
        datasets: [
          {
            label: 'Online',
            data: [13, 13, 14, 14, 14, 13, 14, 14, 14, 14, 14],
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderWidth: 2,
            tension: 0.35,
            fill: true,
            pointBackgroundColor: '#10B981',
            pointRadius: 2.5
          },
          {
            label: 'Offline',
            data: [2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
            borderColor: '#EF4444',
            backgroundColor: 'transparent',
            borderWidth: 1.8,
            tension: 0.35,
            borderDash: [3, 3],
            pointBackgroundColor: '#EF4444',
            pointRadius: 2.5
          },
          {
            label: 'Peringatan',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            borderColor: '#F59E0B',
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
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748B', font: { size: 9 } } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748B', font: { size: 9 }, stepSize: 3 }, min: 0, max: 18 }
        }
      }
    });
  }

  // 2. Donut Chart: Distribusi Kategori (Cutout 72%, Center: 16 Perangkat)
  const donutCtx = document.getElementById('categoryDonutChart');
  if (donutCtx && typeof Chart !== 'undefined') {
    if (APP_STATE.charts.categoryDonut) APP_STATE.charts.categoryDonut.destroy();

    APP_STATE.charts.categoryDonut = new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ['Server', 'Network Device', 'CCTV & Security', 'IoT Sensor', 'Workstation', 'Lainnya'],
        datasets: [{
          data: [4, 4, 2, 2, 3, 1],
          backgroundColor: ['#EF4444', '#F59E0B', '#0284C7', '#10B981', '#8B5CF6', '#06B6D4'],
          borderWidth: 2,
          borderColor: '#0D1629'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: { legend: { display: false } }
      }
    });
  }
}

function updateTrendChartTimeframe(val) {
  if (!APP_STATE.charts.trendChart) return;
  const chart = APP_STATE.charts.trendChart;

  if (val === '7') {
    chart.data.labels = ['18 Apr', '19 Apr', '20 Apr', '21 Apr', '22 Apr', '23 Apr', '24 Apr'];
    chart.data.datasets[0].data = [14, 14, 13, 14, 14, 14, 14];
    chart.data.datasets[1].data = [1, 1, 2, 1, 1, 1, 1];
    chart.data.datasets[2].data = [1, 1, 1, 1, 1, 1, 1];
  } else if (val === '1') {
    chart.data.labels = ['00:00', '04:00', '08:00', '12:00', '14:00', 'Sekarang'];
    chart.data.datasets[0].data = [14, 14, 14, 14, 14, 14];
    chart.data.datasets[1].data = [1, 1, 1, 1, 1, 1];
    chart.data.datasets[2].data = [1, 1, 1, 1, 1, 1];
  } else {
    chart.data.labels = ['25 Mar', '28 Mar', '31 Mar', '03 Apr', '06 Apr', '09 Apr', '12 Apr', '15 Apr', '18 Apr', '21 Apr', '24 Apr'];
    chart.data.datasets[0].data = [13, 13, 14, 14, 14, 13, 14, 14, 14, 14, 14];
    chart.data.datasets[1].data = [2, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1];
    chart.data.datasets[2].data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  }
  chart.update();
}

// ==============================================================================
// LEAFLET GIS PETA LOKASI INFRASTRUKTUR (BLITAR HO & MO)
// ==============================================================================
function initBlitarMaps() {
  const homeEl = document.getElementById('home-blitar-map');
  if (!homeEl || typeof L === 'undefined' || APP_STATE.homeMap) return;

  try {
    APP_STATE.homeMap = L.map('home-blitar-map', {
      center: [-8.0800, 112.1690],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(APP_STATE.homeMap);

    L.control.zoom({ position: 'bottomright' }).addTo(APP_STATE.homeMap);

    // Marker Head Office (Jl. Cibodas)
    const hoIcon = L.divIcon({
      html: `<div class="blitar-marker-pin online"><div class="pin-radar"></div><div class="pin-core"></div></div>`,
      className: 'custom-blitar-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const hoMarker = L.marker([-8.07385, 112.17350], { icon: hoIcon }).addTo(APP_STATE.homeMap);
    hoMarker.on('click', () => {
      selectMapNode('Pusat Data Teknolab Blitar (HO)', '192.168.10.20 (Jl. Cibodas)', '-8.0738, 112.1735', '10 perangkat • 90% ONLINE');
    });

    // Marker Marketing Office (Jl. Ciliwung)
    const moIcon = L.divIcon({
      html: `<div class="blitar-marker-pin warning"><div class="pin-radar"></div><div class="pin-core"></div></div>`,
      className: 'custom-blitar-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const moMarker = L.marker([-8.08630, 112.16450], { icon: moIcon }).addTo(APP_STATE.homeMap);
    moMarker.on('click', () => {
      selectMapNode('Kantor Marketing Teknolab (MO)', '192.168.10.2 (Jl. Ciliwung)', '-8.0863, 112.1645', '6 perangkat • PERINGATAN PING');
    });

  } catch (err) {
    console.warn("Leaflet Map init error:", err);
  }
}

function selectMapNode(title, ipText, coord, statUp) {
  const nameEl = document.getElementById('callout-node-name');
  const coordEl = document.getElementById('callout-node-coord');
  const statDevEl = document.getElementById('callout-stat-dev');
  const statUpEl = document.getElementById('callout-stat-up');

  if (nameEl) nameEl.innerHTML = `<i class="fa-solid fa-building"></i> ${title}`;
  if (coordEl) coordEl.innerText = coord;
  if (statDevEl) statDevEl.innerText = ipText;
  if (statUpEl) statUpEl.innerText = statUp;
}

function resetHomeBlitarView() {
  if (APP_STATE.homeMap) {
    APP_STATE.homeMap.setView([-8.0800, 112.1690], 14);
    selectMapNode('Pusat Data Teknolab Blitar (HO)', '192.168.10.20 (Jl. Cibodas)', '-8.0738, 112.1735', '10 perangkat • 90% ONLINE');
  }
}

// ==============================================================================
// TABEL STATUS PERANGKAT TERBARU DI DASHBOARD
// ==============================================================================
function renderHomeDevicesTable(filteredList = null) {
  const tbody = document.getElementById('home-devices-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  const list = filteredList || APP_STATE.devices.slice(0, 5);

  list.forEach(dev => {
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.onclick = () => window.location.href = 'devices.html';

    let icon = 'fa-server';
    if (dev.category === 'Network Device') icon = 'fa-network-wired';
    else if (dev.category === 'CCTV & Security') icon = 'fa-video';
    else if (dev.category === 'IoT Sensor') icon = 'fa-microchip';
    else if (dev.category === 'Workstation') icon = 'fa-desktop';

    let badge = '';
    if (dev.status === 'online') {
      badge = '<span class="status-pill online"><span class="dot green"></span> Online</span>';
    } else if (dev.status === 'warning') {
      badge = '<span class="status-pill warning"><span class="dot yellow"></span> Peringatan</span>';
    } else {
      badge = '<span class="status-pill offline"><span class="dot red"></span> Offline</span>';
    }

    tr.innerHTML = `
      <td>
        <span class="device-name-text"><i class="fa-solid ${icon} text-muted mr-1"></i> ${dev.name}</span>
      </td>
      <td>${dev.location}</td>
      <td><span class="ip-mono">${dev.ip}</span></td>
      <td>${badge}</td>
      <td><span class="text-muted text-sm">${dev.lastSeen}</span></td>
      <td class="text-right">
        <i class="fa-solid fa-ellipsis text-muted" title="Buka Detail"></i>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handleGlobalSearch(val) {
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) {
    if (val) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }

  const query = val.toLowerCase().trim();
  if (!query) {
    renderHomeDevicesTable();
    return;
  }

  const filtered = APP_STATE.devices.filter(d =>
    d.name.toLowerCase().includes(query) ||
    d.ip.toLowerCase().includes(query) ||
    d.location.toLowerCase().includes(query) ||
    d.category.toLowerCase().includes(query)
  );
  renderHomeDevicesTable(filtered);
}

function clearGlobalSearch() {
  const input = document.getElementById('global-search-input');
  if (input) input.value = '';
  handleGlobalSearch('');
}

// ==============================================================================
// RIWAYAT GANGGUAN / NOTIFIKASI
// ==============================================================================
function renderAlerts() {
  const homeList = document.getElementById('home-alerts-list');
  if (homeList) {
    homeList.innerHTML = '';
    APP_STATE.alerts.forEach(alt => {
      const row = document.createElement('div');
      row.className = 'alert-row';
      row.innerHTML = `
        <span class="a-time">${alt.time}</span>
        <div class="a-body">
          <strong>${alt.title}</strong>
          <span><i class="fa-solid fa-location-dot"></i> ${alt.location}</span>
        </div>
        <span class="a-badge ${alt.level}">${alt.level === 'kritis' ? 'Kritis' : 'Peringatan'}</span>
      `;
      homeList.appendChild(row);
    });
  }

  const notifItemsList = document.getElementById('notif-items-list');
  if (notifItemsList) {
    notifItemsList.innerHTML = APP_STATE.alerts.map(alt => `
      <div class="notif-item ${alt.level === 'kritis' ? 'unread' : ''}">
        <div class="notif-icon ${alt.level}"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="notif-content">
          <p><strong>${alt.title}</strong></p>
          <small>${alt.location} &bull; ${alt.time} WIB</small>
        </div>
      </div>
    `).join('');
  }
}

// ==============================================================================
// SIMULASI SENSOR ELEKTRO
// ==============================================================================
function triggerDeviceSimulation() {
  const dev = APP_STATE.devices[Math.floor(Math.random() * APP_STATE.devices.length)];
  const statuses = ['online', 'offline', 'warning'];
  const nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
  dev.status = nextStatus;

  // Update counts
  const onlineCount = APP_STATE.devices.filter(d => d.status === 'online').length;
  const offlineCount = APP_STATE.devices.filter(d => d.status === 'offline').length;
  const warningCount = APP_STATE.devices.filter(d => d.status === 'warning').length;

  const onEl = document.getElementById('kpi-online');
  const onPct = document.getElementById('kpi-online-pct');
  const onBar = document.getElementById('kpi-online-bar');
  if (onEl) onEl.innerText = onlineCount;
  if (onPct) onPct.innerText = `${((onlineCount / 16) * 100).toFixed(1)}%`;
  if (onBar) onBar.style.width = `${(onlineCount / 16) * 100}%`;

  const offEl = document.getElementById('kpi-offline');
  const offPct = document.getElementById('kpi-offline-pct');
  const offBar = document.getElementById('kpi-offline-bar');
  if (offEl) offEl.innerText = offlineCount;
  if (offPct) offPct.innerText = `${((offlineCount / 16) * 100).toFixed(1)}%`;
  if (offBar) offBar.style.width = `${(offlineCount / 16) * 100}%`;

  const warnEl = document.getElementById('kpi-warning');
  const warnPct = document.getElementById('kpi-warning-pct');
  const warnBar = document.getElementById('kpi-warning-bar');
  if (warnEl) warnEl.innerText = warningCount;
  if (warnPct) warnPct.innerText = `${((warningCount / 16) * 100).toFixed(1)}%`;
  if (warnBar) warnBar.style.width = `${(warningCount / 16) * 100}%`;

  renderHomeDevicesTable();
  showToast('Simulasi Berjalan', `Status telemetri sensor ${dev.name} kini berubah menjadi ${nextStatus.toUpperCase()}.`, 'warning');
}

// ==============================================================================
// ASISTEN AI INFRASTRUCTURE (PDF HAL. 4 & HAL. 11)
// ==============================================================================
async function loadAiInsight(isManual = false) {
  const icon = document.getElementById('ai-refresh-icon');
  if (icon) icon.classList.add('fa-spin');

  try {
    let aiData = null;
    if (typeof getAiRecommendation === 'function') {
      const res = await getAiRecommendation();
      if (res && res.data) aiData = res.data;
    }

    if (aiData) {
      const targetEl = document.getElementById('ai-digest-target');
      const statusEl = document.getElementById('ai-digest-status');
      const probEl = document.getElementById('ai-problem-text');
      const recEl = document.getElementById('ai-recommendation-text');

      if (targetEl && aiData.troubled_devices) targetEl.innerText = aiData.troubled_devices;
      if (statusEl && aiData.status_network) statusEl.innerText = aiData.status_network;
      if (recEl && aiData.recommendation) recEl.innerHTML = aiData.recommendation.replace(/\n/g, '<br>');
    }

    if (isManual) {
      showToast('AI Diagnostik Selesai', 'Rekomendasi otomatis telah dimutakhirkan berdasarkan status 16 perangkat.', 'success');
    }
  } catch (err) {
    console.warn("AI insight error:", err);
  } finally {
    if (icon) icon.classList.remove('fa-spin');
  }
}

// ==============================================================================
// TOAST NOTIFIKASI
// ==============================================================================
function showToast(title, msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check text-green';
  else if (type === 'warning') icon = 'fa-triangle-exclamation text-yellow';
  else if (type === 'error') icon = 'fa-circle-exclamation text-red';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <div class="toast-content">
      <strong>${title}</strong>
      <span>${msg}</span>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}