import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COMMON_HEADERS } from "@/utils/api-response";
import { usersService, DateSlot } from "@/services/usersService";
import { logger } from "@/utils/logger";
import { IS_DEV } from "@/lib/constants";

interface RouteParams {
  params: Promise<{ uuid: string }>;
}

export async function GET(request: NextRequest, context: RouteParams) {
  const { uuid } = await context.params;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || undefined;

  try {
    const meets: DateSlot[] = await usersService.fetchAvailability(uuid, type);
    return new NextResponse(JSON.stringify(meets), {
      status: 200,
      headers: COMMON_HEADERS,
    });
  } catch (err) {
    logger.error(`Failed to fetch availability: ${err}`, "Users API");
    return new NextResponse(
      JSON.stringify({ message: IS_DEV ? `Failed to fetch availabilities: ${err}` : "Internal Server Error" }),
      { status: 500, headers: COMMON_HEADERS },
    );
  }
}
