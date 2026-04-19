---
name: Block Config Panel Patterns
description: How to implement block config panel components — data model, hooks, variable pickers, field styling, and registry
type: project
---

## File locations

- Config components: `components/flow/block-config-panel/blocks/<block-type>.tsx`
- Preview components: `components/flow/nodes/block-item-previews/previews/<block-type>.tsx`
- Registry: `components/flow/block-config-panel/registry.tsx` — maps BlockType → ComponentType
- Types: `components/flow/block-config-panel/types.ts`
- Field renderer: `components/flow/block-config-panel/block-config-field.tsx`
- Variable hook: `components/flow/block-config-panel/hooks/use-variable-insertion.ts`
- Variable picker: `components/flow/block-config-panel/variable-picker-popover.tsx`

## BlockConfigProps interface

```ts
interface BlockConfigProps {
  block: Block;
  onChange: (patch: Partial<BlockContent>) => void;
}
```

`BlockContent` is `{ [key: string]: unknown }`. Read fields with `block.content.fieldKey as Type`.

## Standard input class (copy-paste for custom inputs)

```ts
const inputClass =
  'w-full bg-[#1c1d20] border border-[#2e2f33] rounded-lg text-[#e2e4e8] text-[13px] outline-none px-2.5 py-[7px] transition-colors focus:border-blue-500 placeholder:text-gray-600';
```

## Variable insertion into text inputs

```ts
const { inputRef, onInsert } = useVariableInsertion(value, 'fieldKey', onChange);
// attach inputRef to <input ref={inputRef as React.Ref<HTMLInputElement>} />
// pass onInsert to <VariablePickerPopover onSelect={onInsert} />
```

- Inserts `{{varName}}` at cursor position in the input
- Works for both `<input>` and `<textarea>`
- For inputs (not textareas) cast: `ref={inputRef as React.Ref<HTMLInputElement>}`

## Adding a label with variable picker

```tsx
<div className="flex items-center justify-between">
  <label className="text-xs font-medium text-gray-400">Field Label</label>
  <VariablePickerPopover onSelect={onInsert} />
</div>
```

## Toggle (on/off switch) pattern

```tsx
<div
  onClick={() => onChange({ fieldKey: !currentValue })}
  className={`w-9 h-5 rounded-[10px] relative cursor-pointer transition-colors shrink-0 ${
    currentValue ? 'bg-blue-500' : 'bg-[#2e2f33]'
  }`}
>
  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
    currentValue ? 'left-4.5' : 'left-0.5'
  }`} />
</div>
```

## Tab bar pattern (local state, no library)

```tsx
const [activeTab, setActiveTab] = useState<'a' | 'b'>('a');

<div className="flex gap-0.5 bg-[#16171a] rounded-lg p-0.5">
  {TABS.map(({ id, label }) => (
    <button key={id} type="button" onClick={() => setActiveTab(id)}
      className={`flex-1 text-[11px] font-medium py-1 rounded-md border-none cursor-pointer transition-all ${
        activeTab === id ? 'bg-[#2e2f33] text-[#e2e4e8]' : 'bg-transparent text-gray-500 hover:text-gray-300'
      }`}>
      {label}
    </button>
  ))}
</div>
```

## Divider between sections

```tsx
<div className="h-px bg-[#2e2f33]" />
```

## Lucide icons — dynamic rendering

```ts
import * as LucideIcons from 'lucide-react';

const Icon = (LucideIcons as Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>>)[iconName];
// <Icon size={16} color={color} strokeWidth={2} />
```

Get all icon names: `Object.keys(LucideIcons).filter(n => /^[A-Z]/.test(n) && typeof LucideIcons[n] === 'function')`

`DynamicIcon` component also exists at `components/ui/icons/dynamic-icon.tsx` for simple use cases.

## Image bubble content fields (reference)

| Field | Type | Purpose |
|---|---|---|
| `imageUrl` | `string` | URL from link/upload/unsplash/giphy |
| `iconName` | `string` | Lucide icon name (mutually exclusive with imageUrl) |
| `iconColor` | `string` | Hex color for the icon |
| `alt` | `string` | Alt text (supports variable tokens) |
| `redirectEnabled` | `boolean` | Whether clicking navigates somewhere |
| `redirectUrl` | `string` | Destination URL (supports variable tokens) |

## External image API env vars needed

- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` — Unsplash API (Client-ID header)
- `NEXT_PUBLIC_GIPHY_API_KEY` — Giphy search API

## Dark theme color palette

- Background: `#1c1d20` (primary), `#16171a` (deeper/inputs)
- Border: `#2e2f33`, hover: `#3e3f43`
- Text primary: `#e2e4e8`
- Text muted: `text-gray-400` (`#9ca3af`)
- Text placeholder: `text-gray-600`
- Accent: `bg-blue-500` (toggles, selections), `text-violet-400` (variable tokens)

## Preview component pattern

Preview (`block-item-previews/previews/`) shows a small 28×28px thumbnail + truncated label in the block list node. For image blocks, check `iconName` first, then `imageUrl`, then fall back to a placeholder SVG.
