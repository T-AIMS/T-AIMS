/**
 * =====================================================================
 * T-AIMS FRONTEND API SERVICE
 * =====================================================================
 * Deskripsi : Integrasi API Client Frontend -> Backend Express.js (Port 3000)
 * Sesuai    : API Contract Reza Fahmi & Schema MySQL taims_db (16 Aset)
 * =====================================================================
 */

const BASE_URL = 'http://localhost:3000/api';
const DEFAULT_AUTH = {
  email: 'reza.fahmi@taims_db.local',
  password: 'password123'
};

// 16 DATA ASET RESMI DATABASE MYSQL (Fallback jika Backend Offline)
const FALLBACK_ASSETS = [
  {
    asset_id: 23,
    asset_code: "NET-RTR-01",
    asset_name: "Router Utama MikroTik RB4011",
    category: "Router",
    ip_address: "192.168.10.1",
    mac_address: "D4:CA:6D:11:22:01",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "offline",
    priority: 1,
    last_seen: "15 Okt 2026 13:20",
    description: "Router gateway utama lab Teknolab"
  },
  {
    asset_id: 16,
    asset_code: "NET-RTR-02",
    asset_name: "Router Marketing Office",
    category: "Router",
    ip_address: "192.168.10.2",
    mac_address: "00:0C:29:4F:88:02",
    location_id: 1,
    location_name: "Marketing Office",
    pic_user_id: 5,
    pic_name: "Ahmad Reza Fahmi",
    monitoring_method: "Ping",
    current_status: "offline",
    priority: 1,
    last_seen: "15 Okt 2026 13:20",
    description: "Router Marketing Office"
  },
  {
    asset_id: 3,
    asset_code: "NET-SWD-01",
    asset_name: "Distribution Switch D-Link DGS-1210",
    category: "Switch Manageable",
    ip_address: "192.168.10.3",
    mac_address: "14:D6:4D:55:66:03",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "unknown",
    priority: 2,
    last_seen: "-",
    description: "Switch distribusi lantai 1 dan workstation lab"
  },
  {
    asset_id: 4,
    asset_code: "NET-SWA-01",
    asset_name: "Access Switch TP-Link TL-SG1024DE",
    category: "Switch Manageable",
    ip_address: "192.168.10.4",
    mac_address: "50:D4:F7:77:88:04",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "unknown",
    priority: 2,
    last_seen: "-",
    description: "Switch koneksi kabel PC peserta lab"
  },
  {
    asset_id: 5,
    asset_code: "NET-AP-01",
    asset_name: "Access Point Lab Utama UniFi U6-Lite",
    category: "Access Point",
    ip_address: "192.168.10.11",
    mac_address: "70:A7:41:99:AA:05",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "offline",
    priority: 2,
    last_seen: "15 Okt 2026 13:19",
    description: "Wi-Fi access point area laboratorium utama"
  },
  {
    asset_id: 7,
    asset_code: "NET-SRV-01",
    asset_name: "Server Monitoring T-AIMS Ubuntu",
    category: "Server",
    ip_address: "192.168.10.20",
    mac_address: "00:0C:29:DD:EE:07",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "HTTP",
    current_status: "offline",
    priority: 1,
    last_seen: "15 Okt 2026 13:19",
    description: "Server host aplikasi web monitoring T-AIMS"
  },
  {
    asset_id: 8,
    asset_code: "NET-GW-01",
    asset_name: "Firewall & Gateway pfSense",
    category: "Firewall",
    ip_address: "192.168.10.254",
    mac_address: "00:0C:29:11:33:08",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "offline",
    priority: 1,
    last_seen: "15 Okt 2026 13:20",
    description: "Edge firewall dan traffic monitoring lab"
  },
  {
    asset_id: 9,
    asset_code: "NET-DNS-01",
    asset_name: "DNS & DHCP Server Pi-hole",
    category: "Server",
    ip_address: "192.168.10.5",
    mac_address: "B8:27:EB:44:66:09",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "TCP",
    current_status: "unknown",
    priority: 1,
    last_seen: "-",
    description: "Layanan resolusi domain dan DHCP internal lab"
  },
  {
    asset_id: 10,
    asset_code: "NET-NAS-01",
    asset_name: "NAS Backup Synology DS220+",
    category: "Storage",
    ip_address: "192.168.10.30",
    mac_address: "00:11:32:88:99:0A",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "offline",
    priority: 2,
    last_seen: "15 Okt 2026 13:19",
    description: "Penyimpanan cadangan file dan backup database"
  },
  {
    asset_id: 11,
    asset_code: "IOT-ESP-01",
    asset_name: "ESP32 Monitoring Panel Surya",
    category: "IoT Node",
    ip_address: "192.168.10.101",
    mac_address: "24:6F:28:AA:01:0B",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 3,
    pic_name: "Ilvina Muvarika",
    monitoring_method: "Heartbeat",
    current_status: "offline",
    priority: 2,
    last_seen: "13 Okt 2026 23:29",
    description: "Sensor DHT22 pemantau suhu ruangan lab utama"
  },
  {
    asset_id: 17,
    asset_code: "SEC-CCTV-01",
    asset_name: "CCTV Head Office",
    category: "CCTV",
    ip_address: "192.168.10.31",
    mac_address: "A4:C1:38:2B:4C:01",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping + HTTP",
    current_status: "offline",
    priority: 1,
    last_seen: "15 Okt 2026 13:20",
    description: "CCTV Head Office"
  },
  {
    asset_id: 18,
    asset_code: "SEC-CCTV-02",
    asset_name: "CCTV Marketing Office",
    category: "CCTV",
    ip_address: "192.168.10.32",
    mac_address: "A4:C1:38:2B:4C:02",
    location_id: 1,
    location_name: "Marketing Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping + HTTP",
    current_status: "unknown",
    priority: 1,
    last_seen: "-",
    description: "CCTV Marketing Office"
  },
  {
    asset_id: 19,
    asset_code: "DISP-TV-01",
    asset_name: "Smart TV Xiaomi Head Office",
    category: "TV",
    ip_address: "192.168.10.40",
    mac_address: "F8:8F:80:4D:6E:01",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "offline",
    priority: 2,
    last_seen: "15 Okt 2026 13:20",
    description: "Smart TV Xiaomi Head Office"
  },
  {
    asset_id: 20,
    asset_code: "PC-WS-01",
    asset_name: "PC Head Office 01",
    category: "PC",
    ip_address: "192.168.10.41",
    mac_address: "00:E0:4C:3C:5D:01",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "offline",
    priority: 2,
    last_seen: "15 Okt 2026 13:20",
    description: "PC Head Office 01"
  },
  {
    asset_id: 21,
    asset_code: "PC-WS-02",
    asset_name: "PC Head Office 02",
    category: "PC",
    ip_address: "192.168.10.42",
    mac_address: "00:E0:4C:3C:5D:02",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 2,
    pic_name: "Ananda Dwi Susanti",
    monitoring_method: "Ping",
    current_status: "unknown",
    priority: 2,
    last_seen: "-",
    description: "PC Head Office 02"
  },
  {
    asset_id: 22,
    asset_code: "IOT-RPI-01",
    asset_name: "Raspberry Pi Smart Home",
    category: "IoT Node",
    ip_address: "192.168.10.102",
    mac_address: "B8:27:EB:6F:80:02",
    location_id: 2,
    location_name: "Head Office",
    pic_user_id: 3,
    pic_name: "Ilvina Muvarika",
    monitoring_method: "Heartbeat",
    current_status: "offline",
    priority: 2,
    last_seen: "13 Okt 2026 23:52",
    description: "Raspberry Pi Smart Home"
  }
];

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
      throw new Error(data.error || `Login gagal (${res.status})`);
    }

    if (data.data && data.data.token) {
      localStorage.setItem('taims_jwt_token', data.data.token);
      localStorage.setItem('taims_user', JSON.stringify(data.data.user || {}));
      localStorage.setItem('taims_user_role', data.data.user?.role === 'super_admin' ? 'admin' : (data.data.user?.role || 'admin'));
    }

    return { success: true, data: data.data };
  } catch (err) {
    console.warn("apiLogin error:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 2. Memastikan Token JWT Tersedia (Auto-login bila belum ada)
 */
async function ensureAuthToken() {
  let token = localStorage.getItem('taims_jwt_token');
  if (token) return token;

  // Coba auto-login diam-diam menggunakan credential default Reza Fahmi
  try {
    const loginResult = await apiLogin(DEFAULT_AUTH.email, DEFAULT_AUTH.password);
    if (loginResult.success && loginResult.data?.token) {
      return loginResult.data.token;
    }
  } catch (err) {
    console.warn("Auto login gagal:", err);
  }

  return '';
}

/**
 * 3. Generic Authenticated Fetch Wrapper dengan Auto-Retry saat 401
 */
async function apiFetch(endpoint, options = {}) {
  const token = await ensureAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    // Token kadaluarsa: bersihkan token dan coba login ulang 1 kali
    localStorage.removeItem('taims_jwt_token');
    const freshToken = await ensureAuthToken();
    if (freshToken) {
      headers['Authorization'] = `Bearer ${freshToken}`;
      const retryRes = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
      if (!retryRes.ok) throw new Error(`HTTP ${retryRes.status}`);
      return await retryRes.json();
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  return await response.json();
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
    // Hitung ringkasan dinamis dari data fallback 16 aset
    const total = FALLBACK_ASSETS.length;
    const online = FALLBACK_ASSETS.filter(a => a.current_status === 'online').length;
    const offline = FALLBACK_ASSETS.filter(a => a.current_status === 'offline').length;
    const unknown = FALLBACK_ASSETS.filter(a => a.current_status === 'unknown').length;
    const maintenance = FALLBACK_ASSETS.filter(a => a.current_status === 'maintenance').length;
    const availability = total > 0 ? ((online / total) * 100).toFixed(2) : 0;

    const byCategory = {};
    FALLBACK_ASSETS.forEach(a => {
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
    console.warn("Gagal memuat aset dari Backend API. Menggunakan 16 aset fallback database.");
    return {
      total: FALLBACK_ASSETS.length,
      data: FALLBACK_ASSETS,
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
    console.warn("Gagal memuat lokasi.");
    return [];
  }
}

// Pasang ke window agar bisa diakses secara global di semua file html
window.apiService = {
  BASE_URL,
  apiLogin,
  ensureAuthToken,
  getDashboardStats,
  getAssets,
  getIncidentLogs,
  getLocations,
  FALLBACK_ASSETS
};