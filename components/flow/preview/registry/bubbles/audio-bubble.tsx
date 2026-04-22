import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

export function AudioBubbleChat({ block, variables }: ChatBlockProps) {
  const url = interpolate(block.content.audioUrl as string ?? '', variables);
  if (!url) return <p className="text-xs text-muted-foreground italic">No audio URL set</p>;
  return <audio controls className="w-full max-w-xs" src={url} />;
}
