# DESIGN.md — BIKOPA (Bis Kota Palu)
### Sistem Informasi Rute, Halte, dan Pelacakan Bus Trans Palu

| Item | Isi |
| :--- | :--- |
| **Sumber** | `PRD_BIKOPA_v2.1_sederhana.md` + prototipe `index.html` (HTML + Tailwind) |
| **Platform** | Web / PWA, responsif, mobile-first (≥ 360 px). Tanpa login, tanpa panel admin |
| **Bahasa & zona waktu** | Bahasa Indonesia, WITA (`Asia/Makassar`, UTC+8) |
| **Fungsi dokumen** | Menerjemahkan fitur dan arsitektur PRD ke dalam komponen desain yang **sudah ada** di prototipe HTML |

---

## 0. Aturan Dasar Dokumen Ini

1. **Warna, tipografi, dan susunan section pada `index.html` tidak diubah.** Dokumen ini hanya menentukan *isi* tiap komponen (teks, data, perilaku) agar mewakili fitur PRD.
2. Layar atau komponen yang belum ada di prototipe (bottom sheet halte, halaman koridor, dll.) **disusun dari token dan pola komponen yang sama**. Tidak ada warna atau font baru.
3. Warna koridor dari PRD (`#EF4444`, `#3B82F6`, `#10B981`, `#F59E0B`, `#8B5CF6`) adalah **warna data**. Dipakai hanya untuk garis rute, marker, dan lencana kode koridor di peta, bukan sebagai tema antarmuka. Aksen merek PRD `#EAB308` tidak dipakai; aksen kuning tetap `--sun` dari prototipe.
4. Tidak ada elemen untuk fitur yang dikeluarkan PRD v2.1: login, pengaduan, pembayaran/tiket, pemesanan, notifikasi, panel admin.
5. Data yang belum pasti ditandai **[PERLU KONFIRMASI]** dan tidak boleh di-hardcode di antarmuka. Isi diambil dari API/seed.

---

## 1. Design Tokens (diambil apa adanya dari prototipe)

### 1.1 Warna antarmuka

| Token | Nilai | Pemakaian |
| :--- | :--- | :--- |
| `--navy` | `#1b2d52` | Latar header/hero, teks judul section terang, tombol outline gelap |
| `--deep` | `#121e3a` | Latar footer, dasar gradien hero |
| `--coral` | `#ff6b4a` | Aksen utama: tab aktif, tombol utama, judul sorot, marker lokasi |
| `--sky` | `#4f9fe0` | Tombol "Lihat Rute" di hero, banner langit, status aktif |
| `--sun` | `#ffc233` | Tombol kartu hub, pil "Hubungi", status sinyal lemah |
| `--mist` | `#f3f6fb` | Latar section kartu, panel tab |
| `--ink` | `#17233f` | Teks isi pada latar terang |
| `--paper` | `#ffffff` | Latar halaman, kartu |
| Bintang hero | `#f5a623` | Hanya dipakai pada slot status hero (lihat 4.2) |
| Gradien hero | `#1f3560 → #1b2d52 → #162646` | Latar header, 180° |
| Gradien banner | `#4f9fe0 → #8cc4ee → #bfe0f7` | Banner langit |

Tema tunggal (terang dengan header gelap). `color-scheme: light`; `body` selalu memakai latar `--paper`.

### 1.2 Warna data (hanya untuk peta dan lencana koridor)

| Koridor | Nama | `color_hex` |
| :--- | :--- | :--- |
| 01 | Pantoloan – Pusat Kota | `#EF4444` |
| 02 | Balai Kota – Pasar Manonda | `#3B82F6` |
| 03M | Pusat Kota – Bandara MSA (via Jl. Wolter Monginsidi) | `#10B981` |
| 03Y | Pusat Kota – Bandara MSA (via Jl. Prof. Moh. Yamin) | `#F59E0B` |
| 04 | Bandara MSA – Terminal Tipo | `#8B5CF6` |

Nilai dibaca dari `corridors.color_hex`, tidak ditulis di kode. Setiap lencana warna **wajib memuat kode koridor sebagai teks** (warna bukan satu-satunya pembeda).

### 1.3 Status pelacakan (memakai token yang sudah ada)

