/**
 * T-AIMS | Teknolab Asset & Infrastructure Monitoring System
 * Script Aplikasi Lengkap: Multi-Halaman, Autentikasi, GIS Peta Blitar, Modul Aset & Tim Projek
 */

const DEFAULT_TEAM_MEMBERS = [
    {
        id: 'TM-01',
        name: 'Ahmad Rizki Pratama',
        nisn: '0067829104',
        role: 'Project Leader & System Integrator',
        avatarIcon: 'fa-user-tie',
        avatarColor: '#00E5FF',
        responsibilities: 'Koordinator utama proyek T-AIMS, analisis kebutuhan sistem monitoring industri, integrasi perangkat keras sensor dengan dasbor telemetri, serta pengujian performa sistem.',
        skills: ['Project Management', 'System Architecture', 'Telemetry', 'IoT Integration'],
        contact: 'ahmad.rizki@teknolab.id'
    },
    {
        id: 'TM-02',
        name: 'Dimas Wahyu Saputra',
        nisn: '0067829105',
        role: 'Hardware & IoT Engineer',
        avatarIcon: 'fa-microchip',
        avatarColor: '#10B981',
        responsibilities: 'Perancangan skematik rangkaian elektro, perakitan mikrokontroler ESP32, wiring sensor arus (ACS712), sensor suhu (DHT22), kalibrasi tegangan listrik, dan pengemasan casing.',
        skills: ['ESP32 Microcontroller', 'Sensor Calibration', 'Circuit Wiring', 'MQTT Broker'],
        contact: 'dimas.wahyu@teknolab.id'
    },
    {
        id: 'TM-03',
        name: 'Budi Santoso',
        nisn: '0067829106',
        role: 'Network & Infrastructure Admin',
        avatarIcon: 'fa-network-wired',
        avatarColor: '#8B5CF6',
        responsibilities: 'Konfigurasi topologi jaringan area Blitar, routing & subnetting IP address, implementasi protokol ICMP ping test, SNMP v2c/v3 monitoring, dan analisis throughput jaringan.',
        skills: ['Subnetting IP', 'MikroTik / Cisco', 'ICMP / SNMP', 'Network Security'],
        contact: 'budi.santoso@teknolab.id'
    },
    {
        id: 'TM-04',
        name: 'Siti Rahmadani',
        nisn: '0067829107',
        role: 'Frontend & GIS Developer',
        avatarIcon: 'fa-laptop-code',
        avatarColor: '#E11D48',
        responsibilities: 'Pengembangan antarmuka dasbor Cyber Dark HUD, integrasi pemetaan koordinat geospasial Blitar (Leaflet GIS), visualisasi analitik tren (Chart.js), dan optimasi UX responsif.',
        skills: ['HTML5 / CSS3 HUD', 'JavaScript ES6', 'Leaflet GIS', 'Chart.js Analytics'],
        contact: 'siti.rahma@teknolab.id'
    }
];

