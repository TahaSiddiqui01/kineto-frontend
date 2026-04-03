export interface SessionState {
    isAuthenticated: boolean
    isLoading: boolean
    sessionExpiresAt: Date | null
    /** Minutes remaining before session expires. null when not authenticated. */
    minutesUntilExpiry: number | null
}
