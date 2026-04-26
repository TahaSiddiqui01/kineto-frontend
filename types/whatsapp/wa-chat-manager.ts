import type { BotFlowData } from "@/types/bot"
import type { IncomingMessage } from "./whatsapp"
import type { ConversationState } from "@/lib/conversation-state.server"

export interface WaChatResolveParams {
    state: ConversationState
    flow: BotFlowData
    incomingMessage: IncomingMessage
}
