import { BUS_STOPS } from './data/stops';
import { BusStop } from './types';

export type TransitRouteResult =
  | { type: 'same_stop' }
  | { type: 'not_found' }
  | { type: 'direct'; corridors: string[] }
  | { type: 'transfer'; hub: BusStop; c1: string; c2: string }
  | { type: 'none' };

/**
 * Mencari halte berdasarkan nama, nama pendek, atau kode halte
 */
export function findStopByNameOrCode(q: string): BusStop | undefined {
  const query = q.trim().toLowerCase();
  if (!query) return undefined;

  return (
    BUS_STOPS.find(
      (s) =>
        s.name.toLowerCase() === query ||
        (s.short_name && s.short_name.toLowerCase() === query) ||
        s.stop_code.toLowerCase() === query
    ) ||
    BUS_STOPS.find(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        (s.short_name && s.short_name.toLowerCase().includes(query))
    )
  );
}

/**
 * Mencari rute perjalanan langsung atau 1 kali transfer di hub
 */
export function findTransitRoute(stopA?: BusStop, stopB?: BusStop): TransitRouteResult {
  if (!stopA || !stopB) {
    return { type: 'not_found' };
  }

  if (stopA.stop_code === stopB.stop_code) {
    return { type: 'same_stop' };
  }

  // 1. Cek Rute Langsung (Direct Route)
  const direct = stopA.corridors.filter((c) => stopB.corridors.includes(c));
  if (direct.length > 0) {
    return { type: 'direct', corridors: direct };
  }

  // 2. Cek 1 Kali Transfer di Titik Hub (US-10)
  const hubs = BUS_STOPS.filter((s) => s.stop_type === 'HUB');
  for (const hub of hubs) {
    if (hub.stop_code === stopA.stop_code || hub.stop_code === stopB.stop_code) continue;
    const c1 = stopA.corridors.filter((c) => hub.corridors.includes(c));
    const c2 = hub.corridors.filter((c) => stopB.corridors.includes(c));
    if (c1.length > 0 && c2.length > 0) {
      return {
        type: 'transfer',
        hub,
        c1: c1[0],
        c2: c2[0],
      };
    }
  }

  return { type: 'none' };
}
