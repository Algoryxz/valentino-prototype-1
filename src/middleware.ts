import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Generate cryptographically random 128-bit nonce for this request
  const nonce = btoa(crypto.randomUUID()).replace(/[^a-zA-Z0-9]/g, "").slice(0, 24);

  const isDev = process.env.NODE_ENV !== "production";
  const scriptDirectives = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? ["'unsafe-eval'"] : []),
  ].join(" ");

  const cspHeader = [
    "default-src 'self'",
    `script-src ${scriptDirectives}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://res.cloudinary.com",
    "media-src 'self' blob: data: https://res.cloudinary.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://res.cloudinary.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  // Forward nonce and CSP in request headers so downstream route handlers and layouts can read them
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Security Headers
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  if (pathname.startsWith("/v/") || pathname.startsWith("/edit/") || pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store");
  }

  if (pathname.startsWith("/v/") || pathname.startsWith("/edit/")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  if (pathname.startsWith("/edit/")) {
    response.headers.set("Referrer-Policy", "no-referrer");
  } else {
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  }

  return response;
}

export const config = {
  matcher: [
    "/v/:path*",
    "/edit/:path*",
    "/api/:path*",
    "/templates/:path*",
    "/create/:path*",
  ],
};
