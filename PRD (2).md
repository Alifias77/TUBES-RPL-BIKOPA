# PRD & SPESIFIKASI TEKNIS — BIKOPA 
## Sistem Informasi Rute, Halte, dan Pelacakan Bus Trans Palu

| Item | Isi |
| :--- | :--- |
| **Versi** | 1 |
| **Tanggal** | 2026-10-28 |
| **Status** | Draft siap-bangun; butuh konfirmasi Dishub untuk item di Bagian 11 |
| **Platform** | Web / PWA, responsif, mobile-first. **Tanpa login, tanpa panel admin** |
| **Wilayah** | Kota Palu, Sulawesi Tengah (WITA, `Asia/Makassar`, UTC+8) |
| **Tim** | Kelompok 7 — Muh. Fachri N (F5512520094), Alifias (F5512520099), Akhsan Maulana R. (F5512530114) |
| **Institusi** | Teknik Informatika, Fakultas Teknik, Universitas Tadulako |
| **Dosen Pengampu** | Dr. Deny Wiria Nugraha, S.T., M.Eng. |

---

## 0. RIWAYAT PERUBAHAN v2.0 → v2.1

**Prinsip:** BIKOPA hanyalah **sistem informasi untuk penumpang**. Pengguna cukup membuka aplikasi tanpa daftar, tanpa login, tanpa langkah rumit.

### 0.1 Fitur yang DIHAPUS
| Fitur dihapus | ID di v2.0 |
| :--- | :--- |
| Login, registrasi, reset password, 3 peran (Penumpang/Driver/Admin), RBAC | AUTH-01–05 |
| CMS / panel admin (CRUD halte, koridor, armada, jadwal, tarif, pengguna, penugasan, audit log) | ADM-01–08 |
| Dashboard admin dan peta operasional admin | DSH-01, DSH-03 |
| Laporan bulanan, matriks kepatuhan, ekspor CSV/PDF | DSH-02, DSH-04, DSH-05 |
| Notifikasi in-app dan web push | NTF-01, NTF-03, CMP-05 |
| Peran Driver dan aplikasi driver (penugasan, shift, lapor insiden) | DRV-01–05 |
| Pengaduan digital "Lapor Dishub" beserta kotak masuk admin (lihat D-S1) | CMP-01–07, ADM-10–14 |
| E-ticketing / QRIS | PAY-01 |
| Pemantauan kesehatan GPS untuk admin, deteksi off-route, riwayat GPS, retensi 90 hari | TRK-05–07 |
| Tabel: `users`, `driver_assignments`, `complaints` (+4 tabel turunannya), `ticket_counters`, `notifications`, `report_snapshots`, `audit_logs`, `fare_changes`, `bus_locations` | — |

### 0.2 Fitur yang DIPERTAHANKAN
Semua fitur penumpang/publik: US-01–US-11 (peta rute, halte terdekat, urutan halte, jadwal & tarif, live tracking & ETA, pencarian, bus berikutnya, pengumuman, offline, transfer, kontak), ditambah ingest GPS (TRK-01–04) agar tracking tetap jalan.

### 0.3 Keputusan baru
| ID | Keputusan |
| :--- | :--- |
| **D-S1** | **Pengaduan ikut dihapus** karena butuh login (pelapor) dan admin (penindak); tanpa keduanya tidak bisa berjalan. Penggantinya: halaman Kontak berisi telepon/alamat Dishub (US-11). Jika kelak dibutuhkan, bisa dibuat sebagai formulir sederhana tanpa login (lihat OQ-S2). |
| **D-S2** | **Tidak ada UI admin.** Data (halte, koridor, urutan, jadwal, tarif, pengumuman, armada) dikelola lewat **file seed/CSV + Supabase Table Editor** (atau SQL) oleh tim pengembang. Ini cukup karena data berubah jarang. |
| **D-S3** | **Tidak ada akun pengguna.** Seluruh endpoint baca bersifat publik. Satu-satunya endpoint tulis adalah telemetri GPS, diamankan dengan **token perangkat per bus** (bukan akun). |
| **D-S4** | **Tracking tetap dipertahankan** (judul layanan "Pemantauan & Informasi", dan P0 di v2.0). Sumber data: GPS tracker bus lewat token perangkat. Tanpa aplikasi driver, fallback ponsel driver dihapus. Jika operator tidak membuka data GPS, tracking ditunda dan aplikasi tetap rilis dengan jadwal statis (lihat R-1). |
| **D-S5** | Tidak ada penyimpanan riwayat GPS. Hanya posisi terkini (`bus_live_state`) yang disimpan. |

Keputusan D-01–D-19 dari v2.0 tetap berlaku, kecuali yang terkait item yang dihapus (D-11, D-12, D-13, D-14, D-16, D-18).

---

## 1. KONTEKS UNTUK AI CODE GENERATOR

