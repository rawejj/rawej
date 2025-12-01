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
      throw new Error("REMOTE_API_URL environment variable is not configured");
    }

    logger.debug(`Sending OTP to ${request.to}`, "OTPService");
    
    try {
      const response: OTPSendResponse = await httpClient<OTPSendResponse>(`${CONFIGS.remoteApi.url}/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        skipAuthRetry: true,
      });

      logger.info(`OTP sent successfully to ${request.to}`, "OTPService");
      return response;
    } catch (error) {
      logger.error(error, "OTPService - sendOTP");
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
      throw new Error("REMOTE_API_URL environment variable is not configured");
    }

    const verifyUrl = `${CONFIGS.remoteApi.url}/otp/verify`;

    logger.debug(`Verifying OTP for ${request.to}`, "OTPService");

    try {
      const response: OTPVerifyResponse = await httpClient<OTPVerifyResponse>(verifyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        skipAuthRetry: true,
      });

      logger.info(`OTP verification ${response.status.code === 0 ? 'successful' : 'failed'} for ${request.to}`, "OTPService");
      return response;
    } catch (error) {
      logger.error(error, "OTPService - verifyOTP");
      throw error;
    }
  }
}

export const otpService = new OTPService();