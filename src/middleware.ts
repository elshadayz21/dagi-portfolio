import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle direct favicon and touch icon requests by redirecting to the dynamic favicon route
  if (pathname === "/favicon.ico" || pathname === "/apple-touch-icon.png" || pathname === "/apple-touch-icon-precomposed.png") {
    return NextResponse.redirect(new URL("/api/favicon", request.url), 307);
  }

  // 1. Skip next internal files, api endpoints, and static public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Check if pathname is missing a locale prefix
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. Redirect if missing locale
  if (pathnameIsMissingLocale) {
    // If root path "/" -> redirect to "/en"
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
