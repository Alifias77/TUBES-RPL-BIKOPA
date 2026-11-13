'use client';

import React from 'react';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LocationConsent({ isOpen, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div
      id="consent"
      className="fixed inset-0 z-[80] grid place-items-center p-4"
      style={{ background: 'rgba(18,30,58,.55)' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <h3 id="consent-title" className="display text-2xl font-bold text-navy">
          Gunakan lokasi Anda?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">
          Lokasi dipakai hanya di perangkat Anda untuk mencari halte terdekat. Lokasi tidak dikirim dan tidak disimpan.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            id="consent-ok"
            type="button"
            onClick={onConfirm}
            className="min-h-[44px] rounded-lg bg-coral px-5 text-sm font-bold text-white focus-ring"
          >
            Izinkan
          </button>
          <button
            id="consent-no"
            type="button"
            onClick={onCancel}
            className="min-h-[44px] rounded-lg border border-ink/20 px-5 text-sm font-bold text-navy focus-ring"
          >
            Tidak sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
