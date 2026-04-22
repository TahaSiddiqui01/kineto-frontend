import type { Block } from '@/types/flow';

export type Platform = 'website' | 'whatsapp' | 'instagram';
export type PlatformSupport = 'full' | 'partial' | 'none';

export interface ChatBlockProps {
  block: Block;
  variables: Record<string, string>;
  platform: Platform;
  /** Only present for input blocks — call when user submits */
  onAnswer?: (value: string) => void;
}

export type ChatBlockCategory = 'bubble' | 'input' | 'logic';
