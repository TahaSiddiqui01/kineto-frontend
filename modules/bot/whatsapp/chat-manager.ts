import { BotFlowData } from "@/types/bot"
import { WaChatResolveParams } from "@/types/whatsapp/wa-chat-manager"
import { IncomingMessage } from "@/types/whatsapp/whatsapp"
import { wa_client } from "./wa-client"

class WaChatManager {
    public extractMessage(body: unknown): IncomingMessage | null {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const entry = (body as any)?.entry?.[0]
            const change = entry?.changes?.[0]?.value
            const msg = change?.messages?.[0]
            if (!msg) return null

            return {
                from: msg.from,
                id: msg.id,
                type: msg.type,
                text: msg.text?.body ?? msg.interactive?.button_reply?.title ?? "",
                messages: change.messages
            }
        } catch {
            return null
        }
    }

    async resolveMessage({ currentNodeId, flow, incomingMessage }: WaChatResolveParams): Promise<string | null> {

        wa_client.sendMessage({ incomingMessage, currentNodeId, data: flow })
        
        if (currentNodeId) return currentNodeId

        const startNode = flow.nodes.find((n) => n.type === "start")
        return startNode?.id ?? null
    }
}

export const wa_chat_manager = new WaChatManager()