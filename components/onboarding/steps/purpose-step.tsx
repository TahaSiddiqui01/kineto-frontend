"use client"

import { useState } from "react"
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
                <h2 className="text-2xl font-bold text-gray-900">What are you building?</h2>
                <p className="mt-1 text-sm text-gray-500">
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
                            "rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors",
                            selected === value
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300",
                        ].join(" ")}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <button
                onClick={() => selected && onNext(selected)}
                disabled={!selected}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
                Continue
            </button>
        </div>
    )
}
