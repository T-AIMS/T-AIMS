**T-AIMS --- Teknolab Asset & Infrastructure Monitoring System**

## INFORMASI DOKUMEN

  -----------------------------------------------------------------------
  **Atribut**                         **Keterangan**
  ----------------------------------- -----------------------------------
  **Nomor Dokumen**                   T-AIMS/IC/2026/V1.0

  **Nama Proyek**                     T-AIMS (Teknolab Asset &
                                      Infrastructure Monitoring System)

  **Instansi**                        PT Teknolab Caraka Internasional

  **Jenis Kegiatan**                  Project Utama Praktik Kerja
                                      Lapangan (PKL) --- 30 Hari

  **Penyusun**                        Damar Munajad

  **Peran**                           Project Coordinator & System
                                      Analyst

  **Shift**                           Shift 1 (07.00 -- 16.00 WIB)

  **Tanggal Terbit**                  

  **Versi**                           v1.0 (Initial Release)

  **Status**                          Draft --- Menunggu Review Shift 2

  **Klasifikasi**                     Internal --- Tim PKL & Mentor
                                      Operasional Teknolab
  -----------------------------------------------------------------------

## LEMBAR PENGESAHAN

  --------------------------------------------------------------------------------------------------
  **Disusun Oleh**           **Direview Oleh**          **Disetujui Oleh**
  -------------------------- -------------------------- --------------------------------------------
  **Damar Munajad**          **Dzakwan**                \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

  Project Coordinator &      Shift Lead & System        Mentor Operasional PT Teknolab
  System Analyst             Integration                

  Tanggal:                   Tanggal:                   Tanggal: \_\_\_\_\_\_\_\_\_\_\_\_
  \_\_\_\_\_\_\_\_\_\_\_\_   \_\_\_\_\_\_\_\_\_\_\_\_   
  --------------------------------------------------------------------------------------------------

## DAFTAR ISI

1.  BAB 1: PENDAHULUAN

2.  BAB 2: ATURAN STATUS & PENGGUNAAN

3.  BAB 3: ALUR TESTING & QA

4.  BAB 4: INTEGRATION CHECKLIST (7 BLOK)

5.  BAB 5: HANDOVER POINT

6.  BAB 6: BUKTI / EVIDENCE

7.  BAB 7: CHANGE LOG

8.  BAB 8: CATATAN & KESIMPULAN

9.  LAMPIRAN

# BAB 1: PENDAHULUAN

## 1.1 Latar Belakang

Proyek T-AIMS dibangun oleh 11 peserta PKL yang terbagi ke dalam 2 shift
kerja (Shift 1 dan Shift 2) dengan fokus pekerjaan yang saling
melengkapi. Untuk memastikan seluruh modul sistem dapat **terintegrasi
end-to-end** --- mulai dari perangkat fisik, monitoring engine, backend,
database, dashboard, notifikasi, hingga otomasi AI --- diperlukan sebuah
**Integration Checklist** resmi yang menjadi acuan verifikasi bersama.

Dokumen ini disusun sebagai *single source of truth* untuk memverifikasi
bahwa setiap titik integrasi antar-modul telah berfungsi sesuai kontrak
API, skema database, dan design system yang disepakati.

## 1.2 Tujuan

10. Menjadi acuan verifikasi integrasi antar-modul T-AIMS.

11. Mencegah duplikasi pekerjaan antar-shift.

12. Menjadi bukti formal progres integrasi untuk laporan PKL.

13. Menjadi *living document* yang diupdate harian sebelum handover.

## 1.3 Ruang Lingkup

Dokumen ini mencakup **7 blok integrasi utama** dengan **47 item
verifikasi**:

  -----------------------------------------------------------------------
  **Blok**                            **Cakupan Integrasi**
  ----------------------------------- -----------------------------------
  Blok 1                              Device → Monitoring Engine

  Blok 2                              Monitoring Engine → Backend

  Blok 3                              Backend → Database

  Blok 4                              Backend → Dashboard (Frontend)

  Blok 5                              Backend → Notification & AI

  Blok 6                              Deployment & Security

  Blok 7                              Testing & Failure Simulation
  -----------------------------------------------------------------------

## 1.4 Definisi dan Istilah

