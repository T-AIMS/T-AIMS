**LAPORAN PERANCANGAN ARSITEKTUR SISTEM**

**Sistem Pemantauan Aset dan Infrastruktur (T-AIMS)**\
**Disusun Oleh:**Damar Munajad\
*Project Coordinator & System Analyst*

**BAB I: DOKUMENTASI ARSITEKTUR SISTEM**

**1.1 Gambaran Umum**

Sistem **T-AIMS (Teknolab Asset & Infrastructure Monitoring System)**
dirancang menggunakan pendekatan arsitektur berlapis (*layered
architecture*). Desain arsitektur ini bertujuan untuk menjamin
keandalan, skalabilitas, serta kemudahan dalam pengelolaan dan
pemeliharaan sistem pemantauan infrastruktur IT secara *real-time*.

Arsitektur T-AIMS terdiri dari 6 (enam) lapisan utama yang saling
terintegrasi secara hierarkis, mulai dari lapisan perangkat fisik pada
tingkat terbawah hingga lapisan otomatisasi berbasis kecerdasan buatan
(*Artificial Intelligence*) pada tingkat teratas.

**1.2 Diagram Arsitektur Sistem**

**Gambar 1.1** *Diagram Arsitektur Berlapis T-AIMS (Layered
Architecture)*
![](./gambar/media/image1.png){width="4.828860454943132in"
height="3.9791666666666665in"}

**1.3 Spesifikasi dan Fungsi Lapisan Sistem**

**1. Layer 6 --- AI Automation (Lapisan Otomatisasi dan Kecerdasan
Buatan)**

- **Komponen Utama:** *n8n Workflow Automation, LLM Engine, Telegram &
  Email Gateway.*

- **Deskripsi Fungsi:** Lapisan teratas yang bertanggung jawab atas
  otomatisasi alur kerja dan analisis cerdas. Lapisan ini menerima
  pemicu (*webhook*) dari sistem saat terjadi insiden untuk dianalisis
  oleh *LLM Engine* guna mengidentifikasi akar permasalahan (*root cause
  analysis*). Selain itu, lapisan ini mengotomatiskan pengiriman
  rekomendasi tindakan serta notifikasi proaktif kepada tim teknis
  melalui Telegram dan Email.

**2. Layer 5 --- Alert, History & Report (Lapisan Peringatan, Riwayat,
dan Pelaporan)**

- **Komponen Utama:** *Incident Handler, Cooldown System, Report
  Generator.*

- **Deskripsi Fungsi:** Lapisan yang bertugas mengelola siklus insiden
  dan pelaporan performa. *Incident Handler* mencatat setiap perubahan
  status perangkat, sementara *Cooldown System* berfungsi membatasi
  frekuensi peringatan guna mencegah *spam notification*. Lapisan ini
  juga memproses data historis menjadi laporan rekapitulasi *uptime* dan
  *downtime* infrastruktur secara berkala.

**3. Layer 4 --- Web Dashboard (Lapisan Antarmuka Pengguna)**

- **Komponen Utama:** *Executive Dashboard, Asset Management View,
  Floorplan Map.*

- **Deskripsi Fungsi:** Menyediakan antarmuka visual berbasis web untuk
  memudahkan pengguna dalam memantau dan mengelola infrastruktur.
  Lapisan ini melakukan permintaan data (*API Request*) ke *backend*
  guna menyajikan visualisasi status perangkat secara *real-time*,
  manajemen inventaris aset, serta pemetaan lokasi fisik perangkat pada
  *floorplan map*.

**4. Layer 3 --- Database & Backend API (Lapisan Backend dan Penyimpanan
Data)**

- **Komponen Utama:** *RESTful API, Auth JWT (JSON Web Token),
  PostgreSQL / MySQL.*

- **Deskripsi Fungsi:** Merupakan pusat pemrosesan logika bisnis dan
  keamanan sistem. Lapisan ini menyediakan *endpoint REST API* untuk
  melayani pertukaran data dengan *frontend*, mengamankan hak akses
  pengguna menggunakan autentikasi berbasis *JWT*, serta mengelola
  penyimpanan data terstruktur mencakup log pemantauan, data aset, dan
  riwayat insiden dalam database relasional.

**5. Layer 2 --- Network & Monitoring Engine (Lapisan Mesin Pemantau
Jaringan)**

- **Komponen Utama:** *MQTT Broker, Poller Service, Heartbeat Receiver.*

- **Deskripsi Fungsi:** Bertanggung jawab atas akuisisi data status dan
  kesehatan perangkat di jaringan. Lapisan ini mengeksekusi inspeksi
  berkala (*polling*), menerima sinyal keberadaan perangkat
  (*heartbeat/last seen*), serta memproses lalu lintas data telemetri
  berbasis protokol ringan *MQTT* sebelum diteruskan ke lapisan
  penyimpanan data.

**6. Layer 1 --- Device / Asset (Lapisan Perangkat dan Aset Fisik)**

- **Komponen Utama:** *Server, Raspberry Pi (RPi), MikroTik, Managed
  Switch, Access Point (AP), Mikrokontroler ESP32.*

- **Deskripsi Fungsi:** Lapisan fisik terdasar yang mencakup seluruh
  objek infrastruktur dan perangkat *IoT* yang dipantau oleh T-AIMS.
  Setiap perangkat pada lapisan ini secara aktif merespons permintaan
  *polling* atau mengirimkan sinyal status operasional secara berkala ke
  mesin pemantau.

**1.4 Alur Interaksi Data (Data Flow Overview)**

1.  **Pengumpulan Data:** Perangkat pada *Layer 1* merespons *polling*
    atau mengirim sinyal *heartbeat* ke *Layer 2*.

2.  **Penyimpanan Log:** *Layer 2* memproses data status dan mencatatnya
    ke dalam database di *Layer3*.

3.  **Visualisasi Data:** *Layer 4* melakukan *API request* ke *Layer 3*
    untuk menampilkan status infrastruktur pada *dashboard*.

4.  **Penanganan Insiden:** Jika terjadi kegagalan perangkat, *Layer 5*
    menerima log insiden dan menerapkan *cooldown* sebelum memicu
    peringatan.

5.  **Analisis Cerdas:** *Layer 5* meneruskan sinyal insiden (*webhook*)
    ke *Layer 6* untuk dianalisis oleh AI dan dikirimkan sebagai
    notifikasi rekomendasi ke Telegram/Email.
