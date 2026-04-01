"use client"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { XIcon } from "lucide-react"

interface InviteStepProps {
    onNext: (emails: string[]) => void
    onSkip: () => void
    isSubmitting?: boolean
}

const emailSchema = z.string().email()

export function InviteStep({ onNext, onSkip, isSubmitting }: InviteStepProps) {
    const [input, setInput] = useState("")
    const [emails, setEmails] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    const addEmail = () => {
        const val = input.trim()
        if (!val) return
        if (!emailSchema.safeParse(val).success) {
            setError("Please enter a valid email address.")
            return
        }
        if (emails.includes(val)) {
            setError("This email has already been added.")
            return
        }
        setEmails((prev) => [...prev, val])
        setInput("")
        setError(null)
    }

    const removeEmail = (email: string) => {
        setEmails((prev) => prev.filter((e) => e !== email))
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Invite your team</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    You can always invite people later from workspace settings.
                </p>
            </div>

            <div className="space-y-1.5">
                <div className="flex gap-2">
                    <Input
                        type="email"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(null) }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
                        placeholder="colleague@company.com"
                        aria-invalid={!!error}
                        className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={addEmail}>
                        Add
                    </Button>
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            {emails.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {emails.map((email) => (
                        <Badge key={email} variant="secondary" className="gap-1.5 pr-1.5">
                            {email}
                            <button
                                type="button"
                                onClick={() => removeEmail(email)}
                                aria-label={`Remove ${email}`}
                                className="rounded-sm opacity-60 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <XIcon className="size-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            <div className="flex gap-3">
                <Button onClick={() => onNext(emails)} disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Setting up…" : emails.length > 0 ? "Send invites & finish" : "Finish"}
                </Button>
                <Button variant="outline" onClick={onSkip} disabled={isSubmitting}>
                    Skip
                </Button>
            </div>
        </div>
    )
}
