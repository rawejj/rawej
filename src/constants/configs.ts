/**
 * Centralized application configuration
 * All environment-based and general app configs are defined here
 */

export const CONFIGS = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Rawej",
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  },
  // API Configuration
  enableMockFallback: process.env.ENABLE_MOCK_FALLBACK === "true",
  remoteApi: {
    url: process.env.REMOTE_API_URL,
    user: process.env.REMOTE_API_USER,
    password: process.env.REMOTE_API_PASSWORD,
  },
  disableSslVerification: process.env.NODE_ENV === "development" || process.env.APP_ENV === "development",
  
  // Cache Configuration
  apiCacheRevalidate: parseInt(process.env.API_CACHE_REVALIDATE || "300", 10),
  cdnMaxAge: process.env.CDN_MAX_AGE || "300",
  cdnStaleWhileRevalidate: process.env.CDN_STALE_WHILE_REVALIDATE || "600",
  
  // ISR (Incremental Static Regeneration) Configuration
  isr: {
    revalidateTime: parseInt(process.env.ISR_REVALIDATE || "60", 10),
  },
  
  // Pagination Configuration
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    minLimit: 1,
    maxLimit: 100,
    doctorsPerPage: 9, // For home page
  },

  // Analytics Configuration
  analytics: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    gscVerificationCode: process.env.NEXT_PUBLIC_GSC_VERIFICATION_CODE,
  },
} as const;

