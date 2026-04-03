import { getAuthUser } from "@/lib/dal"
import { createServerClient } from "@/lib/supabase-server-client"
import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/v1/user/prefs
 * Merges the given fields into the user's metadata.
 * Uses the session-authenticated client so the write is scoped to the user.
 */
export async function POST(req: NextRequest) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const supabase = await createServerClient()

    const existing = user.user_metadata ?? {}
    const { error } = await supabase.auth.updateUser({ data: { ...existing, ...body } })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}
