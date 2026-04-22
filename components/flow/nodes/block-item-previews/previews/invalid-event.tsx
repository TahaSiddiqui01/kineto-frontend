import type { BlockItemPreviewProps } from '../types';

export function InvalidEventItemPreview(_props: BlockItemPreviewProps) {
  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">Invalid input</span>
      <span className="text-[10px] text-gray-600 truncate">Fallback handler</span>
    </div>
  );
}
