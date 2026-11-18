import { NextRequest, NextResponse } from 'next/server';
import { ANNOUNCEMENTS } from '@/lib/data/announcements';
import { supabase, isSupabaseConfigured, withTimeout } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const corridor = searchParams.get('corridor')?.toUpperCase();

  const now = new Date();

  if (isSupabaseConfigured() && supabase) {
    try {
      const nowIso = now.toISOString();
      let query = supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .lte('starts_at', nowIso);

      const { data, error } = await withTimeout(query, 1200);
      if (!error && data && data.length > 0) {
        const filtered = data.filter((ann: any) => {
          if (ann.ends_at && new Date(ann.ends_at) < now) return false;
          if (corridor && ann.corridor_code && ann.corridor_code !== corridor) return false;
          return true;
        });

        return NextResponse.json({
          source: 'database',
          data: filtered,
        });
      }
    } catch (err) {
      console.warn('Gagal memuat pengumuman dari Supabase, beralih ke data master lokal:', err);
    }
  }

  const activeAnnouncements = ANNOUNCEMENTS.filter((ann) => {
    if (!ann.is_active) return false;
    if (ann.ends_at && new Date(ann.ends_at) < now) return false;
    if (corridor && ann.corridor_code && ann.corridor_code !== corridor) return false;
    return true;
  });

  return NextResponse.json({
    source: 'static_fallback',
    data: activeAnnouncements,
  });
}
