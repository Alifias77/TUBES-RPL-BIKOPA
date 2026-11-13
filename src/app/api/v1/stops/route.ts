import { NextRequest, NextResponse } from 'next/server';
import { BUS_STOPS } from '@/lib/data/stops';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase();
  const corridor = searchParams.get('corridor')?.toUpperCase();
  const type = searchParams.get('type')?.toUpperCase();

  let results = [...BUS_STOPS];

  if (corridor) {
    results = results.filter((s) => s.corridors.includes(corridor));
  }

  if (type) {
    results = results.filter((s) => s.stop_type === type);
  }

  if (q) {
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.short_name && s.short_name.toLowerCase().includes(q)) ||
        s.stop_code.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    total: results.length,
    data: results,
  });
}
