import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Camera is the product. Blocking it here made the meal scanner a no-op on
  // installed PWAs and the Play Store wrapper.
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
      "connect-src 'self' https://api.anthropic.com https://api.openai.com https://*.supabase.co https://world.openfoodfacts.org https://*.openfoodfacts.org https://api.stripe.com https://api.resend.com https://*.vercel.app https://www.trimtrack.fit",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
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
