export interface AppWriteSession {
    $id: string
    $createdAt: string
    userId: string
    expire: string
    provider: string
    providerUid: string
    providerAccessToken: string
    clientCode: string
    clientName: string
    clientType: string
    clientVersion: string
    deviceName: string
    deviceBrand: string
    deviceModel: string
    countryCode: string
    countryName: string
    current: boolean
    factors: string[]
    secret: string
    mfaUpdatedAt: string
}

export interface SessionState {
    isAuthenticated: boolean
    isLoading: boolean
    sessionExpiresAt: Date | null
    /** Minutes remaining before session expires. null when not authenticated. */
    minutesUntilExpiry: number | null
}
