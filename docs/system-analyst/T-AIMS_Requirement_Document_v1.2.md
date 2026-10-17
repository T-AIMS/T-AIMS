**DOKUMEN SPESIFIKASI KEBUTUHAN SISTEM**

**T-AIMS: Teknolab Asset & Infrastructure Monitoring System**

**INFORMASI DOKUMEN (DOCUMENT CONTROL)**

  -----------------------------------------------------------------------
  **Atribut**       **Keterangan**
  ----------------- -----------------------------------------------------
  **Nama Proyek**   **T-AIMS** (*Teknolab Asset & Infrastructure
                    Monitoring System*)

  **Instansi /      **PT Teknolab Caraka Internasional**
  Perusahaan**      

  **Jenis           Project Utama Praktik Kerja Lapangan (PKL) --- Durasi
  Kegiatan**        30 Hari

  **Penyusun**      **Tim Pengembang T-AIMS**

  **Fase Proyek**   Fase 1: Fondasi, Perencanaan & Desain Sistem (Hari
                    ke-4 s.d. Hari ke-5)

  **Nomor Dokumen** T-AIMS/REQ/2026/V1.2

  **Versi Dokumen** v1.2 (Final Release)

  **Klasifikasi     Internal --- Tim PKL & Mentor Operasional Teknolab
  Akses**           

  **Tanggal         12 Oktober 2026
  Terbit**          
  -----------------------------------------------------------------------

**LEMBAR PENGESAHAN**

Dokumen ini disusun sebagai acuan tunggal (*single source of truth*)
dalam perancangan, pengembangan, integrasi, dan pengujian sistem T-AIMS
selama 30 hari pelaksanaan PKL di PT Teknolab Caraka Internasional.

+------------------------+--------------------+------------------------------------------------------+
| **Disusun Oleh**       | **Direview Oleh**  | **Disetujui Oleh**                                   |
+========================+====================+======================================================+
| **Damar Munajad**      | **Dzakwan**        | *(\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_)* |
|                        |                    |                                                      |
| *Project Coordinator & | *Shift Lead &      | *Mentor Operasional PT Teknolab*                     |
| System Analyst*        | System             |                                                      |
|                        | Integration*       |                                                      |
+------------------------+--------------------+------------------------------------------------------+
| Tanggal: 12 Oktober    | Tanggal: 12        | Tanggal: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_    |
| 2026                   | Oktober 2026       |                                                      |
+------------------------+--------------------+------------------------------------------------------+

**\
\
DAFTAR ISI**

