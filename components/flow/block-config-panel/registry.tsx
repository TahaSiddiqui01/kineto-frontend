import type { ComponentType } from 'react';
import type { BlockType } from '@/types/flow';
import type { BlockConfigProps } from './types';
import { TextBubbleConfig } from './blocks/text-bubble';
import { ImageBubbleConfig } from './blocks/image-bubble';
import { VideoBubbleConfig } from './blocks/video-bubble';
import { AudioBubbleConfig } from './blocks/audio-bubble';

export const BLOCK_CONFIG_REGISTRY: Partial<Record<BlockType, ComponentType<BlockConfigProps>>> = {
  // bubbles
  'text-bubble': TextBubbleConfig,
  'image-bubble': ImageBubbleConfig,
  'video-bubble': VideoBubbleConfig,
  'audio-bubble': AudioBubbleConfig,
};

export const DEFAULT_BLOCK_CONFIG = TextBubbleConfig;
