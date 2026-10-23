/**
 * =============================================================================
 * T-AIMS 3D DIGITAL TWIN & X-RAY ARCHITECTURAL ENGINE
 * Model Realistis Rumah 3D untuk 3 Lokasi:
 * 1. Head Office (HO) - Rumah Fasad Lengkap, Atap Pelana, Carport, Tiang, CCTV Cone
 * 2. Marketing Office (MO) - Kantor Cabang Modern, Pintu Kaca, Atap X-Ray
 * 3. House of Server (HS) - Gedung Server & Data Center, HVAC, Rak Server Sentral
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
        isRoofRemoved: false,  // false: Atap terpasang, true: Lepas Atap (X-Ray)
        isNightMode: false,
        isAutoRotate: false,
        showPins: true,

        // Grup Objek 3D per Site
        siteGroups: {
            ho: null,
            mo: null,
            hs: null
        },
        roofGroups: {
            ho: null,
            mo: null,
            hs: null
        },

        // Komponen Lingkungan
        activeBuildingGroup: null,
        activeRoofGroup: null,
        activePinsGroup: null,
        cctvCones: {},

        // Lampu
        ambientLight: null,
        dirLight: null,
        dirLightBlue: null,
        streetLight: null,
        porchLight: null,

        // Raycaster
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        pinMeshes: [],

        // Metadata 3 Site & Perangkat Terkalibrasi
        siteData: {
            ho: {
                name: 'Head Office (Kantor Pusat)',
                location: 'Jl. Cibodas No. 03, Blitar',
                badge: 'SITE 1 • HEAD OFFICE (7 ASET)',
                dims: '14.0 m × 11.0 m (154 m²)',
                camFront: { pos: [0, 22, 28], target: [0, 2, 0] },
                camStreet: { pos: [-18, 5, 22], target: [1, 2.5, -1] },
                camTop: { pos: [0, 36, 0.05], target: [0, 0, 0] },
                camCctv: { pos: [-5.2, 3.8, 6.2], target: [2, 0.8, 12] },
                devices: [
                    { code: 'CCTV-01', name: 'Kamera Pengawas Gerbang 1', room: 'Pilar Gerbang Carport', ip: '192.168.1.39', status: 'online', pos: [-5.2, 3.6, 6.2], icon: 'fa-video' },
                    { code: 'PC-01', name: 'Workstation Staf (Titik 3.1)', room: 'Ruang Staf 3.1', ip: '192.168.1.2', status: 'offline', pos: [3.4, 1.2, -1.2], icon: 'fa-desktop' },
                    { code: 'PC-02', name: 'Workstation Staf (Titik 3.4)', room: 'Ruang Staf 3.4', ip: '192.168.1.7', status: 'offline', pos: [0.8, 1.2, -1.2], icon: 'fa-desktop' },
                    { code: 'ESP-01', name: 'Modul Sensor IoT (Titik 4)', room: 'Dinding Kiri Ruang 4', ip: '192.168.1.15', status: 'online', pos: [-4.6, 2.2, -1.5], icon: 'fa-microchip' },
                    { code: 'RPI-01', name: 'Gateway Resepsionis (Titik 5)', room: 'Area Foyer Depan', ip: '192.168.1.20', status: 'online', pos: [1.8, 1.2, 3.2], icon: 'fa-microchip' },
                    { code: 'RTR-01', name: 'Router Koridor (Titik 6)', room: 'Gateway Koridor Tengah', ip: '192.168.1.1', status: 'online', pos: [2.5, 1.8, -3.8], icon: 'fa-wifi' },
                    { code: 'SMTV-01', name: 'Smart TV Display (Titik 2)', room: 'Dinding TV Sayap Kanan', ip: '192.168.1.10', status: 'online', pos: [5.8, 2.4, 1.0], icon: 'fa-tv' }
                ]
            },
            mo: {
                name: 'Marketing Office (Lab Kiki)',
                location: 'Jl. Melati No. 12, Blitar',
                badge: 'SITE 2 • MARKETING OFFICE (4 ASET)',
                dims: '12.0 m × 10.0 m (120 m²)',
                camFront: { pos: [0, 20, 26], target: [0, 2, 0] },
                camStreet: { pos: [-15, 4.5, 18], target: [0, 2, 0] },
                camTop: { pos: [0, 32, 0.05], target: [0, 0, 0] },
                camCctv: { pos: [-4.5, 3.5, 5.0], target: [1, 0.5, 10] },
                devices: [
                    { code: 'CCTV-02', name: 'Kamera Pengawas MO', room: 'Pintu Masuk Depan MO', ip: '192.168.1.3', status: 'online', pos: [-4.5, 3.2, 5.0], icon: 'fa-video' },
                    { code: 'MKRT-01', name: 'MikroTik Gateway MO', room: 'Pojok Kanan Atas Ruang', ip: '192.168.1.2', status: 'online', pos: [3.8, 2.2, -3.2], icon: 'fa-server' },
                    { code: 'RTR-03', name: 'Router Subnet MO', room: 'Rak Jaringan MO Baris 2', ip: '192.168.1.1', status: 'online', pos: [3.8, 1.8, -1.6], icon: 'fa-network-wired' },
                    { code: 'RTR-02', name: 'Router Gateway Utama MO', room: 'Rak Jaringan MO Baris 1', ip: '192.168.0.1', status: 'online', pos: [3.8, 1.4, 0.2], icon: 'fa-network-wired' }
                ]
            },
            hs: {
                name: 'House of Server (Data Center T-AIMS)',
                location: 'Sentral Server Peladen, Blitar',
                badge: 'SITE 3 • HOUSE OF SERVER (4 ASET)',
                dims: '10.0 m × 10.0 m (100 m²)',
                camFront: { pos: [0, 18, 24], target: [0, 2, 0] },
                camStreet: { pos: [-12, 4.5, 16], target: [0, 2, 0] },
                camTop: { pos: [0, 28, 0.05], target: [0, 0, 0] },
                camCctv: { pos: [-3.8, 3.2, 4.2], target: [0, 1, 8] },
                devices: [
                    { code: 'SRV-01', name: 'Server Monitoring Utama', room: 'Rak Utama Slot A (Bawah)', ip: '192.168.1.200', status: 'online', pos: [2.8, 1.2, -1.8], icon: 'fa-server' },
                    { code: 'MKRT-02', name: 'MikroTik Core Server', room: 'Rak Utama Slot C (Tengah)', ip: '192.168.1.250', status: 'online', pos: [2.8, 1.8, -1.8], icon: 'fa-network-wired' },
                    { code: 'RPI-02', name: 'Server Auxiliary Node', room: 'Rak Utama Slot D', ip: '192.168.1.205', status: 'online', pos: [2.8, 2.3, -1.8], icon: 'fa-microchip' },
                    { code: 'SWM-01', name: 'Switch Manageable Backbone', room: 'Rak Utama Slot B (Atas)', ip: '192.168.1.254', status: 'online', pos: [2.8, 2.8, -1.8], icon: 'fa-bars-progress' }
                ]
            }
        }
    };

    // -------------------------------------------------------------------------
    // 1. MATERIAL STANDAR TEKNOLAB (REALISTIK MODERN)
    // -------------------------------------------------------------------------
    const MATS = {
        wallCream: new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.65, metalness: 0.1 }),
        wallSage: new THREE.MeshStandardMaterial({ color: 0x84CC16, roughness: 0.5 }), // Aksen hijau foto 1
        wallCharcoal: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 }),
        floorSlate: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.6 }),
        groundGrass: new THREE.MeshStandardMaterial({ color: 0x1A2E26, roughness: 0.9 }),
        asphalt: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 }),
        carportOrange: new THREE.MeshStandardMaterial({ color: 0xEA580C, roughness: 0.6, metalness: 0.1 }), // Oranye persis foto 1
        roofTerracotta: new THREE.MeshStandardMaterial({ color: 0xA16207, roughness: 0.55, metalness: 0.15, side: THREE.DoubleSide }),
        roofRidge: new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.4 }),
        glass: new THREE.MeshStandardMaterial({ color: 0x60A5FA, transparent: true, opacity: 0.4, roughness: 0.1 }),
        woodDoor: new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.4 }),
        serverBlue: new THREE.MeshStandardMaterial({ color: 0x1D4ED8, metalness: 0.7, roughness: 0.3 }), // Rak server biru foto 2
        carWhite: new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.2, metalness: 0.3 }),
        gateMetal: new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.8, roughness: 0.2 }),
        pillarConcrete: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 })
    };

    // -------------------------------------------------------------------------
    // 2. BUILDER GEDUNG 1: HEAD OFFICE (HO) - SESUAI FOTO 1, 2, 3
    // -------------------------------------------------------------------------
    function buildHOSite() {
        const root = new THREE.Group();
        const roofGroup = new THREE.Group();
        const pinsGroup = new THREE.Group();

        // A. Lingkungan Luar (Jalan, Trotoar, Carport Oranye)
        const envGroup = new THREE.Group();

        // Rumput dasar
        const grass = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), MATS.groundGrass);
        grass.rotation.x = -Math.PI / 2;
        grass.position.y = -0.05;
        grass.receiveShadow = true;
        envGroup.add(grass);

        // Jalan aspal depan
        const road = new THREE.Mesh(new THREE.PlaneGeometry(70, 14), MATS.asphalt);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, 16);
        road.receiveShadow = true;
        envGroup.add(road);

        // Marka jalan putus-putus
        for (let x = -30; x <= 30; x += 6) {
            const stripe = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.3), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
            stripe.rotation.x = -Math.PI / 2;
            stripe.position.set(x, 0.02, 16);
            envGroup.add(stripe);
        }

        // Trotoar abu-abu
        const curb = new THREE.Mesh(new THREE.BoxGeometry(70, 0.3, 1.2), MATS.pillarConcrete);
        curb.position.set(0, 0.15, 8.8);
        envGroup.add(curb);

        // Carport Oranye Terracotta (Persis Foto 1)
        const carport = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), MATS.carportOrange);
        carport.rotation.x = -Math.PI / 2;
        carport.position.set(1.5, 0.03, 5.5);
        carport.receiveShadow = true;
        envGroup.add(carport);

        // Tiang Listrik Jalan (Kiri Foto 1)
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 13, 16), MATS.asphalt);
        pole.position.set(-11.5, 6.5, 10.5);
        pole.castShadow = true;
        envGroup.add(pole);

        const crossarm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.15), MATS.asphalt);
        crossarm.position.set(-11.5, 12, 10.5);
        envGroup.add(crossarm);

        // Pilar Gerbang Beton & Pagar Hitam (Foto 1)
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 4.6, 1.4), MATS.pillarConcrete);
        pillar.position.set(-7.5, 2.3, 7.5);
        pillar.castShadow = true;
        envGroup.add(pillar);

        const pCap = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.5, 4), MATS.pillarConcrete);
        pCap.position.set(-7.5, 4.85, 7.5);
        pCap.rotation.y = Math.PI / 4;
        envGroup.add(pCap);

        const gate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.6, 3.2), MATS.gateMetal);
        gate.position.set(-7.5, 1.8, 5.0);
        envGroup.add(gate);

        // Papan Nama Teknolab
        const signboard = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 0.08), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
        signboard.position.set(-3.2, 1.2, 7.5);
        signboard.rotation.y = Math.PI / 6;
        envGroup.add(signboard);

        // Mobil Putih di Carport (Foto 2 & 3)
        const car = buildCarMesh();
        car.position.set(2.8, 0, 4.6);
        envGroup.add(car);

        root.add(envGroup);

        // B. Arsitektur Gedung HO (Dinding Luar, Lantai, Fasad, Kanopi)
        const houseGroup = new THREE.Group();

        // Lantai dalam
        const floor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 11), MATS.floorSlate);
        floor.position.set(0, 0.15, -1.5);
        houseGroup.add(floor);

        // Dinding Luar
        const backW = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 0.4), MATS.wallCream);
        backW.position.set(0, 2.15, -7);
        houseGroup.add(backW);

        const leftW = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4, 11), MATS.wallCream);
        leftW.position.set(-7, 2.15, -1.5);
        houseGroup.add(leftW);

        const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4, 11), MATS.wallCream);
        rightW.position.set(7, 2.15, -1.5);
        houseGroup.add(rightW);

        // Dinding Depan dengan pintu
        const fLeft = new THREE.Mesh(new THREE.BoxGeometry(5, 4, 0.4), MATS.wallCream);
        fLeft.position.set(-4.5, 2.15, 4);
        houseGroup.add(fLeft);

        const fRight = new THREE.Mesh(new THREE.BoxGeometry(5.5, 4, 0.4), MATS.wallCream);
        fRight.position.set(4.25, 2.15, 4);
        houseGroup.add(fRight);

        const fTop = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.4, 0.4), MATS.wallCream);
        fTop.position.set(-0.25, 3.45, 4);
        houseGroup.add(fTop);

        // Lis Garis Sage Hijau Fasad Depan (Foto 1)
        const sageTrim = new THREE.Mesh(new THREE.BoxGeometry(14.2, 0.18, 0.5), MATS.wallSage);
        sageTrim.position.set(0, 3.2, 4.05);
        houseGroup.add(sageTrim);

        // Pintu Kayu
        const door = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.5, 0.1), MATS.woodDoor);
        door.position.set(-0.25, 1.45, 3.95);
        houseGroup.add(door);

        // Kanopi Teras Depan
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(8, 0.35, 4.5), new THREE.MeshStandardMaterial({ color: 0xDCFCE7, roughness: 0.4 }));
        canopy.position.set(0.5, 3.85, 6);
        houseGroup.add(canopy);

        // Dua Tiang Kanopi
        const pil1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.7), MATS.wallCream);
        pil1.position.set(-3.2, 2, 7.8);
        houseGroup.add(pil1);
        const pil2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.7), MATS.wallCream);
        pil2.position.set(4.2, 2, 7.8);
        houseGroup.add(pil2);

        // C. Interior & Partisi Ruangan (Terlihat saat X-Ray)
        const interiorGroup = new THREE.Group();

        // Sekat horizontal ruang staf
        const partH = new THREE.Mesh(new THREE.BoxGeometry(8, 3, 0.25), MATS.wallCream);
        partH.position.set(2.8, 1.65, 0.5);
        interiorGroup.add(partH);

        // Sekat ruang server
        const partSZ = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3, 5.5), MATS.wallCream);
        partSZ.position.set(-1, 1.65, -4.2);
        interiorGroup.add(partSZ);

        const partSX = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3, 0.25), MATS.wallCream);
        partSX.position.set(-3.9, 1.65, -1.5);
        interiorGroup.add(partSX);

        // Rak Server Biru Tua (Foto 2)
        const srvRack = buildServerRackMesh();
        srvRack.position.set(-2.8, 0.15, -4);
        interiorGroup.add(srvRack);

        // Workstation Staf PC-01 & PC-02
        interiorGroup.add(buildDeskMesh(3.4, -1.2));
        interiorGroup.add(buildDeskMesh(0.8, -1.2));

        // Smart TV Display
        const tv = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.3), new THREE.MeshBasicMaterial({ color: 0x06B6D4 }));
        tv.rotation.y = -Math.PI / 2;
        tv.position.set(6.8, 2.4, 1);
        interiorGroup.add(tv);

        // Meja Resepsionis
        const recep = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.1, 0.9), MATS.wallCream);
        recep.position.set(1.8, 0.65, 3);
        interiorGroup.add(recep);

        houseGroup.add(interiorGroup);
        root.add(houseGroup);

        // D. Atap Pelana (Gable Roof) - X-Ray Toggle Target
        // Miring Kiri
        const rLeft = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.25, 12.2), MATS.roofTerracotta);
        rLeft.position.set(-3.7, 5.3, -1.5);
        rLeft.rotation.z = Math.PI / 8.5;
        rLeft.castShadow = true;
        roofGroup.add(rLeft);

        // Miring Kanan
        const rRight = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.25, 12.2), MATS.roofTerracotta);
        rRight.position.set(3.7, 5.3, -1.5);
        rRight.rotation.z = -Math.PI / 8.5;
        rRight.castShadow = true;
        roofGroup.add(rRight);

        // Bubungan / Nok Atap
        const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 12.4), MATS.roofRidge);
        ridge.position.set(0, 6.35, -1.5);
        roofGroup.add(ridge);

        // Segitiga Sopil Fasad Depan
        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(-7, 0);
        triangleShape.lineTo(7, 0);
        triangleShape.lineTo(0, 2.3);
        triangleShape.closePath();
        const gableGeo = new THREE.ShapeGeometry(triangleShape);

        const fGable = new THREE.Mesh(gableGeo, MATS.wallCream);
        fGable.position.set(0, 4.15, 4);
        roofGroup.add(fGable);

        const bGable = new THREE.Mesh(gableGeo, MATS.wallCream);
        bGable.position.set(0, 4.15, -7);
        bGable.rotation.y = Math.PI;
        roofGroup.add(bGable);

        // Plafon datar
        const ceil = new THREE.Mesh(new THREE.BoxGeometry(14, 0.15, 11), MATS.wallCream);
        ceil.position.set(0, 4.1, -1.5);
        roofGroup.add(ceil);

        root.add(roofGroup);

        // E. Kamera CCTV & Yellow Vision Cone (Foto 1 & 2)
        const cctvObj = buildCctvCameraMesh();
        cctvObj.group.position.set(-5.2, 3.6, 6.2);
        root.add(cctvObj.group);
        FP3D.cctvCones.ho = cctvObj.cone;

        // F. Pin IoT HO (7 Perangkat)
        FP3D.siteData.ho.devices.forEach(dev => {
            pinsGroup.add(createDevicePinMesh(dev));
        });
        root.add(pinsGroup);

        FP3D.siteGroups.ho = root;
        FP3D.roofGroups.ho = roofGroup;

        return { root, roofGroup, pinsGroup };
    }

    // -------------------------------------------------------------------------
    // 3. BUILDER GEDUNG 2: MARKETING OFFICE (MO - LAB KIKI)
    // -------------------------------------------------------------------------
    function buildMOSite() {
        const root = new THREE.Group();
        const roofGroup = new THREE.Group();
        const pinsGroup = new THREE.Group();

        // A. Lingkungan Luar
        const env = new THREE.Group();
        const grass = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), MATS.groundGrass);
        grass.rotation.x = -Math.PI / 2;
        grass.position.y = -0.05;
        env.add(grass);

        const pavedFront = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), MATS.pillarConcrete);
        pavedFront.rotation.x = -Math.PI / 2;
        pavedFront.position.set(0, 0.02, 6.5);
        env.add(pavedFront);

        root.add(env);

        // B. Bangunan MO (Modern Storefront Style)
        const building = new THREE.Group();
        const floor = new THREE.Mesh(new THREE.BoxGeometry(12, 0.3, 10), MATS.floorSlate);
        floor.position.set(0, 0.15, 0);
        building.add(floor);

        // Dinding Luar
        const backW = new THREE.Mesh(new THREE.BoxGeometry(12, 3.8, 0.3), MATS.wallCream);
        backW.position.set(0, 2.05, -5);
        building.add(backW);

        const leftW = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 10), MATS.wallCream);
        leftW.position.set(-6, 2.05, 0);
        building.add(leftW);

        const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.8, 10), MATS.wallCream);
        rightW.position.set(6, 2.05, 0);
        building.add(rightW);

        // Depan (Pintu Kaca Lebar & Fasad Modern)
        const frontWLeft = new THREE.Mesh(new THREE.BoxGeometry(3, 3.8, 0.3), MATS.wallCream);
        frontWLeft.position.set(-4.5, 2.05, 5);
        building.add(frontWLeft);

        const frontWRight = new THREE.Mesh(new THREE.BoxGeometry(3, 3.8, 0.3), MATS.wallCream);
        frontWRight.position.set(4.5, 2.05, 5);
        building.add(frontWRight);

        const glassDoor = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 0.1), MATS.glass);
        glassDoor.position.set(0, 1.75, 5);
        building.add(glassDoor);

        // Interior MO
        const intGroup = new THREE.Group();
        // Meja Marketing
        intGroup.add(buildDeskMesh(-2.5, 0));
        intGroup.add(buildDeskMesh(2.5, 0));

        // Rak Jaringan MO (RTR-02, RTR-03, MKRT-01)
        const moRack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 1.0), MATS.serverBlue);
        moRack.position.set(3.8, 1.25, -2);
        intGroup.add(moRack);

        building.add(intGroup);
        root.add(building);

        // C. Atap Modern Miring Satu Sisi (Shed Roof)
        const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(13, 0.35, 11), MATS.roofTerracotta);
        roofSlab.position.set(0, 4.3, 0);
        roofSlab.rotation.x = 0.08;
        roofGroup.add(roofSlab);

        const ceil = new THREE.Mesh(new THREE.BoxGeometry(12, 0.15, 10), MATS.wallCream);
        ceil.position.set(0, 3.95, 0);
        roofGroup.add(ceil);

        root.add(roofGroup);

        // D. CCTV-02 & Cone
        const cctvObj = buildCctvCameraMesh();
        cctvObj.group.position.set(-4.5, 3.4, 5.2);
        root.add(cctvObj.group);
        FP3D.cctvCones.mo = cctvObj.cone;

        // E. Pin Perangkat MO
        FP3D.siteData.mo.devices.forEach(dev => {
            pinsGroup.add(createDevicePinMesh(dev));
        });
        root.add(pinsGroup);

        FP3D.siteGroups.mo = root;
        FP3D.roofGroups.mo = roofGroup;

        return { root, roofGroup, pinsGroup };
    }

    // -------------------------------------------------------------------------
    // 4. BUILDER GEDUNG 3: HOUSE OF SERVER (HS - DATA CENTER)
    // -------------------------------------------------------------------------
    function buildHSSite() {
        const root = new THREE.Group();
        const roofGroup = new THREE.Group();
        const pinsGroup = new THREE.Group();

        // A. Lingkungan Luar
        const env = new THREE.Group();
        const grass = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), MATS.groundGrass);
        grass.rotation.x = -Math.PI / 2;
        grass.position.y = -0.05;
        env.add(grass);

        // Genset & Unit Pendingin Luar (Outdoor Chiller)
        const chiller = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.4), MATS.pillarConcrete);
        chiller.position.set(-6.5, 0.9, -2);
        env.add(chiller);

        root.add(env);

        // B. Bangunan Server Vault Berkeamanan Tinggi
        const building = new THREE.Group();
        const floor = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 10), MATS.floorSlate);
        floor.position.set(0, 0.15, 0);
        building.add(floor);

        // Dinding Luar Panel Kedap
        const backW = new THREE.Mesh(new THREE.BoxGeometry(10, 3.8, 0.35), MATS.wallCharcoal);
        backW.position.set(0, 2.05, -5);
        building.add(backW);

        const leftW = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 10), MATS.wallCharcoal);
        leftW.position.set(-5, 2.05, 0);
        building.add(leftW);

        const rightW = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 10), MATS.wallCharcoal);
        rightW.position.set(5, 2.05, 0);
        building.add(rightW);

        // Dinding Depan dengan Pintu Akses Biometrik
        const fLeft = new THREE.Mesh(new THREE.BoxGeometry(3.5, 3.8, 0.35), MATS.wallCharcoal);
        fLeft.position.set(-3.25, 2.05, 5);
        building.add(fLeft);

        const fRight = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.8, 0.35), MATS.wallCharcoal);
        fRight.position.set(2.75, 2.05, 5);
        building.add(fRight);

        const secDoor = new THREE.Mesh(new THREE.BoxGeometry(2, 2.8, 0.15), MATS.gateMetal);
        secDoor.position.set(-0.5, 1.55, 5);
        building.add(secDoor);

        // C. Interior Data Center (4 Rak Server Inti SRV-01, SWM-01, MKRT-02, RPI-02)
        const intGroup = new THREE.Group();
        const rack1 = buildServerRackMesh();
        rack1.position.set(2.8, 0.15, -1.8);
        intGroup.add(rack1);

        const rack2 = buildServerRackMesh();
        rack2.position.set(0.5, 0.15, -1.8);
        intGroup.add(rack2);

        const rack3 = buildServerRackMesh();
        rack3.position.set(-1.8, 0.15, -1.8);
        intGroup.add(rack3);

        // Unit AC Presisi Server
        const acUnit = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.8, 1.0), MATS.wallCream);
        acUnit.position.set(-3.8, 1.55, 2.5);
        intGroup.add(acUnit);

        building.add(intGroup);
        root.add(building);

        // D. Atap Datar dengan Exhaust HVAC
        const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.35, 10.6), MATS.roofTerracotta);
        roofSlab.position.set(0, 4.15, 0);
        roofGroup.add(roofSlab);

        // Dua Exhaust Fan di atas atap
        const fan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 16), MATS.wallCharcoal);
        fan1.position.set(-2, 4.6, -1);
        roofGroup.add(fan1);

        const fan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.6, 16), MATS.wallCharcoal);
        fan2.position.set(2, 4.6, 1);
        roofGroup.add(fan2);

        root.add(roofGroup);

        // E. Pin Perangkat HS
        FP3D.siteData.hs.devices.forEach(dev => {
            pinsGroup.add(createDevicePinMesh(dev));
        });
        root.add(pinsGroup);

        FP3D.siteGroups.hs = root;
        FP3D.roofGroups.hs = roofGroup;

        return { root, roofGroup, pinsGroup };
    }

    // -------------------------------------------------------------------------
    // 5. HELPER MESH: MOBIL, RAK SERVER, MEJA, CCTV CAMERA
    // -------------------------------------------------------------------------
    function buildCarMesh() {
        const car = new THREE.Group();
        // Bodi bawah
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.7, 4.4), MATS.carWhite);
        body.position.set(0, 0.55, 0);
        body.castShadow = true;
        car.add(body);

        // Kabin atas
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.65, 2.4), MATS.asphalt);
        cabin.position.set(0, 1.15, -0.2);
        car.add(cabin);

        // 4 Roda
        const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16);
        [
            [-1.0, 0.32, 1.3], [1.0, 0.32, 1.3],
            [-1.0, 0.32, -1.3], [1.0, 0.32, -1.3]
        ].forEach(([wx, wy, wz]) => {
            const w = new THREE.Mesh(wheelGeo, MATS.asphalt);
            w.rotation.z = Math.PI / 2;
            w.position.set(wx, wy, wz);
            car.add(w);
        });
        return car;
    }

    function buildServerRackMesh() {
        const rack = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.0, 1.4), MATS.serverBlue);
        body.position.set(0, 1.5, 0);
        body.castShadow = true;
        rack.add(body);

        const glass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.8, 0.05), MATS.glass);
        glass.position.set(0, 1.5, 0.72);
        rack.add(glass);

        // LED berkedip
        const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x10B981 }));
        led1.position.set(0.4, 2.2, 0.75);
        rack.add(led1);

        const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x38BDF8 }));
        led2.position.set(0.4, 1.8, 0.75);
        rack.add(led2);

        return rack;
    }

    function buildDeskMesh(x, z) {
        const desk = new THREE.Group();
        const top = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.1), MATS.woodDoor);
        top.position.set(0, 0.75, 0);
        desk.add(top);

        const mon = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.55, 0.04), MATS.asphalt);
        mon.position.set(0, 1.15, -0.2);
        desk.add(mon);

        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), new THREE.MeshBasicMaterial({ color: 0x38BDF8 }));
        scr.position.set(0, 1.15, -0.17);
        desk.add(scr);

        desk.position.set(x, 0.15, z);
        return desk;
    }

    function buildCctvCameraMesh() {
        const group = new THREE.Group();

        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.45, 16), MATS.carWhite);
        body.rotation.x = Math.PI / 2;
        group.add(body);

        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 16), new THREE.MeshBasicMaterial({ color: 0x0F172A }));
        lens.rotation.x = Math.PI / 2;
        lens.position.z = 0.24;
        group.add(lens);

        // Kerucut Sorot Kuning Semi-Transparan (Yellow Vision Cone Sesuai Foto 1 & 2!)
        const coneHeight = 8.5;
        const coneRadius = 4.2;
        const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 24, 1, true);
        coneGeo.translate(0, -coneHeight / 2, 0);

        const coneMat = new THREE.MeshBasicMaterial({
            color: 0xF59E0B, // Kuning neon amber
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
    // 6. PIN PERANGKAT IOT DENGAN PULSING RING & RAYCASTER
    // -------------------------------------------------------------------------
    
    // Sinkronisasi status perangkat 3D dengan Live Telemetri T-AIMS
    function getLiveStatus(dev) {
        if (typeof window !== 'undefined' && window.APP_STATE && Array.isArray(window.APP_STATE.devices)) {
            const found = window.APP_STATE.devices.find(d => (d.asset_code || d.code) === dev.code);
            if (found) {
                const s = String(found.current_status || found.status || '').toLowerCase();
                if (s === 'online' || s === 'offline') return s;
            }
        }
        return dev.status || 'offline';
    }

    function createDevicePinMesh(dev) {
        const pinHolder = new THREE.Group();
        const currentStatus = getLiveStatus(dev);
        const isOnline = currentStatus === 'online';
        const col = isOnline ? 0x10B981 : 0xEF4444;

        // Batang vertikal
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7), new THREE.MeshBasicMaterial({ color: 0x38BDF8 }));
        stem.position.y = 0.35;
        pinHolder.add(stem);

        // Bola beacon
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({ color: col }));
        dot.position.y = 0.75;
        dot.userData = { device: dev };
        FP3D.pinMeshes.push(dot);
        pinHolder.add(dot);

        // Cincin radar berkedip
        const ringGeo = new THREE.RingGeometry(0.25, 0.35, 24);
        const ringMat = new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.75;
        pinHolder.add(ring);

        // Sprite Teks Label
        const sprite = createTextSprite(dev.code, col);
        sprite.position.y = 1.35;
        pinHolder.add(sprite);

        pinHolder.position.set(...dev.pos);
        pinHolder.userData = { ring: ring, baseY: dev.pos[1] };

        return pinHolder;
    }

    function createTextSprite(text, colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 70;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(10, 15, 29, 0.88)';
        ctx.strokeStyle = colorHex === 0x10B981 ? '#10B981' : '#EF4444';
        ctx.lineWidth = 3;

        // Round rect
        const x = 4, y = 4, w = 248, h = 62, r = 12;
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
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 28px Plus Jakarta Sans, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 35);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(1.5, 0.45, 1);
        return sprite;
    }

    // -------------------------------------------------------------------------
    // 7. SWITCH GEDUNG (HO / MO / HS) DENGAN MODEL LENGKAP
    // -------------------------------------------------------------------------
    function switchSite(siteKey) {
        const k = (siteKey || 'ho').toLowerCase();
        let targetKey = 'ho';
        if (k === 'mo') targetKey = 'mo';
        else if (k === 'mentor' || k === 'hs' || k === 'server') targetKey = 'hs';

        FP3D.currentSite = targetKey;
        if (!FP3D.scene) return;

        // Sembunyikan semua site
        ['ho', 'mo', 'hs'].forEach(sk => {
            if (FP3D.siteGroups[sk]) {
                FP3D.siteGroups[sk].visible = false;
            }
        });

        // Tampilkan site aktif (bangun jika belum ada)
        if (!FP3D.siteGroups[targetKey]) {
            if (targetKey === 'mo') buildMOSite();
            else if (targetKey === 'hs') buildHSSite();
            else buildHOSite();

            FP3D.scene.add(FP3D.siteGroups[targetKey]);
        }

        FP3D.siteGroups[targetKey].visible = true;
        FP3D.activeBuildingGroup = FP3D.siteGroups[targetKey];
        FP3D.activeRoofGroup = FP3D.roofGroups[targetKey];

        // Terapkan status X-Ray pada atap gedung yang aktif
        if (FP3D.activeRoofGroup) {
            FP3D.activeRoofGroup.visible = !FP3D.isRoofRemoved;
            FP3D.activeRoofGroup.position.y = FP3D.isRoofRemoved ? 8.0 : 0;
        }

        // Reset Kamera ke Preset Depan Site Tersebut
        const sData = FP3D.siteData[targetKey];
        if (sData && FP3D.camera && FP3D.controls) {
            FP3D.camera.position.set(...sData.camFront.pos);
            FP3D.controls.target.set(...sData.camFront.target);
            FP3D.controls.update();
        }

        // Render Ulang Daftar Perangkat di Accordion Bawah
        renderDeviceGrid();

        if (typeof window.showToast === 'function') {
            window.showToast('Denah 3D Digital Twin', `Memuat model 3D: ${sData.name}`, 'info');
        }
    }

    // -------------------------------------------------------------------------
    // 8. FUNGSI X-RAY ATAP (BONGKAR / PASANG ATAP DENGAN ANIMASI)
    // -------------------------------------------------------------------------
    function toggleRoofXRay() {
        if (!FP3D.activeRoofGroup) {
            FP3D.activeRoofGroup = FP3D.roofGroups[FP3D.currentSite];
        }
        if (!FP3D.activeRoofGroup) return;

        FP3D.isRoofRemoved = !FP3D.isRoofRemoved;
        const btn = document.getElementById('btn-fp3d-xray');

        if (FP3D.isRoofRemoved) {
            // Lepas Atap (Mode X-Ray Aktif)
            animateRoofY(FP3D.activeRoofGroup, 8.0, 400, () => {
                FP3D.activeRoofGroup.visible = false;
            });

            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-house"></i> Pasang Atap Normal';
                btn.classList.add('active-xray');
            }
            if (typeof window.showToast === 'function') {
                window.showToast('Mode X-Ray Aktif', 'Atap gedung dilepas. Ruangan dan perangkat interior terlihat jelas.', 'info');
            }
        } else {
            // Pasang Atap Normal
            FP3D.activeRoofGroup.visible = true;
            FP3D.activeRoofGroup.position.y = 8.0;
            animateRoofY(FP3D.activeRoofGroup, 0, 400);

            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-house-laptop"></i> Lepas Atap (X-Ray)';
                btn.classList.remove('active-xray');
            }
            if (typeof window.showToast === 'function') {
                window.showToast('Mode Atap Normal', 'Atap terpasang kembali.', 'success');
            }
        }
    }

    function animateRoofY(group, targetY, duration, callback) {
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
    // 9. KONTROL SUDUT PANDANG KAMERA (FOTO 2, FOTO 1, ATAS/DENAH, CCTV)
    // -------------------------------------------------------------------------
    function setCameraView(viewKey) {
        const sData = FP3D.siteData[FP3D.currentSite] || FP3D.siteData.ho;
        let camTarget = sData.camFront;
        if (viewKey === 'street') camTarget = sData.camStreet;
        else if (viewKey === 'top') camTarget = sData.camTop;
        else if (viewKey === 'cctv') camTarget = sData.camCctv;

        FP3D.currentView = viewKey;

        // Tombol aktif
        document.querySelectorAll('.btn-fp3d-view').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`btn-view-${viewKey}`);
        if (activeBtn) activeBtn.classList.add('active');

        // HUD CCTV jika view cctv aktif
        const hud = document.getElementById('fp3d-cctv-hud');
        if (hud) {
            if (viewKey === 'cctv') hud.classList.add('active');
            else hud.classList.remove('active');
        }

        // Animasi perpindahan kamera
        smoothCameraMove(camTarget.pos, camTarget.target, 750);
    }

    function smoothCameraMove(targetPos, targetLookAt, duration) {
        if (!FP3D.camera || !FP3D.controls) return;
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

            if (p < 1.0) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    // Fokus kamera ke perangkat
    function focusDevice(devCode) {
        const sData = FP3D.siteData[FP3D.currentSite];
        if (!sData) return;
        const dev = sData.devices.find(d => d.code === devCode);
        if (!dev) return;

        // Jika atap terpasang, buka atap X-Ray otomatis
        if (!FP3D.isRoofRemoved) {
            toggleRoofXRay();
        }

        const tLook = [dev.pos[0], dev.pos[1], dev.pos[2]];
        const tCam = [dev.pos[0] + 3.0, dev.pos[1] + 4.5, dev.pos[2] + 5.5];
        smoothCameraMove(tCam, tLook, 650);

        if (typeof window.showToast === 'function') {
            window.showToast('Fokus Kamera 3D', `Mengarahkan ke ${dev.code} (${dev.name})`, 'info');
        }
    }

    // -------------------------------------------------------------------------
    // 10. FITUR PENDUKUNG: MODE MALAM, AUTO ROTATE, PIN TOGGLE
    // -------------------------------------------------------------------------
    function toggleNightMode() {
        FP3D.isNightMode = !FP3D.isNightMode;
        const btn = document.getElementById('btn-fp3d-night');

        if (FP3D.isNightMode) {
            FP3D.scene.background.setHex(0x030712);
            FP3D.scene.fog.color.setHex(0x030712);
            FP3D.ambientLight.intensity = 0.25;
            FP3D.dirLight.intensity = 0.25;
            FP3D.dirLight.color.setHex(0x38BDF8);
            if (FP3D.streetLight) FP3D.streetLight.intensity = 2.5;
            if (FP3D.porchLight) FP3D.porchLight.intensity = 2.0;

            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-sun"></i> Mode Siang';
                btn.classList.add('night-on');
            }
        } else {
            FP3D.scene.background.setHex(0x070B14);
            FP3D.scene.fog.color.setHex(0x070B14);
            FP3D.ambientLight.intensity = 0.75;
            FP3D.dirLight.intensity = 1.2;
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
        FP3D.controls.autoRotateSpeed = 1.4;

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
                sg.children.forEach(c => {
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
    // 11. TABEL ACCORDION PERANGKAT BAWAH KANVAS (PERSIS FOTO 1)
    // -------------------------------------------------------------------------
    function renderDeviceGrid() {
        const grid = document.getElementById('fp3d-device-grid');
        if (!grid) return;

        const sData = FP3D.siteData[FP3D.currentSite] || FP3D.siteData.ho;
        grid.innerHTML = sData.devices.map(dev => {
            const currentStatus = getLiveStatus(dev);
            const isOnline = currentStatus === 'online';
            const badgeClass = isOnline ? 'badge-green' : 'badge-red';
            const statusText = isOnline ? 'ONLINE' : 'OFFLINE';

            return `
                <div class="fp3d-device-card">
                    <div class="fp3d-dev-header">
                        <div class="fp3d-dev-info">
                            <div class="fp3d-dev-icon"><i class="fa-solid ${dev.icon}"></i></div>
                            <div>
                                <div class="fp3d-dev-name">${dev.code} · ${dev.name}</div>
                                <div class="fp3d-dev-loc"><i class="fa-solid fa-location-dot"></i> ${dev.room}</div>
                            </div>
                        </div>
                        <span class="badge ${badgeClass}" style="font-size:0.65rem; padding:2px 6px;">${statusText}</span>
                    </div>
                    <div class="fp3d-dev-meta">
                        <span class="fp3d-dev-ip"><i class="fa-solid fa-network-wired"></i> ${dev.ip}</span>
                        <div class="d-flex gap-1">
                            <button type="button" class="btn-fp3d-focus" onclick="window.focusDevice3D('${dev.code}')" title="Arahkan Kamera 3D ke Perangkat">
                                <i class="fa-solid fa-crosshairs"></i> Fokus 3D
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

    // Modal Bandingkan Foto
    function openCompareModal() {
        const modal = document.getElementById('fp3d-compare-modal');
        if (modal) modal.classList.add('show');
    }

    function closeCompareModal() {
        const modal = document.getElementById('fp3d-compare-modal');
        if (modal) modal.classList.remove('show');
    }

    // -------------------------------------------------------------------------
    // 12. INISIALISASI T-AIMS THREE.JS SCENE
    // -------------------------------------------------------------------------
    function init3D() {
        if (FP3D.initialized) return;

        FP3D.stage = document.getElementById('fp3d-canvas-stage') || document.getElementById('floorplan-3d-view');
        if (!FP3D.stage || typeof THREE === 'undefined') return;

        const width = FP3D.stage.clientWidth || 800;
        const height = FP3D.stage.clientHeight || 580;

        // Scene
        FP3D.scene = new THREE.Scene();
        FP3D.scene.background = new THREE.Color(0x070B14);
        FP3D.scene.fog = new THREE.FogExp2(0x070B14, 0.015);

        // Kamera
        FP3D.camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
        const defCam = FP3D.siteData.ho.camFront;
        FP3D.camera.position.set(...defCam.pos);

        // Renderer
        FP3D.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        FP3D.renderer.setSize(width, height);
        FP3D.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        FP3D.renderer.shadowMap.enabled = true;
        FP3D.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Bersihkan kanvas lama
        const oldCanvas = FP3D.stage.querySelector('canvas');
        if (oldCanvas) oldCanvas.remove();
        FP3D.stage.appendChild(FP3D.renderer.domElement);

        // OrbitControls
        if (typeof THREE.OrbitControls !== 'undefined') {
            FP3D.controls = new THREE.OrbitControls(FP3D.camera, FP3D.renderer.domElement);
            FP3D.controls.enableDamping = true;
            FP3D.controls.dampingFactor = 0.06;
            FP3D.controls.maxPolarAngle = Math.PI / 2 - 0.02;
            FP3D.controls.minDistance = 6;
            FP3D.controls.maxDistance = 100;
            FP3D.controls.target.set(...defCam.target);
            FP3D.controls.update();
        }

        // Pencahayaan
        FP3D.ambientLight = new THREE.AmbientLight(0xCBD5E1, 0.75);
        FP3D.scene.add(FP3D.ambientLight);

        FP3D.dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
        FP3D.dirLight.position.set(20, 35, 20);
        FP3D.dirLight.castShadow = true;
        FP3D.scene.add(FP3D.dirLight);

        FP3D.porchLight = new THREE.PointLight(0xF59E0B, 0.8, 15);
        FP3D.porchLight.position.set(0, 3.8, 6.0);
        FP3D.scene.add(FP3D.porchLight);

        FP3D.streetLight = new THREE.SpotLight(0xFEF08A, 0.4, 25, Math.PI / 4, 0.4);
        FP3D.streetLight.position.set(-10, 9.8, 10.5);
        FP3D.streetLight.target.position.set(-8, 0, 11);
        FP3D.scene.add(FP3D.streetLight);
        FP3D.scene.add(FP3D.streetLight.target);

        // Bangun Gedung Pertama (HO)
        switchSite('ho');

        // Event Listeners
        window.addEventListener('resize', onWindowResize);
        FP3D.stage.addEventListener('mousemove', onMouseMove);
        FP3D.stage.addEventListener('click', onCanvasClick);

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
        if (!FP3D.stage || !FP3D.raycaster || !FP3D.camera) return;
        const rect = FP3D.stage.getBoundingClientRect();
        FP3D.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        FP3D.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        FP3D.raycaster.setFromCamera(FP3D.mouse, FP3D.camera);
        const hits = FP3D.raycaster.intersectObjects(FP3D.pinMeshes, true);
        const tooltip = document.getElementById('fp3d-tooltip');

        if (hits.length > 0) {
            const dev = hits[0].object.userData?.device;
            if (dev && tooltip) {
                tooltip.style.display = 'block';
                tooltip.style.left = `${event.clientX - rect.left}px`;
                tooltip.style.top = `${event.clientY - rect.top}px`;
                tooltip.innerHTML = `
                    <div class="fp3d-tooltip-title"><i class="fa-solid ${dev.icon}"></i> ${dev.code}</div>
                    <div class="fp3d-tooltip-sub">${dev.name} • ${dev.room}</div>
                    <div class="d-flex align-center justify-between mt-1">
                        <span class="fp3d-tooltip-badge ${dev.status}">● ${dev.status.toUpperCase()}</span>
                        <span style="font-family:'JetBrains Mono',monospace; font-size:0.7rem; color:#38BDF8;">${dev.ip}</span>
                    </div>
                `;
                FP3D.stage.style.cursor = 'pointer';
            }
        } else {
            if (tooltip) tooltip.style.display = 'none';
            FP3D.stage.style.cursor = FP3D.controls?.state === -1 ? 'grab' : 'grabbing';
        }
    }

    function onCanvasClick() {
        if (!FP3D.raycaster || !FP3D.camera) return;
        FP3D.raycaster.setFromCamera(FP3D.mouse, FP3D.camera);
        const hits = FP3D.raycaster.intersectObjects(FP3D.pinMeshes, true);
        if (hits.length > 0) {
            const dev = hits[0].object.userData?.device;
            if (dev && typeof window.openDeviceDetailModal === 'function') {
                window.openDeviceDetailModal(dev.code);
            }
        }
    }

    function animate() {
        FP3D.animId = requestAnimationFrame(animate);

        const time = performance.now() * 0.003;

        // Animasi Cincin Radar Pin
        ['ho', 'mo', 'hs'].forEach(sk => {
            const sg = FP3D.siteGroups[sk];
            if (sg && sg.visible) {
                sg.traverse(child => {
                    if (child.userData && child.userData.ring) {
                        const s = 1.0 + Math.sin(time * 3 + child.userData.baseY) * 0.25;
                        child.userData.ring.scale.set(s, s, 1);
                    }
                });
            }
        });

        // Update Jam CCTV jika aktif
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
    // 13. SINKRONISASI DENGAN NAVBAR & TAB SITE LOKASI WEBSITE T-AIMS
    // -------------------------------------------------------------------------
    function switchFloorplanDimension(dim) {
        const btn2d = document.getElementById('btn-dim-2d');
        const btn3d = document.getElementById('btn-dim-3d');
        const view2d = document.getElementById('floorplan-2d-view');
        const view3d = document.getElementById('floorplan-3d-view');

        if (dim === '3d') {
            if (btn3d) {
                btn3d.classList.add('active');
                btn3d.style.background = '#00F0FF';
                btn3d.style.color = '#000';
            }
            if (btn2d) {
                btn2d.classList.remove('active');
                btn2d.style.background = 'transparent';
                btn2d.style.color = '#94A3B8';
            }
            if (view3d) view3d.style.display = 'block';
            if (view2d) view2d.style.display = 'none';

            if (!FP3D.initialized) {
                setTimeout(init3D, 80);
            } else {
                setTimeout(onWindowResize, 100);
            }
            try { localStorage.setItem('taims_floorplan_dim', '3d'); } catch (e) { }
        } else {
            if (btn2d) {
                btn2d.classList.add('active');
                btn2d.style.background = '#00F0FF';
                btn2d.style.color = '#000';
            }
            if (btn3d) {
                btn3d.classList.remove('active');
                btn3d.style.background = 'transparent';
                btn3d.style.color = '#94A3B8';
            }
            if (view2d) view2d.style.display = 'block';
            if (view3d) view3d.style.display = 'none';
            try { localStorage.setItem('taims_floorplan_dim', '2d'); } catch (e) { }
        }
    }

    // Hook ke showBlueprintSite agar saat tab HO / MO / Mentor diklik, gedung 3D otomatis berubah
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
                const saved = localStorage.getItem('taims_floorplan_dim') || '2d';
                switchFloorplanDimension(saved);
            }
        };
    }, 120);

    // Otomatis cek preferensi saat load
    document.addEventListener('DOMContentLoaded', () => {
        const saved = localStorage.getItem('taims_floorplan_dim');
        if (saved === '3d') switchFloorplanDimension('3d');
    });

    // -------------------------------------------------------------------------
    // EKSPOR GLOBAL KE WINDOW
    // -------------------------------------------------------------------------
    window.switchFloorplanDimension = switchFloorplanDimension;
    window.toggleRoofXRay = toggleRoofXRay;
    window.toggleNightMode = toggleNightMode;
    window.toggleAutoRotate = toggleAutoRotate;
    window.toggleIoTPins = toggleIoTPins;
    window.setCameraView3D = setCameraView;
    window.focusDevice3D = focusDevice;
    window.toggleDeviceAccordion3D = toggleDeviceAccordion;
    window.openCompareModal3D = openCompareModal;
    window.closeCompareModal3D = closeCompareModal;
    window.switchSite3D = switchSite;
    window.initFloorplan3D = init3D;

})();
