import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

/** Routes that do NOT require authentication. */
const PUBLIC_ROUTES = ["/login"]

/** Routes accessible only when NOT authenticated. */
const AUTH_ONLY_ROUTES = ["/login"]

/**
 * Proxy runs before every request (optimistic check).
 * Uses Supabase SSR to validate the session cookie.
 * Real session verification also happens inside route handlers via dal.ts.
 */
export async function proxy(req: NextRequest) {
    let supabaseResponse = NextResponse.next({ request: req })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request: req })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const isAuthenticated = !!user
    const { pathname } = req.nextUrl

    const isPublic = PUBLIC_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r + "/")
    )
    const isAuthOnly = AUTH_ONLY_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(r + "/")
    )

    if (isAuthenticated && isAuthOnly) {
        const redirectRes = NextResponse.redirect(new URL("/workspace", req.nextUrl))
        supabaseResponse.cookies.getAll().forEach((c) => redirectRes.cookies.set(c))
        return redirectRes
    }

    if (!isAuthenticated && !isPublic) {
        const loginUrl = new URL("/login", req.nextUrl)
        loginUrl.searchParams.set("redirect", pathname)
        const redirectRes = NextResponse.redirect(loginUrl)
        supabaseResponse.cookies.getAll().forEach((c) => redirectRes.cookies.set(c))
        return redirectRes
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.svg$).*)",
    ],
}
