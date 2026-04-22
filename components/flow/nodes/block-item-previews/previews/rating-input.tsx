import type { BlockItemPreviewProps } from '../types';

export function RatingInputItemPreview({ block }: BlockItemPreviewProps) {
  const min = (block.content.min as string | undefined) ?? '1';
  const max = (block.content.max as string | undefined) ?? '5';
  const ratingType = (block.content.ratingType as string | undefined) ?? 'numeric';
  const iconName = block.content.iconName as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  const label = `${min} – ${max}`;

  const subtitle = [
    ratingType === 'icon' ? (iconName ?? 'Star') : 'Numeric',
    saveAnswerTo ? `{{${saveAnswerTo}}}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        <span className="text-[10px] text-gray-600 truncate">{subtitle}</span>
      </div>
    </div>
  );
}
