import { logger } from "@/utils/logger";
import { loadToken, saveToken } from "./token-storage";

export async function httpClient<T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  // Disable SSL verification in local/dev if env is set
  if (process.env.APP_ENV === "dev") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  let tokenData = loadToken();
  const baseHeaders = { ...(options?.headers || {}) };
  if (tokenData?.accessToken) {
    (baseHeaders as Record<string, string>)["Authorization"] =
      `Bearer ${tokenData.accessToken}`;
  }
  let opts: RequestInit = { ...options, headers: baseHeaders };
  let res = await fetch(url, opts);

  // If unauthorized, try to refresh token and retry once
  if (res.status === 401 && tokenData?.refreshToken) {
    const newToken = await refreshToken(tokenData.refreshToken);
    if (newToken) {
      tokenData = newToken;
      const retryHeaders = { ...(options?.headers || {}) };
      (retryHeaders as Record<string, string>)["Authorization"] =
        `Bearer ${tokenData.accessToken}`;
      opts = { ...options, headers: retryHeaders };
      res = await fetch(url, opts);
    }
  }

  try {
    if (!res.ok) {
      // Try to parse error as JSON, fallback to text
      let error: unknown;
      let message: string;
      try {
        error = await res.json();
        message =
          error && typeof error === "object" && "message" in error
            ? (error.message as string)
            : "";
      } catch {
        message = await res.text();
      }
      logger.error(
        `HTTP error ${res.status}: ${typeof error === "string" ? error : JSON.stringify(error)}`,
        "httpClient",
      );
      throw new Error(`HTTP error ${res.status}: ${message || res.statusText}`);
    }
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return res.json();
    }
    return res.text() as unknown as T;
  } catch (err) {
    logger.error(err, "httpClient");
    throw err;
  }
}

// Centralized token refresh logic
async function refreshToken(
  refreshToken: string,
): Promise<ReturnType<typeof loadToken> | null> {
  try {
    // Adjust endpoint and payload as needed for your API
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.accessToken && data?.refreshToken && data?.expiresAt) {
      const tokenData = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      };
      saveToken(tokenData);
      return tokenData;
    }
    return null;
  } catch {
    return null;
  }
}
