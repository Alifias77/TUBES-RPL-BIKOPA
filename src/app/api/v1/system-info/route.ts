import { NextResponse } from 'next/server';
import { SYSTEM_INFO } from '@/lib/data/system-info';
import { supabase, isSupabaseConfigured, withTimeout } from '@/lib/supabaseClient';

export async function GET() {
  let dbStatus = 'NOT_CONFIGURED';
  let dbMessage = 'Supabase belum dikonfigurasi, sistem berjalan dengan Data Master Lokal.';

  if (isSupabaseConfigured() && supabase) {
    try {
      // Tes koneksi ringan ke database dengan batas timeout cepat
      const { error } = await withTimeout(
        supabase.from('corridors').select('id', { count: 'exact', head: true }),
        1000
      );

      if (error) {
        dbStatus = 'OFFLINE_FALLBACK';
        dbMessage = `Database Supabase tidak merespons (${error.message}). Sistem dialihkan ke Data Master Lokal.`;
      } else {
        dbStatus = 'CONNECTED';
        dbMessage = 'Terhubung ke database Supabase.';
      }
    } catch (err: any) {
      dbStatus = 'OFFLINE_FALLBACK';
      dbMessage = `Koneksi database timeout (${err.message || 'unreachable'}). Sistem dialihkan ke Data Master Lokal.`;
    }
  }

  return NextResponse.json({
    data: SYSTEM_INFO,
    database: {
      status: dbStatus,
      is_fallback_active: dbStatus !== 'CONNECTED',
      message: dbMessage,
      checked_at: new Date().toISOString(),
    },
  });
}
