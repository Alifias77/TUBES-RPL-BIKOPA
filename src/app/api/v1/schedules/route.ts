import { NextRequest, NextResponse } from 'next/server';
import { SCHEDULES } from '@/lib/data/schedules';
import { supabase, isSupabaseConfigured, withTimeout } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const corridor = searchParams.get('corridor')?.toUpperCase();
  const dayType = searchParams.get('day_type')?.toUpperCase();

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('schedules').select('*').eq('is_active', true);
      if (corridor) query = query.eq('corridor_code', corridor);
      if (dayType) query = query.eq('day_type', dayType);

      const { data, error } = await withTimeout(query, 1200);
      if (!error && data && data.length > 0) {
        return NextResponse.json({
          source: 'database',
          data,
        });
      }
    } catch (err) {
      console.warn('Gagal memuat jadwal dari Supabase, beralih ke data master lokal:', err);
    }
  }

  let results = [...SCHEDULES];
  if (corridor) {
    results = results.filter((s) => s.corridor_code === corridor);
  }
  if (dayType) {
    results = results.filter((s) => s.day_type === dayType || s.day_type === 'DAILY');
  }

  return NextResponse.json({
    source: 'static_fallback',
    data: results,
  });
}
