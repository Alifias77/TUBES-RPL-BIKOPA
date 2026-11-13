'use client';

import React from 'react';
import { CORRIDORS } from '@/lib/data/corridors';
import { NearbyStopResult } from '@/lib/geo';

interface MapInfoPanelProps {
  nearbyResults: {
    stops: NearbyStopResult[];
    isOutOfServiceArea: boolean;
  } | null;
  isGps?: boolean;
  accuracy?: number;
  isLocating?: boolean;
  locationError?: string | null;
  onOpenSheet: (stopCode: string) => void;
}

export default function MapInfoPanel({
  nearbyResults,
  isGps,
  accuracy,
  isLocating,
  locationError,
  onOpenSheet,
}: MapInfoPanelProps) {
  if (isLocating) {
    return (
      <div id="panel" className="border-t border-ink/10 bg-sky-50/80 p-4 text-sm" aria-live="polite">
        <div className="flex items-center gap-3 text-sky-800">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-600 border-t-transparent shrink-0" />
          <p className="font-semibold text-xs sm:text-sm">
            Menentukan lokasi GPS Anda secara akurat (High Accuracy)...
          </p>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div id="panel" className="border-t border-amber-200 bg-amber-50 p-4 text-sm" aria-live="polite">
        <div className="flex items-start gap-2.5 text-amber-900">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="text-xs sm:text-sm">
            <strong className="font-bold">{locationError}</strong>
            <p className="text-amber-800/80 mt-0.5">
              Anda tetap dapat mengetuk sembarang titik pada peta secara manual untuk mencari halte terdekat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (nearbyResults) {
    return (
      <div id="panel" className="border-t border-ink/10 bg-mist p-4 text-sm" aria-live="polite">
        {nearbyResults.isOutOfServiceArea ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <p className="font-bold text-navy">Anda berada di luar area layanan Trans Palu.</p>
            </div>
            <p className="mt-1 text-xs text-ink/70">
              Halte terdekat berjarak lebih dari 5 km dari lokasi Anda. Ketuk titik lain di dalam area Kota Palu pada peta.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
              <p className="font-bold text-navy flex items-center gap-2">
                <span>3 Halte Terdekat {isGps ? 'dari Lokasi Anda' : 'dari Titik Pilihan'}</span>
              </p>
              {isGps && accuracy !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-600 animate-pulse" />
                  GPS Akurat &plusmn;{Math.round(accuracy)}m
                </span>
              )}
            </div>

            <ul className="space-y-2">
              {nearbyResults.stops.map((r) => (
                <li key={r.stop.stop_code}>
                  <button
                    type="button"
                    onClick={() => onOpenSheet(r.stop.stop_code)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-2 text-left ring-1 ring-ink/10 hover:ring-coral focus-ring transition-all hover:shadow-sm"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-ink">
                        {r.stop.name}{' '}
                        {r.stop.stop_type === 'HUB' && (
                          <span className="text-coral font-bold text-xs">[HUB]</span>
                        )}
                      </span>
                      <span className="mt-0.5 flex flex-wrap gap-1">
                        {r.stop.corridors.map((c) => (
                          <span
                            key={c}
                            className="kb"
                            style={{ background: CORRIDORS[c]?.color_hex, color: '#fff' }}
                          >
                            {c}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="shrink-0 tabular-nums font-bold text-navy text-xs sm:text-sm bg-mist px-2.5 py-1 rounded-lg">
                      {r.distance_m < 1000
                        ? `${r.distance_m} m`
                        : `${(r.distance_m / 1000).toFixed(1)} km`}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="panel" className="border-t border-ink/10 bg-mist p-4 text-sm" aria-live="polite">
      <p className="text-xs sm:text-sm text-ink/70">
        Ketuk salah satu halte di peta untuk info jalur. Tekan tombol <strong className="text-navy font-semibold">Lokasi Saya</strong> atau ketuk sembarang titik pada peta untuk mencari 3 halte terdekat secara otomatis.
      </p>
    </div>
  );
}
