// Mock next/navigation to avoid Next.js App Router context error
import { vi } from "vitest";

import { render } from "@testing-library/react";
import Header from "@/components/Header";
import { LocalizationClientProvider } from "@/providers/LocalizationClientProvider";
import { ThemeContext } from "@/providers/ThemeContext";
import { TranslationsProvider } from "@/providers/TranslationsProvider";
import enTranslations from "@/../public/locales/en.json";
import React from "react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("Header", () => {
  function renderWithProviders(ui: React.ReactNode) {
    return render(
      <ThemeContext.Provider value={{ theme: "light", setTheme: () => {} }}>
        <LocalizationClientProvider initialLanguage="en">
          <TranslationsProvider translations={enTranslations}>
            {ui}
          </TranslationsProvider>
        </LocalizationClientProvider>
      </ThemeContext.Provider>,
    );
  }

  it("renders header container", () => {
    const { container } = renderWithProviders(<Header />);
    expect(container.querySelector("header")).toBeInTheDocument();
  });

  it("renders header with correct classes", () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("flex");
    expect(header).toHaveClass("justify-between");
    expect(header).toHaveClass("items-center");
  });

  it("renders with sticky positioning", () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky");
    expect(header).toHaveClass("top-0");
    expect(header).toHaveClass("z-10");
  });

  it("applies light theme styling", () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("bg-white/80");
    expect(header).toHaveClass("dark:bg-zinc-900/80");
  });

  it("renders with shadow effect", () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("shadow-md");
  });

  it("renders header content wrapper", () => {
    const { container } = renderWithProviders(<Header />);
    expect(container.querySelector("header > div")).toBeInTheDocument();
  });

  it("maintains responsive padding", () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("px-4");
    expect(header).toHaveClass("py-6");
  });

  it("supports dark mode styling", () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("dark:bg-zinc-900/80");
  });

  it("renders without crashing when mounted", () => {
    expect(() => renderWithProviders(<Header />)).not.toThrow();
  });

  it("maintains flex layout for spacing children", () => {
    const { container } = renderWithProviders(<Header />);
    const header = container.querySelector("header");
    expect(header).toHaveClass("flex");
    expect(header).toHaveClass("justify-between");
  });
});