1. **Bisnis:** Bus Trans Palu dikelola Pemkot Palu (Dishub) bersama PT Bagong Dekaka Makmur (Bagong Transport), skema *Buy The Service*. BIKOPA mengisi celah informasi rute/halte lokal dan ETA yang kurang di aplikasi nasional.
2. **Data:** 5 koridor (01, 02, 03M, 03Y, 04), 53 titik halte (6 HUB + 47 BUS_STOP), relasi halte↔koridor many-to-many.
3. **Satu jenis pengguna:** publik/penumpang, tanpa login.
4. **Hierarki sumber kebenaran:** (1) `titik_halte_trans_palu.csv` → master halte; (2) dokumen ini; (3) PRD v2.0 hanya jika tidak bertentangan.
5. **Konvensi:** UI Bahasa Indonesia, waktu WITA, kode dalam bahasa Inggris. **P0** = Must, **P1** = Should, **P2** = Could.
6. **Jangan mengarang data** (urutan halte, polyline, jadwal, nomor lambung, tarif). Tandai **[PERLU KONFIRMASI]**, isi lewat seed/tabel, bukan hardcode.

---

## 2. RINGKASAN PRODUK

### 2.1 Identitas Layanan
* **Aplikasi:** BIKOPA (Bis Kota Palu); **Layanan:** Bus Trans Palu
* **Kantor:** Jl. Balai Kota Timur No. 1, Tanamodindi, Kec. Mantikulore, Kota Palu 94111 | Telp (0451) 421666
* **Operator:** PT Bagong Dekaka Makmur (Bagong Transport), BTS
* **Armada:** kapasitas 35 (21 duduk + 14 berdiri), putih dengan livery daun kuning keemasan, videotron belakang, GPS tracker

| Kode | Nama | Jalur | Titik | Hub |
| :--- | :--- | :--- | ---: | :--- |
| 01 | Pantoloan – Pusat Kota | Jalur utama Trans Sulawesi – Pantoloan | 19 | Pelabuhan Pantoloan, Taman GOR |
| 02 | Balai Kota – Pasar Manonda | Balai Kota – Pusat Kota – Pasar Inpres Manonda | 18 | Taman GOR, Balai Kota, Pasar Inpres Manonda |
| 03M | Pusat Kota – Bandara MSA | via Jl. Wolter Monginsidi | 9 | Taman GOR, Bandara MSA |
| 03Y | Pusat Kota – Bandara MSA | via Jl. Prof. Moh. Yamin | 11 | Taman GOR, Balai Kota, Bandara MSA |
| 04 | Bandara MSA – Terminal Tipo | Bandara – Jembatan Palu IV / Jalur Dalam – Terminal Tipo | 10 | Bandara MSA, Terminal Tipo |

### 2.2 Masalah yang Diselesaikan
1. Peta dan info halte lokal Palu minim di aplikasi nasional.
2. Jadwal tidak pasti dan tidak ada estimasi kedatangan (ETA).

### 2.3 Indikator Keberhasilan (usulan, **[PERLU KONFIRMASI]**)
| Tujuan | Indikator |
| :--- | :--- |
| Kurangi ketidakpastian menunggu | ETA selisih rata-rata ≤ 2 menit (halte ≤ 10 menit); ≥ 90% armada aktif tampil di peta |
| Akses mudah | Terbuka < 3 detik pada 4G; info rute/halte bisa dibuka offline; **0 langkah login** |

### 2.4 Ruang Lingkup
**Dalam lingkup:** Bagian 3. **Di luar lingkup:** login/akun, pengaduan, panel admin, dashboard/laporan, notifikasi, aplikasi driver, pembayaran, trip planner multimoda, aplikasi native.

---

## 3. KEBUTUHAN FUNGSIONAL

### A. Fitur Penumpang (semua publik, tanpa login)

