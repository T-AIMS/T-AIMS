**[LAPORAN DATA FLOW DIAGRAM]{.mark}**

**[T-AIMS: Teknolab Asset & Infrastructure Monitoring System]{.mark}**

  ----------------------------------- -----------------------------------
  **[Keterangan]{.mark}**             **[Detail]{.mark}**

  [Nomor Dokumen]{.mark}              [T-AIMS/DFD/2026/V1.0]{.mark}

  [Penyusun]{.mark}                   [Damar Munajad]{.mark}

  [Peran]{.mark}                      [Project Coordinator & System
                                      Analyst]{.mark}

  [Shift]{.mark}                      [1]{.mark}

  [Tanggal]{.mark}                    [13 Oktober 2026]{.mark}

  [Status]{.mark}                     [Final]{.mark}

  [Klasifikasi]{.mark}                [Internal --- Tim PKL &
                                      Mentor]{.mark}
  ----------------------------------- -----------------------------------

**[DOKUMEN PROYEK T-AIMS]{.mark}**

**[BAB I: PENDAHULUAN]{.mark}**

## [1.1 Tujuan Dokumen]{.mark}

[Dokumen ini menjelaskan aliran data (data flow) pada sistem T-AIMS
menggunakan pendekatan Data Flow Diagram (DFD) dua level: DFD Level 0
(Context Diagram) dan DFD Level 1 (Proses Utama).]{.mark}

## [1.2 Ruang Lingkup]{.mark}

[DFD mencakup 5 entitas eksternal, 5 proses utama, dan 8 data store
sesuai modul database minimum pada dokumen proyek T-AIMS.]{.mark}

## [1.3 Notasi DFD]{.mark}

- [Kotak / Rectangle: Entitas eksternal]{.mark}

- [Rounded Rectangle: Proses]{.mark}

- [Open Rectangle: Data store]{.mark}

- [Panah: Aliran data]{.mark}

# [BAB II: DFD LEVEL 0 (CONTEXT DIAGRAM)]{.mark}

## [2.1 Gambaran Umum]{.mark}

[DFD Level 0 memandang T-AIMS sebagai satu kesatuan sistem yang
berinteraksi dengan 5 entitas eksternal. Diagram ini memberikan gambaran
batasan sistem (system boundary).]{.mark}

## [2.2 Entitas Eksternal]{.mark}

  ----------------------- ----------------------- ------------------------
  **[No.]{.mark}**        **[Entitas]{.mark}**    **[Interaksi]{.mark}**

  [1]{.mark}              [User / Operator IT     [Login, CRUD aset,
                          (Admin, Viewer)]{.mark} konfigurasi
                                                  threshold]{.mark}

  [2]{.mark}              [Perangkat              [Response probe,
                          Infrastruktur (Server,  status]{.mark}
                          RPi, MikroTik, Switch,  
                          AP, CCTV, TV,           
                          PC)]{.mark}             

  [3]{.mark}              [Node IoT Embedded      [Heartbeat JSON
                          (ESP32, Raspberry       periodik]{.mark}
                          Pi)]{.mark}             

  [4]{.mark}              [n8n Automation &       [Webhook, analisis
                          AI]{.mark}              AI]{.mark}

  [5]{.mark}              [Admin / Tim IT]{.mark} [Menerima alert
                                                  Telegram/Email]{.mark}
  ----------------------- ----------------------- ------------------------

## [2.3 Diagram DFD Level 0]{.mark}

![](./gambar/media/image1.png){width="6.531944444444444in"
height="4.083333333333333in"}

*[Gambar 2.1 --- DFD Level 0 (Context Diagram) T-AIMS]{.mark}*

## [2.4 Penjelasan Alur]{.mark}

1.  [User login dan mengelola data aset melalui Web Dashboard.]{.mark}

2.  [T-AIMS melakukan probe ke perangkat infrastruktur menggunakan ICMP
    Ping, HTTP Health Check, atau SNMP Polling.]{.mark}

3.  [Perangkat merespons dengan status dan metrics (response time,
    packet loss, OID).]{.mark}

4.  [Node IoT (ESP32/RPi) mengirim heartbeat JSON berkala melalui
    MQTT/HTTP.]{.mark}

5.  [Saat terdeteksi insiden, T-AIMS mengirim webhook ke n8n.]{.mark}

6.  [n8n memproses analisis AI dan meneruskan alert ke Admin melalui
    Telegram/Email.]{.mark}

# [BAB III: DFD LEVEL 1 (PROSES UTAMA)]{.mark}

## [3.1 Gambaran Umum]{.mark}

[DFD Level 1 memecah sistem T-AIMS menjadi 5 proses utama yang saling
terhubung melalui 8 data store.]{.mark}

