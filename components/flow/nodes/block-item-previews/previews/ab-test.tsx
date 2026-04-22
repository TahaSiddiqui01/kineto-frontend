import type { BlockItemPreviewProps } from '../types';

export function AbTestItemPreview({ block }: BlockItemPreviewProps) {
  const aPercent = (block.content.aPercent as number | undefined) ?? 50;
  const bPercent = 100 - aPercent;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">AB Test</span>
      <span className="text-[10px] text-gray-600 truncate">A: {aPercent}% · B: {bPercent}%</span>
    </div>
  );
}
