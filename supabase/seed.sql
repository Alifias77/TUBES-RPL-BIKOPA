-- BIKOPA Master Data Seed for Supabase
-- PostgreSQL 15 + PostGIS

-- 1. Insert Corridors
INSERT INTO corridors (code, name, via_route, color_hex, fare, operating_start, operating_end, default_headway_minutes, sort_order, is_active, is_published)
VALUES
  ('01', 'Pantoloan – Pusat Kota', 'Jalur utama Trans Sulawesi – Pantoloan', '#EF4444', 0.00, '06:00:00', '21:00:00', 15, 1, true, true),
  ('02', 'Balai Kota – Pasar Manonda', 'Balai Kota – Pusat Kota – Pasar Inpres Manonda', '#3B82F6', 0.00, '06:00:00', '21:00:00', 15, 2, true, true),
  ('03M', 'Pusat Kota – Bandara MSA', 'via Jl. Wolter Monginsidi', '#10B981', 0.00, '06:00:00', '21:00:00', 15, 3, true, true),
  ('03Y', 'Pusat Kota – Bandara MSA', 'via Jl. Dewi Sartika / Prof. M. Yamin', '#F59E0B', 0.00, '06:00:00', '21:00:00', 15, 4, true, true),
  ('04', 'Pelabuhan Pantoloan – Bandara MSA', 'Jalur Lingkar Barat & Pusat Kota (Tipo - Bandara)', '#8B5CF6', 0.00, '06:00:00', '21:00:00', 15, 5, true, true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  via_route = EXCLUDED.via_route,
  color_hex = EXCLUDED.color_hex,
  is_published = EXCLUDED.is_published;

-- 2. Insert 53 Master Bus Stops
INSERT INTO bus_stops (stop_code, name, address, latitude, longitude, stop_type, has_shelter, condition_status, is_active)
VALUES
  ('HLT-001', 'Pelabuhan Pantoloan', 'Jl. Kota Palu', -0.70832251, 119.85717594, 'HUB', true, 'GOOD', true),
  ('HLT-002', 'Taman GOR', 'Jl. Kota Palu', -0.89629353, 119.87152201, 'HUB', true, 'GOOD', true),
  ('HLT-003', 'Balai Kota', 'Jl. Kota Palu', -0.89927575, 119.89004821, 'HUB', true, 'GOOD', true),
  ('HLT-004', 'Pasar Inpres Manonda', 'Jl. Kota Palu', -0.90330019, 119.85187801, 'HUB', true, 'GOOD', true),
  ('HLT-005', 'Bandara Mutiara SIS Al-Jufri', 'Jl. Kota Palu', -0.91862354, 119.90591876, 'HUB', true, 'GOOD', true),
  ('HLT-006', 'Terminal Tipo', 'Jl. Kota Palu', -0.86169151, 119.82640439, 'HUB', true, 'GOOD', true),
  ('HLT-007', 'Puskesmas Tawaeli', 'Jl. Kota Palu', -0.73384076, 119.86344336, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-008', 'Puskesmas Kayumalue', 'Jl. Kota Palu', -0.75593656, 119.86509754, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-009', 'Taipa Beach', 'Jl. Kota Palu', -0.78175884, 119.86054648, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-010', 'Brimob', 'Jl. Kota Palu', -0.78668393, 119.87278640, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-011', 'Terminal Mamboro', 'Jl. Kota Palu', -0.80567574, 119.88297665, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-012', 'Huntap Tondo 1', 'Jl. Kota Palu', -0.82853898, 119.90225004, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-013', 'Islamic Center Untad', 'Jl. Kota Palu', -0.84279672, 119.89518617, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-014', 'Universitas Terbuka', 'Jl. Kota Palu', -0.83593951, 119.88603873, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-015', 'Undata', 'Jl. Kota Palu', -0.85761872, 119.88400378, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-016', 'Puskesmas Talise', 'Jl. Kota Palu', -0.87580633, 119.87355917, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-017', 'Polresta', 'Jl. Kota Palu', -0.88985326, 119.87001038, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-018', 'Korem', 'Jl. Kota Palu', -0.89456190, 119.86980040, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-019', 'Titik 0 Km', 'Jl. Kota Palu', -0.89686457, 119.86882980, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-020', 'Telkom', 'Jl. Kota Palu', -0.89669262, 119.88007883, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-021', 'Moh Hatta', 'Jl. Kota Palu', -0.89632480, 119.87330993, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-022', 'Hasanuddin', 'Jl. Kota Palu', -0.89722020, 119.86961815, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-023', 'Gajah Mada', 'Jl. Kota Palu', -0.89808727, 119.86325677, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-024', 'Sis Aljufri', 'Jl. Kota Palu', -0.90214507, 119.85819346, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-025', 'SMPN 3', 'Jl. Kota Palu', -0.90262319, 119.85602398, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-026', 'Anutapura', 'Jl. Kota Palu', -0.89907910, 119.84926657, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-027', 'Masjid Raya', 'Jl. Kota Palu', -0.89357255, 119.85229799, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-028', 'Wahid Hasyim', 'Jl. Kota Palu', -0.89320502, 119.85898328, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-029', 'Kimaja', 'Jl. Kota Palu', -0.89186902, 119.86417561, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-030', 'Hi Hayun', 'Jl. Kota Palu', -0.89224134, 119.86808048, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-031', 'SMPN 2', 'Jl. Kota Palu', -0.89986972, 119.87345900, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-032', 'Kartini', 'Jl. Kota Palu', -0.90110318, 119.88109618, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-033', 'Puskesmas Birobuli', 'Jl. Kota Palu', -0.91905795, 119.89530937, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-034', 'Basrah 1', 'Jl. Kota Palu', -0.91888081, 119.88883704, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-035', 'Basrah 2', 'Jl. Kota Palu', -0.91888137, 119.87765924, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-036', 'TMP', 'Jl. Kota Palu', -0.91911738, 119.88055603, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-037', '711', 'Jl. Kota Palu', -0.91681327, 119.87633193, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-038', 'Pasar Masomba', 'Jl. Kota Palu', -0.90819752, 119.87917783, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-039', 'Monginsidi', 'Jl. Kota Palu', -0.90391475, 119.87460876, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-040', 'KPP Pratama', 'Jl. Kota Palu', -0.91368003, 119.89046605, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-041', 'Kejaksaan', 'Jl. Kota Palu', -0.90994037, 119.88959080, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-042', 'Rumah Sakit Bayangkara', 'Jl. Kota Palu', -0.88892297, 119.86814449, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-043', 'Tombolututu', 'Jl. Kota Palu', -0.88362835, 119.87923066, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-044', 'Inspektorat', 'Jl. Kota Palu', -0.88671597, 119.87567586, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-045', 'SMAN 1', 'Jl. Kota Palu', -0.89375499, 119.87482228, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-046', 'Silae', 'Jl. Kota Palu', -0.87164112, 119.83320537, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-047', 'PGM', 'Jl. Kota Palu', -0.88326356, 119.84237098, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-048', 'Palu Plaza', 'Jl. Kota Palu', -0.89928160, 119.86070540, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-049', 'Pue Bongo 1', 'Jl. Kota Palu', -0.92010869, 119.85630701, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-050', 'Pue Bongo 2', 'Jl. Kota Palu', -0.90906843, 119.85616726, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-051', 'Bundaran Palupi', 'Jl. Kota Palu', -0.92207383, 119.85858714, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-052', 'Pasar TavanJuka', 'Jl. Kota Palu', -0.92243152, 119.86491408, 'BUS_STOP', false, 'GOOD', true),
  ('HLT-053', 'Puskesmas Mabelopura', 'Jl. Kota Palu', -0.91852109, 119.87547873, 'BUS_STOP', false, 'GOOD', true)
ON CONFLICT (stop_code) DO NOTHING;

-- 3. Insert Armada Trans Palu
INSERT INTO buses (hull_number, license_plate, operator_name, total_capacity, seat_capacity, status)
VALUES
  ('TP-01', 'DN 7001 AP', 'PT Bagong Dekaka Makmur (Bagong Transport)', 35, 21, 'OPERATING'),
  ('TP-02', 'DN 7002 AP', 'PT Bagong Dekaka Makmur (Bagong Transport)', 35, 21, 'OPERATING'),
  ('TP-03', 'DN 7003 AP', 'PT Bagong Dekaka Makmur (Bagong Transport)', 35, 21, 'OPERATING'),
  ('TP-04', 'DN 7004 AP', 'PT Bagong Dekaka Makmur (Bagong Transport)', 35, 21, 'OPERATING'),
  ('TP-05', 'DN 7005 AP', 'PT Bagong Dekaka Makmur (Bagong Transport)', 35, 21, 'OPERATING'),
  ('TP-06', 'DN 7006 AP', 'PT Bagong Dekaka Makmur (Bagong Transport)', 35, 21, 'OPERATING')
ON CONFLICT (hull_number) DO NOTHING;

-- 4. Initial Live State for Buses
INSERT INTO bus_live_state (bus_id, latitude, longitude, speed_kmh, heading, tracking_status, last_seen_at)
SELECT id, -0.89629353, 119.87152201, 25.0, 90, 'ACTIVE', now()
FROM buses
ON CONFLICT (bus_id) DO UPDATE SET tracking_status = 'ACTIVE', last_seen_at = now();

-- 5. Insert Sample Announcements
INSERT INTO announcements (title, body, type, starts_at, is_active)
VALUES
  ('Layanan Gratis Trans Palu', 'Bus Trans Palu beroperasi melayani 5 koridor setiap hari pukul 06:00 - 21:00 WITA.', 'INFO', now(), true)
ON CONFLICT DO NOTHING;
