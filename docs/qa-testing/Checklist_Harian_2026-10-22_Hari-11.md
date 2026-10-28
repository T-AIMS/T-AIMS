╔══════════════════════════════════════════════════════════════════╗
║         CHECKLIST HARIAN — REZA TRI (QA/DOCS) — T-AIMS          ║
║                  Shift 2 (16.00–01.00 WIB)                       ║
╚══════════════════════════════════════════════════════════════════╝

Tanggal: 22/10/2026   Hari ke-: 11   Commit: feat(qa): live telemetry monitoring test 17 devices and state transitions day-11

┌──────────────────────────────────────────────────────────────────┐
│ A. AWAL SHIFT (16.00)                                            │
├──────────────────────────────────────────────────────────────────┤
│ [x] Terima handover Shift 1 dari Damar Munajad                   │
│ [x] Baca task board & target Telemetri Monitoring Hari-11        │
│ [x] Cek daftar 17 perangkat terdaftar di database MySQL          │
│ [x] Pastikan backend Express & database MySQL berjalan normal   │
│ [x] Siapkan folder kerja & evidence screenshots Hari-11          │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ B. SAAT BEKERJA                                                  │
├──────────────────────────────────────────────────────────────────┤
│ [x] Jalankan uji telemetri ICMP Ping (`TC-MON-001`)              │
│ [x] Jalankan uji HTTP Health Check REST API (`TC-MON-002`)       │
│ [x] Jalankan uji TCP Port Scan (`TC-MON-003`)                    │
│ [x] Tarik riwayat latency logs dengan pagination (`TC-MON-004`)  │
│ [x] Validasi ringkasan pemantauan & kategori (`TC-MON-005`)      │
│ [x] Uji pengiriman paket telemetri IoT Heartbeat (`TC-HB-001`)   │
│ [x] Uji siklus State Transitions (ONLINE -> WARNING -> OFFLINE)  │
│ [x] Verifikasi Auto-Recovery & penutupan otomatis tiket insiden  │
│ [x] Perbaiki skema MySQL (`username`, ENUM `warning`, blacklist) │
│ [x] Tangkap 10 bukti screenshot Full HD 1080p ke folder Hari-11  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ C. AKHIR SHIFT (00.30)                                           │
├──────────────────────────────────────────────────────────────────┤
│ [x] Isi Actual Result di MASTER_TC (Baris 54 s/d 59)             │
│ [x] Buat hyperlink aktif bukti tangkapan layar di Col 14         │
│ [x] Update sheet EXECUTION_LOG (Hari 11: Total 6, PASS 6, FAIL 0)│
│ [x] Update sheet DASHBOARD (Persentase kelulusan naik ke 93.2%)  │
│ [x] Update Tracker Harian Reza (`Tracker_Harian_Reza.csv`)       │
│ [x] Tulis Test Report Resmi Hari-11 (`2026-10-22_Hari-11.md`)    │
│ [x] Tulis Daily Handover Hari-11 (`2026-10-22_Handover_RezaTri`) │
│ [x] Sinkronkan file ke staging GitHub & folder Drive Hari-11     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ D. ATURAN WAJIB (jangan dilanggar)                               │
├──────────────────────────────────────────────────────────────────┤
│ [x] ❌ Tidak simpan credential di source code                    │
│ [x] ❌ Tidak tandai PASS tanpa bukti                             │
│ [x] ❌ Tidak tandai DONE tanpa test lengkap                      │
│ [x] ✅ Format tanggal konsisten: dd/mm/yyyy                      │
│ [x] ✅ Nama file bukti: YYYY-MM-DD_TC-XXX_status.png             │
│ [x] ✅ Hyperlink Excel valid dan relatif terhadap root QA         │
└──────────────────────────────────────────────────────────────────┘
