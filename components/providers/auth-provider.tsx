"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { userService } from "@/services/user.service"
import { workspaceService } from "@/services/workspace.service"
import { useAuthStore } from "@/store/auth.store"
import { SessionExpiryDialog } from "@/components/auth/session-expiry-dialog"
import { routes } from "@/types/routes/routes.client"

const PUBLIC_PATHS = [routes.auth.login(), "/"]

interface AuthProviderProps {
    children: React.ReactNode
}

/**
 * Bootstraps auth state from the server into the Zustand store on mount.
 * Handles:
 *   - Populating user, session expiry, workspace, and membership in the store
 *   - Redirecting unauthenticated users away from protected routes
 *   - Redirecting authenticated users without a workspace to /onboarding
 */
export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter()
    const pathname = usePathname()
    const { setUser, setSessionExpiresAt, setCurrentWorkspace, setCurrentMembership, setLoading } =
        useAuthStore()

    useEffect(() => {
        let cancelled = false

        async function bootstrap() {
            setLoading(true)

            // 1. Fetch current user + session expiry
            const { user, sessionExpiresAt } = await userService.getMe().catch(() => ({
                user: null,
                sessionExpiresAt: null,
            }))

            if (cancelled) return

            setUser(user)
            setSessionExpiresAt(sessionExpiresAt ? new Date(sessionExpiresAt) : null)

            const isPublic = PUBLIC_PATHS.some(
                (p) => pathname === p || pathname.startsWith(routes.auth.login())
            )

            if (!user) {
                setLoading(false)
                if (!isPublic) router.replace(routes.auth.login())
                return
            }

            // 2. If authenticated on a public route, redirect to dashboard
            if (isPublic && !pathname.startsWith(routes.auth.onboarding())) {
                router.replace(routes.workspace.home())
                setLoading(false)
                return
            }

            // 3. Fetch workspaces to decide onboarding vs dashboard
            const { data: workspaces } = await workspaceService
                .getMyWorkspaces()
                .catch(() => ({ data: [] }))

            if (cancelled) return

            if (workspaces.length === 0 && !pathname.startsWith(routes.auth.onboarding())) {
                // Check for pending invitations first
                const { data: invitations } = await workspaceService
                    .getPendingInvitations()
                    .catch(() => ({ data: [] }))

                if (cancelled) return

                if (invitations.length === 0) {
                    router.replace(routes.auth.onboarding())
                    setLoading(false)
                    return
                }
            }

            if (workspaces.length > 0) {
                const workspace = workspaces[0]
                setCurrentWorkspace(workspace)

                const members = await workspaceService
                    .getMyWorkspaces()
                    .then(() =>
                        fetch(`/api/v1/workspace/${workspace.id}/members`, {
                            credentials: "same-origin",
                        }).then((r) => r.json())
                    )
                    .catch(() => ({ data: [] }))

                if (!cancelled && members.data) {
                    const myMembership = members.data.find(
                        (m: { user_id: string }) => m.user_id === user.id
                    )
                    if (myMembership) setCurrentMembership(myMembership)
                }
            }

            setLoading(false)
        }

        bootstrap()

        return () => {
            cancelled = true
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {children}
            <SessionExpiryDialog />
        </>
    )
}
