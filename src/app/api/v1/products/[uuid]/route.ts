import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { COMMON_HEADERS, createErrorResponse, ErrorResponse } from "@/utils/api-response";
import { productsService } from "@/services/productsService";

interface RouteParams {
  params: Promise<{ uuid: string }>;
}

interface ProductPrice {
  title: string;
  price: number;
  discount_percent: number;
  discounted_amount: number;
}

interface Product {
  slug: string;
  title: string;
  title_en: string;
  summary: string;
  description: string;
  prices: ProductPrice[];
}

/**
 * GET /api/v1/products/[uuid]
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
export async function GET(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse<Product[] | ErrorResponse>> {
  try {
    const { uuid } = await context.params;

    // Validate UUID parameter
    if (!uuid || typeof uuid !== "string") {
      logger.warn("Invalid or missing UUID parameter", "ProductsAPI");
      return createErrorResponse(new Error("Invalid UUID parameter"), 400);
    }

    logger.debug(
      `GET /api/v1/products/${uuid} - Fetching meet products`,
      "ProductsAPI"
    );

    // Fetch products from external API
    const products = await productsService.fetchAllByUser(uuid);

    // Return products with no-cache headers (dynamic data)
    return NextResponse.json(products as unknown as Product[], {
      status: 200,
      headers: COMMON_HEADERS,
    });
  } catch (error) {
    logger.error(error, "ProductsAPI - GET");

    // Determine appropriate status code
    const statusCode =
      error instanceof Error && error.message.includes("not configured")
        ? 503 // Service Unavailable
        : 500; // Internal Server Error

    return createErrorResponse(error, statusCode);
  }
}