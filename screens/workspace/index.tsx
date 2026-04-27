"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WorkspaceCard } from "@/components/workspace/workspace-card"
import EmptyState from "@/components/workspace/workspace-empty-state"
import WorkspaceLoadingSkeleton from "@/components/workspace/workspace-loading-skeleton"
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog"
import { useWorkspaces } from "@/hooks/use-workspace"
import { Plus } from "lucide-react"
import { WorkspaceMember } from "@/types/workspace"

export default function WorkspacesPage() {
  const { workspaces, isLoading } = useWorkspaces()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="max-w-12xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your projects in one place.
          </p>
        </div>

        <Button size="lg" className="shadow-sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <WorkspaceLoadingSkeleton />
      ) : workspaces.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((wm: WorkspaceMember) => (
            <WorkspaceCard key={wm.workspaces.id} {...wm.workspaces} role={wm.role} workspaceId={wm.workspace_id} />
          ))}
        </div>
      ) : (
        <EmptyState onCreateClick={() => setDialogOpen(true)} />
      )}

      <CreateWorkspaceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
