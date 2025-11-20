import { CONFIGS } from "@/constants/configs";
import { IS_DEV } from "@/lib/constants";
import { NextResponse } from "next/server";
import { PaginationParams } from "./pagination";

interface ExternalApiResponse {
  success: boolean;
  return: {
    items?: unknown[];
    total?: number;
    page?: number;
    perPage?: number;
    pageCount?: number;
  };
}


export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

export interface PaginatedResponse {
  success: boolean;
  items: unknown[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
  source?: string;
}

export const COMMON_HEADERS = {
  "Cache-Control": "no-store, must-revalidate",
  "Content-Type": "application/json",
  Vary: "*",
} as const;

/**
 * Creates an error response with consistent structure
 * @param error - Error object or message
 * @param status - HTTP status code
 * @returns NextResponse with error details
 */
export function createErrorResponse(
  error: unknown,
  status: number = 500
): NextResponse<ErrorResponse> {
  const errorMessage =
    error instanceof Error ? error.message : "Failed to fetch products";
  
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      message: IS_DEV ? (error instanceof Error ? error.stack || errorMessage : String(error)) : errorMessage,
    },
    { status, headers: COMMON_HEADERS }
  );
}

/**
 * Creates a Next.js response with appropriate cache headers
 * @param data - Response data
 * @returns NextResponse with cache headers
 */
export function createCachedResponse(data: PaginatedResponse): NextResponse {
  const response = NextResponse.json(data);

  // Optimize for CDN caching with stale-while-revalidate strategy
  response.headers.set(
    "Cache-Control",
    `public, s-maxage=${CONFIGS.cdnMaxAge}, stale-while-revalidate=${CONFIGS.cdnStaleWhileRevalidate}`
  );

  return response;
}


/**
 * Parses external API response and extracts doctor data
 * @param data - Raw API response
 * @param fallback - Fallback pagination params
 * @returns Parsed doctors data
 */
export function parseExternalApiResponse(
  data: unknown,
  fallback: PaginationParams
): Omit<PaginatedResponse, "success" | "source"> {
  if (
    !data ||
    typeof data !== "object" ||
    !("success" in data) ||
    !("return" in data)
  ) {
    return {
      items: [],
      total: 0,
      page: fallback.page,
      perPage: fallback.limit,
      pageCount: 0,
    };
  }

  const apiResponse = data as ExternalApiResponse;
  const ret = apiResponse.return;
  const items = Array.isArray(ret.items) ? ret.items : [];
  const total = typeof ret.total === "number" ? ret.total : items.length;
  const perPage = typeof ret.perPage === "number" ? ret.perPage : items.length;

  return {
    items,
    total,
    page: typeof ret.page === "number" ? ret.page : fallback.page,
    perPage,
    pageCount: typeof ret.pageCount === "number" ? ret.pageCount : Math.ceil(total / perPage),
  };
}