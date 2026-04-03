import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAuthUser } from "@/lib/dal"
import { botModule } from "@/modules/bot"

const createBotSchema = z.object({
    name: z.string().min(1).max(80),
    description: z.string().max(300).optional(),
    folder_id: z.string().uuid().nullable().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ workspaceId: string }> }) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { workspaceId } = await params
    const bots = await botModule.getBotsByWorkspace(workspaceId)
    return NextResponse.json({ data: bots })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ workspaceId: string }> }) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { workspaceId } = await params
    const body = await req.json()
    const parsed = createBotSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const bot = await botModule.createBot(workspaceId, user.id, parsed.data)
    return NextResponse.json({ data: bot }, { status: 201 })
}
