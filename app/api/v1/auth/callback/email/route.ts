import { authentication } from "@/modules/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')

    console.log("Received userId:", userId)
    console.log("Received secret:", secret)

    const { data, error } = await authentication.createSession(userId!, secret!)

    return NextResponse.json({
        data,
        error
    });

}