import { NextRequest, NextResponse } from 'next/server';
import { getLiveBuses } from '@/lib/store';
import { supabase, isSupabaseConfigured, withTimeout } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const corridor = searchParams.get('corridor')?.toUpperCase();

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('bus_live_state').select('*');
      if (corridor) {
        query = query.eq('corridor_code', corridor);
      }

      const { data, error } = await withTimeout(query, 1200);
      if (!error && data && data.length > 0) {
        return NextResponse.json({
          source: 'database',
          total: data.length,
          active_count: data.filter((b: any) => b.tracking_status === 'ACTIVE').length,
          data,
        });
      }
    } catch (err) {
      console.warn('Gagal memuat live bus dari Supabase, beralih ke in-memory store:', err);
    }
  }

  // Fallback ke in-memory store
  let buses = getLiveBuses();

  if (corridor) {
    buses = buses.filter((b) => b.corridor_code === corridor);
  }

  return NextResponse.json({
    source: 'in_memory_fallback',
    total: buses.length,
    active_count: buses.filter((b) => b.tracking_status === 'ACTIVE').length,
    data: buses,
  });
}
