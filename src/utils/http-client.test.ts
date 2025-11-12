import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { httpClient } from "./http-client";
import { logger } from "./logger";

vi.mock("./logger");

describe("HTTP Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.APP_ENV = "prod";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("successful requests", () => {
    it("returns parsed JSON response", async () => {
      const mockResponse = { success: true, data: "test" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await httpClient("https://api.example.com/test");

      expect(result).toEqual(mockResponse);
    });

    it("returns text response for non-JSON content", async () => {
      const mockResponse = "plain text response";
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "text/plain" }),
        text: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await httpClient("https://api.example.com/test");

      expect(result).toBe(mockResponse);
    });

    it("returns text response when content-type header is missing", async () => {
      const mockResponse = "response without content-type";
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({}),
        text: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await httpClient("https://api.example.com/test");

      expect(result).toBe(mockResponse);
    });

    it("passes request options to fetch", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({}),
      });

      const options: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "data" }),
      };

      await httpClient("https://api.example.com/test", options);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/test",
        options,
      );
    });

    it("handles JSON response without explicit content-type charset", async () => {
      const mockResponse = { data: "test" };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({
          "content-type": "application/json; charset=utf-8",
        }),
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await httpClient("https://api.example.com/test");

      expect(result).toEqual(mockResponse);
    });
  });

  describe("error handling", () => {
    it("throws error with status and message for failed response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({ error: "Not Found" }),
      });

      await expect(httpClient("https://api.example.com/test")).rejects.toThrow(
        "HTTP error 404",
      );
    });

    it("logs error message for failed response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({ error: "Internal Server Error" }),
      });

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
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers({ "content-type": "text/plain" }),
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
        text: vi.fn().mockResolvedValue("Bad Request"),
      });

      await expect(httpClient("https://api.example.com/test")).rejects.toThrow(
        "HTTP error 400: Bad Request",
      );
    });

    it("handles fetch network errors", async () => {
      const networkError = new Error("Network unreachable");
      global.fetch = vi.fn().mockRejectedValue(networkError);

      await expect(httpClient("https://api.example.com/test")).rejects.toThrow(
        "Network unreachable",
      );
      expect(logger.error).toHaveBeenCalledWith(networkError, "httpClient");
    });

    it("logs error for JSON parsing failures", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
        text: vi.fn().mockResolvedValue("Bad Gateway"),
      });

      try {
        await httpClient("https://api.example.com/test");
      } catch {
        // ignore
      }

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("SSL configuration in dev mode", () => {
    it("disables TLS verification in dev environment", async () => {
      process.env.APP_ENV = "dev";
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({}),
      });

      await httpClient("https://api.example.com/test");

      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).toBe("0");
    });

    it("does not modify TLS verification in production", async () => {
      process.env.APP_ENV = "prod";
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({}),
      });

      await httpClient("https://api.example.com/test");

      expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).not.toBe("0");
    });
  });

  describe("type safety", () => {
    it("returns correctly typed response", async () => {
      interface ApiResponse {
        Id: number;
        name: string;
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: vi.fn().mockResolvedValue({ Id: 1, name: "John" }),
      });

      const result = await httpClient<ApiResponse>(
        "https://api.example.com/user/1",
      );

      expect(result).toEqual({ Id: 1, name: "John" });
    });
  });
});
