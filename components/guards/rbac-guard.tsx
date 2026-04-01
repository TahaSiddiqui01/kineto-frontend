"use client"

import { useAuthStore } from "@/store/auth.store"
import { hasAnyPermission, hasPermission } from "@/types/rbac"
import type { Permission } from "@/types/rbac"
import type { WorkspaceRole } from "@/types/workspace"

interface RbacGuardProps {
    /** User must have ALL of these permissions */
    require?: Permission | Permission[]
    /** User must have AT LEAST ONE of these permissions */
    requireAny?: Permission[]
    /** Minimum role required (owner > admin > member) */
    requireRole?: WorkspaceRole
    /** Rendered when the user lacks permission */
    fallback?: React.ReactNode
    children: React.ReactNode
}

const ROLE_RANK: Record<WorkspaceRole, number> = { owner: 3, admin: 2, member: 1 }

/**
 * Client-side RBAC guard. Wraps UI that should only be visible
 * (or interactable) based on the current user's workspace role.
 *
 * Note: This is a UI-layer guard. Every sensitive action must also
 * be authorised on the server (see API routes using hasPermission()).
 */
export function RbacGuard({ require, requireAny, requireRole, fallback = null, children }: RbacGuardProps) {
    const membership = useAuthStore((s) => s.currentMembership)

    if (!membership) return fallback

    const role = membership.role

    if (requireRole && ROLE_RANK[role] < ROLE_RANK[requireRole]) {
        return fallback
    }

    if (require) {
        const perms = Array.isArray(require) ? require : [require]
        if (!perms.every((p) => hasPermission(role, p))) return fallback
    }

    if (requireAny && !hasAnyPermission(role, requireAny)) {
        return fallback
    }

    return <>{children}</>
}