const APP_STATE = {
    currentUser: null,
    currentPage: 'page-dashboard',
    selectedDeviceId: null,
    homeMap: null,
    fullMap: null,
    homeMarkers: [],
    fullMarkers: [],
    tempMarker: null,
    activeCoord: { lat: -8.0988, lng: 112.1652 },

    // Database Perangkat Berfokus pada Wilayah Kota & Kabupaten Blitar (Jawa Timur)
        devices: [
        {
            id: 'DEV-001',
            code: 'NET-SRV-01',
            name: 'SRV-DC-01',
            category: 'Server',
            district: 'Kepanjenkidul',
            location: 'Pusat Data HO',
            lat: -8.07385,
            lng: 112.17350,
            ip: '192.168.10.20',
            mac: '00:1B:44:11:3A:B7',
            status: 'online',
            lastSeen: '24 Apr 2024 14:31',
            ping: '2 ms',
            uptime: '99.8%',
            method: 'Ping & SNMP',
            pic: 'Ahmad Reza Fahmi',
            installDate: '12 Jan 2024',
            value: 'Rp 35.000.000',
            condition: 'Baik',
            warranty: 'Hingga Jan 2027'
        },
        {
            id: 'DEV-002',
            code: 'NET-RTR-01',
            name: 'SW-Core-01',
            category: 'Network Device',
            district: 'Kepanjenkidul',
            location: 'Area Lab Utama HO',
            lat: -8.07375,
            lng: 112.17345,
            ip: '192.168.10.1',
            mac: '00:1B:44:22:8C:F1',
            status: 'online',
            lastSeen: '24 Apr 2024 14:32',
            ping: '1 ms',
            uptime: '99.9%',
            method: 'Ping & SNMP',
            pic: 'Ananda Dwi Susanti',
            installDate: '15 Jan 2024',
            value: 'Rp 14.500.000',
            condition: 'Baik',
            warranty: 'Hingga Mar 2026'
        },
        {
            id: 'DEV-003',
            code: 'SEC-CCTV-01',
            name: 'CCTV-HO-01',
            category: 'CCTV & Security',
            district: 'Kepanjenkidul',
            location: 'Gerbang Depan HO',
            lat: -8.07360,
            lng: 112.17320,
            ip: '192.168.10.31',
            mac: '00:1B:44:55:09:A1',
            status: 'offline',
            lastSeen: '24 Apr 2024 11:24',
            ping: 'Timeout',
            uptime: '89.2%',
            method: 'Ping (ICMP)',
            pic: 'Ananda Dwi Susanti',
            installDate: '20 Jan 2024',
            value: 'Rp 3.200.000',
            condition: 'Perlu Perbaikan',
            warranty: 'Hingga Jan 2025'
        },
        {
            id: 'DEV-004',
            code: 'NET-AP-01',
            name: 'AP-LB-01',
            category: 'Network Device',
            district: 'Kepanjenkidul',
            location: 'Koridor Lab HO',
            lat: -8.07380,
            lng: 112.17330,
            ip: '192.168.10.11',
            mac: '00:1B:44:66:33:DE',
            status: 'online',
            lastSeen: '24 Apr 2024 14:12',
            ping: '4 ms',
            uptime: '99.1%',
            method: 'Ping (ICMP)',
            pic: 'Ananda Dwi Susanti',
            installDate: '18 Jan 2024',
            value: 'Rp 2.800.000',
            condition: 'Baik',
            warranty: 'Hingga Feb 2026'
        },
        {
            id: 'DEV-005',
            code: 'SRV-APP-01',
            name: 'SRV-APP-02',
            category: 'Server',
            district: 'Kepanjenkidul',
            location: 'Data Center HO',
            lat: -8.07385,
            lng: 112.17355,
            ip: '192.168.10.5',
            mac: '00:1B:44:77:88:99',
            status: 'online',
            lastSeen: '24 Apr 2024 14:30',
            ping: '3 ms',
            uptime: '99.7%',
            method: 'Ping & HTTP',
            pic: 'Ahmad Reza Fahmi',
            installDate: '22 Jan 2024',
            value: 'Rp 28.000.000',
            condition: 'Baik',
            warranty: 'Hingga Des 2026'
        },
        {
            id: 'DEV-006',
            code: 'NET-RTR-02',
            name: 'Router-MO-02',
            category: 'Network Device',
            district: 'Sananwetan',
            location: 'Ruang Marketing MO',
            lat: -8.08630,
            lng: 112.16450,
            ip: '192.168.10.2',
            mac: '00:1B:44:22:9D:02',
            status: 'warning',
            lastSeen: '24 Apr 2024 14:28',
            ping: '68 ms',
            uptime: '96.4%',
            method: 'Ping & SNMP',
            pic: 'Ahmad Reza Fahmi',
            installDate: '16 Jan 2024',
            value: 'Rp 8.500.000',
            condition: 'Cukup',
            warranty: 'Hingga Apr 2025'
        },
        {
            id: 'DEV-007',
            code: 'IOT-ESP-01',
            name: 'ESP32-Surya-01',
            category: 'IoT Sensor',
            district: 'Kepanjenkidul',
            location: 'Ruang Server HO',
            lat: -8.07390,
            lng: 112.17340,
            ip: '192.168.10.101',
            mac: 'A4:CF:12:88:31:01',
            status: 'online',
            lastSeen: '24 Apr 2024 14:32',
            ping: '8 ms',
            uptime: '98.9%',
            method: 'HTTP / API',
            pic: 'Ilvina Muvarika',
            installDate: '01 Feb 2024',
            value: 'Rp 1.200.000',
            condition: 'Baik',
            warranty: 'Hingga Feb 2025'
        },
        {
            id: 'DEV-008',
            code: 'IOT-ENV-02',
            name: 'ESP32-Suhu-02',
            category: 'IoT Sensor',
            district: 'Kepanjenkidul',
            location: 'Ruang Server HO',
            lat: -8.07390,
            lng: 112.17345,
            ip: '192.168.10.102',
            mac: 'A4:CF:12:88:31:02',
            status: 'online',
            lastSeen: '24 Apr 2024 14:31',
            ping: '9 ms',
            uptime: '98.5%',
            method: 'HTTP / API',
            pic: 'Ilvina Muvarika',
            installDate: '01 Feb 2024',
            value: 'Rp 950.000',
            condition: 'Baik',
            warranty: 'Hingga Feb 2025'
        },
        {
            id: 'DEV-009',
            code: 'SEC-CCTV-02',
            name: 'CCTV-MO-02',
            category: 'CCTV & Security',
            district: 'Sananwetan',
            location: 'Lobi Depan MO',
            lat: -8.08620,
            lng: 112.16440,
            ip: '192.168.10.32',
            mac: '00:1B:44:55:09:A2',
            status: 'online',
            lastSeen: '24 Apr 2024 14:29',
            ping: '12 ms',
            uptime: '99.0%',
            method: 'Ping (ICMP)',
            pic: 'Ananda Dwi Susanti',
            installDate: '20 Jan 2024',
            value: 'Rp 3.200.000',
            condition: 'Baik',
            warranty: 'Hingga Jan 2025'
        },
        {
            id: 'DEV-010',
            code: 'PC-WS-01',
            name: 'PC-Lead-01',
            category: 'Workstation',
            district: 'Kepanjenkidul',
            location: 'Ruang Kerja 1 HO',
            lat: -8.07370,
            lng: 112.17330,
            ip: '192.168.10.41',
            mac: '00:1B:44:88:01:41',
            status: 'online',
            lastSeen: '24 Apr 2024 14:32',
            ping: '2 ms',
            uptime: '99.5%',
            method: 'Ping (ICMP)',
            pic: 'Dika Yoga Pratama',
            installDate: '10 Jan 2024',
            value: 'Rp 18.000.000',
            condition: 'Baik',
            warranty: 'Hingga Jan 2026'
        },
        {
            id: 'DEV-011',
            code: 'PC-WS-02',
            name: 'PC-Admin-02',
            category: 'Workstation',
            district: 'Kepanjenkidul',
            location: 'Ruang Admin HO',
            lat: -8.07380,
            lng: 112.17335,
            ip: '192.168.10.42',
            mac: '00:1B:44:88:01:42',
            status: 'online',
            lastSeen: '24 Apr 2024 14:32',
            ping: '2 ms',
            uptime: '99.5%',
            method: 'Ping (ICMP)',
            pic: 'Ananda Dwi Susanti',
            installDate: '10 Jan 2024',
            value: 'Rp 16.500.000',
            condition: 'Baik',
            warranty: 'Hingga Jan 2026'
        },
        {
            id: 'DEV-012',
            code: 'PC-DEV-03',
            name: 'PC-Dev-03',
            category: 'Workstation',
            district: 'Sananwetan',
            location: 'Ruang Lab AI MO',
            lat: -8.08640,
            lng: 112.16460,
            ip: '192.168.10.40',
            mac: '00:1B:44:88:01:40',
            status: 'online',
            lastSeen: '24 Apr 2024 14:25',
            ping: '14 ms',
            uptime: '98.0%',
            method: 'Ping (ICMP)',
            pic: 'Budi Santoso',
            installDate: '12 Jan 2024',
            value: 'Rp 22.000.000',
            condition: 'Baik',
            warranty: 'Hingga Feb 2026'
        },
        {
            id: 'DEV-013',
            code: 'SRV-DB-01',
            name: 'SRV-DB-01',
            category: 'Server',
            district: 'Kepanjenkidul',
            location: 'Ruang Server HO',
            lat: -8.07385,
            lng: 112.17350,
            ip: '192.168.10.30',
            mac: '00:1B:44:33:44:55',
            status: 'online',
            lastSeen: '24 Apr 2024 14:32',
            ping: '1 ms',
            uptime: '99.9%',
            method: 'Ping & Port',
            pic: 'Ahmad Reza Fahmi',
            installDate: '14 Jan 2024',
            value: 'Rp 32.000.000',
            condition: 'Baik',
            warranty: 'Hingga Des 2026'
        },
        {
            id: 'DEV-014',
            code: 'SRV-DC-02',
            name: 'SRV-NAS-02',
            category: 'Server',
            district: 'Kepanjenkidul',
            location: 'Ruang Server HO',
            lat: -8.07385,
            lng: 112.17360,
            ip: '192.168.10.254',
            mac: '00:1B:44:FE:DC:BA',
            status: 'online',
            lastSeen: '24 Apr 2024 14:30',
            ping: '2 ms',
            uptime: '99.4%',
            method: 'Ping & SNMP',
            pic: 'Ahmad Reza Fahmi',
            installDate: '14 Jan 2024',
            value: 'Rp 19.500.000',
            condition: 'Baik',
            warranty: 'Hingga Jan 2026'
        },
        {
            id: 'DEV-015',
            code: 'SW-CORE-01',
            name: 'SW-Managed-01',
            category: 'Network Device',
            district: 'Kepanjenkidul',
            location: 'Rack Panel HO',
            lat: -8.07375,
            lng: 112.17345,
            ip: '192.168.10.4',
            mac: '00:1B:44:CC:DD:04',
            status: 'online',
            lastSeen: '24 Apr 2024 14:32',
            ping: '1 ms',
            uptime: '99.9%',
            method: 'Ping & SNMP',
            pic: 'Ananda Dwi Susanti',
            installDate: '15 Jan 2024',
            value: 'Rp 6.800.000',
            condition: 'Baik',
            warranty: 'Hingga Mar 2026'
        },
        {
            id: 'DEV-016',
            code: 'WIFI-MO-03',
            name: 'WIFI-MO-03',
            category: 'Lainnya',
            district: 'Sananwetan',
            location: 'Ruang Divisi MO',
            lat: -8.08640,
            lng: 112.16460,
            ip: '192.168.10.3',
            mac: '00:1B:44:99:88:03',
            status: 'online',
            lastSeen: '24 Apr 2024 14:26',
            ping: '15 ms',
            uptime: '97.8%',
            method: 'Ping (ICMP)',
            pic: 'Budi Santoso',
            installDate: '16 Jan 2024',
            value: 'Rp 3.500.000',
            condition: 'Baik',
            warranty: 'Hingga Apr 2025'
        }
    ],

    // Riwayat Insiden & Notifikasi (Fokus Wilayah Blitar)
        alerts: [
        { id: 'ALT-101', time: '14:22', title: 'CCTV-HO-01 Offline', location: 'Gerbang Depan HO', level: 'kritis', read: false },
        { id: 'ALT-102', time: '13:48', title: 'CPU Tinggi 92% SRV-APP-02', location: 'Data Center HO', level: 'peringatan', read: false },
        { id: 'ALT-103', time: '11:24', title: 'Router-MO-02 Latensi 68ms', location: 'Ruang Marketing MO', level: 'peringatan', read: false },
        { id: 'ALT-104', time: '10:17', title: 'Suhu Server Naik 32.8°C', location: 'Ruang Server HO', level: 'peringatan', read: false },
        { id: 'ALT-105', time: '09:03', title: 'Baterai UPS 22%', location: 'Panel Listrik HO', level: 'peringatan', read: false }
    ],

    teamMembers: [],

    charts: {
        trendChart: null,
        categoryDonut: null
    }
};

