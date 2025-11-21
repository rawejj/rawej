# Cookie Consent System

## Overview

The Doctor App includes a comprehensive GDPR-compliant cookie consent system that provides users with granular control over their privacy preferences. The system supports multiple cookie categories, multi-language support, and integrates seamlessly with Google Analytics and Search Console.

## Features

- **GDPR Compliance**: Full compliance with EU cookie regulations
- **Granular Consent**: Essential, Analytics, and Marketing cookie categories
- **Multi-language Support**: Translations for German, English, French, Kurdish (Sorani & Kurmanji), and Persian
- **Modern UI**: Beautiful gradient design with smooth animations
- **SSR Safe**: Prevents hydration mismatches in Next.js
- **Google Integration**: Conditional loading of Google Analytics and Search Console
- **Persistent Storage**: Preferences saved in localStorage and HTTP cookies
- **Consent Withdrawal**: Easy-to-access settings for changing preferences

## Architecture

### Core Components

#### `CookieConsentProvider`
- **Location**: `src/providers/CookieConsentProvider.tsx`
- **Purpose**: Context provider managing cookie preferences and banner visibility
- **Features**:
  - Lazy state initialization for SSR safety
  - Hydration-safe banner rendering
  - Consent state management

#### `CookieConsent` Component
- **Location**: `src/components/CookieConsent.tsx`
- **Purpose**: Main cookie consent banner UI
- **Features**:
  - Modern gradient design with animations
  - Category-based consent controls
  - Mobile-responsive layout
  - Accessibility compliant

#### `ClientLayout` Component
- **Location**: `src/components/ClientLayout.tsx`
- **Purpose**: Client-side wrapper for SSR compatibility
- **Features**:
  - Isolates client components from server rendering
  - Prevents hydration mismatches

### Utility Functions

#### Cookie Management
- **Location**: `src/utils/cookieConsent.ts`
- **Functions**:
  - `getCookiePreferences()`: Retrieves stored preferences
  - `shouldShowCookieBanner()`: Determines if banner should display
  - `acceptAllCookies()`: Accepts all cookie categories
  - `rejectAllCookies()`: Rejects non-essential cookies
  - `acceptSelectedCookies()`: Accepts specific categories

#### Google Services Integration
- **Location**: `src/components/GoogleAnalytics.tsx`
- **Purpose**: Conditional Google Analytics 4 loading
- **Location**: `src/components/GoogleSearchConsole.tsx`
- **Purpose**: Search Console verification meta tag

## Cookie Categories

### Essential Cookies
- **Always Active**: Cannot be disabled
- **Purpose**: Core functionality (authentication, security, user preferences)
- **Storage**: Session and persistent cookies
- **Legal Basis**: Legitimate interest

### Analytics Cookies
- **User Consent Required**: Must be explicitly accepted
- **Purpose**: Website usage analytics and performance monitoring
- **Services**: Google Analytics 4, performance tracking
- **Legal Basis**: User consent

### Marketing Cookies
- **User Consent Required**: Must be explicitly accepted
- **Purpose**: Advertising, retargeting, and marketing analytics
- **Services**: Advertising pixels, social media tracking
- **Legal Basis**: User consent

## Implementation Guide

### Basic Usage

The cookie consent system is automatically integrated into the app layout. No additional setup is required for basic usage.

```tsx
// The system is already integrated in src/app/[lang]/layout.tsx
import ClientLayout from '@/components/ClientLayout';

export default function LangLayout({ children }: { children: ReactNode }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
```

### Using Cookie Preferences in Components

```tsx
import { useCookieConsent } from '@/providers/CookieConsentProvider';

function MyComponent() {
  const { preferences, acceptAll, rejectAll, acceptSelected } = useCookieConsent();

  // Check if analytics cookies are accepted
  const canLoadAnalytics = preferences?.analytics;

  return (
    <div>
      {canLoadAnalytics && <GoogleAnalytics />}
      <button onClick={acceptAll}>Accept All Cookies</button>
      <button onClick={rejectAll}>Reject Non-Essential</button>
    </div>
  );
}
```

### Conditional Script Loading

