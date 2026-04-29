import { interpolate } from "@/components/flow/preview/registry/utils";
import { extractFileNameFromUrl } from "@/helpers";
import type { Block } from "@/types/flow"
import type { WaSendButtonsParams, WaSendImageParams, WaSendTextParams } from "@/types/whatsapp/wa-client"

type ButtonItem = { id: string; text: string }


class WaClient {
    private readonly baseUrl = "https://graph.facebook.com/v25.0"
    private readonly phoneNumberId = process.env.WA_PHONE_NUMBER_ID!

    private get headers() {
        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.WA_API_ACCESS_TOKEN}`,
        }
    }

    async showTyping(messageId: string): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    status: "read",
                    message_id: messageId,
                    typing_indicator: { type: "text" },
                }),
            })
        } catch {
            // non-critical — don't fail the flow
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

    private async sendDocument(to: string, url: string, fileName?: string, caption?: string): Promise<boolean> {
        return this.post({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "document",
            document: {
                link: url,
                ...(fileName ? { filename: fileName } : {}),
                ...(caption ? { caption } : {}),
            },
        })
    }

    /** Send the right WA message for a block. Variables are interpolated in all text fields. */
    async sendBlock(to: string, block: Block, variables: Record<string, string | boolean | number> = {}): Promise<boolean> {
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
                const resolved = interpolate(url, variables)
                // mp4 URLs (e.g. from Giphy) must be sent as video — WA rejects GIFs as image type
                if (resolved.toLowerCase().includes('.mp4')) {
                    return this.sendVideo(to, resolved)
                }
                const alt = block.content.alt as string | undefined
                return this.sendImage({ to, url: resolved, caption: alt })
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

            case "document-bubble": {
                const url = block.content.documentUrl as string | undefined
                if (!url) return true
                const resolvedUrl = interpolate(url, variables)
                const storedName = block.content.documentFileName as string | undefined
                const fileName = storedName || extractFileNameFromUrl(resolvedUrl) || undefined
                const caption = block.content.caption as string | undefined
                return this.sendDocument(
                    to,
                    resolvedUrl,
                    fileName,
                    caption ? interpolate(caption, variables) : undefined,
                )
            }

            // ── Input blocks — placeholder is website-only; just wait for the reply ─
            case "text-input":
            case "number-input":
            case "email-input":
            case "phone-input":
            case "website-input":
            case "date-input":
            case "time-input":
            case "audio-input":
                return true

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
