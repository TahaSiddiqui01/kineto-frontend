'use client';
import { useState } from 'react';
import { interpolate } from '../utils';
import type { ChatBlockProps } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function TextInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const placeholder = interpolate(block.content.placeholder as string ?? '', variables) || 'Type your answer…';
  const buttonLabel = interpolate(block.content.buttonLabel as string ?? '', variables) || 'Send';
  const [value, setValue] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onAnswer?.(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus
      />
      <Button type="submit" size="sm" className="shrink-0 cursor-pointer">
        {buttonLabel}
      </Button>
    </form>
  );
}
