import { workspaceService } from "@/services/workspace.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { defaultTo } from "lodash-es";
import { toast } from "sonner";

export const workspaceKeys = {
    all: ["workspace"] as const,
    lists: () => [...workspaceKeys.all, "list"] as const,
}

export function useWorkspaces() {
    const { data, isLoading } = useQuery({
        queryFn: workspaceService.getMyWorkspaces,
        queryKey: workspaceKeys.lists(),
    })

    return {
        workspaces: defaultTo(data?.data, []),
        isLoading,
    }
}

export function useCreateWorkspace() {
    const queryClient = useQueryClient()

    const { mutate: createWorkspace, isPending } = useMutation({
        mutationFn: workspaceService.createWorkspace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() })
            toast.success("Workspace created!")
        },
        onError: () => {
            toast.error("Failed to create workspace", { description: "Please try again." })
        },
    })

    return { createWorkspace, isPending }
}