| Status (BR-06) | Umur data | Label UI | Gaya |
| :--- | :--- | :--- | :--- |
| `ACTIVE` | ≤ 30 dtk | Aktif | Titik `--sky` |
| `STALE` | 31–120 dtk | Sinyal lemah | Titik `--sun` |
| `OFFLINE` | > 120 dtk | Offline | Titik `--ink` opasitas 45%, ikon bus tidak digerakkan |

### 1.4 Tipografi

| Peran | Font | Dipakai di |
| :--- | :--- | :--- |
| Display | **Barlow Condensed** 600/700/800, huruf kapital | Judul section (`h2`), judul kartu, merek footer |
| Isi | **DM Sans** 400/500/700 | Teks isi, form, kartu, tab |
| Navigasi & hero | **Open Sans** 300–700 (+ italic 300) | Nav bar, judul hero (`h1`), paragraf hero, tombol hero |

Skala yang dipakai: `h1` hero `text-4xl → sm:5xl → lg:3.4rem`, `h2` `text-3xl → sm:4xl` (banner/rute) dan `text-4xl → sm:5xl` (jangkauan). Teks isi 14–16 px, label kecil 11–13 px huruf kapital dengan `tracking-wide`. Angka yang sejajar memakai `tabular-nums` (ETA, jarak, jam).

### 1.5 Bentuk, jarak, dan gerak

| Aspek | Nilai |
| :--- | :--- |
| Lebar konten | `.wrap` maks 1180 px + `.gutter` ≥ 16 px (aman dari safe-area) |
| Radius | Tombol hero/nav: 0 (persegi). Tombol sekunder: `rounded-lg`. Kartu: `rounded-xl`/`rounded-2xl`. Banner langit: `rounded-[2.5rem]`. Pil: `rounded-full` |
| Bayangan | Kartu rute `shadow-md`; kartu sorot `shadow-xl`; bus `drop-shadow` |
| Gerak | Hover kartu naik 4 px (`.lift`), hanya jika `prefers-reduced-motion: no-preference` |
| Fokus | `.focus-ring`: outline 3 px `--sun`, offset 2 px |
| Target sentuh | Semua kontrol interaktif minimal 44 × 44 px (NFR-07). Tombol nav "Pesan" saat ini ±36 px dan perlu `min-h-[44px]` |

---

## 2. Peta Halaman (Routing)

| Rute Next.js | Halaman | Komponen utama |
| :--- | :--- | :--- |
| `/` | Beranda (prototipe `index.html`) | Semua section pada Bagian 3 |
| `/koridor/[code]` | Detail koridor | Nav, `AnnouncementStrip`, toggle arah, daftar halte berurut, tab Jadwal & Tarif |
| `/halte/[code]` | Detail halte / hub | `StopSheet` versi halaman penuh, ETA mendatang |
| `/kontak` | Tentang & Kontak | `SiteFooter` diperluas + info Dishub dan operator |

Tidak ada `/login`, `/admin`, `/pengaduan`, `/tiket`.

---

## 3. Struktur Halaman Beranda (urutan tetap)

| # | Section (id) | Latar | Komponen React | Fitur PRD |
| :-- | :--- | :--- | :--- | :--- |
| 0 | (opsional) strip pengumuman | `--sun` | `AnnouncementStrip` | US-08 |
| 1 | Nav bar | Kaca di atas gradien hero | `SiteHeader` | Navigasi |
| 2 | Hero | Gradien navy + foto bus | `HeroSection` | Ringkasan layanan, US-05 |
| 3 | Bar pencarian (`#cari`) | Kaca di atas navy | `QuickSearchBar` | US-06, US-10, US-02 |
| 4 | Grid koridor (`#armada`) | Navy | `CorridorGrid` | US-01, US-04 |
| 5 | Pembatas awan | Putih | `CloudDivider` | Dekoratif |
| 6 | Banner langit | `--sky` gradien | `LiveBanner` | US-05 |
| 7 | Tab info (`#layanan`) | `--mist` | `InfoTabs` | US-03, US-04, US-09, US-11 |
| 8 | Hub & halte transfer (`#rute`) | `--mist` | `HubCards` | US-10, US-07 |
| 9 | Peta (`#jangkauan`) | Putih | `MapPreview` | US-01, US-02, US-05 |
| 10 | Footer (`#kontak`) | `--deep` | `SiteFooter` | US-11 |

