import { NextRequest, NextResponse } from 'next/server';

// Specify protected and public routes
const protectedRoutes = [
  '/account',
  '/account/dashboard/create',
  '/admin',
  '/admin/manage',
];
const publicRoutes = ['/auth/login', '/auth/signup', '/'];

const parseCookies = (cookieHeader: string | undefined) => {
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split('; ').forEach((cookie) => {
      const [name, value] = cookie.split('=');
      cookies[name] = decodeURIComponent(value);
    });
  }
  return cookies;
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookies = parseCookies(req.headers.get('cookie') ?? undefined);
  const token = cookies.token || null;
  const roles = cookies.roles ? JSON.parse(cookies.roles) : [];

  console.log('roles', roles);

  // Redirect to /login if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  // Redirect if user lacks required roles
  //   if (isProtectedRoute && token && !roles.includes('Admin')) {
  //     return NextResponse.redirect(new URL('/', req.nextUrl));
  //   }

  // Redirect to /dashboard if the user is authenticated and on a public route
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/account', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
