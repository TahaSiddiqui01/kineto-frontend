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
    id: string
    created_at: string
    updated_at: string
    name: string
    slug: string
    industry: WorkspaceIndustry
    logo_url: string | null
    logo_file_id: string | null
    created_by: string
    plan: WorkspacePlan
}

export type WorkspacePlan = "free" | "pro" | "enterprise"

export interface CreateWorkspacePayload {
    name: string
    industry: WorkspaceIndustry
    logoFile?: File | null
}
