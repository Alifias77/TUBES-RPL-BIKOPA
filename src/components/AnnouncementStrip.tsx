'use client';

import React, { useState } from 'react';
import { ANNOUNCEMENTS } from '@/lib/data/announcements';

export default function AnnouncementStrip({ corridorCode }: { corridorCode?: string }) {
  const [dismissed, setDismissed] = useState(false);

  const relevant = ANNOUNCEMENTS.find((ann) => {
    if (!ann.is_active) return false;
    if (ann.ends_at && new Date(ann.ends_at) < new Date()) return false;
    if (corridorCode && ann.corridor_code && ann.corridor_code !== corridorCode) return false;
    return true;
  });

  if (dismissed || !relevant) return null;

  return (
    <div id="strip" className="bg-sun text-ink font-nav">
      <div className="wrap gutter flex items-center justify-between gap-3 py-2 text-[13px]">
        <p className="min-w-0">
          <strong className="mr-1">{relevant.type === 'INFO' ? 'Info:' : 'Pengumuman:'}</strong>
          {relevant.body}
        </p>
        <button
          id="strip-x"
          type="button"
          onClick={() => setDismissed(true)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded focus-ring"
          aria-label="Tutup pengumuman"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
