import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes: Record<string, string[]> = {
  '/account': ['B2C', 'B2B', 'GOVT', 'VENDOR', 'ADMIN', 'SALES'],
  '/account/b2b': ['B2B'],
  '/account/tenders': ['GOVT'],
  '/b2b': ['B2B', 'GOVT'],
  '/vendor': ['VENDOR'],
  '/admin': ['ADMIN', 'SALES'],
};

function getProtectedRoute(pathname: string): string[] | null {
  const sortedRoutes = Object.keys(protectedRoutes).sort(
    (a, b) => b.length - a.length
  );

  for (const route of sortedRoutes) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return protectedRoutes[route];
    }
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const allowedRoles = getProtectedRoute(pathname);

  if (!allowedRoles) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    const role = payload.role as string;

    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/account/:path*', '/vendor/:path*', '/admin/:path*', '/b2b/:path*'],
};