---

## 4. Spesifikasi Komponen

### 4.1 `SiteHeader` (nav bar)
- **Susunan:** logo (kotak putih berisi ikon pin-bus + "RUTERA" → **"BIKOPA"** + subteks italic "Bus Trans Palu"), menu tengah (tampil ≥ `lg`), tombol outline di kanan.
- **Menu:** Beranda `/` · Koridor `#armada` · Jadwal `#layanan` · Hub `#rute` · Peta `#jangkauan` · Kontak `#kontak`.
- **Tombol kanan:** teks **"Buka Peta"** (menggantikan "Pesan", karena pemesanan di luar lingkup). Tautan ke `#jangkauan` dan membuka peta penuh.
- **Mobile:** menu tengah disembunyikan, tombol kanan tetap tampil. Menu lengkap muncul dari tombol ikon (target ≥ 44 px) memakai gaya kaca yang sama.

### 4.2 `HeroSection`
| Slot | Isi untuk BIKOPA |
| :--- | :--- |
| Baris atas (slot lima bintang) | `StatusPill`: titik status + "**N bus aktif** · Beroperasi 06:00–21:00". Sumber: `GET /buses/live` dan `corridors.operating_start/end`. Tanpa data tracking: "Jadwal tersedia". Alasan: PRD tidak punya fitur penilaian, sehingga bintang tidak punya data |
| `h1` | "Rute, halte, dan posisi<br>Bus Trans Palu" |
| Paragraf | "Lihat jalur lima koridor, halte terdekat, jadwal, dan perkiraan kedatangan bus. Tanpa daftar, tanpa login." |
| Tombol | **"Lihat Rute"**, latar `--sky`, persegi, menuju `/koridor/01` atau `#armada` |
| Gambar | Foto **Bus Trans Palu** di sisi kanan (md+: 64% lebar, penuh tinggi), tepi kiri dan bawah memudar ke navy; di mobile berada di bawah teks |

Implementasi gambar: `next/image` dari `/public/images/bus-trans-palu.jpg` (`priority`, `sizes="(min-width:768px) 64vw, 100vw"`), `alt` "Bus Trans Palu tampak depan melaju di area terminal". Lapisan gradien navy tetap sama dengan prototipe.

### 4.3 `QuickSearchBar`
Tiga bidang + satu tombol, susunan grid sama dengan prototipe (`lg:grid-cols-[1fr_1fr_1fr_auto]`).

| Bidang | Ikon | Isi | Data |
| :--- | :--- | :--- | :--- |
| Halte asal | Lingkaran putih | Input + *autocomplete* | `GET /stops?q=` (US-06) |
| Halte tujuan | Lingkaran `--coral` | Input + *autocomplete* | `GET /stops?q=` |
| Jenis hari | Lingkaran putih | Pilihan Hari kerja / Akhir pekan, default menurut tanggal WITA hari ini | `schedules.day_type` |
| Tombol | `--coral` | **"Cari Rute"** | Rute langsung atau 1 kali transfer di hub (US-10, **P2**) |

- Baris status di bawah form (`role="status"`) menampilkan hasil dan tautan **"Gunakan lokasi saya"** untuk halte terdekat (US-02).
- Hasil pencarian satu bidang berisi tipe halte, lencana koridor, dan tombol "Lihat di peta".
- Selama US-10 belum dibangun, tombol "Cari Rute" memfilter koridor yang melewati kedua halte, lalu menampilkan "Rute dengan transfer akan tersedia" bila tidak ada rute langsung.

### 4.4 `CorridorGrid` (menggantikan grid armada)
Grid 2 kolom di mobile, 4 kolom di md+. Ubin sama dengan prototipe (gradien navy, ilustrasi bus, keterangan di bawah). Ilustrasi bus tetap.

| Ubin | Isi | Tujuan |
| :--- | :--- | :--- |
| 1–5 | Satu per koridor yang `is_active` dan `is_published`: lencana kode + `color_hex`, nama koridor, "N halte" | Buka `/koridor/[code]`, nyalakan filter di peta (US-01) |
| 6 | "Halte terdekat" | Memicu `LocationConsent`, lalu US-02 |
| 7 | "Bus aktif" + jumlah | Membuka peta dengan lapisan bus (US-05) |
| 8 | "Hub & transfer" | Menggulir ke `#rute` (US-10) |

