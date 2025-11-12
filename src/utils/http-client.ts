import { logger } from "@/utils/logger";
import { loadToken } from "./token-storage";
import { fetchToken, refreshToken } from "./auth";
import { IS_DEV } from "@/lib/constants";

export async function httpClient<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  // Disable SSL verification in local/dev if env is set
  if (IS_DEV) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  let tokenData = loadToken();
  // Only fetch a new token if none exists and this is not an auth endpoint
  const isAuthEndpoint = url.includes("/auth/token") || url.includes("/auth/refresh");
  if (!tokenData && !isAuthEndpoint) {
    try {
      await fetchToken();
      tokenData = loadToken();
    } catch {
      // If token fetch fails, proceed without token (will likely 401)
    }
  }

  const baseHeaders = { ...(options?.headers || {}) };
  if (tokenData?.accessToken) {
    (baseHeaders as Record<string, string>)["Authorization"] =
      `Bearer ${tokenData.accessToken}`;
  }
  let opts: RequestInit = { ...options, headers: baseHeaders };
  let res = await fetch(url, opts);

  // If unauthorized, try to refresh token and retry once
  if (res.status === 401 && tokenData?.refreshToken) {
    try {
      await refreshToken();
      tokenData = loadToken();
      if (tokenData?.accessToken) {
        const retryHeaders = { ...(options?.headers || {}) };
        (retryHeaders as Record<string, string>)["Authorization"] =
          `Bearer ${tokenData.accessToken}`;
        opts = { ...options, headers: retryHeaders };
        res = await fetch(url, opts);
      }
    } catch {
      // If refresh fails, proceed with original response
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
