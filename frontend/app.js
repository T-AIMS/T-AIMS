/**
 * T-AIMS Master Application Logic
 * Developer: Dika Yoga - Shift 2 (Frontend Dashboard Developer)
 * Integrasi: 9 Aset SQL (taims_db.sql), Visual Node Topology HO & MO, Chart.js Glow Line
 */

// 9 DATA PERANGKAT RESMI DARI TABEL ASSETS (taims_db.sql)
const MOCK_ASSETS_TAIMS = [
  {
    assetCode: "AST-ESP-01",
    assetName: "Panel ESP 1",
    category: "IoT Sensor",
    ipAddress: ".101",
    fullIp: "192.168.1.101",
    macAddress: "24:6F:28:1A:3B:01",
    site: "HO",
    pic: "Ilvina Muvarika",
    monitoringMethod: "HTTP/MQTT Heartbeat",
    status: "Online",
    responseTime: "18 ms",
    lastSeen: "Online Baru Saja"
  },
  {
    assetCode: "AST-CAM-02",
    assetName: "CCTV Utama",
    category: "CCTV",
    ipAddress: ".102",
    fullIp: "192.168.1.102",
    macAddress: "A4:C1:38:2B:4C:02",
    site: "HO",
    pic: "Ananda Dwi Susanti",
    monitoringMethod: "Ping Check",
    status: "Offline",
    responseTime: "-",
    lastSeen: "12 Okt 2026 19:22"
  },
  {
    assetCode: "AST-PC-03",
    assetName: "PC Workstation",
    category: "Workstation",
    ipAddress: ".103",
    fullIp: "192.168.1.103",
    macAddress: "00:E0:4C:3C:5D:03",
    site: "HO",
    pic: "Dika Yoga",
    monitoringMethod: "Ping + Agent",
    status: "Online",
    responseTime: "4 ms",
    lastSeen: "Online Baru Saja"
  },
  {
    assetCode: "AST-TV-04",
    assetName: "Smart TV",
    category: "Workstation",
    ipAddress: ".104",
    fullIp: "192.168.1.104",
    macAddress: "F8:8F:80:4D:6E:04",
    site: "MO",
    pic: "Ahmad Aziz",
    monitoringMethod: "Ping Check",
    status: "Online",
    responseTime: "12 ms",
    lastSeen: "Online Baru Saja"
  },
  {
    assetCode: "AST-RTR-05",
    assetName: "Router 1",
    category: "Network",
    ipAddress: ".1",
    fullIp: "192.168.1.1",
    macAddress: "CC:2D:E0:5E:7F:05",
    site: "HO",
    pic: "Ananda Dwi Susanti",
    monitoringMethod: "Ping / SNMP",
    status: "Online",
    responseTime: "2 ms",
    lastSeen: "Online Baru Saja"
  },
  {
    assetCode: "AST-RTR-06",
    assetName: "Router 2",
    category: "Network",
    ipAddress: ".2",
    fullIp: "192.168.1.2",
    macAddress: "CC:2D:E0:5E:7F:06",
    site: "MO",
    pic: "Ananda Dwi Susanti",
    monitoringMethod: "Ping / SNMP",
    status: "Warning",
    responseTime: "210 ms",
    lastSeen: "12 Okt 2026 19:08"
  },
  {
    assetCode: "AST-RTR-07",
    assetName: "Router 3",
    category: "Network",
    ipAddress: ".3",
    fullIp: "192.168.1.3",
    macAddress: "CC:2D:E0:5E:7F:07",
    site: "MO",
    pic: "Ananda Dwi Susanti",
    monitoringMethod: "Ping / SNMP",
    status: "Online",
    responseTime: "3 ms",
    lastSeen: "Online Baru Saja"
  },
  {
    assetCode: "AST-RPI-08",
    assetName: "Smart Home RPi",
    category: "IoT Sensor",
    ipAddress: ".106",
    fullIp: "192.168.1.106",
    macAddress: "B8:27:EB:6F:80:08",
    site: "MO",
    pic: "Ilvina Muvarika",
    monitoringMethod: "Ping + Heartbeat",
    status: "Maintenance",
    responseTime: "-",
    lastSeen: "12 Okt 2026 19:15"
  },
  {
    assetCode: "AST-SRV-09",
    assetName: "Server Utama",
    category: "Server",
    ipAddress: ".10",
    fullIp: "192.168.1.10",
    macAddress: "00:15:5D:70:91:09",
    site: "HO",
    pic: "Ahmad Reza Fahmi",
    monitoringMethod: "Ping + HTTP/API",
    status: "Online",
    responseTime: "1 ms",
    lastSeen: "Online Baru Saja"
  }
];

let deviceData = [...MOCK_ASSETS_TAIMS];

document.addEventListener("DOMContentLoaded", () => {
  renderKPICards();
  renderDeviceTable(deviceData);
  initSearch();
  initLiveClock();
  initCharts();
});

