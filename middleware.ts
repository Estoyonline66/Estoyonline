import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/") {
    // Preserve the former Cloudflare Worker's landing-page behavior.
    // After removing the proxy, Vercel supplies the visitor's country.
    const acceptsTurkish = (request.headers.get("accept-language") || "").toLowerCase().includes("tr");
    const country = request.headers.get("x-vercel-ip-country") || "";
    const locale = acceptsTurkish || country === "TR" ? "tr" : "en";
    const destination = request.nextUrl.clone();
    destination.pathname = `/${locale}`;
    destination.search = "";
    const response = NextResponse.redirect(destination, 302);
    response.headers.set("Vary", "Accept-Language, X-Vercel-IP-Country");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  // Override caller-supplied headers so HTML language always follows the URL.
  const locale = path.split("/")[1] === "tr" ? "tr" : "en";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-site-locale", locale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Language", locale);
  return response;
}
export const config = { matcher: ["/", "/en/:path*", "/tr/:path*"] };
