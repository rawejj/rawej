import { describe, it, expect, vi } from "vitest";
import {
  formatDateJalali,
  formatDateGeneric,
  formatDate,
} from "@/utils/dateFormatter";
import type { TranslationFunction } from "@/utils/dateFormatter";

describe("dateFormatter utilities", () => {
  const mockTranslation: TranslationFunction = (key: string) => {
    const translations: Record<string, string> = {
      "weekdays.sun": "یکشنبه",
      "weekdays.mon": "دوشنبه",
      "weekdays.tue": "سه‌شنبه",
      "weekdays.wed": "چهارشنبه",
      "weekdays.thu": "پنج‌شنبه",
      "weekdays.fri": "جمعه",
      "weekdays.sat": "شنبه",
    };
    return translations[key] || key;
  };

  describe("formatDateJalali", () => {
    it("converts Gregorian date to Jalali format", () => {
      // 2025-11-20 should map to Jalali date
      const result = formatDateJalali("2025-11-20", mockTranslation);

      expect(result).toHaveProperty("displayText");
      expect(result).toHaveProperty("subText");
      expect(result.displayText).toMatch(/^\S+ \d{2}$/); // "weekday DD"
      expect(result.subText).toMatch(/^\S+ \d{4}$/); // "month YYYY"
    });

    it("pads day and month numbers with leading zeros", () => {
      const result = formatDateJalali("2025-01-05", mockTranslation);

      // Check that the day number is padded
      const dayPart = result.displayText.split(" ")[1];
      expect(dayPart).toMatch(/^\d{2}$/);
    });

    it("returns correct weekday translation", () => {
      const result = formatDateJalali("2025-11-20", mockTranslation);

      // The display text should contain a translated weekday
      const weekdayPart = result.displayText.split(" ")[0];
      expect(weekdayPart).toMatch(/یکشنبه|دوشنبه|سه‌شنبه|چهارشنبه|پنج‌شنبه|جمعه|شنبه/);
    });

    it("returns two-part format with month name and year", () => {
      const result = formatDateJalali("2025-11-20", mockTranslation);

      const subTextParts = result.subText.split(" ");
      expect(subTextParts.length).toBeGreaterThanOrEqual(2);
      // Last part should be year (4 digits)
      expect(subTextParts[subTextParts.length - 1]).toMatch(/^\d{4}$/);
    });

    it("handles different months correctly", () => {
      const result1 = formatDateJalali("2025-01-15", mockTranslation);
      const result2 = formatDateJalali("2025-06-15", mockTranslation);
      const result3 = formatDateJalali("2025-12-15", mockTranslation);

      expect(result1.subText).not.toBe(result2.subText);
      expect(result2.subText).not.toBe(result3.subText);
    });
  });

  describe("formatDateGeneric", () => {
    it("returns full label as displayText when parts < 3", () => {
      const result = formatDateGeneric("Monday 23");

      expect(result.displayText).toBe("Monday 23");
      expect(result.subText).toBe("");
    });

    it("splits label into displayText and subText when parts >= 3", () => {
      const result = formatDateGeneric("Monday 23 November 2025");

      expect(result.displayText).toBe("Monday 23");
      expect(result.subText).toBe("November 2025");
    });

    it("joins all parts after index 2 into subText", () => {
      const result = formatDateGeneric("Day 15 Month Name Long Year");

      expect(result.displayText).toBe("Day 15");
      expect(result.subText).toBe("Month Name Long Year");
    });

    it("handles single part label", () => {
      const result = formatDateGeneric("Today");

      expect(result.displayText).toBe("Today");
      expect(result.subText).toBe("");
    });

    it("handles two part label", () => {
      const result = formatDateGeneric("Monday 15");

      expect(result.displayText).toBe("Monday 15");
      expect(result.subText).toBe("");
    });

    it("handles exact three part label", () => {
      const result = formatDateGeneric("Monday 15 November");

      expect(result.displayText).toBe("Monday 15");
      expect(result.subText).toBe("November");
    });

    it("preserves spacing in multi-word subText", () => {
      const result = formatDateGeneric("Mon 15 November 2025 Evening");

      expect(result.subText).toBe("November 2025 Evening");
    });
  });

  describe("formatDate", () => {
    it("uses formatDateJalali for Farsi language", () => {
      const result = formatDate(
        "2025-11-20",
        "Monday 20 November",
        "fa",
        mockTranslation,
      );

      // Should be in Jalali format, not the English label
      expect(result.displayText).not.toContain("Monday");
      expect(result.displayText).toMatch(/^\S+ \d{2}$/);
    });

    it("uses formatDateGeneric for English language", () => {
      const result = formatDate(
        "2025-11-20",
        "Monday 20 November 2025",
        "en",
        mockTranslation,
      );

      expect(result.displayText).toBe("Monday 20");
      expect(result.subText).toBe("November 2025");
    });

    it("uses formatDateGeneric for other languages", () => {
      const result = formatDate(
        "2025-11-20",
        "Monday 20 November 2025",
        "de",
        mockTranslation,
      );

      expect(result.displayText).toBe("Monday 20");
      expect(result.subText).toBe("November 2025");
    });

    it("uses formatDateGeneric for French", () => {
      const result = formatDate(
        "2025-11-20",
        "Lundi 20 Novembre 2025",
        "fr",
        mockTranslation,
      );

      expect(result.displayText).toBe("Lundi 20");
      expect(result.subText).toBe("Novembre 2025");
    });

    it("ignores label parameter when language is Farsi", () => {
      const result = formatDate(
        "2025-11-20",
        "Ignored Label",
        "fa",
        mockTranslation,
      );

      // Should use Jalali conversion, not the provided label
      expect(result.displayText).not.toContain("Ignored");
      expect(result.subText).not.toContain("Ignored");
    });

    it("uses dateValue for date parsing in Farsi mode", () => {
      const result = formatDate(
        "2025-11-20",
        "Any Label",
        "fa",
        mockTranslation,
      );

      // Should have successfully parsed the date
      expect(result.displayText).toBeTruthy();
      expect(result.subText).toMatch(/\d{4}/); // Should have year
    });
  });

  describe("edge cases", () => {
    it("handles empty label in formatDateGeneric", () => {
      const result = formatDateGeneric("");

      expect(result.displayText).toBe("");
      expect(result.subText).toBe("");
    });

    it("handles label with only spaces", () => {
      const result = formatDateGeneric("   ");

      expect(result.displayText).toBe("");
      expect(result.subText).toBe("");
    });

    it("handles single word label", () => {
      const result = formatDateGeneric("Monday");

      expect(result.displayText).toBe("Monday");
      expect(result.subText).toBe("");
    });

    it("handles year boundary dates in Jalali", () => {
      // End of year
      const result1 = formatDateJalali("2025-12-31", mockTranslation);
      expect(result1.subText).toMatch(/\d{4}/);

      // Beginning of year
      const result2 = formatDateJalali("2025-01-01", mockTranslation);
      expect(result2.subText).toMatch(/\d{4}/);
    });

    it("handles leap year dates", () => {
      // 2024 is a leap year
      const result = formatDateJalali("2024-02-29", mockTranslation);

      expect(result.displayText).toBeTruthy();
      expect(result.subText).toMatch(/\d{4}/);
    });

    it("returns consistent format structure", () => {
      const tests = [
        ["2025-01-15", "Monday 15 January", "en"],
        ["2025-06-20", "Friday 20 June 2025", "fr"],
        ["2025-11-20", "Any Label", "fa"],
      ];

      tests.forEach(([date, label, lang]) => {
        const result = formatDate(
          date,
          label as string,
          lang as string,
          mockTranslation,
        );

        // Always returns object with both properties
        expect(result).toHaveProperty("displayText");
        expect(result).toHaveProperty("subText");
        expect(typeof result.displayText).toBe("string");
        expect(typeof result.subText).toBe("string");
      });
    });
  });
});