- Ubin koridor hanya tampil bila dipublikasikan (BR-12). Koridor yang belum lengkap tidak muncul; ubin lain mengisi.
- Jumlah halte per koridor: 01 = 19, 02 = 18, 03M = 9, 03Y = 11, 04 = 10 (dari `corridor_stops`).
- Judul section: "Pilih **koridor** sesuai tujuan Anda".

### 4.5 `CloudDivider`
Dekoratif, `aria-hidden`. Tidak berisi data.

### 4.6 `LiveBanner` (banner langit)
| Slot | Isi |
| :--- | :--- |
| Eyebrow | "Pelacakan langsung" |
| `h2` | "Lihat posisi bus,<br>perkiraan tiba di halte" |
| Paragraf | "Posisi bus diperbarui tiap 5–10 detik. Estimasi waktu tiba berlabel *Perkiraan* dan dihitung dari kecepatan bus terkini." |
| Tombol utama (`--coral`) | "Lihat Bus Aktif" |
| Tombol sekunder (putih) | "Lihat Rute" |
| Ilustrasi | Bus tampak depan (tetap) |

Tanpa data tracking (R-1) paragraf berganti: "Posisi bus belum tersedia. Jadwal tetap bisa dilihat di bawah."

### 4.7 `InfoTabs`
Pola `role="tablist"`, tab aktif berlatar `--coral`, panel `--mist` dengan kartu 3 kolom (1 di mobile, 2 di sm).

| Tab | Isi 6 kartu | Sumber | Req |
| :--- | :--- | :--- | :--- |
| **Jadwal** | 5 kartu koridor: jam operasional, headway, jenis hari. Kartu ke-6: catatan "Jadwal dapat berubah, cek pengumuman" | `GET /schedules?corridor=&day_type=` | US-04 |
| **Tarif** | Status per koridor: "Gratis" bila `fare = 0`, selain itu nominal Rupiah. Kartu ke-6: tanggal berlaku **[PERLU KONFIRMASI]** | `GET /corridors` | US-04, BR-11 |
| **Halte** | Per koridor: jumlah halte + tautan ke daftar berurut dengan toggle arah Pergi/Pulang | `GET /corridors/:code/stops` | US-03 |
| **Bantuan** | Mode offline, halte terdekat, cara membaca ETA, arti status bus, kontak Dishub, privasi lokasi | Statis + `GET /system-info` | US-09, US-11, NFR-06 |

Kartu mengikuti pola prototipe: ikon dalam lingkaran `--coral/10`, judul tebal `--navy`, deskripsi `--ink/70`. Koridor yang belum dipublikasikan menampilkan "Rute sedang dilengkapi" (tidak disembunyikan di tab Halte).

### 4.8 `HubCards` (menggantikan "Rute populer")
Tiga kartu, kartu tengah naik 16 px dan memakai `shadow-xl`. Foto memakai `bus_stops.photo_url` bila ada, jika tidak memakai ilustrasi adegan bawaan.

| Posisi | Hub | Koridor yang bertemu |
| :--- | :--- | :--- |
| Kiri | HLT-003 Balai Kota | 02, 03Y |
| **Tengah (sorot)** | HLT-002 Taman GOR | 01, 02, 03M, 03Y |
| Kanan | HLT-005 Bandara Mutiara SIS Al-Jufri | 03M, 03Y, 04 |

Isi kartu: nama hub, deretan lencana koridor, ETA bus berikutnya (bila ada), tombol `--sun` **"Lihat Halte"**. Heading: "**Hub** dan titik transfer". Hub lain (Pelabuhan Pantoloan, Pasar Inpres Manonda, Terminal Tipo) muncul lewat tautan "Lihat semua hub" (US-10, P2).

### 4.9 `MapPreview` (section Jangkauan)
| Slot | Isi |
| :--- | :--- |
| Kartu kiri | Peta **Leaflet** (`react-leaflet`), bingkai `rounded-3xl` seperti prototipe. Polyline per koridor berwarna `color_hex`, marker halte berwarna koridor, hub lebih besar, halte transfer menampilkan semua koridornya, ikon bus berputar sesuai `heading`. Awal: `fitBounds` lat −0,922…−0,708, lng 119,826…119,906 |
| Garis aksen + `h2` | "Peta jalur dan halte" |
| Paragraf | "Seluruh koridor dan 53 titik halte di Kota Palu dalam satu peta." |
| Daftar poin | Filter koridor nyala/mati · Halte terdekat dari lokasi Anda · Info rute tetap terbuka saat offline |
| Tombol outline `--coral` | "Buka Peta Penuh" |

