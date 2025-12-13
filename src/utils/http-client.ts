import { logger } from "@/utils/logger";
import { loadToken } from "@/utils/token-storage";
import { fetchToken, refreshToken } from "@/utils/auth";
import { CONFIGS } from "@/constants/configs";
import { cookies } from "next/headers";

export interface HttpClientOptions extends RequestInit {
  skipAuthRetry?: boolean;
}

/**
 * Determines if the request should use token-based authentication
 */
function shouldUseTokenAuth(url: string): boolean {
  return url.includes("/users/trappists") || url.includes("/doctors");
}

/**
 * Determines if the URL is an authentication endpoint
 */
function isAuthEndpoint(url: string): boolean {
  return url.includes("/auth/token") || url.includes("/auth/refresh");
}

/**
 * Loads access token from HTTP-only cookie
 */
async function loadTokenFromCookie(): Promise<string | null> {
  try {
    const appName = (CONFIGS.app.name || "Rawej").toLowerCase();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(`${appName}_access_token`)?.value;
    return accessToken || null;
  } catch (error) {
    logger.error(error, "httpClient - loadTokenFromCookie");
    return null;
  }
}

/**
 * Handles token-based authentication
 * Loads from HTTP-only cookie for all endpoints
 * Falls back to file storage only for /doctors endpoints
 */
async function handleTokenAuth(url: string): Promise<{ accessToken: string } | null> {
  // Always try to load from HTTP-only cookie first
  let accessToken = await loadTokenFromCookie();

  // If no cookie token and this is a /doctors endpoint, try file storage
  if (!accessToken && shouldUseTokenAuth(url)) {
    const tokenData = loadToken();
    accessToken = tokenData?.accessToken || null;
  }

  // If still no token and this is a /doctors endpoint, try to fetch new token (up to 3 attempts)
  if (!accessToken && shouldUseTokenAuth(url) && !isAuthEndpoint(url)) {
    let attempts = 0;
    const maxAttempts = 3;
    while (!accessToken && attempts < maxAttempts) {
      try {
        await fetchToken();
        // After fetching, check cookie first, then file storage
        accessToken = await loadTokenFromCookie();
        if (!accessToken) {
          const tokenData = loadToken();
          accessToken = tokenData?.accessToken || null;
        }
        attempts++;
      } catch (error) {
        logger.error(`${url} - Attempt ${attempts + 1} failed: ${error}`, "httpClient - handleTokenAuth");
        attempts++;
      }
    }
    if (accessToken) {
      return { accessToken };
    }
  }

  return accessToken ? { accessToken } : null;
}

/**
 * Attempts to refresh token and retry the request for doctor requests
 */
async function retryWithRefreshedToken(
  url: string,
  options: HttpClientOptions,
  originalTokenData: { refreshToken: string } | null
): Promise<Response | null> {
  if (!originalTokenData?.refreshToken) {
    return null;
  }

  try {
    await refreshToken();
    // After refresh, try to get new access token from cookie first
    let newAccessToken = await loadTokenFromCookie();
    
    // If no cookie token and this is a /doctors endpoint, try file storage
    if (!newAccessToken && shouldUseTokenAuth(url)) {
      const tokenData = loadToken();
      newAccessToken = tokenData?.accessToken || null;
    }

    if (newAccessToken) {
      const retryHeaders = {
        ...(options.headers || {}),
        Authorization: `Bearer ${newAccessToken}`
      };
      const retryOptions = { ...options, headers: retryHeaders };
      return await fetch(url, retryOptions);
    }
  } catch {
    // Refresh failed, return null to use original response
  }

  return null;
}

/**
 * Processes the HTTP response and extracts the data
 */
async function processResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const responseText = await res.text();
    let message = responseText;

    try {
      const error = JSON.parse(responseText);
      message = (error && typeof error === "object" && "message" in error)
        ? (error.message as string)
        : responseText;
    } catch {
      // Response is not JSON, use text directly
    }

    logger.error(`Final error message: ${message}`, "httpClient");
    throw new Error(`HTTP error ${res.status}: ${message || res.statusText}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }

  return res.text() as unknown as T;
}

export async function httpClient<T = unknown>(
  url: string,
  options: HttpClientOptions = {}
): Promise<T> {
  // Skip authentication during build/static generation
  const isBuildTime = typeof window === 'undefined' && process.env.NEXT_PHASE === 'phase-production-build';

  // Configure SSL for development
  if (CONFIGS.disableSslVerification) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  // Determine authentication method
  const useTokenAuth = !isBuildTime && shouldUseTokenAuth(url);

  // Handle authentication - load token for all endpoints from cookie
  let accessToken: string | null = null;
  if (!isBuildTime) {
    const tokenData = await handleTokenAuth(url);
    accessToken = tokenData?.accessToken || null;
  }

  // Prepare request headers
  const headers = {
    ...(options.headers || {}),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` })
  };

  // Make initial request
  const reqOpts: RequestInit = { ...options, headers };
  let response = await fetch(url, reqOpts);

  // Retry with refreshed token if unauthorized (only for token-auth requests)
  if (useTokenAuth && !options.skipAuthRetry && response.status === 401) {
    logger.debug("Token expired, attempting refresh", "httpClient");
    const tokenData = loadToken();
    const retryResponse = await retryWithRefreshedToken(url, options, tokenData);
    if (retryResponse) {
      response = retryResponse;
      logger.debug("Token refresh successful, retrying request", "httpClient");
    } else {
      logger.debug("Token refresh failed", "httpClient");
    }
  }

  // Process and return response data
  try {
    return await processResponse<T>(response);
  } catch (err) {
    logger.error(`${url} - ${err}`, "httpClient");
    throw err;
  }
}
