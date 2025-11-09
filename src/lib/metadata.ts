import { Metadata } from 'next';
import { LanguageKey } from '@/providers/LocalizationProvider';
import { SUPPORTED_LANGUAGES } from '@/lib/constants';

type TranslationsType = {
  meta: {
    title: string;
    description: string;
    keywords: string;
  };
  [key: string]: unknown;
};

export async function getTranslations(lang: string): Promise<TranslationsType> {
  try {
    const translations = await import(`@/../public/locales/${lang}.json`);
    return translations.default;
  } catch {
    // Fallback to English
    const translations = await import(`@/../public/locales/en.json`);
    return translations.default;
  }
}

export async function generateMetadata(lang: LanguageKey): Promise<Metadata> {
  const translations = await getTranslations(lang);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Build alternate languages dynamically
  const alternateLanguages = SUPPORTED_LANGUAGES.reduce((acc, language) => {
    acc[language] = `${baseUrl}/${language}`;
    return acc;
  }, {} as Record<string, string>);

  return {
    title: translations.meta.title,
    description: translations.meta.description,
    keywords: translations.meta.keywords,
    openGraph: {
      title: translations.meta.title,
      description: translations.meta.description,
      url: `${baseUrl}/${lang}`,
      siteName: translations.meta.title,
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: translations.meta.title,
      description: translations.meta.description,
    },
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: alternateLanguages,
    },
  };
}