- **Peta penuh** (layar utama aplikasi, mobile-first): kartu peta menjadi layar penuh dengan filter koridor di atas dan tombol "Halte terdekat" mengambang (≥ 44 px).
- Koridor `is_published = false` tidak digambar.
- Di luar area layanan (> 5 km dari halte terdekat): "Anda berada di luar area layanan".

### 4.10 `SiteFooter`
| Slot | Isi |
| :--- | :--- |
| Merek | "BIKOPA" + "Sistem informasi rute, halte, dan pelacakan Bus Trans Palu." |
| Menu | Koridor · Jadwal · Hub |
| Kontak | Dinas Perhubungan Kota Palu, Jl. Balai Kota Timur No. 1, Tanamodindi, Kec. Mantikulore, Kota Palu 94111. Telp **(0451) 421666** (tampil sebagai teks, boleh ditautkan `tel:` sebagai kemudahan). Operator: PT Bagong Dekaka Makmur (Bagong Transport). Sumber: `GET /system-info` |
| Pil kuning `--sun` | **"Hubungi Dishub"** → `/kontak` |
| Dua lingkaran putih | Ikon telepon dan lokasi (menggantikan ikon media sosial, karena tidak ada di PRD) |
| Baris hak cipta | "Kelompok 7, Teknik Informatika, Universitas Tadulako" + versi data dari `/system-info` |

---

## 5. Komponen Turunan (disusun dari token yang sama)

| Komponen | Pola dasar | Perilaku |
| :--- | :--- | :--- |
| `AnnouncementStrip` | Strip `--sun` di atas nav, teks `--ink`, tombol tutup ≥ 44 px | Hanya pengumuman dalam `starts_at`–`ends_at`; dapat ditutup per sesi; juga tampil di halaman koridor terkait (US-08). Tipe: INFO, ROUTE_DIVERSION, FARE_CHANGE, SCHEDULE_CHANGE, DISRUPTION (ikon berbeda, warna sama) |
| `StopSheet` (bottom sheet halte) | Kartu putih `rounded-t-3xl`, `shadow-xl`, pegangan geser | Foto (bila ada), nama, tipe (HUB/SHELTER/BUS_STOP), lencana semua koridor, alamat (bila ada), daftar bus mendatang + ETA per koridor. Tanpa tracking: "Berdasarkan jadwal" (US-07) |
| `CorridorPage` | Nav + judul Barlow + toggle arah | Toggle Pergi/Pulang (`OUTBOUND`/`INBOUND`), daftar halte berurut dengan garis vertikal berwarna koridor, tab Jadwal & Tarif. Bila urutan belum ada: "Rute sedang dilengkapi" (US-03) |
| `BusDetail` | Kartu putih di atas peta | Nomor lambung, kapasitas (35: 21 duduk + 14 berdiri), status pelacakan, daftar ETA ke halte berikutnya, label "Perkiraan" (US-05) |
| `NearbyList` | Kartu `--mist` | 3 halte terdekat dengan jarak (m) dan lencana koridor; halte multi-koridor tampil sekali (US-02, BR-04) |
| `LocationConsent` | Dialog dalam halaman (bukan `confirm()`) | Penjelasan singkat sebelum izin lokasi dibaca. Lokasi hanya dipakai di perangkat dan tidak dikirim atau disimpan (NFR-06) |
| `OfflineBanner` | Strip `--navy` teks putih | "Mode offline: posisi bus tidak tersedia". Info rute dan halte tetap terbuka dari cache (US-09) |
| `EmptyState` | Kartu `--mist` + ilustrasi bus | Lihat Bagian 8 |

---

## 6. Arsitektur Frontend

