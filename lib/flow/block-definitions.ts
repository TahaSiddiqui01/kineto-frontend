import type { BlockDefinition, BlockType, BlockCategory } from '@/types/flow';

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  // ── Bubbles ──────────────────────────────────────────────────────────────────
  { type: 'text-bubble',  label: 'Text',    category: 'bubbles', iconName: 'MessageSquare', color: '#e2e8f0' },
  { type: 'image-bubble', label: 'Image',   category: 'bubbles', iconName: 'Image',         color: '#e2e8f0' },
  { type: 'video-bubble', label: 'Video',   category: 'bubbles', iconName: 'Video',         color: '#e2e8f0' },
  { type: 'embed-bubble', label: 'Embed',   category: 'bubbles', iconName: 'Code2',         color: '#e2e8f0' },
  { type: 'audio-bubble', label: 'Audio',   category: 'bubbles', iconName: 'Headphones',    color: '#e2e8f0' },

  // ── Inputs ───────────────────────────────────────────────────────────────────
  { type: 'text-input',       label: 'Text',       category: 'inputs', iconName: 'Type',       color: '#f97316' },
  { type: 'number-input',     label: 'Number',     category: 'inputs', iconName: 'Hash',        color: '#ef4444' },
  { type: 'email-input',      label: 'Email',      category: 'inputs', iconName: 'Mail',        color: '#ef4444' },
  { type: 'website-input',    label: 'Website',    category: 'inputs', iconName: 'Link',        color: '#f97316' },
  { type: 'date-input',       label: 'Date',       category: 'inputs', iconName: 'Calendar',   color: '#ef4444' },
  { type: 'time-input',       label: 'Time',       category: 'inputs', iconName: 'Clock',      color: '#ef4444' },
  { type: 'phone-input',      label: 'Phone',      category: 'inputs', iconName: 'Phone',      color: '#ef4444' },
  { type: 'buttons-input',    label: 'Buttons',    category: 'inputs', iconName: 'LayoutGrid', color: '#ef4444' },
  { type: 'pic-choice-input', label: 'Pic choice', category: 'inputs', iconName: 'Grid2x2',   color: '#ef4444' },
  { type: 'payment-input',    label: 'Payment',    category: 'inputs', iconName: 'CreditCard', color: '#ef4444' },
  { type: 'rating-input',     label: 'Rating',     category: 'inputs', iconName: 'Star',       color: '#f97316' },
  { type: 'file-input',       label: 'File',       category: 'inputs', iconName: 'Upload',     color: '#ef4444', isPro: true },
  { type: 'cards-input',      label: 'Cards',      category: 'inputs', iconName: 'LayoutList', color: '#f97316' },

  // ── Logic ────────────────────────────────────────────────────────────────────
  { type: 'set-variable',  label: 'Set variable', category: 'logic', iconName: 'PenLine',      color: '#a855f7' },
  { type: 'condition',     label: 'Condition',    category: 'logic', iconName: 'GitBranch',    color: '#8b5cf6' },
  { type: 'redirect',      label: 'Redirect',     category: 'logic', iconName: 'CornerUpRight',color: '#8b5cf6' },
  { type: 'script',        label: 'Script',       category: 'logic', iconName: 'Code',         color: '#8b5cf6' },
  { type: 'typebot-logic', label: 'Typebot',      category: 'logic', iconName: 'Bot',          color: '#8b5cf6' },
  { type: 'wait',          label: 'Wait',         category: 'logic', iconName: 'Timer',        color: '#8b5cf6' },
  { type: 'ab-test',       label: 'AB Test',      category: 'logic', iconName: 'Shuffle',      color: '#8b5cf6' },
  { type: 'webhook',       label: 'Webhook',      category: 'logic', iconName: 'Globe',        color: '#8b5cf6' },
  { type: 'jump',          label: 'Jump',         category: 'logic', iconName: 'ArrowRightLeft',color: '#8b5cf6' },
  { type: 'return',        label: 'Return',       category: 'logic', iconName: 'RotateCcw',    color: '#8b5cf6' },

  // ── Events ───────────────────────────────────────────────────────────────────
  { type: 'start-event',   label: 'Start',   category: 'events', iconName: 'Flag',        color: '#64748b' },
  { type: 'command-event', label: 'Command', category: 'events', iconName: 'Command',     color: '#64748b' },
  { type: 'reply-event',   label: 'Reply',   category: 'events', iconName: 'CornerDownLeft', color: '#64748b' },
  { type: 'invalid-event', label: 'Invalid', category: 'events', iconName: 'X',           color: '#64748b' },

  // ── Integrations ─────────────────────────────────────────────────────────────
  { type: 'sheets',            label: 'Sheets',       category: 'integrations', iconName: 'Table2',      color: '#22c55e' },
  { type: 'analytics',         label: 'Analytics',    category: 'integrations', iconName: 'BarChart2',   color: '#f59e0b' },
  { type: 'http-request',      label: 'HTTP request', category: 'integrations', iconName: 'Zap',         color: '#64748b' },
  { type: 'email-integration', label: 'Email',        category: 'integrations', iconName: 'Send',        color: '#64748b' },
  { type: 'zapier',            label: 'Zapier',       category: 'integrations', iconName: 'Zap',         color: '#f97316' },
  { type: 'make-com',          label: 'Make.com',     category: 'integrations', iconName: 'RefreshCw',   color: '#a855f7' },
  { type: 'pabbly',            label: 'Pabbly',       category: 'integrations', iconName: 'GitMerge',    color: '#3b82f6' },
  { type: 'chatwoot',          label: 'Chatwoot',     category: 'integrations', iconName: 'MessageCircle', color: '#6366f1' },
  { type: 'pixel',             label: 'Pixel',        category: 'integrations', iconName: 'Aperture',    color: '#3b82f6' },
  { type: 'openai',            label: 'OpenAI',       category: 'integrations', iconName: 'Sparkles',    color: '#10b981' },
  { type: 'cal-com',           label: 'Cal.com',      category: 'integrations', iconName: 'CalendarDays',  color: '#64748b' },
  { type: 'chatnode',          label: 'ChatNode',     category: 'integrations', iconName: 'MessageSquare', color: '#8b5cf6' },
  { type: 'qr-code',           label: 'QR code',      category: 'integrations', iconName: 'QrCode',      color: '#64748b' },
  { type: 'dify-ai',           label: 'Dify.AI',      category: 'integrations', iconName: 'Cpu',         color: '#3b82f6' },
  { type: 'mistral',           label: 'Mistral',      category: 'integrations', iconName: 'Wind',        color: '#f59e0b' },
  { type: 'eleven-labs',       label: 'ElevenLabs',   category: 'integrations', iconName: 'Volume2',     color: '#64748b' },
  { type: 'anthropic',         label: 'Anthropic',    category: 'integrations', iconName: 'Shield',      color: '#e2e8f0' },
  { type: 'together',          label: 'Together',     category: 'integrations', iconName: 'Users',       color: '#64748b' },
  { type: 'openrouter',        label: 'OpenRouter',   category: 'integrations', iconName: 'Network',     color: '#64748b' },
  { type: 'nocodb',            label: 'NocoDB',       category: 'integrations', iconName: 'Database',    color: '#3b82f6' },
  { type: 'segment',           label: 'Segment',      category: 'integrations', iconName: 'PieChart',    color: '#10b981' },
  { type: 'groq',              label: 'Groq',         category: 'integrations', iconName: 'Zap',         color: '#f59e0b' },
  { type: 'zendesk',           label: 'Zendesk',      category: 'integrations', iconName: 'Headphones',  color: '#10b981' },
  { type: 'posthog',           label: 'Posthog',      category: 'integrations', iconName: 'TrendingUp',  color: '#f97316' },
  { type: 'perplexity',        label: 'Perplexity',   category: 'integrations', iconName: 'Search',      color: '#3b82f6' },
  { type: 'deepseek',          label: 'DeepSeek',     category: 'integrations', iconName: 'Anchor',      color: '#3b82f6' },
  { type: 'blink',             label: 'Blink',        category: 'integrations', iconName: 'Link2',       color: '#64748b' },
  { type: 'gmail',             label: 'Gmail',        category: 'integrations', iconName: 'Mail',        color: '#ef4444', isBeta: true },
];

export const BLOCK_DEFINITIONS_MAP = new Map<BlockType, BlockDefinition>(
  BLOCK_DEFINITIONS.map((def) => [def.type, def])
);

export const BLOCK_DEFINITIONS_BY_CATEGORY = BLOCK_DEFINITIONS.reduce<
  Record<BlockCategory, BlockDefinition[]>
>(
  (acc, def) => {
    acc[def.category].push(def);
    return acc;
  },
  { bubbles: [], inputs: [], logic: [], events: [], integrations: [] }
);
