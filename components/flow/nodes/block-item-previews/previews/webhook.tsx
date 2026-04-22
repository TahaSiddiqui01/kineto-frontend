import type { BlockItemPreviewProps } from '../types';

export function WebhookItemPreview({ block }: BlockItemPreviewProps) {
  const saveResultTo = block.content.saveResultTo as string | undefined;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">Webhook</span>
      {saveResultTo && <span className="text-[10px] text-gray-600 truncate">{`→ {{${saveResultTo}}}`}</span>}
    </div>
  );
}
