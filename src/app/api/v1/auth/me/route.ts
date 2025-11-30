import { NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { cookies } from "next/headers";

interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * GET /api/v1/auth/session
 * Returns current user session information
 *
 * @returns JSON response with session data or error
 */
export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth-session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { success: false, error: "No active session" },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie);
    const { user, expiresAt }: { user: User; expiresAt: number } = session;

    // Check if session is expired
    if (Date.now() > expiresAt) {
      logger.warn("Session expired", "AuthSession");
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 401 }
      );
    }

    logger.debug(`Session validated for user: ${user.id}`, "AuthSession");

    return NextResponse.json({
      success: true,
      user,
      expiresAt,
    });
  } catch (error) {
    logger.error(error, "AuthSession");
    return NextResponse.json(
      { success: false, error: "Session validation failed" },
      { status: 500 }
    );
  }
}