- **Integration Checklist:** Daftar verifikasi titik integrasi
  antar-modul.

- **Definition of Done (DoD):** Kriteria baku penyelesaian item (code +
  testing + documentation + bukti commit).

- **Handover Point:** Titik serah terima pekerjaan antar-shift.

- **PIC:** Person In Charge --- penanggung jawab item.

- **QA:** Quality Assurance --- tim penguji kualitas sistem.

- **Bukti:** Artefak verifikasi (screenshot, log, commit, test result).

# BAB 2: ATURAN STATUS & PENGGUNAAN

## 2.1 Aturan Status

  -----------------------------------------------------------------------
  **Simbol**              **Status**              **Syarat**
  ----------------------- ----------------------- -----------------------
  ❌                      **Not Started**         Belum ada pekerjaan
                                                  sama sekali

  ⏳                      **In Progress**         Sedang dikerjakan oleh
                                                  PIC

  ✅                      **Testing**             Sudah selesai coding,
                                                  sedang diuji oleh QA

  ✅✅                    **Done**                Code + Test +
                                                  Documentation selesai &
                                                  ada bukti
  -----------------------------------------------------------------------

> PENTING: **Catatan Penting:** Item hanya boleh berstatus **Done
> (**✅✅**)** jika memenuhi seluruh kriteria **Definition of Done**
> berikut:
>
> 1\. Code & Configuration ter-commit dan lolos build tanpa error.
>
> 2\. Terintegrasi penuh dengan Database/API sistem (bebas dummy data).
>
> 3\. Lolos uji skenario positif dan negatif oleh QA.
>
> 4\. Terdokumentasi pada API contract / data dictionary.
>
> 5\. Memiliki instruksi restart/recovery otomatis.
>
> 6\. Siap dan layak digunakan operasional Teknolab.

## 2.2 Cara Penggunaan

14. Update status item **setiap hari** sebelum handover (15.30 WIB untuk
    Shift 1, 00.30 WIB untuk Shift 2).

15. Setiap perubahan status **wajib disertai bukti** (link commit /
    screenshot / log).

16. Item yang belum ✅ **wajib dicatat** di Daily Handover dengan
    kendala & next action.

17. Checklist ini bersifat **living document** --- versi terbaru selalu
    di repository.

## 2.3 Keterangan Warna Status

  -----------------------------------------------------------------------
  **Status**              **Warna**               **Keterangan**
  ----------------------- ----------------------- -----------------------
  Online                  Hijau                   Perangkat aktif dan
                                                  normal

  Offline                 Merah                   Perangkat tidak
                                                  merespons

  Warning                 Kuning                  Latensi tinggi / packet
                                                  loss parsial

  Unknown                 Abu-abu                 Belum terkonfigurasi /
                                                  belum diuji
  -----------------------------------------------------------------------

# BAB 3: ALUR TESTING & QA

## 3.1 Prinsip Testing T-AIMS

Sistem T-AIMS menerapkan **3 level testing** berlapis untuk memastikan
setiap modul teruji sebelum dinyatakan **Done**:

> \[PIC Modul\] → Coding → Unit Test Sendiri\
> ↓\
> \[Dzakwan\] → Integration Test (Cek Blok 1-6)\
> ↓\
> \[Reza Tri\] → QA Test End-to-End + Failure Simulation\
> ↓\
> \[Bug Ditemukan?\]\
> ├── Ya → PIC Modul Fix → Reza Tri Re-Test\
> └── Tidak → ✅ Done → Masuk Test Report

## 3.2 Pembagian Tanggung Jawab Testing

  -----------------------------------------------------------------------
  **Level Testing**       **Penanggung Jawab**    **Cakupan**
  ----------------------- ----------------------- -----------------------
  **1. Unit Testing**     Masing-masing PIC fitur Test kode sendiri
                                                  sebelum diserahkan

  **2. Integration        **Dzakwan** (Shift      Verifikasi integrasi
  Testing**               Lead)                   antar modul (Blok 1--6)

  **3. QA & Failure       **Reza Tri** (QA        Test end-to-end, bug
  Simulation**            Engineer)               report, failure
                                                  simulation, dokumentasi
  -----------------------------------------------------------------------

