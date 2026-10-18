/**
 * =========================================================================
 * T-AIMS 3D ARCHITECTURAL WEBGL VIEWER (THREE.JS + ORBITCONTROLS)
 * =========================================================================
 * - Rotasi 360 Derajat Bebas (Mouse Drag / Touch) & Auto-Rotate
 * - Fitur Lepas Atap (Roof Lift-Off Cutaway) untuk melihat perangkat di dalam
 * - Tampak Atas (Top-Down 90°) & Perspektif 3D Isometrik
 * - Representasi Akurat Head Office Jl. Cibodas No. 03 (Vario, Supra, Plang Teknolab)
 * =========================================================================
 */

let scene, camera, renderer, controls;
let containerEl, tooltipEl;
let buildingGroup, roofGroup;
let isRoofRemoved = false;
let autoRotateActive = true;
let animFrameId = null;
let currentSite3D = 'HO';
let targetRoofY = 0;
let currentRoofY = 0;
const interactiveObjects = [];

function initThreeJsFloorplan() {
  containerEl = document.getElementById('threeJsCanvasContainer');
  tooltipEl = document.getElementById('threeJsTooltip');
  if (!containerEl) return;

  // Hentikan loop animasi lama jika ada
  if (animFrameId) cancelAnimationFrame(animFrameId);
  containerEl.innerHTML = '';

  const width = containerEl.clientWidth || 920;
  const height = containerEl.clientHeight || 580;

  // 1. SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070B14);
  scene.fog = new THREE.FogExp2(0x070B14, 0.015);

  // 2. CAMERA
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(24, 22, 28);

  // 3. RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  containerEl.appendChild(renderer.domElement);

  // 4. ORBITCONTROLS (360 DERAJAT ROTASI & ZOOM)
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = autoRotateActive;
  controls.autoRotateSpeed = 1.2;
  controls.maxPolarAngle = Math.PI / 2 + 0.05; // Tidak menembus lantai
  controls.minDistance = 10;
  controls.maxDistance = 65;
  controls.target.set(0, 1.5, 0);

  // 5. LIGHTING
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.1);
  sunLight.position.set(30, 45, 25);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 100;
  const d = 25;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
  fillLight.position.set(-25, 20, -20);
  scene.add(fillLight);

  // 6. BUILD SELECTED SITE (HO, MO, HOS)
  build3DSite(currentSite3D);

  // 7. EVENTS & RESIZE
  window.addEventListener('resize', onThreeJsWindowResize);
  setupRaycasterEvents();

  // 8. ANIMATION LOOP
  animate();
}

