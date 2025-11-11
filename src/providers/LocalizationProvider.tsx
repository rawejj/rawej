export type LanguageKey = "en" | "de" | "fr" | "ku-sor" | "ku-kur" | "fa";

export interface LanguageConfig {
  label: string;
  locale: string;
  direction: "ltr" | "rtl";
  dateFormat: string;
  timezone: string;
}

export const languages: Record<LanguageKey, LanguageConfig> = {
  en: {
    label: "English",
    locale: "en-US",
    direction: "ltr",
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC",
  },
  de: {
    label: "Deutsch",
    locale: "de-DE",
    direction: "ltr",
    dateFormat: "DD.MM.YYYY",
    timezone: "Europe/Berlin",
  },
  fr: {
    label: "French",
    locale: "fr-FR",
    direction: "ltr",
    dateFormat: "DD/MM/YYYY",
    timezone: "Europe/Paris",
  },
  "ku-sor": {
    label: "Kurdi-Sorani",
    locale: "ku-IQ",
    direction: "rtl",
    dateFormat: "YYYY/MM/DD",
    timezone: "Asia/Baghdad",
  },
  "ku-kur": {
    label: "Kurdi-Kermanji",
    locale: "ku-TR",
    direction: "ltr",
    dateFormat: "YYYY-MM-DD",
    timezone: "Europe/Istanbul",
  },
  fa: {
    locale: "fa-IR",
    label: "Persian",
    direction: "rtl",
    dateFormat: "YYYY/MM/DD",
    timezone: "Asia/Tehran",
  },
};

export interface LocalizationContextValue {
  language: LanguageKey;
  config: LanguageConfig;
  setLanguage: (lang: LanguageKey) => void;
}
