import { NextRequest, NextResponse } from 'next/server';
import { TelemetryLocationSchema, BulkTelemetrySchema } from '@/lib/types';
import { isWithinKotaPalu } from '@/lib/geo';
import { updateBusTelemetry } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support single point or bulk points[] (PRD 9, TRK-01)
    const isBulk = Array.isArray(body?.points);
    const parsed = isBulk
      ? BulkTelemetrySchema.safeParse(body)
      : TelemetryLocationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_TELEMETRY',
            message: 'Format data telemetri tidak valid.',
            details: parsed.error.issues,
          },
        },
        { status: 422 }
      );
    }

    const points = isBulk
      ? (parsed.data as any).points
      : [parsed.data];

    for (const point of points) {
      // BR-01: Validasi wilayah Kota Palu
      if (!isWithinKotaPalu(point.lat, point.lng)) {
        return NextResponse.json(
          {
            error: {
              code: 'OUT_OF_BOUNDS',
              message: `Koordinat (${point.lat}, ${point.lng}) berada di luar wilayah operasional Kota Palu.`,
            },
          },
          { status: 422 }
        );
      }

      // Update bus live state in store
      updateBusTelemetry(
        point.hull_number,
        point.lat,
        point.lng,
        point.speed,
        point.heading
      );
    }

    return NextResponse.json(
      {
        status: 'ACCEPTED',
        message: 'Data telemetri berhasil diterima dan diproses.',
        processed_points: points.length,
      },
      { status: 202 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: err.message || 'Gagal memproses telemetri.',
        },
      },
      { status: 500 }
    );
  }
}
