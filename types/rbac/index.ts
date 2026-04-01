import type { WorkspaceRole } from "@/types/workspace"

/**
 * All possible permissions in the system.
 * Format: resource:action
 */
export type Permission =
    | "workspace:read"
    | "workspace:update"
    | "workspace:delete"
    | "members:read"
    | "members:invite"
    | "members:remove"
    | "members:update_role"
    | "billing:read"
    | "billing:manage"
    | "settings:read"
    | "settings:manage"

/**
 * Maps each role to the set of permissions it grants.
 */
export const ROLE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
    owner: [
        "workspace:read",
        "workspace:update",
        "workspace:delete",
        "members:read",
        "members:invite",
        "members:remove",
        "members:update_role",
        "billing:read",
        "billing:manage",
        "settings:read",
        "settings:manage",
    ],
    admin: [
        "workspace:read",
        "workspace:update",
        "members:read",
        "members:invite",
        "members:remove",
        "settings:read",
        "settings:manage",
    ],
    member: [
        "workspace:read",
        "members:read",
        "settings:read",
    ],
}

export function hasPermission(role: WorkspaceRole, permission: Permission): boolean {
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: WorkspaceRole, permissions: Permission[]): boolean {
    return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: WorkspaceRole, permissions: Permission[]): boolean {
    return permissions.every((p) => hasPermission(role, p))
}
