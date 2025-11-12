import { LanguageKey } from "@/providers/LocalizationProvider";

export const IS_DEV = process.env.NODE_ENV === "development";

/**
 * Supported languages in the application
 */
export const SUPPORTED_LANGUAGES: LanguageKey[] = [
  "en",
  "de",
  "fr",
  "ku-sor",
  "ku-kur",
  "fa",
];

/**
 * Default language
 */
export const DEFAULT_LANGUAGE: LanguageKey = "en";
