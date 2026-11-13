'use client';

import React from 'react';
import { CORRIDOR_CODES, CORRIDORS } from '@/lib/data/corridors';
import CloudDivider from '@/components/CloudDivider';

interface Props {
  onSelectCorridor: (code: string) => void;
  onOpenConsent: () => void;
  onOpenRouteModal?: (code: string) => void;
}

export default function CorridorGrid({
  onSelectCorridor,
  onOpenConsent,
  onOpenRouteModal,
}: Props) {
  const tileBase =
    'lift relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-b from-[#2d4a7c] to-[#18284a] text-white ring-1 ring-white/10 focus-ring';

  return (
    <section
      id="armada"
      className="relative min-h-screen flex flex-col justify-between py-12 md:py-16 bg-navy text-white overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, #162646 0%, #1b2d52 50%, #121e3a 100%)',
      }}
      aria-labelledby="judul-armada"
    >
      <div className="wrap gutter flex-1 flex flex-col justify-center my-auto relative z-10 w-full pb-20 md:pb-28">
        <h2 id="judul-armada" className="display text-center text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl">
          Pilih <span className="text-coral">koridor</span> sesuai tujuan Anda
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-white/70">
          Ketuk koridor untuk melihat di peta atau buka gambar rute interaktif.
        </p>

        <div id="grid" className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {CORRIDOR_CODES.map((code) => {
          const c = CORRIDORS[code];

          return (
            <div key={code} className={`${tileBase} group`}>
              {/* Main click: trigger select or modal */}
              <button
                type="button"
                className="absolute inset-0 w-full h-full text-left"
                aria-pressed="true"
                aria-label={`Koridor ${code}, ${c.name}`}
                onClick={() => {
                  if (onOpenRouteModal) {
                    onOpenRouteModal(code);
                  } else {
                    onSelectCorridor(code);
                  }
                }}
              >
                {/* Gambar Bus Trans Palu */}
                <div className="absolute inset-x-2 top-8 bottom-12 flex items-center justify-center overflow-hidden pointer-events-none">
                  <img
                    src="/images/BUS.png"
                    alt={`Armada Bus Trans Palu Koridor ${code}`}
                    className="w-full h-auto max-h-[80%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <span
                  className="kb absolute left-2 top-2 z-10"
                  style={{ background: c.color_hex, color: '#fff', fontSize: '13px' }}
                >
                  {code}
                </span>
                <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-8 text-left text-xs font-bold">
                  {c.name}
                  <span className="block font-normal text-white/70">
                    {c.stops_count} halte · Tiap 15 menit
                  </span>
                </span>
              </button>

              {/* Quick Route Popup Button */}
              {onOpenRouteModal && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenRouteModal(code);
                  }}
                  className="absolute right-2 top-2 z-10 rounded-md bg-white/20 backdrop-blur px-2 py-0.5 text-[10px] font-bold text-white hover:bg-coral transition-colors"
                  title="Lihat Peta Rute"
                >
                  Peta Rute
                </button>
              )}
            </div>
          );
        })}

        {/* Tile 6: Halte Terdekat */}
        <button
          type="button"
          className={`${tileBase} group`}
          onClick={onOpenConsent}
        >
          <div className="absolute inset-x-2 top-8 bottom-12 flex items-center justify-center overflow-hidden pointer-events-none">
            <img
              src="/images/BUS.png"
              alt="Halte terdekat"
              className="w-full h-auto max-h-[80%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-8 text-left text-xs font-bold">
            Halte terdekat
            <span className="block font-normal text-white/70">Dari lokasi Anda</span>
          </span>
        </button>

        {/* Tile 7: Jadwal & Operasional */}
        <button
          type="button"
          className={`${tileBase} group`}
          onClick={() => {
            const el = document.getElementById('layanan');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="absolute inset-x-2 top-8 bottom-12 flex items-center justify-center overflow-hidden pointer-events-none">
            <img
              src="/images/BUS.png"
              alt="Jadwal operasional"
              className="w-full h-auto max-h-[80%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-8 text-left text-xs font-bold">
            Jadwal operasional
            <span className="block font-normal text-white/70">06:00–21:00 WITA · Gratis</span>
          </span>
        </button>

        {/* Tile 8: Hub & Transfer */}
        <button
          type="button"
          className={`${tileBase} group`}
          onClick={() => {
            const el = document.getElementById('rute');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="absolute inset-x-2 top-8 bottom-12 flex items-center justify-center overflow-hidden pointer-events-none">
            <img
              src="/images/BUS.png"
              alt="Hub & transfer"
              className="w-full h-auto max-h-[80%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-8 text-left text-xs font-bold">
            Hub &amp; transfer
            <span className="block font-normal text-white/70">6 titik pertemuan</span>
          </span>
        </button>
      </div>
    </div>
    <CloudDivider />
  </section>
);
}
