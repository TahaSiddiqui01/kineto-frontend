'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';
import type { ChatBlockProps } from '../types';

export function RatingInputChat({ block, onAnswer }: ChatBlockProps) {
  const max = (block.content.max as number | undefined) ?? 5;
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  function handleSelect(val: number) {
    setSelected(val);
    onAnswer?.(String(val));
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => handleSelect(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="text-yellow-400 transition-transform hover:scale-110 cursor-pointer"
        >
          <Star
            size={24}
            fill={n <= (hovered || selected) ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}