function onThreeJsWindowResize() {
  if (!containerEl || !renderer || !camera) return;
  const w = containerEl.clientWidth;
  const h = containerEl.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

// =========================================================================
// BUILDER 3D ARSITEKTUR REALISTIS
// =========================================================================
function build3DSite(siteKey) {
  // Bersihkan objek gedung sebelumnya
  if (buildingGroup) scene.remove(buildingGroup);
  interactiveObjects.length = 0;

  buildingGroup = new THREE.Group();
  roofGroup = new THREE.Group();
  scene.add(buildingGroup);
  buildingGroup.add(roofGroup);

  if (siteKey === 'HO') {
    buildHeadOffice3D();
  } else if (siteKey === 'MO') {
    buildMarketingOffice3D();
  } else {
    buildHouseOfServer3D();
  }

  // Terapkan status awal atap (Lepas / Pasang)
  targetRoofY = isRoofRemoved ? 16 : 0;
  currentRoofY = targetRoofY;
  roofGroup.position.y = currentRoofY;
  roofGroup.visible = !isRoofRemoved;
}

// -------------------------------------------------------------------------
// 1. HEAD OFFICE (HO - JL. CIBODAS NO. 03)
// -------------------------------------------------------------------------
function buildHeadOffice3D() {
  const materials = {
    ground: new THREE.MeshStandardMaterial({ color: 0x090D16, roughness: 0.9 }),
    road: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.85 }),
    roadStripe: new THREE.MeshBasicMaterial({ color: 0xFDE047 }),
    foundation: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.7 }),
    wallExt: new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.5 }),
    wallInt: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.6 }),
    boundaryWall: new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.4 }),
    carportFloor: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 }),
    woodFloor: new THREE.MeshStandardMaterial({ color: 0xB47A46, roughness: 0.6 }),
    serverFloor: new THREE.MeshStandardMaterial({ color: 0x0B132B, roughness: 0.3, metalness: 0.3 }),
    labFloor: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.6 }),
    roofTile: new THREE.MeshStandardMaterial({ color: 0x991B1B, roughness: 0.45 }),
    roofRidge: new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.5 }),
    canopyGlass: new THREE.MeshPhysicalMaterial({ color: 0x38BDF8, transmission: 0.8, opacity: 0.7, transparent: true, roughness: 0.2 }),
    metalPole: new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.8, roughness: 0.2 }),
    rackBody: new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.3, metalness: 0.8 }),
    deskTop: new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 }),
    screenGlow: new THREE.MeshBasicMaterial({ color: 0x38BDF8 }),
    esdMat: new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.5 }),
    bikeBlack: new THREE.MeshStandardMaterial({ color: 0x18181B, roughness: 0.3, metalness: 0.5 }),
    bikeRed: new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.3, metalness: 0.4 }),
    rubberTire: new THREE.MeshStandardMaterial({ color: 0x0A0A0A, roughness: 0.9 })
  };

  // 1. GROUND BASE & ROAD
  const groundGeo = new THREE.BoxGeometry(46, 0.4, 38);
  const groundMesh = new THREE.Mesh(groundGeo, materials.ground);
  groundMesh.position.y = -0.2;
  groundMesh.receiveShadow = true;
  buildingGroup.add(groundMesh);

  // Front Road (Jl. Cibodas No. 03)
  const roadGeo = new THREE.BoxGeometry(45, 0.1, 7);
  const roadMesh = new THREE.Mesh(roadGeo, materials.road);
  roadMesh.position.set(0, 0.05, 14.5);
  roadMesh.receiveShadow = true;
  buildingGroup.add(roadMesh);

  // Yellow Road Markings
  for (let x = -20; x <= 20; x += 4) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.3), materials.roadStripe);
    stripe.position.set(x, 0.06, 14.5);
    buildingGroup.add(stripe);
  }

  // 2. RIGHT BOUNDARY WALL & SIGNBOARD
  const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.8, 12), materials.boundaryWall);
  wallRight.position.set(13.5, 0.9, 8);
  wallRight.castShadow = true;
  wallRight.receiveShadow = true;
  buildingGroup.add(wallRight);

  // Plang Resmi Tegak PT TEKNOLAB CARAKA INTERNASIONAL
  const signPost1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16), materials.metalPole);
  signPost1.position.set(13.5, 1.4, 11);
  const signPost2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.8, 16), materials.metalPole);
  signPost2.position.set(13.5, 1.4, 12.8);
  buildingGroup.add(signPost1, signPost2);

  // Signboard Board Face (With Canvas Texture)
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 256;
  const ctx = signCanvas.getContext('2d');
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 502, 246);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TEKNOLAB HOLDING COMPANY', 256, 55);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 32px sans-serif';
  ctx.fillText('PT TEKNOLAB', 256, 115);
  ctx.fillText('CARAKA INTERNASIONAL', 256, 160);

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('HEAD OFFICE · BLITAR', 256, 215);

  const signTexture = new THREE.CanvasTexture(signCanvas);
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.4, 2.4),
    new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.3 })
  );
  signBoard.position.set(13.5, 2.1, 11.9);
  signBoard.rotation.y = Math.PI / 2;
  signBoard.castShadow = true;
  buildingGroup.add(signBoard);

  // 3. CARPORT AREA & PARKIR MOTOR (PERSIS FOTO: VARIO & SUPRA)
  const carportMesh = new THREE.Mesh(new THREE.BoxGeometry(18, 0.1, 8.5), materials.carportFloor);
  carportMesh.position.set(1.5, 0.05, 6.75);
  carportMesh.receiveShadow = true;
  buildingGroup.add(carportMesh);

  // 4 Steel Canopy Pillars
  const cpPillar1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.4, 0.25), materials.metalPole);
  cpPillar1.position.set(-7, 1.7, 10.8);
  const cpPillar2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.4, 0.25), materials.metalPole);
  cpPillar2.position.set(10, 1.7, 10.8);
  const cpPillar3 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.4, 0.25), materials.metalPole);
  cpPillar3.position.set(-7, 1.7, 3);
  const cpPillar4 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 3.4, 0.25), materials.metalPole);
  cpPillar4.position.set(10, 1.7, 3);
  buildingGroup.add(cpPillar1, cpPillar2, cpPillar3, cpPillar4);

  // MOTOR 1: HONDA VARIO 160 (MATTE BLACK)
  const varioGroup = new THREE.Group();
  varioGroup.position.set(-2, 0, 7.5);
  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.25, 24);
  wheelGeo.rotateZ(Math.PI / 2);
  const varioWheelF = new THREE.Mesh(wheelGeo, materials.rubberTire);
  varioWheelF.position.set(0, 0.42, 1.3);
  const varioWheelR = new THREE.Mesh(wheelGeo, materials.rubberTire);
  varioWheelR.position.set(0, 0.42, -0.6);
  // Bodywork
  const varioBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.7, 1.7), materials.bikeBlack);
  varioBody.position.set(0, 0.75, 0.3);
  // Cowl & Headlights
  const varioHead = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.6), materials.bikeBlack);
  varioHead.position.set(0, 1.05, 1.0);
  const varioLight = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.1, 0.1), materials.screenGlow);
  varioLight.position.set(0, 0.95, 1.32);
  // Handlebars
  const varioBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 12), materials.metalPole);
  varioBar.rotation.z = Math.PI / 2;
  varioBar.position.set(0, 1.25, 0.85);
  varioGroup.add(varioWheelF, varioWheelR, varioBody, varioHead, varioLight, varioBar);
  varioGroup.castShadow = true;
  buildingGroup.add(varioGroup);

  // MOTOR 2: HONDA SUPRA X (BLACK/RED)
  const supraGroup = new THREE.Group();
  supraGroup.position.set(2, 0, 7.5);
  const supraWheelF = new THREE.Mesh(wheelGeo, materials.rubberTire);
  supraWheelF.position.set(0, 0.42, 1.3);
  const supraWheelR = new THREE.Mesh(wheelGeo, materials.rubberTire);
  supraWheelR.position.set(0, 0.42, -0.6);
  const supraBody = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 1.7), materials.bikeRed);
  supraBody.position.set(0, 0.72, 0.3);
  const supraHead = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.35, 0.5), materials.bikeBlack);
  supraHead.position.set(0, 1.05, 0.95);
  const supraBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.05, 12), materials.metalPole);
  supraBar.rotation.z = Math.PI / 2;
  supraBar.position.set(0, 1.22, 0.82);
  supraGroup.add(supraWheelF, supraWheelR, supraBody, supraHead, supraBar);
  supraGroup.castShadow = true;
  buildingGroup.add(supraGroup);

  // 4. HOUSE MAIN FOUNDATION SLAB & FLOORS
  const housePlinth = new THREE.Mesh(new THREE.BoxGeometry(23.5, 0.2, 12.5), materials.foundation);
  housePlinth.position.set(0.5, 0.1, -3.25);
  housePlinth.receiveShadow = true;
  buildingGroup.add(housePlinth);

  // Room Floors:
  // Ruang Kerja Tim (Wood Parquet)
  const floorWork = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.05, 6), materials.woodFloor);
  floorWork.position.set(1.5, 0.22, 0);
  buildingGroup.add(floorWork);

  // Ruang Server & NOC (Dark Raised Grid)
  const floorServer = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.05, 6), materials.serverFloor);
  floorServer.position.set(1.5, 0.22, -6.2);
  buildingGroup.add(floorServer);

  // Lab IoT (Slate Floor)
  const floorLab = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.05, 12.2), materials.labFloor);
  floorLab.position.set(-7.5, 0.22, -3.1);
  buildingGroup.add(floorLab);

  // Ruang Logistik & Pantry
  const floorLogistik = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.05, 12.2), materials.foundation);
  floorLogistik.position.set(10.5, 0.22, -3.1);
  buildingGroup.add(floorLogistik);

  // 5. EXTERIOR WALLS & INTERIOR PARTITIONS (CUTAWAY ARCHITECTURE)
  const wallH = 2.8;
  const wallThick = 0.35;

  function createWall(w, d, x, z) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, wallH, d), materials.wallInt);
    mesh.position.set(x, wallH / 2 + 0.2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    buildingGroup.add(mesh);
    return mesh;
  }

  // Exterior Walls
  createWall(23.5, wallThick, 0.5, -9.5); // Back wall (North)
  createWall(wallThick, 12.5, -11.2, -3.25); // West wall
  createWall(wallThick, 12.5, 12.2, -3.25); // East wall

  // Front Wall (with door & window openings)
  createWall(6.5, wallThick, -7.5, 3.0); // Front West
  createWall(4.0, wallThick, 10.0, 3.0); // Front East
  createWall(4.5, wallThick, 4.0, 3.0); // Front Window partition

  // Wooden Door (Pintu Masuk HO)
  const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.5 }));
  doorMesh.position.set(-3.2, 1.4, 3.0);
  doorMesh.rotation.y = 0.4; // Slightly open
  buildingGroup.add(doorMesh);

  // 3-Panel Window with White Security Bars & Teknolab Logo Stickers
  const winGroup = new THREE.Group();
  winGroup.position.set(0.5, 1.5, 3.0);
  const winFrame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.15), new THREE.MeshStandardMaterial({ color: 0x78350F }));
  const winGlass = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 0.08), materials.screenGlow);
  winGroup.add(winFrame, winGlass);
  // Round Yellow & Blue Stickers
  const stickerY = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), new THREE.MeshBasicMaterial({ color: 0xFACC15 }));
  stickerY.rotation.x = Math.PI / 2;
  stickerY.position.set(-0.35, 0, 0.06);
  const stickerB = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), new THREE.MeshBasicMaterial({ color: 0x38BDF8 }));
  stickerB.rotation.x = Math.PI / 2;
  stickerB.position.set(0.35, 0, 0.06);
  winGroup.add(stickerY, stickerB);
  buildingGroup.add(winGroup);

  // Interior Dividing Walls
  createWall(wallThick, 12.5, -4.5, -3.25); // Separates Lab IoT
  createWall(wallThick, 12.5, 7.0, -3.25); // Separates Gudang
  createWall(11.5, wallThick, 1.25, -3.2); // Separates Ruang Kerja & Ruang Server

  // 6. INTERIOR FURNITURE & DEVICES
  // 🅰️ RUANG SERVER & NOC
  // 42U Server Racks
  const rack1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.0), materials.rackBody);
  rack1.position.set(-1.5, 1.45, -6.5);
  rack1.castShadow = true;
  const rack2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1.0), materials.rackBody);
  rack2.position.set(0.8, 1.45, -6.5);
  rack2.castShadow = true;
  buildingGroup.add(rack1, rack2);

  // Blinking Server LED Lights
  const serverLight = new THREE.PointLight(0x38BDF8, 1.8, 9);
  serverLight.position.set(0, 2.5, -6.0);
  buildingGroup.add(serverLight);

  // MikroTik Router & AC on Wall
  const routerMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 0.3), materials.deskTop);
  routerMesh.position.set(4.0, 2.2, -9.2);
  const acMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 0.5), new THREE.MeshStandardMaterial({ color: 0xF8FAFC }));
  acMesh.position.set(1.5, 2.5, -9.2);
  buildingGroup.add(routerMesh, acMesh);

  // 🅱️ RUANG KERJA TIM (SHIFT 1 & 2)
  // Workstation Desks (Dika, QA, Backend, IoT)
  for (let i = 0; i < 4; i++) {
    const xPos = -2.5 + i * 2.5;
    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.9, 1.0), materials.deskTop);
    desk.position.set(xPos, 0.65, 0.5);
    desk.castShadow = true;
    // Dual Curved Monitors
    const mon1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.08), materials.screenGlow);
    mon1.position.set(xPos - 0.35, 1.35, 0.35);
    mon1.rotation.y = 0.15;
    const mon2 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.08), materials.screenGlow);
    mon2.position.set(xPos + 0.35, 1.35, 0.35);
    mon2.rotation.y = -0.15;
    // Chair
    const chair = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.6, 16), materials.rackBody);
    chair.position.set(xPos, 0.5, 1.4);
    buildingGroup.add(desk, mon1, mon2, chair);
  }

  // 🅲️ LAB IOT & HARDWARE
  const labBench = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.9, 1.5), materials.deskTop);
  labBench.position.set(-7.5, 0.65, 0);
  const esdMatMesh = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.05, 1.3), materials.esdMat);
  esdMatMesh.position.set(-7.5, 1.12, 0);
  // Oscilloscope (Green Waveform Screen)
  const oscillo = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.65, 0.55), materials.rackBody);
  oscillo.position.set(-8.5, 1.5, 0);
  const oscilloScreen = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.05), new THREE.MeshBasicMaterial({ color: 0x10B981 }));
  oscilloScreen.position.set(-8.5, 1.5, 0.28);
  buildingGroup.add(labBench, esdMatMesh, oscillo, oscilloScreen);

  // 🅳️ GUDANG LOGISTIK
  for (let z = -8; z <= -3; z += 2.4) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.5, 0.8), materials.metalPole);
    shelf.position.set(10.0, 1.45, z);
    buildingGroup.add(shelf);
  }

  // 7. ROOF ASSEMBLY (BISA DILEPAS / DIANGKAT MELALUI TOGGLE ATAP)
  buildHeadOfficeRoof(materials);

  // 8. 3D PINS & LABELS DI ATAS GEDUNG
  add3DMarker("NET-SRV-01", "Server T-AIMS", 0, 3.8, -6.5, "online");
  add3DMarker("IOT-ESP-01", "Lab IoT ESP32", -7.5, 3.5, 0, "online");
  add3DMarker("PC-WS-01", "Workstation Dika", -2.5, 3.5, 0.8, "online");
  add3DMarker("NET-RTR-01", "MikroTik RB4011", 4.0, 3.8, -8.8, "online");
  add3DMarker("PARKIR-MOTOR", "Honda Vario & Supra", 0, 2.5, 8.5, "online");
}

