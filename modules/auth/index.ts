import { appWriteClient } from "@/lib/app-write-client.server"
import { MagicLinkUrlParams } from "@/models/auth";
import { Client, ID, Account } from "appwrite"

class Authentication {

    private appWriteClient: Client | null = null;

    constructor() {
        this.appWriteClient = appWriteClient
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
                error
            }
        }
    }


    async createSession(userId: string, secret: string) {
        const account = await new Account(this.appWriteClient!)

        try {
            const account = new Account(this.appWriteClient!)
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