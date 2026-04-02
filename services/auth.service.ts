import { MagicLinkUrlParams } from "@/types/auth"

const BASE = "/api/v1"

async function post<T>(path: string, body: object): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw { status: res.status, message: err?.message ?? res.statusText }
    }
    return res.json()
}

class AuthService {
    async magicLinkLogin(params: MagicLinkUrlParams) {
        return post("/auth", { ...params, intent: "createMagicLink" })
    }

    async googleAuth(): Promise<{ data: { url: string } }> {
        return post("/auth", { intent: "googleAuth" })
    }

    async githubAuth(): Promise<{ data: { url: string } }> {
        return post("/auth", { intent: "githubAuth" })
    }
}

export const authService = new AuthService()
