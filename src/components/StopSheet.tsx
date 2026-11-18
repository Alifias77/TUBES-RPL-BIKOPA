'use client';

import React from 'react';
import Link from 'next/link';
import { BUS_STOPS_MAP } from '@/lib/data/stops';
import { CORRIDORS } from '@/lib/data/corridors';

interface Props {
  stopCode: string | null;
  onClose: () => void;
}

export default function StopSheet({ stopCode, onClose }: Props) {
  if (!stopCode || !BUS_STOPS_MAP[stopCode]) return null;

  const stop = BUS_STOPS_MAP[stopCode];

  return (
    <>
      <div
        id="sheet-bg"
        className="fixed inset-0 z-[99990] backdrop-blur-sm"
        style={{ background: 'rgba(18,30,58,.5)' }}
        onClick={onClose}
      />
      <div
        id="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className="open fixed left-0 right-0 bottom-0 z-[99995]"
      >
        <div
          className="mx-auto max-w-[640px] rounded-t-3xl bg-white shadow-xl"
          style={{
            padding: '12px max(20px, env(safe-area-inset-right, 0px)) max(20px, env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))',
          }}
        >
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/15" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p id="sheet-kicker" className="text-[11px] font-bold uppercase tracking-wider text-ink/50">
                {stop.stop_code} · {stop.stop_type} · {stop.corridors.length} koridor
              </p>
              <h3 id="sheet-title" className="display text-3xl font-bold text-navy">
                {stop.name}
              </h3>
            </div>
            <button
              id="sheet-x"
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mist text-navy focus-ring"
              aria-label="Tutup"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div id="sheet-body" className="mt-4 space-y-2">
            {stop.corridors.map((code) => {
              const c = CORRIDORS[code];
              return (
                <div key={code} className="flex items-center justify-between gap-3 rounded-xl bg-mist px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="kb shrink-0"
                      style={{ background: c.color_hex, color: '#fff' }}
                    >
                      {code}
                    </span>
                    <span className="min-w-0 truncate text-sm font-medium text-ink">
                      {c.name}
                    </span>
                  </div>
                  <div className="shrink-0 text-right text-xs">
                    <span className="font-bold text-navy">Tiap {c.default_headway_minutes} mnt</span>
                    <span className="block text-[11px] text-ink/55">{c.operating_start.slice(0, 5)}–{c.operating_end.slice(0, 5)} WITA</span>
                  </div>
                </div>
              );
            })}
            <div className="pt-2 flex items-center justify-between text-xs text-ink/55">
              <span>Layanan reguler setiap hari. Tarif gratis masa uji coba.</span>
              <Link
                href={`/halte/${stop.stop_code}`}
                className="font-bold text-coral hover:underline"
              >
                Halaman Halte Penuh →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
