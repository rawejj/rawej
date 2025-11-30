import { Product } from "@/components/BookingModal/ProductSelector";
import { CONFIGS } from "@/constants/configs";
import { httpClient } from "@/utils/http-client";
import { logger } from "@/utils/logger";

interface ExternalApiResponse {
  success: boolean;
  return: {
    items: Product[];
    total?: number;
    page?: number;
    perPage?: number;
    pageCount?: number;
  };
}

class ProductsService {
  /**
  * Fetches products for a specific meet UUID from external API
  * @param userUuid - Meet UUID
  * @returns Array of products
  */
  async fetchAllByUser(userUuid: string): Promise<Product[]> {
    if (!CONFIGS.remoteApi.url) {
      throw new Error("REMOTE_API_URL environment variable is not configured");
    }
    
    const apiUrl = `${CONFIGS.remoteApi.url}/products/meets/${userUuid}`;
    logger.debug(`Fetching meet products from ${apiUrl}`, "ProductsAPI");
    
    try {
      const response = await httpClient<ExternalApiResponse>(apiUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        next: {
          tags: ["products", `products-${userUuid}`],
          revalidate: CONFIGS.apiCacheRevalidate,
        },
      });
      
      // Validate response structure
      if (!response || typeof response !== "object") {
        throw new Error("Invalid response format from products API");
      }
      
      if (!response.success) {
        throw new Error("API returned unsuccessful response");
      }
      
      if (!response.return || !Array.isArray(response.return.items)) {
        throw new Error(
          `Expected products items to be an array, got: ${typeof response.return?.items}`
        );
      }
      
      logger.info(
        `Successfully fetched ${response.return.items.length} products for meet ${userUuid}`,
        "ProductsAPI"
      );
      
      return response.return.items;
    } catch (error) {
      logger.error(error, "ProductsAPI - fetchProductsByUuid");
      throw error;
    }
  }
}

export const productsService = new ProductsService();