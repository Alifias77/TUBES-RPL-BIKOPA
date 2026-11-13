import { NextRequest, NextResponse } from 'next/server';
import { getLiveBuses } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const corridor = searchParams.get('corridor')?.toUpperCase();

  let buses = getLiveBuses();

  // Exclude OFFLINE buses from live movement if specified by query
  if (corridor) {
    buses = buses.filter((b) => b.corridor_code === corridor);
  }

  return NextResponse.json({
    total: buses.length,
    active_count: buses.filter((b) => b.tracking_status === 'ACTIVE').length,
    data: buses,
  });
}