```tsx
// Example: Conditional Google Analytics loading
import { useCookieConsent } from '@/providers/CookieConsentProvider';

function AnalyticsWrapper() {
  const { preferences } = useCookieConsent();

  // Only load if user consented to analytics
  if (!preferences?.analytics) {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        `}
      </Script>
    </>
  );
}
```

## Configuration

### Environment Variables

```env
# Google Analytics Measurement ID
NEXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID

# Google Search Console Verification
NEXT_PUBLIC_GSC_ID=verification_code
```

### Customization Options

#### Styling
The cookie consent banner uses Tailwind CSS classes and can be customized by modifying `src/components/CookieConsent.tsx`.

#### Translations
Cookie consent text is managed through the translation system in `public/locales/`. Add new languages by creating new JSON files.

#### Cookie Settings
Modify cookie categories and settings in `src/utils/cookieConsent.ts`.

## Technical Details

### SSR Safety
The system prevents hydration mismatches by:
- Using lazy state initialization with `typeof window` checks
- Rendering banner only after client-side hydration
- Storing initial state safely on both server and client

### Storage Strategy
- **Primary**: localStorage for client-side persistence
- **Fallback**: HTTP cookies for server-side access
- **Redundancy**: Both storage methods ensure preference persistence

### Performance Considerations
- Banner only renders when needed (first visit or preference changes)
- Google services load conditionally based on consent
- Minimal impact on page load performance

## Testing

### Unit Tests
Cookie consent components include comprehensive test coverage:

```bash
# Run all tests
npm test

# Run specific cookie consent tests
npm test -- --testPathPattern=CookieConsent
```

### Manual Testing Checklist
- [ ] Banner appears on first visit
- [ ] All consent options work correctly
- [ ] Preferences persist across sessions
- [ ] Google Analytics loads only with consent
- [ ] Multi-language support works
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

## Best Practices

### GDPR Compliance
- Always provide clear, concise information about cookie usage
- Never pre-check non-essential cookie options
- Allow easy withdrawal of consent
- Keep detailed consent logs for audit purposes

### User Experience
- Make consent banner prominent but non-intrusive
- Use simple, non-technical language
- Provide clear explanations for each cookie category
- Ensure mobile-friendly design

### Technical Maintenance
- Regularly audit cookies used on the site
- Update consent text when adding new tracking
- Monitor consent rates and user behavior
- Keep dependencies updated for security

## Troubleshooting

### Common Issues

#### Hydration Mismatch Errors
**Symptoms**: Console errors about server/client rendering differences
**Solution**: Ensure all state initialization checks `typeof window`

#### Banner Not Appearing
**Symptoms**: Cookie banner doesn't show on first visit
**Solution**: Check `shouldShowCookieBanner()` logic and localStorage state

#### Google Analytics Not Loading
**Symptoms**: GA scripts don't load despite consent
**Solution**: Verify consent state and script loading conditions

#### Translation Issues
**Symptoms**: Cookie text shows in wrong language
**Solution**: Check translation files and language detection logic

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## API Reference

### CookieConsentProvider Props
```tsx
interface CookieConsentProviderProps {
  children: ReactNode;
}
```

### CookieConsentContext Value
```tsx
interface CookieConsentContextValue {
  preferences: CookiePreferences | null;
  showBanner: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  acceptSelected: (preferences: CookiePreferences) => void;
}
```

### CookiePreferences Interface
```tsx
interface CookiePreferences {
  essential: boolean;  // Always true
  analytics: boolean;
  marketing: boolean;
}
```

## Contributing

When modifying the cookie consent system:

1. **Test SSR compatibility** - Ensure no hydration mismatches
2. **Update translations** - Add new text to all language files
3. **Maintain compliance** - Verify GDPR requirements are met
4. **Update documentation** - Keep this guide current
5. **Add tests** - Cover new functionality with unit tests

## Related Documentation

- [GDPR Compliance Guide](./GDPR.md)
- [Privacy Policy](./PRIVACY.md)
- [Google Analytics Setup](./ANALYTICS.md)
- [Internationalization](./LOCALIZATION.md)

---

For questions or issues with the cookie consent system, please refer to the main README or create an issue in the repository.