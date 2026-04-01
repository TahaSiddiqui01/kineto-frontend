"use client"

import { useState } from "react"
import { z } from "zod"

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
                <h2 className="text-2xl font-bold text-gray-900">Invite your team</h2>
                <p className="mt-1 text-sm text-gray-500">
                    You can always invite people later from the workspace settings.
                </p>
            </div>

            <div>
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(null) }}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
                        placeholder="colleague@company.com"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="button"
                        onClick={addEmail}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        Add
                    </button>
                </div>
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            </div>

            {emails.length > 0 && (
                <ul className="space-y-2">
                    {emails.map((email) => (
                        <li
                            key={email}
                            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm"
                        >
                            <span className="text-gray-700">{email}</span>
                            <button
                                type="button"
                                onClick={() => removeEmail(email)}
                                aria-label={`Remove ${email}`}
                                className="text-gray-400 hover:text-red-500"
                            >
                                ✕
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <div className="flex gap-3">
                <button
                    onClick={() => onNext(emails)}
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isSubmitting ? "Setting up…" : emails.length > 0 ? "Send invites & finish" : "Finish"}
                </button>
                <button
                    onClick={onSkip}
                    disabled={isSubmitting}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                    Skip
                </button>
            </div>
        </div>
    )
}
