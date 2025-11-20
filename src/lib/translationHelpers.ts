// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Translations = Record<string, any>;

/**
 * Get nested translation value using dot notation
 * Example: t('theme.dark') returns translations.theme.dark
 */
export function getTranslation(
  translations: Translations,
  key: string,
  fallback?: string,
): string {
  const keys = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return fallback || key;
    }
  }

  return typeof value === "string" ? value : fallback || key;
}
