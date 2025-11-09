/**
 * Products API Routes
 * GET /api/products - List products with filtering
 * POST /api/products - Create new product (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prismaDB';
import {
  productFilterSchema,
  createProductSchema,
  safeValidateData,
  formatZodError,
} from '@/lib/validations';
import { rateLimit, getIdentifier, getRateLimitHeaders, getRateLimitErrorResponse } from '@/lib/rate-limiter';

/**
 * GET /api/products
 * List products with filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getIdentifier(request);
    try {
      const rateLimitRes = await rateLimit(identifier, 'api');
      const headers = getRateLimitHeaders(rateLimitRes, 'api');

      const { searchParams } = new URL(request.url);

      // Parse and validate query parameters
      const filterData = {
        categoryId: searchParams.get('categoryId') || undefined,
        status: searchParams.get('status') || undefined,
        featured: searchParams.get('featured') === 'true' ? true : undefined,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        search: searchParams.get('search') || undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
        limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
        sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
        sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      };

      const validation = safeValidateData(productFilterSchema, filterData);

      if (!validation.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: formatZodError(validation.error),
          },
          { status: 400, headers }
        );
      }

      const { categoryId, status, featured, minPrice, maxPrice, search, page, limit, sortBy, sortOrder } =
        validation.data;

      // Build where clause
      const where: any = {};

      if (categoryId) where.categoryId = categoryId;
      if (status) where.status = status;
      if (featured !== undefined) where.featured = featured;

      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { tags: { has: search } },
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Fetch products
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            productVariants: {
              select: {
                id: true,
                color: true,
                size: true,
                image: true,
                isDefault: true,
                price: true,
                quantity: true,
              },
            },
            _count: {
              select: {
                reviews: {
                  where: { isApproved: true },
                },
              },
            },
          },
        }),
        prisma.product.count({ where }),
      ]);

      // Transform response
      const transformedProducts = products.map(({ _count, ...product }) => ({
        ...product,
        reviewCount: _count.reviews,
      }));

      return NextResponse.json(
        {
          products: transformedProducts,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
          },
        },
        { status: 200, headers }
      );
    } catch (rateLimiterRes: any) {
      return NextResponse.json(
        getRateLimitErrorResponse(rateLimiterRes.msBeforeNext),
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimiterRes.msBeforeNext / 1000).toString(),
          },
        }
      );
    }
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create new product (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !isAdmin(session.user?.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Rate limiting (stricter for write operations)
    const identifier = getIdentifier(request, session.user?.id);
    try {
      const rateLimitRes = await rateLimit(identifier, 'write');
      const headers = getRateLimitHeaders(rateLimitRes, 'write');

      // Parse request body
      const body = await request.json();

      // Validate input
      const validation = safeValidateData(createProductSchema, body);

      if (!validation.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: formatZodError(validation.error),
          },
          { status: 400, headers }
        );
      }

      const { productVariants, ...productData } = validation.data;

      // Create product with variants
      const product = await prisma.product.create({
        data: {
          ...productData,
          productVariants: {
            create: productVariants,
          },
        },
        include: {
          category: true,
          productVariants: true,
        },
      });

      return NextResponse.json(
        {
          message: 'Product created successfully',
          product,
        },
        { status: 201, headers }
      );
    } catch (rateLimiterRes: any) {
      return NextResponse.json(
        getRateLimitErrorResponse(rateLimiterRes.msBeforeNext),
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateLimiterRes.msBeforeNext / 1000).toString(),
          },
        }
      );
    }
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
