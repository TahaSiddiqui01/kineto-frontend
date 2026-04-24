---
name: Form implementation preferences
description: Always use React Hook Form + Zod + shadcn components for forms — never native HTML form elements
type: feedback
---

Always use React Hook Form + Zod + shadcn components for any form UI. Never use native `<input>`, `<button>`, or `<label>` elements standalone — import them from `@/components/ui/`.

**Why:** User explicitly stated: "use the react hook form and the shadcn components, don't use the native components, everything should come from the shadcn components."

**How to apply:**
- Schema validation: `zodResolver` from `@hookform/resolvers/zod` with a `z.object(...)` schema
- Imports: `useForm` from `react-hook-form`, `Label` from `@/components/ui/label`, `Input` from `@/components/ui/input`, `Button` from `@/components/ui/button`
- If a needed shadcn component doesn't exist yet, add it with `npx shadcn add <component>`
- Error display: render `errors.fieldName.message` in a `<p className="text-xs text-destructive">` below the field
