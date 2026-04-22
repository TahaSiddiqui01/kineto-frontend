import type { BlockItemPreviewProps } from '../types';

export function WaitItemPreview({ block }: BlockItemPreviewProps) {
  const seconds = block.content.seconds as string | undefined;
  const pauseFlow = block.content.pauseFlow as boolean | undefined;

  const label = seconds ? `Wait ${seconds}s` : 'Wait';
  const sub = pauseFlow ? 'Pause flow' : null;

  return (
    <div className="flex flex-col min-w-0 flex-1">
      <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
      {sub && <span className="text-[10px] text-gray-600 truncate">{sub}</span>}
    </div>
  );
}
