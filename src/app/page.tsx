import ErrorMessage from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { DEFAULT_LANGUAGE } from "@/lib/constants";
import { loadTranslations } from "@/lib/translations";
import { TranslationsProvider } from "@/providers/TranslationsProvider";
import { CookieConsentProvider } from "@/providers/CookieConsentProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleSearchConsole from "@/components/GoogleSearchConsole";
import { CONFIGS } from "@/constants/configs";
import BookingSection from "@/components/BookingSection";
import { fetchDoctors } from "@/lib/doctors";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Always use default language (English)
  const translations = await loadTranslations(DEFAULT_LANGUAGE);
  
  // Fetch doctors server-side with ISR caching
  const [doctors, error] = await fetchDoctors();

  return (
    <TranslationsProvider translations={translations}>
      <CookieConsentProvider>
        <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 font-sans">
          <Header />
          <main className="flex-1">
            {error ? (
              <ErrorMessage error={error} />
            ) : (
              <BookingSection doctors={doctors} />
            )}
          </main>
          <Footer />
        </div>
        {CONFIGS.analytics.gaMeasurementId && (
          <GoogleAnalytics measurementId={CONFIGS.analytics.gaMeasurementId} />
        )}
        {CONFIGS.analytics.gscVerificationCode && (
          <GoogleSearchConsole verificationCode={CONFIGS.analytics.gscVerificationCode} />
        )}
      </CookieConsentProvider>
    </TranslationsProvider>
  );
}
