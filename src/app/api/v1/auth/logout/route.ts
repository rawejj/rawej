import { NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { authService } from "@/services/authService";
import { cookies } from "next/headers";

interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * POST /api/v1/auth/logout
 * Handles user logout by clearing the session cookie and returning user data
 *
 * @returns JSON response with user data and logout confirmation
 */
export async function POST(): Promise<NextResponse> {
  try {
    logger.info("User logout initiated", "AuthLogout");

    // Get current session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("auth-session")?.value;

    let user: User | null = null;

    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie);
        const { token, expiresAt }: { token: string; expiresAt: number } = session;

        // Validate token is still valid by fetching user data
        if (Date.now() <= expiresAt) {
          user = await authService.fetchUser(token);
          logger.info(`User ${user.id} logged out successfully`, "AuthLogout");
        }
      } catch (error) {
        logger.warn(`Failed to validate session during logout: ${error}`, "AuthLogout");
        // Continue with logout even if validation fails
      }
    }

    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
      user, // Return user data if available
    });

    // Clear the auth session cookie
    response.cookies.set("auth-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
    });

    logger.info("Logout successful, session cleared", "AuthLogout");
    return response;
  } catch (error) {
    logger.error(error, "AuthLogout");
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}