// -------------------------------------------------------------------------
// ATAP 3D RUMAH ASLI (ROOF ON/OFF)
// -------------------------------------------------------------------------
function buildHeadOfficeRoof(materials) {
  // Atap Utama Genteng Merah Bata (Terracotta Hip Roof)
  const roofMainGeo = new THREE.ConeGeometry(15.5, 3.8, 4);
  roofMainGeo.rotateY(Math.PI / 4);
  roofMainGeo.scale(1.2, 1.0, 0.8);
  const roofMainMesh = new THREE.Mesh(roofMainGeo, materials.roofTile);
  roofMainMesh.position.set(0.5, 4.9, -3.25);
  roofMainMesh.castShadow = true;
  roofGroup.add(roofMainMesh);

  // Nok Bubungan Genteng
  const ridgeMesh = new THREE.Mesh(new THREE.BoxGeometry(10, 0.35, 0.5), materials.roofRidge);
  ridgeMesh.position.set(0.5, 6.7, -3.25);
  roofGroup.add(ridgeMesh);

  // Kanopi Carport Depan
  const canopyMesh = new THREE.Mesh(new THREE.BoxGeometry(17.5, 0.15, 8.2), materials.canopyGlass);
  canopyMesh.position.set(1.5, 3.4, 6.8);
  canopyMesh.rotation.x = -0.06; // Miring air hujan
  roofGroup.add(canopyMesh);
}

