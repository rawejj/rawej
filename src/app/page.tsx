import ErrorMessage from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { httpClient } from "@/utils/http-client";
import { DEFAULT_LANGUAGE } from "@/lib/constants";
import { loadTranslations } from "@/lib/translations";
import { TranslationsProvider } from "@/providers/TranslationsProvider";
import { CookieConsentProvider } from "@/providers/CookieConsentProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleSearchConsole from "@/components/GoogleSearchConsole";
import { CONFIGS } from "@/constants/configs";
import { logger } from "@/utils/logger";
import { PaginatedResponse } from "@/utils/api-response";
import { Doctor } from "@/types/doctor";
import BookingSection from "@/components/BookingSection";

// Enable ISR: revalidate in the background
export const revalidate = 60;

export default async function Home() {
  // Always use default language (English)
  const translations = await loadTranslations(DEFAULT_LANGUAGE);

  // Fetch doctors server-side with caching
  let doctors: Doctor[] = [];
  let error: string | null = null;
  try {
    const res = await httpClient(
      `${CONFIGS.app.apiUrl}/users?page=1&limit=${CONFIGS.pagination.doctorsPerPage}`,
      {
        next: { tags: ["doctors"], revalidate: CONFIGS.isr.revalidateTime },
      },
    );
    if (
      typeof res === "object" &&
      res !== null &&
      "success" in res &&
      "items" in res &&
      Array.isArray((res as PaginatedResponse).items)
    ) {
      doctors = (res as PaginatedResponse).items as Doctor[];
    } else {
      throw new Error(
        `Doctors items is not an array. Response: ${JSON.stringify(res)}`,
      );
    }
  } catch (err) {
    logger.error(err, "Doctors API fetch error");
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "Unknown error fetching doctors.";
    }
  }
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
