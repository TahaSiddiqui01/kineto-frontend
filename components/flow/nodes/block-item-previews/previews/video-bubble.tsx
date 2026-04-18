import { PlayCircle } from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

export function VideoBubbleItemPreview({ block }: BlockItemPreviewProps) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="w-7 h-7 rounded bg-[#2e2f33] flex items-center justify-center shrink-0">
        <PlayCircle size={13} className="text-blue-400" />
      </div>
      <span className="truncate text-sm font-medium text-[#e2e4e8]">
        {block.content.videoUrl as string}
      </span>
    </div>
  );
}
