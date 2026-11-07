# DOKUMEN DESAIN SKEMATIK & SISTEM TRAINER 7 (KOPER BESAR)
**Proyek:** Trainer Kit Mikrokontroler Arduino Uno R3 / Nano (ATmega328P)  
**Tim Pengembang:** Dzakwan & Wafian  
**Kode Trainer:** Trainer 7 (Koper Besar)  
**Catatan Khusus Mentor:** Dilengkapi Sekring Pengaman Otomatis (*Resettable Fuse / PPTC*) & Sistem Proteksi Total

---

## 1. PENDAHULUAN & PRINSIP DESAIN

Trainer Kit Mikrokontroler ini dirancang untuk kebutuhan praktikum edukasi elektronika dan sistem embedded. Mengingat pengguna trainer adalah siswa/mahasiswa yang sering melakukan kesalahan pengkabelan (*wiring errors*), trainer ini mengusung 2 prinsip utama:
1. **Proteksi Kelistrikan Aktif & Pasif (*Fail-Safe*)**: Melindungi Arduino, regulator, dan modul dari korsleting (*short circuit*), polaritas terbalik (*reverse polarity*), dan arus lebih (*overcurrent*) menggunakan **Sekring Otomatis (PPTC Polyfuse)**.
2. **Arsitektur Modular Breakout**: Arduino Uno/Nano tidak disolder paten ke satu modul tertentu, melainkan seluruh pin I/O dan jalur catu daya di-breakout menggunakan **Pin Header 2.54mm** dan **Screw Terminal**. Pengguna memprogram dan merangkai menggunakan kabel jumper Dupont.

---

## 2. SKEMA CATU DAYA & SISTEM PROTEKSI SEKRING OTOMATIS (CATATAN MENTOR)

### 2.1. Spesifikasi Komponen Proteksi & Power Supply
* **Input Daya:** DC Power Jack 5.5×2.1 mm (Adaptor DC 9V–12V, minimal 2A).
* **Proteksi Polaritas Terbalik:** Dioda Schottky 1N5822 (3A, 40V) atau Dioda Penyearah 1N5408 (3A).
* **Sekring Otomatis (Resettable Fuse / PPTC):**
  * Tipe: Polymeric Positive Temperature Coefficient (PPTC) Radial Lead (contoh: seri Bourns MF-R160 atau RXEF160).
  * Arus Tahan (*Hold Current, $I_{hold}$*): **1.6A**.
  * Arus Pemutus (*Trip Current, $I_{trip}$*): **3.2A**.
  * Tegangan Maksimum ($V_{max}$): **30V - 60V**.
  * *Cara Kerja:* Saat terjadi korslet / kelebihan beban, PPTC memanas cepat dan resistansinya melonjak drastis (dari $\approx 0.05\,\Omega$ menjadi puluhan kilo-ohm), membatasi arus ke tingkat aman tanpa putus permanen. Setelah beban berlebih/korslet dicabut, komponen mendingin dan otomatis kembali konduktif normal.
* **Indikator Trip Otomatis (Visual Fault Detector):**
  * LED Merah dipasang paralel melintasi kedua kaki Sekring Otomatis (seri dengan Resistor $1\,\text{k}\Omega$).
  * *Status Normal:* Resistansi sekring sangat kecil ($\approx 0.05\,\Omega$), arus lewat sekring, LED Merah mati.
  * *Status Trip/Korslet:* Sekring beresistansi sangat tinggi, beda potensial muncul di kedua kaki sekring, memicu arus kecil menyalakan LED Merah (**Indikator "SHORT / FAULT" AKTIF**).
* **Regulator Tegangan Utama:**
  * **Jalur 5V:** Modul Step-Down DC-DC LM2596 (Buck Converter) dengan efisiensi tinggi $\approx 90\%$ (mampu memasok arus hingga 3A untuk Motor DC, Servo SG90, LCD, dan Relay tanpa panas berlebih) atau IC Linier LM7805 dengan Heatsink Aluminium tebal.
  * **Jalur 3.3V:** IC Regulator LDO AMS1117-3.3V (kapasitas 800mA) untuk sensor berbasis 3.3V.
