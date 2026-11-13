'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import AnnouncementStrip from '@/components/AnnouncementStrip';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import RouteModal from '@/components/RouteModal';
import { CORRIDORS, CORRIDOR_CODES } from '@/lib/data/corridors';
import { getOrderedStopsForCorridor } from '@/lib/data/routes';
import { Direction } from '@/lib/types';

export default function CorridorPage() {
  const params = useParams();
  const rawCode = params?.code;
  const [direction, setDirection] = useState<Direction>('OUTBOUND');
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  // Menghindari notFound prematur sebelum params terhidrasi saat reload / refresh halaman
  if (rawCode === undefined || rawCode === null) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-coral border-t-transparent" />
          <span className="text-sm font-medium">Memuat data koridor...</span>
        </div>
      </div>
    );
  }

  const code = (typeof rawCode === 'string' ? rawCode : Array.isArray(rawCode) ? rawCode[0] : '')?.toUpperCase();

  if (!code || !CORRIDORS[code]) {
    return notFound();
  }

  const corridor = CORRIDORS[code];

  // Get stops ordered according to official route
  const displayStops = getOrderedStopsForCorridor(code, direction);

  return (
    <>
      <AnnouncementStrip corridorCode={code} />
      <header className="bg-navy text-white">
        <SiteHeader />
      </header>

      <main className="min-h-screen bg-mist py-10">
        <div className="wrap gutter max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-4 text-xs text-ink/60">
            <Link href="/" className="hover:underline">Beranda</Link> &gt;{' '}
            <Link href="/#armada" className="hover:underline">Koridor</Link> &gt;{' '}
            <span className="font-bold text-navy">Koridor {corridor.code}</span>
          </nav>

          {/* Header Card */}
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="kb text-base px-3 py-1.5 shadow-sm"
                  style={{ background: corridor.color_hex, color: '#fff' }}
                >
                  {corridor.code}
                </span>
                <div>
                  <h1 className="display text-3xl font-bold text-navy sm:text-4xl">
                    {corridor.name}
                  </h1>
                  <p className="text-sm text-ink/70 mt-1">{corridor.via_route}</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                  {corridor.fare === 0 ? 'Gratis' : `Rp ${corridor.fare.toLocaleString('id-ID')}`}
                </span>
                <p className="text-[11px] text-ink/55 mt-0.5">Tarif Trans Palu</p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-ink/10 pt-4 text-sm">
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink/50">Jam Operasional</span>
                <strong className="text-navy">{corridor.operating_start.slice(0, 5)} – {corridor.operating_end.slice(0, 5)} WITA</strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink/50">Headway</span>
                <strong className="text-navy">Tiap {corridor.default_headway_minutes} Menit</strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink/50">Jumlah Halte</span>
                <strong className="text-navy">{corridor.stops_count} Titik Halte</strong>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-wider text-ink/50">Status Data</span>
                <strong className="text-navy">Aktif &amp; Terbit</strong>
              </div>
            </div>

            {/* Bus Fleet Visual Card */}
            <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-r from-navy via-[#1b2d52] to-deep p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="min-w-0 max-w-sm">
                <span className="kb text-[11px] font-bold" style={{ background: corridor.color_hex, color: '#fff' }}>
                  Armada Bus Trans Palu
                </span>
                <h3 className="display text-xl sm:text-2xl font-bold mt-2 text-white">
                  Layanan Koridor {corridor.code}
                </h3>
                <p className="text-xs text-white/75 mt-1 leading-relaxed">
                  Armada bus medium perkotaan dengan AC, CCTV, dan kapasitas 35 penumpang.
                </p>
              </div>
              <div className="w-full sm:w-[320px] flex justify-center">
                <img
                  src="/images/BUS.png"
                  alt={`Bus Trans Palu Koridor ${corridor.code}`}
                  className="w-full max-w-[300px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* Interactive Route Banner Preview Card */}
            <div
              onClick={() => setIsRouteModalOpen(true)}
              className="mt-6 group relative overflow-hidden rounded-xl border border-ink/10 bg-gradient-to-r from-mist to-white p-4 cursor-pointer hover:border-coral transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-white shadow-sm"
                    style={{ background: corridor.color_hex }}
                  >
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                      <line x1="8" y1="2" x2="8" y2="18" />
                      <line x1="16" y1="6" x2="16" y2="22" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy group-hover:text-coral transition-colors">
                      Lihat Ilustrasi Peta Jalur Koridor {corridor.code}
                    </h3>
                    <p className="text-xs text-ink/65 mt-0.5">
                      Klik untuk memperbesar dan melihat titik singgah lengkap rute {corridor.name}.
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-coral group-hover:underline shrink-0">
                  Buka Gambar Rute &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Direction Toggle & Sequence */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-ink/5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
              <div>
                <h2 className="display text-2xl font-bold text-navy">Urutan Halte Rute</h2>
                <p className="text-xs text-ink/65 mt-0.5">
                  Daftar titik perhentian berurut untuk perjalanan pergi dan pulang.
                </p>
              </div>

              {/* Direction Tabs */}
              <div className="inline-flex rounded-lg bg-mist p-1">
                <button
                  type="button"
                  onClick={() => setDirection('OUTBOUND')}
                  className={`min-h-[38px] rounded-md px-4 text-xs font-bold transition-colors ${
                    direction === 'OUTBOUND'
                      ? 'bg-coral text-white shadow-sm'
                      : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  Pergi (Outbound)
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('INBOUND')}
                  className={`min-h-[38px] rounded-md px-4 text-xs font-bold transition-colors ${
                    direction === 'INBOUND'
                      ? 'bg-coral text-white shadow-sm'
                      : 'text-ink/70 hover:text-ink'
                  }`}
                >
                  Pulang (Inbound)
                </button>
              </div>
            </div>

            {/* Sequence Timeline */}
            <div className="mt-6 relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-ink/15">
              {displayStops.map((stop, idx) => {
                const isHub = stop.stop_type === 'HUB';
                return (
                  <div key={stop.stop_code} className="relative flex items-start gap-4">
                    {/* Bullet marker on timeline */}
                    <span
                      className="absolute -left-6 mt-1 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center"
                      style={{
                        background: isHub ? corridor.color_hex : '#fff',
                        borderColor: corridor.color_hex,
                      }}
                    >
                      {isHub && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-ink/50">
                          {idx + 1}. {stop.stop_code}
                        </span>
                        {isHub && (
                          <span className="kb bg-navy text-white text-[10px]">HUB</span>
                        )}
                        <Link
                          href={`/halte/${stop.stop_code}`}
                          className="font-bold text-navy hover:text-coral hover:underline"
                        >
                          {stop.name}
                        </Link>
                      </div>
                      <p className="text-xs text-ink/65 mt-0.5">{stop.address}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Pop Up Rute Interaktif Modal */}
      <RouteModal
        isOpen={isRouteModalOpen}
        initialCorridorCode={code}
        onClose={() => setIsRouteModalOpen(false)}
      />

      <SiteFooter />
    </>
  );
}
