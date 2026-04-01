export type WorkspaceIndustry =
    | "technology"
    | "healthcare"
    | "finance"
    | "education"
    | "ecommerce"
    | "marketing"
    | "real_estate"
    | "legal"
    | "hospitality"
    | "manufacturing"
    | "other"

export const WORKSPACE_INDUSTRY_LABELS: Record<WorkspaceIndustry, string> = {
    technology: "Technology & Software",
    healthcare: "Healthcare & Medical",
    finance: "Finance & Banking",
    education: "Education & E-Learning",
    ecommerce: "E-Commerce & Retail",
    marketing: "Marketing & Advertising",
    real_estate: "Real Estate",
    legal: "Legal & Compliance",
    hospitality: "Hospitality & Travel",
    manufacturing: "Manufacturing & Logistics",
    other: "Other",
}

export interface Workspace {
    $id: string
    $createdAt: string
    $updatedAt: string
    name: string
    slug: string
    industry: WorkspaceIndustry
    logoUrl: string | null
    logoFileId: string | null
    createdBy: string
    plan: WorkspacePlan
}

export type WorkspacePlan = "free" | "pro" | "enterprise"

export interface CreateWorkspacePayload {
    name: string
    industry: WorkspaceIndustry
    logoFile?: File | null
}
