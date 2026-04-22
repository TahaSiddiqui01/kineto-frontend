import type { BlockItemPreviewProps } from '../types';

export function EmailInputItemPreview({ block }: BlockItemPreviewProps) {
  const placeholder = block.content.placeholder as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const saveAnswerTo = block.content.saveAnswerTo as string | undefined;

  const label = placeholder || buttonLabel || 'Email input';

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
        {saveAnswerTo && (
          <span className="text-[10px] text-gray-600 truncate font-mono">
            {`{{${saveAnswerTo}}}`}
          </span>
        )}
      </div>
    </div>
  );
}
