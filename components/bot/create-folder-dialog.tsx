"use client"

import { useForm } from "react-hook-form"
import { useCreateFolder } from "@/hooks/use-bots"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
}

interface CreateFolderDialogProps {
    workspaceId: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateFolderDialog({ workspaceId, open, onOpenChange }: CreateFolderDialogProps) {
    const { createFolder, isPending } = useCreateFolder(workspaceId)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>()

    const onSubmit = (values: FormValues) => {
        createFolder(
            { name: values.name },
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
                    <DialogTitle>New folder</DialogTitle>
                    <DialogDescription>
                        Organise your bots into folders.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label htmlFor="folder-name" className="text-sm font-medium">
                            Folder name
                        </label>
                        <Input
                            id="folder-name"
                            placeholder="e.g. Customer Support"
                            aria-invalid={!!errors.name}
                            {...register("name", {
                                required: "Folder name is required",
                                maxLength: { value: 80, message: "Name must be under 80 characters" },
                            })}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating…" : "Create folder"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
