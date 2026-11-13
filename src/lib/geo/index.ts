import { BUS_STOPS } from '../data/stops';
import { BusStop, TrackingStatus } from '../types';

/**
 * BR-01: Validasi Bounding Box Kota Palu
 * lat in [-1.00, -0.65], lng in [119.75, 119.97]
 */
export function isWithinKotaPalu(lat: number, lng: number): boolean {
  return lat >= -1.00 && lat <= -0.65 && lng >= 119.75 && lng <= 119.97;
}

/**
 * Menghitung jarak bumi menggunakan rumus Haversine (meter)
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Radius bumi dalam meter
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface NearbyStopResult {
  stop: BusStop;
  distance_m: number;
}

/**
 * BR-04 & US-02: Mencari halte terdekat dari koordinat pengguna
 * Halte multi-koridor tampil sekali dengan daftar semua koridornya.
 * Maks 5000m (jika halte terdekat > 5000m, dianggap di luar area layanan).
 */
export function findNearbyStops(
  userLat: number,
  userLng: number,
  radiusMeters: number = 5000,
  limit: number = 3
): { stops: NearbyStopResult[]; isOutOfServiceArea: boolean } {
  const stopsWithDistance: NearbyStopResult[] = BUS_STOPS.map((stop) => ({
    stop,
    distance_m: haversineDistance(userLat, userLng, stop.latitude, stop.longitude),
  })).sort((a, b) => a.distance_m - b.distance_m);

  if (stopsWithDistance.length === 0 || stopsWithDistance[0].distance_m > 5000) {
    return {
      stops: [],
      isOutOfServiceArea: true,
    };
  }

  const filtered = stopsWithDistance
    .filter((item) => item.distance_m <= radiusMeters)
    .slice(0, limit);

  return {
    stops: filtered,
    isOutOfServiceArea: false,
  };
}

/**
 * BR-03: Formula Perhitungan ETA Bus
 * v = max(kecepatan_kmh, 8 km/jam) diubah ke m/detik
 * dwell = 20 detik per halte perantara
 * ETA = ceil((d / v + dwell * stops_between) / 60) menit
 */
export function calculateETA(
  distanceMeters: number,
  speedKmh: number,
  intermediateStopsCount: number = 0
): number {
  const minSpeedKmh = 8;
  const effectiveSpeedKmh = Math.max(speedKmh, minSpeedKmh);
  const speedMps = effectiveSpeedKmh / 3.6;

  const travelTimeSeconds = distanceMeters / speedMps;
  const dwellTimeSeconds = intermediateStopsCount * 20;
  const totalSeconds = travelTimeSeconds + dwellTimeSeconds;

  return Math.max(1, Math.ceil(totalSeconds / 60));
}

/**
 * BR-06: Status Pelacakan Berdasarkan Umur Data Terakhir
 * ACTIVE <= 30 detik
 * STALE 31 - 120 detik
 * OFFLINE > 120 detik
 */
export function computeTrackingStatus(lastSeenAtIso: string): TrackingStatus {
  const lastSeen = new Date(lastSeenAtIso).getTime();
  const diffSeconds = Math.floor((Date.now() - lastSeen) / 1000);

  if (diffSeconds <= 30) return 'ACTIVE';
  if (diffSeconds <= 120) return 'STALE';
  return 'OFFLINE';
}
