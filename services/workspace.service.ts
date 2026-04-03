import type { CreateWorkspacePayload, Workspace, WorkspaceInvitation, WorkspaceMember } from "@/types/workspace"
import type { WorkspacePurpose, ReferralSource } from "@/types/auth"

const BASE = "/api/v1"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        credentials: "same-origin",
        ...init,
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw { status: res.status, message: err?.error ?? res.statusText }
    }
    return res.json()
}

export interface OnboardingPayload {
    workspace: CreateWorkspacePayload
    purpose: WorkspacePurpose
    referralSource: ReferralSource
    inviteEmails?: string[]
}

class WorkspaceService {
    async getMyWorkspaces(): Promise<{ data: WorkspaceMember[] }> {
        return request("/workspace")
    }

    async createWorkspace(payload: {
        name: string
        industry: string
        logoUrl?: string | null
        logoFileId?: string | null
    }): Promise<{ data: Workspace }> {
        return request("/workspace", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
    }

    /**
     * Uploads a logo file to the server which stores it in AppWrite Storage.
     * Returns the fileId and public URL.
     */
    async uploadLogo(file: File): Promise<{ data: { fileId: string; url: string } }> {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch(`${BASE}/workspace/logo`, {
            method: "POST",
            credentials: "same-origin",
            body: formData,
        })
        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw { status: res.status, message: err?.error ?? res.statusText }
        }
        return res.json()
    }

    async getPendingInvitations(): Promise<{ data: WorkspaceInvitation[] }> {
        return request("/invitations")
    }

    async inviteMembers(workspaceId: string, emails: string[], role = "member") {
        return Promise.all(
            emails.map((email) =>
                request(`/workspace/${workspaceId}/members`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, role }),
                })
            )
        )
    }
}

export const workspaceService = new WorkspaceService()
