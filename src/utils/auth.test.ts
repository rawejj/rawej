import { describe, it, expect, beforeEach, vi } from "vitest";
import { isTokenValid, fetchToken, refreshToken } from "./auth";
import { saveToken, loadToken, clearToken } from "./token-storage";
import { httpClient } from "./http-client";
import { logger } from "./logger";
import type { TokenData } from "./token-storage";

vi.mock("./http-client");
vi.mock("./token-storage");
vi.mock("./logger");

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
    process.env.MEET_API = "https://api.example.com";
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
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
        expiresIn: 3600,
      });

      const result = await fetchToken();

      expect(result).toBe("new-access-token");
      expect(saveToken).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: "new-access-token",
          refreshToken: "new-refresh-token",
        }),
      );
    });

    it("uses default expiresIn of 3600 if not provided", async () => {
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });

      await fetchToken();

      expect(saveToken).toHaveBeenCalledWith(
        expect.objectContaining({
          expiresIn: expect.any(Number),
        }),
      );
      const savedToken = vi.mocked(saveToken).mock.calls[0][0];
      const expectedExpiry = Date.now() + 3600 * 1000;
      expect(Math.abs(savedToken.expiresIn - expectedExpiry)).toBeLessThan(100);
    });

    it("calls correct API endpoint with credentials", async () => {
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await fetchToken();

      expect(httpClient).toHaveBeenCalledWith(
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
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await fetchToken();

      expect(logger.debug).toHaveBeenCalledWith(
        expect.stringContaining("Fetching token"),
        "Auth",
      );
    });

    it("logs info message after successful fetch", async () => {
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await fetchToken();

      expect(logger.info).toHaveBeenCalledWith(
        "Token fetched and saved",
        "Auth",
      );
    });

    it("logs error and throws on API failure", async () => {
      const error = new Error("Network error");
      vi.mocked(httpClient).mockRejectedValue(error);

      await expect(fetchToken()).rejects.toThrow("Network error");
      expect(logger.error).toHaveBeenCalledWith(error, "Auth - fetchToken");
    });
  });

  describe("refreshToken", () => {
    it("refreshes token and saves new one", async () => {
      vi.mocked(loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "refreshed-access-token",
        refreshToken: "refreshed-refresh-token",
        expiresIn: 3600,
      });

      const result = await refreshToken();

      expect(result).toBe("refreshed-access-token");
      expect(saveToken).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: "refreshed-access-token",
          refreshToken: "refreshed-refresh-token",
        }),
      );
    });

    it("retains old refresh token if not provided in response", async () => {
      vi.mocked(loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "new-access-token",
        expiresIn: 3600,
      });

      await refreshToken();

      expect(saveToken).toHaveBeenCalledWith(
        expect.objectContaining({
          refreshToken: mockTokenData.refreshToken,
        }),
      );
    });

    it("throws error if no refresh token is available", async () => {
      vi.mocked(loadToken).mockReturnValue(null);

      await expect(refreshToken()).rejects.toThrow(
        "No refresh token available",
      );
      expect(logger.error).toHaveBeenCalledWith(
        expect.any(Error),
        "Auth - refreshAccessToken",
      );
    });

    it("clears token on refresh failure", async () => {
      vi.mocked(loadToken).mockReturnValue(mockTokenData);
      const error = new Error("Refresh failed");
      vi.mocked(httpClient).mockRejectedValue(error);

      await expect(refreshToken()).rejects.toThrow("Refresh failed");

      expect(clearToken).toHaveBeenCalled();
    });

    it("calls correct refresh endpoint with refresh token", async () => {
      vi.mocked(loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      });

      await refreshToken();

      expect(httpClient).toHaveBeenCalledWith(
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
      vi.mocked(loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await refreshToken();

      expect(logger.debug).toHaveBeenCalledWith(
        "Refreshing access token",
        "Auth",
      );
    });

    it("logs info message after successful refresh", async () => {
      vi.mocked(loadToken).mockReturnValue(mockTokenData);
      vi.mocked(httpClient).mockResolvedValue({
        accessToken: "test",
        refreshToken: "test",
      });

      await refreshToken();

      expect(logger.info).toHaveBeenCalledWith(
        "Access token refreshed and saved",
        "Auth",
      );
    });

    it("logs error on refresh failure", async () => {
      vi.mocked(loadToken).mockReturnValue(mockTokenData);
      const error = new Error("Network error");
      vi.mocked(httpClient).mockRejectedValue(error);

      await expect(refreshToken()).rejects.toThrow();

      expect(logger.error).toHaveBeenCalledWith(
        error,
        "Auth - refreshAccessToken",
      );
    });
  });
});
