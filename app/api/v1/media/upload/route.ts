import { getAuthUser } from "@/lib/dal"
import { mediaModule } from "@/modules/media"
import { NextRequest, NextResponse } from "next/server"

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB (WhatsApp image limit)

export async function POST(req: NextRequest) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "File exceeds 5 MB limit" }, { status: 400 })
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
        return NextResponse.json({ error: "Only JPEG, PNG, and WebP are supported" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { fileId, url } = await mediaModule.uploadImage(buffer, file.name, file.type)

    return NextResponse.json({ data: { fileId, url } }, { status: 201 })
}
