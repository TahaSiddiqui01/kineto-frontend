import { getAuthUser } from "@/lib/dal"
import { workspaceModule } from "@/modules/workspace"
import { NextRequest, NextResponse } from "next/server"

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * POST /api/v1/workspace/logo
 * Uploads a workspace logo to AppWrite Storage (server-side).
 * Accepts multipart/form-data with a "file" field.
 */
export async function POST(req: NextRequest) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "File exceeds 5 MB limit" }, { status: 400 })
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"]
    if (!allowed.includes(file.type)) {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { fileId, url } = await workspaceModule.uploadWorkspaceLogo(buffer, file.name)

    return NextResponse.json({ data: { fileId, url } }, { status: 201 })
}
