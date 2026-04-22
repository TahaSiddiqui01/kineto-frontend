import type { BlockItemPreviewProps } from '../types';

interface PicChoiceItem { id: string; title?: string }

export function PicChoiceInputItemPreview({ block }: BlockItemPreviewProps) {
  const items = (block.content.items as PicChoiceItem[] | undefined) ?? [];
  const multiChoice = block.content.multiChoice as boolean | undefined;
  const saveTitleTo = block.content.saveTitleTo as string | undefined;
  const saveInternalValueTo = block.content.saveInternalValueTo as string | undefined;
  const saveImageLinkTo = block.content.saveImageLinkTo as string | undefined;

  const filledTitles = items.map((i) => i.title).filter(Boolean) as string[];
  const label = filledTitles.length > 0
    ? filledTitles.join(', ')
    : `${items.length || 0} choice${items.length !== 1 ? 's' : ''}`;

  const saves = [saveTitleTo, saveInternalValueTo, saveImageLinkTo]
    .filter(Boolean)
    .map((v) => `{{${v}}}`)
    .join(', ');

  const tags = [multiChoice ? 'Multi choice' : null, saves || null]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {tags && <span className="text-[10px] text-gray-600 truncate">{tags}</span>}
      </div>
    </div>
  );
}
