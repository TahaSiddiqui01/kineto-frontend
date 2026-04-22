'use client';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

interface CardItem { id: string; title?: string; description?: string; imageUrl?: string; buttonLabel?: string; }

export function CardsInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const cards = (block.content.cards as CardItem[] | undefined) ?? [];
  if (cards.length === 0) return <p className="text-xs text-muted-foreground italic">No cards configured</p>;

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {cards.map((card) => (
        <div key={card.id} className="shrink-0 w-48 rounded-xl border border-border overflow-hidden flex flex-col">
          {card.imageUrl && (
            <img src={card.imageUrl} alt={card.title ?? ''} className="w-full h-28 object-cover" />
          )}
          <div className="p-3 flex flex-col gap-2 flex-1">
            {card.title && <p className="text-sm font-semibold text-foreground">{interpolate(card.title, variables)}</p>}
            {card.description && <p className="text-xs text-muted-foreground leading-relaxed">{interpolate(card.description, variables)}</p>}
            <button
              type="button"
              onClick={() => onAnswer?.(card.title ?? card.id)}
              className="mt-auto px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              {interpolate(card.buttonLabel ?? 'Select', variables)}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
