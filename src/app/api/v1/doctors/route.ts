import { NextResponse } from 'next/server';
import process from 'process';
import { mockDoctors } from '@/mocks/doctors';
import { httpClient } from '@/utils/http-client';
import { logger } from '@/utils/logger';
import { loadToken } from '@/utils/token-storage';
import { fetchToken, refreshAccessToken, isTokenValid } from '@/utils/auth';

interface Doctor {
  id: number;
  uuid: string;
  name: string;
  email?: string;
  avatar?: string | null;
  image?: string;
  specialty?: string;
  rating?: number;
  bio?: string;
  availability?: string[];
  callTypes?: Array<'phone' | 'video' | 'voice'>;
}

interface DoctorsApiResponse {
  success: boolean;
  data: Doctor[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
  source?: string;
}

export async function GET(request: Request) {
  // Parse query params for pagination
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const enableMockFallback = process.env.ENABLE_MOCK_FALLBACK === 'true';
  const response: DoctorsApiResponse = {
    success: true,
    data: mockDoctors.map(doctor => ({
      ...doctor,
      callTypes: doctor.callTypes.filter((type): type is 'phone' | 'video' | 'voice' => 
        type === 'phone' || type === 'video' || type === 'voice'
      )
    })),
    total: mockDoctors.length,
    page,
    perPage: limit,
    pageCount: Math.ceil(mockDoctors.length / limit),
    source: 'mock'
  };

  if (enableMockFallback) {
    // Return paginated mock data
    const start = (page - 1) * limit;
    const end = start + limit;
    response.data = response.data.slice(start, end);
    return NextResponse.json(response);
  }

  let token = loadToken();
  if (!isTokenValid(token)) {
    await fetchToken();
    token = loadToken();
  }

  const apiUrl = `${process.env.MEET_API}/doctors?page=${page}&limit=${limit}`;
  logger.debug(`Fetching doctors from ${apiUrl}`, 'Doctors API');

  try {
    const apiCacheRevalidate = parseInt(process.env.API_CACHE_REVALIDATE || '300', 10);
    let data: unknown;
    try {
      data = await httpClient(apiUrl, {
        headers: {
          Authorization: `Bearer ${token?.accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        next: { 
          tags: ['doctors', `doctors-page-${page}`],
          revalidate: apiCacheRevalidate
        },
      });
      logger.info('Doctors fetched successfully', 'Doctors API');
    } catch (err: unknown) {
      if (err instanceof Error && /401|403/.test(err.message)) {
        logger.warn('Token expired, refreshing and retrying', 'Doctors API');
        await refreshAccessToken();
        const refreshed = loadToken();
        data = await httpClient(apiUrl, {
          headers: {
            Authorization: `Bearer ${refreshed?.accessToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          next: { 
            tags: ['doctors', `doctors-page-${page}`],
            revalidate: apiCacheRevalidate
          },
        });
        logger.info('Doctors fetched successfully after token refresh', 'Doctors API');
      } else {
        throw err;
      }
    }

    let doctors: Doctor[] = [];
    let total = 0, pageNum = page, perPage = limit, pageCount = 1;
    if (data && typeof data === 'object' && 'success' in data && 'return' in data) {
      const ret = (data as { return: { data?: Doctor[]; total?: number; page?: number; perPage?: number; pageCount?: number } }).return;
      doctors = Array.isArray(ret.data) ? ret.data : [];
      total = typeof ret.total === 'number' ? ret.total : doctors.length;
      pageNum = typeof ret.page === 'number' ? ret.page : pageNum;
      perPage = typeof ret.perPage === 'number' ? ret.perPage : doctors.length;
      pageCount = typeof ret.pageCount === 'number' ? ret.pageCount : 1;
    }

    const res = NextResponse.json({
      success: true,
      data: doctors,
      total,
      page: pageNum,
      perPage,
      pageCount,
      source: 'api'
    } as DoctorsApiResponse);

    // Optimize for CDN caching with frequent revalidation for fresh data
    const cdnMaxAge = process.env.CDN_MAX_AGE || '300';
    const staleWhileRevalidate = process.env.CDN_STALE_WHILE_REVALIDATE || '600';

    res.headers.set('Cache-Control', `public, s-maxage=${cdnMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`);
    return res;
  } catch (err: unknown) {
    logger.error(err, 'Doctors API - GET');
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to fetch doctors' }, { status: 500 });
  }
}
