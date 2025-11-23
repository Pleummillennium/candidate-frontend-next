import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/candidates'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Public routes that should redirect to /candidates if already authenticated
  const authRoutes = ['/auth/login', '/auth/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Check if user has auth token (stored in localStorage, but we can't access it in middleware)
  // Instead, we'll handle this check in the client components
  // This middleware is mainly for demonstration purposes

  // For Next.js middleware, we can't access localStorage
  // So we'll rely on client-side checks in useAuth hook

  return NextResponse.next();
}

export const config = {
  matcher: ['/candidates/:path*', '/auth/:path*'],
};
