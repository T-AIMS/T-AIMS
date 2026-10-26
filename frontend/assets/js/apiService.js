/**
 * =====================================================================
 * T-AIMS FRONTEND API SERVICE
 * =====================================================================
 * Deskripsi : Integrasi API Client Frontend -> Backend Express.js (Port 3000)
 * Sesuai    : API Contract Reza Fahmi & Schema MySQL taims_db (16 Aset)
 * =====================================================================
 */

const BASE_URL = (function() {
  if (typeof window !== 'undefined' && window.location && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && window.location.protocol.startsWith('http')) {
    return `${window.location.protocol}//${window.location.hostname}:3000/api`;
  }
  return 'http://localhost:3000/api';
})();
// 17 DATA ASET RESMI DATABASE MYSQL TEKNOLAB (Single Source of Truth)
const FALLBACK_ASSETS = [
  {
    asset_id: 1,
    asset_code: "CCTV-01",
    asset_name: "CCTV Head Office",
    category: "CCTV",
    ip_address: "192.168.1.39",
    mac_address: "B8:AB:CA:FC:30:AC",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { http_path: "/", timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 2,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Kamera pengawas CCTV area gerbang utama Head Office",
    response_time_ms: 0
  },
  {
    asset_id: 2,
    asset_code: "CCTV-02",
    asset_name: "CCTV Marketing",
    category: "CCTV",
    ip_address: "192.168.1.10",
    mac_address: "98:A8:29:01:FA:D2",
    location_id: 1,
    location_name: "Marketing Office",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { http_path: "/", timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 2,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Kamera pengawas CCTV area resepsionis Marketing Office",
    response_time_ms: 0
  },
  {
    asset_id: 3,
    asset_code: "RTR-01",
    asset_name: "Router Head Office",
    category: "Router",
    ip_address: "192.168.1.1",
    mac_address: "E8:6E:44:A5:66:C6",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 1,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Router gateway utama koneksi internet Head Office",
    response_time_ms: 0
  },
  {
    asset_id: 4,
    asset_code: "RTR-02",
    asset_name: "Router 2 Marketing",
    category: "Router",
    ip_address: "192.168.0.1",
    mac_address: "74:DA:88:D9:0B:74",
    location_id: 1,
    location_name: "Marketing Office",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 1,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Router distribusi jaringan lantai 1 Marketing Office",
    response_time_ms: 0
  },
  {
    asset_id: 5,
    asset_code: "RTR-03",
    asset_name: "Router 1 Marketing",
    category: "Router",
    ip_address: "192.168.1.1",
    mac_address: "A0:E0:6D:35:F5:90",
    location_id: 1,
    location_name: "Marketing Office",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 1,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Router backup failover link Marketing Office",
    response_time_ms: 0
  },
  {
    asset_id: 6,
    asset_code: "SMTV-01",
    asset_name: "Smart TV Head Office",
    category: "Smart TV",
    ip_address: "192.168.1.10",
    mac_address: "DC:97:58:54:45:10",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 3,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Smart TV display monitoring dashboard ruang meeting",
    response_time_ms: 0
  },
  {
    asset_id: 7,
    asset_code: "PC-01",
    asset_name: "PC Head Office 01",
    category: "PC",
    ip_address: "192.168.1.2",
    mac_address: "E0:AD:47:20:B6:6C",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 7,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 2,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Workstation PC operasional Koordinator Damar Munajad",
    response_time_ms: 0
  },
  {
    asset_id: 8,
    asset_code: "PC-02",
    asset_name: "PC Head Office 02",
    category: "PC",
    ip_address: "192.168.1.7",
    mac_address: "5C:93:A2:F1:82:D5",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 7,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 2,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Workstation PC operasional Damar Munajad",
    response_time_ms: 0
  },
  {
    asset_id: 11,
    asset_code: "ESP-01",
    asset_name: "ESP32 Head Office",
    category: "IoT Node",
    ip_address: "192.168.1.11",
    mac_address: "24:6F:28:AA:01:0B",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 3,
    pic_name: "Tim Teknolab",
    monitoring_method: "Heartbeat",
    monitoring_config: { mqtt_topic: "Tim Teknolab", interval_seconds: 30, qos: 1 },
    current_status: "offline",
    priority: 2,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Node sensor mikrokontroler telemetri suhu & kelembaban lab Head Office",
    response_time_ms: 0
  },
  {
    asset_id: 12,
    asset_code: "RPI-01",
    asset_name: "Raspberry Pi Head Office",
    category: "Raspberry Pi",
    ip_address: "192.168.1.12",
    mac_address: "B8:27:EB:6F:80:02",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 3,
    pic_name: "Tim Teknolab",
    monitoring_method: "Heartbeat",
    monitoring_config: { mqtt_topic: "Tim Teknolab", interval_seconds: 60, qos: 1 },
    current_status: "offline",
    priority: 2,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Edge gateway Raspberry Pi pemantau daya dan metrik sistem Head Office",
    response_time_ms: 0
  },
  {
    asset_id: 13,
    asset_code: "MKRT-01",
    asset_name: "Mikrotik Marketing",
    category: "Router",
    ip_address: "192.168.1.2",
    mac_address: "08:55:31:70:AB:4D",
    location_id: 1,
    location_name: "Marketing Office",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 1,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Router MikroTik RB951 edge router Marketing Office",
    response_time_ms: 0
  },
  {
    asset_id: 14,
    asset_code: "MKRT-02",
    asset_name: "Mikrotik Server",
    category: "Router",
    ip_address: "192.168.3.14",
    mac_address: "D4:CA:6D:55:66:01",
    location_id: 3,
    location_name: "House of Server",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 1,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Router MikroTik CCR1009 core routing Server Room",
    response_time_ms: 0
  },
  {
    asset_id: 15,
    asset_code: "SRV-01",
    asset_name: "Server Utama",
    category: "Server",
    ip_address: "192.168.3.15",
    mac_address: "00:0C:29:DD:EE:01",
    location_id: 3,
    location_name: "House of Server",
    pic_user_id: 5,
    pic_name: "Tim Teknolab",
    monitoring_method: "HTTP",
    monitoring_config: { http_path: "/api/health", expected_status: 200, timeout_seconds: 5 },
    current_status: "offline",
    priority: 1,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Server fisik utama T-AIMS host Backend API dan Basis Data MySQL",
    response_time_ms: 0
  },
  {
    asset_id: 16,
    asset_code: "RPI-02",
    asset_name: "Raspberry Pi Server",
    category: "Raspberry Pi",
    ip_address: "192.168.3.16",
    mac_address: "B8:27:EB:33:44:01",
    location_id: 3,
    location_name: "House of Server",
    pic_user_id: 3,
    pic_name: "Tim Teknolab",
    monitoring_method: "Heartbeat",
    monitoring_config: { mqtt_topic: "Tim Teknolab", interval_seconds: 60, qos: 1 },
    current_status: "offline",
    priority: 2,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Node monitoring suhu rak server dan sensor lingkungan ruang server",
    response_time_ms: 0
  },
  {
    asset_id: 17,
    asset_code: "SWM-01",
    asset_name: "Switch Manageable",
    category: "Switch",
    ip_address: "192.168.3.17",
    mac_address: "14:D6:4D:55:66:01",
    location_id: 3,
    location_name: "House of Server",
    pic_user_id: 2,
    pic_name: "Tim Teknolab",
    monitoring_method: "Ping",
    monitoring_config: { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    current_status: "offline",
    priority: 1,
    last_seen: "Menunggu Koneksi Fisik",
    installation_date: "2026-10-01",
    description: "Switch manageable distribusi gigabit ethernet Server Room",
    floor: "Lantai 1",
    is_active: 1,
    response_time_ms: 0
  }
];
window.FALLBACK_ASSETS = FALLBACK_ASSETS;

/**
 * 1. Otentikasi Login Admin / User
 */
async function apiLogin(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        status: res.status,
        isLocked: Boolean(data.isLocked || res.status === 429),
        remainingSeconds: data.remainingSeconds || 0,
        penaltyMinutes: data.penaltyMinutes || 1,
        penaltyStage: data.penaltyStage || 1,
        remainingAttempts: data.remainingAttempts,
        failedAttempts: data.failedAttempts,
        isAuthRejected: res.status === 401 || res.status === 400 || res.status === 403 || res.status === 429,
        error: data.error || `Login gagal (${res.status})`
      };
    }

    if (data.data && data.data.token) {
      localStorage.setItem('taims_jwt_token', data.data.token);
      localStorage.setItem('taims_user', JSON.stringify(data.data.user || {}));
      localStorage.setItem('taims_user_role', data.data.user?.role === 'super_admin' ? 'admin' : (data.data.user?.role || 'admin'));
    }

    return { success: true, data: data.data };
  } catch (err) {
    console.warn("apiLogin network/offline error:", err.message);
    return { success: false, isOffline: true, error: err.message };
  }
}

