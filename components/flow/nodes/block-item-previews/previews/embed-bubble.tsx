import { Code2, FileText, Zap } from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

function getEmbedLabel(content: Record<string, unknown>): { label: string; isPdf: boolean } {
  const fileName = content.embedFileName as string | undefined;
  if (fileName) return { label: fileName, isPdf: true };

  const url = content.embedUrl as string | undefined;
  if (!url) return { label: '', isPdf: false };

  const isPdf = (() => {
    try {
      return new URL(url).pathname.toLowerCase().endsWith('.pdf');
    } catch {
      return false;
    }
  })();

  try {
    const parsed = new URL(url);
    return { label: parsed.hostname || url, isPdf };
  } catch {
    return { label: url, isPdf };
  }
}

export function EmbedBubbleItemPreview({ block }: BlockItemPreviewProps) {
  const { label, isPdf } = getEmbedLabel(block.content);
  const waitForEvent = block.content.waitForEvent as boolean | undefined;
  const eventName = block.content.eventName as string | undefined;
  const saveResultTo = block.content.saveResultTo as string | undefined;

  const Icon = isPdf ? FileText : Code2;
  const iconColor = isPdf ? 'text-red-400' : 'text-blue-400';

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">
          {label || (isPdf ? 'PDF' : 'Embed')}
        </span>
        {waitForEvent && (
          <span className="flex items-center gap-1 text-[10px] text-amber-400 truncate">
            <Zap size={9} className="shrink-0" />
            {eventName
              ? `waiting for "${eventName}"${saveResultTo ? ` → {{${saveResultTo}}}` : ''}`
              : 'waiting for event'}
          </span>
        )}
      </div>
    </div>
  );
}
