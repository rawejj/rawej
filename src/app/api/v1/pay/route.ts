import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { COMMON_HEADERS, createErrorResponse, ErrorResponse } from "@/utils/api-response";
import { httpClient } from "@/utils/http-client";
import { CONFIGS } from "@/constants/configs";

interface ExternalOrderApiResponse {
  success: boolean;
  return: {
    orderId: string;
  };
}
interface ExternalPaymentApiResponse {
  success: boolean;
  return: {
    redirectUrl: string;
  };
}

/**
 * GET /api/v1/pay/[uuid]
 * Retrieves products/meet types for a specific meet UUID
 *
 * @param request - Next.js request object
 * @param context - Route context with params
 * @returns JSON response with products list or error
 * 
 * Response:
 * - 200: Success with products array
 * - 400: Invalid UUID parameter
 * - 503: Service unavailable (API not configured)
 * - 500: Internal server error
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<{success: boolean}> | ErrorResponse> {
  try {
    const body = await request.json();
    const { doctorUuid, productPriceId, selectedDateTime, timezone } = body;

    if (!doctorUuid || !productPriceId || !selectedDateTime) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, {
        status: 400,
        headers: COMMON_HEADERS,
      });
    }

    // Parse the timezone-aware datetime
    const appointmentDate = new Date(selectedDateTime);
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json({ success: false, error: "Invalid appointment datetime" }, {
        status: 400,
        headers: COMMON_HEADERS,
      });
    }

    const ordersApiUrl = CONFIGS.meetApiUrl + '/orders';
    logger.info(`Creating order for doctorUuid=${doctorUuid}, productPriceId=${productPriceId}`, "PaymentAPI");

    const orderResponse: ExternalOrderApiResponse = await httpClient(ordersApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items:[{priceId: productPriceId, count: 1}],
        details: {
          doctorUuid,
          selectedDateTime, // Send the full timezone-aware datetime
          timezone,
        },
      }),
    });

    if (!orderResponse.success) {
      return NextResponse.json({ success: false, error: "Failed to create order" }, {
        status: 500,
        headers: COMMON_HEADERS,
      });
    }

    const paymentApiUrl = CONFIGS.meetApiUrl + '/payment';
    // Here you would call your payment provider or business logic
    // For now, just log and return success
    logger.info(`Payment request: doctorUuid=${doctorUuid}, productPriceId=${productPriceId}, selectedDateTime=${selectedDateTime}, timezone=${timezone}`, "PaymentAPI");

    const response: ExternalPaymentApiResponse = await httpClient(paymentApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderResponse.return.orderId,
        // callbackUrl: CONFIGS.paymentCallbackUrl ?? 'https://example.com/payment-callback',
      }),
    });


    return NextResponse.json({ success: true, redirectUrl: response.return.redirectUrl }, {
      status: 200,
      headers: COMMON_HEADERS,
    });
  } catch (error) {
    logger.error(error, "PaymentAPI - POST");
    const statusCode =
      error instanceof Error && error.message.includes("not configured")
        ? 503
        : 500;
    return createErrorResponse(error, statusCode);
  }
}