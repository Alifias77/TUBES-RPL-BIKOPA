/**
 * BIKOPA Trans Palu - UI Interactions & Controller
 * File: js/ui.js
 */

(function (window) {
  'use strict';

  var Data = window.BikopaData;
  var MapEngine = window.BikopaMap;

  var C = Data.C;
  var CODES = Data.CODES;
  var H = Data.H;
  var HC = Data.HC;
  var BUSES = Data.BUSES;
  var STATUS_LABEL = Data.STATUS_LABEL;
  var TABS = Data.TABS;
  var ICON = Data.ICON;
  var badge = Data.badge;
  var fmtDist = Data.fmtDist;

  function $(id) {
    return document.getElementById(id);
  }

  function assetPath(p) {
    var inPages = (typeof window !== 'undefined' && window.location && (window.location.pathname.indexOf('/pages/') !== -1 || window.location.pathname.indexOf('\\pages\\') !== -1 || window.location.href.indexOf('/pages/') !== -1));
    return (inPages ? '../' : '') + p;
  }

  /* ==========================================
     1. StopSheet (Modal Detail Halte & ETA)
     ========================================== */
  var sheetHub = null;
  var lastFocus = null;

  function getStop(hc) {
    if (Data.ALL_STOPS) {
      for (var i = 0; i < Data.ALL_STOPS.length; i++) {
        if (Data.ALL_STOPS[i].code === hc) return Data.ALL_STOPS[i];
      }
    }
    return H[hc] || { code: hc, name: 'Halte ' + hc, c: ['01'], type: 'BUS_STOP' };
  }

  function sheetHTML(hc) {
    var h = getStop(hc);
    return (h.c || ['01']).map(function (code) {
      var e = MapEngine.corridorEta(code, hc);
      var right = e != null
        ? '<span class="tabular-nums font-bold text-navy">' + e + ' mnt</span><span class="ml-1 text-xs text-ink/55">Perkiraan</span>'
        : '<span class="text-xs text-ink/60">Berdasarkan jadwal · tiap 15 mnt <span class="font-bold">(perlu konfirmasi)</span></span>';
      return '<div class="flex items-center justify-between gap-3 rounded-xl bg-mist px-4 py-3"><div class="flex min-w-0 items-center gap-3">' +
        badge(code) +
        '<span class="min-w-0 truncate text-sm font-medium text-ink">' + (C[code] ? C[code].name : 'Koridor ' + code) + '</span></div><div class="shrink-0 text-right text-sm">' +
        right + '</div></div>';
    }).join('');
  }

  function openSheet(hc) {
    sheetHub = hc;
    lastFocus = document.activeElement;
    var h = getStop(hc);
    var isHub = h.type === 'HUB';
    var sk = $('sheet-kicker'), st = $('sheet-title'), sb = $('sheet-body'), sbg = $('sheet-bg'), sh = $('sheet'), sx = $('sheet-x');
    if (sk) sk.textContent = hc + ' · ' + (isHub ? 'HUB' : 'HALTE') + ' · ' + (h.c ? h.c.length : 1) + ' koridor';
    if (st) st.textContent = h.name;
    if (sb) sb.innerHTML = sheetHTML(hc) + '<p class="pt-2 text-xs text-ink/55">Bus berikutnya per koridor. Sesuai master data resmi Dinas Perhubungan.</p>';
    if (sbg) sbg.hidden = false;
    if (sh) {
      sh.classList.add('open');
      sh.setAttribute('aria-hidden', 'false');
    }
    if (sx) sx.focus();
  }

  function closeSheet() {
    sheetHub = null;
    var sbg = $('sheet-bg'), sh = $('sheet');
    if (sbg) sbg.hidden = true;
    if (sh) {
      sh.classList.remove('open');
      sh.setAttribute('aria-hidden', 'true');
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function openCorridorDetail(code) {
    var corridor = C[code];
    if (!corridor) return;
    lastFocus = document.activeElement;
    var stops = (window.BikopaData && window.BikopaData.CORRIDOR_STOPS && window.BikopaData.CORRIDOR_STOPS[code]) || [];
    
    var sk = $('sheet-kicker'), st = $('sheet-title'), sb = $('sheet-body'), sbg = $('sheet-bg'), sh = $('sheet'), sx = $('sheet-x');
    if (sk) sk.textContent = 'KORIDOR ' + code + ' · DETAIL RUTE & JADWAL OPERASIONAL';
    if (st) st.textContent = 'Koridor ' + code + ': ' + corridor.name;
    
    var stopsListHtml = stops.map(function (stopName, idx) {
      var isHub = stopName.indexOf('(Hub') !== -1;
      var isFirst = idx === 0;
      var isLast = idx === stops.length - 1;
      var badgeBg = (isFirst || isLast) ? 'bg-[#ff6b4a] text-white font-bold' : (isHub ? 'bg-[#ffc233] text-[#121e3a] font-bold' : 'bg-slate-100 text-slate-700 font-medium');
      return '<li class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors">' +
        '<span class="w-6 h-6 rounded-full ' + badgeBg + ' text-xs flex items-center justify-center shrink-0 font-bold shadow-sm">' + (idx + 1) + '</span>' +
        '<div class="min-w-0 flex-1">' +
          '<p class="text-xs font-bold text-navy truncate">' + stopName + '</p>' +
          (isHub ? '<span class="text-[10px] text-[#ff6b4a] font-bold">★ Titik Transfer Hub</span>' : '<span class="text-[10px] text-slate-500">Halte Reguler</span>') +
        '</div>' +
      '</li>';
    }).join('');

    if (sb) {
      sb.innerHTML = 
        '<div class="mb-4 p-3.5 rounded-2xl bg-[#121e3a] text-white shadow-md flex items-center justify-between">' +
          '<div>' +
            '<p class="text-xs font-bold text-[#ffc233] uppercase tracking-wider">Jadwal Operasional Setiap Hari</p>' +
            '<p class="text-sm font-extrabold text-white mt-0.5">06:00 – 21:00 WITA</p>' +
            '<p class="text-[11px] text-white/75 mt-0.5">Interval kedatangan (headway): setiap 15 menit</p>' +
          '</div>' +
          '<span class="px-3 py-1.5 rounded-xl bg-[#ff6b4a] text-white font-black text-xs shadow">' + stops.length + ' Halte</span>' +
        '</div>' +
        '<div class="text-[11px] font-bold text-navy/70 mb-2 uppercase tracking-wider flex items-center justify-between">' +
          '<span>Daftar Urutan Pemberhentian (PP):</span>' +
          '<span class="text-xs text-slate-500 font-normal">Geser untuk melihat semua</span>' +
        '</div>' +
        '<div class="max-h-[260px] overflow-y-auto space-y-1.5 pr-1 custom-route-scrollbar">' +
          '<ul class="space-y-1.5">' + stopsListHtml + '</ul>' +
        '</div>' +
        '<div class="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between flex-wrap gap-2">' +
          '<p class="text-xs text-ink/70 font-medium">Jalur: ' + corridor.via + '</p>' +
          '<button type="button" onclick="window.BikopaUI.closeSheet(); if (document.getElementById(\'map\') && window.BikopaMap) { window.BikopaMap.focusCorridor(\'' + code + '\'); } else { window.location.href = \'peta.html?koridor=\' + encodeURIComponent(\'' + code + '\'); }" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ff6b4a] text-white text-xs font-bold hover:bg-[#e63946] shadow-sm focus-ring transition-colors">' +
            'Tampilkan di Peta &rarr;' +
          '</button>' +
        '</div>';
    }
      
    if (sbg) sbg.hidden = false;
    if (sh) {
      sh.classList.add('open');
      sh.setAttribute('aria-hidden', 'false');
    }
    if (sx) sx.focus();
  }

  /* ==========================================
     2. Panel Info (Detail Bus & Halte Terdekat)
     ========================================== */
  var panel = null;
  var selBus = null;

  function panelHint() {
    selBus = null;
    if (panel) {
      panel.innerHTML = '<p class="text-ink/70">Ketuk halte atau bus di peta. Klik titik kosong untuk melihat 3 halte terdekat dari titik itu.</p>';
    }
  }

  function busHTML(b) {
    var seen = b.status === 'ACTIVE' ? '3 detik lalu' : b.status === 'STALE' ? '45 detik lalu' : 'lebih dari 2 menit lalu';
    var etas = C[b.c].hubs.map(function (hc) {
      var e = MapEngine ? MapEngine.etaTo(b, hc) : null;
      return '<li class="flex items-center justify-between gap-3 py-1"><span class="min-w-0 truncate">' + H[hc].name + '</span><span class="shrink-0 tabular-nums font-bold text-navy">' +
        (e != null ? e + ' mnt <span class="text-xs font-normal text-ink/55">Perkiraan</span>' : '<span class="font-normal text-ink/50">Tidak tersedia</span>') +
        '</span></li>';
    }).join('');

    return '<div class="flex flex-wrap items-center gap-2">' + badge(b.c) + '<strong class="text-navy">Bus ' + b.id + '</strong><span class="inline-flex items-center gap-2 text-xs text-ink/70"><span class="sdot st-' + b.status + '"></span>' + STATUS_LABEL[b.status] + '</span></div>' +
      '<p class="mt-1 text-xs text-ink/60">Kapasitas 35 (21 duduk + 14 berdiri) · Terlihat ' + seen + ' · ' + (b.status === 'ACTIVE' ? Math.round(b.speed) + ' km/jam' : 'tidak bergerak') + '</p>' +
      '<ul class="mt-2 divide-y divide-ink/10 text-sm">' + etas + '</ul>' +
      (b.status === 'OFFLINE' ? '<p class="mt-2 text-xs text-ink/60">Bus offline. ETA kosong, gunakan jadwal statis.</p>' : '') +
      '<p class="mt-2 text-xs text-ink/50">Nomor lambung dan posisi adalah data contoh.</p>';
  }

  function showBus(b) {
    selBus = b;
    if (panel) {
      panel.innerHTML = busHTML(b);
    }
  }

  function haversineDist(lat1, lon1, lat2, lon2) {
    var R = 6371e3;
    var phi1 = lat1 * Math.PI / 180;
    var phi2 = lat2 * Math.PI / 180;
    var deltaPhi = (lat2 - lat1) * Math.PI / 180;
    var deltaLambda = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function showNearby(x, y) {
    selBus = null;
    if (!panel) return;
    var stops = (Data.ALL_STOPS && Data.ALL_STOPS.length) ? Data.ALL_STOPS : HC.map(function (hc) {
      return { code: hc, name: H[hc].name, c: H[hc].c, lat: H[hc].lat || 0, lng: H[hc].lng || 0 };
    });

    var arr = stops.map(function (s) {
      var d = (s.lat && s.lng) ? haversineDist(x, y, s.lat, s.lng) : Math.hypot((H[s.code] ? H[s.code].x : 0) - x, (H[s.code] ? H[s.code].y : 0) - y) * 25;
      return { stop: s, d: d };
    }).sort(function (a, b) {
      return a.d - b.d;
    });

    if (!arr.length || arr[0].d > 5000) {
      panel.innerHTML = '<p class="font-bold text-navy">Anda berada di luar area layanan.</p><p class="mt-1 text-ink/70">Halte terdekat berjarak lebih dari 5 km.</p>';
      return;
    }

    panel.innerHTML = '<p class="font-bold text-navy">3 halte terdekat</p><ul class="mt-2 space-y-2">' + arr.slice(0, 3).map(function (r) {
      return '<li><button type="button" data-near="' + r.stop.code + '" class="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl bg-white px-4 py-2 text-left ring-1 ring-ink/10 hover:ring-coral focus-ring"><span class="min-w-0"><span class="block truncate font-medium text-ink">' + r.stop.name + '</span><span class="mt-0.5 flex flex-wrap gap-1">' + r.stop.c.map(badge).join('') + '</span></span><span class="shrink-0 tabular-nums font-bold text-navy">' + fmtDist(r.d) + '</span></button></li>';
    }).join('') + '</ul>';

    Array.prototype.forEach.call(panel.querySelectorAll('[data-near]'), function (b) {
      b.addEventListener('click', function () {
        openSheet(b.getAttribute('data-near'));
      });
    });
  }

  /* ==========================================
     3. Filter Koridor di Peta
     ========================================== */
  function initFilters() {
    var filters = $('filters');
    if (!filters) return;
    filters.innerHTML = '';

    function updateFilterChips() {
      var allActive = CODES.every(function (k) { return MapEngine.visible[k]; });
      var allBtn = filters.querySelector('[data-f="all"]');
      if (allBtn) {
        allBtn.setAttribute('aria-pressed', allActive ? 'true' : 'false');
        var sw = allBtn.querySelector('.sw');
        if (sw) sw.style.background = allActive ? '#ff6b4a' : '#cbd2de';
      }
      CODES.forEach(function (k) {
        var chip = filters.querySelector('[data-f="' + k + '"]');
        if (chip) {
          chip.setAttribute('aria-pressed', MapEngine.visible[k] ? 'true' : 'false');
          var swk = chip.querySelector('.sw');
          if (swk) swk.style.background = MapEngine.visible[k] ? C[k].color : '#cbd2de';
        }
      });
    }

    // Tombol "Semua"
    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.className = 'chip focus-ring';
    allBtn.setAttribute('aria-pressed', 'true');
    allBtn.setAttribute('data-f', 'all');
    allBtn.innerHTML = '<span class="sw" style="background:#ff6b4a"></span>Semua';
    allBtn.addEventListener('click', function () {
      CODES.forEach(function (k) { MapEngine.setVisible(k, true); });
      updateFilterChips();
    });
    filters.appendChild(allBtn);

    CODES.forEach(function (code) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip focus-ring';
      b.setAttribute('aria-pressed', 'true');
      b.setAttribute('data-f', code);
      b.innerHTML = '<span class="sw" style="background:' + C[code].color + '"></span>Koridor ' + code;
      b.addEventListener('click', function () {
        var isOnlyThisActive = MapEngine.visible[code] && CODES.every(function (k) {
          return k === code ? MapEngine.visible[k] : !MapEngine.visible[k];
        });

        if (isOnlyThisActive) {
          // Jika di-klik lagi saat menjadi satu-satunya aktif, tampilkan semua
          CODES.forEach(function (k) { MapEngine.setVisible(k, true); });
        } else {
          // Otomatis koridor lain mati dan hanya menampilkan koridor yang di-klik
          CODES.forEach(function (k) { MapEngine.setVisible(k, k === code); });
        }
        updateFilterChips();
      });
      filters.appendChild(b);
    });
  }

  /* ==========================================
     4. Corridor Grid (Kartu Armada & Pintasan)
     ========================================== */
  function initCorridorGrid() {
    var grid = $('grid');
    if (!grid) return;
    grid.innerHTML = '';
    var tileBase = 'lift relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-b from-[#2d4a7c] to-[#18284a] text-white ring-1 ring-white/10 focus-ring group';

    function tileHTML(inner, cap) {
      return '<div class="absolute inset-x-2 top-8 bottom-12 flex items-center justify-center overflow-hidden pointer-events-none">' +
        '<img src="' + assetPath('public/images/BUS.png') + '" alt="Bus Trans Palu" class="w-full h-auto max-h-[80%] object-contain drop-shadow-[0_8px_18px_rgba(0,0,0,0.6)] group-hover:scale-110 transition-transform duration-300">' +
        '</div>' + inner +
        '<span class="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pb-2 pt-8 text-left text-xs font-bold">' + cap + '</span>';
    }

    CODES.forEach(function (code) {
      var c = C[code];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = tileBase;
      b.setAttribute('data-tile', code);
      b.setAttribute('aria-pressed', 'true');
      b.setAttribute('aria-label', 'Koridor ' + code + ', ' + c.name + ', tampilkan di peta');
      b.innerHTML = tileHTML(
        '<span class="kb absolute left-2 top-2 z-10" style="background:' + c.color + ';color:' + (Data.isLight(c.color) ? '#17233f' : '#fff') + ';font-size:13px">' + code + '</span>',
        c.name + '<span class="block font-normal text-white/70">' + c.stops + ' halte · <span data-tilecount="' + code + '">0</span> bus aktif</span>'
      );
      b.addEventListener('click', function () {
        if ($('map') && window.BikopaMap) {
          window.BikopaMap.focusCorridor(code);
        } else {
          openCorridorDetail(code);
        }
      });
      grid.appendChild(b);
    });

    [
      {
        id: 'near',
        cap: 'Halte terdekat<span class="block font-normal text-white/70">Dari lokasi Anda</span>',
        fn: function () { openConsent(); }
      },
      {
        id: 'live',
        cap: 'Bus aktif<span class="block font-normal text-white/70"><span id="tile-live">0</span> bus di peta</span>',
        fn: function () {
          if ($('jangkauan')) {
            if (window.BikopaMap) CODES.forEach(function (k) { window.BikopaMap.setVisible(k, true); });
            $('jangkauan').scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = 'peta.html';
          }
        }
      },
      {
        id: 'hub',
        cap: 'Hub &amp; transfer<span class="block font-normal text-white/70">6 titik pertemuan</span>',
        fn: function () {
          if ($('rute')) {
            $('rute').scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = 'hub.html';
          }
        }
      }
    ].forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = tileBase;
      b.innerHTML = tileHTML('', t.cap);
      b.addEventListener('click', t.fn);
      grid.appendChild(b);
    });
  }

  /* ==========================================
     5. InfoTabs (Jadwal, Halte, Bantuan)
     ========================================== */
  function initInfoTabs() {
    var tabPanel = $('panel-tab');
    var tabBtns = document.querySelectorAll('.tab');
    if (!tabPanel || !tabBtns.length) return;

    function renderTab(i) {
      var t = TABS[i];
      if (!t) return;
      tabPanel.className = 'mt-6 flex flex-wrap justify-center gap-6';

      if (i === 0) {
        // Tab 0: Jadwal (5 Cards, 3+2 Centered Layout, Halte Image & Operating Hours)
        tabPanel.innerHTML = t.cards.map(function (d) {
          if (!d.code) return '';
          var corridor = C[d.code];
          var stops = (window.BikopaData && window.BikopaData.CORRIDOR_STOPS && window.BikopaData.CORRIDOR_STOPS[d.code]) || [];

          return '<div class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm jadwal-uiverse-card" title="Koridor ' + d.code + ' - ' + corridor.name + '">' +
            '<div class="jadwal-uiverse-content">' +
              '<!-- Top Header -->' +
              '<div>' +
                '<div class="flex items-center gap-2.5">' +
                  '<span class="card-badge inline-flex items-center justify-center font-black text-sm px-2.5 py-0.5 rounded-lg min-w-[34px] shadow-sm">' + d.code + '</span>' +
                  '<h3 class="card-title text-xl font-bold tracking-tight">Koridor ' + d.code + '</h3>' +
                '</div>' +
                '<p class="card-subtitle mt-2 text-sm font-medium">' + corridor.name + '</p>' +
                '<div class="mt-4 space-y-1.5">' +
                  '<p class="card-schedule text-sm leading-snug">06:00–21:00 · tiap 15 menit · setiap hari.</p>' +
                  '<p class="card-via text-sm leading-relaxed">' + corridor.via + '.</p>' +
                '</div>' +
              '</div>' +

              '<!-- Middle: Halte bus stop image in empty space -->' +
              '<div class="my-auto py-2 flex items-center justify-center">' +
                '<img src="' + assetPath('IMAGE/HALTE_card.png') + '" onerror="this.src=\'' + assetPath('public/images/HALTE_card.png') + '\'" alt="Halte Trans Palu" class="card-halte-img h-36 sm:h-40 w-auto max-w-[95%] object-contain pointer-events-none" />' +
              '</div>' +

              '<!-- Bottom Footer -->' +
              '<div class="card-divider mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 text-xs">' +
                '<span class="card-stops inline-flex items-center gap-1.5 font-medium">' +
                  '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>' +
                  stops.length + ' Halte Terdaftar' +
                '</span>' +
                '<button type="button" onclick="window.BikopaUI.openCorridorDetail(\'' + d.code + '\')" class="card-cta inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-full text-xs">' +
                  'Detail Rute Koridor &rarr;' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
      } else if (i === 1) {
        // Tab 1: Halte (5 Corridor Cards with Halte Image without hours + 1 Hub Transfer Card without halte image)
        tabPanel.innerHTML = t.cards.map(function (d) {
          if (d.code) {
            var corridor = C[d.code];
            var stops = (window.BikopaData && window.BikopaData.CORRIDOR_STOPS && window.BikopaData.CORRIDOR_STOPS[d.code]) || [];

            return '<div class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm jadwal-uiverse-card" title="Koridor ' + d.code + ' - ' + corridor.name + '">' +
              '<div class="jadwal-uiverse-content">' +
                '<!-- Top Header - TIDAK MEMUAT JAM SESUAI REQUEST -->' +
                '<div>' +
                  '<div class="flex items-center gap-2.5">' +
                    '<span class="card-badge inline-flex items-center justify-center font-black text-sm px-2.5 py-0.5 rounded-lg min-w-[34px] shadow-sm">' + d.code + '</span>' +
                    '<h3 class="card-title text-xl font-bold tracking-tight">Koridor ' + d.code + '</h3>' +
                  '</div>' +
                  '<p class="card-subtitle mt-2 text-sm font-medium">' + corridor.name + '</p>' +
                  '<div class="mt-4 space-y-1.5">' +
                    '<p class="card-via text-sm leading-relaxed">Lintasan: ' + corridor.via + '.</p>' +
                    '<p class="card-schedule text-sm leading-snug">' + stops.length + ' titik halte terintegrasi sepanjang lintasan.</p>' +
                  '</div>' +
                '</div>' +

                '<!-- Middle: Halte bus stop image -->' +
                '<div class="my-auto py-2 flex items-center justify-center">' +
                  '<img src="' + assetPath('IMAGE/HALTE_card.png') + '" onerror="this.src=\'' + assetPath('public/images/HALTE_card.png') + '\'" alt="Halte Trans Palu" class="card-halte-img h-36 sm:h-40 w-auto max-w-[95%] object-contain pointer-events-none" />' +
                '</div>' +

                '<!-- Bottom Footer -->' +
                '<div class="card-divider mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 text-xs">' +
                  '<span class="card-stops inline-flex items-center gap-1.5 font-medium">' +
                    '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>' +
                    stops.length + ' Halte Terdaftar' +
                  '</span>' +
                  '<button type="button" onclick="window.BikopaUI.openCorridorDetail(\'' + d.code + '\')" class="card-cta inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-full text-xs">' +
                    'Detail Rute Koridor &rarr;' +
                  '</button>' +
                '</div>' +
              '</div>' +
            '</div>';
          }

          // Card Hub Transfer - TIDAK MEMUAT GAMBAR HALTE SESUAI REQUEST
          return '<div class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm jadwal-uiverse-card" title="Hub & Titik Transfer">' +
            '<div class="jadwal-uiverse-content">' +
              '<div>' +
                '<div class="flex items-center gap-2.5">' +
                  '<span class="card-badge inline-flex items-center justify-center font-black text-sm px-2.5 py-0.5 rounded-lg min-w-[34px] shadow-sm">HUB</span>' +
                  '<h3 class="card-title text-xl font-bold tracking-tight">Hub Transfer</h3>' +
                '</div>' +
                '<p class="card-subtitle mt-2 text-sm font-medium">Titik Pertemuan Antar-Koridor</p>' +
                '<div class="mt-4 space-y-1.5">' +
                  '<p class="card-schedule text-sm leading-snug">Titik transit resmi Trans Palu untuk perpindahan antar-koridor tanpa repot.</p>' +
                '</div>' +
              '</div>' +

              '<!-- Middle: 6 Titik Hub (TANPA GAMBAR HALTE) -->' +
              '<div class="my-auto py-3">' +
                '<div class="flex flex-wrap justify-center gap-2">' +
                  '<span class="card-hub-tag px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/10 transition-all">Taman GOR</span>' +
                  '<span class="card-hub-tag px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/10 transition-all">Balai Kota</span>' +
                  '<span class="card-hub-tag px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/10 transition-all">Bandara MSA</span>' +
                  '<span class="card-hub-tag px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/10 transition-all">Pantoloan</span>' +
                  '<span class="card-hub-tag px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/10 transition-all">Pasar Manonda</span>' +
                  '<span class="card-hub-tag px-2.5 py-1 rounded-lg text-xs font-bold bg-white/10 text-white border border-white/10 transition-all">Terminal Tipo</span>' +
                '</div>' +
              '</div>' +

              '<!-- Bottom Footer -->' +
              '<div class="card-divider mt-auto pt-4 flex flex-wrap items-center justify-between gap-2 text-xs">' +
                '<span class="card-stops inline-flex items-center gap-1.5 font-medium">' +
                  '<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="13" rx="3"/><path d="M4 11h16M7 20v-3M17 20v-3"/></svg>' +
                  '6 Titik Hub Aktif' +
                '</span>' +
                '<button type="button" onclick="$(\'rute\').scrollIntoView({behavior:\'smooth\'})" class="card-cta inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-full text-xs">' +
                  'Lihat Hub & Peta &darr;' +
                '</button>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
      } else {
        // Tab 2: Bantuan (6 Cards, Uiverse Design, HANYA KATA-KATA TANPA GAMBAR HALTE)
        tabPanel.innerHTML = t.cards.map(function (d) {
          return '<div class="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm jadwal-uiverse-card card-compact group" role="article">' +
            '<div class="jadwal-uiverse-content">' +
              '<div>' +
                '<span class="card-icon-box grid h-12 w-12 place-items-center rounded-xl text-coral">' +
                  '<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[d.icon] + '</svg>' +
                '</span>' +
                '<h3 class="card-title text-xl font-bold tracking-tight mt-4">' + d.title + '</h3>' +
                '<p class="card-via text-sm leading-relaxed mt-2.5">' + d.desc + '</p>' +
              '</div>' +
              '<div class="card-divider mt-auto pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">' +
                '<span class="card-stops font-medium text-white/60">Pusat Bantuan</span>' +
                '<span class="text-coral font-bold">Trans Palu</span>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      Array.prototype.forEach.call(tabPanel.querySelectorAll('[data-seq]'), function (b) {
        b.addEventListener('click', function () {
          var p = tabPanel.querySelector('[data-desc="' + b.getAttribute('data-seq') + '"]');
          p.textContent = 'Rute sedang dilengkapi. Urutan halte menunggu data Dishub.';
          b.remove();
        });
      });

      var tn = $('tab-note');
      if (tn) tn.textContent = t.note || '';
      Array.prototype.forEach.call(tabBtns, function (tb, k) {
        tb.setAttribute('aria-selected', k === i ? 'true' : 'false');
      });
      tabPanel.setAttribute('aria-labelledby', 'tab-' + i);
    }

    Array.prototype.forEach.call(tabBtns, function (tb, k) {
      tb.addEventListener('click', function () { renderTab(k); });
    });

    renderTab(0);
  }

  /* ==========================================
     6. Quick Search Rute Langsung / Transfer
     ========================================== */
  function initSearch() {
    var dl = $('daftar-halte');
    if (dl) {
      HC.forEach(function (hc) {
        var o = document.createElement('option');
        o.value = H[hc].name;
        dl.appendChild(o);
      });
    }

    var hariEl = $('hari');
    if (hariEl) {
      var wd = new Date().toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Makassar' });
      hariEl.value = (wd === 'Sat' || wd === 'Sun') ? 'WEEKEND' : 'WEEKDAY';
    }

    function findHub(q) {
      q = q.trim().toLowerCase();
      if (!q) return null;
      for (var i = 0; i < HC.length; i++) {
        if (H[HC[i]].name.toLowerCase() === q) return HC[i];
      }
      for (var j = 0; j < HC.length; j++) {
        var n = H[HC[j]].name.toLowerCase();
        if (n.indexOf(q) > -1 || H[HC[j]].short.toLowerCase().indexOf(q) > -1) return HC[j];
      }
      return null;
    }

    function common(a, b) {
      return a.filter(function (x) { return b.indexOf(x) > -1; });
    }

    var cariForm = $('cari');
    if (cariForm) {
      cariForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var a = findHub($('asal').value);
        var b = findHub($('tujuan').value);
        var out = $('hasil');

        if (!a || !b) {
          if (out) {
            out.innerHTML = 'Halte tidak ditemukan. Contoh ini hanya memuat 6 hub: ' +
              HC.map(function (k) { return H[k].short; }).join(', ') + '.';
          }
          return;
        }
        if (a === b) {
          if (out) out.textContent = 'Halte asal dan tujuan sama. Pilih halte yang berbeda.';
          return;
        }

        var day = (hariEl && hariEl.value === 'WEEKEND') ? 'Akhir pekan' : 'Hari kerja';
        var direct = common(H[a].c, H[b].c);
        var msg;

        if (direct.length) {
          msg = '<strong>Rute langsung:</strong> ' + direct.map(badge).join(' ');
        } else {
          var via = null;
          HC.forEach(function (hc) {
            if (via || hc === a || hc === b) return;
            var c1 = common(H[a].c, H[hc].c);
            var c2 = common(H[hc].c, H[b].c);
            if (c1.length && c2.length) via = { hc: hc, c1: c1[0], c2: c2[0] };
          });
          msg = via
            ? '<strong>1 kali transfer di ' + H[via.hc].name + ':</strong> ' + badge(via.c1) + ' lalu ' + badge(via.c2)
            : 'Tidak ada rute langsung atau 1 kali transfer pada data contoh ini.';
        }
        if (out) {
          out.innerHTML = msg + '<br><span class="text-white/65">' + day + ': 06:00–21:00, tiap 15 menit (nilai awal).</span>';
        }
      });
    }
  }

  /* ==========================================
     7. Lokasi Pengguna (Geolocation Consent)
     ========================================== */
  function openConsent() {
    var consent = $('consent');
    if (consent) {
      consent.hidden = false;
      var ok = $('consent-ok');
      if (ok) ok.focus();
    }
  }

  function initLocation() {
    var btnLoc = $('btn-loc');
    if (btnLoc) {
      btnLoc.addEventListener('click', openConsent);
    }
    var consentNo = $('consent-no');
    if (consentNo) {
      consentNo.addEventListener('click', function () {
        var consent = $('consent');
        if (consent) consent.hidden = true;
      });
    }
    var consentOk = $('consent-ok');
    if (consentOk) {
      consentOk.addEventListener('click', function () {
        var consent = $('consent');
        if (consent) consent.hidden = true;
        var jangkauan = $('jangkauan');
        if (jangkauan) {
          jangkauan.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (!$('map')) {
          window.location.href = 'peta.html?nearby=1';
          return;
        }

        if (panel) {
          panel.innerHTML = '<div class="flex items-center gap-2 text-navy font-semibold"><span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-coral border-t-transparent"></span> Menentukan lokasi Anda & mencari halte terdekat...</div>';
        }

        var denied = function () {
          selBus = null;
          if (panel) {
            panel.innerHTML = '<p class="font-bold text-navy">Lokasi tidak dapat dibaca.</p><p class="mt-1 text-ink/70">Klik titik mana saja di peta secara manual untuk melihat halte terdekat.</p>';
          }
        };

        if (!navigator.geolocation) {
          denied();
          return;
        }

        navigator.geolocation.getCurrentPosition(function (pos) {
          selBus = null;
          if (window.BikopaMap && window.BikopaMap.setUserLocation) {
            window.BikopaMap.setUserLocation(pos.coords.latitude, pos.coords.longitude);
          }
          if (panel) {
            showNearby(pos.coords.latitude, pos.coords.longitude);
          }
        }, denied, { timeout: 4000, maximumAge: 300000 });
      });
    }
  }

  /* ==========================================
     8. Navigasi Mobile & Shortcut Keyboard
     ========================================== */
  function initNavigation() {
    var menuBtn = $('menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        var menu = $('menu');
        if (!menu) return;
        var open = menu.hidden;
        menu.hidden = !open;
        this.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var menu = $('menu');
    if (menu) {
      Array.prototype.forEach.call(menu.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () {
          menu.hidden = true;
          if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    var stripX = $('strip-x');
    if (stripX) {
      stripX.addEventListener('click', function () {
        var strip = $('strip');
        if (strip) strip.hidden = true;
      });
    }

    var sx = $('sheet-x');
    if (sx) sx.addEventListener('click', closeSheet);
    var sbg = $('sheet-bg');
    if (sbg) sbg.addEventListener('click', closeSheet);

    var mapFullBtn = $('map-full');
    if (mapFullBtn) {
      mapFullBtn.addEventListener('click', function () {
        if (window.BikopaMap && window.BikopaMap.toggleFull) {
          window.BikopaMap.toggleFull();
        }
      });
    }

    var btnFull = $('btn-full');
    if (btnFull) {
      btnFull.addEventListener('click', function () {
        if (window.BikopaMap && window.BikopaMap.toggleFull) {
          window.BikopaMap.toggleFull();
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var consent = $('consent');
        if (consent && !consent.hidden) consent.hidden = true;
        else if (sheetHub) closeSheet();
        else if ($('mapcard') && $('mapcard').classList.contains('mapfull') && window.BikopaMap && window.BikopaMap.setFull) window.BikopaMap.setFull(false);
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-hubopen]'), function (b) {
      b.addEventListener('click', function () { openSheet(b.getAttribute('data-hubopen')); });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-hubbadges]'), function (d) {
      var hc = d.getAttribute('data-hubbadges');
      if (H[hc] && H[hc].c) {
        d.innerHTML = H[hc].c.map(badge).join('');
      }
    });
  }

  /* ==========================================
     9. Penyegaran Data Berkala (Status & ETAs)
     ========================================== */
  function refresh() {
    var active = BUSES.filter(function (b) { return b.status === 'ACTIVE'; }).length;
    var any = BUSES.length > 0;

    var pillDot = $('pill-dot');
    if (pillDot) pillDot.className = 'sdot ' + (active ? 'st-ACTIVE' : 'st-OFFLINE');
    var pillText = $('pill-text');
    if (pillText) pillText.textContent = any ? (active + ' bus aktif · Beroperasi 06:00–21:00') : 'Jadwal tersedia';
    var bannerLive = $('banner-live');
    if (bannerLive) bannerLive.textContent = 'Saat ini ' + active + ' bus aktif di peta contoh.';
    var liveBadge = $('live-badge-count');
    if (liveBadge) liveBadge.textContent = active + ' Bus Aktif';

    var tl = $('tile-live');
    if (tl) tl.textContent = active;

    CODES.forEach(function (code) {
      var n = BUSES.filter(function (b) { return b.c === code && b.status === 'ACTIVE'; }).length;
      var s = document.querySelector('[data-tilecount="' + code + '"]');
      if (s) s.textContent = n;
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-hubeta]'), function (p) {
      var hc = p.getAttribute('data-hubeta'), best = null;
      if (H[hc] && H[hc].c) {
        H[hc].c.forEach(function (code) {
          var e = window.BikopaMap && window.BikopaMap.corridorEta ? window.BikopaMap.corridorEta(code, hc) : null;
          if (e != null && (best == null || e < best)) {
            best = e;
          }
        });
      }
      p.textContent = (best != null ? best : 15) + ' mnt';
    });

    var sb = $('sheet-body');
    if (sheetHub && sb && sb.firstChild) {
      sb.innerHTML = sheetHTML(sheetHub) + '<p class="pt-2 text-xs text-ink/55">Bus berikutnya per koridor. Sesuai data rute.</p>';
    }

    if (selBus && panel) panel.innerHTML = busHTML(selBus);
  }

  // Inisialisasi Seluruh UI saat DOM Siap
  function initAll() {
    panel = $('panel');
    initFilters();
    initCorridorGrid();
    initInfoTabs();
    initSearch();
    initLocation();
    initNavigation();
    initBannerSlider();
    initHeroBusAnimation();
    panelHint();
    refresh();
    setInterval(refresh, 2000);
  }

  /* ==========================================
     10. Banner Slider (Pelacakan vs Spesifikasi)
     ========================================== */
  function initBannerSlider() {
    var s0 = $('slide-0'), s1 = $('slide-1');
    var b0 = $('btn-slide-0'), b1 = $('btn-slide-1');
    var d0 = $('dot-slide-0'), d1 = $('dot-slide-1');
    var prev = $('btn-slide-prev'), next = $('btn-slide-next');
    if (!s0 || !s1) return;

    var cur = 0;
    function setSlide(idx) {
      cur = idx;
      s0.hidden = (cur !== 0);
      s1.hidden = (cur !== 1);

      if (b0 && b1) {
        if (cur === 0) {
          b0.className = 'rounded-full px-5 py-2 text-xs sm:text-sm font-bold bg-navy text-white shadow-md transition-all';
          b1.className = 'rounded-full px-5 py-2 text-xs sm:text-sm font-bold text-white/85 hover:text-white hover:bg-white/10 transition-all';
        } else {
          b1.className = 'rounded-full px-5 py-2 text-xs sm:text-sm font-bold bg-navy text-white shadow-md transition-all';
          b0.className = 'rounded-full px-5 py-2 text-xs sm:text-sm font-bold text-white/85 hover:text-white hover:bg-white/10 transition-all';
        }
      }

      if (d0 && d1) {
        if (cur === 0) {
          d0.className = 'h-2.5 w-8 rounded-full bg-navy transition-all';
          d1.className = 'h-2.5 w-2.5 rounded-full bg-navy/35 hover:bg-navy/60 transition-all';
        } else {
          d1.className = 'h-2.5 w-8 rounded-full bg-navy transition-all';
          d0.className = 'h-2.5 w-2.5 rounded-full bg-navy/35 hover:bg-navy/60 transition-all';
        }
      }
    }

    if (b0) b0.addEventListener('click', function () { setSlide(0); });
    if (b1) b1.addEventListener('click', function () { setSlide(1); });
    if (d0) d0.addEventListener('click', function () { setSlide(0); });
    if (d1) d1.addEventListener('click', function () { setSlide(1); });
    if (prev) prev.addEventListener('click', function () { setSlide(cur === 0 ? 1 : 0); });
    if (next) next.addEventListener('click', function () { setSlide(cur === 0 ? 1 : 0); });
  }

  /* ==========================================
     11. Hero Bus Entrance Animation Controller
     ========================================== */
  function initHeroBusAnimation() {
    var wrapper = $('hero-bus-wrapper');
    if (!wrapper) return;

    function triggerEnter() {
      wrapper.classList.remove('animate-bus-arrive');
      // trigger DOM reflow so animation restarts cleanly
      void wrapper.offsetWidth;
      wrapper.classList.add('animate-bus-arrive');
    }

    // Trigger on initial page load / open
    triggerEnter();

    // Re-trigger when scrolling back to #beranda
    var berandaEl = $('beranda');
    if (berandaEl && 'IntersectionObserver' in window) {
      var wasAway = false;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && wasAway) {
            triggerEnter();
            wasAway = false;
          } else if (!entry.isIntersecting) {
            wasAway = true;
          }
        });
      }, { threshold: 0.35 });
      observer.observe(berandaEl);
    }

    // Also re-trigger when clicking any link pointing to #beranda
    var berandaLinks = document.querySelectorAll('a[href="#beranda"]');
    for (var i = 0; i < berandaLinks.length; i++) {
      berandaLinks[i].addEventListener('click', function () {
        setTimeout(triggerEnter, 80);
      });
    }
  }

  window.BikopaUI = {
    init: initAll,
    openSheet: openSheet,
    closeSheet: closeSheet,
    openCorridorDetail: openCorridorDetail,
    showBus: showBus,
    showNearby: showNearby,
    openConsent: openConsent
  };

  // Jalankan saat script selesai dimuat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (MapEngine && MapEngine.init) MapEngine.init();
      initAll();
    });
  } else {
    if (MapEngine && MapEngine.init) MapEngine.init();
    initAll();
  }

})(window);
