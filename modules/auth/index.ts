import { createServerClient } from "@/lib/supabase-server-client"

class Authentication {
    async createMagicUrlToken(params: { email: string; url: string }) {
        try {
            const supabase = await createServerClient()
            const { data, error } = await supabase.auth.signInWithOtp({
                email: params.email,
                options: {
                    emailRedirectTo: params.url,
                },
            })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error("Error creating magic link:", error)
            return { error, data: null }
        }
    }

    async googleAuth() {
        const supabase = await createServerClient()
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback/success`,
                scopes: "openid profile email",
                queryParams: { access_type: "offline", prompt: "consent" },
            },
        })
        if (error) throw error
        return data.url
    }

    async githubAuth() {
        const supabase = await createServerClient()
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback/success`,
                scopes: "read:user user:email",
            },
        })
        if (error) throw error
        return data.url
    }
}

export const authentication = new Authentication()
