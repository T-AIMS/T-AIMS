# T-AIMS | Network Topology & Root Cause Analysis (RCA)
**PT Teknolab Caraka Internasional • Enterprise Monitoring System**  
*Dokumentasi Arsitektur Standar SRE & AIOps (Checklist Hari 21)*

---

## 1. Topologi Jaringan & Pohon Dependensi (Parent-Child Hierarchy)

Sistem T-AIMS membagi infrastruktur ke dalam hierarki pohon dependensi untuk mencegah fenomena **Alert Storm (Banjir Notifikasi)**:

```mermaid
graph TD
    ISP["Internet Gateway (Fiber Uplink)"] --> MKRT_01["MKRT-01 (Core Router House Server)"]
    MKRT_01 --> SWM_01["SWM-01 (Core Switch Manageable Rack B)"]
    
    %% Downstream Group 1: Server Cluster
    SWM_01 --> SRV_01["SRV-01 (Database & API Server)"]
    SWM_01 --> SRV_02["SRV-02 (Storage Backup NAS)"]
    
    %% Downstream Group 2: Head Office Access
    SWM_01 --> MKRT_02["MKRT-02 (Router Head Office)"]
    MKRT_02 --> AP_01["AP-01 (Wi-Fi Access Point HO)"]
    MKRT_02 --> PC_01["PC-01 (Workstation Lead)"]
    MKRT_02 --> PC_02["PC-02 (Workstation Operator)"]
    MKRT_02 --> CAM_01["CAM-01 (CCTV Lobby Utama)"]
    MKRT_02 --> CAM_02["CAM-02 (CCTV Corridor)"]
    
    %% Downstream Group 3: IoT Solar Array
    AP_01 -.->|Wi-Fi 2.4GHz| ESP_01["ESP-01 (IoT Node Solar Telemetry)"]
    AP_01 -.->|Wi-Fi 2.4GHz| ESP_02["ESP-02 (IoT Relai Catu Daya)"]
```

---

## 2. Logika Pencegahan Alert Storm (Cascade Downstream Suppression)

Jika perangkat **Parent Link** (seperti `SWM-01` atau `MKRT-01`) terdeteksi putus (`OFFLINE`):
1. **Root Cause Isolation:** Daemon background mengidentifikasi bahwa induk jalur transmisi sedang mati.
2. **Cascade Tagging:** Perangkat turunan (*downstream*) seperti CCTV, PC, dan Access Point diberi label `[CASCADE DOWNSTREAM]` secara otomatis.
3. **Agregasi Notifikasi:** Bot Telegram dan Email Alert menyajikan 1 ringkasan utama bahwa insiden berpusat pada Core Switch, bukan 10 perangkat independen yang mati bersamaan.
4. **Hasil:** Teknisi NOC tidak mengalami *alert fatigue* dan langsung fokus pada perbaikan catu daya/kabel uplink `SWM-01`.
