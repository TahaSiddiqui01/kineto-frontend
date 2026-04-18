import type { ComponentType } from 'react';
import type { BlockType, Block } from '@/types/flow';
import type { BlockItemPreviewProps } from './types';
import { TextBubbleItemPreview } from './previews/text-bubble';
import { ImageBubbleItemPreview } from './previews/image-bubble';
import { VideoBubbleItemPreview } from './previews/video-bubble';
import { AudioBubbleItemPreview } from './previews/audio-bubble';

export interface BlockItemPreviewEntry {
  component: ComponentType<BlockItemPreviewProps>;
  hasContent: (block: Block) => boolean;
}

export const BLOCK_ITEM_PREVIEW_REGISTRY: Partial<Record<BlockType, BlockItemPreviewEntry>> = {
  'text-bubble': {
    component: TextBubbleItemPreview,
    hasContent: (b) => !!b.content.text,
  },
  'image-bubble': {
    component: ImageBubbleItemPreview,
    hasContent: (b) => !!b.content.imageUrl,
  },
  'video-bubble': {
    component: VideoBubbleItemPreview,
    hasContent: (b) => !!b.content.videoUrl,
  },
  'audio-bubble': {
    component: AudioBubbleItemPreview,
    hasContent: (b) => !!b.content.audioUrl,
  },
};
