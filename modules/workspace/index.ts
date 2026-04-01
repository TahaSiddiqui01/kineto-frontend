/**
 * Server-side workspace operations via AppWrite Databases + Storage.
 *
 * Required AppWrite setup:
 *  Database:   process.env.APPWRITE_DATABASE_ID
 *  Collections:
 *    - APPWRITE_WORKSPACES_COLLECTION_ID  (workspaces)
 *    - APPWRITE_MEMBERS_COLLECTION_ID     (workspace_members)
 *    - APPWRITE_INVITATIONS_COLLECTION_ID (workspace_invitations)
 *  Storage bucket: APPWRITE_WORKSPACE_BUCKET_ID
 */
import { createServerClient } from "@/lib/app-write-server-client"
import { Databases, ID, Query, Storage } from "node-appwrite"
import { InputFile } from "node-appwrite/file"
import type {
    CreateWorkspacePayload,
    InviteUserPayload,
    Workspace,
    WorkspaceInvitation,
    WorkspaceMember,
    WorkspaceRole,
} from "@/types/workspace"

const DB_ID = process.env.APPWRITE_DATABASE_ID!
const WS_COL = process.env.APPWRITE_WORKSPACES_COLLECTION_ID!
const MEM_COL = process.env.APPWRITE_MEMBERS_COLLECTION_ID!
const INV_COL = process.env.APPWRITE_INVITATIONS_COLLECTION_ID!
const BUCKET_ID = process.env.APPWRITE_WORKSPACE_BUCKET_ID!

function slugify(name: string) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
}

class WorkspaceModule {
    private db() {
        return new Databases(createServerClient())
    }

    private storage() {
        return new Storage(createServerClient())
    }

    async getWorkspacesByUserId(userId: string): Promise<Workspace[]> {
        const db = this.db()
        const memberships = await db.listDocuments({
            databaseId: DB_ID,
            collectionId: MEM_COL,
            queries: [Query.equal("userId", userId)],
        })
        if (memberships.total === 0) return []

        const workspaceIds = memberships.documents.map((m) => m.workspaceId as string)
        const result = await db.listDocuments({
            databaseId: DB_ID,
            collectionId: WS_COL,
            queries: [Query.equal("$id", workspaceIds)],
        })
        return result.documents as unknown as Workspace[]
    }

    async getMembershipByUserId(userId: string, workspaceId: string): Promise<WorkspaceMember | null> {
        const result = await this.db().listDocuments({
            databaseId: DB_ID,
            collectionId: MEM_COL,
            queries: [
                Query.equal("userId", userId),
                Query.equal("workspaceId", workspaceId),
            ],
        })
        if (result.total === 0) return null
        return result.documents[0] as unknown as WorkspaceMember
    }

    async getWorkspaceById(workspaceId: string): Promise<Workspace | null> {
        try {
            const doc = await this.db().getDocument({
                databaseId: DB_ID,
                collectionId: WS_COL,
                documentId: workspaceId,
            })
            return doc as unknown as Workspace
        } catch {
            return null
        }
    }

    async getPendingInvitationsByEmail(email: string): Promise<WorkspaceInvitation[]> {
        const result = await this.db().listDocuments({
            databaseId: DB_ID,
            collectionId: INV_COL,
            queries: [
                Query.equal("email", email),
                Query.equal("status", "pending"),
                Query.greaterThan("expiresAt", new Date().toISOString()),
            ],
        })
        return result.documents as unknown as WorkspaceInvitation[]
    }

    async uploadWorkspaceLogo(
        file: Buffer,
        fileName: string
    ): Promise<{ fileId: string; url: string }> {
        const storage = this.storage()
        const uploaded = await storage.createFile({
            bucketId: BUCKET_ID,
            fileId: ID.unique(),
            file: InputFile.fromBuffer(file, fileName),
        })
        const url = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
        return { fileId: uploaded.$id, url }
    }

    async createWorkspace(
        userId: string,
        payload: Omit<CreateWorkspacePayload, "logoFile"> & {
            logoUrl?: string | null
            logoFileId?: string | null
        }
    ): Promise<Workspace> {
        const db = this.db()
        const workspaceId = ID.unique()

        const workspace = await db.createDocument({
            databaseId: DB_ID,
            collectionId: WS_COL,
            documentId: workspaceId,
            data: {
                name: payload.name,
                slug: slugify(payload.name),
                industry: payload.industry,
                logoUrl: payload.logoUrl ?? null,
                logoFileId: payload.logoFileId ?? null,
                createdBy: userId,
                plan: "free",
            },
        })

        // Create the owner membership
        await db.createDocument({
            databaseId: DB_ID,
            collectionId: MEM_COL,
            documentId: ID.unique(),
            data: {
                workspaceId: workspace.$id,
                userId,
                role: "owner" satisfies WorkspaceRole,
                userEmail: "",
                userName: "",
            },
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

        const doc = await this.db().createDocument({
            databaseId: DB_ID,
            collectionId: INV_COL,
            documentId: ID.unique(),
            data: {
                workspaceId,
                email: payload.email,
                role: payload.role,
                status: "pending",
                expiresAt: expires.toISOString(),
                invitedBy,
            },
        })
        return doc as unknown as WorkspaceInvitation
    }

    async acceptInvitation(invitationId: string, userId: string, userName: string): Promise<void> {
        const db = this.db()
        const inv = await db.getDocument({
            databaseId: DB_ID,
            collectionId: INV_COL,
            documentId: invitationId,
        })
        if (!inv || inv.status !== "pending") throw new Error("Invitation not valid")

        await db.updateDocument({
            databaseId: DB_ID,
            collectionId: INV_COL,
            documentId: invitationId,
            data: { status: "accepted" },
        })
        await db.createDocument({
            databaseId: DB_ID,
            collectionId: MEM_COL,
            documentId: ID.unique(),
            data: {
                workspaceId: inv.workspaceId,
                userId,
                role: inv.role,
                userEmail: inv.email,
                userName,
            },
        })
    }

    async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
        const result = await this.db().listDocuments({
            databaseId: DB_ID,
            collectionId: MEM_COL,
            queries: [Query.equal("workspaceId", workspaceId)],
        })
        return result.documents as unknown as WorkspaceMember[]
    }
}

export const workspaceModule = new WorkspaceModule()
