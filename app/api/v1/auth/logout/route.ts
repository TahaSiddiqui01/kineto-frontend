import { getAuthUser } from "@/lib/dal"
import { createServerClient } from "@/lib/app-write-server-client"
import { Account, Client } from "node-appwrite"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const SESSION_COOKIE = `a_session_${PROJECT_ID}`

export async function POST() {
    const cookieStore = await cookies()
    const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value

    if (sessionSecret) {
        try {
            const client = new Client()
                .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
                .setProject(PROJECT_ID)
                .setSession(sessionSecret)

            const account = new Account(client)
            await account.deleteSession("current")
        } catch {
            // Session may already be invalid; continue to clear cookie
        }
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete(SESSION_COOKIE)
    return response
}
