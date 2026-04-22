import type { BlockItemPreviewProps } from '../types';

export function CommandEventItemPreview({ block }: BlockItemPreviewProps) {
  const command = block.content.command as string | undefined;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">{command || 'Command'}</span>
    </div>
  );
}
