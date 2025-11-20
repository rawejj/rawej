export type LanguageKey = "en" | "de" | "fr" | "ku-sor" | "ku-kur" | "fa";
export type Currency = "USD" | "EUR" | "IQD" | "TRY" | "IRR";

export interface LanguageConfig {
  label: string;
  locale: string;
  direction: "ltr" | "rtl";
  dateFormat: string;
  timezone: string;
  currency: string;
}

export const languages: Record<LanguageKey, LanguageConfig> = {
  en: {
    label: "English",
    locale: "en-US",
    direction: "ltr",
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC",
    currency: "USD",
  },
  de: {
    label: "Deutsch",
    locale: "de-DE",
    direction: "ltr",
    dateFormat: "DD.MM.YYYY",
    timezone: "Europe/Berlin",
    currency: "EUR",
  },
  fr: {
    label: "French",
    locale: "fr-FR",
    direction: "ltr",
    dateFormat: "DD/MM/YYYY",
    timezone: "Europe/Paris",
    currency: "EUR",
  },
  "ku-sor": {
    label: "Kurdi-Sorani",
    locale: "ku-IQ",
    direction: "rtl",
    dateFormat: "YYYY/MM/DD",
    timezone: "Asia/Baghdad",
    currency: "IQD",
  },
  "ku-kur": {
    label: "Kurdi-Kermanji",
    locale: "ku-TR",
    direction: "ltr",
    dateFormat: "YYYY-MM-DD",
    timezone: "Europe/Istanbul",
    currency: "TRY",
  },
  fa: {
    locale: "fa-IR",
    label: "Persian",
    direction: "rtl",
    dateFormat: "YYYY/MM/DD",
    timezone: "Asia/Tehran",
    currency: "IRR",
  },
};

export interface LocalizationContextValue {
  language: LanguageKey;
  config: LanguageConfig;
  setLanguage: (lang: LanguageKey) => void;
}
