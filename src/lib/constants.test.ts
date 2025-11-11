import { describe, it, expect } from "vitest";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./constants";
import type { LanguageKey } from "@/providers/LocalizationProvider";

describe("Constants", () => {
  describe("SUPPORTED_LANGUAGES", () => {
    it("is an array", () => {
      expect(Array.isArray(SUPPORTED_LANGUAGES)).toBe(true);
    });

    it("contains expected language keys", () => {
      expect(SUPPORTED_LANGUAGES).toContain("en");
      expect(SUPPORTED_LANGUAGES).toContain("de");
      expect(SUPPORTED_LANGUAGES).toContain("fr");
      expect(SUPPORTED_LANGUAGES).toContain("ku-sor");
      expect(SUPPORTED_LANGUAGES).toContain("ku-kur");
      expect(SUPPORTED_LANGUAGES).toContain("fa");
    });

    it("has exactly 6 supported languages", () => {
      expect(SUPPORTED_LANGUAGES).toHaveLength(6);
    });

    it("contains only string values", () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        expect(typeof lang).toBe("string");
      });
    });

    it("does not contain duplicate languages", () => {
      const uniqueLangs = new Set(SUPPORTED_LANGUAGES);
      expect(uniqueLangs.size).toBe(SUPPORTED_LANGUAGES.length);
    });

    it("all languages are valid LanguageKey type", () => {
      const validLanguages: LanguageKey[] = [
        "en",
        "de",
        "fr",
        "ku-sor",
        "ku-kur",
        "fa",
      ];
      expect(SUPPORTED_LANGUAGES).toEqual(validLanguages);
    });
  });

  describe("DEFAULT_LANGUAGE", () => {
    it("is a string", () => {
      expect(typeof DEFAULT_LANGUAGE).toBe("string");
    });

    it("is set to English", () => {
      expect(DEFAULT_LANGUAGE).toBe("en");
    });

    it("is included in SUPPORTED_LANGUAGES", () => {
      expect(SUPPORTED_LANGUAGES).toContain(DEFAULT_LANGUAGE);
    });

    it("is a valid LanguageKey type", () => {
      const validLanguage: LanguageKey = DEFAULT_LANGUAGE;
      expect(validLanguage).toBe("en");
    });
  });

  describe("Integration", () => {
    it("DEFAULT_LANGUAGE is always in SUPPORTED_LANGUAGES", () => {
      expect(SUPPORTED_LANGUAGES.includes(DEFAULT_LANGUAGE)).toBe(true);
    });

    it("supports multiple languages with different scripts", () => {
      const hasLatin = SUPPORTED_LANGUAGES.some((lang) =>
        ["en", "de", "fr"].includes(lang),
      );
      const hasArabic = SUPPORTED_LANGUAGES.some((lang) => lang === "fa");
      const hasKurdish = SUPPORTED_LANGUAGES.some((lang) =>
        lang.startsWith("ku-"),
      );

      expect(hasLatin).toBe(true);
      expect(hasArabic).toBe(true);
      expect(hasKurdish).toBe(true);
    });
  });
});
