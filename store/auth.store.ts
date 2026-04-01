import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { AuthUser } from "@/types/auth"
import type { Workspace, WorkspaceMember } from "@/types/workspace"

interface AuthState {
    // Auth
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
    sessionExpiresAt: Date | null

    // Workspace
    currentWorkspace: Workspace | null
    currentMembership: WorkspaceMember | null

    // Actions
    setUser: (user: AuthUser | null) => void
    setSessionExpiresAt: (date: Date | null) => void
    setCurrentWorkspace: (workspace: Workspace | null) => void
    setCurrentMembership: (membership: WorkspaceMember | null) => void
    setLoading: (loading: boolean) => void
    reset: () => void
}

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    sessionExpiresAt: null,
    currentWorkspace: null,
    currentMembership: null,
}

export const useAuthStore = create<AuthState>()(
    devtools(
        (set) => ({
            ...initialState,

            setUser: (user) =>
                set({ user, isAuthenticated: !!user }, false, "setUser"),

            setSessionExpiresAt: (sessionExpiresAt) =>
                set({ sessionExpiresAt }, false, "setSessionExpiresAt"),

            setCurrentWorkspace: (currentWorkspace) =>
                set({ currentWorkspace }, false, "setCurrentWorkspace"),

            setCurrentMembership: (currentMembership) =>
                set({ currentMembership }, false, "setCurrentMembership"),

            setLoading: (isLoading) =>
                set({ isLoading }, false, "setLoading"),

            reset: () =>
                set(initialState, false, "reset"),
        }),
        { name: "AuthStore" }
    )
)
