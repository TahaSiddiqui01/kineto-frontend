import { Mic } from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

export function AudioInputItemPreview({ block }: BlockItemPreviewProps) {
  const audioUrl = block.content.audioUrl as string | undefined;
  const audioFileName = block.content.audioFileName as string | undefined;
  const access = block.content.access as string | undefined;

  const label = audioFileName || (audioUrl ? 'Recording' : 'Audio input');

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {access && (
          <span className="text-[10px] text-left text-gray-600 truncate">{access}</span>
        )}
      </div>
    </div>
  );
}
