import { logger } from "@/utils/logger";
import { loadToken } from "./token-storage";
import { fetchToken, refreshToken, isTokenValid } from "./auth";
import { CONFIGS } from "@/constants/configs";

export interface HttpClientOptions extends RequestInit {
  skipAuthRetry?: boolean;
}

export async function httpClient<T = unknown>(
  url: string,
  options: HttpClientOptions = {}
): Promise<T> {
  // During build/static generation, skip authentication entirely
  const isBuildTime = typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build';
  
  // Disable SSL verification for all HTTPS requests in this context
  if (CONFIGS.disableSslVerification) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }
  let tokenData = null;
  // Only handle authentication if not during build time
  if (!isBuildTime) {
    tokenData = loadToken();
    // Only fetch a new token if none exists, token is invalid, or this is not an auth endpoint
    const isAuthEndpoint = url.includes("/auth/token") || url.includes("/auth/refresh");
    if ((!tokenData || !isTokenValid(tokenData)) && !isAuthEndpoint) {
      try {
        await fetchToken();
        tokenData = loadToken();
      } catch {
        // If token fetch fails, proceed without token (will likely 401)
      }
    }
  }

  const baseHeaders = { ...(options?.headers || {}) };
  if (!isBuildTime && tokenData?.accessToken) {
    (baseHeaders as Record<string, string>)["Authorization"] =
      `Bearer ${tokenData.accessToken}`;
  }
  let reqOpts: RequestInit = { ...options, headers: baseHeaders };
  let res = await fetch(url, reqOpts);

  // If unauthorized, try to refresh token and retry once (skip during build time)
  if (!isBuildTime && !options.skipAuthRetry && res.status === 401 && tokenData?.refreshToken) {
    try {
      await refreshToken();
      tokenData = loadToken();
      if (tokenData?.accessToken) {
        const retryHeaders = { ...(options?.headers || {}) };
        (retryHeaders as Record<string, string>)["Authorization"] =
          `Bearer ${tokenData.accessToken}`;
        reqOpts = { ...options, headers: retryHeaders };
        res = await fetch(url, reqOpts);
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
