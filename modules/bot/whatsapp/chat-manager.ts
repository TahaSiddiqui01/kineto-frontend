import { IncomingMessage } from "@/types/whatsapp"

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
            }
        } catch {
            return null
        }
    }
}

export const wa_chat_manager = new WaChatManager()