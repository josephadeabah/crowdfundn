import { NextRequest, NextResponse } from 'next/server';

type Roles = 'Admin' | 'Manager' | 'Moderator' | 'User';

interface ParsedCookies {
  token: string | null;
  roles: Roles[];
}

// Define known static routes
const protectedRoutes = ['/account', '/account/dashboard/create'];
const adminRoutes = ['/admin', '/admin/manage'];
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/',
  '/about-us',
  '/how-it-works',
  '/corporate-fundraising',
  '/charity-fundraising',
  '/team-fundraising',
  '/event-fundraising',
  '/mobile-app',
  '/integrations',
  '/success-stories',
  'pricing',
  '/csr',
  '/blog',
  '/press',
  '/partners',
  '/investors',
  '/supported-countries',
  '/careers',
  '/accessibility',
  '/faqs',
  '/help-center',
  '/community-forum',
];

// Define patterns for dynamic routes (to allow them)
const dynamicRoutePatterns = [
  /^\/blog\/[^/]+$/, // Matches /blog/[slug]
  /^\/account\/[^/]+$/, // Matches /account/[id]
  /^\/campaign\/[^/]+$/, // Matches /campaign/[id]
];

const allRoutes = [...protectedRoutes, ...adminRoutes, ...publicRoutes];

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
  const isPublicRoute = publicRoutes.includes(path);

  const cookies = parseCookies(req.headers.get('cookie') ?? undefined);
  const { token, roles } = cookies;

  // Redirect unauthenticated users to login if accessing a protected route
  if ((isProtectedRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  // Redirect authenticated users away from /auth routes (except '/')
  if ((path.startsWith('/auth/login') || path.startsWith('/auth/register')) && token) {
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

  // Allow access if it's a known static route
  if (allRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Allow access if it matches a dynamic route pattern
  if (dynamicRoutePatterns.some((pattern) => pattern.test(path))) {
    return NextResponse.next();
  }

  // Redirect unknown routes to `/not-found`
  return NextResponse.rewrite(new URL('/not-found', req.nextUrl));
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
