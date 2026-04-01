"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAuthStore } from "@/store/auth.store"

const WARN_MINUTES = 5   // Show dialog when ≤ 5 minutes remain

export function useSession() {
    const sessionExpiresAt = useAuthStore((s) => s.sessionExpiresAt)
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const [minutesUntilExpiry, setMinutesUntilExpiry] = useState<number | null>(null)
    const [showExpiryWarning, setShowExpiryWarning] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (!sessionExpiresAt || !isAuthenticated) {
            setMinutesUntilExpiry(null)
            setShowExpiryWarning(false)
            if (intervalRef.current) clearInterval(intervalRef.current)
            return
        }

        const update = () => {
            const diffMs = sessionExpiresAt.getTime() - Date.now()
            const mins = Math.max(0, Math.floor(diffMs / 60_000))
            setMinutesUntilExpiry(mins)
            setShowExpiryWarning(mins <= WARN_MINUTES && mins > 0)
        }

        update()
        intervalRef.current = setInterval(update, 30_000) // re-check every 30 s

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [sessionExpiresAt, isAuthenticated])

    const expiryLabel = useMemo(() => {
        if (minutesUntilExpiry === null) return null
        if (minutesUntilExpiry === 0) return "Session expired"
        if (minutesUntilExpiry === 1) return "1 minute remaining"
        return `${minutesUntilExpiry} minutes remaining`
    }, [minutesUntilExpiry])

    return { minutesUntilExpiry, showExpiryWarning, expiryLabel }
}
