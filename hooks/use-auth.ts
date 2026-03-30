import { MagicLinkUrlParams } from "@/models/auth"
import { authentication } from "@/modules/auth"
import { authService } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"

export const authKeys = {
    all: ["auth"] as const,
    magicLink: () => [...authKeys.all, "magic-link"] as const,
    session: () => [...authKeys.all, "session"] as const,
}

export function useAuth() {
    const createMagicLink = useMutation({
        mutationFn: authService.magicLinkLogin,
        mutationKey: authKeys.magicLink(),
    })

    return {
        createMagicLink
    }
}