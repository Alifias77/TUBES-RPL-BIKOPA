import { NextResponse } from 'next/server';
import { SYSTEM_INFO } from '@/lib/data/system-info';

export async function GET() {
  return NextResponse.json({
    data: SYSTEM_INFO,
  });
}
