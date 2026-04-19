import { AudioLines } from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

function getAudioLabel(content: Record<string, unknown>): string {
  const fileName = content.audioFileName as string | undefined;
  if (fileName) return fileName;
  const url = content.audioUrl as string | undefined;
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

export function AudioBubbleItemPreview({ block }: BlockItemPreviewProps) {
  const label = getAudioLabel(block.content);
  const autoPlay = block.content.autoPlay as boolean | undefined;

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="w-7 h-7 rounded bg-[#2e2f33] flex items-center justify-center shrink-0">
        <AudioLines size={13} className="text-green-400" />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {autoPlay && (
          <span className="text-[10px] text-gray-600">autoplay</span>
        )}
      </div>
    </div>
  );
}