// 1. Live Clock
function initLiveClock() {
  function updateClock() {
    const now = new Date();
    const days = ['MINGGU', 'SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];

    const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hours}:${minutes} WIB`;

    const elDate = document.getElementById("live-date");
    const elTime = document.getElementById("live-time");
    if (elDate) elDate.innerText = dateStr;
    if (elTime) elTime.innerText = timeStr;
  }
  updateClock();
  setInterval(updateClock, 10000);
}

// 2. Render Kartu KPI
function renderKPICards() {
  const total = deviceData.length;
  const online = deviceData.filter(d => d.status.toLowerCase() === "online").length;
  const offline = deviceData.filter(d => d.status.toLowerCase() === "offline").length;
  const warning = deviceData.filter(d => d.status.toLowerCase() === "warning").length;

  document.getElementById("kpi-total").innerText = total;
  document.getElementById("kpi-online").innerText = online;
  document.getElementById("kpi-offline").innerText = offline;
  document.getElementById("kpi-warning").innerText = warning;
}

// 3. Render Tabel Dashboard
function renderDeviceTable(data) {
  const tbody = document.getElementById("device-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  data.forEach(d => {
    const tr = document.createElement("tr");
    let chipClass = "online";
    if (d.status.toLowerCase() === "offline") chipClass = "offline";
    if (d.status.toLowerCase() === "warning") chipClass = "warning";
    if (d.status.toLowerCase() === "maintenance") chipClass = "maint";

    tr.innerHTML = `
      <td><strong>${d.assetName}</strong><br><small style="font-size:8px;color:#64748B;">${d.category}</small></td>
      <td class="mono" style="color:#60A5FA;">${d.ipAddress}</td>
      <td><span class="site-badge-tiny">${d.site}</span></td>
      <td><span class="tag-status-pill ${chipClass}">● ${d.status.toUpperCase()}</span></td>
    `;
    tr.style.cursor = "pointer";
    tr.onclick = () => openDetailModal(d.assetCode);
    tbody.appendChild(tr);
  });
}

// 4. Pencarian Real-time
function initSearch() {
  const input = document.getElementById("global-search");
  if (!input) return;

  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = deviceData.filter(d => 
      d.assetName.toLowerCase().includes(query) ||
      d.assetCode.toLowerCase().includes(query) ||
      d.fullIp.includes(query) ||
      d.site.toLowerCase().includes(query)
    );
    renderDeviceTable(filtered);
  });
}

// 5. Modal Pop-up
function openDetailModal(assetCode) {
  const d = deviceData.find(x => x.assetCode === assetCode);
  if (!d) return;

  document.getElementById("m-code").innerText = d.assetCode;
  document.getElementById("m-name").innerText = d.assetName;
  document.getElementById("m-cat").innerText = d.category;
  document.getElementById("m-ip").innerText = d.fullIp;
  document.getElementById("m-mac").innerText = d.macAddress;
  document.getElementById("m-loc").innerText = `${d.site} (PT Teknolab)`;
  document.getElementById("m-pic").innerText = d.pic;
  document.getElementById("m-method").innerText = d.monitoringMethod;
  document.getElementById("m-status").innerText = d.status;
  document.getElementById("m-ping").innerText = d.responseTime;
  document.getElementById("m-seen").innerText = d.lastSeen;

  document.getElementById("device-modal").style.display = "flex";
}

function closeDetailModal() {
  document.getElementById("device-modal").style.display = "none";
}

// 6. Inisialisasi Chart.js Presisi Desain Aziz
function initCharts() {
  const ctxTrend = document.getElementById('trendChart');
  if (ctxTrend && typeof Chart !== 'undefined') {
    const ctx = ctxTrend.getContext('2d');
    const greenGradient = ctx.createLinearGradient(0, 0, 0, 180);
    greenGradient.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    greenGradient.addColorStop(1, 'rgba(16, 185, 129, 0.00)');

    new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: ['25 Mar', '31 Mar', '06 Apr', '12 Apr', '18 Apr', '24 Apr'],
        datasets: [
          {
            label: 'Online',
            data: [5.2, 5.8, 6.4, 6.5, 6.4, 7.0],
            borderColor: '#10B981',
            borderWidth: 2.5,
            backgroundColor: greenGradient,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#10B981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 1.5,
            pointRadius: [0, 0, 3, 0, 0, 5],
            pointHoverRadius: 6
          },
          {
            label: 'Peringatan',
            data: [2.2, 2.0, 2.2, 2.3, 2.3, 2.4],
            borderColor: '#F59E0B',
            borderWidth: 1.5,
            borderDash: [4, 4],
            pointRadius: 0,
            fill: false,
            tension: 0.3
          },
          {
            label: 'Offline',
            data: [1.1, 1.0, 1.2, 1.1, 1.2, 1.0],
            borderColor: '#EF4444',
            borderWidth: 1.5,
            borderDash: [3, 3],
            pointRadius: 0,
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'start',
            labels: {
              color: '#94A3B8',
              font: { size: 9.5, family: 'Plus Jakarta Sans' },
              boxWidth: 8,
              boxHeight: 8,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        },
        scales: {
          x: {
            grid: { color: '#141A2B' },
            ticks: { color: '#64748B', font: { size: 8.5 } }
          },
          y: {
            grid: { color: '#141A2B' },
            ticks: { color: '#64748B', font: { size: 8.5 } },
            beginAtZero: true,
            max: 8
          }
        }
      }
    });
  }

  // Donut Kategori
  const categoryCounts = {
    'Network': 3,
    'IoT Sensor': 2,
    'Workstation': 2,
    'CCTV': 1,
    'Server': 1
  };
  const categoryColors = ['#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444', '#10B981'];

  const ctxDonut = document.getElementById('categoryDonutChart');
  if (ctxDonut && typeof Chart !== 'undefined') {
    new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryCounts),
        datasets: [{
          data: Object.values(categoryCounts),
          backgroundColor: categoryColors,
          borderColor: '#0F1424',
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

    const legendContainer = document.getElementById('donut-custom-legend');
    if (legendContainer) {
      legendContainer.innerHTML = '';
      Object.keys(categoryCounts).forEach((label, idx) => {
        const row = document.createElement('div');
        row.className = 'legend-entry';
        row.innerHTML = `
          <div class="legend-color-dot-title">
            <span class="legend-box-sq" style="background:${categoryColors[idx]};"></span>
            <span>${label}</span>
          </div>
          <span class="legend-count-val">${categoryCounts[label]}</span>
        `;
        legendContainer.appendChild(row);
      });
    }
  }
}