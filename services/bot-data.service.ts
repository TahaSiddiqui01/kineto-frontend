import type { BotFlowData } from "@/types/bot"

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
    return res.json()
}

class BotDataService {
    async getBotData(botId: string): Promise<{ data: BotFlowData | null }> {
        return request(`/bots/${botId}/data`)
    }

    async saveBotData(botId: string, flowData: BotFlowData): Promise<{ data: BotFlowData }> {
        return request(`/bots/${botId}/data`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(flowData),
        })
    }
}

export const botDataService = new BotDataService()
