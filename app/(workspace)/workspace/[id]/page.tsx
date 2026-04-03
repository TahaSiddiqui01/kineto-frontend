import { notFound } from "next/navigation"
import { workspaceModule } from "@/modules/workspace"
import WorkspaceDetailScreen from "@/screens/workspace/detail"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function WorkspaceDetailPage({ params }: PageProps) {
    const { id } = await params
    const workspace = await workspaceModule.getWorkspaceById(id)

    if (!workspace) notFound()

    return <WorkspaceDetailScreen workspaceId={id} workspaceName={workspace.name} />
}
