'use client';
import { useState } from 'react';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';

const inputClass = 'flex-1 bg-background border border-border rounded-lg text-sm text-foreground outline-none px-3 py-2 placeholder:text-muted-foreground focus:border-primary transition-colors';

export function NumberInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const placeholder = interpolate(block.content.placeholder as string ?? '', variables) || 'Enter a number\u2026';
  const buttonLabel = interpolate(block.content.buttonLabel as string ?? '', variables) || 'Send';
  const min = block.content.min as string | undefined;
  const max = block.content.max as string | undefined;
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onAnswer?.(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={inputClass}
      />
      <button type="submit" className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0 cursor-pointer">
        {buttonLabel}
      </button>
    </form>
  );
}
