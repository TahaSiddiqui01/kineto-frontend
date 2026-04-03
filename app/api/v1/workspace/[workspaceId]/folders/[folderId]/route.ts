import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/dal"
import { botModule } from "@/modules/bot"

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ workspaceId: string; folderId: string }> }
) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { workspaceId, folderId } = await params
    await botModule.deleteFolder(folderId, workspaceId)
    return new NextResponse(null, { status: 204 })
}
