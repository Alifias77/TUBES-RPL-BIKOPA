'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import HeroSection from '@/components/HeroSection';
import CorridorGrid from '@/components/CorridorGrid';
import LiveBanner from '@/components/LiveBanner';
import InfoTabs from '@/components/InfoTabs';
import HubCards from '@/components/HubCards';
import MapPreview from '@/components/MapPreview';
import ContactSection from '@/components/ContactSection';
import SiteFooter from '@/components/SiteFooter';
import StopSheet from '@/components/StopSheet';
import LocationConsent from '@/components/LocationConsent';
import RouteModal from '@/components/RouteModal';

export default function HomePage() {
  const [selectedCorridor, setSelectedCorridor] = useState<string | null>(null);
  const [sheetStopCode, setSheetStopCode] = useState<string | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [routeModalCode, setRouteModalCode] = useState<string | null>(null);

  // High-accuracy live GPS location state
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
    timestamp?: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [centerTrigger, setCenterTrigger] = useState(0);
  const watchIdRef = useRef<number | null>(null);

  // Cleanup watchPosition on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  function handleSelectCorridor(code: string) {
    setSelectedCorridor(code);
    const mapEl = document.getElementById('jangkauan');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleOpenConsent() {
    setConsentOpen(true);
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

    // 1. Ambil posisi cepat terlebih dahulu (< 1 detik) menggunakan cache / wifi triangulation
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyPosition(pos);
      },
      (err) => {
        // Jangan blokir jika quick fix gagal, watchPosition di bawah akan mencoba kembali
        console.warn('Quick position warning:', err.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 3500,
        maximumAge: 300000,
      }
    );

    // 2. Pantau pembaruan posisi presisi tinggi secara efisien
    try {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          applyPosition(pos);
        },
        (err) => {
          // Hanya tampilkan error jika belum ada posisi yang berhasil didapatkan
          setIsLocating(false);
          console.warn('Geolocation watch error:', err.message);
          let message = 'Gagal membaca lokasi GPS.';
          if (err.code === 1) {
            message = 'Izin akses lokasi belum diberikan pada browser Anda.';
          } else if (err.code === 2) {
            message = 'Sinyal lokasi tidak tersedia saat ini.';
          } else if (err.code === 3) {
            message = 'Waktu pencarian lokasi GPS habis.';
          }
          setLocationError((prev) => (userLocation ? prev : message));
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 5000,
        }
      );
      watchIdRef.current = id;
    } catch (e) {
      setIsLocating(false);
      console.error('Error starting watchPosition:', e);
    }
  }

  function handleConsentConfirm() {
    setConsentOpen(false);
    const mapEl = document.getElementById('jangkauan');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    startLocationWatch();
  }

  return (
    <>
      {/* 1. Header / Hero Section (Full Viewport) */}
      <header
        id="beranda"
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#162646] text-white"
      >
        {/* Background Image: Landmark Palu (Tugu Sambulu Gana) with tuned opacity and contrast scrim */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <Image
            src="/images/background-home.jpg"
            alt="Latar Belakang Tugu Sambulu Gana Palu"
            fill
            priority
            quality={90}
            className="object-cover object-center opacity-60 scale-105"
            sizes="100vw"
          />
          {/* Directional scrim: dark navy on the left text area, softer tint on landmark area */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#162646]/90 via-[#162646]/65 to-[#162646]/25"
            aria-hidden="true"
          />
          {/* Vertical scrim: smooth integration with navbar and bottom sections */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#1b2d52]/50 via-transparent to-[#162646]"
            aria-hidden="true"
          />
        </div>

        <SiteHeader />
        <HeroSection />
      </header>

      {/* 2. Main Content Sections */}
      <main>
        <CorridorGrid
          onSelectCorridor={handleSelectCorridor}
          onOpenConsent={handleOpenConsent}
          onOpenRouteModal={(code) => setRouteModalCode(code)}
        />
        <LiveBanner />
        <InfoTabs onOpenRouteModal={(code) => setRouteModalCode(code)} />
        <HubCards onOpenSheet={(code) => setSheetStopCode(code)} />
        <MapPreview
          selectedCorridor={selectedCorridor}
          onOpenSheet={(code) => setSheetStopCode(code)}
          userLocation={userLocation}
          isLocating={isLocating}
          locationError={locationError}
          centerTrigger={centerTrigger}
          onRequestLocation={() => {
            if (userLocation) {
              setCenterTrigger((prev) => prev + 1);
            } else {
              handleOpenConsent();
            }
          }}
        />
        <ContactSection />
      </main>

      {/* 3. Footer */}
      <SiteFooter />

      {/* 4. Modals & Drawers */}
      <StopSheet
        stopCode={sheetStopCode}
        onClose={() => setSheetStopCode(null)}
      />

      <LocationConsent
        isOpen={consentOpen}
        onConfirm={handleConsentConfirm}
        onCancel={() => setConsentOpen(false)}
      />

      {/* Pop Up Rute Interaktif Modal */}
      <RouteModal
        isOpen={Boolean(routeModalCode)}
        initialCorridorCode={routeModalCode}
        onClose={() => setRouteModalCode(null)}
      />
    </>
  );
}
