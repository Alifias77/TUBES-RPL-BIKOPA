'use client';

import React, { useState, useEffect } from 'react';
import { BUS_STOPS } from '@/lib/data/stops';
import { CORRIDORS } from '@/lib/data/corridors';
import { findStopByNameOrCode, findTransitRoute } from '@/lib/route-search';

interface Props {
  onOpenConsent: () => void;
}

export default function QuickSearchBar({ onOpenConsent }: Props) {
  const [asal, setAsal] = useState('Pasar Inpres Manonda');
  const [tujuan, setTujuan] = useState('Bandara Mutiara SIS Al-Jufri');
  const [hari, setHari] = useState('WEEKDAY');
  const [searchResult, setSearchResult] = useState<React.ReactNode>(
    'Contoh ini memuat seluruh koridor dan titik halte. Masukkan nama halte untuk mencari rute langsung atau transfer.'
  );

  useEffect(() => {
    // Default to Makassar WITA day
    const wd = new Date().toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Makassar' });
    setHari(wd === 'Sat' || wd === 'Sun' ? 'WEEKEND' : 'WEEKDAY');
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const stopA = findStopByNameOrCode(asal);
    const stopB = findStopByNameOrCode(tujuan);
    const result = findTransitRoute(stopA, stopB);
    const dayLabel = hari === 'WEEKEND' ? 'Akhir pekan' : 'Hari kerja';

    switch (result.type) {
      case 'not_found':
        setSearchResult(
          <span className="text-sun font-bold">
            Halte tidak ditemukan. Coba ketik nama halte seperti Taman GOR, Balai Kota, Untad, atau Bandara.
          </span>
        );
        break;

      case 'same_stop':
        setSearchResult(<span>Halte asal dan tujuan sama. Pilih halte yang berbeda.</span>);
        break;

      case 'direct':
        setSearchResult(
          <div>
            <strong className="text-white">Rute langsung: </strong>
            {result.corridors.map((code) => {
              const c = CORRIDORS[code];
              return (
                <span
                  key={code}
                  className="kb mr-1.5"
                  style={{ background: c?.color_hex, color: '#fff' }}
                >
                  {code}
                </span>
              );
            })}
            <div className="text-white/65 text-xs mt-1">
              {dayLabel}: 06:00–21:00, tiap 15 menit (nilai awal).
            </div>
          </div>
        );
        break;

      case 'transfer':
        setSearchResult(
          <div>
            <strong className="text-white">
              1 kali transfer di {result.hub.name}:{' '}
            </strong>
            <span
              className="kb mr-1"
              style={{ background: CORRIDORS[result.c1]?.color_hex, color: '#fff' }}
            >
              {result.c1}
            </span>
            <span className="text-white/80 text-xs mr-1">lalu ganti ke</span>
            <span
              className="kb"
              style={{ background: CORRIDORS[result.c2]?.color_hex, color: '#fff' }}
            >
              {result.c2}
            </span>
            <div className="text-white/65 text-xs mt-1">
              {dayLabel}: 06:00–21:00, perkiraan headway 15 menit.
            </div>
          </div>
        );
        break;

      case 'none':
        setSearchResult(
          <span>
            Tidak ada rute langsung atau 1 kali transfer antara dua halte ini.
          </span>
        );
        break;
    }
  }

  return (
    <div className="wrap gutter pt-4">
      {/* Search Input Form */}
      <form
        id="cari"
        onSubmit={handleSearch}
        className="grid gap-3 rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
        autoComplete="off"
      >
        {/* Origin Stop */}
        <label className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3" htmlFor="asal">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 text-navy">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="5" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] uppercase tracking-wider text-white/60">Halte asal</span>
            <input
              id="asal"
              list="daftar-halte"
              className="w-full min-w-0 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/50"
              value={asal}
              onChange={(e) => setAsal(e.target.value)}
              placeholder="Cari nama halte"
            />
          </span>
        </label>

        {/* Destination Stop */}
        <label className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3" htmlFor="tujuan">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] uppercase tracking-wider text-white/60">Halte tujuan</span>
            <input
              id="tujuan"
              list="daftar-halte"
              className="w-full min-w-0 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/50"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              placeholder="Cari nama halte"
            />
          </span>
        </label>

        {/* Day Type Selector */}
        <label className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 sm:col-span-2 lg:col-span-1" htmlFor="hari">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 text-navy">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <rect x="4" y="5" width="16" height="15" rx="3" />
              <path d="M4 10h16M9 3v4M15 3v4" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] uppercase tracking-wider text-white/60">Jenis hari</span>
            <select
              id="hari"
              value={hari}
              onChange={(e) => setHari(e.target.value)}
              className="w-full min-w-0 bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
            >
              <option value="WEEKDAY" className="text-navy">Hari kerja (Senin–Jumat)</option>
              <option value="WEEKEND" className="text-navy">Akhir pekan (Sabtu–Minggu)</option>
            </select>
          </span>
        </label>

        {/* Submit Search Button */}
        <button
          type="submit"
          className="min-h-[44px] rounded-xl bg-coral px-8 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 focus-ring sm:col-span-2 lg:col-span-1"
        >
          Cari Rute
        </button>
      </form>

      {/* Autocomplete Datalist */}
      <datalist id="daftar-halte">
        {BUS_STOPS.map((s) => (
          <option key={s.stop_code} value={s.name} />
        ))}
      </datalist>

      {/* Search Result Feedback & Nearest GPS Location Button */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 pt-3 text-sm text-white/85">
        <div id="hasil" className="min-h-[2.75rem] flex-1 py-1" role="status" aria-live="polite">
          {searchResult}
        </div>
        <button
          id="btn-loc"
          type="button"
          onClick={onOpenConsent}
          className="inline-flex min-h-[44px] items-center gap-2 font-semibold underline underline-offset-4 hover:text-white focus-ring"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <circle cx="12" cy="12" r="8" />
          </svg>
          Gunakan lokasi saya
        </button>
      </div>
    </div>
  );
}