// =============================================================================
// INISIALISASI
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initClock();
    loadTeamData();
    renderHomeDevicesTable();
    renderFullDevicesTable();
    renderAssetsTable();
    renderAlerts();
    renderTeamCards();
    renderBlitarNodesList();

    // Inisialisasi Peta Leaflet Blitar setelah DOM siap
    setTimeout(() => {
        initBlitarMaps();
    }, 150);

    // Cek URL params (?role=admin atau ?role=guest)
    const urlParams = new URLSearchParams(window.location.search);
    const paramRole = urlParams.get('role');
    if (paramRole === 'admin' || paramRole === 'superadmin') {
        loginSuccess({
            username: 'superadmin',
            name: 'Ahmad Rizki',
            role: 'superadmin',
            title: 'Administrator'
        });
        return;
    } else if (paramRole === 'guest' || paramRole === 'tamu') {
        enterAsGuest();
        return;
    }

    // Cek sesi tersimpan
    const saved = sessionStorage.getItem('taims_session');
    if (saved) {
        try {
            const user = JSON.parse(saved);
            loginSuccess(user);
        } catch (e) {
            sessionStorage.removeItem('taims_session');
        }
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
    }

    // Update class active di sidebar: Hanya item yang cocok persis yang aktif!
    document.querySelectorAll('.sidebar .nav-item').forEach(item => {
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Handle aksi spesifik setiap halaman & kontrol scroll
    const mainEl = document.querySelector('.main-content');
    const contentEl = document.querySelector('.content-container');
    if (pageId === 'page-dashboard') {
        if (mainEl) mainEl.style.overflow = 'hidden';
        if (contentEl) contentEl.style.overflow = 'hidden';
        setTimeout(() => {
            initCharts();
            if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize();
        }, 80);
    } else {
        if (mainEl) mainEl.style.overflow = 'auto';
        if (contentEl) contentEl.style.overflow = 'auto';
        if (pageId === 'page-location') {
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
            renderFullDevicesTable();
        } else if (pageId === 'page-project-info') {
            renderTeamCards();
        }
    }

    // Tutup mobile sidebar jika terbuka
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.remove('mobile-open');

    // Scroll ke atas halaman
    if (mainEl) mainEl.scrollTop = 0;
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    if (sidebar) sidebar.classList.toggle('mobile-open');
}

// =============================================================================
// AUTENTIKASI: LOGIN ADMIN VS TAMU
// =============================================================================
function handleLogin() {
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    const alertBox = document.getElementById('auth-alert');
    const alertText = document.getElementById('auth-alert-text');

    if ((u.toLowerCase().includes('admin') || u.toLowerCase() === 'superadmin') && p === 'admin123') {
        loginSuccess({
            username: u,
            name: 'Ahmad Rizki',
            role: 'superadmin',
            title: 'Administrator'
        });
    } else if (u.toLowerCase().includes('operator') && p === 'operator123') {
        loginSuccess({
            username: u,
            name: 'Siswa Elektro PKL',
            role: 'admin',
            title: 'Operator Elektro'
        });
    } else {
        alertBox.classList.remove('hidden');
        alertText.textContent = 'Email/Username atau sandi tidak cocok!';
        setTimeout(() => alertBox.classList.add('hidden'), 4000);
    }
}

function enterAsGuest() {
    loginSuccess({
        username: 'guest',
        name: 'Tamu / Viewer',
        role: 'guest',
        title: 'Viewer (Hanya Lihat)'
    });
}

function loginSuccess(user) {
    APP_STATE.currentUser = user;
    sessionStorage.setItem('taims_session', JSON.stringify(user));

    // Update UI Tampilan
    const topName = document.getElementById('topbar-user-name');
    const topRole = document.getElementById('topbar-user-role');
    const dropName = document.getElementById('dropdown-user-name');
    const dropRole = document.getElementById('dropdown-user-role');
    const bannerBadge = document.getElementById('banner-role-badge');

    if (topName) topName.textContent = user.name;
    if (topRole) topRole.textContent = user.title;
    if (dropName) dropName.textContent = user.name;
    if (dropRole) dropRole.textContent = user.title;

    // Batasi tombol jika mode Tamu
    const adminBtns = document.querySelectorAll('.admin-only');
    if (user.role === 'guest') {
        if (bannerBadge) {
            bannerBadge.innerHTML = '<i class="fa-solid fa-eye text-yellow"></i> Mode Tamu (Hanya Melihat)';
            bannerBadge.style.color = 'var(--tekno-gold)';
        }
        adminBtns.forEach(b => b.classList.add('hidden'));
        showToast('Mode Tamu Aktif', 'Anda masuk sebagai Tamu. Klik profil di kanan atas untuk kembali ke login admin.', 'info');
    } else {
        if (bannerBadge) {
            bannerBadge.innerHTML = '<i class="fa-solid fa-shield-halved text-cyan"></i> ' + user.title + ' (Kontrol Penuh)';
            bannerBadge.style.color = 'var(--cyan-neon)';
        }
        adminBtns.forEach(b => b.classList.remove('hidden'));
        showToast('Login Berhasil!', `Selamat datang, ${user.name}. Akses manajemen aktif.`, 'success');
    }

    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');

    initCharts();
}

function logoutToAuth() {
    sessionStorage.removeItem('taims_session');
    APP_STATE.currentUser = null;
    document.getElementById('login-password').value = '';

    document.getElementById('main-dashboard').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');

    // Tutup dropdown menu
    const menu = document.getElementById('user-menu-dropdown');
    if (menu) menu.classList.add('hidden');

    showToast('Kembali ke Login', 'Silakan masukkan username dan sandi yang benar.', 'info');
}

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
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        const tStr = `${h}:${m}:${s}`;

        const dStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

        const dEl = document.getElementById('live-date');
        const tEl = document.getElementById('live-time');
        if (dEl) dEl.textContent = dStr;
        if (tEl) tEl.textContent = tStr;
    }
    tick();
    setInterval(tick, 1000);
}

