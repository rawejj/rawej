import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { loadTranslations } from "@/lib/translations";
import { LanguageKey } from "@/providers/LocalizationProvider";
import { OTPSendRequest, otpService } from "@/services/otpService";

/**
 * POST /api/v1/otp/send
 * Sends OTP to the provided phone number
 *
 * @param request - Next.js request object with phone number
 * @returns JSON response with OTP send result
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: OTPSendRequest = await request.json();
    const { to, countryCode, language } = body;

    logger.debug(`OTP send request received: ${JSON.stringify({ to: to ? '[REDACTED]' : undefined, countryCode, language })}`, "OTPSend");

    // Validate language parameter
    const supportedLanguages: LanguageKey[] = ['en', 'de', 'fr', 'ku-sor', 'ku-kur', 'fa'];
    const validLanguage = supportedLanguages.includes(language as LanguageKey) ? language as LanguageKey : 'en';

    const locale = await loadTranslations(validLanguage);
    const authMessages = (locale.auth as Record<string, string>) || {};

    if (!to || !countryCode) {
      logger.warn(`Missing required fields - to: ${!!to}, countryCode: ${!!countryCode}`, "OTPSend");
      return NextResponse.json(
        { success: false, error: authMessages["phone number and country code required"] || "Phone number and country code are required" },
        { status: 400 }
      );
    }

    // Validate country code format
    const countryCodeRegex = /^\+\d{1,4}$/;
    if (!countryCodeRegex.test(countryCode)) {
      logger.warn(`Invalid country code format: ${countryCode}`, "OTPSend");
      return NextResponse.json(
        { success: false, error: authMessages["invalid country code format"] || "Invalid country code format" },
        { status: 400 }
      );
    }

    // Validate phone number format (basic validation - digits only, no country code)
    const phoneRegex = /^\d{6,14}$/;
    if (!phoneRegex.test(to)) {
      logger.warn(`Invalid phone number format: ${to} (length: ${to.length})`, "OTPSend");
      return NextResponse.json(
        { success: false, error: authMessages["invalid phone number format"] || "Invalid phone number format" },
        { status: 400 }
      );
    }

    logger.info(`Sending OTP to phone number: ${to.substring(0, 3)}***${to.substring(to.length - 3)} with country code: ${countryCode} and language: ${language}`, "OTPSend");

    // Call the auth service to send OTP
    const result = await otpService.send({ to, countryCode, language });

    logger.info(`OTP send result for ${to.substring(0, 3)}***${to.substring(to.length - 3)}: success=${result.success}, message=${result.message || 'none'}`, "OTPSend");

    return NextResponse.json({...{success: true}, ...result});
  } catch (error) {
    logger.error(`OTP send failed: ${error}`, "OTPSend");
    
    // Try to extract more details from the error
    if (error instanceof Error) {
      logger.error(`Error message: ${error.message}`, "OTPSend");
      logger.error(`Stack trace: ${error.stack}`, "OTPSend");
    } else if (error && typeof error === 'object') {
      // Handle non-Error objects that might have custom properties
      const errObj = error as Record<string, unknown>;
      if ('message' in errObj && typeof errObj.message === 'string') {
        logger.error(`Error message: ${errObj.message}`, "OTPSend");
      }
      if ('status' in errObj && typeof errObj.status === 'number') {
        logger.error(`HTTP status: ${errObj.status}`, "OTPSend");
      }
      if ('response' in errObj) {
        logger.error(`Response: ${JSON.stringify(errObj.response)}`, "OTPSend");
      }
      if ('stack' in errObj && typeof errObj.stack === 'string') {
        logger.error(`Stack trace: ${errObj.stack}`, "OTPSend");
      }
    }
    
    const locale = await loadTranslations('en'); // Default to English for error
    const authMessages = (locale.auth as Record<string, string>) || {};
    return NextResponse.json(
      { success: false, error: authMessages["failed to send otp"] || "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}