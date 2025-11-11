import { describe, it, expect } from "vitest";
import { getTranslation } from "./translationHelpers";
import type { Translations } from "./translationHelpers";

describe("Translation Helpers", () => {
  const mockTranslations: Translations = {
    appTitle: "Doctor App",
    bookAppointment: "Book Appointment",
    theme: {
      light: "Light Mode",
      dark: "Dark Mode",
      system: "System Default",
    },
    callTypes: {
      phone: "Phone Call",
      video: "Video Call",
      voice: "Voice Call",
    },
    messages: {
      error: {
        notFound: "Resource not found",
        unauthorized: "Unauthorized access",
      },
    },
  };

  describe("getTranslation - simple keys", () => {
    it("returns value for simple key", () => {
      const result = getTranslation(mockTranslations, "appTitle");
      expect(result).toBe("Doctor App");
    });

    it("returns fallback for missing simple key", () => {
      const result = getTranslation(
        mockTranslations,
        "missingKey",
        "Default Value",
      );
      expect(result).toBe("Default Value");
    });

    it("returns key itself as fallback when not provided", () => {
      const result = getTranslation(mockTranslations, "missingKey");
      expect(result).toBe("missingKey");
    });
  });

  describe("getTranslation - nested keys with dot notation", () => {
    it("returns value for nested single level key", () => {
      const result = getTranslation(mockTranslations, "theme.light");
      expect(result).toBe("Light Mode");
    });

    it("returns value for deeply nested key", () => {
      const result = getTranslation(
        mockTranslations,
        "messages.error.notFound",
      );
      expect(result).toBe("Resource not found");
    });

    it("returns fallback for missing nested key", () => {
      const result = getTranslation(
        mockTranslations,
        "theme.extraTheme",
        "Unknown Theme",
      );
      expect(result).toBe("Unknown Theme");
    });

    it("returns key as fallback for missing nested path", () => {
      const result = getTranslation(mockTranslations, "theme.extraTheme");
      expect(result).toBe("theme.extraTheme");
    });

    it("handles partially valid paths", () => {
      const result = getTranslation(
        mockTranslations,
        "theme.light.extra",
        "Not found",
      );
      expect(result).toBe("Not found");
    });
  });

  describe("getTranslation - edge cases", () => {
    it("returns key if translation object is null", () => {
      const result = getTranslation(null as unknown as Translations, "key");
      expect(result).toBe("key");
    });

    it("returns key if translation object is undefined", () => {
      const result = getTranslation(
        undefined as unknown as Translations,
        "key",
      );
      expect(result).toBe("key");
    });

    it("returns fallback for empty translations object", () => {
      const result = getTranslation({}, "anyKey", "Fallback");
      expect(result).toBe("Fallback");
    });

    it("returns key for non-string values (returns fallback)", () => {
      const translations = { data: { value: 123 } };
      const result = getTranslation(translations, "data.value", "Not a string");
      expect(result).toBe("Not a string");
    });

    it("handles empty string as valid translation value", () => {
      const translations = { empty: "" };
      const result = getTranslation(translations, "empty", "Fallback");
      expect(result).toBe("");
    });

    it("handles boolean values (returns fallback)", () => {
      const translations = { flag: true };
      const result = getTranslation(translations, "flag", "Not a string");
      expect(result).toBe("Not a string");
    });
  });

  describe("getTranslation - special cases", () => {
    it("handles keys with numbers in dot notation", () => {
      const translations = {
        array: {
          0: "First",
          1: "Second",
        },
      };
      const result = getTranslation(translations, "array.0");
      expect(result).toBe("First");
    });

    it("handles consecutive dots in key", () => {
      const result = getTranslation(
        mockTranslations,
        "theme..light",
        "Not found",
      );
      expect(result).toBe("Not found");
    });

    it("handles trailing dot in key", () => {
      const result = getTranslation(mockTranslations, "theme.", "Not found");
      expect(result).toBe("Not found");
    });

    it("handles leading dot in key", () => {
      const result = getTranslation(mockTranslations, ".theme", "Not found");
      expect(result).toBe("Not found");
    });

    it("preserves case sensitivity", () => {
      const translations = { Theme: "Capitalized", theme: "Lowercase" };
      expect(getTranslation(translations, "theme")).toBe("Lowercase");
      expect(getTranslation(translations, "Theme")).toBe("Capitalized");
    });
  });

  describe("getTranslation - real-world scenarios", () => {
    it("retrieves deeply nested phone call type", () => {
      const result = getTranslation(mockTranslations, "callTypes.phone");
      expect(result).toBe("Phone Call");
    });

    it("retrieves error message from nested structure", () => {
      const result = getTranslation(
        mockTranslations,
        "messages.error.unauthorized",
      );
      expect(result).toBe("Unauthorized access");
    });

    it("provides sensible fallback for missing variant", () => {
      const result = getTranslation(
        mockTranslations,
        "theme.orange",
        "Theme not available",
      );
      expect(result).toBe("Theme not available");
    });
  });
});