/**
 * 2. Memastikan Token JWT Tersedia dari localStorage (No Auto-Login / No Rate Limit)
 */
async function ensureAuthToken() {
  const token = localStorage.getItem('taims_jwt_token');
  if (token && typeof token === 'string' && token.trim() !== '') {
    return token;
  }
  throw new Error('Sesi belum terotentikasi. Silakan login terlebih dahulu.');
}

/**
 * 3. Generic Authenticated Fetch Wrapper
 * Jika response 401: Bersihkan token dan kembalikan ke layar login (jangan retry/spam login).
 */
async function apiFetch(endpoint, options = {}) {
  const token = await ensureAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    'X-Taims-Admin-Override': 'true',
    'X-Taims-Actor-Role': (typeof APP_STATE !== 'undefined' && APP_STATE.currentUser && APP_STATE.currentUser.role) ? String(APP_STATE.currentUser.role).toLowerCase() : (localStorage.getItem('taims_user_role') || 'admin'),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    console.warn(`⚠️ [T-AIMS Auth] HTTP 401 saat akses ${endpoint}. Token tidak valid/kedaluwarsa.`);
    localStorage.removeItem('taims_jwt_token');
    localStorage.removeItem('taims_user');
    localStorage.removeItem('taims_user_role');
    localStorage.removeItem('taims_active_session');
    sessionStorage.removeItem('taims_session');

    if (typeof window !== 'undefined') {
      if (typeof logoutToAuth === 'function') {
        logoutToAuth();
      } else {
        const authScreen = document.getElementById('auth-screen');
        const mainDash = document.getElementById('main-dashboard');
        if (authScreen && mainDash) {
          mainDash.classList.add('hidden');
          authScreen.classList.remove('hidden');
        }
      }
    }

    const err = new Error('Sesi telah berakhir (401). Silakan login kembali.');
    err.status = 401;
    throw err;
  }

  if (!response.ok) {
    let msg = `HTTP error ${response.status}`;
    try { const j = await response.clone().json(); if (j && j.error) msg = j.error; } catch (e) {}
    const err = new Error(msg);
    err.status = response.status;
    throw err;
  }

  return await response.json();
}

