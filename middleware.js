import { NextResponse } from "next/server";
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Define your supported locales
const locales = ['en-US', 'fr-FR']; // Add your supported locales
const defaultLocale = 'en-US';

// Function to get the preferred locale from request headers
function getLocale(request) {
    // Get the accept-language header
    const acceptLanguage = request.headers.get('accept-language') ?? undefined;
    const headers = { 'accept-language': acceptLanguage };

    // Use Negotiator to get preferred languages
    const languages = new Negotiator({ headers }).languages();

    // Match against supported locales
    return match(languages, locales, defaultLocale);
}

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If pathname already has a locale, continue
    if (pathnameHasLocale) return;

    // Redirect if there is no locale
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        // Skip all internal paths (_next), api routes, and static files
        '/((?!_next|api|favicon.ico).*)',
    ],
};