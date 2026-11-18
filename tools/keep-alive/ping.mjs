/**
 * Script Keep-Alive Mandiri untuk Supabase BIKOPA
 * Jalankan secara berkala (misal via Windows Task Scheduler atau cron-job.org)
 * Penggunaan: node tools/keep-alive/ping.mjs
 */

import https from 'https';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ayjwghqcghrmdlcuznob.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5andnaHFjZ2hybWRsY3V6bm9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5MTE2NzIsImV4cCI6MjExMDQ4NzY3Mn0.VvzBDxbrH7IFs39XLkjjOmNxO2RKNJ1eZA42EEKN1-s';

const pingUrl = `${supabaseUrl}/rest/v1/corridors?select=id&limit=1`;
console.log(`Mengirim ping ke: ${pingUrl}`);

const req = https.get(
  pingUrl,
  {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    timeout: 5000,
  },
  (res) => {
    res.resume(); // Konsumsi data stream agar soket bersih
    console.log(`Status Respons: ${res.statusCode} ${res.statusMessage}`);
    if (res.statusCode >= 200 && res.statusCode < 400) {
      console.log('✅ Berhasil! Supabase terdeteksi aktif dan segar (mencegah auto-pause).');
      process.exit(0);
    } else {
      console.log('⚠️ Supabase mengembalikan respons di luar 2xx/3xx.');
      process.exit(1);
    }
  }
);

req.on('error', (err) => {
  console.error('❌ Gagal menghubungi Supabase:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('❌ Koneksi timeout setelah 5000ms.');
  req.destroy();
  process.exit(1);
});
