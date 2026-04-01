export type WorkspaceRole = "owner" | "admin" | "member"

export const WORKSPACE_ROLE_LABELS: Record<WorkspaceRole, string> = {
    owner: "Owner",
    admin: "Admin",
    member: "Member",
}

export interface WorkspaceMember {
    $id: string
    $createdAt: string
    workspaceId: string
    userId: string
    role: WorkspaceRole
    userEmail: string
    userName: string
}

export type InvitationStatus = "pending" | "accepted" | "declined" | "expired"

export interface WorkspaceInvitation {
    $id: string
    $createdAt: string
    workspaceId: string
    email: string
    role: WorkspaceRole
    status: InvitationStatus
    expiresAt: string
    invitedBy: string
}

export interface InviteUserPayload {
    email: string
    role: WorkspaceRole
}