| ID | User Story | Kriteria Penerimaan | Prioritas |
| :--- | :--- | :--- | :--- |
| **US-01** | Melihat peta jalur seluruh koridor. | - Polyline berbeda warna per koridor (`color_hex`).<br>- Filter nyala/mati per koridor.<br>- Marker halte berwarna koridor; hub lebih besar; halte transfer menampilkan semua koridornya.<br>- `fitBounds` ke semua halte (lat −0,922…−0,708; lng 119,826…119,906).<br>- Koridor `is_published=false` tidak tampil. | **P0** |
| **US-02** | Mencari halte terdekat dari lokasi saya. | - Geolocation API; tampilkan 3 halte terdekat + jarak + koridor.<br>- Halte multi-koridor tampil sekali.<br>- Izin ditolak: tawarkan "cari nama halte" atau "pilih titik di peta".<br>- Halte terdekat > 5 km: "Anda berada di luar area layanan". | **P0** |
| **US-03** | Melihat urutan halte pergi (*outbound*) dan pulang (*inbound*). | - Daftar sekuensial dengan toggle arah.<br>- Klik halte: nama, foto (jika ada), tipe, koridor, alamat (jika ada).<br>- Jika urutan belum diisi: koridor tidak dipublikasikan, UI menampilkan "Rute sedang dilengkapi". | **P0** |
| **US-04** | Melihat jadwal, jam operasional, dan tarif. | - Jam operasional, headway, status tarif (Gratis/Berbayar), per koridor dan jenis hari (`WEEKDAY/WEEKEND/DAILY`).<br>- Banner pengumuman tarif/jadwal bila ada. | **P0** |
| **US-05** | Memantau lokasi bus real-time dan ETA. | - Ikon bus bergerak (WebSocket; fallback polling 5 dtk), berputar sesuai `heading`.<br>- Tampilkan kapasitas dan nomor lambung.<br>- ETA ke halte terpilih dan terdekat, berlabel "Perkiraan".<br>- Status: Aktif / Sinyal lemah / Offline (BR-06); bus Offline tidak digerakkan.<br>- Peta tersegarkan tiap 5–10 detik. | **P0** |
| **US-06** | Mencari halte atau koridor berdasarkan nama. | - Kolom cari + *autocomplete*; hasil memuat tipe, koridor, tombol "Lihat di peta". | P1 |
| **US-07** | Melihat bus berikutnya di sebuah halte. | - Bottom sheet halte: daftar bus mendatang per koridor + ETA.<br>- Tanpa data tracking: jadwal statis berlabel "Berdasarkan jadwal". | P1 |
| **US-08** | Melihat pengumuman layanan. | - Banner di beranda dan halaman koridor terkait; dapat ditutup per sesi.<br>- Hanya yang berada dalam rentang `starts_at`–`ends_at`. | P1 |
| **US-09** | Info rute/halte tetap terbuka saat sinyal buruk. | - Service worker menyimpan data statis dan tile area Palu.<br>- Banner "Mode offline — posisi bus tidak tersedia". | P1 |
| **US-10** | Tahu cara transfer antarkoridor. | - Halaman hub (mis. Taman GOR) menampilkan koridor yang bertemu.<br>- Pencarian halte A → B: rute langsung atau 1 kali transfer di hub. | P2 |
| **US-11** | Menghubungi Dishub / operator. | - Halaman "Tentang & Kontak": alamat, telepon (0451) 421666. | P1 |

### B. Pelacakan Armada (backend otomatis, tanpa UI admin)

| ID | Kebutuhan | Kriteria Penerimaan | Prioritas |
| :--- | :--- | :--- | :--- |
| **TRK-01** | Menerima data GPS | - `POST /api/v1/telemetry/location` (`hull_number`, `lat`, `lng`, `speed`, `heading`, `timestamp`).<br>- Autentikasi **token perangkat per bus**.<br>- Meng-upsert `bus_live_state`. | **P0** |
| **TRK-02** | Validasi wilayah & map-matching | - Titik di luar Kota Palu ditolak (BR-01).<br>- `is_on_route` dan `progress_fraction` dihitung (BR-02). | **P0** |
| **TRK-03** | ETA engine | - ETA per bus per halte berikutnya (BR-03), disimpan di `bus_live_state.next_stop_etas`. | **P0** |
| **TRK-04** | Distribusi real-time | - Klien subscribe per koridor lewat WebSocket; fallback `GET /buses/live`.<br>- Latensi ingest→klien ≤ 5 detik. | **P0** |

> Tanpa panel admin, daftar bus (nomor lambung, plat, ID GPS, token) dimasukkan lewat seed/SQL atau Supabase Table Editor.

---

## 4. ATURAN BISNIS

| ID | Aturan | Spesifikasi |
| :--- | :--- | :--- |
| **BR-01** | Validasi wilayah | Titik GPS harus di dalam poligon Kota Palu (`ST_Contains`). Pra-filter: lat ∈ [−1,00; −0,65], lng ∈ [119,75; 119,97]. Di luar wilayah → HTTP 422. Sumber poligon **[PERLU KONFIRMASI]** (BIG/OSM). |
| **BR-02** | Map-matching | Cocokkan titik ke `corridor_paths.geom` (arah dari `heading` dan kemajuan antar-ping). *On-route* jika jarak ≤ 50 m (`ST_DWithin`, geography). `progress_fraction = ST_LineLocatePoint`. Parameter konfigurasi. |
| **BR-03** | ETA | `d = (frac_halte − frac_bus) × panjang_jalur` (meter). `v = max(rata-rata kecepatan bergerak 2 menit terakhir, 8 km/jam)`. `dwell = 20 dtk` per halte antara. `ETA = d / v + dwell × jumlah_halte_di_antara`, dibulatkan ke atas ke menit. Bus Offline/tidak on-route: ETA kosong, UI pakai jadwal statis. Konstanta disetel lewat uji lapangan. |
| **BR-04** | Halte terdekat | Jarak Haversine atau `ST_Distance` geography; gabungkan halte sama; 3 teratas (`limit`); radius default 1000 m, maks 5000 m. |
| **BR-06** | Status pelacakan | Berdasarkan umur data terakhir: `ACTIVE` ≤ 30 dtk; `STALE` 31–120 dtk; `OFFLINE` > 120 dtk. Dihitung server tiap 10 dtk. |
| **BR-11** | Tarif | `corridors.fare = 0` berarti "Gratis". Tarif diubah langsung pada data koridor. Tarif berlaku **[PERLU KONFIRMASI]**. |
| **BR-12** | Publikasi koridor | Tampil publik hanya jika `is_active` dan `is_published`. `is_published` hanya diaktifkan setelah kedua arah punya urutan halte lengkap dan `corridor_paths` ada (diperiksa skrip validasi, bukan UI). |
| **BR-13** | Telemetri | Tolak jika: timestamp > 60 dtk di masa depan atau > 5 menit lampau; kecepatan > 120 km/jam; akurasi > 100 m; frekuensi > 1 ping/2 dtk per bus. Data ditolak tidak mengubah `bus_live_state`. |

