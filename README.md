# Kineto Frontend

AI-powered workspace platform built with Next.js 16, AppWrite, and Zustand.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| pnpm | 9+ |
| AppWrite | Cloud or self-hosted (v1.6+) |

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

---

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd kineto-frontend
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every value. See the [Environment Variables](#environment-variables) section below for what each one means.

### 3. Set up AppWrite

Follow the [AppWrite Setup](#appwrite-setup) section below to create the required database, collections, and storage bucket. Copy the generated IDs into `.env.local`.

### 4. Start the development server

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
pnpm build
pnpm start
```

---

## Environment Variables

All variables live in `.env.local` (copy from `.env.example`).

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Yes | AppWrite API endpoint (e.g. `https://sfo.cloud.appwrite.io/v1`) |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Yes | Your AppWrite project ID |
| `NEXT_PUBLIC_APPWRITE_PROJECT_NAME` | Yes | Your AppWrite project name |
| `APPWRITE_API_KEY` | Yes | Server-side API key with the permissions listed below |
| `APPWRITE_DATABASE_ID` | Yes | ID of the AppWrite database you create |
| `APPWRITE_WORKSPACES_COLLECTION_ID` | Yes | ID of the `workspaces` collection |
| `APPWRITE_MEMBERS_COLLECTION_ID` | Yes | ID of the `workspace_members` collection |
| `APPWRITE_INVITATIONS_COLLECTION_ID` | Yes | ID of the `workspace_invitations` collection |
| `APPWRITE_WORKSPACE_BUCKET_ID` | Yes | ID of the storage bucket for workspace logos |
| `NEXT_PUBLIC_APP_URL` | Yes | Full URL of this app (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL for internal API calls (e.g. `http://localhost:3000/api/v1`) |

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put your `APPWRITE_API_KEY` in a `NEXT_PUBLIC_` variable.

### Required AppWrite API Key Permissions

When creating the API key in the AppWrite console, enable at minimum:

- `databases.read`, `databases.write`
- `collections.read`, `collections.write`
- `documents.read`, `documents.write`
- `files.read`, `files.write`, `buckets.read`
- `users.read`, `users.write`, `sessions.read`, `sessions.write`
- `account`

---

## AppWrite Setup

### Step 1 — Create a Database

In the AppWrite console go to **Databases → Create Database**. Copy the generated ID into `APPWRITE_DATABASE_ID`.

---

### Step 2 — Create Collections

Create the following three collections inside that database.

#### `workspaces`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `name` | String (80) | Yes | Display name of the workspace |
| `slug` | String (80) | Yes | URL-safe version of the name, auto-generated |
| `industry` | String (50) | Yes | One of the `WorkspaceIndustry` enum values |
| `logoUrl` | String (2048) | No | Public URL of the uploaded logo |
| `logoFileId` | String (36) | No | AppWrite Storage file ID for the logo |
| `createdBy` | String (36) | Yes | AppWrite user ID of the owner |
| `plan` | String (20) | Yes | Default `free`. Values: `free`, `pro`, `enterprise` |

**Indexes:** Add an index on `createdBy`.

---

#### `workspace_members`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `workspaceId` | String (36) | Yes | References `workspaces.$id` |
| `userId` | String (36) | Yes | AppWrite user ID |
| `role` | String (20) | Yes | One of: `owner`, `admin`, `member` |
| `userEmail` | String (320) | Yes | Stored for display without extra lookups |
| `userName` | String (128) | Yes | Stored for display without extra lookups |

**Indexes:** Add indexes on `workspaceId` and `userId`.

---

#### `workspace_invitations`

| Attribute | Type | Required | Notes |
|-----------|------|----------|-------|
| `workspaceId` | String (36) | Yes | References `workspaces.$id` |
| `email` | String (320) | Yes | Email address of the invitee |
| `role` | String (20) | Yes | Role to assign on acceptance: `admin` or `member` |
| `status` | String (20) | Yes | One of: `pending`, `accepted`, `declined`, `expired` |
| `expiresAt` | DateTime | Yes | Invitation expiry (7 days from creation) |
| `invitedBy` | String (36) | Yes | AppWrite user ID of the sender |

**Indexes:** Add indexes on `email` and `status`.

---

### Step 3 — Create a Storage Bucket

Go to **Storage → Create Bucket**. Configure it as follows:

- **Name:** `workspace-logos` (or anything descriptive)
- **Permissions:** Allow your API key to read and write files
- **Max file size:** 5 MB
- **Allowed file types:** `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`

Copy the bucket ID into `APPWRITE_WORKSPACE_BUCKET_ID`.

---

### Step 4 — Configure OAuth Providers (Google / GitHub login)

In the AppWrite console go to **Auth → Settings** and enable:

- **Google** — paste in your Google OAuth Client ID and Secret
- **GitHub** — paste in your GitHub OAuth App Client ID and Secret

Set the OAuth redirect URL to:

```
<NEXT_PUBLIC_APP_URL>/api/v1/auth/callback/success
```

---

## Project Structure

```
app/
  (auth)/login/          # Login page
  (dashboard)/           # Protected routes (server-side auth check in layout.tsx)
  (onboarding)/          # Onboarding wizard
  api/v1/                # All API route handlers
proxy.ts                 # Next.js 16 route protection (replaces middleware.ts)
components/
  auth/                  # Session expiry dialog
  guards/                # RbacGuard — declarative permission-based rendering
  onboarding/            # 5-step onboarding wizard and its steps
  providers/             # AuthProvider, QueryProvider
hooks/
  use-auth.ts            # Auth mutations (magic link, Google, GitHub)
  use-session.ts         # Session expiry countdown
lib/
  dal.ts                 # Data access layer — session verification (server-only)
modules/
  auth/                  # AppWrite auth operations (server-side)
  workspace/             # AppWrite workspace/member/invitation operations (server-side)
services/
  auth.service.ts        # Client-side auth API calls
  user.service.ts        # Client-side user API calls
  workspace.service.ts   # Client-side workspace API calls
store/
  auth.store.ts          # Zustand store: user, workspace, session expiry
types/
  auth/                  # User and session TypeScript types
  rbac/                  # Permission map and helpers
  workspace/             # Workspace, member, and invitation types
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server at `localhost:3000` |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
