import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { loadTranslations } from "@/lib/translations";
import { otpService, OTPVerifyRequest } from "@/services/otpService";
import { CONFIGS } from "@/constants/configs";

/**
 * POST /api/v1/otp/verify
 * Verifies OTP and returns authentication token if successful
 *
 * @param request - Next.js request object with phone number and OTP
 * @returns JSON response with verification result and token
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: OTPVerifyRequest = await request.json();
    const { to, code, countryCode } = body;

    logger.debug(`OTP verify request received: ${JSON.stringify({ to: to ? '[REDACTED]' : undefined, code: code ? '[REDACTED]' : undefined, countryCode })}`, "OTPVerify");

    const locale = await loadTranslations('en'); // Default to English since no language param
    const authMessages = (locale.auth as Record<string, string>) || {};

    if (!to || !code) {
      logger.warn(`Missing required fields - to: ${!!to}, code: ${!!code}`, "OTPVerify");
      return NextResponse.json(
        { success: false, error: authMessages["phone number and otp required"] || "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    // Validate OTP format (should be numeric, typically 4-6 digits)
    const otpRegex = /^\d{4,6}$/;
    if (!otpRegex.test(code)) {
      logger.warn(`Invalid OTP format: ${code} (length: ${code.length})`, "OTPVerify");
      return NextResponse.json(
        { success: false, error: authMessages["invalid otp format"] || "Invalid OTP format" },
        { status: 400 }
      );
    }

    logger.info(`Verifying OTP for phone number: ${to.substring(0, 3)}***${to.substring(to.length - 3)}`, "OTPVerify");

    // Call the auth service to verify OTP
    const result = await otpService.verify({ to, code, countryCode });

    if (result.status.code === 0 && result.accessToken) {
      logger.info(`OTP verification successful for ${to.substring(0, 3)}***${to.substring(to.length - 3)}. Token issued.`, "OTPVerify");

      const response = NextResponse.json({
        success: true,
        message: result.status.message || "Verification successful"
      });

      // Store tokens in separate cookies
      const appName = (CONFIGS.app.name || "Rawej").toLowerCase();
      const cookieName = `${appName}_access_token`;
      logger.info(`Setting cookie: ${cookieName}`, "OTPVerify");
      response.cookies.set(cookieName, result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: result.expiresIn ?? 3600, // 1 hour default if undefined
      });

      if (result.refreshToken) {
        response.cookies.set(`${appName}_refresh_token`, result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60, // 30 days for refresh token
        });
      }

      return response;
    } else {
      logger.warn(`OTP verification failed for ${to.substring(0, 3)}***${to.substring(to.length - 3)}. Status: ${result.status.code} - ${result.status.message}`, "OTPVerify");
      return NextResponse.json({
        success: false,
        error: result.status.message || authMessages["invalid otp"] || "Invalid OTP"
      }, { status: 401 });
    }
  } catch (error) {
    logger.error(`OTP verification failed: ${error}`, "OTPVerify");
    
    // Try to extract more details from the error
    if (error instanceof Error) {
      logger.error(`Error message: ${error.message}`, "OTPVerify");
      logger.error(`Stack trace: ${error.stack}`, "OTPVerify");
    } else if (error && typeof error === 'object') {
      // Handle non-Error objects that might have custom properties
      const errObj = error as Record<string, unknown>;
      if ('message' in errObj && typeof errObj.message === 'string') {
        logger.error(`Error message: ${errObj.message}`, "OTPVerify");
      }
      if ('status' in errObj && typeof errObj.status === 'number') {
        logger.error(`HTTP status: ${errObj.status}`, "OTPVerify");
      }
      if ('response' in errObj) {
        logger.error(`Response: ${JSON.stringify(errObj.response)}`, "OTPVerify");
      }
      if ('stack' in errObj && typeof errObj.stack === 'string') {
        logger.error(`Stack trace: ${errObj.stack}`, "OTPVerify");
      }
    }
    
    const locale = await loadTranslations('en'); // Default to English for error
    const authMessages = (locale.auth as Record<string, string>) || {};
    return NextResponse.json(
      { success: false, error: authMessages["failed to verify otp"] || "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}