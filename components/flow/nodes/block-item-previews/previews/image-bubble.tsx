import type { BlockItemPreviewProps } from '../types';

export function ImageBubbleItemPreview({ block }: BlockItemPreviewProps) {
  const imageUrl = block.content.imageUrl as string;
  const alt = block.content.alt as string | undefined;
  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <img
        src={imageUrl}
        alt={alt ?? ''}
        className="w-7 h-7 rounded object-cover shrink-0 border border-[#2e2f33]"
      />
      <span className="truncate text-sm font-medium text-[#e2e4e8]">
        {alt || 'Image'}
      </span>
    </div>
  );
}
