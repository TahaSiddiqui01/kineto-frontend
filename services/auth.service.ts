import { MagicLinkUrlParams } from "@/models/auth";
import { apiClient } from "@/lib/api-client";

class AuthService {

    async magicLinkLogin(params: MagicLinkUrlParams) {
        return await apiClient('/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })
    }

}


export const authService = new AuthService();