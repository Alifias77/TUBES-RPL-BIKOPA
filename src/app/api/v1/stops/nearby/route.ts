import { NextRequest, NextResponse } from 'next/server';
import { findNearbyStops } from '@/lib/geo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const radius = parseInt(searchParams.get('radius') || '1000', 10);
  const limit = parseInt(searchParams.get('limit') || '3', 10);

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: { code: 'BAD_REQUEST', message: 'Parameter lat dan lng wajib diisi.' } },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  const { stops, isOutOfServiceArea } = findNearbyStops(lat, lng, radius, limit);

  return NextResponse.json({
    user_location: { latitude: lat, longitude: lng },
    radius_meters: radius,
    is_out_of_service_area: isOutOfServiceArea,
    data: stops,
  });
}