1.  [BAB 1: PENDAHULUAN](#bab-1-pendahuluan "null")

    - 1.1 Latar Belakang

    - 1.2 Tujuan Proyek

    - 1.3 Sasaran Hasil (Deliverables)

    - 1.4 Definisi dan Istilah

2.  [BAB 2: RUANG LINGKUP PEKERJAAN (SCOPE OF
    WORK)](#bab-2-ruang-lingkup-pekerjaan-scope-of- "null")

    - 2.1 In-Scope: 12 Fitur Minimum Wajib

    - 2.2 In-Scope: Komponen Pendukung Sistem

    - 2.3 Out-of-Scope (Batasan Pasca-MVP Hari ke-20)

    - 2.4 Matriks Klasifikasi Perangkat & Metode Monitoring

    - 2.5 Standar Metadata Aset (12 Field Wajib)

3.  [BAB 3: PENGGUNA DAN MATRIKS HAK AKSES (USER ROLES &
    PERMISSIONS)](#bab-3-pengguna-dan-matriks-hak-akses-us "null")

    - 3.1 Definisi Peran Pengguna (*Roles*)

    - 3.2 Matriks Hak Akses (CRUD & Execution Matrix)

    - 3.3 Prinsip Keamanan & Tata Kelola Akses

4.  [BAB 4: KEBUTUHAN SISTEM (SYSTEM
    REQUIREMENTS)](#bab-4-kebutuhan-sistem-system-requireme "null")

    - 4.1 Kebutuhan Fungsional (*Functional Requirements* / FR)

    - 4.2 Kebutuhan Non-Fungsional (*Non-Functional Requirements* / NFR)

    - 4.3 Standar Logika Status & Penentuan Keputusan (*Status Decision
      Rules*)

5.  [BAB 5: SYSTEM ARCHITECTURE & BLOCK
    DIAGRAM](#bab-5-system-architecture--block-diagra "null")

    - 5.1 System Architecture Multi-Layer (6 Layer Target)

    - 5.2 Block Diagram Komponen Sistem Teknis

    - 5.3 Topologi Jaringan & Penempatan Komponen

6.  [BAB 6: DATA FLOW ARCHITECTURE (DFD & SEQUENCE
    FLOWS)](#bab-6-data-flow-architecture-dfd--seque "null")

    - 6.1 Data Flow Diagram (DFD) Level 0 / Context Diagram

    - 6.2 Data Flow Diagram (DFD) Level 1

    - 6.3 Sequence Diagram 1: Alur Monitoring Jaringan (Ping/SNMP
      Polling)

    - 6.4 Sequence Diagram 2: Alur IoT Heartbeat & Timeout (Push-based)

    - 6.5 Sequence Diagram 3: Alur Incident Alert & Recovery (Debounce &
      Notification)

    - 6.6 Sequence Diagram 4: Alur AI Infrastructure Assistant & Insight
      Report

7.  [BAB 7: PERANCANGAN DATA & MODUL DATABASE
    MINIMUM](#bab-7-perancangan-data--modul-database- "null")

    - 7.1 Modul Basis Data Minimum

    - 7.2 Diagram Relasi Antar-Entitas (Entity Relationship Overview)

8.  [BAB 8: TATA KELOLA ANTAR-SHIFT & TIM
    KERJA](#bab-8-tata-kelola-antar-shift--tim-kerj "null")

    - 8.1 Prinsip Kolaborasi: \"Satu Sistem, Bukan Dua Project\"

    - 8.2 Struktur Pembagian Peran Shift 1 & Shift 2

    - 8.3 Mekanisme & Prosedur Handover Antar-Shift

    - 8.4 Format Baku Daily Handover

    - 8.5 Matriks RACI Proyek

9.  [BAB 9: ROADMAP 30 HARI & DEFINITION OF DONE
    (DoD)](#bab-9-roadmap-30-hari--definition-of-do "null")

    - 9.1 Roadmap Pelaksanaan 30 Hari

    - 9.2 Milestone Hari ke-20: MVP Release

    - 9.3 Kriteria Penerimaan & Definition of Done (DoD)

    - 9.4 Skenario Failure Simulation Wajib (Hari ke-27)

10. [BAB 10: MANAJEMEN RISIKO, ASUMSI, DAN
    KONTINGENSI](#bab-10-manajemen-risiko-asumsi-dan-kont "null")

    - 10.1 Asumsi & Batasan Operasional

    - 10.2 Analisis Risiko & Mitigasi

11. [BAB 11: CHECKLIST PEKERJAAN DAMAR MUNAJAD (PROJECT COORDINATOR &
    SYSTEM ANALYST)](#bab-11-checklist-pekerjaan-damar-munaja "null")

**BAB 1: PENDAHULUAN**

**1.1 Latar Belakang**

PT Teknolab Caraka Internasional memiliki berbagai aset dan perangkat
infrastruktur teknologi yang heterogen, meliputi:

- Server fisik dan Mini PC

- Komputer papan tunggal (*Single Board Computer*) seperti Raspberry Pi
  dan IoT Gateway

- Perangkat jaringan aktif (*MikroTik router, manageable switch, access
  point*)

- Mikrokontroler nirkabel (*ESP32 dan embedded systems*)

- Layanan aplikasi (*production website, REST API, MQTT Broker, dan
  service kritis*)

- Perangkat operasional workstation/PC

- Perangkat inventaris non-jaringan

Saat ini, kegiatan pencatatan inventaris dan pengawasan kondisi
operasional perangkat tersebut masih dijalankan secara konvensional,
manual, dan terpisah-pisah. Kondisi eksisting ini menimbulkan sejumlah
kendala signifikan:

1.  **Ketiadaan Visibilitas Real-Time:** Gangguan atau matinya perangkat
    tidak dapat dideteksi secara seketika (*real-time*).

2.  **Histori Gangguan Terfragmentasi:** Tidak terdapat pencatatan
    sistematis mengenai rekaman insiden (kapan perangkat mati, durasi
    *downtime*, dan kapan perangkat kembali normal/*recovery*).

3.  **Ketiadaan Notifikasi Cepat:** Personil IT/operasional terlambat
    mengetahui gangguan karena tidak ada mekanisme peringatan otomatis
    (*automated alerts*).

4.  **Inefisiensi Pelaporan:** Penyusunan laporan ketersediaan
    (*availability report*) dan kesehatan infrastruktur memakan waktu
    lama, rawan kekeliruan manusiawi, dan tidak konsisten.

Untuk mengatasi permasalahan tersebut, dirancanglah proyek **T-AIMS
(Teknolab Asset & Infrastructure Monitoring System)** sebagai platform
terpadu berbasis web yang mengintegrasikan pendataan aset (*asset
registry*), mesin pengawas aktif/pasif (*monitoring engine* &
*heartbeat*), dashboard operasional visual, notifikasi insiden berbasis
webhook/chat, serta automasi analisis kesehatan infrastruktur berbasis
kecerdasan buatan (*AI Automation*).

**1.2 Tujuan Proyek**

Tujuan utama pengembangan sistem T-AIMS adalah:

1.  Menyediakan repositori tunggal terpusat (*Single Source of Truth*)
    untuk pendataan inventaris aset infrastruktur Teknolab.

2.  Memonitor status operasional seluruh perangkat secara berkala dan
    otomatis (kategori status: *Online*, *Offline*, *Warning*,
    *Unknown*).

3.  Mengukur dan mencatat performa konektivitas berupa *response time*
    (latensi) dan waktu terakhir aktif (*last seen*).

4.  Mencatat riwayat perubahan status perangkat dan siklus insiden
    (*outage to recovery*) secara presisi.

5.  Menghitung persentase keandalan (*uptime/downtime & availability
    rate*) serta mengidentifikasi perangkat yang sering mengalami
    gangguan (*top problematic devices*).

6.  Menyajikan dashboard visual informatif, peta/denah lokasi
    (*floorplan*), dan ringkasan kondisi sistem secara *real-time*.

7.  Mengirimkan notifikasi insiden (*alerting*) secara instan ke saluran
    komunikasi (Telegram/Email) dengan mekanisme pencegahan pesan
    berulang (*anti-spam/debounce*).

8.  Mengotomatisasi analisis kesehatan sistem harian dan rekomendasi
    perbaikan menggunakan asisten AI (*AI Infrastructure Assistant*).

9.  Menyediakan fitur ekspor dan pelaporan eksekutif dalam format
    terstruktur (CSV dan PDF).

10. Membangun sistem yang berfungsi penuh, terintegrasi menyeluruh
    antar-shift, teruji terhadap skenario kegagalan, terdokumentasi
    rapi, dan siap digunakan langsung oleh operasional Teknolab
    (*Project Ready*).

**1.3 Sasaran Hasil (Deliverables)**

Proyek T-AIMS memiliki 18 deliverable wajib yang harus diserahkan pada
akhir pelaksanaan PKL:

1.  Web Asset Management System

2.  Web Device Monitoring System

3.  Monitoring Engine (Network & Service Poller)

4.  IoT Heartbeat Receiver & Agent/Firmware ESP32/Raspberry Pi

5.  Skema & Basis Data Operasional Terintegrasi

6.  Backend REST API beserta Kontrak Endpoint

7.  Modul Riwayat Pengawasan (Monitoring History & Incident Logs)

8.  Modul Perhitungan Statistik Uptime / Downtime

9.  Notification Engine (Telegram & Email via n8n)

10. AI Infrastructure Assistant Workflow

11. Repositori Source Code Terpadu (Git Repository)

12. Dokumentasi Struktur & Relasi Basis Data (Data Dictionary)

13. Konfigurasi Server Produksi (Deployment, SSL/HTTPS, Environment)

14. Dokumentasi Teknis Sistem (Technical Documentation)

15. Buku Petunjuk Pengguna (User Manual)

16. Laporan Pengujian (Test Case & Test Report)

17. Rekaman Video Demonstrasi Sistem (Video Demonstration)

18. Berita Acara Final Presentation & Handover Sistem

**1.4 Definisi dan Istilah**

- **T-AIMS:** *Teknolab Asset & Infrastructure Monitoring System*.

- **Asset Registry:** Modul inventarisasi untuk mencatat identitas unik,
  penanggung jawab, dan spesifikasi perangkat.

- **Heartbeat:** Mekanisme pengiriman sinyal hidup (*keepalive signal*)
  secara periodik dari agen/mikrokontroler (ESP32/Raspberry Pi) menuju
  server.

- **Monitoring Engine:** Komponen backend yang secara otomatis melakukan
  penjadwalan pemeriksaan konektivitas perangkat jaringan menggunakan
  ICMP Ping, SNMP, TCP Port, atau HTTP Check.

- **Last Seen:** Timestamp penanda waktu terakhir perangkat berhasil
  berkomunikasi atau merespons sistem monitoring.

- **Debounce / Cooldown:** Mekanisme penundaan dan penahanan pengiriman
  notifikasi agar tidak terjadi luapan spam saat status perangkat
  berfluktuasi cepat (*flapping*).

- **RACI:** Model pembagian peran kerja (*Responsible, Accountable,
  Consulted, Informed*).

- **Definition of Done (DoD):** Kriteria baku yang menyatakan sebuah
  fitur telah tuntas (mencakup kode, pengujian, dan dokumentasi).

**BAB 2: RUANG LINGKUP PEKERJAAN (SCOPE OF WORK)**

**2.1 In-Scope: 12 Fitur Minimum Wajib**

Berikut adalah 12 fitur minimum yang wajib selesai dibangun,
terintegrasi antar-shift, dan lulus uji operasional:

+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **No** | **Modul /      | **Deskripsi    | **PIC     | **Shift** | **Rekan     | **Handover | **Kriteria       |
|        | Fitur**        | Fungsional**   | Utama**   |           | Pendukung** | Point**    | Keberhasilan     |
|        |                |                |           |           |             |            | (*Acceptance     |
|        |                |                |           |           |             |            | Criteria*)**     |
+========+================+================+===========+===========+=============+============+==================+
| **1**  | **Asset        | Pengelolaan    | Faida     | 1         | Damar       | Hari       | Aset dapat       |
|        | Management**   | data master    | Trisma    |           | Munajad,    | 8--10:     | dimanipulasi     |
|        |                | inventaris     | Amelia,   |           | Dika Yoga   |            | sesuai role;     |
|        |                | aset Teknolab  | Ahmad     |           |             | Schema →   | asset_code unik; |
|        |                | (tambah, edit, | Reza      |           |             | API → UI   | 12 field minimum |
|        |                | hapus logis,   | Fahmi     |           |             |            | wajib terisi;    |
|        |                | pencarian, dan |           |           |             |            | soft delete      |
|        |                | kategorisasi). |           |           |             |            | aktif.           |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **2**  | **Device       | Mesin          | Ananda    | 1         | Ahmad Reza  | Hari       | Pengecekan       |
|        | Monitoring**   | pengecekan     | Dwi       |           | Fahmi,      | 11--12:    | otomatis         |
|        |                | status         | Susanti   |           | Ilvina      |            | berjalan; status |
|        |                | perangkat      |           |           | Muvarika,   | Engine →   | terupdate di DB  |
|        |                | (Online,       |           |           | Dika Yoga   | API → UI   | dan terlihat di  |
|        |                | Offline,       |           |           |             | status     | UI; aturan retry |
|        |                | Warning,       |           |           |             |            | berjalan sebelum |
|        |                | Unknown)       |           |           |             |            | vonis offline.   |
|        |                | secara         |           |           |             |            |                  |
|        |                | periodik.      |           |           |             |            |                  |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **3**  | **Last Seen**  | Pencatatan dan | Ilvina    | 1         | Ananda Dwi  | Hari       | Kolom last_seen  |
|        |                | penayangan     | Muvarika, |           | Susanti,    | 13--14:    | diperbarui       |
|        |                | waktu terakhir | Ahmad     |           | Dika Yoga   |            | otomatis oleh    |
|        |                | perangkat      | Reza      |           |             | Heartbeat  | heartbeat atau   |
|        |                | terdeteksi     | Fahmi     |           |             | → API → UI | engine; nilai    |
|        |                | aktif di       |           |           |             |            | format waktu     |
|        |                | sistem.        |           |           |             |            | human-readable   |
|        |                |                |           |           |             |            | (mis. \"2 menit  |
|        |                |                |           |           |             |            | lalu\").         |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **4**  | **Response     | Pengukuran     | Ananda    | 1         | Dika Yoga,  | Hari 11:   | Nilai latensi    |
|        | Time**         | latensi        | Dwi       |           | Ahmad Aziz  |            | tercatat di DB;  |
|        |                | komunikasi     | Susanti,  |           |             | Engine →   | tampil pada      |
|        |                | (milidetik/ms) | Ahmad     |           |             | API → UI   | daftar perangkat |
|        |                | antara engine  | Reza      |           |             |            | dan grafik       |
|        |                | dan perangkat  | Fahmi     |           |             |            | riwayat di modal |
|        |                | target.        |           |           |             |            | detail.          |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **5**  | **Monitoring   | Penyimpanan    | Ahmad     | 1         | Reza Tri    | Hari 18:   | Riwayat          |
|        | History**      | log historis   | Reza      |           |             |            | tersimpan di     |
|        |                | setiap siklus  | Fahmi,    |           |             | Log → API  | monitoring_logs; |
|        |                | pemeriksaan    | Faida     |           |             | → View     | query cepat      |
|        |                | dan perubahan  | Trisma    |           |             |            | dengan           |
|        |                | status.        | Amelia    |           |             |            | pagination;      |
|        |                |                |           |           |             |            | dapat difilter   |
|        |                |                |           |           |             |            | berdasarkan      |
|        |                |                |           |           |             |            | tanggal, device, |
|        |                |                |           |           |             |            | dan status.      |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **6**  | **Uptime /     | Kalkulasi      | Ahmad     | 1         | Faida       | Hari 19:   | Formula          |
|        | Downtime**     | persentase     | Reza      |           | Trisma      |            | ketersediaan     |
|        |                | ketersediaan   | Fahmi,    |           | Amelia,     | Query →    | terverifikasi    |
|        |                | (*availability | Ananda    |           | Ahmad Aziz  | API →      | matematis; card  |
|        |                | rate*) dan     | Dwi       |           |             | Chart      | persentase       |
|        |                | akumulasi      | Susanti   |           |             |            | tampil akurat di |
|        |                | durasi         |           |           |             |            | dashboard dan    |
|        |                | downtime.      |           |           |             |            | detail device.   |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **7**  | **Dashboard**  | Halaman visual | Dika      | 2         | Ahmad Reza  | Hari 15:   | Metrik total     |
|        |                | utama          | Yoga,     |           | Fahmi       |            | perangkat,       |
|        |                | ringkasan      | Ahmad     |           |             | API →      | online, offline, |
|        |                | operasional    | Aziz      |           |             | Dashboard  | warning akurat;  |
|        |                | infrastruktur  |           |           |             |            | grafik tren 10   |
|        |                | secara         |           |           |             |            | hari dan chart   |
|        |                | *real-time*.   |           |           |             |            | donat distribusi |
|        |                |                |           |           |             |            | kategori         |
|        |                |                |           |           |             |            | responsif.       |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **8**  | **Location     | Pemetaan       | Ahmad     | 2         | Faida       | Hari 23:   | Setiap aset      |
|        | Management**   | penempatan     | Aziz,     |           | Trisma      |            | terikat ke       |
|        |                | fisik          | Dika Yoga |           | Amelia,     | Tabel →    | entitas lokasi;  |
|        |                | perangkat      |           |           | Ahmad Reza  | API → Peta | peta             |
|        |                | berdasarkan    |           |           | Fahmi       |            | denah/floorplan  |
|        |                | gedung,        |           |           |             |            | menampilkan      |
|        |                | lantai,        |           |           |             |            | penanda          |
|        |                | ruangan, atau  |           |           |             |            | (*marker*)       |
|        |                | zona.          |           |           |             |            | berwarna sesuai  |
|        |                |                |           |           |             |            | status.          |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **9**  | **Notification | Pengiriman     | Arik      | 2         | Ahmad Reza  | Hari       | Pesan terkirim   |
|        | System**       | sinyal bahaya  |           |           | Fahmi,      | 21--22:    | otomatis ke grup |
|        |                | saat perangkat |           |           | Ananda Dwi  |            | Telegram dan     |
|        |                | offline dan    |           |           | Susanti,    | Event →    | Email; memiliki  |
|        |                | notifikasi     |           |           | Wafian      | n8n →      | cooldown (tidak  |
|        |                | pemulihan saat |           |           |             | Alert      | spamming);       |
|        |                | online         |           |           |             |            | payload memuat   |
|        |                | kembali.       |           |           |             |            | info detail      |
|        |                |                |           |           |             |            | insiden.         |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **10** | **User         | Manajemen akun | Ahmad     | 1         | Ahmad Aziz, | Hari 9:    | Autentikasi      |
|        | Management**   | pengguna       | Reza      |           | Wafian      |            | token JWT /      |
|        |                | berbasis       | Fahmi     |           |             | Auth → API | session;         |
|        |                | otentikasi     |           |           |             | → UI Role  | pemisahan peran  |
|        |                | aman dan       |           |           |             |            | Super Admin,     |
|        |                | pembagian      |           |           |             |            | Admin, Member;   |
|        |                | peran          |           |           |             |            | log audit trail  |
|        |                | berjenjang     |           |           |             |            | mencatat aksi    |
|        |                | (*RBAC*).      |           |           |             |            | pengguna.        |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **11** | **Reporting    | Rekapitulasi   | Ahmad     | 1 & 2     | Faida       | Hari 25:   | Laporan dapat    |
|        | Module**       | kondisi        | Reza      |           | Trisma      |            | difilter per     |
|        |                | operasional    | Fahmi,    |           | Amelia,     | Query →    | rentang waktu,   |
|        |                | berkala dan    | Dika Yoga |           | Ahmad Aziz  | API → UI   | kategori, atau   |
|        |                | ekspor         |           |           |             |            | lokasi; ekspor   |
|        |                | dokumen.       |           |           |             |            | format file CSV  |
|        |                |                |           |           |             |            | dan PDF          |
|        |                |                |           |           |             |            | berfungsi valid. |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+
| **12** | **AI           | Asisten cerdas | Arik,     | 2         | Ahmad Reza  | Hari 24:   | Workflow n8n     |
|        | Automation**   | untuk          | Wafian    |           | Fahmi,      |            | memicu prompt    |
|        |                | menganalisis   |           |           | Damar       | Data → n8n | LLM terjadwal;   |
|        |                | anomali, tren  |           |           | Munajad     | → AI →     | menghasilkan     |
|        |                | kerusakan, dan |           |           |             | Report     | analisis         |
|        |                | menerbitkan    |           |           |             |            | deskriptif &     |
|        |                | rekomendasi    |           |           |             |            | rekomendasi      |
|        |                | preventif.     |           |           |             |            | teknis yang      |
|        |                |                |           |           |             |            | dikirim ke       |
|        |                |                |           |           |             |            | saluran admin.   |
+--------+----------------+----------------+-----------+-----------+-------------+------------+------------------+

**2.2 In-Scope: Komponen Pendukung Sistem**

Komponen teknis penunjang yang wajib disiapkan oleh tim PKL:

  --------------------------------------------------------------------------------------
  **No**   **Komponen        **Deskripsi Pekerjaan**          **Penanggung   **Shift**
           Pendukung**                                        Jawab Utama**  
  -------- ----------------- -------------------------------- -------------- -----------
  1        **System          Blueprint arsitektur 6-layer,    **Damar        1
           Architecture &    blok subsistem teknis, dan       Munajad**      
           Block Diagram**   rancangan topologi.                             

  2        **Data Flow       Pemodelan diagram alir data      **Damar        1
           Diagram (DFD) &   context level 0, level 1, dan    Munajad**      
           Sequence**        sequence kejadian.                              

  3        **Database Schema Struktur tabel, constraint       Faida Trisma   1
           & Migration DDL** relasi, indeks performa, dan     Amelia         
                             skrip migrasi SQL.                              

  4        **Backend RESTful Endpoint CRUD aset, heartbeat    Ahmad Reza     1
           API & Contracts** ingestion, log retrieval,        Fahmi          
                             analitik, dan otentikasi.                       

  5        **Monitoring      Daemon background worker         Ananda Dwi     1
           Engine Service**  pengeksekusi ping/SNMP/HTTP      Susanti        
                             polling secara periodik.                        

  6        **IoT Agent       Skrip Python/C++ pengirim        Ilvina         1
           Firmware &        heartbeat berkala pada ESP32 dan Muvarika       
           Scripts**         Raspberry Pi.                                   

  7        **Frontend        Antarmuka web pengguna berbasis  Dika Yoga      2
           Dashboard         komponen modern yang terhubung                  
           Application**     ke REST API.                                    

  8        **UI/UX Design    Aset visual konsisten, palet     Ahmad Aziz     2
           System & Data     warna status standar, grafik,                   
           Viz**             dan denah interaktif.                           

  9        **Workflow        Otomasi alur data peringatan     Arik           2
           Automation        dini insiden, webhook handler,                  
           (n8n)**           dan integrasi AI.                               

  10       **DevOps,         Konfigurasi server Linux,        Wafian         2
           Security, SSL, &  domain/subdomain, SSL Let\'s                    
           Backup**          Encrypt, cron backup.                           

  11       **QA, Test Case,  Skenario pengujian               Reza Tri       2
           Bug Tracking &    fungsional/kegagalan, dokumen                   
           Docs**            panduan, dan video demo.                        
  --------------------------------------------------------------------------------------

**2.3 Out-of-Scope (Batasan Pasca-MVP Hari ke-20)**

Untuk memastikan target MVP tercapai tepat waktu pada Hari ke-20 dan
sisa waktu difokuskan pada stabilitas dan pengujian, cakupan berikut
**ditunda** dan ditempatkan sebagai backlog pasca-PKL:

1.  **Aplikasi Mobile Native (Android / iOS):** Sistem difokuskan
    sepenuhnya pada *Responsive Web Dashboard*.

2.  **Integrasi Sistem Pihak Ketiga Eksternal:** Tidak mengintegrasikan
    sistem ERP, CMMS, atau ticketing helpdesk luar di tahap ini.

3.  **Machine Learning Prediktif Lanjutan (*Predictive Maintenance*):**
    AI dibatasi pada *analisis deskriptif dan rekomendasi preventif
    otomatis* melalui LLM via n8n, bukan model regresi prediktif
    kegagalan hardware mandiri.

4.  **Arsitektur Multi-Tenancy:** Sistem hanya menangani single-tenant
    untuk entitas PT Teknolab Caraka Internasional.

5.  **Work Order & Sparepart Maintenance Lengkap:** Modul maintenance
    hanya mencakup pencatatan jadwal dan log pemeliharaan preventif
    dasar.

6.  **Single Sign-On (SSO) Enterprise (LDAP / SAML):** Otentikasi
    dibatasi pada manajemen akun internal database dengan password
    hashing (Bcrypt/Argon2).

**2.4 Matriks Klasifikasi Perangkat & Metode Monitoring**

Sistem T-AIMS mengklasifikasikan 10 tipe perangkat target beserta
mekanisme pemantauan bakunya:

  ----------------------------------------------------------------------------------
  **No**   **Tipe / Entitas    **Protokol     **Mekanisme Teknis    **Target
           Perangkat**         Pemantauan     (*Check Logic*)**     Evaluasi**
                               Baku**                               
  -------- ------------------- -------------- --------------------- ----------------
  1        **Server Fisik &    ICMP Ping +    Polling ICMP interval Respons ping \<
           Mini PC**           TCP Port +     60s; TCP check port   100ms; port
                               HTTP/API       SSH (22)/Web          terbuka; HTTP
                                              (80/443); probe       200 OK.
                                              endpoint /health.     

  2        **Raspberry Pi &    ICMP Ping +    Polling ICMP; agen    Ping merespons
           IoT Gateway**       Inbound        lokal mengirim        atau selisih
                               Heartbeat      payload JSON via      current_time -
                                              MQTT/HTTP tiap 30--60 last_seen \< 120
                                              detik.                detik.

  3        **MikroTik Router** ICMP Ping +    Ping berkala; SNMP    Ping reply
                               SNMP v2c/v3    GET OID CPU, memory   didapat;
                                              usage, interface link interface link
                                              status.               up.

  4        **Switch            ICMP Ping +    Ping berkala; polling Host reachable;
           Manageable**        SNMP           status port           packet loss 0%.
                                              trunk/access kritis   
                                              via SNMP.             

  5        **Access Point      ICMP Ping +    Ping polling berkala; Host reachable;
           (AP)**              SNMP           SNMP monitoring       response time
                                              client count &        stabil.
                                              uptime.               

  6        **Website & Web     HTTP / HTTPS   Request GET /health   Status code 200
           Service**           Health Check   atau URL publik tiap  OK; response
                                              60s; verifikasi HTTP  latency \<
                                              Status Code.          2000ms.

  7        **MQTT Broker       TCP Socket +   TCP check port        Koneksi broker
           Service**           MQTT Keepalive 1883/8883;            berhasil
                                              publish/subscribe     diinisiasi
                                              test ping topic       (*CONNACK*
                                              berkala.              diterima).

  8        **ESP32             Push Heartbeat ESP32 aktif mem-push  Pesan heartbeat
           Microcontroller**   (HTTP/MQTT)    sinyal keepalive      tiba di server
                                              berisi status         sebelum batas
                                              hardware tiap 30      timeout
                                              detik.                threshold.

  9        **Workstation / PC  ICMP Ping (+   Polling IP            Perangkat
           Teknolab**          Lightweight    statis/DHCP           merespons selama
                               Agent)         reservation saat jam  jam kerja.
                                              operasional kantor.   

  10       **Aset Non-Network  Manual Status  Pembaruan status      Terdata di
           (Alat Ukur, Rak)**  / Asset        berkala oleh teknisi  sistem
                               Registry       penanggung jawab      inventaris
                                              (PIC).                dengan identitas
                                                                    barcode/kode
                                                                    fisik.
  ----------------------------------------------------------------------------------

**2.5 Standar Metadata Aset (12 Field Wajib)**

Setiap entitas perangkat yang didaftarkan ke dalam T-AIMS wajib memiliki
12 atribut data:

  ----------------------------------------------------------------------------------
  **No**   **Nama Atribut      **Tipe Data**   **Deskripsi & Batasan Aturan**
           (*Field*)**                         
  -------- ------------------- --------------- -------------------------------------
  1        asset_code          VARCHAR(50)     Kode inventaris unik (Primary
                                               Key/Unique Index), contoh: SRV-DC-01,
                                               ESP32-LAB-03.

  2        asset_name          VARCHAR(100)    Nama deskriptif perangkat, contoh:
                                               Server Core Database Production.

  3        category            ENUM /          Kategori baku: Server, Network
                               VARCHAR(50)     Device, IoT Node, Gateway,
                                               Workstation, Service, Non-Network.

  4        ip_address          VARCHAR(45)     Alamat IPv4 atau IPv6 valid perangkat
                                               (opsional jika aset non-jaringan).

  5        mac_address         VARCHAR(17)     Physical MAC Address perangkat
                                               (format: XX:XX:XX:XX:XX:XX).

  6        location_id /       VARCHAR(100)    Lokasi fisik penempatan perangkat
           location                            (contoh: Data Center Lantai 2, Lab
                                               IoT).

  7        pic                 VARCHAR(100)    Nama personil penanggung jawab aset
                                               (*Person in Charge*).

  8        monitoring_method   ENUM            Metode inspeksi: PING, HTTP_CHECK,
                                               MQTT_HEARTBEAT, SNMP, MANUAL.

  9        status              ENUM            Nilai status operasional baku:
                                               ONLINE, OFFLINE, WARNING, UNKNOWN.

  10       last_seen           TIMESTAMP       Waktu terakhir perangkat
                                               terverifikasi hidup oleh sistem.

  11       installation_date   DATE            Tanggal pengadaan, perakitan, atau
                                               instalasi perangkat di lapangan.

  12       description         TEXT            Keterangan tambahan (spesifikasi
                                               spesifik, catatan kredensial
                                               terpisah, dsb).
  ----------------------------------------------------------------------------------

**BAB 3: PENGGUNA DAN MATRIKS HAK AKSES (USER ROLES & PERMISSIONS)**

**3.1 Definisi Peran Pengguna (*Roles*)**

Sistem T-AIMS mengadopsi kontrol akses berbasis peran (*Role-Based
Access Control / RBAC*) dengan 3 tingkatan hak akses:

1.  **Super Admin:** Pengguna dengan kendali penuh (*full control*) atas
    sistem. Memiliki kewenangan manajemen user, konfigurasi server dan
    monitoring engine, modifikasi pengaturan notifikasi n8n, hak
    penghapusan data aset (*soft delete*), dan audit log inspeksi.

2.  **Admin:** Pengguna operasional teknis Teknolab. Berwenang mengelola
    data inventaris aset (menambah, mengubah informasi aset,
    mendaftarkan lokasi), memperbarui konfigurasi parameter monitoring
    dasar, serta melihat seluruh riwayat gangguan dan laporan. Admin
    **tidak memiliki izin menghapus aset** atau mengubah akun user lain.

3.  **Member / Viewer:** Personil magang, operator monitoring, atau
    manajemen yang memerlukan hak akses pemantauan saja (*read-only*).
    Dapat melihat dashboard utama, daftar perangkat, grafik performa,
    denah lokasi, dan mengunduh laporan tanpa hak memodifikasi
    konfigurasi atau data aset.

**3.2 Matriks Hak Akses (CRUD & Execution Matrix)**

  --------------------------------------------------------------------------
  **Modul / Aktivitas             **Super        **Admin**     **Member /
  Operasional**                   Admin**                      Viewer**
  ------------------------------- -------------- ------------- -------------
  **Melihat Dashboard & Statistik Ya (Full)      Ya (Full)     Ya
  Ringkasan**                                                  (Read-Only)

  **Melihat Daftar Aset & Detail  Ya (Full)      Ya (Full)     Ya
  Perangkat**                                                  (Read-Only)

  **Melihat Denah / Peta Lokasi   Ya (Full)      Ya (Full)     Ya
  Aset**                                                       (Read-Only)

  **Melihat Log Riwayat           Ya (Full)      Ya (Full)     Ya
  Monitoring & Insiden**                                       (Read-Only)

  **Mengunduh Laporan (CSV /      Ya             Ya            Ya
  PDF)**                                                       

  **Menambah Data Aset Baru**     Ya             Ya            Tidak

  **Mengubah Data Aset (*Edit     Ya             Ya            Tidak
  Field*)**                                                    

  **Menghapus Aset (*Soft         **Ya** (Wajib  **Tidak**     **Tidak**
  Delete*)**                      Konfirmasi)                  

  **Mengelola Akun Pengguna       **Ya**         **Tidak**     **Tidak**
  (*User Management*)**                                        

  **Mengubah Konfigurasi Polling  Ya             Terbatas      Tidak
  Monitoring**                                   (Interval     
                                                 Saja)         

  **Mengonfigurasi Integrasi      Ya             Tidak         Tidak
  Notifikasi (Token/Webhook)**                                 

  **Mengakses System & Security   Ya             Tidak         Tidak
  Audit Logs**                                                 

  **Memicu Manual Backup &        Ya             Tidak         Tidak
  Restore Database**                                           
  --------------------------------------------------------------------------

**3.3 Prinsip Keamanan & Tata Kelola Akses**

- **Prinsip Least Privilege:** Hak akses yang diberikan kepada setiap
  role dibatasi hanya sebesar kebutuhan operasional masing-masing.

- **Audit Trail Immutability:** Setiap operasi manipulasi data aset
  (tambah, edit, hapus logis) dan login/logout wajib dicatat ke tabel
  audit_trail dengan mencatat user_id, ip_address, action, old_value,
  dan new_value.

- **Soft Delete Pattern:** Penghapusan data aset tidak pernah
  mengeksekusi perintah SQL DELETE fisik, melainkan menandai atribut
  deleted_at = NOW() dan is_active = FALSE untuk menjaga integritas
  relasi log monitoring lama.

- **Session Management:** Autentikasi berbasis JSON Web Token (JWT) yang
  disimpan di HTTP-Only Cookie dengan batas kedaluwarsa sesi (*session
  timeout*) otomatis setelah periode idle 60 menit.

**BAB 4: KEBUTUHAN SISTEM (SYSTEM REQUIREMENTS)**

**4.1 Kebutuhan Fungsional (*Functional Requirements* / FR)**

- **FR-01:** Sistem dapat melakukan Create, Read, Update, dan Soft
  Delete data inventaris aset dengan validasi integritas kode unik
  (Asset Code) dan kepatuhan 12 field minimal.

- **FR-02:** Sistem memiliki Monitoring Engine background daemon yang
  mampu menjalankan polling koneksi terjadwal menggunakan protokol ICMP
  Ping, HTTP Health Check, SNMP, dan TCP Socket.

- **FR-03:** Sistem mampu memperbarui field Last Seen secara otomatis
  seketika data respons atau sinyal heartbeat diterima dari perangkat
  target.

- **FR-04:** Sistem mampu mengukur waktu respons latensi jaringan (dalam
  milidetik / ms) per siklus pengujian dan menyimpan historinya untuk
  visualisasi tren performa.

- **FR-05:** Sistem mampu mencatat setiap perubahan status perangkat ke
  dalam tabel monitoring_logs dan menyediakan antarmuka pencarian dengan
  filter tanggal, kategori aset, dan status.

- **FR-06:** Sistem mampu menghitung metrik uptime, downtime, dan
  persentase availability bulanan/mingguan serta mengurutkan daftar 5
  perangkat dengan frekuensi insiden terbanyak (Top Problematic).

- **FR-07:** Sistem menyediakan antarmuka Dashboard utama yang
  menyajikan ringkasan jumlah perangkat aktif (Online), terganggu
  (Offline/Warning), grafik tren 10 hari, dan donat distribusi kategori.

- **FR-08:** Sistem menyediakan visualisasi denah lantai (floorplan)
  atau zona lokasi aset dengan penanda titik interaktif yang berubah
  warna secara real-time mengikuti status perangkat.

- **FR-09:** Sistem mampu menembakkan webhook insiden secara otomatis
  menuju n8n untuk diteruskan sebagai notifikasi instan Telegram/Email
  ketika perangkat mati (Offline) dan pulih kembali (Recovery).

- **FR-10:** Sistem menerapkan autentikasi pengguna dengan otorisasi
  bertingkat (Super Admin, Admin, Member) serta logging audit trail
  untuk semua tindakan administratif.

- **FR-11:** Sistem mampu mengekspor data rekapitulasi inventaris, log
  insiden, dan metrik ketersediaan infrastruktur ke dalam format file
  terstandarisasi CSV dan PDF.

- **FR-12:** Sistem terintegrasi dengan workflow AI Assistant untuk
  menganalisis rekaman histori mingguan dan menghasilkan laporan
  rekomendasi preventif perbaikan infrastruktur secara otomatis.

- **FR-13:** Sistem menyediakan endpoint Ingestion Heartbeat (MQTT
  Broker & REST HTTP) untuk menerima payload periodik (30-60 detik) dari
  node IoT (ESP32 / Raspberry Pi).

**4.2 Kebutuhan Non-Fungsional (*Non-Functional Requirements* / NFR)**

  ---------------------------------------------------------------------------------------
  **Kode**     **Dimensi Kualitas**  **Spesifikasi Target & Kriteria Uji**
  ------------ --------------------- ----------------------------------------------------
  **NFR-01**   **Performance**       Waktu muat awal (*Initial Page Load*) Dashboard \< 3
                                     detik; eksekusi query agregasi statistik status \< 2
                                     detik pada dataset 10.000 log.

  **NFR-02**   **Availability**      Monitoring Engine berjalan 24 jam non-stop sebagai
                                     background service dengan mekanisme *Process Manager
                                     / Systemd Auto-Restart* jika terjadi crash.

  **NFR-03**   **Security**          Semua transmisi data via web diproteksi HTTPS/TLS;
                                     seluruh kredensial database dan API key disimpan
                                     pada environment variable (.env); implementasi role
                                     security RBAC.

  **NFR-04**   **Reliability**       Integritas data terjamin melalui transaksi database
                                     relasional; skema pencadangan (*backup database*)
                                     dieksekusi secara otomatis setiap hari pukul 02:00
                                     WIB.

  **NFR-05**   **Scalability**       Mampu memonitor hingga 100+ perangkat simultan
                                     dengan interval polling 60 detik tanpa lonjakan
                                     utilisasi CPU server melebihi 70%.

  **NFR-06**   **Maintainability**   Source code mengikuti kaidah modularitas yang bersih
                                     (*clean code*); struktur folder seragam; setiap
                                     perubahan dipetakan melalui pesan commit Git yang
                                     jelas.

  **NFR-07**   **Usability**         Antarmuka intuitif dan responsif pada layar desktop
                                     (min. 1366x768) dan tablet; konsistensi warna status
                                     baku: **Hijau (Online)**, **Merah (Offline)**,
                                     **Kuning (Warning)**, **Abu-abu (Unknown)**.

  **NFR-08**   **Recoverability**    Prosedur Disaster Recovery teruji: waktu pemulihan
                                     basis data dari snapshot cadangan terakhir
                                     (*Recovery Time Objective / RTO*) \< 15 menit.

  **NFR-09**   **Documentation**     Setiap kode program, skrip integrasi, dan skema
                                     migrasi wajib dilengkapi dokumen petunjuk instalasi,
                                     kontrak API Swagger/Postman, dan laporan pengujian.

  **NFR-10**   **Auditability**      Sistem wajib merekam jejak audit (*user id,
                                     timestamp, endpoint, action, modified values*) pada
                                     setiap mutasi data sensitif.
  ---------------------------------------------------------------------------------------

**4.3 Standar Logika Status & Penentuan Keputusan (*Status Decision
Rules*)**

Status perangkat pada dashboard T-AIMS ditentukan secara terukur
berdasarkan aturan teknis berikut:

- **Aturan Transisi Status:**

  - ONLINE: Perangkat merespons uji polling secara sukses dalam ambang
    batas wajar, atau sinyal heartbeat diterima dalam interval waktu
    yang ditentukan.

  - WARNING: Perangkat merespons tetapi latensi response time melebihi
    batas ambang (*threshold latency*, misal \> 500ms), atau terjadi
    packet loss berkisar 1% - 49%.

  - OFFLINE: Perangkat gagal merespons uji polling sebanyak 3 kali
    percobaan beruntun (*retry logic = 3*), atau selisih waktu
    (current_time - last_seen) melebihi ambang batas heartbeat (default:
    120 detik).

  - UNKNOWN: Perangkat baru didaftarkan ke sistem dan belum pernah
    melalui siklus pengecekan pertama, atau metode pemantauan belum
    dikonfigurasi.

**BAB 5: SYSTEM ARCHITECTURE & BLOCK DIAGRAM**

**5.1 System Architecture Multi-Layer (6 Layer Target)**

Arsitektur sistem T-AIMS dirancang menggunakan pendekatan modular
terdistribusi 6-Layer:

1.  **Layer 1 (Device / Asset Layer):** Seluruh perangkat keras dan
    servis Teknolab yang menjadi objek pengawasan, bertindak sebagai
    produsen data (*data producer*).

2.  **Layer 2 (Network & Monitoring Engine Layer):** Mesin pekerja
    (*worker daemon*) yang mengoleksi metrik performa secara proaktif
    (*pull/polling via ICMP, HTTP, SNMP*) maupun pasif (*push heartbeat
    via MQTT/HTTP*).

3.  **Layer 3 (Database & Backend API Layer):** Inti pemrosesan server
    yang menyediakan REST API terstandarisasi, validasi data, mekanisme
    otentikasi JWT, dan penyimpanan relasional persisten.

4.  **Layer 4 (Web Dashboard Layer):** Antarmuka pengguna (*Single Page
    Application*) yang menyajikan visualisasi data, peta lokasi
    interaktif, dan kontrol administratif.

5.  **Layer 5 (Alert, History & Report Layer):** Lapisan evaluasi
    kejadian insiden, pencatatan log historis, pengontrol antispam,
    serta kompilasi dokumen laporan.

6.  **Layer 6 (AI Automation Layer):** Mesin orkestrasi n8n yang
    menghubungkan webhook sistem dengan kecerdasan buatan (LLM) untuk
    sintesis rekomendasi teknis serta pengiriman notifikasi instan.

**5.2 Block Diagram Komponen Sistem Teknis**

Arsitektur teknis menghubungkan Perangkat Lapangan (ESP32, RPi, Router,
Server) melalui Protokol Transportasi (MQTT, ICMP, HTTP, SNMP) menuju
Server Utama T-AIMS (Mosquitto MQTT Broker, Poller Service, REST API
Core, PostgreSQL/MySQL Database). Server berinteraksi secara
bi-directional dengan Frontend Web Application (Dashboard, Asset View,
Floorplan Map) dan mengirimkan event webhook ke Automation &
Notification Cluster (n8n, LLM Engine, Telegram Bot, SMTP Mail).

**5.3 Topologi Jaringan & Penempatan Komponen**

Dalam lingkungan produksi PT Teknolab Caraka Internasional, arsitektur
jaringan dibagi menjadi tiga zona keamanan:

1.  **Zona IoT & Peripheral (Subnet 192.168.10.0/24):** Berisi node
    mikrokontroler ESP32 dan Raspberry Pi yang berkomunikasi dengan
    Broker MQTT melalui Wi-Fi internal.

2.  **Zona Jaringan & Server Lab (Subnet 192.168.1.0/24):** Berisi
    switch manageable, router MikroTik, access point, server mini PC,
    dan service web internal.

3.  **Zona Server Monitoring T-AIMS (Production Host):** Menjalankan
    container/layanan Docker terisolasi yang mengeksekusi Mosquitto
    Broker, Database Server, Backend API, Web Dashboard, dan n8n
    Workflow runner yang diakses aman melalui Nginx Reverse Proxy dengan
    enkripsi SSL/HTTPS.

**BAB 6: DATA FLOW ARCHITECTURE (DFD & SEQUENCE FLOWS)**

**6.1 Data Flow Diagram (DFD) Level 0 / Context Diagram**

Context diagram menggambarkan batasan sistem T-AIMS yang berinteraksi
langsung dengan:

- **Pengguna / Operator IT:** Mengirimkan kredensial login, data aset,
  konfigurasi threshold; Menerima visualisasi dashboard, status map, dan
  laporan.

- **Perangkat Infrastruktur:** Menerima probe ICMP/HTTP/SNMP;
  Mengembalikan status reply dan OID metrics.

- **Node IoT Embedded:** Mengirimkan push heartbeat JSON payload
  periodik.

- **n8n Automation & AI Engine:** Menerima trigger webhook insiden dan
  log historis; Mengirimkan pesan alert terformat dan analisis AI ke
  Telegram & Email.

**6.2 Data Flow Diagram (DFD) Level 1**

DFD Level 1 menguraikan sistem T-AIMS ke dalam 5 proses komputasi utama:

1.  **1.0 Manajemen Aset & Otentikasi:** Verifikasi role pengguna dan
    pengelolaan data master inventaris aset.

2.  **2.0 Monitoring Engine (Polling):** Polling koneksi periodik
    (Ping/HTTP/SNMP) ke perangkat target dan pembaruan log status.

3.  **3.0 Ingestion Heartbeat IoT:** Listener payload keepalive dari
    ESP32/RPi serta evaluasi timeout.

4.  **4.0 Penanganan Insiden & Notifikasi:** Deteksi perubahan status,
    penyaringan cooldown anti-spam, dan penembakan webhook insiden.

5.  **5.0 Agregasi Dashboard, Reporting & AI:** Kalkulasi ketersediaan
    (uptime/downtime), pembuatan laporan PDF/CSV, dan penyiapan feed
    data mingguan untuk analisis AI.

**6.3 Sequence Diagram Summary**

1.  **Alur Monitoring Jaringan:** Poller mengambil daftar target -\>
    Eksekusi probe ke target -\> Evaluasi respons -\> Jika gagal 3x
    berturut-turut, tandai status OFFLINE dan pemicu insiden.

2.  **Alur IoT Heartbeat & Timeout:** Node mem-push heartbeat tiap 30
    detik -\> DB update last_seen -\> Watchdog memantau jika delta time
    \> 120 detik maka otomatis diubah ke OFFLINE dan memicu alert.

3.  **Alur Incident Alert & Recovery:** Event insiden diterima -\>
    Evaluasi Cooldown (10 menit) -\> Kirim Webhook ke n8n -\> Telegram
    Alert terkirim -\> Perangkat pulih -\> Log recovery dicatat dan
    durasi downtime dihitung.

4.  **Alur AI Assistant:** Trigger mingguan n8n -\> Request digest dari
    Reporting API -\> Kirim prompt dan data ke LLM Engine -\> Terima
    rekomendasi teknis -\> Broadcast ke Telegram Admin Channel.

**BAB 7: PERANCANGAN DATA & MODUL DATABASE MINIMUM**

**7.1 Modul Basis Data Minimum**

Struktur database T-AIMS terdiri atas 8 modul tabel utama:

1.  assets: Master data inventaris aset, target IP/metode, dan status
    terkini.

2.  monitoring_logs: Log historis time-series setiap inspeksi
    konektivitas.

3.  incidents: Tracking daur hidup insiden (start, end, duration, root
    cause).

4.  locations: Data master zonasi, gedung, lantai, dan file
    denah/floorplan.

5.  users: Kredensial terenkripsi, RBAC role, dan status akun pengguna.

6.  notifications: Log pengiriman peringatan ke Telegram/Email.

7.  maintenance: Agenda jadwal pemeliharaan dan riwayat servis teknis.

8.  audit_trail: Audit trail aktivitas perubahan data (aktor, aksi,
    timestamp, IP).

**BAB 8: TATA KELOLA ANTAR-SHIFT & TIM KERJA**

**8.1 Prinsip Kolaborasi: \"Satu Sistem, Bukan Dua Project\"**

- **Satu Git Repository:** Seluruh tim bekerja di repositori monorepo
  terpusat.

- **Satu Database Bersama:** Skema basis data terintegrasi dan
  konsisten.

- **Satu Kontrak API:** Frontend dan Backend mengacu pada dokumentasi
  API Contract baku.

- **Satu Standar Desain:** Antarmuka web mengadopsi Design System
  seragam.

- **Satu Project Board:** Pelacakan tiket kerja dan bug dipusatkan pada
  Kanban Board bersama.

**8.2 Pembagian Peran Tim PKL (11 Anggota)**

- **Shift 1 (07.00 - 16.00 WIB):**

  - **Damar Munajad:** Project Coordinator & System Analyst

  - **Ahmad Reza Fahmi:** Backend & API Developer

  - **Faida Trisma Amelia:** Database & Asset Management Engineer

  - **Ilvina Muvarika:** IoT & Device Integration Engineer

  - **Ananda Dwi Susanti:** Network & Device Monitoring Engineer

- **Shift 2 (16.00 - 01.00 WIB):**

  - **Dzakwan:** Shift Lead & System Integration

  - **Dika Yoga:** Frontend Dashboard Developer

  - **Ahmad Aziz:** UI/UX & Data Visualization Engineer

  - **Arik:** Automation & Notification Engineer

  - **Wafian:** DevOps, Server & Security Engineer

  - **Reza Tri:** QA, Testing & Documentation Engineer

**8.3 Jadwal Handover Antar-Shift**

- **Shift 1 ke Shift 2:** 15.30 -- 16.00 WIB (Damar Munajad -\> Dzakwan)

- **Shift 2 ke Shift 1:** 00.30 -- 01.00 WIB (Dzakwan -\> Damar Munajad)

**BAB 9: ROADMAP 30 HARI & DEFINITION OF DONE (DoD)**

**9.1 Ringkasan Roadmap**

- **Hari 1--5:** Project Kick-Off, Requirements, Arsitektur, dan DDL
  Database.

- **Hari 6--10:** Wireframe UI, Backend Core, Asset REST API, & Auth.

- **Hari 11--14:** Monitoring Engine Poller & Ingestion Heartbeat IoT.

- **Hari 15--19:** Frontend Integration, Floorplan View, History, &
  Uptime Analytics.

- **Hari 20 (MILESTONE):** **MVP Release (12 Fitur Inti Terintegrasi
  Penuh).**

- **Hari 21--26:** n8n Notifications, Debounce, AI Assistant, Executive
  Reports, & Security Hardening.

- **Hari 27:** **Failure Simulation Wajib (Uji Pemadaman Fisik).**

- **Hari 28--30:** Bug Fixing, Dokumentasi Teknis/User Manual, &
  Presentasi Final.

**9.2 Definition of Done (DoD)**

Kriteria baku penyelesaian tiket tugas:

1.  Code & Configuration ter-commit dan lolos build tanpa error.

2.  Terintegrasi penuh dengan Database/API sistem (bebas dummy data).

3.  Lolos uji skenario positif dan negatif oleh QA.

4.  Terdokumentasi pada API contract / data dictionary.

5.  Memiliki instruksi restart/recovery otomatis.

6.  Siap dan layak digunakan oleh operasional PT Teknolab Caraka
    Internasional.

**BAB 10: MANAJEMEN RISIKO & KONTINGENSI**

**10.1 Analisis Risiko Utama & Mitigasi**

1.  **Scope Creep:** Mengunci 12 fitur minimum dan menolak fitur baru di
    luar scope sebelum MVP Hari ke-20.

2.  **Miskomunikasi Handover:** Mengaplikasikan formulir Daily Handover
    baku beserta bukti link commit Git.

3.  **Backend Bottleneck:** Menetapkan dokumen kontrak API paling lambat
    Hari ke-5 dan mengaktifkan mock server untuk Frontend.

4.  **Kebocoran Kredensial:** Mewajibkan penggunaan file .env dan
    proteksi .gitignore.

**BAB 11: CHECKLIST PEKERJAAN DAMAR MUNAJAD (PROJECT COORDINATOR &
SYSTEM ANALYST)**

- \[x\] Menyusun Dokumen Requirement System resmi
  (T-AIMS/REQ/2026/V1.2).

- \[x\] Mengunci ruang lingkup 12 fitur minimum wajib.

- \[x\] Menetapkan matriks klasifikasi 10 tipe perangkat dan standar 12
  metadata aset.

- \[x\] Merumuskan RBAC kontrol peran pengguna dan matriks hak akses.

- \[x\] Memodelkan Arsitektur Multi-Layer 6-Layer terdistribusi.

- \[x\] Menyusun Block Diagram, DFD Context, DFD Level 1, dan Sequence
  Diagrams.

- \[x\] Menetapkan aturan dan prosedur Daily Handover antar-shift.

*Dokumen ini diterbitkan secara resmi untuk PT Teknolab Caraka
Internasional --- Proyek T-AIMS 2026.*
