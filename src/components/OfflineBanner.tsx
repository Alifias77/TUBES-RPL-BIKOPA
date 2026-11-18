'use client';

import React, { useState, useEffect } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [isDbFallback, setIsDbFallback] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem('bikopa_dismiss_banner') === '1') {
        setIsDismissed(true);
      }
    } catch {}
  }, []);

  // 1. Pantau status jaringan perangkat (Online / Offline)
  useEffect(() => {
    function updateStatus() {
      setIsOffline(!navigator.onLine);
    }
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  // 2. Pantau status database saat perangkat sedang online
  useEffect(() => {
    if (isOffline) return;

    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await fetch('/api/v1/system-info', { cache: 'no-store' });
        if (!res.ok) throw new Error('Health check error');
        const json = await res.json();
        if (isMounted) {
          setIsDbFallback(Boolean(json?.database?.is_fallback_active));
        }
      } catch (err) {
        // Jika endpoint tidak merespons, tandai fallback aktif
        if (isMounted) setIsDbFallback(true);
      }
    }

    checkHealth();

    // Periksa ulang setiap 60 detik secara ringan
    const interval = setInterval(checkHealth, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOffline]);

  async function handleRefreshCheck() {
    setIsChecking(true);
    try {
      const res = await fetch('/api/v1/system-info', { cache: 'no-store' });
      const json = await res.json();
      setIsDbFallback(Boolean(json?.database?.is_fallback_active));
    } catch {
      setIsDbFallback(true);
    } finally {
      setIsChecking(false);
    }
  }

  // Jika tidak ada kendala, atau pengguna telah menutup notifikasi fallback
  if (!isOffline && (!isDbFallback || isDismissed)) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[60] w-full border-b transition-all duration-300 shadow-sm"
      style={{
        backgroundColor: isOffline ? '#1b2d52' : '#fef3c7',
        color: isOffline ? '#ffffff' : '#92400e',
        borderColor: isOffline ? 'rgba(255,255,255,0.15)' : '#fde68a',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          {/* Ikon Status */}
          {isOffline ? (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-300">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </span>
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </span>
          )}

          {/* Isi Pesan Bersahabat */}
          <div className="font-medium leading-snug">
            {isOffline ? (
              <span>
                <strong>Mode Offline:</strong> Anda tidak terhubung ke internet. Seluruh data 53 halte, rute koridor, dan jadwal tetap dapat diakses normal dari perangkat Anda.
              </span>
            ) : (
              <span>
                <strong>Info Layanan:</strong> Sinkronisasi database cloud sedang pemeliharaan. Fitur pelacakan GPS live beralih ke estimasi data master lokal (Peta rute &amp; 53 halte tetap aktif 100%).
              </span>
            )}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-2 pl-3">
          {!isOffline && (
            <button
              type="button"
              onClick={handleRefreshCheck}
              disabled={isChecking}
              className="rounded-md px-2 py-1 text-[11px] font-semibold bg-amber-200/80 hover:bg-amber-300 text-amber-900 transition-colors disabled:opacity-50"
              title="Periksa ulang status koneksi database"
            >
              {isChecking ? 'Mengecek...' : 'Cek Status'}
            </button>
          )}

          {!isOffline && (
            <button
              type="button"
              onClick={() => {
                setIsDismissed(true);
                try { sessionStorage.setItem('bikopa_dismiss_banner', '1'); } catch {}
              }}
              className="rounded-md p-1 hover:bg-amber-200/60 text-amber-800 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
