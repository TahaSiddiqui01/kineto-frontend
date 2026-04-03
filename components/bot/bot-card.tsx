"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot, Trash2, Circle, UserRound } from "lucide-react"
import { routes } from "@/types/routes/routes.client"
import { useDeleteBot } from "@/hooks/use-bots"
import type { Bot as BotType } from "@/types/bot"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface BotCardProps {
    bot: BotType
    workspaceId: string
    folderName?: string
}

export function BotCard({ bot, workspaceId, folderName }: BotCardProps) {
    const { deleteBot, isPending } = useDeleteBot(workspaceId)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setConfirmOpen(true)
    }

    const handleConfirm = () => {
        deleteBot(bot.id, { onSuccess: () => setConfirmOpen(false) })
    }

    const isActive = bot.status === "active"

    return (
        <>
            <Link
                href={routes.bots.detail({ params: { id: bot.id } })}
                className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 min-w-62.5"
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <button
                        onClick={handleDeleteClick}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-destructive group-hover:opacity-100"
                        title="Delete bot"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-1 min-w-0">
                    <p className="truncate text-sm font-medium leading-tight">{bot.name}</p>
                    {bot.description && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">{bot.description}</p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
                            isActive
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-muted text-muted-foreground"
                        )}
                    >
                        <Circle className="h-1.5 w-1.5 fill-current" />
                        {isActive ? "Active" : "Inactive"}
                    </span>

                    {folderName && (
                        <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0">
                            {folderName}
                        </Badge>
                    )}
                </div>

                {/* Creator */}
                {(bot.creator_name || bot.creator_email) && (
                    <div className="flex items-center gap-1.5 border-t border-border pt-3">
                        <UserRound className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <p className="truncate text-[11px] text-muted-foreground">
                            {bot.creator_name || bot.creator_email}
                        </p>
                    </div>
                )}
            </Link>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete bot</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-medium text-foreground">{bot.name}</span>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
                            {isPending ? "Deleting…" : "Delete bot"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
