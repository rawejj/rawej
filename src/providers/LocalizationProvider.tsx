"use client";

import { createContext, useContext, ReactNode } from 'react';

export type LanguageKey = 'en' | 'de' | 'fr' | 'ku-sor' | 'ku-kmr' | 'fa';

export interface LanguageConfig {
  label: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timezone: string;
}

export const languages: Record<LanguageKey, LanguageConfig> = {
  en: {
    label: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'UTC',
  },
  de: {
    label: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timezone: 'Europe/Berlin',
  },
  fr: {
    label: 'French',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timezone: 'Europe/Paris',
  },
  'ku-sor': {
    label: 'Kurdi-Sorani',
    direction: 'rtl',
    dateFormat: 'YYYY/MM/DD',
    timezone: 'Asia/Baghdad',
  },
  'ku-kmr': {
    label: 'Kurdi-Kermanji',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timezone: 'Europe/Istanbul',
  },
  fa: {
    label: 'Persian',
    direction: 'rtl',
    dateFormat: 'YYYY/MM/DD',
    timezone: 'Asia/Tehran',
  },
}

export interface LocalizationContextValue {
  language: LanguageKey;
  config: LanguageConfig;
  setLanguage: (lang: LanguageKey) => void;
}

export const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
  initialLanguage?: LanguageKey;
}

export const LocalizationProvider = ({ children, initialLanguage }: LocalizationProviderProps) => {
  // Use initialLanguage if provided, else default to 'en'
  const lang = initialLanguage || 'en';
  const value: LocalizationContextValue = {
    language: lang,
    config: languages[lang],
    setLanguage: () => {},
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export function useLocalization() {
  const ctx = useContext(LocalizationContext);
  if (!ctx) {
    throw new Error('useLocalization must be used within LocalizationProvider');
  }
  
  return ctx;
}
