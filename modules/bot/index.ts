import { createAdminClient } from "@/lib/supabase-server-client"
import { v4 as uuidv4 } from "uuid"
import type { Bot, Folder, CreateFolderPayload, CreateBotPayload } from "@/types/bot"

class BotModule {
    private db() {
        return createAdminClient()
    }

    // ── Folders ────────────────────────────────────────────────────────────

    async getFoldersByWorkspace(workspaceId: string): Promise<Folder[]> {
        const { data, error } = await this.db()
            .from("folders")
            .select("*")
            .eq("workspace_id", workspaceId)
            .order("created_at", { ascending: true })

        if (error) throw error
        return (data ?? []) as unknown as Folder[]
    }

    async createFolder(workspaceId: string, userId: string, payload: CreateFolderPayload): Promise<Folder> {
        const { data, error } = await this.db()
            .from("folders")
            .insert({
                id: uuidv4(),
                workspace_id: workspaceId,
                name: payload.name,
                created_by: userId,
            })
            .select()
            .single()

        if (error) throw error
        return data as unknown as Folder
    }

    async deleteFolder(folderId: string, workspaceId: string): Promise<void> {
        const { error } = await this.db()
            .from("folders")
            .delete()
            .eq("id", folderId)
            .eq("workspace_id", workspaceId)

        if (error) throw error
    }

    // ── Bots ───────────────────────────────────────────────────────────────

    async getBotsByWorkspace(workspaceId: string): Promise<Bot[]> {
        const supabase = this.db()

        const { data, error } = await supabase
            .from("bots")
            .select("*")
            .eq("workspace_id", workspaceId)
            .order("created_at", { ascending: false })

        if (error) throw error
        if (!data || data.length === 0) return []

        const creatorIds = [...new Set(data.map((b) => b.created_by))]
        const { data: members } = await supabase
            .from("workspace_members")
            .select("user_id, user_name, user_email")
            .eq("workspace_id", workspaceId)
            .in("user_id", creatorIds)

        const memberMap = Object.fromEntries(
            (members ?? []).map((m) => [m.user_id, m])
        )

        return data.map((bot) => ({
            ...bot,
            creator_name: memberMap[bot.created_by]?.user_name || null,
            creator_email: memberMap[bot.created_by]?.user_email || null,
        })) as unknown as Bot[]
    }

    async createBot(workspaceId: string, userId: string, payload: CreateBotPayload): Promise<Bot> {
        const { data, error } = await this.db()
            .from("bots")
            .insert({
                id: uuidv4(),
                workspace_id: workspaceId,
                folder_id: payload.folder_id ?? null,
                name: payload.name,
                description: payload.description ?? null,
                status: "inactive",
                created_by: userId,
            })
            .select()
            .single()

        if (error) throw error
        return data as unknown as Bot
    }

    async deleteBot(botId: string, workspaceId: string): Promise<void> {
        const { error } = await this.db()
            .from("bots")
            .delete()
            .eq("id", botId)
            .eq("workspace_id", workspaceId)

        if (error) throw error
    }
}

export const botModule = new BotModule()
