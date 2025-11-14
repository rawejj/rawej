import { IS_DEV } from "@/lib/constants";
import { httpClient } from "@/utils/http-client";
import { logger } from "@/utils/logger";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Params = { uuid: string };

type Meet = {
  start: string;
  end: string;
};

type TimeSlot = {
  start: string;
  end: string;
  duration: string;
};

type DateSlot = {
  title: string;
  label: string;
  value: string;
  times: TimeSlot[];
};

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

    const meets: DateSlot[] = Array.isArray((data as { dates?: DateSlot[] }).dates)
      ? (data as { dates: DateSlot[] }).dates
      : [];
    
    return new NextResponse(JSON.stringify(meets), {
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
