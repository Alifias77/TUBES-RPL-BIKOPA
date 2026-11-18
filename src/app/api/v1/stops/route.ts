import { NextRequest, NextResponse } from 'next/server';
import { BUS_STOPS } from '@/lib/data/stops';
import { supabase, isSupabaseConfigured, withTimeout } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.toLowerCase();
  const corridor = searchParams.get('corridor')?.toUpperCase();
  const type = searchParams.get('type')?.toUpperCase();

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('bus_stops').select('*').eq('is_active', true);

      if (type) {
        query = query.eq('stop_type', type);
      }
      if (q) {
        query = query.ilike('name', `%${q}%`);
      }

      const { data, error } = await withTimeout(query.order('stop_code', { ascending: true }), 1200);

      if (!error && data && data.length > 0) {
        let filtered = data;
        if (corridor) {
          // Jika ada filter koridor, filter berdasarkan relasi atau array
          filtered = data.filter((s: any) =>
            Array.isArray(s.corridors) ? s.corridors.includes(corridor) : true
          );
        }
        return NextResponse.json({
          source: 'database',
          total: filtered.length,
          data: filtered,
        });
      }
    } catch (err) {
      console.warn('Gagal memuat halte dari Supabase, beralih ke data master lokal:', err);
    }
  }

  // Fallback ke master data lokal 53 halte
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
    source: 'static_fallback',
    total: results.length,
    data: results,
  });
}
