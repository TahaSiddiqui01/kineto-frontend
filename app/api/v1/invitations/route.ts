import { getAuthUser } from "@/lib/dal"
import { workspaceModule } from "@/modules/workspace"
import { NextResponse } from "next/server"

/**
 * GET /api/v1/invitations
 * Returns all pending invitations for the authenticated user's email.
 */
export async function GET() {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const invitations = await workspaceModule.getPendingInvitationsByEmail(user.email)
    return NextResponse.json({ data: invitations })
}
