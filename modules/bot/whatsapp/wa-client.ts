import type { Block } from "@/types/flow"
import type { WaSendButtonsParams, WaSendImageParams, WaSendTextParams } from "@/types/whatsapp/wa-client"

type ButtonItem = { id: string; text: string }

function interpolate(text: string, variables: Record<string, string>): string {
    return text.replace(/\{\{([^}]+)\}\}/g, (_, name) => variables[name.trim()] ?? `{{${name}}}`)
}

class WaClient {
    private readonly baseUrl = "https://graph.facebook.com/v25.0"
    private readonly phoneNumberId = process.env.WA_PHONE_NUMBER_ID!

    private get headers() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.WA_API_ACCESS_TOKEN}`,
        }
    }

    private async post(body: unknown): Promise<boolean> {
        try {
            const res = await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(body),
            })
            if (!res.ok) {
                const text = await res.text()
                console.error("[WaClient] API error:", res.status, text)
                return false
            }
            return true
        } catch (err) {
            console.error("[WaClient] Request failed:", err)
            return false
        }
    }

    async sendText({ to, text }: WaSendTextParams): Promise<boolean> {
        return this.post({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "text",
            text: { body: text },
        })
    }

    async sendButtons({ to, body, buttons }: WaSendButtonsParams): Promise<boolean> {
        // WA supports max 3 interactive buttons; each title max 20 chars
        const waButtons = buttons.slice(0, 3).map((btn) => ({
            type: "reply",
            reply: { id: btn.id, title: btn.title.slice(0, 20) },
        }))

        return this.post({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "interactive",
            interactive: {
                type: "button",
                body: { text: body || "Choose an option:" },
                action: { buttons: waButtons },
            },
        })
    }

    async sendImage({ to, url, caption }: WaSendImageParams): Promise<boolean> {
        return this.post({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "image",
            image: { link: url, ...(caption ? { caption } : {}) },
        })
    }

    private async sendVideo(to: string, url: string): Promise<boolean> {
        return this.post({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "video",
            video: { link: url },
        })
    }

    private async sendAudio(to: string, url: string): Promise<boolean> {
        return this.post({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "audio",
            audio: { link: url },
        })
    }

    /** Send the right WA message for a block. Variables are interpolated in all text fields. */
    async sendBlock(to: string, block: Block, variables: Record<string, string> = {}): Promise<boolean> {
        switch (block.type) {

            // ── Bubbles ───────────────────────────────────────────────────────
            case "text-bubble": {
                const raw = block.content.text as string | undefined
                if (!raw) return true
                return this.sendText({ to, text: interpolate(raw, variables) })
            }

            case "image-bubble": {
                const url = block.content.imageUrl as string | undefined
                if (!url) return true
                const alt = block.content.alt as string | undefined
                return this.sendImage({ to, url: interpolate(url, variables), caption: alt })
            }

            case "video-bubble": {
                const url = block.content.videoUrl as string | undefined
                if (!url) return true
                return this.sendVideo(to, interpolate(url, variables))
            }

            case "audio-bubble": {
                const url = block.content.audioUrl as string | undefined
                if (!url) return true
                return this.sendAudio(to, interpolate(url, variables))
            }

            case "embed-bubble": {
                // WhatsApp has no embed type — send the URL as a text link
                const url = block.content.url as string | undefined
                if (!url) return true
                return this.sendText({ to, text: interpolate(url, variables) })
            }

            // ── Input prompts (send the question, then wait for reply) ────────
            case "text-input":
            case "number-input":
            case "email-input":
            case "phone-input":
            case "website-input":
            case "date-input":
            case "time-input": {
                const placeholder = block.content.placeholder as string | undefined
                if (placeholder) {
                    await this.sendText({ to, text: interpolate(placeholder, variables) })
                }
                return true
            }

            case "buttons-input": {
                const buttons = (block.content.buttons as ButtonItem[] | undefined) ?? []
                const body = block.content.text as string | undefined
                return this.sendButtons({
                    to,
                    body: body ? interpolate(body, variables) : "Choose an option:",
                    buttons: buttons.map((b) => ({ id: b.id, title: interpolate(b.text, variables) })),
                })
            }

            default:
                console.warn("[WaClient] No WA handler for block type:", block.type)
                return true
        }
    }
}

export const wa_client = new WaClient()
