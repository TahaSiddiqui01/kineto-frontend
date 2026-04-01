import { NextRequest, NextResponse } from "next/server"

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const SESSION_COOKIE = `a_session_${PROJECT_ID}`

/** Routes that do NOT require authentication. */
const PUBLIC_ROUTES = ["/login", "/"]

/** Routes accessible only when NOT authenticated. */
const AUTH_ONLY_ROUTES = ["/login"]

/**
 * Proxy runs before every request (optimistic check).
 * It only reads the session cookie — no DB calls — to keep it fast.
 * Real session verification happens inside route handlers via dal.ts.
 */
export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const sessionSecret = req.cookies.get(SESSION_COOKIE)?.value
    const isAuthenticated = !!sessionSecret

    const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))
    const isAuthOnly = AUTH_ONLY_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))

    // Authenticated user trying to access auth-only pages → send to dashboard
    if (isAuthenticated && isAuthOnly) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }

    // Unauthenticated user trying to access a protected route → send to login
    if (!isAuthenticated && !isPublic) {
        const loginUrl = new URL("/login", req.nextUrl)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Run on all routes except Next.js internals and static assets
        "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.svg$).*)",
    ],
}
