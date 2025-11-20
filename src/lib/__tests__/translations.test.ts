import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { loadTranslations } from "@/lib/translations";
import type { LanguageKey } from "@/providers/LocalizationProvider";
import * as fsPromises from "fs/promises";

vi.mock("fs/promises", async (importOriginal) => {
  const actual = await importOriginal();
  const mockedReadFile = vi.fn().mockResolvedValue("mocked file content");
  return {
    ...(typeof actual === "object" && actual !== null ? actual : {}),
    readFile: mockedReadFile,
    default: { readFile: mockedReadFile },
  };
});

vi.mock("path", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(typeof actual === "object" && actual !== null ? actual : {}),
    join: vi.fn((...args) => args.join("/")),
    default: { join: vi.fn((...args) => args.join("/")) }, // <-- add this line
  };
});

describe("loadTranslations", () => {
  let mockReadFile: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReadFile = fsPromises.readFile as unknown as Mock;
  });

  const mockTranslationData = {
    appTitle: "Doctor App",
    meta: {
      title: "Doctor Appointment Booking",
      description: "Book appointments with doctors",
      keywords: "doctor, appointment",
    },
  };

  describe("successful language loading", () => {
    it("loads English translations successfully", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(mockTranslationData));

      const result = await loadTranslations("en");

      expect(result).toEqual(mockTranslationData);
      expect(mockReadFile).toHaveBeenCalledWith(
        expect.stringContaining("public/locales/en.json"),
        "utf-8",
      );
    });

    it("loads German translations successfully", async () => {
      const germanData = { appTitle: "Arztermin-App" };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(germanData));

      const result = await loadTranslations("de");

      expect(result).toEqual(germanData);
      expect(mockReadFile).toHaveBeenCalledWith(
        expect.stringContaining("public/locales/de.json"),
        "utf-8",
      );
    });

    it("loads French translations successfully", async () => {
      const frenchData = { appTitle: "Application de Rendez-vous Médical" };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(frenchData));

      const result = await loadTranslations("fr");

      expect(result).toEqual(frenchData);
    });

    it("loads Persian translations successfully", async () => {
      const persianData = { appTitle: "برنامه نوبت دهی پزشکان" };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(persianData));

      const result = await loadTranslations("fa");

      expect(result).toEqual(persianData);
    });

    it("loads Kurdish translations successfully", async () => {
      const kurdishData = { appTitle: "بەرنامەی نوبەتدان" };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(kurdishData));

      const result = await loadTranslations("ku-sor");

      expect(result).toEqual(kurdishData);
    });

    it("parses JSON content correctly", async () => {
      const complexData = {
        nested: {
          deep: {
            value: "test",
          },
        },
        array: [1, 2, 3],
      };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(complexData));

      const result = await loadTranslations("en");

      expect(result).toEqual(complexData);
      const typedResult = result as typeof complexData;
      expect(typedResult.nested.deep.value).toBe("test");
      expect(typedResult.array).toEqual([1, 2, 3]);
    });
  });

  describe("error handling and fallback", () => {
    it("falls back to English when language file not found", async () => {
      mockReadFile.mockRejectedValueOnce(new Error("File not found"));
      mockReadFile.mockResolvedValueOnce(JSON.stringify(mockTranslationData));

      const result = await loadTranslations("unknown" as LanguageKey);

      expect(result).toEqual(mockTranslationData);
      expect(mockReadFile).toHaveBeenCalledTimes(2);
      expect(mockReadFile).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("public/locales/en.json"),
        "utf-8",
      );
    });

    it("logs warning when requested language fails", async () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      mockReadFile.mockRejectedValueOnce(new Error("File not found"));
      mockReadFile.mockResolvedValueOnce(JSON.stringify(mockTranslationData));

      await loadTranslations("de");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to load translations for de"),
      );
      consoleSpy.mockRestore();
    });

    it("returns empty object when both language and fallback fail", async () => {
      const consoleWarnSpy = vi
        .spyOn(console, "warn")
        .mockImplementation(() => {});
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockReadFile.mockRejectedValueOnce(new Error("File not found"));
      mockReadFile.mockRejectedValueOnce(new Error("File not found"));

      const result = await loadTranslations("unknown" as LanguageKey);

      expect(result).toEqual({});
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it("logs error when fallback English also fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockReadFile.mockRejectedValueOnce(new Error("File not found"));
      mockReadFile.mockRejectedValueOnce(new Error("Fallback failed"));

      await loadTranslations("de");

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to load fallback translations:",
        expect.any(Error),
      );
      consoleErrorSpy.mockRestore();
    });

    it("handles invalid JSON gracefully", async () => {
      mockReadFile.mockRejectedValueOnce(new Error("Invalid JSON"));
      mockReadFile.mockResolvedValueOnce(JSON.stringify(mockTranslationData));

      const result = await loadTranslations("en");

      expect(result).toEqual(mockTranslationData);
    });
  });

  describe("edge cases", () => {
    it("handles empty translation files", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify({}));

      const result = await loadTranslations("en");

      expect(result).toEqual({});
    });

    it("handles translations with special characters", async () => {
      const specialData = {
        emoji: "👨‍⚕️",
        unicode: "你好",
        symbols: "!@#$%^&*()",
      };
      mockReadFile.mockResolvedValueOnce(JSON.stringify(specialData));

      const result = await loadTranslations("en");

      expect(result).toEqual(specialData);
    });

    it("maintains process.cwd() reference in path", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(mockTranslationData));

      await loadTranslations("en");

      expect(mockReadFile).toHaveBeenCalledWith(
        expect.stringContaining("locales"),
        "utf-8",
      );
    });

    it("handles all supported language keys", async () => {
      const supportedLanguages: LanguageKey[] = [
        "en",
        "de",
        "fr",
        "ku-sor",
        "ku-kur",
        "fa",
      ];

      for (const lang of supportedLanguages) {
        mockReadFile.mockResolvedValueOnce(JSON.stringify(mockTranslationData));
        const result = await loadTranslations(lang);
        expect(result).toBeDefined();
      }
    });
  });

  describe("file reading behavior", () => {
    it("uses UTF-8 encoding", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(mockTranslationData));

      await loadTranslations("en");

      expect(mockReadFile).toHaveBeenCalledWith(expect.any(String), "utf-8");
    });

    it("calls readFile with correct path pattern", async () => {
      mockReadFile.mockResolvedValueOnce(JSON.stringify(mockTranslationData));

      await loadTranslations("en");

      const callArgs = mockReadFile.mock.calls[0][0];
      expect(callArgs).toContain("public");
      expect(callArgs).toContain("locales");
      expect(callArgs).toContain("en.json");
    });
  });
});
