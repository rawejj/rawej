
import { logger } from '@/utils/logger';

export async function httpClient<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  // Disable SSL verification in local/dev if env is set
  if (process.env.APP_ENV === 'dev') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      // Try to parse error as JSON, fallback to text
      let error: unknown;
      try {
        error = await res.json();
      } catch {
        error = await res.text();
      }
      logger.error(`HTTP error ${res.status}: ${typeof error === 'string' ? error : JSON.stringify(error)}`, 'httpClient');
      throw new Error(
        `HTTP error ${res.status}: ${typeof error === 'string' ? error : JSON.stringify(error)}`
      );
    }
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    return res.text() as unknown as T;
  } catch (err) {
    logger.error(err, 'httpClient');
    throw err;
  }
}
