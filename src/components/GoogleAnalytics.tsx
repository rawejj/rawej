"use client";

import { useEffect } from 'react';
import { useCookieConsent } from '@/providers/CookieConsentProvider';

// Declare gtag function for TypeScript
declare global {
  var gtag: ((command: string, targetId: string, config?: Record<string, unknown>) => void) | undefined;
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const { preferences } = useCookieConsent();

  useEffect(() => {
    if (!preferences) return; // Wait for preferences to load

    if (preferences.analytics) {
      // Grant consent for analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
        console.log('Google Analytics enabled - analytics cookies accepted');
      }
    } else {
      // Deny consent for analytics
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
        // No console log for disabled to avoid confusion
      }
    }
  }, [preferences, preferences?.analytics, measurementId]);

  // Don't render anything
  return null;
}