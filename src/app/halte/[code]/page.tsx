'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import AnnouncementStrip from '@/components/AnnouncementStrip';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { BUS_STOPS_MAP } from '@/lib/data/stops';
import { CORRIDORS } from '@/lib/data/corridors';

export default function StopDetailPage() {
  const params = useParams();
  const rawCode = params?.code;

  // Menghindari notFound prematur sebelum params terhidrasi saat reload / refresh halaman
  if (rawCode === undefined || rawCode === null) {
    return (
      <div className="min-h-screen bg-mist text-navy flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-coral border-t-transparent" />
          <span className="text-sm font-medium">Memuat data halte...</span>
        </div>
      </div>
    );
  }

  const code = (typeof rawCode === 'string' ? rawCode : Array.isArray(rawCode) ? rawCode[0] : '')?.toUpperCase();

  if (!code || !BUS_STOPS_MAP[code]) {
    return notFound();
  }

  const stop = BUS_STOPS_MAP[code];

  return (
    <>
      <AnnouncementStrip />
      <header className="bg-navy text-white">
        <SiteHeader />
      </header>

      <main className="min-h-screen bg-mist py-10">
        <div className="wrap gutter max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-4 text-xs text-ink/60">
            <Link href="/" className="hover:underline">Beranda</Link> &gt;{' '}
            <Link href="/#rute" className="hover:underline">Halte</Link> &gt;{' '}
            <span className="font-bold text-navy">{stop.name}</span>
          </nav>

          {/* Halte Card */}
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="kb bg-navy text-white text-xs mr-2">
                  {stop.stop_code}
                </span>
                <span className="kb bg-sun text-ink text-xs">
                  {stop.stop_type}
                </span>
                <h1 className="display text-3xl font-bold text-navy sm:text-4xl mt-2">
                  {stop.name}
                </h1>
                <p className="text-sm text-ink/70 mt-1">{stop.address}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-ink/50 font-mono">
                  {stop.latitude.toFixed(6)}, {stop.longitude.toFixed(6)}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5 justify-start sm:justify-end">
                  {stop.corridors.map((c) => (
                    <span
                      key={c}
                      className="kb"
                      style={{ background: CORRIDORS[c]?.color_hex, color: '#fff' }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Halte Info Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-ink/10 pt-4 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink/50">Tipe Bangunan</span>
                <strong className="text-navy">{stop.has_shelter ? 'Memiliki Shelter' : 'Rambu Bus Stop'}</strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink/50">Kondisi Halte</span>
                <strong className="text-navy">
                  {stop.condition_status === 'GOOD' ? 'Baik' : 'Dalam Perbaikan'}
                </strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink/50">Jumlah Koridor</span>
                <strong className="text-navy">{stop.corridors.length} Koridor Melintas</strong>
              </div>
            </div>
          </div>

          {/* Jadwal Layanan per Koridor */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5">
            <h2 className="display text-2xl font-bold text-navy mb-2">
              Jadwal Koridor di Halte Ini
            </h2>
            <p className="text-xs text-ink/65 mb-6">
              Daftar koridor Trans Palu yang melayani titik perhentian ini beserta jam operasional dan interval jadwal.
            </p>

            <div className="space-y-3">
              {stop.corridors.map((cCode) => {
                const c = CORRIDORS[cCode];

                return (
                  <div
                    key={cCode}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-mist p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="kb text-sm px-2.5 py-1"
                        style={{ background: c.color_hex, color: '#fff' }}
                      >
                        {cCode}
                      </span>
                      <div>
                        <Link
                          href={`/koridor/${cCode}`}
                          className="font-bold text-navy hover:text-coral hover:underline"
                        >
                          {c.name}
                        </Link>
                        <p className="text-xs text-ink/60 mt-0.5">{c.via_route}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-sm text-navy">Tiap {c.default_headway_minutes} Menit</span>
                      <span className="block text-xs text-ink/60 mt-0.5">
                        {c.operating_start.slice(0, 5)}–{c.operating_end.slice(0, 5)} WITA
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transfer Guidance (if HUB) */}
          {stop.stop_type === 'HUB' && (
            <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-6 text-sm text-amber-900">
              <h3 className="display text-xl font-bold text-navy mb-1">
                Titik Transfer &amp; Integrasi
              </h3>
              <p className="leading-relaxed">
                Halte ini merupakan <strong>Hub Utama</strong> Trans Palu. Anda dapat berpindah antarkoridor (
                {stop.corridors.map((c) => `Koridor ${c}`).join(', ')}) di titik ini tanpa biaya tambahan selama layanan berlangsung.
              </p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
