'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CORRIDOR_CODES, CORRIDORS } from '@/lib/data/corridors';
import { findNearbyStops, NearbyStopResult } from '@/lib/geo';
import MapInfoPanel from './map/MapInfoPanel';

// Dynamic import untuk LeafletMap agar aman dari SSR window undefined
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[360px] sm:h-[420px] md:h-[460px] w-full items-center justify-center bg-mist text-sm text-ink/60">
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-coral border-t-transparent" />
        Memuat peta rute Trans Palu...
      </div>
    </div>
  ),
});

interface Props {
  onOpenSheet: (stopCode: string) => void;
  selectedCorridor?: string | null;
  userLocation?: { lat: number; lng: number; accuracy?: number; timestamp?: number } | null;
  isLocating?: boolean;
  locationError?: string | null;
  centerTrigger?: number;
  onRequestLocation?: () => void;
}

export default function MapPreview({
  onOpenSheet,
  selectedCorridor,
  userLocation,
  isLocating,
  locationError,
  centerTrigger = 0,
  onRequestLocation,
}: Props) {
  const [visibleCorridors, setVisibleCorridors] = useState<Record<string, boolean>>({
    '01': true,
    '02': true,
    '03M': true,
    '03Y': true,
    '04': true,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [userPin, setUserPin] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    isGps?: boolean;
    timestamp?: number;
  } | null>(null);
  const [nearbyResults, setNearbyResults] = useState<{
    stops: NearbyStopResult[];
    isOutOfServiceArea: boolean;
  } | null>(null);

  // Jika selectedCorridor dipilih dari tombol koridor di header/grid
  useEffect(() => {
    if (selectedCorridor && CORRIDOR_CODES.includes(selectedCorridor as any)) {
      setVisibleCorridors({
        '01': selectedCorridor === '01',
        '02': selectedCorridor === '02',
        '03M': selectedCorridor === '03M',
        '03Y': selectedCorridor === '03Y',
        '04': selectedCorridor === '04',
      });
    }
  }, [selectedCorridor]);

  // Sinkronisasi posisi GPS pengguna secara akurat dan otomatis saat izin lokasi diberikan
  useEffect(() => {
    if (userLocation) {
      setUserPin({
        lat: userLocation.lat,
        lng: userLocation.lng,
        accuracy: userLocation.accuracy,
        isGps: true,
        timestamp: userLocation.timestamp,
      });
      const res = findNearbyStops(userLocation.lat, userLocation.lng, 5000, 3);
      setNearbyResults(res);
    }
  }, [userLocation]);

  // Kunci scroll body saat layar penuh & dukung tombol Escape untuk keluar
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          setIsFullScreen(false);
        }
      }
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isFullScreen]);

  const isAllVisible = CORRIDOR_CODES.every((code) => visibleCorridors[code]);

  function handleCorridorFilter(code: string) {
    const isOnlyThisActive =
      visibleCorridors[code] &&
      CORRIDOR_CODES.every((c) => (c === code ? visibleCorridors[c] : !visibleCorridors[c]));

    if (isOnlyThisActive) {
      showAllCorridors();
    } else {
      const singleOn: Record<string, boolean> = {};
      CORRIDOR_CODES.forEach((c) => {
        singleOn[c] = c === code;
      });
      setVisibleCorridors(singleOn);
    }
  }

  function showAllCorridors() {
    const allOn: Record<string, boolean> = {};
    CORRIDOR_CODES.forEach((c) => {
      allOn[c] = true;
    });
    setVisibleCorridors(allOn);
  }

  function handleLeafletMapClick(lat: number, lng: number) {
    setUserPin({ lat, lng, isGps: false });
    const res = findNearbyStops(lat, lng, 5000, 3);
    setNearbyResults(res);
  }

  return (
    <section id="jangkauan" className="gutter min-h-screen flex flex-col justify-center py-12 md:py-16" aria-labelledby="judul-jangkauan">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] w-full">
        <div
          id="mapcard"
          className={`min-w-0 overflow-hidden bg-white ring-1 ring-ink/10 shadow-lg ${
            isFullScreen ? 'mapfull' : 'rounded-3xl relative isolate z-10'
          }`}
        >
          {/* Header Bar: Filter Koridor & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-mist p-3 shrink-0 z-20">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter koridor">
              <button
                type="button"
                className="chip focus-ring"
                aria-pressed={isAllVisible}
                onClick={showAllCorridors}
              >
                <span
                  className="sw"
                  style={{ background: isAllVisible ? '#ff6b4a' : '#cbd2de' }}
                />
                Semua
              </button>
              {CORRIDOR_CODES.map((code) => {
                const c = CORRIDORS[code];
                const isVisible = visibleCorridors[code];
                return (
                  <button
                    key={code}
                    type="button"
                    className="chip focus-ring"
                    aria-pressed={isVisible}
                    onClick={() => handleCorridorFilter(code)}
                  >
                    <span
                      className="sw"
                      style={{ background: isVisible ? c.color_hex : '#cbd2de' }}
                    />
                    Koridor {code}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2 ml-auto">
              {onRequestLocation && (
                <button
                  type="button"
                  onClick={onRequestLocation}
                  title="Deteksi Lokasi GPS Saya"
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm ring-1 ring-ink/10 focus-ring transition-all ${
                    userLocation
                      ? 'bg-sky-600 text-white hover:bg-sky-700'
                      : isLocating
                      ? 'bg-white text-sky-600 animate-pulse'
                      : 'bg-white text-navy hover:bg-slate-100'
                  }`}
                >
                  {isLocating ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="12" cy="12" r="8" />
                      <line x1="12" y1="2" x2="12" y2="4" />
                      <line x1="12" y1="20" x2="12" y2="22" />
                      <line x1="2" y1="12" x2="4" y2="12" />
                      <line x1="20" y1="12" x2="22" y2="12" />
                    </svg>
                  )}
                  <span>
                    {isLocating ? 'Mencari GPS...' : userLocation ? 'Lokasi Aktif' : 'Lokasi Saya'}
                  </span>
                </button>
              )}

              <button
                id="map-full"
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                className={`inline-flex min-h-[38px] items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-bold shadow-md ring-1 ring-ink/10 focus-ring transition-all ${
                  isFullScreen
                    ? 'bg-coral text-white hover:brightness-110'
                    : 'bg-white text-navy hover:bg-slate-100'
                }`}
                aria-label={isFullScreen ? 'Tutup layar penuh' : 'Buka layar penuh'}
              >
                {isFullScreen ? (
                  <>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                    <span>Tutup Peta Penuh</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    <span>Layar Penuh</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Map Display View (Leaflet OSM Riil dengan Ikon Halte Bus) */}
          <div className={`relative ${isFullScreen ? 'flex-1 w-full h-full min-h-0 flex flex-col' : 'w-full'}`}>
            <LeafletMap
              visibleCorridors={visibleCorridors}
              userPin={userPin}
              centerTrigger={centerTrigger}
              isFullScreen={isFullScreen}
              onOpenSheet={onOpenSheet}
              onMapClick={handleLeafletMapClick}
            />

            {/* In fullscreen mode, floating Info Panel overlay at bottom left */}
            {isFullScreen && nearbyResults && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-[1000] max-h-[42vh] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur shadow-2xl ring-1 ring-ink/10">
                <MapInfoPanel
                  nearbyResults={nearbyResults}
                  isGps={userPin?.isGps}
                  accuracy={userPin?.accuracy}
                  isLocating={isLocating}
                  locationError={locationError}
                  onOpenSheet={onOpenSheet}
                />
              </div>
            )}
          </div>

          {/* Normal inline Map Info Panel */}
          {!isFullScreen && (
            <MapInfoPanel
              nearbyResults={nearbyResults}
              isGps={userPin?.isGps}
              accuracy={userPin?.accuracy}
              isLocating={isLocating}
              locationError={locationError}
              onOpenSheet={onOpenSheet}
            />
          )}
        </div>

        {/* Right Info Section */}
        <div className="min-w-0">
          <div className="h-1 w-14 rounded bg-coral" />
          <h2 id="judul-jangkauan" className="display mt-4 text-4xl font-extrabold uppercase leading-none text-navy sm:text-5xl">
            Peta jalur dan halte
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink/75">
            Seluruh 5 koridor dan 53 titik halte di Kota Palu dalam satu peta interaktif, tanpa akun dan tanpa formulir.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-ink/80">
            <li className="flex gap-2">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral" />
              Titik halte presisi sesuai master data resmi Dinas Perhubungan
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral" />
              Filter koridor nyala atau mati secara langsung
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral" />
              Deteksi lokasi akurat otomatis dengan GPS perangkat Anda
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-coral" />
              Info rute dan halte tetap dapat diakses saat offline
            </li>
          </ul>
          <button
            id="btn-full"
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl px-6 text-sm font-bold shadow-md focus-ring transition-all ${
              isFullScreen
                ? 'bg-navy text-white hover:bg-navy/90 ring-2 ring-navy'
                : 'bg-coral text-white hover:bg-[#e63946] active:bg-[#d62839]'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              {isFullScreen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              )}
            </svg>
            <span>{isFullScreen ? 'Tutup Peta Penuh' : 'Buka Peta Penuh'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
