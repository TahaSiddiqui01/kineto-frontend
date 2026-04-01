"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { REFERRAL_SOURCE_LABELS, type ReferralSource } from "@/types/auth"

interface ReferralStepProps {
    onNext: (source: ReferralSource) => void
}

export function ReferralStep({ onNext }: ReferralStepProps) {
    const [selected, setSelected] = useState<ReferralSource | null>(null)

    const options = Object.entries(REFERRAL_SOURCE_LABELS) as [ReferralSource, string][]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">How did you hear about us?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    This helps us understand where to invest.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {options.map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setSelected(value)}
                        className={[
                            "rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            selected === value
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/40",
                        ].join(" ")}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <Button onClick={() => selected && onNext(selected)} disabled={!selected} className="w-full">
                Continue
            </Button>
        </div>
    )
}