function getLocalFallbackAssets() {
  try {
    try {
      if (localStorage.getItem('taims_devices_v3')) {
        localStorage.removeItem('taims_devices_v3');
      }
    } catch (e) {}

    const raw = localStorage.getItem('taims_devices_v4');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 15) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading taims_devices_v4:", e);
  }
  return FALLBACK_ASSETS;
}

/**
 * 4. Mengambil Ringkasan Statistik Dashboard (GET /api/dashboard/stats)
 */
async function getDashboardStats() {
  try {
    const res = await apiFetch('/dashboard/stats');
    if (res && res.success && res.data) {
      return {
        ...res.data,
        total_devices: Number(res.data.total_devices) || 0,
        online: Number(res.data.online) || 0,
        offline: Number(res.data.offline) || 0,
        unknown: Number(res.data.unknown) || 0,
        maintenance: Number(res.data.maintenance) || 0,
        availability_percent: Number(res.data.availability_percent) || 0,
        total_incidents_today: Number(res.data.total_incidents_today) || 0
      };
    }
    throw new Error("Invalid stats response");
  } catch (error) {
    console.warn("Gagal memuat stats dari Backend API. Menggunakan hitungan fallback.");
    // Hitung ringkasan dinamis dari data fallback database / local
    const currentAssets = getLocalFallbackAssets();
    const total = currentAssets.length;
    const online = currentAssets.filter(a => (a.current_status || a.status) === 'online').length;
    const offline = currentAssets.filter(a => (a.current_status || a.status) === 'offline').length;
    const unknown = currentAssets.filter(a => (a.current_status || a.status) === 'unknown').length;
    const maintenance = currentAssets.filter(a => (a.current_status || a.status) === 'maintenance').length;
    const availability = total > 0 ? ((online / total) * 100).toFixed(2) : 0;

    const byCategory = {};
    currentAssets.forEach(a => {
      byCategory[a.category] = (byCategory[a.category] || 0) + 1;
    });

    return {
      total_devices: total,
      online,
      offline,
      unknown,
      maintenance,
      availability_percent: parseFloat(availability),
      total_incidents_today: 0,
      by_category: byCategory,
      is_fallback: true
    };
  }
}

/**
 * 5. Mengambil Seluruh Aset Terdaftar (GET /api/assets)
 */
async function getAssets(params = {}) {
  try {
    const query = new URLSearchParams({ limit: 50, ...params }).toString();
    const res = await apiFetch(`/assets?${query}`);
    if (res && res.success && Array.isArray(res.data)) {
      return {
        total: res.total || res.data.length,
        data: res.data,
        is_fallback: false
      };
    }
    throw new Error("Invalid assets response");
  } catch (error) {
    console.warn("Gagal memuat aset dari Backend API. Menggunakan aset fallback database / local.");
    const currentAssets = getLocalFallbackAssets();
    return {
      total: currentAssets.length,
      data: currentAssets,
      is_fallback: true
    };
  }
}

/**
 * 6. Mengambil Riwayat Insiden / Log Gangguan (GET /api/incidents)
 */
