import { NextResponse } from 'next/server';
import { CORRIDORS, CORRIDOR_CODES } from '@/lib/data/corridors';

export async function GET() {
  const publishedCorridors = CORRIDOR_CODES.map((code) => CORRIDORS[code]).filter(
    (c) => c.is_active && c.is_published
  );

  return NextResponse.json({
    data: publishedCorridors,
  });
}
