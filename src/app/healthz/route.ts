import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BIKOPA Trans Palu API',
    uptime: process.uptime(),
  });
}
