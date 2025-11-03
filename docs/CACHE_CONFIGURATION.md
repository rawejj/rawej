# Cache Configuration Best Practices

## Overview
All cache timings are now configurable via environment variables for flexibility across environments (development, staging, production).

## Environment Variables

### ISR_REVALIDATE (default: 60 seconds)
**What it does**: Controls how often Next.js regenerates pages in the background.
**Best practice**: 
- Development: 10-30 seconds for fast updates
- Production: 60-300 seconds depending on data freshness requirements
- High traffic: Keep at 60-120 seconds to balance freshness and performance

### API_CACHE_REVALIDATE (default: 300 seconds / 5 minutes)
**What it does**: Controls how long Next.js caches API fetch responses.
**Best practice**:
- Should be 2-5x larger than ISR_REVALIDATE
- Production: 300-600 seconds for stable data
- Frequent updates: 60-180 seconds
- Rarely changing data: 900-3600 seconds

### CDN_MAX_AGE (default: 300 seconds / 5 minutes)
**What it does**: How long CDN/edge caches hold the response (s-maxage).
**Best practice**:
- Should match or be slightly less than API_CACHE_REVALIDATE
- Production: 300-600 seconds
- High traffic with stable data: 600-1800 seconds
- Frequently changing data: 60-300 seconds

### CDN_STALE_WHILE_REVALIDATE (default: 600 seconds / 10 minutes)
**What it does**: How long to serve stale content while fetching fresh data in background.
**Best practice**:
- Should be 2x CDN_MAX_AGE
- Provides graceful degradation if origin is slow/down
- Production: 600-1800 seconds
- Critical for high availability

## Recommended Configurations

### High Traffic + Fresh Data (Recommended for your use case)
```env
ISR_REVALIDATE=60
API_CACHE_REVALIDATE=300
CDN_MAX_AGE=300
CDN_STALE_WHILE_REVALIDATE=600
```
**Benefits**: Balances performance with data freshness, handles millions of requests efficiently.

### Very High Traffic + Stable Data
```env
ISR_REVALIDATE=120
API_CACHE_REVALIDATE=600
CDN_MAX_AGE=600
CDN_STALE_WHILE_REVALIDATE=1200
```
**Benefits**: Maximum cache efficiency, reduced origin load, best for data that changes less frequently.

### Real-time Requirements
```env
ISR_REVALIDATE=30
API_CACHE_REVALIDATE=60
CDN_MAX_AGE=60
CDN_STALE_WHILE_REVALIDATE=120
```
**Benefits**: Near real-time updates, higher origin load but fresher data.

### Development
```env
ISR_REVALIDATE=10
API_CACHE_REVALIDATE=30
CDN_MAX_AGE=30
CDN_STALE_WHILE_REVALIDATE=60
```
**Benefits**: Fast iteration, see changes quickly.

## Why This Is Best Practice

1. **Environment-specific**: Different environments need different cache strategies
2. **No code changes**: Adjust cache without deploying new code
3. **Easy testing**: Test different strategies by changing env vars
4. **Production flexibility**: Quick response to traffic patterns without redeployment
5. **Documentation**: Clear values in .env.example for team understanding
6. **Monitoring**: Can correlate cache settings with performance metrics
7. **Gradual rollout**: Test new cache strategies on staging before production

## Monitoring Recommendations

Track these metrics to optimize your cache settings:
- Cache hit rate (target: >90%)
- Origin request rate (should decrease as cache improves)
- P95/P99 response times
- Stale content serve rate
- Revalidation success rate

Adjust cache times based on these metrics to find optimal balance for your traffic patterns.
