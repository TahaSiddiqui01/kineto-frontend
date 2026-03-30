import { MagicLinkUrlParams } from "@/models/auth";

class AuthService {

    async magicLinkLogin(params: MagicLinkUrlParams) {
        return fetch('/api/v1/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        }).then(res => res.json())
    }

}


export const authService = new AuthService();