import { NextRequest, NextResponse } from 'next/server';
import { BUS_STOPS_MAP } from '@/lib/data/stops';

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

  return NextResponse.json({
    data: stop,
  });
}
