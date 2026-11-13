import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-center items-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white/10 p-8 rounded-3xl ring-1 ring-white/15 backdrop-blur-md">
        <span className="inline-block px-3 py-1 rounded-full bg-coral text-white text-xs font-bold uppercase tracking-wider mb-4">
          404 · Halaman Tidak Ditemukan
        </span>
        <h1 className="display text-4xl sm:text-5xl font-extrabold text-white">
          BIKOPA Trans Palu
        </h1>
        <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
          Mohon maaf, halaman, rute koridor, atau kode halte yang Anda cari tidak tersedia dalam database Trans Palu.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-coral px-6 text-sm font-bold text-white hover:brightness-110 shadow-lg transition-all"
          >
            Kembali ke Beranda
          </Link>
          <Link
            href="/#armada"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white/20 px-6 text-sm font-bold text-white hover:bg-white/30 transition-all"
          >
            Lihat Koridor Bus
          </Link>
        </div>
      </div>
    </div>
  );
}
