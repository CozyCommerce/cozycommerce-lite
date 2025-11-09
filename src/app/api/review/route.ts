/**
 * Reviews API Route
 * GET /api/review - Get product reviews (preferred)
 * POST /api/review - Get product reviews (legacy, backward compatible)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaDB';
import {
  getReviewsSchema,
  safeValidateData,
  formatZodError,
} from '@/lib/validations';
import {
  rateLimit,
  getIdentifier,
  getRateLimitHeaders,
  getRateLimitErrorResponse,
} from '@/lib/rate-limiter';

/**
 * GET /api/review - Get reviews for a product
 */
export async function GET(request: NextRequest) {
  try {
    const identifier = getIdentifier(request);
    try {
      const rateLimitRes = await rateLimit(identifier, 'api');
      const headers = getRateLimitHeaders(rateLimitRes, 'api');

      const { searchParams } = new URL(request.url);

      const queryData = {
        productSlug: searchParams.get('productSlug') || '',
        status: searchParams.get('status') as any,
        isApproved: searchParams.get('isApproved') === 'true' ? true : undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
        limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
      };

      const validation = safeValidateData(getReviewsSchema, queryData);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: formatZodError(validation.error) },
          { status: 400, headers }
        );
      }

      const { productSlug, status, isApproved, page, limit } = validation.data;

      const where: any = { productSlug };
      if (status) where.status = status;
      else if (isApproved !== undefined) where.isApproved = isApproved;
      else where.isApproved = true;

      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where,
          skip,
          take: limit,
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.review.count({ where }),
      ]);

      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.ratings, 0) / reviews.length
          : 0;

      return NextResponse.json(
        {
          reviews,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
          stats: { avgRating: Number(avgRating.toFixed(1)), totalReviews: total },
        },
        { status: 200, headers }
      );
    } catch (rateLimiterRes: any) {
      return NextResponse.json(getRateLimitErrorResponse(rateLimiterRes.msBeforeNext), {
        status: 429,
        headers: { 'Retry-After': Math.ceil(rateLimiterRes.msBeforeNext / 1000).toString() },
      });
    }
  } catch (error) {
    console.error('GET /api/review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/review - Legacy endpoint for backward compatibility
 */
export async function POST(request: NextRequest) {
  try {
    const identifier = getIdentifier(request);
    try {
      const rateLimitRes = await rateLimit(identifier, 'api');
      const headers = getRateLimitHeaders(rateLimitRes, 'api');

      const body = await request.json();
      const { productSlug } = body;

      if (!productSlug) {
        return NextResponse.json({ error: 'productSlug is required' }, { status: 400, headers });
      }

      const reviews = await prisma.review.findMany({
        where: { productSlug, isApproved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      });

      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.ratings, 0) / reviews.length
          : 0;

      return NextResponse.json(
        {
          review: reviews,
          reviews,
          avgRating: Number(avgRating.toFixed(1)),
          totalReviews: reviews.length,
        },
        { status: 200, headers }
      );
    } catch (rateLimiterRes: any) {
      return NextResponse.json(getRateLimitErrorResponse(rateLimiterRes.msBeforeNext), {
        status: 429,
        headers: { 'Retry-After': Math.ceil(rateLimiterRes.msBeforeNext / 1000).toString() },
      });
    }
  } catch (error) {
    console.error('POST /api/review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
