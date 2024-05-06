import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en-US", "zh-TW"];
const defaultLocale = "en-US";

/**
 * Get the locale from the request headers
 * If no locale is found, return the default locale
 * @param {NextRequest} request
 * @returns {string} The locale
 *
 */
function getLocale(request: NextRequest): string {
  let headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };
  let languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}

/**
 * Middleware to redirect to the correct locale
 * @param {NextRequest} request
 */
export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  console.log("pathname", pathname);
  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

/**
 * Configuration for the middleware
 * @type {import("next/types").NextConfig}
 */
export const config: import("next/types").NextConfig = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
