export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_NAME = 'cookie-preferences';
const COOKIE_EXPIRY_DAYS = 365;

export const getCookiePreferences = (): CookiePreferences | null => {
  if (typeof window === 'undefined') return null;

  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`${COOKIE_NAME}=`));

    if (!cookie) return null;

    const value = cookie.split('=')[1];
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
};

export const setCookiePreferences = (preferences: CookiePreferences): void => {
  if (typeof window === 'undefined') return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

  const cookieValue = encodeURIComponent(JSON.stringify(preferences));
  document.cookie = `${COOKIE_NAME}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};

export const hasCookieConsent = (): boolean => {
  return getCookiePreferences() !== null;
};

export const shouldShowCookieBanner = (): boolean => {
  // For GDPR compliance, show banner for EU users
  // In a real implementation, you'd check user's location
  // For now, we'll show it for all users as a best practice
  return !hasCookieConsent();
};

export const acceptAllCookies = (): void => {
  setCookiePreferences({
    essential: true,
    analytics: true,
    marketing: true,
  });
};

export const rejectAllCookies = (): void => {
  setCookiePreferences({
    essential: true, // Essential cookies are always enabled
    analytics: false,
    marketing: false,
  });
};

export const acceptSelectedCookies = (preferences: CookiePreferences): void => {
  setCookiePreferences({
    ...preferences,
    essential: true, // Essential cookies are always enabled
  });
};