// -------------------------------------------------------------------------
// 2. MARKETING OFFICE (MO) & 3. HOUSE OF SERVER (HoS)
// -------------------------------------------------------------------------
function buildMarketingOffice3D() {
  const materials = {
    ground: new THREE.MeshStandardMaterial({ color: 0x090D16 }),
    wall: new THREE.MeshStandardMaterial({ color: 0x475569 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x7C3AED }),
    desk: new THREE.MeshStandardMaterial({ color: 0x1E293B }),
    screen: new THREE.MeshBasicMaterial({ color: 0xA78BFA })
  };
  const bldg = new THREE.Mesh(new THREE.BoxGeometry(18, 3.0, 14), materials.wall);
  bldg.position.set(0, 1.5, 0);
  buildingGroup.add(bldg);

  // Studio desk & broadcast camera
  const studioDesk = new THREE.Mesh(new THREE.BoxGeometry(6, 0.9, 2), materials.desk);
  studioDesk.position.set(0, 0.65, -2);
  buildingGroup.add(studioDesk);

  // Roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(14, 3, 4), materials.roof);
  roof.rotateY(Math.PI / 4);
  roof.position.set(0, 4.5, 0);
  roofGroup.add(roof);

  add3DMarker("NET-RTR-02", "Router MO Kos Kiki", 0, 3.5, -2, "warning");
  add3DMarker("SEC-CCTV-02", "CCTV Parkir MO", 6, 3.5, 4, "online");
}

