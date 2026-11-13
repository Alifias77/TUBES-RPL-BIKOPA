'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Next.js Global Runtime Error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col justify-center items-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white/10 p-8 rounded-3xl ring-1 ring-white/15 backdrop-blur-md">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold uppercase tracking-wider mb-4">
          Status Sistem
        </span>
        <h1 className="display text-3xl sm:text-4xl font-extrabold text-white">
          Terjadi Kesalahan Sementara
        </h1>
        <p className="mt-3 text-sm text-white/80 leading-relaxed">
          Sistem mendeteksi kendala saat memuat komponen antarmuka. Anda dapat memuat ulang tanpa perlu memulai ulang server.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-coral px-6 text-sm font-bold text-white hover:brightness-110 shadow-lg transition-all"
          >
            Muat Ulang Komponen
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white/20 px-6 text-sm font-bold text-white hover:bg-white/30 transition-all"
          >
            Ke Beranda Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
