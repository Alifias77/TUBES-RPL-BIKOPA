import fs from 'fs';
import path from 'path';

// Read titik_halte_trans_palu.csv
const csvPath = path.resolve('titik_halte_trans_palu.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const lines = csvContent.split(/\r?\n/).filter(l => l.trim().length > 0);
const headers = lines[0].split(',');

const stops = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  // Regex to handle comma inside quotes
  const match = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  // Simple csv parser for our format
  const parts = [];
  let inQuote = false;
  let current = '';
  for (let ch of line) {
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current.trim());

  if (parts.length >= 5) {
    const nama = parts[0];
    const tipe = parts[1];
    const koridor = parts[2].replace(/"/g, '');
    const lat = parseFloat(parts[3]);
    const lon = parseFloat(parts[4]);
    const stopCode = `HLT-${String(i).padStart(3, '0')}`;
    const stopType = tipe.includes('Hub') || tipe.includes('Terminal') ? 'HUB' : 'BUS_STOP';

    stops.push({
      stop_code: stopCode,
      name: nama,
      lat,
      lon,
      stop_type: stopType,
      corridors: koridor.split(',').map(c => c.trim()),
    });
  }
}

// Generate SQL Seed
let sql = `-- BIKOPA Master Data Seed for Supabase
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
`;

const stopValues = stops.map(s => {
  const safeName = s.name.replace(/'/g, "''");
  const hasShelter = s.stop_type === 'HUB' ? 'true' : 'false';
  return `  ('${s.stop_code}', '${safeName}', 'Jl. Kota Palu', ${s.lat.toFixed(8)}, ${s.lon.toFixed(8)}, '${s.stop_type}', ${hasShelter}, 'GOOD', true)`;
});

sql += stopValues.join(',\n') + '\nON CONFLICT (stop_code) DO NOTHING;\n\n';

// 3. Insert Buses
sql += `-- 3. Insert Armada Trans Palu
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
`;

fs.writeFileSync(path.resolve('supabase', 'seed.sql'), sql, 'utf-8');
console.log('Seed SQL generated successfully at supabase/seed.sql with', stops.length, 'stops!');
