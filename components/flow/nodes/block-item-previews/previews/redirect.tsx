import type { BlockItemPreviewProps } from '../types';

export function RedirectItemPreview({ block }: BlockItemPreviewProps) {
  const url = block.content.url as string | undefined;
  const newTab = block.content.newTab as boolean | undefined;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">{url || 'Redirect'}</span>
      {newTab && <span className="text-[10px] text-gray-600 truncate">New tab</span>}
    </div>
  );
}
