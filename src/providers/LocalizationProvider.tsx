export type LanguageKey = 'en' | 'de' | 'fr' | 'ku-sor' | 'ku-kur' | 'fa';

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
  'ku-kur': {
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
