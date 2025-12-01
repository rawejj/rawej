import ErrorMessage from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import { httpClient } from "@/utils/http-client";
import { generateMetadata as generatePageMetadata } from "@/lib/metadata";
import { LanguageKey } from "@/providers/LocalizationProvider";
import { DEFAULT_LANGUAGE } from "@/lib/constants";
import { logger } from "@/utils/logger";
import { CONFIGS } from "@/constants/configs";
import { PaginatedResponse } from "@/utils/api-response";
import { Doctor } from "@/types/doctor";
import BookingSection from "@/components/BookingSection";
import { CookieConsentProvider } from "@/providers/CookieConsentProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleSearchConsole from "@/components/GoogleSearchConsole";

interface PageParams {
  params: Promise<{ lang: string }>;
}

/**
 * Fetches doctors from the API with error handling and caching
 * @returns Tuple of [doctors, error]
 */
async function fetchDoctors(): Promise<[Doctor[], string | null]> {
  try {
    const apiUrl = CONFIGS.app.apiUrl;
    
    if (!apiUrl) {
      const errorMsg = "NEXT_PUBLIC_API_URL is not configured";
      logger.error(new Error(errorMsg), "HomePage - fetchDoctors");
      return [[], errorMsg];
    }

    const url = `${apiUrl}/users?page=1&limit=${CONFIGS.pagination.doctorsPerPage}`;
    logger.debug(`Fetching doctors from ${url}`, "HomePage");

    const response = await httpClient<PaginatedResponse>(url, {
      next: {
        tags: ["doctors"],
        revalidate: CONFIGS.isr.revalidateTime,
      },
    });

    // Validate response structure
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format from doctors API");
    }

    if (!response.success) {
      throw new Error("API returned unsuccessful response");
    }

    if (!Array.isArray(response.items)) {
      throw new Error(
        `Expected doctors items to be an array, got: ${typeof response.items}`
      );
    }

    logger.info(
      `Successfully fetched ${response.items.length} doctors`,
      "HomePage"
    );

    return [response.items as Doctor[], null];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error fetching doctors";

    logger.error(error, "HomePage - fetchDoctors");
    
    return [[], errorMessage];
  }
}

/**
 * Validates and normalizes the language parameter
 * @param langParam - Raw language parameter from URL
 * @returns Validated language key
 */
function getValidatedLanguage(langParam: string): LanguageKey {
  return (langParam || DEFAULT_LANGUAGE) as LanguageKey;
}

// ============================================================================
// Metadata
// ============================================================================

/**
 * Generate metadata for SEO
 * @param params - Page parameters containing language
 * @returns Metadata object for the page
 */
export async function generateMetadata({ params }: PageParams) {
  const { lang: rawLang } = await params;
  const lang = getValidatedLanguage(rawLang);
  
  return generatePageMetadata(lang);
}

// ============================================================================
// Page Component
// ============================================================================

/**
 * Home page component - displays list of doctors with booking functionality
 * Implements ISR (Incremental Static Regeneration) for optimal performance
 * 
 * Features:
 * - Server-side data fetching with caching
 * - Error handling and fallback UI
 * - SEO metadata generation
 * - Responsive design with dark mode support
 */
export default async function Home() {
  // Fetch doctors server-side with ISR caching
  const [doctors, error] = await fetchDoctors();

  return (
    <CookieConsentProvider>
      <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 font-sans">
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
  );
}
