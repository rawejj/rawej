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

  const apiUrl = `${process.env.MEET_API}/meets/${uuid}`;
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
    const meets = Array.isArray((data as { meets?: Meet[] })?.meets)
      ? (data as { meets: Meet[] }).meets
      : [];
    // Group by date
    const dateMap: Record<
      string,
      { label: string; value: string; times: string[] }
    > = {};
    meets.forEach((meet: Meet) => {
      // Parse start time
      const startDate = new Date(meet.start.replace(" +0000 UTC", "Z"));
      const endDate = new Date(meet.end.replace(" +0000 UTC", "Z"));
      const dateStr = startDate.toISOString().slice(0, 10); // YYYY-MM-DD
      const label = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      // Time range string
      const startTime = startDate.toISOString().slice(11, 16); // HH:mm
      const endTime = endDate.toISOString().slice(11, 16); // HH:mm
      const timeRange = `${startTime} - ${endTime}`;
      if (!dateMap[dateStr]) {
        dateMap[dateStr] = { label, value: dateStr, times: [] };
      }
      dateMap[dateStr].times.push(timeRange);
    });

    const dates = Object.values(dateMap);
    return new NextResponse(JSON.stringify({ dates }), {
      status: 200,
      headers: commonHeaders,
    });
  } catch {
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch availability" }),
      { status: 500, headers: commonHeaders },
    );
  }
}
