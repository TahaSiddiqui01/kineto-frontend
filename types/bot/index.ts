import type { FlowEdge, FlowNode, Variable } from "@/types/flow"

export type BotStatus = "active" | "inactive"

export interface BotFlowData {
    nodes: FlowNode[]
    edges: FlowEdge[]
    variables: Variable[]
}

export interface BotDataRecord {
    id: string
    created_at: string
    updated_at: string
    bot_id: string
    bot_data: BotFlowData
}

export interface Folder {
    id: string
    created_at: string
    updated_at: string
    workspace_id: string
    name: string
    created_by: string
}

export interface Bot {
    id: string
    created_at: string
    updated_at: string
    workspace_id: string
    folder_id: string | null
    name: string
    description: string | null
    status: BotStatus
    created_by: string
    creator_name: string | null
    creator_email: string | null
}

export interface CreateFolderPayload {
    name: string
}

export interface CreateBotPayload {
    name: string
    description?: string
    folder_id?: string | null
}
