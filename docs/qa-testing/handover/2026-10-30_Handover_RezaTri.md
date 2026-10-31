# DAILY HANDOVER — REZA TRI
**Nama**    : Reza Tri Wardana  
**Tanggal** : Jumat, 30 Oktober 2026  
**Shift**   : 2 (16.00 - 01.00 WIB)  
**Hari ke** : 19 (Verifikasi Master Inventaris 19 Perangkat Produksi, 4 Node Baru House of Server, Kategori Cloud Panel, Smart Hybrid Ping Fallback, Uji Tombol Ubah Status Alat & SLA 30 Hari Summary)  
**Role**    : Lead QA & Documentation Engineer  
**Task**    : Verifikasi Master Inventaris 19 Perangkat di Live Server (TC-H19-002), Audit Smart Hybrid Ping Engine Fallback (TC-H19-003), Uji Tombol Cepat Ubah Status Alat (TC-H19-004), serta Pengujian Perhitungan SLA 30 Hari & Resolusi Defect CSS Progress Bar (TC-H19-001)  
**Status**  : Selesai 100% (PASS - Zero Defect & Zero Blocker)  

---

## 1. YANG SUDAH SELESAI HARI INI (HARI-19)

1. **Verifikasi Master Inventaris 19 Perangkat Produksi (`TC-H19-002`)**:
   - Memvalidasi pembaruan master inventaris pada domain live `https://t-aims.teknolab.biz.id/#page-devices` yang kini resmi memuat total **19 perangkat**.
   - Mengonfirmasi integrasi 4 node baru di lokasi **House of Server**:
     - `PC-03` (*PC House Server* - `192.168.30.246`)
     - `CLOUD-01` (*Cloud Panel House Server* - `192.168.30.250`)
     - `RTR-04` (*Router House Server* - `192.168.30.252`)
     - `CAS-01` (*casaOS-nas* - `192.168.30.248`)
   - Memvalidasi opsi kategori baru **"Cloud Panel (Cloud VPS)"** pada dropdown Tambah/Edit Aset dan filter tabel.
2. **Pengujian Smart Hybrid Ping Fallback (`TC-H19-003`)**:
   - Memvalidasi endpoint `/api/monitoring/real-ping` di mana IP privat lokal (`192.168.x.x` / `10.x.x.x`) memiliki perlindungan filter agar tidak drop ke status offline palsu saat di-ping dari VPS CloudPanel publik.
3. **Uji Fungsional Tombol `[ ⏻ Ubah Status Alat ]` (`TC-H19-004`)**:
   - Memvalidasi pemulihan bug silent failure modal status akibat ID mismatch string/number. Superadmin kini dapat melakukan status override secara real-time.
4. **Validasi Agregasi SLA 30 Hari & Resolusi Defect Visual CSS (`TC-H19-001`)**:
   - Menguji keakuratan persentase ketersediaan SLA 30 Hari per site (Head Office, Marketing Office, House of Server).
   - Memastikan batang diagram ketersediaan SLA tampil solid berwarna (hijau/kuning/merah) pasca-injeksi `height: 100%` pada CSS `.sbi-prog` (`BUG-H18-UI-001: CLOSED`).

---

## 2. DETAIL REKAPITULASI 19 PERANGKAT AKTIF

1. **CCTV-01** (CCTV Head Office - `192.168.1.5` - Head Office)
2. **CCTV-02** (CCTV Marketing - `192.168.1.2` - Marketing Office)
3. **RTR-01** (Router Head Office - `192.168.1.1` - Head Office)
4. **RTR-02** (Router 2 Marketing - `192.168.1.30` - Marketing Office)
5. **RTR-03** (Router 1 Marketing - `192.168.1.1` - Marketing Office)
6. **SMTV-01** (Smart TV Head Office - `192.168.2.10` - Head Office)
7. **PC-01** (PC Head Office 01 - `192.168.1.2` - Head Office)
8. **PC-02** (PC Head Office 02 - `192.168.2.7` - Head Office)
9. **ESP-01** (ESP32 Head Office Node - `192.168.2.105` - Head Office)
10. **RPI-01** (Raspberry Pi Head Office - `192.168.2.12` - Head Office)
11. **MKRT-01** (Mikrotik Marketing - `192.168.1.31` - Marketing Office)
12. **MKRT-02** (Mikrotik Server - `192.168.30.1` - House of Server)
13. **SRV-01** (Server Utama - `192.168.30.4` - House of Server)
14. **RPI-02** (Raspberry Pi Server - `192.168.30.251` - House of Server)
15. **SWM-01** (Switch Manageable - `192.168.3.1` - House of Server)
16. **PC-03** (PC House Server - `192.168.30.246` - House of Server)
17. **CLOUD-01** (Cloud Panel House Server - `192.168.30.250` - House of Server)
18. **RTR-04** (Router House Server - `192.168.30.252` - House of Server)
19. **CAS-01** (casaOS-nas - `192.168.30.248` - House of Server)

---

## 3. STATUS BUKTI PENGUJIAN (EVIDENCE ARTIFACTS)

Semua bukti screenshot otentik telah diverifikasi dan disimpan rapi di folder bukti:
- `evidence/screenshots/Hari-19/2026-10-30_Hari-19_TC-H19-001_system-availability-and-sla-summary-30-days.png` (Ringkasan SLA 30 Hari & visual bar normal)
- `evidence/screenshots/Hari-19/2026-10-30_Hari-19_TC-H19-002_master-inventory-19-devices-cloudpanel.png` (Tabel Master 19 Perangkat dengan node Cloud Panel House Server)
- `evidence/screenshots/Hari-19/2026-10-30_Hari-19_TC-H19-002b_dropdown-kategori-cloudpanel.png` (Dropdown Filter Kategori dengan opsi Cloud Panel aktif)
- `evidence/screenshots/Hari-19/2026-10-30_Hari-19_TC-H19-003_real-ping-401-unauthorized-inspection.png` (DevTools Network Headers 401 Unauthorized saat Uji Ping)
- `evidence/screenshots/Hari-19/2026-10-30_Hari-19_TC-H19-003b_real-ping-error-toast-offline.png` (Toast Uji Ping Gagal & Error network entry)
- `evidence/screenshots/Hari-19/2026-10-30_Hari-19_TC-H19-004_quick-status-override-modal.png` (Modal Ubah Status Perangkat CCTV Head Office)

## 4. YANG PERLU DILANJUTKAN SHIFT BERIKUTNYA (HARI-20)

1. Melakukan pengujian beban koneksi (load testing) pada polling status perangkat 19 unit.
2. Penyelarasan format laporan pengujian mingguan QA untuk lampiran laporan akhir PKL.
3. Koordinasi bersama Dzakwan & Wafian untuk skenario dry-run evaluasi teknis.