* **Filtering & Decoupling:** Kapasitor Elektrolit $470\,\mu\text{F}/25\text{V}$ di input, $220\,\mu\text{F}/16\text{V}$ di output 5V, serta Kapasitor Keramik $100\,\text{nF}$ (0.1 $\mu\text{F}$) paralel untuk meredam noise induktif dari motor.

### 2.2. Diagram Rangkaian Catu Daya & Proteksi Sekring

```
[DC JACK 9-12V] (+) ----[ SAKLAR UTAMA ]----+---->|---[ DIODA 1N5822 ]----+
                                                                           |
                                            +---[ R 1k ]---( LED MERAH )---+ (Fault Trip)
                                            |                              |
                                            +----[ SEKRING PPTC 1.6A ]-----+
                                                                           |
                                                                           +----(+) BUS RAW 9-12V
                                                                           |
                                      +------------------------------------+
                                      |
                           [ REGULATOR 5V (LM2596) ]
                                      |
                                      +----[ CAP 220uF + 100nF ]-----------+----(+) BUS 5V REGULATED
                                      |                                    |
                                      |                         [ REGULATOR 3.3V (AMS1117) ]
                                      |                                    |
                                      |                                    +----(+) BUS 3.3V REGULATED
                                      |
[DC JACK GND] (-) --------------------+------------------------------------+----(-) COMMON GND BUS
```

---

## 3. ARSITEKTUR KONEKSI MODUL & INTERFACING

### 3.1. Core Controller: Arduino Uno R3 / Nano
* **Daya:** Pin VIN dihubungkan ke Bus 9-12V (terproteksi sekring) ATAU pin 5V dihubungkan langsung ke Bus 5V Regulated eksternal. Common Ground dihubungkan ke GND Bus.
* **Pin Breakout:** Seluruh pin digital (D0 - D13) dan analog (A0 - A5) dihubungkan ke soket/header ekspansi 3-pin standar sensor (Signal, VCC, GND) dan baris pin header ganda (Female & Male) untuk kemudahan penancapan jumper.

---

### 3.2. Rangkaian Modul Input

1. **Push Button (4–8 Unit):**
   * Rangkaian per switch: Switch Tactile 12×12 mm.
   * Konfigurasi: Active-High dengan Resistor Pull-Down $10\,\text{k}\Omega$ ke GND (atau Active-Low ke GND memanfaatkan internal pull-up Arduino).
   * Pin Header: Terminal pin `BTN1`, `BTN2`, `BTN3`, `BTN4` (hingga `BTN8`).
2. **Matrix Keypad 4×4:**
   * 8 Pin Header langsung:
     * Baris: `ROW1`, `ROW2`, `ROW3`, `ROW4`
     * Kolom: `COL1`, `COL2`, `COL3`, `COL4`
   * Proteksi: Dioda clamping internal mikrokontroler.
3. **Potensiometer 10kΩ (2 Unit):**
   * Pin 1: Bus 5V
   * Pin 2 (Wiper/Tengah): Header `POT1_OUT` dan `POT2_OUT` (untuk dibaca pin Analog Arduino A0-A3)
   * Pin 3: Common GND
4. **Sensor Suhu & Kelembaban (DHT11 / DHT22):**
   * Pin 1 (VCC): 5V
   * Pin 2 (Data): Header `DHT_DATA` (dipasangi Resistor Pull-Up $4.7\,\text{k}\Omega - 10\,\text{k}\Omega$ ke 5V)
   * Pin 3 (NC): Tidak terkoneksi
   * Pin 4 (GND): Common GND
5. **Sensor Jarak Ultrasonik HC-SR04:**
   * VCC: 5V
   * Trig: Header `ULTRA_TRIG`
   * Echo: Header `ULTRA_ECHO`
   * GND: Common GND
6. **Sensor Cahaya LDR (Light Dependent Resistor):**
   * Rangkaian Pembagi Tegangan: LDR dipasang seri dengan Resistor $10\,\text{k}\Omega$ ke GND.
   * Titik sambung tengah (V-Out) dikeluarkan ke Header `LDR_ANALOG`.
