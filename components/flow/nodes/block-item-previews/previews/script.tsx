import type { BlockItemPreviewProps } from '../types';

export function ScriptItemPreview({ block }: BlockItemPreviewProps) {
  const code = block.content.code as string | undefined;
  const executeOnClient = block.content.executeOnClient as boolean | undefined;

  const preview = code ? code.split('\n')[0]?.trim().slice(0, 40) : undefined;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">{preview || 'Script'}</span>
      {executeOnClient && <span className="text-[10px] text-gray-600 truncate">Client-side</span>}
    </div>
  );
}
