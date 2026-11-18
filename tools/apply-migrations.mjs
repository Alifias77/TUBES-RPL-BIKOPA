import fs from 'fs';
import https from 'https';

const token = process.env.SUPABASE_ACCESS_TOKEN || '';
const projectRef = 'ayjwghqcghrmdlcuznob';

function executeQuery(sql, label) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query: sql });
    const req = https.request(
      {
        hostname: 'api.supabase.com',
        path: `/v1/projects/${projectRef}/database/query`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'User-Agent': 'Node',
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ [${label}] Berhasil dieksekusi (HTTP ${res.statusCode})`);
            resolve(body);
          } else {
            console.error(`❌ [${label}] Gagal (HTTP ${res.statusCode}):`, body);
            reject(new Error(body));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('🚀 Memulai migrasi database Supabase BIKOPA...');

  const schemaSql = fs.readFileSync('supabase/migrations/20261028000000_bikopa_schema.sql', 'utf-8');
  await executeQuery(schemaSql, '1. Skema Tabel & PostGIS');

  const seedSql = fs.readFileSync('supabase/seed.sql', 'utf-8');
  await executeQuery(seedSql, '2. Master Data 53 Halte & 5 Koridor');

  console.log('🎉 SELURUH SKEMA & DATA HALTE BERHASIL DI-MIGRASI KE SUPABASE CLOUD!');
}

run().catch((err) => {
  console.error('Error saat migrasi:', err);
  process.exit(1);
});