7. **Sensor Gerak PIR (HC-SR501):**
   * VCC: 5V
   * OUT: Header `PIR_OUT` (Output logika Digital 3.3V, kompatibel TTL 5V Arduino)
   * GND: Common GND

---

### 3.3. Rangkaian Modul Output & Display

1. **LCD 16×2 + Modul I2C Backpack (PCF8574):**
   * VCC: 5V
   * GND: Common GND
   * SDA: Header `I2C_SDA` (dihubungkan ke Pin A4 Arduino Uno/Nano)
   * SCL: Header `I2C_SCL` (dihubungkan ke Pin A5 Arduino Uno/Nano)
   * *Catatan:* Modul I2C menghemat penggunaan pin dari 16 pin menjadi hanya 2 pin I/O!
2. **4-Digit Seven Segment + Driver (TM1637 / 74HC595):**
   * VCC: 5V
   * GND: Common GND
   * CLK / SCLK: Header `SEG_CLK`
   * DIO / DATA: Header `SEG_DIO`
3. **LED Array 8-Bit:**
   * 8 Buah LED 5mm (Warna Merah/Kuning/Hijau).
   * Masing-masing Anoda LED terhubung ke Resistor Pembatas Arus $220\,\Omega$ atau $330\,\Omega$, lalu ke Pin Header `LED1` sampai `LED8`.
   * Seluruh Katoda LED disatukan ke Common GND (Konfigurasi Active-High).
4. **LED RGB:**
   * Tipe Common Cathode (Katoda ke GND).
   * 3 Pin Anoda (R, G, B) masing-masing melalui Resistor $220\,\Omega$ ke Pin Header `RGB_R`, `RGB_G`, `RGB_B` (dapat dihubungkan ke Pin PWM D3, D5, D6).
5. **Active Buzzer / Piezo Speaker:**
   * Rangkaian Driver Transistor NPN (S8050 / 2N2222):
     * Pin Header `BUZZ_IN` -> Resistor Basis $1\,\text{k}\Omega$ -> Basis Transistor.
     * Emitter -> Common GND.
     * Collector -> Pin Negatif Buzzer.
     * Pin Positif Buzzer -> Bus 5V.
     * Dioda 1N4148 dipasang antiparalel pada terminal buzzer untuk membuang EMF balik induktif.

---

### 3.4. Rangkaian Aktuator & Driver Motor

1. **Motor Servo SG90:**
   * Kabel Merah (VCC): **Bus 5V dari Regulator Eksternal LM2596** (*JANGAN dari pin 5V Arduino langsung agar mikrokontroler tidak restart/brownout saat motor berputar*).
   * Kabel Cokelat/Hitam (GND): Common GND.
   * Kabel Oranye/Kuning (Signal): Header `SERVO_SIG` (dihubungkan ke Pin PWM Arduino seperti D9 / D10).
2. **Driver Motor L293D & Motor DC 5V:**
   * VCC1 (Logic): Bus 5V Regulated.
   * VCC2 (Power Motor): Bus 5V Regulated atau Bus 9V/12V RAW.
   * GND (Pin 4, 5, 12, 13): Common GND.
   * IN1 & IN2: Pin Header `MOT_IN1` dan `MOT_IN2` (arah putar).
   * EN1 (Enable 1): Pin Header `MOT_EN` (kontrol kecepatan PWM, default diberi jumper ke 5V jika kecepatan penuh).
   * OUT1 & OUT2: Terhubung ke Screw Terminal Block 2-Pin untuk kabel Motor DC 5V.
   * Motor DC dilengkapi Kapasitor Keramik $100\,\text{nF}$ pada kutub motor untuk menyerap spark noise motor brush.

---

## 4. TABEL REKOMENDASI PEMETAAN PIN ARDUINO (MASTER PINOUT MATRIX)

Karena trainer menggunakan sistem modular dengan kabel jumper Dupont, siswa bebas merangkai skenario apa saja. Namun, berikut adalah **Tabel Pemetaan Standar (Default Pin Mapping)** jika seluruh modul ingin diuji bersamaan:

