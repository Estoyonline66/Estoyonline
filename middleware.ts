import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/") {
    const locale = request.cookies.get("language")?.value === "tr" ? "tr" : "en";
    const destination = request.nextUrl.clone();
    destination.pathname = `/${locale}`;
    const response = NextResponse.redirect(destination);
    response.headers.set("Vary", "Cookie");
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
