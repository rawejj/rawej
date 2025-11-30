import { NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { cookies } from "next/headers";
import { CONFIGS } from "@/constants/configs";
import { authService } from "@/services/authService";

/**
 * GET /api/v1/auth/me
 * Returns current user information
 *
 * @returns JSON response with user data or error
 */
export async function GET(): Promise<NextResponse> {
  try {
    const appName = (CONFIGS.app.name || "Rawej").toLowerCase();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(`${appName}_access_token`)?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "No active session" },
        { status: 401 }
      );
    }

    // Fetch user data from remote API
    const userData = await authService.fetchUser(accessToken);

    logger.debug(`User data fetched for user: ${userData.id}`, "AuthMe");

    return NextResponse.json({
      success: true,
      user: userData,
    });
  } catch (error) {
    logger.error(error, "AuthMe");
    return NextResponse.json(
      { success: false, error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}