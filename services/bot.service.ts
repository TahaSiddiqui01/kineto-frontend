import type { Bot, Folder, CreateBotPayload, CreateFolderPayload } from "@/types/bot"

const BASE = "/api/v1"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        credentials: "same-origin",
        ...init,
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw { status: res.status, message: err?.error ?? res.statusText }
    }
    if (res.status === 204) return undefined as T
    return res.json()
}

class BotService {
    // ── Folders ────────────────────────────────────────────────────────────

    async getFolders(workspaceId: string): Promise<{ data: Folder[] }> {
        return request(`/workspace/${workspaceId}/folders`)
    }

    async createFolder(workspaceId: string, payload: CreateFolderPayload): Promise<{ data: Folder }> {
        return request(`/workspace/${workspaceId}/folders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
    }

    async deleteFolder(workspaceId: string, folderId: string): Promise<void> {
        return request(`/workspace/${workspaceId}/folders/${folderId}`, { method: "DELETE" })
    }

    // ── Bots ───────────────────────────────────────────────────────────────

    async getBots(workspaceId: string): Promise<{ data: Bot[] }> {
        return request(`/workspace/${workspaceId}/bots`)
    }

    async createBot(workspaceId: string, payload: CreateBotPayload): Promise<{ data: Bot }> {
        return request(`/workspace/${workspaceId}/bots`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
    }

    async deleteBot(workspaceId: string, botId: string): Promise<void> {
        return request(`/workspace/${workspaceId}/bots/${botId}`, { method: "DELETE" })
    }
}

export const botService = new BotService()
