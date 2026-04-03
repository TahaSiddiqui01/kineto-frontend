/**
 * Server-side workspace operations via Supabase Databases + Storage.
 *
 * Required Supabase setup:
 *  Tables:
 *    - workspaces
 *    - workspace_members
 *    - workspace_invitations
 *  Storage bucket: SUPABASE_WORKSPACE_BUCKET_ID
 */
import { createAdminClient } from "@/lib/supabase-server-client"
import { v4 as uuidv4 } from "uuid"
import type {
    CreateWorkspacePayload,
    InviteUserPayload,
    Workspace,
    WorkspaceInvitation,
    WorkspaceMember,
    WorkspaceRole,
} from "@/types/workspace"

const BUCKET_ID = process.env.SUPABASE_WORKSPACE_BUCKET_ID!

function slugify(name: string) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
}

class WorkspaceModule {
    private db() {
        return createAdminClient()
    }

    async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
        const supabase = this.db()
        const { data: memberships, error: memError } = await supabase
            .from("workspace_members")
            .select("workspace_id")
            .eq("user_id", userId)

        if (memError || !memberships || memberships.length === 0) return []

        const workspaceIds = memberships.map((m) => m.workspace_id as string)
        const { data: workspaces } = await supabase
            .from("workspaces")
            .select("*")
            .in("id", workspaceIds)

        return (workspaces ?? []) as unknown as Workspace[]
    }

    async getMembershipByUserId(userId: string, workspaceId: string): Promise<WorkspaceMember | null> {
        const { data } = await this.db()
            .from("workspace_members")
            .select("*")
            .eq("user_id", userId)
            .eq("workspace_id", workspaceId)
            .single()

        return data as unknown as WorkspaceMember | null
    }

    async getWorkspaceById(workspaceId: string): Promise<Workspace | null> {
        const { data } = await this.db()
            .from("workspaces")
            .select("*")
            .eq("id", workspaceId)
            .single()

        return data as unknown as Workspace | null
    }

    async getPendingInvitationsByEmail(email: string): Promise<WorkspaceInvitation[]> {
        const { data } = await this.db()
            .from("workspace_invitations")
            .select("*")
            .eq("email", email)
            .eq("status", "pending")
            .gt("expires_at", new Date().toISOString())

        return (data ?? []) as unknown as WorkspaceInvitation[]
    }

    async uploadWorkspaceLogo(
        file: Buffer,
        fileName: string,
        mimeType: string
    ): Promise<{ fileId: string; url: string }> {
        const supabase = this.db()
        const fileId = uuidv4()
        const filePath = `logos/${fileId}/${fileName}`

        const { error } = await supabase.storage
            .from(BUCKET_ID)
            .upload(filePath, file, { contentType: mimeType, upsert: false })

        if (error) throw error

        const { data: urlData } = supabase.storage
            .from(BUCKET_ID)
            .getPublicUrl(filePath)

        return { fileId, url: urlData.publicUrl }
    }

    async createWorkspace(
        userId: string,
        payload: Omit<CreateWorkspacePayload, "logoFile"> & {
            logoUrl?: string | null
            logoFileId?: string | null
        }
    ): Promise<Workspace> {
        const supabase = this.db()
        const workspaceId = uuidv4()

        const { data: workspace, error } = await supabase
            .from("workspaces")
            .insert({
                id: workspaceId,
                name: payload.name,
                slug: slugify(payload.name),
                industry: payload.industry,
                logo_url: payload.logoUrl ?? null,
                logo_file_id: payload.logoFileId ?? null,
                created_by: userId,
                plan: "free",
            })
            .select()
            .single()

        if (error) throw error

        await supabase.from("workspace_members").insert({
            id: uuidv4(),
            workspace_id: workspace.id,
            user_id: userId,
            role: "owner" satisfies WorkspaceRole,
            user_email: "",
            user_name: "",
        })

        return workspace as unknown as Workspace
    }

    async inviteUser(
        workspaceId: string,
        invitedBy: string,
        payload: InviteUserPayload
    ): Promise<WorkspaceInvitation> {
        const expires = new Date()
        expires.setDate(expires.getDate() + 7)

        const { data, error } = await this.db()
            .from("workspace_invitations")
            .insert({
                id: uuidv4(),
                workspace_id: workspaceId,
                email: payload.email,
                role: payload.role,
                status: "pending",
                expires_at: expires.toISOString(),
                invited_by: invitedBy,
            })
            .select()
            .single()

        if (error) throw error
        return data as unknown as WorkspaceInvitation
    }

    async acceptInvitation(invitationId: string, userId: string, userName: string): Promise<void> {
        const supabase = this.db()

        const { data: inv, error: fetchError } = await supabase
            .from("workspace_invitations")
            .select("*")
            .eq("id", invitationId)
            .single()

        if (fetchError || !inv || inv.status !== "pending") {
            throw new Error("Invitation not valid")
        }

        await supabase
            .from("workspace_invitations")
            .update({ status: "accepted" })
            .eq("id", invitationId)

        await supabase.from("workspace_members").insert({
            id: uuidv4(),
            workspace_id: inv.workspace_id,
            user_id: userId,
            role: inv.role,
            user_email: inv.email,
            user_name: userName,
        })
    }

    async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
        const { data } = await this.db()
            .from("workspace_members")
            .select("*")
            .eq("workspace_id", workspaceId)

        return (data ?? []) as unknown as WorkspaceMember[]
    }
}

export const workspaceModule = new WorkspaceModule()
