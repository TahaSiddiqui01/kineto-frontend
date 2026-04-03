import { createServerClient as createSupabaseSSRClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

/**
 * Creates a Supabase client scoped to the current user's session via cookies.
 * Use this for auth operations and any user-scoped requests.
 */
export async function createServerClient() {
    const cookieStore = await cookies()
    return createSupabaseSSRClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // setAll called from a Server Component — cookie mutations are
                        // handled by the Route Handler / Server Action instead.
                    }
                },
            },
        }
    )
}

/**
 * Creates a Supabase admin client using the service role key.
 * Bypasses Row Level Security. Use only in trusted server-side code.
 */
export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}
