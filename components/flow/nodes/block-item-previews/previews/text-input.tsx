import { Type } from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

export function TextInputItemPreview({ block }: BlockItemPreviewProps) {
  const placeholder = block.content.placeholder as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const inputMode = block.content.inputMode as string | undefined;

  const label = placeholder || buttonLabel || 'Text input';

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-left text-sm font-medium text-[#e2e4e8]">{label}</span>
        {inputMode && inputMode !== 'text' && (
          <span className="text-[10px] text-left text-gray-600 truncate">{inputMode}</span>
        )}
      </div>
    </div>
  );
}
