import type { BlockItemPreviewProps } from '../types';
import { DynamicIcon } from '@/components/ui/icons/dynamic-icon';

function isVideoUrl(url: string) {
  return url.toLowerCase().includes('.mp4');
}

function MediaPreview({ src, className, alt }: { src: string; className: string; alt?: string }) {
  return <img src={src.replace(".mp4", ".gif")} alt={alt ?? ""} className={className} />;
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
        <DynamicIcon name={iconName} color={iconColor} />
      ) : imageUrl ? (
        <MediaPreview
          src={imageUrl}
          alt={label}
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
