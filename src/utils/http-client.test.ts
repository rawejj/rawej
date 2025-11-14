import { describe, it, expect, beforeEach, vi, afterEach, MockedFunction } from "vitest";

vi.mock("@/utils/logger");
vi.mock("./token-storage");
vi.mock("./auth");

import { httpClient } from "./http-client";
import { logger } from "@/utils/logger";
import { loadToken } from "./token-storage";
import { fetchToken, refreshToken } from "./auth";

describe("HTTP Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.APP_ENV = "prod";
    vi.mocked(loadToken).mockReturnValue(null);
    vi.mocked(fetchToken).mockResolvedValue("mock-token");
    vi.mocked(refreshToken).mockResolvedValue("refreshed-token");
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful requests", () => {
    it("returns parsed JSON response", async () => {
      const mockResponse = { success: true, data: "test" };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue(mockResponse),
      } as Response);

      const result = await httpClient("https://api.example.com/test");

      expect(result).toEqual(mockResponse);
    });

    it("returns text response for non-JSON content", async () => {
      const mockResponse = "plain text response";
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "text/plain" }),
        text: vi.fn().mockResolvedValue(mockResponse),
      } as Response);

      const result = await httpClient("https://api.example.com/test");

      expect(result).toBe(mockResponse);
    });

    it("returns text response when content-type header is missing", async () => {
      const mockResponse = "response without content-type";
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers({}),
        text: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await httpClient("https://api.example.com/test");

      expect(result).toBe(mockResponse);
    });

    it("passes request options to fetch", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({}),
      } as unknown as Response);

      const options: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "data" }),
      };

      await httpClient("https://api.example.com/test", options);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        options,
      );
    });

    it("handles JSON response without explicit content-type charset", async () => {
      const mockResponse = { data: "test" };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers({
          "content-type": "application/json; charset=utf-8",
        }),
        json: vi.fn().mockResolvedValue(mockResponse),
      } as unknown as Response);

      const result = await httpClient("https://api.example.com/test");

      expect(result).toEqual(mockResponse);
    });
  });

  describe("error handling", () => {
    it("throws error with status and message for failed response", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({ error: "Not Found" }),
      } as unknown as Response);

      await expect(httpClient("https://api.example.com/test")).rejects.toThrow(
        "HTTP error 404",
      );
    });

    it("logs error message for failed response", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({ error: "Internal Server Error" }),
      } as unknown as Response);

      try {
        await httpClient("https://api.example.com/test");
      } catch {
        // ignore
      }

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("HTTP error 500"),
        "httpClient",
      );
    });

    it("handles non-JSON error response", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers({ "content-type": "text/plain" }),
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
        text: vi.fn().mockResolvedValue("Bad Request"),
      } as unknown as Response);

      await expect(httpClient("https://api.example.com/test")).rejects.toThrow(
        "HTTP error 400: Bad Request",
      );
    });

    it("handles fetch network errors", async () => {
      const networkError = new Error("Network unreachable");
      (global.fetch as MockedFunction<typeof fetch>).mockRejectedValue(networkError);

      await expect(httpClient("https://api.example.com/test")).rejects.toThrow(
        "Network unreachable",
      );
    });

    it("logs error for JSON parsing failures", async () => {
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: false,
        status: 502,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
        text: vi.fn().mockResolvedValue("Bad Gateway"),
      } as unknown as Response);

      try {
        await httpClient("https://api.example.com/test");
      } catch {
        // ignore
      }

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("SSL configuration in dev mode", () => {
    it("should disable SSL verification in development", async () => {
      process.env.NODE_ENV = "development";
      const mockResponse = {
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({})
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      await httpClient("/test");

      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).toBe("0");
    });

    it("should enable SSL verification in production", async () => {
      process.env.NODE_ENV = "production";
      const mockResponse = {
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({})
      };
      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue(mockResponse as unknown as Response);

      await httpClient("/test");

      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).toBeUndefined();
    });
  });

  describe("type safety", () => {
    it("returns correctly typed response", async () => {
      interface ApiResponse {
        Id: number;
        name: string;
      }

      const mockFetch = vi.mocked(fetch);
      mockFetch.mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({ Id: 1, name: "John" }),
      } as unknown as Response);

      const result = await httpClient<ApiResponse>(
        "https://api.example.com/user/1",
      );

      expect(result).toEqual({ Id: 1, name: "John" });
    });
  });
});
