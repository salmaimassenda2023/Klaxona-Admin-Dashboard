// utils/supabase/middleware.js (or wherever your file is)
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
    console.log('🔍 Middleware - Processing path:', request.nextUrl.pathname)
    console.log('🔍 Middleware - Full URL:', request.nextUrl.href)

    let supabaseResponse = NextResponse.next({
        request,
    })

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('❌ Missing Supabase environment variables')
        return supabaseResponse
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    try {
        const {
            data: { user },
            error
        } = await supabase.auth.getUser()

        console.log('👤 User check result:', {
            hasUser: !!user,
            userId: user?.id,
            error: error?.message
        })

        const pathname = request.nextUrl.pathname

        // Check if it's a static file or API route
        const isStaticFile = pathname.startsWith('/_next') ||
            pathname.startsWith('/api') ||
            pathname.includes('.') ||
            pathname.startsWith('/favicon')

        if (isStaticFile) {
            console.log('⏭️ Skipping auth for static file:', pathname)
            return supabaseResponse
        }

        // Define protected vs public routes
        const publicRoutes = ['/login', '/auth', '/signup', '/error']
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

        console.log('🛣️ Route analysis:', {
            pathname,
            isPublicRoute,
            hasUser: !!user
        })

        // Redirect logic
        if (!user && !isPublicRoute) {
            console.log('🚫 REDIRECTING: User not authenticated, redirecting to login')
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // If user is authenticated and trying to access auth pages
        if (user && isPublicRoute) {
            console.log('✅ REDIRECTING: Authenticated user accessing auth page, redirecting to dashboard')
            const url = request.nextUrl.clone()
            url.pathname = '/'
            return NextResponse.redirect(url)
        }

        console.log('✨ ALLOWING: Request proceeding normally')
        return supabaseResponse

    } catch (error) {
        console.error('❌ Middleware error:', error)
        return supabaseResponse
    }
}