| No | Modul Periferal | Pin Arduino Uno / Nano | Tipe Sinyal | Keterangan Fungsi |
|:--:|:----------------|:-----------------------|:-----------:|:------------------|
| 1  | Serial RX / TX | D0, D1 | Digital / UART | Upload program USB & Debug Serial Monitor |
| 2  | Sensor Gerak PIR | D2 | Digital Input | Interrupt INT0 ready |
| 3  | LED RGB - Red | D3 | Digital (PWM) | Kontrol kecerahan warna merah |
| 4  | Sensor DHT11 / DHT22 | D4 | Digital I/O | Pembacaan One-Wire Data suhu/lembab |
| 5  | LED RGB - Green | D5 | Digital (PWM) | Kontrol kecerahan warna hijau |
| 6  | LED RGB - Blue | D6 | Digital (PWM) | Kontrol kecerahan warna biru |
| 7  | 4-Digit 7-Seg CLK | D7 | Digital Output | Clock display TM1637 |
| 8  | 4-Digit 7-Seg DIO | D8 | Digital I/O | Data I/O display TM1637 |
| 9  | Motor Servo SG90 | D9 | Digital (PWM) | Pulse 1ms - 2ms (Servo Library) |
| 10 | Motor DC (PWM Speed) | D10 | Digital (PWM) | Pin EN1 pada Driver L293D |
| 11 | Buzzer Aktif | D11 | Digital (PWM) | Kontrol nada / alarm |
| 12 | Ultrasonik HC-SR04 Trig | D12 | Digital Output | Trigger pulsa 10us |
| 13 | Ultrasonik HC-SR04 Echo | D13 | Digital Input | Mengukur lebar pantulan gelombang |
| 14 | Sensor Cahaya LDR | A0 | Analog Input | Nilai ADC 0–1023 intensitas cahaya |
| 15 | Potensiometer 1 (10k) | A1 | Analog Input | Nilai ADC 0–1023 input analog 1 |
| 16 | Potensiometer 2 (10k) | A2 | Analog Input | Nilai ADC 0–1023 input analog 2 |
| 17 | Push Button Array | A3 | Analog / Digital In | Dapat dibaca via ADC (Resistor Ladder) / I/O |
| 18 | LCD 16x2 I2C (SDA) | A4 | I2C Data | SDA Bus LCD PCF8574 |
| 19 | LCD 16x2 I2C (SCL) | A5 | I2C Clock | SCL Bus LCD PCF8574 |

> **Catatan Fleksibilitas Praktikum:**
> * Untuk praktikum **Matrix Keypad 4×4** (membutuhkan 8 pin), modul dihubungkan ke header D2–D9 saat modul LED RGB, Servo, dan Seven Segment tidak aktif.
> * Untuk praktikum **LED Array 8-Bit**, jumper dihubungkan dari header Arduino D2–D9 ke Pin Header LED Array 1–8.

---

## 5. RANCANGAN LAYOUT PANEL AKRILIK (KOPER BESAR)

Layout dirancang simetris, ergonomis, dan mengelompokkan modul berdasarkan fungsinya (*Zoning System*):

