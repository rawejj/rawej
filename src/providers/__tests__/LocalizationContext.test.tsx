import { describe, it, expect } from "vitest";
import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { LocalizationContext } from "@/providers/LocalizationContext";
import type { LocalizationContextValue } from "@/providers/LocalizationProvider";

describe("LocalizationContext", () => {
  describe("context creation", () => {
    it("creates a valid context object", () => {
      expect(LocalizationContext).toBeDefined();
    });

    it("is a React Context", () => {
      expect(LocalizationContext).toHaveProperty("Provider");
      expect(LocalizationContext).toHaveProperty("Consumer");
    });

    it("exports a Context.Provider component", () => {
      const { Provider } = LocalizationContext;
      expect(Provider).toBeDefined();
    });

    it("exports a Context.Consumer component", () => {
      const { Consumer } = LocalizationContext;
      expect(Consumer).toBeDefined();
    });
  });

  describe("context usage with Provider", () => {
    it("provides value through Provider", () => {
      const mockValue: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
          currency: "USD",
        },
        setLanguage: () => {},
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return <span data-testid="language">{context?.language}</span>;
      };

      render(
        <LocalizationContext.Provider value={mockValue}>
          <TestComponent />
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("language")).toHaveTextContent("en");
    });

    it("provides config object through context", () => {
      const mockValue: LocalizationContextValue = {
        language: "fa",
        config: {
          label: "Persian",
          locale: "fa-IR",
          direction: "rtl",
          dateFormat: "YYYY/MM/DD",
          timezone: "Asia/Tehran",
          currency: "IRR",
        },
        setLanguage: () => {},
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return <span data-testid="direction">{context?.config.direction}</span>;
      };

      render(
        <LocalizationContext.Provider value={mockValue}>
          <TestComponent />
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
    });

    it("provides setLanguage function through context", () => {
      let callCount = 0;
      const mockValue: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
          currency: "USD",
        },
        setLanguage: () => {
          callCount++;
        },
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return (
          <button
            data-testid="button"
            onClick={() => context?.setLanguage("de")}
          >
            Switch
          </button>
        );
      };

      const { getByTestId } = render(
        <LocalizationContext.Provider value={mockValue}>
          <TestComponent />
        </LocalizationContext.Provider>,
      );

      getByTestId("button").click();
      expect(callCount).toBe(1);
    });
  });

  describe("different language configurations", () => {
    it("supports English localization", () => {
      const mockValue: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
          currency: "USD",
        },
        setLanguage: () => {},
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return (
          <>
            <span data-testid="lang">{context?.language}</span>
            <span data-testid="dir">{context?.config.direction}</span>
          </>
        );
      };

      render(
        <LocalizationContext.Provider value={mockValue}>
          <TestComponent />
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("lang")).toHaveTextContent("en");
      expect(screen.getByTestId("dir")).toHaveTextContent("ltr");
    });

    it("supports Persian localization with RTL", () => {
      const mockValue: LocalizationContextValue = {
        language: "fa",
        config: {
          label: "Persian",
          locale: "fa-IR",
          direction: "rtl",
          dateFormat: "YYYY/MM/DD",
          timezone: "Asia/Tehran",
          currency: "IRR",
        },
        setLanguage: () => {},
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return (
          <>
            <span data-testid="lang">{context?.language}</span>
            <span data-testid="dir">{context?.config.direction}</span>
          </>
        );
      };

      render(
        <LocalizationContext.Provider value={mockValue}>
          <TestComponent />
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("lang")).toHaveTextContent("fa");
      expect(screen.getByTestId("dir")).toHaveTextContent("rtl");
    });

    it("supports German localization", () => {
      const mockValue: LocalizationContextValue = {
        language: "de",
        config: {
          label: "German",
          locale: "de-DE",
          direction: "ltr",
          dateFormat: "DD.MM.YYYY",
          timezone: "Europe/Berlin",
          currency: "EUR",
        },
        setLanguage: () => {},
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return <span data-testid="locale">{context?.config.locale}</span>;
      };

      render(
        <LocalizationContext.Provider value={mockValue}>
          <TestComponent />
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("locale")).toHaveTextContent("de-DE");
    });

    it("supports Kurdish localization", () => {
      const mockValue: LocalizationContextValue = {
        language: "ku-sor",
        config: {
          label: "Kurdi-Sorani",
          locale: "ku-IQ",
          direction: "ltr",
          dateFormat: "DD/MM/YYYY",
          timezone: "Asia/Baghdad",
          currency: "IQD",
        },
        setLanguage: () => {},
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return <span data-testid="lang">{context?.language}</span>;
      };

      render(
        <LocalizationContext.Provider value={mockValue}>
          <TestComponent />
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("lang")).toHaveTextContent("ku-sor");
    });
  });

  describe("context default values", () => {
    it("initializes with undefined when no Provider", () => {
      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return (
          <span data-testid="result">
            {context === undefined ? "undefined" : "defined"}
          </span>
        );
      };

      render(<TestComponent />);

      expect(screen.getByTestId("result")).toHaveTextContent("undefined");
    });
  });

  describe("multiple context consumers", () => {
    it("provides same value to multiple consumers", () => {
      const mockValue: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
          currency: "USD",
        },
        setLanguage: () => {},
      };

      const Consumer1 = () => {
        const context = useContext(LocalizationContext);
        return <span data-testid="consumer1">{context?.language}</span>;
      };

      const Consumer2 = () => {
        const context = useContext(LocalizationContext);
        return <span data-testid="consumer2">{context?.language}</span>;
      };

      render(
        <LocalizationContext.Provider value={mockValue}>
          <Consumer1 />
          <Consumer2 />
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("consumer1")).toHaveTextContent("en");
      expect(screen.getByTestId("consumer2")).toHaveTextContent("en");
    });
  });

  describe("context value updates", () => {
    it("reflects value changes when Provider re-renders", () => {
      const initialValue: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
          currency: "USD",
        },
        setLanguage: () => {},
      };

      const updatedValue: LocalizationContextValue = {
        language: "de",
        config: {
          label: "Deutsch",
          locale: "de-DE",
          direction: "ltr",
          dateFormat: "DD.MM.YYYY",
          timezone: "Europe/Berlin",
          currency: "EUR",
        },
        setLanguage: () => {},
      };

      const TestComponent = ({
        value,
      }: {
        value: LocalizationContextValue;
      }) => {
        const Consumer = () => {
          const context = useContext(LocalizationContext);
          return <span data-testid="language">{context?.language}</span>;
        };

        return (
          <LocalizationContext.Provider value={value}>
            <Consumer />
          </LocalizationContext.Provider>
        );
      };

      const { rerender } = render(<TestComponent value={initialValue} />);
      expect(screen.getByTestId("language")).toHaveTextContent("en");

      rerender(<TestComponent value={updatedValue} />);
      expect(screen.getByTestId("language")).toHaveTextContent("de");
    });
  });

  describe("nested providers", () => {
    it("inner provider value overrides outer provider", () => {
      const outerValue: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
          currency: "USD",
        },
        setLanguage: () => {},
      };

      const innerValue: LocalizationContextValue = {
        language: "fa",
        config: {
          label: "Persian",
          locale: "fa-IR",
          direction: "rtl",
          dateFormat: "YYYY/MM/DD",
          timezone: "Asia/Tehran",
          currency: "IRR",
        },
        setLanguage: () => {},
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        return <span data-testid="language">{context?.language}</span>;
      };

      render(
        <LocalizationContext.Provider value={outerValue}>
          <div data-testid="outer">
            <LocalizationContext.Provider value={innerValue}>
              <TestComponent />
            </LocalizationContext.Provider>
          </div>
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("language")).toHaveTextContent("fa");
    });
  });

  describe("config property access", () => {
    it("provides all required config properties", () => {
      const mockValue: LocalizationContextValue = {
        language: "en",
        config: {
          label: "English",
          locale: "en-US",
          direction: "ltr",
          dateFormat: "MM/DD/YYYY",
          timezone: "UTC",
          currency: "USD",
        },
        setLanguage: () => {},
      };

      const TestComponent = () => {
        const context = useContext(LocalizationContext);
        const hasRequiredProps =
          context?.config.direction &&
          context?.config.dateFormat &&
          context?.config.label &&
          context?.config.timezone;
        return (
          <span data-testid="check">
            {hasRequiredProps ? "complete" : "incomplete"}
          </span>
        );
      };

      render(
        <LocalizationContext.Provider value={mockValue}>
          <TestComponent />
        </LocalizationContext.Provider>,
      );

      expect(screen.getByTestId("check")).toHaveTextContent("complete");
    });
  });
});
