import { FileText, Download } from 'lucide-react';
import { extractFileNameFromUrl } from '@/helpers';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

function getExtension(fileName: string): string {
  return fileName.split('.').pop()?.toUpperCase() ?? 'FILE';
}

export function DocumentBubbleChat({ block, variables }: ChatBlockProps) {
  const rawUrl = (block.content.documentUrl as string | undefined) ?? '';
  const url = interpolate(rawUrl, variables);
  const storedName = block.content.documentFileName as string | undefined;
  const fileName = storedName || extractFileNameFromUrl(url) || 'document';
  const caption = block.content.caption as string | undefined;

  if (!url) {
    return <p className="text-xs text-muted-foreground italic">No document URL set</p>;
  }

  const ext = getExtension(fileName);

  return (
    <div className="flex flex-col gap-1.5 max-w-xs">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-3 py-2.5 transition-colors hover:bg-muted/70 no-underline"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
          <FileText size={18} className="text-blue-400" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="truncate text-[13px] font-medium text-foreground">{fileName}</span>
          <span className="text-[10px] text-muted-foreground">{ext}</span>
        </div>
        <Download size={14} className="shrink-0 text-muted-foreground" />
      </a>
      {caption && (
        <p className="text-[12px] text-muted-foreground px-1">{caption}</p>
      )}
    </div>
  );
}
