import { getAuthUser } from "@/lib/dal"
import { cookies } from "next/headers"
import { Account, Client } from "node-appwrite"
import { NextRequest, NextResponse } from "next/server"

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const SESSION_COOKIE = `a_session_${PROJECT_ID}`

async function getSessionClient() {
    const cookieStore = await cookies()
    const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value
    if (!sessionSecret) return null
    return new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(PROJECT_ID)
        .setSession(sessionSecret)
}

/**
 * PATCH /api/v1/user/prefs
 * Merges the given fields into the user's AppWrite preferences.
 * Uses the session-authenticated client so the write is scoped to the user.
 */
export async function POST(req: NextRequest) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const client = await getSessionClient()
    if (!client) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()

    const account = new Account(client)

    // Merge with existing prefs so we don't overwrite unrelated fields
    const existing = await account.getPrefs()
    await account.updatePrefs({ ...existing, ...body })

    return NextResponse.json({ success: true })
}
