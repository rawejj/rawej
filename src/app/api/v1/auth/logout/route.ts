import { NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { CONFIGS } from "@/constants/configs";

/**
 * POST /api/v1/auth/logout
 * Handles user logout by clearing the session cookie and returning user data
 *
 * @returns JSON response with user data and logout confirmation
 */
export async function POST(): Promise<NextResponse> {
  try {
    logger.info("User logout initiated", "AuthLogout");

    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // Clear the auth tokens
    const appName = (CONFIGS.app.name || "Rawej").toLowerCase();
    response.cookies.set(`${appName}_access_token`, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
    });

    response.cookies.set(`${appName}_refresh_token`, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
    });

    logger.info("Logout successful, tokens cleared", "AuthLogout");
    return response;
  } catch (error) {
    logger.error(error, "AuthLogout");
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}