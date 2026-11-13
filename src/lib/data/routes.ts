import { BUS_STOPS } from './stops';
import { BusStop } from '../types';
import ROAD_ROUTES from './corridor-road-routes.json';

/**
 * Urutan titik halte resmi per koridor berdasarkan titik_halte_trans_palu.csv
 */
export const CORRIDOR_STOP_SEQUENCES: Record<string, string[]> = {
  '01': [
    'HLT-001', // Pelabuhan Pantoloan (Hub)
    'HLT-007', // Puskesmas Tawaeli
    'HLT-008', // Puskesmas Kayumalue
    'HLT-009', // Taipa Beach
    'HLT-010', // Brimob
    'HLT-011', // Terminal Mamboro
    'HLT-012', // Huntap Tondo 1
    'HLT-014', // Universitas Terbuka
    'HLT-013', // Islamic Center Untad
    'HLT-015', // Undata
    'HLT-016', // Puskesmas Talise
    'HLT-043', // Tombolututu
    'HLT-044', // Inspektorat
    'HLT-042', // Rumah Sakit Bayangkara
    'HLT-017', // Polresta
    'HLT-045', // SMAN 1
    'HLT-018', // Korem
    'HLT-019', // Titik 0 Km
    'HLT-002', // Taman GOR (Hub)
  ],
  '02': [
    'HLT-003', // Balai Kota (Hub)
    'HLT-032', // Kartini
    'HLT-020', // Telkom
    'HLT-021', // Moh Hatta
    'HLT-002', // Taman GOR (Hub)
    'HLT-018', // Korem
    'HLT-019', // Titik 0 Km
    'HLT-022', // Hasanuddin
    'HLT-023', // Gajah Mada
    'HLT-024', // Sis Aljufri
    'HLT-025', // SMPN 3
    'HLT-004', // Pasar Inpres Manonda (Hub)
    'HLT-026', // Anutapura
    'HLT-027', // Masjid Raya
    'HLT-028', // Wahid Hasyim
    'HLT-029', // Kimaja
    'HLT-030', // Hi Hayun
    'HLT-031', // SMPN 2
  ],
  '03M': [
    'HLT-002', // Taman GOR (Hub)
    'HLT-039', // Monginsidi
    'HLT-038', // Pasar Masomba
    'HLT-037', // 711
    'HLT-036', // TMP
    'HLT-035', // Basrah 2
    'HLT-034', // Basrah 1
    'HLT-033', // Puskesmas Birobuli
    'HLT-005', // Bandara Mutiara SIS Al-Jufri (Hub)
  ],
  '03Y': [
    'HLT-002', // Taman GOR (Hub)
    'HLT-003', // Balai Kota (Hub)
    'HLT-041', // Kejaksaan
    'HLT-040', // KPP Pratama
    'HLT-038', // Pasar Masomba
    'HLT-037', // 711
    'HLT-036', // TMP
    'HLT-035', // Basrah 2
    'HLT-034', // Basrah 1
    'HLT-033', // Puskesmas Birobuli
    'HLT-005', // Bandara Mutiara SIS Al-Jufri (Hub)
  ],
  '04': [
    'HLT-006', // Terminal Tipo (Hub)
    'HLT-046', // Silae
    'HLT-047', // PGM
    'HLT-048', // Palu Plaza
    'HLT-050', // Pue Bongo 2
    'HLT-049', // Pue Bongo 1
    'HLT-051', // Bundaran Palupi
    'HLT-052', // Pasar TavanJuka
    'HLT-053', // Puskesmas Mabelopura
    'HLT-005', // Bandara Mutiara SIS Al-Jufri (Hub)
  ],
};

const STOP_MAP = new Map<string, BusStop>();
BUS_STOPS.forEach((stop) => STOP_MAP.set(stop.stop_code, stop));

/**
 * Mendapatkan daftar halte terurut untuk koridor tertentu
 */
export function getOrderedStopsForCorridor(corridorCode: string, direction: 'OUTBOUND' | 'INBOUND' = 'OUTBOUND'): BusStop[] {
  const seq = CORRIDOR_STOP_SEQUENCES[corridorCode] || [];
  const stops = seq.map((code) => STOP_MAP.get(code)).filter((s): s is BusStop => Boolean(s));
  return direction === 'INBOUND' ? [...stops].reverse() : stops;
}

/**
 * Mendapatkan jalur koordinat [lat, lng] presisi mengikuti kontur jalan raya pada peta Leaflet
 */
export function getCorridorCoordinates(corridorCode: string): [number, number][] {
  const roadCoords = (ROAD_ROUTES as unknown as Record<string, [number, number][]>)[corridorCode];
  if (roadCoords && roadCoords.length > 0) {
    return roadCoords;
  }
  const stops = getOrderedStopsForCorridor(corridorCode, 'OUTBOUND');
  return stops.map((s) => [s.latitude, s.longitude]);
}
