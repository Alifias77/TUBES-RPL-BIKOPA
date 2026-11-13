'use client';

import { useState } from 'react';
import { BusLiveState } from './types';
import { getLiveBuses } from './store';

export function useLiveBuses(): BusLiveState[] {
  const [buses] = useState<BusLiveState[]>(() => getLiveBuses());
  return buses;
}
