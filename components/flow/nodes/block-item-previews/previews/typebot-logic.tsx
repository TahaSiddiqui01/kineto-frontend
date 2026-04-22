import type { BlockItemPreviewProps } from '../types';

export function TypebotLogicItemPreview({ block }: BlockItemPreviewProps) {
  const typebotId = block.content.typebotId as string | undefined;
  const mergeAnswers = block.content.mergeAnswers as boolean | undefined;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">Link bot</span>
      {(typebotId || mergeAnswers) && (
        <span className="text-[10px] text-gray-600 truncate">
          {[typebotId ? 'Bot linked' : null, mergeAnswers ? 'Merge answers' : null].filter(Boolean).join(' · ')}
        </span>
      )}
    </div>
  );
}
