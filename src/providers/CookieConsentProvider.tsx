"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CookieConsent from '@/components/CookieConsent';
import {
  shouldShowCookieBanner,
  acceptAllCookies,
  rejectAllCookies,
  acceptSelectedCookies,
  getCookiePreferences,
  CookiePreferences
} from '@/utils/cookieConsent';

interface CookieConsentContextValue {
  preferences: CookiePreferences | null;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  acceptSelected: (preferences: CookiePreferences) => void;
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  const [cookieState, setCookieState] = useState<{
    showBanner: boolean;
    preferences: CookiePreferences | null;
    isHydrated: boolean;
  }>({
    showBanner: false,
    preferences: null,
    isHydrated: false,
  });

  useEffect(() => {
    // Only run on client after hydration to avoid hydration mismatch
    const storedPreferences = getCookiePreferences();
    const shouldShow = shouldShowCookieBanner();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCookieState({
      showBanner: shouldShow,
      preferences: storedPreferences,
      isHydrated: true,
    });
  }, []);

  const { showBanner, preferences, isHydrated } = cookieState;

  const handleAcceptAll = () => {
    acceptAllCookies();
    setCookieState(prev => ({
      ...prev,
      preferences: {
        essential: true,
        analytics: true,
        marketing: true,
      },
      showBanner: false,
    }));
  };

  const handleRejectAll = () => {
    rejectAllCookies();
    setCookieState(prev => ({
      ...prev,
      preferences: {
        essential: true,
        analytics: false,
        marketing: false,
      },
      showBanner: false,
    }));
  };

  const handleAcceptSelected = (selectedPreferences: CookiePreferences) => {
    acceptSelectedCookies(selectedPreferences);
    setCookieState(prev => ({
      ...prev,
      preferences: {
        ...selectedPreferences,
        essential: true,
      },
      showBanner: false,
    }));
  };

  const value: CookieConsentContextValue = {
    preferences,
    showBanner,
    acceptAll: handleAcceptAll,
    rejectAll: handleRejectAll,
    acceptSelected: handleAcceptSelected,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {isHydrated && showBanner && (
        <CookieConsent
          onAccept={handleAcceptSelected}
          onReject={handleRejectAll}
          onAcceptAll={handleAcceptAll}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return context;
}