### 6.1 Stack
| Lapisan | Pilihan (sesuai PRD) | Catatan desain |
| :--- | :--- | :--- |
| Framework | Next.js App Router, TypeScript strict | Prototipe HTML diubah menjadi komponen React per section |
| Gaya | Tailwind CSS + Lucide | Token Bagian 1 dipindah ke `tailwind.config` (`colors.navy/deep/coral/sky/sun/mist/ink`, `fontFamily.display/body`) dengan nilai identik |
| Peta | Leaflet / `react-leaflet`, tile OSM | `NEXT_PUBLIC_MAP_TILE_URL`; tile berbayar/self-host sebelum produksi (R-4) |
| State & data | Zustand (filter koridor, arah, UI) + TanStack Query (data server) | |
| Validasi | Zod, tipe dibagi lewat `packages/shared` | |
| PWA | Service worker + manifest | Cache data statis dan tile area Palu (US-09) |

### 6.2 Struktur repositori
```
bikopa/
├─ apps/web/                 # Next.js: /, /koridor/[code], /halte/[code], /kontak
│  └─ components/            # SiteHeader, HeroSection, QuickSearchBar, CorridorGrid,
│                            # LiveBanner, InfoTabs, HubCards, MapPreview, SiteFooter,
│                            # AnnouncementStrip, StopSheet, BusDetail, OfflineBanner, ...
├─ packages/shared/          # tipe, skema Zod, konstanta
├─ packages/geo/             # haversine, map-matching, ETA (unit test)
├─ supabase/migrations/      # DDL + RLS
├─ supabase/seed/            # koridor + halte + keanggotaan koridor
├─ services/worker/          # status tracking + ETA
├─ tools/gps-simulator/      # simulator telemetri (20–35 km/jam)
└─ docs/
```

### 6.3 Strategi data per komponen
| Komponen | Query | Cara memperbarui |
| :--- | :--- | :--- |
| `CorridorGrid`, `InfoTabs` (Tarif, Halte) | `GET /corridors` | Dirender di server (SSG/ISR), jarang berubah |
| `InfoTabs` (Jadwal) | `GET /schedules` | ISR |
| `QuickSearchBar` | `GET /stops?q=` | Debounce 250 ms |
| `NearbyList` | `GET /stops/nearby?lat&lng&radius=1000&limit=3` | Sekali per izin lokasi |
| `MapPreview`, `HeroSection.StatusPill`, `LiveBanner` | `GET /buses/live` | **WebSocket** `WS /ws/v1/live` (langganan `corridor:{code}` atau `all`, event `bus.update`, `ping` 25 dtk). Jika gagal terhubung: polling 5 dtk |
| `StopSheet` | `GET /stops/:code/arrivals` | Polling 10 dtk saat sheet terbuka |
| `AnnouncementStrip` | `GET /announcements?corridor=` | Saat masuk halaman |
| `SiteFooter`, `/kontak` | `GET /system-info` | ISR |

Semua endpoint baca bersifat publik. Klien tidak pernah menulis data.

### 6.4 Aturan perilaku peta dan bus
- Ikon bus bergerak halus antar pembaruan; bus `OFFLINE` tidak digerakkan dan tampil redup.
- ETA ditampilkan sebagai menit, dibulatkan ke atas, dengan label "Perkiraan". ETA kosong (bus offline atau tidak on-route) diganti jadwal statis berlabel "Berdasarkan jadwal" (BR-03).
- Data diperbarui tiap 5–10 dtk, latensi ingest→klien ≤ 5 dtk.

---

## 7. Arsitektur Sistem

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

| Bagian | Rancangan |
| :--- | :--- |
| Ingest GPS | `POST /api/v1/telemetry/location` dengan token perangkat per bus (di-hash). Body: `hull_number, lat, lng, speed, heading, accuracy, timestamp` (juga `points[]` untuk kirim massal). Respons `202`, `422` bila di luar wilayah/tidak valid, `429` bila melampaui rate limit |
| Validasi | BR-01 (poligon Kota Palu), BR-13 (timestamp, kecepatan ≤ 120 km/jam, akurasi ≤ 100 m, ≤ 1 ping/2 dtk). Data ditolak tidak mengubah `bus_live_state` |
| Map-matching | BR-02: on-route bila ≤ 50 m dari `corridor_paths.geom`; `progress_fraction` lewat `ST_LineLocatePoint` |
| ETA | BR-03: `v = max(rata-rata 2 menit, 8 km/jam)`, `dwell = 20 dtk` per halte antara, disimpan di `bus_live_state.next_stop_etas` |
| Status | BR-06, dihitung worker tiap 10 dtk |
| Penyimpanan | Hanya posisi terkini (`bus_live_state`), tanpa riwayat GPS (D-S5) |
| Keamanan | TLS 1.3, Zod, rate limiting, CSP/HSTS, RLS: anon hanya `SELECT`, tulis lewat service role. Tabel `buses` tidak publik |
| Hosting | Default Supabase (PostgreSQL 15 + PostGIS + Realtime); alternatif VPS 2 vCPU/4 GB |

