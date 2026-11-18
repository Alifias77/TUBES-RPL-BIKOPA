'use client';

import React, { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import InfoTabs from '@/components/InfoTabs';
import RouteModal from '@/components/RouteModal';

export default function JadwalPage() {
  const [routeModalCode, setRouteModalCode] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-mist">
      <header className="bg-navy text-white">
        <SiteHeader />
      </header>

      <main className="flex-1">
        {/* Page Banner Header */}
        <section
          className="bg-[#162646] text-white py-12 md:py-16 border-b border-white/10"
          style={{ backgroundImage: 'linear-gradient(180deg, #162646 0%, #1b2d52 50%, #121e3a 100%)' }}
        >
          <div className="wrap gutter">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-sun/20 px-3.5 py-1 text-xs font-bold text-sun border border-sun/30 uppercase tracking-wider mb-3">
                Informasi Operasional &amp; Bantuan
              </span>
              <h1 className="display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-white">
                Jadwal Keberangkatan, <span className="text-coral">Halte</span> &amp; Bantuan
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/80 leading-relaxed">
                Bus Trans Palu beroperasi setiap hari mulai pukul 06:00 hingga 21:00 WITA dengan frekuensi kedatangan (headway) setiap 15 menit. Pilih tab di bawah untuk melihat rincian jadwal, daftar halte per lintasan, atau panduan menaiki bus.
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-xl bg-white/10 backdrop-blur p-4 border border-white/10">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Jam Operasional</p>
                <p className="mt-1 text-lg sm:text-xl font-extrabold text-white">06:00 – 21:00</p>
                <p className="text-[11px] text-white/60">WITA (Setiap Hari)</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-4 border border-white/10">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Interval (Headway)</p>
                <p className="mt-1 text-lg sm:text-xl font-extrabold text-sun">15 Menit</p>
                <p className="text-[11px] text-white/60">Estimasi kedatangan</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-4 border border-white/10">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Tarif Saat Ini</p>
                <p className="mt-1 text-lg sm:text-xl font-extrabold text-coral">Rp 0 (Gratis)</p>
                <p className="text-[11px] text-white/60">Masa sosialisasi BTS</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-4 border border-white/10">
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Total Pemberhentian</p>
                <p className="mt-1 text-lg sm:text-xl font-extrabold text-white">53 Titik</p>
                <p className="text-[11px] text-white/60">Halte &amp; Bus Stop</p>
              </div>
            </div>
          </div>
        </section>

        {/* Info Tabs Section */}
        <InfoTabs onOpenRouteModal={(code) => setRouteModalCode(code)} />
      </main>

      <SiteFooter />

      {/* Pop Up Rute Interaktif Modal */}
      <RouteModal
        isOpen={Boolean(routeModalCode)}
        initialCorridorCode={routeModalCode}
        onClose={() => setRouteModalCode(null)}
      />
    </div>
  );
}
