'use client';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

interface ButtonItem { id: string; text: string; internalValue?: string; }

export function ButtonsInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const buttons = (block.content.buttons as ButtonItem[] | undefined) ?? [];
  const filled = buttons.filter((b) => b.text.trim());

  if (filled.length === 0) {
    return <p className="text-xs text-muted-foreground italic">No buttons configured</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filled.map((btn) => (
        <button
          key={btn.id}
          type="button"
          onClick={() => onAnswer?.(btn.internalValue || btn.text)}
          className="px-4 py-2 rounded-full border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
        >
          {interpolate(btn.text, variables)}
        </button>
      ))}
    </div>
  );
}
