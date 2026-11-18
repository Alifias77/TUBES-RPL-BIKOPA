import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Periksa apakah kredensial Supabase sudah diatur dengan benar
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-ref') &&
    !supabaseAnonKey.includes('your-anon-key')
  );
}

// Client publik (Akses aman dengan Anon Key & Row Level Security)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;

// Client admin/server-side (Hanya untuk endpoint server seperti ingest telemetri)
export const supabaseAdmin: SupabaseClient | null =
  isSupabaseConfigured() && supabaseServiceKey && !supabaseServiceKey.includes('your-service-key')
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
      })
    : null;

let circuitOpenUntil = 0;

/**
 * Cek apakah circuit breaker sedang terbuka (database baru saja error/timeout)
 * untuk menghindari penundaan berulang pada setiap tombol / request pengguna.
 */
export function isCircuitOpen(): boolean {
  return Date.now() < circuitOpenUntil;
}

export function tripCircuit(durationMs = 30000): void {
  circuitOpenUntil = Date.now() + durationMs;
}

export function resetCircuit(): void {
  circuitOpenUntil = 0;
}

/**
 * Eksekusi promise / thenable Postgrest dengan timeout cepat agar Next.js tidak hang/lambat
 * jika Supabase sedang paused atau mengalami gangguan jaringan.
 */
export async function withTimeout<T>(promiseLike: PromiseLike<T>, timeoutMs = 1200): Promise<T> {
  if (isCircuitOpen()) {
    throw new Error('Circuit breaker aktif: koneksi database baru saja timeout/gagal, menggunakan data master lokal');
  }

  const promise = Promise.resolve(promiseLike);
  return Promise.race([
    promise.catch((err) => {
      tripCircuit(25000);
      throw err;
    }),
    new Promise<T>((_, reject) =>
      setTimeout(() => {
        tripCircuit(25000);
        reject(new Error(`Database timeout setelah ${timeoutMs}ms`));
      }, timeoutMs)
    ),
  ]);
}