## 3.3 Peran Reza Tri --- QA, Testing & Documentation Engineer

Sesuai dokumen project T-AIMS, Reza Tri bertanggung jawab atas:

  -----------------------------------------------------------------------
  **Output Wajib Reza Tri**           **Keterangan**
  ----------------------------------- -----------------------------------
  **Test Report**                     Laporan pengujian setiap fitur

  **Bug Report**                      Daftar bug + severity + status

  **User Manual**                     Buku panduan pengguna

  **Technical Documentation**         Dokumentasi teknis

  **Video Demo**                      Rekaman demonstrasi sistem

  **Final Evidence**                  Bukti akhir semua testing
  -----------------------------------------------------------------------

**Tugas Utama Reza Tri:**

18. Menguji **setiap fitur** sebelum dinyatakan selesai.

19. Membuat **test case** untuk seluruh fitur.

20. Menjalankan **failure simulation** (Blok 7).

21. Menyusun **bug report** dengan severity (Critical / High / Medium /
    Low).

22. Menyusun **user manual** & **technical documentation**.

23. Membuat **video demo** sistem.

## 3.4 Peran PIC Modul

Setiap PIC modul **tetap wajib**:

24. Melakukan **unit testing** pada modul yang dikerjakan sebelum
    diserahkan ke QA.

25. Menyerahkan hasil ke Reza Tri untuk **QA testing**.

26. Memperbaiki bug yang ditemukan Reza Tri.

27. Menyertakan **bukti testing** (screenshot/log) di checklist.

## 3.5 Severity Level Bug

  -----------------------------------------------------------------------
  **Level**               **Deskripsi**           **Contoh**
  ----------------------- ----------------------- -----------------------
  **Critical**            Sistem mati / tidak     Backend down, DB tidak
                          bisa digunakan          connect

  **High**                Fitur utama error       Login gagal, dashboard
                                                  blank

  **Medium**              Fitur minor error       Filter tidak
                                                  case-insensitive

  **Low**                 Kosmetik / UI           Warna tombol tidak
                                                  konsisten
  -----------------------------------------------------------------------

# BAB 4: INTEGRATION CHECKLIST

## BLOK 1 --- DEVICE → MONITORING ENGINE

**Fokus:** Verifikasi seluruh perangkat target terdeteksi oleh
Monitoring Engine sesuai metode monitoring baku.

**Handover Point:** Hari 11--14 (Monitoring Engine & Heartbeat)

**Blok Shift:** 1

**Verifikator Integrasi:** Dzakwan

**QA Testing:** Reza Tri

  ----------------------------------------------------------------------------------------
  **No**     **Item           **Metode**   **PIC      **Shift**   **Status**   **Bukti**
             Integrasi**                   Modul**                             
  ---------- ---------------- ------------ ---------- ----------- ------------ -----------
  1.1        Server & Mini PC ICMP         Ananda Dwi 1                        
             terdeteksi via                Susanti                             
             Ping                                                              

  1.2        Raspberry Pi     MQTT/HTTP    Ilvina     1                        
             kirim heartbeat               Muvarika                            
             ke server                                                         

  1.3        MikroTik         SNMP v2c     Ananda Dwi 1                        
             ter-polling via               Susanti                             
             Ping/SNMP                                                         

  1.4        Switch           SNMP         Ananda Dwi 1                        
             Manageable                    Susanti                             
             ter-polling                                                       

  1.5        Access Point     Ping/SNMP    Ananda Dwi 1                        
             ter-polling                   Susanti                             

  1.6        Website/API      HTTP         Ananda Dwi 1                        
             di-check HTTP                 Susanti                             
             Health Check                                                      

  1.7        MQTT Broker      TCP          Ilvina     1                        
             di-check                      Muvarika                            
             TCP/keepalive                                                     

  1.8        ESP32 kirim      MQTT/HTTP    Ilvina     1                        
             heartbeat                     Muvarika                            
             berkala 30 detik                                                  

  1.9        PC/Workstation   Ping         Ananda Dwi 1                        
             terdeteksi saat               Susanti                             
             jam kerja                                                         

  1.10       Aset Non-Network Manual       Faida      1                        
             terdata via                   Trisma                              
             Asset Registry                Amelia                              
  ----------------------------------------------------------------------------------------