function buildHouseOfServer3D() {
  const materials = {
    wall: new THREE.MeshStandardMaterial({ color: 0x0B132B }),
    rack: new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.8 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x0891B2 }),
    screen: new THREE.MeshBasicMaterial({ color: 0x38BDF8 })
  };
  const bldg = new THREE.Mesh(new THREE.BoxGeometry(20, 3.2, 14), materials.wall);
  bldg.position.set(0, 1.6, 0);
  buildingGroup.add(bldg);

  // Multiple Server Racks Rows
  for (let x = -6; x <= 6; x += 3) {
    for (let z = -3; z <= 3; z += 3) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 1.2), materials.rack);
      rack.position.set(x, 1.5, z);
      buildingGroup.add(rack);
    }
  }

  // Industrial Roof
  const roof = new THREE.Mesh(new THREE.BoxGeometry(21, 0.6, 15), materials.roof);
  roof.position.set(0, 3.5, 0);
  roofGroup.add(roof);

  add3DMarker("HOS-SRV-01", "MySQL Datacenter", -3, 3.8, 0, "online");
  add3DMarker("HOS-UPS-01", "Industrial UPS 3kVA", 3, 3.8, 0, "online");
}

// =========================================================================
// 3D FLOATING MARKERS / PINS
// =========================================================================
function add3DMarker(code, name, x, y, z, status) {
  const markerGroup = new THREE.Group();
  markerGroup.position.set(x, y, z);

  const color = (status === 'online') ? 0x10B981 : (status === 'warning' ? 0xF59E0B : 0xEF4444);

  // Outer Pulsing Ring
  const ringGeo = new THREE.RingGeometry(0.35, 0.45, 24);
  ringGeo.rotateX(Math.PI / 2);
  const ringMesh = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide }));
  markerGroup.add(ringMesh);

  // Center Sphere
  const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const sphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.6 }));
  markerGroup.add(sphereMesh);

  // Pointer Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }));
  stem.position.y = -0.3;
  markerGroup.add(stem);

  markerGroup.userData = { code, name, status };
  buildingGroup.add(markerGroup);
  interactiveObjects.push(sphereMesh);
}

