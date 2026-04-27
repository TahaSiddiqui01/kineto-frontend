import { FileText } from 'lucide-react';
import { extractFileNameFromUrl } from '@/helpers';
import type { BlockItemPreviewProps } from '../types';

function getLabel(content: Record<string, unknown>): string {
  const fileName = content.documentFileName as string | undefined;
  if (fileName) return fileName;
  const url = content.documentUrl as string | undefined;
  if (!url) return 'Document';
  return extractFileNameFromUrl(url) ?? 'Document';
}

export function DocumentBubbleItemPreview({ block }: BlockItemPreviewProps) {
  const label = getLabel(block.content);
  const caption = block.content.caption as string | undefined;

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {caption && (
          <span className="truncate text-[10px] text-gray-500">{caption}</span>
        )}
      </div>
    </div>
  );
}
