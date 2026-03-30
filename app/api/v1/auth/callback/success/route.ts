import { authentication } from "@/modules/auth"
import { NextResponse } from "next/server"

const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const SESSION_COOKIE = `a_session_${PROJECT_ID}`

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const secret = searchParams.get("secret")

    if (!userId || !secret) {
        return NextResponse.redirect(new URL("/login?error=invalid_token", req.url))
    }

    const { data, error } = await authentication.createSession(userId, secret)

    if (error || !data) {
        return NextResponse.redirect(new URL("/login?error=session_failed", req.url))
    }

    const response = NextResponse.redirect(new URL("/dashboard", req.url))

    response.cookies.set(SESSION_COOKIE, data.secret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: data.expire
            ? Math.floor((new Date(data.expire).getTime() - Date.now()) / 1000)
            : 60 * 60 * 24 * 30,
    })

    return response
}
