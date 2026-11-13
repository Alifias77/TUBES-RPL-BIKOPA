import React from 'react';
import Link from 'next/link';
import { SYSTEM_INFO } from '@/lib/data/system-info';

export default function SiteFooter() {
  return (
    <footer id="footer" className="bg-deep text-white border-t border-white/10">
      <div className="wrap gutter">
        <div className="grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <p className="display text-2xl font-bold tracking-wide">BIKOPA</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">
              {SYSTEM_INFO.fleet_info.capacity}. Sistem informasi rute, halte, dan jadwal Bus Trans Palu.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-white/50">Menu</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><a className="hover:text-white" href="/#armada">Koridor</a></li>
              <li><a className="hover:text-white" href="/#layanan">Jadwal</a></li>
              <li><a className="hover:text-white" href="/#rute">Hub</a></li>
              <li><a className="hover:text-white" href="/#kontak">Tentang &amp; Kontak</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-white/50">
              Dinas Perhubungan Kota Palu
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {SYSTEM_INFO.office_address}
            </p>
            <p className="mt-1 select-all text-sm text-white/80">
              Telp <a href={`tel:${SYSTEM_INFO.phone}`} className="hover:underline">{SYSTEM_INFO.phone}</a>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-5">
          <p className="text-xs text-white/50">
            Kelompok 7, Teknik Informatika, Universitas Tadulako. Versi data v{SYSTEM_INFO.data_version}.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="/#kontak"
              className="inline-flex min-h-[44px] items-center rounded-full bg-sun px-5 text-xs font-bold text-ink hover:brightness-95 focus-ring"
            >
              Hubungi Dishub
            </a>
            <span
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
              </svg>
            </span>
            <span
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-navy"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
