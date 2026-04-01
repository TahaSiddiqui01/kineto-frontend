import { getAuthUser, getSessionExpiry } from "@/lib/dal"
import { NextResponse } from "next/server"

/**
 * GET /api/v1/user
 * Returns the authenticated user and session expiry.
 * Used by AuthProvider on the client to bootstrap auth state.
 */
export async function GET() {
    const [user, sessionExpiry] = await Promise.all([getAuthUser(), getSessionExpiry()])

    if (!user) {
        return NextResponse.json({ user: null, sessionExpiresAt: null }, { status: 200 })
    }

    return NextResponse.json({
        user,
        sessionExpiresAt: sessionExpiry?.toISOString() ?? null,
    })
}
