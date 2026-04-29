import "server-only"
import { redis } from "./redis"

const CONVERSATION_TTL = 60 * 60 * 24 // 24 hours

export interface ConversationState {
    currentNodeId: string | null
    currentBlockId: string | null
    variables: Record<string, string | boolean | number>
    ended?: boolean
}

function key(botId: string, phoneNumber: string): string {
    return `conv:${botId}:${phoneNumber}`
}

export async function getConversationState(
    botId: string,
    phoneNumber: string
): Promise<ConversationState> {
    const raw = await redis.get(key(botId, phoneNumber))
    if (!raw) return { currentNodeId: null, currentBlockId: null, variables: {} }
    return JSON.parse(raw) as ConversationState
}

export async function setConversationState(
    botId: string,
    phoneNumber: string,
    state: ConversationState
): Promise<void> {
    await redis.set(key(botId, phoneNumber), JSON.stringify(state), { EX: CONVERSATION_TTL })
}

export async function clearConversationState(
    botId: string,
    phoneNumber: string
): Promise<void> {
    await redis.del(key(botId, phoneNumber))
}