## [3.2 Daftar Proses]{.mark}

  ----------------------- ----------------------- -----------------------
  **[Kode]{.mark}**       **[Nama                 **[PIC]{.mark}**
                          Proses]{.mark}**        

  [1.0]{.mark}            [Manajemen Aset &       [Reza F + Faida]{.mark}
                          Otentikasi]{.mark}      

  [2.0]{.mark}            [Monitoring Engine      [Ananda]{.mark}
                          (Polling)]{.mark}       

  [3.0]{.mark}            [Ingestion Heartbeat    [Ilvina]{.mark}
                          IoT]{.mark}             

  [4.0]{.mark}            [Penanganan Insiden &   [Arik + Reza]{.mark}
                          Notifikasi]{.mark}      

  [5.0]{.mark}            [Agregasi Dashboard,    [Dika + Arik]{.mark}
                          Reporting & AI]{.mark}  
  ----------------------- ----------------------- -----------------------

## [3.3 Daftar Data Store]{.mark}

  ----------------------- -------------------------- -----------------------
  **[Kode]{.mark}**       **[Nama Tabel]{.mark}**    **[Fungsi]{.mark}**

  [D1]{.mark}             [assets]{.mark}            [Master data aset dan
                                                     status]{.mark}

  [D2]{.mark}             [monitoring_logs]{.mark}   [Log historis
                                                     monitoring]{.mark}

  [D3]{.mark}             [incidents]{.mark}         [Riwayat insiden dan
                                                     recovery]{.mark}

  [D4]{.mark}             [locations]{.mark}         [Data zonasi dan
                                                     floorplan]{.mark}

  [D5]{.mark}             [users]{.mark}             [Kredensial dan RBAC
                                                     role]{.mark}

  [D6]{.mark}             [notifications]{.mark}     [Log notifikasi
                                                     terkirim]{.mark}

  [D7]{.mark}             [maintenance]{.mark}       [Jadwal dan riwayat
                                                     pemeliharaan]{.mark}

  [D8]{.mark}             [audit_trail]{.mark}       [Audit aktivitas
                                                     perubahan data]{.mark}
  ----------------------- -------------------------- -----------------------

## [3.4 Diagram DFD Level 1]{.mark}

![](./gambar/media/image2.png){width="6.531944444444444in"
height="4.097222222222222in"}

[*Gambar 3.1 --- DFD Level 1 T-AIMS*3.\
\
**5 Penjelasan Alur Data**]{.mark}

### [Proses 1.0: Manajemen Aset & Otentikasi]{.mark}

- [Input: Login credentials, data aset, konfigurasi threshold]{.mark}

- [Proses: Verifikasi JWT, validasi input, CRUD aset]{.mark}

- [Output: Token JWT, data aset, audit log]{.mark}

- [Data store: D1 (assets), D4 (locations), D5 (users), D8
  (audit_trail)]{.mark}

### [Proses 2.0: Monitoring Engine (Polling)]{.mark}

- [Input: Daftar aset (D1), konfigurasi polling]{.mark}

- [Proses: ICMP Ping, HTTP Health Check, SNMP Polling, TCP Port Check,
  retry 3 kali, timeout 5 detik]{.mark}

- [Output: Status online/offline/warning, log monitoring]{.mark}

- [Data store: D2 (monitoring_logs), pembaruan D1 (assets)]{.mark}

### [Proses 3.0: Ingestion Heartbeat IoT]{.mark}

- [Input: Heartbeat JSON dari ESP32/RPi]{.mark}

- [Proses: Parse payload, verifikasi device_id, watchdog timeout lebih
  dari 120 detik]{.mark}

- [Output: Pembaruan last_seen, deteksi offline]{.mark}

- [Data store: Pembaruan D1 (assets.last_seen)]{.mark}

### [Proses 4.0: Penanganan Insiden & Notifikasi]{.mark}

- [Input: Perubahan status dari Proses 2.0 dan 3.0]{.mark}

- [Proses: Deteksi insiden, cooldown 10 menit, trigger webhook ke
  n8n]{.mark}

- [Output: Insiden tercatat, notifikasi terkirim, alert
  Telegram/Email]{.mark}

- [Data store: D3 (incidents), D6 (notifications), D8
  (audit_trail)]{.mark}

### [Proses 5.0: Agregasi Dashboard, Reporting & AI]{.mark}

- [Input: Data historis dari D1, D2, D3, D7]{.mark}

- [Proses: Hitung uptime/downtime, generate laporan, top issues, feed
  AI]{.mark}

- [Output: Dashboard, laporan CSV/PDF, AI report]{.mark}

- [Akses data store: Membaca D1, D2, D3, D7]{.mark}

- [Pengiriman: n8n meneruskan laporan/alert ke Telegram Admin]{.mark}

# [BAB IV: BUKTI / EVIDENCE]{.mark}

  ----------------------------------- -----------------------------------
  **[Item]{.mark}**                   **[Link / File]{.mark}**

  [File Dokumen]{.mark}               [Data-Flow.docx]{.mark}

  [DFD Level 0]{.mark}                [dfd-level-0.png]{.mark}

  [DFD Level 1]{.mark}                [dfd-level-1.png]{.mark}

  [Commit Git]{.mark}                 [\[Tautan commit ditambahkan
                                      kemudian\]]{.mark}

  [Tanggal]{.mark}                    [13 Oktober 2026]{.mark}
  ----------------------------------- -----------------------------------
