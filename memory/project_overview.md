---
name: Kineto Frontend Project Overview
description: Tech stack, key conventions, and architecture decisions for kineto-frontend
type: project
---

Next.js 16.2.1 app (App Router). Middleware is called `proxy.ts` not `middleware.ts` — this is a breaking change in Next.js 16.

**Why:** AGENTS.md instructs reading node_modules/next/dist/docs/ before writing code. Next.js 16 renamed middleware to proxy.

**How to apply:** Always use `proxy.ts` at project root for request interception. Never create `middleware.ts`.

## Stack
- AppWrite (node-appwrite v23, server-side only — no browser client)
- Zustand v5 for client state
- React Query v5 for server state  
- pnpm as package manager
- Zod v4 (note: @hookform/resolvers has a compatibility issue with Zod v4 — use react-hook-form native validation instead of zodResolver)

## node-appwrite v23 API
- Use named-params object style, not positional args (positional is deprecated)
- `InputFile` is imported from `node-appwrite/file`, not the main package

## Architecture
- All AppWrite access is server-side via API routes or Server Components
- DAL at `lib/dal.ts` with `getAuthUser()` and `getSessionExpiry()` (React cache memoized)
- Auth store: `store/auth.store.ts` (Zustand) holds user, workspace, membership, sessionExpiresAt
- `AuthProvider` in `components/providers/auth-provider.tsx` bootstraps store on mount
- Session expiry warning at ≤5 minutes via `components/auth/session-expiry-dialog.tsx`
- RBAC: `types/rbac/index.ts` has permissions map; `components/guards/rbac-guard.tsx` for UI
- Onboarding wizard at `components/onboarding/onboarding-wizard.tsx` (5 steps)
- Dashboard layout at `app/(workspace)/layout.tsx` does server-side auth + workspace check

## Required env vars (new)
- APPWRITE_DATABASE_ID
- APPWRITE_WORKSPACES_COLLECTION_ID
- APPWRITE_MEMBERS_COLLECTION_ID
- APPWRITE_INVITATIONS_COLLECTION_ID
- APPWRITE_WORKSPACE_BUCKET_ID
