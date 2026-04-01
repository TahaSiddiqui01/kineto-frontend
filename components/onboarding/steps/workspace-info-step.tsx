"use client"

import { useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    const { register, handleSubmit, setValue, control, formState: { errors } } =
        useForm<WorkspaceInfoValues>({ defaultValues })

    const industry = useWatch({ control, name: "industry" })

    return (
        <form onSubmit={handleSubmit(onNext)} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Name your workspace</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    This is how your team will identify this workspace.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label htmlFor="ws-name" className="text-sm font-medium text-foreground">
                        Workspace name
                    </label>
                    <Input
                        id="ws-name"
                        placeholder="Acme Corp"
                        aria-invalid={!!errors.name}
                        {...register("name", {
                            required: "Workspace name is required",
                            minLength: { value: 2, message: "Name must be at least 2 characters" },
                            maxLength: { value: 80, message: "Name must be under 80 characters" },
                        })}
                    />
                    {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="ws-industry" className="text-sm font-medium text-foreground">
                        Industry
                    </label>
                    <Select
                        value={industry ?? ""}
                        onValueChange={(val) => setValue("industry", val, { shouldValidate: true })}
                    >
                        <SelectTrigger id="ws-industry" aria-invalid={!!errors.industry} className="w-full">
                            <SelectValue placeholder="Select an industry…" />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(WORKSPACE_INDUSTRY_LABELS) as WorkspaceIndustry[]).map((key) => (
                                <SelectItem key={key} value={key}>
                                    {WORKSPACE_INDUSTRY_LABELS[key]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* hidden input so react-hook-form tracks the value */}
                    <input
                        type="hidden"
                        {...register("industry", { required: "Please select an industry" })}
                    />
                    {errors.industry && (
                        <p className="text-xs text-destructive">{errors.industry.message}</p>
                    )}
                </div>
            </div>

            <Button type="submit" className="w-full">
                Continue
            </Button>
        </form>
    )
}
