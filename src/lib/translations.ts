import 'server-only';

import { LanguageKey } from '@/providers/LocalizationProvider';
import { readFile } from 'fs/promises';
import { join } from 'path';

export type { Translations } from './translationHelpers';
export { getTranslation } from './translationHelpers';

/**
 * Load translations for server components
 * This runs on the server and loads translation files from the file system
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadTranslations(lang: LanguageKey): Promise<Record<string, any>> {
  try {
    const filePath = join(process.cwd(), 'public', 'locales', `${lang}.json`);
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    console.warn(`Failed to load translations for ${lang}, falling back to English`);
    try {
      const fallbackPath = join(process.cwd(), 'public', 'locales', 'en.json');
      const fallbackContent = await readFile(fallbackPath, 'utf-8');
      return JSON.parse(fallbackContent);
    } catch (fallbackError) {
      console.error('Failed to load fallback translations:', fallbackError);
      return {};
    }
  }
}
