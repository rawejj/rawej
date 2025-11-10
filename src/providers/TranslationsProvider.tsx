"use client";

import { createContext, useContext, ReactNode } from 'react';
import { Translations, getTranslation } from '@/lib/translationHelpers';

interface TranslationsContextValue {
  translations: Translations;
  t: (key: string, fallback?: string) => string;
}

const TranslationsContext = createContext<TranslationsContextValue | undefined>(undefined);

interface TranslationsProviderProps {
  children: ReactNode;
  translations: Translations;
}

/**
 * Client-side provider that receives translations from server component
 * This follows Next.js 13+ best practices: load on server, provide to client
 */
export function TranslationsProvider({ children, translations }: TranslationsProviderProps) {
  const t = (key: string, fallback?: string) => getTranslation(translations, key, fallback);

  const value: TranslationsContextValue = {
    translations,
    t,
  };

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
}

/**
 * Hook to access translations in client components
 * Usage: const { t } = useTranslations();
 * Example: t('theme.dark') or t('book appointment')
 */
export function useTranslations() {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslations must be used within TranslationsProvider');
  }
  return context;
}
