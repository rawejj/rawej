"use client";

import { useEffect } from 'react';
import { useCookieConsent } from '@/providers/CookieConsentProvider';

interface GoogleSearchConsoleProps {
  verificationCode: string;
}

export default function GoogleSearchConsole({ verificationCode }: GoogleSearchConsoleProps) {
  const { preferences } = useCookieConsent();

  useEffect(() => {
    // Search Console verification doesn't require cookies, but we can still respect user preferences
    // Only add verification if user hasn't rejected all cookies or if analytics are accepted
    if (preferences && (preferences.analytics || (!preferences.analytics && !preferences.marketing))) {
      // Add or update the verification meta tag
      let metaTag = document.querySelector('meta[name="google-site-verification"]');

      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'google-site-verification');
        document.head.appendChild(metaTag);
      }

      metaTag.setAttribute('content', verificationCode);
    }
  }, [preferences, verificationCode]);

  // Don't render anything
  return null;
}