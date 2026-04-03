"use client"

import { useForm, useWatch } from "react-hook-form"
import { useCreateWorkspace } from "@/hooks/use-workspace"
import { WORKSPACE_INDUSTRY_LABELS, type WorkspaceIndustry } from "@/types/workspace"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"

interface FormValues {
    name: string
    industry: string
}

interface CreateWorkspaceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
    const { createWorkspace, isPending } = useCreateWorkspace()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: { errors },
    } = useForm<FormValues>()

    const industry = useWatch({ control, name: "industry" })

    const onSubmit = (values: FormValues) => {
        createWorkspace(
            { name: values.name, industry: values.industry },
            {
                onSuccess: () => {
                    reset()
                    onOpenChange(false)
                },
            }
        )
    }

    const handleOpenChange = (o: boolean) => {
        if (!isPending) {
            reset()
            onOpenChange(o)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create workspace</DialogTitle>
                    <DialogDescription>
                        Set up a new workspace for your team.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label htmlFor="ws-name" className="text-sm font-medium">
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
                        <label htmlFor="ws-industry" className="text-sm font-medium">
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
                        <input
                            type="hidden"
                            {...register("industry", { required: "Please select an industry" })}
                        />
                        {errors.industry && (
                            <p className="text-xs text-destructive">{errors.industry.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating…" : "Create workspace"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
