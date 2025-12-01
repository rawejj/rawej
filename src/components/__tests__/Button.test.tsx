import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import Button from "../Button";

// Mock useTranslations hook
vi.mock("@/providers/TranslationsProvider", () => ({
  useTranslations: () => ({
    t: (key: string, fallback: string) => fallback,
  }),
}));

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-purple-600");
  });

  it("renders with loading state", () => {
    render(<Button loading>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders with custom loading text", () => {
    render(<Button loading loadingText="Processing...">Click me</Button>);
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("applies different variants", () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-white/80");

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-red-600");
  });

  it("applies different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-4", "py-2");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6", "py-3");
  });

  it("applies full width", () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading", () => {
    const handleClick = vi.fn();
    render(<Button loading onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});