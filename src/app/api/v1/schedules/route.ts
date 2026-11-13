import { NextRequest, NextResponse } from 'next/server';
import { SCHEDULES } from '@/lib/data/schedules';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const corridor = searchParams.get('corridor')?.toUpperCase();
  const dayType = searchParams.get('day_type')?.toUpperCase();

  let results = [...SCHEDULES];

  if (corridor) {
    results = results.filter((s) => s.corridor_code === corridor);
  }

  if (dayType) {
    results = results.filter((s) => s.day_type === dayType || s.day_type === 'DAILY');
  }

  return NextResponse.json({
    data: results,
  });
}
