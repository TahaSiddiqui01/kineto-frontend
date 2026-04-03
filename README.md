# Kineto Frontend

AI-powered workspace platform built with Next.js 16, Supabase, and Zustand.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| pnpm | 9+ |
| Supabase | Cloud or self-hosted |

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

Open `.env.local` and fill in every value. See the [Environment Variables](#environment-variables) section below.

### 3. Set up Supabase

Follow the [Supabase Setup](#supabase-setup) section below to create the required tables, storage bucket, and auth providers.

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
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Publishable (public) key — safe to expose in the browser |
| `SUPABASE_SECRET_KEY` | Yes | Secret key — server-side only, never expose client-side |
| `SUPABASE_WORKSPACE_BUCKET_ID` | Yes | Storage bucket name for workspace logos |
| `NEXT_PUBLIC_APP_URL` | Yes | Full origin of this app (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL for internal API calls (e.g. `http://localhost:3000/api/v1`) |

---

## Supabase Setup

### Step 1 — Create the database tables

Run the following SQL in the Supabase **SQL Editor** (`Dashboard → SQL Editor → New query`):

```sql
-- Workspaces
CREATE TABLE workspaces (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    name          TEXT NOT NULL,
    slug          TEXT NOT NULL UNIQUE,
    industry      TEXT NOT NULL,
    logo_url      TEXT,
    logo_file_id  TEXT,
    created_by    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan          TEXT NOT NULL DEFAULT 'free'
);

-- Workspace members
CREATE TABLE workspace_members (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role          TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    user_email    TEXT NOT NULL DEFAULT '',
    user_name     TEXT NOT NULL DEFAULT '',
    UNIQUE (workspace_id, user_id)
);

-- Workspace invitations
CREATE TABLE workspace_invitations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email         TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at    TIMESTAMPTZ NOT NULL,
    invited_by    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for common query patterns
CREATE INDEX ON workspace_members (user_id);
CREATE INDEX ON workspace_members (workspace_id);
CREATE INDEX ON workspace_invitations (email, status);

-- Folders (organise bots within a workspace)
CREATE TABLE folders (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name          TEXT NOT NULL,
    created_by    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Bots (can optionally belong to a folder)
CREATE TABLE bots (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    folder_id     UUID REFERENCES folders(id) ON DELETE SET NULL,
    name          TEXT NOT NULL,
    description   TEXT,
    status        TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
    created_by    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX ON folders (workspace_id);
CREATE INDEX ON bots (workspace_id);
CREATE INDEX ON bots (folder_id);

-- Auto-update updated_at on workspaces
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workspaces_updated_at
    BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER folders_updated_at
    BEFORE UPDATE ON folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bots_updated_at
    BEFORE UPDATE ON bots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

### Step 2 — Create a Storage bucket

In the Supabase dashboard go to **Storage → New bucket** and configure:

- **Name:** `workspace-assets` (or any name — set `SUPABASE_WORKSPACE_BUCKET_ID` to match)
- **Public bucket:** enabled (so logo URLs are publicly accessible without auth)

Or run this SQL:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('workspace-assets', 'workspace-assets', true);
```

Then add a storage policy to allow authenticated uploads:

```sql
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'workspace-assets');

CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'workspace-assets');
```

---

### Step 3 — Configure OAuth providers

In the Supabase dashboard go to **Authentication → Providers** and enable:

- **Google** — paste your Google OAuth Client ID and Secret
- **GitHub** — paste your GitHub OAuth App Client ID and Secret

Then go to **Authentication → URL Configuration** and add to **Redirect URLs**:

```
http://localhost:3000/api/v1/auth/callback/success
```

Replace with your production domain when deploying.

---

## Project Structure

```
app/
  (auth)/login/          # Login page
  (workspace)/           # Protected routes (server-side auth check in layout.tsx)
  (onboarding)/          # Onboarding wizard
  api/v1/                # All API route handlers
components/
  auth/                  # Session expiry dialog
  guards/                # RbacGuard — declarative permission-based rendering
  onboarding/            # 5-step onboarding wizard and its steps
  providers/             # AuthProvider, QueryProvider
hooks/
  use-auth.ts            # Auth mutations (magic link, Google, GitHub)
  use-bots.ts            # Bot and folder CRUD mutations + queries
  use-session.ts         # Session expiry countdown
  use-workspace.ts       # Workspace list query + create mutation
lib/
  dal.ts                 # Data access layer — session verification (server-only)
  supabase-server-client.ts  # SSR client (cookie-aware) + admin client factories
modules/
  auth/                  # Supabase auth operations (server-side)
  bot/                   # Supabase folder and bot CRUD operations (server-side)
  workspace/             # Supabase workspace/member/invitation operations (server-side)
services/
  auth.service.ts        # Client-side auth API calls
  bot.service.ts         # Client-side folder and bot API calls
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
