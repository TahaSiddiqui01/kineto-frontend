import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { botService } from "@/services/bot.service"
import type { CreateBotPayload, CreateFolderPayload } from "@/types/bot"

export const botKeys = {
    all: (workspaceId: string) => ["workspace", workspaceId, "bots"] as const,
    lists: (workspaceId: string) => [...botKeys.all(workspaceId), "list"] as const,
}

export const folderKeys = {
    all: (workspaceId: string) => ["workspace", workspaceId, "folders"] as const,
    lists: (workspaceId: string) => [...folderKeys.all(workspaceId), "list"] as const,
}

// ── Folders ──────────────────────────────────────────────────────────────────

export function useFolders(workspaceId: string) {
    const { data, isLoading } = useQuery({
        queryKey: folderKeys.lists(workspaceId),
        queryFn: () => botService.getFolders(workspaceId),
        enabled: !!workspaceId,
    })

    return {
        folders: data?.data ?? [],
        isLoading,
    }
}

export function useCreateFolder(workspaceId: string) {
    const queryClient = useQueryClient()

    const { mutate: createFolder, isPending } = useMutation({
        mutationFn: (payload: CreateFolderPayload) => botService.createFolder(workspaceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: folderKeys.lists(workspaceId) })
            toast.success("Folder created")
        },
        onError: () => {
            toast.error("Failed to create folder")
        },
    })

    return { createFolder, isPending }
}

export function useDeleteFolder(workspaceId: string) {
    const queryClient = useQueryClient()

    const { mutate: deleteFolder, isPending } = useMutation({
        mutationFn: (folderId: string) => botService.deleteFolder(workspaceId, folderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: folderKeys.lists(workspaceId) })
            queryClient.invalidateQueries({ queryKey: botKeys.lists(workspaceId) })
            toast.success("Folder deleted")
        },
        onError: () => {
            toast.error("Failed to delete folder")
        },
    })

    return { deleteFolder, isPending }
}

// ── Bots ─────────────────────────────────────────────────────────────────────

export function useBots(workspaceId: string) {
    const { data, isLoading } = useQuery({
        queryKey: botKeys.lists(workspaceId),
        queryFn: () => botService.getBots(workspaceId),
        enabled: !!workspaceId,
    })

    return {
        bots: data?.data ?? [],
        isLoading,
    }
}

export function useCreateBot(workspaceId: string) {
    const queryClient = useQueryClient()

    const { mutate: createBot, isPending } = useMutation({
        mutationFn: (payload: CreateBotPayload) => botService.createBot(workspaceId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: botKeys.lists(workspaceId) })
            toast.success("Bot created")
        },
        onError: () => {
            toast.error("Failed to create bot")
        },
    })

    return { createBot, isPending }
}

export function useDeleteBot(workspaceId: string) {
    const queryClient = useQueryClient()

    const { mutate: deleteBot, isPending } = useMutation({
        mutationFn: (botId: string) => botService.deleteBot(workspaceId, botId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: botKeys.lists(workspaceId) })
            toast.success("Bot deleted")
        },
        onError: () => {
            toast.error("Failed to delete bot")
        },
    })

    return { deleteBot, isPending }
}
