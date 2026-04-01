"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WORKSPACE_PURPOSE_LABELS, type WorkspacePurpose } from "@/types/auth"

interface PurposeStepProps {
    onNext: (purpose: WorkspacePurpose) => void
}

export function PurposeStep({ onNext }: PurposeStepProps) {
    const [selected, setSelected] = useState<WorkspacePurpose | null>(null)

    const options = Object.entries(WORKSPACE_PURPOSE_LABELS) as [WorkspacePurpose, string][]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">What are you building?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Help us tailor your experience.
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
