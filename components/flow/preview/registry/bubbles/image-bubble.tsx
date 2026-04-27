import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

export function ImageBubbleChat({ block, variables }: ChatBlockProps) {
  const url = interpolate(block.content.imageUrl as string ?? '', variables);
  if (!url) return <p className="text-xs text-muted-foreground italic">No image URL set</p>;
    return <img src={url.replace(".mp4", ".gif")} alt="Bot image" className="max-w-full rounded-lg max-h-64 object-cover" />;
}
