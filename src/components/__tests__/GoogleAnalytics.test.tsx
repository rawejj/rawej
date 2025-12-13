import React from "react";
import { render } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import GoogleAnalytics from "../GoogleAnalytics";

// Mock the useCookieConsent hook
const mockUseCookieConsent = vi.fn();
vi.mock("@/providers/CookieConsentProvider", () => ({
  useCookieConsent: () => mockUseCookieConsent(),
}));

// Mock gtag function
const mockGtag = vi.fn();
(globalThis as typeof globalThis & { gtag?: typeof mockGtag }).gtag = mockGtag;

describe("GoogleAnalytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset gtag mock
    (globalThis as typeof globalThis & { gtag?: typeof mockGtag }).gtag = mockGtag;
  });

  it("does not render anything", () => {
    mockUseCookieConsent.mockReturnValue({
      preferences: { analytics: true },
    });

    const { container } = render(<GoogleAnalytics measurementId="GA-TEST" />);
    expect(container.firstChild).toBeNull();
  });

  it("grants consent when analytics cookies are accepted", () => {
    mockUseCookieConsent.mockReturnValue({
      preferences: { analytics: true },
    });

    render(<GoogleAnalytics measurementId="GA-TEST" />);

    expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
      'analytics_storage': 'granted'
    });
  });

  it("denies consent when analytics cookies are not accepted", () => {
    mockUseCookieConsent.mockReturnValue({
      preferences: { analytics: false },
    });

    render(<GoogleAnalytics measurementId="GA-TEST" />);

    expect(mockGtag).toHaveBeenCalledWith('consent', 'update', {
      'analytics_storage': 'denied'
    });
  });

  it("does nothing when preferences are not loaded yet", () => {
    mockUseCookieConsent.mockReturnValue({
      preferences: null,
    });

    render(<GoogleAnalytics measurementId="GA-TEST" />);

    expect(mockGtag).not.toHaveBeenCalled();
  });

  it("does nothing when gtag is not available", () => {
    // Remove gtag from global
    delete (globalThis as typeof globalThis & { gtag?: typeof mockGtag }).gtag;

    mockUseCookieConsent.mockReturnValue({
      preferences: { analytics: true },
    });

    render(<GoogleAnalytics measurementId="GA-TEST" />);

    // Should not throw error
    expect(true).toBe(true);
  });
});