(BR-05, 07, 08, 09, 10, 14 dari v2.0 dihapus karena terkait pengaduan, laporan, dan riwayat GPS.)

---

## 5. KEBUTUHAN NON-FUNGSIONAL

| ID | Kategori | Kebutuhan |
| :--- | :--- | :--- |
| NFR-01 | Kinerja | GPS dikirim tiap 3–5 dtk; peta disegarkan tiap 5–10 dtk; latensi ingest→klien ≤ 5 dtk |
| NFR-02 | Kinerja | API baca p95 ≤ 500 ms; halaman peta interaktif < 3 dtk pada 4G |
| NFR-03 | Skalabilitas | ≥ 50 armada dan ≥ 500 pengguna serentak (jumlah armada **[PERLU KONFIRMASI]**) |
| NFR-04 | Ketersediaan | Uptime ≥ 99%; `/healthz`; backup basis data harian |
| NFR-05 | Keamanan | TLS 1.3, validasi Zod pada telemetri, token perangkat di-hash, rate limiting, header keamanan (CSP, HSTS), RLS: baca publik, tulis hanya service role |
| NFR-06 | Privasi | **Tidak ada data pribadi yang dikumpulkan.** Lokasi pengguna dipakai hanya di perangkat untuk "halte terdekat" dan tidak dikirim/disimpan; persetujuan eksplisit sebelum membaca lokasi |
| NFR-07 | Usability | Responsif ≥ 360 px, Bahasa Indonesia, kontras WCAG AA, target sentuh ≥ 44 px, JS awal halaman peta ≤ 250 KB gzip |
| NFR-08 | Kompatibilitas | Chrome/Edge/Firefox/Safari 2 versi terakhir; Android 8.0+ RAM 2 GB |
| NFR-09 | Maintainability | TypeScript strict, ESLint, migrasi berversi, test otomatis, OpenAPI 3 |

---

## 6. ARSITEKTUR & TECH STACK

```
 ┌──────────────┐  HTTPS POST (3–5 dtk)   ┌─────────────────────────────┐
 │ GPS tracker  │ ──────────────────────▶ │ Cloud (Supabase / VPS)      │
 │ di bus       │   token perangkat       │  • API REST + WebSocket     │
 └──────────────┘                         │  • Worker ETA & status      │
                                          │  • PostgreSQL + PostGIS     │
 ┌──────────────┐   REST + WS (5–10 dtk)  └──────────────▲──────────────┘
 │ Web/PWA      │ ◀────────────────────────────────────┘
 │ Penumpang    │      (tanpa login, hanya baca)
 └──────────────┘
```

* **Frontend:** Next.js (App Router, TypeScript) + Tailwind CSS + Lucide; PWA (service worker, manifest).
* **Peta:** Leaflet / `react-leaflet`, tile OSM (siapkan tile berbayar/self-host untuk produksi).
* **Backend & DB:** Supabase (PostgreSQL 15 + PostGIS + Realtime) atau Node.js (Fastify) + PostgreSQL/PostGIS di VPS.
* **Validasi:** Zod. **State:** Zustand + TanStack Query.
* **Worker:** Edge Function + `pg_cron` atau Node worker (status tracking & ETA).
* **Hosting:** default Supabase; alternatif VPS 2 vCPU/4 GB/50 GB, Ubuntu 22.04.
* Tidak diperlukan: Auth, Storage (foto lampiran), scheduler laporan.

---

## 7. MODEL DATA (11 tabel)

Entitas: **Corridors**, **CorridorPaths**, **BusStops**, **CorridorStops**, **Buses**, **Schedules**, **BusLiveState**, **Announcements**.
Relasi: Corridors N–M BusStops lewat CorridorStops (per arah, berurut); Corridors 1–N CorridorPaths (per arah); Corridors 1–N Buses; Buses 1–1 BusLiveState.

