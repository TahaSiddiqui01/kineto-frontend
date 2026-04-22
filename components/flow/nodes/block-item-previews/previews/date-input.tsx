import type { BlockItemPreviewProps } from '../types';

export function DateInputItemPreview({ block }: BlockItemPreviewProps) {
  const isRange = block.content.isRange as boolean | undefined;
  const withTime = block.content.withTime as boolean | undefined;
  const format = block.content.format as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  const label = format || (isRange ? 'Date range' : 'Date input');

  const tags: string[] = [];
  if (isRange) tags.push('Range');
  if (withTime) tags.push('With time');
  if (saveAnswerTo) tags.push(`{{${saveAnswerTo}}}`);

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {tags.length > 0 && (
          <span className="text-[10px] text-gray-600 truncate">{tags.join(' · ')}</span>
        )}
      </div>
    </div>
  );
}
