'use client';

import React from 'react';
import { CORRIDOR_CODES, CORRIDORS } from '@/lib/data/corridors';

export default function LiveBanner() {
  return (
    <section
      id="pelacakan"
      className="gutter min-h-screen flex flex-col justify-center items-center py-6 sm:py-10"
      aria-labelledby="judul-banner"
    >
      {/* Enlarged Blue Background Card */}
      <div
        className="relative w-full max-w-[1300px] rounded-3xl sm:rounded-[2.5rem] text-white shadow-2xl overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-12 transition-all duration-300"
        style={{
          backgroundColor: '#4f9fe0',
        }}
      >
        <div className="relative z-10 w-full grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Fleet Info & Specs */}
          <div className="min-w-0">
            <span className="inline-block rounded-full bg-coral px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
              Armada Bus Kota Palu
            </span>
            <h2
              id="judul-banner"
              className="display mt-3 text-3xl font-extrabold uppercase leading-[1.1] sm:text-4xl md:text-5xl text-white drop-shadow-sm"
            >
              Layanan Nyaman &amp; Modern
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/90">
              <strong className="text-white font-bold">Bus Trans Palu</strong> dioperasikan oleh{' '}
              <strong className="text-white font-bold">PT Bagong Transport</strong> melalui sistem{' '}
              <strong className="text-white font-bold">Buy The Service (BTS)</strong>. Dilengkapi AC, CCTV keamanan, dan desain ramah penumpang dengan livery khas Palu.
            </p>

            {/* 4 Stat Badges (Kapasitas, Warna, Koridor, Bus Stop) */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/10 backdrop-blur p-3 text-center ring-1 ring-white/15">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Kapasitas</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-1 block">35 Penumpang</span>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-3 text-center ring-1 ring-white/15">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Warna</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-1 block">Putih Emas</span>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-3 text-center ring-1 ring-white/15">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Koridor</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-1 block">5 Jalur Rute</span>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-3 text-center ring-1 ring-white/15">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">Halte</span>
                <span className="text-xs sm:text-sm font-bold text-white mt-1 block">53 Titik Halte</span>
              </div>
            </div>

            {/* Corridor color pills */}
            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-white/70">Warna Resmi Koridor:</span>
              <div className="flex items-center gap-1.5">
                {CORRIDOR_CODES.map((code) => {
                  const corridor = CORRIDORS[code];
                  return (
                    <span
                      key={code}
                      className="h-6 w-6 rounded-full text-white text-[10px] font-bold grid place-items-center shadow-sm"
                      style={{ backgroundColor: corridor.color_hex }}
                      title={`Koridor ${code}: ${corridor.name}`}
                    >
                      {code}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#armada"
                className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-coral px-7 text-sm font-bold text-white shadow-lg hover:brightness-110 focus-ring transition-all"
              >
                Pilih Koridor
              </a>
              <a
                href="#jangkauan"
                className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-white px-7 text-sm font-bold text-navy shadow-lg hover:bg-mist focus-ring transition-all"
              >
                Buka Peta Halte
              </a>
            </div>
          </div>

          {/* Right Column: 3D Bus Image */}
          <div className="mx-auto w-full max-w-[560px] min-w-0 flex items-center justify-center py-2 lg:py-4">
            <img
              src="/images/bus-info.png"
              alt="Bus Trans Palu tampak samping dengan livery corak daun emas khas Palu"
              className="w-full h-auto max-h-[380px] object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.5)] scale-105 hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
