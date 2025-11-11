import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { LocalizationContextValue } from "./LocalizationProvider";

// Create a mock implementation of useContext
const mockUseContext = vi.fn();

// Mock React's useContext before importing useLocalization
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useContext: mockUseContext,
  };
});

// Now import after mocking
const { useLocalization } = await import("./useLocalization");

const defaultMockContextValue: LocalizationContextValue = {
  language: "en",
  config: {
    label: "English",
    locale: "en-US",
    direction: "ltr",
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC",
  },
  setLanguage: vi.fn(),
};

describe("useLocalization hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseContext.mockReturnValue({ ...defaultMockContextValue });
  });

  describe("context access", () => {
    it("returns context value when provider exists", () => {
      const { result } = renderHook(() => useLocalization());

      expect(result.current).toEqual(mockUseContext.mock.results[0].value);
    });

    it("returns language from context", () => {
      const { result } = renderHook(() => useLocalization());

      expect(result.current.language).toBe("en");
    });
  });

  it("returns setLanguage function from context", () => {
    const { result } = renderHook(() => useLocalization());

    expect(result.current.setLanguage).toBeDefined();
    expect(typeof result.current.setLanguage).toBe("function");
  });

  describe("multiple calls", () => {
    it("returns same context on multiple calls", () => {
      const { result: result1 } = renderHook(() => useLocalization());
      const { result: result2 } = renderHook(() => useLocalization());

      expect(result1.current.language).toBe(result2.current.language);
      expect(result1.current.config).toEqual(result2.current.config);
    });
  });

  describe("config properties", () => {
    it("has direction property", () => {
      const { result } = renderHook(() => useLocalization());

      expect(result.current.config).toHaveProperty("direction");
    });

    it("has label property", () => {
      const { result } = renderHook(() => useLocalization());

      expect(result.current.config).toHaveProperty("label");
    });

    it("supports RTL config", () => {
      const rtlContext: LocalizationContextValue = {
        language: "fa",
        config: {
          label: "Persian",
          locale: "fa-IR",
          direction: "rtl",
          dateFormat: "YYYY/MM/DD",
          timezone: "Asia/Tehran",
        },
        setLanguage: vi.fn(),
      };
      mockUseContext.mockReturnValue(rtlContext);

      const { result } = renderHook(() => useLocalization());

      expect(result.current.config.direction).toBe("rtl");
      expect(result.current.config.label).toBe("Persian");
    });

    it("supports LTR config", () => {
      const ltrContext: LocalizationContextValue = {
        language: "de",
        config: {
          label: "Deutsch",
          locale: "de-DE",
          direction: "ltr",
          dateFormat: "DD.MM.YYYY",
          timezone: "Europe/Berlin",
        },
        setLanguage: vi.fn(),
      };
      mockUseContext.mockReturnValue(ltrContext);

      const { result } = renderHook(() => useLocalization());

      expect(result.current.config.direction).toBe("ltr");
      expect(result.current.config.label).toBe("Deutsch");
    });
  });

  describe("error handling", () => {
    it("throws error when used outside provider", () => {
      mockUseContext.mockReturnValue(undefined);

      expect(() => {
        renderHook(() => useLocalization());
      }).toThrow(
        "useLocalization must be used within LocalizationClientProvider",
      );
    });

    it("throws descriptive error message", () => {
      mockUseContext.mockReturnValue(undefined);

      const errorMessage =
        "useLocalization must be used within LocalizationClientProvider";

      expect(() => {
        renderHook(() => useLocalization());
      }).toThrow(errorMessage);
    });
  });

  describe("setLanguage function", () => {
    it("provides callable setLanguage function", () => {
      const setLanguageMock = vi.fn();
      const contextWithMock: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
        },
        setLanguage: setLanguageMock,
      };
      mockUseContext.mockReturnValue(contextWithMock);

      const { result } = renderHook(() => useLocalization());

      result.current.setLanguage("fa");

      expect(setLanguageMock).toHaveBeenCalledWith("fa");
    });

    it("can switch to different languages", () => {
      const setLanguageMock = vi.fn();
      const contextWithMock: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
        },
        setLanguage: setLanguageMock,
      };
      mockUseContext.mockReturnValue(contextWithMock);

      const { result } = renderHook(() => useLocalization());

      result.current.setLanguage("fa");
      result.current.setLanguage("de");
      result.current.setLanguage("fr");

      expect(setLanguageMock).toHaveBeenCalledWith("fa");
      expect(setLanguageMock).toHaveBeenCalledWith("de");
      expect(setLanguageMock).toHaveBeenCalledWith("fr");
    });
  });

  describe("language property", () => {
    it("returns current language", () => {
      const { result } = renderHook(() => useLocalization());

      expect(result.current.language).toBe("en");
    });

    it("supports Persian language", () => {
      const faContext: LocalizationContextValue = {
        language: "fa",
        config: {
          label: "Persian",
          locale: "fa-IR",
          direction: "rtl",
          dateFormat: "YYYY/MM/DD",
          timezone: "Asia/Tehran",
        },
        setLanguage: vi.fn(),
      };
      mockUseContext.mockReturnValue(faContext);

      const { result } = renderHook(() => useLocalization());

      expect(result.current.language).toBe("fa");
    });

    it("supports French language", () => {
      const frContext: LocalizationContextValue = {
        language: "fr",
        config: {
          label: "French",
          locale: "fr-FR",
          direction: "ltr",
          dateFormat: "DD/MM/YYYY",
          timezone: "Europe/Paris",
        },
        setLanguage: vi.fn(),
      };
      mockUseContext.mockReturnValue(frContext);

      const { result } = renderHook(() => useLocalization());

      expect(result.current.language).toBe("fr");
    });
  });
});