## BLOK 2 --- MONITORING ENGINE → BACKEND

**Fokus:** Verifikasi Monitoring Engine berhasil mengirim data ke
backend dan backend memprosesnya sesuai kontrak API.

**Handover Point:** Hari 11--12 (Monitoring Engine)

**Blok Shift:** 1

**Verifikator Integrasi:** Dzakwan

**QA Testing:** Reza Tri

  ----------------------------------------------------------------------------------------------
  **No**     **Item            **Metode**        **PIC      **Shift**   **Status**   **Bukti**
             Integrasi**                         Modul**                             
  ---------- ----------------- ----------------- ---------- ----------- ------------ -----------
  2.1        Engine kirim      POST              Ananda →   1           ⬜           
             hasil polling ke  /api/monitoring   Reza F                              
             API                                                                     

  2.2        Engine update     REST API          Ananda →   1           ⬜           
             kolom status di                     Reza F                              
             tabel assets                                                            

  2.3        Engine update     REST API          Ananda →   1           ⬜           
             kolom last_seen                     Reza F                              
             di tabel assets                                                         

  2.4        Engine catat log  REST API          Ananda →   1           ⬜           
             ke tabel                            Reza F                              
             monitoring_logs                                                         

  2.5        Endpoint          POST              Ilvina →   1           ⬜           
             heartbeat         /api/heartbeat    Reza F                              
             receiver menerima                                                       
             payload IoT                                                             

  2.6        Retry logic 3x    Internal Engine   Ananda Dwi 1           ⬜           
             sebelum status                      Susanti                             
             OFFLINE                                                                 

  2.7        Threshold latency Internal Engine   Ananda +   1           ⬜           
             & heartbeat                         Ilvina                              
             diterapkan                                                              
  ----------------------------------------------------------------------------------------------

## BLOK 3 --- BACKEND → DATABASE

**Fokus:** Verifikasi backend berhasil melakukan operasi CRUD ke
database dengan skema yang disepakati.

**Handover Point:** Hari 6 (Database Design) + Hari 8--10 (Backend API)

**Blok Shift:** 1

**Verifikator Integrasi:** Dzakwan

**QA Testing:** Reza Tri

  -----------------------------------------------------------------------------------------
  **No**     **Item            **Metode**   **PIC      **Shift**   **Status**   **Bukti**
             Integrasi**                    Modul**                             
  ---------- ----------------- ------------ ---------- ----------- ------------ -----------
  3.1        Skema 8 tabel     SQL          Faida      1           ⬜           
             ter-migrate       Migration    Trisma                              
                                            Amelia                              

  3.2        CRUD asset via    REST API     Reza F →   1           ⬜           
             API tulis ke                   Faida                               
             tabel assets                                                       

  3.3        Soft delete       REST API     Ahmad Reza 1           ⬜           
             (deleted_at,                   Fahmi                               
             is_active)                                                         
             berjalan                                                           

  3.4        Log monitoring    REST API     Ahmad Reza 1           ⬜           
             tersimpan di                   Fahmi                               
             monitoring_logs                                                    

  3.5        Incident otomatis Trigger API  Ahmad Reza 1           ⬜           
             tercatat di                    Fahmi                               
             incidents                                                          

  3.6        Audit trail       Trigger DB   Faida      1           ⬜           
             mencatat semua                 Trisma                              
             mutasi data                    Amelia                              

  3.7        Relasi antar      Constraint   Faida      1           ⬜           
             tabel (Foreign    DB           Trisma                              
             Key) konsisten                 Amelia                              
  -----------------------------------------------------------------------------------------

## BLOK 4 --- BACKEND → DASHBOARD (FRONTEND)

**Fokus:** Verifikasi frontend berhasil mengambil data dari backend API
dan menampilkan sesuai design system.

**Handover Point:** Hari 15--16 (Frontend Dashboard)

**Blok Shift:** 2

**Verifikator Integrasi:** Dzakwan

