import process from "process";
import { httpClient } from "@/utils/http-client";
import { logger } from "@/utils/logger";
import {
  saveToken,
  loadToken,
  clearToken,
  TokenData,
} from "@/utils/token-storage";

export function isTokenValid(token: TokenData | null): boolean {
  return (
    !!token &&
    typeof token.accessToken === "string" &&
    token.accessToken.length > 0 &&
    token.expiresAt > Date.now()
  );
}

export async function fetchToken(): Promise<string> {
  const apiBase = process.env.MEET_API;
  const tokenUrl = `${apiBase}/auth/token`;
  logger.debug(`Fetching token from ${tokenUrl}`, "Auth");
  try {
    const tokenResp = await httpClient<{
      accessToken: string;
      refreshToken: string;
      expiresIn?: number;
    }>(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: process.env.MEET_API_USER,
        password: process.env.MEET_API_PASSWORD,
      }),
    });
    const expiresIn = tokenResp.expiresIn || 3600;
    const tokenData: TokenData = {
      accessToken: tokenResp.accessToken,
      refreshToken: tokenResp.refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };
    saveToken(tokenData);
    logger.info("Token fetched and saved", "Auth");
    return tokenData.accessToken;
  } catch (err) {
    logger.error(err, "Auth - fetchToken");
    throw err;
  }
}

export async function refreshAccessToken(): Promise<string> {
  const apiBase = process.env.MEET_API;
  const refreshUrl = `${apiBase}/auth/refresh`;
  logger.debug("Refreshing access token", "Auth");
  const token = loadToken();
  if (!token?.refreshToken) {
    const error = new Error("No refresh token available");
    logger.error(error, "Auth - refreshAccessToken");
    throw error;
  }
  try {
    const resp = await httpClient<{
      accessToken: string;
      refreshToken?: string;
      expiresIn?: number;
    }>(refreshUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });
    const expiresIn = resp.expiresIn || 3600;
    const newToken: TokenData = {
      accessToken: resp.accessToken,
      refreshToken: resp.refreshToken || token.refreshToken,
      expiresAt: Date.now() + expiresIn * 1000,
    };
    saveToken(newToken);
    logger.info("Access token refreshed and saved", "Auth");
    return newToken.accessToken;
  } catch (err) {
    logger.error(err, "Auth - refreshAccessToken");
    clearToken();
    throw err;
  }
}
