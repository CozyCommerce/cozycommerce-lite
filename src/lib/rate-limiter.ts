/**
 * Rate Limiting Utility
 * Protects API routes from abuse and DDoS attacks
 */

import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

// Rate limiter configurations
const rateLimiters = {
  // Strict limits for authentication endpoints
  auth: new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 60, // per 60 seconds (1 minute)
    blockDuration: 60 * 15, // Block for 15 minutes
  }),

  // API endpoints
  api: new RateLimiterMemory({
    points: 100, // 100 requests
    duration: 60, // per 60 seconds
    blockDuration: 60, // Block for 1 minute
  }),

  // Public endpoints (more lenient)
  public: new RateLimiterMemory({
    points: 60, // 60 requests
    duration: 60, // per 60 seconds
  }),

  // Write operations (stricter)
  write: new RateLimiterMemory({
    points: 20, // 20 requests
    duration: 60, // per 60 seconds
    blockDuration: 60 * 5, // Block for 5 minutes
  }),
};

export type RateLimiterType = keyof typeof rateLimiters;

/**
 * Rate limit a request
 * @param identifier Unique identifier (IP, user ID, etc.)
 * @param type Type of rate limiter to use
 * @returns Promise that resolves if allowed, rejects if rate limited
 */
export async function rateLimit(
  identifier: string,
  type: RateLimiterType = 'api'
): Promise<RateLimiterRes> {
  const limiter = rateLimiters[type];

  try {
    return await limiter.consume(identifier, 1);
  } catch (rateLimiterRes) {
    throw rateLimiterRes;
  }
}

/**
 * Get rate limit info for response headers
 */
export function getRateLimitHeaders(
  rateLimiterRes: RateLimiterRes,
  type: RateLimiterType = 'api'
): Record<string, string> {
  const limiter = rateLimiters[type];

  return {
    'X-RateLimit-Limit': limiter.points.toString(),
    'X-RateLimit-Remaining': rateLimiterRes.remainingPoints.toString(),
    'X-RateLimit-Reset': new Date(
      Date.now() + rateLimiterRes.msBeforeNext
    ).toISOString(),
  };
}

/**
 * Get error response for rate limit exceeded
 */
export function getRateLimitErrorResponse(retryAfter: number) {
  return {
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
    retryAfter: Math.ceil(retryAfter / 1000), // Convert to seconds
  };
}

/**
 * Extract identifier from request (IP address or user ID)
 */
export function getIdentifier(request: Request, userId?: string): string {
  if (userId) return `user:${userId}`;

  // Try to get real IP from headers (for proxied requests)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to a generic identifier
  return 'anonymous';
}
