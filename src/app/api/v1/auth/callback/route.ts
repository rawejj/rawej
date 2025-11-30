import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { CONFIGS } from "@/constants/configs";

/**
 * GET /api/v1/auth/callback
 * Handles authentication callback with token from URL
 *
 * @param request - Next.js request object
 * @returns JSON response or redirect
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const exp = parseInt(searchParams.get("exp") || "3600", 10);
    const lang = searchParams.get("lang") || "";

    if (!token) {
      logger.warn("No token provided in auth callback", "AuthCallback");
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 400 }
      );
    }

    // Call /auth/me to get user info using the token
    const apiBase = CONFIGS.remoteApi.url;
    if (!apiBase) {
      logger.error("REMOTE_API_URL environment variable not set", "AuthCallback");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const appName = (CONFIGS.app.name || "Rawej").toLowerCase();
    const response = NextResponse.redirect(new URL(`/${lang}`, request.url));

    response.cookies.set(`${appName}_access_token`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: exp, // 1 hour
    });

    logger.info("Auth callback successful, token set", "AuthCallback");
    return response;
  } catch (error) {
    logger.error(error, "AuthCallback");
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}