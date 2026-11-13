-- BIKOPA Database Schema (PRD v2.1)
-- PostgreSQL 15 + PostGIS

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Koridor
CREATE TABLE IF NOT EXISTS corridors (
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
CREATE TABLE IF NOT EXISTS corridor_paths (
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
CREATE INDEX IF NOT EXISTS idx_corridor_paths_geom ON corridor_paths USING GIST (geom);

-- 3. Halte (53 titik master)
CREATE TABLE IF NOT EXISTS bus_stops (
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
CREATE INDEX IF NOT EXISTS idx_bus_stops_location ON bus_stops USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_bus_stops_name ON bus_stops (lower(name));

-- 4. Urutan halte per koridor (many-to-many)
CREATE TABLE IF NOT EXISTS corridor_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corridor_id UUID NOT NULL REFERENCES corridors(id) ON DELETE CASCADE,
    bus_stop_id UUID NOT NULL REFERENCES bus_stops(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('OUTBOUND','INBOUND')),
    stop_sequence INT CHECK (stop_sequence > 0),
    estimated_time_from_prev INT NOT NULL DEFAULT 5,
    distance_from_prev_m INT,
    UNIQUE (corridor_id, bus_stop_id, direction)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_corridor_stops_seq
    ON corridor_stops (corridor_id, direction, stop_sequence) WHERE stop_sequence IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_corridor_stops_stop ON corridor_stops (bus_stop_id);

-- 5. Armada
CREATE TABLE IF NOT EXISTS buses (
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
CREATE TABLE IF NOT EXISTS bus_live_state (
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
CREATE INDEX IF NOT EXISTS idx_bus_live_state_location ON bus_live_state USING GIST (location);

-- 7. Jadwal
CREATE TABLE IF NOT EXISTS schedules (
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
CREATE INDEX IF NOT EXISTS idx_schedules_corridor ON schedules (corridor_id, day_type);

-- 8. Pengumuman / banner
CREATE TABLE IF NOT EXISTS announcements (
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

-- Triggers for updated_at
CREATE TRIGGER trg_corridors_upd BEFORE UPDATE ON corridors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_bus_stops_upd BEFORE UPDATE ON bus_stops FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_buses_upd BEFORE UPDATE ON buses FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ROW-LEVEL SECURITY (RLS)
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
