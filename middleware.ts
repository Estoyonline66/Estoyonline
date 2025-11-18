import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    
    if (path === "/") {
        try {
            const savedLanguage = request.cookies.get('language');
            const lang = savedLanguage?.value || "en";
            // Validate language is supported
            const supportedLanguages = ["en", "tr"];
            const validLang = supportedLanguages.includes(lang) ? lang : "en";
            
            return NextResponse.redirect(new URL(`/${validLang}`, request.url));
        } catch (error) {
            // Fallback to default language if redirect fails
            console.error("Middleware redirect error:", error);
            return NextResponse.redirect(new URL('/en', request.url));
        }
    }
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/'],
}