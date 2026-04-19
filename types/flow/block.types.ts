export type BlockCategory = 'bubbles' | 'inputs' | 'logic' | 'events' | 'integrations';

export type BubbleBlockType =
  | 'text-bubble'
  | 'image-bubble'
  | 'video-bubble'
  | 'embed-bubble'
  | 'audio-bubble';

export type InputBlockType =
  | 'text-input'
  | 'number-input'
  | 'email-input'
  | 'website-input'
  | 'date-input'
  | 'time-input'
  | 'phone-input'
  | 'buttons-input'
  | 'pic-choice-input'
  | 'payment-input'
  | 'rating-input'
  | 'file-input'
  | 'cards-input';

export type LogicBlockType =
  | 'set-variable'
  | 'condition'
  | 'redirect'
  | 'script'
  | 'typebot-logic'
  | 'wait'
  | 'ab-test'
  | 'webhook'
  | 'jump'
  | 'return';

export type EventBlockType =
  | 'start-event'
  | 'command-event'
  | 'reply-event'
  | 'invalid-event';

export type IntegrationBlockType =
  | 'sheets'
  | 'analytics'
  | 'http-request'
  | 'email-integration'
  | 'zapier'
  | 'make-com'
  | 'pabbly'
  | 'chatwoot'
  | 'pixel'
  | 'openai'
  | 'cal-com'
  | 'chatnode'
  | 'qr-code'
  | 'dify-ai'
  | 'mistral'
  | 'eleven-labs'
  | 'anthropic'
  | 'together'
  | 'openrouter'
  | 'nocodb'
  | 'segment'
  | 'groq'
  | 'zendesk'
  | 'posthog'
  | 'perplexity'
  | 'deepseek'
  | 'blink'
  | 'gmail';

export type BlockType =
  | BubbleBlockType
  | InputBlockType
  | LogicBlockType
  | EventBlockType
  | IntegrationBlockType;

export interface BlockDefinition {
  type: BlockType;
  label: string;
  category: BlockCategory;
  iconName: string;
  color: string;
  isPro?: boolean;
  isBeta?: boolean;
  isDisabled?: boolean;
}

export interface BlockContent {
  [key: string]: unknown;
}

export interface ConditionBranch {
  id: string;
  label: string;
  condition?: string;
}

export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
}

// ── Block config field schema ────────────────────────────────────────────────

export type BlockFieldType = string | 'text' | 'textarea' | 'select' | 'toggle' | 'variable-picker';

export interface BlockFieldOption {
  value: string;
  label: string;
}

export interface ActiveDragBlock {
  type: BlockType;
  iconName: string;
  color: string;
  label: string;
}
export interface BlockFieldSchema {
  key: string;
  label: string;
  type: BlockFieldType;
  placeholder?: string;
  options?: BlockFieldOption[];
  defaultValue?: string | boolean;
  hint?: string;
}

export interface BlockConfigSchema {
  blockType: BlockType;
  title: string;
  fields: BlockFieldSchema[];
}