// =========================================================================
// INTERAKSI & HUD BUTTONS
// =========================================================================

// 1. LEPAS / PASANG ATAP
function toggle3DRoof() {
  isRoofRemoved = !isRoofRemoved;
  targetRoofY = isRoofRemoved ? 16 : 0;
  
  const btn = document.getElementById('btnToggleRoof');
  const lbl = document.getElementById('lblRoofStatus');

  if (isRoofRemoved) {
    if (btn) btn.classList.add('active');
    if (lbl) lbl.innerText = 'Atap Terbuka (Lihat Dalam)';
  } else {
    roofGroup.visible = true;
    if (btn) btn.classList.remove('active');
    if (lbl) lbl.innerText = 'Pasang Atap Rumah';
  }
}

// 2. PUTAR 360 DERAJAT OTOMATIS
function toggle3DAutoRotate() {
  autoRotateActive = !autoRotateActive;
  if (controls) controls.autoRotate = autoRotateActive;

  const btn = document.getElementById('btnAutoRotate');
  const lbl = document.getElementById('lblAutoRotate');

  if (autoRotateActive) {
    if (btn) btn.classList.add('active');
    if (lbl) lbl.innerText = 'Putar 360°: AKTIF';
  } else {
    if (btn) btn.classList.remove('active');
    if (lbl) lbl.innerText = 'Putar 360°: JEDA';
  }
}

