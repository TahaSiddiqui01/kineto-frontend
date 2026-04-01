"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"
import { userService } from "@/services/user.service"
import { useAuthStore } from "@/store/auth.store"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function SessionExpiryDialog() {
    const { showExpiryWarning, expiryLabel } = useSession()
    const reset = useAuthStore((s) => s.reset)
    const router = useRouter()
    const [loggingOut, setLoggingOut] = useState(false)

    const handleLogout = async () => {
        setLoggingOut(true)
        await userService.logout().catch(() => null)
        reset()
        router.replace("/login")
    }

    return (
        <Dialog open={showExpiryWarning}>
            <DialogContent
                // Prevent closing by clicking outside — user must act
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Your session is about to expire</DialogTitle>
                    <DialogDescription>
                        {expiryLabel}. Please save your work and sign in again to continue.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => router.push("/login")}>
                        Go to login
                    </Button>
                    <Button variant="destructive" onClick={handleLogout} disabled={loggingOut}>
                        {loggingOut ? "Signing out…" : "Sign out now"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
