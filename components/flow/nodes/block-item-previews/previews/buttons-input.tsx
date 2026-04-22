import type { BlockItemPreviewProps } from '../types';

interface ButtonItem { id: string; text: string; internalValue?: string }

export function ButtonsInputItemPreview({ block }: BlockItemPreviewProps) {
  const buttons = (block.content.buttons as ButtonItem[] | undefined) ?? [];
  const multiChoice = block.content.multiChoice as boolean | undefined;
  const saveLabelTo = block.content.saveLabelTo as string | undefined;
  const saveInternalValueTo = block.content.saveInternalValueTo as string | undefined;

  const filled = buttons.filter((b) => b.text.trim());
  const label = filled.length > 0 ? filled.map((b) => b.text).join(', ') : 'Buttons input';

  const saves = [saveLabelTo, saveInternalValueTo]
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
