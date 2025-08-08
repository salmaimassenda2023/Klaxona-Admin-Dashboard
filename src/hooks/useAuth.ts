// hooks/useAuth.ts
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../supabase/client.js'
import type { User } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    isLoading: boolean
    error: Error | null
}

interface UseAuthOptions {
    redirectTo?: string
    requireAuth?: boolean
    requireAdmin?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
    const {
        redirectTo = '/login',
        requireAuth = true,
        requireAdmin = false
    } = options

    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoading: true,
        error: null
    })

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function checkAuth() {
            try {
                setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

                const { data: authData, error: authError } = await supabase.auth.getUser()


                // If auth is required but no user found
                if (requireAuth && !authData?.user) {
                    router.push(redirectTo)
                    return
                }

                // If admin is required, check user role
                if (requireAdmin && authData?.user) {
                    const userRole = authData.user.user_metadata?.user_type ||
                        authData.user.app_metadata?.role

                    if (userRole !== 'ADMIN') {
                        router.push('/unauthorized')
                        return
                    }
                }

                setAuthState({
                    user: authData?.user || null,
                    isLoading: false,
                    error: null
                })

            } catch (error) {
                console.error('Auth check error:', error)
                const authError = error instanceof Error ? error : new Error('Authentication failed')

                setAuthState({
                    user: null,
                    isLoading: false,
                    error: authError
                })

                if (requireAuth) {
                    router.push(redirectTo)
                }
            }
        }

        checkAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event)

                if (event === 'SIGNED_OUT' || !session) {
                    setAuthState({
                        user: null,
                        isLoading: false,
                        error: null
                    })

                    if (requireAuth) {
                        router.push(redirectTo)
                    }
                } else if (event === 'SIGNED_IN' && session) {
                    setAuthState({
                        user: session.user,
                        isLoading: false,
                        error: null
                    })
                }
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [router, redirectTo, requireAuth, requireAdmin, supabase])

    return authState
}