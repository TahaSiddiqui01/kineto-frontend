"use client"

import { useSession } from "@/hooks/use-session"
import { userService } from "@/services/user.service"
import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SessionExpiryDialog() {
    const { showExpiryWarning, expiryLabel } = useSession()
    const reset = useAuthStore((s) => s.reset)
    const router = useRouter()
    const [loggingOut, setLoggingOut] = useState(false)

    if (!showExpiryWarning) return null

    const handleLogout = async () => {
        setLoggingOut(true)
        await userService.logout().catch(() => null)
        reset()
        router.replace("/login")
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="expiry-dialog-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
                <h2 id="expiry-dialog-title" className="text-lg font-semibold text-gray-900">
                    Your session is about to expire
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    {expiryLabel}. Please save your work and sign in again to continue.
                </p>
                <div className="mt-6 flex gap-3 justify-end">
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loggingOut ? "Signing out…" : "Sign out now"}
                    </button>
                    <button
                        onClick={() => router.push("/login")}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Go to login
                    </button>
                </div>
            </div>
        </div>
    )
}
