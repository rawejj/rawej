import { CONFIGS } from "@/constants/configs";
import { logger } from "@/utils/logger";
import { httpClient } from "@/utils/http-client";
import { PaginatedResponse } from "@/utils/api-response";
import { Doctor } from "@/types/doctor";

/**
 * Fetches doctors from the API with error handling and caching
 * @returns Tuple of [doctors, error]
 */
export async function fetchDoctors(): Promise<[Doctor[], string | null]> {
  try {
    const apiUrl = CONFIGS.app.apiUrl;

    if (!apiUrl) {
      const errorMsg = "NEXT_PUBLIC_API_URL is not configured";
      logger.error(new Error(errorMsg), "HomePage - fetchDoctors");
      return [[], errorMsg];
    }

    const url = `${apiUrl}/users?page=1&limit=${CONFIGS.pagination.doctorsPerPage}`;
    logger.debug(`Fetching doctors from ${url}`, "HomePage");

    const response = await httpClient<PaginatedResponse>(url, {
      next: {
        tags: ["doctors"],
        revalidate: CONFIGS.isr.revalidateTime,
      },
    });

    // Validate response structure
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format from doctors API");
    }

    if (!response.success) {
      throw new Error("API returned unsuccessful response");
    }

    if (!Array.isArray(response.items)) {
      throw new Error(
        `Expected doctors items to be an array, got: ${typeof response.items}`
      );
    }

    logger.info(
      `Successfully fetched ${response.items.length} doctors`,
      "HomePage"
    );

    return [response.items as Doctor[], null];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error fetching doctors";

    logger.error(error, "HomePage - fetchDoctors");

    return [[], errorMessage];
  }
}