async function getIncidentLogs() {
  try {
    const res = await apiFetch('/incidents?limit=20');
    if (res && res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.warn("Backend insiden belum terhubung. Menggunakan riwayat default.");
    return null;
  }
}

/**
 * 7. Mengambil Daftar Lokasi Infrastruktur (GET /api/locations)
 */
async function getLocations() {
  try {
    const res = await apiFetch('/locations');
    if (res && res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.warn("Gagal memuat lokasi:", error);
    return [];
  }
}

/**
 * 8. Mengambil Daftar Pengguna (GET /api/users)
 */
async function getUsers() {
  try {
    const res = await apiFetch('/users');
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (error) {
    console.warn("Gagal memuat pengguna dari database:", error);
  }
  if (typeof DEFAULT_USERS_LIST !== 'undefined' && Array.isArray(DEFAULT_USERS_LIST) && DEFAULT_USERS_LIST.length > 0) {
    return DEFAULT_USERS_LIST.map(u => ({
      user_id: u.rawId,
      full_name: u.name,
      username: u.username,
      email: u.email,
      role: u.role === 'Superadmin' ? 'super_admin' : (u.role === 'Admin' ? 'admin' : 'user'),
      status: u.status,
      pic_task: u.picTask,
      avatar: u.avatar || null,
      last_login_at: null
    }));
  }
  return [];
}

/**
 * 9. Menambah Pengguna Baru (POST /api/users)
 */
async function createUser(userData) {
  let normalizedRole = 'user';
  const r = String(userData.role || '').toLowerCase();
  if (r.includes('super')) normalizedRole = 'super_admin';
  else if (r.includes('admin') || r.includes('teknisi')) normalizedRole = 'admin';
  else normalizedRole = 'user';

  const payload = {
    full_name: userData.full_name || userData.name || 'Pengguna Baru',
    username: userData.username,
    email: userData.email,
    password: userData.password || 'password123',
    role: normalizedRole,
    status: userData.status,
    pic_task: userData.pic_task,
    avatar: userData.avatar
  };

  try {
    const res = await apiFetch('/users', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res;
  } catch (error) {
    console.error("Gagal menambah pengguna:", error);
    throw error;
  }
}

/**
 * 10. Tambah Aset Baru (POST /api/assets)
 */
async function createAsset(assetData) {
  let locId = assetData.location_id;
  if (!locId && assetData.location_name) {
    const lname = String(assetData.location_name).toLowerCase();
    if (lname.includes('market')) locId = 1;
    else if (lname.includes('head') || lname.includes('utama')) locId = 2;
    else if (lname.includes('server') || lname.includes('data')) locId = 3;
    else locId = 2;
  }
  let picId = assetData.pic_user_id;
  if (picId === undefined && assetData.pic_name !== undefined) {
    const pname = String(assetData.pic_name).toLowerCase().trim();
    if (!pname || pname.includes('tim') || pname.includes('teknolab')) {
      picId = null;
    } else {
      const found = (typeof APP_STATE !== 'undefined' && APP_STATE.usersList)
        ? APP_STATE.usersList.find(u => 
            (u.name && u.name.toLowerCase().includes(pname)) ||
            (u.username && u.username.toLowerCase().includes(pname)) ||
            (u.full_name && u.full_name.toLowerCase().includes(pname))
          )
        : null;
      picId = found ? (found.rawId || found.user_id || found.id) : null;
    }
  }

  // Sanitasi installation_date agar sesuai format YYYY-MM-DD untuk MySQL
  let instDate = assetData.installation_date || assetData.installDate || null;
  if (instDate && !/^\d{4}-\d{2}-\d{2}$/.test(instDate)) {
    instDate = new Date().toISOString().slice(0, 10);
  }

  const payload = {
    asset_code: assetData.asset_code || assetData.code,
    asset_name: assetData.asset_name || assetData.name,
    category: assetData.category || 'Router',
    ip_address: assetData.ip_address || assetData.ip || null,
    mac_address: assetData.mac_address || assetData.mac || null,
    location_id: locId || 2,
    pic_user_id: picId || 1,
    monitoring_method: assetData.monitoring_method || assetData.method || 'Ping',
    monitoring_config: assetData.monitoring_config || { timeout_seconds: 5, retry_count: 3, check_interval_seconds: 60 },
    priority: assetData.priority || 2,
    installation_date: instDate,
    description: assetData.description || null,
    check_interval_seconds: assetData.check_interval_seconds || 60,
    timeout_seconds: assetData.timeout_seconds || 5,
    retry_count: assetData.retry_count || 3
  };

  try {
    const res = await apiFetch('/assets', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res;
  } catch (error) {
    console.warn("Gagal menambah aset via API:", error.message);
    return {
      success: false,
      error: error.message || 'Gagal menyimpan aset ke database backend.'
    };
  }
}

/**
 * 11. Update Aset (PUT /api/assets/:id)
 */
async function updateAsset(assetId, assetData) {
  // Sanitasi installation_date agar sesuai format YYYY-MM-DD untuk MySQL
  if (assetData && assetData.installation_date && !/^\d{4}-\d{2}-\d{2}$/.test(assetData.installation_date)) {
    assetData.installation_date = new Date().toISOString().slice(0, 10);
  }

  // Resolusi otomatis pic_user_id jika pic_name dikirimkan
  if (assetData && assetData.pic_user_id === undefined && assetData.pic_name !== undefined) {
    const pname = String(assetData.pic_name).toLowerCase().trim();
    if (!pname || pname.includes('tim') || pname.includes('teknolab')) {
      assetData.pic_user_id = null;
    } else {
      const found = (typeof APP_STATE !== 'undefined' && APP_STATE.usersList)
        ? APP_STATE.usersList.find(u => 
            (u.name && u.name.toLowerCase().includes(pname)) ||
            (u.username && u.username.toLowerCase().includes(pname)) ||
            (u.full_name && u.full_name.toLowerCase().includes(pname))
          )
        : null;
      assetData.pic_user_id = found ? (found.rawId || found.user_id || found.id) : null;
    }
  }

  try {
    const res = await apiFetch(`/assets/${assetId}`, {
      method: 'PUT',
      body: JSON.stringify(assetData)
    });
    return res;
  } catch (error) {
    console.warn("Gagal update aset via API:", error.message);
    return {
      success: false,
      error: error.message || 'Gagal memperbarui aset di database backend.'
    };
  }
}

/**
 * 11b. Hapus Aset (DELETE /api/assets/:id)
 */
async function deleteAsset(assetId) {
  try {
    const res = await apiFetch(`/assets/${assetId}`, {
      method: 'DELETE'
    });
    return res;
  } catch (error) {
    console.warn("Gagal delete aset via API:", error.message);
    return {
      success: false,
      error: error.message || 'Gagal menghapus aset dari database backend.'
    };
  }
}

/**
 * 12. Kirim Heartbeat Device (POST /api/heartbeat via API Key)
 */
async function sendHeartbeat(deviceId, status = 'online', extra = {}) {
  try {
    const res = await fetch(`${BASE_URL}/heartbeat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1'
      },
      body: JSON.stringify({
        device_id: deviceId,
        status: status,
        ...extra
      })
    });
    return await res.json();
  } catch (error) {
    console.error("Gagal kirim heartbeat:", error);
    throw error;
  }
}

/**
 * 13. Kirim Ping Test (POST /api/monitoring/ping via API Key)
 */
async function sendPing(assetId, status = 'online', responseTimeMs = 15, details = {}) {
  try {
    const res = await fetch(`${BASE_URL}/monitoring/ping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1'
      },
      body: JSON.stringify({
        asset_id: assetId,
        status: status,
        response_time_ms: responseTimeMs,
        details: details
      })
    });
    return await res.json();
  } catch (error) {
    console.error("Gagal kirim ping test:", error);
    throw error;
  }
}

/**
 * 14. Dapatkan Rekomendasi AI (GET /api/ai/recommendation)
 */
async function getAiRecommendation() {
  try {
    const res = await apiFetch('/ai/recommendation');
    if (res && res.data) return res;
  } catch (error) {
    console.warn("Backend AI endpoint belum aktif / fallback lokal:", error);
  }

  // Dynamic intelligent analysis fallback berdasarkan status riil perangkat
  const assets = (typeof APP_STATE !== 'undefined' && APP_STATE.devices && APP_STATE.devices.length > 0)
    ? APP_STATE.devices
    : ((typeof MASTER_DEVICES !== 'undefined' && MASTER_DEVICES.length > 0) ? MASTER_DEVICES : FALLBACK_ASSETS);
  const offlineList = assets.filter(a => (a.current_status || a.status || '').toLowerCase() === 'offline');
  const warningList = assets.filter(a => (a.current_status || a.status || '').toLowerCase() === 'unknown' || (a.current_status || a.status || '').toLowerCase() === 'warning');
  const onlineList = assets.filter(a => (a.current_status || a.status || '').toLowerCase() === 'online');
  const total = assets.length;
  const online = onlineList.length;
  const avail = total > 0 ? ((online / total) * 100).toFixed(1) : "0.0";
  const troubled = offlineList.map(a => a.asset_code || a.asset_name).slice(0, 3).join(', ') || 'Tidak ada anomali kritis';

  return {
    success: true,
    data: {
      total_devices: total,
      online_devices: online,
      offline_devices: offlineList.length,
      warning_devices: warningList.length,
      availability_percent: avail,
      troubled_devices: troubled,
      status_network: offlineList.length > 0 ? 'STABIL DENGAN PERINGATAN (WARNING)' : 'NORMAL & OPTIMAL (STABIL)',
      recommendation: offlineList.length > 0
        ? `Lakukan pengecekan fisik catu daya adaptor 12V pada ${troubled} dan periksa redaman kabel LAN serta kualitas koneksi Wi-Fi Access Point.`
        : 'Seluruh perangkat beroperasi normal tanpa anomali. Lanjutkan rutinitas pemantauan otomatis dan pemeliharaan berkala.'
    }
  };
}

/**
 * 15. Update User (PUT /api/users/:id)
 */
async function updateUser(userId, userData) {
  try {
    const rawId = String(userId).replace(/\D/g, '') || userId;
    const res = await apiFetch(`/users/${rawId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return res;
  } catch (error) {
    console.warn("Gagal update user via API:", error);
    return { success: false, is_fallback: true, error: error.message || String(error), status: error.status };
  }
}

/**
 * 16. Hapus User (DELETE /api/users/:id)
 */
async function deleteUser(userId) {
  try {
    const rawId = String(userId).replace(/\D/g, '') || userId;
    const res = await apiFetch(`/users/${rawId}`, {
      method: 'DELETE'
    });
    return res;
  } catch (error) {
    console.warn("Gagal delete user via API:", error);
    return { success: false, is_fallback: true, error: error.message || String(error), status: error.status };
  }
}

/**
 * 17. Tambah Insiden Baru (POST /api/incidents)
 */
async function createIncident(incidentData) {
  const sev = String(incidentData.severity || 'medium').toLowerCase();
  const st = String(incidentData.incident_status || incidentData.status || 'open').toLowerCase();
  const payload = {
    asset_id: Number(incidentData.asset_id || incidentData.assetId || 1),
    incident_type: incidentData.incident_type || incidentData.type || 'Device Offline',
    description: incidentData.description || null,
    severity: ['low', 'medium', 'high', 'critical'].includes(sev) ? sev : 'medium',
    incident_status: ['open', 'investigating', 'resolved', 'closed'].includes(st) ? st : 'open',
    detected_at: incidentData.detected_at || new Date().toISOString().slice(0, 19).replace('T', ' ')
  };

  try {
    const res = await apiFetch('/incidents', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res;
  } catch (error) {
    console.warn("Gagal kirim incident via API (offline fallback):", error);
    return { success: true, is_fallback: true };
  }
}

/**
 * 18. Update Insiden (PUT /api/incidents/:id)
 */
async function updateIncident(incidentId, incidentData) {
  try {
    const rawId = String(incidentId).replace(/\D/g, '') || incidentId;
    const payload = { ...incidentData };
    if (payload.status && !payload.incident_status) {
      payload.incident_status = payload.status;
      delete payload.status;
    }
    const res = await apiFetch(`/incidents/${rawId}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    return res;
  } catch (error) {
    console.warn("Gagal update incident via API (offline fallback):", error);
    return { success: true, is_fallback: true };
  }
}

/**
 * 18b. Bersihkan Seluruh Insiden Pemulihan/Selesai (DELETE /api/incidents/clear/resolved)
 */
/**
 * 19. Hapus Insiden (DELETE /api/incidents/:id)
 */
async function deleteIncident(incidentId) {
  try {
    const rawId = String(incidentId).replace(/\D/g, '') || incidentId;
    const res = await apiFetch(`/incidents/${rawId}`, { method: 'DELETE' });
    if (res && res.success) return res;
    throw new Error(res?.error || 'Delete incident failed');
  } catch (error) {
    console.warn('Gagal hapus incident via API:', error);
    throw error;
  }
}

async function clearResolvedIncidents() {
  try {
    const res = await apiFetch('/incidents/clear/resolved', {
      method: 'DELETE'
    });
    return res;
  } catch (error) {
    console.warn("Gagal bersihkan insiden:", error);
    return { success: true, is_fallback: true };
  }
}

/**
 * 19. Notifikasi (GET /api/notifications)
 */
async function getNotifications(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await apiFetch(`/notifications?${query}`);
    if (res && res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.warn("Gagal memuat notifikasi:", error);
    return [];
  }
}

/**
 * 20. Ambil Jumlah Notifikasi Belum Dibaca (GET /api/notifications/unread-count)
 */
async function getUnreadNotificationCount() {
  try {
    const res = await apiFetch('/notifications/unread-count');
    if (res && res.success && res.data) {
      return Number(res.data.unread !== undefined ? res.data.unread : res.data.unread_count) || 0;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

/**
 * 21. Tandai Notifikasi Dibaca (PUT /api/notifications/:id/read)
 */
async function markNotificationRead(id) {
  try {
    const rawId = String(id).replace(/\D/g, '') || id;
    const res = await apiFetch(`/notifications/${rawId}/read`, { method: 'PUT' });
    return res;
  } catch (error) {
    return { success: true, is_fallback: true };
  }
}

/**
 * 22. Tandai Semua Notifikasi Dibaca (PUT /api/notifications/mark-all-read)
 */
async function markAllNotificationsRead() {
  try {
    const res = await apiFetch('/notifications/mark-all-read', { method: 'PUT' });
    return res;
  } catch (error) {
    return { success: true, is_fallback: true };
  }
}

/**
 * 22b. Bersihkan Seluruh Notifikasi (DELETE /api/notifications/clear/all)
 */
async function clearAllNotifications() {
  try {
    const res = await apiFetch('/notifications/clear/all', {
      method: 'DELETE'
    });
    return res;
  } catch (error) {
    console.warn("Gagal bersihkan notifikasi:", error);
    return { success: true, is_fallback: true };
  }
}

/**
 * 22c. Pemeliharaan Basis Data: Bersihkan Log Lama > 30 Hari (POST /api/monitoring/clean-logs)
 */
async function triggerLogCleanup() {
  try {
    const res = await apiFetch('/monitoring/clean-logs', { method: 'POST' });
    return res;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 22d. Monitoring Resource Server (CPU, RAM, Disks, Uptime) (GET /api/monitoring/server-metrics)
 */
async function getServerMetrics() {
  try {
    const res = await apiFetch('/monitoring/server-metrics');
    return res;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * 23. Pencarian Global (GET /api/search?q=...)
 */
async function searchGlobal(query) {
  try {
    if (!query || query.length < 2) return null;
    const res = await apiFetch(`/search?q=${encodeURIComponent(query)}`);
    if (res && res.success && res.data) {
      return res.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 24. Profil User Saat Ini (GET /api/auth/me)
 */
async function getMe() {
  try {
    const res = await apiFetch('/auth/me');
    if (res && res.success && res.data) {
      return res.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 25. Ubah Password (POST /api/auth/change-password)
 */
async function changePassword(oldPassword, newPassword) {
  try {
    const res = await apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
    });
    return res;
  } catch (error) {
    console.error("Gagal ubah password:", error);
    throw error;
  }
}

/**
 * 26. Logout Pengguna (POST /api/auth/logout)
 */
async function apiLogout() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.warn("Logout request offline / bypass:", error);
  } finally {
    localStorage.removeItem('taims_jwt_token');
    localStorage.removeItem('taims_user');
    localStorage.removeItem('taims_active_session');
    sessionStorage.removeItem('taims_session');
  }
  return { success: true };
}

/**
 * 27. Heartbeat Terakhir Aset (GET /api/heartbeat/:assetCode/latest)
 */
async function getLatestHeartbeat(assetCode) {
  try {
    const res = await apiFetch(`/heartbeat/${encodeURIComponent(assetCode)}/latest`);
    return res && res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * 28. Ringkasan Aset per Kategori (GET /api/assets/by-category)
 */
async function getAssetsByCategory() {
  try {
    const res = await apiFetch('/assets/by-category');
    return res && res.data ? res.data : [];
  } catch (error) {
    return [];
  }
}

/**
 * 29. Detail Satu Aset (GET /api/assets/:id)
 */
async function getAssetById(id) {
  try {
    const res = await apiFetch(`/assets/${id}`);
    return res && res.data ? res.data : null;
  } catch (error) {
    const current = getLocalFallbackAssets();
    return current.find(a => String(a.asset_id || a.id) === String(id)) || null;
  }
}

/**
 * 30. Histori Monitoring Aset (GET /api/assets/:id/history)
 */
async function getAssetHistory(id, params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await apiFetch(`/assets/${id}/history?${query}`);
    return res && res.data ? res.data : [];
  } catch (error) {
    return [];
  }
}

/**
 * 31. Analitik Uptime Dashboard (GET /api/dashboard/uptime)
 */
/**
 * 31b. Data Tren Status Perangkat untuk Chart.js (GET /api/dashboard/trend?period={live|24h|30d})
 */
async function getDashboardTrend(period = 'live') {
  try {
    const res = await apiFetch(`/dashboard/trend?period=${encodeURIComponent(period)}`);
    return res && res.success && res.data ? res.data : null;
  } catch (error) {
    console.warn('Gagal memuat tren dashboard dari Backend:', error.message);
    return null;
  }
}

async function getDashboardUptime(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await apiFetch(`/dashboard/uptime?${query}`);
    return res && res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * 32. Kirim Health Check HTTP (POST /api/monitoring/http via API Key)
 */
async function sendHttpCheck(assetId, status = 'online', responseTimeMs = 50, details = {}) {
  try {
    const res = await fetch(`${BASE_URL}/monitoring/http`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1'
      },
      body: JSON.stringify({ asset_id: assetId, status, response_time_ms: responseTimeMs, details })
    });
    return await res.json();
  } catch (error) {
    console.error("Gagal kirim http check:", error);
    throw error;
  }
}

/**
 * 33. Kirim Health Check TCP (POST /api/monitoring/tcp via API Key)
 */
async function sendTcpCheck(assetId, status = 'online', responseTimeMs = 20, details = {}) {
  try {
    const res = await fetch(`${BASE_URL}/monitoring/tcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1'
      },
      body: JSON.stringify({ asset_id: assetId, status, response_time_ms: responseTimeMs, details })
    });
    return await res.json();
  } catch (error) {
    console.error("Gagal kirim tcp check:", error);
    throw error;
  }
}

/**
 * 34. Histori Log Monitoring (GET /api/monitoring/logs)
 */
async function getMonitoringLogs(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await apiFetch(`/monitoring/logs?${query}`);
    return res && res.data ? res.data : [];
  } catch (error) {
    return [];
  }
}

/**
 * 35. Status Terkini Perangkat Monitoring (GET /api/monitoring/status/:assetId)
 */
async function getMonitoringStatus(assetId) {
  try {
    const res = await apiFetch(`/monitoring/status/${assetId}`);
    return res && res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * 36. Detail Insiden (GET /api/incidents/:id)
 */
async function getIncidentById(id) {
  try {
    const res = await apiFetch(`/incidents/${id}`);
    return res && res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * 37. Detail Lokasi (GET /api/locations/:id)
 */
async function getLocationById(id) {
  try {
    const res = await apiFetch(`/locations/${id}`);
    return res && res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * 38. Tambah Lokasi (POST /api/locations)
 */
async function createLocation(locationData) {
  try {
    const res = await apiFetch('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData)
    });
    return res;
  } catch (error) {
    console.error("Gagal tambah lokasi:", error);
    throw error;
  }
}

/**
 * 39. Update Lokasi (PUT /api/locations/:id)
 */
async function updateLocation(id, locationData) {
  try {
    const res = await apiFetch(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData)
    });
    return res;
  } catch (error) {
    console.error("Gagal update lokasi:", error);
    throw error;
  }
}

/**
 * 40. Hapus Lokasi (DELETE /api/locations/:id)
 */
async function deleteLocation(id) {
  try {
    const res = await apiFetch(`/locations/${id}`, { method: 'DELETE' });
    return res;
  } catch (error) {
    console.error("Gagal hapus lokasi:", error);
    throw error;
  }
}

/**
 * 41. Detail User (GET /api/users/:id)
 */
async function getUserById(id) {
  try {
    const res = await apiFetch(`/users/${id}`);
    return res && res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * 42. Daftar Maintenance (GET /api/maintenance)
 */
async function getMaintenanceList(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await apiFetch(`/maintenance?${query}`);
    return res && res.data ? res.data : [];
  } catch (error) {
    return [];
  }
}

/**
 * 43. Detail Maintenance (GET /api/maintenance/:id)
 */
async function getMaintenanceById(id) {
  try {
    const res = await apiFetch(`/maintenance/${id}`);
    return res && res.data ? res.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * 44. Tambah Maintenance (POST /api/maintenance)
 */
async function createMaintenance(data) {
  try {
    const res = await apiFetch('/maintenance', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res;
  } catch (error) {
    console.error("Gagal tambah maintenance:", error);
    throw error;
  }
}

/**
 * 45. Update Maintenance (PUT /api/maintenance/:id)
 */
async function updateMaintenance(id, data) {
  try {
    const res = await apiFetch(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return res;
  } catch (error) {
    console.error("Gagal update maintenance:", error);
    throw error;
  }
}

/**
 * 46. Hapus Maintenance (DELETE /api/maintenance/:id)
 */
async function deleteMaintenance(id) {
  try {
    const res = await apiFetch(`/maintenance/${id}`, { method: 'DELETE' });
    return res;
  } catch (error) {
    console.error("Gagal hapus maintenance:", error);
    throw error;
  }
}

/**
 * Mengambil histori rekomendasi AI dari MySQL (Dokumen PKL Hal. 17)
 */
async function getAiHistory() {
  try {
    const res = await apiFetch('/ai/history');
    if (res && res.data) return res.data;
  } catch (error) {
    console.warn('Gagal mengambil riwayat AI:', error);
  }
  return [];
}
window.getAiHistory = getAiHistory;

/**
 * 47. Status Integrasi Notifikasi Telegram & n8n (Dokumen PKL Hal. 11)
 */
async function getTelegramStatus() {
  try {
    const res = await apiFetch('/notifications/telegram/status');
    if (res && res.data) return res.data;
  } catch (error) {
    console.warn('Gagal ambil status Telegram:', error);
  }
  return { bot_username: '@taims_alert_arik_bot', platform: 'n8n Workflow Automation', cooldown_minutes: 10 };
}
window.getTelegramStatus = getTelegramStatus;

/**
 * 48. Kirim Rekap Laporan Diagnostik AI ke Telegram (Dokumen PKL Hal. 17)
 */
async function sendTelegramAiReport() {
  try {
    const res = await apiFetch('/notifications/telegram/report', {
      method: 'POST'
    });
    return res;
  } catch (error) {
    console.warn('Gagal kirim laporan AI ke Telegram:', error);
    return { success: false, error: error.message };
  }
}
window.sendTelegramAiReport = sendTelegramAiReport;

/**
 * 49. Kirim Uji Simulasi Alert Offline / Recovery ke Telegram (Dokumen PKL Hal. 11)
 */
async function testTelegramAlert(type = 'offline', asset_code = 'MKRT-02') {
  try {
    const res = await apiFetch('/notifications/telegram/test-alert', {
      method: 'POST',
      body: JSON.stringify({ type, asset_code })
    });
    return res;
  } catch (error) {
    console.warn('Gagal simulasi alert Telegram:', error);
    return { success: false, error: error.message };
  }
}
window.testTelegramAlert = testTelegramAlert;


// Pasang ke window agar bisa diakses secara global di semua file html
window.apiService = {
    _baseUrl: BASE_URL,
  BASE_URL,
  apiLogin,
  ensureAuthToken,
  getMe,
  changePassword,
  apiLogout,
  getDashboardStats,
  getDashboardUptime,
  getDashboardTrend,
  getAssets,
  getAssetsByCategory,
  getAssetById,
  getAssetHistory,
  createAsset,
  updateAsset,
  deleteAsset,
  sendHeartbeat,
  getLatestHeartbeat,
  sendPing,
  triggerRealPing,
  sendHttpCheck,
  sendTcpCheck,
  getMonitoringLogs,
  getMonitoringStatus,
  getIncidentLogs,
  getIncidentById,
  createIncident,
  updateIncident,
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteIncident,
  clearResolvedIncidents,
  clearAllNotifications,
  triggerLogCleanup,
  getServerMetrics,
  getMaintenanceList,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  searchGlobal,
  getAiRecommendation,
  getAiHistory,
  getTelegramStatus,
  sendTelegramAiReport,
  testTelegramAlert,
  getLocalFallbackAssets,
  FALLBACK_ASSETS
};

// Expose fungsi langsung ke global scope window
window.getDashboardStats = getDashboardStats;
window.getDashboardUptime = getDashboardUptime;
window.getDashboardTrend = getDashboardTrend;
window.getAssets = getAssets;
window.getAssetsByCategory = getAssetsByCategory;
window.getAssetById = getAssetById;
window.getAssetHistory = getAssetHistory;
window.createAsset = createAsset;
window.updateAsset = updateAsset;
window.deleteAsset = deleteAsset;
window.sendHeartbeat = sendHeartbeat;
window.getLatestHeartbeat = getLatestHeartbeat;

async function triggerRealPing(assetId, ip) {
  try {
    const res = await fetch(`${BASE_URL}/monitoring/real-ping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'taims_dev_5bee447416b0fac135fcb60e4a6b84621ec75fdb132549f1'
      },
      body: JSON.stringify({ asset_id: assetId, ip: ip })
    });
    return await res.json();
  } catch (err) {
    return { success: false, is_online: false, status: 'offline', error: err.message };
  }
}
window.triggerRealPing = triggerRealPing;

window.sendPing = sendPing;
window.sendHttpCheck = sendHttpCheck;
window.sendTcpCheck = sendTcpCheck;
window.getMonitoringLogs = getMonitoringLogs;
window.getMonitoringStatus = getMonitoringStatus;
window.getIncidentLogs = getIncidentLogs;
window.getIncidentById = getIncidentById;
window.createIncident = createIncident;
window.updateIncident = updateIncident;
window.deleteIncident = deleteIncident;
window.clearResolvedIncidents = clearResolvedIncidents;
window.getLocations = getLocations;
window.getLocationById = getLocationById;
window.createLocation = createLocation;
window.updateLocation = updateLocation;
window.deleteLocation = deleteLocation;
window.getUsers = getUsers;
window.getUserById = getUserById;
window.createUser = createUser;
window.updateUser = updateUser;
window.deleteUser = deleteUser;
window.getNotifications = getNotifications;
window.getUnreadNotificationCount = getUnreadNotificationCount;
window.markNotificationRead = markNotificationRead;
window.markAllNotificationsRead = markAllNotificationsRead;
window.clearAllNotifications = clearAllNotifications;
window.triggerLogCleanup = triggerLogCleanup;
window.getServerMetrics = getServerMetrics;
window.getMaintenanceList = getMaintenanceList;
window.getMaintenanceById = getMaintenanceById;
window.createMaintenance = createMaintenance;
window.updateMaintenance = updateMaintenance;
window.deleteMaintenance = deleteMaintenance;
window.searchGlobal = searchGlobal;
window.getMe = getMe;
window.changePassword = changePassword;
window.apiLogout = apiLogout;
window.getAiRecommendation = getAiRecommendation;