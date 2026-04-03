export interface AuthUser {
    id: string
    email: string
    created_at: string
    updated_at?: string
    user_metadata: {
        full_name?: string
        name?: string
        avatar_url?: string
        [key: string]: unknown
    }
}

export interface UserPreferences {
    purpose: WorkspacePurpose | null
    referralSource: ReferralSource | null
    onboardingCompleted: boolean
}

export type WorkspacePurpose =
    | "customer_support"
    | "sales_automation"
    | "internal_tooling"
    | "lead_generation"
    | "hr_operations"
    | "other"

export type ReferralSource =
    | "google_search"
    | "social_media"
    | "friend_referral"
    | "blog_article"
    | "product_hunt"
    | "youtube"
    | "other"

export const WORKSPACE_PURPOSE_LABELS: Record<WorkspacePurpose, string> = {
    customer_support: "Customer Support",
    sales_automation: "Sales Automation",
    internal_tooling: "Internal Tooling",
    lead_generation: "Lead Generation",
    hr_operations: "HR & Operations",
    other: "Other",
}

export const REFERRAL_SOURCE_LABELS: Record<ReferralSource, string> = {
    google_search: "Google Search",
    social_media: "Social Media",
    friend_referral: "Friend / Colleague",
    blog_article: "Blog or Article",
    product_hunt: "Product Hunt",
    youtube: "YouTube",
    other: "Other",
}
