-- T-AIMS: Pembaruan IP perangkat
-- Status: Menunggu verifikasi IP asli dari Ananda.
-- Jangan jalankan UPDATE sebelum IP dikonfirmasi.
-- Catatan tambahan oleh Database & Asset Management:
-- IP dummy digunakan sementara untuk kebutuhan pengujian proyek.
-- IP dummy belum merupakan IP asli yang telah diverifikasi.
-- Tujuh aset yang sebelumnya memiliki ip_address NULL
-- telah diisi dengan IP dummy pada database taims_db.
-- IP asli akan diperbarui setelah data jaringan dikonfirmasi.

-- ==========================================
-- T-AIMS: PERSIAPAN PEMBARUAN DATA ASET
-- Tanggal: 13 Oktober 2026
-- Status: DRAFT - BELUM SIAP DIEKSEKUSI
-- ==========================================

-- PENTING:
-- IP dari Ananda masih data DUMMY untuk simulasi.
-- Jangan jalankan UPDATE IP sampai survei fisik selesai.
-- Pemetaan nama perangkat ke asset_code harus diverifikasi.
-- Jangan menyimpan password plaintext di file SQL.

-- DATA SURVEI DUMMY:
-- Router 1          : 192.168.1.1
-- Router 2          : 192.168.1.2
-- Router 3          : 192.168.1.3
-- PC Kantor         : 192.168.1.10
-- TV                : 192.168.1.20
-- CCTV              : 192.168.1.30
-- Server            : 192.168.1.40
-- Access Point      : 192.168.1.50
-- Printer Jaringan  : 192.168.1.60

-- AKUN TESTING:
-- Menunggu hash bcryptjs dari Reza.
-- Email akun testing harus unik.
-- Gunakan role sesuai kebutuhan pengujian.
-- Jangan menimpa akun admin yang sudah ada.

-- LANGKAH SEBELUM FINALISASI:
-- 1. Konfirmasi IP fisik dari Ananda.
-- 2. Cocokkan setiap perangkat dengan asset_code.
-- 3. Konfirmasi format akun dengan Reza.
-- 4. Tinjau query sebelum dijalankan.


-- T-AIMS: AUDIT DATABASE ASET
-- Tanggal: 13 Oktober 2026
-- Jenis: Pemeriksaan saja, tidak mengubah data

-- 1. Ringkasan kelengkapan aset
SELECT
    COUNT(*) AS total_aset,
    SUM(ip_address IS NULL OR TRIM(ip_address) = '') AS tanpa_ip,
    SUM(mac_address IS NULL OR TRIM(mac_address) = '') AS tanpa_mac,
    SUM(pic_user_id IS NULL) AS tanpa_pic
FROM assets;

-- 2. Pemeriksaan IP duplikat
SELECT ip_address, COUNT(*) AS jumlah_aset
FROM assets
WHERE ip_address IS NOT NULL
  AND TRIM(ip_address) <> ''
GROUP BY ip_address
HAVING COUNT(*) > 1;

-- 3. Pemeriksaan PIC yang tidak cocok dengan tabel users
SELECT a.asset_id, a.asset_code, a.pic_user_id
FROM assets a
LEFT JOIN users u ON a.pic_user_id = u.user_id
WHERE a.pic_user_id IS NOT NULL
  AND u.user_id IS NULL;

