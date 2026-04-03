"use client"

import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useCreateBot } from "@/hooks/use-bots"
import type { Folder } from "@/types/bot"
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
    description: string
    folder_id: string
}

interface CreateBotDialogProps {
    workspaceId: string
    folders: Folder[]
    defaultFolderId?: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateBotDialog({
    workspaceId,
    folders,
    defaultFolderId,
    open,
    onOpenChange,
}: CreateBotDialogProps) {
    const { createBot, isPending } = useCreateBot(workspaceId)

    const { register, handleSubmit, setValue, reset, control, formState: { errors } } =
        useForm<FormValues>({
            defaultValues: { folder_id: defaultFolderId ?? "none" },
        })

    const folderId = useWatch({ control, name: "folder_id" })

    useEffect(() => {
        if (open) {
            reset({ folder_id: defaultFolderId ?? "none" })
        }
    }, [open, defaultFolderId])

    const onSubmit = (values: FormValues) => {
        createBot(
            {
                name: values.name,
                description: values.description || undefined,
                folder_id: values.folder_id === "none" ? null : values.folder_id,
            },
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
                    <DialogTitle>New bot</DialogTitle>
                    <DialogDescription>
                        Create a bot and optionally place it in a folder.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label htmlFor="bot-name" className="text-sm font-medium">
                            Bot name
                        </label>
                        <Input
                            id="bot-name"
                            placeholder="e.g. Lead Qualifier"
                            aria-invalid={!!errors.name}
                            {...register("name", {
                                required: "Bot name is required",
                                maxLength: { value: 80, message: "Name must be under 80 characters" },
                            })}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="bot-desc" className="text-sm font-medium">
                            Description <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <Input
                            id="bot-desc"
                            placeholder="What does this bot do?"
                            {...register("description", {
                                maxLength: { value: 300, message: "Max 300 characters" },
                            })}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    {folders.length > 0 && (
                        <div className="space-y-1.5">
                            <label htmlFor="bot-folder" className="text-sm font-medium">
                                Folder <span className="text-muted-foreground font-normal">(optional)</span>
                            </label>
                            <Select
                                value={folderId ?? "none"}
                                onValueChange={(val) => setValue("folder_id", val, { shouldValidate: true })}
                            >
                                <SelectTrigger id="bot-folder" className="w-full">
                                    <SelectValue placeholder="No folder" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No folder</SelectItem>
                                    {folders.map((f) => (
                                        <SelectItem key={f.id} value={f.id}>
                                            {f.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <input type="hidden" {...register("folder_id")} />
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating…" : "Create bot"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
