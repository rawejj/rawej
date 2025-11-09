import ErrorMessage from "@/components/ErrorMessage";
import Footer from "@/components/Footer";
import { httpClient } from "@/utils/http-client";
import BookingSection, { Doctor } from "@/components/BookingSection";

type DoctorsApiResponse = {
  success: boolean;
  data: Doctor[];
  total?: number;
  page?: number;
  perPage?: number;
  pageCount?: number;
};

// Enable ISR: revalidate in the background
export const revalidate = parseInt(process.env.ISR_REVALIDATE || '60', 10);

export default async function Home({ params }: { params: { lang: string } }) {
  // Fetch doctors server-side with caching
  let doctors: Doctor[] = [];
  let error: string | null = null;
  try {
    const revalidateTime = parseInt(process.env.ISR_REVALIDATE || '60', 10);
    const res = await httpClient<DoctorsApiResponse>(`${process.env.NEXT_API_URL}/doctors?page=1&limit=9`, { 
      next: { tags: ['doctors'], revalidate: revalidateTime }
    });
    if (res && res.success && Array.isArray(res.data)) {
      doctors = res.data;
    } else {
      throw new Error(`Doctors data is not an array. Response: ${JSON.stringify(res)}`);
    }
  } catch (err) {
    console.error('Doctors API error:', err);
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = "Unknown error fetching doctors.";
    }
  }

  // Use language param for SSR, fallback to 'en'
  const lang = (params.lang || 'en') as string;

  // Load translations from public/locales/{lang}.json, fallback to English
  let translations: Record<string, string> = {};
  let enTranslations: Record<string, string> = {};
  try {
    const url = `/locales/${lang}.json`;
    const res = await fetch(url);
    console.log('Fetching translations from:', url);
    if (res.ok) {
      translations = await res.json();
    } else {
      console.warn(`Could not find translations for ${lang} at ${url}`);
    }
  } catch (err) {
    console.warn(`Could not load translations for ${lang}:`, err);
  }
  // Always load English as fallback
  try {
    const enRes = await fetch('/locales/en.json');
    if (enRes.ok) {
      enTranslations = await enRes.json();
    }
  } catch (err) {
    console.warn('Could not load fallback English translations:', err);
  }
  // Merge: fallback to English for missing keys
  const mergedTranslations = { ...enTranslations, ...translations };

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 font-sans">
      <main className="flex-1">
        {error ? (
          <ErrorMessage error={error} translations={mergedTranslations} />
        ) : (
          <BookingSection doctors={doctors} translations={mergedTranslations} locale={lang} />
        )}
      </main>
      <Footer translations={mergedTranslations} />
    </div>
  );
}