### 7.1 Model data yang dipakai antarmuka
`corridors` · `corridor_paths` · `bus_stops` · `corridor_stops` · `buses` (hanya kolom aman: nomor lambung, kapasitas) · `bus_live_state` · `schedules` · `announcements`.

Kolom yang menentukan tampilan: `corridors.color_hex`, `fare`, `operating_start/end`, `default_headway_minutes`, `is_published` · `bus_stops.stop_type`, `photo_url`, `has_shelter`, `condition_status` · `corridor_stops.stop_sequence`, `direction` · `bus_live_state.tracking_status`, `heading`, `next_stop_etas`.

---

## 8. Kondisi Khusus Antarmuka

| Kondisi | Tampilan | Teks |
| :--- | :--- | :--- |
| Izin lokasi ditolak | `NearbyList` diganti dua pilihan | "Cari nama halte" atau "Pilih titik di peta" |
| Halte terdekat > 5 km | Pesan di kartu | "Anda berada di luar area layanan" |
| Belum ada bus beroperasi | `StatusPill` netral, peta tanpa bus | "Belum ada bus beroperasi saat ini; jam operasional 06:00–21:00" |
| Di luar jam operasional | Sama seperti di atas | Jam operasional koridor |
| Offline | `OfflineBanner` | "Mode offline: posisi bus tidak tersedia" |
| Bus `STALE` | Titik `--sun` | "Sinyal lemah" |
| Bus `OFFLINE` | Ikon redup, ETA kosong | "Offline" + jadwal statis |
| Koridor belum dipublikasikan | Tidak tampil di grid dan peta | Di tab Halte: "Rute sedang dilengkapi" |
| Tanpa data tracking (R-1) | Fitur bus disembunyikan | Jadwal statis berlabel "Berdasarkan jadwal" |
| Galat API | Kartu `--mist` + tombol ulang | "Data belum dapat dimuat. Coba lagi." |

---

## 9. Kebutuhan Non-Fungsional → Keputusan Desain

| NFR | Keputusan |
| :--- | :--- |
| NFR-01/02 Kinerja | Halaman peta interaktif < 3 dtk di 4G; JS awal halaman peta ≤ 250 KB gzip (peta dimuat dinamis, di bawah lipatan pertama pada `/`). Hero memakai gambar yang dioptimalkan, bukan base64 |
| NFR-04 Ketersediaan | `/healthz`; indikator Offline di UI saat WebSocket putus |
| NFR-06 Privasi | Tidak ada form, akun, atau pelacak. Lokasi pengguna hanya di perangkat, dengan persetujuan eksplisit |
| NFR-07 Usability | ≥ 360 px, kontras WCAG AA, target sentuh ≥ 44 px, `h1` tunggal, urutan fokus mengikuti urutan section, `aria-live` untuk status pencarian dan ETA |
| NFR-08 Kompatibilitas | Chrome/Edge/Firefox/Safari 2 versi terakhir; Android 8.0+ RAM 2 GB. Tanpa `backdrop-filter` pun nav tetap terbaca (latar `--navy` sebagai cadangan) |
| NFR-09 Maintainability | TypeScript strict, ESLint, token terpusat di `tailwind.config` |

---

## 10. Traceability: Kebutuhan → Komponen → Endpoint → Tabel