```sql
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END $$ LANGUAGE plpgsql;

-- 1. Koridor
CREATE TABLE corridors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL,                  -- '01','02','03M','03Y','04'
    name VARCHAR(100) NOT NULL,
    via_route VARCHAR(150),
    color_hex VARCHAR(7) NOT NULL DEFAULT '#EAB308',
    fare NUMERIC(10,2) NOT NULL DEFAULT 0.00,          -- 0 = gratis
    operating_start TIME NOT NULL DEFAULT '06:00:00',
    operating_end TIME NOT NULL DEFAULT '21:00:00',
    default_headway_minutes INT NOT NULL DEFAULT 15,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,       -- BR-12
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Jalur rute per arah
CREATE TABLE corridor_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corridor_id UUID NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('OUTBOUND','INBOUND')),
    geom GEOMETRY(LineString, 4326) NOT NULL,
    route_polyline TEXT,
    source VARCHAR(30) NOT NULL DEFAULT 'MANUAL'
        CHECK (source IN ('DISHUB','SURVEY','ROUTING_DRAFT','MANUAL')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (corridor_id, direction)
);
CREATE INDEX idx_corridor_paths_geom ON corridor_paths USING GIST (geom);

-- 3. Halte (53 titik dari CSV)
CREATE TABLE bus_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stop_code VARCHAR(20) UNIQUE NOT NULL,             -- HLT-001 … HLT-053
    name VARCHAR(100) NOT NULL,
    address TEXT,
    latitude NUMERIC(10,8) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude NUMERIC(11,8) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    location GEOMETRY(Point, 4326) GENERATED ALWAYS AS
        (ST_SetSRID(ST_MakePoint(longitude::float8, latitude::float8), 4326)) STORED,
    stop_type VARCHAR(10) NOT NULL DEFAULT 'BUS_STOP'
        CHECK (stop_type IN ('HUB','SHELTER','BUS_STOP')),
    has_shelter BOOLEAN NOT NULL DEFAULT FALSE,
    condition_status VARCHAR(15) NOT NULL DEFAULT 'GOOD'
        CHECK (condition_status IN ('GOOD','DAMAGED','UNDER_REPAIR')),
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bus_stops_location ON bus_stops USING GIST (location);
CREATE INDEX idx_bus_stops_name ON bus_stops (lower(name));

-- 4. Urutan halte per koridor (many-to-many); stop_sequence NULL = belum diisi
CREATE TABLE corridor_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corridor_id UUID NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    bus_stop_id UUID NOT NULL REFERENCES bus_stops(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('OUTBOUND','INBOUND')),
    stop_sequence INT CHECK (stop_sequence > 0),
    estimated_time_from_prev INT NOT NULL DEFAULT 5,
    distance_from_prev_m INT,
    UNIQUE (corridor_id, bus_stop_id, direction)
);
CREATE UNIQUE INDEX uq_corridor_stops_seq
    ON corridor_stops (corridor_id, direction, stop_sequence) WHERE stop_sequence IS NOT NULL;
CREATE INDEX idx_corridor_stops_stop ON corridor_stops (bus_stop_id);

-- 5. Armada
CREATE TABLE buses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hull_number VARCHAR(20) UNIQUE NOT NULL,
    license_plate VARCHAR(15) UNIQUE NOT NULL,
    corridor_id UUID REFERENCES corridors(id) ON DELETE SET NULL,
    operator_name VARCHAR(100) NOT NULL DEFAULT 'PT Bagong Dekaka Makmur (Bagong Transport)',
    total_capacity INT NOT NULL DEFAULT 35,
    seat_capacity INT NOT NULL DEFAULT 21,
    gps_device_id VARCHAR(50) UNIQUE,
    gps_token_hash TEXT,                               -- hash token perangkat (telemetri)
    status VARCHAR(20) NOT NULL DEFAULT 'OPERATING'
        CHECK (status IN ('OPERATING','MAINTENANCE','INACTIVE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (seat_capacity <= total_capacity)
);

-- 6. Posisi terkini per bus (satu-satunya data GPS yang disimpan)
CREATE TABLE bus_live_state (
    bus_id UUID PRIMARY KEY REFERENCES buses(id) ON DELETE CASCADE,
    latitude NUMERIC(10,8) NOT NULL,
    longitude NUMERIC(11,8) NOT NULL,
    location GEOMETRY(Point, 4326) GENERATED ALWAYS AS
        (ST_SetSRID(ST_MakePoint(longitude::float8, latitude::float8), 4326)) STORED,
    speed_kmh NUMERIC(5,2) NOT NULL DEFAULT 0,
    heading INT NOT NULL DEFAULT 0 CHECK (heading BETWEEN 0 AND 360),
    corridor_id UUID REFERENCES corridors(id),
    direction VARCHAR(10) CHECK (direction IN ('OUTBOUND','INBOUND')),
    progress_fraction NUMERIC(7,6),
    is_on_route BOOLEAN,
    tracking_status VARCHAR(8) NOT NULL DEFAULT 'OFFLINE'
        CHECK (tracking_status IN ('ACTIVE','STALE','OFFLINE')),
    next_stop_etas JSONB,                              -- [{stop_code, eta_min, distance_m}]
    last_seen_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bus_live_state_location ON bus_live_state USING GIST (location);

-- 7. Jadwal
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corridor_id UUID NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL DEFAULT 'OUTBOUND' CHECK (direction IN ('OUTBOUND','INBOUND')),
    origin_stop_id UUID NOT NULL REFERENCES bus_stops(id),
    departure_time TIME NOT NULL,
    arrival_time TIME,
    headway_minutes INT NOT NULL DEFAULT 15,
    day_type VARCHAR(10) NOT NULL DEFAULT 'DAILY' CHECK (day_type IN ('WEEKDAY','WEEKEND','DAILY')),
    valid_from DATE,
    valid_until DATE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX idx_schedules_corridor ON schedules (corridor_id, day_type);

-- 8. Pengumuman / banner
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'INFO'
        CHECK (type IN ('INFO','ROUTE_DIVERSION','FARE_CHANGE','SCHEDULE_CHANGE','DISRUPTION')),
    corridor_id UUID REFERENCES corridors(id) ON DELETE CASCADE,   -- NULL = semua koridor
    starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_corridors_upd BEFORE UPDATE ON corridors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bus_stops_upd BEFORE UPDATE ON bus_stops FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_buses_upd BEFORE UPDATE ON buses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### 7.1 Row-Level Security (sederhana)
Semua tabel aktifkan RLS. Pengguna publik (anon) hanya boleh **SELECT**; semua tulis lewat service role (skrip seed, worker telemetri).

```sql
ALTER TABLE corridors ENABLE ROW LEVEL SECURITY;
ALTER TABLE corridor_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE corridor_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bus_live_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE buses ENABLE ROW LEVEL SECURITY;

