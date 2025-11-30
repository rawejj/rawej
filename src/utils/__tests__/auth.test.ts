import { describe, it, expect, beforeEach, vi } from "vitest";
import { isTokenValid, fetchToken, refreshToken } from "@/utils/auth";
import * as tokenStorageModule from "@/utils/token-storage";
import * as httpClientModule from "@/utils/http-client";
import * as loggerModule from "@/utils/logger";
import type { TokenData } from "@/utils/token-storage";

vi.mock("@/utils/http-client");
vi.mock("@/utils/token-storage");
vi.mock("@/utils/logger");

describe("Auth Utils", () => {
  const mockTokenData: TokenData = {
    accessToken: "test-access-token",
    refreshToken: "test-refresh-token",
    expiresIn: Date.now() + 3600000,
  };

  const expiredTokenData: TokenData = {
    accessToken: "expired-token",
    refreshToken: "test-refresh-token",
    expiresIn: Date.now() - 1000,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.REMOTE_API_URL = "https://api.example.com";
    process.env.MEET_API_USER = "testuser";
    process.env.MEET_API_PASSWORD = "testpass";
  });

  describe("isTokenValid", () => {
    it("returns true for valid token", () => {
      const result = isTokenValid(mockTokenData);
      expect(result).toBe(true);
    });

    it("returns false for null token", () => {
      const result = isTokenValid(null);
      expect(result).toBe(false);
    });

    it("returns false for expired token", () => {
      const result = isTokenValid(expiredTokenData);
      expect(result).toBe(false);
    });

    it("returns false if accessToken is empty", () => {
      const result = isTokenValid({
        ...mockTokenData,
        accessToken: "",
      });
      expect(result).toBe(false);
    });

    it("returns false if accessToken is not a string", () => {
      const result = isTokenValid({
        ...mockTokenData,
        accessToken: null as unknown as string,
      });
      expect(result).toBe(false);
    });

    it("returns false if expiresAt is in the past", () => {
      const result = isTokenValid({
        ...mockTokenData,
        expiresIn: Date.now() - 100,
      });
      expect(result).toBe(false);
    });
  });

  describe("fetchToken", () => {
    it("fetches token from API and saves it", async () => {
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        expiresIn: 3600,
      });

      const result = await fetchToken();

      expect(result).toBe("new-access-token");
      expect(vi.mocked(tokenStorageModule.saveToken)).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: "new-access-token",
          refreshToken: "new-refresh-token",
        }),
      );
    });

    it("uses default expiresIn of 3600 if not provided", async () => {
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });

      await fetchToken();

      expect(vi.mocked(tokenStorageModule.saveToken)).toHaveBeenCalledWith(
        expect.objectContaining({
          expiresIn: expect.any(Number),
        }),
      );
      const savedToken = vi.mocked(tokenStorageModule.saveToken).mock.calls[0][0];
      const expectedExpiry = Date.now() + 3600 * 1000;
      expect(Math.abs(savedToken.expiresIn - expectedExpiry)).toBeLessThan(100);
    });

    it("calls correct API endpoint with credentials", async () => {
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await fetchToken();

      expect(vi.mocked(httpClientModule.httpClient)).toHaveBeenCalledWith(
        "https://api.example.com/auth/token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "testuser",
            password: "testpass",
          }),
        }),
      );
    });

    it("logs debug message before fetching", async () => {
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await fetchToken();

      expect(vi.mocked(loggerModule.logger.debug)).toHaveBeenCalledWith(
        expect.stringContaining("Fetching token"),
        "Auth",
      );
    });

    it("logs info message after successful fetch", async () => {
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await fetchToken();

      expect(vi.mocked(loggerModule.logger.info)).toHaveBeenCalledWith(
        "Token fetched and saved",
        "Auth",
      );
    });

    it("logs error and throws on API failure", async () => {
      const error = new Error("Network error");
      vi.mocked(httpClientModule.httpClient).mockRejectedValue(error);

      await expect(fetchToken()).rejects.toThrow("Network error");
      expect(vi.mocked(loggerModule.logger.error)).toHaveBeenCalledWith(error, "Auth - fetchToken");
    });
  });

  describe("refreshToken", () => {
    it("refreshes token and saves new one", async () => {
      vi.mocked(tokenStorageModule.loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "refreshed-access-token",
        refreshToken: "refreshed-refresh-token",
        expiresIn: 3600,
      });

      const result = await refreshToken();

      expect(result).toBe("refreshed-access-token");
      expect(vi.mocked(tokenStorageModule.saveToken)).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: "refreshed-access-token",
          refreshToken: "refreshed-refresh-token",
        }),
      );
    });

    it("retains old refresh token if not provided in response", async () => {
      vi.mocked(tokenStorageModule.loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "new-access-token",
        expiresIn: 3600,
      });

      await refreshToken();

      expect(vi.mocked(tokenStorageModule.saveToken)).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: mockTokenData.refreshToken,
        }),
      );
    });

    it("throws error if no refresh token is available", async () => {
      vi.mocked(tokenStorageModule.loadToken).mockReturnValue(null);

      await expect(refreshToken()).rejects.toThrow(
        "No refresh token available",
      );
      expect(vi.mocked(loggerModule.logger.error)).toHaveBeenCalledWith(
        expect.any(Error),
        "Auth - refreshAccessToken",
      );
    });

    it("clears token on refresh failure", async () => {
      vi.mocked(tokenStorageModule.loadToken).mockReturnValue(mockTokenData);
      const error = new Error("Refresh failed");
      vi.mocked(httpClientModule.httpClient).mockRejectedValue(error);

      await expect(refreshToken()).rejects.toThrow("Refresh failed");

      expect(vi.mocked(tokenStorageModule.clearToken)).toHaveBeenCalled();
    });

    it("calls correct refresh endpoint with refresh token", async () => {
      vi.mocked(tokenStorageModule.loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });

      await refreshToken();

      expect(vi.mocked(httpClientModule.httpClient)).toHaveBeenCalledWith(
        "https://api.example.com/auth/refresh-token",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            refreshToken: mockTokenData.refreshToken,
          }),
        }),
      );
    });

    it("logs debug message before refreshing", async () => {
      vi.mocked(tokenStorageModule.loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await refreshToken();

      expect(vi.mocked(loggerModule.logger.debug)).toHaveBeenCalledWith(
        "Refreshing access token",
        "Auth",
      );
    });

    it("logs info message after successful refresh", async () => {
      vi.mocked(tokenStorageModule.loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClientModule.httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await refreshToken();

      expect(vi.mocked(loggerModule.logger.info)).toHaveBeenCalledWith(
        "Access token refreshed and saved",
        "Auth",
      );
    });

    it("logs error on refresh failure", async () => {
      vi.mocked(tokenStorageModule.loadToken).mockReturnValue(mockTokenData);
      const error = new Error("Network error");
      vi.mocked(httpClientModule.httpClient).mockRejectedValue(error);

      await expect(refreshToken()).rejects.toThrow();

      expect(vi.mocked(loggerModule.logger.error)).toHaveBeenCalledWith(
        error,
        "Auth - refreshAccessToken",
      );
    });
  });
});
