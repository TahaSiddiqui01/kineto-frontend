'use client';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

interface PicItem { id: string; title?: string; imageUrl?: string; }

export function PicChoiceInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const items = (block.content.items as PicItem[] | undefined) ?? [];
  if (items.length === 0) return <p className="text-xs text-muted-foreground italic">No choices configured</p>;

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onAnswer?.(item.title ?? item.id)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
        >
          {item.imageUrl && (
            <img src={item.imageUrl} alt={item.title ?? ''} className="w-full h-20 object-cover rounded" />
          )}
          {item.title && <span className="text-xs text-foreground font-medium">{interpolate(item.title, variables)}</span>}
        </button>
      ))}
    </div>
  );
}
