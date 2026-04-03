import { getAuthUser } from "@/lib/dal"
import { workspaceModule } from "@/modules/workspace"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const createWorkspaceSchema = z.object({
    name: z.string().min(2).max(80),
    industry: z.string(),
    purpose: z.string().optional(),
    referralSource: z.string().optional(),
    logoUrl: z.string().url().nullish(),
    logoFileId: z.string().nullish(),
})

/**
 * GET /api/v1/workspace
 * Returns all workspaces the authenticated user is a member of.
 */
export async function GET() {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const workspaces = await workspaceModule.getWorkspacesByUserId(user.id)
    return NextResponse.json({ data: workspaces })
}

/**
 * POST /api/v1/workspace
 * Creates a new workspace and makes the user the owner.
 */
export async function POST(req: NextRequest) {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const parsed = createWorkspaceSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const workspace = await workspaceModule.createWorkspace(user.id, {
        name: parsed.data.name,
        industry: parsed.data.industry as never,
        logoUrl: parsed.data.logoUrl ?? null,
        logoFileId: parsed.data.logoFileId ?? null,
    })

    return NextResponse.json({ data: workspace }, { status: 201 })
}