**QA Testing:** Reza Tri

  ----------------------------------------------------------------------------------------------------
  **No**    **Item Integrasi**        **Metode**        **PIC     **Shift**   **Status**   **Bukti**
                                                        Modul**                            
  --------- ------------------------- ----------------- --------- ----------- ------------ -----------
  4.1       Dashboard ambil data via  GET               Dika →    2           ⬜           
            API                       /api/dashboard    Reza F                             

  4.2       Total device, online,     GET /api/stats    Dika Yoga 2           ⬜           
            offline, warning akurat                                                        

  4.3       Device list + filter      GET /api/assets   Dika Yoga 2           ⬜           
            kategori & lokasi                                                              

  4.4       Device detail menampilkan GET               Dika Yoga 2           ⬜           
            last_seen & response time /api/assets/:id                                      

  4.5       History view menampilkan  GET /api/history  Dika Yoga 2           ⬜           
            monitoring_logs                                                                

  4.6       Floorplan/Map menampilkan GET               Ahmad     2           ⬜           
            marker berwarna sesuai    /api/locations    Aziz                               
            status                                                                         

  4.7       Warna status konsisten    Design System     Ahmad     2           ⬜           
            (Hijau/Merah/Kuning/Abu                     Aziz                               
            abu)                                                                           

  4.8       Export CSV/PDF berfungsi  GET /api/report   Dika +    2           ⬜           
                                                        Reza F                             
  ----------------------------------------------------------------------------------------------------

## BLOK 5 --- BACKEND → NOTIFICATION & AI

**Fokus:** Verifikasi webhook insiden berhasil dikirim ke n8n dan
notifikasi sampai ke Telegram/Email, serta AI Assistant berjalan.

**Handover Point:** Hari 21--24 (Notification & AI)

**Blok Shift:** 2

**Verifikator Integrasi:** Dzakwan

**QA Testing:** Reza Tri

  ----------------------------------------------------------------------------------------
  **No**     **Item          **Metode**    **PIC      **Shift**   **Status**   **Bukti**
             Integrasi**                   Modul**                             
  ---------- --------------- ------------- ---------- ----------- ------------ -----------
  5.1        Webhook insiden POST Webhook  Arik ←     2           ⬜           
             dikirim ke n8n                Reza F                              
             saat OFFLINE                                                      

  5.2        Webhook         POST Webhook  Arik ←     2           ⬜           
             recovery                      Reza F                              
             dikirim saat                                                      
             perangkat                                                         
             ONLINE kembali                                                    

  5.3        Cooldown 10     n8n Logic     Arik       2           ⬜           
             menit mencegah                                                    
             spam notifikasi                                                   

  5.4        Alert terkirim  Telegram Bot  Arik       2           ⬜           
             ke Telegram                                                       

  5.5        Alert terkirim  SMTP          Arik       2           ⬜           
             ke Email                                                          

  5.6        Log notifikasi  REST API      Arik →     2           ⬜           
             tercatat di                   Reza F                              
             tabel                                                             
             notifications                                                     

  5.7        AI Assistant    GET           Arik +     2           ⬜           
             ambil digest    /api/report   Wafian                              
             dari Reporting                                                    
             API                                                               

  5.8        AI hasilkan     n8n + LLM     Arik       2           ⬜           
             analisis &                                                        
             rekomendasi ke                                                    
             Telegram Admin                                                    
  ----------------------------------------------------------------------------------------

## BLOK 6 --- DEPLOYMENT & SECURITY

**Fokus:** Verifikasi sistem berjalan di server produksi dengan
konfigurasi keamanan yang sesuai standar.

**Handover Point:** Hari 25--26 (Security & Deployment)

**Blok Shift:** 2

**Verifikator Integrasi:** Dzakwan

**QA Testing:** Reza Tri

  ------------------------------------------------------------------------------------------
  **No**     **Item         **Metode**       **PIC      **Shift**   **Status**   **Bukti**
             Integrasi**                     Modul**                             
  ---------- -------------- ---------------- ---------- ----------- ------------ -----------
  6.1        Backend        Systemd/Docker   Wafian     2           ⬜           
             running di                                                          
             server                                                              
             produksi                                                            

  6.2        Database       Cron             Wafian +   2           ⬜           
             production                      Faida                               
             aktif & backup                                                      
             harian 02:00                                                        
             WIB                                                                 

  6.3        Dashboard      Nginx            Wafian     2           ⬜           
             diakses via                                                         
             HTTPS (SSL                                                          
             Let\'s                                                              
             Encrypt)                                                            

  6.4        Credential     Env File         Wafian     2           ⬜           
             disimpan di                                                         
             .env (bukan                                                         
             hardcode)                                                           

  6.5        Nginx reverse  Nginx            Wafian     2           ⬜           
             proxy berjalan                                                      

  6.6        Service        Systemd          Wafian     2           ⬜           
             auto-restart                                                        
             saat crash                                                          
  ------------------------------------------------------------------------------------------