| Requirement | Komponen | Endpoint | Tabel |
| :--- | :--- | :--- | :--- |
| US-01 Peta jalur | `MapPreview`, peta penuh, `CorridorGrid` | `GET /corridors?geometry=` | `corridors`, `corridor_paths`, `bus_stops` |
| US-02 Halte terdekat | `NearbyList`, `LocationConsent`, ubin 6 | `GET /stops/nearby` | `bus_stops`, `corridor_stops` |
| US-03 Urutan halte | `CorridorPage`, tab Halte | `GET /corridors/:code/stops`, `/stops/:code` | `corridor_stops`, `bus_stops` |
| US-04 Jadwal & tarif | Tab Jadwal & Tarif | `GET /schedules`, `/corridors` | `corridors`, `schedules` |
| US-05 Posisi & ETA | `MapPreview`, `BusDetail`, `LiveBanner`, `StatusPill` | `GET /buses/live`, `/buses/:hull/eta`, `WS /ws/v1/live` | `buses`, `bus_live_state` |
| US-06 Pencarian | `QuickSearchBar` | `GET /stops?q=` | `bus_stops` |
| US-07 Bus berikutnya | `StopSheet`, `HubCards` | `GET /stops/:code/arrivals` | `bus_live_state`, `schedules` |
| US-08 Pengumuman | `AnnouncementStrip` | `GET /announcements` | `announcements` |
| US-09 Offline | `OfflineBanner`, service worker | — (cache) | — |
| US-10 Transfer | `HubCards`, ubin 8, "Cari Rute" | `GET /stops`, `/corridors/:code/stops` | `corridor_stops` |
| US-11 Kontak | `SiteFooter`, `/kontak` | `GET /system-info` | konfigurasi |
| TRK-01–04 | (tanpa UI) sumber data bagi komponen tracking | `POST /telemetry/location`, `WS /ws/v1/live` | `bus_live_state` |

Prioritas rilis: **P0** US-01–05 dan TRK-01–04 · **P1** US-06–09, US-11 · **P2** US-10.

---

## 11. Data yang Memengaruhi Tampilan (jangan dikarang)

| # | Data | Dampak ke desain |
| :--- | :--- | :--- |
| G-1 | Urutan halte per koridor dan arah | Menentukan koridor mana yang tampil (BR-12) |
| G-2 | Polyline rute per arah | Tanpa polyline, koridor tidak digambar dan ETA tidak dihitung |
| G-3 | Alamat, foto, kondisi halte | Foto kosong memakai ilustrasi adegan bawaan |
| G-4 | Jam operasional dan headway | Default 06:00–21:00 dan 15 menit **[PERLU KONFIRMASI]** |
| G-5 | Tarif berlaku | Default Gratis **[PERLU KONFIRMASI]** |
| G-6 | Daftar bus dan token GPS | Menentukan jumlah bus pada `StatusPill` |
| G-7 | Poligon batas Kota Palu | Validasi wilayah (BR-01) |

---

## 12. Pertanyaan Terbuka yang Mengikat ke Desain

| ID | Pertanyaan | Komponen terdampak |
| :--- | :--- | :--- |
| OQ-01 | Apakah GPS tracker menyediakan API/protokol terbuka? | `StatusPill`, `LiveBanner`, `BusDetail`, ubin 7 (fallback jadwal statis) |
| OQ-02 | Sumber resmi urutan halte dan jalur rute | `CorridorPage`, `MapPreview` |
| OQ-03 | Apakah tarif masih gratis? | Tab Tarif |
| OQ-04 | Jam operasional dan headway aktual | Tab Jadwal, `StatusPill` |
| OQ-S1 | Siapa yang memperbarui data setelah rilis? | `AnnouncementStrip`, tab Jadwal & Tarif |
| OQ-S2 | Perlu formulir pengaduan tanpa login? (default: tidak) | Tidak ada komponen saat ini |

---

## Lampiran A — Konfigurasi Tailwind (nilai identik dengan prototipe)

```js
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: '#1b2d52', deep: '#121e3a', coral: '#ff6b4a',
        sky: '#4f9fe0', sun: '#ffc233', mist: '#f3f6fb', ink: '#17233f'
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Arial Narrow', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        nav: ['"Open Sans"', 'system-ui', 'sans-serif']
      }
    }
  }
}
```

## Lampiran B — Variabel Lingkungan Minimum
`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_MAP_TILE_URL`, `NEXT_PUBLIC_DEFAULT_TZ=Asia/Makassar`, `TELEMETRY_RATE_LIMIT_MS=2000`, `ETA_MIN_SPEED_KMH=8`, `ETA_DWELL_SECONDS=20`, `ONROUTE_THRESHOLD_M=50`.