// =============================================================================
// TABEL MOCKUP DASHBOARD UTAMA (PERSIS SEPERTI GAMBAR REFERENSI)
// =============================================================================
function renderHomeDevicesTable() {
    const tbody = document.getElementById('home-devices-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    // Ambil 6 perangkat pertama sesuai mockup
    const items = APP_STATE.devices.slice(0, 6);

    items.forEach(dev => {
        const tr = document.createElement('tr');
        tr.onclick = () => openDeviceDetailModal(dev.id);

        let icon = 'fa-server';
        if (dev.category === 'Network Device') icon = 'fa-network-wired';
        else if (dev.category === 'CCTV & Security') icon = 'fa-video';
        else if (dev.category === 'IoT Sensor') icon = 'fa-microchip';

        let badge = '';
        if (dev.status === 'online') badge = '<span class="status-pill online"><span class="dot green"></span> Online</span>';
        else if (dev.status === 'warning') badge = '<span class="status-pill warning"><span class="dot yellow"></span> Peringatan</span>';
        else badge = '<span class="status-pill offline"><span class="dot red"></span> Offline</span>';

        tr.innerHTML = `
            <td>
                <span class="device-name-text"><i class="fa-solid ${icon} text-muted mr-1"></i> ${dev.name}</span>
            </td>
            <td>${dev.location}</td>
            <td><span class="ip-mono">${dev.ip}</span></td>
            <td>${badge}</td>
            <td><span class="text-muted text-sm">${dev.lastSeen}</span></td>
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
function renderFullDevicesTable() {
    const tbody = document.getElementById('full-devices-tbody');
    if (!tbody) return;

    const q = (document.getElementById('dev-page-search')?.value || '').toLowerCase();
    const cat = document.getElementById('filter-category')?.value || 'all';
    const stat = document.getElementById('filter-status-select')?.value || 'all';

    const filtered = APP_STATE.devices.filter(d => {
        const matchQ = !q || d.name.toLowerCase().includes(q) || d.ip.includes(q) || d.code.toLowerCase().includes(q) || d.pic.toLowerCase().includes(q);
        const matchCat = cat === 'all' || d.category === cat;
        const matchStat = stat === 'all' || d.status === stat;
        return matchQ && matchCat && matchStat;
    });

    tbody.innerHTML = '';

    filtered.forEach((dev, index) => {
        const tr = document.createElement('tr');
        tr.onclick = () => openDeviceDetailModal(dev.id);

        let badge = '';
        if (dev.status === 'online') badge = '<span class="status-pill online"><span class="dot green"></span> Online</span>';
        else if (dev.status === 'warning') badge = '<span class="status-pill warning"><span class="dot yellow"></span> Warning</span>';
        else badge = '<span class="status-pill offline"><span class="dot red"></span> Offline</span>';

        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><span class="ip-mono">${dev.code}</span></td>
            <td><strong>${dev.name}</strong></td>
            <td>${dev.category}</td>
            <td>${badge}</td>
            <td><span class="ip-mono">${dev.ip}</span></td>
            <td>${dev.location}</td>
            <td>${dev.method}</td>
            <td>${dev.pic}</td>
            <td class="text-right" onclick="event.stopPropagation()">
                <button class="btn btn-outline-cyber btn-sm" onclick="openDeviceDetailModal('${dev.id}')">Detail</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

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
    const dev = APP_STATE.devices.find(d => d.id === deviceId);
    if (!dev) return;

    APP_STATE.selectedDeviceId = deviceId;

    document.getElementById('detail-dev-name').textContent = dev.name;
    document.getElementById('detail-dev-code').textContent = `KODE ASET: ${dev.code}`;
    document.getElementById('detail-dev-category').textContent = dev.category;
    document.getElementById('detail-dev-ip').textContent = dev.ip;
    document.getElementById('detail-dev-mac').textContent = dev.mac;
    document.getElementById('detail-dev-location').textContent = dev.location;
    document.getElementById('detail-dev-pic').textContent = dev.pic;
    document.getElementById('detail-dev-method').textContent = dev.method;
    document.getElementById('detail-dev-lastseen').textContent = dev.lastSeen;
    document.getElementById('detail-dev-ping').textContent = dev.ping;

    const badgeWrap = document.getElementById('detail-dev-status-badge');
    if (dev.status === 'online') {
        badgeWrap.innerHTML = '<span class="status-pill online text-lg"><span class="dot green pulse"></span> ONLINE (AKTIF)</span>';
    } else if (dev.status === 'warning') {
        badgeWrap.innerHTML = '<span class="status-pill warning text-lg"><span class="dot yellow pulse"></span> WARNING (PERINGATAN)</span>';
    } else {
        badgeWrap.innerHTML = '<span class="status-pill offline text-lg"><span class="dot red pulse"></span> OFFLINE (MATI)</span>';
    }

    document.getElementById('device-detail-modal').classList.remove('hidden');
}

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
        showToast('Akses Terkunci (Mode Tamu)', 'Harap login sebagai Administrator untuk mengubah status alat elektro.', 'error');
        return;
    }

    const dev = APP_STATE.devices.find(d => d.id === deviceId);
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

    const dev = APP_STATE.devices.find(d => d.id === APP_STATE.selectedDeviceId);
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
// MODAL TAMBAH PERANGKAT BARU (ADMIN ONLY)
// =============================================================================
function openAddDeviceModal() {
    if (APP_STATE.currentUser && APP_STATE.currentUser.role === 'guest') {
        showToast('Akses Dibatasi', 'Mode Tamu tidak dapat menambah perangkat. Silakan login sebagai Admin.', 'error');
        return;
    }
    document.getElementById('device-form').reset();
    document.getElementById('device-modal').classList.remove('hidden');
}

function closeDeviceModal() {
    document.getElementById('device-modal').classList.add('hidden');
}

function handleSaveDevice() {
    const name = document.getElementById('dev-name').value.trim();
    const category = document.getElementById('dev-category').value;
    const ip = document.getElementById('dev-ip').value.trim();
    const location = document.getElementById('dev-location').value.trim();
    const method = document.getElementById('dev-method').value;
    const status = document.getElementById('dev-status').value;
    const pic = document.getElementById('dev-pic').value.trim() || 'Teknisi PKL';

    const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
    const newDev = {
        id: `DEV-${num}`,
        code: `AST-${category.slice(0,3).toUpperCase()}-${num}`,
        name,
        category,
        location,
        ip,
        mac: '00:1B:44:' + Math.floor(Math.random()*89+10) + ':AA:' + Math.floor(Math.random()*89+10),
        status,
        lastSeen: 'Baru saja',
        ping: '10 ms',
        uptime: '100%',
        method,
        pic,
        installDate: 'Hari ini'
    };

    APP_STATE.devices.unshift(newDev);
    renderHomeDevicesTable();
    renderFullDevicesTable();
    closeDeviceModal();
    showToast('Perangkat Didaftarkan', `${name} (${ip}) berhasil disimpan.`, 'success');
}

// =============================================================================
// RIWAYAT GANGGUAN & NOTIFIKASI
// =============================================================================
function renderAlerts() {
    // 1. Dashboard Mockup List
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

    // 2. Full Alerts Page List
    const fullList = document.getElementById('full-alerts-container');
    if (fullList) {
        fullList.innerHTML = '';
        APP_STATE.alerts.forEach(alt => {
            const item = document.createElement('div');
            item.className = 'alert-row p-3';
            item.innerHTML = `
                <span class="a-time text-base">${alt.time} WIB</span>
                <div class="a-body">
                    <strong class="text-base">${alt.title}</strong>
                    <span class="text-secondary"><i class="fa-solid fa-location-dot"></i> ${alt.location}</span>
                </div>
                <span class="a-badge ${alt.level}">${alt.level === 'kritis' ? 'Gangguan Kritis' : 'Peringatan'}</span>
            `;
            fullList.appendChild(item);
        });
    }

    // 3. Dropdown List
    const dropList = document.getElementById('notif-items-list');
    if (dropList) {
        dropList.innerHTML = '';
        APP_STATE.alerts.slice(0, 4).forEach(alt => {
            const div = document.createElement('div');
            div.className = 'notif-item';
            div.innerHTML = `
                <span class="dot ${alt.level === 'kritis' ? 'red' : 'yellow'}"></span>
                <div class="notif-text">
                    <strong>${alt.title}</strong>
                    <span>${alt.location} &bull; ${alt.time} WIB</span>
                </div>
            `;
            dropList.appendChild(div);
        });
    }

    const count = APP_STATE.alerts.filter(a => !a.read).length;
    const badgeSidebar = document.getElementById('sidebar-alert-badge');
    const badgeTop = document.getElementById('topbar-alert-count');
    const unreadEl = document.getElementById('notif-unread-count');

    if (badgeSidebar) badgeSidebar.textContent = count;
    if (badgeTop) badgeTop.textContent = count;
    if (unreadEl) unreadEl.textContent = `${count} Baru`;
}

function markAllAlertsRead() {
    APP_STATE.alerts.forEach(a => a.read = true);
    renderAlerts();
    showToast('Notifikasi', 'Semua peringatan telah ditandai sebagai dibaca.', 'info');
}

function addAlertLog(title, location, level) {
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
// MODUL PETA GIS AREA BLITAR & GEOLOKASI (LEAFLET + FALLBACK)
// =============================================================================
function initBlitarMaps() {
    if (typeof L === 'undefined') {
        console.warn('Leaflet library belum dimuat, menggunakan fallback.');
        return;
    }

    const blitarCenter = [-8.0983, 112.1681]; // Alun-Alun Kota Blitar

    // 1. Inisialisasi Peta Mini di Dashboard (#home-blitar-map)
    const homeEl = document.getElementById('home-blitar-map');
    if (homeEl && !APP_STATE.homeMap) {
        try {
            APP_STATE.homeMap = L.map('home-blitar-map', {
                preferCanvas: true,
                center: [-8.0988, 112.1652],
                zoom: 13,
                zoomControl: false,
                attributionControl: false
            });

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap'
            }).addTo(APP_STATE.homeMap);

            L.control.zoom({ position: 'bottomright' }).addTo(APP_STATE.homeMap);

            // Tambahkan markers ke Home Map
            APP_STATE.homeMarkers = [];
            APP_STATE.devices.forEach(dev => {
                const iconHtml = `<div class="blitar-marker-pin ${dev.status}"><div class="pin-radar"></div><div class="pin-core"></div></div>`;
                const customIcon = L.divIcon({
                    html: iconHtml,
                    className: 'custom-blitar-icon',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });

                const marker = L.marker([dev.lat, dev.lng], { icon: customIcon }).addTo(APP_STATE.homeMap);
                marker.on('click', () => {
                    selectMapNode(dev.name, `${dev.ip} (${dev.district})`, `${dev.lat.toFixed(4)}, ${dev.lng.toFixed(4)}`, `${dev.ping} • ${dev.status.toUpperCase()}`);
                });
                APP_STATE.homeMarkers.push(marker);
            });

            setTimeout(() => { if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize(); }, 200);
            setTimeout(() => { if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize(); }, 600);

        } catch (e) {
            console.error('Gagal inisialisasi home map:', e);
        }
    }

    // 2. Inisialisasi Peta Lengkap di Halaman Lokasi (#full-blitar-map)
    const fullEl = document.getElementById('full-blitar-map');
    if (fullEl && !APP_STATE.fullMap) {
        try {
            APP_STATE.fullMap = L.map('full-blitar-map', {
                center: blitarCenter,
                zoom: 12,
                attributionControl: false
            });

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap'
            }).addTo(APP_STATE.fullMap);

            // Klik di mana saja pada peta Blitar untuk mendapatkan koordinat presisi
            APP_STATE.fullMap.on('click', (e) => {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                APP_STATE.activeCoord = { lat, lng };

                const coordText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                const el = document.getElementById('active-map-coord');
                if (el) el.textContent = coordText;

                // Tampilkan marker sementara inspector
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
                        <strong class="text-yellow"><i class="fa-solid fa-location-crosshairs"></i> Titik Koordinat Baru:</strong>
                        <div class="popup-coord-pill my-1">${coordText}</div>
                        <p class="text-xs text-muted mb-2">Wilayah Blitar, Jawa Timur</p>
                        <button onclick="copyCoordinates(${lat}, ${lng})" class="btn-sm btn-outline-cyber w-full py-1">
                            <i class="fa-solid fa-copy"></i> Salin Titik Ini
                        </button>
                    </div>
                `).openPopup();

                showToast('Titik Koordinat Terdeteksi', `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`, 'info');
            });

            renderBlitarMapMarkers();
        } catch (e) {
            console.error('Gagal inisialisasi full map:', e);
        }
    }
}

