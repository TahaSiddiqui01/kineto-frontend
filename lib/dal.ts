/**
 * Data Access Layer (server-only).
 * Centralises session verification and user fetching.
 * Never import this in Client Components.
 */
import "server-only"

import { cache } from "react"
import { createServerClient } from "@/lib/supabase-server-client"
import type { AuthUser } from "@/types/auth"

/**
 * Verifies the current session from the cookie and returns the authenticated user.
 * Returns null when no valid session exists.
 * Memoized per request via React cache().
 */
export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
    try {
        const supabase = await createServerClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) return null
        return user as unknown as AuthUser
    } catch {
        return null
    }
})

/**
 * Returns the session expiry date from the current session.
 * Used to pass expiry info to the client for UI warnings.
 */
export const getSessionExpiry = cache(async (): Promise<Date | null> => {
    try {
        const supabase = await createServerClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) return null
        return new Date(session.expires_at! * 1000)
    } catch {
        return null
    }
})
