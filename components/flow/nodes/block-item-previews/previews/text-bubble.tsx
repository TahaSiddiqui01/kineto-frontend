import type { BlockItemPreviewProps } from '../types';

export function TextBubbleItemPreview({ block }: BlockItemPreviewProps) {
  return (
    <span className="flex-1 truncate text-sm font-medium text-[#e2e4e8]">
      {block.content.text as string}
    </span>
  );
}
