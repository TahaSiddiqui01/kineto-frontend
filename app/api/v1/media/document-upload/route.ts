import { getAuthUser } from "@/lib/dal"
import { mediaModule } from "@/modules/media"
import { NextRequest, NextResponse } from "next/server"

const MAX_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

const ALLOWED_TYPES: Record<string, true> = {
    "application/pdf": true,
    "application/msword": true,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
    "application/vnd.ms-excel": true,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": true,
    "application/vnd.ms-powerpoint": true,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": true,
    "text/csv": true,
    "text/plain": true,
}

export async function POST(req: NextRequest) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

    if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "File exceeds 50 MB limit" }, { status: 400 })
    }

    if (!ALLOWED_TYPES[file.type]) {
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const { fileId, url } = await mediaModule.uploadDocument(buffer, file.name, file.type)

    return NextResponse.json({ data: { fileId, url, fileName: file.name } }, { status: 201 })
}
