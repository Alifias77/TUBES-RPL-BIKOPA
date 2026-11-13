import type { Metadata, Viewport } from 'next';
import './globals.css';
import SvgSymbols from '../components/SvgSymbols';
import OfflineBanner from '../components/OfflineBanner';

export const metadata: Metadata = {
  title: 'BIKOPA — Sistem Informasi & Rute Bus',
  description: 'Sistem Informasi Rute, Halte, dan Jadwal Bus Trans Palu. Tanpa login, tanpa ribet.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/IMAGE/LOGO BIKOPA.png', type: 'image/png' },
      { url: '/images/logo-bikopa.png', type: 'image/png' },
    ],
    shortcut: '/IMAGE/LOGO BIKOPA.png',
    apple: '/IMAGE/LOGO BIKOPA.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#1b2d52',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=DM+Sans:wght@400;500;700&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300&display=swap"
        />
      </head>
      <body className="font-body bg-white text-ink antialiased">
        <SvgSymbols />
        <OfflineBanner />
        {children}
      </body>
    </html>
  );
}
