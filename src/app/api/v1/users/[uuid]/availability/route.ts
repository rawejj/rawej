import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COMMON_HEADERS } from "@/utils/api-response";
import { usersService, DateSlot } from "@/services/usersService";
import { logger } from "@/utils/logger";
import { IS_DEV } from "@/lib/constants";
import { mockAvailabilities } from "@/mocks/availablities";
import { CONFIGS } from "@/constants/configs";

interface RouteParams {
  params: Promise<{ uuid: string }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  const { uuid } = await context.params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || undefined;
  
  try {
    // Return mock data if fallback is enabled
    if (CONFIGS.enableMockFallback) {
      logger.info("Returning mock availability data (ENABLE_MOCK_FALLBACK=true)", "AvailabilityAPI");
      return new NextResponse(JSON.stringify(mockAvailabilities.dates), {
        status: 200,
        headers: COMMON_HEADERS,
      });
    }

    // Try to fetch from external API, fall back to mock data if it fails
    try {
      const meets: DateSlot[] = await usersService.fetchAvailability(uuid, type);
      return new NextResponse(JSON.stringify(meets), {
        status: 200,
        headers: COMMON_HEADERS,
      });
    } catch (fetchError) {
      logger.warn(`Failed to fetch availability from external API, falling back to mock data: ${fetchError}`, "AvailabilityAPI");
      return new NextResponse(JSON.stringify(mockAvailabilities.dates), {
        status: 200,
        headers: COMMON_HEADERS,
      });
    }
  } catch (err) {
    logger.error(`Failed to fetch availability: ${err}`, "Users API");
    return new NextResponse(
      JSON.stringify({ message: IS_DEV ? `Failed to fetch availabilities: ${err}` : "Internal Server Error" }),
      { status: 500, headers: COMMON_HEADERS },
    );
  }
}
