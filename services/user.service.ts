import type { AuthUser } from "@/types/auth"

const BASE = "/api/v1"

async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, { credentials: "same-origin" })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw { status: res.status, message: err?.error ?? res.statusText }
    }
    return res.json()
}

async function post<T>(path: string, body?: object): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
        credentials: "same-origin",
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw { status: res.status, message: err?.error ?? res.statusText }
    }
    return res.json()
}

class UserService {
    async getMe(): Promise<{ user: AuthUser | null; sessionExpiresAt: string | null }> {
        return get("/user")
    }

    async updatePrefs(prefs: Record<string, unknown>): Promise<void> {
        await post("/user/prefs", prefs)
    }

    async logout(): Promise<void> {
        await post("/auth/logout")
    }
}

export const userService = new UserService()
