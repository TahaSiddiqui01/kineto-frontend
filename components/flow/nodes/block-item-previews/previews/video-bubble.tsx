import { PlayCircle } from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

function getVideoLabel(content: Record<string, unknown>): string {
  const url = content.videoUrl as string | undefined;
  const fileName = content.videoFileName as string | undefined;
  if (fileName) return fileName;
  if (!url) return '';
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/');
    const name = parts[parts.length - 1];
    return name || parsed.hostname;
  } catch {
    return url;
  }
}

export function VideoBubbleItemPreview({ block }: BlockItemPreviewProps) {
  const label = getVideoLabel(block.content);
  const showControls = block.content.showControls as boolean | undefined;
  const autoPlay = block.content.autoPlay as boolean | undefined;

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {(showControls !== undefined || autoPlay !== undefined) && (
          <span className="text-[10px] text-gray-600 truncate">
            {[showControls && 'controls', autoPlay && 'autoplay'].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>
    </div>
  );
}
