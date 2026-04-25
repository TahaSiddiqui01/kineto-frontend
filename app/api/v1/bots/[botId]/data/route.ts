import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/dal"
import { botDataModule } from "@/modules/bot-data"
import type { BotFlowData } from "@/types/bot"

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ botId: string }> }
) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { botId } = await params

    try {
        const record = await botDataModule.getBotData(botId)
        return NextResponse.json({ data: record?.bot_data ?? null })
    } catch (err) {
        console.error("[bot-data] GET error", err)
        return NextResponse.json({ error: "Failed to fetch bot data" }, { status: 500 })
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ botId: string }> }
) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { botId } = await params

    let body: BotFlowData
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    try {
        const record = await botDataModule.saveBotData(botId, body)
        return NextResponse.json({ data: record.bot_data })
    } catch (err) {
        console.error("[bot-data] PUT error", err)
        return NextResponse.json({ error: "Failed to save bot data" }, { status: 500 })
    }
}
