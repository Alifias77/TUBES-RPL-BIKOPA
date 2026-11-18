/**
 * BIKOPA Trans Palu - Master Data & Konfigurasi
 * File: js/data.js
 */

(function (window) {
  'use strict';

  // 1. Data Koridor
  var C = {
    '01': {
      name: 'Pantoloan – Pusat Kota',
      via: 'Jalur utama Trans Sulawesi – Pantoloan',
      color: '#EF4444',
      stops: 19,
      hubs: ['HLT-001', 'HLT-002'],
      d: 'M520,46 C470,70 400,90 360,130 C330,150 315,160 300,170'
    },
    '02': {
      name: 'Balai Kota – Pasar Manonda',
      via: 'Balai Kota – Pusat Kota – Pasar Inpres Manonda',
      color: '#3B82F6',
      stops: 18,
      hubs: ['HLT-003', 'HLT-002', 'HLT-004'],
      d: 'M408,132 C370,140 330,160 300,170 C240,180 190,195 110,200'
    },
    '03M': {
      name: 'Pusat Kota – Bandara MSA',
      via: 'via Jl. Wolter Monginsidi',
      color: '#10B981',
      stops: 9,
      hubs: ['HLT-002', 'HLT-005'],
      d: 'M300,170 C330,230 380,280 440,320'
    },
    '03Y': {
      name: 'Pusat Kota – Bandara MSA',
      via: 'via Jl. Prof. Moh. Yamin',
      color: '#F59E0B',
      stops: 11,
      hubs: ['HLT-002', 'HLT-003', 'HLT-005'],
      d: 'M300,170 C335,200 375,160 408,132 C478,176 486,262 440,320'
    },
    '04': {
      name: 'Bandara MSA – Terminal Tipo',
      via: 'Bandara – Jembatan Palu IV / Jalur Dalam – Terminal Tipo',
      color: '#8B5CF6',
      stops: 10,
      hubs: ['HLT-005', 'HLT-006'],
      d: 'M440,320 C380,350 300,362 210,350'
    }
  };

  var CODES = ['01', '02', '03M', '03Y', '04'];

  // 2. Data Hub / Halte Transit
  var H = {
    'HLT-001': { name: 'Pelabuhan Pantoloan', short: 'Pelabuhan Pantoloan', x: 520, y: 46, c: ['01'], lx: -14, ly: -10, a: 'end' },
    'HLT-002': { name: 'Taman GOR', short: 'Taman GOR', x: 300, y: 170, c: ['01', '02', '03M', '03Y'], lx: 0, ly: 26, a: 'middle' },
    'HLT-003': { name: 'Balai Kota', short: 'Balai Kota', x: 408, y: 132, c: ['02', '03Y'], lx: 14, ly: -10, a: 'start' },
    'HLT-004': { name: 'Pasar Inpres Manonda', short: 'Pasar Manonda', x: 110, y: 200, c: ['02'], lx: 0, ly: 26, a: 'middle' },
    'HLT-005': { name: 'Bandara Mutiara SIS Al-Jufri', short: 'Bandara MSA', x: 440, y: 320, c: ['03M', '03Y', '04'], lx: 14, ly: 5, a: 'start' },
    'HLT-006': { name: 'Terminal Tipo', short: 'Terminal Tipo', x: 210, y: 350, c: ['04'], lx: 0, ly: 26, a: 'middle' }
  };

  var HC = Object.keys(H);

  // 3. Armada Bus Simulasi Real-Time
  var BUSES = [
    { id: 'TP-01', c: '01', p: 0.25, dir: 1, speed: 28, status: 'ACTIVE' },
    { id: 'TP-02', c: '01', p: 0.75, dir: -1, speed: 24, status: 'ACTIVE' },
    { id: 'TP-03', c: '02', p: 0.35, dir: 1, speed: 26, status: 'ACTIVE' },
    { id: 'TP-04', c: '02', p: 0.82, dir: -1, speed: 0, status: 'STALE' },
    { id: 'TP-05', c: '03M', p: 0.45, dir: 1, speed: 30, status: 'ACTIVE' },
    { id: 'TP-06', c: '03Y', p: 0.3, dir: 1, speed: 27, status: 'ACTIVE' },
    { id: 'TP-07', c: '04', p: 0.6, dir: -1, speed: 0, status: 'OFFLINE' }
  ];

  var STATUS_LABEL = {
    ACTIVE: 'Aktif',
    STALE: 'Sinyal lemah',
    OFFLINE: 'Offline'
  };

  // 4. Ikon SVG untuk Tab Informasi
  var ICON = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    ticket: '<path d="M3 9V6h18v3a3 3 0 000 6v3H3v-3a3 3 0 000-6z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    shield: '<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/>',
    wifi: '<path d="M4 10a12 12 0 0116 0M7.5 13.5a7 7 0 019 0"/><circle cx="12" cy="18" r="1.2"/>',
    headset: '<path d="M4 14v-2a8 8 0 0116 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    bus: '<rect x="4" y="4" width="16" height="13" rx="3"/><path d="M4 11h16M7 20v-3M17 20v-3"/>'
  };

  // 5. Data Konten Tab (Jadwal, Tarif, Halte, Bantuan)
  function corrCards(fn, icon) {
    return CODES.map(function (code) {
      var r = fn(code);
      return { icon: icon, title: 'Koridor ' + code + ' · ' + C[code].name, desc: r, code: code };
    });
  }

  var CORRIDOR_STOPS = {
    '01': [
      'Pelabuhan Pantoloan (Hub)',
      'Puskesmas Tawaeli',
      'Puskesmas Kayumalue',
      'Taipa Beach',
      'Brimob',
      'Terminal Mamboro',
      'Huntap Tondo 1',
      'Universitas Terbuka',
      'Islamic Center Untad',
      'Undata',
      'Puskesmas Talise',
      'Tombolututu',
      'Inspektorat',
      'Rumah Sakit Bayangkara',
      'Polresta',
      'SMAN 1',
      'Korem',
      'Titik 0 Km',
      'Taman GOR (Hub)'
    ],
    '02': [
      'Balai Kota (Hub)',
      'Kartini',
      'Telkom',
      'Moh Hatta',
      'Taman GOR (Hub)',
      'Korem',
      'Titik 0 Km',
      'Hasanuddin',
      'Gajah Mada',
      'Sis Aljufri',
      'SMPN 3',
      'Pasar Inpres Manonda (Hub)',
      'Anutapura',
      'Masjid Raya',
      'Wahid Hasyim',
      'Kimaja',
      'Hi Hayun',
      'SMPN 2'
    ],
    '03M': [
      'Taman GOR (Hub)',
      'Monginsidi',
      'Pasar Masomba',
      '711',
      'TMP',
      'Basrah 2',
      'Basrah 1',
      'Puskesmas Birobuli',
      'Bandara Mutiara SIS Al-Jufri (Hub)'
    ],
    '03Y': [
      'Taman GOR (Hub)',
      'Balai Kota (Hub)',
      'Kejaksaan',
      'KPP Pratama',
      'Pasar Masomba',
      '711',
      'TMP',
      'Basrah 2',
      'Basrah 1',
      'Puskesmas Birobuli',
      'Bandara Mutiara SIS Al-Jufri (Hub)'
    ],
    '04': [
      'Terminal Tipo (Hub)',
      'Silae',
      'PGM',
      'Palu Plaza',
      'Pue Bongo 2',
      'Pue Bongo 1',
      'Bundaran Palupi',
      'Pasar Tavanjuka',
      'Puskesmas Mabelopura',
      'Bandara Mutiara SIS Al-Jufri (Hub)'
    ]
  };

  var TABS = [
    {
      name: 'Jadwal',
      note: '',
      cards: corrCards(function (code) {
        return '06:00–21:00 · tiap 15 menit · setiap hari. ' + C[code].via + '.';
      }, 'clock')
    },
    {
      name: 'Halte',
      note: '',
      cards: corrCards(function (code) {
        return C[code].stops + ' halte (Pergi dan Pulang). Lintasan: ' + C[code].via + '.';
      }, 'pin').map(function (c) { c.seq = true; return c; }).concat([
        { icon: 'bus', title: 'Hub transfer', desc: '6 hub: Pantoloan, Taman GOR, Balai Kota, Pasar Manonda, Bandara MSA, Terminal Tipo.' }
      ])
    },
    {
      name: 'Bantuan',
      note: '',
      cards: [
        { icon: 'wifi', title: 'Mode offline', desc: 'Info rute dan halte tetap terbuka tanpa sinyal. Posisi bus tidak tersedia.' },
        { icon: 'pin', title: 'Halte terdekat', desc: 'Pakai lokasi Anda atau klik titik di peta. Maksimal 3 halte, radius awal 1 km.' },
        { icon: 'clock', title: 'Membaca ETA', desc: 'Estimasi berlabel Perkiraan, dibulatkan ke atas ke menit.' },
        { icon: 'bus', title: 'Arti status bus', desc: 'Aktif: data ≤ 30 dtk. Sinyal lemah: 31–120 dtk. Offline: lebih dari 120 dtk.' },
        { icon: 'headset', title: 'Kontak Dishub', desc: 'Telp (0451) 421666, Jl. Balai Kota Timur No. 1, Palu.' },
        { icon: 'shield', title: 'Privasi lokasi', desc: 'Lokasi dipakai di perangkat saja, tidak dikirim dan tidak disimpan.' }
      ]
    }
  ];

  // Helper fungsi warna & badge
  function isLight(hex) {
    var r = parseInt(hex.substr(1, 2), 16);
    var g = parseInt(hex.substr(3, 2), 16);
    var b = parseInt(hex.substr(5, 2), 16);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55;
  }

  function badge(code) {
    var c = C[code];
    if (!c) return '';
    var textColor = isLight(c.color) ? '#17233f' : '#fff';
    return '<span class="kb" style="background:' + c.color + ';color:' + textColor + '">' + code + '</span>';
  }

  function fmtDist(m) {
    return m < 1000
      ? Math.round(m / 10) * 10 + ' m'
      : (m / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' km';
  }

  // Ekspor ke window.BikopaData
  
  // 2b. Seluruh 53 Titik Halte Resmi Trans Palu
  var ALL_STOPS = [
  {
    "code": "HLT-001",
    "name": "Pelabuhan Pantoloan",
    "short": "Pelabuhan Pantoloan",
    "lat": -0.70832251,
    "lng": 119.85717594,
    "type": "HUB",
    "c": [
      "01"
    ]
  },
  {
    "code": "HLT-002",
    "name": "Taman GOR",
    "short": "Taman GOR",
    "lat": -0.89629353,
    "lng": 119.87152201,
    "type": "HUB",
    "c": [
      "01",
      "02",
      "03M",
      "03Y"
    ]
  },
  {
    "code": "HLT-003",
    "name": "Balai Kota",
    "short": "Balai Kota",
    "lat": -0.89927575,
    "lng": 119.89004821,
    "type": "HUB",
    "c": [
      "02",
      "03Y"
    ]
  },
  {
    "code": "HLT-004",
    "name": "Pasar Inpres Manonda",
    "short": "Pasar Manonda",
    "lat": -0.90330019,
    "lng": 119.85187801,
    "type": "HUB",
    "c": [
      "02"
    ]
  },
  {
    "code": "HLT-005",
    "name": "Bandara Mutiara SIS Al-Jufri",
    "short": "Bandara MSA",
    "lat": -0.91862354,
    "lng": 119.90591876,
    "type": "HUB",
    "c": [
      "03M",
      "03Y",
      "04"
    ]
  },
  {
    "code": "HLT-006",
    "name": "Terminal Tipo",
    "short": "Terminal Tipo",
    "lat": -0.86169151,
    "lng": 119.82640439,
    "type": "HUB",
    "c": [
      "04"
    ]
  },
  {
    "code": "HLT-007",
    "name": "Puskesmas Tawaeli",
    "lat": -0.73384076,
    "lng": 119.86344336,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Puskesmas Tawaeli"
  },
  {
    "code": "HLT-008",
    "name": "Puskesmas Kayumalue",
    "lat": -0.75593656,
    "lng": 119.86509754,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Puskesmas Kayumalue"
  },
  {
    "code": "HLT-009",
    "name": "Taipa Beach",
    "lat": -0.78175884,
    "lng": 119.86054648,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Taipa Beach"
  },
  {
    "code": "HLT-010",
    "name": "Brimob",
    "lat": -0.78668393,
    "lng": 119.8727864,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Brimob"
  },
  {
    "code": "HLT-011",
    "name": "Terminal Mamboro",
    "lat": -0.80567574,
    "lng": 119.88297665,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Terminal Mamboro"
  },
  {
    "code": "HLT-012",
    "name": "Huntap Tondo 1",
    "lat": -0.82853898,
    "lng": 119.90225004,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Huntap Tondo 1"
  },
  {
    "code": "HLT-013",
    "name": "Islamic Center Untad",
    "lat": -0.84279672,
    "lng": 119.89518617,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Islamic Center Untad"
  },
  {
    "code": "HLT-014",
    "name": "Universitas Terbuka",
    "lat": -0.83593951,
    "lng": 119.88603873,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Universitas Terbuka"
  },
  {
    "code": "HLT-015",
    "name": "Undata",
    "lat": -0.85761872,
    "lng": 119.88400378,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Undata"
  },
  {
    "code": "HLT-016",
    "name": "Puskesmas Talise",
    "lat": -0.87580633,
    "lng": 119.87355917,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Puskesmas Talise"
  },
  {
    "code": "HLT-017",
    "name": "Polresta",
    "lat": -0.88985326,
    "lng": 119.87001038,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Polresta"
  },
  {
    "code": "HLT-018",
    "name": "Korem",
    "lat": -0.8945619,
    "lng": 119.8698004,
    "type": "BUS_STOP",
    "c": [
      "01",
      "02"
    ],
    "short": "Korem"
  },
  {
    "code": "HLT-019",
    "name": "Titik 0 Km",
    "short": "Titik 0 Km",
    "lat": -0.89686457,
    "lng": 119.8688298,
    "type": "BUS_STOP",
    "c": [
      "01",
      "02"
    ]
  },
  {
    "code": "HLT-020",
    "name": "Telkom",
    "lat": -0.89669262,
    "lng": 119.88007883,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Telkom"
  },
  {
    "code": "HLT-021",
    "name": "Moh Hatta",
    "lat": -0.8963248,
    "lng": 119.87330993,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Moh Hatta"
  },
  {
    "code": "HLT-022",
    "name": "Hasanuddin",
    "lat": -0.8972202,
    "lng": 119.86961815,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Hasanuddin"
  },
  {
    "code": "HLT-023",
    "name": "Gajah Mada",
    "lat": -0.89808727,
    "lng": 119.86325677,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Gajah Mada"
  },
  {
    "code": "HLT-024",
    "name": "Sis Aljufri",
    "lat": -0.90214507,
    "lng": 119.85819346,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Sis Aljufri"
  },
  {
    "code": "HLT-025",
    "name": "SMPN 3",
    "lat": -0.90262319,
    "lng": 119.85602398,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "SMPN 3"
  },
  {
    "code": "HLT-026",
    "name": "Anutapura",
    "lat": -0.8990791,
    "lng": 119.84926657,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Anutapura"
  },
  {
    "code": "HLT-027",
    "name": "Masjid Raya",
    "lat": -0.89357255,
    "lng": 119.85229799,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Masjid Raya"
  },
  {
    "code": "HLT-028",
    "name": "Wahid Hasyim",
    "lat": -0.89320502,
    "lng": 119.85898328,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Wahid Hasyim"
  },
  {
    "code": "HLT-029",
    "name": "Kimaja",
    "lat": -0.89186902,
    "lng": 119.86417561,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Kimaja"
  },
  {
    "code": "HLT-030",
    "name": "Hi Hayun",
    "lat": -0.89224134,
    "lng": 119.86808048,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Hi Hayun"
  },
  {
    "code": "HLT-031",
    "name": "SMPN 2",
    "lat": -0.89986972,
    "lng": 119.873459,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "SMPN 2"
  },
  {
    "code": "HLT-032",
    "name": "Kartini",
    "lat": -0.90110318,
    "lng": 119.88109618,
    "type": "BUS_STOP",
    "c": [
      "02"
    ],
    "short": "Kartini"
  },
  {
    "code": "HLT-033",
    "name": "Puskesmas Birobuli",
    "lat": -0.91905795,
    "lng": 119.89530937,
    "type": "BUS_STOP",
    "c": [
      "03M",
      "03Y"
    ],
    "short": "Puskesmas Birobuli"
  },
  {
    "code": "HLT-034",
    "name": "Basrah 1",
    "lat": -0.91888081,
    "lng": 119.88883704,
    "type": "BUS_STOP",
    "c": [
      "03M",
      "03Y"
    ],
    "short": "Basrah 1"
  },
  {
    "code": "HLT-035",
    "name": "Basrah 2",
    "lat": -0.91888137,
    "lng": 119.87765924,
    "type": "BUS_STOP",
    "c": [
      "03M",
      "03Y"
    ],
    "short": "Basrah 2"
  },
  {
    "code": "HLT-036",
    "name": "TMP (Taman Makam Pahlawan)",
    "short": "TMP",
    "lat": -0.91911738,
    "lng": 119.88055603,
    "type": "BUS_STOP",
    "c": [
      "03M",
      "03Y"
    ]
  },
  {
    "code": "HLT-037",
    "name": "Yonif 711 / Raksatama",
    "short": "711",
    "lat": -0.91681327,
    "lng": 119.87633193,
    "type": "BUS_STOP",
    "c": [
      "03M",
      "03Y"
    ]
  },
  {
    "code": "HLT-038",
    "name": "Pasar Masomba",
    "lat": -0.90819752,
    "lng": 119.87917783,
    "type": "BUS_STOP",
    "c": [
      "03M",
      "03Y"
    ],
    "short": "Pasar Masomba"
  },
  {
    "code": "HLT-039",
    "name": "Monginsidi",
    "lat": -0.90391475,
    "lng": 119.87460876,
    "type": "BUS_STOP",
    "c": [
      "03M"
    ],
    "short": "Monginsidi"
  },
  {
    "code": "HLT-040",
    "name": "KPP Pratama",
    "lat": -0.91368003,
    "lng": 119.89046605,
    "type": "BUS_STOP",
    "c": [
      "03Y"
    ],
    "short": "KPP Pratama"
  },
  {
    "code": "HLT-041",
    "name": "Kejaksaan",
    "lat": -0.90994037,
    "lng": 119.8895908,
    "type": "BUS_STOP",
    "c": [
      "03Y"
    ],
    "short": "Kejaksaan"
  },
  {
    "code": "HLT-042",
    "name": "Rumah Sakit Bayangkara",
    "lat": -0.88892297,
    "lng": 119.86814449,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Rumah Sakit Bayangkara"
  },
  {
    "code": "HLT-043",
    "name": "Tombolututu",
    "lat": -0.88362835,
    "lng": 119.87923066,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Tombolututu"
  },
  {
    "code": "HLT-044",
    "name": "Inspektorat",
    "lat": -0.88671597,
    "lng": 119.87567586,
    "type": "BUS_STOP",
    "c": [
      "01"
    ],
    "short": "Inspektorat"
  },
  {
    "code": "HLT-045",
    "name": "SMAN 1 Palu",
    "short": "SMAN 1",
    "lat": -0.89375499,
    "lng": 119.87482228,
    "type": "BUS_STOP",
    "c": [
      "01"
    ]
  },
  {
    "code": "HLT-046",
    "name": "Silae",
    "lat": -0.87164112,
    "lng": 119.83320537,
    "type": "BUS_STOP",
    "c": [
      "04"
    ],
    "short": "Silae"
  },
  {
    "code": "HLT-047",
    "name": "PGM (Palu Grand Mall)",
    "short": "PGM",
    "lat": -0.88326356,
    "lng": 119.84237098,
    "type": "BUS_STOP",
    "c": [
      "04"
    ]
  },
  {
    "code": "HLT-048",
    "name": "Palu Plaza",
    "lat": -0.8992816,
    "lng": 119.8607054,
    "type": "BUS_STOP",
    "c": [
      "04"
    ],
    "short": "Palu Plaza"
  },
  {
    "code": "HLT-049",
    "name": "Pue Bongo 1",
    "lat": -0.92010869,
    "lng": 119.85630701,
    "type": "BUS_STOP",
    "c": [
      "04"
    ],
    "short": "Pue Bongo 1"
  },
  {
    "code": "HLT-050",
    "name": "Pue Bongo 2",
    "lat": -0.90906843,
    "lng": 119.85616726,
    "type": "BUS_STOP",
    "c": [
      "04"
    ],
    "short": "Pue Bongo 2"
  },
  {
    "code": "HLT-051",
    "name": "Bundaran Palupi",
    "lat": -0.92207383,
    "lng": 119.85858714,
    "type": "BUS_STOP",
    "c": [
      "04"
    ],
    "short": "Bundaran Palupi"
  },
  {
    "code": "HLT-052",
    "name": "Pasar Tavanjuka",
    "lat": -0.92243152,
    "lng": 119.86491408,
    "type": "BUS_STOP",
    "c": [
      "04"
    ],
    "short": "Pasar Tavanjuka"
  },
  {
    "code": "HLT-053",
    "name": "Puskesmas Mabelopura",
    "lat": -0.91852109,
    "lng": 119.87547873,
    "type": "BUS_STOP",
    "c": [
      "04"
    ],
    "short": "Puskesmas Mabelopura"
  }
];

  // 2c. Urutan Halte per Koridor untuk Polyline
  var SEQUENCES = {
  "01": [
    "HLT-001",
    "HLT-007",
    "HLT-008",
    "HLT-009",
    "HLT-010",
    "HLT-011",
    "HLT-012",
    "HLT-014",
    "HLT-013",
    "HLT-015",
    "HLT-016",
    "HLT-043",
    "HLT-044",
    "HLT-042",
    "HLT-017",
    "HLT-045",
    "HLT-018",
    "HLT-019",
    "HLT-002"
  ],
  "02": [
    "HLT-003",
    "HLT-032",
    "HLT-020",
    "HLT-021",
    "HLT-002",
    "HLT-018",
    "HLT-019",
    "HLT-022",
    "HLT-023",
    "HLT-024",
    "HLT-025",
    "HLT-004",
    "HLT-026",
    "HLT-027",
    "HLT-028",
    "HLT-029",
    "HLT-030",
    "HLT-031"
  ],
  "03M": [
    "HLT-002",
    "HLT-039",
    "HLT-038",
    "HLT-037",
    "HLT-036",
    "HLT-035",
    "HLT-034",
    "HLT-033",
    "HLT-005"
  ],
  "03Y": [
    "HLT-002",
    "HLT-003",
    "HLT-041",
    "HLT-040",
    "HLT-038",
    "HLT-037",
    "HLT-036",
    "HLT-035",
    "HLT-034",
    "HLT-033",
    "HLT-005"
  ],
  "04": [
    "HLT-006",
    "HLT-046",
    "HLT-047",
    "HLT-048",
    "HLT-050",
    "HLT-049",
    "HLT-051",
    "HLT-052",
    "HLT-053",
    "HLT-005"
  ]
};

  window.BikopaData = {
    ALL_STOPS: ALL_STOPS,
    SEQUENCES: SEQUENCES,
    CORRIDOR_STOPS: CORRIDOR_STOPS,
    C: C,
    CODES: CODES,
    H: H,
    HC: HC,
    BUSES: BUSES,
    STATUS_LABEL: STATUS_LABEL,
    ICON: ICON,
    TABS: TABS,
    isLight: isLight,
    badge: badge,
    fmtDist: fmtDist
  };

})(window);
