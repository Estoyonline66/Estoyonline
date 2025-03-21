import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const savedLanguage = request.cookies.get('language') as { name: string, value: string };
    // If token is not present, redirect to login page
    if (path === "/") {
        return NextResponse.redirect(new URL(`/${savedLanguage?.value||"en"}`, request.url));
    }
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/'],
}