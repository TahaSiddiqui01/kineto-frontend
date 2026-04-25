import "server-only"
import { redis } from "./redis"

/** How long (seconds) a conversation session lives without activity */
const CONVERSATION_TTL = 60 * 60 * 24 // 24 hours

export interface ConversationState {
    /** The node currently waiting for user input, or null at the start */
    currentNodeId: string | null
    /** Variables collected from the user during this conversation */
    variables: Record<string, string>
}

function key(botId: string, phoneNumber: string): string {
    return `conv:${botId}:${phoneNumber}`
}

export async function getConversationState(
    botId: string,
    phoneNumber: string
): Promise<ConversationState> {
    const raw = await redis.get(key(botId, phoneNumber))
    if (!raw) return { currentNodeId: null, variables: {} }
    return JSON.parse(raw) as ConversationState
}

export async function setConversationState(
    botId: string,
    phoneNumber: string,
    state: ConversationState
): Promise<void> {
    const keyStr = key(botId, phoneNumber)
    const value = JSON.stringify(state)
    await redis.set(keyStr, value, "EX", CONVERSATION_TTL)
}

export async function clearConversationState(
    botId: string,
    phoneNumber: string
): Promise<void> {
    await redis.del(key(botId, phoneNumber))
}
