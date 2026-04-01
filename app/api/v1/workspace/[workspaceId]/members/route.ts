import { getAuthUser } from "@/lib/dal"
import { workspaceModule } from "@/modules/workspace"
import { hasPermission } from "@/types/rbac"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const inviteSchema = z.object({
    email: z.string().email(),
    role: z.enum(["admin", "member"]),
})

type Params = { params: Promise<{ workspaceId: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
    const { workspaceId } = await params
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const membership = await workspaceModule.getMembershipByUserId(user.$id, workspaceId)
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    if (!hasPermission(membership.role, "members:read")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const members = await workspaceModule.getWorkspaceMembers(workspaceId)
    return NextResponse.json({ data: members })
}

export async function POST(req: NextRequest, { params }: Params) {
    const { workspaceId } = await params
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const membership = await workspaceModule.getMembershipByUserId(user.$id, workspaceId)
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    if (!hasPermission(membership.role, "members:invite")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = inviteSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const invitation = await workspaceModule.inviteUser(workspaceId, user.$id, parsed.data)
    return NextResponse.json({ data: invitation }, { status: 201 })
}
