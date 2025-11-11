import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ThemeClientProvider from "./ThemeClientProvider";
import { ThemeContext } from "./ThemeContext";
import React from "react";

// Mock window.matchMedia for tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const TestComponent = () => {
  const context = React.useContext(ThemeContext);
  if (!context) return <div>No context</div>;

  return (
    <div>
      <div data-testid="current-theme">{context.theme}</div>
      <button onClick={() => context.setTheme("light")}>Light</button>
      <button onClick={() => context.setTheme("dark")}>Dark</button>
      <button onClick={() => context.setTheme("system")}>System</button>
    </div>
  );
};

describe("ThemeClientProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    document.documentElement.className = "";
    // Re-apply global mock for window.matchMedia before each test
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("localStorage management", () => {
    it("saves theme to localStorage when setTheme is called", async () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const lightButton = screen.getByRole("button", { name: "Light" });
      fireEvent.click(lightButton);

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("light");
      });
    });

    it("loads theme from localStorage on mount", () => {
      localStorage.setItem("theme", "dark");

      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const currentTheme = screen.getByTestId("current-theme");
      expect(currentTheme.textContent).toBe("dark");
    });

    it("defaults to system theme if localStorage is empty", () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const currentTheme = screen.getByTestId("current-theme");
      expect(currentTheme.textContent).toBe("system");
    });
  });

  describe("theme application to DOM", () => {
    it("applies light class to document element for light theme", async () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const lightButton = screen.getByRole("button", { name: "Light" });
      fireEvent.click(lightButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true);
      });
    });

    it("applies dark class to document element for dark theme", async () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const darkButton = screen.getByRole("button", { name: "Dark" });
      fireEvent.click(darkButton);

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });

    it("removes previous theme class when switching themes", async () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const lightButton = screen.getByRole("button", { name: "Light" });
      const darkButton = screen.getByRole("button", { name: "Dark" });

      fireEvent.click(lightButton);
      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true);
      });

      fireEvent.click(darkButton);
      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(
          false,
        );
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });
    });
  });

  describe("system theme detection", () => {
    it("detects system dark mode preference", async () => {
      const matchMediaSpy = vi.spyOn(window, "matchMedia").mockImplementation(
        (query: string) =>
          ({
            matches: query === "(prefers-color-scheme: dark)",
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as unknown as MediaQueryList,
      );

      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      await waitFor(() => {
        expect(document.documentElement.classList.contains("dark")).toBe(true);
      });

      matchMediaSpy.mockRestore();
    });

    it("detects system light mode preference", async () => {
      const matchMediaSpy = vi.spyOn(window, "matchMedia").mockImplementation(
        (query: string) =>
          ({
            matches: query !== "(prefers-color-scheme: dark)",
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as unknown as MediaQueryList,
      );

      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      await waitFor(() => {
        expect(document.documentElement.classList.contains("light")).toBe(true);
      });

      matchMediaSpy.mockRestore();
    });
  });

  describe("context provision", () => {
    it("provides theme context to children", () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      expect(screen.queryByText("No context")).not.toBeInTheDocument();
    });

    it("provides setTheme function via context", async () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const darkButton = screen.getByRole("button", { name: "Dark" });
      fireEvent.click(darkButton);

      await waitFor(() => {
        expect(screen.getByTestId("current-theme").textContent).toBe("dark");
      });
    });

    it("provides current theme value via context", () => {
      localStorage.setItem("theme", "light");

      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      expect(screen.getByTestId("current-theme").textContent).toBe("light");
    });
  });

  describe("theme switching", () => {
    it("switches from light to dark theme", async () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const lightButton = screen.getByRole("button", { name: "Light" });
      const darkButton = screen.getByRole("button", { name: "Dark" });

      fireEvent.click(lightButton);
      await waitFor(() => {
        expect(screen.getByTestId("current-theme").textContent).toBe("light");
      });

      fireEvent.click(darkButton);
      await waitFor(() => {
        expect(screen.getByTestId("current-theme").textContent).toBe("dark");
      });
    });

    it("switches from system to light theme", async () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const systemButton = screen.getByRole("button", { name: "System" });
      const lightButton = screen.getByRole("button", { name: "Light" });

      fireEvent.click(systemButton);
      fireEvent.click(lightButton);

      await waitFor(() => {
        expect(screen.getByTestId("current-theme").textContent).toBe("light");
      });
    });

    it("persists theme changes to localStorage", async () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const darkButton = screen.getByRole("button", { name: "Dark" });
      fireEvent.click(darkButton);

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("dark");
      });

      fireEvent.click(screen.getByRole("button", { name: "Light" }));

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("light");
      });
    });
  });

  describe("media query listener cleanup", () => {
    it("sets up media query listener for system theme", async () => {
      const addEventListenerSpy = vi.fn();
      const mockMediaQuery = {
        matches: true,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: addEventListenerSpy,
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as MediaQueryList;

      const matchMediaSpy = vi
        .spyOn(window, "matchMedia")
        .mockReturnValue(mockMediaQuery);

      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const systemButton = screen.getByRole("button", { name: "System" });
      fireEvent.click(systemButton);

      await waitFor(() => {
        expect(addEventListenerSpy).toHaveBeenCalledWith(
          "change",
          expect.any(Function),
        );
      });

      matchMediaSpy.mockRestore();
    });
  });

  describe("initialization", () => {
    it("applies theme on initial render", () => {
      localStorage.setItem("theme", "dark");

      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("initializes with default system theme when no localStorage value", () => {
      render(
        <ThemeClientProvider>
          <TestComponent />
        </ThemeClientProvider>,
      );

      const currentTheme = screen.getByTestId("current-theme");
      expect(currentTheme.textContent).toBe("system");
    });
  });
});
