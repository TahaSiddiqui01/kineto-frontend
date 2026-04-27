import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

export function AudioBubbleChat({ block, variables }: ChatBlockProps) {
  const url = interpolate((block.content.audioUrl as string) ?? '', variables);
  const autoPlay = block.content.autoPlay as boolean | undefined;

  if (!url) return <p className="text-xs text-muted-foreground italic">No audio URL set</p>;

  return (
    <div className="w-64">
      <audio
        controls
        src={url}
        autoPlay={autoPlay}
        className="w-full rounded-lg"
        style={{ display: 'block' }}
      />
    </div>
  );
}
