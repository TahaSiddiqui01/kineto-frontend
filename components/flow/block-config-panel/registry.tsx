import type { ComponentType } from 'react';
import type { BlockType } from '@/types/flow';
import type { BlockConfigProps } from './types';
import { TextBubbleConfig } from './blocks/text-bubble';

export const BLOCK_CONFIG_REGISTRY: Partial<Record<BlockType, ComponentType<BlockConfigProps>>> = {
  'text-bubble': TextBubbleConfig,
};

export const DEFAULT_BLOCK_CONFIG = TextBubbleConfig;
