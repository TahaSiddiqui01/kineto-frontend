import type { BlockItemPreviewProps } from '../types';

interface KeywordItem { id: string; value: string; }

export function ReplyEventItemPreview({ block }: BlockItemPreviewProps) {
  const keywords = (block.content.keywords as KeywordItem[] | undefined) ?? [];
  const saveReplyTo = block.content.saveReplyTo as string | undefined;

  const filled = keywords.filter((k) => k.value.trim());
  const label = filled.length > 0 ? filled.map((k) => k.value).join(', ') : 'Reply';

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
      {saveReplyTo && <span className="text-[10px] text-gray-600 truncate">{`→ {{${saveReplyTo}}}`}</span>}
    </div>
  );
}
