import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAuthUser } from "@/lib/dal"
import { botModule } from "@/modules/bot"

const createFolderSchema = z.object({
    name: z.string().min(1).max(80),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ workspaceId: string }> }) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { workspaceId } = await params
    const folders = await botModule.getFoldersByWorkspace(workspaceId)
    return NextResponse.json({ data: folders })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ workspaceId: string }> }) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { workspaceId } = await params
    const body = await req.json()
    const parsed = createFolderSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const folder = await botModule.createFolder(workspaceId, user.id, parsed.data)
    return NextResponse.json({ data: folder }, { status: 201 })
}
