import * as LucideIcons from 'lucide-react';
import type { BlockItemPreviewProps } from '../types';

function IconThumb({ name, color }: { name: string; color: string }) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>>)[name];
  return (
    <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 border border-[#2e2f33] bg-[#1c1d20]">
      {Icon ? <Icon size={14} color={color} strokeWidth={2} /> : null}
    </div>
  );
}

export function ImageBubbleItemPreview({ block }: BlockItemPreviewProps) {
  const imageUrl = block.content.imageUrl as string | undefined;
  const alt = block.content.alt as string | undefined;
  const iconName = block.content.iconName as string | undefined;
  const iconColor = (block.content.iconColor as string | undefined) ?? '#e2e4e8';

  const label = alt || (iconName ? iconName.replace(/([A-Z])/g, ' $1').trim() : 'Image');

  return (
    <div className="flex items-center gap-2 flex-1 min-w-0">
      {iconName ? (
        <IconThumb name={iconName} color={iconColor} />
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={alt ?? ''}
          className="w-7 h-7 rounded object-cover shrink-0 border border-[#2e2f33]"
        />
      ) : (
        <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 border border-[#2e2f33] bg-[#1c1d20]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}
      <span className="truncate text-sm font-medium text-[#e2e4e8]">{label}</span>
    </div>
  );
}