// 3. SUDUT KAMERA PRESET (TAMPAK ATAS 90° & ISOMETRIK 3D)
function setCameraView(viewMode) {
  if (!camera || !controls) return;

  if (viewMode === 'top') {
    // TAMPAK ATAS 90 DERAJAT PERSIS
    animateCamera(new THREE.Vector3(0, 36, 0.01), new THREE.Vector3(0, 0, 0));
  } else if (viewMode === 'iso') {
    // PERSPEKTIF 3D ISOMETRIK SUDUT
    animateCamera(new THREE.Vector3(24, 22, 28), new THREE.Vector3(0, 1.5, 0));
  }
}

function reset3DCamera() {
  setCameraView('iso');
}

function animateCamera(targetPos, targetLookAt) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  let progress = 0;

  function step() {
    progress += 0.05;
    if (progress <= 1) {
      camera.position.lerpVectors(startPos, targetPos, progress);
      controls.target.lerpVectors(startTarget, targetLookAt, progress);
      controls.update();
      requestAnimationFrame(step);
    } else {
      camera.position.copy(targetPos);
      controls.target.copy(targetLookAt);
      controls.update();
    }
  }
  step();
}

// GANTI SITE (HO / MO / HOS) DARI TOMBOL TAB DENAH
function switch3DSite(siteKey) {
  currentSite3D = siteKey;
  build3DSite(siteKey);
}

// RAYCASTER HOVER TOOLTIP
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function setupRaycasterEvents() {
  if (!renderer) return;

  renderer.domElement.addEventListener('mousemove', (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
      const obj = intersects[0].object.parent;
      if (obj && obj.userData && tooltipEl) {
        tooltipEl.style.display = 'block';
        tooltipEl.style.left = `${e.clientX - rect.left + 15}px`;
        tooltipEl.style.top = `${e.clientY - rect.top - 20}px`;
        tooltipEl.innerHTML = `<strong>${obj.userData.code}</strong><br><small style="color:#94A3B8;">${obj.userData.name}</small><br><span style="color:#10B981; font-weight:800;">● ${obj.userData.status.toUpperCase()}</span>`;
      }
    } else {
      if (tooltipEl) tooltipEl.style.display = 'none';
    }
  });

  renderer.domElement.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);
    if (intersects.length > 0) {
      const obj = intersects[0].object.parent;
      if (obj && obj.userData && typeof openDetailModal === 'function') {
        openDetailModal(obj.userData.code);
      }
    }
  });
}

// LOOP ANIMASI FRAME
function animate() {
  animFrameId = requestAnimationFrame(animate);

  // Animasi halus mengangkat atap (Lerp Position)
  if (roofGroup) {
    currentRoofY += (targetRoofY - currentRoofY) * 0.1;
    roofGroup.position.y = currentRoofY;

    if (isRoofRemoved && currentRoofY > 15) {
      roofGroup.visible = false;
    }
  }

  // Animasi berdenyut pin perangkat
  const time = Date.now() * 0.003;
  buildingGroup.children.forEach(c => {
    if (c.userData && c.userData.code) {
      c.position.y += Math.sin(time) * 0.003;
    }
  });

  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
}

// EXPORT GLOBAL WINDOW FUNCTIONS
window.initThreeJsFloorplan = initThreeJsFloorplan;
window.toggle3DRoof = toggle3DRoof;
window.toggle3DAutoRotate = toggle3DAutoRotate;
window.setCameraView = setCameraView;
window.reset3DCamera = reset3DCamera;
window.switch3DSite = switch3DSite;
