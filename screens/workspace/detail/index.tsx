"use client"

import { useState } from "react"
import { FolderPlus, Plus, Bot, FolderOpen } from "lucide-react"
import { useFolders, useBots } from "@/hooks/use-bots"
import { CreateFolderDialog } from "@/components/bot/create-folder-dialog"
import { CreateBotDialog } from "@/components/bot/create-bot-dialog"
import { FolderCard } from "@/components/bot/folder-card"
import { BotCard } from "@/components/bot/bot-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface WorkspaceDetailScreenProps {
    workspaceId: string
    workspaceName: string
}

type FolderFilter = "all" | string

export default function WorkspaceDetailScreen({ workspaceId, workspaceName }: WorkspaceDetailScreenProps) {
    const { folders, isLoading: foldersLoading } = useFolders(workspaceId)
    const { bots, isLoading: botsLoading } = useBots(workspaceId)

    const [folderDialogOpen, setFolderDialogOpen] = useState(false)
    const [botDialogOpen, setBotDialogOpen] = useState(false)
    const [selectedFolder, setSelectedFolder] = useState<FolderFilter>("all")

    const isLoading = foldersLoading || botsLoading

    const folderMap = Object.fromEntries(folders.map((f) => [f.id, f]))

    const filteredBots =
        selectedFolder === "all"
            ? bots
            : bots.filter((b) => b.folder_id === selectedFolder)

    const botCountByFolder = folders.reduce<Record<string, number>>((acc, f) => {
        acc[f.id] = bots.filter((b) => b.folder_id === f.id).length
        return acc
    }, {})

    const isEmpty = !isLoading && folders.length === 0 && bots.length === 0

    return (
        <div className="mx-auto max-w-7xl px-6 py-10">
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight">{workspaceName}</h1>
                    <p className="mt-1 text-muted-foreground">Manage your folders and bots.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setFolderDialogOpen(true)}>
                        <FolderPlus className="mr-1.5 h-4 w-4" />
                        New Folder
                    </Button>
                    <Button size="sm" onClick={() => setBotDialogOpen(true)}>
                        <Plus className="mr-1.5 h-4 w-4" />
                        New Bot
                    </Button>
                </div>
            </div>

            {/* ── Empty State ─────────────────────────────────────────────── */}
            {isEmpty && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                        <Bot className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-base font-medium">No bots yet</p>
                    <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                        Create your first bot, or organise bots into folders to keep things tidy.
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => setFolderDialogOpen(true)}>
                            <FolderPlus className="mr-1.5 h-4 w-4" />
                            New Folder
                        </Button>
                        <Button size="sm" onClick={() => setBotDialogOpen(true)}>
                            <Plus className="mr-1.5 h-4 w-4" />
                            New Bot
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Folders ─────────────────────────────────────────────────── */}
            {!isEmpty && (
                <>
                    {(foldersLoading || folders.length > 0) && (
                        <section className="mb-8">
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Folders
                            </h2>

                            {foldersLoading ? (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-24 rounded-xl" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {/* "All bots" pill */}
                                    <button
                                        onClick={() => setSelectedFolder("all")}
                                        className={cn(
                                            "flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-150 hover:border-primary/40 hover:shadow-sm",
                                            selectedFolder === "all"
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-border bg-card text-foreground"
                                        )}
                                    >
                                        <FolderOpen className="h-4 w-4" />
                                        All bots
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {bots.length}
                                        </span>
                                    </button>

                                    {folders.map((folder) => (
                                        <FolderCard
                                            key={folder.id}
                                            folder={folder}
                                            workspaceId={workspaceId}
                                            botCount={botCountByFolder[folder.id] ?? 0}
                                            isSelected={selectedFolder === folder.id}
                                            onClick={() =>
                                                setSelectedFolder((prev) =>
                                                    prev === folder.id ? "all" : folder.id
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* ── Bots ──────────────────────────────────────────────── */}
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                {selectedFolder === "all"
                                    ? "All bots"
                                    : folderMap[selectedFolder]?.name ?? "Bots"}
                            </h2>
                            {selectedFolder !== "all" && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setBotDialogOpen(true)}
                                    className="h-7 text-xs"
                                >
                                    <Plus className="mr-1 h-3 w-3" />
                                    Add to folder
                                </Button>
                            )}
                        </div>

                        {botsLoading ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <Skeleton key={i} className="h-32 rounded-xl" />
                                ))}
                            </div>
                        ) : filteredBots.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-14 text-center">
                                <Bot className="mb-3 h-8 w-8 text-muted-foreground/50" />
                                <p className="text-sm text-muted-foreground">
                                    {selectedFolder === "all"
                                        ? "No bots yet. Create your first one."
                                        : "No bots in this folder yet."}
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => setBotDialogOpen(true)}
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                                    New Bot
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {filteredBots.map((bot) => (
                                    <BotCard
                                        key={bot.id}
                                        bot={bot}
                                        workspaceId={workspaceId}
                                        folderName={
                                            bot.folder_id ? folderMap[bot.folder_id]?.name : undefined
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}

            {/* ── Dialogs ─────────────────────────────────────────────────── */}
            <CreateFolderDialog
                workspaceId={workspaceId}
                open={folderDialogOpen}
                onOpenChange={setFolderDialogOpen}
            />
            <CreateBotDialog
                workspaceId={workspaceId}
                folders={folders}
                defaultFolderId={selectedFolder !== "all" ? selectedFolder : null}
                open={botDialogOpen}
                onOpenChange={setBotDialogOpen}
            />
        </div>
    )
}