CREATE POLICY pub_read_corridors ON corridors FOR SELECT USING (is_active AND is_published);
CREATE POLICY pub_read_stops ON bus_stops FOR SELECT USING (is_active);
CREATE POLICY pub_read_corridor_stops ON corridor_stops FOR SELECT USING (
    EXISTS (SELECT 1 FROM corridors c WHERE c.id = corridor_id AND c.is_active AND c.is_published));
CREATE POLICY pub_read_paths ON corridor_paths FOR SELECT USING (
    EXISTS (SELECT 1 FROM corridors c WHERE c.id = corridor_id AND c.is_active AND c.is_published));
CREATE POLICY pub_read_schedules ON schedules FOR SELECT USING (is_active);
CREATE POLICY pub_read_announcements ON announcements FOR SELECT USING (
    is_active AND starts_at <= now() AND (ends_at IS NULL OR ends_at >= now()));
CREATE POLICY pub_read_live ON bus_live_state FOR SELECT USING (true);
```
Tabel `buses` tidak punya kebijakan publik (berisi hash token); API membaca nomor lambung/kapasitas lewat service role dan hanya mengekspos kolom aman.

---

## 8. DATA SEEDER

### 8.1 Sumber & aturan impor
* Master halte: `titik_halte_trans_palu.csv` (`nama,tipe,koridor,lat,lon`; 53 baris). **Daftar lengkap 53 halte ada di Lampiran A PRD v2.0 dan tetap berlaku tanpa perubahan.**
* Aturan: `stop_code` = `HLT-` + nomor baris (HLT-001…HLT-053); "Halte Terminal/Hub" → `HUB`, "Bus Stop" → `BUS_STOP`; kolom `koridor` dipecah per koma menjadi baris `corridor_stops` per koridor × per arah dengan `stop_sequence = NULL`; koordinat dibulatkan 8 desimal.
* Pembaruan data selanjutnya: edit CSV/seed lalu jalankan ulang skrip impor (idempoten, `ON CONFLICT DO UPDATE`), atau edit langsung di Supabase Table Editor.

### 8.2 Ringkasan data
| Metrik | Nilai |
| :--- | ---: |
| Total titik | 53 (6 HUB, 47 BUS_STOP) |
| Keanggotaan halte–koridor | 67 |
| Titik multi-koridor | 11 |
| Koridor 01 / 02 / 03M / 03Y / 04 | 19 / 18 / 9 / 11 / 10 |

Hub: HLT-001 Pelabuhan Pantoloan (01), HLT-002 Taman GOR (01, 02, 03M, 03Y), HLT-003 Balai Kota (02, 03Y), HLT-004 Pasar Inpres Manonda (02), HLT-005 Bandara Mutiara SIS Al-Jufri (03M, 03Y, 04), HLT-006 Terminal Tipo (04).

### 8.3 Seed koridor
| Kode | Nama | Warna |
| :--- | :--- | :--- |
| 01 | Pantoloan - Pusat Kota | `#EF4444` |
| 02 | Balai Kota - Pasar Manonda | `#3B82F6` |
| 03M | Pusat Kota - Bandara MSA (via Jl. Wolter Monginsidi) | `#10B981` |
| 03Y | Pusat Kota - Bandara MSA (via Jl. Prof. Moh. Yamin) | `#F59E0B` |
| 04 | Bandara MSA - Terminal Tipo | `#8B5CF6` |

Semua `fare = 0`, `is_published = false` sampai urutan halte dan polyline lengkap.

