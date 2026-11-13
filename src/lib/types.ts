import { z } from 'zod';

export type TrackingStatus = 'ACTIVE' | 'STALE' | 'OFFLINE';
export type StopType = 'HUB' | 'SHELTER' | 'BUS_STOP';
export type Direction = 'OUTBOUND' | 'INBOUND';
export type DayType = 'WEEKDAY' | 'WEEKEND' | 'DAILY';
export type AnnouncementType = 'INFO' | 'ROUTE_DIVERSION' | 'FARE_CHANGE' | 'SCHEDULE_CHANGE' | 'DISRUPTION';

export interface Corridor {
  id: string;
  code: '01' | '02' | '03M' | '03Y' | '04';
  name: string;
  via_route: string;
  color_hex: string;
  fare: number;
  operating_start: string;
  operating_end: string;
  default_headway_minutes: number;
  sort_order: number;
  is_active: boolean;
  is_published: boolean;
  stops_count?: number;
  hubs?: string[];
  schematic_path?: string;
}

export interface BusStop {
  id: string;
  stop_code: string;
  name: string;
  short_name?: string;
  address?: string;
  latitude: number;
  longitude: number;
  stop_type: StopType;
  has_shelter: boolean;
  condition_status: 'GOOD' | 'DAMAGED' | 'UNDER_REPAIR';
  photo_url?: string;
  is_active: boolean;
  corridors: string[];
  // Schematic coordinates for visual map
  schematic_x?: number;
  schematic_y?: number;
  label_x?: number;
  label_y?: number;
  label_anchor?: 'start' | 'middle' | 'end';
}

export interface CorridorStop {
  id: string;
  corridor_id: string;
  corridor_code: string;
  bus_stop_id: string;
  stop_code: string;
  direction: Direction;
  stop_sequence: number | null;
  estimated_time_from_prev: number;
  distance_from_prev_m?: number;
}

export interface Bus {
  id: string;
  hull_number: string;
  license_plate: string;
  corridor_code: string;
  operator_name: string;
  total_capacity: number;
  seat_capacity: number;
  status: 'OPERATING' | 'MAINTENANCE' | 'INACTIVE';
}

export interface StopEta {
  stop_code: string;
  stop_name?: string;
  eta_min: number | null;
  distance_m: number;
}

export interface BusLiveState {
  bus_id: string;
  hull_number: string;
  corridor_code: string;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  heading: number;
  direction: Direction;
  progress_fraction?: number;
  is_on_route: boolean;
  tracking_status: TrackingStatus;
  next_stop_etas: StopEta[];
  last_seen_at: string;
  // Schematic simulation properties
  p?: number;
  dir?: 1 | -1;
}

export interface Schedule {
  id: string;
  corridor_code: string;
  direction: Direction;
  departure_time: string;
  headway_minutes: number;
  day_type: DayType;
  valid_from?: string;
  is_active: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: AnnouncementType;
  corridor_code?: string;
  starts_at: string;
  ends_at?: string;
  is_active: boolean;
}

export interface SystemInfo {
  app_name: string;
  service_name: string;
  office_address: string;
  phone: string;
  operator_name: string;
  fleet_info: {
    total_buses: number;
    capacity: string;
    livery: string;
    fare_status: string;
  };
  data_version: string;
  last_updated: string;
}

// Zod validation schemas (BR-01, BR-13, TRK-01)
export const TelemetryLocationSchema = z.object({
  hull_number: z.string().min(1),
  lat: z.number().min(-1.00).max(-0.65), // Kota Palu bounding box (BR-01)
  lng: z.number().min(119.75).max(119.97),
  speed: z.number().min(0).max(120), // Max 120 km/h (BR-13)
  heading: z.number().min(0).max(360),
  accuracy: z.number().min(0).max(100).optional(), // Max 100m (BR-13)
  timestamp: z.string().datetime({ offset: true }).or(z.string()),
  device_token: z.string().optional(),
});

export const BulkTelemetrySchema = z.object({
  points: z.array(TelemetryLocationSchema),
});
