import { Hash } from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

export function NumberInputItemPreview({ block }: BlockItemPreviewProps) {
  const placeholder = block.content.placeholder as string | undefined;
  const buttonLabel = block.content.buttonLabel as string | undefined;
  const format = block.content.format as string | undefined;
  const currency = block.content.currency as string | undefined;
  const unit = block.content.unit as string | undefined;

  const label = placeholder || buttonLabel || 'Number input';

  const formatLabel = (() => {
    if (!format || format === 'decimal') return null;
    if (format === 'currency') return currency ? `Currency · ${currency}` : 'Currency';
    if (format === 'percent') return 'Percentage';
    if (format === 'unit') return unit ? `Unit · ${unit}` : 'Unit';
    return null;
  })();

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <div className="flex flex-col min-w-0 flex-1">
        <span className="truncate text-sm font-medium text-left text-[#e2e4e8]">{label}</span>
        {formatLabel && (
          <span className="text-[10px] text-left text-gray-600 truncate">{formatLabel}</span>
        )}
      </div>
    </div>
  );
}
