import { NextResponse } from 'next/server';
import { CORRIDORS, CORRIDOR_CODES } from '@/lib/data/corridors';
import { supabase, isSupabaseConfigured, withTimeout } from '@/lib/supabaseClient';

export async function GET() {
  const fallbackCorridors = CORRIDOR_CODES.map((code) => CORRIDORS[code]).filter(
    (c) => c.is_active && c.is_published
  );

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('corridors')
          .select('*')
          .eq('is_active', true)
          .eq('is_published', true)
          .order('sort_order', { ascending: true }),
        1200
      );

      if (!error && data && data.length > 0) {
        return NextResponse.json({
          source: 'database',
          data,
        });
      }
    } catch (err) {
      console.warn('Gagal memuat koridor dari Supabase, beralih ke data master lokal:', err);
    }
  }

  return NextResponse.json({
    source: 'static_fallback',
    data: fallbackCorridors,
  });
}