### 8.4 Celah data yang harus dilengkapi (jangan dikarang)
| # | Data | Cara melengkapi |
| :--- | :--- | :--- |
| G-1 | Urutan halte per koridor dan arah | Dari Dishub/survei; diisi lewat seed/Table Editor |
| G-2 | Polyline rute per arah | Minta GeoJSON/shapefile Dishub; alternatif draf routing OSM (`source='ROUTING_DRAFT'`) lalu validasi lapangan |
| G-3 | Alamat, foto, status bangunan halte | Survei lapangan (`has_shelter=false` sampai disurvei) |
| G-4 | Jam operasional, headway, jadwal | Default 06:00–21:00 dan 15 menit **[PERLU KONFIRMASI]** |
| G-5 | Tarif berlaku | Default 0 (gratis) **[PERLU KONFIRMASI]**; info lama di website: gratis sampai Desember 2024 |
| G-6 | Daftar bus (nomor lambung, plat, ID GPS, token) | Dari PT Bagong Transport |
| G-7 | Poligon batas Kota Palu | BIG atau OSM |

---

## 9. SPESIFIKASI API (semua publik, kecuali telemetri)

Base path `/api/v1`; JSON UTF-8; waktu ISO 8601 + offset `+08:00`; error seragam `{ "error": { "code": "...", "message": "...", "details": [] } }`; paginasi `?page=&page_size=` (default 20, maks 100).

| Method & Path | Fungsi | Req |
| :--- | :--- | :--- |
| `GET /corridors?geometry=geojson\|polyline\|none` | Koridor aktif & terpublikasi + warna, tarif, polyline | US-01, US-04 |
| `GET /corridors/:code/stops?direction=OUTBOUND` | Urutan halte per koridor dan arah | US-03 |
| `GET /stops?corridor=&type=&q=&bbox=` | Daftar/pencarian halte | US-06 |
| `GET /stops/:code` | Detail halte + koridor | US-03 |
| `GET /stops/nearby?lat=&lng=&radius=&limit=3` | Halte terdekat (BR-04); satu halte sekali dengan daftar koridornya | US-02 |
| `GET /stops/:code/arrivals` | ETA bus mendatang di halte | US-07 |
| `GET /buses/live?corridor=` | Posisi bus `ACTIVE`/`STALE` (`hull_number`, `lat`, `lng`, `speed_kmh`, `heading`, `corridor`, `direction`, `tracking_status`, `capacity`, `last_seen_at`, `next_stop_etas`) | US-05 |
| `GET /buses/:hull/eta?stop={code}` | ETA satu bus ke satu halte | US-05 |
| `GET /schedules?corridor=&day_type=` | Jadwal, jam operasional, headway, tarif | US-04 |
| `GET /announcements?corridor=` | Pengumuman aktif | US-08 |
| `GET /system-info` | Alamat, telepon, versi data | US-11 |
| `WS /ws/v1/live` | Subscribe `corridor:{code}` / `bus:{hull}` / `all`; event `bus.update`; `ping` tiap 25 dtk | TRK-04 |
| `POST /telemetry/location` | **Dilindungi token perangkat bus.** Body: `{ "hull_number": "TP-01", "lat": -0.8969, "lng": 119.8688, "speed": 24.5, "heading": 180, "accuracy": 8, "timestamp": "2026-10-28T09:15:04+08:00" }` (mendukung `points[]` untuk kirim massal). Respons: `202`; `422` bila di luar wilayah/tidak valid; `429` bila melampaui rate limit | TRK-01 |

---

## 10. UI/UX

### 10.1 Prinsip
Mobile-first, peta sebagai layar utama, *bottom sheet* untuk detail halte/ETA, Bahasa Indonesia sederhana, ringan, kontras tinggi, **tanpa login atau formulir apa pun**. Warna koridor: 01 `#EF4444`, 02 `#3B82F6`, 03M `#10B981`, 03Y `#F59E0B`, 04 `#8B5CF6`; aksen merek `#EAB308`. Selain warna, tampilkan kode koridor pada label/lencana.

### 10.2 Layar
Beranda peta (filter koridor, tombol "Halte terdekat", pencarian) · bottom sheet halte (foto, tipe, koridor, ETA mendatang) · halaman koridor (toggle arah, daftar halte berurut, jadwal & tarif) · detail bus aktif (ETA, kapasitas) · pengumuman · halaman hub/transfer (P2) · Tentang & Kontak.

### 10.3 Kondisi khusus
Izin lokasi ditolak; GPS tidak akurat; belum ada bus beroperasi ("Belum ada bus beroperasi saat ini; jam operasional 06:00–21:00"); di luar jam operasional; offline; bus Offline; koridor belum dipublikasikan.

---

## 11. PENGUJIAN, ROADMAP, RISIKO

### 11.1 Pengujian
| Jenis | Cakupan | Target |
| :--- | :--- | :--- |
| Unit | Haversine/nearby, ETA, validasi wilayah, map-matching, status tracking | Cakupan ≥ 80% logika bisnis |
| Integrasi API | Semua endpoint Bagian 9 + RLS (anon tidak bisa menulis) | 0 kebocoran tulis |
| Akurasi ETA | ETA vs waktu tiba aktual, ≥ 3 hari per koridor | Selisih rata-rata ≤ 2 menit |
| Ketahanan GPS | Sinyal putus/pulih, ping menumpuk, di luar wilayah | Tidak ada posisi "melompat"; kehilangan data ≤ 2% |
| Beban | 50 bus × ping/4 dtk + 500 klien WebSocket | p95 sesuai NFR-02 |
| UAT | Warga Palu memakai skenario nyata | ≥ 80% skenario diterima |

