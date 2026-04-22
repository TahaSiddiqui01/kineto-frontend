import type { BlockItemPreviewProps } from '../types';

interface CardItem { id: string; title?: string }

export function CardsInputItemPreview({ block }: BlockItemPreviewProps) {
  const cards = (block.content.cards as CardItem[] | undefined) ?? [];
  const saveField = block.content.saveField as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  const filledTitles = cards.map((c) => c.title).filter(Boolean) as string[];
  const label = filledTitles.length > 0
    ? filledTitles.join(', ')
    : `${cards.length || 0} card${cards.length !== 1 ? 's' : ''}`;

  const tags = [
    saveField ? `Save: ${saveField}` : null,
    saveAnswerTo ? `{{${saveAnswerTo}}}` : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {tags && <span className="text-[10px] text-gray-600 truncate">{tags}</span>}
      </div>
    </div>
  );
}
