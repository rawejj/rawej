import { describe, it, expect, beforeEach, vi } from "vitest";
import { getTranslations, generateMetadata } from "@/lib/metadata";
import type { LanguageKey } from "@/providers/LocalizationProvider";

// Type for Twitter metadata to avoid 'any' usage
type TwitterMetadataWithCard = {
  card?: string;
  title?: string;
  description?: string;
};

vi.mock("@/../public/locales/en.json", () => ({
  default: {
    meta: {
      title: "Doctor Appointment Booking",
      description: "Book appointments with professional doctors",
      keywords: "doctor, appointment, booking",
    },
  },
}));

vi.mock("@/../public/locales/de.json", () => ({
  default: {
    meta: {
      title: "Arztermin-Buchung",
      description: "Vereinbaren Sie Termine mit professionellen Ärzten",
      keywords: "Arzt, Termin, Buchung",
    },
  },
}));

vi.mock("@/../public/locales/fa.json", () => ({
  default: {
    meta: {
      title: "رزرو نوبت پزشکی",
      description: "رزرو نوبت با پزشکان حرفه‌ای",
      keywords: "پزشک، نوبت، رزرو",
    },
  },
}));

describe("Metadata Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";
  });

  describe("getTranslations", () => {
    it("loads English translations successfully", async () => {
      const translations = await getTranslations("en");

      expect(translations.meta).toBeDefined();
      expect(translations.meta.title).toBe("Doctor Appointment Booking");
      expect(translations.meta.description).toBe(
        "Book appointments with professional doctors",
      );
    });

    it("loads German translations successfully", async () => {
      const translations = await getTranslations("de");

      expect(translations.meta).toBeDefined();
      expect(translations.meta.title).toBe("Arztermin-Buchung");
    });

    it("loads Persian translations successfully", async () => {
      const translations = await getTranslations("fa");

      expect(translations.meta).toBeDefined();
      expect(translations.meta.title).toBe("رزرو نوبت پزشکی");
    });

    it("falls back to English for unsupported language", async () => {
      const translations = await getTranslations("unsupported" as LanguageKey);

      expect(translations.meta.title).toBe("Doctor Appointment Booking");
    });

    it("returns translations object with meta property", async () => {
      const translations = await getTranslations("en");

      expect(translations).toHaveProperty("meta");
      expect(typeof translations.meta).toBe("object");
    });
  });

  describe("generateMetadata", () => {
    it("generates metadata for English", async () => {
      const metadata = await generateMetadata("en");

      expect(metadata.title).toBe("Doctor Appointment Booking");
      expect(metadata.description).toBe(
        "Book appointments with professional doctors",
      );
      expect(metadata.keywords).toBe("doctor, appointment, booking");
    });

    it("generates metadata for German", async () => {
      const metadata = await generateMetadata("de");

      expect(metadata.title).toBe("Arztermin-Buchung");
      expect(metadata.description).toBe(
        "Vereinbaren Sie Termine mit professionellen Ärzten",
      );
    });

    it("includes OpenGraph metadata", async () => {
      const metadata = await generateMetadata("en");

      expect(metadata.openGraph).toBeDefined();
      expect(metadata.openGraph?.title).toBe("Doctor Appointment Booking");
      expect(metadata.openGraph?.description).toBe(
        "Book appointments with professional doctors",
      );
    });

    it("sets correct OpenGraph locale", async () => {
      const metadata = await generateMetadata("fa");

      expect(metadata.openGraph?.locale).toBe("fa");
    });

    it("includes Twitter metadata", async () => {
      const metadata = await generateMetadata("en");

      expect(metadata.twitter).toBeDefined();
      expect((metadata.twitter as TwitterMetadataWithCard).card).toBe(
        "summary_large_image",
      );
      expect((metadata.twitter as TwitterMetadataWithCard).title).toBe(
        "Doctor Appointment Booking",
      );
      expect((metadata.twitter as TwitterMetadataWithCard).description).toBe(
        "Book appointments with professional doctors",
      );
    });

    it("sets correct OpenGraph URL", async () => {
      const metadata = await generateMetadata("en");

      expect(metadata.openGraph?.url).toBe("https://example.com/en");
    });

    it("sets correct canonical URL", async () => {
      const metadata = await generateMetadata("de");

      expect(metadata.alternates?.canonical).toBe("https://example.com/de");
    });

    it("generates alternate language URLs", async () => {
      const metadata = await generateMetadata("en");

      expect(metadata.alternates?.languages).toBeDefined();
      const languages = metadata.alternates?.languages as Record<
        string,
        string
      >;
      expect(languages?.en).toBe("https://example.com/en");
      expect(languages?.de).toBe("https://example.com/de");
      expect(languages?.fr).toBe("https://example.com/fr");
      expect(languages?.fa).toBe("https://example.com/fa");
    });

    it("includes all 6 supported languages in alternates", async () => {
      const metadata = await generateMetadata("en");

      const languages = metadata.alternates?.languages as Record<
        string,
        string
      >;
      const supportedLanguages = ["en", "de", "fr", "ku-sor", "ku-kur", "fa"];

      for (const lang of supportedLanguages) {
        expect(languages?.[lang]).toBeDefined();
        expect(languages?.[lang]).toBe(`https://example.com/${lang}`);
      }
    });

    it("uses NEXT_PUBLIC_APP_URL environment variable", async () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://custom-url.com";

      const metadata = await generateMetadata("en");

      expect(metadata.openGraph?.url).toBe("https://custom-url.com/en");
      expect(metadata.alternates?.canonical).toBe("https://custom-url.com/en");
    });

    it("defaults to localhost when NEXT_PUBLIC_APP_URL not set", async () => {
      delete process.env.NEXT_PUBLIC_APP_URL;

      const metadata = await generateMetadata("en");

      expect(metadata.openGraph?.url).toContain("localhost:3000/en");
      expect(metadata.alternates?.canonical).toContain("localhost:3000/en");
    });

    it("sets siteName from translation title", async () => {
      const metadata = await generateMetadata("en");

      expect(metadata.openGraph?.siteName).toBe("Doctor Appointment Booking");
    });

    it("returns metadata object with all required properties", async () => {
      const metadata = await generateMetadata("en");

      expect(metadata).toHaveProperty("title");
      expect(metadata).toHaveProperty("description");
      expect(metadata).toHaveProperty("keywords");
      expect(metadata).toHaveProperty("openGraph");
      expect(metadata).toHaveProperty("twitter");
      expect(metadata).toHaveProperty("alternates");
    });

    it("handles multiple language metadata generation", async () => {
      const enMetadata = await generateMetadata("en");
      const deMetadata = await generateMetadata("de");

      expect(enMetadata.title).not.toBe(deMetadata.title);
      expect(enMetadata.openGraph?.locale).toBe("en");
      expect(deMetadata.openGraph?.locale).toBe("de");
    });
  });

  describe("Integration", () => {
    it("generateMetadata uses correct translations", async () => {
      const translations = await getTranslations("en");
      const metadata = await generateMetadata("en");

      expect(metadata.title).toBe(translations.meta.title);
      expect(metadata.description).toBe(translations.meta.description);
      expect(metadata.keywords).toBe(translations.meta.keywords);
    });

    it("handles language-specific RTL support in metadata", async () => {
      const faMetadata = await generateMetadata("fa");

      expect(faMetadata.openGraph?.locale).toBe("fa");
      expect(faMetadata.alternates?.languages?.fa).toContain("/fa");
    });

    it("preserves translation content with special characters", async () => {
      const metadata = await generateMetadata("fa");

      expect(metadata.title).toContain("پزشکی");
      expect(metadata.openGraph?.title).toContain("پزشکی");
    });
  });
});
