
-- ==========================================
-- T-AIMS: AUDIT DATABASE ASET
-- Tanggal: 13 Oktober 2026
-- Jenis: Pemeriksaan saja (READ-ONLY)
-- Tujuan: Memeriksa kelengkapan dan konsistensi data aset
-- Catatan: Query di bawah tidak mengubah data.
-- ==========================================


-- 1. Ringkasan kelengkapan data aset
SELECT
    COUNT(*) AS total_aset,
    SUM(ip_address IS NULL OR TRIM(ip_address) = '') AS tanpa_ip,
    SUM(mac_address IS NULL OR TRIM(mac_address) = '') AS tanpa_mac,
    SUM(pic_user_id IS NULL) AS tanpa_pic
FROM assets;


-- 2. Pemeriksaan IP duplikat
SELECT
    ip_address,
    COUNT(*) AS jumlah_aset
FROM assets
WHERE ip_address IS NOT NULL
  AND TRIM(ip_address) <> ''
GROUP BY ip_address
HAVING COUNT(*) > 1;


-- 3. Pemeriksaan PIC yang tidak cocok dengan tabel users
SELECT
    a.asset_id,
    a.asset_code,
    a.pic_user_id
FROM assets AS a
LEFT JOIN users AS u
    ON a.pic_user_id = u.user_id
WHERE a.pic_user_id IS NOT NULL
  AND u.user_id IS NULL;


-- 4. Cek MAC duplika
SELECT
    mac_address,
    COUNT(*) AS jumlah_aset
FROM assets
WHERE mac_address IS NOT NULL
  AND TRIM(mac_address) <> ''
GROUP BY mac_address
HAVING COUNT(*) > 1;


--5. Cek lokasi orphan (location_id tidak ada di tabel locations):
SELECT
    a.asset_id,
    a.asset_code,
    a.location_id
FROM assets AS a
LEFT JOIN locations AS l
    ON a.location_id = l.location_id
WHERE a.location_id IS NOT NULL
  AND l.location_id IS NULL;