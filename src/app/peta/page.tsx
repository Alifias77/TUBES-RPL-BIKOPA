'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import StopSheet from '@/components/StopSheet';
import LocationConsent from '@/components/LocationConsent';
import { CORRIDOR_CODES, CORRIDORS } from '@/lib/data/corridors';
import { findNearbyStops, NearbyStopResult } from '@/lib/geo';
import MapInfoPanel from '@/components/map/MapInfoPanel';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[500px] w-full items-center justify-center bg-mist text-sm text-ink/60">
      <div className="flex items-center gap-2">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-coral border-t-transparent" />
        Memuat peta rute Trans Palu...
      </div>
    </div>
  ),
});

export default function PetaFullPage() {
  const [visibleCorridors, setVisibleCorridors] = useState<Record<string, boolean>>({
    '01': true,
    '02': true,
    '03M': true,
    '03Y': true,
    '04': true,
  });
  const [sheetStopCode, setSheetStopCode] = useState<string | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp?: number;
  } | null>(null);
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
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [centerTrigger, setCenterTrigger] = useState(0);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

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

  function handleMapClick(lat: number, lng: number) {
    setUserPin({ lat, lng, isGps: false });
    const res = findNearbyStops(lat, lng, 5000, 3);
    setNearbyResults(res);
  }

  function startLocationWatch() {
    setLocationError(null);
    setIsLocating(true);
    setCenterTrigger((prev) => prev + 1);

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationError('Perangkat Anda tidak mendukung fitur lokasi GPS.');
      setIsLocating(false);
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    const applyPosition = (pos: GeolocationPosition) => {
      setIsLocating(false);
      const { latitude, longitude, accuracy } = pos.coords;
      setUserLocation({
        lat: latitude,
        lng: longitude,
        accuracy: accuracy || undefined,
        timestamp: pos.timestamp,
      });
    };

    navigator.geolocation.getCurrentPosition(
      applyPosition,
      (err) => console.warn('Quick position warning:', err.message),
      { enableHighAccuracy: false, timeout: 3500, maximumAge: 300000 }
    );

    try {
      const id = navigator.geolocation.watchPosition(
        applyPosition,
        (err) => {
          setIsLocating(false);
          let message = 'Gagal membaca lokasi GPS.';
          if (err.code === 1) message = 'Izin lokasi belum diberikan pada browser.';
          else if (err.code === 2) message = 'Sinyal lokasi tidak tersedia.';
          else if (err.code === 3) message = 'Waktu pencarian lokasi habis.';
          setLocationError((prev) => (userLocation ? prev : message));
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
      );
      watchIdRef.current = id;
    } catch {
      setIsLocating(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-mist">
      <header className="bg-navy text-white">
        <SiteHeader />
      </header>

      {/* Full Map Canvas Container */}
      <main className="flex-1 flex flex-col relative w-full h-[calc(100vh-64px)]">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-white/95 backdrop-blur px-4 py-3 z-20 shadow-sm">
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
              Semua Koridor
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (userLocation) {
                  setCenterTrigger((p) => p + 1);
                } else {
                  setConsentOpen(true);
                }
              }}
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
              <span>{isLocating ? 'Mencari GPS...' : userLocation ? 'Lokasi Saya Aktif' : 'Cari Halte Terdekat'}</span>
            </button>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative w-full h-full min-h-0">
          <LeafletMap
            visibleCorridors={visibleCorridors}
            userPin={userPin}
            centerTrigger={centerTrigger}
            isFullScreen={true}
            onOpenSheet={(code) => setSheetStopCode(code)}
            onMapClick={handleMapClick}
          />

          {/* Floating Info Panel at Bottom */}
          {nearbyResults && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-[1000] max-h-[45vh] overflow-y-auto rounded-2xl bg-white/95 backdrop-blur shadow-2xl ring-1 ring-ink/10">
              <MapInfoPanel
                nearbyResults={nearbyResults}
                isGps={userPin?.isGps}
                accuracy={userPin?.accuracy}
                isLocating={isLocating}
                locationError={locationError}
                onOpenSheet={(code) => setSheetStopCode(code)}
              />
            </div>
          )}
        </div>
      </main>

      <StopSheet
        stopCode={sheetStopCode}
        onClose={() => setSheetStopCode(null)}
      />

      <LocationConsent
        isOpen={consentOpen}
        onConfirm={() => {
          setConsentOpen(false);
          startLocationWatch();
        }}
        onCancel={() => setConsentOpen(false)}
      />
    </div>
  );
}
