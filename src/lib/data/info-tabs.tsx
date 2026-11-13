import React from 'react';
import { CORRIDOR_CODES, CORRIDORS } from './corridors';

export interface CardItem {
  icon: string;
  title: string;
  sub?: string;
  desc: string;
  flag?: string;
  code?: string;
  hasSeq?: boolean;
}

export interface TabSection {
  name: string;
  note: string;
  cards: CardItem[];
}

export const INFO_TAB_ICONS: Record<string, React.ReactNode> = {
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  ticket: <path d="M3 9V6h18v3a3 3 0 000 6v3H3v-3a3 3 0 000-6z" />,
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />,
  wifi: (
    <>
      <path d="M4 10a12 12 0 0116 0M7.5 13.5a7 7 0 019 0" />
      <circle cx="12" cy="18" r="1.2" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0116 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  bus: (
    <>
      <rect x="4" y="4" width="16" height="13" rx="3" />
      <path d="M4 11h16M7 20v-3M17 20v-3" />
    </>
  ),
};

export const INFO_TABS_DATA: TabSection[] = [
  {
    name: 'Jadwal',
    note: 'Jam operasional 06:00–21:00 dan headway 15 menit adalah nilai awal dari PRD. Menunggu konfirmasi Dishub.',
    cards: [
      ...CORRIDOR_CODES.map((code) => ({
        icon: 'clock',
        code,
        title: `Koridor ${code}`,
        sub: CORRIDORS[code].name,
        desc: `06:00–21:00 · tiap 15 menit · setiap hari. ${CORRIDORS[code].via_route}.`,
      })),
    ],
  },
  {
    name: 'Halte',
    note: 'Urutan halte per arah menunggu data Dishub. Koridor tanpa urutan lengkap tidak dipublikasikan di aplikasi final.',
    cards: [
      ...CORRIDOR_CODES.map((code) => ({
        icon: 'pin',
        code,
        title: `Koridor ${code}`,
        sub: CORRIDORS[code].name,
        desc: `${CORRIDORS[code].stops_count || 0} halte (Pergi dan Pulang). Lintasan: ${CORRIDORS[code].via_route}.`,
        hasSeq: true,
      })),
      {
        icon: 'bus',
        title: 'Hub transfer',
        desc: '6 hub: Pantoloan, Taman GOR, Balai Kota, Pasar Manonda, Bandara MSA, Terminal Tipo.',
      },
    ],
  },
  {
    name: 'Bantuan',
    note: 'Aplikasi tidak meminta akun, formulir, atau data pribadi.',
    cards: [
      {
        icon: 'wifi',
        title: 'Mode offline',
        desc: 'Info rute dan halte tetap terbuka tanpa sinyal. Posisi bus tidak tersedia saat offline.',
      },
      {
        icon: 'pin',
        title: 'Halte terdekat',
        desc: 'Pakai lokasi Anda atau klik titik di peta. Maksimal 3 halte dalam radius 5 km.',
      },
      {
        icon: 'clock',
        title: 'Membaca ETA',
        desc: 'Estimasi berlabel Perkiraan, dibulatkan ke atas ke menit terdekat.',
      },
      {
        icon: 'bus',
        title: 'Arti status bus',
        desc: 'Aktif: data ≤ 30 dtk. Sinyal lemah: 31–120 dtk. Offline: lebih dari 120 dtk.',
      },
      {
        icon: 'headset',
        title: 'Kontak Dishub',
        desc: 'Telp (0451) 421666, Jl. Balai Kota Timur No. 1, Palu.',
      },
      {
        icon: 'shield',
        title: 'Privasi lokasi',
        desc: 'Lokasi hanya diproses di perangkat lokal Anda, tidak dikirim dan tidak disimpan di server.',
      },
    ],
  },
];
