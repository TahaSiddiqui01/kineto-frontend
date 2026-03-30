import { authentication } from "@/modules/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()
    const intent = body.intent

    switch (intent) {
        case "createMagicLink": {
            const response = await authentication.createMagicUrlToken(body)
            return NextResponse.json(response)
        }

        case "googleAuth": {
            const url = await authentication.googleAuth()
            return NextResponse.json({ data: { url }, error: null })
        }

        case "githubAuth": {
            const url = await authentication.githubAuth()
            return NextResponse.json({ data: { url }, error: null })
        }

        default:
            return NextResponse.json({ error: "Invalid intent" }, { status: 400 })
    }
}
