import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/dal"
import { workspaceModule } from "@/modules/workspace"

/**
 * Server-side layout that enforces authentication and workspace membership
 * for all /workspace routes.
 * This is the "secure" check that backs up the optimistic proxy check.
 */
export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const user = await getAuthUser()

    if (!user) {
        redirect("/login")
    }

    const workspaces = await workspaceModule.getWorkspacesByUserId(user.id)

    if (workspaces.length === 0) {
        redirect("/onboarding")
    }

    return <>{children}</>
}