**Definition of Done:** kriteria penerimaan terpenuhi, uji otomatis lulus, diuji di lebar 360 px, dokumentasi API diperbarui.

### 11.2 Roadmap (usulan; jauh lebih ringan dari v2.0)
| Minggu | Fase | Isi | Keluaran |
| :--- | :--- | :--- | :--- |
| 1 | Analisis & data | Konfirmasi OQ, kumpulkan polyline/urutan halte (G-1, G-2), wireframe | Data siap + wireframe |
| 2–3 | Backend & data | Migrasi skema + RLS, seed CSV, API publik (US-01–04), ingest telemetri, `bus_live_state`, WebSocket | **R1:** info statis + ingest GPS |
| 4–5 | Antarmuka | PWA penumpang: peta, halte terdekat, tracking, ETA, pengumuman, kontak | **R2 (Beta)** |
| 6 | QA & UAT | Uji ETA lapangan, beban, keamanan, UAT, perbaikan | Aplikasi final |
| 7 | Deploy | Produksi, tile peta produksi, panduan pembaruan data untuk pengembang | Sistem live |
| Pasca-rilis | P1/P2 | Offline PWA, trip planner, pengaduan sederhana bila diminta | Backlog |

### 11.3 Risiko
| # | Risiko | Mitigasi |
| :--- | :--- | :--- |
| R-1 | GPS bus tidak terbuka untuk API | Pastikan akses data di Minggu 1; bila gagal, rilis dengan jadwal statis dan tunda tracking |
| R-2 | Polyline & urutan halte belum ada | Jadikan G-1/G-2 *gate* Minggu 1; gunakan draf routing + validasi lapangan |
| R-3 | Sinyal seluler tidak merata (Pantoloan–Tawaeli) | Kirim massal (`points[]`) saat pulih; indikator Offline di UI |
| R-4 | Beban tile OSM publik | Tile berbayar / self-host sebelum produksi |
| R-5 | Data tidak ter-update karena tanpa admin UI | Dokumentasikan prosedur update CSV/seed; tunjuk satu penanggung jawab data |

### 11.4 Pertanyaan terbuka
| ID | Pertanyaan |
| :--- | :--- |
| OQ-01 | Jumlah armada dan nomor lambung/plat/ID GPS? Apakah GPS tracker menyediakan API/protokol terbuka? |
| OQ-02 | Sumber resmi urutan halte per arah dan jalur rute (GTFS/shapefile)? |
| OQ-03 | Apakah tarif masih gratis? Kalau berbayar, berapa dan sejak kapan? |
| OQ-04 | Jam operasional dan headway aktual per koridor dan per hari? |
| **OQ-S1** | Siapa yang memperbarui data (halte, jadwal, pengumuman) setelah rilis, mengingat tidak ada panel admin? |
| **OQ-S2** | Apakah perlu formulir pengaduan sederhana tanpa login (hanya kirim ke email/WhatsApp Dishub)? Default: tidak. |

---

## 12. TRACEABILITY RINGKAS

| Requirement | Tabel | Endpoint |
| :--- | :--- | :--- |
| US-01, US-03 | `corridors`, `corridor_paths`, `corridor_stops`, `bus_stops` | `GET /corridors`, `/corridors/:code/stops`, `/stops/:code` |
| US-02 | `bus_stops`, `corridor_stops` | `GET /stops/nearby` |
| US-04 | `corridors`, `schedules` | `GET /schedules` |
| US-05, TRK-01–04 | `buses`, `bus_live_state`, `corridor_paths` | `POST /telemetry/location`, `GET /buses/live`, `GET /buses/:hull/eta`, `WS /ws/v1/live` |
| US-06, US-07 | `bus_stops`, `bus_live_state` | `GET /stops`, `GET /stops/:code/arrivals` |
| US-08 | `announcements` | `GET /announcements` |
| US-11 | konfigurasi | `GET /system-info` |

---

## LAMPIRAN — Variabel Lingkungan Minimum
`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MAP_TILE_URL`, `NEXT_PUBLIC_DEFAULT_TZ=Asia/Makassar`, `TELEMETRY_RATE_LIMIT_MS=2000`, `ETA_MIN_SPEED_KMH=8`, `ETA_DWELL_SECONDS=20`, `ONROUTE_THRESHOLD_M=50`.

## LAMPIRAN — Struktur Repositori yang Disarankan
```
bikopa/
├─ apps/web/                 # Next.js: /, /koridor/[code], /halte/[code], /kontak
├─ packages/shared/          # tipe, skema Zod, konstanta
├─ packages/geo/             # haversine, map-matching, ETA (unit test)
├─ supabase/migrations/      # DDL + RLS
├─ supabase/seed/            # koridor + halte + keanggotaan koridor
├─ services/worker/          # status tracking + ETA
├─ tools/gps-simulator/      # simulator telemetri (20–35 km/jam)
└─ docs/
```
