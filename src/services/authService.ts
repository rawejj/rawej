import { CONFIGS } from "@/constants/configs";
import { User } from "@/types/user";
import { httpClient } from "@/utils/http-client";
import { logger } from "@/utils/logger";

export class AuthService {
  /**
   * Fetches current user information from /auth/me endpoint
   * @param token - Access token for authentication
   * @returns User information
   */
  async fetchUser(token: string): Promise<User> {
    if (!CONFIGS.remoteApi.url) {
      throw new Error("REMOTE_API_URL environment variable is not configured");
    }

    const meUrl = `${CONFIGS.remoteApi.url}/auth/me`;

    logger.debug(`Fetching user info from ${meUrl}`, "AuthService");

    try {
      const user: User = await httpClient<User>(meUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        skipAuthRetry: true, // Don't use stored tokens for this request
      });

      logger.info(`User info fetched successfully for user: ${user.id}`, "AuthService");
      return user;
    } catch (error) {
      logger.error(`${meUrl} ${error}`, "AuthService - fetchUser");
      throw error;
    }
  }

  /**
   * Validates a token by calling /auth/me
   * @param token - Access token to validate
   * @returns true if token is valid, false otherwise
   */
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.fetchUser(token);
      return true;
    } catch (error) {
      logger.warn(`Token validation failed: ${error}`, "AuthService");
      return false;
    }
  }
}

export const authService = new AuthService();