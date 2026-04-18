import { AudioLines } from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

export function AudioBubbleItemPreview({ block }: BlockItemPreviewProps) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="w-7 h-7 rounded bg-[#2e2f33] flex items-center justify-center shrink-0">
        <AudioLines size={13} className="text-green-400" />
      </div>
      <span className="truncate text-sm font-medium text-[#e2e4e8]">
        {block.content.audioUrl as string}
      </span>
    </div>
  );
}
