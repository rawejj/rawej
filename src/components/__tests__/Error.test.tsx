import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import Error from "../BookingModal/Error";

// Mock useTranslations hook
vi.mock("@/providers/TranslationsProvider", () => ({
  useTranslations: () => ({
    t: (key: string) => {
      // Simple translation mock that returns the key or a known value
      const translations: Record<string, string> = {
        "buttons.retry": "Retry",
      };
      return translations[key] || key;
    },
  }),
}));

describe("BookingModal/Error", () => {
  it("renders error message", () => {
    render(<Error error="Something went wrong" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/please try again/i)).toBeInTheDocument();
  });

  it("renders retry button if onRefresh is provided", () => {
    const onRefresh = vi.fn();
    render(<Error error="Network error" onRefresh={onRefresh} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onRefresh).toHaveBeenCalled();
  });
});
