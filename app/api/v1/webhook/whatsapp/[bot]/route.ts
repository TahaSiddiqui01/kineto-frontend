import { NextRequest, NextResponse } from "next/server"
import {
    getConversationState,
    setConversationState,
} from "@/lib/conversation-state"
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

    // Meta always expects 200 quickly — extract message details and process async
    const message = wa_chat_manager.extractMessage(body)

    if (!message) {
        // Status updates, read receipts, etc. — acknowledge and ignore
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

        const flow = botRecord.bot_data
        const nextNodeId = resolveNextNode(state.currentNodeId, flow)

        // Persist updated state
        await setConversationState(botId, message.from, {
            ...state,
            currentNodeId: nextNodeId,
        })

        console.log("[webhook] bot=%s from=%s node=%s text=%s", botId, message.from, nextNodeId, message.text)
    } catch (err) {
        console.error("[webhook] Error processing message:", err)
    }

    return NextResponse.json({ status: "ok" })
}



/** Determine which node to run next based on current conversation position.
 *  Returns the start node when no prior state exists, otherwise stays at current.
 *  Full execution logic (following edges, evaluating conditions) will be added
 *  when the flow engine is implemented. */
function resolveNextNode(
    currentNodeId: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flow: { nodes: any[]; edges: any[] }
): string | null {
    if (currentNodeId) return currentNodeId

    const startNode = flow.nodes.find((n) => n.type === "start")
    return startNode?.id ?? null
}
