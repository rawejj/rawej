"use client";

import { useLocalization } from '@/providers/LocalizationProvider';
import { ReactNode } from 'react';

export function LocalizationClientProvider({ children }: { children: ReactNode }) {
  const { config } = useLocalization();
  
  // Update the html dir attribute when direction changes
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('dir', config.direction);
  }

  return <>{children}</>;
}
