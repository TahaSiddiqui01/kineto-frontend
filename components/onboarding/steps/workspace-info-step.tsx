"use client"

import { useForm } from "react-hook-form"
import { WORKSPACE_INDUSTRY_LABELS, type WorkspaceIndustry } from "@/types/workspace"

export interface WorkspaceInfoValues {
    name: string
    industry: string
}

interface WorkspaceInfoStepProps {
    defaultValues?: Partial<WorkspaceInfoValues>
    onNext: (values: WorkspaceInfoValues) => void
}

export function WorkspaceInfoStep({ defaultValues, onNext }: WorkspaceInfoStepProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<WorkspaceInfoValues>({
        defaultValues,
    })

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Name your workspace</h2>
                <p className="mt-1 text-sm text-gray-500">
                    This is how your team will identify this workspace.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="ws-name" className="block text-sm font-medium text-gray-700">
                        Workspace name
                    </label>
                    <input
                        id="ws-name"
                        {...register("name", {
                            required: "Workspace name is required",
                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                            maxLength: { value: 80, message: "Name must be under 80 characters" },
                        })}
                        placeholder="Acme Corp"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="ws-industry" className="block text-sm font-medium text-gray-700">
                        Industry
                    </label>
                    <select
                        id="ws-industry"
                        {...register("industry", { required: "Please select an industry" })}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select an industry…</option>
                        {(Object.keys(WORKSPACE_INDUSTRY_LABELS) as WorkspaceIndustry[]).map((key) => (
                            <option key={key} value={key}>
                                {WORKSPACE_INDUSTRY_LABELS[key]}
                            </option>
                        ))}
                    </select>
                    {errors.industry && (
                        <p className="mt-1 text-xs text-red-600">{errors.industry.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                Continue
            </button>
        </form>
    )
}
