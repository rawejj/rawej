import { CONFIGS } from "@/constants/configs";
import { httpClient } from "@/utils/http-client";
import { logger } from "@/utils/logger";

export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

export interface OTPSendRequest {
  to: string;
  countryCode: string;
  language: string;
}

export interface OTPSendResponse {
  success: boolean;
  message?: string;
  otpId?: string; // For tracking the OTP session
}

export interface OTPVerifyRequest {
  to: string;
  code: string;
  countryCode: string;
}

export interface OTPVerifyResponse {
  status: {code: number, message: string};
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export class OTPService {
  /**
   * Sends OTP to phone number via /otp/send endpoint
   * @param request - OTP send request with phone number
   * @returns OTP send response
   */
  async send(request: OTPSendRequest): Promise<OTPSendResponse> {
    if (!CONFIGS.remoteApi.url) {
      const error = new Error("REMOTE_API_URL environment variable is not configured");
      logger.error(`OTP send failed: ${error.message}`, "OTPService");
      throw error;
    }

    const otpUrl = `${CONFIGS.remoteApi.url}/otp`;
    logger.debug(`Sending OTP to ${request.to} with country code ${request.countryCode}`, "OTPService");
    
    try {
      logger.debug(`Making HTTP request to ${otpUrl} with body: ${JSON.stringify(request)}`, "OTPService");
      
      const response: OTPSendResponse = await httpClient<OTPSendResponse>(otpUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        skipAuthRetry: true,
      });

      logger.info(`OTP sent successfully to ${request.to}. Response: ${JSON.stringify(response)}`, "OTPService");
      return response;
    } catch (error) {
      logger.error(`OTP send failed for ${request.to}. URL: ${otpUrl}. Request: ${JSON.stringify(request)}. Error: ${error}`, "OTPService");
      
      // Log additional error details if available
      if (error instanceof Error) {
        logger.error(`Error message: ${error.message}`, "OTPService");
      }
      
      throw error;
    }
  }

  /**
   * Verifies OTP via /otp/verify endpoint
   * @param request - OTP verify request with phone number and OTP
   * @returns OTP verify response with token if successful
   */
  async verify(request: OTPVerifyRequest): Promise<OTPVerifyResponse> {
    if (!CONFIGS.remoteApi.url) {
      const error = new Error("REMOTE_API_URL environment variable is not configured");
      logger.error(`OTP verify failed: ${error.message}`, "OTPService");
      throw error;
    }

    const verifyUrl = `${CONFIGS.remoteApi.url}/otp/verify`;

    logger.debug(`Verifying OTP for ${request.to} with code length ${request.code.length}`, "OTPService");
    
    try {
      logger.debug(`Making HTTP request to ${verifyUrl} with body: ${JSON.stringify({ ...request, code: '[REDACTED]' })}`, "OTPService");
      
      const response: OTPVerifyResponse = await httpClient<OTPVerifyResponse>(verifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        skipAuthRetry: true,
      });

      const success = response.status.code === 0;
      logger.info(`OTP verification ${success ? 'successful' : 'failed'} for ${request.to}. Status: ${response.status.code} - ${response.status.message}`, "OTPService");
      return response;
    } catch (error) {
      logger.error(`OTP verification failed for ${request.to}. URL: ${verifyUrl}. Request: ${JSON.stringify({ ...request, code: '[REDACTED]' })}. Error: ${error}`, "OTPService");
      
      // Log additional error details if available
      if (error instanceof Error) {
        logger.error(`Error message: ${error.message}`, "OTPService");
      }
      
      throw error;
    }
  }
}

export const otpService = new OTPService();