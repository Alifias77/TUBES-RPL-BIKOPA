import { BusLiveState } from './types';
import { INITIAL_BUS_LIVE_STATES } from './data/buses';
import { CORRIDORS } from './data/corridors';
import { BUS_STOPS_MAP } from './data/stops';
import { calculateETA, computeTrackingStatus } from './geo';

let globalBuses: BusLiveState[] = [...INITIAL_BUS_LIVE_STATES];
const listeners = new Set<(buses: BusLiveState[]) => void>();

export function getLiveBuses(): BusLiveState[] {
  return globalBuses;
}

export function subscribeLiveBuses(listener: (buses: BusLiveState[]) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateBusTelemetry(
  hullNumber: string,
  lat: number,
  lng: number,
  speed: number,
  heading: number
) {
  const now = new Date().toISOString();
  const index = globalBuses.findIndex((b) => b.hull_number === hullNumber);

  if (index !== -1) {
    const bus = globalBuses[index];
    globalBuses[index] = {
      ...bus,
      latitude: lat,
      longitude: lng,
      speed_kmh: speed,
      heading,
      tracking_status: 'ACTIVE',
      last_seen_at: now,
    };
  } else {
    globalBuses.push({
      bus_id: `bus-${hullNumber.toLowerCase()}`,
      hull_number: hullNumber,
      corridor_code: '01',
      latitude: lat,
      longitude: lng,
      speed_kmh: speed,
      heading,
      direction: 'OUTBOUND',
      is_on_route: true,
      tracking_status: 'ACTIVE',
      next_stop_etas: [],
      last_seen_at: now,
      p: 0.5,
      dir: 1,
    });
  }

  listeners.forEach((fn) => fn([...globalBuses]));
}

export function tickSimulation(_dt: number = 2) {
  // Simulasi real-time dinonaktifkan sesuai kebutuhan kesederhanaan sistem
}
