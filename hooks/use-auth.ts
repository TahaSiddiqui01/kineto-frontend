import { authService } from "@/services/auth.service"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const authKeys = {
    all: ["auth"] as const,
    magicLink: () => [...authKeys.all, "magic-link"] as const,
    googleAuth: () => [...authKeys.all, "google-auth"] as const,
    githubAuth: () => [...authKeys.all, "github-auth"] as const,
    session: () => [...authKeys.all, "session"] as const,
}

export function useAuth() {
    const createMagicLink = useMutation({
        mutationFn: authService.magicLinkLogin,
        mutationKey: authKeys.magicLink(),
        onSuccess: () => {
            toast.success("Magic link sent!", {
                description: "Check your inbox and click the link to sign in.",
            })
        },
        onError: () => {
            toast.error("Failed to send magic link", {
                description: "Please check your email address and try again.",
            })
        },
    })

    const googleAuth = useMutation({
        mutationFn: authService.googleAuth,
        mutationKey: authKeys.googleAuth(),
        onSuccess: ({ data }) => {
            window.location.href = data.url
        },
        onError: () => {
            toast.error("Google sign-in failed", {
                description: "Something went wrong. Please try again.",
            })
        },
    })

    const githubAuth = useMutation({
        mutationFn: authService.githubAuth,
        mutationKey: authKeys.githubAuth(),
        onSuccess: ({ data }) => {
            window.location.href = data.url
        },
        onError: () => {
            toast.error("GitHub sign-in failed", {
                description: "Something went wrong. Please try again.",
            })
        },
    })

    return { createMagicLink, githubAuth, googleAuth }
}