## BLOK 7 --- TESTING & FAILURE SIMULATION

**Fokus:** Verifikasi sistem mampu mendeteksi gangguan dan memulihkan
diri sesuai skenario kegagalan.

**Handover Point:** Hari 27 (Failure Simulation Wajib)

**Blok Shift:** 2

**QA Lead:** **Reza Tri** (QA Engineer)

**Verifikator Integrasi:** Dzakwan

  ------------------------------------------------------------------------------------------------------
  **No**   **Skenario**        **Expected   **PIC       **PIC       **Shift**   **Status**   **Bukti**
                               Result**     Testing**   Modul**                              
  -------- ------------------- ------------ ----------- ----------- ----------- ------------ -----------
  7.1      Matikan ESP32       Status       **Reza      Ilvina      2           ⬜           
                               OFFLINE,     Tri**       (IoT)                                
                               last_seen                                                     
                               stop                                                          

  7.2      Cabut kabel LAN     Monitoring   **Reza      Ananda      2           ⬜           
                               deteksi      Tri**       (Network)                            
                               gangguan                                                      
                               jaringan                                                      

  7.3      Stop MQTT Broker    Service      **Reza      Ilvina      2           ⬜           
                               health       Tri**       (IoT)                                
                               bermasalah                                                    

  7.4      Matikan Raspberry   Perangkat    **Reza      Ilvina      2           ⬜           
           Pi                  terdeteksi   Tri**       (IoT)                                
                               OFFLINE                                                       

  7.5      Stop web/API        HTTP health  **Reza      Reza F      2           ⬜           
           service             check gagal  Tri**       (Backend)                            

  7.6      Nyalakan kembali    Recovery     **Reza      Semua PIC   2           ⬜           
           perangkat/service   tercatat +   Tri**                                            
                               notifikasi                                                    
                               terkirim                                                      
  ------------------------------------------------------------------------------------------------------

# BAB 5: HANDOVER POINT

## 5.1 Jadwal Handover

  ---------------------------------------------------------------------------
  **Shift**      **Blok yang     **Waktu**      **Dari**       **Ke**
                 Di-handover**                                 
  -------------- --------------- -------------- -------------- --------------
  Shift 1 →      Blok 1, 2, 3    15.30 -- 16.00 Damar Munajad  Dzakwan
  Shift 2                        WIB                           

  Shift 2 →      Blok 4, 5, 6, 7 00.30 -- 01.00 Dzakwan        Damar Munajad
  Shift 1                        WIB                           
  ---------------------------------------------------------------------------

## 5.2 Aturan Handover

28. Handover **wajib disertai bukti** (link commit / screenshot / log).

29. Dilarang menggunakan frasa *\"sudah dikerjakan\"*, *\"tinggal
    sedikit lagi\"*, atau *\"sudah hampir selesai\"* **tanpa bukti dan
    next action**.

30. Setiap blok yang belum ✅ wajib dicatat di **Daily Handover**
    dengan:

- Kendala

- Next Action

- File / Commit / Evidence

## 5.3 Format Daily Handover

> DAILY HANDOVER\
> Nama :\
> Tanggal :\
> Shift :\
> Task:\
> Status:\
> Yang sudah selesai:\
> 1\.\
> 2\.\
> Yang belum selesai:\
> 1\.\
> 2\.\
> Kendala:\
> 1\.\
> Next Action:\
> 1\.\
> 2\.\
> File / Commit / Evidence:

# BAB 6: BUKTI / EVIDENCE