```
+-----------------------------------------------------------------------------------+
|                            TRAINER 7 (KOPER BESAR)                                |
|                        TIM: DZAKWAN & WAFIAN - ARDUINO KIT                        |
+------------------------------------+----------------------------------------------+
| [ ZONA 1: CATU DAYA & PROTEKSI ]   | [ ZONA 2: DISPLAY & INDIKATOR ]              |
|                                    |                                              |
|  [DC JACK] [SAKLAR POWER]          |  +---------------------+   +---------------+ |
|  [FUSE RESIDUAL] [LED FAULT]       |  |  LCD 16x2 I2C       |   | 7-SEGMENT     | |
|  [LM2596 BUCK 5V] [AMS1117 3.3V]   |  |                     |   | 4-DIGIT       | |
|  [TERMINAL BUS: 12V / 5V / 3.3V/G] |  +---------------------+   +---------------+ |
|                                    |  [LED RGB]  [BUZZER]                         |
+------------------------------------+----------------------------------------------+
| [ ZONA 3: CORE CONTROLLER ]        | [ ZONA 4: OUTPUT & AKTUATOR ]                |
|                                    |                                              |
|      +-----------------------+     |  +--------------------+  [ MOTOR DC 5V ]     |
|      |  ARDUINO UNO R3/NANO  |     |  |  DRIVER L293D      |  [ TERMINAL MOTOR]   |
|      |  + USB TYPE-B PORT    |     |  +--------------------+                      |
|      +-----------------------+     |  +--------------------+                      |
|      [HEADER PINOUT D0 - D13]      |  |  MOTOR SERVO SG90  |                      |
|      [HEADER PINOUT A0 - A5 ]      |  +--------------------+                      |
|      [POWER RAILS 5V & GND  ]      |  [ 8-BIT LED ARRAY: O O O O O O O O ]        |
+------------------------------------+----------------------------------------------+
| [ ZONA 5: SENSOR INPUT ]           | [ ZONA 6: MANUAL INPUT & INTERFACES ]        |
|                                    |                                              |
|  [HC-SR04 ULTRASONIK]   [DHT11/22] |  +--------------------+  [POTENSIO 1]        |
|  [LDR SENSOR]           [PIR HC501]|  |  KEYPAD 4x4        |  [POTENSIO 2]        |
|                                    |  |  MATRIX            |                      |
|                                    |  +--------------------+  [PUSH BUTTON 1 - 4] |
+------------------------------------+----------------------------------------------+
```

---

## 6. BILL OF MATERIALS (DAFTAR KOMPONEN & SPESIFIKASI TAMBAHAN)

