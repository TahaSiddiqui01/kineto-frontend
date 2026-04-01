"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAuthStore } from "@/store/auth.store"

const WARN_MINUTES = 5

function computeMinutes(expiresAt: Date | null): number | null {
    if (!expiresAt) return null
    return Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60_000))
}

export function useSession() {
    const sessionExpiresAt = useAuthStore((s) => s.sessionExpiresAt)
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    // A tick counter is the only state — incrementing it causes a re-render
    // so useMemo can recompute derived values without setState inside an effect.
    const [tick, setTick] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)

        if (!sessionExpiresAt || !isAuthenticated) return

        intervalRef.current = setInterval(() => setTick((t) => t + 1), 30_000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [sessionExpiresAt, isAuthenticated])

    const minutesUntilExpiry = useMemo(() => {
        // tick is referenced so this recomputes on every interval tick
        void tick
        if (!isAuthenticated) return null
        return computeMinutes(sessionExpiresAt)
    }, [tick, sessionExpiresAt, isAuthenticated])

    const showExpiryWarning = minutesUntilExpiry !== null
        && minutesUntilExpiry <= WARN_MINUTES
        && minutesUntilExpiry > 0

    const expiryLabel = useMemo(() => {
        if (minutesUntilExpiry === null) return null
        if (minutesUntilExpiry === 0) return "Session expired"
        if (minutesUntilExpiry === 1) return "1 minute remaining"
        return `${minutesUntilExpiry} minutes remaining`
    }, [minutesUntilExpiry])

    return { minutesUntilExpiry, showExpiryWarning, expiryLabel }
}
