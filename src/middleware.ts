/**
 * Next.js Middleware
 * Handles authentication, authorization, and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Protected route patterns
const PROTECTED_ROUTES = [
  '/admin',
  '/account',
  '/checkout',
  '/orders',
];

// Admin-only route patterns
const ADMIN_ROUTES = [
  '/admin',
  '/api/admin',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get authentication token
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  const isAdminRoute = ADMIN_ROUTES.some(route =>
    pathname.startsWith(route)
  );

  // Redirect to signin if accessing protected route without auth
  if (isProtectedRoute && !token) {
    const signInUrl = new URL('/auth/signin', req.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check admin access
  if (isAdminRoute && token) {
    const role = token.role as string;
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';

    if (!isAdmin) {
      // Redirect non-admin users to home
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Add security headers to response
  const response = NextResponse.next();

  // Prevent caching of sensitive pages
  if (isProtectedRoute || isAdminRoute) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes that should bypass middleware
     */
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\..*|api/auth|api/webhooks).*)',
  ],
};
