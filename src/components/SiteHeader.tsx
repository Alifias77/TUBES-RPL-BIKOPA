'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 border-b border-white/20 bg-navy/95 backdrop-blur-md">
      <nav className="wrap gutter flex items-center justify-between gap-4 py-3 font-nav" aria-label="Navigasi utama">
        <Link href="/#beranda" className="flex items-center gap-3 rounded focus-ring">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-white overflow-hidden p-1">
            <img
              src="/IMAGE/LOGO BIKOPA.png"
              alt="Logo BIKOPA"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="text-base font-bold tracking-wider text-white">BIKOPA</span>
        </Link>

        <ul className="hidden items-center gap-7 text-[13px] font-medium uppercase tracking-wide text-white/85 lg:flex">
          <li><Link className="rounded hover:text-white focus-ring" href="/#beranda">Beranda</Link></li>
          <li><a className="rounded hover:text-white focus-ring" href="/#armada">Koridor</a></li>
          <li><a className="rounded hover:text-white focus-ring" href="/#layanan">Jadwal</a></li>
          <li><a className="rounded hover:text-white focus-ring" href="/#rute">Hub</a></li>
          <li><a className="rounded hover:text-white focus-ring" href="/#jangkauan">Peta</a></li>
          <li><a className="rounded hover:text-white focus-ring" href="/#kontak">Kontak</a></li>
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/#jangkauan"
            className="inline-flex min-h-[44px] items-center border border-white/70 px-5 text-[13px] font-medium uppercase tracking-wide text-white hover:bg-white hover:text-navy focus-ring"
          >
            Buka Peta
          </a>
          <button
            id="menu-btn"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-11 w-11 place-items-center border border-white/40 text-white focus-ring lg:hidden"
            aria-label="Buka menu"
            aria-expanded={menuOpen}
            aria-controls="menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="menu" className="border-t border-white/15 lg:hidden font-nav">
          <ul className="wrap gutter grid grid-cols-2 gap-x-4 py-2 text-sm font-medium uppercase tracking-wide text-white/90">
            <li><Link onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center" href="/#beranda">Beranda</Link></li>
            <li><a onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center" href="/#armada">Koridor</a></li>
            <li><a onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center" href="/#layanan">Jadwal</a></li>
            <li><a onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center" href="/#rute">Hub</a></li>
            <li><a onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center" href="/#jangkauan">Peta</a></li>
            <li><a onClick={() => setMenuOpen(false)} className="flex min-h-[44px] items-center" href="/#kontak">Kontak</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}
