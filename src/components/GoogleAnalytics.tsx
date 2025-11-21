"use client";

import { useEffect } from 'react';
import { useCookieConsent } from '@/providers/CookieConsentProvider';

// Declare gtag function for TypeScript
declare global {
  function gtag(command: string, targetId: string, config?: Record<string, unknown>): void;
  function gtag(command: string, parameters: Record<string, unknown>): void;
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const { preferences } = useCookieConsent();

  useEffect(() => {
    // Only load Google Analytics if user has accepted analytics cookies
    if (preferences?.analytics) {
      // Load Google Analytics script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script1);

      // Initialize gtag
      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
      `;
      document.head.appendChild(script2);
    }
  }, [preferences?.analytics, measurementId]);

  // Don't render anything
  return null;
}