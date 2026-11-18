'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CORRIDORS } from '@/lib/data/corridors';
import { INFO_TAB_ICONS, INFO_TABS_DATA, TabSection } from '@/lib/data/info-tabs';
import { getOrderedStopsForCorridor } from '@/lib/data/routes';

interface Props {
  onOpenRouteModal?: (code: string) => void;
}

export default function InfoTabs({ onOpenRouteModal }: Props = {}) {
  const [activeTab, setActiveTab] = useState(0);

  const currentTab: TabSection = INFO_TABS_DATA[activeTab] || INFO_TABS_DATA[0];

  return (
    <section id="layanan" className="gutter min-h-screen flex flex-col justify-center py-12 md:py-16" aria-labelledby="judul-layanan">
      <div className="wrap w-full">
        <h2 id="judul-layanan" className="display mb-4 text-3xl font-bold uppercase tracking-wide text-navy sm:text-4xl">
          Jadwal <span className="text-coral">&amp; Halte</span>
        </h2>

        {/* Tab Buttons Navigation */}
        <div className="overflow-x-auto">
          <div role="tablist" aria-label="Kategori informasi" className="flex min-w-max border-b border-ink/10">
            {INFO_TABS_DATA.map((tab, idx) => (
              <button
                key={tab.name}
                role="tab"
                id={`tab-${idx}`}
                aria-selected={activeTab === idx}
                aria-controls="panel-tab"
                onClick={() => setActiveTab(idx)}
                className="tab focus-ring px-6 py-3 text-sm font-bold tracking-wide transition-all"
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 0: JADWAL (5 Cards, Centered 3+2 Layout, Halte Image & Operating Hours) */}
        {activeTab === 0 && (
          <div
            id="panel-tab"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby="tab-0"
            className="mt-6 flex flex-wrap justify-center gap-6"
          >
            {currentTab.cards.map((card) => {
              if (!card.code) return null;
              const corridor = CORRIDORS[card.code];
              const stops = getOrderedStopsForCorridor(card.code);

              return (
                <div
                  key={card.code}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm jadwal-uiverse-card"
                  title={`Koridor ${card.code} - Klik Detail Rute untuk melihat urutan halte`}
                >
                  <div className="jadwal-uiverse-content">
                    {/* Top Header */}
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="card-badge inline-flex items-center justify-center font-black text-sm px-2.5 py-0.5 rounded-lg min-w-[34px] shadow-sm">
                          {card.code}
                        </span>
                        <h3 className="card-title text-xl font-bold tracking-tight">Koridor {card.code}</h3>
                      </div>
                      <p className="card-subtitle mt-2 text-sm font-medium">{corridor.name}</p>

                      <div className="mt-4 space-y-1.5">
                        <p className="card-schedule text-sm leading-snug">
                          06:00–21:00 · tiap 15 menit · setiap hari.
                        </p>
                        <p className="card-via text-sm leading-relaxed">
                          {corridor.via_route}.
                        </p>
                      </div>
                    </div>

                    {/* Middle: Halte bus stop image in empty space */}
                    <div className="my-auto py-3 flex items-center justify-center">
                      <img
                        src="/images/HALTE_card.png"
                        alt={`Halte Trans Palu Koridor ${card.code}`}
                        className="card-halte-img h-36 sm:h-40 w-auto max-w-[95%] object-contain pointer-events-none"
                      />
                    </div>

                    {/* Bottom Footer */}
                    <div className="card-divider mt-auto pt-4 flex items-center justify-between text-xs">
                      <span className="card-stops inline-flex items-center gap-1.5 font-medium">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                        {stops.length} Halte Terdaftar
                      </span>
                      <Link
                        href={`/koridor/${card.code}`}

                        className="card-cta inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-full text-xs"
                      >
                        Detail Rute Koridor &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 1: HALTE (5 Corridor Cards + 1 Hub Transfer Card) */}
        {activeTab === 1 && (
          <div
            id="panel-tab"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby="tab-1"
            className="mt-6 flex flex-wrap justify-center gap-6"
          >
            {currentTab.cards.map((card, idx) => {
              if (card.code) {
                const corridor = CORRIDORS[card.code];
                const stops = getOrderedStopsForCorridor(card.code);

                return (
                  <div
                    key={card.code}
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm jadwal-uiverse-card"
                    title={`Halte Koridor ${card.code} - ${stops.length} Titik Halte`}
                  >
                    <div className="jadwal-uiverse-content">
                      {/* Top Header - TIDAK MEMUAT JAM SESUAI REQUEST */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="card-badge inline-flex items-center justify-center font-black text-sm px-2.5 py-0.5 rounded-lg min-w-[34px] shadow-sm">
                            {card.code}
                          </span>
                          <h3 className="card-title text-xl font-bold tracking-tight">Koridor {card.code}</h3>
                        </div>
                        <p className="card-subtitle mt-2 text-sm font-medium">{corridor.name}</p>

                        <div className="mt-4 space-y-1.5">
                          <p className="card-via text-sm leading-relaxed">
                            Lintasan: {corridor.via_route}.
                          </p>
                          <p className="card-schedule text-sm leading-snug">
                            {stops.length} titik halte terintegrasi sepanjang lintasan rute.
                          </p>
                        </div>
                      </div>

                      {/* Middle: Halte bus stop image */}
                      <div className="my-auto py-3 flex items-center justify-center">
                        <img
                          src="/images/HALTE_card.png"
                          alt={`Halte Trans Palu Koridor ${card.code}`}
                          className="card-halte-img h-36 sm:h-40 w-auto max-w-[95%] object-contain pointer-events-none"
                        />
                      </div>

                      {/* Bottom Footer */}
                      <div className="card-divider mt-auto pt-4 flex items-center justify-between text-xs">
                        <span className="card-stops inline-flex items-center gap-1.5 font-medium">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          {stops.length} Halte Terdaftar
                        </span>
                        <Link
                          href={`/koridor/${card.code}`}

                          className="card-cta inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-full text-xs"
                        >
                          Detail Rute Koridor &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              {/* Card Hub Transfer - TIDAK MEMUAT GAMBAR HALTE SESUAI REQUEST */}
              return (
                <div
                  key="hub-transfer"
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm jadwal-uiverse-card"
                  title="Hub & Titik Transfer Antar-Koridor"
                >
                  <div className="jadwal-uiverse-content">
                    {/* Top Header */}
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="card-badge inline-flex items-center justify-center font-black text-sm px-2.5 py-0.5 rounded-lg min-w-[34px] shadow-sm">
                          HUB
                        </span>
                        <h3 className="card-title text-xl font-bold tracking-tight">Hub Transfer</h3>
                      </div>
                      <p className="card-subtitle mt-2 text-sm font-medium">Titik Pertemuan Antar-Koridor</p>

                      <div className="mt-4 space-y-1.5">
                        <p className="card-schedule text-sm leading-snug">
                          Titik transit resmi Trans Palu untuk perpindahan koridor tujuan lain.
                        </p>
                      </div>
                    </div>

                    {/* Middle: Grid 6 Titik Hub (TANPA GAMBAR HALTE) */}
                    <div className="my-auto py-3">
                      <div className="flex flex-wrap justify-center gap-2">
                        {['Taman GOR', 'Balai Kota', 'Bandara MSA', 'Pantoloan', 'Pasar Manonda', 'Terminal Tipo'].map((hubName) => (
                          <span
                            key={hubName}
                            className="card-hub-tag px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white/90 border border-white/10 transition-all"
                          >
                            {hubName}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="card-divider mt-auto pt-4 flex items-center justify-between text-xs">
                      <span className="card-stops inline-flex items-center gap-1.5 font-medium">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="4" y="4" width="16" height="13" rx="3" />
                          <path d="M4 11h16M7 20v-3M17 20v-3" />
                        </svg>
                        6 Titik Hub Aktif
                      </span>
                      <a
                        href="#rute"
                        className="card-cta inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-full text-xs"
                      >
                        Lihat Hub & Peta &darr;
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: BANTUAN (6 Cards, Uiverse Design, TANPA GAMBAR HALTE) */}
        {activeTab === 2 && (
          <div
            id="panel-tab"
            role="tabpanel"
            tabIndex={0}
            aria-labelledby="tab-2"
            className="mt-6 flex flex-wrap justify-center gap-6"
          >
            {currentTab.cards.map((card, idx) => (
              <div
                key={idx}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm jadwal-uiverse-card card-compact group"
                title={card.title}
              >
                <div className="jadwal-uiverse-content">
                  <div>
                    {/* Icon Box */}
                    <span className="card-icon-box grid h-12 w-12 place-items-center rounded-xl text-coral">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {INFO_TAB_ICONS[card.icon]}
                      </svg>
                    </span>

                    {/* Title */}
                    <h3 className="card-title text-xl font-bold tracking-tight mt-4">
                      {card.title}
                    </h3>

                    {/* Text Description - HANYA KATA-KATA TANPA GAMBAR HALTE */}
                    <p className="card-via text-sm leading-relaxed mt-2.5">
                      {card.desc}
                    </p>
                  </div>

                  {/* Bottom Tag */}
                  <div className="card-divider mt-auto pt-3 flex items-center justify-between text-xs">
                    <span className="card-stops font-medium text-white/60">
                      Pusat Bantuan
                    </span>
                    <span className="text-coral font-bold">
                      Trans Palu
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
