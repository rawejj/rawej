# Localization Architecture

## Overview

This project uses **server-side first** localization following Next.js 13+ App Router best practices. Translations are loaded on the server and provided to client components through React Context.

## Architecture

### Server Components (RSC)

- Load translations from file system using `loadTranslations(lang)`
- Pass translations to client via `TranslationsProvider`
- No JavaScript overhead for translation loading

### Client Components

- Receive translations via React Context
- Use `useTranslations()` hook to access translations
- Support nested keys with dot notation (e.g., `t('theme.dark')`)

## File Structure

```
src/
├── lib/
│   ├── translations.ts          # Server-side translation loader
│   └── constants.ts              # Language constants
├── providers/
│   ├── LocalizationProvider.tsx  # Shared types and context definition
│   ├── TranslationsProvider.tsx  # Client provider for translations
│   └── LocalizationClientProvider.tsx  # URL-based language routing
└── app/
    └── [lang]/
        └── page.tsx              # Server component loading translations
```

## Usage Examples

### Server Component

```tsx
import { loadTranslations } from "@/lib/translations";
import { TranslationsProvider } from "@/providers/TranslationsProvider";

export default async function Page({ params }: { params: { lang: string } }) {
  const translations = await loadTranslations(params.lang as LanguageKey);

  return (
    <TranslationsProvider translations={translations}>
      <YourClientComponents />
    </TranslationsProvider>
  );
}
```

### Client Component

```tsx
"use client";

import { useTranslations } from "@/providers/TranslationsProvider";

export function MyComponent() {
  const { t } = useTranslations();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <button>{t("theme.dark")}</button>
    </div>
  );
}
```

## Translation Files

Located in `public/locales/{lang}.json`:

```json
{
  "welcome": "Welcome",
  "theme": {
    "light": "Light",
    "dark": "Dark",
    "system": "System"
  }
}
```

## Benefits

✅ **Performance**: Translations loaded once on server  
✅ **SEO**: Full content in initial HTML  
✅ **Type Safety**: TypeScript support throughout  
✅ **Simple**: No complex i18n library configuration  
✅ **Server-First**: Aligns with Next.js 13+ philosophy  
✅ **Flexible**: Supports nested translation keys

## Language Switching

Language changes update the URL (`/en`, `/de`, `/fr`, etc.) and trigger a page navigation, loading new translations from the server.

## Supported Languages

- English (en) - LTR
- German (de) - LTR
- French (fr) - LTR
- Kurdish Sorani (ku-sor) - RTL
- Kurdish Kurmanji (ku-kur) - LTR
- Persian (fa) - RTL
