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
    // If analytics cookies are not accepted, disable Google Analytics
    if (!preferences?.analytics) {
      // Disable gtag if it exists
      if (window.gtag) {
        window.gtag('config', measurementId, { 'anonymize_ip': true });
        console.log('Google Analytics disabled - analytics cookies not accepted');
      }
      return;
    }

    // If analytics cookies are accepted, ensure gtag is properly configured
    if (window.gtag) {
      window.gtag('config', measurementId, { 'anonymize_ip': false });
      console.log('Google Analytics enabled with measurement ID:', measurementId);
    } else {
      console.log('Google Analytics scripts not found in head - they should be loaded via layout.tsx');
    }
  }, [preferences?.analytics, measurementId]);

  // Don't render anything
  return null;
}