'use client';
import { useState } from 'react';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

const inputClass = 'flex-1 bg-background border border-border rounded-lg text-sm text-foreground outline-none px-3 py-2 focus:border-primary transition-colors';

export function TimeInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const buttonLabel = interpolate(block.content.buttonLabel as string ?? '', variables) || 'Send';
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value) return;
    onAnswer?.(value);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input type="time" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
      <button type="submit" className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0 cursor-pointer">
        {buttonLabel}
      </button>
    </form>
  );
}
