import { NextRequest, NextResponse } from 'next/server';
import { BUS_STOPS_MAP } from '@/lib/data/stops';
import { CORRIDORS } from '@/lib/data/corridors';
import { getLiveBuses } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code.toUpperCase();
  const stop = BUS_STOPS_MAP[code];

  if (!stop) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: `Halte ${code} tidak ditemukan.` } },
      { status: 404 }
    );
  }

  const liveBuses = getLiveBuses();

  const arrivals = stop.corridors.map((cCode) => {
    const c = CORRIDORS[cCode];
    let bestEta: number | null = null;
    let matchingBus: any = null;

    liveBuses.forEach((b) => {
      if (b.corridor_code === cCode && b.tracking_status === 'ACTIVE') {
        const found = b.next_stop_etas.find((item) => item.stop_code === code);
        if (found && found.eta_min !== null) {
          if (bestEta === null || found.eta_min < bestEta) {
            bestEta = found.eta_min;
            matchingBus = b;
          }
        }
      }
    });

    return {
      corridor_code: cCode,
      corridor_name: c?.name,
      color_hex: c?.color_hex,
      eta_min: bestEta,
      eta_label: bestEta !== null ? 'Perkiraan' : 'Berdasarkan jadwal',
      headway_minutes: c?.default_headway_minutes || 15,
      bus: matchingBus ? { hull_number: matchingBus.hull_number, speed_kmh: matchingBus.speed_kmh } : null,
    };
  });

  return NextResponse.json({
    stop_code: code,
    stop_name: stop.name,
    arrivals,
  });
}
