'use client';
import { useState } from 'react';
import type { ChatBlockProps } from '../types';
import { interpolate } from '../utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function isValidUrl(raw: string): boolean {
  try {
    new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return true;
  } catch {
    return false;
  }
}

export function WebsiteInputChat({ block, variables, onAnswer }: ChatBlockProps) {
  const placeholder = interpolate(block.content.placeholder as string ?? '', variables) || 'https://…';
  const buttonLabel = interpolate(block.content.buttonLabel as string ?? '', variables) || 'Send';
  const retryMessage = (block.content.retryMessage as string | undefined) || 'Invalid URL, please try again.';
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) { setError(retryMessage); return; }
    setError(null);
    onAnswer?.(trimmed);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="url"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null); }}
          placeholder={placeholder}
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
