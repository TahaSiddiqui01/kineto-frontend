/**
 * Data Access Layer (server-only).
 * Centralises session verification and user fetching.
 * Never import this in Client Components.
 */
import "server-only"

import { cookies } from "next/headers"
import { cache } from "react"
import { Account, Client } from "node-appwrite"
import type { AuthUser } from "@/types/auth"

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const SESSION_COOKIE = `a_session_${PROJECT_ID}`

function createSessionClient(sessionSecret: string) {
    return new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(PROJECT_ID)
        .setSession(sessionSecret)
}

/**
 * Verifies the current session from the cookie and returns the authenticated user.
 * Returns null when no valid session exists.
 * Memoized per request via React cache().
 */
export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
    const cookieStore = await cookies()
    const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value

    if (!sessionSecret) return null

    try {
        const client = createSessionClient(sessionSecret)
        const account = new Account(client)
        const user = await account.get()
        return user as unknown as AuthUser
    } catch {
        return null
    }
})

/**
 * Returns the session expiry date from the current session cookie.
 * Used to pass expiry info to the client for UI warnings.
 */
export const getSessionExpiry = cache(async (): Promise<Date | null> => {
    const cookieStore = await cookies()
    const sessionSecret = cookieStore.get(SESSION_COOKIE)?.value

    if (!sessionSecret) return null

    try {
        const sessionClient = createSessionClient(sessionSecret)
        const sessionAccount = new Account(sessionClient)
        const session = await sessionAccount.getSession("current")
        return new Date(session.expire)
    } catch {
        return null
    }
})
