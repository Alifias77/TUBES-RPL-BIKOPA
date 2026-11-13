'use client';

import React from 'react';
import { CORRIDORS } from '@/lib/data/corridors';

interface Props {
  onOpenSheet: (stopCode: string) => void;
}

export default function HubCards({ onOpenSheet }: Props) {
  const hubs = [
    {
      code: 'HLT-003',
      name: 'Balai Kota',
      kicker: 'HLT-003 · Hub',
      corridors: ['02', '03Y'],
      scene: 'scene-road',
      isCenter: false,
    },
    {
      code: 'HLT-002',
      name: 'Taman GOR',
      kicker: 'HLT-002 · Hub terbesar',
      corridors: ['01', '02', '03M', '03Y'],
      scene: 'scene-castle',
      isCenter: true,
    },
    {
      code: 'HLT-005',
      name: 'Bandara Mutiara SIS Al-Jufri',
      kicker: 'HLT-005 · Hub',
      corridors: ['03M', '03Y', '04'],
      scene: 'scene-road',
      isCenter: false,
    },
  ];

  return (
    <section id="rute" className="min-h-screen flex flex-col justify-center py-12 md:py-16 bg-mist" aria-labelledby="judul-rute">
      <div className="wrap gutter w-full">
        <h2 id="judul-rute" className="display text-center text-3xl font-bold uppercase tracking-wide text-navy sm:text-4xl">
          <span className="text-coral">Hub</span> dan titik transfer
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-ink/70">
          Di hub ini beberapa koridor bertemu. Ganti koridor di sini untuk menjangkau tujuan lain.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3 items-stretch">
          {hubs.map((hub) => {
            return (
              <article
                key={hub.code}
                className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/90 text-left"
              >
                <div>
                  {/* Top Bar: Kicker in Blue */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-[13px] font-semibold text-[#0284c7] tracking-wide">
                      {hub.kicker}
                    </span>
                  </div>

                  {/* Big Bold Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 mb-4">
                    {hub.name}
                  </h3>

                  {/* Section 1: Strip Header (Jadwal & Frekuensi) */}
                  <div className="w-full bg-[#f1f5f9] rounded px-3 py-1.5 text-xs font-semibold text-slate-600 mb-1">
                    Frekuensi Layanan
                  </div>

                  {/* Row: Jadwal Keberangkatan with Green Pill Badge */}
                  <div className="flex items-center justify-between py-2.5 px-3 border-b border-slate-100 text-sm">
                    <span className="font-medium text-slate-800">
                      Jadwal Keberangkatan
                    </span>
                    <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded text-xs font-bold tabular-nums shadow-sm">
                      Tiap 15 Menit
                    </span>
                  </div>

                  {/* Section 2: Strip Header (Koridor Terhubung) */}
                  <div className="w-full bg-[#f1f5f9] rounded px-3 py-1.5 text-xs font-semibold text-slate-600 mt-4 mb-1">
                    Koridor Terhubung
                  </div>

                  {/* Corridor Rows with Hairline Dividers */}
                  <div className="divide-y divide-slate-100">
                    {hub.corridors.map((cCode) => {
                      const c = CORRIDORS[cCode];
                      return (
                        <div key={cCode} className="flex items-center justify-between py-2.5 px-3 text-sm">
                          <span className="font-medium text-slate-800">
                            Koridor {cCode}
                          </span>
                          <span className="text-xs text-slate-500 font-medium text-right truncate max-w-[58%]">
                            {c ? c.name : 'Terintegrasi'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Footer Action Link */}
                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenSheet(hub.code)}
                    className="group/btn inline-flex items-center gap-1.5 text-sm font-semibold text-[#0284c7] hover:text-[#0369a1] transition-colors cursor-pointer text-left focus-ring rounded"
                  >
                    <span>Lihat detail halte</span>
                    <span className="transition-transform group-hover/btn:translate-x-1">&rarr;</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-ink/55">
          Hub lain: Pelabuhan Pantoloan, Pasar Inpres Manonda, Terminal Tipo (ketuk di peta).
        </p>
      </div>
    </section>
  );
}
