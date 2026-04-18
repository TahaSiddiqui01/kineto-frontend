"use client"

import { useState } from "react"
import { Folder, Trash2 } from "lucide-react"
import { useDeleteFolder } from "@/hooks/use-bots"
import type { Folder as FolderType } from "@/types/bot"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"

interface FolderCardProps {
    folder: FolderType
    workspaceId: string
    botCount: number
    isSelected: boolean
    onClick: () => void
}

export function FolderCard({ folder, workspaceId, botCount, isSelected, onClick }: FolderCardProps) {
    const { deleteFolder, isPending } = useDeleteFolder(workspaceId)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setConfirmOpen(true)
    }

    const handleConfirm = () => {
        deleteFolder(folder.id, { onSuccess: () => setConfirmOpen(false) })
    }

    return (
        <>
            <div
                onClick={onClick}
                className={cn(
                    "group relative flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-150",
                    "hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 min-w-62.5",
                    isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card"
                )}
            >
                <div className="flex items-start justify-between">
                    <div
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg",
                            isSelected ? "bg-primary/15" : "bg-muted"
                        )}
                    >
                        <Folder
                            className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground")}
                        />
                    </div>

                    <button
                        onClick={handleDeleteClick}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-destructive group-hover:opacity-100"
                        title="Delete folder"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div>
                    <p className="text-sm font-medium leading-tight">{folder.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        {botCount} {botCount === 1 ? "bot" : "bots"}
                    </p>
                </div>
            </div>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete folder</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-medium text-foreground">{folder.name}</span>?
                            Bots inside will not be deleted — they will become unorganised.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
                            {isPending ? "Deleting…" : "Delete folder"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
