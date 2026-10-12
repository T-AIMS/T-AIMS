// 9 Mock Aset Sesuai taims_db.sql & Jaringan Wi-Fi Ananda Susanti
const MOCK_ASSETS_TAIMS = [
  {
    assetCode: "AST-ESP-01",
    assetName: "Panel ESP 1",
    category: "IoT & Smart Device",
    ipAddress: "192.168.1.101",
    macAddress: "24:6F:28:1A:3B:01",
    location: "Ruang Panel Utama",
    pic: "Ilvina Muvarika",
    monitoringMethod: "HTTP/MQTT Heartbeat",
    status: "Online",
    responseTime: "18 ms",
    lastSeen: "2026-10-12 20:15:00"
  },
  {
    assetCode: "AST-CAM-02",
    assetName: "CCTV Parkir & Gerbang",
    category: "CCTV & Security",
    ipAddress: "192.168.1.102",
    macAddress: "A4:C1:38:2B:4C:02",
    location: "Area Luar / Parkir",
    pic: "Ananda Dwi Susanti",
    monitoringMethod: "Ping Check",
    status: "Offline",
    responseTime: "-",
    lastSeen: "2026-10-12 11:24:00"
  },
  {
    assetCode: "AST-PC-03",
    assetName: "PC Workstation Admin",
    category: "Workstation & Media",
    ipAddress: "192.168.1.103",
    macAddress: "00:E0:4C:3C:5D:03",
    location: "Ruang Operasional",
    pic: "Dika Yoga",
    monitoringMethod: "Ping + Agent",
    status: "Online",
    responseTime: "4 ms",
    lastSeen: "2026-10-12 20:14:40"
  },
  {
    assetCode: "AST-TV-04",
    assetName: "Smart TV Display Monitoring",
    category: "Workstation & Media",
    ipAddress: "192.168.1.104",
    macAddress: "F8:8F:80:4D:6E:04",
    location: "Lobby Kantor",
    pic: "Ahmad Aziz",
    monitoringMethod: "Ping Check",
    status: "Online",
    responseTime: "12 ms",
    lastSeen: "2026-10-12 20:13:50"
  },
  {
    assetCode: "AST-RTR-05",
    assetName: "Router 3 (Access Point Gateway)",
    category: "Network Device",
    ipAddress: "192.168.1.105",
    macAddress: "CC:2D:E0:5E:7F:05",
    location: "Ruang Server & Jaringan",
    pic: "Ananda Dwi Susanti",
    monitoringMethod: "Ping / SNMP",
    status: "Online",
    responseTime: "2 ms",
    lastSeen: "2026-10-12 20:15:10"
  },
  {
    assetCode: "AST-RPI-06",
    assetName: "Smart Home Kantor (Raspberry Pi Gateway)",
    category: "IoT & Smart Device",
    ipAddress: "192.168.1.106",
    macAddress: "B8:27:EB:6F:80:06",
    location: "Smart Room Teknolab",
    pic: "Ilvina Muvarika",
    monitoringMethod: "Ping + Heartbeat",
    status: "Warning",
    responseTime: "210 ms",
    lastSeen: "2026-10-12 20:10:15"
  },
  {
    assetCode: "AST-SRV-07",
    assetName: "Server Utama Teknolab",
    category: "Server",
    ipAddress: "192.168.1.107",
    macAddress: "00:15:5D:70:91:07",
    location: "Data Center Mini",
    pic: "Ahmad Reza Fahmi",
    monitoringMethod: "Ping + TCP Port + HTTP/API",
    status: "Online",
    responseTime: "1 ms",
    lastSeen: "2026-10-12 20:15:12"
  },
  {
    assetCode: "AST-SWT-08",
    assetName: "Switch Manageable Lab",
    category: "Network Device",
    ipAddress: "192.168.1.108",
    macAddress: "70:4F:57:81:A2:08",
    location: "Laboratorium Uji",
    pic: "Ananda Dwi Susanti",
    monitoringMethod: "Ping / SNMP",
    status: "Online",
    responseTime: "3 ms",
    lastSeen: "2026-10-12 20:14:55"
  },
  {
    assetCode: "AST-ESP-09",
    assetName: "ESP32 Sensor Lingkungan Suhu/Kelembaban",
    category: "IoT & Smart Device",
    ipAddress: "192.168.1.109",
    macAddress: "24:6F:28:92:B3:09",
    location: "Data Center Mini",
    pic: "Ilvina Muvarika",
    monitoringMethod: "HTTP/MQTT Heartbeat",
    status: "Online",
    responseTime: "24 ms",
    lastSeen: "2026-10-12 20:15:05"
  }
];

