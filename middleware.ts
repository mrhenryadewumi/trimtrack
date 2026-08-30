import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  // SAMEORIGIN (not DENY): a top-level PWA/TWA still works. CSP
  // frame-ancestors is the real clickjacking control and lets the Grok
  // preview host the live site without a blank blocked page.
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=()"
  );
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.anthropic.com https://api.openai.com https://api.nal.usda.gov https://*.supabase.co https://world.openfoodfacts.org https://*.openfoodfacts.org https://api.stripe.com https://api.resend.com https://*.vercel.app https://www.trimtrack.fit",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      "frame-ancestors 'self' https://grok.com https://*.grok.com https://x.com https://*.x.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|icon-192.png|icon-512.png|icon-maskable-192.png|icon-maskable-512.png).*)",
  ],
};
