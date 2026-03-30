import { createServerClient } from "@/lib/app-write-server-client"
import { MagicLinkUrlParams } from "@/models/auth"
import { Client, ID, Account } from "node-appwrite"
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

}

export const authentication = new Authentication()
