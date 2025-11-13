import { IS_DEV } from "@/lib/constants";
import { httpClient } from "@/utils/http-client";
import { logger } from "@/utils/logger";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Params = { uuid: string };

export async function GET(request: NextRequest, context: { params: Params }) {
  const { uuid } = await context.params;
  const commonHeaders = {
    "Cache-Control": "no-store, must-revalidate",
    "Content-Type": "application/json",
    Vary: "*",
  };

  const apiUrl = `${process.env.MEET_API}/meets/${uuid}/availability`;
  logger.debug(
    `Fetching availability from ${apiUrl}`,
    "Doctors Availability API",
  );

  try {
    const apiCacheRevalidate = parseInt(
      process.env.API_CACHE_REVALIDATE || "300",
      10,
    );
    const data = await httpClient(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      next: {
        tags: ["available-slots"],
        revalidate: apiCacheRevalidate,
      },
    });
    logger.info(
      "Doctors availability fetched successfully",
      "Doctors Availability API",
    );

    // Transform remote meets to { dates: [{ label, value, times: [] }] }
    type Meet = { start: string; end: string };
    const meets = Array.isArray((data as { dates?: Meet[] })?.dates)
      ? (data as { dates: Meet[] }).dates
      : [];
      
    const dates = Object.values(meets);
    return new NextResponse(JSON.stringify({ dates }), {
      status: 200,
      headers: commonHeaders,
    });
  } catch (err) {
    logger.error(`Failed to fetch availability: ${err}`, "Doctors Availability API");

    return new NextResponse(
      JSON.stringify({ message: IS_DEV ? err :"Failed to fetch availabilities" }),
      { status: 500, headers: commonHeaders },
    );
  }
}
