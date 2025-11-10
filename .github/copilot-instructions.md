# Copilot Instructions for Doctor App

## Project Overview
- **Framework:** Next.js 13+ (App Router)
- **Purpose:** Doctor listing, booking, and management with localization, theme switching, and robust error handling.
- **Architecture:** Server-first localization, modular React components, API routes, and mock data support.

## Key Patterns & Conventions
- **Localization:**
  - Translations loaded server-side (`src/lib/translations.ts`), provided to clients via React Context (`TranslationsProvider`).
  - Use `useTranslations()` hook in client components for localized strings.
  - Language is set via URL (`/[lang]`), triggers server translation reload.
  - Translation files: `public/locales/{lang}.json`.
- **Theme:**
  - Dark/light mode toggled via context (`ThemeProvider`).
- **API & Data:**
  - API routes in `src/app/api/v1/` (e.g., `doctors/route.ts`).
  - Token management and refresh in `src/utils/auth.ts`.
  - Mock data fallback enabled with `ENABLE_MOCK_FALLBACK=true` in `.env`.
- **UI Components:**
  - Place tests next to components (e.g., `DoctorCard.tsx` & `DoctorCard.test.tsx`).
  - Use skeleton loaders for async data, IntersectionObserver for infinite scroll.
  - Default doctor image: `public/images/default-doctor.svg`.
- **RTL/LTR Support:**
  - RTL languages (e.g., Persian, Kurdish Sorani) handled via language constants and CSS.

## Developer Workflows
- **Install:** `npm install`
- **Dev Server:** `npm run dev` (http://localhost:3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Test:** `npm test` (unit/integration)
- **Coverage:** `npm run test:coverage` (see `coverage/lcov-report/index.html`)
- **Environment:** Copy `.env.dist` to `.env` and configure endpoints.

## File Structure Highlights
- `src/app/` — App entry, routing, API endpoints
- `src/components/` — UI components and tests
- `src/lib/` — Translation loader, constants
- `src/providers/` — Context providers for localization and theme
- `src/utils/` — Auth, caching, helpers
- `public/locales/` — Translation JSON files
- `public/images/` — Static assets

## Example: Localization Usage
```tsx
// Server component
import { loadTranslations } from '@/lib/translations';
import { TranslationsProvider } from '@/providers/TranslationsProvider';

export default async function Page({ params }) {
  const translations = await loadTranslations(params.lang);
  return <TranslationsProvider translations={translations}>{/* ... */}</TranslationsProvider>;
}

// Client component
'use client';
import { useTranslations } from '@/providers/TranslationsProvider';
const { t } = useTranslations();
```

## Integration Points
- **API:** `/src/app/api/v1/doctors/route.ts` (pagination, token, mock fallback)
- **Localization:** `/src/lib/translations.ts`, `/src/providers/TranslationsProvider.tsx`
- **Theme:** `/src/providers/ThemeProvider.tsx`
- **Testing:** Place `.test.ts(x)` files next to source; use React Testing Library

## Tips for AI Agents
- Follow file placement conventions for new features/tests.
- Use server-first localization and context providers for translations.
- Respect RTL/LTR settings based on language.
- Use mock data for local development/testing.
- Reference docs in `/docs/` for deeper details.

---
For questions or missing details, see `/docs/DEV_GUIDE.md`, `/docs/LOCALIZATION.md`, and `/README.md`.
