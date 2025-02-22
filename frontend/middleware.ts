import { NextRequest, NextResponse } from 'next/server';

type Roles = 'Admin' | 'Manager' | 'Moderator' | 'User';

interface ParsedCookies {
  token: string | null;
  roles: Roles[];
}

// Specify protected, admin, and public routes
const protectedRoutes = ['/account', '/account/dashboard/create'];
const adminRoutes = ['/admin', '/admin/manage'];
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/',
  '/blog', // Add /blog as a public route
  '/blog/:slug', // Add /blog/:slug as a public route
  '/blog/:id', // Add /blog/:id as a public route
];

// Helper function to parse cookies from the request header
const parseCookies = (cookieHeader: string | undefined): ParsedCookies => {
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split('; ').forEach((cookie) => {
      const [name, value] = cookie.split('=');
      cookies[name] = decodeURIComponent(value);
    });
  }
  return {
    token: cookies['token'] || null,
    roles: cookies['roles'] ? (JSON.parse(cookies['roles']) as Roles[]) : [],
  };
};

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);
  const isPublicRoute = publicRoutes.some((route) => {
    // Handle dynamic routes like /blog/:slug or /blog/:id
    if (route.includes(':slug') || route.includes(':id')) {
      return path.startsWith('/blog/');
    }
    return route === path;
  });

  const cookies = parseCookies(req.headers.get('cookie') ?? undefined);
  const { token, roles } = cookies;

  // Redirect unauthenticated users to login if accessing a protected route
  if ((isProtectedRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  // Redirect authenticated users to /account if trying to access /auth routes (except '/')
  if (isPublicRoute && token && path !== '/') {
    return NextResponse.redirect(new URL('/account', req.nextUrl));
  }

  // Restrict /admin routes to specific roles (Admin, Manager, Moderator)
  if (isAdminRoute) {
    const hasAccessRole = roles.some((role) =>
      ['Admin', 'Manager', 'Moderator'].includes(role),
    );
    if (!hasAccessRole) {
      return NextResponse.redirect(new URL('/', req.nextUrl));
    }
  }

  // Allow access to other routes if authenticated or if they are public
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
