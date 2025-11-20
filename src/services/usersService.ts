import { CONFIGS } from "@/constants/configs";
import { httpClient } from "@/utils/http-client";
import { logger } from "@/utils/logger";
import { PaginationParams } from "@/utils/pagination";
import { IS_DEV } from "@/lib/constants";

export type TimeSlot = {
  start: string;
  end: string;
  duration: string;
};

export type DateSlot = {
  title: string;
  label: string;
  value: string;
  times: TimeSlot[];
};

export class UsersService {
  /**
   * Fetches doctors from external API
   * @param params - Pagination parameters
   * @returns Doctors API response from external source
   */
  async fetchDoctors(params: PaginationParams): Promise<unknown> {
    if (!CONFIGS.meetApiUrl) {
      throw new Error("MEET_API environment variable is not configured");
    }
  
    const { page, limit } = params;
    const apiUrl = `${CONFIGS.meetApiUrl}/doctors?page=${page}&limit=${limit}`;
    
    logger.debug(`Fetching doctors from ${apiUrl}`, "DoctorsAPI");
  
    try {
      const data = await httpClient<unknown>(apiUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: {
          tags: ["doctors", `doctors-page-${page}`],
          revalidate: CONFIGS.apiCacheRevalidate,
        },
      });
  
      logger.info(
        `Doctors fetched successfully from external API (page: ${page})`,
        "DoctorsAPI"
      );
      
      return data;
    } catch (error) {
      logger.error(error, "DoctorsAPI - fetchDoctors");
      throw error;
    }
  }

  /**
   * Fetches availability for a specific user UUID from external API
   * @param uuid - User UUID
   * @param type - Optional type filter
   * @returns Array of date slots
   */
  async fetchAvailability(uuid: string, type?: string): Promise<DateSlot[]> {
    if (!CONFIGS.meetApiUrl) {
      throw new Error("MEET_API environment variable is not configured");
    }
    let apiUrl = `${CONFIGS.meetApiUrl}/meets/${uuid}/availability`;
    if (type) {
      apiUrl += `?type=${encodeURIComponent(type)}`;
    }
    logger.debug(`Fetching availability from ${apiUrl}`, "UsersService");
    try {
      const data = await httpClient(apiUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: {
          tags: ["available-slots", `user-${uuid}`],
          revalidate: IS_DEV ? 1 : CONFIGS.apiCacheRevalidate,
        },
      });
      logger.info("Availability fetched successfully", "UsersService");
      const meets: DateSlot[] = Array.isArray((data as { dates?: DateSlot[] }).dates)
        ? (data as { dates: DateSlot[] }).dates
        : [];
      return meets;
    } catch (error) {
      logger.error(error, "UsersService - fetchAvailability");
      throw error;
    }
  }
}

export const usersService = new UsersService();