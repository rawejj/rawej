import Header from "@/components/Header";
import ErrorMessage from "@/components/ErrorMessage";
import Footer from "@/components/Footer";

import { httpClient } from "@/utils/http-client";
import BookingSection, { Doctor } from "@/components/BookingSection";

type DoctorsApiResponse = {
  success: boolean;
  data: Doctor[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
  source?: string;
};

// Enable ISR: revalidate in the background
export const revalidate = parseInt(process.env.ISR_REVALIDATE || '60', 10);

export default async function Home() {
  // Fetch doctors server-side with caching
  let doctors: Doctor[] = [];
  let error: string | null = null;
  try {
    const revalidateTime = parseInt(process.env.ISR_REVALIDATE || '60', 10);
    const res = await httpClient(`${process.env.NEXT_API_URL}/doctors?page=1&limit=9`, { 
      next: { tags: ['doctors'], revalidate: revalidateTime }
    });
    if (typeof res === "object" && res !== null && "success" in res && "data" in res && Array.isArray((res as DoctorsApiResponse).data)) {
      doctors = (res as DoctorsApiResponse).data;
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
  return (
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
  );
}
