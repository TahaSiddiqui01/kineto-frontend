import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

export function VideoBubbleChat({ block, variables, platform }: ChatBlockProps) {
  const url = interpolate(block.content.videoUrl as string ?? '', variables);
  if (!url) return <p className="text-xs text-muted-foreground italic">No video URL set</p>;
  if (platform === 'whatsapp') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 underline break-all">
        {url}
      </a>
    );
  }
  return (
    <video controls className="max-w-full rounded-lg max-h-48" src={url}>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 underline">Open video</a>
    </video>
  );
}
