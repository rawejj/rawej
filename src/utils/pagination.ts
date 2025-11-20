import { CONFIGS } from "@/constants/configs";

export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Validates and parses pagination parameters from URL search params
 * @param searchParams - URL search parameters
 * @returns Validated pagination parameters
 */
export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(
    CONFIGS.pagination.defaultPage,
    parseInt(searchParams.get("page") || String(CONFIGS.pagination.defaultPage), 10) || CONFIGS.pagination.defaultPage
  );
  
  const limit = Math.min(
    CONFIGS.pagination.maxLimit,
    Math.max(
      CONFIGS.pagination.minLimit,
      parseInt(searchParams.get("limit") || String(CONFIGS.pagination.defaultLimit), 10) || CONFIGS.pagination.defaultLimit
    )
  );

  return { page, limit };
}