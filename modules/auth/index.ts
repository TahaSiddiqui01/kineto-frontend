import { createServerClient } from "@/lib/app-write-server-client"
import { MagicLinkUrlParams } from "@/types/auth"
import { Client, ID, Account, OAuthProvider } from "node-appwrite"
import { Account as ServerAccount } from "node-appwrite"

class Authentication {

    private appWriteClient: Client | null = null

    constructor() {
        this.appWriteClient = createServerClient()
    }

    async createMagicUrlToken(params: MagicLinkUrlParams) {
        const account = new Account(this.appWriteClient!)
        try {
            const response = await account.createMagicURLToken({
                userId: ID.unique(),
                email: params.email,
                url: params.url,
                phrase: params.phrase || false,
            })
            return {
                data: response,
                error: null
            }
        } catch (error) {
            console.error("Error creating magic URL token:", error)
            return {
                error,
                data: null
            }
        }
    }

    async createSession(userId: string, secret: string) {
        const account = new ServerAccount(this.appWriteClient!)
        try {
            const response = await account.createSession({ userId, secret })
            return {
                data: response,
                error: null
            }
        } catch (error) {
            console.error("Error creating session:", error)
            return {
                error,
                data: null
            }
        }
    }


    async getSession() {
        const account = new ServerAccount(this.appWriteClient!)
        try {
            const response = await account.getSession({ sessionId: "current" });
            return { data: response, error: null }
        } catch (error) {
            console.error("Error getting session:", error)
            return {
                error,
                data: null
            }
        }
    }

    async googleAuth() {
        const account = new ServerAccount(this.appWriteClient!)
        return await account.createOAuth2Token({
            provider: OAuthProvider.Google,
            success: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback/success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`,
            scopes: ['openid', 'profile', 'email'],
        })
    }

    async githubAuth() {
        const account = new ServerAccount(this.appWriteClient!)
        return await account.createOAuth2Token({
            provider: OAuthProvider.Github,
            success: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback/success`,
            failure: `${process.env.NEXT_PUBLIC_APP_URL}/login?error=oauth_failed`,
            scopes: ['read:user', 'user:email'],
        })
    }

}

export const authentication = new Authentication()
