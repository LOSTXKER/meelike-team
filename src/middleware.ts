/**
 * Next.js Middleware
 *
 * Route-level auth protection.
 * Checks the JWT stored in the Zustand persisted auth cookie/localStorage.
 *
 * In production this would verify a real JWT from a cookie.
 * For the mock system we read from the Zustand state stored via persist middleware.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route groups that require authentication
const PROTECTED_PREFIXES = ["/seller", "/work", "/admin", "/hub"];

// Role → allowed route prefixes
const ROLE_ROUTES: Record<string, string[]> = {
  seller: ["/seller", "/hub"],
  worker: ["/work", "/hub"],
  admin: ["/seller", "/work", "/admin", "/hub"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public routes
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/s/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  // Read auth state from the cookie set by Zustand persist
  // Zustand with localStorage persistence doesn't set cookies,
  // so for SSR middleware we read from a custom cookie.
  // In development, we check for the auth cookie or allow the request
  // and let client-side guards handle it.
  const authCookie = request.cookies.get("meelike-auth-role");
  const role = authCookie?.value;

  if (!role) {
    // No auth cookie -- redirect to login
    // Note: in pure SPA mode the client-side guard handles this.
    // The middleware acts as a secondary check.
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if the role can access this route
  const allowedPrefixes = ROLE_ROUTES[role];
  if (!allowedPrefixes) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const hasAccess = allowedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!hasAccess) {
    // Redirect to their home page
    const homeRoutes: Record<string, string> = {
      seller: "/seller",
      worker: "/work",
      admin: "/admin",
    };
    return NextResponse.redirect(
      new URL(homeRoutes[role] || "/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (Next.js internals)
     * - static files (images, fonts, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
