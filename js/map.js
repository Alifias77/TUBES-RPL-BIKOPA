/**
 * BIKOPA Trans Palu - Leaflet OSM Map & Bus Tracking Engine
 * File: js/map.js
 */

(function (window) {
  'use strict';

  var Data = window.BikopaData;
  var C = Data.C;
  var CODES = Data.CODES;
  var ALL_STOPS = Data.ALL_STOPS || [];
  var SEQUENCES = Data.SEQUENCES || {};
  var BUSES = Data.BUSES;
  var H = Data.H;

  var visible = {};
  CODES.forEach(function (k) { visible[k] = true; });

  function $(id) {
    return document.getElementById(id);
  }

  var map, routeLayer, stopLayer, busLayer, userPinLayer;

  // Inisialisasi Peta Leaflet Real OSM (tahan reload / refresh)
  function initMap() {
    var mapContainer = $('map');
    if (!mapContainer || !window.L) return;

    if (map) {
      try {
        map.remove();
      } catch (err) {
        console.warn('Map remove warning:', err);
      }
      map = null;
    }
    if (mapContainer._leaflet_id != null) {
      delete mapContainer._leaflet_id;
    }
    mapContainer.innerHTML = '';

    try {
      // Palu bounds & center
      map = L.map('map', {
        center: [-0.885, 119.875],
        zoom: 12,
        minZoom: 10,
        maxZoom: 18,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(map);

      routeLayer = L.layerGroup().addTo(map);
      stopLayer = L.layerGroup().addTo(map);
      busLayer = L.layerGroup().addTo(map);
      userPinLayer = L.layerGroup().addTo(map);

      renderRoutes();
      renderStops();
      renderBuses();

      var isDragging = false;
      var startContainerPoint = null;

      map.on('mousedown touchstart', function (e) {
        startContainerPoint = e.containerPoint;
      });

      map.on('dragstart', function () {
        isDragging = true;
      });

      map.on('dragend', function () {
        setTimeout(function () {
          isDragging = false;
        }, 150);
      });

      map.on('click', function (e) {
        if (isDragging) return;
        if (startContainerPoint && e.containerPoint) {
          var dx = e.containerPoint.x - startContainerPoint.x;
          var dy = e.containerPoint.y - startContainerPoint.y;
          if (Math.sqrt(dx * dx + dy * dy) > 8) {
            return;
          }
        }
        if (window.BikopaUI && window.BikopaUI.showNearby) {
          window.BikopaUI.showNearby(e.latlng.lat, e.latlng.lng);
        }
      });

      // Handle URL Parameters (e.g. ?koridor=02 or ?nearby=1)
      if (typeof window !== 'undefined' && window.location && window.location.search) {
        var params = new URLSearchParams(window.location.search);
        var targetCorridor = params.get('koridor');
        if (targetCorridor && C[targetCorridor]) {
          setTimeout(function () {
            focusCorridor(targetCorridor);
          }, 200);
        }
        if (params.get('nearby') === '1') {
          setTimeout(function () {
            if (window.BikopaUI && window.BikopaUI.openConsent) {
              window.BikopaUI.openConsent();
            }
          }, 300);
        }
      }
    } catch (e) {
      console.error('Inisialisasi peta gagal:', e);
    }
  }

  // Render Jalur Rute Polylines
  function renderRoutes() {
    if (!routeLayer || !window.L) return;
    routeLayer.clearLayers();

    var stopMap = {};
    ALL_STOPS.forEach(function (s) { stopMap[s.code] = s; });

    CODES.forEach(function (code) {
      if (!visible[code]) return;
      var corridor = C[code];
      var seq = SEQUENCES[code] || [];
      var coords = seq.map(function (sc) {
        var s = stopMap[sc];
        return s ? [s.lat, s.lng] : null;
      }).filter(Boolean);

      if (coords.length < 2) return;

      var casing = L.polyline(coords, {
        color: '#ffffff',
        weight: 8,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      });

      var line = L.polyline(coords, {
        color: corridor.color,
        weight: 5,
        opacity: 0.92,
        lineCap: 'round',
        lineJoin: 'round'
      });

      line.bindTooltip('<strong>Koridor ' + code + '</strong><br/>' + corridor.name, { sticky: true });

      routeLayer.addLayer(casing);
      routeLayer.addLayer(line);
    });
  }

  // Render 53 Halte dengan Ikon Halte Bus
  function renderStops() {
    if (!stopLayer || !window.L) return;
    stopLayer.clearLayers();

    ALL_STOPS.forEach(function (stop) {
      var isVisible = stop.c.some(function (cCode) { return visible[cCode]; });
      if (!isVisible) return;

      var isHub = stop.type === 'HUB';
      var primaryCorridor = stop.c[0];
      var color = (C[primaryCorridor] && C[primaryCorridor].color) || '#1b2d52';

      var stopIcon = L.divIcon({
        className: 'bikopa-halte-marker',
        html: '<div style="width:' + (isHub ? '28px' : '22px') + ';height:' + (isHub ? '28px' : '22px') + ';background:' + (isHub ? '#ff6b4a' : color) + ';border:2px solid #ffffff;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.35);color:#ffffff;cursor:pointer;" title="' + stop.name + '">' +
          '<svg viewBox="0 0 24 24" width="' + (isHub ? '16' : '12') + '" height="' + (isHub ? '16' : '12') + '" fill="currentColor" aria-hidden="true">' +
          '<path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>' +
          '</svg></div>',
        iconSize: [isHub ? 28 : 22, isHub ? 28 : 22],
        iconAnchor: [isHub ? 14 : 11, isHub ? 14 : 11]
      });

      var marker = L.marker([stop.lat, stop.lng], {
        icon: stopIcon,
        riseOnHover: true
      });

      var corridorBadges = stop.c.map(function (cCode) {
        var cHex = C[cCode] ? C[cCode].color : '#333';
        return '<span style="background:' + cHex + ';color:#fff;padding:1px 5px;border-radius:3px;font-size:10px;font-weight:bold;margin-right:3px;">' + cCode + '</span>';
      }).join('');

      marker.bindTooltip(
        '<div style="font-family:system-ui;padding:2px 0;">' +
        '<strong style="color:#1b2d52;">' + stop.name + '</strong> ' + (isHub ? '<span style="color:#ff6b4a;font-weight:bold;font-size:11px;">[HUB]</span>' : '') +
        '<div style="margin-top:3px;">' + corridorBadges + '</div>' +
        '<span style="font-size:11px;color:#666;">Klik untuk info halte &amp; kedatangan bus</span>' +
        '</div>',
        { direction: 'top', offset: [0, isHub ? -14 : -11] }
      );

      marker.on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        if (window.BikopaUI && window.BikopaUI.openSheet) {
          window.BikopaUI.openSheet(stop.code);
        }
      });

      stopLayer.addLayer(marker);
    });
  }

  // Render Armada Bus
  function renderBuses() {
    if (!busLayer || !window.L) return;
    busLayer.clearLayers();

    var stopMap = {};
    ALL_STOPS.forEach(function (s) { stopMap[s.code] = s; });

    BUSES.forEach(function (b) {
      if (!visible[b.c]) return;
      var c = C[b.c];
      var seq = SEQUENCES[b.c] || [];
      if (seq.length < 2) return;

      var idx = Math.min(Math.floor(b.p * (seq.length - 1)), seq.length - 2);
      var s1 = stopMap[seq[idx]];
      var s2 = stopMap[seq[idx + 1]];
      if (!s1 || !s2) return;

      var subP = (b.p * (seq.length - 1)) - idx;
      var lat = s1.lat + (s2.lat - s1.lat) * subP;
      var lng = s1.lng + (s2.lng - s1.lng) * subP;

      var isOffline = b.status === 'OFFLINE';
      var busIcon = L.divIcon({
        className: 'bikopa-bus-marker',
        html: '<div style="background:#ffffff;border:2.5px solid ' + c.color + ';border-radius:9999px;padding:3px 8px;font-size:11px;font-weight:800;color:#17233f;display:inline-flex;align-items:center;gap:5px;box-shadow:0 4px 10px rgba(0,0,0,0.25);cursor:pointer;opacity:' + (isOffline ? 0.5 : 1) + ';">' +
          '<span style="width:8px;height:8px;border-radius:9999px;background:' + (b.status === 'ACTIVE' ? '#22c55e' : (b.status === 'STALE' ? '#eab308' : '#94a3b8')) + ';"></span>' +
          '<span>' + b.c + '</span>' +
          '</div>',
        iconSize: [44, 24],
        iconAnchor: [22, 12]
      });

      var marker = L.marker([lat, lng], { icon: busIcon, riseOnHover: true });
      marker.bindTooltip('<strong>Bus ' + b.id + '</strong> (Koridor ' + b.c + ')<br/>Kecepatan: ' + b.speed + ' km/jam<br/>Status: ' + (b.status === 'ACTIVE' ? 'Aktif' : b.status), { direction: 'top', offset: [0, -10] });

      marker.on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        if (window.BikopaUI && window.BikopaUI.showBus) {
          window.BikopaUI.showBus(b);
        }
      });

      busLayer.addLayer(marker);
    });
  }

  // Perhitungan Estimasi Waktu Tiba (ETA)
  function etaTo(b, hc) {
    if (b.status === 'OFFLINE') return null;
    return Math.max(1, Math.round(5 + Math.random() * 15));
  }

  function corridorEta(code, hc) {
    var best = null;
    BUSES.forEach(function (b) {
      if (b.c !== code || b.status === 'OFFLINE') return;
      var e = etaTo(b, hc);
      if (e != null && (best == null || e < best)) best = e;
    });
    return best;
  }

  // Filter Koridor
  function setVisible(code, on) {
    visible[code] = on;
    renderRoutes();
    renderStops();
    renderBuses();

    var chip = document.querySelector('[data-f="' + code + '"]');
    if (chip) {
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      var sw = chip.querySelector('.sw');
      if (sw) sw.style.background = on ? C[code].color : '#cbd2de';
    }
    var tile = document.querySelector('[data-tile="' + code + '"]');
    if (tile) tile.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function focusCorridor(code) {
    CODES.forEach(function (k) { setVisible(k, k === code); });
    var allBtn = document.querySelector('[data-f="all"]');
    if (allBtn) {
      allBtn.setAttribute('aria-pressed', 'false');
      var sw = allBtn.querySelector('.sw');
      if (sw) sw.style.background = '#cbd2de';
    }
    var jangkauan = $('jangkauan');
    if (jangkauan) {
      jangkauan.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Set User Location & Pin
  function setUserLocation(lat, lng) {
    if (!map || !userPinLayer || !window.L) return;
    userPinLayer.clearLayers();
    var userIcon = L.divIcon({
      className: 'bikopa-user-marker',
      html: '<div style="width:20px;height:20px;background:#ff6b4a;border:3px solid #ffffff;border-radius:50%;box-shadow:0 0 12px rgba(255,107,74,0.9);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    var marker = L.marker([lat, lng], { icon: userIcon });
    marker.bindTooltip('<strong>Lokasi Anda</strong>', { permanent: true, direction: 'top', offset: [0, -10] });
    userPinLayer.addLayer(marker);
    map.flyTo([lat, lng], 15, { duration: 1 });
  }

  // Layar Penuh
  function setFull(on) {
    var card = $('mapcard');
    if (!card) return;
    card.classList.toggle('mapfull', on);
    document.body.style.overflow = on ? 'hidden' : '';
    var mf = $('map-full');
    if (mf) mf.textContent = on ? 'Tutup Peta' : 'Layar penuh';
    var bf = $('btn-full');
    if (bf) bf.textContent = on ? 'Tutup Peta Penuh' : 'Buka Peta Penuh';
    if (map) {
      var currentCenter = map.getCenter();
      var currentZoom = map.getZoom();
      map.invalidateSize({ pan: false });
      setTimeout(function () {
        if (map) {
          map.invalidateSize({ pan: false });
          map.setView(currentCenter, currentZoom, { animate: false });
        }
      }, 80);
      setTimeout(function () {
        if (map) map.invalidateSize({ pan: false });
      }, 250);
    }
  }

  function toggleFull() {
    var card = $('mapcard');
    if (card) {
      setFull(!card.classList.contains('mapfull'));
    }
  }

  // Ekspor ke window.BikopaMap
  window.BikopaMap = {
    init: initMap,
    etaTo: etaTo,
    corridorEta: corridorEta,
    setVisible: setVisible,
    focusCorridor: focusCorridor,
    setUserLocation: setUserLocation,
    setFull: setFull,
    toggleFull: toggleFull,
    visible: visible
  };

})(window);
