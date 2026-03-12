import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/seller", "/work", "/admin", "/hub"];

const ROLE_ROUTES: Record<string, string[]> = {
  seller: ["/seller", "/hub"],
  worker: ["/work", "/hub"],
  admin: ["/seller", "/work", "/admin", "/hub"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/s/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    // Still refresh Supabase session cookies on public routes
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (!isProtected) {
    const { supabaseResponse } = await updateSession(request);
    return supabaseResponse;
  }

  // Refresh Supabase session and check auth
  const { supabaseResponse, user } = await updateSession(request);

  if (!user) {
    // No Supabase session — also check legacy cookie as fallback
    const authCookie = request.cookies.get("meelike-auth-role");
    if (!authCookie?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Role-based access check from the cookie
  const authCookie = request.cookies.get("meelike-auth-role");
  const role = authCookie?.value;

  if (role) {
    const allowedPrefixes = ROLE_ROUTES[role];
    if (allowedPrefixes) {
      const hasAccess = allowedPrefixes.some((prefix) =>
        pathname.startsWith(prefix)
      );
      if (!hasAccess) {
        const homeRoutes: Record<string, string> = {
          seller: "/seller",
          worker: "/work",
          admin: "/admin",
        };
        return NextResponse.redirect(
          new URL(homeRoutes[role] || "/login", request.url)
        );
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
