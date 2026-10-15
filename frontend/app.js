
// T-AIMS GLOBAL SESSION & INTERACTION SCRIPT
document.addEventListener("DOMContentLoaded", () => {
  initGlobalSession();
  initLiveClock();
  initChartsHard();
});

function initGlobalSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  if (roleParam) {
    localStorage.setItem('taims_user_role', roleParam);
  }

  const activeRole = localStorage.getItem('taims_user_role') || 'guest';
  
  // Sinkronisasi seluruh elemen profil topbar kanan di dokumen
  const nameEls = document.querySelectorAll('#topbarRoleName, .profile-meta-text strong');
  const subEls = document.querySelectorAll('#topbarRoleSub, .profile-meta-text small');
  const avatarEls = document.querySelectorAll('#topbarAvatar, .profile-avatar-circle');

  nameEls.forEach(el => {
    if (activeRole === 'admin') el.innerText = "Ahmad Rizki";
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

// 9 DATA PERANGKAT RESMI DATABASE
const MASTER_DEVICES = [
  { assetCode: "AST-SRV-09", assetName: "Server Utama", category: "Server", fullIp: "192.168.1.10", macAddress: "00:15:5D:70:91:09", site: "HO", siteFull: "Kantor Pusat Teknolab (HO)", pic: "Ahmad Reza Fahmi", monitoringMethod: "Ping + HTTP/API", status: "Online", responseTime: "1 ms", lastSeen: "Online Baru Saja", incidents: 0, history: [{ time: "14 Okt · 18:50", text: "Port 3000 API Online (200 OK)", type: "ok" }] },
  { assetCode: "AST-ESP-01", assetName: "Panel ESP 1", category: "IoT Sensor", fullIp: "192.168.1.101", macAddress: "24:6F:28:1A:3B:01", site: "HO", siteFull: "Teknolab HO (Head Office)", pic: "Ilvina Muvarika", monitoringMethod: "HTTP/MQTT Heartbeat", status: "Online", responseTime: "18 ms", lastSeen: "Online Baru Saja", incidents: 0, history: [{ time: "14 Okt · 18:40", text: "Heartbeat Normal", type: "ok" }] },
  { assetCode: "AST-CAM-02", assetName: "CCTV Utama", category: "CCTV", fullIp: "192.168.1.102", macAddress: "A4:C1:38:2B:4C:02", site: "HO", siteFull: "Teknolab HO Gate", pic: "Ananda Dwi Susanti", monitoringMethod: "Ping Check", status: "Offline", responseTime: "-", lastSeen: "14 Okt 2026 18:30", incidents: 2, history: [{ time: "14 Okt · 18:30", text: "RTSP Packet Loss 100%", type: "warn" }] },
  { assetCode: "AST-PC-03", assetName: "PC Workstation", category: "Workstation", fullIp: "192.168.1.103", macAddress: "00:E0:4C:3C:5D:03", site: "HO", siteFull: "Teknolab HO (Head Office)", pic: "Dika Yoga", monitoringMethod: "Ping + Agent", status: "Online", responseTime: "4 ms", lastSeen: "Online Baru Saja", incidents: 0, history: [{ time: "14 Okt · 18:00", text: "Active Client", type: "ok" }] },
  { assetCode: "AST-TV-04", assetName: "Smart TV", category: "Workstation", fullIp: "192.168.1.104", macAddress: "F8:8F:80:4D:6E:04", site: "MO", siteFull: "Marketing Office (Kos Kiki, Jl. Ciliwung)", pic: "Ahmad Aziz", monitoringMethod: "Ping Check", status: "Online", responseTime: "12 ms", lastSeen: "Online Baru Saja", incidents: 0, history: [{ time: "14 Okt · 17:00", text: "Cast OK", type: "ok" }] },
  { assetCode: "AST-RTR-05", assetName: "Router 1", category: "Network", fullIp: "192.168.1.1", macAddress: "CC:2D:E0:5E:7F:05", site: "HO", siteFull: "Teknolab HO (Head Office)", pic: "Ananda Dwi Susanti", monitoringMethod: "Ping / SNMP", status: "Online", responseTime: "2 ms", lastSeen: "Online Baru Saja", incidents: 0, history: [{ time: "14 Okt · 18:55", text: "Gateway 0% Loss", type: "ok" }] },
  { assetCode: "AST-RTR-06", assetName: "Router 2", category: "Network", fullIp: "192.168.1.2", macAddress: "CC:2D:E0:5E:7F:06", site: "MO", siteFull: "Marketing Office (Kos Kiki, Jl. Ciliwung)", pic: "Ananda Dwi Susanti", monitoringMethod: "Ping / SNMP", status: "Warning", responseTime: "210 ms", lastSeen: "14 Okt 2026 18:00", incidents: 1, history: [{ time: "14 Okt · 18:00", text: "Latency Spike 210ms", type: "warn" }] },
  { assetCode: "AST-RTR-07", assetName: "Router 3", category: "Network", fullIp: "192.168.1.3", macAddress: "CC:2D:E0:5E:7F:07", site: "MO", siteFull: "Marketing Office (Kos Kiki, Jl. Ciliwung)", pic: "Ananda Dwi Susanti", monitoringMethod: "Ping / SNMP", status: "Online", responseTime: "3 ms", lastSeen: "Online Baru Saja", incidents: 0, history: [{ time: "14 Okt · 16:30", text: "Connected", type: "ok" }] },
  { assetCode: "AST-RPI-08", assetName: "Smart Home RPi", category: "IoT Sensor", fullIp: "192.168.1.106", macAddress: "B8:27:EB:6F:80:08", site: "MO", siteFull: "Marketing Office (Kos Kiki, Jl. Ciliwung)", pic: "Ilvina Muvarika", monitoringMethod: "Ping + Heartbeat", status: "Maintenance", responseTime: "-", lastSeen: "14 Okt 2026 17:15", incidents: 1, history: [{ time: "14 Okt · 17:15", text: "Relay Calibration", type: "warn" }] }
];

function initLiveClock() {
  function update() {
    const now = new Date();
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const dStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const tStr = `${h}:${m} WIB`;

    const elD = document.getElementById("dt-live-date");
    const elT = document.getElementById("dt-live-time");
    const elMT = document.getElementById("m-live-time");
    if (elD) elD.innerText = dStr;
    if (elT) elT.innerText = tStr;
    if (elMT) elMT.innerText = tStr;
  }
  update();
  setInterval(update, 10000);
}

function openDetailModal(code) {
  const d = MASTER_DEVICES.find(x => x.assetCode === code) || MASTER_DEVICES[0];

  document.getElementById("m-code").innerText = d.assetCode;
  document.getElementById("m-name-sub").innerText = `${d.assetName} · AST-${d.category.toUpperCase().replace(/\s/g, '')}`;
  document.getElementById("m-ip").innerText = d.fullIp;
  document.getElementById("m-mac").innerText = d.macAddress;
  document.getElementById("m-cat").innerText = d.category;
  document.getElementById("m-loc").innerText = d.siteFull;
  document.getElementById("m-pic").innerText = d.pic;
  document.getElementById("m-method").innerText = d.monitoringMethod;
  document.getElementById("m-ping").innerHTML = `${d.responseTime.replace(' ms','')} <span style="font-size:10px;">ms</span>`;
  document.getElementById("m-seen").innerText = d.lastSeen.includes("Baru") ? "Online" : d.lastSeen;
  document.getElementById("m-incident").innerText = d.incidents;

  const hList = document.getElementById("m-history-entries");
  if (hList && d.history) {
    hList.innerHTML = "";
    d.history.forEach(h => {
      const row = document.createElement("div");
      row.className = "incident-mini-card";
      row.style.marginBottom = "6px";
      row.innerHTML = `<div class="inc-time">${h.time}</div><div class="inc-desc"><strong>${h.text}</strong></div><span class="badge-${h.type==='warn'?'warn':'kritis'}">${h.type.toUpperCase()}</span>`;
      hList.appendChild(row);
    });
  }

  document.getElementById("device-modal").style.display = "flex";
}

function closeDetailModal() {
  document.getElementById("device-modal").style.display = "none";
}

window.addEventListener("click", (e) => {
  if (e.target === document.getElementById("device-modal")) closeDetailModal();
});

function initChartsHard() {
  const ctx = document.getElementById('trendChart');
  if (ctx && typeof Chart !== 'undefined') {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['25 Mar', '28 Mar', '31 Mar', '03 Apr', '06 Apr', '09 Apr', '12 Apr', '15 Apr', '18 Apr', '21 Apr', '24 Apr'],
        datasets: [
          { label: 'Online', data: [820, 840, 850, 855, 860, 865, 870, 875, 880, 885, 892], borderColor: '#10B981', borderWidth: 2, tension: 0.3, pointRadius: 2 },
          { label: 'Offline', data: [150, 145, 142, 140, 138, 136, 135, 134, 133, 132, 132], borderColor: '#EF4444', borderWidth: 1.5, borderDash: [3, 3], pointRadius: 0, tension: 0.3 },
          { label: 'Peringatan', data: [35, 32, 30, 28, 27, 26, 25, 25, 24, 24, 24], borderColor: '#F59E0B', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 0, tension: 0.3 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: '#131B30' }, ticks: { color: '#64748B', font: { size: 9 } } }, y: { grid: { color: '#131B30' }, ticks: { color: '#64748B', font: { size: 9 } }, min: 0, max: 1200 } } }
    });
  }

  const ctxDonut = document.getElementById('categoryDonutChart');
  if (ctxDonut && typeof Chart !== 'undefined') {
    new Chart(ctxDonut, {
      type: 'doughnut',
      data: { labels: ['Server', 'Network Device', 'CCTV & Security', 'IoT Sensor', 'Workstation', 'Lainnya'], datasets: [{ data: [320, 298, 215, 168, 142, 105], backgroundColor: ['#EF4444', '#F59E0B', '#06B6D4', '#10B981', '#3B82F6', '#8B5CF6'], borderColor: '#0D1424', borderWidth: 3 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '74%', plugins: { legend: { display: false } } }
    });
  }
}
