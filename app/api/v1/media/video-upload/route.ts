import { getAuthUser } from "@/lib/dal"
import { mediaModule } from "@/modules/media"
import { NextRequest, NextResponse } from "next/server"

const MAX_SIZE_BYTES = 16 * 1024 * 1024 // 16 MB (WhatsApp video limit)

export async function POST(req: NextRequest) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "File exceeds 16 MB limit" }, { status: 400 })
    }

    // WhatsApp supports MP4 and 3GPP video formats only
    const allowed = ["video/mp4", "video/3gpp"]
    if (!allowed.includes(file.type)) {
        return NextResponse.json({ error: "Only MP4 and 3GPP are supported for WhatsApp" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { fileId, url } = await mediaModule.uploadVideo(buffer, file.name, file.type)

    return NextResponse.json({ data: { fileId, url } }, { status: 201 })
}
