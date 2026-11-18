'use client';

import React, { useEffect, useRef } from 'react';
import { BUS_STOPS } from '@/lib/data/stops';
import { CORRIDORS, CORRIDOR_CODES } from '@/lib/data/corridors';
import { getCorridorCoordinates } from '@/lib/data/routes';
import 'leaflet/dist/leaflet.css';

interface UserPinData {
  lat: number;
  lng: number;
  accuracy?: number;
  isGps?: boolean;
  timestamp?: number;
}

interface Props {
  visibleCorridors: Record<string, boolean>;
  userPin?: UserPinData | null;
  centerTrigger?: number;
  isFullScreen?: boolean;
  onOpenSheet: (stopCode: string) => void;
  onMapClick: (lat: number, lng: number) => void;
}

export default function LeafletMap({
  visibleCorridors,
  userPin,
  centerTrigger = 0,
  isFullScreen = false,
  onOpenSheet,
  onMapClick,
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const stopLayerRef = useRef<any>(null);
  const userPinLayerRef = useRef<any>(null);

  const hasInitialGpsFlyRef = useRef(false);
  const prevCenterTriggerRef = useRef(centerTrigger);

  // Inisialisasi peta Leaflet sekali saat mount (tahan refresh & strict-mode)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current) return;

      const L = await import('leaflet');

      if (!isMounted || !mapContainerRef.current) return;

      // Bersihkan instans Leaflet lama jika ada untuk mencegah "Map container is already initialized"
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Map cleanup warning:', e);
        }
        mapInstanceRef.current = null;
      }

      const container = mapContainerRef.current;
      if ((container as any)._leaflet_id != null) {
        delete (container as any)._leaflet_id;
      }
      container.innerHTML = '';

      try {
        // Palu bounds & center
        const centerPalu: [number, number] = [-0.88, 119.87];
        const map = L.map(container, {
          center: centerPalu,
          zoom: 12,
          minZoom: 10,
          maxZoom: 18,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        map.on('click', (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });

        mapInstanceRef.current = map;
        routeLayerRef.current = L.layerGroup().addTo(map);
        stopLayerRef.current = L.layerGroup().addTo(map);
        userPinLayerRef.current = L.layerGroup().addTo(map);

        renderRoutes(L);
        renderStops(L);
        renderUserPin(L);

        // Pastikan ukuran peta terhitung tepat di semua resolusi layar
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);
      } catch (err) {
        console.error('Gagal inisialisasi Leaflet Map:', err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Map cleanup on unmount warning:', e);
        }
        mapInstanceRef.current = null;
      }
      if (mapContainerRef.current) {
        if ((mapContainerRef.current as any)._leaflet_id != null) {
          delete (mapContainerRef.current as any)._leaflet_id;
        }
        mapContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Render Polylines jalur rute untuk setiap koridor yang aktif
  async function renderRoutes(L?: any) {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    const Leaflet = L || (await import('leaflet'));

    routeLayerRef.current.clearLayers();

    CORRIDOR_CODES.forEach((code) => {
      if (!visibleCorridors[code]) return;
      const corridor = CORRIDORS[code];
      const coords = getCorridorCoordinates(code);

      if (coords.length < 2) return;

      // Background polyline (putih tebal sebagai casing / outline)
      const casing = Leaflet.polyline(coords, {
        color: '#ffffff',
        weight: 8,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });

      // Foreground polyline (warna koridor)
      const line = Leaflet.polyline(coords, {
        color: corridor.color_hex,
        weight: 5,
        opacity: 0.92,
        lineCap: 'round',
        lineJoin: 'round',
      });

      line.bindTooltip(`<strong>Koridor ${code}</strong><br/>${corridor.name}`, {
        sticky: true,
      });

      routeLayerRef.current.addLayer(casing);
      routeLayerRef.current.addLayer(line);
    });
  }

  // Render 53 Halte dari CSV dengan Ikon Halte Bus
  async function renderStops(L?: any) {
    if (!mapInstanceRef.current || !stopLayerRef.current) return;
    const Leaflet = L || (await import('leaflet'));

    stopLayerRef.current.clearLayers();

    BUS_STOPS.forEach((stop) => {
      // Periksa apakah ada koridor halte ini yang sedang aktif difilter
      const isVisible = stop.corridors.some((c) => visibleCorridors[c]);
      if (!isVisible) return;

      const isHub = stop.stop_type === 'HUB';
      const primaryCorridor = stop.corridors[0];
      const color = CORRIDORS[primaryCorridor]?.color_hex || '#1b2d52';

      // Marker Ikon Halte Bus (DivIcon dengan SVG bus)
      const stopIcon = Leaflet.divIcon({
        className: 'bikopa-halte-marker',
        html: `
          <div style="
            width: ${isHub ? '28px' : '22px'};
            height: ${isHub ? '28px' : '22px'};
            background: ${isHub ? '#ff6b4a' : color};
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            color: #ffffff;
            cursor: pointer;
          " title="${stop.name}">
            <svg viewBox="0 0 24 24" width="${isHub ? '16' : '12'}" height="${isHub ? '16' : '12'}" fill="currentColor" aria-hidden="true">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
            </svg>
          </div>
        `,
        iconSize: [isHub ? 28 : 22, isHub ? 28 : 22],
        iconAnchor: [isHub ? 14 : 11, isHub ? 14 : 11],
      });

      const marker = Leaflet.marker([stop.latitude, stop.longitude], {
        icon: stopIcon,
        riseOnHover: true,
      });

      const corridorBadges = stop.corridors
        .map(
          (c) =>
            `<span style="background:${CORRIDORS[c]?.color_hex || '#333'};color:#fff;padding:1px 5px;border-radius:3px;font-size:10px;font-weight:bold;margin-right:3px;">${c}</span>`
        )
        .join('');

      marker.bindTooltip(
        `<div style="font-family:system-ui;padding:2px 0;">
          <strong style="color:#1b2d52;">${stop.name}</strong> ${isHub ? '<span style="color:#ff6b4a;font-weight:bold;font-size:11px;">[HUB]</span>' : ''}
          <div style="margin-top:3px;">${corridorBadges}</div>
          <span style="font-size:11px;color:#666;">Klik untuk info detail halte</span>
        </div>`,
        { direction: 'top', offset: [0, isHub ? -14 : -11] }
      );

      marker.on('click', (e: any) => {
        Leaflet.DomEvent.stopPropagation(e);
        onOpenSheet(stop.stop_code);
      });

      stopLayerRef.current.addLayer(marker);
    });
  }

  // Render Pin Lokasi Pengguna (Akurat dengan animasi live GPS dan lingkaran radius akurasi)
  async function renderUserPin(L?: any) {
    if (!mapInstanceRef.current || !userPinLayerRef.current) return;
    const Leaflet = L || (await import('leaflet'));

    userPinLayerRef.current.clearLayers();

    if (userPin) {
      const isGps = Boolean(userPin.isGps);

      // 1. Lingkaran radius akurasi jika menggunakan GPS (akurasi < 3000 meter)
      if (isGps && userPin.accuracy && userPin.accuracy < 3000) {
        const accuracyCircle = Leaflet.circle([userPin.lat, userPin.lng], {
          radius: userPin.accuracy,
          color: '#0284c7',
          fillColor: '#38bdf8',
          fillOpacity: 0.16,
          weight: 1.5,
          interactive: false,
        });
        userPinLayerRef.current.addLayer(accuracyCircle);
      }

      // 2. Marker Icon GPS Live vs Manual Pin
      const pinIcon = Leaflet.divIcon({
        className: isGps ? 'user-live-gps-marker' : 'user-pin-marker',
        html: isGps
          ? `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
              <!-- Outer GPS Wave Pulse Ring -->
              <span class="gps-pulse-ring" style="
                position: absolute;
                width: 34px;
                height: 34px;
                border-radius: 50%;
                background: rgba(2, 132, 199, 0.4);
                pointer-events: none;
              "></span>
              <!-- Inner Solid GPS Circle -->
              <span style="
                position: relative;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #0284c7;
                border: 3.5px solid #ffffff;
                box-shadow: 0 3px 10px rgba(0,0,0,0.38);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <span style="width: 5px; height: 5px; border-radius: 50%; background: #ffffff;"></span>
              </span>
            </div>
          `
          : `
            <div style="position: relative; width: 24px; height: 24px;">
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #ff6b4a;
                border: 3px solid #ffffff;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
              </div>
            </div>
          `,
        iconSize: isGps ? [34, 34] : [24, 24],
        iconAnchor: isGps ? [17, 17] : [12, 12],
      });

      const marker = Leaflet.marker([userPin.lat, userPin.lng], {
        icon: pinIcon,
        zIndexOffset: 1200,
      });

      marker.bindTooltip(
        `<div style="font-family:system-ui;padding:2px 0;">
          <strong style="color:#0284c7;">${isGps ? 'Lokasi Anda Saat Ini' : 'Titik Pilihan Anda'}</strong>
          ${
            isGps && userPin.accuracy
              ? `<br/><span style="font-size:11px;color:#555;">Akurasi GPS: &plusmn;${Math.round(userPin.accuracy)} meter</span>`
              : ''
          }
        </div>`,
        { direction: 'top', offset: [0, isGps ? -16 : -12] }
      );

      userPinLayerRef.current.addLayer(marker);
    }
  }

  // Trigger update saat filter atau data berubah
  useEffect(() => {
    renderRoutes();
    renderStops();
  }, [visibleCorridors]);

  useEffect(() => {
    renderUserPin();
  }, [userPin]);

  // ResizeObserver: Secara otomatis perbarui ukuran Leaflet saat kontainer melebar/mengecil (Layar Penuh, rotasi layar, resize)
  useEffect(() => {
    if (!mapContainerRef.current || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    observer.observe(mapContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Tangani transisi Layar Penuh secara bertahap agar tidak ada bidang abu-abu (grey void)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const targetCenter: [number, number] = userPin ? [userPin.lat, userPin.lng] : [-0.88, 119.87];

    map.invalidateSize();
    const t1 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        mapInstanceRef.current.panTo(targetCenter, { animate: false });
      }
    }, 60);
    const t2 = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isFullScreen, userPin]);

  // Otomatis arahkan dan pusatkan peta ke lokasi pengguna (flyTo)
  useEffect(() => {
    if (!mapInstanceRef.current || !userPin) return;

    const isExplicitTrigger = centerTrigger !== prevCenterTriggerRef.current;
    prevCenterTriggerRef.current = centerTrigger;

    if (isExplicitTrigger || (!hasInitialGpsFlyRef.current && userPin.isGps)) {
      hasInitialGpsFlyRef.current = true;
      mapInstanceRef.current.flyTo(
        [userPin.lat, userPin.lng],
        Math.max(mapInstanceRef.current.getZoom(), 15),
        {
          animate: true,
          duration: 1.2,
        }
      );
    }
  }, [userPin, centerTrigger]);

  return (
    <div
      className={`w-full z-0 ${
        isFullScreen
          ? 'h-full flex-1 min-h-[300px]'
          : 'h-[360px] sm:h-[420px] md:h-[460px]'
      }`}
    >
      <div
        ref={mapContainerRef}
        className="leaflet-container w-full h-full min-h-[300px]"
      />
    </div>
  );
}
