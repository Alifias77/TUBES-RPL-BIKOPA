'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CORRIDORS, CORRIDOR_CODES } from '@/lib/data/corridors';

interface Props {
  isOpen: boolean;
  initialCorridorCode?: string | null;
  onClose: () => void;
}

export default function RouteModal({ isOpen, initialCorridorCode, onClose }: Props) {
  const [activeCode, setActiveCode] = useState<string>('01');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Sync initial corridor when opened
  useEffect(() => {
    if (initialCorridorCode && CORRIDORS[initialCorridorCode]) {
      setActiveCode(initialCorridorCode);
    }
  }, [initialCorridorCode, isOpen]);

  // Reset zoom level when changing corridor or closing
  useEffect(() => {
    setZoomLevel(1);
  }, [activeCode, isOpen]);

  // Keyboard accessibility: ESC to close
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const corridor = CORRIDORS[activeCode] || CORRIDORS['01'];
  const imageSrc = `/images/routes/${activeCode}.png`;

  function handleZoomIn() {
    setZoomLevel((prev) => Math.min(prev + 0.3, 2.5));
  }

  function handleZoomOut() {
    setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  }

  function handleResetZoom() {
    setZoomLevel(1);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy/75 backdrop-blur-md transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-route-title"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-ink/10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-mist px-5 py-4">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="kb text-sm px-2.5 py-1 font-bold shadow-sm"
              style={{ background: corridor.color_hex, color: '#fff' }}
            >
              Koridor {corridor.code}
            </span>
            <div className="min-w-0">
              <h2 id="modal-route-title" className="display text-xl sm:text-2xl font-bold text-navy truncate">
                {corridor.name}
              </h2>
              <p className="text-xs text-ink/65 truncate">{corridor.via_route}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink/70 hover:bg-ink/10 hover:text-navy focus-ring transition-colors"
            aria-label="Tutup pop-up rute"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Corridor Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-ink/10 bg-white px-5 py-2.5 overflow-x-auto">
          <span className="text-xs font-bold text-ink/50 uppercase tracking-wider mr-2 shrink-0">
            Pilih Koridor:
          </span>
          {CORRIDOR_CODES.map((code) => {
            const c = CORRIDORS[code];
            const isSelected = code === activeCode;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setActiveCode(code)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                  isSelected
                    ? 'text-white shadow-sm ring-1 ring-black/10 scale-105'
                    : 'bg-mist text-ink/75 hover:bg-ink/10'
                }`}
                style={isSelected ? { background: c.color_hex } : {}}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: isSelected ? '#fff' : c.color_hex }}
                />
                Koridor {code}
              </button>
            );
          })}
        </div>

        {/* Image Container with Zoom Controls */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[380px] max-h-[55vh] overflow-auto bg-[#f8fafc] p-4 flex items-center justify-center">
          {/* Zoom floating controls */}
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur px-2 py-1 shadow-md ring-1 ring-ink/10 text-xs font-bold text-navy">
            <button
              type="button"
              onClick={handleZoomIn}
              className="grid h-8 w-8 place-items-center rounded-lg hover:bg-mist focus-ring text-ink"
              title="Perbesar gambar"
              aria-label="Perbesar"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="grid h-8 w-8 place-items-center rounded-lg hover:bg-mist focus-ring text-ink"
              title="Perkecil gambar"
              aria-label="Perkecil"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35M8 11h6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-lg hover:bg-mist focus-ring text-[11px] text-ink/75"
              title="Atur ulang ukuran"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <a
              href={imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-lg hover:bg-mist focus-ring text-ink/75 hover:text-navy"
              title="Buka gambar penuh di tab baru"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>

          {/* Interactive Route Image */}
          <div
            className="transition-transform duration-150 ease-out flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <img
              src={imageSrc}
              alt={`Peta Rute Interaktif Koridor ${activeCode} - ${corridor.name}`}
              className="max-h-[50vh] w-auto max-w-full rounded-xl object-contain shadow-sm cursor-grab active:cursor-grabbing"
              draggable="false"
            />
          </div>
        </div>

        {/* Footer Info & Actions */}
        <div className="border-t border-ink/10 bg-white px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
              <div>
                <span className="block text-ink/50 uppercase tracking-wider text-[10px]">Titik Halte</span>
                <strong className="text-navy text-sm">{corridor.stops_count} Halte</strong>
              </div>
              <div>
                <span className="block text-ink/50 uppercase tracking-wider text-[10px]">Jam Operasional</span>
                <strong className="text-navy text-sm">{corridor.operating_start.slice(0, 5)}–{corridor.operating_end.slice(0, 5)} WITA</strong>
              </div>
              <div>
                <span className="block text-ink/50 uppercase tracking-wider text-[10px]">Headway</span>
                <strong className="text-navy text-sm">Tiap {corridor.default_headway_minutes} Menit</strong>
              </div>
              <div>
                <span className="block text-ink/50 uppercase tracking-wider text-[10px]">Tarif</span>
                <span className="font-bold text-emerald-600 text-sm">Gratis</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
              <Link
                href={`/koridor/${activeCode}`}
                onClick={onClose}
                className="inline-flex min-h-[40px] flex-1 sm:flex-none items-center justify-center rounded-xl bg-navy px-4 text-xs font-bold text-white hover:bg-deep focus-ring transition-colors shadow-sm"
              >
                Detail Urutan Halte &rarr;
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-ink/20 px-4 text-xs font-bold text-ink hover:bg-mist focus-ring transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
