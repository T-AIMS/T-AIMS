# T-AIMS Asset Registry

## 1. Informasi

- Nama proyek: T-AIMS
- Sumber data: tabel `assets` pada database `taims_db`
- Jumlah aset berdasarkan database final: 16 aset

## 2. Tujuan

Asset Registry digunakan untuk mendokumentasikan daftar perangkat yang dikelola oleh sistem T-AIMS, termasuk identitas aset, alamat IP, lokasi, dan informasi penanggung jawab jika tersedia.

## 3. Sumber Data

Daftar aset mengacu pada tabel `assets` di database `taims_db`. Jumlah data yang telah diperiksa pada database lokal adalah 16 aset.

Tabel berikut memuat 16 aset berdasarkan hasil pemeriksaan tabel `assets` pada database lokal `taims_db`, beserta kode aset dan alamat IP yang tercatat.

| Kode Aset   | Alamat IP      |
| ----------- | -------------- |
| NET-RTR-02  | 192.168.10.2   |
| SEC-CCTV-01 | 192.168.10.31  |
| SEC-CCTV-02 | 192.168.10.32  |
| DISP-TV-01  | 192.168.10.40  |
| PC-WS-01    | 192.168.10.41  |
| PC-WS-02    | 192.168.10.42  |
| IOT-RPI-01  | 192.168.10.102 |
| NET-SWD-01  | 192.168.10.3   | 
| NET-SWA-01  | 192.168.10.4   |
| NET-AP-01   | 192.168.10.11  |
| NET-SRV-01  | 192.168.10.20  |
| NET-GW-01   | 192.168.10.254 |
| NET-DNS-01  | 192.168.10.5   |
| NET-NAS-01  | 192.168.10.30  |
| IOT-ESP-01  | 192.168.10.101 |
| NET-RTR-01  | 192.168.10.1   |

Data lengkap perlu diekspor atau diperiksa dari tabel `assets` agar seluruh 16 aset terdokumentasi dengan benar. Kode aset dan alamat IP harus mengikuti data aktual pada database.


## 4. Cara Memeriksa Data

1. Buka phpMyAdmin.
2. Pilih database `taims_db`.
3. Buka tabel `assets`.
4. Periksa data perangkat dan alamat IP.
5. Cocokkan data dengan database final proyek.


## 5. Catatan

Daftar aset pada dokumen ini memuat 16 aset berdasarkan hasil pemeriksaan database lokal `taims_db`. Kode aset dan alamat IP mengacu pada hasil kueri tabel `assets`.

Informasi lokasi, penanggung jawab, dan status perangkat dapat dilengkapi sesuai kebutuhan proyek. Setiap perubahan data aset perlu dikoordinasikan dengan anggota tim terkait.

Perbedaan antara schema database lokal dan file SQL pada repository, khususnya kolom `offline_since`, perlu ditindaklanjuti bersama tim backend sebelum perubahan diterapkan.