let deviceState = [...MOCK_ASSETS_TAIMS];

document.addEventListener("DOMContentLoaded", () => {
  updateStatusSummaryCards();
  renderDeviceTable(deviceState);
  initSearchAndFilter();
});

function updateStatusSummaryCards() {
  const total = deviceState.length;
  const online = deviceState.filter(d => d.status.toLowerCase() === "online").length;
  const offline = deviceState.filter(d => d.status.toLowerCase() === "offline").length;
  const warning = deviceState.filter(d => d.status.toLowerCase() === "warning").length;

  document.getElementById("kpi-total").innerText = total;
  document.getElementById("kpi-online").innerText = online;
  document.getElementById("kpi-offline").innerText = offline;
  document.getElementById("kpi-warning").innerText = warning;
}

function renderDeviceTable(data) {
  const tbody = document.getElementById("device-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:20px;color:#6B7280;">Tidak ada aset yang cocok.</td></tr>`;
    return;
  }

  data.forEach(d => {
    const tr = document.createElement("tr");
    const statusClass = d.status.toLowerCase() === "online" 
      ? "online" 
      : d.status.toLowerCase() === "offline" 
      ? "offline" 
      : "warning";

    tr.innerHTML = `
      <td><strong class="mono text-cyan">${d.assetCode}</strong></td>
      <td><strong class="text-white">${d.assetName}</strong></td>
      <td>${d.category}</td>
      <td class="mono">${d.ipAddress}</td>
      <td>${d.location}</td>
      <td><span class="status-badge ${statusClass}">● ${d.status}</span></td>
      <td class="mono ${d.responseTime === '-' ? 'text-red' : 'text-green'}">${d.responseTime}</td>
      <td class="mono" style="font-size:10.5px;">${d.lastSeen}</td>
      <td>
        <button class="btn-detail-action" onclick="openDetailModal('${d.assetCode}')">Detail</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function initSearchAndFilter() {
  const searchInput = document.getElementById("search-input");
  const categoryFilter = document.getElementById("category-filter");

  if (searchInput) searchInput.addEventListener("input", executeFilter);
  if (categoryFilter) categoryFilter.addEventListener("change", executeFilter);
}

function executeFilter() {
  const query = (document.getElementById("search-input")?.value || "").toLowerCase().trim();
  const cat = document.getElementById("category-filter")?.value || "ALL";

  const result = deviceState.filter(d => {
    const matchQuery = 
      d.assetName.toLowerCase().includes(query) ||
      d.assetCode.toLowerCase().includes(query) ||
      d.ipAddress.includes(query) ||
      d.location.toLowerCase().includes(query);

    const matchCategory = (cat === "ALL" || d.category === cat);
    return matchQuery && matchCategory;
  });

  renderDeviceTable(result);
}

function openDetailModal(assetCode) {
  const d = deviceState.find(x => x.assetCode === assetCode);
  if (!d) return;

  document.getElementById("m-code").innerText = d.assetCode;
  document.getElementById("m-name").innerText = d.assetName;
  document.getElementById("m-cat").innerText = d.category;
  document.getElementById("m-ip").innerText = d.ipAddress;
  document.getElementById("m-mac").innerText = d.macAddress;
  document.getElementById("m-loc").innerText = d.location;
  document.getElementById("m-pic").innerText = d.pic;
  document.getElementById("m-method").innerText = d.monitoringMethod;
  document.getElementById("m-status").innerText = d.status;
  document.getElementById("m-status").className = d.status.toLowerCase() === 'online' ? 'text-green' : (d.status.toLowerCase() === 'offline' ? 'text-red' : 'text-yellow');
  document.getElementById("m-ping").innerText = d.responseTime;
  document.getElementById("m-seen").innerText = d.lastSeen;

  document.getElementById("device-modal").style.display = "flex";
}

function closeDetailModal() {
  document.getElementById("device-modal").style.display = "none";
}