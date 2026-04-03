export type WorkspaceRole = "owner" | "admin" | "member"
import { Workspace } from "./workspace.types"

export const WORKSPACE_ROLE_LABELS: Record<WorkspaceRole, string> = {
    owner: "Owner",
    admin: "Admin",
    member: "Member",
}


export type InvitationStatus = "pending" | "accepted" | "declined" | "expired"


export interface WorkspaceMember {
    id: string
    created_at: string
    workspace_id: string
    user_id: string
    role: "owner" | "admin" | "member"
    user_email: string
    user_name: string
    workspaces: Workspace
}

export interface WorkspaceInvitation {
    id: string
    created_at: string
    workspace_id: string
    email: string
    role: WorkspaceRole
    status: InvitationStatus
    expires_at: string
    invited_by: string
}

export interface InviteUserPayload {
    email: string
    role: WorkspaceRole
}
