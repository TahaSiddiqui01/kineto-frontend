import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

export function EmbedBubbleChat({ block, variables }: ChatBlockProps) {
  const url = interpolate(block.content.embedUrl as string ?? '', variables);
  if (!url) return <p className="text-xs text-muted-foreground italic">No embed URL set</p>;
  return (
    <iframe
      src={url}
      className="w-full rounded-lg border-0"
      style={{ height: 200 }}
      title="Embed"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
