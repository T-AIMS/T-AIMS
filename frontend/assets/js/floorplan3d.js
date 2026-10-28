/**
 * =============================================================================
 * T-AIMS 3D DIGITAL TWIN & REALISTIC ARCHITECTURAL ENGINE
 * Model Realistis Arsitektural T-AIMS untuk 3 Lokasi (HO, MO, & House of Server)
 * Konsep & Desain Arsitektural: Ahmad Aziz (UI/UX & Data Visualization Engineer)
 * Implementasi & Integrasi Web: Dika Yoga Pratama (Frontend Dashboard Developer)
 * =============================================================================
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // STATE GLOBAL ENGINE 3D
    // -------------------------------------------------------------------------
    const FP3D = {
        initialized: false,
        stage: null,
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        animId: null,

        // Status Fitur
        currentSite: 'ho',     // 'ho' | 'mo' | 'hs'
        currentView: 'front',  // 'front' | 'street' | 'top' | 'cctv'
        isRoofRemoved: false,  // false: Atap terpasang, true: Lepas Atap
        isNightMode: false,
        isAutoRotate: false,
        showPins: true,

        // Grup Objek 3D per Site
        siteGroups: { ho: null, mo: null, hs: null },
        roofGroups: { ho: null, mo: null, hs: null },

        // Komponen Lingkungan & Animasi
        activeBuildingGroup: null,
        activeRoofGroup: null,
        activePinsGroup: null,
        cctvCones: {},
        blinkingLeds: [],
        pulsingPins: [],
        dataPackets: [],
        rotatingCrystals: [],
        isDroneTourActive: false,
        droneTourStep: 0,
        droneTourTimer: null,
        cyberStreamsGroup: null,
        nightLights: [],
        dayLights: [],

        // Pencahayaan
        ambientLight: null,
        dirLight: null,
        hemiLight: null,
        streetLight: null,
        porchLight: null,
        carLightL: null,
        carLightR: null,

        // Root Kampus Terpadu (Semua Gedung Berada dalam 1 Kawasan)
        campusRoot: null,
        campusEnvGroup: null,

        // Raycaster & Pin Management per Site
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        pinMeshes: [],
        sitePinMeshes: { ho: [], mo: [], hs: [], all: [] },

        // Metadata Kawasan Kampus Terpadu & 3 Zona Gedung (15 Aset Terkalibrasi 100% Sinkron Denah 2D CAD)
        siteData: {
            all: {
                name: 'Kawasan Terpadu Teknolab',
                location: 'Kompleks Fasilitas Terpadu, Kota Blitar',
                badge: 'Kampus Terpadu',
                dims: '120.0 m × 80.0 m',
                camFront: { pos: [0, 42, 46], target: [0, 2, -3] },
                camStreet: { pos: [-38, 8.5, 20], target: [0, 2, -2] },
                camTop: { pos: [0, 68, 22], target: [0, 0, -3] },
                camCctv: { pos: [-34, 30, 32], target: [0, 2, -2] },
                devices: [
                    // Head Office (HO) - 7 Aset Sinkron Persis Denah 2D CAD
                    { code: 'PC-01', badge: 'PC-01 (3.1)', name: 'PC Head Office 01 - Titik 3.1', room: 'Workstation Staf & Display (HO)', ip: '192.168.1.2', status: 'offline', pos: [1.3, 1.4, -1.0], left2d: 71.0, top2d: 54.0, icon: 'fa-desktop', building: 'ho' },
                    { code: 'PC-02', badge: 'PC-02 (3.4)', name: 'PC Head Office 02 - Titik 3.4', room: 'Workstation Staf & Display (HO)', ip: '192.168.1.7', status: 'offline', pos: [-3.8, 1.4, -1.9], left2d: 54.0, top2d: 50.0, icon: 'fa-desktop', building: 'ho' },
                    { code: 'SMTV-01', badge: 'SMTV-01 (2)', name: 'Smart TV Head Office - Titik 2', room: 'Workstation Staf & Display (HO)', ip: '192.168.1.10', status: 'offline', pos: [-3.4, 1.8, -0.1], left2d: 55.5, top2d: 56.0, icon: 'fa-tv', building: 'ho' },
                    { code: 'RTR-01', badge: 'RTR-01 (6)', name: 'Router Head Office - Titik 6', room: 'Jaringan & Sensor IoT (HO)', ip: '192.168.1.1', status: 'offline', pos: [0.4, 1.8, -4.3], left2d: 66.0, top2d: 40.7, icon: 'fa-wifi', building: 'ho' },
                    { code: 'ESP-01', badge: 'ESP-01 (4)', name: 'ESP32 Head Office - Titik 4', room: 'Jaringan & Sensor IoT (HO)', ip: '192.168.1.15', status: 'offline', pos: [-5.2, 1.4, -4.8], left2d: 42.0, top2d: 38.7, icon: 'fa-microchip', building: 'ho' },
                    { code: 'RPI-01', badge: 'RPI-01 (5)', name: 'Raspberry Pi HO - Titik 5', room: 'Jaringan & Sensor IoT (HO)', ip: '192.168.1.20', status: 'offline', pos: [-0.2, 1.4, 2.4], left2d: 63.0, top2d: 65.0, icon: 'fa-microchip', building: 'ho' },
                    { code: 'CCTV-01', badge: 'CCTV-01 (1)', name: 'CCTV Head Office - Titik 1', room: 'Gerbang & Pengawasan (HO)', ip: '192.168.1.39', status: 'offline', pos: [-4.3, 2.0, 4.0], left2d: 49.5, top2d: 69.5, icon: 'fa-video', building: 'ho' },
                    // Marketing Office (MO) - 4 Aset Sinkron Persis Denah 2D CAD
                    { code: 'MKRT-01', badge: 'MKRT-01', name: 'Mikrotik Marketing', room: 'Routing & Gateway Jaringan (MO)', ip: '192.168.2.13', status: 'offline', pos: [-22.4, 2.4, -4.6], left2d: 78.5, top2d: 24.0, icon: 'fa-server', building: 'mo' },
                    { code: 'RTR-03', badge: 'RTR-03', name: 'Router Marketing 03', room: 'Routing & Gateway Jaringan (MO)', ip: '192.168.2.3', status: 'offline', pos: [-22.4, 1.8, -2.5], left2d: 78.5, top2d: 33.0, icon: 'fa-network-wired', building: 'mo' },
                    { code: 'RTR-02', badge: 'RTR-02', name: 'Router Marketing 02', room: 'Routing & Gateway Jaringan (MO)', ip: '192.168.0.1', status: 'offline', pos: [-22.4, 1.6, -0.4], left2d: 78.5, top2d: 42.0, icon: 'fa-network-wired', building: 'mo' },
                    { code: 'CCTV-02', badge: 'CCTV-02', name: 'CCTV Marketing', room: 'Pengawasan Keamanan MO', ip: '192.168.1.3', status: 'offline', pos: [-29.6, 2.0, 2.8], left2d: 41.0, top2d: 60.5, icon: 'fa-video', building: 'mo' },
                    // House of Server (HOS) - 4 Aset Sinkron Persis Denah 2D CAD
                    { code: 'SWM-01', badge: 'SWM-01', name: 'Switch Manageable', room: 'Core Server Rack & Backbone (HOS)', ip: '192.168.20.2', status: 'offline', pos: [29.5, 2.4, -2.3], left2d: 78.5, top2d: 44.0, icon: 'fa-bars-progress', building: 'hs' },
                    { code: 'RPI-02', badge: 'RPI-02', name: 'Raspberry Pi Server', room: 'Core Server Rack & Backbone (HOS)', ip: '192.168.20.15', status: 'offline', pos: [29.5, 2.4, -0.9], left2d: 78.5, top2d: 51.0, icon: 'fa-microchip', building: 'hs' },
                    { code: 'MKRT-02', badge: 'MKRT-02', name: 'Mikrotik Server', room: 'Core Server Rack & Backbone (HOS)', ip: '192.168.20.1', status: 'offline', pos: [29.5, 2.4, 0.5], left2d: 78.5, top2d: 58.0, icon: 'fa-network-wired', building: 'hs' },
                    { code: 'SRV-01', badge: 'SRV-01', name: 'Server Utama', room: 'Core Server Rack & Backbone (HOS)', ip: '192.168.20.10', status: 'offline', pos: [29.5, 2.4, 1.9], left2d: 78.5, top2d: 65.0, icon: 'fa-server', building: 'hs' }
                ]
            },
            ho: {
                name: 'Head Office',
                location: 'Zona Tengah • Jl. Cibodas No. 03, Blitar',
                badge: 'Head Office',
                dims: '14.0 m × 16.0 m',
                camFront: { pos: [0, 22, 24], target: [0, 2, -4] },
                camStreet: { pos: [-14, 5.5, 20], target: [0, 2, -3] },
                camTop: { pos: [0.5, 32, 4.0], target: [0.5, 0, -4.5] },
                camCctv: { pos: [-16, 20, 16], target: [0, 2, -3] },
                devices: [
                    { code: 'PC-01', badge: 'PC-01 (3.1)', name: 'PC Head Office 01 - Titik 3.1', room: 'Workstation Staf & Display', ip: '192.168.1.2', status: 'offline', pos: [1.3, 1.4, -1.0], left2d: 71.0, top2d: 54.0, icon: 'fa-desktop' },
                    { code: 'PC-02', badge: 'PC-02 (3.4)', name: 'PC Head Office 02 - Titik 3.4', room: 'Workstation Staf & Display', ip: '192.168.1.7', status: 'offline', pos: [-3.8, 1.4, -1.9], left2d: 54.0, top2d: 50.0, icon: 'fa-desktop' },
                    { code: 'SMTV-01', badge: 'SMTV-01 (2)', name: 'Smart TV Head Office - Titik 2', room: 'Workstation Staf & Display', ip: '192.168.1.10', status: 'offline', pos: [-3.4, 1.8, -0.1], left2d: 55.5, top2d: 56.0, icon: 'fa-tv' },
                    { code: 'RTR-01', badge: 'RTR-01 (6)', name: 'Router Head Office - Titik 6', room: 'Jaringan & Sensor IoT', ip: '192.168.1.1', status: 'offline', pos: [0.4, 1.8, -4.3], left2d: 66.0, top2d: 40.7, icon: 'fa-wifi' },
                    { code: 'ESP-01', badge: 'ESP-01 (4)', name: 'ESP32 Head Office - Titik 4', room: 'Jaringan & Sensor IoT', ip: '192.168.1.15', status: 'offline', pos: [-5.2, 1.4, -4.8], left2d: 42.0, top2d: 38.7, icon: 'fa-microchip' },
                    { code: 'RPI-01', badge: 'RPI-01 (5)', name: 'Raspberry Pi HO - Titik 5', room: 'Jaringan & Sensor IoT', ip: '192.168.1.20', status: 'offline', pos: [-0.2, 1.4, 2.4], left2d: 63.0, top2d: 65.0, icon: 'fa-microchip' },
                    { code: 'CCTV-01', badge: 'CCTV-01 (1)', name: 'CCTV Head Office - Titik 1', room: 'Gerbang & Pengawasan', ip: '192.168.1.39', status: 'offline', pos: [-4.3, 2.0, 4.0], left2d: 49.5, top2d: 69.5, icon: 'fa-video' }
                ]
            },
            mo: {
                name: 'Marketing Office',
                location: 'Zona Depan Kiri • Jl. Melati / Ciliwung No. 12, Blitar',
                badge: 'Marketing Office',
                dims: '12.0 m × 10.0 m',
                camFront: { pos: [-26, 18, 22], target: [-26, 2, 0] },
                camStreet: { pos: [-38, 5.0, 20], target: [-26, 2, 0] },
                camTop: { pos: [-26, 26, 6.0], target: [-26, 0, -1.5] },
                camCctv: { pos: [-38, 18, 16], target: [-26, 2, 0] },
                devices: [
                    { code: 'MKRT-01', badge: 'MKRT-01', name: 'Mikrotik Marketing', room: 'Routing & Gateway Jaringan', ip: '192.168.2.13', status: 'offline', pos: [3.6, 2.4, -4.6], left2d: 78.5, top2d: 24.0, icon: 'fa-server' },
                    { code: 'RTR-03', badge: 'RTR-03', name: 'Router Marketing 03', room: 'Routing & Gateway Jaringan', ip: '192.168.2.3', status: 'offline', pos: [3.6, 1.8, -2.5], left2d: 78.5, top2d: 33.0, icon: 'fa-network-wired' },
                    { code: 'RTR-02', badge: 'RTR-02', name: 'Router Marketing 02', room: 'Routing & Gateway Jaringan', ip: '192.168.0.1', status: 'offline', pos: [3.6, 1.6, -0.4], left2d: 78.5, top2d: 42.0, icon: 'fa-network-wired' },
                    { code: 'CCTV-02', badge: 'CCTV-02', name: 'CCTV Marketing', room: 'Pengawasan Keamanan MO', ip: '192.168.1.3', status: 'offline', pos: [-3.6, 2.0, 2.8], left2d: 41.0, top2d: 60.5, icon: 'fa-video' }
                ]
            },
            hs: {
                name: 'House of Server',
                location: 'Zona Belakang Kanan • Sentral Ruang Peladen, Blitar',
                badge: 'House of Server',
                dims: '10.0 m × 10.0 m',
                camFront: { pos: [26, 20, 24], target: [26, 2, -2] },
                camStreet: { pos: [14, 5.0, 20], target: [26, 2, -2] },
                camTop: { pos: [26, 26, 5.0], target: [26, 0, -1.5] },
                camCctv: { pos: [14, 18, 16], target: [26, 2, -2] },
                devices: [
                    { code: 'SWM-01', badge: 'SWM-01', name: 'Switch Manageable', room: 'Core Server Rack & Backbone', ip: '192.168.20.2', status: 'offline', pos: [3.5, 2.4, -0.3], left2d: 78.5, top2d: 44.0, icon: 'fa-bars-progress' },
                    { code: 'RPI-02', badge: 'RPI-02', name: 'Raspberry Pi Server', room: 'Core Server Rack & Backbone', ip: '192.168.20.15', status: 'offline', pos: [3.5, 2.4, 1.1], left2d: 78.5, top2d: 51.0, icon: 'fa-microchip' },
                    { code: 'MKRT-02', badge: 'MKRT-02', name: 'Mikrotik Server', room: 'Core Server Rack & Backbone', ip: '192.168.20.1', status: 'offline', pos: [3.5, 2.4, 2.5], left2d: 78.5, top2d: 58.0, icon: 'fa-network-wired' },
                    { code: 'SRV-01', badge: 'SRV-01', name: 'Server Utama', room: 'Core Server Rack & Backbone', ip: '192.168.20.10', status: 'offline', pos: [3.5, 2.4, 3.9], left2d: 78.5, top2d: 65.0, icon: 'fa-server' }
                ]
            }
        }
    };

    // -------------------------------------------------------------------------
    // 1. GENERATOR TEKSTUR REALISTIS VIA PROCEDURAL CANVAS
    // -------------------------------------------------------------------------
    function createProceduralTexture(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        if (type === 'roof-tiles') {
            // Genteng Terracotta Berbayang Realistis
            ctx.fillStyle = '#9A3412';
            ctx.fillRect(0, 0, 512, 512);
            ctx.fillStyle = '#7C2D12';
            for (let y = 0; y < 512; y += 32) {
                ctx.fillRect(0, y, 512, 6);
                for (let x = (y % 64 === 0 ? 0 : 24); x < 512; x += 48) {
                    ctx.fillStyle = '#C2410C';
                    ctx.fillRect(x + 2, y + 6, 44, 24);
                    ctx.fillStyle = 'rgba(0,0,0,0.25)';
                    ctx.fillRect(x + 2, y + 26, 44, 4);
                }
            }
        } else if (type === 'asphalt') {
            // Aspal Berbintik Granular
            ctx.fillStyle = '#1E293B';
            ctx.fillRect(0, 0, 512, 512);
            for (let i = 0; i < 4000; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const r = Math.random() * 2;
                ctx.fillStyle = Math.random() > 0.5 ? '#334155' : '#0F172A';
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (type === 'carport-paving') {
            // Paving Standar Industri Arsitektur: Modern Slate Grey / Graphite Interlocking Pavers (Bebas Oranye!)
            ctx.fillStyle = '#1E293B';
            ctx.fillRect(0, 0, 512, 512);
            ctx.strokeStyle = '#0F172A';
            ctx.lineWidth = 3;
            for (let y = 0; y < 512; y += 32) {
                for (let x = (y % 64 === 0 ? 0 : 32); x < 512; x += 64) {
                    const tone = (x + y) % 96 === 0 ? '#334155' : ((x * 3 + y) % 64 === 0 ? '#475569' : '#1E293B');
                    ctx.fillStyle = tone;
                    ctx.fillRect(x + 2, y + 2, 60, 28);
                    ctx.strokeRect(x, y, 64, 32);
                }
            }
        } else if (type === 'office-porcelain') {
            // Lantai Digital Twin Modern (Dark Cyber Grid Matrix)
            ctx.fillStyle = '#0B132B';
            ctx.fillRect(0, 0, 512, 512);
            ctx.strokeStyle = '#1E293B';
            ctx.lineWidth = 2;
            for (let y = 0; y < 512; y += 64) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
            }
            for (let x = 0; x < 512; x += 64) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
            }
        } else if (type === 'solar-panel') {
            // Sel Fotovoltaik Biru Metalik
            ctx.fillStyle = '#0F172A';
            ctx.fillRect(0, 0, 512, 512);
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    const x = col * 128 + 6;
                    const y = row * 128 + 6;
                    ctx.fillStyle = '#1E3A8A';
                    ctx.fillRect(x, y, 116, 116);
                    ctx.strokeStyle = '#60A5FA';
                    ctx.lineWidth = 1;
                    for (let lx = x + 16; lx < x + 116; lx += 20) {
                        ctx.beginPath();
                        ctx.moveTo(lx, y);
                        ctx.lineTo(lx, y + 116);
                        ctx.stroke();
                    }
                }
            }
        } else if (type === 'server-rack-front') {
            // Panel Rak Server 42U dengan Ventilasi & LED
            ctx.fillStyle = '#0F172A';
            ctx.fillRect(0, 0, 512, 512);
            for (let u = 10; u < 500; u += 35) {
                ctx.fillStyle = '#1E293B';
                ctx.fillRect(15, u, 482, 30);
                ctx.fillStyle = '#334155';
                ctx.fillRect(25, u + 5, 300, 20);
                // Status LEDs
                ctx.fillStyle = '#10B981';
                ctx.beginPath();
                ctx.arc(380, u + 15, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#38BDF8';
                ctx.beginPath();
                ctx.arc(410, u + 15, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = Math.random() > 0.3 ? '#F59E0B' : '#10B981';
                ctx.beginPath();
                ctx.arc(440, u + 15, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (type === 'architectural-lawn') {
            // Rumput Asri Realistis Arsitektur (Deep Forest Green, Micro-blade Texture & Soft Shading)
            ctx.fillStyle = '#163319';
            ctx.fillRect(0, 0, 512, 512);
            for (let i = 0; i < 24000; i++) {
                const x = Math.random() * 512;
                const y = Math.random() * 512;
                const len = 3 + Math.random() * 5;
                const angle = (Math.random() - 0.5) * 0.5;
                ctx.strokeStyle = Math.random() > 0.5 ? '#1C4220' : (Math.random() > 0.5 ? '#132C15' : '#225026');
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.sin(angle) * len, y - Math.cos(angle) * len);
                ctx.stroke();
            }
            for (let p = 0; p < 35; p++) {
                const px = Math.random() * 512;
                const py = Math.random() * 512;
                const pr = 35 + Math.random() * 70;
                const grad = ctx.createRadialGradient(px, py, 5, px, py, pr);
                grad.addColorStop(0, 'rgba(34, 80, 38, 0.4)');
                grad.addColorStop(1, 'rgba(16, 40, 18, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(px, py, pr, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (type === 'standing-seam-roof') {
            // Atap Modern Anthracite Standing Seam Metal Roof Berbayang Presisi
            ctx.fillStyle = '#263238';
            ctx.fillRect(0, 0, 512, 512);
            for (let x = 0; x < 512; x += 32) {
                ctx.fillStyle = '#1E293B';
                ctx.fillRect(x, 0, 4, 512);
                ctx.fillStyle = '#37474F';
                ctx.fillRect(x + 4, 0, 2, 512);
                ctx.fillStyle = '#0F172A';
                ctx.fillRect(x + 6, 0, 2, 512);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // -------------------------------------------------------------------------
    // 2. MATERIAL STANDAR INDUSTRI & TEKNOLAB (REALISTIS DENGAN PBR SHADING)
    // -------------------------------------------------------------------------
    const texRoof = createProceduralTexture('roof-tiles');
    texRoof.repeat.set(4, 3);

    const texLawn = createProceduralTexture('architectural-lawn');
    texLawn.repeat.set(16, 14);

    const texRoofModern = createProceduralTexture('standing-seam-roof');
    texRoofModern.repeat.set(6, 3);

    const texAsphalt = createProceduralTexture('asphalt');
    texAsphalt.repeat.set(6, 2);

    const texPaving = createProceduralTexture('carport-paving');
    texPaving.repeat.set(4, 3);

    const texPorcelain = createProceduralTexture('office-porcelain');
    texPorcelain.repeat.set(6, 6);

    const texSolar = createProceduralTexture('solar-panel');
    texSolar.repeat.set(2, 1);

    const texRack = createProceduralTexture('server-rack-front');

    const MATS = {
        wallCream: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.35, metalness: 0.4 }),
        wallSage: new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.25, metalness: 0.6 }), // Lis Neon Biru/Cyan Modern
        wallCharcoal: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.35, metalness: 0.5 }),
        wallCapMat: new THREE.MeshStandardMaterial({ color: 0x00F0FF, roughness: 0.2, metalness: 0.8 }), // Coping topi mitered arsitektural bercahaya
        skirtingMat: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.35, metalness: 0.4 }),
        floorSlate: new THREE.MeshStandardMaterial({ color: 0x070B19, roughness: 0.4, metalness: 0.4 }),
        floorPorcelain: new THREE.MeshStandardMaterial({ map: texPorcelain, roughness: 0.25, metalness: 0.3 }), // Keramik cyber matrix gelap
        groundGrass: new THREE.MeshStandardMaterial({ color: 0x070B19, roughness: 0.5, metalness: 0.6 }),
        asphalt: new THREE.MeshStandardMaterial({ color: 0x0A0F1D, roughness: 0.5, metalness: 0.4 }),
        paverModern: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.4, metalness: 0.5 }),
        carportOrange: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.4, metalness: 0.5 }),
        roofTerracotta: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.35, metalness: 0.6, side: THREE.DoubleSide }),
        roofRidge: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.3 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.35, roughness: 0.05, metalness: 0.8 }),
        glassCanopy: new THREE.MeshStandardMaterial({ color: 0x00F0FF, transparent: true, opacity: 0.45, roughness: 0.1 }),
        woodDoor: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.3 }),
        metalFrame: new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.2 }),
        serverBlue: new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.8, roughness: 0.2 }),
        carWhite: new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.18, metalness: 0.35 }),
        pillarConcrete: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4, metalness: 0.6 }),
        solarMat: new THREE.MeshStandardMaterial({ map: texSolar, metalness: 0.8, roughness: 0.2 }),
        rackFrontMat: new THREE.MeshStandardMaterial({ map: texRack, roughness: 0.4, metalness: 0.5 }),
        curbStone: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 }),
        woodFrame: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 }),
        wallWarmBeige: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 }),
        wallSoftTan: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 }),
        wallSoftSage: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.4 }),
        wallModernGray: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 }),
        roofSlateDark: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5, metalness: 0.4 }),
        roofTerracottaAlt: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5 }),
        treeGreenLight: new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.4 }),
        treeGreenDark: new THREE.MeshStandardMaterial({ color: 0x070B19, roughness: 0.6 })
    };

    // -------------------------------------------------------------------------
    // 2.5. BUILDER ELEMEN DETAIL ARSITEKTUR: PINTU KAYU, JENDELA 2-PANE, PINTU LIPAT KACA
    // Sesuai Render Arsitektur Ahmad Aziz (HO 1-4.jpeg & MO 1-5.jpeg)
    // -------------------------------------------------------------------------
    function buildDoorWithFrame(w, h, depth, isOpeningRight) {
        const doorGroup = new THREE.Group();
        const d = depth || 0.16;

        // Kusen Pintu Luar (Dark Aluminum / Solid Frame)
        const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MATS.metalFrame);
        frame.castShadow = true;
        doorGroup.add(frame);

        // Daun Pintu Kayu (Warm Rich Wood Leaf)
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, h - 0.08, d - 0.04), MATS.woodDoor);
        leaf.castShadow = true;
        doorGroup.add(leaf);

        // Handle Tuas Logam Sisi Depan
        const handleSide = isOpeningRight ? (w / 2 - 0.18) : (-w / 2 + 0.18);
        const handleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8), MATS.metalFrame);
        handleBase.rotation.x = Math.PI / 2;
        handleBase.position.set(handleSide, -0.15, d / 2 + 0.02);
        doorGroup.add(handleBase);

        const lever = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.03), MATS.metalFrame);
        lever.position.set(handleSide + (isOpeningRight ? -0.04 : 0.04), -0.15, d / 2 + 0.05);
        doorGroup.add(lever);

        // Handle Tuas Logam Sisi Belakang
        const handleBaseB = handleBase.clone();
        handleBaseB.position.z = -d / 2 - 0.02;
        doorGroup.add(handleBaseB);
        const leverB = lever.clone();
        leverB.position.z = -d / 2 - 0.05;
        doorGroup.add(leverB);

        return doorGroup;
    }

    function buildWindow2PaneMesh(x, y, z, w, h, isWood) {
        const win = new THREE.Group();
        const frameMat = isWood ? MATS.woodFrame : MATS.metalFrame;

        // Bingkai Luar Jendela
        const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), frameMat);
        win.add(frame);

        // Mullion Vertikal Tengah Pembagi 2 Kaca
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, h - 0.1, 0.13), frameMat);
        win.add(mullion);

        // Dua Panel Kaca Bening
        const paneW = (w - 0.22) / 2;
        const paneH = h - 0.16;
        const gL = new THREE.Mesh(new THREE.PlaneGeometry(paneW, paneH), MATS.glass);
        gL.position.set(-w / 4 + 0.015, 0, 0.065);
        win.add(gL);

        const gR = new THREE.Mesh(new THREE.PlaneGeometry(paneW, paneH), MATS.glass);
        gR.position.set(w / 4 - 0.015, 0, 0.065);
        win.add(gR);

        win.position.set(x, y, z);
        return win;
    }

    function buildFoldingDoorSystem(w, h, count) {
        const group = new THREE.Group();
        const numPanels = count || 8;
        const panelW = w / numPanels;

        // Rel Pandu Atas dan Bawah
        const topTrack = new THREE.Mesh(new THREE.BoxGeometry(w + 0.05, 0.08, 0.18), MATS.metalFrame);
        topTrack.position.y = h / 2 - 0.04;
        group.add(topTrack);

        const botTrack = new THREE.Mesh(new THREE.BoxGeometry(w + 0.05, 0.05, 0.18), MATS.metalFrame);
        botTrack.position.y = -h / 2 + 0.025;
        group.add(botTrack);

        for (let i = 0; i < numPanels; i++) {
            const px = -w / 2 + panelW * (i + 0.5);
            const panelGroup = new THREE.Group();

            // Bingkai Panel Ramping Hitam
            const pFrame = new THREE.Mesh(new THREE.BoxGeometry(panelW - 0.03, h - 0.14, 0.08), MATS.metalFrame);
            pFrame.castShadow = true;
            panelGroup.add(pFrame);

            // Kaca Bening / Tinted
            const pGlass = new THREE.Mesh(new THREE.PlaneGeometry(panelW - 0.12, h - 0.22), MATS.glass);
            pGlass.position.z = 0.045;
            panelGroup.add(pGlass);

            // Handle Vertikal Panjang Modern pada Daun Tengah (Panel 3 dan 4)
            if (i === 3 || i === 4) {
                const hSide = i === 3 ? (panelW / 2 - 0.08) : (-panelW / 2 + 0.08);
                const vHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 12), MATS.metalFrame);
                vHandle.position.set(hSide, 0, 0.09);
                panelGroup.add(vHandle);

                [-0.4, 0.4].forEach(sy => {
                    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.07, 8), MATS.metalFrame);
                    stem.rotation.x = Math.PI / 2;
                    stem.position.set(hSide, sy, 0.05);
                    panelGroup.add(stem);
                });
            }

            panelGroup.position.x = px;
            group.add(panelGroup);
        }

        return group;
    }

    function buildErgonomicChairMesh(x, z, rotY) {
        const chair = new THREE.Group();
        const baseHub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 8), MATS.metalFrame);
        baseHub.position.y = 0.15;
        chair.add(baseHub);
        for (let a = 0; a < 5; a++) {
            const angle = (a * Math.PI * 2) / 5;
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.035, 0.05), MATS.metalFrame);
            arm.position.set(Math.cos(angle) * 0.16, 0.15, Math.sin(angle) * 0.16);
            arm.rotation.y = -angle;
            chair.add(arm);
        }
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8), MATS.metalFrame);
        stem.position.y = 0.35;
        chair.add(stem);

        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.52), MATS.wallCharcoal);
        seat.position.y = 0.55;
        chair.add(seat);

        const back = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.06), MATS.wallCharcoal);
        back.position.set(0, 0.86, -0.23);
        chair.add(back);

        chair.position.set(x, 0, z);
        if (rotY) chair.rotation.y = rotY;
        return chair;
    }

    // -------------------------------------------------------------------------
    // 2.8. BUILDER LINGKUNGAN & BANGUNAN SEKITAR KOTA BLITAR (REALISTIS SESUAI MAPS)
    // Sesuai Instruksi User: Membuat sekitar denah ramai dengan bangunan asli
    // - Jl. Cibodas: Pemukiman perumahan asri, rumah tetangga, pagar, taman, tiang kabel PLN
    // - Jl. Ciliwung: Koridor pertokoan ruko komersial padat sesuai render Ahmad Aziz (MO 5.jpeg)
    // - House of Server: Kompleks fasilitas IT berkeamanan tinggi, pos satpam, rumah genset, gedung operasional
    // -------------------------------------------------------------------------

    function buildPjuStreetlight(x, z, rotY) {
        const pju = new THREE.Group();

        // Pondasi angkur beton
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.5), MATS.pillarConcrete);
        base.position.y = 0.2;
        pju.add(base);

        // Tiang baja galvanis octagonal (H = 8.5m)
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 8.2, 12), MATS.metalFrame);
        pole.position.y = 4.3;
        pole.castShadow = true;
        pju.add(pole);

        // Lengan lengkung cantilever mengarah ke badan jalan
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 8), MATS.metalFrame);
        arm.rotation.x = -Math.PI / 4;
        arm.position.set(0, 8.8, 0.85);
        pju.add(arm);

        // Kap lampu LED cobra head modern
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.75), MATS.wallCharcoal);
        head.position.set(0, 9.6, 1.7);
        pju.add(head);

        // Lensa pemancar cahaya PJU
        const lens = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.65), new THREE.MeshBasicMaterial({ color: 0xFEF08A }));
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0, 9.53, 1.7);
        pju.add(lens);

        pju.position.set(x, 0, z);
        if (rotY) pju.rotation.y = rotY;
        return pju;
    }

    function buildPlnPowerPole(x, z, hasTrafo) {
        const group = new THREE.Group();

        // Tiang beton silinder PLN (H = 12.5m)
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 12.5, 16), MATS.pillarConcrete);
        pole.position.y = 6.25;
        pole.castShadow = true;
        group.add(pole);

        // Crossarm palang besi ganda (Y = 11.4)
        const arm = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 0.16), MATS.metalFrame);
        arm.position.y = 11.4;
        group.add(arm);

        // Isolator keramik porselen 3 fasa
        [-1.0, 0, 1.0].forEach(ix => {
            const iso = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.28, 8), new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.3 }));
            iso.position.set(ix, 11.6, 0);
            group.add(iso);
        });

        // Trafo distribusi silinder (jika ada)
        if (hasTrafo) {
            const trafo = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 1.25, 16), MATS.metalFrame);
            trafo.position.set(0, 9.2, 0);
            group.add(trafo);

            const radiator = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.06), MATS.wallCharcoal);
            radiator.position.set(0, 9.2, 0.52);
            group.add(radiator);
        }

        group.position.set(x, 0, z);
        return group;
    }

    function buildOverheadCables(poles) {
        const cableGroup = new THREE.Group();
        const cableMat = new THREE.MeshBasicMaterial({ color: 0x0F172A });

        for (let i = 0; i < poles.length - 1; i++) {
            const p1 = poles[i];
            const p2 = poles[i + 1];
            const dx = p2.x - p1.x;
            const dz = p2.z - p1.z;
            const dist = Math.sqrt(dx * dx + dz * dz);
            const angle = Math.atan2(dz, dx);

            [-0.9, 0, 0.9].forEach(offset => {
                const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, dist, 6), cableMat);
                wire.position.set((p1.x + p2.x) / 2, 11.6, (p1.z + p2.z) / 2 + offset);
                wire.rotation.z = Math.PI / 2;
                wire.rotation.y = -angle;
                cableGroup.add(wire);
            });
        }
        return cableGroup;
    }

    function buildArchitecturalCypress(x, z, scale) {
        const cypress = new THREE.Group();
        const s = scale || 1.0;

        // Batang pohon ramping bertekstur kayu gelap alami
        const trunkGeo = new THREE.CylinderGeometry(0.12 * s, 0.16 * s, 1.2 * s, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 0.6 * s;
        trunk.castShadow = true;
        cypress.add(trunk);

        // Tajuk ramping pohon cemara arsitektur (Pencil Cypress / Italian Cypress)
        // 4 segmen kerucut bertingkat dengan warna hijau zamrud tua alami
        const foliageMat = new THREE.MeshStandardMaterial({ color: 0x0D2818, roughness: 0.72 });
        const foliageMatAlt = new THREE.MeshStandardMaterial({ color: 0x143D1F, roughness: 0.68 });

        const tiers = [
            { rB: 0.75 * s, rT: 0.55 * s, h: 2.0 * s, y: 1.8 * s, mat: foliageMat },
            { rB: 0.62 * s, rT: 0.42 * s, h: 1.8 * s, y: 3.2 * s, mat: foliageMatAlt },
            { rB: 0.48 * s, rT: 0.28 * s, h: 1.6 * s, y: 4.5 * s, mat: foliageMat },
            { rB: 0.32 * s, rT: 0.02 * s, h: 1.5 * s, y: 5.6 * s, mat: foliageMatAlt }
        ];

        tiers.forEach(t => {
            const cone = new THREE.Mesh(new THREE.CylinderGeometry(t.rT, t.rB, t.h, 12), t.mat);
            cone.position.y = t.y;
            cone.castShadow = true;
            cone.receiveShadow = true;
            cypress.add(cone);
        });

        cypress.position.set(x, 0, z);
        return cypress;
    }

    function buildArchitecturalPlanterHedge(x, z, width, depth, height) {
        const planterGroup = new THREE.Group();
        const w = width || 3.0;
        const d = depth || 1.0;
        const h = height || 0.65;

        // Pot Batu Granit / Antrasit Minimalis Modern
        const potMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.35, metalness: 0.3 });
        const pot = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), potMat);
        pot.position.y = h / 2;
        pot.castShadow = true;
        pot.receiveShadow = true;
        planterGroup.add(pot);

        // Tanaman Semak Boxwood / Pagar Hijau Terpangkas Rapi (Architectural Topiary)
        const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x14532D, roughness: 0.65 });
        const hedge = new THREE.Mesh(new THREE.BoxGeometry(w - 0.15, h * 0.9, d - 0.15), hedgeMat);
        hedge.position.y = h + (h * 0.9) / 2;
        hedge.castShadow = true;
        hedge.receiveShadow = true;
        planterGroup.add(hedge);

        planterGroup.position.set(x, 0, z);
        return planterGroup;
    }

    // Alias arsitektural agar kompatibel penuh
    function buildTropicalPalmTree(x, z, scale) {
        return buildArchitecturalCypress(x, z, scale);
    }

    function buildLushShadeTree(x, z, scale) {
        return buildArchitecturalCypress(x, z, scale);
    }

    function buildParkedCar(x, z, rotY, bodyColorHex) {
        const car = new THREE.Group();
        const carMat = bodyColorHex ? new THREE.MeshStandardMaterial({ color: bodyColorHex, roughness: 0.25, metalness: 0.35 }) : MATS.carWhite;

        const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.65, 4.4), carMat);
        body.position.set(0, 0.55, 0);
        body.castShadow = true;
        car.add(body);

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.58, 2.4), new THREE.MeshStandardMaterial({
            color: 0x0F172A,
            metalness: 0.8,
            roughness: 0.1
        }));
        cabin.position.set(0, 1.15, -0.3);
        car.add(cabin);

        const lightMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A });
        const hlL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.08), lightMat);
        hlL.position.set(-0.7, 0.6, 2.21);
        const hlR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.08), lightMat);
        hlR.position.set(0.7, 0.6, 2.21);
        car.add(hlL);
        car.add(hlR);

        const tireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16);
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x090D16, roughness: 0.8 });
        [[-1.0, 0.34, 1.3], [1.0, 0.34, 1.3], [-1.0, 0.34, -1.3], [1.0, 0.34, -1.3]].forEach(([wx, wy, wz]) => {
            const w = new THREE.Mesh(tireGeo, tireMat);
            w.rotation.z = Math.PI / 2;
            w.position.set(wx, wy, wz);
            car.add(w);
        });

        car.position.set(x, 0, z);
        if (rotY) car.rotation.y = rotY;
        return car;
    }

    function buildParkedMotorbike(x, z, rotY, frameColorHex) {
        const bike = new THREE.Group();
        const frameMat = frameColorHex ? new THREE.MeshStandardMaterial({ color: frameColorHex, roughness: 0.35 }) : MATS.wallCharcoal;

        const body = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.55, 1.6), frameMat);
        body.position.set(0, 0.55, 0);
        bike.add(body);

        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.8), new THREE.MeshStandardMaterial({ color: 0x090D16, roughness: 0.9 }));
        seat.position.set(0, 0.85, -0.15);
        bike.add(seat);

        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.04), MATS.metalFrame);
        handle.position.set(0, 1.0, 0.55);
        bike.add(handle);

        const headLight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.06), new THREE.MeshBasicMaterial({ color: 0xFEF08A }));
        headLight.position.set(0, 0.85, 0.82);
        bike.add(headLight);

        const wGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.1, 16);
        const wMat = new THREE.MeshStandardMaterial({ color: 0x090D16, roughness: 0.8 });
        const wFront = new THREE.Mesh(wGeo, wMat);
        wFront.rotation.z = Math.PI / 2;
        wFront.position.set(0, 0.26, 0.7);
        bike.add(wFront);

        const wBack = new THREE.Mesh(wGeo, wMat);
        wBack.rotation.z = Math.PI / 2;
        wBack.position.set(0, 0.26, -0.7);
        bike.add(wBack);

        bike.position.set(x, 0, z);
        if (rotY) bike.rotation.y = rotY;
        return bike;
    }

    function buildNeighborHouseMesh(cfg) {
        const house = new THREE.Group();
        const w = cfg.w || 12.0;
        const d = cfg.d || 14.0;
        const h = cfg.h || 3.5;
        const wallMat = cfg.wallMat || MATS.wallWarmBeige;
        const roofType = cfg.roofType || 'hip'; // 'hip', 'gable', 'modern'
        const roofMat = cfg.roofMat || MATS.roofTerracotta;

        // Badan utama rumah
        const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
        body.position.set(0, h / 2, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        house.add(body);

        // Skirting plinth bawah gelap arsitektur
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.3, d + 0.1), MATS.wallCharcoal);
        plinth.position.set(0, 0.15, 0);
        house.add(plinth);

        // Lis topi dinding atas
        const cornice = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.15, d + 0.2), MATS.wallCapMat);
        cornice.position.set(0, h + 0.075, 0);
        house.add(cornice);

        // Pintu Depan Kayu (Menghadap +Z)
        const doorX = cfg.doorX !== undefined ? cfg.doorX : -w * 0.25;
        const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, 0.12), MATS.woodDoor);
        door.position.set(doorX, 1.1, d / 2 + 0.05);
        house.add(door);

        const doorKusen = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.3, 0.14), MATS.metalFrame);
        doorKusen.position.set(doorX, 1.15, d / 2 + 0.03);
        house.add(doorKusen);

        // Jendela Depan Kaca 2-Pane
        const winX = cfg.winX !== undefined ? cfg.winX : w * 0.22;
        const win = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.3, 0.08), MATS.glass);
        win.position.set(winX, h * 0.55, d / 2 + 0.05);
        house.add(win);

        const winFrame = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.45, 0.06), MATS.metalFrame);
        winFrame.position.set(winX, h * 0.55, d / 2 + 0.03);
        house.add(winFrame);

        // Teras Depan Tertutup (Porch)
        if (cfg.hasPorch !== false) {
            const pW = 3.4, pD = 2.4;
            const pSlab = new THREE.Mesh(new THREE.BoxGeometry(pW, 0.15, pD), MATS.curbStone);
            pSlab.position.set(doorX, 0.08, d / 2 + pD / 2);
            house.add(pSlab);

            const pCanopy = new THREE.Mesh(new THREE.BoxGeometry(pW + 0.4, 0.18, pD + 0.3), MATS.wallCharcoal);
            pCanopy.position.set(doorX, h * 0.85, d / 2 + pD / 2);
            pCanopy.castShadow = true;
            house.add(pCanopy);

            const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.3, h * 0.85, 0.3), MATS.pillarConcrete);
            pillar.position.set(doorX + pW / 2 - 0.2, (h * 0.85) / 2, d / 2 + pD - 0.2);
            pillar.castShadow = true;
            house.add(pillar);
        }

        // Atap Rumah Realistis
        if (roofType === 'hip') {
            // Atap Limasan Indonesia Proporsional
            const rH = 2.4;
            const rMesh = new THREE.Mesh(new THREE.ConeGeometry(1, rH, 4), roofMat);
            rMesh.rotation.y = Math.PI / 4;
            // Setengah bentang presisi agar overhang pas 0.35m dari dinding
            rMesh.scale.set((w + 0.7) / (2 * 0.7071), 1, (d + 0.7) / (2 * 0.7071));
            rMesh.position.set(0, h + rH / 2, 0);
            rMesh.castShadow = true;
            house.add(rMesh);

            const ridge = new THREE.Mesh(new THREE.BoxGeometry(w * 0.35, 0.2, 0.25), MATS.roofRidge);
            ridge.position.set(0, h + rH - 0.05, 0);
            house.add(ridge);
        } else if (roofType === 'gable') {
            // Atap Pelana
            const rH = 2.4;
            const halfW = w / 2 + 0.35;
            const slopeW = Math.sqrt(Math.pow(halfW, 2) + Math.pow(rH, 2));
            const angle = Math.atan2(rH, halfW);

            const rL = new THREE.Mesh(new THREE.BoxGeometry(slopeW, 0.18, d + 0.7), roofMat);
            rL.rotation.z = angle;
            rL.position.set(-halfW / 2, h + rH / 2, 0);
            rL.castShadow = true;
            house.add(rL);

            const rR = new THREE.Mesh(new THREE.BoxGeometry(slopeW, 0.18, d + 0.7), roofMat);
            rR.rotation.z = -angle;
            rR.position.set(halfW / 2, h + rH / 2, 0);
            rR.castShadow = true;
            house.add(rR);

            const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, d + 0.8), MATS.roofRidge);
            ridge.position.set(0, h + rH + 0.08, 0);
            house.add(ridge);
        } else {
            // Atap Dak Beton Minimalis Modern
            const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.6, d + 0.2), MATS.wallCharcoal);
            parapet.position.set(0, h + 0.3, 0);
            house.add(parapet);
        }

        // Pagar Depan Rumah & Gerbang
        if (cfg.hasFence !== false) {
            const fZ = cfg.fenceZ !== undefined ? cfg.fenceZ : (d / 2 + 4.5);
            const wallH = 1.1;

            const fenceL = new THREE.Mesh(new THREE.BoxGeometry(w * 0.45, wallH, 0.18), MATS.wallCharcoal);
            fenceL.position.set(-w * 0.25, wallH / 2, fZ);
            house.add(fenceL);

            const fenceR = new THREE.Mesh(new THREE.BoxGeometry(w * 0.28, wallH, 0.18), MATS.wallCharcoal);
            fenceR.position.set(w * 0.34, wallH / 2, fZ);
            house.add(fenceR);

            // Gerbang Pagar Besi
            const gate = new THREE.Mesh(new THREE.BoxGeometry(w * 0.25, wallH + 0.15, 0.06), MATS.metalFrame);
            gate.position.set(w * 0.08, (wallH + 0.15) / 2, fZ);
            house.add(gate);
        }

        house.position.set(cfg.x || 0, 0, cfg.z || 0);
        if (cfg.rotY) house.rotation.y = cfg.rotY;
        return house;
    }

    function buildNeighborShophouseMesh(cfg) {
        const ruko = new THREE.Group();
        const w = cfg.w || 9.0;
        const d = cfg.d || 14.0;
        const floors = cfg.floors || 2;
        const h = floors === 2 ? 6.8 : 3.8;
        const wallMat = cfg.wallMat || MATS.wallCream;
        const signText = cfg.signText || 'KANTOR';
        const signColorHex = cfg.signColorHex || 0x0369A1;
        const storefront = cfg.storefront || 'folding'; // 'folding', 'roller', 'glass'

        // Struktur utama ruko
        const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat);
        body.position.set(0, h / 2, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        ruko.add(body);

        // Lis parapet coping atas
        const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.6, d + 0.2), MATS.wallCharcoal);
        parapet.position.set(0, h + 0.3, 0);
        parapet.castShadow = true;
        ruko.add(parapet);

        // Toren air oranye di atap ruko
        const toren = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.3, 16), new THREE.MeshStandardMaterial({ color: 0xEA580C, roughness: 0.4 }));
        toren.position.set(-w * 0.28, h + 1.25, -d * 0.25);
        ruko.add(toren);

        // Fasad Lantai Bawah (Storefront Menghadap +Z)
        const gfH = 3.2;
        if (storefront === 'roller') {
            const rollMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.6, roughness: 0.4 });
            const roller = new THREE.Mesh(new THREE.BoxGeometry(w - 1.2, gfH - 0.3, 0.08), rollMat);
            roller.position.set(0, (gfH - 0.3) / 2 + 0.1, d / 2 + 0.05);
            ruko.add(roller);

            const rFrame = new THREE.Mesh(new THREE.BoxGeometry(w - 1.0, gfH, 0.15), MATS.wallCharcoal);
            rFrame.position.set(0, gfH / 2, d / 2 + 0.04);
            ruko.add(rFrame);
        } else {
            // Folding glass doors / Kaca Display
            const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(w - 1.2, gfH - 0.25, 0.06), MATS.glass);
            glassDoor.position.set(0, (gfH - 0.25) / 2 + 0.1, d / 2 + 0.06);
            ruko.add(glassDoor);

            const frame = new THREE.Mesh(new THREE.BoxGeometry(w - 1.0, gfH, 0.14), MATS.metalFrame);
            frame.position.set(0, gfH / 2, d / 2 + 0.04);
            ruko.add(frame);

            // Kisi vertikal pintu lipat ruko
            const leafW = (w - 1.2) / 6;
            for (let i = 1; i < 6; i++) {
                const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.06, gfH - 0.25, 0.08), MATS.metalFrame);
                mullion.position.set(- (w - 1.2) / 2 + i * leafW, (gfH - 0.25) / 2 + 0.1, d / 2 + 0.07);
                ruko.add(mullion);
            }
        }

        // Papan Nama Usaha Komersial Berwarna Tegas (Signboard)
        const signMat = new THREE.MeshStandardMaterial({ color: signColorHex, roughness: 0.3, metalness: 0.2 });
        const signboard = new THREE.Mesh(new THREE.BoxGeometry(w - 0.8, 0.9, 0.15), signMat);
        signboard.position.set(0, gfH + 0.55, d / 2 + 0.12);
        ruko.add(signboard);

        const signSprite = createTextSprite(signText, 0xFFFFFF);
        signSprite.position.set(0, gfH + 0.55, d / 2 + 0.25);
        signSprite.scale.set(w * 0.72, 0.75, 1);
        ruko.add(signSprite);

        // Kanopi / Awning Menjorok ke Depan
        const canopyD = 2.2;
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(w - 0.3, 0.14, canopyD), MATS.wallCharcoal);
        canopy.position.set(0, gfH + 0.05, d / 2 + canopyD / 2);
        canopy.rotation.x = 0.06;
        canopy.castShadow = true;
        ruko.add(canopy);

        // Lantai Dua (Jika 2 Lantai)
        if (floors === 2) {
            [-w * 0.26, w * 0.26].forEach(wx => {
                const win = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 0.08), MATS.glass);
                win.position.set(wx, gfH + 1.9, d / 2 + 0.06);
                ruko.add(win);

                const wf = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.75, 0.06), MATS.metalFrame);
                wf.position.set(wx, gfH + 1.9, d / 2 + 0.04);
                ruko.add(wf);
            });

            // Lis aksen horizontal arsitektur ruko
            const band = new THREE.Mesh(new THREE.BoxGeometry(w - 0.5, 0.18, 0.12), MATS.wallCharcoal);
            band.position.set(0, h - 0.4, d / 2 + 0.06);
            ruko.add(band);
        }

        // Dinding pembatas sayap ruko yang menonjol ke depan (Persis render MO 5.jpeg)
        const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.3, h, canopyD + 0.5), wallMat);
        wallL.position.set(-w / 2 + 0.15, h / 2, d / 2 + (canopyD + 0.5) / 2);
        wallL.castShadow = true;
        ruko.add(wallL);

        const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.3, h, canopyD + 0.5), wallMat);
        wallR.position.set(w / 2 - 0.15, h / 2, d / 2 + (canopyD + 0.5) / 2);
        wallR.castShadow = true;
        ruko.add(wallR);

        // Apron trotoar depan ruko
        const apron = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, canopyD + 0.8), MATS.curbStone);
        apron.position.set(0, 0.1, d / 2 + (canopyD + 0.8) / 2);
        apron.receiveShadow = true;
        ruko.add(apron);

        ruko.position.set(cfg.x || 0, 0, cfg.z || 0);
        if (cfg.rotY) ruko.rotation.y = cfg.rotY;
        return ruko;
    }

    function buildNeighborFacilityMesh(cfg) {
        const fac = new THREE.Group();
        const type = cfg.type || 'admin-office';
        const w = cfg.w || 10.0;
        const d = cfg.d || 12.0;
        const h = cfg.h || 6.5;

        if (type === 'guard-post') {
            // Pos Satpam Keamanan
            const posW = 3.2, posD = 3.2, posH = 3.0;
            const postBody = new THREE.Mesh(new THREE.BoxGeometry(posW, posH, posD), MATS.wallCream);
            postBody.position.set(0, posH / 2, 0);
            postBody.castShadow = true;
            fac.add(postBody);

            const postRoof = new THREE.Mesh(new THREE.BoxGeometry(posW + 0.8, 0.25, posD + 0.8), MATS.wallCharcoal);
            postRoof.position.set(0, posH + 0.125, 0);
            postRoof.castShadow = true;
            fac.add(postRoof);

            // Jendela inspeksi kaca satpam
            const win = new THREE.Mesh(new THREE.BoxGeometry(posW - 0.6, 1.2, 0.06), MATS.glass);
            win.position.set(0, 1.5, posD / 2 + 0.04);
            fac.add(win);

            // Palang Boom Barrier Otomatis
            const barrierBase = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.35), new THREE.MeshStandardMaterial({ color: 0xDC2626 }));
            barrierBase.position.set(posW / 2 + 0.8, 0.5, posD / 2);
            fac.add(barrierBase);

            const boomArm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8, 8), new THREE.MeshStandardMaterial({ color: 0xF8FAFC }));
            boomArm.rotation.z = Math.PI / 2;
            boomArm.position.set(posW / 2 + 0.8 + 1.9, 0.95, posD / 2);
            fac.add(boomArm);

            // Papan label
            const label = createTextSprite('POS SATPAM', 0xFFFFFF);
            label.position.set(0, posH - 0.3, posD / 2 + 0.08);
            label.scale.set(1.8, 0.5, 1);
            fac.add(label);
        } else if (type === 'genset-room') {
            // Rumah Genset PLN & Cadangan Darurat
            const gBody = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), MATS.wallModernGray);
            gBody.position.set(0, h / 2, 0);
            gBody.castShadow = true;
            fac.add(gBody);

            const gRoof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.25, d + 0.3), MATS.wallCharcoal);
            gRoof.position.set(0, h + 0.125, 0);
            fac.add(gRoof);

            // Kisi-kisi ventilasi intake & exhaust
            const louverMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
            const louver = new THREE.Mesh(new THREE.BoxGeometry(w - 1.2, 1.6, 0.08), louverMat);
            louver.position.set(0, 1.8, d / 2 + 0.05);
            fac.add(louver);

            // Pipa cerobong exhaust knalpot genset
            const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.5, 12), MATS.metalFrame);
            pipe.position.set(w * 0.3, h + 1.25, -d * 0.2);
            fac.add(pipe);

            // Label Bahaya Tegangan Tinggi
            const signText = createTextSprite('PLN 250kVA GENSET', 0xFBBF24);
            signText.position.set(0, h - 0.4, d / 2 + 0.08);
            signText.scale.set(w * 0.65, 0.6, 1);
            fac.add(signText);
        } else {
            // Gedung Administrasi IT / Fasilitas Sekitar (2 Lantai)
            const bMat = cfg.wallMat || MATS.wallModernGray;
            const bMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bMat);
            bMesh.position.set(0, h / 2, 0);
            bMesh.castShadow = true;
            bMesh.receiveShadow = true;
            fac.add(bMesh);

            const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.5, d + 0.3), MATS.wallCharcoal);
            parapet.position.set(0, h + 0.25, 0);
            fac.add(parapet);

            // Deretan Kaca Ribbon Facade Modern
            [-1.5, 1.5].forEach(yOff => {
                const ribbonWin = new THREE.Mesh(new THREE.BoxGeometry(w - 1.4, 1.2, 0.06), MATS.glass);
                ribbonWin.position.set(0, h / 2 + yOff, d / 2 + 0.04);
                fac.add(ribbonWin);

                const ribbonF = new THREE.Mesh(new THREE.BoxGeometry(w - 1.2, 1.35, 0.04), MATS.metalFrame);
                ribbonF.position.set(0, h / 2 + yOff, d / 2 + 0.02);
                fac.add(ribbonF);
            });

            // Antena Server / Microwave Dish di Atap
            const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.2, 8), MATS.metalFrame);
            mast.position.set(w * 0.28, h + 2.1, -d * 0.2);
            fac.add(mast);

            const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16), MATS.carWhite);
            dish.rotation.x = Math.PI / 3;
            dish.position.set(w * 0.28, h + 3.2, -d * 0.2);
            fac.add(dish);

            if (cfg.label) {
                const lbl = createTextSprite(cfg.label, 0x38BDF8);
                lbl.position.set(0, h - 0.45, d / 2 + 0.08);
                lbl.scale.set(w * 0.75, 0.7, 1);
                fac.add(lbl);
            }
        }

        fac.position.set(cfg.x || 0, 0, cfg.z || 0);
        if (cfg.rotY) fac.rotation.y = cfg.rotY;
        return fac;
    }

    // -------------------------------------------------------------------------
    // 3. BUILDER GEDUNG 1: HEAD OFFICE (HO - DENAH BENTUK L SAYAP KANAN SESUAI HO 1-4.JPEG)
    // -------------------------------------------------------------------------
    function createWallWithCap(group, w, h, d, x, y, z, wallMat) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallMat || MATS.wallCream);
        wall.position.set(x, y, z);
        wall.castShadow = true;
        wall.receiveShadow = true;
        group.add(wall);

        // Coping Cap Profil Atas Industrial
        const cap = new THREE.Mesh(new THREE.BoxGeometry(w >= d ? w + 0.05 : w + 0.08, 0.08, d >= w ? d + 0.05 : d + 0.08), MATS.wallCapMat);
        cap.position.set(x, y + h / 2 + 0.04, z);
        cap.castShadow = true;
        group.add(cap);

        return wall;
    }

    // -------------------------------------------------------------------------
    // 3. MASTERPLAN KAWASAN KAMPUS TERPADU & BUILDER GEDUNG MODULAR
    // -------------------------------------------------------------------------
    function buildCampusEnvironment() {
        const envGroup = new THREE.Group();
        envGroup.name = 'cyberHoloEnvironment';

        // 1. Podium Holografik Digital Twin T-AIMS (Dark Cyber Slate with Neon Edge)
        const podiumGeo = new THREE.CylinderGeometry(85, 85, 0.4, 64);
        const podiumMat = new THREE.MeshStandardMaterial({
            color: 0x070B19,
            roughness: 0.3,
            metalness: 0.85
        });
        const podium = new THREE.Mesh(podiumGeo, podiumMat);
        podium.position.set(0, -0.21, 0);
        podium.receiveShadow = true;
        envGroup.add(podium);

        // Lingkar Luar Neon Cyan Pendar
        const rimRingGeo = new THREE.RingGeometry(84.2, 85.0, 64);
        const rimRingMat = new THREE.MeshBasicMaterial({
            color: 0x00F0FF,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        const rimRing = new THREE.Mesh(rimRingGeo, rimRingMat);
        rimRing.rotation.x = -Math.PI / 2;
        rimRing.position.set(0, 0.015, 0);
        envGroup.add(rimRing);

        // Lingkar Konsentris Radar Scanning Grid
        [20, 38, 56, 74].forEach((r, idx) => {
            const circleGeo = new THREE.RingGeometry(r - 0.12, r + 0.12, 64);
            const circleMat = new THREE.MeshBasicMaterial({
                color: idx % 2 === 0 ? 0x00F0FF : 0x0284C7,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: idx % 2 === 0 ? 0.45 : 0.25
            });
            const cRing = new THREE.Mesh(circleGeo, circleMat);
            cRing.rotation.x = -Math.PI / 2;
            cRing.position.set(0, 0.018, 0);
            envGroup.add(cRing);
        });

        // Grid Koordinat Holografik CAD Cyberpunk
        const cyberGrid = new THREE.GridHelper(160, 40, 0x00F0FF, 0x1E293B);
        cyberGrid.position.set(0, 0.02, 0);
        cyberGrid.material.transparent = true;
        cyberGrid.material.opacity = 0.22;
        envGroup.add(cyberGrid);

        // Pedestal Hologram Site 1: Head Office (Pusat) - x: 0, z: -4.5
        envGroup.add(createSiteHoloBase(18, 22, 0, -4.5, 'SITE 01 • HEAD OFFICE', 0x00F0FF));

        // Pedestal Hologram Site 2: Marketing Office - x: -26, z: -1.5
        envGroup.add(createSiteHoloBase(15, 16, -26, -1.5, 'SITE 02 • MARKETING OFFICE', 0x38BDF8));

        // Pedestal Hologram Site 3: House of Server - x: 26, z: -2.0
        envGroup.add(createSiteHoloBase(14, 15, 26, -2.0, 'SITE 03 • HOUSE OF SERVER', 0x10B981));

        // Jalur Fiber Optik & Data Streams Antar Gedung
        const linkMat = new THREE.LineDashedMaterial({
            color: 0x00F0FF,
            dashSize: 1.2,
            gapSize: 0.6,
            linewidth: 2,
            transparent: true,
            opacity: 0.75
        });
        const pts1 = [new THREE.Vector3(-26, 0.2, -1.5), new THREE.Vector3(0, 0.2, -4.5)];
        const geo1 = new THREE.BufferGeometry().setFromPoints(pts1);
        const line1 = new THREE.Line(geo1, linkMat);
        line1.computeLineDistances();
        envGroup.add(line1);

        const pts2 = [new THREE.Vector3(0, 0.2, -4.5), new THREE.Vector3(26, 0.2, -2.0)];
        const geo2 = new THREE.BufferGeometry().setFromPoints(pts2);
        const line2 = new THREE.Line(geo2, linkMat);
        line2.computeLineDistances();
        envGroup.add(line2);

        // Pylon Menara Beacon Penanda Sudut Digital Twin
        const pylonGeo = new THREE.CylinderGeometry(0.12, 0.2, 4.0, 16);
        const pylonMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.2 });
        const pylonPositions = [
            [-38, -12], [-38, 12],
            [38, -12], [38, 12],
            [0, -18], [0, 14]
        ];
        pylonPositions.forEach(p => {
            const pMesh = new THREE.Mesh(pylonGeo, pylonMat);
            pMesh.position.set(p[0], 2.0, p[1]);
            envGroup.add(pMesh);

            const pLight = new THREE.Mesh(
                new THREE.SphereGeometry(0.16, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0x00F0FF })
            );
            pLight.position.set(p[0], 4.0, p[1]);
            envGroup.add(pLight);
        });

        return envGroup;
    }

    function createSiteHoloBase(w, d, x, z, label, colorHex) {
        const group = new THREE.Group();

        // Plinth Dasar Gelap Elegan
        const baseGeo = new THREE.BoxGeometry(w, 0.1, d);
        const baseMat = new THREE.MeshStandardMaterial({
            color: 0x0A1128,
            roughness: 0.25,
            metalness: 0.7
        });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.set(x, 0.05, z);
        base.receiveShadow = true;
        group.add(base);

        // Garis Tepi Neon Wireframe Bercahaya
        const borderGeo = new THREE.EdgesGeometry(baseGeo);
        const borderMat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2, transparent: true, opacity: 0.85 });
        const border = new THREE.LineSegments(borderGeo, borderMat);
        border.position.set(x, 0.05, z);
        group.add(border);

        // Lencana Label Gedung Holografik
        const badge = createTextSprite(label, colorHex);
        badge.position.set(x, 0.45, z + d / 2 + 1.2);
        badge.scale.set(3.4, 0.85, 1);
        group.add(badge);

        return group;
    }

    function buildHOBuilding() {
        const root = new THREE.Group();
        root.name = 'hoBuilding';
        const roofGroup = new THREE.Group();
        roofGroup.name = 'hoRoof';
        const pinsGroup = new THREE.Group();
        pinsGroup.name = 'hoPins';

        // B. Arsitektur Gedung HO: Denah Bentuk L Asli Ahmad Aziz (HO 1-4.jpeg)
        // Sayap Belakang Kanan (Ruang 4 Server & IoT) Membentuk L Presisi
        const houseGroup = new THREE.Group();

        // 1. Lantai Utama Keramik Polished Modern (Badan Utama X: -6.5 sd 2.5, Z: 3.5 sd -12.5)
        const floorMain = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.2, 16.0), MATS.floorPorcelain);
        floorMain.position.set(-2.0, 0.1, -4.5);
        floorMain.receiveShadow = true;
        houseGroup.add(floorMain);

        // 2. Lantai Sayap Kanan Belakang L (Ruang 4 - Lab IoT & Server, X: 2.5 sd 7.5, Z: -6.5 sd -12.5)
        const floorWing = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.2, 6.0), MATS.floorPorcelain);
        floorWing.position.set(5.0, 0.1, -9.5);
        floorWing.receiveShadow = true;
        houseGroup.add(floorWing);

        // 3. Ambang Tangga Pintu Masuk Minimalis (Bebas dari alas besar yang menutupi taman)
        const doorSill = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.5), MATS.curbStone);
        doorSill.position.set(-4.5, 0.04, 3.75);
        doorSill.receiveShadow = true;
        houseGroup.add(doorSill);

        // 4. DINDING LUAR GEDUNG HO DENGAN COPING CAP INDUSTRIAL:
        // Dinding Samping Kiri Penuh (Lurus dari Depan Z=3.5 sampai Belakang Z=-12.5 pada X=-6.5)
        createWallWithCap(houseGroup, 0.32, 3.6, 16.0, -6.5, 1.8, -4.5);

        // Dinding Belakang Penuh (Dari X=-6.5 sampai X=7.5 pada Z=-12.5)
        createWallWithCap(houseGroup, 14.0, 3.6, 0.32, 0.5, 1.8, -12.5);

        // Dinding Luar Sayap Kanan Belakang L (Dari Z=-12.5 sampai Z=-6.5 pada X=7.5)
        createWallWithCap(houseGroup, 0.32, 3.6, 6.0, 7.5, 1.8, -9.5);

        // Dinding Depan Sayap Kanan Belakang L (Dari X=2.5 sampai X=7.5 pada Z=-6.5)
        createWallWithCap(houseGroup, 5.0, 3.6, 0.32, 5.0, 1.8, -6.5);

        // Dinding Samping Kanan Koridor yang Memanjang Maju ke Depan (Dari Z=-6.5 sampai Z=6.5 pada X=2.5)
        // Sesuai HO 2 & 3.jpeg: Dinding kanan menerobos maju melewati fasad depan membingkai carport
        createWallWithCap(houseGroup, 0.32, 3.6, 13.0, 2.5, 1.8, 0.0);

        // Fasad Depan Masuk (Z = 3.5, dari X = -6.5 sd 2.5):
        // a. Dinding kiri pintu masuk (X: -6.5 sd -5.2)
        createWallWithCap(houseGroup, 1.3, 3.6, 0.32, -5.85, 1.8, 3.5);

        // b. Ambang atas pintu depan (X: -5.2 sd -3.8)
        const fLintelDoor = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 0.32), MATS.wallCream);
        fLintelDoor.position.set(-4.5, 3.05, 3.5);
        houseGroup.add(fLintelDoor);

        // c. Pintu Kayu Masuk Utama (HO 2 & 3.jpeg)
        const mainDoor = buildDoorWithFrame(1.4, 2.5, 0.14, false);
        mainDoor.position.set(-4.5, 1.25, 3.5);
        houseGroup.add(mainDoor);

        // d. Dinding antara pintu dan jendela (X: -3.8 sd -2.0)
        createWallWithCap(houseGroup, 1.8, 3.6, 0.32, -2.9, 1.8, 3.5);

        // e. Dinding bawah & atas jendela depan
        const fWallBelowWin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.32), MATS.wallCream);
        fWallBelowWin.position.set(-1.2, 0.6, 3.5);
        houseGroup.add(fWallBelowWin);

        const fLintelWin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.32), MATS.wallCream);
        fLintelWin.position.set(-1.2, 3.1, 3.5);
        houseGroup.add(fLintelWin);

        // f. Jendela 2-Pane Hitam Fasad Depan (HO 1-4.jpeg)
        const frontWin = buildWindow2PaneMesh(-1.2, 1.9, 3.5, 1.6, 1.4, false);
        houseGroup.add(frontWin);

        // g. Dinding kanan jendela (X: -0.4 sd 2.5)
        createWallWithCap(houseGroup, 2.9, 3.6, 0.32, 1.05, 1.8, 3.5);

        // h. Pilar Persegi Bebas di Teras Depan Sisi Kiri (HO 2, 3, 4.jpeg)
        const porchPillar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 3.6, 0.42), MATS.wallCream);
        porchPillar.position.set(-5.8, 1.8, 6.2);
        porchPillar.castShadow = true;
        houseGroup.add(porchPillar);

        // i. Lis Sage Fasad Depan
        const sageTrim = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.22, 0.42), MATS.wallSage);
        sageTrim.position.set(-2.0, 3.3, 3.55);
        houseGroup.add(sageTrim);

        // C. PARTISI INTERIOR HO (Sama Persis Foto Denah Ahmad Aziz HO 2.jpeg)
        const interiorGroup = new THREE.Group();

        // 1. Dinding Depan Ruang 1 Staf (Z = 0.5, X: -6.5 sd -1.5)
        createWallWithCap(interiorGroup, 5.0, 3.6, 0.22, -4.0, 1.8, 0.5);

        // 2. Dinding Penyekat Antara Ruang Staf 1 & Ruang Staf 2 (Z = -3.0, X: -6.5 sd -1.5)
        createWallWithCap(interiorGroup, 5.0, 3.6, 0.22, -4.0, 1.8, -3.0);

        // 3. Dinding Memanjang Pembatas Ruang Staf Kiri dengan Koridor (X = -1.5, Z: 0.5 sd -6.5):
        createWallWithCap(interiorGroup, 0.22, 3.6, 0.8, -1.5, 1.8, 0.1);

        const pLintelR1 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.1, 1.2), MATS.wallCream);
        pLintelR1.position.set(-1.5, 3.05, -0.9);
        interiorGroup.add(pLintelR1);

        // Pintu Kayu Masuk Ruang Staf 1 Menghadap ke Koridor (HO 2 & 3.jpeg)
        const doorR1 = buildDoorWithFrame(1.2, 2.5, 0.12, false);
        doorR1.rotation.y = Math.PI / 2;
        doorR1.position.set(-1.5, 1.25, -0.9);
        interiorGroup.add(doorR1);

        createWallWithCap(interiorGroup, 0.22, 3.6, 2.3, -1.5, 1.8, -2.65);

        const pLintelR2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.1, 1.2), MATS.wallCream);
        pLintelR2.position.set(-1.5, 3.05, -4.4);
        interiorGroup.add(pLintelR2);

        // Pintu Kayu Masuk Ruang Staf 2 Menghadap ke Koridor (HO 2 & 3.jpeg)
        const doorR2 = buildDoorWithFrame(1.2, 2.5, 0.12, false);
        doorR2.rotation.y = Math.PI / 2;
        doorR2.position.set(-1.5, 1.25, -4.4);
        interiorGroup.add(doorR2);

        createWallWithCap(interiorGroup, 0.22, 3.6, 1.5, -1.5, 1.8, -5.75);

        // 4. Dinding Melintang Ujung Koridor (Z = -6.5):
        createWallWithCap(interiorGroup, 5.0, 3.6, 0.22, -4.0, 1.8, -6.5);
        createWallWithCap(interiorGroup, 1.5, 3.6, 0.22, -0.75, 1.8, -6.5);

        const pRearLintelDoor = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.1, 0.22), MATS.wallCream);
        pRearLintelDoor.position.set(0.65, 3.05, -6.5);
        interiorGroup.add(pRearLintelDoor);

        // Pintu Kayu Lorong Belakang (HO 2 & 3.jpeg)
        const rearCorridorDoor = buildDoorWithFrame(1.3, 2.5, 0.12, true);
        rearCorridorDoor.position.set(0.65, 1.25, -6.5);
        interiorGroup.add(rearCorridorDoor);

        createWallWithCap(interiorGroup, 1.2, 3.6, 0.22, 1.9, 1.8, -6.5);

        // 5. Partisi Dua Ruang Servis / Toilet Belakang Kiri (Z = -8.5 sd -12.5)
        createWallWithCap(interiorGroup, 1.3, 3.6, 0.22, -5.85, 1.8, -8.5);

        const doorUtil1 = buildDoorWithFrame(1.1, 2.3, 0.1, false);
        doorUtil1.position.set(-4.65, 1.15, -8.5);
        interiorGroup.add(doorUtil1);

        createWallWithCap(interiorGroup, 5.0, 3.6, 0.22, -1.6, 1.8, -8.5);

        const doorUtil2 = buildDoorWithFrame(1.1, 2.3, 0.1, true);
        doorUtil2.position.set(1.45, 1.15, -8.5);
        interiorGroup.add(doorUtil2);

        createWallWithCap(interiorGroup, 0.5, 3.6, 0.22, 2.25, 1.8, -8.5);
        createWallWithCap(interiorGroup, 0.22, 3.6, 4.0, -2.0, 1.8, -10.5);

        // Balok ambang penghubung masuk ke Ruang 4 Sayap Kanan (X = 2.5, Z: -6.5 sd -8.5)
        const beamWingEntry = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.6, 2.0), MATS.wallCream);
        beamWingEntry.position.set(2.5, 3.3, -7.5);
        interiorGroup.add(beamWingEntry);

        // 6. PERANGKAT INTERIOR & PERABOT REALISTIS HO (100% PERSIS TITIK DENAH 2D CAD):
        // -------------------------------------------------------------------------------------

        // A. Area Lobi & Resepsionis (Titik 5: RPI-01 pada [-0.2, 1.4, 2.4])
        // Meja resepsionis dan meja tunggu tamu dihilangkan seluruhnya sesuai instruksi

        // Sofa / Kursi Tunggu Tamu Lobi di Sisi Kiri Fasad
        const waitingSofa = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.75), MATS.wallSage);
        waitingSofa.position.set(-4.2, 0.225, 1.6);
        interiorGroup.add(waitingSofa);

        // Gateway Resepsionis RPI-01 Box & Blinking LED (Titik 5)
        const rpiBox = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.2), MATS.metalFrame);
        rpiBox.position.set(-0.2, 1.09, 2.4);
        interiorGroup.add(rpiBox);

        const rpiLed = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10B981 }));
        rpiLed.position.set(-0.12, 1.14, 2.4);
        interiorGroup.add(rpiLed);
        FP3D.blinkingLeds.push({ mesh: rpiLed, rate: 4 });

        // B. Smart TV Display 65 Inch di Ruang Tengah-Bawah Kiri (Titik 2: SMTV-01 pada [-3.4, 1.8, -0.1])
        const tvGroup = new THREE.Group();
        const tvFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 0.06), MATS.metalFrame);
        const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 1.02), new THREE.MeshBasicMaterial({ color: 0x06B6D4 }));
        tvScreen.rotation.y = Math.PI;
        tvScreen.position.z = -0.04;
        tvGroup.add(tvFrame);
        tvGroup.add(tvScreen);
        tvGroup.position.set(-3.4, 2.0, 0.32);
        interiorGroup.add(tvGroup);

        // C. Workstation Koridor Kanan (Titik 3.1: PC-01 pada [1.3, 1.4, -1.0])
        interiorGroup.add(buildDetailedDeskMesh(1.3, -1.0, 'PC-01 (3.1)', -Math.PI / 2));

        // D. Workstation Ruang Staf Bawah-Tengah (Titik 3.4: PC-02 pada [-3.8, 1.4, -1.9])
        interiorGroup.add(buildDetailedDeskMesh(-3.8, -1.9, 'PC-02 (3.4)', 0));

        // E. Gateway Router Koridor Tengah-Atas (Titik 6: RTR-01 pada [0.4, 1.8, -4.3])
        const routerBox = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.28), MATS.metalFrame);
        routerBox.position.set(0.4, 0.20, -4.3);
        interiorGroup.add(routerBox);

        [-0.1, 0.1].forEach(ax => {
            const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.35), MATS.metalFrame);
            ant.position.set(0.4 + ax, 1.27, -4.38);
            ant.rotation.z = ax * 0.4;
            interiorGroup.add(ant);
        });

        const rtrLed = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10B981 }));
        rtrLed.position.set(0.4, 1.14, -4.15);
        interiorGroup.add(rtrLed);
        FP3D.blinkingLeds.push({ mesh: rtrLed, rate: 5 });

        // F. Modul Sensor IoT Dinding Kiri Ruang Atas-Tengah (Titik 4: ESP-01 pada [-5.2, 1.4, -4.8])
        interiorGroup.add(buildDetailedDeskMesh(-5.0, -4.8, 'ESP-01 (4)', Math.PI / 2));

        const espBox = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.16), new THREE.MeshStandardMaterial({ color: 0x1E3A8A }));
        espBox.position.set(-5.2, 1.14, -4.8);
        interiorGroup.add(espBox);

        const espAnt = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.2), MATS.metalFrame);
        espAnt.position.set(-5.12, 1.24, -4.8);
        interiorGroup.add(espAnt);

        const espLed = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), new THREE.MeshBasicMaterial({ color: 0x38BDF8 }));
        espLed.position.set(-5.15, 1.19, -4.8);
        interiorGroup.add(espLed);
        FP3D.blinkingLeds.push({ mesh: espLed, rate: 3 });

        // G. Kamera Pengawas Pintu Masuk Gerbang Depan (Titik 1: CCTV-01 pada [-4.3, 2.0, 4.0])
        const cctvHoUnit = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.18, 0.38), MATS.carWhite);
        cctvHoUnit.position.set(-4.3, 2.35, 3.72);
        interiorGroup.add(cctvHoUnit);

        // Rak Server & UPS di Sayap Kanan Belakang L
        const srvRack = buildDetailedServerRackMesh();
        srvRack.position.set(5.5, 0.15, -10.5);
        interiorGroup.add(srvRack);

        const upsUnit = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.8, 0.7), MATS.metalFrame);
        upsUnit.position.set(6.6, 0.9, -8.2);
        interiorGroup.add(upsUnit);

        // Warm Architectural Interior Downlights (Menjadikan model 3D tampak mewah, hidup & premium)
        const lightLobby = new THREE.PointLight(0xFEF3C7, 0.85, 9);
        lightLobby.position.set(0.5, 3.0, 2.0);
        interiorGroup.add(lightLobby);

        const lightR1 = new THREE.PointLight(0xFFFBEB, 0.75, 9);
        lightR1.position.set(-4.0, 3.0, -1.2);
        interiorGroup.add(lightR1);

        const lightR2 = new THREE.PointLight(0xFFFBEB, 0.75, 9);
        lightR2.position.set(-4.0, 3.0, -4.8);
        interiorGroup.add(lightR2);

        const lightCorridor = new THREE.PointLight(0xFFFBEB, 0.65, 12);
        lightCorridor.position.set(0.5, 3.0, -3.0);
        interiorGroup.add(lightCorridor);

        const lightR4 = new THREE.PointLight(0x38BDF8, 0.95, 10);
        lightR4.position.set(5.0, 3.0, -9.5);
        interiorGroup.add(lightR4);

        // Tanaman Hias Hijau Indoor (Biophilic Design Kantor Modern)
        interiorGroup.add(buildPottedPlantMesh(1.8, 0.1, 2.8));
        interiorGroup.add(buildPottedPlantMesh(-5.6, 0.1, 2.8));

        // Underfloor Blue LED Plenum Lighting (Pencahayaan Kolom Server Ruang 4)
        const rackGlow = new THREE.PointLight(0x00E5FF, 1.4, 6);
        rackGlow.position.set(5.5, 0.25, -10.5);
        interiorGroup.add(rackGlow);

        houseGroup.add(interiorGroup);
        root.add(houseGroup);

        // D. SISTEM ATAP BENTUK L REALISTIS (GENTENG TERRACOTTA DENGAN X-RAY MODE)
        // Sesuai Desain Ahmad Aziz (HO 1-4.jpeg): Satu Bubungan Utama di Depan + Sayap Belakang L
        // 1. Atap Badan Utama (X: -6.8 sd 2.8, Z: 3.8 sd -12.8)
        const rLeft = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.22, 16.6), MATS.roofTerracotta);
        rLeft.position.set(-4.4, 4.8, -4.5);
        rLeft.rotation.z = Math.PI / 8.5;
        rLeft.castShadow = true;
        roofGroup.add(rLeft);

        const rRight = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.22, 16.6), MATS.roofTerracotta);
        rRight.position.set(0.4, 4.8, -4.5);
        rRight.rotation.z = -Math.PI / 8.5;
        rRight.castShadow = true;
        roofGroup.add(rRight);

        const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.32, 16.8), MATS.roofRidge);
        ridge.position.set(-2.0, 5.85, -4.5);
        roofGroup.add(ridge);

        // 5 Panel Surya Fotovoltaik pada Lereng Kiri Atap
        for (let sp = -10; sp <= 2; sp += 2.6) {
            const solar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.5), MATS.solarMat);
            solar.position.set(-4.4, 4.95, sp);
            solar.rotation.z = Math.PI / 8.5;
            roofGroup.add(solar);
        }

        // Segitiga Sopil Dinding Fasad Depan (Z = 3.65)
        const triShape = new THREE.Shape();
        triShape.moveTo(-4.5, 0);
        triShape.lineTo(4.5, 0);
        triShape.lineTo(0, 2.0);
        triShape.closePath();
        const fGable = new THREE.Mesh(new THREE.ShapeGeometry(triShape), MATS.wallCream);
        fGable.position.set(-2.0, 3.65, 3.65);
        roofGroup.add(fGable);

        // Plafon Penutup Lantai Utama
        const ceilMain = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.15, 16.0), MATS.wallCream);
        ceilMain.position.set(-2.0, 3.65, -4.5);
        roofGroup.add(ceilMain);

        // 2. Atap Sayap Kanan Belakang L (X: 2.5 sd 7.8, Z: -6.2 sd -12.8) - PERSIS HO 1-4.JPEG
        const rWingLeft = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.22, 6.4), MATS.roofTerracotta);
        rWingLeft.position.set(3.7, 4.5, -9.5);
        rWingLeft.rotation.z = Math.PI / 8.5;
        rWingLeft.castShadow = true;
        roofGroup.add(rWingLeft);

        const rWingRight = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.22, 6.4), MATS.roofTerracotta);
        rWingRight.position.set(6.4, 4.5, -9.5);
        rWingRight.rotation.z = -Math.PI / 8.5;
        rWingRight.castShadow = true;
        roofGroup.add(rWingRight);

        const ridgeWing = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 6.6), MATS.roofRidge);
        ridgeWing.position.set(5.05, 5.1, -9.5);
        roofGroup.add(ridgeWing);

        // Plafon Penutup Sayap Kanan
        const ceilWing = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.15, 6.0), MATS.wallCream);
        ceilWing.position.set(5.0, 3.65, -9.5);
        roofGroup.add(ceilWing);

        root.add(roofGroup);

        // CCTV Depan DIHILANGKAN sesuai instruksi user
        FP3D.cctvCones.ho = null;

        // F. Pin IoT Interaktif HO (6 Perangkat Sesuai Denah 2D)
        FP3D.sitePinMeshes.ho = [];
        FP3D.siteData.ho.devices.forEach(dev => {
            pinsGroup.add(createDevicePinMesh(dev, 'ho'));
        });
        root.add(pinsGroup);

        return { group: root, roofGroup: roofGroup, pins: FP3D.sitePinMeshes.ho };
    }

    // -------------------------------------------------------------------------
    // 4. BUILDER GEDUNG 2: MARKETING OFFICE (MO - STOREFRONT RUKO SESUAI MO 1-5.JPEG)
    // -------------------------------------------------------------------------
    function buildMOBuilding() {
        const root = new THREE.Group();
        root.name = 'moBuilding';
        const roofGroup = new THREE.Group();
        roofGroup.name = 'moRoof';
        const pinsGroup = new THREE.Group();
        pinsGroup.name = 'moPins';

        // B. Bangunan Ruko Modern Storefront MO (Sama Persis MO 1-5.jpeg)
        const building = new THREE.Group();

        // 1. Lantai Ruangan Interior (X: -5 sd 5, Z: -6.5 sd 3.5)
        const floor = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.2, 10.0), MATS.floorSlate);
        floor.position.set(0, 0.1, -1.5);
        floor.receiveShadow = true;
        building.add(floor);

        // 2. Lantai Apron / Teras Depan Antara Sayap Dinding Maju (X: -5 sd 5, Z: 3.5 sd 6.5)
        const floorPorch = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.15, 3.0), MATS.curbStone);
        floorPorch.position.set(0, 0.08, 5.0);
        floorPorch.receiveShadow = true;
        building.add(floorPorch);

        // 3. DINDING LUAR MO (Tinggi 3.6m, Tebal 0.32m):
        // Dinding Belakang Solid (Z = -6.5, X: -5 sd 5, MO 1.jpeg)
        const backW = new THREE.Mesh(new THREE.BoxGeometry(10.0, 3.6, 0.32), MATS.wallCream);
        backW.position.set(0, 1.8, -6.5);
        backW.castShadow = true;
        building.add(backW);

        // Dinding Samping Kanan Solid Maju Penuh (X = 5.0, Z: -6.5 sd 6.5, MO 3.jpeg)
        const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.6, 13.0), MATS.wallCream);
        rightW.position.set(5.0, 1.8, 0.0);
        rightW.castShadow = true;
        building.add(rightW);

        // Dinding Samping Kiri dengan Pintu Keluar & Jendela Kayu (X = -5.0, Z: -6.5 sd 6.5, MO 4.jpeg):
        // a. Dinding belakang pintu samping (Z: -6.5 sd -5.3)
        const leftWRear = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.6, 1.2), MATS.wallCream);
        leftWRear.position.set(-5.0, 1.8, -5.9);
        leftWRear.castShadow = true;
        building.add(leftWRear);

        // b. Ambang atas pintu samping kiri (Z: -5.3 sd -4.1)
        const leftLintelDoor = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.1, 1.2), MATS.wallCream);
        leftLintelDoor.position.set(-5.0, 3.05, -4.7);
        building.add(leftLintelDoor);

        // c. Pintu Kayu Keluar Samping Kiri (MO 4.jpeg)
        const leftDoor = buildDoorWithFrame(1.2, 2.5, 0.12, false);
        leftDoor.rotation.y = Math.PI / 2;
        leftDoor.position.set(-5.0, 1.25, -4.7);
        building.add(leftDoor);

        // d. Dinding tengah antara pintu samping dan jendela kayu (Z: -4.1 sd -0.4)
        const leftWMid = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.6, 3.7), MATS.wallCream);
        leftWMid.position.set(-5.0, 1.8, -2.25);
        leftWMid.castShadow = true;
        building.add(leftWMid);

        // e. Dinding bawah jendela kayu (Z: -0.4 sd 1.2, Y: 0 sd 1.2)
        const leftWBelowWin = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.2, 1.6), MATS.wallCream);
        leftWBelowWin.position.set(-5.0, 0.6, 0.4);
        building.add(leftWBelowWin);

        // f. Ambang atas jendela kayu (Y: 2.6 sd 3.6)
        const leftLintelWin = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.0, 1.6), MATS.wallCream);
        leftLintelWin.position.set(-5.0, 3.1, 0.4);
        building.add(leftLintelWin);

        // g. Jendela Kayu 2-Pane Samping Kiri (MO 4.jpeg)
        const leftWinWood = buildWindow2PaneMesh(-5.0, 1.9, 0.4, 1.6, 1.4, true);
        leftWinWood.rotation.y = Math.PI / 2;
        building.add(leftWinWood);

        // h. Dinding sayap kiri yang maju ke depan membingkai kanopi toko (Z: 1.2 sd 6.5)
        const leftWFrontWing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.6, 5.3), MATS.wallCream);
        leftWFrontWing.position.set(-5.0, 1.8, 3.85);
        leftWFrontWing.castShadow = true;
        building.add(leftWFrontWing);

        // 4. FASAD DEPAN: PINTU LIPAT KACA 8 DAUN PENUH (Z = 3.5, Lebar 9.68m, MO 1 & 5.jpeg)
        // Balok struktur atas menghubungkan sayap kiri dan kanan
        const frontHeader = new THREE.Mesh(new THREE.BoxGeometry(9.68, 0.4, 0.32), MATS.wallCream);
        frontHeader.position.set(0, 3.4, 3.5);
        frontHeader.castShadow = true;
        building.add(frontHeader);

        // Sistem Pintu Lipat Kaca 8 Daun Berbingkai Hitam dengan Handle Vertikal
        const foldingDoors = buildFoldingDoorSystem(9.68, 3.2, 8);
        foldingDoors.position.set(0, 1.6, 3.5);
        building.add(foldingDoors);

        // Neon Box Plang "TEKNOLAB MARKETING OFFICE" di Atas Fasad Depan
        const signNeon = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.9, 0.2), new THREE.MeshStandardMaterial({
            color: 0x0284C7,
            emissive: 0x0284C7,
            emissiveIntensity: 0.65,
            roughness: 0.2
        }));
        signNeon.position.set(0, 3.85, 3.68);
        building.add(signNeon);

        const signText = createTextSprite('TEKNOLAB MARKETING OFFICE', 0x38BDF8);
        signText.position.set(0, 3.85, 3.8);
        signText.scale.set(3.4, 0.75, 1);
        building.add(signText);

        // 5. INTERIOR MO: WORKSTATIONS, RAK SENTRAL, & MEJA PRESENTASI (100% PERSIS TITIK DENAH 2D CAD)
        const intGroup = new THREE.Group();

        // Rak Jaringan & Konsol Sentral MO (Menampung MikroTik MKRT-01 di [3.6, 2.4, -4.6])
        const moRack = buildDetailedServerRackMesh();
        moRack.position.set(3.6, 0.15, -4.6);
        moRack.rotation.y = -Math.PI / 2;
        intGroup.add(moRack);

        // Meja Kerja Router Subnet RTR-03 di [3.6, 1.8, -2.5]
        intGroup.add(buildDetailedDeskMesh(3.4, -2.5, 'RTR-03', -Math.PI / 2));

        // Meja Kerja Router Gateway RTR-02 di [3.6, 1.6, -0.4]
        intGroup.add(buildDetailedDeskMesh(3.4, -0.4, 'RTR-02', -Math.PI / 2));

        // Kamera Pengawas CCTV-02 di [-3.6, 2.0, 2.8]
        const cctvMoUnit = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.18, 0.38), MATS.carWhite);
        cctvMoUnit.position.set(-3.6, 2.35, 3.15);
        intGroup.add(cctvMoUnit);

        // Meja Diskusi & Presentasi Marketing di Sisi Kiri dihilangkan seluruhnya sesuai instruksi QA agar denah 3D luas
        // Warm Showroom Downlights MO
        const lightMO1 = new THREE.PointLight(0xFFFBEB, 0.95, 12);
        lightMO1.position.set(0, 3.0, 0);
        intGroup.add(lightMO1);

        const lightMO2 = new THREE.PointLight(0x0284C7, 0.8, 8);
        lightMO2.position.set(3.8, 3.0, -4.5);
        intGroup.add(lightMO2);

        // Tanaman Hias Sudut Display MO & Underfloor Glow Konsol MikroTik
        intGroup.add(buildPottedPlantMesh(-3.6, 0.1, 2.6));
        const moRackGlow = new THREE.PointLight(0x06B6D4, 1.2, 5);
        moRackGlow.position.set(3.8, 0.25, -4.5);
        intGroup.add(moRackGlow);

        building.add(intGroup);
        root.add(building);

        // C. Atap Modern Shed / Parapet Roof (Target Animasi Mode X-Ray)
        const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.35, 10.6), MATS.roofTerracotta);
        roofSlab.position.set(0, 3.8, -1.5);
        roofGroup.add(roofSlab);

        const ceil = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.15, 10.0), MATS.wallCream);
        ceil.position.set(0, 3.65, -1.5);
        roofGroup.add(ceil);

        root.add(roofGroup);

        // D. CCTV Luar MO DIHILANGKAN sepenuhnya sesuai arahan user
        FP3D.cctvCones.mo = null;

        // E. Pin Perangkat MO (4 Perangkat Terkalibrasi)
        FP3D.sitePinMeshes.mo = [];
        FP3D.siteData.mo.devices.forEach(dev => {
            pinsGroup.add(createDevicePinMesh(dev, 'mo'));
        });
        root.add(pinsGroup);

        return { group: root, roofGroup: roofGroup, pins: FP3D.sitePinMeshes.mo };
    }

    // -------------------------------------------------------------------------
    // 5. BUILDER GEDUNG 3: HOUSE OF SERVER (HS / KOS - DATA CENTER SENTRAL)
    // -------------------------------------------------------------------------
    function buildHSBuilding() {
        const root = new THREE.Group();
        root.name = 'hsBuilding';
        const roofGroup = new THREE.Group();
        roofGroup.name = 'hsRoof';
        const pinsGroup = new THREE.Group();
        pinsGroup.name = 'hsPins';

        // Unit Pendingin Luar (Outdoor Precision Chiller Unit)
        const chiller = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.0, 2.4), MATS.pillarConcrete);
        chiller.position.set(0, 1.0, -7.5);
        chiller.castShadow = true;
        root.add(chiller);

        // 5 Safety Bollards Pengaman Depan Pintu
        [-2.4, -1.2, 0, 1.2, 2.4].forEach(bx => {
            const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 16), MATS.metalFrame);
            bollard.position.set(bx, 0.45, 6.2);
            bollard.castShadow = true;
            root.add(bollard);
        });

        // B. Bangunan Server Vault Berkeamanan Tinggi
        const building = new THREE.Group();
        // Raised Floor Server Grid
        const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.35, 10), MATS.floorSlate);
        floor.position.set(0, 0.175, 0);
        floor.receiveShadow = true;
        building.add(floor);

        const backW = new THREE.Mesh(new THREE.BoxGeometry(10, 4.0, 0.38), MATS.wallCharcoal);
        backW.position.set(0, 2.15, -5);
        backW.castShadow = true;
        building.add(backW);

        const leftW = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.0, 10), MATS.wallCharcoal);
        leftW.position.set(-5, 2.15, 0);
        leftW.castShadow = true;
        building.add(leftW);

        const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.38, 4.0, 10), MATS.wallCharcoal);
        rightW.position.set(5, 2.15, 0);
        rightW.castShadow = true;
        building.add(rightW);

        // Pintu Biometrik Berkode Akses
        const fLeft = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.0, 0.38), MATS.wallCharcoal);
        fLeft.position.set(-3.2, 2.15, 5);
        fLeft.castShadow = true;
        building.add(fLeft);

        const fRight = new THREE.Mesh(new THREE.BoxGeometry(4.4, 4.0, 0.38), MATS.wallCharcoal);
        fRight.position.set(2.8, 2.15, 5);
        fRight.castShadow = true;
        building.add(fRight);

        const secDoor = new THREE.Mesh(new THREE.BoxGeometry(2.0, 3.0, 0.18), MATS.metalFrame);
        secDoor.position.set(-0.4, 1.65, 5);
        building.add(secDoor);

        // C. Interior Data Center (4 Rak Server Inti Sesuai Denah 2D CAD dari Atas ke Bawah: SWM-01, RPI-02, MKRT-02, SRV-01)
        const intGroup = new THREE.Group();
        
        // Rak Server Bay 1 - Atas (SWM-01 pada [3.5, 2.4, -0.3])
        const rackA = buildDetailedServerRackMesh();
        rackA.position.set(3.5, 0.175, -0.3);
        rackA.rotation.y = -Math.PI / 2;
        intGroup.add(rackA);

        // Rak Server Bay 2 - Tengah Atas (RPI-02 pada [3.5, 2.4, 1.1])
        const rackB = buildDetailedServerRackMesh();
        rackB.position.set(3.5, 0.175, 1.1);
        rackB.rotation.y = -Math.PI / 2;
        intGroup.add(rackB);

        // Rak Server Bay 3 - Tengah Bawah (MKRT-02 pada [3.5, 2.4, 2.5])
        const rackC = buildDetailedServerRackMesh();
        rackC.position.set(3.5, 0.175, 2.5);
        rackC.rotation.y = -Math.PI / 2;
        intGroup.add(rackC);

        // Rak Server Bay 4 - Bawah (SRV-01 pada [3.5, 2.4, 3.9])
        const rackD = buildDetailedServerRackMesh();
        rackD.position.set(3.5, 0.175, 3.9);
        rackD.rotation.y = -Math.PI / 2;
        intGroup.add(rackD);

        // Meja Kerja Konsol NOC & Monitoring Administrator di Sisi Kiri
        intGroup.add(buildDetailedDeskMesh(-2.6, 0.0, 'NOC Ops', Math.PI / 2));

        // Tabung Pemadam Api Gas FM-200 Merah
        const fm200 = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.8, 16), new THREE.MeshStandardMaterial({ color: 0xDC2626 }));
        fm200.position.set(-4.2, 1.05, 4.2);
        intGroup.add(fm200);

        // Unit AC Presisi (CRAC Unit)
        const acUnit = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.0, 1.1), MATS.wallCream);
        acUnit.position.set(-4.0, 1.65, 2.0);
        intGroup.add(acUnit);

        // High-Tech Cyber Illumination House of Server (Cyan & Emerald)
        const lightHS1 = new THREE.PointLight(0x0EA5E9, 1.25, 12);
        lightHS1.position.set(2.5, 3.0, 0);
        intGroup.add(lightHS1);

        const lightHS2 = new THREE.PointLight(0x10B981, 0.7, 9);
        lightHS2.position.set(-2.5, 3.0, 0);
        intGroup.add(lightHS2);

        // Raised-Floor Cyber Glow (Pencahayaan Lantai Panggung Server HOS)
        const hsFloorGlow = new THREE.PointLight(0x00D2FF, 1.8, 8);
        hsFloorGlow.position.set(3.2, 0.25, 0);
        intGroup.add(hsFloorGlow);

        // Plang Akses Sentral Data Center di Atas Pintu Keamanan
        const hsSign = createTextSprite('CENTRAL DATA CENTER TIER-2', 0x38BDF8);
        hsSign.position.set(-0.4, 3.65, 5.22);
        hsSign.scale.set(3.6, 0.75, 1);
        building.add(hsSign);

        building.add(intGroup);
        root.add(building);

        // D. Atap Datar dengan Exhaust Fan HVAC
        const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.35, 10.8), MATS.roofTerracotta);
        roofSlab.position.set(0, 4.25, 0);
        roofGroup.add(roofSlab);

        const fan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.65, 16), MATS.metalFrame);
        fan1.position.set(-2, 4.75, -1);
        roofGroup.add(fan1);

        const fan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.65, 16), MATS.metalFrame);
        fan2.position.set(2, 4.75, 1);
        roofGroup.add(fan2);

        root.add(roofGroup);

        // E. CCTV Luar HOS DIHILANGKAN sepenuhnya sesuai arahan user
        FP3D.cctvCones.hs = null;

        // F. Pin Perangkat HS (4 Perangkat)
        FP3D.sitePinMeshes.hs = [];
        FP3D.siteData.hs.devices.forEach(dev => {
            pinsGroup.add(createDevicePinMesh(dev, 'hs'));
        });
        root.add(pinsGroup);

        return { group: root, roofGroup: roofGroup, pins: FP3D.sitePinMeshes.hs };
    }

    // -------------------------------------------------------------------------
    // 5A. KOMPONEN BIOPHILIC & CYBER DATA STREAM NETWORK PIPELINE
    // -------------------------------------------------------------------------
    function buildPottedPlantMesh(x, y, z) {
        const plantGroup = new THREE.Group();
        // Pot keramik modern abu-abu gelap
        const potGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.52, 16);
        const potMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
        const pot = new THREE.Mesh(potGeo, potMat);
        pot.position.y = 0.26;
        pot.castShadow = true;
        plantGroup.add(pot);

        // Tanah pot
        const soilGeo = new THREE.CircleGeometry(0.22, 16);
        const soilMat = new THREE.MeshStandardMaterial({ color: 0x1C1917, roughness: 0.9 });
        const soil = new THREE.Mesh(soilGeo, soilMat);
        soil.rotation.x = -Math.PI / 2;
        soil.position.y = 0.51;
        plantGroup.add(soil);

        // Daun tanaman hias indoor (Monstera / Ficus)
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.6 });
        const leafPositions = [
            [0, 0.72, 0, 0.35],
            [-0.15, 0.88, 0.1, 0.28],
            [0.15, 0.82, -0.1, 0.26],
            [-0.08, 0.95, -0.15, 0.24],
            [0.1, 1.05, 0.08, 0.22]
        ];
        leafPositions.forEach(lp => {
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(lp[3], 8, 8), leafMat);
            leaf.position.set(lp[0], lp[1], lp[2]);
            leaf.scale.set(1.0, 0.5, 1.2);
            leaf.castShadow = true;
            plantGroup.add(leaf);
        });

        plantGroup.position.set(x, y, z);
        return plantGroup;
    }

    function buildCyberDataStreams() {
        const streamsGroup = new THREE.Group();
        streamsGroup.name = 'cyberStreams';
        FP3D.dataPackets = [];

        // Definisi 4 Alur Jaringan Cyber Transmisi Data Fiber Optik Antar Gedung
        const streamDefs = [
            {
                name: 'MO-HO-Backbone',
                color: 0x06B6D4, // Neon Cyan
                points: [
                    new THREE.Vector3(-22.4, 1.8, -0.4),   // MO RTR-02
                    new THREE.Vector3(-17.0, 4.8, -1.0),   // Keluar MO naik melengkung
                    new THREE.Vector3(-8.0, 5.2, -2.8),    // Menyeberang ke HO
                    new THREE.Vector3(0.4, 2.0, -4.3)      // HO RTR-01 Koridor
                ],
                packetCount: 4,
                speed: 0.0038,
                size: 0.16
            },
            {
                name: 'HO-HOS-Fiber-Trunk',
                color: 0x10B981, // Neon Emerald
                points: [
                    new THREE.Vector3(0.4, 2.0, -4.3),     // HO RTR-01 Koridor
                    new THREE.Vector3(9.5, 5.5, -3.2),     // Naik melintasi taman timur
                    new THREE.Vector3(19.0, 5.0, -2.6),    // Menuju HOS
                    new THREE.Vector3(29.5, 2.6, -2.3)     // HOS SWM-01
                ],
                packetCount: 4,
                speed: 0.0048,
                size: 0.18
            },
            {
                name: 'HO-IoT-Lab-Stream',
                color: 0xA855F7, // Neon Purple
                points: [
                    new THREE.Vector3(0.4, 2.0, -4.3),     // HO RTR-01
                    new THREE.Vector3(-2.4, 3.1, -4.6),    // Menyeberang ke Ruang Staf Atas
                    new THREE.Vector3(-5.2, 1.6, -4.8)     // ESP-01 (4)
                ],
                packetCount: 3,
                speed: 0.0035,
                size: 0.14
            },
            {
                name: 'HO-Reception-Display-Stream',
                color: 0xF59E0B, // Neon Amber
                points: [
                    new THREE.Vector3(-0.2, 1.6, 2.4),     // RPI-01 (5) Resepsionis
                    new THREE.Vector3(-1.8, 2.6, 1.1),     // Menuju Ruang Tengah
                    new THREE.Vector3(-3.4, 2.0, -0.1)     // SMTV-01 (2) Display
                ],
                packetCount: 2,
                speed: 0.0030,
                size: 0.14
            }
        ];

        streamDefs.forEach(def => {
            const curve = new THREE.CatmullRomCurve3(def.points);
            // 1. Pipa Saluran Fiber Optik Semi-Transparan Bercahaya
            const tubeGeo = new THREE.TubeGeometry(curve, 60, 0.038, 8, false);
            const tubeMat = new THREE.MeshBasicMaterial({
                color: def.color,
                transparent: true,
                opacity: 0.38,
                depthWrite: false
            });
            const tube = new THREE.Mesh(tubeGeo, tubeMat);
            streamsGroup.add(tube);

            // 2. Paket Data Cahaya Berjalan (Data Stream Packets)
            for (let i = 0; i < def.packetCount; i++) {
                const pktGeo = new THREE.SphereGeometry(def.size, 12, 12);
                const pktMat = new THREE.MeshBasicMaterial({
                    color: 0xFFFFFF,
                    transparent: true,
                    opacity: 0.95
                });
                const pktMesh = new THREE.Mesh(pktGeo, pktMat);

                // Tambahkan outer halo glow pada paket
                const haloGeo = new THREE.SphereGeometry(def.size * 1.6, 10, 10);
                const haloMat = new THREE.MeshBasicMaterial({
                    color: def.color,
                    transparent: true,
                    opacity: 0.65
                });
                pktMesh.add(new THREE.Mesh(haloGeo, haloMat));

                streamsGroup.add(pktMesh);

                FP3D.dataPackets.push({
                    mesh: pktMesh,
                    curve: curve,
                    progress: (i / def.packetCount) + Math.random() * 0.1,
                    speed: def.speed
                });
            }
        });

        FP3D.cyberStreamsGroup = streamsGroup;
        return streamsGroup;
    }

    // -------------------------------------------------------------------------
    // 5B. PERAKITAN KAWASAN KAMPUS TERPADU (UNIFIED INTEGRATED CAMPUS)
    // -------------------------------------------------------------------------
    function buildUnifiedCampus() {
        if (FP3D.campusRoot) return FP3D.campusRoot;

        const campus = new THREE.Group();
        campus.name = 'campusRoot';

        // 1. Lingkungan Kampus Terpadu (Lansekap, Jalan Boulevard, Gerbang, Pos Satpam, Plang Kawasan, Ruko & Rumah Warga)
        const env = buildCampusEnvironment();
        campus.add(env);
        FP3D.campusEnvGroup = env;

        // 2. Gedung 1: Head Office (HO) di Zona Tengah (0, 0, 0)
        const ho = buildHOBuilding();
        ho.group.position.set(0, 0, 0);
        campus.add(ho.group);
        FP3D.siteGroups.ho = ho.group;
        FP3D.roofGroups.ho = ho.roofGroup;

        // 3. Gedung 2: Marketing Office (MO) di Zona Depan Kiri (-26, 0, 0)
        const mo = buildMOBuilding();
        mo.group.position.set(-26, 0, 0);
        campus.add(mo.group);
        FP3D.siteGroups.mo = mo.group;
        FP3D.roofGroups.mo = mo.roofGroup;

        // 4. Gedung 3: House of Server (HOS) di Zona Belakang Kanan Steril (26, 0, -2)
        const hs = buildHSBuilding();
        hs.group.position.set(26, 0, -2);
        campus.add(hs.group);
        FP3D.siteGroups.hs = hs.group;
        FP3D.roofGroups.hs = hs.roofGroup;

        // 5. Saluran Cyber Network Data Streams (Animasi Denyut Transmisi Data Fiber Optik Antar Gedung)
        const cyberStreams = buildCyberDataStreams();
        campus.add(cyberStreams);

        // Kumpulkan semua 13 pin terkalibrasi untuk mode Kawasan (Semua)
        FP3D.sitePinMeshes.all = [
            ...(FP3D.sitePinMeshes.ho || []),
            ...(FP3D.sitePinMeshes.mo || []),
            ...(FP3D.sitePinMeshes.hs || [])
        ];

        FP3D.siteGroups.all = campus;
        FP3D.campusRoot = campus;

        if (FP3D.scene) {
            FP3D.scene.add(campus);
        }

        return campus;
    }

    function buildHOSite() {
        if (!FP3D.campusRoot) buildUnifiedCampus();
        return { root: FP3D.siteGroups.ho, roofGroup: FP3D.roofGroups.ho, pinsGroup: FP3D.siteGroups.ho.getObjectByName('hoPins') };
    }

    function buildMOSite() {
        if (!FP3D.campusRoot) buildUnifiedCampus();
        return { root: FP3D.siteGroups.mo, roofGroup: FP3D.roofGroups.mo, pinsGroup: FP3D.siteGroups.mo.getObjectByName('moPins') };
    }

    function buildHSSite() {
        if (!FP3D.campusRoot) buildUnifiedCampus();
        return { root: FP3D.siteGroups.hs, roofGroup: FP3D.roofGroups.hs, pinsGroup: FP3D.siteGroups.hs.getObjectByName('hsPins') };
    }


        // -------------------------------------------------------------------------
    // 6. HELPER ELEMEN 3D REALISTIS: MOBIL, MOTOR, RAK SERVER, CCTV, POHON
    // -------------------------------------------------------------------------
    function buildRealisticCarMesh() {
        const car = new THREE.Group();

        // Bodi bawah mobil putih
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.65, 4.5), MATS.carWhite);
        body.position.set(0, 0.55, 0);
        body.castShadow = true;
        car.add(body);

        // Kabin atas dengan kaca film hitam
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.6, 2.4), new THREE.MeshStandardMaterial({
            color: 0x0F172A,
            metalness: 0.8,
            roughness: 0.1
        }));
        cabin.position.set(0, 1.15, -0.3);
        car.add(cabin);

        // Lampu Depan Headlights (Bercahaya saat Malam)
        const lightGeo = new THREE.BoxGeometry(0.35, 0.15, 0.08);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A });
        const hlL = new THREE.Mesh(lightGeo, lightMat);
        hlL.position.set(-0.7, 0.6, 2.26);
        const hlR = new THREE.Mesh(lightGeo, lightMat);
        hlR.position.set(0.7, 0.6, 2.26);
        car.add(hlL);
        car.add(hlR);

        // 4 Roda Karet dengan Velg Sport
        const tireGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 16);
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x090D16, roughness: 0.8 });
        [
            [-1.0, 0.34, 1.3], [1.0, 0.34, 1.3],
            [-1.0, 0.34, -1.3], [1.0, 0.34, -1.3]
        ].forEach(([wx, wy, wz]) => {
            const w = new THREE.Mesh(tireGeo, tireMat);
            w.rotation.z = Math.PI / 2;
            w.position.set(wx, wy, wz);
            car.add(w);
        });

        return car;
    }

    function buildMotorbikeMesh() {
        const bike = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 1.8), MATS.metalFrame);
        frame.position.set(0, 0.55, 0);
        bike.add(frame);

        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.9), new THREE.MeshStandardMaterial({ color: 0x1E293B }));
        seat.position.set(0, 0.88, -0.2);
        bike.add(seat);

        const wGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.12, 16);
        const wMat = new THREE.MeshStandardMaterial({ color: 0x090D16, roughness: 0.8 });
        const wFront = new THREE.Mesh(wGeo, wMat);
        wFront.rotation.z = Math.PI / 2;
        wFront.position.set(0, 0.28, 0.8);
        bike.add(wFront);

        const wBack = new THREE.Mesh(wGeo, wMat);
        wBack.rotation.z = Math.PI / 2;
        wBack.position.set(0, 0.28, -0.8);
        bike.add(wBack);

        return bike;
    }

    function buildDetailedServerRackMesh() {
        const rack = new THREE.Group();

        // Rangka Bodi Rack 42U Biru Tua Metalik
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.2, 1.4), MATS.serverBlue);
        body.position.set(0, 1.6, 0);
        body.castShadow = true;
        rack.add(body);

        // Panel Depan Tekstur 42U
        const frontPanel = new THREE.Mesh(new THREE.PlaneGeometry(1.48, 3.0), MATS.rackFrontMat);
        frontPanel.position.set(0, 1.6, 0.705);
        rack.add(frontPanel);

        // Kaca Pintu Depan Tempered Glass
        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 0.04), MATS.glass);
        glass.position.set(0, 1.6, 0.73);
        rack.add(glass);

        // Indikator LED Dinamis Berkedip
        const ledMat1 = new THREE.MeshBasicMaterial({ color: 0x10B981 });
        const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), ledMat1);
        led1.position.set(0.45, 2.4, 0.76);
        rack.add(led1);
        FP3D.blinkingLeds.push({ mesh: led1, rate: 4 });

        const ledMat2 = new THREE.MeshBasicMaterial({ color: 0x38BDF8 });
        const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), ledMat2);
        led2.position.set(0.45, 2.0, 0.76);
        rack.add(led2);
        FP3D.blinkingLeds.push({ mesh: led2, rate: 7 });

        return rack;
    }

    function buildDetailedDeskMesh(x, z, label, facingRot) {
        // Meja interior 3D dihilangkan seluruhnya sesuai instruksi QA agar denah 3D luas dan fokus pada titik perangkat
        return new THREE.Group();
    }

    function buildWindowMesh(x, y, z, w, h) {
        const win = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), MATS.metalFrame);
        const glass = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.16, h - 0.16), MATS.glass);
        glass.position.z = 0.065;
        win.add(frame);
        win.add(glass);
        win.position.set(x, y, z);
        return win;
    }

    function buildTreeMesh(x, z) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 2.2, 8), MATS.woodDoor);
        trunk.position.y = 1.1;
        trunk.castShadow = true;
        tree.add(trunk);

        const leaves = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3, 1), MATS.groundGrass);
        leaves.position.y = 2.6;
        leaves.castShadow = true;
        tree.add(leaves);

        tree.position.set(x, 0, z);
        return tree;
    }

    function buildOutdoorAcMesh(x, y, z) {
        const ac = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.0, 0.6), MATS.wallCream);
        body.position.set(0, 0.5, 0);
        body.castShadow = true;
        ac.add(body);

        [-0.35, 0.35].forEach(fx => {
            const grill = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16), MATS.metalFrame);
            grill.rotation.x = Math.PI / 2;
            grill.position.set(fx, 0.5, 0.31);
            ac.add(grill);
        });

        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8), new THREE.MeshStandardMaterial({ color: 0xB45309, metalness: 0.8 }));
        pipe.position.set(0.6, 0.3, -0.1);
        ac.add(pipe);

        ac.position.set(x, y, z);
        return ac;
    }

    function buildPlanterBoxMesh(x, z) {
        const box = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 0.8), MATS.pillarConcrete);
        box.position.set(x, 0.25, z);
        return box;
    }

    function buildCctvCameraMesh() {
        const group = new THREE.Group();

        // Bodi kamera CCTV Bullet putih
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.45, 16), MATS.carWhite);
        body.rotation.x = Math.PI / 2;
        group.add(body);

        // Lensa depan hitam
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16), new THREE.MeshBasicMaterial({ color: 0x0F172A }));
        lens.rotation.x = Math.PI / 2;
        lens.position.z = 0.24;
        group.add(lens);

        // Lampu LED Merah Status Merekam (Blinking Recording Dot)
        const recLed = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshBasicMaterial({ color: 0xEF4444 }));
        recLed.position.set(0.08, 0.08, 0.25);
        group.add(recLed);
        FP3D.blinkingLeds.push({ mesh: recLed, rate: 3 });

        // Kerucut Sorot Kuning Semi-Transparan (Yellow Vision Cone Sesuai Konsep Aziz)
        const coneHeight = 8.8;
        const coneRadius = 4.4;
        const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 24, 1, true);
        coneGeo.translate(0, -coneHeight / 2, 0);

        const coneMat = new THREE.MeshBasicMaterial({
            color: 0xF59E0B, // Kuning neon amber CCTV
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.rotation.x = -Math.PI / 3.2;
        cone.rotation.y = Math.PI / 6;
        cone.position.set(0, 0, 0.25);
        group.add(cone);

        group.rotation.y = -Math.PI / 4;
        return { group, cone };
    }

    // -------------------------------------------------------------------------
    // 7. PIN PERANGKAT IOT ARSITEKTURAL DENGAN BEACON & RADAR SINKRON 2D CAD
    // -------------------------------------------------------------------------
    const DEFAULT_3D_DEVICE_META = {
        'PC-01':   { badge: 'PC-01 (3.1)', name: 'PC Head Office 01 - Titik 3.1', room: 'Workstation Staf & Display', ip: '192.168.1.2', pos: [1.3, 1.4, -1.0], left2d: 71.0, top2d: 54.0, icon: 'fa-desktop', site: 'ho' },
        'PC-02':   { badge: 'PC-02 (3.4)', name: 'PC Head Office 02 - Titik 3.4', room: 'Workstation Staf & Display', ip: '192.168.1.7', pos: [-3.8, 1.4, -1.9], left2d: 54.0, top2d: 50.0, icon: 'fa-desktop', site: 'ho' },
        'SMTV-01': { badge: 'SMTV-01 (2)', name: 'Smart TV Head Office - Titik 2', room: 'Workstation Staf & Display', ip: '192.168.1.10', pos: [-3.4, 1.8, -0.1], left2d: 55.5, top2d: 56.0, icon: 'fa-tv', site: 'ho' },
        'RTR-01':  { badge: 'RTR-01 (6)', name: 'Router Head Office - Titik 6', room: 'Jaringan & Sensor IoT', ip: '192.168.1.1', pos: [0.4, 1.8, -4.3], left2d: 66.0, top2d: 40.7, icon: 'fa-wifi', site: 'ho' },
        'ESP-01':  { badge: 'ESP-01 (4)', name: 'ESP32 Head Office - Titik 4', room: 'Jaringan & Sensor IoT', ip: '192.168.1.15', pos: [-5.2, 1.4, -4.8], left2d: 42.0, top2d: 38.7, icon: 'fa-microchip', site: 'ho' },
        'RPI-01':  { badge: 'RPI-01 (5)', name: 'Raspberry Pi HO - Titik 5', room: 'Jaringan & Sensor IoT', ip: '192.168.1.20', pos: [-0.2, 1.4, 2.4], left2d: 63.0, top2d: 65.0, icon: 'fa-microchip', site: 'ho' },
        'CCTV-01': { badge: 'CCTV-01 (1)', name: 'CCTV Head Office - Titik 1', room: 'Gerbang & Pengawasan', ip: '192.168.1.39', pos: [-4.3, 2.0, 4.0], left2d: 49.5, top2d: 69.5, icon: 'fa-video', site: 'ho' },
        'MKRT-01': { badge: 'MKRT-01', name: 'Mikrotik Marketing', room: 'Routing & Gateway Jaringan', ip: '192.168.2.13', pos: [3.6, 2.4, -4.6], left2d: 78.5, top2d: 24.0, icon: 'fa-server', site: 'mo' },
        'RTR-03':  { badge: 'RTR-03', name: 'Router Marketing 03', room: 'Routing & Gateway Jaringan', ip: '192.168.2.3', pos: [3.6, 1.8, -2.5], left2d: 78.5, top2d: 33.0, icon: 'fa-network-wired', site: 'mo' },
        'RTR-02':  { badge: 'RTR-02', name: 'Router Marketing 02', room: 'Routing & Gateway Jaringan', ip: '192.168.0.1', pos: [3.6, 1.6, -0.4], left2d: 78.5, top2d: 42.0, icon: 'fa-network-wired', site: 'mo' },
        'CCTV-02': { badge: 'CCTV-02', name: 'CCTV Marketing', room: 'Pengawasan Keamanan MO', ip: '192.168.1.3', pos: [-3.6, 2.0, 2.8], left2d: 41.0, top2d: 60.5, icon: 'fa-video', site: 'mo' },
        'SWM-01':  { badge: 'SWM-01', name: 'Switch Manageable', room: 'Core Server Rack & Backbone', ip: '192.168.20.2', pos: [3.5, 2.4, -0.3], left2d: 78.5, top2d: 44.0, icon: 'fa-bars-progress', site: 'hs' },
        'RPI-02':  { badge: 'RPI-02', name: 'Raspberry Pi Server', room: 'Core Server Rack & Backbone', ip: '192.168.20.15', pos: [3.5, 2.4, 1.1], left2d: 78.5, top2d: 51.0, icon: 'fa-microchip', site: 'hs' },
        'MKRT-02': { badge: 'MKRT-02', name: 'Mikrotik Server', room: 'Core Server Rack & Backbone', ip: '192.168.20.1', pos: [3.5, 2.4, 2.5], left2d: 78.5, top2d: 58.0, icon: 'fa-network-wired', site: 'hs' },
        'SRV-01':  { badge: 'SRV-01', name: 'Server Utama', room: 'Core Server Rack & Backbone', ip: '192.168.20.10', pos: [3.5, 2.4, 3.9], left2d: 78.5, top2d: 65.0, icon: 'fa-server', site: 'hs' }
    };

    // Skala konversi % denah 2D -> meter ruang 3D per gedung (dipakai konversi maju & mundur)
    const FP3D_SCALE = {
        ho: { x0: -6.5, xs: 14.0 / 46.2, bl0: 30.0, z0: -12.5, zs: 18.0 / 61.1, t0: 15.3, xr: [-5.8, 6.8], zr: [-11.8, 4.5], y: 1.6 },
        mo: { x0: -5.0, xs: 10.0 / 45.7, bl0: 28.7, z0: -6.5, zs: 10.0 / 55.7, t0: 19.4, xr: [-4.3, 4.2], zr: [-5.8, 3.2], y: 1.8 },
        hs: { x0: -5.0, xs: 10.0 / 53.7, bl0: 22.9, z0: -5.0, zs: 10.0 / 50.2, t0: 20.4, xr: [-4.3, 4.2], zr: [-4.3, 4.3], y: 2.2 }
    };

    function convert2DPinTo3DCoord(siteKey, leftPct, topPct, code, pin) {
        const meta = DEFAULT_3D_DEVICE_META[code];
        const sKey = (siteKey === 'mentor' || siteKey === 'server') ? 'hs' : siteKey;
        const sc = FP3D_SCALE[sKey] || FP3D_SCALE.ho;
        const clamp = (v, r) => Math.max(r[0], Math.min(r[1], v));

        // 1. Titik yang dipasang lewat klik langsung di lantai 3D (posisi 3D persis, selama X/Y belum diubah manual)
        if (pin && pin.p3 && Math.abs(pin.p3.left - leftPct) < 0.06 && Math.abs(pin.p3.top - topPct) < 0.06) {
            return [pin.p3.x, 0.05, pin.p3.z];
        }
        // 2. Titik bawaan CAD: posisi terkalibrasi + pergeseran relatif jika digeser dari 2D
        if (meta && meta.site === sKey) {
            const dx = (leftPct - meta.left2d) * sc.xs;
            const dz = (topPct - meta.top2d) * sc.zs;
            if (Math.abs(dx) < 0.001 && Math.abs(dz) < 0.001) return [meta.pos[0], 0.05, meta.pos[2]];
            return [
                parseFloat(clamp(meta.pos[0] + dx, sc.xr).toFixed(2)),
                0.05,
                parseFloat(clamp(meta.pos[2] + dz, sc.zr).toFixed(2))
            ];
        }
        // 3. Konversi proporsional dari koordinat persentase Denah 2D CAD ke ruang 3D gedung
        const beaconLeft = leftPct - 7.5;
        const x = clamp(sc.x0 + (beaconLeft - sc.bl0) * sc.xs, sc.xr);
        const z = clamp(sc.z0 + (topPct - sc.t0) * sc.zs, sc.zr);
        return [parseFloat(x.toFixed(2)), 0.05, parseFloat(z.toFixed(2))];
    }

    // Kebalikan konversi: koordinat lokal 3D (x,z) -> persentase denah 2D (left, top)
    function convert3DCoordTo2DPin(sKey, x, z) {
        const sc = FP3D_SCALE[sKey] || FP3D_SCALE.ho;
        const left = sc.bl0 + (x - sc.x0) / sc.xs + 7.5;
        const top = sc.t0 + (z - sc.z0) / sc.zs;
        const cl = v => Math.max(1, Math.min(99, parseFloat(v.toFixed(1))));
        return { left: cl(left), top: cl(top) };
    }

    function getDeviceLiveStatus(dev) {
        if (typeof window !== 'undefined' && window.APP_STATE && Array.isArray(window.APP_STATE.devices) && window.APP_STATE.devices.length > 0) {
            const realDev = window.APP_STATE.devices.find(d => (d.code === dev.code || d.asset_code === dev.code));
            if (realDev) return (realDev.status === 'online');
        }
        if (typeof document !== 'undefined') {
            const pin2d = document.getElementById(`bp-pin-${dev.code}`);
            if (pin2d) {
                const badge2d = pin2d.querySelector('.pin-badge');
                if (badge2d) return badge2d.classList.contains('online');
            }
        }
        return dev.status === 'online';
    }

    // =========================================================================
    // 7A. PENYIMPANAN TITIK 3D INDEPENDEN & TERISOLASI DARI 2D CAD
    // (Permintaan Pengguna: Denah 2D dan Model 3D memiliki proporsi fisik berbeda,
    //  koordinat 3D dikelola mandiri dan tidak dioverwrite oleh 2D)
    // =========================================================================
    const STORAGE_KEY_3D_PINS = 'taims_3d_custom_pins';

    function get3DPinsMap() {
        let pins = null;
        try {
            const raw = localStorage.getItem(STORAGE_KEY_3D_PINS);
            if (raw) {
                pins = JSON.parse(raw);
            }
        } catch (e) {
            console.warn('Gagal membaca 3D custom pins:', e);
        }
        if (!pins || typeof pins !== 'object' || Object.keys(pins).length === 0) {
            pins = JSON.parse(JSON.stringify(DEFAULT_3D_DEVICE_META));
            try {
                localStorage.setItem(STORAGE_KEY_3D_PINS, JSON.stringify(pins));
            } catch (e) {}
        }
        return pins;
    }

    function save3DPinsMap(pins) {
        try {
            localStorage.setItem(STORAGE_KEY_3D_PINS, JSON.stringify(pins));
        } catch (e) {
            console.error('Gagal menyimpan 3D custom pins:', e);
        }
    }

    function refresh3DPins(forceRebuild = false) {
        const pinsMap = get3DPinsMap();
        const grouped = { ho: [], mo: [], hs: [], all: [] };

        Object.keys(pinsMap).forEach(code => {
            const pin = pinsMap[code];
            const sKey = (pin.site === 'mentor' || pin.site === 'server' || pin.site === 'hs') ? 'hs' : (pin.site === 'mo' ? 'mo' : 'ho');
            let realName = pin.name || code;
            let realIp = pin.ip || '-';
            let realStatus = pin.status || 'offline';

            if (window.APP_STATE && Array.isArray(window.APP_STATE.devices)) {
                const found = window.APP_STATE.devices.find(d => (d.code === code || d.asset_code === code));
                if (found) {
                    if (found.name) realName = found.name;
                    if (found.ip && found.ip !== '-') realIp = found.ip;
                    realStatus = found.status || 'offline';
                }
            }

            const localPos = Array.isArray(pin.pos) ? [parseFloat(pin.pos[0]), 0.05, parseFloat(pin.pos[2])] : [0, 0.05, 0];
            const devObj = {
                code: code,
                badge: pin.badge || code,
                name: realName,
                room: pin.room || (sKey === 'ho' ? 'Head Office' : (sKey === 'mo' ? 'Marketing Office' : 'House of Server')),
                ip: realIp,
                status: realStatus,
                pos: localPos,
                icon: pin.icon || 'fa-microchip',
                building: sKey,
                site: sKey,
                site2d: sKey === 'hs' ? 'mentor' : sKey
            };
            grouped[sKey].push(devObj);

            const worldPos = [...localPos];
            if (sKey === 'mo') worldPos[0] -= 26;
            if (sKey === 'hs') { worldPos[0] += 26; worldPos[2] -= 2; }
            grouped.all.push(Object.assign({}, devObj, { pos: worldPos }));
        });

        FP3D.siteData.ho.devices = grouped.ho;
        FP3D.siteData.mo.devices = grouped.mo;
        FP3D.siteData.hs.devices = grouped.hs;
        FP3D.siteData.all.devices = grouped.all;

        if (FP3D.campusRoot) {
            FP3D.pulsingPins = [];
            ['ho', 'mo', 'hs'].forEach(sk => {
                const sg = FP3D.siteGroups[sk];
                if (!sg) return;
                const pg = sg.getObjectByName(sk + 'Pins');
                if (!pg) return;
                while (pg.children.length > 0) {
                    pg.remove(pg.children[0]);
                }
                FP3D.sitePinMeshes[sk] = [];
                FP3D.siteData[sk].devices.forEach(dev => {
                    pg.add(createDevicePinMesh(dev, sk));
                });
            });
            FP3D.sitePinMeshes.all = [
                ...(FP3D.sitePinMeshes.ho || []),
                ...(FP3D.sitePinMeshes.mo || []),
                ...(FP3D.sitePinMeshes.hs || [])
            ];
            FP3D.pinMeshes = (FP3D.currentSite === 'all')
                ? FP3D.sitePinMeshes.all
                : (FP3D.sitePinMeshes[FP3D.currentSite] || FP3D.sitePinMeshes.all);
        }
        renderDeviceGrid();
    }

    function sync3DPinsFrom2D() {
        // PERMINTAAN USER: JANGAN SINKRONKAN TITIK 3D DENGAN 2D CAD KARENA UKURAN TEMBOK TIDAK SAMA!
        // Titik 3D dikelola secara independen di taims_3d_custom_pins.
        // Fungsi ini me-refresh status online & telemetri tanpa merusak koordinat 3D.
        refresh3DPins();
    }
    window.sync3DPinsFrom2D = sync3DPinsFrom2D;
    window.refresh3DPins = refresh3DPins;

    // -------------------------------------------------------------------------
    // MODAL & INTERAKSI KELOLA TITIK 3D (TAMBAH / PINDAH / HAPUS)
    // -------------------------------------------------------------------------
    function openAdd3DPinModal(siteKey, initialX = null, initialZ = null) {
        const modal = document.getElementById('modal-3d-pin-editor');
        if (!modal) return;
        const targetSite = siteKey || (FP3D.currentSite !== 'all' ? FP3D.currentSite : 'ho');

        document.getElementById('fp3d-form-mode').value = 'add';
        document.getElementById('fp3d-form-orig-code').value = '';
        document.getElementById('modal-3d-pin-title').innerHTML = '<i class="fa-solid fa-cube text-emerald" style="color:#10B981;"></i> <span>Pasang Titik Perangkat Baru di 3D</span>';
        document.getElementById('fp3d-form-site').value = targetSite;
        document.getElementById('btn-fp3d-delete-pin').style.display = 'none';

        populate3DAssetSelect('');

        document.getElementById('fp3d-form-room').value = '';
        document.getElementById('fp3d-form-icon').value = 'fa-desktop';

        const defCoords = getSiteDefaultCoord(targetSite);
        document.getElementById('fp3d-form-coord-x').value = (initialX !== null) ? Number(initialX).toFixed(1) : defCoords.x;
        document.getElementById('fp3d-form-coord-z').value = (initialZ !== null) ? Number(initialZ).toFixed(1) : defCoords.z;

        update3DCoordRangeHint(targetSite);

        modal.classList.remove('hidden');
        modal.classList.add('show');
    }

    function openEdit3DPinModal(code) {
        const modal = document.getElementById('modal-3d-pin-editor');
        if (!modal) return;
        const pinsMap = get3DPinsMap();
        const pin = pinsMap[code];
        if (!pin) {
            if (typeof window.showToast === 'function') window.showToast('Perangkat Tidak Ditemukan', 'Titik 3D untuk ' + code + ' belum terdaftar.', 'warning');
            return;
        }

        document.getElementById('fp3d-form-mode').value = 'edit';
        document.getElementById('fp3d-form-orig-code').value = code;
        document.getElementById('modal-3d-pin-title').innerHTML = '<i class="fa-solid fa-pen-to-square text-emerald" style="color:#10B981;"></i> <span>Ubah Posisi Titik 3D: ' + code + '</span>';
        
        const sKey = (pin.site === 'mentor' || pin.site === 'server' || pin.site === 'hs') ? 'hs' : (pin.site === 'mo' ? 'mo' : 'ho');
        document.getElementById('fp3d-form-site').value = sKey;
        document.getElementById('btn-fp3d-delete-pin').style.display = 'inline-flex';

        populate3DAssetSelect(code);

        document.getElementById('fp3d-form-room').value = pin.room || '';
        document.getElementById('fp3d-form-icon').value = pin.icon || 'fa-desktop';
        document.getElementById('fp3d-form-coord-x').value = (pin.pos && pin.pos[0] !== undefined) ? pin.pos[0] : 0;
        document.getElementById('fp3d-form-coord-z').value = (pin.pos && pin.pos[2] !== undefined) ? pin.pos[2] : 0;

        update3DCoordRangeHint(sKey);

        modal.classList.remove('hidden');
        modal.classList.add('show');
    }

    function close3DPinModal() {
        const modal = document.getElementById('modal-3d-pin-editor');
        if (modal) {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        }
    }

    function populate3DAssetSelect(selectedCode) {
        const select = document.getElementById('fp3d-form-device-select');
        if (!select) return;
        select.innerHTML = '';

        let devices = [];
        if (window.APP_STATE && Array.isArray(window.APP_STATE.devices)) {
            devices = window.APP_STATE.devices;
        }

        const optDefault = document.createElement('option');
        optDefault.value = '';
        optDefault.textContent = '-- Pilih Aset Terdaftar --';
        select.appendChild(optDefault);

        devices.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.code;
            opt.textContent = d.code + ' - ' + d.name + ' (' + (d.ip || 'No IP') + ')';
            opt.dataset.name = d.name;
            opt.dataset.ip = d.ip || '';
            opt.dataset.type = d.type || '';
            if (d.code === selectedCode) opt.selected = true;
            select.appendChild(opt);
        });

        const optManual = document.createElement('option');
        optManual.value = '__manual__';
        optManual.textContent = '+ Input Aset Baru (Manual / Tidak Ada di List)';
        if (selectedCode && !devices.some(d => d.code === selectedCode)) {
            optManual.selected = true;
            showManualAssetFields(true);
            const manualCode = document.getElementById('fp3d-manual-code');
            if (manualCode) manualCode.value = selectedCode;
        } else {
            showManualAssetFields(false);
        }
        select.appendChild(optManual);
    }

    function showManualAssetFields(show) {
        const fields = document.getElementById('fp3d-manual-asset-fields');
        if (fields) fields.style.display = show ? 'block' : 'none';
    }

    function toggleManual3DAssetInput() {
        const select = document.getElementById('fp3d-form-device-select');
        if (!select) return;
        select.value = '__manual__';
        showManualAssetFields(true);
    }

    function handle3DDeviceSelectChange() {
        const select = document.getElementById('fp3d-form-device-select');
        if (!select) return;
        if (select.value === '__manual__') {
            showManualAssetFields(true);
            return;
        }
        showManualAssetFields(false);
        const selOpt = select.options[select.selectedIndex];
        if (selOpt && selOpt.value) {
            const name = selOpt.dataset.name || '';
            const type = (selOpt.dataset.type || '').toLowerCase();
            const iconSelect = document.getElementById('fp3d-form-icon');
            if (iconSelect) {
                if (type.includes('pc') || type.includes('komputer')) iconSelect.value = 'fa-desktop';
                else if (type.includes('server')) iconSelect.value = 'fa-server';
                else if (type.includes('router') || type.includes('wifi')) iconSelect.value = 'fa-wifi';
                else if (type.includes('cctv') || type.includes('kamera')) iconSelect.value = 'fa-video';
                else if (type.includes('switch')) iconSelect.value = 'fa-bars-progress';
                else if (type.includes('sensor') || type.includes('iot')) iconSelect.value = 'fa-microchip';
            }
        }
    }

    function handle3DSiteChangeInModal() {
        const site = document.getElementById('fp3d-form-site').value;
        update3DCoordRangeHint(site);
        const mode = document.getElementById('fp3d-form-mode').value;
        if (mode === 'add') {
            const defCoords = getSiteDefaultCoord(site);
            document.getElementById('fp3d-form-coord-x').value = defCoords.x;
            document.getElementById('fp3d-form-coord-z').value = defCoords.z;
        }
    }

    function getSiteDefaultCoord(site) {
        if (site === 'ho') return { x: 0.0, z: -2.0 };
        if (site === 'mo') return { x: 0.0, z: -1.0 };
        return { x: 0.0, z: 0.0 };
    }

    function update3DCoordRangeHint(site) {
        const hint = document.getElementById('fp3d-coord-range-hint');
        if (!hint) return;
        const sName = site === 'ho' ? 'Head Office' : (site === 'mo' ? 'Marketing Office' : 'House of Server');
        hint.textContent = 'Bebas: Dalam ruangan maupun luar tembok (halaman/gerbang/carport) di ' + sName;
    }

    function handleSave3DPin() {
        const mode = document.getElementById('fp3d-form-mode').value;
        const origCode = document.getElementById('fp3d-form-orig-code').value;
        const site = document.getElementById('fp3d-form-site').value;
        const select = document.getElementById('fp3d-form-device-select');
        let code = '';
        let name = '';
        let ip = '-';

        if (select.value === '__manual__') {
            code = (document.getElementById('fp3d-manual-code').value || '').trim();
            name = (document.getElementById('fp3d-manual-name').value || '').trim() || code;
            ip = (document.getElementById('fp3d-manual-ip').value || '').trim() || '-';
        } else if (select.value) {
            code = select.value;
            const selOpt = select.options[select.selectedIndex];
            name = selOpt ? selOpt.dataset.name : code;
            ip = selOpt ? (selOpt.dataset.ip || '-') : '-';
        } else if (origCode) {
            code = origCode;
        }

        if (!code) {
            if (typeof window.showToast === 'function') window.showToast('Data Belum Lengkap', 'Pilih perangkat atau masukkan kode aset.', 'warning');
            return;
        }

        const room = (document.getElementById('fp3d-form-room').value || '').trim() || (site === 'ho' ? 'Head Office' : (site === 'mo' ? 'Marketing Office' : 'House of Server'));
        const icon = document.getElementById('fp3d-form-icon').value || 'fa-microchip';
        const x = parseFloat(document.getElementById('fp3d-form-coord-x').value) || 0;
        const z = parseFloat(document.getElementById('fp3d-form-coord-z').value) || 0;

        // Bebaskan batas agar titik dapat ditempatkan di dalam ruangan maupun luar tembok (halaman/gerbang/carport)
        const broadBound = {
            ho: { xr: [-35.0, 35.0], zr: [-35.0, 35.0] },
            mo: { xr: [-25.0, 25.0], zr: [-25.0, 25.0] },
            hs: { xr: [-25.0, 25.0], zr: [-25.0, 25.0] }
        };
        const sc = broadBound[site] || { xr: [-40.0, 40.0], zr: [-40.0, 40.0] };
        const clampedX = Math.max(sc.xr[0], Math.min(sc.xr[1], x));
        const clampedZ = Math.max(sc.zr[0], Math.min(sc.zr[1], z));

        const pinsMap = get3DPinsMap();

        if (mode === 'edit' && origCode && origCode !== code) {
            delete pinsMap[origCode];
        }

        pinsMap[code] = {
            code: code,
            badge: code,
            name: name,
            room: room,
            ip: ip,
            pos: [parseFloat(clampedX.toFixed(2)), 0.05, parseFloat(clampedZ.toFixed(2))],
            icon: icon,
            site: site
        };

        save3DPinsMap(pinsMap);
        refresh3DPins();
        close3DPinModal();

        if (FP3D.currentSite !== site && FP3D.currentSite !== 'all') {
            switchSite(site, true);
        }

        if (typeof window.showToast === 'function') {
            window.showToast('Titik 3D Disimpan', 'Titik ' + code + ' berhasil dipasang di X: ' + clampedX.toFixed(2) + 'm, Z: ' + clampedZ.toFixed(2) + 'm (' + site.toUpperCase() + ').', 'success');
        }

        setTimeout(() => {
            focusDevice(code);
        }, 300);
    }

    function handleDelete3DPin() {
        const origCode = document.getElementById('fp3d-form-orig-code').value;
        if (!origCode) return;
        if (!confirm('Hapus titik perangkat 3D untuk ' + origCode + '? Denah 2D CAD tidak akan terpengaruh.')) return;

        const pinsMap = get3DPinsMap();
        delete pinsMap[origCode];
        save3DPinsMap(pinsMap);
        refresh3DPins();
        close3DPinModal();

        if (typeof window.showToast === 'function') {
            window.showToast('Titik 3D Dihapus', 'Titik 3D untuk ' + origCode + ' berhasil dihapus dari model bangunan.', 'info');
        }
    }

    function startPicking3DPosition() {
        const site = document.getElementById('fp3d-form-site').value;
        const select = document.getElementById('fp3d-form-device-select');
        let code = '';
        let name = '';
        let ip = '-';

        if (select.value === '__manual__') {
            code = (document.getElementById('fp3d-manual-code').value || '').trim();
            name = (document.getElementById('fp3d-manual-name').value || '').trim() || code;
            ip = (document.getElementById('fp3d-manual-ip').value || '').trim() || '-';
        } else if (select.value) {
            code = select.value;
            const selOpt = select.options[select.selectedIndex];
            name = selOpt ? selOpt.dataset.name : code;
            ip = selOpt ? (selOpt.dataset.ip || '-') : '-';
        } else {
            code = document.getElementById('fp3d-form-orig-code').value || 'TITIK-BARU';
            name = code;
        }

        const room = (document.getElementById('fp3d-form-room').value || '').trim();
        const icon = document.getElementById('fp3d-form-icon').value || 'fa-microchip';

        window.__picking3DPin = {
            code: code,
            name: name,
            ip: ip,
            site: site,
            room: room,
            icon: icon,
            origCode: document.getElementById('fp3d-form-orig-code').value
        };

        close3DPinModal();

        if (FP3D.currentSite !== site && FP3D.currentSite !== 'all') {
            switchSite(site, false);
        }

        show3DFloorPickBanner(code, site);
    }

    function show3DFloorPickBanner(code, site) {
        let banner = document.getElementById('fp3d-floor-pick-banner');
        const stage = document.getElementById('fp3d-canvas-stage') || document.getElementById('floorplan-3d-view');
        if (!stage) return;

        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'fp3d-floor-pick-banner';
            banner.style.cssText = 'position: absolute; top: 16px; left: 50%; transform: translateX(-50%); z-index: 1000; background: rgba(15, 23, 42, 0.94); border: 1.5px solid #10B981; box-shadow: 0 6px 24px rgba(0,0,0,0.7), 0 0 20px rgba(16, 185, 129, 0.4); border-radius: 30px; padding: 10px 22px; display: flex; align-items: center; gap: 14px; color: #F8FAFC; font-size: 0.86rem; backdrop-filter: blur(8px); pointer-events: none;';
            stage.appendChild(banner);
        }

        const sName = site === 'ho' ? 'Head Office' : (site === 'mo' ? 'Marketing Office' : 'House of Server');
        banner.innerHTML = '<span style="display:inline-flex; width:10px; height:10px; border-radius:50%; background:#10B981; box-shadow:0 0 10px #10B981;"></span>' +
            '<span><b>Sentuh / Klik di mana saja</b> (dalam ruangan / luar bangunan) untuk menempatkan: <b style="color:#A7F3D0;">' + code + '</b></span>' +
            '<button type="button" onclick="cancelPicking3DPosition()" style="pointer-events: auto; background:rgba(255,23,68,0.25); border:1px solid #FF1744; color:#FFA4B2; border-radius:14px; padding:4px 14px; font-size:0.75rem; font-weight:700; cursor:pointer;">Batal</button>';
        banner.style.display = 'flex';

        if (stage) stage.style.cursor = 'crosshair';
    }

    function updateGhostMarker(wx, wz) {
        if (!FP3D.scene) return;
        let ghost = FP3D.scene.getObjectByName('fp3dGhostMarker');
        if (!ghost) {
            ghost = new THREE.Group();
            ghost.name = 'fp3dGhostMarker';
            const ringGeo = new THREE.RingGeometry(0.35, 0.55, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0x10B981, side: THREE.DoubleSide, transparent: true, opacity: 0.85, depthTest: false });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = 0.04;
            ghost.add(ring);

            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 16, 16),
                new THREE.MeshBasicMaterial({ color: 0x34D399, depthTest: false })
            );
            dot.position.y = 0.22;
            ghost.add(dot);
            FP3D.scene.add(ghost);
        }
        ghost.visible = true;
        ghost.position.set(wx, 0.05, wz);
    }

    function hideGhostMarker() {
        if (!FP3D.scene) return;
        const ghost = FP3D.scene.getObjectByName('fp3dGhostMarker');
        if (ghost) ghost.visible = false;
        const stage = document.getElementById('fp3d-canvas-stage');
        if (stage) stage.style.cursor = '';
    }

    function cancelPicking3DPosition() {
        window.__picking3DPin = null;
        hideGhostMarker();
        const banner = document.getElementById('fp3d-floor-pick-banner');
        if (banner) banner.style.display = 'none';
        if (typeof window.showToast === 'function') {
            window.showToast('Penempatan Dibatalkan', 'Mode penempatan titik 3D ditutup.', 'info');
        }
    }

    function reset3DPinsToDefault() {
        if (!confirm('Kembalikan semua titik 3D ke posisi awal pabrik (default terkalibrasi)? Titik 2D CAD tidak akan berubah.')) return;
        try {
            localStorage.removeItem(STORAGE_KEY_3D_PINS);
        } catch (e) {}
        refresh3DPins();
        if (typeof window.showToast === 'function') {
            window.showToast('Reset Selesai', 'Seluruh titik 3D berhasil dikembalikan ke posisi terkalibrasi awal.', 'success');
        }
    }
    window.reset3DPinsToDefault = reset3DPinsToDefault;

    function createDevicePinMesh(dev, siteKey) {
        const pinHolder = new THREE.Group();
        const isOnline = getDeviceLiveStatus(dev);
        const col = isOnline ? 0x10B981 : 0xFF1744;

        // 1. Batang penanda vertikal mikro terkalibrasi presisi di meja/rak
        const stemHeight = 0.22;
        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.025, 0.025, stemHeight, 16),
            new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.3, metalness: 0.8 })
        );
        stem.position.y = stemHeight / 2;
        pinHolder.add(stem);

        // 2. Bola inti beacon LED berpendar tepat di atas perangkat
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 16, 16),
            new THREE.MeshStandardMaterial({
                color: col,
                emissive: col,
                emissiveIntensity: 0.95,
                roughness: 0.2
            })
        );
        dot.position.y = stemHeight + 0.06;
        dot.userData = { device: dev, site: siteKey };
        pinHolder.add(dot);

        // 2b. Hitbox transparan luas (WAJIB transparent:true, opacity:0 BUKAN visible:false agar Raycaster Three.js mendeteksi klik sentuhan jari)
        const hitBox = new THREE.Mesh(
            new THREE.CylinderGeometry(1.6, 1.6, 2.8, 16),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
        );
        hitBox.position.y = 1.3;
        hitBox.userData = { device: dev, site: siteKey };
        pinHolder.add(hitBox);

        stem.userData = { device: dev, site: siteKey };

        // 3. Cincin radar ganda berdenyut di permukaan meja / lantai
        const ringGeo = new THREE.RingGeometry(0.20, 0.36, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: col,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.78,
            depthTest: false
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.02;
        ring.renderOrder = 998;
        ring.userData = { device: dev, site: siteKey };
        pinHolder.add(ring);

        const outerRingGeo = new THREE.RingGeometry(0.40, 0.58, 32);
        const outerRingMat = new THREE.MeshBasicMaterial({
            color: col,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.38,
            depthTest: false
        });
        const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
        outerRing.rotation.x = Math.PI / 2;
        outerRing.position.y = 0.02;
        outerRing.renderOrder = 997;
        outerRing.userData = { device: dev, site: siteKey };
        pinHolder.add(outerRing);

        FP3D.pulsingPins.push({ ring: ring, outerRing: outerRing, baseY: 0.05 });

        // 4. Sprite Badge Kode & Nama Titik Perangkat (Sama persis dengan badge Denah 2D CAD di sebelah kanan titik)
        const labelText = dev.badge || dev.code;
        const sprite = createPinBadgeSprite(labelText, isOnline);
        sprite.position.set(1.92, stemHeight + 0.38, 0);
        sprite.renderOrder = 999;
        sprite.userData = { device: dev, site: siteKey };
        pinHolder.add(sprite);

        pinHolder.position.set(dev.pos[0], 0.05, dev.pos[2]);
        pinHolder.userData = { device: dev, site: siteKey, isPinsGroup: true };

        // Daftarkan seluruh komponen interaktif ke target raycaster
        if (siteKey && FP3D.sitePinMeshes && FP3D.sitePinMeshes[siteKey]) {
            FP3D.sitePinMeshes[siteKey].push(dot, hitBox, sprite, stem, ring);
        }
        if (FP3D.pinMeshes) {
            FP3D.pinMeshes.push(dot, hitBox, sprite, stem, ring);
        }

        return pinHolder;
    }

    function createPinBadgeSprite(text, isOnline) {
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 88;
        const ctx = canvas.getContext('2d');

        const strokeCol = isOnline ? '#10B981' : '#FF1744';
        const bgGrad = ctx.createLinearGradient(0, 0, 360, 0);
        if (isOnline) {
            bgGrad.addColorStop(0, 'rgba(6, 46, 34, 0.96)');
            bgGrad.addColorStop(1, 'rgba(10, 28, 24, 0.96)');
        } else {
            bgGrad.addColorStop(0, 'rgba(56, 10, 22, 0.96)');
            bgGrad.addColorStop(1, 'rgba(32, 8, 16, 0.96)');
        }

        const x = 4, y = 4, w = 352, h = 80, r = 14;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fillStyle = bgGrad;
        ctx.fill();
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Status Indicator Dot with glow
        ctx.beginPath();
        ctx.arc(34, 44, 9, 0, Math.PI * 2);
        ctx.fillStyle = strokeCol;
        ctx.shadowColor = strokeCol;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Text Badge (persis label 2D CAD, tajam & kontras tinggi)
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '800 33px "JetBrains Mono", "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 56, 45);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(3.15, 0.77, 1);
        sprite.renderOrder = 999;
        return sprite;
    }

    function createTextSprite(text, colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 68;
        const ctx = canvas.getContext('2d');

        let strokeCol = '#38BDF8';
        if (typeof colorHex === 'number') {
            strokeCol = '#' + colorHex.toString(16).padStart(6, '0');
        } else if (typeof colorHex === 'string') {
            strokeCol = colorHex;
        }

        const bgGrad = ctx.createLinearGradient(0, 0, 360, 0);
        bgGrad.addColorStop(0, 'rgba(10, 15, 29, 0.94)');
        bgGrad.addColorStop(1, 'rgba(15, 23, 42, 0.94)');

        const x = 3, y = 3, w = 354, h = 62, r = 12;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fillStyle = bgGrad;
        ctx.fill();
        ctx.strokeStyle = strokeCol;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Status Indicator Dot with glow
        ctx.beginPath();
        ctx.arc(28, 34, 7, 0, Math.PI * 2);
        ctx.fillStyle = strokeCol;
        ctx.shadowColor = strokeCol;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Text Badge
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 21px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 46, 35, 296);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(1.85, 0.35, 1);
        sprite.renderOrder = 999;
        return sprite;
    }

    // -------------------------------------------------------------------------
    // 8. KONTROL SITUS GEDUNG (HO / MO / HS)
    // -------------------------------------------------------------------------
    function switchSite(siteKey, instant) {
        const k = (siteKey || 'all').toLowerCase();
        let targetKey = 'all';
        if (k.includes('mo') || k === 'marketing') {
            targetKey = 'mo';
        } else if (k.includes('hs') || k.includes('server') || k.includes('mentor') || k.includes('hos')) {
            targetKey = 'hs';
        } else if (k.includes('ho') || k.includes('head') || k.includes('pusat')) {
            targetKey = 'ho';
        } else {
            targetKey = 'all';
        }

        FP3D.currentSite = targetKey;
        if (!FP3D.scene) return;

        // Pastikan seluruh kampus terpadu sudah dibangun dan terpasang di scene
        if (!FP3D.campusRoot) {
            buildUnifiedCampus();
        }

        // Pastikan model kampus aktif dan terlihat
        if (FP3D.campusRoot) {
            FP3D.campusRoot.visible = true;
        }

        // Tentukan grup dan pin aktif untuk interaksi hover & klik raycast
        if (targetKey === 'all') {
            FP3D.activeBuildingGroup = FP3D.campusRoot;
            FP3D.activeRoofGroup = null; // Menandakan mode kontrol atap seluruh kawasan
            FP3D.pinMeshes = FP3D.sitePinMeshes.all || [];
        } else {
            FP3D.activeBuildingGroup = FP3D.siteGroups[targetKey];
            FP3D.activeRoofGroup = FP3D.roofGroups[targetKey];
            FP3D.pinMeshes = FP3D.sitePinMeshes[targetKey] || FP3D.sitePinMeshes.all || [];
        }

        // Terapkan status X-Ray pada atap gedung
        const allRoofs = [FP3D.roofGroups.ho, FP3D.roofGroups.mo, FP3D.roofGroups.hs].filter(Boolean);
        if (targetKey === 'all') {
            allRoofs.forEach(rg => {
                rg.visible = !FP3D.isRoofRemoved;
                rg.position.y = FP3D.isRoofRemoved ? 8.0 : 0;
            });
        } else if (FP3D.activeRoofGroup) {
            FP3D.activeRoofGroup.visible = !FP3D.isRoofRemoved;
            FP3D.activeRoofGroup.position.y = FP3D.isRoofRemoved ? 8.0 : 0;
        }

        // Kamera smooth fly-to ke zona target kawasan
        const sData = FP3D.siteData[targetKey] || FP3D.siteData.ho;
        const targetView = FP3D.currentView || 'front';
        const camSetting = (targetView === 'top') ? sData.camTop : (targetView === 'street' ? sData.camStreet : sData.camFront);

        if (sData && FP3D.camera && FP3D.controls) {
            if (instant) {
                FP3D.camera.position.set(...camSetting.pos);
                FP3D.controls.target.set(...camSetting.target);
                FP3D.controls.update();
            } else {
                smoothCameraMove(camSetting.pos, camSetting.target, 850);
            }
        }

        // Terapkan view & sembunyikan atap jika top view agar denah interior tampak
        FP3D.currentView = targetView;
        if (targetView === 'top') {
            allRoofs.forEach(rg => { rg.visible = false; });
        }
        document.querySelectorAll('.btn-fp3d-view').forEach(b => b.classList.remove('active'));
        const activeViewBtn = document.getElementById(`btn-view-${targetView}`);
        if (activeViewBtn) activeViewBtn.classList.add('active');

        // Tutup CCTV HUD jika sebelumnya aktif
        const hud = document.getElementById('fp3d-cctv-hud');
        if (hud) hud.classList.remove('show');

        // Update CCTV HUD Title
        const camNameEl = document.getElementById('cctv-hud-cam-name');
        if (camNameEl) {
            if (targetKey === 'mo') camNameEl.innerHTML = 'CAM-02 &bull; DEPAN STOREFRONT MO';
            else if (targetKey === 'hs') camNameEl.innerHTML = 'CAM-03 &bull; SERVER VAULT BIOMETRIC HOS';
            else if (targetKey === 'all') camNameEl.innerHTML = 'CAM-ALL &bull; MASTER PANORAMA KAWASAN TERPADU';
            else camNameEl.innerHTML = 'CAM-01 &bull; GERBANG &amp; DROP-OFF HO';
        }

        // Update Tombol Site di Floating Toolbar 3D
        document.querySelectorAll('.btn-fp3d-site').forEach(b => b.classList.remove('active'));
        const activeBtn3D = document.getElementById(`btn-fp3d-site-${targetKey}`);
        if (activeBtn3D) activeBtn3D.classList.add('active');

        // Update Tombol Site di Blueprint 2D Selector Bar
        document.querySelectorAll('.site-blueprint-selector .btn-bp-choice:not(#btn-bp-edit-pins)').forEach(b => b.classList.remove('active'));
        const bpKey = targetKey === 'hs' ? 'mentor' : (targetKey === 'all' ? 'ho' : targetKey);
        const activeBpBtn = document.getElementById(`btn-bp-${bpKey}`);
        if (activeBpBtn) activeBpBtn.classList.add('active');

        // Update Box Denah CAD 2D jika user berpindah kembali ke 2D
        ['ho', 'mo', 'mentor'].forEach(kbox => {
            const box = document.getElementById(`bp-box-${kbox}`);
            if (box) {
                if (kbox === bpKey) box.classList.remove('hidden');
                else box.classList.add('hidden');
            }
        });

        // Update Tombol Quick Nav GIS di Header Lokasi
        document.querySelectorAll('.btn-site-quick').forEach(b => b.classList.remove('active'));
        const qKey = targetKey === 'hs' ? 'server' : (targetKey === 'all' ? 'ho' : targetKey);
        const activeQBtn = document.getElementById(`btn-zoom-${qKey}`);
        if (activeQBtn) activeQBtn.classList.add('active');

        // Render Ulang Accordion Daftar Perangkat (menampilkan 13 aset jika 'all')
        renderDeviceGrid();

        // Update Tag Meta di Bar Judul 3D
        const tagEl = document.getElementById('fp3d-site-badge');
        if (tagEl && sData) tagEl.textContent = sData.badge;

        // Update Badge Test Viewer jika elemen tersedia
        const titleEl = document.getElementById('site-title');
        const descEl = document.getElementById('site-desc');
        if (titleEl && descEl && sData) {
            titleEl.textContent = sData.name.toUpperCase();
            descEl.textContent = `${sData.location} • ${sData.dims}`;
        }

        if (typeof window.showToast === 'function') {
            window.showToast('Kawasan Terpadu 3D', `Fokus kamera: ${sData.name}`, 'info');
        }
    }

    // -------------------------------------------------------------------------
    // 9. ANIMASI X-RAY ATAP (BONGKAR / PASANG ATAP)
    // -------------------------------------------------------------------------

    function toggleRoofXRay() {
        FP3D.isRoofRemoved = !FP3D.isRoofRemoved;
        const btn = document.getElementById('btn-fp3d-xray');
        const allRoofs = [FP3D.roofGroups.ho, FP3D.roofGroups.mo, FP3D.roofGroups.hs].filter(Boolean);
        const targetRoofs = (FP3D.currentSite === 'all' || !FP3D.activeRoofGroup)
            ? allRoofs
            : [FP3D.activeRoofGroup].filter(Boolean);

        if (FP3D.isRoofRemoved) {
            // Animasi atap terangkat naik ke atas (Mode X-Ray)
            targetRoofs.forEach(rg => {
                animateRoofY(rg, 8.0, 450, () => {
                    rg.visible = false;
                });
            });

            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-house"></i> <span class="text-desktop">Pasang Atap Normal</span><span class="text-mobile">Pasang Atap</span>';
                btn.classList.add('active-xray');
            }
            if (typeof window.showToast === 'function') {
                window.showToast('Mode X-Ray Aktif', 'Atap gedung diangkat. Tata letak ruangan interior terlihat jelas.', 'info');
            }
        } else {
            // Pasang Atap Normal
            targetRoofs.forEach(rg => {
                rg.visible = true;
                rg.position.y = 8.0;
                animateRoofY(rg, 0, 450);
            });

            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-layer-group"></i> <span class="text-desktop">Lepas Atap</span><span class="text-mobile">Lepas Atap</span>';
                btn.classList.remove('active-xray');
            }
            if (typeof window.showToast === 'function') {
                window.showToast('Mode Atap Normal', 'Atap terpasang kembali.', 'success');
            }
        }
    }

    function animateRoofY(group, targetY, duration, callback) {
        if (!group) return;
        const startY = group.position.y;
        const startT = performance.now();

        function step(now) {
            const elapsed = now - startT;
            const p = Math.min(elapsed / duration, 1.0);
            const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
            group.position.y = startY + (targetY - startY) * ease;

            if (p < 1.0) {
                requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }
        requestAnimationFrame(step);
    }

    // -------------------------------------------------------------------------
    // 10. PRESET SUDUT PANDANG KAMERA (DEPAN, JALANAN, ATAS, CCTV POV)
    // -------------------------------------------------------------------------
    function setCameraView(viewKey, instant) {
        const sData = FP3D.siteData[FP3D.currentSite] || FP3D.siteData.ho;
        let camTarget = sData.camFront;
        if (viewKey === 'street') camTarget = sData.camStreet;
        else if (viewKey === 'top') camTarget = sData.camTop;
        else if (viewKey === 'cctv') camTarget = sData.camCctv;

        FP3D.currentView = viewKey;

        document.querySelectorAll('.btn-fp3d-view').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`btn-view-${viewKey}`);
        if (activeBtn) activeBtn.classList.add('active');

        // Tampilkan HUD CCTV jika kamera CCTV aktif
        const hud = document.getElementById('fp3d-cctv-hud');
        if (hud) {
            if (viewKey === 'cctv') hud.classList.add('show');
            else hud.classList.remove('show');
        }

        // Jika sudut pandang Atas (Denah 2D/3D), sembunyikan semua atap agar denah interior 3 gedung terlihat jelas
        const allRoofs = [FP3D.roofGroups.ho, FP3D.roofGroups.mo, FP3D.roofGroups.hs].filter(Boolean);
        if (viewKey === 'top') {
            allRoofs.forEach(rg => { rg.visible = false; });
        } else {
            if (!FP3D.isRoofRemoved) {
                allRoofs.forEach(rg => { rg.visible = true; });
            }
        }

        if (instant) {
            if (FP3D.camAnimId) {
                cancelAnimationFrame(FP3D.camAnimId);
                FP3D.camAnimId = null;
            }
            if (FP3D.camera && FP3D.controls) {
                FP3D.camera.position.set(...camTarget.pos);
                FP3D.controls.target.set(...camTarget.target);
                FP3D.controls.update();
                if (FP3D.renderer && FP3D.scene) FP3D.renderer.render(FP3D.scene, FP3D.camera);
            }
        } else {
            smoothCameraMove(camTarget.pos, camTarget.target, 750);
        }
    }

    function smoothCameraMove(targetPos, targetLookAt, duration, callback) {
        if (!FP3D.camera || !FP3D.controls) return;
        if (FP3D.camAnimId) {
            cancelAnimationFrame(FP3D.camAnimId);
            FP3D.camAnimId = null;
        }
        const sPos = { x: FP3D.camera.position.x, y: FP3D.camera.position.y, z: FP3D.camera.position.z };
        const sTar = { x: FP3D.controls.target.x, y: FP3D.controls.target.y, z: FP3D.controls.target.z };
        const startT = performance.now();

        function step(now) {
            const elapsed = now - startT;
            const p = Math.min(elapsed / duration, 1.0);
            const ease = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

            FP3D.camera.position.x = sPos.x + (targetPos[0] - sPos.x) * ease;
            FP3D.camera.position.y = sPos.y + (targetPos[1] - sPos.y) * ease;
            FP3D.camera.position.z = sPos.z + (targetPos[2] - sPos.z) * ease;

            FP3D.controls.target.x = sTar.x + (targetLookAt[0] - sTar.x) * ease;
            FP3D.controls.target.y = sTar.y + (targetLookAt[1] - sTar.y) * ease;
            FP3D.controls.target.z = sTar.z + (targetLookAt[2] - sTar.z) * ease;
            FP3D.controls.update();

            if (p < 1.0) {
                FP3D.camAnimId = requestAnimationFrame(step);
            } else {
                FP3D.camAnimId = null;
                if (callback) callback();
            }
        }
        FP3D.camAnimId = requestAnimationFrame(step);
    }

    function focusDevice(devCode) {
        let dev = null;
        let site = FP3D.currentSite;

        // Cari perangkat di site saat ini atau di daftar seluruh kawasan
        if (FP3D.siteData[FP3D.currentSite]) {
            dev = FP3D.siteData[FP3D.currentSite].devices.find(d => d.code === devCode);
        }
        if (!dev && FP3D.siteData.all) {
            dev = FP3D.siteData.all.devices.find(d => d.code === devCode);
            if (dev) site = dev.building || 'ho';
        }

        if (!dev) return;

        // Otomatis buka atap jika tertutup
        if (!FP3D.isRoofRemoved) {
            toggleRoofXRay();
        }

        // Tentukan koordinat dunia 3D perangkat
        let wx = dev.pos[0];
        let wy = dev.pos[1];
        let wz = dev.pos[2];

        // Jika dev.pos masih dalam koordinat lokal gedung MO atau HOS
        if (site === 'mo' && wx > -15) wx -= 26;
        if (site === 'hs' && wx < 15) { wx += 26; wz -= 2; }

        const tLook = [wx, wy, wz];
        const tCam = [wx + 3.0, wy + 4.5, wz + 5.5];
        smoothCameraMove(tCam, tLook, 650);

        if (typeof window.showToast === 'function') {
            window.showToast('Fokus Titik', `Mengarahkan kamera ke ${dev.code} - ${dev.name}`, 'info');
        }
    }

    // -------------------------------------------------------------------------
    // 11. MODE MALAM, AUTO-ROTATE, DAN TOGGLE PIN
    // -------------------------------------------------------------------------
    function toggleNightMode() {
        FP3D.isNightMode = !FP3D.isNightMode;
        const btn = document.getElementById('btn-fp3d-night');

        if (FP3D.isNightMode) {
            FP3D.scene.background.setHex(0x020617);
            FP3D.scene.fog.color.setHex(0x020617);
            FP3D.ambientLight.intensity = 0.2;
            FP3D.dirLight.intensity = 0.2;
            FP3D.dirLight.color.setHex(0x38BDF8);
            if (FP3D.streetLight) FP3D.streetLight.intensity = 3.0;
            if (FP3D.porchLight) FP3D.porchLight.intensity = 2.2;

            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-sun"></i> Mode Siang';
                btn.classList.add('night-on');
            }
        } else {
            FP3D.scene.background.setHex(0x070B14);
            FP3D.scene.fog.color.setHex(0x070B14);
            FP3D.ambientLight.intensity = 0.8;
            FP3D.dirLight.intensity = 1.25;
            FP3D.dirLight.color.setHex(0xFFFFFF);
            if (FP3D.streetLight) FP3D.streetLight.intensity = 0.4;
            if (FP3D.porchLight) FP3D.porchLight.intensity = 0.8;

            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-moon"></i> Mode Malam';
                btn.classList.remove('night-on');
            }
        }
    }

    function toggleAutoRotate() {
        if (!FP3D.controls) return;
        FP3D.isAutoRotate = !FP3D.isAutoRotate;
        FP3D.controls.autoRotate = FP3D.isAutoRotate;
        FP3D.controls.autoRotateSpeed = 1.5;

        const btn = document.getElementById('btn-fp3d-rotate');
        if (btn) {
            if (FP3D.isAutoRotate) btn.classList.add('rotate-on');
            else btn.classList.remove('rotate-on');
        }
    }

    function toggleIoTPins() {
        FP3D.showPins = !FP3D.showPins;
        ['ho', 'mo', 'hs'].forEach(sk => {
            const sg = FP3D.siteGroups[sk];
            if (sg) {
                sg.traverse(c => {
                    if (c.userData && c.userData.isPinsGroup) c.visible = FP3D.showPins;
                });
            }
        });

        const btn = document.getElementById('btn-fp3d-pins');
        if (btn) {
            if (FP3D.showPins) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    }

    // -------------------------------------------------------------------------
    // 12. TABEL ACCORDION DAFTAR PERANGKAT DI BAWAH KANVAS 3D
    // -------------------------------------------------------------------------
    function renderDeviceGrid() {
        const grid = document.getElementById('fp3d-device-grid');
        if (!grid) return;

        const sData = FP3D.siteData[FP3D.currentSite] || FP3D.siteData.ho;
        grid.innerHTML = sData.devices.map(dev => {
            const isOnline = Boolean(getDeviceLiveStatus(dev));
            let devIp = dev.ip;
            let devName = dev.name;
            if (typeof window !== 'undefined' && window.APP_STATE && Array.isArray(window.APP_STATE.devices)) {
                const realDev = window.APP_STATE.devices.find(d => (d.code === dev.code || d.asset_code === dev.code));
                if (realDev) {
                    if (realDev.ip && realDev.ip !== '-') devIp = realDev.ip;
                    if (realDev.name) devName = realDev.name;
                }
            }
            const badgeLabel = dev.badge || dev.code;
            const badgeClass = isOnline ? 'badge-green' : 'badge-red';
            const statusText = isOnline ? 'ONLINE' : 'OFFLINE';

            return `
                <div class="fp3d-device-card">
                    <div class="fp3d-dev-header">
                        <div class="fp3d-dev-info">
                            <div class="fp3d-dev-icon"><i class="fa-solid ${dev.icon}"></i></div>
                            <div>
                                <div class="fp3d-dev-name">${badgeLabel} &bull; ${devName}</div>
                                <div class="fp3d-dev-loc"><i class="fa-solid fa-location-dot"></i> ${dev.room}</div>
                            </div>
                        </div>
                        <span class="badge ${badgeClass}" style="font-size:0.65rem; padding:2px 6px;">${statusText}</span>
                    </div>
                    <div class="fp3d-dev-meta">
                        <span class="fp3d-dev-ip"><i class="fa-solid fa-network-wired"></i> ${devIp}</span>
                        <div class="d-flex gap-1">
                            <button type="button" class="btn-fp3d-focus" onclick="openEdit3DPinModal('${dev.code}')" style="background:rgba(225,29,72,0.15); border:1px solid #E11D48; color:#FDA4AF; padding:3px 8px; border-radius:4px; font-size:0.70rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" title="Ubah Posisi Titik di 3D">
                                <i class="fa-solid fa-pen-to-square"></i> Ubah Titik 3D
                            </button>
                            <button type="button" class="btn-fp3d-focus" onclick="if(window.openDeviceDetailModal) window.openDeviceDetailModal('${dev.code}')" title="Buka Detail Aset">
                                <i class="fa-solid fa-eye"></i> Detail
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function toggleDeviceAccordion() {
        const grid = document.getElementById('fp3d-device-grid');
        const icon = document.getElementById('fp3d-acc-chevron');
        if (!grid) return;

        if (grid.style.display === 'none') {
            grid.style.display = 'grid';
            if (icon) icon.className = 'fa-solid fa-chevron-up';
        } else {
            grid.style.display = 'none';
            if (icon) icon.className = 'fa-solid fa-chevron-down';
        }
    }

    function openCompareModal() {
        const modal = document.getElementById('fp3d-compare-modal');
        if (modal) modal.classList.add('show');
    }

    function closeCompareModal() {
        const modal = document.getElementById('fp3d-compare-modal');
        if (modal) modal.classList.remove('show');
    }

    // -------------------------------------------------------------------------
    // 13. INISIALISASI SCENE THREE.JS WEBGL
    // -------------------------------------------------------------------------
    function init3D() {
        if (FP3D.initialized) return;
        injectStyles();

        FP3D.stage = document.getElementById('fp3d-canvas-stage') || document.getElementById('floorplan-3d-view');
        if (!FP3D.stage || typeof THREE === 'undefined') return;

        const width = FP3D.stage.clientWidth || 940;
        const height = FP3D.stage.clientHeight || 580;

        // Scene
        FP3D.scene = new THREE.Scene();
        FP3D.scene.background = new THREE.Color(0x0A0F1D);
        FP3D.scene.fog = new THREE.FogExp2(0x0A0F1D, 0.007);

        // Kamera
        FP3D.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
        const defCam = FP3D.siteData.ho.camFront;
        FP3D.camera.position.set(...defCam.pos);

        // Renderer Standar Industri BIM & Digital Twin
        FP3D.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        FP3D.renderer.setSize(width, height);
        FP3D.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        FP3D.renderer.shadowMap.enabled = true;
        FP3D.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        if (THREE.ACESFilmicToneMapping) {
            FP3D.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            FP3D.renderer.toneMappingExposure = 1.15;
        }

        const oldCanvas = FP3D.stage.querySelector('canvas');
        if (oldCanvas) oldCanvas.remove();
        FP3D.stage.appendChild(FP3D.renderer.domElement);

        // OrbitControls
        if (typeof THREE.OrbitControls !== 'undefined') {
            FP3D.controls = new THREE.OrbitControls(FP3D.camera, FP3D.renderer.domElement);
            FP3D.controls.enableDamping = true;
            FP3D.controls.dampingFactor = 0.06;
            FP3D.controls.maxPolarAngle = Math.PI / 2 - 0.02;
            FP3D.controls.minDistance = 5;
            FP3D.controls.maxDistance = 120;
            FP3D.controls.target.set(...defCam.target);
            FP3D.controls.update();
        }

        // Pencahayaan Cyberpunk Digital Twin T-AIMS Premium
        FP3D.ambientLight = new THREE.AmbientLight(0x0F172A, 1.4);
        FP3D.scene.add(FP3D.ambientLight);

        FP3D.hemiLight = new THREE.HemisphereLight(0x00F0FF, 0x070B14, 0.85);
        FP3D.scene.add(FP3D.hemiLight);

        FP3D.dirLight = new THREE.DirectionalLight(0xE0F2FE, 1.1);
        FP3D.dirLight.position.set(24, 40, 20);
        FP3D.dirLight.castShadow = true;
        FP3D.dirLight.shadow.mapSize.width = 2048;
        FP3D.dirLight.shadow.mapSize.height = 2048;
        FP3D.dirLight.shadow.camera.near = 0.5;
        FP3D.dirLight.shadow.camera.far = 140;
        FP3D.dirLight.shadow.camera.left = -55;
        FP3D.dirLight.shadow.camera.right = 55;
        FP3D.dirLight.shadow.camera.top = 50;
        FP3D.dirLight.shadow.camera.bottom = -50;
        FP3D.dirLight.shadow.bias = -0.0003;
        FP3D.scene.add(FP3D.dirLight);

        // Cyber Rim Accent Light (Pendaran Neon Cyan dari belakang)
        FP3D.rimLight = new THREE.DirectionalLight(0x00F0FF, 0.65);
        FP3D.rimLight.position.set(-20, 25, -30);
        FP3D.scene.add(FP3D.rimLight);

        // Inisialisasi Digital Twin (Default: Head Office 'ho')
        sync3DPinsFrom2D(false);
        const initParams = (typeof window !== 'undefined' && window.location) ? new URLSearchParams(window.location.search) : null;
        const initialSite = initParams ? (initParams.get('site') || 'ho') : 'ho';
        switchSite(initialSite, true);

        // Event Listeners (Mouse Desktop & Layar Sentuh Mobile / Touchscreen)
        window.addEventListener('resize', onWindowResize);
        FP3D.stage.addEventListener('mousemove', onMouseMove);

        // Dukungan Tap Layar Sentuh & Klik Mouse Cepat Langsung pada Canvas WebGL
        let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
        let _lastInteractionTime = 0;
        const domTarget = FP3D.renderer.domElement;

        function safeHandleCanvasInteraction(cx, cy) {
            const now = performance.now();
            if (now - _lastInteractionTime < 120) return;
            _lastInteractionTime = now;
            handleCanvasInteraction(cx, cy);
        }

        // 1. Sentuhan Mobile / Tablet
        domTarget.addEventListener('touchstart', function (ev) {
            if (ev.touches && ev.touches.length === 1) {
                touchStartX = ev.touches[0].clientX;
                touchStartY = ev.touches[0].clientY;
                touchStartTime = performance.now();
                FP3D._downX = touchStartX;
                FP3D._downY = touchStartY;
            }
        }, { passive: true });

        domTarget.addEventListener('touchend', function (ev) {
            if (ev.changedTouches && ev.changedTouches.length === 1) {
                const t = ev.changedTouches[0];
                const dist = Math.hypot(t.clientX - touchStartX, t.clientY - touchStartY);
                // Toleransi geser jari hingga 35px agar sentuhan di HP selalu terdeteksi
                if (dist < 35) {
                    safeHandleCanvasInteraction(t.clientX, t.clientY);
                }
            }
        }, { passive: true });

        // 2. Mouse Desktop & Touchpad (Track mousedown & mouseup)
        domTarget.addEventListener('mousedown', function (ev) {
            FP3D._downX = ev.clientX;
            FP3D._downY = ev.clientY;
        });

        domTarget.addEventListener('mouseup', function (ev) {
            const dist = (typeof FP3D._downX === 'number') ? Math.hypot(ev.clientX - FP3D._downX, ev.clientY - FP3D._downY) : 0;
            // Jika dalam mode penempatan titik (picking), toleransi hingga 45px agar klik selalu berhasil!
            const maxAllowedDist = window.__picking3DPin ? 45 : 25;
            if (dist < maxAllowedDist) {
                safeHandleCanvasInteraction(ev.clientX, ev.clientY);
            }
        });

        FP3D.stage.addEventListener('click', function (ev) {
            const dist = (typeof FP3D._downX === 'number') ? Math.hypot(ev.clientX - FP3D._downX, ev.clientY - FP3D._downY) : 0;
            const maxAllowedDist = window.__picking3DPin ? 45 : 25;
            if (dist < maxAllowedDist) {
                safeHandleCanvasInteraction(ev.clientX, ev.clientY);
            }
        });

        FP3D.initialized = true;
        animate();
    }

    function onWindowResize() {
        if (!FP3D.stage || !FP3D.camera || !FP3D.renderer) return;
        const w = FP3D.stage.clientWidth;
        const h = FP3D.stage.clientHeight;
        FP3D.camera.aspect = w / h;
        FP3D.camera.updateProjectionMatrix();
        FP3D.renderer.setSize(w, h);
    }

    function onMouseMove(event) {
        // Abaikan hover pada layar sentuh/hp agar tidak memicu tooltip macet
        if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
        if (!FP3D.stage || !FP3D.raycaster || !FP3D.camera) return;
        const rect = FP3D.stage.getBoundingClientRect();
        FP3D.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        FP3D.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        FP3D.raycaster.setFromCamera(FP3D.mouse, FP3D.camera);

        // Jika sedang dalam mode penempatan titik, arahkan ghost marker mengikuti kursor
        if (window.__picking3DPin) {
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const target = new THREE.Vector3();
            if (FP3D.raycaster.ray.intersectPlane(plane, target)) {
                updateGhostMarker(target.x, target.z);
            }
        }

        const targetPins = (FP3D.pinMeshes && FP3D.pinMeshes.length > 0)
            ? FP3D.pinMeshes
            : (FP3D.sitePinMeshes[FP3D.currentSite] || FP3D.sitePinMeshes.all || []);
        const hits = FP3D.raycaster.intersectObjects(targetPins, true);
        const tooltip = document.getElementById('fp3d-tooltip');

        if (hits.length > 0) {
            const dev = hits[0].object.userData?.device;
            if (dev && tooltip) {
                tooltip.style.display = 'block';
                tooltip.style.left = `${event.clientX - rect.left + 14}px`;
                tooltip.style.top = `${event.clientY - rect.top + 14}px`;
                tooltip.innerHTML = `
                    <div class="fp3d-tooltip-title"><i class="fa-solid ${dev.icon}"></i> ${dev.code} Â· ${dev.name}</div>
                    <div class="fp3d-tooltip-sub"><i class="fa-solid fa-location-dot"></i> ${dev.room}</div>
                    <div class="d-flex align-center justify-between mt-1">
                        <span class="fp3d-tooltip-badge ${dev.status}">â— ${dev.status.toUpperCase()}</span>
                        <span style="font-family:'JetBrains Mono',monospace; font-size:0.72rem; color:#38BDF8;">${dev.ip}</span>
                    </div>
                `;
                FP3D.stage.style.cursor = 'pointer';
            }
        } else {
            if (tooltip) tooltip.style.display = 'none';
            FP3D.stage.style.cursor = FP3D.controls?.state === -1 ? 'grab' : 'grabbing';
        }
    }

    // -------------------------------------------------------------------------
    // 13B. STYLESHEET DINAMIS & KOMPONEN TELEMETRY INSPECTOR DIGITAL TWIN
    // -------------------------------------------------------------------------
    function injectStyles() {
        if (document.getElementById('fp3d-dynamic-styles')) return;
        const style = document.createElement('style');
        style.id = 'fp3d-dynamic-styles';
        style.textContent = `
            /* Floating Digital Twin Telemetry Inspector Card */
            #fp3d-canvas-stage {
                position: relative !important;
            }
            .fp3d-inspector-card {
                position: absolute;
                bottom: 24px;
                right: 24px;
                width: 330px;
                background: rgba(10, 15, 29, 0.95);
                border: 1px solid rgba(56, 189, 248, 0.45);
                box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(56, 189, 248, 0.22);
                border-radius: 12px;
                padding: 16px;
                color: #F8FAFC;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                backdrop-filter: blur(16px);
                z-index: 1000;
                transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
                transform: translateY(20px) scale(0.96);
                opacity: 0;
                pointer-events: none;
            }
            .fp3d-inspector-card.active {
                transform: translateY(0) scale(1);
                opacity: 1;
                pointer-events: auto;
            }
            .fp3d-card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }
            .fp3d-card-title-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .fp3d-card-icon {
                width: 36px;
                height: 36px;
                border-radius: 8px;
                background: rgba(56, 189, 248, 0.15);
                border: 1px solid rgba(56, 189, 248, 0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #38BDF8;
                font-size: 1rem;
            }
            .fp3d-card-badge {
                font-size: 0.7rem;
                font-weight: 700;
                letter-spacing: 0.5px;
                color: #38BDF8;
                text-transform: uppercase;
            }
            .fp3d-card-title {
                margin: 2px 0 0 0;
                font-size: 0.95rem;
                font-weight: 700;
                color: #FFFFFF;
            }
            .fp3d-card-close {
                background: transparent;
                border: none;
                color: #94A3B8;
                font-size: 1.4rem;
                line-height: 1;
                cursor: pointer;
                padding: 0 4px;
                transition: color 0.15s;
            }
            .fp3d-card-close:hover { color: #FFFFFF; }
            .fp3d-card-location {
                font-size: 0.78rem;
                color: #94A3B8;
                margin-bottom: 10px;
            }
            .fp3d-card-divider {
                height: 1px;
                background: linear-gradient(90deg, rgba(56, 189, 248, 0.4), rgba(56, 189, 248, 0.05));
                margin: 10px 0;
            }
            .fp3d-card-metrics {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 14px;
            }
            .fp3d-metric-item {
                background: rgba(15, 23, 42, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.06);
                border-radius: 6px;
                padding: 6px 8px;
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .fp3d-metric-lbl {
                font-size: 0.65rem;
                color: #64748B;
                text-transform: uppercase;
                font-weight: 600;
            }
            .fp3d-metric-val {
                font-size: 0.8rem;
                font-weight: 600;
                color: #E2E8F0;
            }
            .fp3d-metric-val.mono {
                font-family: 'JetBrains Mono', monospace, Consolas, sans-serif;
            }
            .status-pill {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                font-size: 0.7rem;
                font-weight: 700;
                padding: 2px 7px;
                border-radius: 9999px;
            }
            .status-pill.status-online {
                background: rgba(16, 185, 129, 0.15);
                color: #34D399;
                border: 1px solid rgba(16, 185, 129, 0.35);
            }
            .status-pill.status-offline {
                background: rgba(239, 68, 68, 0.15);
                color: #F87171;
                border: 1px solid rgba(239, 68, 68, 0.35);
            }
            .dot-online {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #10B981;
                box-shadow: 0 0 6px #10B981;
            }
            .dot-offline {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #EF4444;
                box-shadow: 0 0 6px #EF4444;
            }
            .fp3d-card-actions {
                display: flex;
                gap: 8px;
            }
            .fp3d-card-btn {
                flex: 1;
                padding: 7px 12px;
                border-radius: 6px;
                font-size: 0.78rem;
                font-weight: 600;
                cursor: pointer;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                transition: all 0.15s ease;
            }
            .fp3d-card-btn-focus {
                background: rgba(56, 189, 248, 0.18);
                color: #38BDF8;
                border: 1px solid rgba(56, 189, 248, 0.4);
            }
            .fp3d-card-btn-focus:hover {
                background: #0284C7;
                color: #FFFFFF;
            }
            .fp3d-card-btn-detail {
                background: #2563EB;
                color: #FFFFFF;
            }
            .fp3d-card-btn-detail:hover {
                background: #1D4ED8;
            }
            .fp3d-card-btn-edit {
                background: linear-gradient(135deg, #F59E0B, #D97706);
                color: #070B19;
                font-weight: 700;
            }
            .fp3d-card-btn-edit:hover {
                background: linear-gradient(135deg, #FBBF24, #F59E0B);
                box-shadow: 0 0 12px rgba(245, 158, 11, 0.5);
                color: #000000;
            }

            /* Cinematic Tour HUD Banner */
            .fp3d-tour-hud {
                position: absolute;
                top: 68px;
                left: 50%;
                transform: translateX(-50%) translateY(-20px);
                background: rgba(10, 15, 29, 0.94);
                border: 1px solid #06B6D4;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(6, 182, 212, 0.3);
                border-radius: 30px;
                padding: 8px 22px;
                color: #FFFFFF;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 10px;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                z-index: 1000;
            }
            .fp3d-tour-hud.show {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
                pointer-events: auto;
            }
            .tour-live-dot {
                width: 9px;
                height: 9px;
                border-radius: 50%;
                background: #EF4444;
                box-shadow: 0 0 8px #EF4444;
                animation: tourPulse 1.2s infinite alternate;
            }
            @keyframes tourPulse {
                0% { transform: scale(0.9); opacity: 0.6; }
                100% { transform: scale(1.3); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    function showDeviceInspectorCard(dev) {
        injectStyles();
        let card = document.getElementById('fp3d-inspector-card');
        const container = document.getElementById('fp3d-canvas-stage') || document.getElementById('floorplan-3d-view') || document.body;
        if (!card) {
            card = document.createElement('div');
            card.id = 'fp3d-inspector-card';
            card.className = 'fp3d-inspector-card';
            container.appendChild(card);
        } else if (card.parentElement !== container) {
            container.appendChild(card);
        }

        let isOnline = dev.status === 'online';
        let devIp = dev.ip;
        let devPing = isOnline ? (1.5 + Math.random() * 2.8).toFixed(1) + ' ms' : 'Timeout';
        let devUptime = isOnline ? '99.8%' : '0.0%';
        let devName = dev.name;
        if (typeof window !== 'undefined' && window.APP_STATE && Array.isArray(window.APP_STATE.devices)) {
            const realDev = window.APP_STATE.devices.find(d => (d.code === dev.code || d.asset_code === dev.code));
            if (realDev) {
                isOnline = (realDev.status === 'online');
                if (realDev.ip && realDev.ip !== '-') devIp = realDev.ip;
                if (realDev.ping && realDev.ping !== '-') devPing = realDev.ping;
                if (realDev.uptime) devUptime = realDev.uptime;
                if (realDev.name) devName = realDev.name;
            }
        }

        const statusBadge = isOnline
            ? '<span class="status-pill status-online"><span class="dot-online"></span> ONLINE</span>'
            : '<span class="status-pill status-offline"><span class="dot-offline"></span> OFFLINE</span>';

        const rx = isOnline ? (120 + Math.random() * 80).toFixed(1) + ' Mbps' : '0.0 Mbps';
        const tx = isOnline ? (35 + Math.random() * 25).toFixed(1) + ' Mbps' : '0.0 Mbps';
        const temp = isOnline ? (39.5 + Math.random() * 4.0).toFixed(1) + ' °C' : 'N/A';

        card.innerHTML = `
            <div class="fp3d-card-header">
                <div class="fp3d-card-title-group">
                    <div class="fp3d-card-icon"><i class="fa-solid ${dev.icon || 'fa-microchip'}"></i></div>
                    <div>
                        <div class="fp3d-card-badge">${dev.badge || dev.code}</div>
                        <h4 class="fp3d-card-title">${devName}</h4>
                    </div>
                </div>
                <button class="fp3d-card-close" onclick="closeDeviceInspectorCard()">&times;</button>
            </div>
            <div class="fp3d-card-location">
                <i class="fa-solid fa-location-dot" style="color:#38BDF8; font-size:0.75rem; margin-right:4px;"></i>
                ${dev.room}
            </div>
            <div class="fp3d-card-divider"></div>
            <div class="fp3d-card-metrics">
                <div class="fp3d-metric-item">
                    <span class="fp3d-metric-lbl">Status Jaringan</span>
                    <span class="fp3d-metric-val">${statusBadge}</span>
                </div>
                <div class="fp3d-metric-item">
                    <span class="fp3d-metric-lbl">IP Address</span>
                    <span class="fp3d-metric-val mono">${devIp}</span>
                </div>
                <div class="fp3d-metric-item">
                    <span class="fp3d-metric-lbl">Latensi (Ping)</span>
                    <span class="fp3d-metric-val mono" style="color:${isOnline ? '#10B981' : '#EF4444'};">${devPing}</span>
                </div>
                <div class="fp3d-metric-item">
                    <span class="fp3d-metric-lbl">Bandwidth RX / TX</span>
                    <span class="fp3d-metric-val mono" style="font-size:0.75rem;">${rx} / ${tx}</span>
                </div>
                <div class="fp3d-metric-item">
                    <span class="fp3d-metric-lbl">Suhu Perangkat</span>
                    <span class="fp3d-metric-val mono" style="color:${isOnline ? '#F59E0B' : '#94A3B8'};">${temp}</span>
                </div>
                <div class="fp3d-metric-item">
                    <span class="fp3d-metric-lbl">Uptime Terverifikasi</span>
                    <span class="fp3d-metric-val mono">${devUptime}</span>
                </div>
            </div>
            <div class="fp3d-card-actions">
                <button class="fp3d-card-btn fp3d-card-btn-focus" onclick="focusDevice3D('${dev.code}')">
                    <i class="fa-solid fa-crosshairs"></i> Fokus Titik
                </button>
                <button class="fp3d-card-btn fp3d-card-btn-edit" onclick="openEdit3DPinModal('${dev.code}'); closeDeviceInspectorCard();" title="Ubah Posisi Titik di 3D">
                    <i class="fa-solid fa-pen-to-square"></i> Ubah Titik 3D
                </button>
                <button class="fp3d-card-btn fp3d-card-btn-detail" onclick="if(typeof openDeviceDetailModal==='function')openDeviceDetailModal('${dev.code}')">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Detail
                </button>
            </div>
        `;

        card.classList.add('active');
    }

    function closeDeviceInspectorCard() {
        const card = document.getElementById('fp3d-inspector-card');
        if (card) card.classList.remove('active');
    }

    function toggleDroneTour() {
        FP3D.isDroneTourActive = !FP3D.isDroneTourActive;
        const btn = document.getElementById('btn-fp3d-tour');
        let hud = document.getElementById('fp3d-tour-hud');

        if (!hud) {
            hud = document.createElement('div');
            hud.id = 'fp3d-tour-hud';
            hud.className = 'fp3d-tour-hud';
            const container = FP3D.stage || document.getElementById('canvas-wrap') || document.body;
            container.appendChild(hud);
        }

        if (FP3D.isDroneTourActive) {
            if (btn) btn.classList.add('active');
            hud.innerHTML = '<span class="tour-live-dot"></span> <strong>TUR SINEMATIK DIGITAL TWIN</strong> &bull; <span id="fp3d-tour-label">Kawasan Terpadu</span> &bull; <span style="opacity:0.75; font-size:0.78rem;">Klik tombol lagi untuk keluar</span>';
            hud.classList.add('show');

            if (FP3D.controls) FP3D.controls.autoRotate = false;

            const tourSteps = [
                {
                    name: '1/6 Overview Kawasan Kampus Terpadu',
                    pos: [0, 38, 44],
                    target: [0, 2, -3],
                    roof: true
                },
                {
                    name: '2/6 Head Office & Koridor Sentral',
                    pos: [0, 16, 20],
                    target: [0, 2, -3],
                    roof: false
                },
                {
                    name: '3/6 Sayap L Ruang 4: Lab IoT & Server',
                    pos: [5.0, 7.5, -4.5],
                    target: [5.0, 1.6, -9.5],
                    roof: false
                },
                {
                    name: '4/6 Marketing Office - Modern Storefront',
                    pos: [-26, 12, 16],
                    target: [-26, 2, 0],
                    roof: false
                },
                {
                    name: '5/6 House of Server - Data Center Sentral',
                    pos: [26, 14, 15],
                    target: [26, 2, -2],
                    roof: false
                },
                {
                    name: '6/6 Cyber Bird\'s Eye View Sinkron Denah',
                    pos: [0, 70, -2],
                    target: [0, 0, -2.1],
                    roof: false
                }
            ];

            let curStep = 0;
            function runStep() {
                if (!FP3D.isDroneTourActive) return;
                const step = tourSteps[curStep];
                const lbl = document.getElementById('fp3d-tour-label');
                if (lbl) lbl.textContent = step.name;

                const allRoofs = [FP3D.roofGroups.ho, FP3D.roofGroups.mo, FP3D.roofGroups.hs].filter(Boolean);
                if (step.roof) {
                    allRoofs.forEach(r => { if (r) r.visible = true; });
                } else {
                    allRoofs.forEach(r => { if (r) r.visible = false; });
                }

                smoothCameraMove(step.pos, step.target, 2200);

                curStep = (curStep + 1) % tourSteps.length;
                FP3D.droneTourTimer = setTimeout(runStep, 6800);
            }

            runStep();
        } else {
            if (btn) btn.classList.remove('active');
            if (hud) hud.classList.remove('show');
            if (FP3D.droneTourTimer) {
                clearTimeout(FP3D.droneTourTimer);
                FP3D.droneTourTimer = null;
            }
            setCameraView('front');
        }
    }

    function handleCanvasInteraction(clientX, clientY) {
        if (!FP3D.raycaster || !FP3D.camera || !FP3D.stage) return;
        const rect = FP3D.stage.getBoundingClientRect();
        FP3D.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        FP3D.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        FP3D.raycaster.setFromCamera(FP3D.mouse, FP3D.camera);

        // 1. PRIORITAS UTAMA: MODE PENEMPATAN / PINDAH TITIK 3D (Klik Langsung di Lantai 3D)
        if (window.__picking3DPin) {
            const pick = window.__picking3DPin;
            const target = new THREE.Vector3();
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            if (FP3D.raycaster.ray.intersectPlane(plane, target)) {
                let bKey = pick.site || FP3D.currentSite;
                if (bKey === 'all') {
                    if (target.x < -13) bKey = 'mo';
                    else if (target.x > 13) bKey = 'hs';
                    else bKey = 'ho';
                }

                // Hitung koordinat lokal gedung dari koordinat dunia Three.js
                let lx = target.x;
                let lz = target.z;
                if (bKey === 'mo') {
                    lx = target.x + 26;
                    lz = target.z;
                } else if (bKey === 'hs') {
                    lx = target.x - 26;
                    lz = target.z + 2;
                }

                // PERMINTAAN USER: BISA DITARUH DI LUAR TEMBOK ATAU BANGUNAN!
                // Bebaskan batas agar titik dapat ditempatkan di halaman, carport, teras, pagar gerbang luar
                const broadBound = {
                    ho: { xr: [-35.0, 35.0], zr: [-35.0, 35.0] },
                    mo: { xr: [-25.0, 25.0], zr: [-25.0, 25.0] },
                    hs: { xr: [-25.0, 25.0], zr: [-25.0, 25.0] }
                };
                const sc = broadBound[bKey] || { xr: [-40.0, 40.0], zr: [-40.0, 40.0] };
                lx = Math.max(sc.xr[0], Math.min(sc.xr[1], lx));
                lz = Math.max(sc.zr[0], Math.min(sc.zr[1], lz));

                const pinsMap = get3DPinsMap();
                if (pick.origCode && pick.origCode !== pick.code) {
                    delete pinsMap[pick.origCode];
                }

                pinsMap[pick.code] = {
                    code: pick.code,
                    badge: pick.code,
                    name: pick.name || pick.code,
                    room: pick.room || (bKey === 'ho' ? 'Head Office' : (bKey === 'mo' ? 'Marketing Office' : 'House of Server')),
                    ip: pick.ip || '-',
                    pos: [parseFloat(lx.toFixed(2)), 0.05, parseFloat(lz.toFixed(2))],
                    icon: pick.icon || 'fa-microchip',
                    site: bKey
                };

                save3DPinsMap(pinsMap);
                window.__picking3DPin = null;
                hideGhostMarker();
                const banner = document.getElementById('fp3d-floor-pick-banner');
                if (banner) banner.style.display = 'none';

                refresh3DPins();

                const sName = bKey === 'ho' ? 'Head Office' : (bKey === 'mo' ? 'Marketing Office' : 'House of Server');
                if (typeof window.showToast === 'function') {
                    window.showToast('Titik 3D Ditempatkan!', 'Titik ' + pick.code + ' berhasil ditempatkan di X: ' + lx.toFixed(2) + 'm, Z: ' + lz.toFixed(2) + 'm (' + sName + ').', 'success');
                }

                setTimeout(() => {
                    focusDevice(pick.code);
                }, 200);
                return;
            }
        }

        const targetPins = (FP3D.pinMeshes && FP3D.pinMeshes.length > 0)
            ? FP3D.pinMeshes
            : (FP3D.sitePinMeshes[FP3D.currentSite] || FP3D.sitePinMeshes.all || []);
        const hits = FP3D.raycaster.intersectObjects(targetPins, true);
        const editMode = !!(window.APP_STATE && window.APP_STATE.isFloorplanEditMode);

        // 2. Helper cari device dari hits pin 3D secara mendalam
        let hitDev = null;
        let hitSite = null;
        if (hits.length > 0) {
            for (let i = 0; i < hits.length; i++) {
                let obj = hits[i].object;
                while (obj && !obj.userData?.device && obj.parent && obj !== FP3D.scene) {
                    obj = obj.parent;
                }
                if (obj && obj.userData?.device) {
                    hitDev = obj.userData.device;
                    hitSite = obj.userData.site || obj.userData.device.site2d;
                    break;
                }
            }
        }

        // 2b. Toleransi Sentuhan Mobile Pintar: Jika jari tidak persis mengenai titik (meleset sedikit di HP), deteksi perangkat terdekat dalam radius 45px
        if (!hitDev && FP3D.camera && FP3D.stage) {
            const activeDevs = (FP3D.siteData[FP3D.currentSite] || FP3D.siteData.ho).devices || [];
            let closestDist = 45; // radius sentuhan 45px di layar
            for (const dev of activeDevs) {
                if (!dev.pos) continue;
                const v = new THREE.Vector3(dev.pos[0], dev.pos[1] || 0.2, dev.pos[2]);
                v.project(FP3D.camera);
                const sx = ((v.x + 1) / 2) * rect.width + rect.left;
                const sy = ((-v.y + 1) / 2) * rect.height + rect.top;
                const d = Math.hypot(clientX - sx, clientY - sy);
                if (d < closestDist) {
                    closestDist = d;
                    hitDev = dev;
                    hitSite = dev.site2d || dev.building || FP3D.currentSite;
                }
            }
        }

        // Tutup tooltip hover saat sentuhan terjadi
        const tooltip = document.getElementById('fp3d-tooltip');
        if (tooltip) tooltip.style.display = 'none';

        // ---- MODE KELOLA TITIK (EDIT) DI 3D ----
        if (editMode) {
            closeDeviceInspectorCard();

            if (hitDev) {
                openEdit3DPinModal(hitDev.code);
                return;
            }

            // Klik / sentuh lantai gedung saat Mode Kelola -> buka modal tambah titik di posisi lantai tersebut
            const target = new THREE.Vector3();
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            if (!FP3D.raycaster.ray.intersectPlane(plane, target)) return;

            let bKey = FP3D.currentSite;
            let lx = target.x;
            let lz = target.z;
            if (bKey === 'all' || !FP3D_SCALE[bKey]) {
                if (target.x < -13) { bKey = 'mo'; lx = target.x + 26; }
                else if (target.x > 13) { bKey = 'hs'; lx = target.x - 26; lz = target.z + 2; }
                else { bKey = 'ho'; }
            }
            const broadBound = {
                ho: { xr: [-35.0, 35.0], zr: [-35.0, 35.0] },
                mo: { xr: [-25.0, 25.0], zr: [-25.0, 25.0] },
                hs: { xr: [-25.0, 25.0], zr: [-25.0, 25.0] }
            };
            const sc = broadBound[bKey] || { xr: [-40.0, 40.0], zr: [-40.0, 40.0] };
            lx = Math.max(sc.xr[0], Math.min(sc.xr[1], lx));
            lz = Math.max(sc.zr[0], Math.min(sc.zr[1], lz));

            openAdd3DPinModal(bKey, lx, lz);
            return;
        }

        // ---- MODE NORMAL: kartu inspektur telemetri ----
        if (hitDev) {
            showDeviceInspectorCard(hitDev);
        } else {
            closeDeviceInspectorCard();
        }
    }

    function onCanvasClick(event) {
        if (!event) return;
        const cx = typeof event.clientX === 'number' ? event.clientX : 0;
        const cy = typeof event.clientY === 'number' ? event.clientY : 0;
        handleCanvasInteraction(cx, cy);
    }

    function animate() {
        FP3D.animId = requestAnimationFrame(animate);

        const time = performance.now() * 0.003;

        // Animasi Cincin Radar Denyut Pin IoT (Pulsing expanding radar waves)
        FP3D.pulsingPins.forEach(item => {
            if (item.ring) {
                const s = 1.0 + Math.sin(time * 3.5 + item.baseY) * 0.35;
                item.ring.scale.set(s, s, 1);
                if (item.ring.material) {
                    item.ring.material.opacity = 0.55 + Math.sin(time * 3.5 + item.baseY) * 0.35;
                }
            }
            if (item.outerRing) {
                const s2 = 1.0 + Math.sin(time * 2.8 + item.baseY + 1.2) * 0.4;
                item.outerRing.scale.set(s2, s2, 1);
                if (item.outerRing.material) {
                    item.outerRing.material.opacity = 0.35 + Math.sin(time * 2.8 + item.baseY + 1.2) * 0.25;
                }
            }
        });

        // Animasi Kristal Holografik Berputar
        FP3D.rotatingCrystals.forEach(c => {
            c.rotation.y += 0.026;
            c.rotation.x += 0.012;
        });

        // Animasi Alur Data Cyber Network Streams (Paket Fiber Optik Bergerak)
        FP3D.dataPackets.forEach(pkt => {
            pkt.progress = (pkt.progress + pkt.speed) % 1.0;
            const pt = pkt.curve.getPointAt(pkt.progress);
            if (pt) pkt.mesh.position.copy(pt);
        });

        // Animasi LED Berkedip (Random network traffic simulation)
        FP3D.blinkingLeds.forEach(item => {
            if (item.mesh) {
                const isLit = Math.sin(time * item.rate) > 0.1;
                item.mesh.visible = isLit;
            }
        });

        // Update Jam CCTV jika HUD aktif
        if (FP3D.currentView === 'cctv') {
            const timeEl = document.getElementById('cctv-hud-timestamp');
            if (timeEl) {
                const now = new Date();
                timeEl.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' WIB';
            }
        }

        if (FP3D.controls) FP3D.controls.update();
        if (FP3D.renderer && FP3D.scene && FP3D.camera) {
            FP3D.renderer.render(FP3D.scene, FP3D.camera);
        }
    }

    // -------------------------------------------------------------------------
    // 14. INTEGRASI DENGAN NAVBAR & SUBTAB LOKASI T-AIMS
    // -------------------------------------------------------------------------
    function switchFloorplanDimension(dim) {
        const btn2d = document.getElementById('btn-dim-2d');
        const btn3d = document.getElementById('btn-dim-3d');
        const view2d = document.getElementById('floorplan-2d-view');
        const view3d = document.getElementById('floorplan-3d-view');
        const btnEditPins = document.getElementById('btn-bp-edit-pins');
        const editBanner = document.getElementById('floorplan-edit-banner');

        if (dim === '3d') {
            // Mode Kelola Titik tersedia juga di 3D: tombol tetap tampil, status mode edit dibawa ke kanvas 3D
            if (btnEditPins) {
                btnEditPins.style.removeProperty('display');
                btnEditPins.style.display = 'inline-flex';
            }
            if (view3d) {
                view3d.classList.toggle('edit-mode', !!(window.APP_STATE && window.APP_STATE.isFloorplanEditMode));
            }
            // fp3dBar hidden
            if (window.APP_STATE && window.APP_STATE.isFloorplanEditMode) {
                if (editBanner) {
                    editBanner.style.display = 'flex';
                    editBanner.classList.remove('hidden');
                }
            } else if (editBanner) {
                editBanner.style.display = 'none';
                editBanner.classList.add('hidden');
            }
            if (btn3d) {
                btn3d.classList.add('active');
                btn3d.style.setProperty('background', 'rgba(255, 23, 68, 0.22)', 'important');
                btn3d.style.setProperty('border', '1.5px solid #FF1744', 'important');
                btn3d.style.setProperty('color', '#FFFFFF', 'important');
                btn3d.style.setProperty('font-weight', '700', 'important');
                btn3d.style.boxShadow = '0 0 14px rgba(255, 23, 68, 0.45)';
                const ico3d = btn3d.querySelector('i');
                if (ico3d) ico3d.style.setProperty('color', '#FFFFFF', 'important');
            }
            if (btn2d) {
                btn2d.classList.remove('active');
                btn2d.style.removeProperty('background');
                btn2d.style.removeProperty('color');
                btn2d.style.removeProperty('font-weight');
                btn2d.style.background = 'transparent';
                btn2d.style.color = '#94A3B8';
                btn2d.style.fontWeight = '600';
                btn2d.style.boxShadow = 'none';
                const ico2d = btn2d.querySelector('i');
                if (ico2d) {
                    ico2d.style.removeProperty('color');
                    ico2d.style.color = '#94A3B8';
                }
            }
            if (view3d) view3d.style.display = 'block';
            if (view2d) view2d.style.display = 'none';

            if (!FP3D.initialized) {
                setTimeout(() => {
                    init3D();
                    setCameraView('front', true);
                }, 80);
            } else {
                sync3DPinsFrom2D(true);
                setTimeout(() => {
                    onWindowResize();
                    if (!FP3D.currentView || FP3D.currentView === 'top') {
                        setCameraView('front');
                    }
                }, 100);
            }
            try { localStorage.setItem('taims_floorplan_dim', '3d'); } catch (e) { }
        } else {
            // Tampilkan kembali tombol Mode Kelola Titik saat berada di 2D CAD
            if (view3d) view3d.classList.remove('edit-mode');
            if (btnEditPins) {
                btnEditPins.style.removeProperty('display');
                btnEditPins.style.display = 'inline-flex';
            }
            if (window.APP_STATE && window.APP_STATE.isFloorplanEditMode) {
                if (editBanner) {
                    editBanner.style.display = 'flex';
                    editBanner.classList.remove('hidden');
                }
            } else if (editBanner) {
                editBanner.style.display = 'none';
                editBanner.classList.add('hidden');
            }

            if (btn2d) {
                btn2d.classList.add('active');
                btn2d.style.setProperty('background', 'rgba(255, 23, 68, 0.22)', 'important');
                btn2d.style.setProperty('border', '1.5px solid #FF1744', 'important');
                btn2d.style.setProperty('color', '#FFFFFF', 'important');
                btn2d.style.setProperty('font-weight', '700', 'important');
                btn2d.style.boxShadow = '0 0 14px rgba(255, 23, 68, 0.45)';
                const ico2d = btn2d.querySelector('i');
                if (ico2d) ico2d.style.setProperty('color', '#FFFFFF', 'important');
            }
            if (btn3d) {
                btn3d.classList.remove('active');
                btn3d.style.removeProperty('background');
                btn3d.style.removeProperty('color');
                btn3d.style.removeProperty('font-weight');
                btn3d.style.background = 'transparent';
                btn3d.style.color = '#94A3B8';
                btn3d.style.fontWeight = '600';
                btn3d.style.boxShadow = 'none';
                const ico3d = btn3d.querySelector('i');
                if (ico3d) {
                    ico3d.style.removeProperty('color');
                    ico3d.style.color = '#94A3B8';
                }
            }
            if (view2d) view2d.style.display = 'block';
            if (view3d) view3d.style.display = 'none';
            try { localStorage.setItem('taims_floorplan_dim', '2d'); } catch (e) { }
        }
    }

    // Hook ke showBlueprintSite agar tombol pilihan site HO/MO/Server langsung menyinkronkan 3D
    setTimeout(() => {
        const origShowBlueprintSite = window.showBlueprintSite;
        window.showBlueprintSite = function (siteKey) {
            if (typeof origShowBlueprintSite === 'function') {
                origShowBlueprintSite(siteKey);
            }
            switchSite(siteKey);
        };

        const origSwitchLocationSubTab = window.switchLocationSubTab;
        window.switchLocationSubTab = function (tab) {
            if (typeof origSwitchLocationSubTab === 'function') {
                origSwitchLocationSubTab(tab === 'floor3d' ? 'floor' : tab);
            }
            const btnFloor3d = document.getElementById('tab-btn-floor3d');
            const btnFloor = document.getElementById('tab-btn-floor');
            if (tab === 'floor3d') {
                if (btnFloor3d) btnFloor3d.classList.add('active');
                if (btnFloor) btnFloor.classList.remove('active');
                switchFloorplanDimension('3d');
            } else if (tab === 'floor') {
                if (btnFloor3d) btnFloor3d.classList.remove('active');
                if (btnFloor) btnFloor.classList.add('active');
                switchFloorplanDimension('2d');
            }
        };

        // Sinkronisasi status tombol dengan kontainer yang aktif
        const view3d = document.getElementById('floorplan-3d-view');
        const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem('taims_floorplan_dim') : null;
        if (saved === '3d' || (view3d && view3d.style.display !== 'none')) {
            switchFloorplanDimension('3d');
        } else {
            switchFloorplanDimension('2d');
        }
    }, 150);

    document.addEventListener('DOMContentLoaded', () => {
        const view3d = document.getElementById('floorplan-3d-view');
        const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem('taims_floorplan_dim') : null;
        if (saved === '3d' || (view3d && view3d.style.display !== 'none')) {
            switchFloorplanDimension('3d');
        }
    });

    function resetCameraView3D() {
        setCameraView('front');
        if (typeof window.showToast === 'function') {
            window.showToast('Kamera 3D', 'Posisi kamera berhasil di-reset ke sudut isometrik.', 'info');
        }
    }

    // -------------------------------------------------------------------------
    // EKSPOR API ENGINE GLOBAL KE WINDOW
    // -------------------------------------------------------------------------
    window.switchFloorplanDimension = switchFloorplanDimension;
    window.toggleRoofXRay = toggleRoofXRay;
    window.toggleNightMode = toggleNightMode;
    window.toggleAutoRotate = toggleAutoRotate;
    window.toggleIoTPins = toggleIoTPins;
    window.toggleDroneTour = toggleDroneTour;
    window.showDeviceInspectorCard = showDeviceInspectorCard;
    window.closeDeviceInspectorCard = closeDeviceInspectorCard;
    window.setCameraView3D = setCameraView;
    window.resetCameraView3D = resetCameraView3D;
    window.focusDevice3D = focusDevice;
    window.toggleDeviceAccordion3D = toggleDeviceAccordion;
    window.openCompareModal3D = openCompareModal;
    window.closeCompareModal3D = closeCompareModal;
    window.switchSite3D = switchSite;
    window.switchSite = switchSite;
    window.initFloorplan3D = init3D;
    window.sync3DPinsFrom2D = sync3DPinsFrom2D;
    window.openAdd3DPinModal = openAdd3DPinModal;
    window.openEdit3DPinModal = openEdit3DPinModal;
    window.close3DPinModal = close3DPinModal;
    window.handleSave3DPin = handleSave3DPin;
    window.handleDelete3DPin = handleDelete3DPin;
    window.startPicking3DPosition = startPicking3DPosition;
    window.cancelPicking3DPosition = cancelPicking3DPosition;
    window.handle3DDeviceSelectChange = handle3DDeviceSelectChange;
    window.handle3DSiteChangeInModal = handle3DSiteChangeInModal;
    window.toggleManual3DAssetInput = toggleManual3DAssetInput;
    window.openFloorplanPinModalFrom3DBar = function() {
        const siteKey = (FP3D && FP3D.currentSite && FP3D.currentSite !== 'all') ? FP3D.currentSite : 'ho';
        openAdd3DPinModal(siteKey);
    };

})();
