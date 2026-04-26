import { NextRequest, NextResponse } from "next/server"
import { getConversationState, setConversationState } from "@/lib/conversation-state.server"
import { botDataModule } from "@/modules/bot-data"
import { wa_chat_manager } from "@/modules/bot/whatsapp"

// ── Webhook verification ──────────────────────────────────────────────────────

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ bot: string }> }
) {
    const searchParams = request.nextUrl.searchParams
    const metaVerifyToken = searchParams.get("hub.verify_token")
    const metaChallenge = searchParams.get("hub.challenge")
    const { bot } = await context.params

    if (metaVerifyToken === process.env.WA_VERIFY_TOKEN) {
        console.log("[webhook] Verified for bot:", bot)
        return new Response(metaChallenge || "", { status: 200 })
    }

    console.warn("[webhook] Verification failed for bot:", bot)
    return new Response("Verification token mismatch", { status: 403 })
}

// ── Message handling ──────────────────────────────────────────────────────────

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ bot: string }> }
) {
    const { bot: botId } = await context.params
    const body = await request.json()

    // Meta expects 200 quickly — parse first, process inline
    const message = wa_chat_manager.extractMessage(body)

    if (!message) {
        // Status updates, read receipts, etc.
        return NextResponse.json({ status: "ok" })
    }

    try {
        const [state, botRecord] = await Promise.all([
            getConversationState(botId, message.from),
            botDataModule.getBotData(botId),
        ])

        if (!botRecord) {
            console.warn("[webhook] No bot data found for botId:", botId)
            return NextResponse.json({ status: "ok" })
        }

        const variables = { ...(state?.variables || {}) }

        for (const variable of botRecord.bot_data?.variables) {
            if (!(variable.name in variables)) {
                variables[variable.name] = variable.value
            }
        }

        const newState = await wa_chat_manager.resolveMessage({
            state: {...state, variables},
            flow: botRecord.bot_data,
            incomingMessage: message,
        })

        await setConversationState(botId, message.from, newState)

        console.log("[webhook] bot=%s from=%s node=%s block=%s",
            botId, message.from, newState.currentNodeId, newState.currentBlockId)

    } catch (err) {
        console.error("[webhook] Error processing message:", err)
    }

    return NextResponse.json({ status: "ok" })
}
