import { NextRequest, NextResponse } from "next/server";
import { mockDoctors } from "@/mocks/doctors";
import { logger } from "@/utils/logger";
import { CONFIGS } from "@/constants/configs";
import { getPaginationParams, PaginationParams } from "@/utils/pagination";
import { createCachedResponse, PaginatedResponse, parseExternalApiResponse } from "@/utils/api-response";
import { usersService } from "@/services/usersService";
import { Doctor } from "@/types/doctor";

/**
 * Normalizes doctor data to ensure consistent call types
 * @param doctors - Array of doctors to normalize (with any call type strings)
 * @returns Normalized doctor array with validated call types
 */
function normalizeDoctors(doctors: Array<Omit<Doctor, 'callTypes'> & { callTypes?: string[] }>): Doctor[] {
  return doctors.map((doctor) => ({
    ...doctor,
    callTypes: doctor.callTypes?.filter(
      (type): type is "phone" | "video" | "text" =>
        type === "phone" || type === "video" || type === "text"
    ),
  }));
}

/**
 * Creates a paginated response from mock data
 * @param params - Pagination parameters
 * @returns Doctors API response with mock data
 */
function getMockDoctorsResponse(params: PaginationParams): PaginatedResponse {
  const { page, limit } = params;
  const normalizedDoctors = normalizeDoctors(mockDoctors);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedDoctors = normalizedDoctors.slice(start, end);

  return {
    success: true,
    items: paginatedDoctors,
    total: normalizedDoctors.length,
    page,
    perPage: limit,
    pageCount: Math.ceil(normalizedDoctors.length / limit),
    source: "mock",
  };
}

/**
 * GET /api/v1/doctors
 * Retrieves a paginated list of doctors
 * 
 * @param request - Next.js request object
 * @returns JSON response with doctor list or error
 * 
 * Query Parameters:
 * - page: Page number (default: 1, min: 1)
 * - limit: Items per page (default: 10, min: 1, max: 100)
 * 
 * Response:
 * - 200: Success with doctors list
 * - 500: Internal server error
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const paginationParams = getPaginationParams(searchParams);

    logger.debug(
      `GET /api/v1/doctors - page: ${paginationParams.page}, limit: ${paginationParams.limit}`,
      "DoctorsAPI"
    );

    // Return mock data if mock mode is enabled
    if (CONFIGS.enableMockFallback) {
      logger.info("Returning mock data (ENABLE_MOCK_FALLBACK=true)", "DoctorsAPI");
      const mockResponse = getMockDoctorsResponse(paginationParams);
      return NextResponse.json(mockResponse);
    }

    // Fetch from external API
    const data = await usersService.fetchDoctors(paginationParams);
    const parsedData = parseExternalApiResponse(data, paginationParams);
  
    return createCachedResponse({
      success: true,
      ...parsedData,
      source: "api",
    });
  } catch (error) {
    logger.error(error, "DoctorsAPI - GET");

    const errorMessage = error instanceof Error ? error.message : "Failed to fetch";
    
    const statusCode = 
      error instanceof Error && error.message.includes("not configured") 
        ? 503 // Service Unavailable
        : 500; // Internal Server Error

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        items: [],
        total: 0,
        page: 1,
        perPage: CONFIGS.pagination.defaultLimit,
        pageCount: 0,
      },
      { status: statusCode }
    );
  }
}