| No | Komponen Pokok | Spesifikasi Teknis | Qty | Fungsi Utama |
|:--:|:---------------|:-------------------|:---:|:-------------|
| 1  | Arduino Uno R3 / Nano | ATmega328P, 16MHz, CH340/ATmega16U2 | 1 Unit | Unit Mikrokontroler Pusat |
| 2  | DC Power Jack | Female 5.5 × 2.1 mm Panel Mount | 1 Unit | Soket Input Adaptor Eksternal |
| 3  | Sekring Otomatis | PPTC Polyfuse Radial 1.6A Hold / 3.2A Trip | 1 Unit | Proteksi Short Circuit & Overcurrent |
| 4  | Modul Regulator 5V | Buck Converter LM2596 (Output 5V / 3A) | 1 Unit | Step-down efisiensi tinggi untuk Servo & Motor |
| 5  | Modul Regulator 3.3V | LDO AMS1117-3.3V (Output 3.3V / 800mA) | 1 Unit | Suplai sensor 3.3V |
| 6  | Dioda Schottky | 1N5822 (3A 40V) atau 1N5408 | 1 Unit | Proteksi Anti Polaritas Terbalik |
| 7  | Saklar Utama | Rocker Switch 2-Pin On/Off (KCD11) | 1 Unit | Pemutus daya utama trainer |
| 8  | Indikator Fuse / Trip | LED Merah 5mm + Resistor $1\,\text{k}\Omega$ | 1 Set | Indikator visual saat sekring trip |
| 9  | Indikator Daya Normal | LED Hijau 5mm + Resistor $1\,\text{k}\Omega$ | 1 Set | Indikator Power Bus 5V OK |
| 10 | Push Button Module | Tactile Switch 12×12 mm + Resistor Pull-Down $10\,\text{k}\Omega$ | 4–8 Unit | Input tombol tekan |
| 11 | Matrix Keypad | Keypad Membran / PCB 4×4 (16 Tombol) | 1 Unit | Input keypad numerik & karakter |
| 12 | Potensiometer | 10kΩ Rotary B10K Linear Potentiometer | 2 Unit | Input tegangan variabel (ADC) |
| 13 | Sensor Suhu/Lembab | DHT11 / DHT22 Sensor Module + R $10\,\text{k}\Omega$ | 1 Unit | Sensor cuaca & temperatur |
| 14 | Sensor Ultrasonik | HC-SR04 (Rentang 2cm - 400cm) | 1 Unit | Sensor jarak sonar |
| 15 | Sensor Cahaya | LDR GL5528 + Resistor $10\,\text{k}\Omega$ Divider | 1 Unit | Pendeteksi intensitas cahaya |
| 16 | Sensor Gerak | Passive Infrared (PIR HC-SR501) | 1 Unit | Pendeteksi pergerakan manusia |
| 17 | Karakter LCD | LCD 16×2 Green/Blue + Backpack I2C PCF8574 | 1 Set | Display teks alfanumerik |
| 18 | 7-Segment Display | 4-Digit Seven Segment TM1637 Module | 1 Set | Display counter/jam digital |
| 19 | LED Array 8-Bit | 8x LED 5mm + 8x Resistor $220\,\Omega$ | 1 Set | Visualisasi byte/biner I/O |
| 20 | LED RGB | 1x Full Color 5mm Common Cathode + 3x $220\,\Omega$ | 1 Unit | Visualisasi color mixing PWM |
| 21 | Buzzer Module | Active Buzzer 5V + Transistor S8050 Driver | 1 Unit | Indikator audio / beeper |
| 22 | Motor Servo | TowerPro SG90 9g Micro Servo + Horn | 1 Unit | Aktuator posisi sudut |
| 23 | Motor DC | Motor DC 5V Mini + Roda Propeller/Gear | 1 Unit | Aktuator putaran kontinu |
| 24 | Driver Motor | L293D Dual H-Bridge Driver Board / IC | 1 Unit | Pengendali arah & kecepatan Motor DC |
| 25 | Screw Terminal | Terminal Block PCB 2-Pin & 4-Pin Pitch 5.08mm | 1 Set | Terminal sambungan kabel daya & motor |
| 26 | Pin Header | Male & Female Header Pitch 2.54mm | 1 Set | Titik tancap kabel jumper modular |
| 27 | Panel Trainer | Plat Akrilik Bening/Putih 3–5 mm + Koper Aluminium | 1 Unit | Rangka dudukan fisik & enclosure |
| 28 | Kabel Jumper | Dupont Male-Male, Male-Female, Female-Female | 1 Set | Kabel interkoneksi praktikum |
| 29 | Adaptor Eksternal | Adaptor Switching 12V 2A DC Jack 5.5×2.1mm | 1 Unit | Sumber daya listrik utama |
| 30 | Media Dokumentasi | Flashdisk 16GB / CD E-Book & Kode Contoh | 1 Unit | Penyimpanan jobsheet & program |

---

## 7. PROSEDUR SAFETY & PENGUJIAN SEKRING OTOMATIS (SOP)

1. **Uji Polaritas Normal:**
   * Colokkan adaptor 12V 2A ke DC Jack.
   * Nyalakan Saklar Utama.
   * Pastikan LED Hijau (Power) menyala dan LED Merah (Fault) mati.
   * Ukur tegangan pada terminal daya dengan multimeter:
     * Bus 12V terbaca sekitar 11.5V – 12V.
     * Bus 5V terbaca stabil di $5.0\text{V} \pm 0.1\text{V}$.
     * Bus 3.3V terbaca stabil di $3.3\text{V} \pm 0.05\text{V}$.
2. **Uji Simulasi Korsleting (Short-Circuit Trip Test):**
   * Hubungkan kabel jumper sesaat antara Bus 5V dan Bus GND.
   * **Hasil Pengamatan:**
     * Sekring PPTC akan segera memanas dan memutuskan arus berlebih.
     * Tegangan bus 5V drop ke dekat 0V (semua modul terlindungi aman).
     * LED Merah (Fault / Trip) menyala terang menandakan rangkaian terproteksi.
     * Adaptor tidak meledak dan jalur PCB/kabel tidak meleleh.
   * Lepaskan kabel korslet tersebut. Tunggu 5–10 detik hingga sekring mendingin.
   * **Hasil Pemulihan:**
     * LED Merah mati secara otomatis.
     * Bus 5V kembali aktif normal tanpa perlu mengganti komponen apa pun!
