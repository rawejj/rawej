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
export const DEFAULT_LANGUAGE: LanguageKey = (process.env.NEXT_PUBLIC_FALLBACK_LANGUAGE as LanguageKey) || "en";

/**
 * Jalali (Persian) month names
 */
export const JALALI_MONTHS: Record<string, string> = {
  "01": "فروردین",
  "02": "اردیبهشت",
  "03": "خرداد",
  "04": "تیر",
  "05": "مرداد",
  "06": "شهریور",
  "07": "مهر",
  "08": "آبان",
  "09": "آذر",
  "10": "دی",
  "11": "بهمن",
  "12": "اسفند",
};
