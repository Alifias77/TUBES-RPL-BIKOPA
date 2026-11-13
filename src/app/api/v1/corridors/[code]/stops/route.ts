import { NextRequest, NextResponse } from 'next/server';
import { CORRIDORS } from '@/lib/data/corridors';
import { getOrderedStopsForCorridor } from '@/lib/data/routes';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code.toUpperCase();
  const corridor = CORRIDORS[code];

  if (!corridor) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: `Koridor ${code} tidak ditemukan.` } },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(req.url);
  const directionParam = searchParams.get('direction');
  const direction = directionParam?.toUpperCase() === 'INBOUND' ? 'INBOUND' : 'OUTBOUND';

  const orderedStops = getOrderedStopsForCorridor(code, direction);

  return NextResponse.json({
    corridor_code: code,
    direction,
    total_stops: orderedStops.length,
    stops: orderedStops,
  });
}
