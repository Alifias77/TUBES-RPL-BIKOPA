import React from 'react';
import { SYSTEM_INFO } from '../lib/data/system-info';

export default function ContactSection() {
  return (
    <section id="kontak" className="bg-deep text-white min-h-screen flex flex-col justify-center py-12 md:py-16" aria-labelledby="judul-kontak">
      <div className="wrap gutter w-full">
        <div className="h-1 w-14 rounded bg-coral mb-4" />
        <h2 id="judul-kontak" className="display text-4xl font-extrabold uppercase sm:text-5xl">
          Tentang &amp; Kontak <span className="text-coral">Layanan</span>
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
          Sistem informasi rute, halte, jadwal, dan pemantauan Bus Trans Palu. Terbuka untuk seluruh warga Kota Palu tanpa perlu login atau registrasi akun.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* 1. Dinas Perhubungan */}
          <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
            <span className="kb bg-coral text-white text-xs">PENGELOLA LAYANAN</span>
            <h3 className="display text-2xl font-bold text-white mt-3">
              Dinas Perhubungan Kota Palu
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {SYSTEM_INFO.office_address}
            </p>
            <div className="mt-5 border-t border-white/15 pt-4">
              <span className="block text-[11px] uppercase tracking-wider text-white/60">Telepon Layanan</span>
              <a
                href={`tel:${SYSTEM_INFO.phone}`}
                className="mt-1 inline-flex items-center gap-2 text-lg font-bold text-sun hover:underline"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
                </svg>
                {SYSTEM_INFO.phone}
              </a>
              <span className="block text-xs text-white/60 mt-1">Hari kerja 08:00–16:00 WITA</span>
            </div>
          </div>

          {/* 2. Tim Pengembang Akademik */}
          <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur">
            <span className="kb bg-sun text-ink text-xs">PENGEMBANG SISTEM</span>
            <h3 className="display text-2xl font-bold text-white mt-3">
              Teknik Informatika Untad
            </h3>
            <p className="mt-2 text-xs text-white/75">
              Kelompok 7 Rekayasa Perangkat Lunak, Universitas Tadulako:
            </p>
            <ul className="mt-2 space-y-1 text-xs text-white/90 font-medium">
              <li>• Muh. Fachri N (F5512520094)</li>
              <li>• Alifias (F5512520099)</li>
              <li>• Akhsan Maulana R. (F5512530114)</li>
            </ul>
            <p className="mt-3 text-xs text-white/60 border-t border-white/15 pt-3">
              Dosen Pengampu: Dr. Deny Wiria Nugraha, S.T., M.Eng.
            </p>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-sun text-ink font-bold">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold text-white">Butuh informasi rute atau bantuan langsung?</p>
              <p className="text-xs text-white/70">Hubungi petugas Dinas Perhubungan Kota Palu di (0451) 421666.</p>
            </div>
          </div>
          <a
            href={`tel:${SYSTEM_INFO.phone}`}
            className="inline-flex min-h-[44px] items-center rounded-full bg-sun px-6 text-xs font-bold text-ink hover:brightness-95 focus-ring"
          >
            Hubungi Dishub Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