## 6.1 Daftar Bukti

  -------------------------------------------------------------------------
  **No**            **Jenis Bukti**     **Link / File**   **Tanggal**
  ----------------- ------------------- ----------------- -----------------
  1                 Screenshot          \[tambahkan       
                    Dashboard           link\]            

  2                 Screenshot Device   \[tambahkan       
                    List                link\]            

  3                 Screenshot          \[tambahkan       
                    Floorplan Map       link\]            

  4                 Log Monitoring      \[tambahkan       
                                        link\]            

  5                 API Documentation   \[tambahkan       
                    (Swagger/Postman)   link\]            

  6                 Commit Git Backend  \[tambahkan       
                                        link\]            

  7                 Commit Git Frontend \[tambahkan       
                                        link\]            

  8                 Test Report (Reza   \[tambahkan       
                    Tri)                link\]            

  9                 Bug Report (Reza    \[tambahkan       
                    Tri)                link\]            

  10                Video Demo          \[tambahkan       
                                        link\]            
  -------------------------------------------------------------------------

## 6.2 Struktur Folder Bukti

> /docs/integration-checklist/\
> ├── T-AIMS_Integration_Checklist_v1.0.docx ← dokumen ini\
> ├── screenshots/\
> │ ├── dashboard.png\
> │ ├── device-list.png\
> │ └── floorplan.png\
> ├── logs/\
> │ └── monitoring-sample.log\
> ├── test-results/\
> │ ├── test-report.pdf\
> │ ├── bug-report.pdf\
> │ └── failure-simulation-report.pdf\
> └── video/\
> └── demo-taims.mp4

# BAB 7: CHANGE LOG

  ---------------------------------------------------------------------------
  **Versi**      **Tanggal**    **Perubahan**   **Oleh**       **Status**
  -------------- -------------- --------------- -------------- --------------
  v1.0           \[tgl\]        Draft awal      Damar Munajad  Draft
                                Integration                    
                                Checklist ---                  
                                47 item, 7 blok                

                                                               
  ---------------------------------------------------------------------------

# BAB 8: CATATAN & KESIMPULAN

## 8.1 Catatan Penting

31. Dokumen ini adalah **living document** --- wajib diupdate setiap
    hari sebelum handover.

32. Setiap item hanya boleh ✅ jika memenuhi **Definition of Done**.

33. Dilarang mengubah status tanpa bukti verifikasi.

34. Versi terbaru selalu tersedia di repository project:

github.com/T-AIMS/T-AIMS/docs/integration-checklist/

35. **QA testing (Blok 7)** sepenuhnya menjadi tanggung jawab **Reza
    Tri** sebagai QA Engineer.

36. **Integration testing (Blok 1--6)** dilakukan oleh **Dzakwan**
    sebagai Shift Lead & System Integration.

37. **Unit testing** dilakukan oleh masing-masing **PIC modul**.

## 8.2 Kesimpulan

Integration Checklist ini menjadi **acuan tunggal** verifikasi integrasi
modul T-AIMS antar-shift. Dengan 7 blok dan 47 item verifikasi, dokumen
ini memastikan bahwa:

- Seluruh perangkat target terdeteksi oleh Monitoring Engine.

- Data mengalir dari device → engine → backend → database → dashboard
  secara konsisten.

- Notifikasi insiden dan otomasi AI berjalan end-to-end.

- Sistem siap digunakan operasional Teknolab setelah lolos seluruh
  verifikasi.

# LAMPIRAN

- **Lampiran A:** Daftar Kontrak API (REST Endpoint) --- *lihat dokumen
  terpisah*

- **Lampiran B:** Skema Database 8 Tabel --- *lihat \`taims_db.sql\`*

- **Lampiran C:** Design System & Warna Status --- *lihat Figma UI/UX*

- **Lampiran D:** Daily Handover Log --- *lihat dokumen terpisah*

- **Lampiran E:** Test Report & Bug Report --- *lihat dokumen Reza Tri*

**Disusun oleh:**

Damar Munajad

*Project Coordinator & System Analyst*

**Direview oleh:**

Dzakwan

*Shift Lead & System Integration*

**Disetujui oleh:**

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

*Mentor Operasional PT Teknolab Caraka Internasional*

*Dokumen ini diterbitkan secara resmi untuk PT Teknolab Caraka
Internasional --- Proyek T-AIMS 2026.*
