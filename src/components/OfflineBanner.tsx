'use client';

import React, { useState, useEffect } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    function updateStatus() {
      setIsOffline(!navigator.onLine);
    }
    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-navy text-white text-xs py-2 px-4 text-center font-medium border-b border-white/10 z-50 sticky top-0">
      Mode offline: Info rute dan halte tetap dapat dibuka dari cache perangkat Anda.
    </div>
  );
}