function renderBlitarMapMarkers(filteredDevices = null) {
    if (!APP_STATE.fullMap) return;

    // Bersihkan marker lama
    APP_STATE.fullMarkers.forEach(m => APP_STATE.fullMap.removeLayer(m));
    APP_STATE.fullMarkers = [];

    const devs = filteredDevices || APP_STATE.devices;

    devs.forEach(dev => {
        const iconHtml = `<div class="blitar-marker-pin ${dev.status}"><div class="pin-radar"></div><div class="pin-core"></div></div>`;
        const customIcon = L.divIcon({
            html: iconHtml,
            className: 'custom-blitar-icon',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const statusLabel = dev.status === 'online' ? '<span class="text-green">ONLINE</span>' : (dev.status === 'warning' ? '<span class="text-yellow">WARNING</span>' : '<span class="text-red">OFFLINE</span>');

        const marker = L.marker([dev.lat, dev.lng], { icon: customIcon }).addTo(APP_STATE.fullMap);
        marker.bindPopup(`
            <div style="font-family: inherit; min-width: 220px;">
                <div class="popup-cyber-title">
                    <span>${dev.name}</span>
                    <small class="font-mono text-cyan">${dev.code}</small>
                </div>
                <div class="popup-coord-pill">
                    <i class="fa-solid fa-location-crosshairs"></i> ${dev.lat.toFixed(4)}, ${dev.lng.toFixed(4)}
                </div>
                <div style="font-size: 0.74rem; color: #94A3B8; margin: 4px 0;">
                    <div><i class="fa-solid fa-map-pin text-cyan"></i> <strong>${dev.district}</strong> - ${dev.location}</div>
                    <div><i class="fa-solid fa-network-wired text-muted"></i> IP: <span class="font-mono text-white">${dev.ip}</span> (${dev.ping})</div>
                    <div><i class="fa-solid fa-circle-dot text-muted"></i> Status: ${statusLabel}</div>
                    <div><i class="fa-solid fa-user-gear text-muted"></i> PIC: <strong>${dev.pic}</strong></div>
                </div>
                <div style="display: flex; gap: 6px; margin-top: 8px;">
                    <button onclick="copyCoordinates(${dev.lat}, ${dev.lng})" class="btn-sm btn-outline-cyber py-1 flex-1">
                        <i class="fa-solid fa-copy"></i> Salin Koordinat
                    </button>
                    <button onclick="openDeviceDetail('${dev.id}')" class="btn-sm btn-primary-cyber py-1 flex-1">
                        <i class="fa-solid fa-eye"></i> Detail
                    </button>
                </div>
            </div>
        `);

        marker.on('click', () => {
            const el = document.getElementById('active-map-coord');
            if (el) el.textContent = `${dev.lat.toFixed(5)}, ${dev.lng.toFixed(5)}`;
            APP_STATE.activeCoord = { lat: dev.lat, lng: dev.lng };
        });

        APP_STATE.fullMarkers.push(marker);
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
    const dev = APP_STATE.devices.find(d => d.id === deviceId);
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
    renderBlitarMapMarkers(filtered);
}

function resetHomeBlitarView() {
    if (APP_STATE.homeMap) {
        APP_STATE.homeMap.setView([-8.0988, 112.1652], 13);
        showToast('Reset Tampilan', 'Peta Dashboard kembali ke pusat Blitar.', 'info');
    }
}

function resetFullBlitarView() {
    if (APP_STATE.fullMap) {
        APP_STATE.fullMap.setView([-8.0983, 112.1681], 12);
        const el = document.getElementById('blitar-district-filter');
        if (el) el.value = 'all';
        const st = document.getElementById('blitar-status-filter');
        if (st) st.value = 'all';
        const sr = document.getElementById('blitar-node-search');
        if (sr) sr.value = '';
        renderBlitarNodesList();
        renderBlitarMapMarkers();
        showToast('Pusat Blitar', 'Peta di-reset ke wilayah seluruh Blitar.', 'info');
    }
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
                    <button class="btn-sm btn-outline-cyber" onclick="openAssetQrModal('${dev.code}', '${dev.name}', '${dev.district}')" title="Cetak Label QR Tag">
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
    if (APP_STATE.currentUser && APP_STATE.currentUser.role === 'guest') {
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
    const code = document.getElementById('ast-code').value.trim();
    const name = document.getElementById('ast-name').value.trim();
    const category = document.getElementById('ast-category').value;
    const location = document.getElementById('ast-location').value.trim();
    const value = document.getElementById('ast-value').value.trim() || 'Rp 10.000.000';
    const condition = document.getElementById('ast-condition').value;
    const warranty = document.getElementById('ast-warranty').value.trim() || 'Hingga Des 2026';
    const pic = document.getElementById('ast-pic').value.trim() || 'Tim Elektro';

    const num = String(APP_STATE.devices.length + 1).padStart(3, '0');
    const newDev = {
        id: `DEV-${num}`,
        code,
        name,
        category,
        district: location.split(',')[0].trim() || 'Kota Blitar',
        location: `${location}, Blitar`,
        lat: -8.0988 + (Math.random() - 0.5) * 0.05,
        lng: 112.1652 + (Math.random() - 0.5) * 0.05,
        ip: `192.168.1.${Math.floor(Math.random()*150+50)}`,
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
    renderAssetsTable();
    renderHomeDevicesTable();
    renderFullDevicesTable();
    renderBlitarNodesList();
    renderBlitarMapMarkers();
    closeAssetModal();
    showToast('Aset Terdaftar!', `Aset ${name} (${code}) berhasil disimpan ke database.`, 'success');
}

function openAssetQrModal(code, name, loc) {
    document.getElementById('qr-modal-code').textContent = code;
    document.getElementById('qr-modal-name').textContent = name;
    document.getElementById('qr-modal-loc').textContent = `Wilayah: ${loc}, Blitar`;
    document.getElementById('asset-qr-modal')?.classList.remove('hidden');
}

function closeAssetQrModal() {
    document.getElementById('asset-qr-modal')?.classList.add('hidden');
}

function printAssetLabel() {
    showToast('Cetak Label', 'Mengirim perintah cetak label barcode & QR Tag ke printer...', 'info');
    setTimeout(() => {
        window.print();
    }, 400);
}

function exportAssetsList() {
    showToast('Ekspor Data Aset', 'Mengunduh rekapitulasi data inventaris aset IT (CSV/Excel)...', 'success');
}

// =============================================================================
// MODUL INFORMASI PROJEK & DATA TIM KAMI (PAGE-PROJECT-INFO)
// =============================================================================
function loadTeamData() {
    try {
        const saved = localStorage.getItem('taims_team_members');
        if (saved) {
            APP_STATE.teamMembers = JSON.parse(saved);
        } else {
            APP_STATE.teamMembers = [...DEFAULT_TEAM_MEMBERS];
        }
    } catch (e) {
        APP_STATE.teamMembers = [...DEFAULT_TEAM_MEMBERS];
    }
}

function saveTeamData() {
    try {
        localStorage.setItem('taims_team_members', JSON.stringify(APP_STATE.teamMembers));
    } catch (e) {
        console.error('Gagal menyimpan team data:', e);
    }
}

function renderTeamCards() {
    const grid = document.getElementById('team-cards-container');
    if (!grid) return;

    grid.innerHTML = '';
    APP_STATE.teamMembers.forEach(tm => {
        const card = document.createElement('div');
        card.className = 'team-card';

        const skillsHtml = (tm.skills || []).map(s => `<span class="skill-chip">${s}</span>`).join('');

        card.innerHTML = `
            <div>
                <div class="tc-top">
                    <div class="tc-avatar" style="color: ${tm.avatarColor || '#00E5FF'};">
                        <i class="fa-solid ${tm.avatarIcon || 'fa-user'}"></i>
                    </div>
                    <div class="tc-info">
                        <h4 class="tc-name">${tm.name}</h4>
                        <span class="tc-role">${tm.role}</span>
                        <span class="tc-nisn"><i class="fa-solid fa-id-card"></i> NISN: ${tm.nisn}</span>
                    </div>
                </div>
                <p class="tc-desc">${tm.responsibilities}</p>
                <div class="tc-skills">${skillsHtml}</div>
            </div>
            <div class="tc-footer">
                <span class="text-muted"><i class="fa-solid fa-envelope"></i> ${tm.contact || '-'}</span>
                <button class="btn-sm btn-outline-cyber admin-only" onclick="openEditTeamMemberModal('${tm.id}')">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function switchProjSection(secId) {
    document.querySelectorAll('.proj-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.proj-section-panel').forEach(p => p.classList.remove('active'));

    const btn = event?.currentTarget;
    if (btn) btn.classList.add('active');

    const panel = document.getElementById(`proj-sec-${secId}`);
    if (panel) panel.classList.add('active');
}

function openAddTeamMemberModal() {
    document.getElementById('team-member-form').reset();
    document.getElementById('tm-id').value = '';
    document.getElementById('team-modal-title').textContent = 'Tambah Anggota Tim Baru';
    document.getElementById('team-modal').classList.remove('hidden');
}

function openEditTeamMemberModal(id) {
    const member = APP_STATE.teamMembers.find(m => m.id === id);
    if (!member) return;

    document.getElementById('tm-id').value = member.id;
    document.getElementById('tm-name').value = member.name;
    document.getElementById('tm-nisn').value = member.nisn;
    document.getElementById('tm-role').value = member.role;
    document.getElementById('tm-contact').value = member.contact || '';
    document.getElementById('tm-responsibilities').value = member.responsibilities;
    document.getElementById('tm-skills').value = (member.skills || []).join(', ');

    document.getElementById('team-modal-title').textContent = `Edit Profil: ${member.name}`;
    document.getElementById('team-modal').classList.remove('hidden');
}

function closeTeamModal() {
    document.getElementById('team-modal').classList.add('hidden');
}

function handleSaveTeamMember() {
    const id = document.getElementById('tm-id').value;
    const name = document.getElementById('tm-name').value.trim();
    const nisn = document.getElementById('tm-nisn').value.trim();
    const role = document.getElementById('tm-role').value.trim();
    const contact = document.getElementById('tm-contact').value.trim();
    const responsibilities = document.getElementById('tm-responsibilities').value.trim();
    const skills = document.getElementById('tm-skills').value.split(',').map(s => s.trim()).filter(Boolean);

    if (id) {
        // Edit anggota ada
        const member = APP_STATE.teamMembers.find(m => m.id === id);
        if (member) {
            member.name = name;
            member.nisn = nisn;
            member.role = role;
            member.contact = contact;
            member.responsibilities = responsibilities;
            member.skills = skills;
        }
    } else {
        // Tambah baru
        const newId = `TM-${Date.now().toString().slice(-4)}`;
        APP_STATE.teamMembers.push({
            id: newId,
            name,
            nisn,
            role,
            contact,
            responsibilities,
            skills,
            avatarIcon: 'fa-user-astronaut',
            avatarColor: '#F59E0B'
        });
    }

    saveTeamData();
    renderTeamCards();
    closeTeamModal();
    showToast('Data Tim Disimpan!', `Profil ${name} berhasil diperbarui.`, 'success');
}

function resetTeamDataPrompt() {
    if (confirm('Kembalikan susunan tim ke data anggota bawaan proyek?')) {
        APP_STATE.teamMembers = [...DEFAULT_TEAM_MEMBERS];
        saveTeamData();
        renderTeamCards();
        showToast('Tim Di-reset', 'Data tim telah dikembalikan ke pengaturan awal.', 'info');
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
function initCharts() {
    // 1. Line Chart: Tren Status Perangkat
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
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#64748B', font: { size: 9 } }, min: 0, max: 18, stepSize: 3 }
                }
            }
        });
    }

    // 2. Donut Chart: Distribusi Kategori
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
                cutout: '58%',
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
    showToast('Rentang Waktu', `Grafik diubah ke rentang ${val === '1' ? '24 Jam' : val + ' Hari'}.`, 'info');
}

// =============================================================================
// TOAST NOTIFIKASI
// =============================================================================
let toastTimer = null;
function showToast(title, msg, type = 'info') {
    const toast = document.getElementById('toast-notification');
    const tTitle = document.getElementById('toast-title');
    const tMsg = document.getElementById('toast-message');
    const tIcon = document.getElementById('toast-icon');

    if (!toast) return;
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

function exportReport(format) {
    showToast('Export Dokumen', `Menghasilkan file Laporan T-AIMS ${format}... Unduhan siap.`, 'success');
}


// =============================================================================
// ASISTEN AI INFRASTRUCTURE (PDF HAL. 4 & HAL. 11)
// =============================================================================
function openAiModal() {
    const modal = document.getElementById('ai-assistant-modal');
    if (modal) {
        modal.classList.remove('hidden');
        loadAiRecommendation();
    }
}

function closeAiModal() {
    const modal = document.getElementById('ai-assistant-modal');
    if (modal) modal.classList.add('hidden');
}

async function loadAiRecommendation(isManual = false) {
    const spin = document.getElementById('ai-modal-spin');
    if (spin) spin.classList.add('fa-spin');

    try {
        if (typeof getAiRecommendation === 'function') {
            const res = await getAiRecommendation();
            if (res && res.data) {
                const prob = document.getElementById('ai-modal-problem');
                const rec = document.getElementById('ai-modal-recommendation');
                if (prob && res.data.troubled_devices) {
                    prob.innerText = `Perangkat ${res.data.troubled_devices} berstatus ${res.data.status_network}.`;
                }
                if (rec && res.data.recommendation) {
                    rec.innerHTML = res.data.recommendation.replace(/\n/g, '<br>');
                }
            }
        }
        if (isManual) {
            showToast('AI Diagnostik Selesai', 'Rekomendasi otomatis dimutakhirkan berdasarkan status 16 perangkat.', 'success');
        }
    } catch (e) {
        console.warn("AI error:", e);
    } finally {
        if (spin) spin.classList.remove('fa-spin');
    }
}

// =============================================================================
// EXPORT EXCEL REAL (CSV UTF-8 BOM) & PDF EXPORT (PDF HAL. 4 & 16)
// =============================================================================
function exportReport(format) {
    if (format === 'pdf') {
        window.print();
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
    // 1. Cek hash URL (misal #page-reports, #page-devices)
    const hash = window.location.hash.replace('#', '');
    const validPages = ['page-dashboard', 'page-devices', 'page-monitoring', 'page-location', 'page-alerts', 'page-reports', 'page-project-info', 'page-users', 'page-settings'];
    
    if (hash && validPages.includes(hash)) {
        enterAsGuest();
        setTimeout(() => switchPage(hash), 50);
    } else {
        // Cek apakah ada sesi login sebelumnya
        const saved = sessionStorage.getItem('taims_session');
        if (saved) {
            try {
                loginSuccess(JSON.parse(saved));
            } catch (e) {
                // Biarkan auth screen
            }
        }
    }
});

// Update URL Hash saat ganti halaman
const origSwitchPage = switchPage;
switchPage = function(pageId) {
    window.location.hash = pageId;
    origSwitchPage(pageId);
};

// Auto-adjust leaflet map on window resize
window.addEventListener('resize', () => {
    if (APP_STATE.homeMap) APP_STATE.homeMap.invalidateSize();
    if (APP_STATE.fullMap) APP_STATE.fullMap.invalidateSize();
});

// Fitur Ganti Bahasa (ID / EN) di Bawah Sidebar Sesuai Gambar Referensi
function setLanguage(lang) {
    APP_STATE.currentLang = lang;
    const btnId = document.getElementById('lang-btn-id');
    const btnEn = document.getElementById('lang-btn-en');
    const statusText = document.getElementById('footer-status-text');

    if (btnId && btnEn) {
        if (lang === 'id') {
            btnId.classList.add('active');
            btnEn.classList.remove('active');
            if (statusText) statusText.textContent = 'Sistem Online';
            if (typeof showToast === 'function') showToast('Bahasa dialihkan ke Bahasa Indonesia', 'info');
        } else {
            btnEn.classList.add('active');
            btnId.classList.remove('active');
            if (statusText) statusText.textContent = 'System Online';
            if (typeof showToast === 'function') showToast('Language switched to English', 'info');
        }
    }
}

