'use client';
import { useState } from 'react';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function NumberInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const placeholder = interpolate(block.content.placeholder as string ?? '', variables) || 'Enter a number…';
  const buttonLabel = interpolate(block.content.buttonLabel as string ?? '', variables) || 'Send';
  const min = block.content.min !== undefined && block.content.min !== '' ? Number(block.content.min) : undefined;
  const max = block.content.max !== undefined && block.content.max !== '' ? Number(block.content.max) : undefined;
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const num = Number(trimmed);
    if (isNaN(num)) { setError('Please enter a valid number.'); return; }
    if (min !== undefined && num < min) { setError(`Must be at least ${min}.`); return; }
    if (max !== undefined && num > max) { setError(`Must be at most ${max}.`); return; }
    setError(null);
    onAnswer?.(trimmed);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          placeholder={placeholder}
          min={min}
          max={max}
          autoFocus
        />
        <Button type="submit" size="sm" className="shrink-0 cursor-pointer">
          {buttonLabel}
        </Button>
      </form>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
