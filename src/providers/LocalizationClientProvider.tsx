"use client";

import React, { useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { languages, LanguageKey, LocalizationContextValue, LocalizationContext } from '@/providers/LocalizationProvider';

interface LocalizationClientProviderProps {
  children: React.ReactNode;
  initialLanguage?: LanguageKey;
}

export const LocalizationClientProvider = ({ children, initialLanguage }: LocalizationClientProviderProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // Use initialLanguage from props if provided, else detect from path
  const pathSegments = pathname.split('/').filter(Boolean);
  const detectedLang = (pathSegments[0] as LanguageKey) || 'en';
  const startLang = initialLanguage || (detectedLang in languages ? detectedLang : 'en');
  const [language, setLanguageState] = useState<LanguageKey>(startLang);
  const config = useMemo(() => languages[language], [language]);

  // Update URL when language changes
  const setLanguage = (lang: LanguageKey) => {
    setLanguageState(lang);
    // Replace first segment with new language
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = lang;
    const newPath = '/' + segments.join('/');
    router.push(newPath);
  };

  React.useEffect(() => {
    document.documentElement.setAttribute('dir', config.direction);
  }, [config.direction]);

  const value: LocalizationContextValue = {
    language,
    config,
    setLanguage,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};
