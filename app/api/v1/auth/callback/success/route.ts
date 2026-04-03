import { createServerClient } from "@/lib/supabase-server-client"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const tokenHash = searchParams.get("token_hash")
    const type = searchParams.get("type") as "email" | "recovery" | null

    const supabase = await createServerClient()

    if (code) {
        // OAuth PKCE exchange
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            return NextResponse.redirect(new URL("/login?error=oauth_failed", req.url))
        }
    } else if (tokenHash && type) {
        // Magic link / OTP verification
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        if (error) {
            return NextResponse.redirect(new URL("/login?error=invalid_token", req.url))
        }
    } else {
        return NextResponse.redirect(new URL("/login?error=invalid_token", req.url))
    }

    return NextResponse.redirect(new URL("/workspace", req.url))
}
